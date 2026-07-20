'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useGetOwnerBookingsQuery, useOwnerCancelBookingMutation } from '@/features/booking/api/bookingAPI';
import { Booking, BookingStatus } from '@/features/booking/types/booking.types';
import { BookingStatusBadge, getCustomerInfo } from '@/features/booking/components/management/RecentBookings';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Search, 
  User as UserIcon, 
  Clock, 
  CreditCard,
  XCircle,
  Loader2,
} from 'lucide-react';

const STATUS_TABS: { label: string; value: 'ALL' | BookingStatus }[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: 'Đã đặt', value: 'CONFIRMED' },
  { label: 'Thanh toán tại sân', value: 'PENDING' },
  { label: 'Chờ thanh toán', value: 'AWAITING_PAYMENT' },
  { label: 'Đã hủy', value: 'CANCELLED' },
  { label: 'Chủ sân hủy', value: 'OWNER_CANCELLED' },
];

const PAYMENT_STYLE: Record<Booking['paymentStatus'], string> = {
  PAID: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  UNPAID: 'text-gray-500 bg-gray-50 border-gray-200',
  REFUNDED: 'text-amber-600 bg-amber-50 border-amber-200',
  REFUND_PENDING: 'text-amber-600 bg-amber-50 border-amber-200',
};

const PAYMENT_LABEL: Record<Booking['paymentStatus'], string> = {
  PAID: 'Đã thanh toán',
  UNPAID: 'Chưa thanh toán',
  REFUNDED: 'Đã hoàn tiền',
  REFUND_PENDING: 'Chờ hoàn tiền',
};

const YARD_TYPE_LABEL: Record<string, string> = {
  FIVE_A_SIDE: 'Sân 5 người',
  SEVEN_A_SIDE: 'Sân 7 người',
  ELEVEN_A_SIDE: 'Sân 11 người',
  YARD_5: 'Sân 5 người',
  YARD_7: 'Sân 7 người',
  YARD_11: 'Sân 11 người',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
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
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 rounded bg-gray-200/70" style={{ width: i === 0 ? '70%' : '50%' }} />
        </td>
      ))}
    </tr>
  );
}

