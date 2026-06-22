'use client';

import { Star, MapPin, Users, Zap, ShieldCheck, Clock } from 'lucide-react';

interface PitchInfoProps {
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  price: number;
  features: string[];
  capacity: string;
}

export default function PitchInfo({
  name,
  rating,
  reviewCount,
  location,
  price,
  features,
  capacity,
}: PitchInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-semibold text-gray-900">{rating}</span>
            <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{location}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Starting from</p>
          <p className="text-2xl font-bold text-emerald-950">${price}<span className="text-sm font-normal text-emerald-800/70">/hour</span></p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">Capacity</p>
          <div className="flex items-center justify-end gap-1.5 text-emerald-950">
            <Users className="h-4 w-4" />
            <span className="font-bold">{capacity}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Main Facilities</h3>
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2.5 rounded-xl border border-gray-100 bg-white p-3 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors group">
              <ShieldCheck className="h-4 w-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl bg-gray-50 p-4 border border-gray-100">
        <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-gray-900">Operating Hours</p>
          <p className="text-sm text-gray-500">Mon - Sun: 06:00 AM - 11:00 PM</p>
        </div>
      </div>
    </div>
  );
}
