'use client';

import AuthActions from './components/AuthActions';

interface GuestMenuProps {
  isMobile?: boolean;
  onActionClick?: () => void;
}

export default function GuestMenu({ isMobile = false, onActionClick }: GuestMenuProps) {
  return <AuthActions isMobile={isMobile} onLinkClick={onActionClick} />;
}
