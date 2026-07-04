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
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
        const fullUrl = url.startsWith('http') ? url : `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;

        const token = typeof window !== 'undefined' ? localStorage.getItem('perms_token') : null;
        
        const fetchOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: body !== undefined ? JSON.stringify(body) : null,
        };

        const response = await fetch(url, fetchOptions);
        
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
          throw new Error(
            responseData?.message || 
            responseData?.error || 
            `Request failed with status ${response.status}`
          );
        }

        setState({ data: responseData, isLoading: false, error: null });
        return responseData as T;
      } catch (err: any) {
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
