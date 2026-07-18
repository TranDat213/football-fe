'use client';

interface DateFilterProps {
  value: string; // yyyy-MM-dd
  onChange: (value: string) => void;
  className?: string;
}

export function DateFilter({ value, onChange, className = '' }: DateFilterProps) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${className}`}
    />
  );
}