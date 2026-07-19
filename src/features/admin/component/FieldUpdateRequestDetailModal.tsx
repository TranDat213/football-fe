'use client';
import {
  FieldImageUploadedPayload,
  FootballFieldUpdateRequest,
  YardCompletePayload,
} from '@/features/pitch/types/pich.types';
import { X, Image as ImageIcon } from 'lucide-react';

interface Props {
  data: FootballFieldUpdateRequest | null;
  onClose: () => void;
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

const SIMPLE_FIELD_LABEL: Record<string, string> = {
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
};

function ImagesBlock({ images }: { images: FieldImageUploadedPayload[] }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {images
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((img) => (
          <div
            key={img.publicId}
            className="relative rounded-lg overflow-hidden border border-gray-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-20 w-full object-cover" />
            {img.isCover && (
              <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                Ảnh bìa
              </span>
            )}
          </div>
        ))}
    </div>
  );
}

function YardsBlock({ yards }: { yards: YardCompletePayload[] }) {
  return (
    <div className="space-y-3">
      {yards.map((yard, i) => (
        <div key={i} className="rounded-xl border border-gray-100 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-gray-800">{yard.name}</p>
            <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              {yard.type}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {yard.timeSlots.map((slot, j) => (
              <div
                key={slot.tempId ?? j}
                className="flex items-center justify-between text-xs bg-gray-50 rounded-lg px-2.5 py-1.5"
              >
                <span className="text-gray-600 font-medium">
                  {DAY_LABEL[slot.dayOfWeek] ?? slot.dayOfWeek} ·{' '}
                  {slot.startTime}-{slot.endTime}
                </span>
                <span className="text-gray-800 font-bold">
                  {slot.priceRule.price.toLocaleString('vi-VN')}đ
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function FieldUpdateRequestDetailModal({ data, onClose }: Props) {
  if (!data) return null;

  const { payload } = data;
  const simpleEntries = Object.entries(SIMPLE_FIELD_LABEL).filter(
    ([key]) => payload[key as keyof typeof payload] !== undefined,
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="text-lg font-bold text-gray-900">
            Chi tiết yêu cầu cập nhật
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-widest mb-1">
                Sân
              </p>
              <p className="text-gray-800 font-medium break-all">
                {data.footballField.name}
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-widest mb-1">
                Chủ sân
              </p>
              <p className="text-gray-800 font-medium break-all">
                {data.footballField.owner.username}
              </p>
            </div>
          </div>

          {data.reason && (
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-1">
                {data.status === 'REJECTED' ? 'Lý do từ chối' : 'Ghi chú'}
              </p>
              <p className="text-sm text-gray-700">{data.reason}</p>
            </div>
          )}

          {simpleEntries.length > 0 && (
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
                Thông tin chung
              </p>
              <div className="rounded-xl border border-gray-100 divide-y divide-gray-50">
                {simpleEntries.map(([key, label]) => (
                  <div
                    key={key}
                    className="px-4 py-2.5 flex items-center gap-4 text-sm"
                  >
                    <span className="text-xs font-bold text-gray-500 w-24 shrink-0">
                      {label}
                    </span>
                    <span className="text-gray-800">
                      {String(payload[key as keyof typeof payload])}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {payload.images && payload.images.length > 0 && (
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-1.5">
                <ImageIcon className="h-3 w-3" /> Hình ảnh
              </p>
              <ImagesBlock images={payload.images} />
            </div>
          )}

          {payload.yards && payload.yards.length > 0 && (
            <div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">
                Sân con & khung giờ
              </p>
              <YardsBlock yards={payload.yards} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
