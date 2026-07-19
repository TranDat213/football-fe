'use client';

import { useGetOwnerBookingsQuery } from '@/features/booking/api/bookingAPI';
import { Booking } from '@/features/booking/types/booking.types';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/route.constants';

const PAYMENT_STYLE: Record<Booking['paymentStatus'], string> = {
  PAID:     'text-emerald-600',
  UNPAID:   'text-gray-400',
  REFUNDED: 'text-amber-600',
  REFUND_PENDING: 'text-amber-500',
};

const PAYMENT_LABEL: Record<Booking['paymentStatus'], string> = {
  PAID:     'Đã thanh toán',
  UNPAID:   'Chưa thanh toán',
  REFUNDED: 'Đã hoàn tiền',
  REFUND_PENDING: 'Chờ hoàn tiền',
};

const STATUS_CONFIG: Record<Booking['status'], { label: string; style: string; dot: string }> = {
  PENDING: {
    label: 'Đang chờ',
    style: 'text-amber-700 bg-amber-50 ring-amber-600/10',
    dot: 'bg-amber-500',
  },
  AWAITING_PAYMENT: {
    label: 'Chờ thanh toán',
    style: 'text-blue-700 bg-blue-50 ring-blue-600/10',
    dot: 'bg-blue-500',
  },
  CONFIRMED: {
    label: 'Đã đặt',
    style: 'text-emerald-700 bg-emerald-50 ring-emerald-600/10',
    dot: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Đã hủy',
    style: 'text-red-700 bg-red-50 ring-red-600/10',
    dot: 'bg-red-500',
  },
};

export function BookingStatusBadge({ status }: { status: Booking['status'] }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${config.style}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

const YARD_TYPE_LABEL: Record<string, string> = {
  FIVE_A_SIDE: 'Sân 5',
  SEVEN_A_SIDE: 'Sân 7',
  ELEVEN_A_SIDE: 'Sân 11',
  YARD_5: 'Sân 5',
  YARD_7: 'Sân 7',
  YARD_11: 'Sân 11',
};

export function getCustomerInfo(booking: Booking): { name: string; phone?: string } {
  if (booking.note && booking.note.includes('[Đặt ngoài]')) {
    const match = booking.note.match(/Khách:\s*([^-]+)(?:-\s*(.*))?/);
    if (match) {
      const name = match[1]?.trim();
      const phone = match[2]?.trim();
      return { name: name || 'Khách vãng lai', phone };
    }
    return { name: 'Chủ sân khóa lịch' };
  }

  if (booking.user) {
    const fullName = [booking.user.lastName, booking.user.firstName].filter(Boolean).join(' ');
    const name = fullName || booking.user.username || 'Khách đặt online';
    return { name, phone: booking.user.phone };
  }

  return { name: 'Khách vãng lai' };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

function formatTimeRange(start: string, end: string) {
  return `${start.slice(0, 5)} – ${end.slice(0, 5)}`;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-3.5 rounded bg-gray-100 animate-pulse" style={{ width: i === 3 ? '80%' : '60%' }} />
        </td>
      ))}
    </tr>
  );
}

export default function RecentBookings() {
  const { data, isLoading, isError } = useGetOwnerBookingsQuery();
  const bookings: Booking[] = data?.data?.slice(0, 5) ?? [];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <div>
          <h3 className="font-bold text-gray-900">Lượt đặt sân gần đây</h3>
          <p className="text-xs text-gray-400 mt-0.5">5 lượt đặt mới nhất</p>
        </div>
        <Link 
          href={ROUTES.ownerBookings}
          className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors uppercase tracking-wider"
        >
          Xem tất cả <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/60 border-b border-gray-100">
            <tr>
              {[
                { label: 'Người đặt' },
                { label: 'Sân con' },
                { label: 'Loại sân' },
                { label: 'Lịch đặt' },
                { label: 'Số tiền' },
                { label: 'Thanh toán' },
                { label: 'Trạng thái', center: true },
              ].map(({ label, center }) => (
                <th
                  key={label}
                  className={`px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 ${center ? 'text-center' : ''}`}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {isLoading && Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}

            {isError && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-red-400">
                  Không thể tải dữ liệu. Vui lòng thử lại.
                </td>
              </tr>
            )}

            {!isLoading && !isError && bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-400">
                  Chưa có lượt đặt sân nào.
                </td>
              </tr>
            )}

            {bookings.map((booking) => {
              const customer = getCustomerInfo(booking);
              return (
                <tr key={booking.id} className="group hover:bg-gray-50/40 transition-colors">

                  {/* Người đặt */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {customer.name}
                      </span>
                      {customer.phone && (
                        <span className="text-xs text-gray-400">{customer.phone}</span>
                      )}
                    </div>
                  </td>

                {/* Sân con */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{booking.fieldYard?.name}</span>
                    <span className="text-xs text-gray-400">{booking.fieldYard?.footballField?.name}</span>
                  </div>
                </td>

                {/* Loại sân */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                    {YARD_TYPE_LABEL[booking.fieldYard?.type] || booking.fieldYard?.type || 'Sân 5'}
                  </span>
                </td>

                {/* Lịch */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{formatDate(booking.bookingDate)}</span>
                    <span className="text-xs text-gray-400">{formatTimeRange(booking.startTime, booking.endTime)}</span>
                  </div>
                </td>

                {/* Tiền */}
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-gray-900">{formatAmount(booking.totalPrice)}</span>
                </td>

                {/* Thanh toán */}
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium ${PAYMENT_STYLE[booking.paymentStatus]}`}>
                    {PAYMENT_LABEL[booking.paymentStatus]}
                  </span>
                </td>

                {/* Trạng thái — static badge */}
                <td className="px-6 py-4 text-center">
                  <BookingStatusBadge status={booking.status} />
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>
    </div>
  );
}