import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: Error) => void;
}[] = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(null);
    }
  });
  failedQueue = [];
};

export const customBaseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include',
  });

  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 - Token expired
  if (result.error && result.error.status === 401) {
    // If the error was from the refresh attempt itself, bail
    if (typeof args !== 'string' && args.url === '/auth/refresh') {
      return result;
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => baseQuery(args, api, extraOptions))
        .catch((err) => ({ error: err }));
    }

    isRefreshing = true;
    try {
      // Attempt to refresh token (browser sends HttpOnly refreshToken cookie)
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        // Refresh success
        processQueue(null);
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed
        api.dispatch({ type: 'auth/logout' });
        processQueue(new Error('Authentication failed'));
        
        if (
          typeof window !== 'undefined' &&
          window.location.pathname !== '/login'
        ) {
          window.location.href = '/login';
        }
      }
    } catch (error) {
      processQueue(error instanceof Error ? error : new Error('Unknown error'));
    } finally {
      isRefreshing = false;
    }
  }
  return result;
};
