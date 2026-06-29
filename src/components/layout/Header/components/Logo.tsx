'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/route.constants';

export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <div
      className={`${className} flex items-center justify-center rounded-full bg-emerald-600 text-white`}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 7l3 2.2-1.1 3.5h-3.8L9 9.2 12 7z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function Logo() {
  return (
    <Link href={ROUTES.home} className="flex items-center gap-2">
      <LogoMark />
      <span className="text-lg font-bold tracking-tight">
        ChanDen<span className="text-emerald-600">Club</span>
      </span>
    </Link>
  );
}
