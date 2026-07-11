import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PitchManagementList from '@/features/pitch/components/PitchManagementList';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter, Balloon } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/route.constants';

export default function OwnerPitchesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sân của tôi</h1>
              <p className="mt-1 text-sm text-gray-500">
                Quản lý thông tin cơ sở, giá cả và tình trạng sẵn có của bạn.
              </p>
            </div>
            <Link href={ROUTES.ownerPitchNew}>
              <Button className="bg-emerald-700 hover:bg-emerald-800 rounded-xl px-6 h-10 text-xs font-bold uppercase tracking-wider">
                <Plus className="mr-2 h-4 w-4" />
                Thêm sân mới
              </Button>
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href="/owner/pitches/update-request-management"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
              >
                <Balloon className="h-3.5 w-3.5" />
                Yêu cầu sân chờ cập nhật
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search pitches by name or location..."
                className="w-full rounded-xl border border-gray-100 bg-white py-2.5 pl-10 pr-4 text-sm font-medium transition-all focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/5 ring-0"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                className="flex-1 sm:flex-initial rounded-xl border-gray-100 bg-white text-gray-600 hover:bg-gray-50 h-10 px-4 text-xs font-bold uppercase tracking-wider"
              >
                <Filter className="mr-2 h-3.5 w-3.5" />
                Lọc sân
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <PitchManagementList />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
