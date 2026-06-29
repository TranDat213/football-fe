'use client';

import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type {
  PendingField,
  FieldStatus,
} from '@/features/admin/type/admin.type';

interface FieldTableProps {
  fields: (PendingField & { coverImage?: string })[];
  isLoading: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isUpdating?: boolean;
}

export function FieldTable({
  fields,
  isLoading,
  onApprove,
  onReject,
  isUpdating,
}: FieldTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    if (onApprove) {
      setUpdatingId(id);
      await onApprove(id);
      setUpdatingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (onReject) {
      setUpdatingId(id);
      await onReject(id);
      setUpdatingId(null);
    }
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

  if (fields.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 font-medium">
        Không có dữ liệu sân
      </div>
    );
  }

  const statusConfig: Record<
    FieldStatus,
    { label: string; className: string }
  > = {
    ACTIVE: { label: 'Hoạt động', className: 'bg-emerald-50 text-emerald-600' },
    PENDING: { label: 'Chờ duyệt', className: 'bg-orange-50 text-orange-500' },
    INACTIVE: { label: 'Tạm dừng', className: 'bg-gray-100 text-gray-500' },
  };

  return (
    <div className="rounded-2xl border border-gray-100 overflow-hidden bg-white shadow-sm overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Sân bóng
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Địa chỉ
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Khu vực
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Chủ sân
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400">
              Ngày tạo
            </th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 text-right">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {fields.map((field) => {
            const status = statusConfig[field.status];
            return (
              <tr
                key={field.id}
                className="hover:bg-gray-50/50 transition-colors"
              >
                {/* Tên sân + ảnh */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-50">
                      {field.coverImage ? (
                        <img
                          src={field.coverImage}
                          alt={field.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-emerald-50 flex items-center justify-center text-emerald-400 text-xs font-black">
                          SB
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">
                        {field.name}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium">
                        ID: {field.id.slice(0, 8)}…
                      </p>
                    </div>
                  </div>
                </td>

                {/* Địa chỉ */}
                <td className="px-6 py-4">
                  <p className="text-xs font-medium text-gray-700 max-w-[200px] truncate">
                    {field.address}
                  </p>
                </td>

                {/* Khu vực */}
                <td className="px-6 py-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-700">
                      {field.district}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {field.province}
                    </p>
                  </div>
                </td>
                {/* Chủ sân */}
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-gray-700">
                    {field.owner.firstName} {field.owner.lastName}
                  </p>
                  <p className="text-[11px] text-gray-400 font-medium italic">
                    {field.owner.email}
                  </p>
                </td>

                {/* Trạng thái */}
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] uppercase font-bold tracking-tighter ${status.className}`}
                  >
                    {status.label}
                  </span>
                </td>

                {/* Ngày tạo */}
                <td className="px-6 py-4 text-xs text-gray-500 font-medium">
                  {format(new Date(field.createdAt), 'dd MMM yyyy', {
                    locale: vi,
                  })}
                </td>

                {/* Thao tác */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {updatingId === field.id ? (
                      <Loader2 className="h-4 w-4 text-indigo-600 animate-spin" />
                    ) : (
                      <>
                        {field.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(field.id)}
                              disabled={isUpdating}
                              title="Duyệt sân"
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 disabled:text-emerald-300 disabled:cursor-not-allowed transition-all"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleReject(field.id)}
                              disabled={isUpdating}
                              title="Từ chối"
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 disabled:text-red-300 disabled:cursor-not-allowed transition-all"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        <button
                          title="Xem chi tiết"
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-all"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
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
