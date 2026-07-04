import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import type {
  CasualMatch,
  CasualMatchDetailResponse,
  CasualMatchListParams,
  CasualMatchListResponse,
  CasualMatchPaymentResponse,
  CreateCasualMatchPayload,
  JoinCasualMatchPayload,
  UpdateCasualMatchPayload,
} from '../types/casual-match.types';

export const casualMatchApi = createApi({
  reducerPath: 'casualMatchApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['CasualMatch'],
  endpoints: (builder) => ({
    getCasualMatches: builder.query<CasualMatchListResponse, CasualMatchListParams | void>({
      query: (params) => ({ url: '/casual-matches', method: 'GET', params: params??undefined }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((match) => ({ type: 'CasualMatch' as const, id: match.id })),
              { type: 'CasualMatch', id: 'LIST' },
            ]
          : [{ type: 'CasualMatch', id: 'LIST' }],
    }),
    getCasualMatchById: builder.query<CasualMatchDetailResponse, string>({
      query: (id) => ({ url: `/casual-matches/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'CasualMatch', id }],
    }),
    getOwnerCasualMatches: builder.query<CasualMatchListResponse, CasualMatchListParams | void>({
      query: (params) => ({ url: '/casual-matches/owner', method: 'GET', params:params??undefined }),
      providesTags: [{ type: 'CasualMatch', id: 'OWNER' }],
    }),
    getHostCasualMatches: builder.query<CasualMatchListResponse,CasualMatchListParams | void>({
      query: (params) => ({ url: '/casual-matches/host', method: 'GET', params:params??undefined }),
      providesTags: [{ type: 'CasualMatch', id: 'USER' }],
    }),

    createCasualMatch: builder.mutation<CasualMatchDetailResponse, CreateCasualMatchPayload>({
      query: (body) => ({ url: '/casual-matches', method: 'POST', body }),
      invalidatesTags: [
        { type: 'CasualMatch', id: 'LIST' },
        { type: 'CasualMatch', id: 'USER' },
      ],
    }),
    updateCasualMatch: builder.mutation<CasualMatchDetailResponse, UpdateCasualMatchPayload>({
      query: ({ id, ...body }) => ({ url: `/casual-matches/${id}`, method: 'PATCH', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'CasualMatch', id },
        { type: 'CasualMatch', id: 'LIST' },
        { type: 'CasualMatch', id: 'USER' },
      ],
    }),
    deleteCasualMatch: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/casual-matches/${id}`, method: 'DELETE' }),
      invalidatesTags: [
        { type: 'CasualMatch', id: 'LIST' },
        { type: 'CasualMatch', id: 'USER' },
      ],
    }),
    joinCasualMatch: builder.mutation<{ message: string; data: unknown }, JoinCasualMatchPayload>({
      query: ({ id, ...body }) => ({ url: `/casual-matches/${id}/join`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'CasualMatch', id }],
    }),
    createCasualMatchPayment: builder.mutation<CasualMatchPaymentResponse, string>({
      query: (id) => ({ url: `/casual-matches/${id}/payment`, method: 'POST', body: { paymentMethod: 'VNPAY' } }),
    }),
    cancelParticipation: builder.mutation<{ message: string; data?: unknown }, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({ url: `/casual-matches/${id}/cancel`, method: 'POST', body: { reason } }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'CasualMatch', id }],
    }),
    updateCasualMatchStatus: builder.mutation<CasualMatchDetailResponse, Pick<CasualMatch, 'id' | 'status'>>({
      query: ({ id, status }) => ({ url: `/casual-matches/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'CasualMatch', id },
        { type: 'CasualMatch', id: 'LIST' },
        { type: 'CasualMatch', id: 'OWNER' },
      ],
    }),
  }),
});

export const {
  useGetCasualMatchesQuery,
  useGetCasualMatchByIdQuery,
  useGetOwnerCasualMatchesQuery,
  useGetHostCasualMatchesQuery,
  useCreateCasualMatchMutation,
  useUpdateCasualMatchMutation,
  useDeleteCasualMatchMutation,
  useJoinCasualMatchMutation,
  useCreateCasualMatchPaymentMutation,
  useCancelParticipationMutation,
  useUpdateCasualMatchStatusMutation,
} = casualMatchApi;
