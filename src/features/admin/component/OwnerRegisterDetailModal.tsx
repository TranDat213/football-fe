'use client';
import { OwnerRegisterPending } from '../type/admin.type';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { X, MapPin, Phone, Mail, Building2, User, Clock } from 'lucide-react';

interface Props {
  data: OwnerRegisterPending | null;
  onClose: () => void;
}

const STATUS_MAP = {
  PENDING: { label: 'Chờ xử lý', className: 'bg-yellow-50 text-yellow-600' },
  CONTACTING: { label: 'Đang liên hệ', className: 'bg-blue-50 text-blue-600' },
  APPROVED: { label: 'Đã duyệt', className: 'bg-emerald-50 text-emerald-600' },
  REJECTED: { label: 'Từ chối', className: 'bg-red-50 text-red-600' },
} as const;

export function OwnerRegisterDetailModal({ data, onClose }: Props) {
  if (!data) return null;

  const statusCfg = STATUS_MAP[data.status as keyof typeof STATUS_MAP] ?? STATUS_MAP.PENDING;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 m-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5">
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-base font-bold text-gray-900">Chi tiết phiếu đăng ký</h2>
            <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] uppercase font-bold tracking-tighter ${statusCfg.className}`}>
              {statusCfg.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Nộp lúc{' '}
            {format(new Date(data.createdAt), 'HH:mm — dd MMMM yyyy', { locale: vi })}
          </p>
        </div>

        <div className="space-y-2.5">
          <Row icon={<User className="h-3.5 w-3.5" />} label="Họ tên">
            {data.firstName} {data.lastName}
          </Row>
          <Row icon={<Mail className="h-3.5 w-3.5" />} label="Email">
            {data.email}
          </Row>
          <Row icon={<Phone className="h-3.5 w-3.5" />} label="Điện thoại">
            {data.phone ?? 'Chưa cung cấp'}
          </Row>
          {data.stadiumName && (
            <Row icon={<Building2 className="h-3.5 w-3.5" />} label="Tên sân">
              {data.stadiumName}
            </Row>
          )}
          {data.address && (
            <Row icon={<MapPin className="h-3.5 w-3.5" />} label="Địa chỉ">
              {data.address}
            </Row>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-gray-50 px-4 py-3">
      <span className="mt-0.5 text-gray-400">{icon}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-medium text-gray-800">{children}</p>
      </div>
    </div>
  );
}