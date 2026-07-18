'use client';

export interface FieldOption {
  value: string;
  label: string;
}

interface FootballFieldFilterProps {
  value: string;
  onChange: (value: string) => void;
  fields: FieldOption[];
  className?: string;
}

export function FootballFieldFilter({ value, onChange, fields, className = '' }: FootballFieldFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${className}`}
    >
      <option value="">Tất cả sân</option>
      {fields.map((f) => (
        <option key={f.value} value={f.value}>
          {f.label}
        </option>
      ))}
    </select>
  );
}