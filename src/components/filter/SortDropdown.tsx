'use client';

import { ArrowDownUp } from 'lucide-react';

export interface SortOption {
  value: string; // sortBy
  label: string;
  order?: 'asc' | 'desc'; // thứ tự mặc định khi chọn option này
}

interface SortDropdownProps {
  value: string; // sortBy hiện tại, '' = mặc định
  order: 'asc' | 'desc';
  onChange: (sortBy: string, order: 'asc' | 'desc') => void;
  options: SortOption[];
  className?: string;
}

export function SortDropdown({ value, order, onChange, options, className = '' }: SortDropdownProps) {
  const current = `${value}:${order}`;

  return (
    <div className={`relative flex items-center ${className}`}>
      <ArrowDownUp className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-gray-400" />
      <select
        value={current}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split(':');
          onChange(sortBy, sortOrder as 'asc' | 'desc');
        }}
        className="w-full appearance-none rounded-lg border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      >
        <option value=":asc">Mặc định</option>
        {options.map((o) => (
          <option key={`${o.value}:${o.order ?? 'asc'}`} value={`${o.value}:${o.order ?? 'asc'}`}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}