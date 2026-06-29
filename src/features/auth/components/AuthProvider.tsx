'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProfileQuery } from '@/features/user/api/userAPI';
import { setUser } from '../slice/authSlice';
import { RootState } from '@/store/store';
import Cookies from 'js-cookie';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const token = Cookies.get('access_token');

  // Skip the query if there's no token
  const { data: profileResponse, isSuccess } = useGetProfileQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (isSuccess && profileResponse?.data && !user) {
      dispatch(setUser(profileResponse.data));
    }
  }, [isSuccess, profileResponse, user, dispatch]);

  return <>{children}</>;
};
