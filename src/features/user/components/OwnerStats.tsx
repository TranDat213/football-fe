'use client';

import { useGetOwnerAnalyticsQuery } from '@/features/booking/api/bookingAPI';
import { DollarSign, Calendar, TrendingUp, Award } from 'lucide-react';

export default function OwnerStats() {
  const { data: analyticsResponse, isLoading } = useGetOwnerAnalyticsQuery();

  const summary = analyticsResponse?.data?.summary;

  const formatCurrency = (val?: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);

  const STATS = [
    {
      label: 'Doanh thu tháng này',
      value: isLoading ? '...' : formatCurrency(summary?.totalRevenueThisMonth),
      icon: DollarSign,
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      label: 'Đơn đặt tháng này',
      value: isLoading ? '...' : summary?.totalBookingsThisMonth?.toString() || '0',
      icon: Calendar,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      label: 'Tổng doanh thu năm',
      value: isLoading ? '...' : formatCurrency(summary?.totalRevenueYear),
      icon: TrendingUp,
      color: 'indigo',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
    },
    {
      label: 'Tổng đơn đặt sân năm',
      value: isLoading ? '...' : summary?.totalBookingsYear?.toString() || '0',
      icon: Award,
      color: 'amber',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bgColor} ${stat.textColor}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {stat.label}
            </h4>
            <p className="mt-1 text-xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}