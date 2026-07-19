'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AlertCircle, Calendar, CheckCircle2, Clock, Loader2, MapPin, XCircle } from 'lucide-react';
import { useGetMyParticipationsQuery } from '@/features/casual-match/api/casualMatch.api';
import type { ParticipationItem, ParticipationListParams } from '@/features/casual-match/types/casual-match.types';
import { useState } from 'react';
import { formatMatchTime } from '@/features/casual-match/utils/labels';

const JOIN_STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING:   { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3.5 w-3.5" /> },
  APPROVED:  { label: 'Đã duyệt',     color: 'bg-emerald-100 text-emerald-800', icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  CANCELLED: { label: 'Đã huỷ',       color: 'bg-red-100 text-red-800',     icon: <XCircle className="h-3.5 w-3.5" /> },
  REJECTED:  { label: 'Bị từ chối',   color: 'bg-gray-100 text-gray-600',   icon: <XCircle className="h-3.5 w-3.5" /> },
  WAITLISTED:{ label: 'Chờ danh sách',color: 'bg-blue-100 text-blue-800',   icon: <Clock className="h-3.5 w-3.5" /> },
};

const PAY_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  UNPAID:        { label: 'Chưa thanh toán', color: 'bg-orange-100 text-orange-800' },
  PAID:          { label: 'Đã thanh toán',   color: 'bg-emerald-100 text-emerald-800' },
  REFUNDED:      { label: 'Đã hoàn tiền',    color: 'bg-blue-100 text-blue-800' },
  REFUND_PENDING:{ label: 'Đang hoàn tiền',  color: 'bg-yellow-100 text-yellow-800' },
};

function ParticipationCard({ item }: { item: ParticipationItem }) {
  const match = item.casualMatch;
  const booking = match?.booking;
  const field = (booking as any)?.fieldYard?.footballField;
  const joinCfg = JOIN_STATUS_CONFIG[item.joinStatus] ?? { label: item.joinStatus, color: 'bg-gray-100 text-gray-600', icon: null };
  const payCfg = PAY_STATUS_CONFIG[item.paymentStatus] ?? { label: item.paymentStatus, color: 'bg-gray-100 text-gray-600' };

  return (
    <Link
      href={`/casual-matches/participated/${item.casualMatchId}`}
      className="block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
    >
      <h3 className="font-bold text-gray-900 line-clamp-1">{match?.title || 'Trận vãng lai'}</h3>

      {field && (
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          {field.name} · {field.address}
        </p>
      )}

      {booking && (
        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          {new Date((booking as any).bookingDate).toLocaleDateString('vi-VN')} · {formatMatchTime((booking as any).startTime)} - {formatMatchTime((booking as any).endTime)}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* Join status */}
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${joinCfg.color}`}>
          {joinCfg.icon}
          {joinCfg.label}
        </span>
        {/* Payment status */}
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${payCfg.color}`}>
          {payCfg.label}
        </span>
        {/* Amount */}
        <span className="ml-auto text-sm font-bold text-gray-800">
          {Number(item.totalAmount).toLocaleString('vi-VN')}đ
        </span>
      </div>
    </Link>
  );
}

export default function ParticipatedMatchesPage() {
  const [filter, setFilter] = useState<ParticipationListParams>({ page: 1, limit: 10 });
  const { data, isLoading, isFetching, isError, refetch } = useGetMyParticipationsQuery(filter);

  const items = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử tham gia trận</h1>
            <p className="mt-1 text-sm text-gray-500">Danh sách các trận vãng lai bạn đã đăng ký</p>
          </div>
          {isFetching && !isLoading && <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />}
        </div>

        {/* Filter bar */}
        <div className="mb-5 flex flex-wrap gap-2">
          {(['', 'PENDING', 'APPROVED', 'CANCELLED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter((f) => ({ ...f, joinStatus: s || undefined, page: 1 }))}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                (filter.joinStatus ?? '') === s
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-emerald-400'
              }`}
            >
              {s === '' ? 'Tất cả' : (JOIN_STATUS_CONFIG[s]?.label ?? s)}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-10">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-700" />
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <section className="rounded-2xl border border-dashed border-red-200 bg-white p-10 text-center shadow-sm">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">Có lỗi xảy ra khi tải lịch sử tham gia.</p>
            <Button onClick={() => refetch()} className="mt-6 rounded-xl bg-emerald-700 hover:bg-emerald-800">
              Thử lại
            </Button>
          </section>
        )}

        {/* Empty */}
        {!isLoading && !isError && items.length === 0 && (
          <section className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="mt-3 max-w-md mx-auto text-sm text-gray-500">Bạn chưa tham gia trận vãng lai nào.</p>
            <Button asChild className="mt-6 rounded-xl bg-emerald-700 hover:bg-emerald-800">
              <Link href="/casual-matches">Tìm trận đang mở</Link>
            </Button>
          </section>
        )}

        {/* List */}
        {!isLoading && !isError && items.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <ParticipationCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              disabled={filter.page === 1}
              onClick={() => setFilter((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
              className="rounded-xl"
            >
              Trước
            </Button>
            <span className="text-sm text-gray-600">
              Trang {meta.page} / {meta.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={filter.page === meta.totalPages}
              onClick={() => setFilter((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
              className="rounded-xl"
            >
              Sau
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
