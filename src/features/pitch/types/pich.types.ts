// src/features/pitch/types/pitch.types.ts
import type { YardType, YardStatus } from '@/types/field.types';
export type { YardType, YardStatus };
export { YARD_TYPE, YARD_STATUS } from '@/types/field.types';

// ─── Lookup ───────────────────────────────────────────────────────────────────
export interface PitchCategory {
  id: string;
  name: string;
}

// ─── Create payloads (match BE DTOs) ─────────────────────────────────────────
export interface CreateFieldPayload {
  category_id: string;
  name: string;
  description: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  latitude?: number;
  longitude?: number;
  open_time: string;
  close_time: string;
}

export interface CreateYardPayload {
  name: string;
  field_id: string;
  type: YardType;
  status: YardStatus;
}

export interface CreateFieldImagePayload {
  file: File;
  footballFieldId: string;
  sortOrder: number;
  isCover: boolean;
}

export interface CreatePriceRulePayload {
  dayOfWeek?: number | null;
  startTime: string;
  endTime: string;
  specialDate?: string | null;
  price: number;
  label?: string;
}

export interface CreateOperatingHourPayload {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

// ─── Complete single-request payload (match CreateFootballFieldCompleteDto) ───
export interface FieldImageCompletePayload {
  file: File;
  sort_order: number;
  is_cover: boolean;
}

export interface FieldImageUploadedPayload {
  url: string;
  sortOrder: number;
  isCover: boolean;
}

export interface YardCompletePayload {
  name: string;
  type: YardType;
  operatingHours: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  }[];
  priceRules: {
    dayOfWeek?: number | null;
    specialDate?: string | null;
    startTime: string;
    endTime: string;
    price: number;
    label?: string;
  }[];
}

export interface CreateFootballFieldCompletePayload {
  name: string;
  description?: string;
  categoryId: string;
  address: string;
  province: string;
  district: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  openTime?: string;
  closeTime?: string;
  images: FieldImageUploadedPayload[];
  yards: YardCompletePayload[];
}