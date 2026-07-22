'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useGetMyBookingsQuery, useCancelBookingMutation } from '@/features/booking/api/bookingAPI';
import { useGetPitchesQuery } from '@/features/pitch/api/pitchAPI';
import { Booking } from '@/features/booking/types/booking.types';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { Pagination } from '@/features/admin/component/Pagination';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { formatBookingTime } from '@/features/booking/utils/formatTime';
import { YARD_TYPE } from '@/types/field.types';
import { SearchInput } from '@/components/filter/SearchInput';
import { useBookingFilters } from '@/features/booking/hook/useBookingFilter';
import { FieldOption, FootballFieldFilter } from '@/features/booking/components/FootBallFieldFilter';
import { DateFilter } from '@/components/filter/Datefilter';
import { BookingStatusFilter } from '@/features/booking/components/BookingStatusFilter';


function MyBookingContent() {
  const limit = 5;
  const f = useBookingFilters();

  // Nguồn data cho dropdown "sân" — tái dùng getPitches, limit cao để lấy gần hết danh sách.
  // Nếu số sân trong hệ thống lớn (>100), nên đổi sang 1 endpoint riêng nhẹ hơn.
  const { data: pitchesResponse } = useGetPitchesQuery({ page: 1, limit: 100 });
  const fieldOptions: FieldOption[] = (pitchesResponse?.data ?? []).map((p: any) => ({
    value: p.id,
    label: p.name,
  }));

  const { data: response, isLoading, error } = useGetMyBookingsQuery({
    page: f.filters.page,
    limit,
    keyword: f.filters.keyword || undefined,
    status: f.filters.status || undefined,
    bookingDate: f.filters.bookingDate || undefined,
    footballFieldId: f.filters.footballFieldId || undefined,
  });

  // response = { message, data, pagination } — cùng shape với field/active
  const bookings = response?.data ?? [];
  const pagination = response?.pagination;

  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const handleConfirmCancel = async () => {
    if (!cancellingBookingId) return;
    try {
      const res = await cancelBooking({ id: cancellingBookingId, reason: cancelReason }).unwrap();
      toast.success(res.message || 'Huỷ đặt sân thành công');
      setCancellingBookingId(null);
      setCancelReason('');
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Huỷ đặt sân thất bại');
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Lịch sử đặt sân</h1>

      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchInput
          value={f.keywordInput}
          onChange={f.setKeyword}
          placeholder="Tìm theo tên sân, địa chỉ..."
          className="sm:w-64"
        />
        <DateFilter value={f.filters.bookingDate} onChange={f.setBookingDate} />
        <BookingStatusFilter value={f.filters.status} onChange={f.setStatus} />
        <FootballFieldFilter
          value={f.filters.footballFieldId}
          onChange={f.setFootballFieldId}
          fields={fieldOptions}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">
          Lỗi khi tải dữ liệu. Vui lòng thử lại.
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">
            {f.activeCount > 0
              ? 'Không tìm thấy đơn đặt sân nào phù hợp với bộ lọc.'
              : 'Bạn chưa có lịch đặt sân nào.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking: any) => {
            const canCancel = booking.status === 'PENDING' || booking.status === 'CONFIRMED' || booking.status === 'AWAITING_PAYMENT';
            const hasCasualMatch = Boolean(booking.casualMatch && booking.casualMatch.status !== 'CANCELLED');
            return (
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
                  <div className="mt-2 md:mt-0 flex flex-wrap items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusConfig(booking.status).className}`}
                    >
                      {getStatusConfig(booking.status).label}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusConfig(booking.paymentStatus).className}`}
                    >
                      {getPaymentStatusConfig(booking.paymentStatus).label}
                    </span>
                    {hasCasualMatch && (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        Đã tạo trận vãng lai
                      </span>
                    )}
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
                      {formatBookingTime(booking.startTime)} - {formatBookingTime(booking.endTime)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Sân</p>
                    <p className="font-medium text-gray-900">
                      {booking.fieldYard.name} ({YARD_TYPE[booking.fieldYard.type as keyof typeof YARD_TYPE]})
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

                <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link href={`/my-booking/${booking.id}`}>
                      <Button
                        variant="outline"
                        className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      >
                        Xem chi tiết
                      </Button>
                    </Link>
                    {(booking.status === 'AWAITING_PAYMENT' || (booking.paymentStatus === 'UNPAID' && booking.status !== 'CANCELLED' && booking.status !== 'OWNER_CANCELLED')) && (
                      <Link href={`/my-booking/${booking.id}`}>
                        <Button
                          className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
                        >
                          Thanh toán ngay
                        </Button>
                      </Link>
                    )}
                  </div>

                  {canCancel && (
                    <div className="flex items-center gap-2">
                      {hasCasualMatch && (
                        <span className="text-xs text-amber-600 font-medium">
                          * Không thể hủy đơn đã tạo trận vãng lai.
                        </span>
                      )}
                      <Button
                        variant="outline"
                        disabled={hasCasualMatch}
                        onClick={() => {
                          setCancellingBookingId(booking.id);
                          setCancelReason('');
                        }}
                        className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                      >
                        Hủy đặt sân
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Cancel Modal */}
          {cancellingBookingId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                <h3 className="text-lg font-bold text-gray-900">Xác nhận hủy đặt sân</h3>
                <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <b>Lưu ý:</b> Chỉ được hủy trước giờ thi đấu ít nhất 1 giờ. Nếu đơn đặt sân đã được thanh toán, hệ thống sẽ tự động hoàn tiền qua VNPay.
                </p>
                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Lý do hủy (không bắt buộc)</label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Nhập lý do hủy sân..."
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-emerald-600"
                    rows={3}
                  />
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="rounded-xl"
                    disabled={isCancelling}
                    onClick={() => setCancellingBookingId(null)}
                  >
                    Bỏ qua
                  </Button>
                  <Button
                    onClick={handleConfirmCancel}
                    disabled={isCancelling}
                    className="rounded-xl bg-red-600 text-white hover:bg-red-700"
                  >
                    {isCancelling && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                    Xác nhận hủy
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Phân trang thật từ server (pagination.total), không còn slice() ở client */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={f.filters.page}
                itemsCount={pagination.total}
                limit={limit}
                onPageChange={f.setPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyBookingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      {/* Suspense bắt buộc vì useFilters dùng useSearchParams */}
      <Suspense
        fallback={
          <div className="flex justify-center p-16">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          </div>
        }
      >
        <MyBookingContent />
      </Suspense>
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
    case 'AWAITING_PAYMENT':
      return { label: 'Đang chờ thanh toán', className: 'bg-yellow-100 text-yellow-700' };
    case 'OWNER_CANCELLED':
      return { label: 'Đã huỷ bởi chủ sân', className: 'bg-red-100 text-red-700' };
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