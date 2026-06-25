// src/features/pitch/types/pitch.types.ts
// ─── Chỉ chứa types liên quan đến feature Pitch (create/manage) ───────────────

import type { YardType, YardStatus } from '@/types/field.types';

export type { YardType, YardStatus };
export { YARD_TYPE, YARD_STATUS } from '@/types/field.types';

// ─── Create payloads (match BE DTOs) ─────────────────────────────────────────
export interface PitchCategory {
  id: string;
  name: string;
}
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