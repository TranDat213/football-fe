import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import { 
  ApiResponse,
  AvailabilityResponse, 
  Booking, 
  CreateBookingPayload, 
  PaymentPayload, 
  PaymentResponse 
} from '../types/booking.types';

export const bookingApi = createApi({
  reducerPath: 'bookingApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['Booking', 'Availability'],
  endpoints: (builder) => ({
    getAvailability: builder.query<ApiResponse<AvailabilityResponse>, { fieldId: string; date: string }>({
      query: ({ fieldId, date }) => `/field/${fieldId}/availability?date=${date}`,
      providesTags: ['Availability'],
    }),
    
    createBooking: builder.mutation<ApiResponse<Booking>, CreateBookingPayload>({
      query: (data) => ({
        url: '/bookings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Booking', 'Availability'],
    }),
    
    getBookingById: builder.query<ApiResponse<Booking>, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),
    
    createPayment: builder.mutation<PaymentResponse, PaymentPayload>({
      query: (data) => ({
        url: '/payments/create',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAvailabilityQuery,
  useCreateBookingMutation,
  useGetBookingByIdQuery,
  useCreatePaymentMutation,
} = bookingApi;
