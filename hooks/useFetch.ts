import { useState, useCallback } from 'react';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestConfig {
  method?: HttpMethod;
  headers?: HeadersInit;
  body?: any;
}

interface HttpState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useFetch<T = any>() {
  const [state, setState] = useState<HttpState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const sendRequest = useCallback(
    async (url: string, config?: RequestConfig) => {
      setState({ data: null, isLoading: true, error: null });

      try {
        const { method = 'GET', headers, body } = config || {};
        
        const fetchOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: body ? JSON.stringify(body) : null,
        };

        const response = await fetch(url, fetchOptions);
        
        // Handle empty responses
        let responseData = null;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
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
          error: err.message || 'Something went wrong!',
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
