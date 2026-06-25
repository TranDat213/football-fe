'use client';

import ProfileMenu from './components/ProfileMenu';
import DashboardLink from './components/DashboardLink';
import { User } from './types';

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
  onActionClick 
}: AdminMenuProps) {
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        <ProfileMenu user={user} isMobile onLinkClick={onActionClick} />
        <DashboardLink 
          role="ADMIN" 
          className="text-base font-medium text-gray-600" 
          onClick={onActionClick}
        />
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
      <DashboardLink 
        role="ADMIN" 
        className="ml-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700" 
      />
      <button
        onClick={handleLogout}
        className="ml-2 rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
      >
        Đăng Xuất
      </button>
    </div>
  );
}
