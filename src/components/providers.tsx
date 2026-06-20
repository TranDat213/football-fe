'use client';

import { AuthProvider } from "@/features/auth/components/AuthProvider";

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <AuthProvider>{children}</AuthProvider>
  );
}