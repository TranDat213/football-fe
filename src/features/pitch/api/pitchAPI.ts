import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import {
  PitchCategory,
  CreateFootballFieldCompletePayload,
  FootballFieldUpdateRequest,
  CreateFootballFieldUpdateRequestPayload,
  FootballFieldUpdateRequestStatus,
  GetPitchesParams,
  GetPitchByOwnerParams,
  GetFieldPendingParams,
} from '../types/pich.types';
import { Pitch } from '@/types/field.types';
import { PaginatedApiResponse } from '@/types/pagination.type';

export const pitchApi = createApi({
  reducerPath: 'pitchApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['Pitch', 'PitchUpdateRequest'],
  endpoints: (builder) => ({
    // ─── Queries ───────────────────────────────────────────────
    getPitches: builder.query<PaginatedApiResponse<Pitch>, GetPitchesParams>({
      query: (params) => ({ url: '/field/active', params }),
      providesTags: ['Pitch'],
    }),
    getPitchById: builder.query<ApiResponse<Pitch>, string>({
      query: (id) => `/field/find/${id}`,
      providesTags: (_, __, id) => [{ type: 'Pitch', id }],
    }),
    getPitchByOwnerId: builder.query<
      PaginatedApiResponse<Pitch>,
      GetPitchByOwnerParams | void
    >({
      query: (params) => ({
        url: '/field/owner',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['Pitch'],
    }),

    getFieldPending: builder.query<
      PaginatedApiResponse<Pitch>,
      GetFieldPendingParams | void
    >({
      query: (params) => ({
        url: '/field/pending',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['Pitch'],
    }),

    getPitchCategory: builder.query<ApiResponse<PitchCategory[]>, void>({
      query: () => ({
        url: '/category/',
        method: 'GET',
      }),
    }),

    // Atomic creation
    uploadImage: builder.mutation<
      ApiResponse<{ url: string; publicId: string }>,
      FormData
    >({
      query: (formData) => ({
        url: '/field/upload',
        method: 'POST',
        body: formData,
        formData: true,
      }),
    }),

    createCompleteField: builder.mutation<
      ApiResponse<Pitch>,
      CreateFootballFieldCompletePayload
    >({
      query: (body) => ({
        url: '/field/create-complete',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Pitch'],
    }),

    softDeleteField: builder.mutation<{message:string},{id: string | null}>({
      query: ({id}) => ({
        url: `/field/delete-complete/${id}`,
        method: `PATCH`,
      }),
      invalidatesTags: ['Pitch'],
    }),

    //fieldUpdateRequest
    createFieldUpdateRequest: builder.mutation<
      ApiResponse<FootballFieldUpdateRequest>,
      { id: string; body: CreateFootballFieldUpdateRequestPayload }
    >({
      query: ({ id, body }) => ({
        url: `/field-update/${id}/update-request`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Pitch', 'PitchUpdateRequest'],
    }),

    getFieldUpdateRequestStatus: builder.query<
      ApiResponse<FootballFieldUpdateRequest[]>,
      { status?: FootballFieldUpdateRequestStatus; page: number; limit: number }
    >({
      query: ({ status, page, limit }) => ({
        url: `/field-update/admin/football-field-update-request`,
        params: { status, page, limit },
      }),
      providesTags: ['PitchUpdateRequest'],
    }),

    aproveFieldUpdateRequest: builder.mutation<
      ApiResponse<FootballFieldUpdateRequest>,
      {id: string}
    >({
      query: ({ id }) => ({
        url: `/field-update/admin/football-field-update-request/${id}/approve`,
        method: `PATCH`,
      }),
      invalidatesTags: ['Pitch', 'PitchUpdateRequest'],
    }),

    rejectFieldUpdateRequest: builder.mutation<
      ApiResponse<FootballFieldUpdateRequest>,
      { id: string; body: { reason: string } }
    >({
      query: ({ id, body }) => ({
        url: `/field-update/admin/football-field-update-request/${id}/reject`,
        method: `PATCH`,
        body,
      }),
      invalidatesTags: ['Pitch', 'PitchUpdateRequest'],
    }),

    softDeleteFieldUpdateRequest: builder.mutation<{message:string},{id: string}>({
      query: ({id}) => ({
        url: `/field-update/delete/${id}`,
        method: `PATCH`,
      }),
      invalidatesTags: ['PitchUpdateRequest'],
    }),

    getOwnerFieldUpdateRequestStatus: builder.query<
      ApiResponse<FootballFieldUpdateRequest[]>,
      { ownerId: string; status?: FootballFieldUpdateRequestStatus; page: number; limit: number }
    >({
      query: ({ ownerId, status, page, limit }) => ({
        url: `/field-update/${ownerId}/football-field-update-request`,
        params: { status, page, limit },
      }),
      providesTags: ['PitchUpdateRequest'],
    }),
  }),
});

export const {
  useGetPitchesQuery,
  useGetPitchByIdQuery,
  useGetPitchByOwnerIdQuery,
  useGetFieldPendingQuery,
  useGetPitchCategoryQuery,
  useUploadImageMutation,
  useCreateCompleteFieldMutation,
  useSoftDeleteFieldMutation,
  //update field
  useCreateFieldUpdateRequestMutation,
  useGetFieldUpdateRequestStatusQuery,
  useAproveFieldUpdateRequestMutation,
  useRejectFieldUpdateRequestMutation,
  useSoftDeleteFieldUpdateRequestMutation,
  useGetOwnerFieldUpdateRequestStatusQuery,
} = pitchApi;
