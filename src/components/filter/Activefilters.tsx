'use client';

import { X } from 'lucide-react';

export interface ActiveFilterChip {
  key: string;
  label: string; // vd: "Từ khóa: sân 5", "Giá: 100.000 - 300.000"
}

interface ActiveFiltersProps {
  chips: ActiveFilterChip[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
  className?: string;
}

export function ActiveFilters({ chips, onRemove, onClearAll, className = '' }: ActiveFiltersProps) {
  if (chips.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="flex items-center gap-1.5 rounded-full bg-emerald-50 py-1 pl-3 pr-1.5 text-xs font-medium text-emerald-800"
        >
          {chip.label}
          <button
            type="button"
            onClick={() => onRemove(chip.key)}
            className="rounded-full p-0.5 text-emerald-600 transition-colors hover:bg-emerald-100"
            aria-label={`Xóa bộ lọc ${chip.label}`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs font-medium text-gray-500 underline-offset-2 hover:text-gray-700 hover:underline"
      >
        Xóa tất cả
      </button>
    </div>
  );
}