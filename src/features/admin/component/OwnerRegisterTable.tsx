'use client';
import { OwnerRegisterPending } from '../type/admin.type';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import {
  CheckCircle,
  Phone,
  XCircle,
  Loader2,
  Eye,
} from 'lucide-react';
import { useState } from 'react';

type RegisterStatus = 'PENDING' | 'CONTACTING' | 'APPROVED' | 'REJECTED';

interface Props {
  records: OwnerRegisterPending[];
  isLoading: boolean;
  isUpdating?: boolean;
  onApprove: (record: OwnerRegisterPending) => Promise<void>;
  onUpdateStatus: (id: string, status: RegisterStatus) => Promise<void>;
  onViewDetail: (id: string) => void;
}

const STATUS_MAP: Record<RegisterStatus, { label: string; className: string }> = {
  PENDING:    { label: 'Chờ xử lý',    className: 'bg-yellow-50 text-yellow-600' },
  CONTACTING: { label: 'Đang liên hệ', className: 'bg-blue-50 text-blue-600' },
  APPROVED:   { label: 'Đã duyệt',     className: 'bg-emerald-50 text-emerald-600' },
  REJECTED:   { label: 'Từ chối',      className: 'bg-red-50 text-red-600' },
};

export function OwnerRegisterTable({
  records,
  isLoading,
  isUpdating,
  onApprove,
  onUpdateStatus,
  onViewDetail,
}: Props) {
  const [processingId, setProcessingId] = useState<string | null>(null);

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
        Không có phiếu đăng ký nào
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-b border-gray-100">
          <tr>
            {['Người đăng ký', 'Liên hệ', 'Sân / Địa chỉ', 'Ngày nộp', 'Trạng thái', 'Thao tác'].map((h) => (
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
            const status = rec.status as RegisterStatus;
            const cfg = STATUS_MAP[status] ?? STATUS_MAP.PENDING;
            const isProcessing = processingId === rec.id;
            const isApproved = status === 'APPROVED';
            const isRejected = status === 'REJECTED';
            const isFinal = isApproved || isRejected;

            return (
              <tr key={rec.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Người đăng ký */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {rec.firstName[0]}{rec.lastName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {rec.firstName} {rec.lastName}
                      </p>
                      <p className="text-xs text-gray-400">{rec.email}</p>
                    </div>
                  </div>
                </td>

                {/* Liên hệ */}
                <td className="px-6 py-4">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone className="h-3 w-3 shrink-0" />
                    {rec.phone ?? 'Chưa cung cấp'}
                  </p>
                </td>

                {/* Sân / Địa chỉ */}
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-gray-800">
                    {rec.stadiumName ?? '—'}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 max-w-[180px] truncate">
                    {rec.address ?? ''}
                  </p>
                </td>

                {/* Ngày nộp */}
                <td className="px-6 py-4 text-xs text-gray-500 font-medium whitespace-nowrap">
                  {format(new Date(rec.createdAt), 'dd MMM yyyy', { locale: vi })}
                </td>

                {/* Trạng thái */}
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] uppercase font-bold tracking-tighter ${cfg.className}`}>
                    {cfg.label}
                  </span>
                </td>

                {/* Thao tác */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                    ) : (
                      <>
                        {/* Xem chi tiết */}
                        <button
                          onClick={() => onViewDetail(rec.id)}
                          title="Xem chi tiết"
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Đang liên hệ */}
                        {!isFinal && (
                          <button
                            onClick={() => wrap(rec.id, () => onUpdateStatus(rec.id, 'CONTACTING'))}
                            disabled={status === 'CONTACTING' || isUpdating}
                            title="Đánh dấu đang liên hệ"
                            className={`p-1.5 rounded-lg transition-all ${
                              status === 'CONTACTING'
                                ? 'text-blue-200 cursor-not-allowed'
                                : 'text-blue-500 hover:bg-blue-50'
                            }`}
                          >
                            <Phone className="h-4 w-4" />
                          </button>
                        )}

                        {/* Duyệt */}
                        {!isFinal && (
                          <button
                            onClick={() => wrap(rec.id, () => onApprove(rec))}
                            disabled={isUpdating}
                            title="Duyệt & tạo tài khoản"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}

                        {/* Từ chối */}
                        {!isFinal && (
                          <button
                            onClick={() => wrap(rec.id, () => onUpdateStatus(rec.id, 'REJECTED'))}
                            disabled={isUpdating}
                            title="Từ chối"
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-all"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}