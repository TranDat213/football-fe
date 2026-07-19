'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  Users,
  MapPin,
  AlertCircle,
  ArrowRight,
  UserCheck,
  Activity,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAdminDashboard } from '@/features/admin/hook/useDashboardAdmin';
import { UserIcon } from '@/features/auth/components/authFormFields';

export default function AdminPage() {
  const {
    totalAccounts,
    totalUsers,
    totalOwners,
    pendingOwnerCount,
    activeFieldCount,
    pendingFieldCount,
    isLoading,
  } = useAdminDashboard();

  const stats = [
    {
      label: 'Tổng tài khoản',
      value: isLoading ? '...' : totalAccounts.toLocaleString(),
      icon: Users,
      color: 'indigo',
    },
    {
      label: 'Sân hoạt động',
      value: isLoading ? '...' : activeFieldCount.toLocaleString(),
      icon: MapPin,
      color: 'emerald',
    },
    {
      label: 'Sân chờ duyệt',
      value: isLoading ? '...' : pendingFieldCount.toLocaleString(),
      icon: Activity,
      color: 'blue',
    },
    {
      label: 'Owner chờ duyệt',
      value: isLoading ? '...' : pendingOwnerCount.toLocaleString(),
      icon: UserCheck,
      color: 'orange',
    },
  ];

  const quickLinks = [
    {
      label: 'Quản lý người dùng',
      desc: `${isLoading ? '...' : totalUsers.toLocaleString()} người dùng`,
      icon: Users,
      color: 'indigo',
      href: '/admin/user_management',
      badge: null,
    },
    {
      label: 'Quản lý chủ sân',
      desc: `${isLoading ? '...' : totalOwners.toLocaleString()} chủ sân`,
      icon: UserIcon,
      color: 'emerald',
      href: '/admin/owner_management',
      badge: pendingOwnerCount > 0 ? pendingOwnerCount : null,
      badgeColor: 'orange',
    },
    {
      label: 'Quản lý sân bóng',
      desc: `${isLoading ? '...' : activeFieldCount.toLocaleString()} sân hoạt động`,
      icon: MapPin,
      color: 'blue',
      href: '/admin/field_management',
      badge: pendingFieldCount > 0 ? pendingFieldCount : null,
      badgeColor: 'blue',
    },
    {
      label: 'Thông báo hệ thống',
      desc: 'Gửi thông báo toàn nền tảng',
      icon: AlertCircle,
      color: 'purple',
      href: '#',
      badge: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8">
        {/* Page header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-indigo-600 inline-block pb-1">
              Quản trị
            </h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Tổng quan về tình trạng hệ thống và quản trị nền tảng.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-white border border-gray-100 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-gray-900 uppercase tracking-widest leading-none">
              Hệ thống hoạt động
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <div
                className={`h-10 w-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-4`}
              >
                <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Quick links */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
              Thao tác nhanh
            </h2>
            {quickLinks.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:border-indigo-100 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-xl bg-${action.color}-50 flex items-center justify-center shrink-0`}
                  >
                    <action.icon
                      className={`h-4 w-4 text-${action.color}-600`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {action.label}
                    </p>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {action.desc}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {action.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full bg-${action.badgeColor}-100 text-${action.badgeColor}-600 text-[10px] font-bold`}
                    >
                      {action.badge} chờ
                    </span>
                  )}
                  <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-indigo-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>

          {/* Right column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Pending alerts */}
            {(pendingFieldCount > 0 || pendingOwnerCount > 0) && (
              <section className="rounded-3xl border border-orange-100 bg-orange-50/50 p-6">
                <h2 className="flex items-center gap-2 text-sm font-bold text-orange-700 mb-4">
                  <ShieldCheck className="h-4 w-4" />
                  Cần xử lý
                </h2>
                <div className="space-y-3">
                  {pendingFieldCount > 0 && (
                    <Link
                      href="/admin/field_management"
                      className="flex items-center justify-between p-4 rounded-2xl bg-white border border-orange-100 hover:border-orange-300 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            Sân chờ phê duyệt
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Xem xét và duyệt các sân mới
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
                          {pendingFieldCount}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-orange-400 transition-colors" />
                      </div>
                    </Link>
                  )}
                  {pendingOwnerCount > 0 && (
                    <Link
                      href="/admin/owner_management/owner_register"
                      className="flex items-center justify-between p-4 rounded-2xl bg-white border border-orange-100 hover:border-orange-300 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <UserCheck className="h-4 w-4 text-orange-500" />
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            Chủ sân chờ xác minh
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Xét duyệt đăng ký chủ sân mới
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
                          {pendingOwnerCount}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-orange-400 transition-colors" />
                      </div>
                    </Link>
                  )}
                </div>
              </section>
            )}

            <Link
              href="/admin/category_management"
              className="rounded-3xl bg-indigo-900 p-8 text-white flex items-center justify-between overflow-hidden relative group"
            >
              <div className="absolute top-0 right-0 h-full w-1/3 bg-indigo-800 skew-x-12 -mr-12" />
              <div className="relative z-10">
                <h3 className="text-xl font-bold uppercase tracking-tight">
                  Danh mục sân
                </h3>
                <p className="mt-2 text-sm text-indigo-100/70 max-w-md italic font-medium leading-relaxed">
                  Quản lý danh mục và phân loại sân bóng trên nền tảng.
                </p>
              </div>
              <div className="relative z-10 flex items-center gap-2 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 h-11 px-8 text-xs font-bold uppercase tracking-widest shadow-xl shadow-indigo-900/50 transition-colors">
                <Tag className="h-3.5 w-3.5" />
                Quản lý
              </div>
            </Link>

            {/* Help card */}
            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 text-center border-dashed">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                <AlertCircle className="h-8 w-8 text-indigo-400" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                Cần trợ giúp?
              </h4>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-6">
                Hỗ trợ quản trị hệ thống luôn sẵn sàng 24/7.
              </p>
              <Link
                href="#"
                className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-700 underline underline-offset-4"
              >
                Liên hệ hỗ trợ
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
