'use client';

import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useUpdateProfileMutation } from '@/features/user/api/userAPI';
import { setUser } from '@/features/auth/slice/authSlice';
import { UserProfile } from '@/features/user/types/user.type';

export interface UpdateProfileValues {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
}

export function useUpdateProfile(currentProfile: UserProfile) {
  const dispatch = useDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (values: UpdateProfileValues) => {
    setError(null);
    setSuccess(false);

    try {
      await updateProfile({
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        phone: values.phone,
      }).unwrap();

      // Sync Redux store so Header and other consumers see the updated data
      dispatch(
        setUser({
          ...currentProfile,
          firstName: values.firstName,
          lastName: values.lastName,
          username: values.username,
          email: values.email,
          phone: values.phone,
        })
      );

      setSuccess(true);
    } catch {
      setError('Failed to update profile. Please try again.');
    }
  };

  return { submit, isLoading, success, error, setSuccess };
}
