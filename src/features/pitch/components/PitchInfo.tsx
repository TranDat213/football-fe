'use client';

import { Star, MapPin } from 'lucide-react';

interface PitchInfoProps {
  name: string;
  rating: number;
  reviewCount: number;
  address: string;
  description?: string | null;
}

export default function PitchInfo({
  name,
  rating,
  reviewCount,
  address,
}: PitchInfoProps) {
  return (
    <div className="space-y-6">
      {/* Name + Rating + Location */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />

            <span className="text-sm font-semibold">{rating}</span>

            <span className="text-sm text-gray-500">
              ({reviewCount} đánh giá)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-500">
            <MapPin className="h-4 w-4" />

            <span className="text-sm">{address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
