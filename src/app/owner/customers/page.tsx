import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import OwnerSidebar from '@/components/layout/OwnerSidebar';
import { Search, Mail, Phone, MoreVertical, MessageSquare, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CUSTOMERS = [
  { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', phone: '0901234567', bookings: 12, rating: 5.0, status: 'Loyal', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'Sarah Wilson', email: 's.wilson@example.com', phone: '0907654321', bookings: 8, rating: 4.8, status: 'Regular', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Michael Chen', email: 'm.chen@example.com', phone: '0901122334', bookings: 3, rating: 4.5, status: 'New', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: 4, name: 'Robert Davis', email: 'r.davis@example.com', phone: '0909988776', bookings: 15, rating: 4.9, status: 'VIP', avatar: 'https://i.pravatar.cc/150?u=4' },
];

const STATUS_STYLE: Record<string, string> = {
  VIP: 'bg-indigo-50 text-indigo-700 ring-indigo-600/10',
  Loyal: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  Regular: 'bg-blue-50 text-blue-700 ring-blue-600/10',
  New: 'bg-amber-50 text-amber-700 ring-amber-600/10',
};

export default function CustomerStatsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <OwnerSidebar />

        <main className="flex-1 px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
              <p className="mt-1 text-sm text-gray-500">View and manage players who have booked your pitches.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl border-gray-100 bg-white text-gray-600 h-10 px-4 text-xs font-bold uppercase tracking-wider">
                Download CSV
              </Button>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
                        className="w-full rounded-xl border border-gray-100 bg-white py-2.5 pl-10 pr-4 text-sm font-medium transition-all focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-600/5 ring-0"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" className="flex-1 sm:flex-initial rounded-xl border-gray-100 bg-white text-gray-600 hover:bg-gray-50 h-10 px-4 text-xs font-bold uppercase tracking-wider">
                        Filter Status
                    </Button>
                </div>
            </div>

            {/* Customers Table */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Player</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Contact</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center">Bookings</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center">Avg Rating</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center">Status</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {CUSTOMERS.map((player) => (
                            <tr key={player.id} className="group hover:bg-gray-50/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={player.avatar} alt={player.name} className="h-9 w-9 rounded-full object-cover border border-gray-100" />
                                        <span className="text-sm font-bold text-gray-900">{player.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <Mail className="h-3 w-3" /> {player.email}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                            <Phone className="h-3 w-3" /> {player.phone}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="text-sm font-bold text-gray-900">{player.bookings}</span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                        <span className="text-sm font-bold text-gray-900">{player.rating}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${STATUS_STYLE[player.status]}`}>
                                        {player.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                                            <MessageSquare className="h-4 w-4" />
                                        </button>
                                        <button className="h-8 w-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Quick Reward Banner */}
            <div className="rounded-3xl bg-indigo-900 p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-2/3 bg-gradient-to-r from-indigo-800/50 to-transparent pointer-events-none" />
                <div className="relative z-10 text-center md:text-left">
                    <h3 className="text-xl font-black uppercase tracking-tight text-indigo-300">Boost Retention</h3>
                    <p className="mt-2 text-sm text-indigo-100/70 max-w-md">Send a 10% discount voucher to your top 10 most active players to keep them coming back this month.</p>
                </div>
                <Button className="relative z-10 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 h-12 px-8 text-xs font-bold uppercase tracking-widest shadow-xl shadow-indigo-900/40">
                    Send Rewards Now
                </Button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
