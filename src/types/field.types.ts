// src/types/field.types.ts
// ─── Shared types dùng chung toàn app ────────────────────────────────────────

// ─── Enums ───────────────────────────────────────────────────────────────────

export const YARD_TYPE = {
  FIVE_A_SIDE: 'FIVE_A_SIDE',
  SEVEN_A_SIDE: 'SEVEN_A_SIDE',
  ELEVEN_A_SIDE: 'ELEVEN_A_SIDE',
} as const;
export type YardType = (typeof YARD_TYPE)[keyof typeof YARD_TYPE];

export const YARD_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  MAINTENANCE: 'MAINTENANCE',
} as const;
export type YardStatus = (typeof YARD_STATUS)[keyof typeof YARD_STATUS];

export const TIME_SLOT_LABEL = {
  REGULAR: 'REGULAR',
  PEAK: 'PEAK',
  LATE_NIGHT: 'LATE_NIGHT',
} as const;
export type TimeSlotLabel = (typeof TIME_SLOT_LABEL)[keyof typeof TIME_SLOT_LABEL];

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

export interface FieldPriceRule { price: number; }
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