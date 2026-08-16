'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { CasualMatchSkillLevel, CasualMatchStatus } from "./types/casual-match.types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface CasualMatchFilters{
    keyword: string;
    province: string;
    district: string;
    footballFieldId: string;
    bookingDate:string;
    status:CasualMatchStatus | '';
    skillLevel: CasualMatchSkillLevel | "";
    page: number;
}

const DEFAULT_FILTERS: CasualMatchFilters = {
  keyword: '',
  province: '',
  district: '',
  footballFieldId: '',
  bookingDate: '',
  status: '',
  skillLevel: '',
  page: 1,

};
const KEYWORD_DEBOUNCE_MS = 500;

export function useCasualMatchFilters(defaults: Partial<CasualMatchFilters> = {}){
    const router = useRouter();
    const searchParams = useSearchParams();
    const initial = {...DEFAULT_FILTERS, ...defaults};

 const [filters, setFilters] = useState<CasualMatchFilters>(() => ({
    keyword: searchParams.get('keyword') ?? initial.keyword,
    province: searchParams.get('province') ?? initial.province,
    district: searchParams.get('district') ?? initial.district,
    footballFieldId: searchParams.get('footballFieldId') ?? initial.footballFieldId,
    bookingDate: searchParams.get('bookingDate') ?? initial.bookingDate,
    status: (searchParams.get('status') as CasualMatchStatus | null) ?? initial.status,
    skillLevel: (searchParams.get('skillLevel') as CasualMatchSkillLevel | null) ?? initial.skillLevel,
    page: Number(searchParams.get('page')) || initial.page,
  }));

  const [keywordInput, setKeywordInput] = useState(filters.keyword);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateFilter = useCallback(<K extends keyof CasualMatchFilters>(key: K, value: CasualMatchFilters[K]) => {
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

  const activeCount = useMemo(() => {
    return Object.entries(filters).filter(([key, value]) => {
      if (key === 'page') return false;
      return value !== '' && value !== undefined;
    }).length;
  }, [filters]);

  const clearAll = useCallback(() => {
    setKeywordInput('');
    setFilters({ ...DEFAULT_FILTERS, ...defaults });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearOne = useCallback((key: keyof CasualMatchFilters) => {
    if (key === 'keyword') setKeywordInput('');
    updateFilter(key, DEFAULT_FILTERS[key] as CasualMatchFilters[typeof key]);
  }, [updateFilter]);

  return {
    filters,
    keywordInput,
    setKeyword,
    setProvince: (v: string) => updateFilter('province', v),
    setDistrict: (v: string) => updateFilter('district', v),
    setFootballFieldId: (v: string) => updateFilter('footballFieldId', v),
    setBookingDate: (v: string) => updateFilter('bookingDate', v),
    setStatus: (v: CasualMatchStatus | '') => updateFilter('status', v),
    setSkillLevel: (v: CasualMatchSkillLevel | '') => updateFilter('skillLevel', v),
    setPage: (page: number) => updateFilter('page', page),
    clearAll,
    clearOne,
    activeCount,
  };
}

export type UseCasualMatchFiltersReturn = ReturnType<typeof useCasualMatchFilters>;