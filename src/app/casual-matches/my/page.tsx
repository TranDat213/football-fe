'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import { CasualMatchCard } from '@/features/casual-match/components/CasualMatchCard';
import { useGetHostCasualMatchesQuery } from '@/features/casual-match/api/casualMatch.api';
import { statusLabels } from '@/features/casual-match/utils/labels';
import type { CasualMatchStatus } from '@/features/casual-match/types/casual-match.types';
import { useState } from 'react';

const STATUS_TABS: { value: CasualMatchStatus | ''; label: string }[] = [
  { value: '', label: 'T\u1ea5t c\u1ea3' },
  { value: 'OPEN', label: statusLabels['OPEN'] },
  { value: 'FULL', label: statusLabels['FULL'] },
  { value: 'STARTED', label: statusLabels['STARTED'] },
  { value: 'FINISHED', label: statusLabels['FINISHED'] },
  { value: 'CLOSED', label: statusLabels['CLOSED'] },
  { value: 'CANCELLED', label: statusLabels['CANCELLED'] },
];

export default function MyCasualMatchesPage() {
  const [status, setStatus] = useState<CasualMatchStatus | ''>('');
  const { data, isLoading, isFetching, isError, refetch } = useGetHostCasualMatchesQuery(
    status ? { status } : undefined,
  );

  const matches = data?.data ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Tran vang lai cua toi</h1>
          {isFetching && !isLoading && <Loader2 className="h-4 w-4 animate-spin text-emerald-700" />}
        </div>

        {/* Status filter tabs */}
        <div className="mb-5 flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                status === tab.value
                  ? 'bg-emerald-700 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:border-emerald-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
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
            <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">Co loi xay ra khi tai danh sach tran.</p>
            <Button onClick={() => refetch()} className="mt-6 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800">Thu lai</Button>
          </section>
        )}

        {/* Empty */}
        {!isLoading && !isError && matches.length === 0 && (
          <section className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="mx-auto mt-3 max-w-md text-sm text-gray-500">
              {status ? `Khong co tran nao o trang thai nay.` : 'Ban chua tao tran vang lai nao.'}
            </p>
            {!status && (
              <Button asChild className="mt-6 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800">
                <Link href="/casual-matches/create">Tao tran moi</Link>
              </Button>
            )}
          </section>
        )}

        {/* List */}
        {!isLoading && !isError && matches.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {matches.map((match) => (
              <CasualMatchCard key={match.id} match={match} detailHref={`/casual-matches/${match.id}/participants`} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}