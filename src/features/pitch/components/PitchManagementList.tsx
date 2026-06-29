'use client';

import {
  Edit2,
  Trash2,
  Eye,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useGetPitchByOwnerIdQuery } from '../api/pitchAPI';


const STATUS_STYLE: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  REJECTED: 'bg-red-50 text-red-700 ring-red-600/10',
  INACTIVE: 'bg-gray-50 text-gray-700 ring-gray-600/10',
};

const STATUS_LABEL: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  APPROVED: 'Đã duyệt',
  PENDING: 'Chờ duyệt',
  REJECTED: 'Từ chối',
  INACTIVE: 'Ngừng hoạt động',
};

export default function PitchManagementList() {
  const {
    data,
    isLoading,
    error,
  } = useGetPitchByOwnerIdQuery();

  const pitches = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="rounded-xl bg-white p-6 text-center">
        Đang tải danh sách sân...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
        Không thể tải danh sách sân bóng
      </div>
    );
  }

  if (!pitches.length) {
    return (
      <div className="rounded-xl bg-white p-10 text-center">
        <h3 className="font-semibold text-gray-900">
          Chưa có sân bóng nào
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          Hãy tạo sân bóng đầu tiên của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pitches.map((pitch) => {
        const coverImage =
          pitch.images?.find((img: any) => img.isCover)?.url ||
          pitch.images?.[0]?.url ||
          '/images/field-placeholder.jpg';

        return (
          <div
            key={pitch.id}
            className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Image */}
              <div className="relative h-40 w-full sm:w-48 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={coverImage}
                  alt={pitch.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-gray-900">
                        {pitch.name}
                      </h3>

                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${
                          STATUS_STYLE[pitch.status] ??
                          STATUS_STYLE.INACTIVE
                        }`}
                      >
                        {STATUS_LABEL[pitch.status] ??
                          pitch.status}
                      </span>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5 text-gray-500">
                      <MapPin className="h-3.5 w-3.5" />

                      <span className="text-sm">
                        {[
                          pitch.address,
                          pitch.ward,
                          pitch.district,
                          pitch.province,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link href={`/pitch/${pitch.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-xl"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Link
                      href={`/owner/pitches/${pitch.id}/edit`}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 rounded-xl"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0 rounded-xl"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-50 pt-4">
                  <p className="text-xs text-gray-500">
                    Ngày tạo:{' '}
                    {pitch.createdAt
                      ? new Date(
                          pitch.createdAt
                        ).toLocaleDateString('vi-VN')
                      : '--'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}