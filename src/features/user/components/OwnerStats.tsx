'use client';

import { useGetTotalBookingByOwnerQuery } from '@/features/booking/api/bookingAPI';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Users, Star } from 'lucide-react';


export default function OwnerStats() {

  const { data: totalBookingResponse, isLoading } =
    useGetTotalBookingByOwnerQuery();


  const STATS = [
    {
      label: 'Total Revenue',
      value: '$2,450',
      change: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'emerald',
    },
    {
      label: 'Đơn đặt sân',
      value: isLoading 
        ? '...' 
        : totalBookingResponse?.data?.toString() ?? '0',
      change: '+3',
      isPositive: true,
      icon: Calendar,
      color: 'blue',
    },
    {
      label: 'Unique Players',
      value: '156',
      change: '-2',
      isPositive: false,
      icon: Users,
      color: 'indigo',
    },
    {
      label: 'Avg Rating',
      value: '4.8',
      change: '0.0',
      isPositive: true,
      icon: Star,
      color: 'amber',
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
              className={`
                flex h-10 w-10 items-center justify-center 
                rounded-xl bg-${stat.color}-50 
                text-${stat.color}-600
              `}
            >
              <stat.icon className="h-5 w-5" />
            </div>


            <div
              className={`
                flex items-center gap-1 rounded-full px-2 py-0.5 
                text-xs font-medium
                ${
                  stat.isPositive
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-600'
                }
              `}
            >
              {
                stat.isPositive 
                ? <TrendingUp className="h-3 w-3" />
                : <TrendingDown className="h-3 w-3" />
              }

              {stat.change}

            </div>

          </div>


          <div className="mt-4">

            <h4 className="text-sm font-medium text-gray-500">
              {stat.label}
            </h4>


            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stat.value}
            </p>


          </div>


        </div>
      ))}
    </div>
  );
}