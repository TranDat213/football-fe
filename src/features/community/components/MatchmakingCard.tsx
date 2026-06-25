'use client';

import { Users, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MatchmakingCardProps {
  title: string;
  type: string;
  location: string;
  time: string;
  needed: number;
  joined: number;
  skillLevel: string;
}

export default function MatchmakingCard({
  title,
  type,
  location,
  time,
  needed,
  joined,
  skillLevel,
}: MatchmakingCardProps) {
  const percent = (joined / (joined + needed)) * 100;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md group">
      <div className="flex justify-between items-start mb-4">
        <div className="inline-flex items-center rounded-lg bg-indigo-50 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-700">
          {type}
        </div>
        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {skillLevel}
        </div>
      </div>
      
      <h4 className="text-sm font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">{title}</h4>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapPin className="h-3.5 w-3.5 text-gray-400" />
          {location}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="h-3.5 w-3.5 text-gray-400" />
          {time}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Users className="h-3.5 w-3.5 text-gray-400" />
          {joined} đã tham gia • {needed} cần thêm
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-gray-50">
        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${percent}%` }} />
        </div>
        <Button className="w-full h-9 rounded-xl bg-gray-900 hover:bg-gray-800 text-[11px] font-bold uppercase tracking-widest transition-all active:scale-[0.98]">
          Tham gia trận đấu
        </Button>
      </div>
    </div>
  );
}
