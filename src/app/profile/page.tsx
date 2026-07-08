'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProfileHeader from '@/features/user/components/ProfileHeader';
import PersonalInfoForm from '@/features/user/components/PersonalInfoForm';
import PasswordSection from '@/features/user/components/PasswordSection';
import { useGetProfileQuery } from '@/features/user/api/userAPI';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROUTES } from '@/lib/route.constants';

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-5">
      {/* Header card skeleton */}
      <div className="h-32 rounded-2xl bg-gray-200" />
      {/* Form skeleton */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6 h-5 w-48 rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="h-10 w-full rounded-lg bg-gray-200" />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <div className="h-10 w-32 rounded-lg bg-gray-200" />
        </div>
      </div>
      {/* Password skeleton */}
      <div className="h-32 rounded-2xl bg-gray-200" />
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const { data, isLoading, isError } = useGetProfileQuery(undefined, {
    skip: !authUser,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authUser) {
      router.replace(ROUTES.login);
    }
  }, [authUser, router]);

  if (!authUser) return null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Page Title */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold text-gray-900">Cài đặt tài khoản</h1>
          <p className="mt-1 text-sm text-gray-500">
            Quản lý thông tin cá nhân và tài khoản của bạn
          </p>
        </div>

        {isLoading && <ProfileSkeleton />}

        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-sm font-medium text-red-700">
              Không thể tải thông tin cá nhân. Vui lòng làm mới và thử lại.
            </p>
          </div>
        )}

        {data?.data && (
          <div className="space-y-5">
            <ProfileHeader profile={data.data} />
            <PersonalInfoForm profile={data.data} />
            {/* <PasswordSection /> */}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
