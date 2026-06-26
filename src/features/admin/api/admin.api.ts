import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import { createApi } from '@reduxjs/toolkit/query/react';
import {
  AccountStatisticsResponse,
  FieldStaticsResponse,
  OwnerRegisterPendingCountResponse,
  PendingFieldsResponse,
  UpdateFieldStatusPayload,
  UpdateFieldStatusResponse,
} from '../type/admin.type';

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

    getPendingFields: builder.query<PendingFieldsResponse, void>({
      query: () => ({
        url: '/field/pending',
        method: 'GET',
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
  }),
});

export const {
  useGetFieldStaticsQuery,
  useGetPendingFieldsQuery,
  useGetAccountStatisticsQuery,
  useGetOwnerRegisterPendingCountQuery,
  useUpdateFieldStatusMutation, 
} = adminApi;
