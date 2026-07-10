'use client';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Eye, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { FootballFieldUpdateRequest, FootballFieldUpdateRequestStatus } from '../types/pich.types';

interface Props {
  records: FootballFieldUpdateRequest[];
  isLoading: boolean;
  isDeleting?: boolean;
  onDelete: (id: string) => Promise<void>;
  onViewDetail: (id: string) => void;
}

const STATUS_MAP: Record<FootballFieldUpdateRequestStatus, { label: string; className: string }> = {
  PENDING:   { label: 'Chờ duyệt', className: 'bg-yellow-50 text-yellow-600' },
  CONFIRMED: { label: 'Đã duyệt', className: 'bg-emerald-50 text-emerald-600' },
  REJECTED:  { label: 'Từ chối',  className: 'bg-red-50 text-red-600' },
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

export function OwnerFieldUpdateRequestTable({
  records,
  isLoading,
  isDeleting,
  onDelete,
  onViewDetail,
}: Props) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const wrap = async (id: string, fn: () => Promise<void>) => {
    setProcessingId(id);
    try { await fn(); } finally { setProcessingId(null); }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 w-full animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 font-medium">
        Bạn chưa gửi yêu cầu chỉnh sửa nào
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-b border-gray-100">
          <tr>
            {['Sân', 'Trường thay đổi', 'Ngày gửi', 'Trạng thái', 'Ghi chú admin', 'Thao tác'].map((h) => (
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
            const changedFields = Object.keys(rec.payload ?? {});

            return (
              <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-bold text-gray-900">{rec.footballField.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 max-w-[180px] truncate">
                    {rec.footballField.address}
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
                  {format(new Date(rec.createdAt), 'dd MMM yyyy', { locale: vi })}
                </td>

                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] uppercase font-bold tracking-tighter ${cfg.className}`}>
                    {cfg.label}
                  </span>
                </td>

                <td className="px-6 py-4 max-w-[200px]">
                  <p className="text-xs text-gray-500 truncate">
                    {rec.reason ?? '—'}
                  </p>
                </td>

                <td className="px-6 py-4 text-right">
                  {confirmingId === rec.id ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-[10px] text-gray-500 font-medium">Xoá đơn này?</span>
                      <button
                        onClick={() => { wrap(rec.id, () => onDelete(rec.id)); setConfirmingId(null); }}
                        disabled={isDeleting}
                        className="text-[10px] font-bold uppercase text-red-600 hover:underline"
                      >
                        Xoá
                      </button>
                      <button
                        onClick={() => setConfirmingId(null)}
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

                          <button
                            onClick={() => setConfirmingId(rec.id)}
                            disabled={isDeleting}
                            title="Xoá yêu cầu"
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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