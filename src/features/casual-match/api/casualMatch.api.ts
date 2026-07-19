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
  JoinCasualMatchResult,
  MatchParticipantsResponse,
  ParticipationListParams,
  ParticipationListResponse,
  UpdateCasualMatchPayload,
} from '../types/casual-match.types';

export const casualMatchApi = createApi({
  reducerPath: 'casualMatchApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['CasualMatch', 'Participation'],
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
    // Participation history for the current user
    getMyParticipations: builder.query<ParticipationListResponse, ParticipationListParams | void>({
      query: (params) => ({ url: '/casual-matches/participations', method: 'GET', params: params ?? undefined }),
      providesTags: [{ type: 'Participation', id: 'LIST' }],
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
    // Join now returns paymentUrl directly — single call, no separate createPayment needed
    joinCasualMatch: builder.mutation<{ message: string; data: JoinCasualMatchResult }, JoinCasualMatchPayload>({
      query: ({ id, ...body }) => ({ url: `/casual-matches/${id}/join`, method: 'POST', body }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'CasualMatch', id },
        { type: 'Participation', id: 'LIST' },
      ],
    }),
    // Kept for backward compat (e.g. retry payment for UNPAID participant)
    createCasualMatchPayment: builder.mutation<CasualMatchPaymentResponse, string>({
      query: (id) => ({ url: `/casual-matches/${id}/payment`, method: 'POST', body: { paymentMethod: 'VNPAY' } }),
    }),
    cancelParticipation: builder.mutation<{ message: string; data?: unknown }, { id: string; reason?: string }>({
      query: ({ id, reason }) => ({ url: `/casual-matches/${id}/cancel`, method: 'POST', body: { reason } }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'CasualMatch', id },
        { type: 'Participation', id: 'LIST' },
      ],
    }),
    updateCasualMatchStatus: builder.mutation<CasualMatchDetailResponse, Pick<CasualMatch, 'id' | 'status'>>({
      query: ({ id, status }) => ({ url: `/casual-matches/${id}/status`, method: 'PATCH', body: { status } }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'CasualMatch', id },
        { type: 'CasualMatch', id: 'LIST' },
        { type: 'CasualMatch', id: 'OWNER' },
      ],
    }),
    getMatchParticipants: builder.query<MatchParticipantsResponse, string>({
      query: (id) => ({ url: `/casual-matches/${id}/participants`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'CasualMatch', id: `${id}-participants` }],
    }),
  }),
});

export const {
  useGetCasualMatchesQuery,
  useGetCasualMatchByIdQuery,
  useGetOwnerCasualMatchesQuery,
  useGetHostCasualMatchesQuery,
  useGetMyParticipationsQuery,
  useCreateCasualMatchMutation,
  useUpdateCasualMatchMutation,
  useDeleteCasualMatchMutation,
  useJoinCasualMatchMutation,
  useCreateCasualMatchPaymentMutation,
  useCancelParticipationMutation,
  useUpdateCasualMatchStatusMutation,
  useGetMatchParticipantsQuery,
} = casualMatchApi;
