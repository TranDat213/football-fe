'use client';

import Link from 'next/link';
import { NavLink } from '../types';

interface NavigationProps {
  links: NavLink[];
  isMobile?: boolean;
  onLinkClick?: () => void;
}

export default function Navigation({ links, isMobile = false, onLinkClick }: NavigationProps) {
  if (isMobile) {
    return (
      <nav className="flex flex-col gap-4">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-base font-medium text-gray-600 transition-colors hover:text-emerald-700"
            onClick={onLinkClick}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="transition-colors hover:text-emerald-700"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
