'use client';

import ProfileMenu from './components/ProfileMenu';
import DashboardLink from './components/DashboardLink';
import { User } from './types';
import { ROUTES } from '@/lib/route.constants';
import { LayoutDashboard, MapPinned, ShieldCheck, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ADMIN_NAV_LINKS = [
  {
    href: ROUTES.adminDashboard,
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: ROUTES.adminUsers,
    label: 'Quản lý người dùng',
    icon: Users,
  },
  {
    href: ROUTES.adminOwners,
    label: 'Quản lý chủ sân',
    icon: ShieldCheck,
  },
  {
    href: ROUTES.adminFields,
    label: 'Quản lý tạo sân',
    icon: MapPinned,
  },
];
interface AdminMenuProps {
  user: User;
  handleLogout: () => void;
  isMobile?: boolean;
  onActionClick?: () => void;
}

export default function AdminMenu({
  user,
  handleLogout,
  isMobile = false,
  onActionClick,
}: AdminMenuProps) {
  const pathname = usePathname();
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        <ProfileMenu user={user} isMobile onLinkClick={onActionClick} />
        <div className="mt-2 border-t border-gray-100 pt-2">
          {ADMIN_NAV_LINKS.map((link) => {
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
    <div className="hidden items-center gap-3 border-l border-gray-200 pl-4 md:flex">
      <ProfileMenu user={user} />
      {/* <DashboardLink 
        role="ADMIN" 
        className="ml-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700" 
      /> */}
      <div className="hidden items-center gap-1 md:flex">
        {ADMIN_NAV_LINKS.map((link) => {
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
              <link.icon
                className={`h-4 w-4 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}
              />
              {link.label}
            </Link>
          );
        })}
      </div>
      <button
        onClick={handleLogout}
        className="ml-2 rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
      >
        Đăng Xuất
      </button>
    </div>
  );
}
