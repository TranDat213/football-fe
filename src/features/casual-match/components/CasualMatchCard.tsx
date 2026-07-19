'use client';

import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CasualMatch } from '../types/casual-match.types';
import { skillLevelLabels, statusLabels, teamModeLabels, yardLabel, formatMatchTime } from '../utils/labels';

export function CasualMatchCard({ match, detailHref }: { match: CasualMatch; detailHref?: string }) {
  const booking = match.booking;
  const field = booking?.fieldYard?.footballField;
  const dateText = booking ? new Date(booking.bookingDate).toLocaleDateString('vi-VN') : 'Chưa có ngày';

  return (
    <article className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-gray-900">{match.title || 'Trận vãng lai'}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="h-3.5 w-3.5" />
            {field?.name || 'Sân bóng'} · {booking?.fieldYard?.name || yardLabel[booking?.fieldYard?.type || ''] || ''}
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
          {statusLabels[match.status]}
        </span>
      </div>

      {match.description && <p className="mt-3 line-clamp-2 text-sm text-gray-500">{match.description}</p>}

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-emerald-600" />{dateText} · {formatMatchTime(booking?.startTime)} - {formatMatchTime(booking?.endTime)}</span>
        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-emerald-600" />Còn {match.availableSlots}/{match.totalSlots} slot</span>
        <span>{skillLevelLabels[match.skillLevel]}</span>
        <span>{teamModeLabels[match.teamMode]}</span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="font-bold text-emerald-700">{Number(match.slotPrice).toLocaleString('vi-VN')}đ/slot</span>
        <Button asChild className="rounded-xl bg-emerald-700 text-white hover:bg-emerald-800">
          <Link href={detailHref ?? `/casual-matches/${match.id}`}>Xem chi tiết</Link>
        </Button>
      </div>
    </article>
  );
}
