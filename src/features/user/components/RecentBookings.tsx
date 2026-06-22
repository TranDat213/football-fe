'use client';

import { MoreHorizontal, ExternalLink } from 'lucide-react';

const RECENT_BOOKINGS = [
  {
    id: '#BK1204',
    player: 'Alex Johnson',
    pitch: 'Court A - Premium',
    date: 'June 22, 2026',
    time: '18:00 - 19:30',
    amount: '$52.50',
    status: 'Confirmed',
  },
  {
    id: '#BK1205',
    player: 'Sarah Williams',
    pitch: 'Court B - Standard',
    date: 'June 22, 2026',
    time: '19:30 - 21:00',
    amount: '$45.00',
    status: 'Pending',
  },
  {
    id: '#BK1206',
    player: 'Michael Chen',
    pitch: 'Court A - Premium',
    date: 'June 23, 2026',
    time: '08:00 - 09:30',
    amount: '$35.00',
    status: 'Cancelled',
  },
  {
    id: '#BK1207',
    player: 'Robert Davis',
    pitch: 'Main Stadium',
    date: 'June 24, 2026',
    time: '17:00 - 19:00',
    amount: '$120.00',
    status: 'Confirmed',
  },
];

const STATUS_STYLE: Record<string, string> = {
  Confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-600/10',
  Cancelled: 'bg-red-50 text-red-700 ring-red-600/10',
};

export default function RecentBookings() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
        <h3 className="font-bold text-gray-900">Recent Bookings</h3>
        <button className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors uppercase tracking-wider">
          View All <ExternalLink className="h-3 w-3" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Booking ID</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Player</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Pitch</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Schedule</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400">Amount</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center">Status</th>
              <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {RECENT_BOOKINGS.map((booking) => (
              <tr key={booking.id} className="group hover:bg-gray-50/40 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-mono text-xs font-semibold text-gray-400 group-hover:text-emerald-600 transition-colors">{booking.id}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">{booking.player}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-500">{booking.pitch}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">{booking.date}</span>
                    <span className="text-xs text-gray-400">{booking.time}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-gray-900">{booking.amount}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${STATUS_STYLE[booking.status]}`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-900 transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
