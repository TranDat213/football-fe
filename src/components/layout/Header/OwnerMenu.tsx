'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProfileMenu from './components/ProfileMenu';
import { 
  LayoutDashboard, Calendar, MapPin, PlusCircle, BarChart3 
} from 'lucide-react';
import { User } from './types';
import { ROUTES } from '@/lib/route.constants';

const OWNER_NAV_LINKS = [
  { href: ROUTES.ownerDashboard, label: 'Dashboard', icon: LayoutDashboard },
  { href: ROUTES.ownerBookings,  label: 'Đặt sân', icon: Calendar },
  { href: ROUTES.ownerPitches,   label: 'Sân của tôi', icon: MapPin },
  { href: ROUTES.ownerPitchNew, label: 'Thêm sân', icon: PlusCircle },
  { href: ROUTES.ownerAnalytics, label: 'Thống kê',  icon: BarChart3 },
];

interface OwnerMenuProps {
  user: User;
  handleLogout: () => void;
  isMobile?: boolean;
  onActionClick?: () => void;
}

export default function OwnerMenu({
  user,
  handleLogout,
  isMobile = false,
  onActionClick,
}: OwnerMenuProps) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <div className="flex flex-col gap-1">
        <ProfileMenu user={user} isMobile onLinkClick={onActionClick} />

        <div className="mt-2 border-t border-gray-100 pt-2">
          {OWNER_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onActionClick}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <link.icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center rounded-lg bg-red-50 h-11 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            Đăng Xuất
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-1 md:flex">
      {/* Nav links */}
      {OWNER_NAV_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <link.icon className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
            {link.label}
          </Link>
        );
      })}

      {/* Right side: profile + actions */}
      <div className="ml-3 flex items-center gap-3 border-l border-gray-200 pl-3">
        <ProfileMenu user={user} />
        <button
          onClick={handleLogout}
          className="rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}