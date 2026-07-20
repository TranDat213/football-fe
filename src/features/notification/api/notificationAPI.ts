import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQueryWithReauth } from '@/lib/api/baseQuery';
import { Notification, NotificationPaginatedResponse } from '../types/notification.types';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: customBaseQueryWithReauth,
  tagTypes: ['Notification', 'UnreadCount'],
  endpoints: (builder) => ({
    getNotifications: builder.query<
      NotificationPaginatedResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: '/notifications',
        params: params ?? undefined,
      }),
      providesTags: ['Notification'],
    }),

    getUnreadCount: builder.query<{ data: number }, void>({
      query: () => '/notifications/unread-count',
      providesTags: ['UnreadCount'],
    }),

    readNotification: builder.mutation<{ data: Notification }, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification', 'UnreadCount'],
    }),

    readAllNotifications: builder.mutation<{ data: { updated: number } }, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification', 'UnreadCount'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useReadNotificationMutation,
  useReadAllNotificationsMutation,
} = notificationApi;
