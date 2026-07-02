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
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
        const fullUrl = url.startsWith('http') ? url : `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;

        const token = typeof window !== 'undefined' ? localStorage.getItem('perms_token') : null;
        
        const fetchOptions: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...headers,
          },
          body: body ? JSON.stringify(body) : null,
        };

        const response = await fetch(fullUrl, fetchOptions);
        
        // Handle empty responses
        let responseData = null;
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
