'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, ClipboardEdit, Mail } from 'lucide-react';
import Link from 'next/link';
import { useFieldUpdateRequestManagement } from '@/features/admin/hook/useFieldUpdateManagement';
import { ROUTES } from '@/lib/route.constants';
import { FieldUpdateRequestTable } from '@/features/admin/component/FieldUpdateTable';
import { Pagination } from '@/features/admin/component/Pagination';
import { FieldUpdateRequestDetailModal } from '@/features/admin/component/FieldUpdateRequestDetailModal';

export default function FieldUpdateRequestPage() {
  const {
    list,
    itemsCount,
    page,
    limit,
    isLoading,
    isFetching,
    selectedId,
    selectedDetail,
    setSelectedId,
    handlePageChange,
    handleApprove,
    handleReject,
    isUpdating,
  } = useFieldUpdateRequestManagement();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8">
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
                <span className="text-indigo-600">Yêu cầu cập nhật sân</span>
              </nav>
            </div>
            <h1 className="text-3xl font-black text-gray-900 border-b-4 border-indigo-500 inline-block pb-1">
              Yêu cầu cập nhật sân
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-2">
              Duyệt các thay đổi thông tin sân do chủ sân gửi lên
            </p>
          </div>
          <Link
            href={ROUTES.adminFields}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
          >
            <Mail className="h-3.5 w-3.5" />
            Sân mới tạo
          </Link>
        </div>

        <div
          className={`space-y-4 ${isFetching ? 'opacity-60 pointer-events-none transition-opacity' : ''}`}
        >
          <FieldUpdateRequestTable
            records={list}
            isLoading={isLoading}
            isUpdating={isUpdating}
            onApprove={handleApprove}
            onReject={handleReject}
            onViewDetail={(id) => setSelectedId(id)}
          />

          {!isLoading && (
            <Pagination
              currentPage={page}
              itemsCount={itemsCount}
              limit={limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>

      <Footer />

      {selectedId && (
        <FieldUpdateRequestDetailModal
          data={selectedDetail}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
