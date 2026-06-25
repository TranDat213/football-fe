// src/features/booking/types/booking.types.ts
// ─── Chỉ chứa types liên quan đến feature Booking ────────────────────────────

import type { FieldYard, FootballFieldDetail, ApiResponse } from '@/types/field.types';

export type { ApiResponse, FieldYard, FootballFieldDetail };

// ─── Availability ─────────────────────────────────────────────────────────────

export interface TimeSlot {
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'DISABLED';
  price: number;
  priceLabel: string | null;
}

export interface YardAvailability {
  yardId: string;
  yardName: string;
  yardCode: string;
  type: string;
  slots: TimeSlot[];
}

export interface AvailabilityResponse {
  date: string;
  yards: YardAvailability[];
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface CreateBookingPayload {
  fieldYardId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  note?: string;
}

export interface Booking {
  id: string;
  userId: string;
  fieldYardId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED';
  note?: string;
  fieldYard: Pick<FieldYard, 'name' | 'type'> & {
    footballField: Pick<FootballFieldDetail, 'name' | 'address'>;
  };
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