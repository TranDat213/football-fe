'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface FieldFilters {
  keyword: string;
  category: string;
  province: string;
  district: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
}

const DEFAULT_FILTERS: FieldFilters = {
  keyword: '',
  category: '',
  province: '',
  district: '',
  minPrice: '',
  maxPrice: '',
  sortBy: '',
  sortOrder: 'asc',
  page: 1,
};

const KEYWORD_DEBOUNCE_MS = 500;

/**
 * Đọc filter từ URL search params, quản lý state, debounce ô tìm kiếm 500ms,
 * và tự động sync state -> URL (router.replace, không tạo history entry mới).
 *
 * Dùng chung cho các trang có filter/sort: Home (fields), Casual Matches,
 * My Bookings, các trang Admin...
 *
 * Lưu ý: phải dùng trong component con của <Suspense>, vì useSearchParams
 * yêu cầu Suspense boundary trong Next.js App Router.
 */
export function useFilters(defaults: Partial<FieldFilters> = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = { ...DEFAULT_FILTERS, ...defaults };

  const [filters, setFilters] = useState<FieldFilters>(() => ({
    keyword: searchParams.get('keyword') ?? initial.keyword,
    category: searchParams.get('category') ?? initial.category,
    province: searchParams.get('province') ?? initial.province,
    district: searchParams.get('district') ?? initial.district,
    minPrice: searchParams.get('minPrice') ?? initial.minPrice,
    maxPrice: searchParams.get('maxPrice') ?? initial.maxPrice,
    sortBy: searchParams.get('sortBy') ?? initial.sortBy,
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc' | null) ?? initial.sortOrder,
    page: Number(searchParams.get('page')) || initial.page,
  }));

  // Tách riêng giá trị ô input (chưa debounce) để gõ mượt, không giật lại giá trị
  const [keywordInput, setKeywordInput] = useState(filters.keyword);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateFilter = useCallback(<K extends keyof FieldFilters>(key: K, value: FieldFilters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      // Đổi bất kỳ filter nào (trừ page) thì quay về trang 1
      ...(key === 'page' ? {} : { page: 1 }),
    }));
  }, []);

  const setKeyword = useCallback((value: string) => {
    setKeywordInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateFilter('keyword', value);
    }, KEYWORD_DEBOUNCE_MS);
  }, [updateFilter]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Sync state -> URL mỗi khi filters đổi
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === undefined || value === null) return;
      if (key === 'page' && value === 1) return;
      if (key === 'sortOrder' && !filters.sortBy) return;
      params.set(key, String(value));
    });
    const query = params.toString();
    router.replace(query ? `?${query}` : '?', { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const activeCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'page' || key === 'sortOrder') return false;
      return value !== '' && value !== undefined;
    }).length;
  }, [filters]);

  const clearAll = useCallback(() => {
    setKeywordInput('');
    setFilters({ ...DEFAULT_FILTERS, ...defaults });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearOne = useCallback((key: keyof FieldFilters) => {
    if (key === 'keyword') setKeywordInput('');
    updateFilter(key, DEFAULT_FILTERS[key] as FieldFilters[typeof key]);
  }, [updateFilter]);

  return {
    filters,
    keywordInput,
    setKeyword,
    setCategory: (v: string) => updateFilter('category', v),
    setProvince: (v: string) => updateFilter('province', v),
    setDistrict: (v: string) => updateFilter('district', v),
    setMinPrice: (v: string) => updateFilter('minPrice', v),
    setMaxPrice: (v: string) => updateFilter('maxPrice', v),
    setSort: (sortBy: string, sortOrder: 'asc' | 'desc' = 'asc') => {
      setFilters((prev) => ({ ...prev, sortBy, sortOrder, page: 1 }));
    },
    setPage: (page: number) => updateFilter('page', page),
    clearAll,
    clearOne,
    activeCount,
  };
}

export type UseFiltersReturn = ReturnType<typeof useFilters>;