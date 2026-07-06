import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import {
  PitchCategory,
  CreateFootballFieldCompletePayload,
} from '../types/pich.types';
import { Pitch } from '@/types/field.types';

export const pitchApi = createApi({
  reducerPath: 'pitchApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['Pitch'],
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
    // ─── Mutations ────────────────────────────────────────────
    // createField: builder.mutation<ApiResponse<Pitch>, CreateFieldPayload>({
    //   query: (body) => ({ url: '/field/create', method: 'POST', body }),
    //   invalidatesTags: ['Pitch'],
    // }),
    // createYard: builder.mutation<ApiResponse<FieldYard>, CreateYardPayload>({
    //   query: (body) => ({ url: '/subfield/', method: 'POST', body }),
    // }),
    // createFieldImage: builder.mutation<ApiResponse<{ url: string }>, FormData>({
    //   query: (formData) => ({
    //     url: '/field/image',
    //     method: 'POST',
    //     body: formData,
    //     formData: true,
    //   }),
    // }),
    // createPriceRule: builder.mutation<
    //   ApiResponse<any>,
    //   { yardId: string; body: CreatePriceRulePayload }
    // >({
    //   query: ({ yardId, body }) => ({
    //     url: `/price-rule/${yardId}`,
    //     method: 'POST',
    //     body,
    //   }),
    // }),
    // createOperatingHour: builder.mutation<
    //   ApiResponse<any>,
    //   { yardId: string; body: CreateOperatingHourPayload }
    // >({
    //   query: ({ yardId, body }) => ({
    //     url: `/operating-hours/${yardId}`,
    //     method: 'POST',
    //     body,
    //   }),
    // }),

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

  }),
});

export const {
  useGetPitchesQuery,
  useGetPitchByIdQuery,
  useGetPitchByOwnerIdQuery,
  useGetPitchCategoryQuery,
  // useCreateFieldMutation,
  // useCreateYardMutation,
  // useCreateFieldImageMutation,
  // useCreatePriceRuleMutation,
  // useCreateOperatingHourMutation,
  useUploadImageMutation,
  useCreateCompleteFieldMutation,
} = pitchApi;
