export type NotificationType =
  | 'OWNER_REGISTER_APPROVED'
  | 'FIELD_APPROVED'
  | 'FIELD_CREATED_APPROVED'
  | 'BOOKING_CREATED'
  | 'BOOKING_CANCELLED'
  | 'CASUAL_MATCH_JOINED'
  | 'CASUAL_MATCH_LEAVED'
  | 'FIELD_WAITING_APPROVAL'
  | 'FIELD_UPDATE_WAITING'
  | 'OWNER_REGISTER_WAITING'
  | 'OWNER_CANCEL_BOOKING';

export interface Notification {
  id: string;
  recipientId: string;
  actorId?: string;
  entityType: string;
  entityId: string;
  type: NotificationType;
  title: string;
  content?: string;
  metadata?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationPaginatedResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
