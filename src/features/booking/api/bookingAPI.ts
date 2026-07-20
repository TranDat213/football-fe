import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import {
  ApiResponse,
  AvailabilityResponse,
  Booking,
  CreateBookingPayload,
  GetBookingsParams,
  PaymentPayload,
  PaymentResponse,
  UpdateBookingStatusPayload,
} from '../types/booking.types';
import type {
  Payment,
  Refund,
  VNPayReturnResult,
} from '../types/payment.types';
import { PaginatedApiResponse } from '@/types/pagination.type';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['Booking', 'Availability'],
  endpoints: (builder) => ({
    getAvailability: builder.query<
      ApiResponse<AvailabilityResponse>,
      { fieldId: string; date: string }
    >({
      query: ({ fieldId, date }) =>
        `/field/${fieldId}/availability?date=${date}`,
      providesTags: ['Availability'],
    }),

    createBooking: builder.mutation<ApiResponse<Booking>, CreateBookingPayload>(
      {
        query: (data) => ({
          url: '/bookings',
          method: 'POST',
          body: data,
        }),
        invalidatesTags: ['Booking', 'Availability'],
      },
    ),

    getBookingById: builder.query<ApiResponse<Booking>, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),

    getMyBookings: builder.query<
      PaginatedApiResponse<Booking>,
      GetBookingsParams | void
    >({
      query: (params) => ({
        url: '/bookings/my-bookings',
        params: params ?? undefined,
      }),
      providesTags: ['Booking'],
    }),

    getOwnerBookings: builder.query<
      PaginatedApiResponse<Booking>,
      GetBookingsParams | void
    >({
      query: (params) => ({
        url: '/bookings/owner/bookings',
        params: params ?? undefined,
      }),
      providesTags: ['Booking'],
    }),

    updateBookingStatus: builder.mutation<
      ApiResponse<Booking>,
      UpdateBookingStatusPayload
    >({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Booking'],
    }),

    createPayment: builder.mutation<PaymentResponse, PaymentPayload>({
      query: (data) => ({
        url: '/payments/create',
        method: 'POST',
        body: data,
      }),
    }),

    verifyVNPayReturn: builder.query<ApiResponse<VNPayReturnResult>, string>({
      query: (queryString) => `/payments/vnpay/return?${queryString}`,
    }),

    getPaymentByBookingId: builder.query<ApiResponse<Payment>, string>({
      query: (bookingId) => `/payments/${bookingId}`,
      providesTags: (result, error, bookingId) => [
        { type: 'Booking', id: bookingId },
      ],
    }),

    cancelBooking: builder.mutation<
      { success: boolean; message: string },
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/bookings/${id}/cancel`,
        method: 'POST',
        body: { reason },
      }),
      invalidatesTags: ['Booking'],
    }),

    getRefundByBookingId: builder.query<ApiResponse<Refund>, string>({
      query: (bookingId) => `/refunds/${bookingId}`,
      providesTags: (result, error, bookingId) => [
        { type: 'Booking', id: bookingId },
      ],
    }),

    getTotalBookingByOwner: builder.query<ApiResponse<number>, void>({
      query: () => '/bookings/owner/total',
      providesTags: ['Booking'],
    }),

    getBookingByDate: builder.query<
      ApiResponse<Booking[]>,
      { date: Date; page: number; limit: number }
    >({
      query: ({ date, page, limit }) => ({
        url: `/bookings/booking-date`,
        params: { date: date.toISOString(), page, limit },
      }),
      providesTags: ['Booking'],
    }),

    countBookingByDate: builder.query<
      ApiResponse<Booking[]>,
      { date: Date; page: number; limit: number }
    >({
      query: ({ date, page, limit }) => ({
        url: `/bookings/booking-date-count`,
        params: { date: date.toISOString(), page, limit },
      }),
      providesTags: ['Booking'],
    }),

    createOfflineBooking: builder.mutation<
      ApiResponse<Booking>,
      CreateBookingPayload
    >({
      query: ({ fieldYardId, ...data }) => ({
        url: `/bookings/yards/${fieldYardId}/offline`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Booking'],
    }),

    getBookingsForCreateCasual: builder.query<ApiResponse<any[]>, void>({
      query: () => '/bookings/for-create-casual',
      providesTags: ['Booking'],
    }),

    ownerCancelBooking: builder.mutation<
      { success: boolean; message: string },
      { id: string; reason: string }
    >({
      query: ({ id, reason }) => ({
        url: `/bookings/owner/${id}/cancel`,
        method: 'PATCH',
        body: { reason },
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useGetAvailabilityQuery,
  useCreateBookingMutation,
  useGetBookingByIdQuery,
  useGetMyBookingsQuery,
  useGetOwnerBookingsQuery,
  useUpdateBookingStatusMutation,
  useCreatePaymentMutation,
  useVerifyVNPayReturnQuery,
  useGetPaymentByBookingIdQuery,
  useCancelBookingMutation,
  useGetRefundByBookingIdQuery,
  useGetTotalBookingByOwnerQuery,
  useGetBookingByDateQuery,
  useCountBookingByDateQuery,
  useCreateOfflineBookingMutation,
  useGetBookingsForCreateCasualQuery,
  useOwnerCancelBookingMutation,
} = bookingApi;
