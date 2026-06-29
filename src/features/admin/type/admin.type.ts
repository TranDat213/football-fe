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

export interface PendingFieldOwner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}
export interface PendingField {
  id: string;
  ownerId: string;
  owner: PendingFieldOwner;   // thêm
  name: string;
  address: string;
  province: string;
  district: string;
  status: FieldStatus;
  createdAt: string;
  images: FieldImage[];
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

export type OwnerRegisterPendingCountResponse =
  ApiResponse<OwnerRegisterPendingCount>;

export interface UpdateFieldStatusPayload {
  id: string;
  status: FieldStatus;
}

export type UpdateFieldStatusResponse = ApiResponse<{ message: string }>;

// ─── User Management ────────────────────────────────────────────────────────
export interface UserAdmin {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  role: 'USER' | 'OWNER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  createdAt: string;
}

export interface UpdateUserStatusPayload {
  id: string;
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
}

export interface PaginatedUsers {
  users?: UserAdmin[];
  owners?: UserAdmin[];
  accounts?: UserAdmin[];
  total: number;
}

export type UserListResponse = ApiResponse<PaginatedUsers>;

export interface OwnerRegisterPending {
  id: string;
  userId?: string;
  user?: UserAdmin;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: 'PENDING';
  address?: string;
  stadiumName?: string;
  createdAt: string;
}
export interface OwnerRegisterPendingList {
  ownerRegistrations: OwnerRegisterPending[];
  total: number;
}
export type OwnerRegisterPendingResponse = ApiResponse<OwnerRegisterPendingList>

export interface UpdateOwnerRegisterStatusPayload {
  id: string;
  status: 'PENDING' | 'CONTACTING' | 'APPROVED' | 'REJECTED';
}

export interface CreateOwnerPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
}

//category
export interface CreateCategoryPayload{
  name: string;
  display_order: number;
}

export type CreateCategoryResponse = ApiResponse<{ message: string }>;

export interface UpdateCategoryPayload{
  id: string;
  name: string;
  display_order: number;
}

export type UpdateCategoryResponse = ApiResponse<{ message: string }>;

export interface DeleteCategoryPayload{
  id: string;
}

export type DeleteCategoryResponse = ApiResponse<{ message: string }>;

export interface FieldCategory {
  id: string;
  name: string;
  display_order: number;
}
 
export type CategoryListResponse = ApiResponse<FieldCategory[]>;
export type CategoryDetailResponse = ApiResponse<FieldCategory>;