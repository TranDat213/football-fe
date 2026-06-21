'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/route.constants';

interface DashboardLinkProps {
  role: string;
  className?: string;
  onClick?: () => void;
}

export default function DashboardLink({ role, className = '', onClick }: DashboardLinkProps) {
  const href = role === 'ADMIN' ? ROUTES.adminDashboard : ROUTES.ownerDashboard;
  
  return (
    <Link
      href={href}
      className={`transition-colors hover:text-emerald-700 ${className}`}
      onClick={onClick}
    >
      Dashboard
    </Link>
  );
}
