// src/features/booking/types/payment.types.ts
// ─── Types for Payment, Refund, and VNPay Return ─────────────────────────────

export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'REFUND_PENDING';
export type PaymentMethod = 'CASH' | 'MOMO' | 'VNPAY' | 'BANK_TRANSFER';
export type RefundStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface Payment {
  id: string;
  bookingId: string;
  transactionCode: string | null;
  paymentMethod: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  paidAt: string | null;
  gatewayResponse: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Refund {
  id: string;
  bookingId: string;
  paymentId: string | null;
  amount: number;
  reason: string | null;
  status: RefundStatus;
  processedAt: string | null;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VNPayReturnResult {
  success: boolean;
  responseCode: string;
  bookingId: string;
  amount: number;
  message: string;
}

export interface AdminPaymentFilter {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  search?: string;
}

export interface AdminPaymentsResponse {
  message: string;
  data: PaymentWithBooking[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaymentWithBooking extends Payment {
  booking: {
    id: string;
    totalPrice: number;
    status: string;
    paymentStatus: PaymentStatus;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
    fieldYard: {
      footballField: {
        name: string;
      };
    };
    refund: Refund | null;
  };
}