export default function OwnerBookingsPage() {
  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | BookingStatus>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const limit = 10;

  // Cancel booking state
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [ownerCancelBooking, { isLoading: isCancelling }] = useOwnerCancelBookingMutation();

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    if (!cancelReason.trim()) {
      setCancelError('Vui lòng nhập lý do hủy');
      return;
    }
    setCancelError('');
    try {
      await ownerCancelBooking({ id: cancelTarget.id, reason: cancelReason.trim() }).unwrap();
      setCancelTarget(null);
      setCancelReason('');
    } catch (err: any) {
      setCancelError(err?.data?.message || 'Có lỗi xảy ra khi hủy đặt sân');
    }
  };

  const { data, isLoading, isError, isFetching } = useGetOwnerBookingsQuery({
    page,
    limit,
    status: selectedStatus !== 'ALL' ? selectedStatus : undefined,
  });

  const bookings: Booking[] = data?.data ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.total ?? bookings.length;

  // Search filter locally for customer/yard name if typed
  const filteredBookings = bookings.filter((b) => {
    if (!searchKeyword.trim()) return true;
    const kw = searchKeyword.toLowerCase();
    const customer = getCustomerInfo(b);
    const userName = customer.name.toLowerCase();
    const userPhone = (customer.phone || '').toLowerCase();
    const yardName = b.fieldYard?.name?.toLowerCase() || '';
    const fieldName = b.fieldYard?.footballField?.name?.toLowerCase() || '';
    const note = b.note?.toLowerCase() || '';
    return userName.includes(kw) || userPhone.includes(kw) || yardName.includes(kw) || fieldName.includes(kw) || note.includes(kw);
  });

  const handleStatusChange = (val: 'ALL' | BookingStatus) => {
    setSelectedStatus(val);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 py-8">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-6 w-6 text-emerald-600" />
              Tất cả lượt đặt sân
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Quản lý và theo dõi toàn bộ lịch đặt sân tại các cụm sân của bạn.
            </p>
          </div>
          
          {/* Total Badge */}
          <div className="bg-white rounded-xl border border-gray-200 px-4 py-2 flex items-center gap-3 shadow-sm self-start md:self-auto">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng đơn</span>
            <span className="text-lg font-bold text-emerald-600">{totalItems}</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <Filter className="h-4 w-4 text-gray-400 shrink-0 mr-1 hidden sm:block" />
              {STATUS_TABS.map((tab) => {
                const isActive = selectedStatus === tab.value;
                return (
                  <button
                    key={tab.value}
                    onClick={() => handleStatusChange(tab.value)}
                    className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên người đặt, sân..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-9 pr-4 py-2 text-xs font-medium text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Người đặt
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Sân con / Cụm sân
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Loại sân
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Lịch đặt
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-right">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {(isLoading || isFetching) &&
                  Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

                {isError && !isLoading && (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-sm font-medium text-red-500">
                      Không thể tải danh sách đơn đặt sân. Vui lòng thử lại.
                    </td>
                  </tr>
                )}

                {!isLoading && !isFetching && !isError && filteredBookings.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Calendar className="h-10 w-10 text-gray-300 mb-2" />
                        <p className="text-sm font-semibold text-gray-600">Chưa có lượt đặt sân nào</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Không tìm thấy dữ liệu đặt sân phù hợp với bộ lọc hiện tại.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  !isFetching &&
                  !isError &&
                  filteredBookings.map((booking) => {
                    const customer = getCustomerInfo(booking);
                    return (
                      <tr key={booking.id} className="group hover:bg-emerald-50/30 transition-colors">
                        {/* Người đặt */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                              <UserIcon className="h-3.5 w-3.5 text-emerald-600" />
                              {customer.name}
                            </span>
                            {customer.phone && (
                              <span className="text-xs text-gray-400 mt-0.5">{customer.phone}</span>
                            )}
                          </div>
                        </td>

                      {/* Sân */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                            {booking.fieldYard?.name || 'Sân con'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {booking.fieldYard?.footballField?.name || 'Cụm sân'}
                          </span>
                        </div>
                      </td>

                      {/* Loại sân */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                          {YARD_TYPE_LABEL[booking.fieldYard?.type] || booking.fieldYard?.type || 'Sân 5 người'}
                        </span>
                      </td>

                      {/* Lịch */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            {formatDate(booking.bookingDate)}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                            <Clock className="h-3.5 w-3.5 text-gray-400" />
                            {formatTimeRange(booking.startTime, booking.endTime)}
                          </span>
                        </div>
                      </td>

                      {/* Tiền */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          {formatAmount(booking.totalPrice)}
                        </span>
                      </td>

                      {/* Thanh toán */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 border px-2.5 py-1 rounded-full text-xs font-semibold ${PAYMENT_STYLE[booking.paymentStatus]}`}>
                          <CreditCard className="h-3 w-3" />
                          {PAYMENT_LABEL[booking.paymentStatus]}
                        </span>
                      </td>

                      {/* Trạng thái — Static Badge */}
                      <td className="px-6 py-4 text-center">
                        <BookingStatusBadge status={booking.status} />
                      </td>

                      {/* Ngày tạo */}
                      <td className="px-6 py-4 text-right">
                        <span className="text-xs text-gray-400 font-medium">
                          {formatDate(booking.createdAt)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-center">
                        {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                          <button
                            onClick={() => { setCancelTarget(booking); setCancelReason(''); }}
                            className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Hủy
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4 bg-gray-50/50">
              <p className="text-xs font-medium text-gray-500">
                Hiển thị trang <span className="font-bold text-gray-900">{page}</span> / <span className="font-bold text-gray-900">{totalPages}</span> ({totalItems} đơn)
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  // Show max 5 page numbers around active page
                  if (
                    pNum === 1 ||
                    pNum === totalPages ||
                    (pNum >= page - 1 && pNum <= page + 1)
                  ) {
                    return (
                      <button
                        key={pNum}
                        onClick={() => setPage(pNum)}
                        className={`h-8 min-w-[32px] rounded-lg px-2 text-xs font-bold transition-all ${
                          page === pNum
                            ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {pNum}
                      </button>
                    );
                  } else if (pNum === page - 2 || pNum === page + 2) {
                    return (
                      <span key={pNum} className="text-xs text-gray-400 px-1">
                        ...
                      </span>
                    );
                  }
                  return null;
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Cancel Booking Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Hủy đặt sân</h3>
            <p className="text-sm text-gray-600">
              Bạn có chắc chắn muốn hủy đơn đặt sân{' '}
              <strong className="text-gray-900">{cancelTarget.fieldYard?.name}</strong> của{' '}
              <strong className="text-gray-900">
                {getCustomerInfo(cancelTarget).name}
              </strong>
              ?
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Lý do hủy sân <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Nhập lý do hủy sân (bắt buộc)..."
                rows={3}
                className="w-full text-sm p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
              {cancelError && <p className="text-xs text-red-600 mt-1">{cancelError}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                disabled={isCancelling}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50"
              >
                {isCancelling && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Xác nhận hủy đơn
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
