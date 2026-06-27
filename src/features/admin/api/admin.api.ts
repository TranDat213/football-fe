import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  AccountStatisticsResponse,
  CategoryDetailResponse,
  CategoryListResponse,
  CreateCategoryPayload,
  CreateCategoryResponse,
  CreateOwnerPayload,
  DeleteCategoryPayload,
  DeleteCategoryResponse,
  FieldStaticsResponse,
  OwnerRegisterPendingCountResponse,
  OwnerRegisterPendingResponse,
  PendingFieldsResponse,
  UpdateCategoryPayload,
  UpdateCategoryResponse,
  UpdateFieldStatusPayload,
  UpdateFieldStatusResponse,
  UpdateOwnerRegisterStatusPayload,
  UpdateUserStatusPayload,
  UserAdmin,
  UserListResponse,
} from '../type/admin.type';
import { ListParams } from '@/types/param.type';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    getFieldStatics: builder.query<FieldStaticsResponse, void>({
      query: () => ({
        url: '/field/statics',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),

    getPendingFields: builder.query<PendingFieldsResponse, ListParams>({
      query: ({ page, limit }) => ({
        url: '/field/pending',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Admin'],
    }),

    getAccountStatistics: builder.query<AccountStatisticsResponse, void>({
      query: () => ({
        url: '/user/statistics',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),

    getOwnerRegisterPendingCount: builder.query<
      OwnerRegisterPendingCountResponse,
      void
    >({
      query: () => ({
        url: '/user/owner-register-pending-count',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),

    updateFieldStatus: builder.mutation<
      UpdateFieldStatusResponse,
      UpdateFieldStatusPayload
    >({
      query: ({ id, status }) => ({
        url: `/field/status/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Admin'],
    }),

    //user api
    updateUserStatus: builder.mutation<
      UpdateFieldStatusResponse,
      UpdateUserStatusPayload
    >({
      query: ({ id, status }) => ({
        url: `/user/update-status/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Admin'],
    }),
    getAllUsers: builder.query<UserListResponse, ListParams>({
      query: ({ page, limit }) => ({
        url: '/user/all-users',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Admin'],
    }),
    getAllOwners: builder.query<UserListResponse, ListParams>({
      query: ({ page, limit }) => ({
        url: '/user/all-owners',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Admin'],
    }),
    getAllAccounts: builder.query<UserListResponse, ListParams>({
      query: ({ page, limit }) => ({
        url: '/user/all-accounts',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Admin'],
    }),

    getOwnerRegisterPending: builder.query<
      OwnerRegisterPendingResponse,
      ListParams
    >({
      query: ({ page, limit }) => ({
        url: '/user/owner-register-pending',
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: ['Admin'],
    }),

    countOwnerRegisterPending: builder.query<
      OwnerRegisterPendingCountResponse,
      void
    >({
      query: () => ({
        url: '/user/owner-register-pending-count',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),

    updateOwnerRegisterStatus: builder.mutation<
      { message: string },
      UpdateOwnerRegisterStatusPayload
    >({
      query: ({ id, status }) => ({
        url: `/user/owner-register-status/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Admin'],
    }),

    getOwnerRegisterById: builder.query<OwnerRegisterPendingResponse, string>({
      query: (id) => ({
        url: `/user/owner-register/${id}`,
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),

    createOwner: builder.mutation<{ message: string }, CreateOwnerPayload>({
      query: (body) => ({
        url: '/user/create-owner',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Admin'],
    }),

    //category
    createCategory: builder.mutation<
      CreateCategoryResponse,
      CreateCategoryPayload
    >({
      query: (body) => ({
        url: '/category',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Admin'],
    }),

    updateCategory: builder.mutation<
      UpdateCategoryResponse,
      UpdateCategoryPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/category/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Admin'],
    }),

    deleteCategory: builder.mutation<
      DeleteCategoryResponse,
      DeleteCategoryPayload
    >({
      query: ({ id }) => ({
        url: `/category/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),

    getAllCategories: builder.query<CategoryListResponse, void>({
      query: () => ({
        url: '/category',
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),

    getCategoryById: builder.query<CategoryDetailResponse, string>({
      query: (id) => ({
        url: `/category/${id}`,
        method: 'GET',
      }),
      providesTags: ['Admin'],
    }),
  }),
});

export const {
  useGetFieldStaticsQuery,
  useGetPendingFieldsQuery,
  useGetAccountStatisticsQuery,
  useGetOwnerRegisterPendingCountQuery,
  useUpdateFieldStatusMutation,
  useUpdateUserStatusMutation,
  useGetAllUsersQuery,
  useGetAllOwnersQuery,
  useGetAllAccountsQuery,

  //owner register
  useGetOwnerRegisterPendingQuery,
  useCountOwnerRegisterPendingQuery,
  useUpdateOwnerRegisterStatusMutation,
  useGetOwnerRegisterByIdQuery,
  useCreateOwnerMutation,

  //category
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useGetCategoryByIdQuery,
} = adminApi;
