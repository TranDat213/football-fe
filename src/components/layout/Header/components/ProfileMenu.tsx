'use client';

import Link from 'next/link';
import { ROUTES } from '@/lib/route.constants';
import { User } from '../types';

interface ProfileMenuProps {
  user: User;
  isMobile?: boolean;
  onLinkClick?: () => void;
}

function Avatar({ user, size = 'sm' }: { user: User; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'md' ? 'h-12 w-12 text-lg' : 'h-9 w-9 text-sm';
  return (
    <div className={`${sizeClass} overflow-hidden rounded-full bg-emerald-100 shrink-0`}>
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatarUrl}
          alt={user.username}
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-emerald-600 text-white font-bold">
          {user.username.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export default function ProfileMenu({ user, isMobile = false, onLinkClick }: ProfileMenuProps) {
  if (isMobile) {
    return (
      <Link
        href={ROUTES.profile}
        onClick={onLinkClick}
        className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-6 hover:opacity-80 transition-opacity"
      >
        <Avatar user={user} size="md" />
        <div>
          <p className="text-base font-bold text-gray-900">{user.username}</p>
          <p className="text-sm text-gray-500 uppercase">{user.role}</p>
          <p className="text-xs text-emerald-600 mt-0.5">View Profile →</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={ROUTES.profile}
      className="flex items-center gap-3 rounded-lg px-1 py-1 transition-colors hover:bg-gray-50"
      title="View Profile"
    >
      <div className="text-right leading-tight">
        <p className="text-sm font-semibold text-gray-900">{user.username}</p>
        <p className="text-xs text-gray-400 uppercase">{user.role}</p>
      </div>
      <Avatar user={user} size="sm" />
    </Link>
  );
}
