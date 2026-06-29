'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Users, UserIcon, ArrowLeft, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useUserManagement } from '@/features/admin/hook/useUserManagement';
import { UserTable } from '@/features/admin/component/UserTable';
import { Pagination } from '@/features/admin/component/Pagination';
import { ROUTES } from '@/lib/route.constants';

export default function OwnerManagementPage() {
  const {
    list,
    page,
    limit,
    isLoading,
    stats,
    handlePageChange,
    updateStatus,
    isUpdatingStatus,
  } = useUserManagement('OWNER');

  const handleUpdateStatus = async (
    id: string,
    status: 'ACTIVE' | 'INACTIVE' | 'BANNED',
  ) => {
    try {
      await updateStatus({ id, status }).unwrap();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8">
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
                <span className="text-emerald-600">Quản lý chủ sân</span>
              </nav>
            </div>
            <h1 className="text-3xl font-black text-gray-900 border-b-4 border-emerald-500 inline-block pb-1">
              Chủ sân
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.adminUsers}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
            >
              <Users className="h-3.5 w-3.5" />
              Chuyển sang Người dùng
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={ROUTES.adminOwnerRegister}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              Phiếu đăng ký
            </Link>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Tổng chủ sân
                </p>
                <p className="text-2xl font-black text-gray-900">
                  {isLoading
                    ? '...'
                    : stats?.totalOwners?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <UserTable
            users={list}
            isLoading={isLoading}
            onUpdateStatus={handleUpdateStatus}
            isUpdating={isUpdatingStatus}
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
