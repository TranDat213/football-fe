import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import { ApiResponse } from '@/features/booking/types/booking.types';

export interface Pitch {
  id: string;
  name: string;
  description: string;
  address: string;
  price: number;
  rating?: number;
  images: { url: string; isCover: boolean }[];
  yards: { id: string; name: string; type: string }[];
}

export const pitchApi = createApi({
  reducerPath: 'pitchApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['Pitch'],
  endpoints: (builder) => ({
    getPitches: builder.query<ApiResponse<Pitch[]>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/field',
        params,
      }),
    }),
    getPitchById: builder.query<ApiResponse<Pitch>, string>({
      query: (id) => `/field/${id}`,
      providesTags: (result, error, id) => [{ type: 'Pitch', id }],
    }),
  }),
});

export const { useGetPitchesQuery, useGetPitchByIdQuery } = pitchApi;
