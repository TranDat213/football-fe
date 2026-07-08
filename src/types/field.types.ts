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

// ─── FieldYard — single source of truth ──────────────────────────────────────

export interface FieldYard {
  id: string;
  name: string;
  code: string;
  type: YardType;
  status: YardStatus;
  description?: string;
  field_id?: string;
  operatingHours: FieldOperatingHour[];
  priceRules: FieldPriceRule[];
  images: FieldImage[];
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
  province: string;
  district: string;
  ward: string;
  status: YardStatus;
  open_time: string;
  close_time: string;
  latitude?: number;
  longitude?: number;
  reviews?: any[];
  category?: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}