'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OwnerStats from '@/features/user/components/OwnerStats';
import MonthlyRevenueChart from '@/features/owner/components/MonthlyRevenueChart';
import FieldRevenueChart from '@/features/owner/components/FieldRevenueChart';
import { useGetOwnerAnalyticsQuery } from '@/features/booking/api/bookingAPI';
import { Calendar, Filter, Loader2 } from 'lucide-react';

export default function OwnerAnalyticsPage() {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const { data: response, isLoading } = useGetOwnerAnalyticsQuery({ year: selectedYear });

  const analyticsData = response?.data;
  const currentYear = new Date().getFullYear();
  const availableYears = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <main className="flex-1 px-4 sm:px-6 py-8">
          {/* Header & Year Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Thống kê doanh thu</h1>
              <p className="mt-1 text-sm text-gray-500">
                Phân tích doanh thu theo tháng và biểu đồ doanh thu theo từng sân bóng của bạn.
              </p>
            </div>

            {/* Year Selector */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl p-1.5 shadow-sm">
              <Calendar className="h-4 w-4 text-gray-400 ml-2" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Năm:</span>
              <div className="flex gap-1">
                {availableYears.map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      selectedYear === yr
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
              <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
              <p className="mt-3 text-sm font-medium text-gray-500">Đang tải dữ liệu thống kê...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Summary Cards */}
              <OwnerStats />

              {/* 2 Main Charts */}
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* 1. Monthly Revenue Chart (8 cols on large screens) */}
                <div className="lg:col-span-12 xl:col-span-7">
                  <MonthlyRevenueChart
                    data={analyticsData?.monthlyRevenue || []}
                    year={selectedYear}
                  />
                </div>

                {/* 2. Revenue by Field Chart (5 cols on large screens) */}
                <div className="lg:col-span-12 xl:col-span-5">
                  <FieldRevenueChart
                    data={analyticsData?.fieldRevenue || []}
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
