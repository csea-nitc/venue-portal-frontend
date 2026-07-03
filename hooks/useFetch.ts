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
<<<<<<< HEAD

        const token = typeof window !== 'undefined' ? localStorage.getItem('perms_token') : null;

=======
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
        const fullUrl = url.startsWith('http') ? url : `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;

        const token = typeof window !== 'undefined' ? localStorage.getItem('perms_token') : null;
        
>>>>>>> a279c237d27a365992423eb166b681f472125fab
        const fetchOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
<<<<<<< HEAD
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
=======
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
>>>>>>> a279c237d27a365992423eb166b681f472125fab
            ...headers,
          },
          body: body !== undefined ? JSON.stringify(body) : null,
        };

<<<<<<< HEAD
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
        const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;

        const response = await fetch(fullUrl, fetchOptions);

        let responseData: { message?: string; error?: string } | null = null;
=======
        const response = await fetch(fullUrl, fetchOptions);
        
        // Handle empty responses
        let responseData = null;
>>>>>>> a279c237d27a365992423eb166b681f472125fab
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
        }

        if (response.status === 401 && typeof window !== 'undefined') {
          // Token expired or invalid
          localStorage.removeItem('perms_token');
          localStorage.removeItem('perms_logged_in');
          window.location.href = '/login?error=Session expired. Please login again.';
          return;
        }

        if (!response.ok) {
<<<<<<< HEAD
          if (response.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('perms_logged_in');
            localStorage.removeItem('perms_token');
            localStorage.removeItem('perms_user_name');
            localStorage.removeItem('perms_user_email');
            localStorage.removeItem('perms_user_role');
          }

          throw new Error(
            responseData?.message ||
            responseData?.error ||
            `Request failed with status ${response.status}`
=======
          let errorMessage = responseData?.message || responseData?.error;
          if (responseData?.details && Array.isArray(responseData.details)) {
            const detailsStr = responseData.details
              .map((d: any) => {
                const field = d.path ? d.path.filter((p: any) => p !== 'body' && p !== 'params' && p !== 'query').join('.') : '';
                return `${field ? field + ': ' : ''}${d.message}`;
              })
              .join(', ');
            errorMessage = errorMessage ? `${errorMessage} ${detailsStr}` : detailsStr;
          }
          throw new Error(
            errorMessage || `Request failed with status ${response.status}`
>>>>>>> a279c237d27a365992423eb166b681f472125fab
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
