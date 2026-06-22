import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OwnerSidebar from '@/components/layout/OwnerSidebar';
import OwnerStats from '@/features/user/components/OwnerStats';
import RecentBookings from '@/features/user/components/RecentBookings';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function OwnerDashboardPage() {
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
              <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back! Here&apos;s what&apos;s happening with your pitches today.</p>
            </div>
            <Link href="/owner/pitches/new">
                <Button className="bg-emerald-700 hover:bg-emerald-800 rounded-xl px-6 h-10 text-xs font-bold uppercase tracking-wider group">
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                Add New Pitch
                </Button>
            </Link>
          </div>

          <div className="mt-8 space-y-8">
            <OwnerStats />
            
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
                <div className="xl:col-span-8">
                    <RecentBookings />
                </div>
                
                {/* Secondary Sidebar/Activity */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
                        <h3 className="font-bold text-gray-900">Market Insight</h3>
                        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
                            Pitches in your area are seeing a <span className="font-bold text-emerald-600">15% surge</span> in bookings for next weekend. Consider opening extra late-night slots!
                        </p>
                        <hr className="my-4 border-gray-50" />
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-gray-600">Peak hour demand</span>
                                <span className="text-[13px] font-bold text-gray-900">High</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] text-gray-600">Competitor pricing</span>
                                <span className="text-[13px] font-bold text-gray-900">$32 - $45</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-emerald-900 p-6 text-white overflow-hidden relative group">
                        <div className="absolute -right-4 -bottom-4 h-32 w-32 bg-emerald-700 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
                        <h3 className="text-lg font-bold text-emerald-400">Pro Tip</h3>
                        <p className="mt-3 text-[13px] text-emerald-100/80 leading-relaxed">
                            Setting up automated lighting schedules can save you up to 20% on electricity costs during off-peak and dead times between bookings.
                        </p>
                        <button className="mt-4 text-[11px] font-bold uppercase tracking-widest text-white hover:text-emerald-400 underline underline-offset-4 transition-colors">
                            Manage Schedules
                        </button>
                    </div>
                </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
