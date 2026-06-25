'use client';

import { useGetOwnerBookingsQuery } from '@/features/booking/api/bookingAPI';
import { Booking } from '@/features/booking/types/booking.types';
import { ExternalLink } from 'lucide-react';
import BookingStatusDropdown from './BookingStatusDropdown';

const PAYMENT_STYLE: Record<Booking['paymentStatus'], string> = {
  PAID:     'text-emerald-600',
  UNPAID:   'text-gray-400',
  REFUNDED: 'text-amber-600',
};

const PAYMENT_LABEL: Record<Booking['paymentStatus'], string> = {
  PAID:     'Đã thanh toán',
  UNPAID:   'Chưa thanh toán',
  REFUNDED: 'Đã hoàn tiền',
};

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
      {Array.from({ length: 6 }).map((_, i) => (
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
        <button className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors uppercase tracking-wider">
          Xem tất cả <ExternalLink className="h-3 w-3" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/60 border-b border-gray-100">
            <tr>
              {[
                { label: 'Sân con' },
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
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-red-400">
                  Không thể tải dữ liệu. Vui lòng thử lại.
                </td>
              </tr>
            )}

            {!isLoading && !isError && bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-400">
                  Chưa có lượt đặt sân nào.
                </td>
              </tr>
            )}

            {bookings.map((booking) => (
              <tr key={booking.id} className="group hover:bg-gray-50/40 transition-colors">

                {/* Sân con */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900">{booking.fieldYard.name}</span>
                    <span className="text-xs text-gray-400">{booking.fieldYard.footballField.name}</span>
                  </div>
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

                {/* Trạng thái — dropdown */}
                <td className="px-6 py-4 text-center">
                  <BookingStatusDropdown
                    bookingId={booking.id}
                    currentStatus={booking.status}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}