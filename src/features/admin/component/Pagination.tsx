'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  itemsCount: number; // số items thực tế trả về trong trang này
  limit: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  itemsCount,
  limit,
  onPageChange,
}: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = itemsCount < limit; // ít hơn limit = trang cuối

  if (isFirstPage && isLastPage) return null; // chỉ có 1 trang

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <p className="text-xs font-medium text-gray-500">
        Trang <span className="font-bold text-gray-900">{currentPage}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirstPage}
          className="h-8 w-8 p-0 rounded-lg"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="h-8 w-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-200">
          {currentPage}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLastPage}
          className="h-8 w-8 p-0 rounded-lg"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
