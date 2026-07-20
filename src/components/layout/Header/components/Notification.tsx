'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useReadNotificationMutation,
  useReadAllNotificationsMutation,
} from '@/features/notification/api/notificationAPI';
import type { Notification } from '@/features/notification/types/notification.types';
import { getNotificationLink } from '@/features/notification/utils/getNotificationLink';
import { useAppSelector } from '@/store/store';

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  return `${Math.floor(hours / 24)} ngày trước`;
}

function NotificationItem({
  notification,
  onClickItem,
}: {
  notification: Notification;
  onClickItem: (notification: Notification) => void;
}) {
  return (
    <button
      onClick={() => onClickItem(notification)}
      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
        !notification.isRead ? 'bg-blue-50/60' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        {!notification.isRead && (
          <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-blue-500" />
        )}
        <div className={!notification.isRead ? '' : 'pl-4'}>
          <p className="text-sm font-medium text-gray-800 line-clamp-1">{notification.title}</p>
          {notification.content && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notification.content}</p>
          )}
          <p className="text-xs text-gray-400 mt-1">{timeAgo(notification.createdAt)}</p>
        </div>
      </div>
    </button>
  );
}

export default function Notification() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const auth = useAppSelector((s) => (s as any).auth);
  const isLoggedIn = !!auth?.user;

  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !isLoggedIn,
    pollingInterval: 30000,
  });
  const { data: notifData } = useGetNotificationsQuery(
    { page: 1, limit: 10 },
    { skip: !isLoggedIn || !open },
  );
  const [readOne] = useReadNotificationMutation();
  const [readAll] = useReadAllNotificationsMutation();

  const unreadCount = unreadData?.data ?? 0;
  const notifications: Notification[] = notifData?.data ?? [];

  const handleNotificationClick = (n: Notification) => {
    if (!n.isRead) {
      readOne(n.id);
    }
    setOpen(false);
    const link = getNotificationLink(n);
    if (link && link !== '#') {
      router.push(link);
    }
  };

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  if (!isLoggedIn) {
    return (
      <button aria-label="Notifications" className="text-gray-500 hover:text-gray-700">
        <Bell className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
        className="relative text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => readAll()}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Không có thông báo</p>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onClickItem={handleNotificationClick}
                />
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-2.5">
            <button
              onClick={() => {
                setOpen(false);
                router.push('/notifications');
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Xem tất cả thông báo →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
