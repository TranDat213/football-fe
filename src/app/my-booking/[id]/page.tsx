'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetBookingByIdQuery,
  useCreatePaymentMutation,
  useCancelBookingMutation,
  useGetPaymentByBookingIdQuery,
} from '@/features/booking/api/bookingAPI';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  ArrowLeft,
  AlertCircle,
  Receipt,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { formatBookingTime } from '@/features/booking/utils/formatTime';
import { YARD_TYPE } from '@/types/field.types';

function getStatusConfig(status: string) {
  switch (status) {
    case 'CONFIRMED':
      return { label: 'Đã xác nhận', className: 'bg-green-100 text-green-800 border-green-200' };
    case 'PENDING':
      return { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    case 'AWAITING_PAYMENT':
      return { label: 'Đang chờ thanh toán', className: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'CANCELLED':
      return { label: 'Đã huỷ', className: 'bg-red-100 text-red-800 border-red-200' };
    case 'OWNER_CANCELLED':
      return { label: 'Đã huỷ bởi chủ sân', className: 'bg-red-100 text-red-800 border-red-200' };
    default:
      return { label: status, className: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
}

function getPaymentStatusConfig(status: string) {
  switch (status) {
    case 'PAID':
      return { label: 'Đã thanh toán', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case 'UNPAID':
      return { label: 'Chưa thanh toán', className: 'bg-orange-100 text-orange-800 border-orange-200' };
    case 'REFUNDED':
      return { label: 'Đã hoàn tiền', className: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'REFUND_PENDING':
      return { label: 'Đang hoàn tiền', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    default:
      return { label: status, className: 'bg-gray-100 text-gray-700 border-gray-200' };
  }
}

export default function MyBookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const { data: response, isLoading, error } = useGetBookingByIdQuery(bookingId);
  const { data: paymentResponse } = useGetPaymentByBookingIdQuery(bookingId, {
    skip: !bookingId,
  });

  const [createPayment, { isLoading: isPaying }] = useCreatePaymentMutation();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !response?.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy thông tin đơn đặt sân
          </h1>
          <p className="text-gray-500 mb-6">
            Đơn đặt sân này không tồn tại hoặc bạn không có quyền truy cập.
          </p>
          <Button
            onClick={() => router.push('/my-booking')}
            className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại lịch sử đặt sân
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const booking = response.data;
  const field = booking.fieldYard?.footballField;
  const yard = booking.fieldYard;
  const payment = paymentResponse?.data;

  const isUnpaidOrFailed =
    booking.status === 'AWAITING_PAYMENT' ||
    (booking.paymentStatus === 'UNPAID' &&
      booking.status !== 'CANCELLED' &&
      booking.status !== 'OWNER_CANCELLED');

  const canCancel =
    booking.status === 'PENDING' ||
    booking.status === 'CONFIRMED' ||
    booking.status === 'AWAITING_PAYMENT';

  const hasCasualMatch = Boolean(
    (booking as any).casualMatch &&
      (booking as any).casualMatch.status !== 'CANCELLED',
  );

  const handleRePay = async () => {
    try {
      const res = await createPayment({
        bookingId: booking.id,
        paymentMethod: 'VNPAY',
      }).unwrap();

      if (res.paymentUrl) {
        toast.success('Đang chuyển hướng sang cổng thanh toán VNPay...');
        window.location.href = res.paymentUrl;
      } else {
        toast.info(res.message || 'Tạo thanh toán thành công');
      }
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || 'Có lỗi xảy ra khi tạo thanh toán lại',
      );
    }
  };

  const handleConfirmCancel = async () => {
    try {
      const res = await cancelBooking({
        id: booking.id,
        reason: cancelReason,
      }).unwrap();
      toast.success(res.message || 'Hủy đặt sân thành công');
      setShowCancelModal(false);
      setCancelReason('');
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Hủy đặt sân thất bại');
    }
  };

  const statusConfig = getStatusConfig(booking.status);
  const paymentStatusConfig = getPaymentStatusConfig(booking.paymentStatus);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:px-6">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/my-booking')}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Quay lại danh sách đặt sân
          </Button>
        </div>

        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          {/* Header Banner */}
          <div className="bg-emerald-700 p-6 md:p-8 text-white">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold tracking-wide">
                Đơn đặt sân #{booking.id.slice(0, 8)}
              </span>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold border ${statusConfig.className}`}
                >
                  {statusConfig.label}
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold border ${paymentStatusConfig.className}`}
                >
                  {paymentStatusConfig.label}
                </span>
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{field?.name || 'Sân bóng'}</h1>
            <p className="mt-1 text-emerald-100 text-sm">
              {yard?.name} • {YARD_TYPE[yard?.type as keyof typeof YARD_TYPE] || yard?.type}
            </p>
          </div>

          {/* Body Content */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Field Address */}
            {field && (
              <div className="flex items-start gap-3.5 rounded-2xl border border-gray-100 p-4 bg-gray-50/50">
                <MapPin className="h-5 w-5 mt-0.5 text-emerald-700 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Địa điểm sân
                  </p>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5">
                    {field.name}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{field.address}</p>
                  {field.district && field.province && (
                    <p className="text-xs text-gray-500">
                      {field.district}, {field.province}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3.5 rounded-2xl border border-gray-100 p-4 bg-gray-50/50">
                <Calendar className="h-5 w-5 mt-0.5 text-emerald-700 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Ngày đá
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {format(new Date(booking.bookingDate), 'dd/MM/yyyy')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 rounded-2xl border border-gray-100 p-4 bg-gray-50/50">
                <Clock className="h-5 w-5 mt-0.5 text-emerald-700 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Khung giờ
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    {formatBookingTime(booking.startTime)} -{' '}
                    {formatBookingTime(booking.endTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Summary Details */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 space-y-4">
              <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Receipt className="h-4 w-4 text-emerald-700" /> Chi tiết thanh toán
              </h2>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-white border border-gray-100 p-3">
                  <p className="text-xs text-gray-400">Loại sân</p>
                  <p className="font-bold text-gray-900 mt-0.5">
                    {yard?.name} (
                    {YARD_TYPE[yard?.type as keyof typeof YARD_TYPE] || yard?.type})
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-gray-100 p-3">
                  <p className="text-xs text-gray-400">Hình thức đặt</p>
                  <p className="font-bold text-gray-900 mt-0.5">
                    {booking.source === 'ONLINE' ? 'Trực tuyến' : 'Tại sân (Offline)'}
                  </p>
                </div>

                <div className="col-span-2 rounded-xl bg-white border border-gray-100 p-3.5 flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">Tổng chi phí</p>
                  <p className="text-lg font-extrabold text-emerald-700">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(booking.totalPrice)}
                  </p>
                </div>
              </div>

              {booking.note && (
                <div className="mt-3 pt-3 border-t border-gray-200/60 text-xs">
                  <span className="font-bold text-gray-600">Ghi chú: </span>
                  <span className="text-gray-700">{booking.note}</span>
                </div>
              )}
            </div>

            {/* Re-Pay Section when unpaid or failed */}
            {isUnpaidOrFailed && (
              <div className="rounded-2xl bg-orange-50 border border-orange-200 p-5 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold text-orange-900">
                      Đơn đặt sân chưa hoàn tất thanh toán
                    </h3>
                    <p className="text-xs text-orange-700 mt-1">
                      Nếu quá trình thanh toán trước đó bị gián đoạn hoặc gặp lỗi, bạn
                      có thể thực hiện thanh toán lại ngay bây giờ qua cổng VNPay để giữ
                      chỗ.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleRePay}
                  disabled={isPaying}
                  className="w-full h-12 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 mt-2"
                >
                  {isPaying ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <CreditCard className="h-5 w-5" />
                  )}
                  Thanh toán ngay qua VNPay
                </Button>
              </div>
            )}

            {/* Payment Details when Paid */}
            {payment && payment.status === 'PAID' && (
              <div className="rounded-2xl bg-emerald-50/60 border border-emerald-200/80 p-4 text-xs space-y-1">
                <p className="font-bold text-emerald-900 flex items-center gap-1.5 text-sm mb-2">
                  <FileText className="h-4 w-4 text-emerald-700" /> Đã hoàn tất thanh
                  toán
                </p>
                {payment.paidAt && (
                  <p className="text-emerald-800">
                    Thời gian thanh toán:{' '}
                    <span className="font-semibold">
                      {new Date(payment.paidAt).toLocaleString('vi-VN')}
                    </span>
                  </p>
                )}
                {payment.transactionCode && (
                  <p className="text-emerald-800">
                    Mã giao dịch:{' '}
                    <span className="font-semibold">{payment.transactionCode}</span>
                  </p>
                )}
                <p className="text-emerald-800">
                  Phương thức: <span className="font-semibold">{payment.paymentMethod}</span>
                </p>
              </div>
            )}

            {/* Cancel Action */}
            {canCancel && (
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                {hasCasualMatch ? (
                  <span className="text-xs text-amber-600 font-medium">
                    * Đơn này đã ghép trận vãng lai, không thể hủy trực tiếp.
                  </span>
                ) : (
                  <span />
                )}
                <Button
                  variant="outline"
                  disabled={hasCasualMatch}
                  onClick={() => setShowCancelModal(true)}
                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
                >
                  Hủy đặt sân
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Cancellation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Xác nhận hủy đặt sân</h3>
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <b>Lưu ý:</b> Bạn chỉ được hủy trước giờ đá ít nhất 1 giờ. Nếu đơn đã được thanh toán, số tiền sẽ được tự động hoàn lại qua VNPay.
              </p>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Lý do hủy (không bắt buộc)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do hủy..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-emerald-600"
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  disabled={isCancelling}
                  onClick={() => setShowCancelModal(false)}
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
      </main>

      <Footer />
    </div>
  );
}
