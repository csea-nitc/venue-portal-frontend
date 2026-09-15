'use client';

import { useState, useCallback } from 'react';
import { getValidAccessToken, refreshAccessToken, clearAuthTokens } from '@/lib/auth';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestConfig {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: unknown;
}

interface HttpState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

function getErrorMessage(err: unknown) {
  return err instanceof Error ? err.message : 'Something went wrong!';
}

export function useFetch<T = unknown>() {
  const [state, setState] = useState<HttpState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const sendRequest = useCallback(
    async (url: string, config?: RequestConfig): Promise<T> => {
      setState({ data: null, isLoading: true, error: null });

      try {
        const { method = 'GET', headers, body } = config || {};

        // Proactively check and obtain a valid (unexpired) access token
        const token = await getValidAccessToken();

        let baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        if (baseUrl.endsWith('/')) {
          baseUrl = baseUrl.slice(0, -1);
        }
        const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
        
        let fullUrl: string;
        if (url.startsWith('http')) {
          fullUrl = url;
        } else {
          if (baseUrl.endsWith('/api') && (normalizedUrl === '/api' || normalizedUrl.startsWith('/api/') || normalizedUrl.startsWith('/api?'))) {
            const suffix = normalizedUrl.slice(4);
            fullUrl = `${baseUrl}${suffix}`;
          } else {
            fullUrl = `${baseUrl}${normalizedUrl}`;
          }
        }

        const buildOptions = (authToken: string | null): RequestInit => ({
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            ...headers,
          },
          body: body !== undefined ? JSON.stringify(body) : null,
          credentials: 'include',
        });

        let response = await fetch(fullUrl, buildOptions(token));

        // If unauthorized, attempt to refresh token and retry the request once
        if (response.status === 401 && typeof window !== 'undefined') {
          try {
            const newToken = await refreshAccessToken();
            response = await fetch(fullUrl, buildOptions(newToken));
          } catch (refreshErr) {
            clearAuthTokens();
            window.location.href = '/login?error=Session+expired.+Please+sign+in+again.';
            return Promise.reject(new Error('Session expired'));
          }
        }

        let responseData: { message?: string; error?: string; details?: unknown } | null = null;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        }

        if (!response.ok) {
          if (response.status === 401 && typeof window !== 'undefined') {
            clearAuthTokens();
            window.location.href = '/login?error=Session+expired.+Please+sign+in+again.';
            return Promise.reject(new Error('Session expired'));
          }

          let errMsg = responseData?.message || responseData?.error || `Request failed with status ${response.status}`;
          if (responseData && responseData.details && response.status < 500) {
            if (Array.isArray(responseData.details)) {
              const detailMsgs = responseData.details.map((issue: Record<string, unknown>) => {
                const pathArr = Array.isArray(issue.path) ? issue.path.filter((p) => p !== 'body') : [];
                const pathStr = pathArr.join('.');
                return `${pathStr ? pathStr + ': ' : ''}${issue.message || ''}`;
              });
              errMsg = `${errMsg} (${detailMsgs.join(', ')})`;
            } else if (typeof responseData.details === 'string') {
              errMsg = `${errMsg}: ${responseData.details}`;
            }
          }

          throw new Error(errMsg);
        }

        const data = responseData as T;
        setState({ data, isLoading: false, error: null });
        return data;
      } catch (err: unknown) {
        setState({
          data: null,
          isLoading: false,
          error: getErrorMessage(err),
        });
        throw err;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return { ...state, sendRequest, clearError };
}
