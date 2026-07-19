'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useGetMatchParticipantsQuery } from '@/features/casual-match/api/casualMatch.api';
import { formatMatchTime, skillLevelLabels, statusLabels } from '@/features/casual-match/utils/labels';
import { Calendar, Loader2, Mail, MapPin, Phone, Users } from 'lucide-react';
import { useParams } from 'next/navigation';

const PAY_STATUS: Record<string, { label: string; color: string }> = {
  UNPAID:         { label: 'Chua thanh toan', color: 'bg-orange-100 text-orange-800' },
  PAID:           { label: 'Da thanh toan',   color: 'bg-emerald-100 text-emerald-800' },
  REFUNDED:       { label: 'Da hoan tien',    color: 'bg-blue-100 text-blue-800' },
  REFUND_PENDING: { label: 'Dang hoan tien',  color: 'bg-yellow-100 text-yellow-800' },
};

const JOIN_STATUS: Record<string, { label: string; color: string }> = {
  PENDING:    { label: 'Cho xac nhan', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED:   { label: 'Da duyet',     color: 'bg-emerald-100 text-emerald-800' },
  CANCELLED:  { label: 'Da huy',       color: 'bg-red-100 text-red-800' },
  REJECTED:   { label: 'Bi tu choi',   color: 'bg-gray-100 text-gray-600' },
  WAITLISTED: { label: 'Cho danh sach',color: 'bg-blue-100 text-blue-800' },
};

export default function MatchParticipantsPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetMatchParticipantsQuery(id);
  const match = data?.data.match;
  const participants = data?.data.participants ?? [];
  const booking = match?.booking;
  const field = (booking as any)?.fieldYard?.footballField;
  const totalCollected = participants.filter(p => p.paymentStatus === 'PAID').reduce((s, p) => s + Number(p.totalAmount), 0);

  if (isLoading) return <Shell><div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div></Shell>;
  if (isError || !match) return <Shell><p className="py-16 text-center text-red-600">Khong co quyen xem hoac tran khong ton tai.</p></Shell>;

  return (
    <Shell>
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">
        <section className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-emerald-700 p-6 text-white">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{statusLabels[match.status]}</span>
            <h1 className="mt-3 text-2xl font-bold">{match.title || 'Tran vang lai'}</h1>
          </div>
          <div className="flex flex-wrap gap-5 p-5 text-sm text-gray-600">
            {field && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-emerald-600" />{field.name} - {field.address}</span>}
            {booking && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-emerald-600" />{new Date((booking as any).bookingDate).toLocaleDateString('vi-VN')} {formatMatchTime((booking as any).startTime)} - {formatMatchTime((booking as any).endTime)}</span>}
            <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-emerald-600" />{match.occupiedSlots}/{match.totalSlots} slot - {skillLevelLabels[match.skillLevel]}</span>
          </div>
          <div className="border-t border-gray-100 px-5 py-3 flex gap-6 text-sm">
            <span className="text-gray-500">Tong dang ky: <b className="text-gray-900">{participants.length}</b></span>
            <span className="text-gray-500">Da thanh toan: <b className="text-emerald-700">{participants.filter(p => p.paymentStatus === 'PAID').length}</b></span>
            <span className="text-gray-500">Doanh thu: <b className="text-emerald-700">{totalCollected.toLocaleString('vi-VN')}d</b></span>
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100"><h2 className="font-bold text-gray-900">Danh sach nguoi dang ky</h2></div>
          {participants.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-gray-500">Chua co ai dang ky tran nay.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    <th className="py-3 pl-4 pr-3 text-left">#</th>
                    <th className="py-3 px-3 text-left">Ho ten</th>
                    <th className="py-3 px-3 text-left">Email</th>
                    <th className="py-3 px-3 text-left">SDT</th>
                    <th className="py-3 px-3 text-center">Slot</th>
                    <th className="py-3 px-3 text-right">Tien</th>
                    <th className="py-3 px-3 text-left">Tham gia</th>
                    <th className="py-3 pl-3 pr-4 text-left">Thanh toan</th>
                  </tr>
                </thead>
                <tbody>
                  {participants.map((p, i) => {
                    const pay = PAY_STATUS[p.paymentStatus] ?? { label: p.paymentStatus, color: 'bg-gray-100 text-gray-600' };
                    const join = JOIN_STATUS[p.joinStatus] ?? { label: p.joinStatus, color: 'bg-gray-100 text-gray-600' };
                    const name = [p.user?.firstName, p.user?.lastName].filter(Boolean).join(' ') || 'Khong ro';
                    return (
                      <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 pl-4 pr-3 text-sm text-gray-500">{i + 1}</td>
                        <td className="py-3 px-3 font-medium text-gray-900">{name}</td>
                        <td className="py-3 px-3">{p.user?.email && <a href={'mailto:' + p.user.email} className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-700"><Mail className="h-3.5 w-3.5 shrink-0" />{p.user.email}</a>}</td>
                        <td className="py-3 px-3">{p.user?.phone && <a href={'tel:' + p.user.phone} className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-700"><Phone className="h-3.5 w-3.5 shrink-0" />{p.user.phone}</a>}</td>
                        <td className="py-3 px-3 text-center text-sm text-gray-700">{p.slotCount}</td>
                        <td className="py-3 px-3 text-right text-sm font-semibold text-gray-800">{Number(p.totalAmount).toLocaleString('vi-VN')}d</td>
                        <td className="py-3 px-3"><span className={'rounded-full px-2.5 py-0.5 text-xs font-semibold ' + join.color}>{join.label}</span></td>
                        <td className="py-3 pl-3 pr-4"><span className={'rounded-full px-2.5 py-0.5 text-xs font-semibold ' + pay.color}>{pay.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-gray-50"><Header />{children}<Footer /></div>;
}
