'use client';

export interface CategoryOption {
  value: string;
  label: string;
}

interface CategoryFilterProps {
  value: string;
  onChange: (value: string) => void;
  categories: CategoryOption[];
  className?: string;
}

export function CategoryFilter({ value, onChange, categories, className = '' }: CategoryFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 ${className}`}
    >
      <option value="">Tất cả loại sân</option>
      {categories.map((c) => (
        <option key={c.value} value={c.value}>
          {c.label}
        </option>
      ))}
    </select>
  );
}