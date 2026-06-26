// src/features/pitch/types/field-admin.types.ts
import type { FieldImage, YardStatus } from '@/types/field.types';

export type FieldStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE';

// ─── Field Statics ─────────────────────────────────────────────────────────
export interface FieldStatusCount {
  status: FieldStatus;
  _count: { _all: number };
}

export type FieldStaticsResponse = ApiResponse<FieldStatusCount[]>;

// ─── Pending Fields ────────────────────────────────────────────────────────

export interface PendingField {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  province: string;
  district: string;
  status: FieldStatus;
  createdAt: string;
  images: FieldImage[]; // ← đảm bảo dùng FieldImage từ @/types/field.types
}

export type PendingFieldsResponse = ApiResponse<PendingField[]>;

//user
export interface AccountStatistics {
  totalAccounts: number;
  totalUsers: number;
  totalOwners: number;
}

export type AccountStatisticsResponse = ApiResponse<{
  statistics: AccountStatistics;
}>;

export interface OwnerRegisterPendingCount {
  count: number;
}

export type OwnerRegisterPendingCountResponse = ApiResponse<OwnerRegisterPendingCount>;

export interface UpdateFieldStatusPayload {
  id: string;
  status: FieldStatus;
}

export type UpdateFieldStatusResponse = ApiResponse<{ message: string }>;