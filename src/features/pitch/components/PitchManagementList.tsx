'use client';

import { Edit2, Trash2, Eye, MapPin, Star, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const MY_PITCHES = [
  {
    id: '1',
    name: 'San Siro Premium Turf',
    location: '72nd St, Ho Chi Minh City',
    rating: 4.9,
    price: 35,
    status: 'Active',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=400&q=80',
    revenue: '$1,240',
  },
  {
    id: '2',
    name: 'Old Trafford Mini',
    location: 'District 7, Ho Chi Minh City',
    rating: 4.7,
    price: 28,
    status: 'Under Maintenance',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80',
    revenue: '$850',
  },
];

const STATUS_STYLE: Record<string, string> = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  'Under Maintenance': 'bg-red-50 text-red-700 ring-red-600/10',
  Hidden: 'bg-gray-50 text-gray-700 ring-gray-600/10',
};

export default function PitchManagementList() {
  return (
    <div className="space-y-4">
      {MY_PITCHES.map((pitch) => (
        <div key={pitch.id} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-col sm:flex-row">
            {/* Image */}
            <div className="relative h-40 w-full sm:w-48 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pitch.image} alt={pitch.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900">{pitch.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1 ring-inset ${STATUS_STYLE[pitch.status]}`}>
                      {pitch.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-gray-500">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-sm">{pitch.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link href={`/pitch/${pitch.id}`}>
                    <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-gray-100 text-gray-400 hover:text-emerald-600 hover:border-emerald-100">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/owner/pitches/${pitch.id}/edit`}>
                    <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-gray-100 text-gray-400 hover:text-emerald-600 hover:border-emerald-100">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-xl border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-100">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 pt-4 border-t border-gray-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Monthly Revenue</p>
                  <p className="text-lg font-bold text-emerald-700">{pitch.revenue}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Avg Rating</p>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <p className="text-sm font-bold text-gray-900">{pitch.rating}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Price/Hour</p>
                  <p className="text-sm font-bold text-gray-900">${pitch.price}</p>
                </div>
                <div className="ml-auto hidden sm:block">
                    <Button className="h-9 rounded-xl bg-gray-50 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm border-transparent text-xs font-bold uppercase tracking-wider transition-all">
                        <Settings2 className="mr-2 h-4 w-4" />
                        Manage Slots
                    </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
