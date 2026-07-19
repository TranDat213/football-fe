'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  useDeleteCasualMatchMutation,
  useGetOwnerCasualMatchesQuery,
  useUpdateCasualMatchMutation,
  useUpdateCasualMatchStatusMutation,
} from '@/features/casual-match/api/casualMatch.api';
import { CasualMatchForm, matchToFormValues } from '@/features/casual-match/components/CasualMatchForm';
import type { CasualMatch, CasualMatchStatus } from '@/features/casual-match/types/casual-match.types';
import { toastApiError } from '@/features/casual-match/utils/error';
import { statusLabels, formatMatchTime } from '@/features/casual-match/utils/labels';
import type { CasualMatchFormValues } from '@/features/casual-match/schema/casual-match.schema';
import { Edit2, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function OwnerCasualMatchesPage() {
  const [status, setStatus] = useState<CasualMatchStatus | ''>('');
  const [date, setDate] = useState('');
  const [editing, setEditing] = useState<CasualMatch | null>(null);
  const { data, isLoading } = useGetOwnerCasualMatchesQuery({ status: status || undefined, date: date || undefined });
  const [updateMatch, { isLoading: isUpdating }] = useUpdateCasualMatchMutation();
  const [deleteMatch] = useDeleteCasualMatchMutation();
  const [updateStatus] = useUpdateCasualMatchStatusMutation();

  const handleUpdate = async (values: CasualMatchFormValues) => {
    if (!editing) return;
    try {
      await updateMatch({
        id: editing.id,
        title: values.title,
        description: values.description,
        slotPrice: values.slotPrice,
        joinDeadline: new Date(values.joinDeadline).toISOString(),
        visibility: values.visibility,
        teamMode: values.teamMode,
        skillLevel: values.skillLevel,
      }).unwrap();
      toast.success('Cập nhật trận vãng lai thành công');
      setEditing(null);
    } catch (error) {
      toastApiError(error, 'Cập nhật thất bại');
    }
  };

  const handleDelete = async (match: CasualMatch) => {
    if (!window.confirm('Bạn chắc chắn muốn xoá trận vãng lai này?')) return;
    try {
      await deleteMatch(match.id).unwrap();
      toast.success('Đã xoá trận vãng lai');
    } catch (error) {
      toastApiError(error, 'Xoá thất bại');
    }
  };

  const handleStatus = async (match: CasualMatch, nextStatus: CasualMatchStatus) => {
    try {
      await updateStatus({ id: match.id, status: nextStatus }).unwrap();
      toast.success('Đã cập nhật trạng thái');
    } catch (error) {
      toastApiError(error, 'Cập nhật trạng thái thất bại');
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý trận vãng lai</h1>
            <p className="mt-1 text-sm text-gray-500">Theo dõi và cập nhật các trận bạn đang host.</p>
          </div>
          <div className="flex gap-2">
            <select value={status} onChange={(event) => setStatus(event.target.value as CasualMatchStatus | '')} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
              <option value="">Tất cả trạng thái</option>
              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm" />
          </div>
        </div>

        {editing && (
          <section className="mb-6 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Sửa trận</h2>
              <Button variant="outline" className="rounded-xl" onClick={() => setEditing(null)}>Đóng</Button>
            </div>
            <CasualMatchForm
              hideTotalSlots
              isSubmitting={isUpdating}
              defaultValues={matchToFormValues(editing)}
              onSubmit={handleUpdate}
            />
          </section>
        )}

        {isLoading ? (
          <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
        ) : !data?.data.length ? (
          <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-sm text-gray-500">Chưa có trận vãng lai nào.</div>
        ) : (
          <div className="space-y-4">
            {data.data.map((match) => (
              <article key={match.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="font-bold text-gray-900">{match.title || 'Trận vãng lai'}</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {match.booking ? new Date(match.booking.bookingDate).toLocaleDateString('vi-VN') : ''} · {formatMatchTime(match.booking?.startTime)} - {formatMatchTime(match.booking?.endTime)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Còn {match.availableSlots}/{match.totalSlots} slot · {statusLabels[match.status]}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="rounded-xl" onClick={() => setEditing(match)}><Edit2 className="h-4 w-4" />Sửa</Button>
                    <Button variant="outline" className="rounded-xl text-red-600" onClick={() => handleDelete(match)}><Trash2 className="h-4 w-4" />Xoá</Button>
                    <select value={match.status} onChange={(event) => handleStatus(match, event.target.value as CasualMatchStatus)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
                      {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                    </select>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
