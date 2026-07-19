'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { FieldUpdateRequestDetailModal } from '@/features/admin/component/FieldUpdateRequestDetailModal';
import { ROUTES } from '@/lib/route.constants';
import { FootballFieldUpdateRequestStatus } from '@/features/pitch/types/pich.types';
import { useOwnerFieldUpdateRequestManagement } from '@/features/pitch/hooks/useDeleteFieldUpdateRequest';
import { OwnerFieldUpdateRequestTable } from '@/features/pitch/components/FieldUpdateRequestManagementOwner';
import { Pagination } from '@/features/admin/component/Pagination';

const STATUS_TABS: { label: string; value: FootballFieldUpdateRequestStatus | undefined }[] = [
  { label: 'Tất cả', value: undefined },
  { label: 'Chờ duyệt', value: 'PENDING' },
  // { label: 'Đã duyệt', value: 'CONFIRMED' },
  // { label: 'Từ chối', value: 'REJECTED' },
];

export default function OwnerFieldUpdateRequestPage() {
  const {
    list,
    itemsCount,
    page,
    limit,
    status,
    isLoading,
    isFetching,
    selectedId,
    selectedDetail,
    setSelectedId,
    setStatus,
    handlePageChange,
    handleDelete,
    isDeleting,
  } = useOwnerFieldUpdateRequestManagement();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={ROUTES.ownerDashboard}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Link href={ROUTES.ownerDashboard}>Dashboard</Link>
                <span>/</span>
                <span className="text-indigo-600">Yêu cầu chỉnh sửa sân</span>
              </nav>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-indigo-500 inline-block pb-1">
              Yêu cầu chỉnh sửa sân
            </h1>
            <p className="text-sm text-gray-400 font-medium mt-2">
              Theo dõi trạng thái các yêu cầu chỉnh sửa bạn đã gửi
            </p>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-2 mb-6">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => setStatus(tab.value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                status === tab.value
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-indigo-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className={`space-y-4 ${isFetching ? 'opacity-60 pointer-events-none transition-opacity' : ''}`}>
          <OwnerFieldUpdateRequestTable
            records={list}
            isLoading={isLoading}
            isDeleting={isDeleting}
            onDelete={handleDelete}
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