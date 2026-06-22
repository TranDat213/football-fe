import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OwnerSidebar from '@/components/layout/OwnerSidebar';
import PitchManagementList from '@/features/pitch/components/PitchManagementList';
import { Button } from '@/components/ui/button';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';

export default function OwnerPitchesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        {/* Sidebar */}
        <OwnerSidebar />

        {/* Main Content */}
        <main className="flex-1 px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Pitches</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your facility information, prices, and availability.</p>
            </div>
            <Link href="/owner/pitches/new">
              <Button className="bg-emerald-700 hover:bg-emerald-800 rounded-xl px-6 h-10 text-xs font-bold uppercase tracking-wider">
                <Plus className="mr-2 h-4 w-4" />
                Add New Pitch
              </Button>
            </Link>
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
              <Button variant="outline" className="flex-1 sm:flex-initial rounded-xl border-gray-100 bg-white text-gray-600 hover:bg-gray-50 h-10 px-4 text-xs font-bold uppercase tracking-wider">
                <Filter className="mr-2 h-3.5 w-3.5" />
                Filter
              </Button>
              <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block" />
              <p className="text-xs text-gray-500 whitespace-nowrap">
                Showing <span className="font-bold text-gray-900">2</span> facilities
              </p>
            </div>
          </div>

          <div className="mt-6">
            <PitchManagementList />
          </div>

          {/* Footer Info / Tip */}
          <div className="mt-12 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                <Filter className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1 text-center sm:text-left">
                <h4 className="font-bold text-indigo-900">Need to update slots in bulk?</h4>
                <p className="mt-1 text-[13px] text-indigo-800/70">You can now use our Scheduler Pro tool to update availability for multiple courts and dates at once.</p>
            </div>
            <Button className="rounded-xl border-indigo-200 bg-white text-indigo-600 hover:bg-indigo-50 h-10 px-6 text-xs font-bold uppercase tracking-wider ring-1 ring-indigo-100 shadow-sm transition-all active:scale-95">
                Try Scheduler Pro
            </Button>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
