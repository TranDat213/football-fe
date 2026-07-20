import { Notification } from '../types/notification.types';

export function getNotificationLink(notification: Notification): string {
  const { type, entityId, metadata } = notification;

  switch (type) {
    case 'OWNER_REGISTER_APPROVED':
      return '/owner/dashboard';

    case 'FIELD_APPROVED':
    case 'FIELD_CREATED_APPROVED':
      return '/owner/pitches';

    case 'BOOKING_CREATED':
      return '/owner/bookings';

    case 'BOOKING_CANCELLED':
    case 'OWNER_CANCEL_BOOKING':
      return '/my-booking';

    case 'CASUAL_MATCH_JOINED':
    case 'CASUAL_MATCH_LEAVED': {
      const matchId = (metadata?.casualMatchId as string) || entityId;
      return matchId ? `/casual-matches/${matchId}` : '/casual-matches';
    }

    case 'FIELD_WAITING_APPROVAL':
    case 'FIELD_UPDATE_WAITING':
      return '/admin/field_management';

    case 'OWNER_REGISTER_WAITING':
      return '/admin/owner_management';

    default:
      return '#';
  }
}
