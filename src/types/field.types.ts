// src/types/field.types.ts
// ─── Shared types dùng chung toàn app ────────────────────────────────────────

// ─── Enums ───────────────────────────────────────────────────────────────────

export const YARD_TYPE = {
  FIVE_A_SIDE: 'Sân 5 người',
  SEVEN_A_SIDE: 'Sân 7 người',
  ELEVEN_A_SIDE: 'Sân 11 người',
} as const;
export type YardType = keyof typeof YARD_TYPE;

export const YARD_STATUS = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Ngừng hoạt động',
  MAINTENANCE: 'Bảo trì',
} as const;
export type YardStatus = keyof typeof YARD_STATUS;

export const TIME_SLOT_LABEL = {
  REGULAR: 'Giờ thường',
  PEAK: 'Giờ cao điểm',
  LATE_NIGHT: 'Giờ đêm muộn',
} as const;
export type TimeSlotLabel = keyof typeof TIME_SLOT_LABEL;

// ─── Sub-types ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  message: string;
  data: T;
  statusCode?: number;
}

export interface FieldImage {
  id: string;
  footballFieldId?: string;
  url: string;
  publicId?: string | null;
  isCover: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface FieldPriceRule {
  price: number;
}
export interface FieldTimeSlot {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  label: string;
  sortOrder: number;
  priceRule: FieldPriceRule;
}
export interface FieldYard {
  id: string;
  name: string;
  type: YardType;
  timeSlots: FieldTimeSlot[];
}

// ─── Pitch / FootballField ────────────────────────────────────────────────────

export interface FootballFieldDetail {
  id: string;
  name: string;
  description: string;
  address: string;
  province?: string;
  district?: string;
  ward?: string;
  rating?: number;
  reviewCount?: number;
  images: FieldImage[];
  yards: FieldYard[];
}

export interface Pitch extends FootballFieldDetail {
  categoryId: string; // thêm dòng này
  province: string;
  district: string;
  ward: string;
  status: YardStatus;
  openTime: string; // response thực tế là openTime, không phải open_time — xem mục 3
  closeTime: string;
  latitude?: number;
  longitude?: number;
  reviews?: any[];
  category?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}
