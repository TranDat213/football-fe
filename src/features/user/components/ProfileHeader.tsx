'use client';

import React, { useRef } from 'react';
import { UserProfile } from '@/features/user/types/user.type';
import { useUpdateProfileMutation } from '@/features/user/api/userAPI';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ROLE_BADGE: Record<string, { label: string; className: string }> = {
  USER: { label: 'User', className: 'bg-sky-100 text-sky-700 border border-sky-200' },
  OWNER: { label: 'Venue Owner', className: 'bg-emerald-100 text-emerald-700 border border-emerald-200' },
  ADMIN: { label: 'Admin', className: 'bg-purple-100 text-purple-700 border border-purple-200' },
};

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [updateProfile, { isLoading: isUploading }] = useUpdateProfileMutation();

  const badge = ROLE_BADGE[profile.role] ?? {
    label: profile.role,
    className: 'bg-gray-100 text-gray-600 border border-gray-200',
  };

  const handleAvatarClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn tệp hình ảnh hợp lệ (JPG, PNG, WEBP,...)');
      return;
    }

    // Max 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh tối đa là 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      await updateProfile(formData).unwrap();
      toast.success('Cập nhật ảnh đại diện thành công!');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Không thể tải ảnh đại diện lên. Vui lòng thử lại!');
    } finally {
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        {/* Avatar Container with Upload */}
        <div className="relative shrink-0 group">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={handleAvatarClick}
            className="h-24 w-24 overflow-hidden rounded-full ring-4 ring-emerald-100 relative cursor-pointer group-hover:ring-emerald-300 transition-all"
            title="Nhấn để đổi ảnh đại diện"
          >
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-500 to-emerald-700 text-3xl font-bold text-white">
                {profile.firstName?.charAt(0).toUpperCase() ?? profile.username.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Loading Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-full text-white">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-[10px] font-medium mt-1">Đang tải...</span>
              </div>
            )}

            {/* Hover Camera Overlay */}
            {!isUploading && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-full text-white">
                <Camera className="h-6 w-6" />
                <span className="text-[10px] font-medium mt-0.5">Đổi ảnh</span>
              </div>
            )}
          </div>

          {/* Quick Action Button Badge */}
          <button
            type="button"
            onClick={handleAvatarClick}
            disabled={isUploading}
            className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white ring-2 ring-white shadow-md hover:bg-emerald-700 transition-transform active:scale-95 disabled:opacity-50"
            title="Đổi ảnh đại diện"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>
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
