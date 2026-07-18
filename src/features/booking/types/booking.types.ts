// src/features/booking/types/booking.types.ts
// ─── Chỉ chứa types liên quan đến feature Booking ────────────────────────────

import type {
  FieldYard,
  FootballFieldDetail,
  ApiResponse,
  YardType,
} from '@/types/field.types';
import { PaginatedQuery } from '@/types/pagination.type';

export type { ApiResponse, FieldYard, FootballFieldDetail };

// ─── Availability ─────────────────────────────────────────────────────────────

export type SlotStatus = 'AVAILABLE' | 'BOOKED';
const PRICE_LABEL: Record<string, string> = {
  REGULAR: 'Giá thường',
  PEAK: 'Giá cao điểm',
  LATE_NIGHT: 'Giá đêm khuya',
};

export type PriceLabel = keyof typeof PRICE_LABEL;

export interface AvailabilitySlot {
  startTime: string;
  endTime: string;
  status: SlotStatus;
  price: number;
  priceLabel?: PriceLabel | null;
}

export interface YardAvailability {
  yardId: string;
  yardName: string;
  yardCode: string;
  type: YardType;
  slots: AvailabilitySlot[];
}

export interface AvailabilityResponse {
  date: string;
  yards: YardAvailability[];
}

// ─── Booking Status / Source / Payment ───────────────────────────────────────

export type BookingStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'CONFIRMED'
  | 'CANCELLED';
export type BookingSource = 'ONLINE' | 'OFFLINE';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED' | 'REFUND_PENDING';
export type PaymentMethod = 'CASH' | 'MOMO' | 'VNPAY' | 'BANK_TRANSFER';

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface CreateBookingPayload {
  fieldYardId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  paymentMethod: PaymentMethod;
  note?: string;
}

export interface CreateOfflineBookingPayload {
  bookingDate: string;
  startTime: string;
  endTime: string;
  customerName?: string;
  customerPhone?: string;
}
export interface Booking {
  id: string;
  userId: string;
  fieldYardId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  source: BookingSource;
  note?: string;
  expiredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  fieldYard: FieldYard & {
    footballField: FootballFieldDetail;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBookingStatusPayload {
  id: string;
  status: Booking['status'];
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export interface PaymentPayload {
  bookingId: string;
  paymentMethod: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  message?: string;
}
export interface GetBookingsParams extends PaginatedQuery {
  status?: string;
  bookingDate?: string;
  startTime?: string;
  category?: string;
  yardType?: string;
  footballFieldId?: string;
}