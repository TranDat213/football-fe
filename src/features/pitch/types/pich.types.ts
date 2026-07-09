// src/features/pitch/types/pitch.types.ts
import type { YardType, YardStatus } from '@/types/field.types';
export type { YardType, YardStatus };
export { YARD_TYPE, YARD_STATUS } from '@/types/field.types';

// ─── Lookup ───────────────────────────────────────────────────────────────────
export interface PitchCategory {
  id: string;
  name: string;
}

export interface FieldImageCompletePayload {
  file: File;
  sort_order: number;
  is_cover: boolean;
}

export interface FieldImageUploadedPayload {
  url: string;
  publicId: string;
  sortOrder: number;
  isCover: boolean;
}

export interface YardCompletePayload {
  name: string;
  type: YardType;
  timeSlots: {
    tempId?: string | null;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    label: string;
    sortOrder?: number;
    priceRule: {
      price: number;
    };
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

export interface UpdateFootballFieldCompletePayload {
  name?: string;
  description?: string;
  categoryId?: string;
  address?: string;
  province?: string;
  district?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  openTime?: string;
  closeTime?: string;
  images?: FieldImageUploadedPayload[];
  yards?: YardCompletePayload[];
}

// ─── Update Request ───────────────────────────────────────────────────────
export type FootballFieldUpdateRequestStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED';

export interface FootballFieldUpdateRequestOwner {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface FootballFieldUpdateRequestField {
  id: string;
  name: string;
  address: string;
  owner: FootballFieldUpdateRequestOwner;
}
export interface FootballFieldUpdateRequest {
  id: string;
  footballFieldId: string;
  ownerId: string;
  payload: UpdateFootballFieldCompletePayload;
  status: FootballFieldUpdateRequestStatus;
  reason?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  footballField: FootballFieldUpdateRequestField;
}

// Payload gửi lên khi tạo update request — tái sử dụng type update đã có
export type CreateFootballFieldUpdateRequestPayload = UpdateFootballFieldCompletePayload;

export interface UpdateFootballFieldUpdateRequestPayload{
  status: FootballFieldUpdateRequestStatus;
  reason?: string;
  reviewedBy: string;
  reviewedAt: Date;
}