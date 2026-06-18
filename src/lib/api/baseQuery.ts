import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import Cookies from 'js-cookie';
import { RefreshResponse } from '@/features/auth/types/auth.types';

let isRefreshing = false;
let failedQueue: {
  resolve: (value: unknown) => void;
  reject: (reason?: Error) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
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
    prepareHeaders: (headers) => {
      const token = Cookies.get('access_token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  let result = await baseQuery(args, api, extraOptions);

  // Handle 401 - Token expired
  if (result.error && result.error.status === 401) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => baseQuery(args, api, extraOptions))
        .catch((err) => ({ error: err }));
    }

    isRefreshing = true;
    try {
      const refreshToken = Cookies.get('refresh_token');
      // Attempt to refresh token
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions,
      );

      const accessToken = (refreshResult.data as RefreshResponse)?.data
        ?.accessToken;

      if (accessToken) {
        // Save new token
        Cookies.set('access_token', accessToken, { path: '/' });
        processQueue(null, accessToken);
        result = await baseQuery(args, api, extraOptions);
      } else {
        Cookies.remove('access_token', { path: '/' });
        Cookies.remove('refresh_token', { path: '/' });
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
