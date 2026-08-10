'use client';

import { ActiveFilters } from '@/components/filter/Activefilters';
import { CategoryFilter, type CategoryOption } from '@/components/filter/CategoryFilter';
import { type LocationOption } from '@/components/filter/Locationfilter';
import { PriceRangeFilter } from '@/components/filter/PriceRangerfilter';
import { SearchInput } from '@/components/filter/SearchInput';
import { SortDropdown, type SortOption } from '@/components/filter/SortDropdown';
import { UseFiltersReturn } from '@/hooks/useFilter';

const FIELD_SORT_OPTIONS: SortOption[] = [
  { value: 'price', order: 'asc', label: 'Giá: Thấp đến cao' },
  { value: 'price', order: 'desc', label: 'Giá: Cao đến thấp' },
  { value: 'newest', order: 'desc', label: 'Mới nhất' },
  // 'rating' đang chờ xác nhận Q1 trong kế hoạch — thêm khi có cột averageRating
];

interface FieldFilterBarProps {
  f: UseFiltersReturn;
  categories: CategoryOption[];
  districts: LocationOption[];
  className?: string;
}

/**
 * FilterBar riêng cho trang danh sách sân (Home / trang tìm sân).
 * Không tự giữ state — nhận `f` (kết quả của useFilters() ở component cha)
 * để cha dùng chung state đó gọi useGetPitchesQuery.
 */
export function FieldFilterBar({ f, categories, districts, className = '' }: FieldFilterBarProps) {
  const chips = [
    f.filters.keyword && { key: 'keyword', label: `Từ khóa: ${f.filters.keyword}` },
    f.filters.category && {
      key: 'category',
      label: `Loại sân: ${categories.find((c) => c.value === f.filters.category)?.label ?? f.filters.category}`,
    },
    f.filters.district && {
      key: 'district',
      label: `Quận/Huyện: ${districts.find((d) => d.value === f.filters.district)?.label ?? f.filters.district}`,
    },
    (f.filters.minPrice || f.filters.maxPrice) && {
      key: 'minPrice',
      label: `Giá: ${f.filters.minPrice || '0'}k – ${f.filters.maxPrice || '∞'}k`,
    },
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <SearchInput
          value={f.keywordInput}
          onChange={f.setKeyword}
          placeholder="Tìm theo tên sân, địa chỉ..."
          className="sm:w-64"
        />
        <PriceRangeFilter
          min={f.filters.minPrice}
          max={f.filters.maxPrice}
          onChange={(min, max) => {
            f.setMinPrice(min);
            f.setMaxPrice(max);
          }}
        />
        <SortDropdown
          value={f.filters.sortBy}
          order={f.filters.sortOrder}
          onChange={f.setSort}
          options={FIELD_SORT_OPTIONS}
          className="sm:w-48"
        />
        <CategoryFilter
          value={f.filters.category}
          onChange={f.setCategory}
          categories={categories}
          className="sm:w-64"
        />
        <select
          value={f.filters.district}
          onChange={(e) => f.setDistrict(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="">Tất cả quận/huyện</option>
          {districts.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>
      {chips.length > 0 && (
        <ActiveFilters chips={chips} onRemove={(key) => f.clearOne(key as keyof typeof f.filters)} onClearAll={f.clearAll} />
      )}
    </div>
  );
}