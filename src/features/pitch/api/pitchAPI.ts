import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import {
  PitchCategory,
  CreateFootballFieldCompletePayload,
  UpdateFootballFieldCompletePayload,
  FootballFieldUpdateRequest,
  CreateFootballFieldUpdateRequestPayload,
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
    getPitchByOwnerId: builder.query<ApiResponse<Pitch[]>, void>({
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
        url: `/football-fields/${id}/update-request`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Pitch', 'PitchUpdateRequest'],
    }),

    getFieldUpdateRequestStatus: builder.query<
      ApiResponse<FootballFieldUpdateRequest | null>,
      string // fieldId
    >({
      query: (fieldId) => `/football-fields/${fieldId}/update-request`,
      providesTags: ['PitchUpdateRequest'],
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
  useCreateFieldUpdateRequestMutation,
  useGetFieldUpdateRequestStatusQuery,
} = pitchApi;
