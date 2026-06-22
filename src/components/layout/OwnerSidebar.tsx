'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  MapPin, 
  PlusCircle, 
  BarChart3, 
  Users, 
  Settings,
  ChevronRight
} from 'lucide-react';

const OWNER_LINKS = [
  { href: '/owner/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/owner/pitches', label: 'My Pitches', icon: MapPin },
  { href: '/owner/pitches/new', label: 'Add New Pitch', icon: PlusCircle },
  { href: '/owner/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/owner/customers', label: 'Customers', icon: Users },
  { href: '/owner/settings', label: 'Settings', icon: Settings },
];

export default function OwnerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-[calc(100vh-73px)] w-64 border-r border-gray-100 bg-white lg:block sticky top-[73px]">
      <nav className="flex flex-col gap-1 p-4">
        {OWNER_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <link.icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                {link.label}
              </div>
              {isActive && <ChevronRight className="h-3 w-3" />}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 left-4 right-4">
        <div className="rounded-2xl bg-gray-900 p-4 text-center">
          <p className="text-xs font-medium text-emerald-400 uppercase tracking-widest">PitchPro Plus</p>
          <p className="mt-1 text-[11px] text-gray-400">Unlock advanced AI analysis</p>
          <button className="mt-3 w-full rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
