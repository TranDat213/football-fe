import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OwnerStats from '@/features/user/components/OwnerStats';
import RecentBookings from '@/features/booking/components/management/RecentBookings';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/route.constants';

export default function OwnerDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard chủ sân</h1>
              <p className="mt-1 text-sm text-gray-500">Chào mừng trở lại! Đây là những gì đang diễn ra với sân của bạn hôm nay.</p>
            </div>
            <Link href={ROUTES.ownerPitchNew}>
                <Button className="bg-emerald-700 hover:bg-emerald-800 rounded-xl px-6 h-10 text-xs font-bold uppercase tracking-wider group text-white">
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                Thêm sân mới
                </Button>
            </Link>
          </div>

          <div className="mt-8 space-y-8">
            <OwnerStats />
            
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                <div className="xl:col-span-8">
                    <RecentBookings />
                </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
