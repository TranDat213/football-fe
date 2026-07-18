'use client';

import { useEffect, useState } from 'react';

interface PriceRangeFilterProps {
  min: string;
  max: string;
  onChange: (min: string, max: string) => void;
  className?: string;
}

export function PriceRangeFilter({ min, max, onChange, className = '' }: PriceRangeFilterProps) {
  const [localMin, setLocalMin] = useState(min);
  const [localMax, setLocalMax] = useState(max);

  // Đồng bộ lại nếu filter bị reset từ bên ngoài (vd bấm "Xóa tất cả")
  useEffect(() => setLocalMin(min), [min]);
  useEffect(() => setLocalMax(max), [max]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localMin !== min || localMax !== max) onChange(localMin, localMax);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localMin, localMax]);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <input
        type="number"
        min={0}
        step={10}
        value={localMin}
        onChange={(e) => setLocalMin(e.target.value)}
        placeholder="Từ (nghìn đ)"
        className="w-28 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
      <span className="text-gray-400">–</span>
      <input
        type="number"
        min={0}
        step={10}
        value={localMax}
        onChange={(e) => setLocalMax(e.target.value)}
        placeholder="Đến (nghìn đ)"
        className="w-28 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
      />
    </div>
  );
}