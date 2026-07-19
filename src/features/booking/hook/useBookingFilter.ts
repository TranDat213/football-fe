'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface BookingFilters {
  keyword: string;
  status: string;
  bookingDate: string; // yyyy-MM-dd
  footballFieldId: string;
  page: number;
}

const DEFAULT_FILTERS: BookingFilters = {
  keyword: '',
  status: '',
  bookingDate: '',
  footballFieldId: '',
  page: 1,
};

const KEYWORD_DEBOUNCE_MS = 500;

/**
 * Giống useFilters.ts nhưng field set riêng cho trang booking (My Bookings /
 * Owner Bookings) — status, bookingDate, footballFieldId thay vì category/price.
 * Phải dùng trong component con của <Suspense> vì dùng useSearchParams.
 */
export function useBookingFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<BookingFilters>(() => ({
    keyword: searchParams.get('keyword') ?? DEFAULT_FILTERS.keyword,
    status: searchParams.get('status') ?? DEFAULT_FILTERS.status,
    bookingDate: searchParams.get('bookingDate') ?? DEFAULT_FILTERS.bookingDate,
    footballFieldId: searchParams.get('footballFieldId') ?? DEFAULT_FILTERS.footballFieldId,
    page: Number(searchParams.get('page')) || DEFAULT_FILTERS.page,
  }));

  const [keywordInput, setKeywordInput] = useState(filters.keyword);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateFilter = useCallback(<K extends keyof BookingFilters>(key: K, value: BookingFilters[K]) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'page' ? {} : { page: 1 }),
    }));
  }, []);

  const setKeyword = useCallback((value: string) => {
    setKeywordInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateFilter('keyword', value), KEYWORD_DEBOUNCE_MS);
  }, [updateFilter]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value === '' || value === undefined || value === null) return;
      if (key === 'page' && value === 1) return;
      params.set(key, String(value));
    });
    const query = params.toString();
    router.replace(query ? `?${query}` : '?', { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const activeCount = useMemo(
    () => Object.entries(filters).filter(([key, value]) => key !== 'page' && value !== '').length,
    [filters],
  );

  const clearAll = useCallback(() => {
    setKeywordInput('');
    setFilters(DEFAULT_FILTERS);
  }, []);

  const clearOne = useCallback((key: keyof BookingFilters) => {
    if (key === 'keyword') setKeywordInput('');
    updateFilter(key, DEFAULT_FILTERS[key] as BookingFilters[typeof key]);
  }, [updateFilter]);

  return {
    filters,
    keywordInput,
    setKeyword,
    setStatus: (v: string) => updateFilter('status', v),
    setBookingDate: (v: string) => updateFilter('bookingDate', v),
    setFootballFieldId: (v: string) => updateFilter('footballFieldId', v),
    setPage: (page: number) => updateFilter('page', page),
    clearAll,
    clearOne,
    activeCount,
  };
}

export type UseBookingFiltersReturn = ReturnType<typeof useBookingFilters>;