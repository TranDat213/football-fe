export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'DISABLED';
}

export interface AvailabilityResponse {
  date: string;
  slots: TimeSlot[];
}

export interface CreateBookingPayload {
  fieldYardId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  note?: string;
  paymentMethod: 'CASH' | 'MOMO' | 'VNPAY' | 'BANK_TRANSFER';
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
  fieldYard: {
    name: string;
    footballField: {
      name: string;
      address: string;
    };
  };
}

export interface PaymentPayload {
  bookingId: string;
  paymentMethod: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
  message?: string;
}
