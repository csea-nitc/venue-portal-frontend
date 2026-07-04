'use client';

import { useState, useCallback } from 'react';

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

        const token = typeof window !== 'undefined' ? localStorage.getItem('perms_token') : null;

        const fetchOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
          },
          body: body !== undefined ? JSON.stringify(body) : null,
        };

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;

        const response = await fetch(fullUrl, fetchOptions);

        let responseData: { message?: string; error?: string } | null = null;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        }

        if (!response.ok) {
          if (response.status === 401 && typeof window !== 'undefined') {
            // Token expired or invalid — redirect to login without wiping
            // localStorage so the user's details are still present if they
            // land back on the page before the redirect completes.
            window.location.href = '/login?error=Session+expired.+Please+sign+in+again.';
            return Promise.reject(new Error('Session expired'));
          }

          throw new Error(
            responseData?.message ||
            responseData?.error ||
            `Request failed with status ${response.status}`
          );
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
