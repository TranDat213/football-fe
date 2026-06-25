import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import { ApiResponse, FieldYard } from '@/features/booking/types/booking.types';

export interface Pitch {
  id: string;
  name: string;
  description: string;
  address: string;
  rating?: number;
  reviews?: any[]; // Added reviews
  images: { url: string; isCover: boolean }[];
  yards: FieldYard[]; // Will be defined in booking.types.ts
}

export const pitchApi = createApi({
  reducerPath: 'pitchApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['Pitch'],
  endpoints: (builder) => ({
    getPitches: builder.query<ApiResponse<Pitch[]>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/field/active',
        params,
      }),
    }),
    getPitchById: builder.query<ApiResponse<Pitch>, string>({
      query: (id) => `/field/find/${id}`,
      providesTags: (result, error, id) => [{ type: 'Pitch', id }],
    }),
    getPitchByOwnerId: builder.query<ApiResponse<Pitch[]>, string>({
      query: (ownerId) => `/field/owner/${ownerId}`,
      providesTags: (result, error, ownerId) => [{ type: 'Pitch', ownerId }],
    }),
  }),
});

export const { useGetPitchesQuery, useGetPitchByIdQuery, useGetPitchByOwnerIdQuery } = pitchApi;
