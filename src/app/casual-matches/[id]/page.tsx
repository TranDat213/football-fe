'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  useGetCasualMatchByIdQuery,
  useGetMatchParticipantsQuery,
  useJoinCasualMatchMutation,
} from '@/features/casual-match/api/casualMatch.api';
import { toastApiError } from '@/features/casual-match/utils/error';
import {
  skillLevelLabels,
  statusLabels,
  teamModeLabels,
  formatMatchTime,
} from '@/features/casual-match/utils/labels';
import type { CasualMatchTeamSide } from '@/features/casual-match/types/casual-match.types';
import { useAppSelector } from '@/store/store';
import { Calendar, Loader2, Mail, MapPin, Phone, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const PAY_STATUS: Record<string, { label: string; color: string }> = {
  UNPAID: { label: 'Chua thanh toan', color: 'bg-orange-100 text-orange-800' },
  PAID: { label: 'Da thanh toan', color: 'bg-emerald-100 text-emerald-800' },
  REFUNDED: { label: 'Da hoan tien', color: 'bg-blue-100 text-blue-800' },
  REFUND_PENDING: {
    label: 'Dang hoan tien',
    color: 'bg-yellow-100 text-yellow-800',
  },
};

const JOIN_STATUS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Cho xac nhan', color: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: 'Da duyet', color: 'bg-emerald-100 text-emerald-800' },
  CANCELLED: { label: 'Da huy', color: 'bg-red-100 text-red-800' },
  REJECTED: { label: 'Bi tu choi', color: 'bg-gray-100 text-gray-600' },
  WAITLISTED: { label: 'Cho danh sach', color: 'bg-blue-100 text-blue-800' },
};

