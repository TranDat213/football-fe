'use client';

import { useState } from 'react';
import { ROUTES } from '@/lib/route.constants';
import { RootState } from '@/store/store';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useLogout } from '@/features/auth/hooks/useLogout';

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

function IconMenu({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path 
        d="M4 6h16M4 12h16M4 18h16" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

function IconClose({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path 
        d="M6 18L18 6M6 6l12 12" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { handleLogout } = useLogout();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const isGuest = !user;
  const isAdmin = user?.role === 'ADMIN';
  const isOwner = user?.role === 'OWNER';
  const isUser = !!user && !isAdmin && !isOwner;

  const navLinks = [
    { label: 'Find Pitches', href: ROUTES.pitch },
    { label: 'Leagues', href: ROUTES.leagues },
    { label: 'Book a Match', href: ROUTES.book },
  ];

  if (isUser || isGuest) {
    navLinks.push({ label: 'My Bookings', href: ROUTES.booking });
  }

  if (isOwner) {
    navLinks.push({ label: 'Dashboard', href: ROUTES.ownerDashboard });
  }

  if (isAdmin) {
    navLinks.push({ label: 'Dashboard', href: ROUTES.adminDashboard });
  }

  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <LogoMark />
          <span className="text-lg font-bold tracking-tight">
            ChanDen<span className="text-emerald-600">Club</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-emerald-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Area */}
        <div className="flex items-center gap-4">
          <button
            aria-label="Notifications"
            className="text-gray-500 hover:text-gray-700"
          >
            <IconBell />
          </button>

          {/* Desktop Auth/Profile - Hidden on Mobile */}
          <div className="hidden items-center gap-3 border-l border-gray-200 pl-4 md:flex">
            {user ? (
              <>
                <div className="text-right leading-tight">
                  <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
                <div className="h-9 w-9 overflow-hidden rounded-full bg-emerald-100">
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {isUser && (
                  <Link href={ROUTES.ownerRegister} className="text-sm font-medium text-emerald-700 hover:underline px-2">
                    Become an Owner
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="ml-2 rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href={ROUTES.login} className="rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50">
                  Login
                </Link>
                <Link href={ROUTES.register} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                  Register
                </Link>
                <Link href={ROUTES.ownerRegister} className="text-sm font-medium text-emerald-700 hover:underline">
                  Become an Owner
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="text-gray-600 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar/Dropdown */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-6 md:hidden">
          {user && (
            <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-6">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-emerald-100">
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900">{user.username}</p>
                <p className="text-sm text-gray-500">{user.role}</p>
              </div>
            </div>
          )}

          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-base font-medium text-gray-600 transition-colors hover:text-emerald-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            {isUser && (
              <Link
                href={ROUTES.ownerRegister}
                className="text-base font-medium text-emerald-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Become an Owner
              </Link>
            )}

            {!user && (
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href={ROUTES.login}
                  className="flex h-11 items-center justify-center rounded-lg border border-emerald-600 text-sm font-medium text-emerald-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href={ROUTES.register}
                  className="flex h-11 items-center justify-center rounded-lg bg-emerald-600 text-sm font-medium text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
                <Link
                  href={ROUTES.ownerRegister}
                  className="text-center text-sm font-medium text-emerald-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Become an Owner
                </Link>
              </div>
            )}
            
            {user && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center rounded-lg bg-red-50 h-11 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
