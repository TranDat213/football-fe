'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProfileQuery } from '@/features/user/api/userAPI';
import { setUser, clearAuth } from '@/features/auth/slice/authSlice';
import { RootState } from '@/store/store';

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  
  // Only fetch profile if not already authenticated in Redux state
  const { data: profileResponse, error, isLoading } = useGetProfileQuery(undefined, {
    skip: isAuthenticated,
  });

  useEffect(() => {
    if (profileResponse?.data) {
      dispatch(setUser(profileResponse.data));
    } else if (error) {
      // If profile fetch fails (e.g., 401), ensure state is cleared
      dispatch(clearAuth());
    }
  }, [profileResponse, error, dispatch]);

  // Show a loading spinner while profile request has not resolved
  if (!isAuthenticated && !profileResponse && !error) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return <>{children}</>;
}
