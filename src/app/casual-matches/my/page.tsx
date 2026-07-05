'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { CasualMatchCard } from '@/features/casual-match/components/CasualMatchCard';
import { useGetHostCasualMatchesQuery } from '@/features/casual-match/api/casualMatch.api';

export default function MyCasualMatchesPage() {
  const { data, isLoading, isFetching, isError, refetch } = useGetHostCasualMatchesQuery();

  const matches = data?.data ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-black text-gray-900">Trận vãng lai của tôi</h1>
          {isFetching && !isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-10">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-700" />
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <section className="rounded-2xl border border-dashed border-red-200 bg-white p-10 text-center shadow-sm">
            <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
            <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
              Có lỗi xảy ra khi tải danh sách trận đã tham gia.
            </p>
            <Button
              onClick={() => refetch()}
              className="mt-6 rounded-xl bg-emerald-700 hover:bg-emerald-800"
            >
              Thử lại
            </Button>
          </section>
        )}

        {/* Empty */}
        {!isLoading && !isError && matches.length === 0 && (
          <section className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
              Bạn chưa tham gia trận vãng lai nào.
            </p>
            <Button asChild className="mt-6 rounded-xl bg-emerald-700 hover:bg-emerald-800">
              <Link href="/community">Tìm trận đang mở</Link>
            </Button>
          </section>
        )}

        {/* List */}
        {!isLoading && !isError && matches.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {matches.map((match) => (
              <CasualMatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}