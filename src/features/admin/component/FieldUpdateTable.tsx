'use client';
import {
  FootballFieldUpdateRequest,
  FootballFieldUpdateRequestStatus,
} from '@/features/pitch/types/pich.types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle, XCircle, Loader2, Eye } from 'lucide-react';
import { useState } from 'react';

interface Props {
  records: FootballFieldUpdateRequest[];
  isLoading: boolean;
  isUpdating?: boolean;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onViewDetail: (id: string) => void;
}

const STATUS_MAP: Record<
  FootballFieldUpdateRequestStatus,
  { label: string; className: string }
> = {
  PENDING: { label: 'Chờ duyệt', className: 'bg-yellow-50 text-yellow-600' },
  CONFIRMED: { label: 'Đã duyệt', className: 'bg-emerald-50 text-emerald-600' },
  REJECTED: { label: 'Từ chối', className: 'bg-red-50 text-red-600' },
};

const FIELD_LABEL: Record<string, string> = {
  name: 'Tên sân',
  description: 'Mô tả',
  categoryId: 'Danh mục',
  address: 'Địa chỉ',
  province: 'Tỉnh/TP',
  district: 'Quận/Huyện',
  ward: 'Phường/Xã',
  latitude: 'Vĩ độ',
  longitude: 'Kinh độ',
  openTime: 'Giờ mở',
  closeTime: 'Giờ đóng',
  images: 'Hình ảnh',
  yards: 'Sân con',
};

const shortId = (id: string) => `${id.slice(0, 8)}…`;

export function FieldUpdateRequestTable({
  records,
  isLoading,
  isUpdating,
  onApprove,
  onReject,
  onViewDetail,
}: Props) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const wrap = async (id: string, fn: () => Promise<void>) => {
    setProcessingId(id);
    try {
      await fn();
    } finally {
      setProcessingId(null);
    }
  };

  const submitReject = async (id: string) => {
    if (!reason.trim()) return;
    await wrap(id, () => onReject(id, reason.trim()));
    setRejectingId(null);
    setReason('');
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-16 w-full animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 font-medium">
        Không có yêu cầu cập nhật nào
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-b border-gray-100">
          <tr>
            {[
              'Sân',
              'Chủ sân',
              'Trường thay đổi',
              'Ngày gửi',
              'Trạng thái',
              'Thao tác',
            ].map((h) => (
              <th
                key={h}
                className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 last:text-right"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {records.map((rec) => {
            const cfg = STATUS_MAP[rec.status] ?? STATUS_MAP.PENDING;
            const isProcessing = processingId === rec.id;
            const isFinal = rec.status !== 'PENDING';
            const changedFields = Object.keys(rec.payload ?? {});

            return (
              <tr
                key={rec.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p
                    className="text-sm font-bold text-gray-900"
                    title={rec.footballField.name}
                  >
                    {shortId(rec.footballField.name)}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <p className="text-xs text-gray-500" title={rec.footballField.owner.username}>
                    {shortId(rec.footballField.owner.username)}
                  </p>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1 max-w-[220px]">
                    {changedFields.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600"
                      >
                        {FIELD_LABEL[f] ?? f}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="px-6 py-4 text-xs text-gray-500 font-medium whitespace-nowrap">
                  {format(new Date(rec.createdAt), 'dd MMM yyyy', {
                    locale: vi,
                  })}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] uppercase font-bold tracking-tighter ${cfg.className}`}
                  >
                    {cfg.label}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  {rejectingId === rec.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <input
                        autoFocus
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Lý do từ chối..."
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 w-40 focus:outline-none focus:border-red-400"
                      />
                      <button
                        onClick={() => submitReject(rec.id)}
                        disabled={!reason.trim() || isUpdating}
                        className="text-[10px] font-bold uppercase text-red-600 hover:underline disabled:opacity-40"
                      >
                        Gửi
                      </button>
                      <button
                        onClick={() => {
                          setRejectingId(null);
                          setReason('');
                        }}
                        className="text-[10px] font-bold uppercase text-gray-400 hover:underline"
                      >
                        Huỷ
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-1">
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                      ) : (
                        <>
                          <button
                            onClick={() => onViewDetail(rec.id)}
                            title="Xem chi tiết"
                            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {!isFinal && (
                            <>
                              <button
                                onClick={() =>
                                  wrap(rec.id, () => onApprove(rec.id))
                                }
                                disabled={isUpdating}
                                title="Duyệt yêu cầu"
                                className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>

                              <button
                                onClick={() => setRejectingId(rec.id)}
                                disabled={isUpdating}
                                title="Từ chối"
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
