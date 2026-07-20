'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVerifyVNPayReturnQuery, useGetBookingByIdQuery } from '@/features/booking/api/bookingAPI';
import type { VNPayReturnResult } from '@/features/booking/types/payment.types';
import { formatBookingTime } from '@/features/booking/utils/formatTime';

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [queryString, setQueryString] = useState<string>('');

  useEffect(() => {
    setQueryString(searchParams.toString());
  }, [searchParams]);

  const { data, isLoading, isError } = useVerifyVNPayReturnQuery(queryString, {
    skip: !queryString,
  });

  const result: VNPayReturnResult | undefined = data?.data;

  const { data: bookingData } = useGetBookingByIdQuery(result?.bookingId ?? '', {
    skip: !result?.bookingId,
  });

  const booking = bookingData?.data;

  if (isLoading || !queryString) {
    return <LoadingState />;
  }

  if (isError || !result) {
    return <ErrorState onGoHome={() => router.push('/')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
          {/* Status Banner */}
          <div
            className={`h-2 w-full ${
              result.success ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}
          />

          <div className="p-8 text-center">
            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
                result.success
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {result.success ? (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-white mb-2">
              {result.success ? 'Thanh toán thành công!' : 'Thanh toán thất bại'}
            </h1>
            <p className={`text-sm mb-6 ${result.success ? 'text-emerald-400' : 'text-red-400'}`}>
              {result.message}
            </p>

            {/* Amount */}
            {result.amount > 0 && (
              <div className="bg-slate-900/50 rounded-2xl p-4 mb-6">
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Số tiền</p>
                <p className="text-3xl font-bold text-white">
                  {result.amount.toLocaleString('vi-VN')}
                  <span className="text-lg text-slate-400 ml-1">đ</span>
                </p>
              </div>
            )}

            {/* Booking Info */}
            {booking && (
              <div className="bg-slate-900/40 rounded-2xl p-4 mb-6 text-left space-y-3">
                <h2 className="text-slate-300 font-semibold text-sm uppercase tracking-wider mb-2">
                  Thông tin đặt sân
                </h2>
                <InfoRow label="Sân" value={`${booking.fieldYard?.footballField?.name} — ${booking.fieldYard?.name}`} />
                <InfoRow label="Ngày" value={new Date(booking.bookingDate).toLocaleDateString('vi-VN')} />
                <InfoRow
                  label="Giờ"
                  value={`${formatBookingTime(booking.startTime)} — ${formatBookingTime(booking.endTime)}`}
                />
                <InfoRow label="Mã đơn" value={booking.id.slice(0, 8).toUpperCase()} mono />
              </div>
            )}

            {/* Mã giao dịch */}
            <p className="text-xs text-slate-500 mb-8">
              Mã giao dịch VNPay: {searchParams.get('vnp_TransactionNo') ?? 'N/A'}
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              {result.success && result.bookingId && (
                <button
                  onClick={() => router.push(`/my-booking`)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold hover:opacity-90 active:scale-95 transition-all duration-150"
                >
                  Xem đặt sân
                </button>
              )}
              <button
                onClick={() => router.push('/')}
                className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold active:scale-95 transition-all duration-150"
              >
                Trang chủ
              </button>
            </div>
          </div>
        </div>

        {/* Response code note */}
        {!result.success && (
          <p className="text-center text-xs text-slate-500 mt-4">
            Mã lỗi VNPay: {result.responseCode}
          </p>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-slate-400 text-sm flex-shrink-0">{label}</span>
      <span className={`text-slate-200 text-sm text-right ${mono ? 'font-mono bg-slate-800 px-2 py-0.5 rounded' : ''}`}>
        {value}
      </span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-300 font-medium">Đang xác minh thanh toán...</p>
      </div>
    </div>
  );
}

function ErrorState({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center bg-slate-800/60 border border-slate-700/50 rounded-3xl p-10 max-w-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 text-red-400 mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-white mb-2">Có lỗi xảy ra</h1>
        <p className="text-slate-400 text-sm mb-6">Không thể xác minh kết quả thanh toán. Vui lòng kiểm tra lịch sử đặt sân.</p>
        <button
          onClick={onGoHome}
          className="w-full py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold transition-all"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}
