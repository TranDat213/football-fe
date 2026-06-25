'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/route.constants';
import ProfileMenu from './components/ProfileMenu';
import { User } from './types';

interface UserMenuProps {
  user: User;
  handleLogout: () => void;
  isMobile?: boolean;
  onActionClick?: () => void;
}

export default function UserMenu({ 
  user, 
  handleLogout, 
  isMobile = false,
  onActionClick 
}: UserMenuProps) {
  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        <ProfileMenu user={user} isMobile onLinkClick={onActionClick} />
        <Link
          href={ROUTES.ownerRegister}
          className="text-base font-medium text-emerald-700"
          onClick={onActionClick}
        >
          Đăng ký chủ sân
        </Link>
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
      <Link 
        href={ROUTES.ownerRegister} 
        className="text-sm font-medium text-emerald-700 hover:underline px-2"
      >
        Become an Owner
      </Link>
      <button
        onClick={handleLogout}
        className="ml-2 rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
      >
        Logout
      </button>
    </div>
  );
}
