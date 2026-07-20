'use client';

const STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Thanh toán tại sân' },
  { value: 'AWAITING_PAYMENT', label: 'Chờ thanh toán' },
  { value: 'CONFIRMED', label: 'Đã xác nhận' },
  { value: 'CANCELLED', label: 'Đã huỷ' },
];

interface BookingStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function BookingStatusFilter({ value, onChange, className = '' }: BookingStatusFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${className}`}
    >
      <option value="">Tất cả trạng thái</option>
      {STATUS_OPTIONS.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}