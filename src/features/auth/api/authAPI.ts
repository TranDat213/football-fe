import {
  SignUpPayload,
  SignInResponse,
  SignInPayload,
  SignUpResponse,
  RefreshResponse,
  ForgotPasswordPayload,
  OAuthPayload,
} from '@/features/auth/types/auth.types';
import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
export const authApi = createApi({
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    // Register
    register: builder.mutation<SignUpResponse, SignUpPayload>({
      query: (data) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body: data,
      }),
    }),

    //Sign-in
    signIn: builder.mutation<SignInResponse, SignInPayload>({
      query: (data) => ({
        url: '/auth/sign-in',
        method: 'POST',
        body: data,
      }),
    }),

    //Logout
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
    }),

    //Refresh token
    refreshToken: builder.mutation<RefreshResponse, void>({
      query: () => '/auth/refresh',
    }),

    //Forgot password
    forgotPassword: builder.mutation<{
      message: string;
    },ForgotPasswordPayload>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'PATCH',
        body: data,
      }),
    }),

    //oauth
    oauth: builder.mutation<SignInResponse,OAuthPayload>({
      query: (data) => ({
        url: '/auth/oauth',
        method: 'POST',
        body: data,
      }),
    }),

    //request-otp
    requestOtp: builder.mutation<{
      message: string;
    }, {
      email: string;
    }>({
      query: (data) => ({
        url: '/auth/request-otp',
        method: 'POST',
        body: data,
      }),
    }),

   //verify-otp
   verifyOtp: builder.mutation<{
    message: string;
   }, {
    email: string;
    otp: string;
   }>({ 
    query: (data) => ({
      url: '/auth/verify-otp',
      method: 'POST',
      body: data,
    }),
   }),
  }),
});
export const {
  useRegisterMutation,
  useSignInMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useOauthMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
} = authApi;
