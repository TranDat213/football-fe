import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  OwnerRegisterPayload,
  OwnerRegisterResponse,
  UpdateRolePayload,
  UpdateRoleResponse,
  UserProfileResponse,
  UpdateProfileResponse,
  UpdateProfilePayload,
  CreateOwnerResponse,
  CreateOwnerPayload,
} from '../types/user.type';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    ownerRegister: builder.mutation<
      OwnerRegisterResponse,
      OwnerRegisterPayload
    >({
      query: (payload) => ({
        url: '/user/owner-register',
        method: 'POST',
        body: payload,
      }),
    }),

    updateRole: builder.mutation<UpdateRoleResponse, UpdateRolePayload>({
      query: (id, ...payload) => ({
        url: `/user/update-role/${id}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    createOwner: builder.mutation<CreateOwnerResponse, CreateOwnerPayload>({
      query: (payload) => ({
        url: '/user/create-owner',
        method: 'POST',
        body: payload,
      }),
    }),

    getProfile: builder.query<UserProfileResponse, void>({
      query: () => ({
        url: `/user/profile`,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<
      UpdateProfileResponse,
      FormData | UpdateProfilePayload
    >({
      query: (payload) => ({
        url: `/user/profile`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: ['User'],
    }),

    
  }),
});

export const {
  useOwnerRegisterMutation,
  useUpdateRoleMutation,
  useCreateOwnerMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = userApi;
