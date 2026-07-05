import type { Booking } from '@/features/booking/types/booking.types';

export type CasualMatchStatus =
  | 'OPEN'
  | 'FULL'
  | 'CLOSED'
  | 'CANCELLED'
  | 'STARTED'
  | 'FINISHED';

export type CasualMatchVisibility = 'PUBLIC' | 'PRIVATE';
export type CasualMatchTeamMode = 'NO_TEAM' | 'OPTIONAL_TEAM' | 'REQUIRED_TEAM';
export type CasualMatchSkillLevel = 'ANY' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type CasualMatchTeamSide = 'TEAM_A' | 'TEAM_B';

export interface CasualMatchUser {
  id: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string | null;
}

export interface CasualMatchParticipant {
  id: string;
  userId: string;
  slotCount: number;
  totalAmount: number | string;
  paymentStatus: 'UNPAID' | 'PAID' | 'REFUNDED' | 'REFUND_PENDING';
  joinStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'WAITLISTED';
  selectedTeam?: CasualMatchTeamSide | null;
  user?: CasualMatchUser;
}

export interface CasualMatch {
  id: string;
  bookingId: string;
  hostId: string;
  title?: string | null;
  description?: string | null;
  totalSlots: number;
  availableSlots: number;
  occupiedSlots: number;
  slotPrice: number | string;
  skillLevel: CasualMatchSkillLevel;
  visibility: CasualMatchVisibility;
  status: CasualMatchStatus;
  teamMode: CasualMatchTeamMode;
  joinDeadline?: string | null;
  createdAt?: string;
  updatedAt?: string;
  booking?: Booking;
  host?: CasualMatchUser;
  participants?: CasualMatchParticipant[];
}

export interface CasualMatchListResponse {
  message: string;
  data: CasualMatch[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CasualMatchDetailResponse {
  message: string;
  data: CasualMatch;
}

  export interface CasualMatchListParams {
    province?: string;
    district?: string;
    footballFieldId?: string;
    bookingDate?: string;
    skillLevel?: CasualMatchSkillLevel;
    keyword?: string;
    status?: CasualMatchStatus;
    date?: string;
    page?: number;
    limit?: number;
  }

export interface CreateCasualMatchPayload {
  bookingId: string;
  title?: string;
  description?: string;
  totalSlots: number;
  slotPrice: number;
  joinDeadline?: string;
  visibility?: CasualMatchVisibility;
  teamMode?: CasualMatchTeamMode;
  skillLevel?: CasualMatchSkillLevel;
}

export type UpdateCasualMatchPayload = Partial<Omit<CreateCasualMatchPayload, 'bookingId' | 'totalSlots'>> & {
  id: string;
};

export interface JoinCasualMatchPayload {
  id: string;
  slotCount?: number;
  selectedTeam?: CasualMatchTeamSide;
}

export interface CasualMatchPaymentResponse {
  message: string;
  data: {
    paymentUrl: string;
    participantId: string;
    amount: number | string;
  };
}
