import {
  SignUpPayload,
  SignInResponse,
  UserProfile,
  SignInPayload,
  SignUpResponse,
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

    //Get current user
    getProfile: builder.query<UserProfile, void>({
      query: () => '/auth/me',
    }),

    //Logout
    logout: builder.mutation<{ message: string }, void>({
      query: () => '/auth/logout',
    }),
  }),
});
export const {
  useRegisterMutation,
  useSignInMutation,
  useGetProfileQuery,
  useLogoutMutation,
} = authApi;
