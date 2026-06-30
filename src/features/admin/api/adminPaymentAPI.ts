import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import type { AdminPaymentsResponse, PaymentWithBooking, Refund } from '@/features/booking/types/payment.types';

export const adminPaymentApi = createApi({
  reducerPath: 'adminPaymentApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['AdminPayment', 'Refund'],
  endpoints: (builder) => ({
    getAllPayments: builder.query<
      AdminPaymentsResponse,
      { page?: number; limit?: number; status?: string; search?: string }
    >({
      query: ({ page = 1, limit = 10, status, search } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          ...(status ? { status } : {}),
          ...(search ? { search } : {}),
        });
        return `/payments/admin/all?${params.toString()}`;
      },
      providesTags: ['AdminPayment'],
    }),

    confirmRefund: builder.mutation<
      { message: string; data: Refund },
      { id: string; adminNote?: string }
    >({
      query: ({ id, adminNote }) => ({
        url: `/refunds/${id}/confirm`,
        method: 'PATCH',
        body: { adminNote },
      }),
      invalidatesTags: ['AdminPayment', 'Refund'],
    }),
  }),
});

export const { useGetAllPaymentsQuery, useConfirmRefundMutation } = adminPaymentApi;
