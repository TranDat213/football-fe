'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { ROUTES } from '@/lib/route.constants';
import { NavLink, UserRole } from '../types';

export function useHeader() {
  const user = useSelector((state: RootState) => state.auth.user);
  
  const role = user?.role as UserRole | undefined;
  const isGuest = !user;
  const isAdmin = role === 'ADMIN';
  const isOwner = role === 'OWNER';
  const isUser = !!user && !isAdmin && !isOwner;

  const navLinks = useMemo(() => {
    const links: NavLink[] = [
      { label: 'Find Pitches', href: ROUTES.pitch },
      { label: 'Leagues', href: ROUTES.leagues },
      { label: 'Book a Match', href: ROUTES.book },
      { label: 'My Bookings', href: ROUTES.booking },
      { label: 'Community', href: ROUTES.community },
    ];

    if (isOwner) {
      links.push({ label: 'Dashboard', href: ROUTES.ownerDashboard });
    }

    if (isAdmin) {
      links.push({ label: 'Dashboard', href: ROUTES.adminDashboard });
    }

    return links;
  }, [isAdmin, isOwner]);

  return {
    user,
    role,
    isGuest,
    isAdmin,
    isOwner,
    isUser,
    navLinks,
  };
}
