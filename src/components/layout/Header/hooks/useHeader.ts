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
      { label: 'Tìm sân', href: ROUTES.pitch },
      { label: 'Giải đấu', href: ROUTES.leagues },
      { label: 'Đặt trận', href: ROUTES.book },
      { label: 'Lịch sử đặt sân', href: ROUTES.myBooking },
      { label: 'Cộng đồng', href: ROUTES.community },
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
