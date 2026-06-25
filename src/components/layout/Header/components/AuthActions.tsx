'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/route.constants';

interface AuthActionsProps {
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export default function AuthActions({ isMobile = false, onLinkClick }: AuthActionsProps) {
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 pt-2">
        <Link
          href={ROUTES.login}
          className="flex h-11 items-center justify-center rounded-lg border border-emerald-600 text-sm font-medium text-emerald-600"
          onClick={onLinkClick}
        >
          Đăng Nhập
        </Link>
        <Link
          href={ROUTES.register}
          className="flex h-11 items-center justify-center rounded-lg bg-emerald-600 text-sm font-medium text-white"
          onClick={onLinkClick}
        >
          Đăng Ký
        </Link>
        <Link
          href={ROUTES.ownerRegister}
          className="text-center text-sm font-medium text-emerald-700"
          onClick={onLinkClick}
        >
          Đăng ký chủ sân
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href={ROUTES.login}
        className="rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
      >
        Đăng Nhập
      </Link>
      <Link
        href={ROUTES.register}
        className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Đăng Ký
      </Link>
      <Link
        href={ROUTES.ownerRegister}
        className="text-sm font-medium text-emerald-700 hover:underline"
      >
        Đăng ký chủ sân
      </Link>
    </div>
  );
}
