'use client';

import { ROUTES } from '@/lib/route.constants';
import { RootState } from '@/store/store';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useLogout } from '@/features/auth/hooks/useLogout';

const NAV_LINKS = ['Find Pitches', 'Leagues', 'Book a Match', 'My Bookings'];

function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
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

function IconBell({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6 9a6 6 0 1 1 12 0c0 3.2 1 4.8 1.6 5.7.3.4 0 1-.5 1H4.9c-.5 0-.8-.6-.5-1C5 13.8 6 12.2 6 9Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M10 18a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const { handleLogout } = useLogout();
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user);
  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="text-lg font-bold tracking-tight">
            ChanDen<span className="text-emerald-600">Club</span>
          </span>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="transition-colors hover:text-emerald-700"
            >
              {link}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            aria-label="Notifications"
            className="text-gray-500 hover:text-gray-700"
          >
            <IconBell />
          </button>
          {user ? (
            <div className="hidden items-center gap-2 border-l border-gray-200 pl-4 sm:flex">
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-gray-900">
                  {user.user_name}
                </p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>

              <div className="h-9 w-9 overflow-hidden rounded-full bg-emerald-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatar}
                  alt={user.user_name}
                  className="h-full w-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4 sm:flex">
              <Link
                href={ROUTES.login}
                className="rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
              >
                Login
              </Link>
              <Link
                href={ROUTES.register}
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Register
              </Link>
              <Link
                href={ROUTES.ownerRegister}
                className="text-sm font-medium text-emerald-700 hover:underline"
              >
                Become an Owner
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
