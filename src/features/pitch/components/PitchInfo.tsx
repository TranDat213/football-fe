'use client';

import { MapPin } from 'lucide-react';

interface Owner {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  email?: string;
}

interface PitchInfoProps {
  name: string;
  address: string;
  description?: string | null;
  owner?: Owner;
}

export default function PitchInfo({ name, address, owner }: PitchInfoProps) {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">{name}</h1>

      <div className="flex flex-wrap items-center gap-4">
        {/* Owner */}
        {owner && (
          <div className="flex items-center gap-2">
            {owner.avatarUrl ? (
              <img
                src={owner.avatarUrl}
                alt={`${owner.firstName} ${owner.lastName}`}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                {owner.firstName?.[0] ?? '?'}
              </div>
            )}
            <span className="text-sm text-gray-700 font-medium">
              {owner.firstName} {owner.lastName}
            </span>
            <span className="text-xs text-gray-500">{owner.email}</span>
          </div>
        )}

        {/* Address */}
        <div className="flex items-center gap-1.5 text-gray-500">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="text-sm">{address}</span>
        </div>
      </div>
    </div>
  );
}