export default function CasualMatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const currentUser = useAppSelector((state) => state.auth.user);
  const { data, isLoading, error } = useGetCasualMatchByIdQuery(id, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const { data: participantData, isLoading: participantsLoading } =
    useGetMatchParticipantsQuery(id);
  const participants = participantData?.data.participants ?? [];
  const totalCollected = participants
    .filter((p) => p.paymentStatus == 'PAID')
    .reduce((s, p) => s + Number(p.totalAmount), 0);
  const [slots, setSlots] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState<CasualMatchTeamSide | ''>(
    '',
  );
  const [joinMatch, { isLoading: isJoining }] = useJoinCasualMatchMutation();

  const match = data?.data;
  const isHost = Boolean(currentUser?.id && match?.hostId === currentUser.id);

  const handleJoin = async () => {
    if (!match) return;
    try {
      const result = await joinMatch({
        id: match.id,
        slotCount: slots,
        selectedTeam: selectedTeam || undefined,
      }).unwrap();
      toast.success('Đăng ký thành công, đang chuyển sang VNPay');
      window.location.href = result.data.paymentUrl;
    } catch (joinError) {
      toastApiError(joinError, 'Tham gia trận thất bại');
    }
  };

  if (isLoading)
    return (
      <PageShell>
        <div className="flex h-80 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      </PageShell>
    );
  if (error || !match)
    return (
      <PageShell>
        <div className="py-16 text-center text-red-600">
          Không tìm thấy trận vãng lai
        </div>
      </PageShell>
    );

  const booking = match.booking;
  const field = booking?.fieldYard?.footballField;

  return (
    <PageShell>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-emerald-700 p-8 text-white">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
              {statusLabels[match.status]}
            </span>
            <h1 className="mt-4 text-3xl font-bold">
              {match.title || 'Trận vãng lai'}
            </h1>
            {match.description && (
              <p className="mt-2 max-w-2xl text-emerald-50">
                {match.description}
              </p>
            )}
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Info
                icon={<MapPin />}
                label="Địa điểm"
                value={`${field?.name || 'Sân bóng'} · ${field?.address || ''}`}
              />
              <Info
                icon={<Calendar />}
                label="Thời gian"
                value={`${booking ? new Date(booking.bookingDate).toLocaleDateString('vi-VN') : ''} · ${formatMatchTime(booking?.startTime)} - ${formatMatchTime(booking?.endTime)}`}
              />
              <Info
                icon={<Users />}
                label="Slot"
                value={`Còn ${match.availableSlots}/${match.totalSlots} slot · ${Number(match.slotPrice).toLocaleString('vi-VN')}đ/slot`}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <Badge
                  label="Trình độ"
                  value={skillLevelLabels[match.skillLevel]}
                />
                <Badge
                  label="Chia đội"
                  value={teamModeLabels[match.teamMode]}
                />
              </div>
             
            </div>

            <aside className="rounded-2xl bg-gray-50 p-5">
              <h2 className="font-bold text-gray-900">Tham gia trận</h2>
              {isHost ? (
                <p className="mt-3 text-sm text-gray-500">
                  Bạn là host của trận này.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">
                    Số slot
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, match.availableSlots)}
                    value={slots}
                    onChange={(event) => setSlots(Number(event.target.value))}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                  />
                  {match.teamMode !== 'NO_TEAM' && (
                    <select
                      value={selectedTeam}
                      onChange={(event) =>
                        setSelectedTeam(
                          event.target.value as CasualMatchTeamSide,
                        )
                      }
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                    >
                      <option value="">Chọn đội</option>
                      <option value="TEAM_A">Đội A</option>
                      <option value="TEAM_B">Đội B</option>
                    </select>
                  )}
                  <Button
                    disabled={isJoining || match.availableSlots <= 0}
                    onClick={handleJoin}
                    className="h-11 w-full rounded-xl bg-emerald-700 text-white hover:bg-emerald-800"
                  >
                    {isJoining && <Loader2 className="h-4 w-4 animate-spin" />}
                    Tham gia
                  </Button>
                </div>
                
              )}
            </aside>
          </div>
        </section>
         <div>
                <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-900">
                      Danh sach nguoi dang ky
                    </h2>
                  </div>
                  {participants.length === 0 ? (
                    <p className="px-5 py-10 text-center text-sm text-gray-500">
                      Chua co ai dang ky tran nay.
                    </p>
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
                            <th className="py-3 pl-3 pr-4 text-left">Vai tro</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Hàng host — lấy từ participants[0].casualMatch?.host */}
                          {(() => {
                            const host = participants[0]?.casualMatch?.host;
                            if (!host) return null;
                            const hostName =
                              [host.firstName, host.lastName]
                                .filter(Boolean)
                                .join(' ') || 'Khong ro';
                            return (
                              <tr className="border-b border-emerald-100 bg-emerald-50">
                                <td className="py-3 pl-4 pr-3 text-sm text-gray-500">—</td>
                                <td className="py-3 px-3 font-medium text-gray-900">
                                  {hostName}
                                </td>
                                <td className="py-3 px-3">
                                  {host.email && (
                                    <a
                                      href={'mailto:' + host.email}
                                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-700"
                                    >
                                      <Mail className="h-3.5 w-3.5 shrink-0" />
                                      {host.email}
                                    </a>
                                  )}
                                </td>
                                <td className="py-3 px-3">
                                  {host.phone && (
                                    <a
                                      href={'tel:' + host.phone}
                                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-700"
                                    >
                                      <Phone className="h-3.5 w-3.5 shrink-0" />
                                      {host.phone}
                                    </a>
                                  )}
                                </td>
                                <td className="py-3 px-3" />
                                <td className="py-3 px-3" />
                                <td className="py-3 px-3" />
                                <td className="py-3 pl-3 pr-4" />
                                <td className="py-3 pl-3 pr-4">
                                  <span className="rounded-full bg-emerald-700 px-2.5 py-0.5 text-xs font-semibold text-white">
                                    Host
                                  </span>
                                </td>
                              </tr>
                            );
                          })()}
                          {participants.map((p, i) => {
                            const pay = PAY_STATUS[p.paymentStatus] ?? {
                              label: p.paymentStatus,
                              color: 'bg-gray-100 text-gray-600',
                            };
                            const join = JOIN_STATUS[p.joinStatus] ?? {
                              label: p.joinStatus,
                              color: 'bg-gray-100 text-gray-600',
                            };
                            const name =
                              [p.user?.firstName, p.user?.lastName]
                                .filter(Boolean)
                                .join(' ') || 'Khong ro';
                            const hostname =
                              [p.casualMatch?.host?.firstName, p.casualMatch?.host?.lastName]
                                .filter(Boolean)
                                .join(' ') || 'Khong ro';
                            return (
                              <tr
                                key={p.id}
                                className="border-b border-gray-50 hover:bg-gray-50"
                              >
                                <td className="py-3 pl-4 pr-3 text-sm text-gray-500">
                                  {i + 1}
                                </td>
                                <td className="py-3 px-3 font-medium text-gray-900">
                                  {name}
                                </td>
                                <td className="py-3 px-3">
                                  {p.user?.email && (
                                    <a
                                      href={'mailto:' + p.user.email}
                                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-700"
                                    >
                                      <Mail className="h-3.5 w-3.5 shrink-0" />
                                      {p.user.email}
                                    </a>
                                  )}
                                </td>
                                <td className="py-3 px-3">
                                  {p.user?.phone && (
                                    <a
                                      href={'tel:' + p.user.phone}
                                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-emerald-700"
                                    >
                                      <Phone className="h-3.5 w-3.5 shrink-0" />
                                      {p.user.phone}
                                    </a>
                                  )}
                                </td>
                                <td className="py-3 px-3 text-center text-sm text-gray-700">
                                  {p.slotCount}
                                </td>
                                <td className="py-3 px-3 text-right text-sm font-semibold text-gray-800">
                                  {Number(p.totalAmount).toLocaleString(
                                    'vi-VN',
                                  )}
                                  d
                                </td>
                                <td className="py-3 px-3">
                                  <span
                                    className={
                                      'rounded-full px-2.5 py-0.5 text-xs font-semibold ' +
                                      join.color
                                    }
                                  >
                                    {join.label}
                                  </span>
                                </td>
                                <td className="py-3 pl-3 pr-4">
                                  <span
                                    className={
                                      'rounded-full px-2.5 py-0.5 text-xs font-semibold ' +
                                      pay.color
                                    }
                                  >
                                    {pay.label}
                                  </span>
                                </td>
                                <td className="py-3 pl-3 pr-4">
                                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600">
                                    Thanh vien
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
      </main>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-xl border border-gray-100 p-4">
      <div className="text-emerald-700 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-4 text-sm">
      <span className="text-gray-400">{label}: </span>
      <b>{value}</b>
    </div>
  );
}
