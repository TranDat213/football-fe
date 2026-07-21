'use client';

import React from 'react';
import { PieChart, Landmark, Layers } from 'lucide-react';

interface FieldRevenueItem {
  fieldId: string;
  fieldName: string;
  revenue: number;
  bookingCount: number;
}

interface FieldRevenueChartProps {
  data: FieldRevenueItem[];
}

const COLOR_PALETTE = [
  { bg: 'bg-emerald-500', lightBg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { bg: 'bg-indigo-500', lightBg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  { bg: 'bg-amber-500', lightBg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { bg: 'bg-sky-500', lightBg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  { bg: 'bg-purple-500', lightBg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { bg: 'bg-rose-500', lightBg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
];

export default function FieldRevenueChart({ data }: FieldRevenueChartProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
          <Landmark className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-bold text-gray-900">Chưa có dữ liệu sân</h3>
        <p className="mt-1 text-xs text-gray-500">Bạn chưa thêm sân bóng nào hoặc chưa có lượt đặt sân.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <PieChart className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Thống kê doanh thu theo sân</h3>
          <p className="text-xs text-gray-500">Tỷ trọng doanh thu và lượt đặt sân của từng cơ sở</p>
        </div>
      </div>

      {/* Progress Bars for Fields */}
      <div className="space-y-6">
        {data.map((item, idx) => {
          const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
          const percentage = totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100).toFixed(1) : '0';

          return (
            <div key={item.fieldId || idx} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between text-xs font-bold gap-2">
                <span className="text-gray-800 text-sm font-semibold flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${color.bg}`} />
                  {item.fieldName}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 font-normal text-[11px]">
                    {item.bookingCount} lượt đặt ({percentage}%)
                  </span>
                  <span className={`font-bold ${color.text}`}>
                    {formatCurrency(item.revenue)}
                  </span>
                </div>
              </div>

              {/* Progress bar container */}
              <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full ${color.bg} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${Math.max(Number(percentage), 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
