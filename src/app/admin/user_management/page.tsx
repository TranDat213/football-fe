'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Users, UserIcon, LayoutDashboard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useUserManagement } from '@/features/admin/hook/useUserManagement';
import { UserTable } from '@/features/admin/component/UserTable';
import { Pagination } from '@/features/admin/component/Pagination';
import { SearchInput } from '@/components/filter/SearchInput';

export default function UserManagementPage() {
  const {
    list,
    page,
    limit,
    keyword,
    isLoading,
    stats,
    handlePageChange,
    handleKeywordChange,
    updateStatus,
    isUpdatingStatus,
  } = useUserManagement('USER');

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
                className="text-gray-400 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                <Link href="/admin">Dashboard</Link>
                <span>/</span>
                <span className="text-indigo-600">Quản lý người dùng</span>
              </nav>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 border-b-4 border-indigo-600 inline-block pb-1">
              Người dùng
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/owner_management"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
            >
              <UserIcon className="h-3.5 w-3.5" />
              Chuyển sang Chủ sân
            </Link>
          </div>
        </div>

        {/* Stats Summary & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex-1">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Tổng người dùng
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {isLoading ? '...' : stats?.totalUsers?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80">
            <SearchInput
              value={keyword}
              onChange={handleKeywordChange}
              placeholder="Tìm theo tên, email, SĐT, username..."
            />
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
