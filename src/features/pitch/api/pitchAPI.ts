import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import {
  PitchCategory,
  CreateFootballFieldCompletePayload,
  UpdateFootballFieldCompletePayload,
  FootballFieldUpdateRequest,
  CreateFootballFieldUpdateRequestPayload,
  UpdateFootballFieldUpdateRequestPayload,
  FootballFieldUpdateRequestStatus,
} from '../types/pich.types';
import { Pitch } from '@/types/field.types';

export const pitchApi = createApi({
  reducerPath: 'pitchApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['Pitch', 'PitchUpdateRequest'],
  endpoints: (builder) => ({
    // ─── Queries ───────────────────────────────────────────────
    getPitches: builder.query<
      ApiResponse<Pitch[]>,
      { page?: number; limit?: number }
    >({
      query: (params) => ({ url: '/field/active', params }),
    }),
    getPitchById: builder.query<ApiResponse<Pitch>, string>({
      query: (id) => `/field/find/${id}`,
      providesTags: (_, __, id) => [{ type: 'Pitch', id }],
    }),
    getPitchByOwnerId: builder.query<
      ApiResponse<Pitch[]>,
      { page?: number; limit?: number }
    >({
      query: () => ({
        url: '/field/owner',
        method: 'GET',
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
    }),
  }),
});

export const {
  useGetPitchesQuery,
  useGetPitchByIdQuery,
  useGetPitchByOwnerIdQuery,
  useGetPitchCategoryQuery,
  useUploadImageMutation,
  useCreateCompleteFieldMutation,
  //update field
  useCreateFieldUpdateRequestMutation,
  useGetFieldUpdateRequestStatusQuery,
  useAproveFieldUpdateRequestMutation,
  useRejectFieldUpdateRequestMutation,
  useSoftDeleteFieldUpdateRequestMutation,
} = pitchApi;
