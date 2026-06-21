'use client';

import { useState } from 'react';
import { useLogout } from '@/features/auth/hooks/useLogout';
import { useHeader } from './hooks/useHeader';
import Logo from './components/Logo';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import { IconMenu, IconClose } from './components/Icons';

// Role-specific menus
import UserMenu from './UserMenu';
import OwnerMenu from './OwnerMenu';
import AdminMenu from './AdminMenu';
import GuestMenu from './GuestMenu';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { handleLogout } = useLogout();
  const { user, role, isGuest, isAdmin, isOwner, isUser, navLinks } = useHeader();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const renderRoleMenu = (isMobile = false) => {
    if (isGuest) return <GuestMenu isMobile={isMobile} onActionClick={closeMenu} />;
    
    // User is authenticated
    const props = { 
      user: user!, 
      handleLogout: () => {
        handleLogout();
        closeMenu();
      },
      isMobile,
      onActionClick: closeMenu
    };

    if (isAdmin) return <AdminMenu {...props} />;
    if (isOwner) return <OwnerMenu {...props} />;
    return <UserMenu {...props} />;
  };

  return (
    <header className="sticky top-0 z-10 border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <Navigation links={navLinks} />

        {/* Action Area */}
        <div className="flex items-center gap-4">
          <Notification />

          {/* Desktop Role Menu */}
          <div className="hidden md:block">
            {renderRoleMenu()}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="text-gray-600 md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar/Dropdown */}
      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-6 py-6 md:hidden">
          <div className="flex flex-col gap-6">
            {/* Mobile Navigation */}
            <Navigation links={navLinks} isMobile onLinkClick={closeMenu} />
            
            {/* Mobile Role Menu */}
            {renderRoleMenu(true)}
          </div>
        </div>
      )}
    </header>
  );
}
