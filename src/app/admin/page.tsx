'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  ShieldCheck,
  Users,
  MapPin,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  UserCheck,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useAdminDashboard } from '@/features/admin/hook/useDashboardAdmin';

export default function AdminPage() {
  const {
    totalAccounts,
    totalUsers,
    activeFieldCount,
    pendingOwnerCount,
    pendingFieldCount,
    pendingFields,
    isLoading,
    handleApprove,
    handleReject,
    isUpdating,
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 border-b-4 border-indigo-600 inline-block pb-1">
              Quản trị
            </h1>
            <p className="mt-2 text-sm text-gray-500 font-medium">
              Tổng quan về tình trạng hệ thống và quản trị nền tảng.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 rounded-xl bg-white border border-gray-100 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest leading-none">
                Hệ thống hoạt động
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
              <p className="mt-1 text-2xl font-black text-gray-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Pending Approvals */}
          <div className="lg:col-span-8 space-y-6">
            <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="flex items-center gap-3 text-lg font-bold text-gray-900">
                  <ShieldCheck className="h-5 w-5 text-indigo-600" /> Yêu cầu
                  phê duyệt sân
                </h2>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-lg italic">
                  Cần kiểm tra nghiêm ngặt
                </span>
              </div>

              <div className="space-y-4">
                {isLoading ? (
                  // Skeleton loading
                  [1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 animate-pulse"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gray-100" />
                        <div className="space-y-2">
                          <div className="h-3 w-32 bg-gray-100 rounded" />
                          <div className="h-2 w-48 bg-gray-100 rounded" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-9 w-9 rounded-xl bg-gray-100" />
                        <div className="h-9 w-9 rounded-xl bg-gray-100" />
                        <div className="h-9 w-9 rounded-xl bg-gray-100" />
                      </div>
                    </div>
                  ))
                ) : pendingFields.length === 0 ? (
                  <div className="text-center py-8 text-sm text-gray-400 font-medium">
                    Không có sân nào đang chờ duyệt
                  </div>
                ) : (
                  pendingFields.map((field) => (
                    <div
                      key={field.id}
                      className="group flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-indigo-100 hover:bg-indigo-50/10 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          {field.coverImage ? (
                            <img
                              src={field.coverImage}
                              alt={field.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                            {field.name}
                          </h4>
                          <p className="text-[11px] text-gray-500 font-medium">
                            {field.address} •{' '}
                            {new Date(field.createdAt).toLocaleDateString(
                              'vi-VN',
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(field.id)}
                          disabled={isUpdating}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleReject(field.id)}
                          disabled={isUpdating}
                          className="h-9 w-9 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm disabled:opacity-50"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                        <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white transition-all shadow-sm">
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <div className="rounded-3xl bg-indigo-900 p-8 text-white flex items-center justify-between overflow-hidden relative">
              <div className="absolute top-0 right-0 h-full w-1/3 bg-indigo-800 skew-x-12 -mr-12" />
              <div className="relative z-10">
                <h3 className="text-xl font-black uppercase tracking-tight">
                  Kiểm tra bảo mật
                </h3>
                <p className="mt-2 text-sm text-indigo-100/70 max-w-md italic font-medium leading-relaxed">
                  Không phát hiện lỗ hổng bảo mật nghiêm trọng. Quét lần cuối 15
                  phút trước.
                </p>
              </div>
              <Button className="relative z-10 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 h-11 px-8 text-xs font-bold uppercase tracking-widest shadow-xl shadow-indigo-900/50">
                Xem nhật ký
              </Button>
            </div>
          </div>

          {/* Quick Admin Links */}
          <div className="lg:col-span-4 space-y-8">
            <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
                Thao tác nhanh
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: 'Quản lý quyền',
                    icon: ShieldCheck,
                    color: 'indigo',
                  },
                  {
                    label: 'Thông báo toàn hệ thống',
                    icon: AlertCircle,
                    color: 'blue',
                  },
                  {
                    label: 'Cài đặt nền tảng',
                    icon: Activity,
                    color: 'emerald',
                  },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-all font-bold text-xs uppercase tracking-widest text-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <action.icon
                        className={`h-4 w-4 text-${action.color}-600`}
                      />
                      {action.label}
                    </div>
                    <ArrowRight className="h-3 w-3 text-gray-300" />
                  </button>
                ))}
              </div>
            </section>

            <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 text-center border-dashed">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-sm">
                <AlertCircle className="h-8 w-8 text-indigo-400" />
              </div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">
                Cần trợ giúp?
              </h4>
              <p className="text-[11px] text-gray-400 font-medium leading-relaxed mb-6">
                Hỗ trợ quản trị hệ thống luôn sẵn sàng 24/7 cho các vấn đề quan
                trọng của nền tảng.
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
