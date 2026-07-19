'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { MapPin, ArrowLeft, Activity, Clock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useFieldManagement } from '@/features/admin/hook/useFieldManagement';
import { FieldTable } from '@/features/admin/component/FieldTable';
import { Pagination } from '@/features/admin/component/Pagination';
import { ROUTES } from '@/lib/route.constants';

export default function FieldManagementPage() {
  const {
    list,
    page,
    limit,
    isLoading,
    isFetching,
    stats,
    handlePageChange,
    handleApprove,
    handleReject,
    isUpdating,
  } = useFieldManagement();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/admin"
                className="text-gray-400 hover:text-emerald-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Link href="/admin">Dashboard</Link>
                <span>/</span>
                <span className="text-emerald-600">Quản lý sân</span>
              </nav>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-emerald-500 inline-block pb-1">
              Sân bóng
            </h1>
          </div>
          <div className="flex items-center gap-3">
              <Link
                href={ROUTES.adminUpdateField}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
              >
                <Mail className="h-3.5 w-3.5" />
                Sân cập nhật
              </Link>
            </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Đang hoạt động
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.activeFieldCount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Chờ duyệt
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats.pendingFieldCount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Tổng sân
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading
                    ? '...'
                    : (
                        stats.activeFieldCount +
                        stats.pendingFieldCount +
                        stats.inactiveFieldCount
                      ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Title section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
            Danh sách sân chờ duyệt
          </h2>
          {stats.pendingFieldCount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-orange-100 text-orange-600 text-[11px] font-bold">
              {stats.pendingFieldCount} sân cần xử lý
            </span>
          )}
        </div>

        {/* Table + Pagination */}
        <div
          className={`space-y-4 transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}
        >
          <FieldTable
            fields={list}
            isLoading={isLoading}
            onApprove={handleApprove}
            onReject={handleReject}
            isUpdating={isUpdating}
          />

          {!isLoading && (
            <Pagination
              currentPage={page}
              itemsCount={list.length}
              limit={limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
