'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useGetMyParticipationsQuery, useCreateCasualMatchPaymentMutation, useCancelParticipationMutation } from '@/features/casual-match/api/casualMatch.api';
import { formatMatchTime, skillLevelLabels, statusLabels, teamModeLabels } from '@/features/casual-match/utils/labels';
import { toastApiError } from '@/features/casual-match/utils/error';
import { Calendar, Loader2, MapPin, Users, CreditCard } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

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

export default function ParticipationDetailPage() {
  const { id: matchId } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetMyParticipationsQuery({ limit: 50 });
  const [initPayment, { isLoading: isPaying }] = useCreateCasualMatchPaymentMutation();
  const [cancelParticipation, { isLoading: isCancelling }] = useCancelParticipationMutation();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // ponytail: reuse existing participations query, filter client-side — avoids new endpoint
  const item = data?.data.find((p) => p.casualMatchId === matchId);
  const match = item?.casualMatch;
  const booking = match?.booking;
  const field = (booking as any)?.fieldYard?.footballField;

  const handlePay = async () => {
    try {
      const result = await initPayment(matchId).unwrap();
      toast.success('Đang chuyển sang VNPay...');
      window.location.href = result.data.paymentUrl;
    } catch (err) {
      toastApiError(err, 'Tạo thanh toán thất bại');
    }
  };

  const handleCancelParticipation = async () => {
    try {
      const res = await cancelParticipation({ id: matchId, reason: cancelReason }).unwrap();
      toast.success(res.message || 'Hủy tham gia thành công');
      setShowCancelModal(false);
      setCancelReason('');
    } catch (err) {
      toastApiError(err, 'Hủy tham gia thất bại');
    }
  };

  if (isLoading) return <Shell><div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div></Shell>;
  if (isError || !item) return <Shell><p className="py-16 text-center text-red-600">Khong tim thay thong tin tham gia.</p></Shell>;

  const pay = PAY_STATUS[item.paymentStatus] ?? { label: item.paymentStatus, color: 'bg-gray-100 text-gray-600' };
  const join = JOIN_STATUS[item.joinStatus] ?? { label: item.joinStatus, color: 'bg-gray-100 text-gray-600' };

  return (
    <Shell>
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-8">
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="bg-emerald-700 p-6 text-white">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">{statusLabels[match?.status ?? 'OPEN']}</span>
            <h1 className="mt-3 text-2xl font-bold">{match?.title || 'Tran vang lai'}</h1>
            {match?.description && <p className="mt-2 text-emerald-100 text-sm">{match.description}</p>}
          </div>

          <div className="space-y-4 p-6">
            {field && (
              <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
                <MapPin className="h-4 w-4 mt-0.5 text-emerald-700" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Dia diem</p>
                  <p className="text-sm text-gray-900 mt-0.5">{field.name} - {field.address}</p>
                </div>
              </div>
            )}
            {booking && (
              <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
                <Calendar className="h-4 w-4 mt-0.5 text-emerald-700" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Thoi gian</p>
                  <p className="text-sm text-gray-900 mt-0.5">{new Date((booking as any).bookingDate).toLocaleDateString('vi-VN')} - {formatMatchTime((booking as any).startTime)} den {formatMatchTime((booking as any).endTime)}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 p-4">
              <Users className="h-4 w-4 mt-0.5 text-emerald-700" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Trinh do / Doi</p>
                <p className="text-sm text-gray-900 mt-0.5">{skillLevelLabels[match?.skillLevel ?? 'ANY']} - {teamModeLabels[match?.teamMode ?? 'NO_TEAM']}</p>
              </div>
            </div>
          </div>

          {/* My booking summary */}
          <div className="border-t border-gray-100 bg-gray-50 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Thong tin dat slot cua ban</h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white border border-gray-100 p-3">
                <p className="text-xs text-gray-400">So slot</p>
                <p className="font-bold text-gray-900 mt-0.5">{item.slotCount} slot</p>
              </div>
              <div className="rounded-xl bg-white border border-gray-100 p-3">
                <p className="text-xs text-gray-400">Don gia</p>
                <p className="font-bold text-gray-900 mt-0.5">{Number(item.unitPrice).toLocaleString('vi-VN')}d/slot</p>
              </div>
              <div className="rounded-xl bg-white border border-gray-100 p-3">
                <p className="text-xs text-gray-400">Tong tien</p>
                <p className="font-bold text-emerald-700 mt-0.5">{Number(item.totalAmount).toLocaleString('vi-VN')}d</p>
              </div>
              {item.selectedTeam && (
                <div className="rounded-xl bg-white border border-gray-100 p-3">
                  <p className="text-xs text-gray-400">Doi</p>
                  <p className="font-bold text-gray-900 mt-0.5">{item.selectedTeam === 'TEAM_A' ? 'Doi A' : 'Doi B'}</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className={'rounded-full px-3 py-1 text-xs font-semibold ' + join.color}>{join.label}</span>
              <span className={'rounded-full px-3 py-1 text-xs font-semibold ' + pay.color}>{pay.label}</span>
            </div>

            {item.paymentStatus === 'UNPAID' && item.joinStatus !== 'CANCELLED' && (
              <div className="mt-5 rounded-xl bg-orange-50 border border-orange-200 p-4">
                <p className="text-sm text-orange-800 font-medium">Bạn chưa thanh toán cho trận này.</p>
                <p className="text-xs text-orange-600 mt-1">Vui lòng thanh toán để xác nhận tham gia.</p>
                <Button
                  onClick={handlePay}
                  disabled={isPaying}
                  className="mt-3 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 w-full h-10">
                  {isPaying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  Thanh toán ngay
                </Button>
              </div>
            )}

            {item.joinStatus !== 'CANCELLED' && (
              <div className="mt-5 border-t border-gray-200 pt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(true)}
                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Hủy tham gia trận
                </Button>
              </div>
            )}

            {item.paidAt && (
              <p className="mt-3 text-xs text-gray-400">Đã thanh toán lúc: {new Date(item.paidAt).toLocaleString('vi-VN')}</p>
            )}
            {item.transactionCode && (
              <p className="text-xs text-gray-400">Mã giao dịch: {item.transactionCode}</p>
            )}
          </div>
        </section>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900">Xác nhận hủy tham gia</h3>
              <p className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                <b>Lưu ý:</b> Bạn chỉ được hủy tham gia trước hạn đăng ký / giờ thi đấu ít nhất 1 giờ. Nếu bạn đã thanh toán, số tiền sẽ được hoàn lại tự động qua VNPay.
              </p>
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-700 mb-1">Lý do hủy (không bắt buộc)</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do hủy..."
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-emerald-600"
                  rows={3}
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl"
                  disabled={isCancelling}
                  onClick={() => setShowCancelModal(false)}
                >
                  Bỏ qua
                </Button>
                <Button
                  onClick={handleCancelParticipation}
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
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-gray-50"><Header />{children}<Footer /></div>;
}
