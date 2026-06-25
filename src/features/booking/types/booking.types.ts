export interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface FieldOperatingHour {
  id: string;
  fieldYardId: string;
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
}

export interface FieldPriceRule {
  id: string;
  fieldYardId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  price: number;
}

export interface FieldYard {
  id: string;
  name: string;
  code: string;
  type: string;
  description?: string;
  status?: string;
  operatingHours: FieldOperatingHour[];
  priceRules: FieldPriceRule[];
  images: { url: string; isCover: boolean }[];
}

export interface FootballFieldDetail {
  id: string;
  name: string;
  description: string;
  address: string;
  rating?: number;
  reviewCount?: number;
  images: { url: string; isCover: boolean }[];
  yards: FieldYard[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  status: 'AVAILABLE' | 'BOOKED' | 'DISABLED';
  price: number; // Added price
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
  fieldYard: Pick<FieldYard, 'name' | 'type'> & { footballField: Pick<FootballFieldDetail, 'name' | 'address'> };
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
