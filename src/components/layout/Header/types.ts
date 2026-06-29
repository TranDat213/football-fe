export type UserRole = 'USER' | 'OWNER' | 'ADMIN';

export interface NavLink {
  label: string;
  href: string;
}

export interface User {
  username: string;
  role: string | UserRole;
  avatarUrl?: string;
}
