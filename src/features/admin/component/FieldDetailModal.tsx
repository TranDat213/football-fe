'use client';
import { useGetPitchByIdQuery } from '@/features/pitch/api/pitchAPI';
import type { PendingField } from '@/features/admin/type/admin.type';
import { YARD_TYPE, TIME_SLOT_LABEL } from '@/types/field.types';
import {
  X,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  Loader2,
  Image as ImageIcon,
  Phone,
  Mail,
} from 'lucide-react';

interface Props {
  field: PendingField | null;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  isUpdating?: boolean;
}

const DAY_LABEL: Record<number, string> = {
  0: 'CN',
  1: 'Thứ 2',
  2: 'Thứ 3',
  3: 'Thứ 4',
  4: 'Thứ 5',
  5: 'Thứ 6',
  6: 'Thứ 7',
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  ACTIVE: { label: 'Hoạt động', className: 'bg-emerald-50 text-emerald-600' },
  PENDING: { label: 'Chờ duyệt', className: 'bg-orange-50 text-orange-500' },
  INACTIVE: { label: 'Tạm dừng', className: 'bg-gray-100 text-gray-500' },
};

export function FieldDetailModal({
  field,
  onClose,
  onApprove,
  onReject,
  isUpdating,
}: Props) {
  // Fetch full detail by field ID from pitchAPI
  const { data: response, isLoading: isLoadingDetail } = useGetPitchByIdQuery(
    field?.id ?? '',
    { skip: !field?.id },
  );

  if (!field) return null;

  const detail = response?.data;
  const status = STATUS_CONFIG[field.status] ?? STATUS_CONFIG.PENDING;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">

        {/* ─── Header ─────────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-lg font-bold text-gray-900 truncate">
                {field.name}
              </h2>
              <span
                className={`shrink-0 inline-flex items-center rounded-lg px-2.5 py-0.5 text-[11px] font-bold ${status.className}`}
              >
                {status.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 font-medium">
              ID: {field.id.slice(0, 12)}…
            </p>
          </div>

          <div className="flex items-center gap-2 ml-4 shrink-0">
            {/* Action buttons - only show for PENDING */}
            {field.status === 'PENDING' && (
              <>
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 text-indigo-500 animate-spin" />
                ) : (
                  <>
                    <button
                      onClick={() => onApprove?.(field.id)}
                      disabled={isUpdating}
                      title="Duyệt sân"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs font-bold transition-colors disabled:opacity-40"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Duyệt
                    </button>
                    <button
                      onClick={() => onReject?.(field.id)}
                      disabled={isUpdating}
                      title="Từ chối"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 text-xs font-bold transition-colors disabled:opacity-40"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Từ chối
                    </button>
                  </>
                )}
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ─── Body ───────────────────────────────────────────────── */}
        <div className="px-6 py-5 space-y-6">

          {/* Thông tin Chủ sân */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-indigo-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                Thông tin chủ sân
              </h3>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 divide-y divide-gray-100">
              <div className="px-4 py-2.5 flex items-center gap-3 text-sm">
                <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-xs font-bold text-gray-500 w-20 shrink-0">
                  Họ tên
                </span>
                <span className="text-gray-800 font-medium">
                  {field.owner.firstName} {field.owner.lastName}
                </span>
              </div>
              <div className="px-4 py-2.5 flex items-center gap-3 text-sm">
                <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-xs font-bold text-gray-500 w-20 shrink-0">
                  Email
                </span>
                <span className="text-gray-800 font-medium">{field.owner.email}</span>
              </div>
              {field.owner.phone && (
                <div className="px-4 py-2.5 flex items-center gap-3 text-sm">
                  <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  <span className="text-xs font-bold text-gray-500 w-20 shrink-0">
                    Điện thoại
                  </span>
                  <span className="text-gray-800 font-medium">{field.owner.phone}</span>
                </div>
              )}
            </div>
          </section>

          {/* Loading state for detail */}
          {isLoadingDetail && (
            <div className="flex items-center justify-center py-8 gap-2 text-gray-400">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Đang tải chi tiết sân…</span>
            </div>
          )}

          {detail && (
            <>
              {/* Thông tin chung */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Thông tin chung
                  </h3>
                </div>
                <div className="rounded-xl border border-gray-100 divide-y divide-gray-50">
                  {detail.description && (
                    <div className="px-4 py-2.5 flex items-start gap-3 text-sm">
                      <span className="text-xs font-bold text-gray-500 w-28 shrink-0 pt-0.5">
                        Mô tả
                      </span>
                      <span className="text-gray-700 leading-relaxed">{detail.description}</span>
                    </div>
                  )}
                  <div className="px-4 py-2.5 flex items-start gap-3 text-sm">
                    <span className="text-xs font-bold text-gray-500 w-28 shrink-0 pt-0.5">
                      Địa chỉ
                    </span>
                    <span className="text-gray-800">
                      {[field.address, detail.ward, field.district, field.province]
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </div>
                  <div className="px-4 py-2.5 flex items-center gap-3 text-sm">
                    <span className="text-xs font-bold text-gray-500 w-28 shrink-0">
                      Giờ hoạt động
                    </span>
                    <span className="text-gray-800 font-medium">
                      {detail.openTime} – {detail.closeTime}
                    </span>
                  </div>
                  {(detail.latitude || detail.longitude) && (
                    <div className="px-4 py-2.5 flex items-center gap-3 text-sm">
                      <span className="text-xs font-bold text-gray-500 w-28 shrink-0">
                        Tọa độ GPS
                      </span>
                      <span className="text-gray-600 font-mono text-xs">
                        {detail.latitude}, {detail.longitude}
                      </span>
                    </div>
                  )}
                </div>
              </section>

              {/* Hình ảnh */}
              {detail.images && detail.images.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon className="w-4 h-4 text-purple-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Hình ảnh ({detail.images.length})
                    </h3>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {detail.images
                      .slice()
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((img) => (
                        <div
                          key={img.id}
                          className="relative rounded-xl overflow-hidden border border-gray-100 aspect-square bg-gray-50"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          {img.isCover && (
                            <span className="absolute top-1 left-1 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                              Ảnh bìa
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </section>
              )}

              {/* Sân con & Khung giờ */}
              {detail.yards && detail.yards.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Sân con & Khung giờ ({detail.yards.length} sân)
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {detail.yards.map((yard, i) => (
                      <div
                        key={yard.id ?? i}
                        className="rounded-xl border border-gray-100 overflow-hidden"
                      >
                        {/* Yard header */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50/70 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-800">
                            {yard.name}
                          </p>
                          <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg">
                            {YARD_TYPE[yard.type] ?? yard.type}
                          </span>
                        </div>

                        {/* Time slots */}
                        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {yard.timeSlots.length === 0 ? (
                            <p className="text-xs text-gray-400 italic col-span-2">
                              Chưa có khung giờ nào
                            </p>
                          ) : (
                            yard.timeSlots.map((slot, j) => (
                              <div
                                key={slot.id ?? j}
                                className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-2.5 py-2 border border-gray-100"
                              >
                                <div className="space-y-0.5">
                                  <span className="font-bold text-gray-700">
                                    {DAY_LABEL[slot.dayOfWeek] ?? slot.dayOfWeek}
                                  </span>
                                  <p className="text-gray-500">
                                    {slot.startTime} – {slot.endTime}
                                  </p>
                                  <span className="text-[10px] text-indigo-500 font-semibold">
                                    {TIME_SLOT_LABEL[slot.label as keyof typeof TIME_SLOT_LABEL] ?? slot.label}
                                  </span>
                                </div>
                                <span className="text-emerald-700 font-bold text-sm ml-4 shrink-0">
                                  {slot.priceRule?.price?.toLocaleString('vi-VN')}đ
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
