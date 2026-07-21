'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

interface MonthlyRevenueItem {
  month: number;
  monthLabel: string;
  revenue: number;
  bookingCount: number;
}

interface MonthlyRevenueChartProps {
  data: MonthlyRevenueItem[];
  year: number;
}

export default function MonthlyRevenueChart({ data, year }: MonthlyRevenueChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  const totalYearRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Doanh thu theo tháng ({year})</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Biểu đồ thống kê tổng doanh thu hàng tháng từ đơn đặt sân đã xác nhận.
          </p>
        </div>

        <div className="text-left sm:text-right bg-emerald-50/60 p-3 sm:p-0 rounded-xl sm:bg-transparent">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Tổng doanh thu năm {year}
          </span>
          <p className="text-2xl font-bold text-emerald-700">{formatCurrency(totalYearRevenue)}</p>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="mt-6">
        <div className="h-64 w-full relative flex items-end justify-between gap-1.5 sm:gap-3 pt-10 pb-2 border-b border-gray-100">
          {data.map((item, idx) => {
            const heightPercent = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
            const isHovered = hoveredIndex === idx;
            const isHighest = item.revenue === maxRevenue && maxRevenue > 0;

            return (
              <div
                key={item.month}
                className="flex-1 h-full flex flex-col justify-end items-center relative group cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-14 z-20 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs text-white shadow-lg transition-all animate-in fade-in duration-200">
                    <p className="font-bold">{item.monthLabel}</p>
                    <p className="text-emerald-400 font-medium">{formatCurrency(item.revenue)}</p>
                    <p className="text-[10px] text-gray-300">{item.bookingCount} đơn đặt</p>
                    <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                )}

                {/* Bar element */}
                <div className="w-full max-w-[36px] bg-gray-100 rounded-t-lg relative overflow-hidden flex items-end transition-all h-full">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-700 ease-out ${
                      isHighest
                        ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                        : isHovered
                        ? 'bg-emerald-500'
                        : 'bg-emerald-600/80 group-hover:bg-emerald-500'
                    }`}
                    style={{ height: `${Math.max(heightPercent, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* X Axis labels */}
        <div className="mt-3 flex justify-between text-[10px] sm:text-xs font-semibold text-gray-400">
          {data.map((item) => (
            <span
              key={item.month}
              className={`text-center transition-colors ${
                hoveredIndex === item.month - 1 ? 'text-emerald-600 font-bold' : ''
              }`}
            >
              T{item.month}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
