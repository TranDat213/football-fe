 'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PostCard from '@/features/community/components/PostCard';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useGetCasualMatchesQuery } from '@/features/casual-match/api/casualMatch.api';
import { CasualMatchCard } from '@/features/casual-match/components/CasualMatchCard';
import { ROUTES } from '@/lib/route.constants';


export default function CommunityPage() {
  const [keyword, setKeyword] = useState('');
  const { data: matches, isLoading } = useGetCasualMatchesQuery({ keyword: keyword || undefined, limit: 10 });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Feed Sidebar (Left/Desktop) */}
          <div className="hidden lg:col-span-3 lg:block space-y-4">
            <div className="rounded-2xl bg-white border border-gray-100 p-2">
                <Button asChild variant="ghost" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm">
                    <Link href={ROUTES.myCasualMatches}>Trận của tôi</Link>
                </Button>
            </div>

            
          </div>

          {/* Main Feed (Center) */}
         <div className="lg:col-span-6 space-y-8">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Tìm trận vãng lai..." 
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
            </div>

            <section className="space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 px-1">Trận vãng lai đang mở</h2>
                {isLoading ? (
                    <div className="flex h-32 items-center justify-center rounded-2xl bg-white">
                        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
                    </div>
                ) : matches?.data.length ? (
                    matches.data.map((match) => <CasualMatchCard key={match.id} match={match} />)
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-5 text-center text-sm text-gray-500">
                        Chưa có trận đang mở.
                    </div>
                )}
                
            </section>

            <div className="rounded-2xl bg-gray-900 p-6 text-white text-center">
                <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-2">Host a match</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed mb-4">Không tìm thấy trận đấu, hãy tạo một bài vãng lai của bạn</p>
                <Button asChild className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 h-10 text-[11px] font-bold uppercase tracking-widest">
                    <Link href={ROUTES.createCasual}>Tạo trận ngẫu hứng</Link>
                </Button>
            </div>
          </div>

          {/* Matchmaking Sidebar (Right) */}
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
