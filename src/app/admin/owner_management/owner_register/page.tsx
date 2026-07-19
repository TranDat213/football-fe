'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { OwnerRegisterDetailModal } from '@/features/admin/component/OwnerRegisterDetailModal';
import { OwnerRegisterTable } from '@/features/admin/component/OwnerRegisterTable';
import { useOwnerRegisterManagement } from '@/features/admin/hook/userOwnerRegisterManagerment';
import { ROUTES } from '@/lib/route.constants';

export default function OwnerRegisterPage() {
  const {
    list,
    total,
    page,
    limit,
    isLoading,
    isFetching,
    selectedId,
    selectedDetail,
    isLoadingDetail,
    setSelectedId,
    handlePageChange,
    handleApprove,
    handleUpdateStatus,
    isUpdatingStatus,
  } = useOwnerRegisterManagement();

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={ROUTES.adminOwners}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Link href="/admin">Dashboard</Link>
                <span>/</span>
                <Link href={ROUTES.adminOwners} className="hover:text-gray-600 transition-colors">
                  Quản lý chủ sân
                </Link>
                <span>/</span>
                <span className="text-indigo-600">Phiếu đăng ký</span>
              </nav>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-indigo-500 inline-block pb-1">
              Chủ sân chờ xác minh
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-2">
              {total} phiếu đăng ký
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.adminOwners}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Quản lý chủ sân
            </Link>
          </div>
        </div>

        {/* Table */}
        <div className={`space-y-6 ${isFetching ? 'opacity-60 pointer-events-none transition-opacity' : ''}`}>
          <OwnerRegisterTable
            records={list}
            isLoading={isLoading}
            isUpdating={isUpdatingStatus}
            onApprove={handleApprove}
            onUpdateStatus={handleUpdateStatus}
            onViewDetail={(id) => setSelectedId(id)}
          />

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Trước
              </button>
              <span className="text-xs text-gray-500 font-medium">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Detail modal */}
      {selectedId && (
        <OwnerRegisterDetailModal
          data={isLoadingDetail ? null : selectedDetail}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}