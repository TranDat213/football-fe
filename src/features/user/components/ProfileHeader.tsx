'use client';

import { UserProfile } from '@/features/user/types/user.type';

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  USER: { label: 'User', className: 'bg-sky-100 text-sky-700 border border-sky-200' },
  OWNER: { label: 'Venue Owner', className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  ADMIN: { label: 'Admin', className: 'bg-purple-100 text-purple-700 border border-purple-200' },
};

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const badge = ROLE_BADGE[profile.role] ?? {
    label: profile.role,
    className: 'bg-gray-100 text-gray-600 border border-gray-200',
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="h-20 w-20 overflow-hidden rounded-full ring-4 ring-emerald-100">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 text-2xl font-bold text-white">
                {profile.firstName?.charAt(0).toUpperCase() ?? profile.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {/* Online dot */}
          <span className="absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-bold text-gray-900">
            {profile.firstName} {profile.lastName}
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">@{profile.username}</p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge.className}`}>
              {badge.label}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 border border-green-200">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Đã xác minh danh tính
            </span>
          </div>
        </div>

        {/* Member since */}
        <div className="hidden text-right text-xs text-gray-400 sm:block">
          <p>Ngày tham gia</p>
          <p className="font-medium text-gray-600">
            {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(profile.createdAt))}
          </p>
        </div>
      </div>
    </div>
  );
}
