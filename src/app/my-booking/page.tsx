'use client';

import React, { useState } from 'react';
import { useGetMyBookingsQuery } from '@/features/booking/api/bookingAPI';
import { Booking } from '@/features/booking/types/booking.types';
import { format } from 'date-fns';
import { Pagination } from '@/features/admin/component/Pagination';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { YARD_TYPE } from '@/types/field.types';

export default function MyBookingPage() {
  const { data: response, isLoading, error } = useGetMyBookingsQuery();
  const bookings = response?.data || [];

  const limit = 5;
  const [page, setPage] = useState(1);

  if (isLoading)
    return (
      <div className="p-8 text-center text-gray-500">
        Đang tải lịch sử đặt sân...
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        Lỗi khi tải dữ liệu. Vui lòng thử lại.
      </div>
    );

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const currentBookings = bookings.slice(startIndex, endIndex);
  const isActualLastPage = endIndex >= bookings.length;
  // If it's the actual last page but length == limit, we manually pass limit-1 to disable Next
  const itemsCountForPagination =
    isActualLastPage && currentBookings.length === limit
      ? limit - 1
      : currentBookings.length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="container mx-auto p-4 md:p-8 max-w-4xl min-h-screen">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Lịch sử đặt sân
        </h1>

        {bookings.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">Bạn chưa có lịch đặt sân nào.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {currentBookings.map((booking: Booking) => (
              <div
                key={booking.id}
                className="p-4 md:p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row justify-between mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {booking.fieldYard.footballField.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {booking.fieldYard.footballField.address}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium self-start ${getStatusConfig(booking.status).className}`}
                    >
                      {getStatusConfig(booking.status).label}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium self-start ${getPaymentStatusConfig(booking.paymentStatus).className}`}
                    >
                      {getPaymentStatusConfig(booking.paymentStatus).label}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Ngày đặt</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Thời gian</p>
                    <p className="font-medium text-gray-900">
                      {format(new Date(booking.startTime), 'HH:mm')} -{' '}
                      {format(new Date(booking.endTime), 'HH:mm')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Sân</p>
                    <p className="font-medium text-gray-900">
                      {booking.fieldYard.name} ({YARD_TYPE[booking.fieldYard.type]})
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Tổng tiền</p>
                    <p className="font-medium text-emerald-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(booking.totalPrice)}
                    </p>
                  </div>
                </div>

                {booking.note && (
                  <div className="mt-4 pt-4 border-t border-gray-100 text-sm">
                    <p className="text-gray-500 mb-1">Ghi chú</p>
                    <p className="text-gray-700">{booking.note}</p>
                  </div>
                )}
              </div>
            ))}

            {bookings.length > limit && (
              <div className="mt-6 flex justify-center">
                <Pagination
                  currentPage={page}
                  itemsCount={itemsCountForPagination}
                  limit={limit}
                  onPageChange={setPage}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return { label: 'Đã xác nhận', className: 'bg-green-100 text-green-700' };
    case 'PENDING':
      return { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-700' };
    case 'CANCELLED':
      return { label: 'Đã huỷ', className: 'bg-red-100 text-red-700' };
    default:
      return { label: status, className: 'bg-gray-100 text-gray-700' };
  }
}

function getPaymentStatusConfig(status: string) {
  switch (status) {
    case 'PAID':
      return {
        label: 'Đã thanh toán',
        className: 'bg-emerald-100 text-emerald-700',
      };
    case 'UNPAID':
      return {
        label: 'Chưa thanh toán',
        className: 'bg-gray-100 text-gray-600',
      };
    case 'REFUNDED':
      return { label: 'Đã hoàn tiền', className: 'bg-blue-100 text-blue-700' };
    case 'REFUND_PENDING':
      return {
        label: 'Chờ hoàn tiền',
        className: 'bg-orange-100 text-orange-700',
      };
    default:
      return { label: status, className: 'bg-gray-100 text-gray-700' };
  }
}
