import { ROUTES } from '@/lib/route.constants';
import { Notification } from '../types/notification.types';

export function getNotificationLink(notification: Notification): string {
  const { type, entityId, metadata } = notification;

  switch (type) {
    // ─── Owner nhận ────────────────────────────────────────────────────────────
    case 'OWNER_REGISTER_APPROVED':
      return ROUTES.ownerDashboard;

    case 'FIELD_APPROVED':
    case 'FIELD_CREATED_APPROVED':
      return ROUTES.ownerPitches;

    case 'BOOKING_CREATED':
    case 'OFFLINE_BOOKING_UNLOCK':
    case 'OFFLINE_ARRIVAL_CONFIRM':
      return ROUTES.ownerBookings;

    // ─── User nhận ─────────────────────────────────────────────────────────────
    case 'BOOKING_CANCELLED':
    case 'OWNER_CANCEL_BOOKING':
      return ROUTES.myBooking;

    // ─── Cộng đồng ─────────────────────────────────────────────────────────────
    case 'CASUAL_MATCH_JOINED':
    case 'CASUAL_MATCH_LEAVED': {
      const matchId = (metadata?.casualMatchId as string) || entityId;
      return matchId ? `${ROUTES.casualMatch}/${matchId}` : ROUTES.casualMatch;
    }

    // ─── Admin nhận ────────────────────────────────────────────────────────────
    case 'FIELD_WAITING_APPROVAL':
    case 'FIELD_UPDATE_WAITING':
      return ROUTES.adminFields;

    case 'OWNER_REGISTER_WAITING':
      return ROUTES.adminOwners;

    default:
      return '#';
  }
}
