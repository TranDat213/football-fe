'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  useCreateCasualMatchPaymentMutation,
  useGetCasualMatchByIdQuery,
  useJoinCasualMatchMutation,
} from '@/features/casual-match/api/casualMatch.api';
import { toastApiError } from '@/features/casual-match/utils/error';
import { skillLevelLabels, statusLabels, teamModeLabels } from '@/features/casual-match/utils/labels';
import type { CasualMatchTeamSide } from '@/features/casual-match/types/casual-match.types';
import type { RootState } from '@/store/store';
import { Calendar, Loader2, MapPin, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

export default function CasualMatchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { data, isLoading, error } = useGetCasualMatchByIdQuery(id, {
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const [slots, setSlots] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState<CasualMatchTeamSide | ''>('');
  const [joinMatch, { isLoading: isJoining }] = useJoinCasualMatchMutation();
  const [createPayment, { isLoading: isPaying }] = useCreateCasualMatchPaymentMutation();

  const match = data?.data;
  const isHost = Boolean(currentUser?.id && match?.hostId === currentUser.id);

  const handleJoin = async () => {
    if (!match) return;
    try {
      await joinMatch({
        id: match.id,
        slotCount: slots,
        selectedTeam: selectedTeam || undefined,
      }).unwrap();
      const payment = await createPayment(match.id).unwrap();
      toast.success('Đăng ký thành công, đang chuyển sang VNPay');
      window.location.href = payment.data.paymentUrl;
    } catch (joinError) {
      toastApiError(joinError, 'Tham gia trận thất bại');
    }
  };

  if (isLoading) return <PageShell><div className="flex h-80 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div></PageShell>;
  if (error || !match) return <PageShell><div className="py-16 text-center text-red-600">Không tìm thấy trận vãng lai</div></PageShell>;

  const booking = match.booking;
  const field = booking?.fieldYard?.footballField;

  return (
    <PageShell>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-emerald-700 p-8 text-white">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{statusLabels[match.status]}</span>
            <h1 className="mt-4 text-3xl font-black">{match.title || 'Trận vãng lai'}</h1>
            {match.description && <p className="mt-2 max-w-2xl text-emerald-50">{match.description}</p>}
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Info icon={<MapPin />} label="Địa điểm" value={`${field?.name || 'Sân bóng'} · ${field?.address || ''}`} />
              <Info icon={<Calendar />} label="Thời gian" value={`${booking ? new Date(booking.bookingDate).toLocaleDateString('vi-VN') : ''} · ${booking?.startTime || ''} - ${booking?.endTime || ''}`} />
              <Info icon={<Users />} label="Slot" value={`Còn ${match.availableSlots}/${match.totalSlots} slot · ${Number(match.slotPrice).toLocaleString('vi-VN')}đ/slot`} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Badge label="Trình độ" value={skillLevelLabels[match.skillLevel]} />
                <Badge label="Chia đội" value={teamModeLabels[match.teamMode]} />
              </div>
            </div>

            <aside className="rounded-2xl bg-gray-50 p-5">
              <h2 className="font-bold text-gray-900">Tham gia trận</h2>
              {isHost ? (
                <p className="mt-3 text-sm text-gray-500">Bạn là host của trận này.</p>
              ) : (
                <div className="mt-4 space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400">Số slot</label>
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
                      onChange={(event) => setSelectedTeam(event.target.value as CasualMatchTeamSide)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                    >
                      <option value="">Chọn đội</option>
                      <option value="TEAM_A">Đội A</option>
                      <option value="TEAM_B">Đội B</option>
                    </select>
                  )}
                  <Button
                    disabled={isJoining || isPaying || match.availableSlots <= 0}
                    onClick={handleJoin}
                    className="h-11 w-full rounded-xl bg-emerald-700 hover:bg-emerald-800"
                  >
                    {(isJoining || isPaying) && <Loader2 className="h-4 w-4 animate-spin" />}
                    Tham gia
                  </Button>
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-gray-50"><Header />{children}<Footer /></div>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-xl border border-gray-100 p-4">
      <div className="text-emerald-700 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function Badge({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-gray-50 p-4 text-sm"><span className="text-gray-400">{label}: </span><b>{value}</b></div>;
}
