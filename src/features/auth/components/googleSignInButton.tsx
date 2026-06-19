'use client';

import { useEffect, useRef } from 'react';
import { useOAuth } from '@/features/auth/hooks/useOAuth';

/* Augment window type for Google Identity Services */
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: object) => void;
          renderButton: (element: HTMLElement, config: object) => void;
        };
      };
    };
    handleGoogleCredential?: (response: { credential: string }) => void;
  }
}

export default function GoogleSignInButton() {
  const { handleGoogleCallback } = useOAuth();
  const buttonRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!CLIENT_ID) {
      console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
      return;
    }

    // Register callback so GSI can call it
    window.handleGoogleCredential = handleGoogleCallback;

    const initButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: window.handleGoogleCredential,
      });
      window.google.accounts.id.renderButton(buttonRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        width: buttonRef.current.offsetWidth || 400,
        text: 'continue_with',
        logo_alignment: 'left',
      });
    };

    if (scriptLoaded.current) {
      initButton();
      return;
    }

    // Load GSI script once
    const existing = document.querySelector(
      'script[src="https://accounts.google.com/gsi/client"]',
    );
    if (existing) {
      scriptLoaded.current = true;
      initButton();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded.current = true;
      initButton();
    };
    document.body.appendChild(script);
  }, [handleGoogleCallback]);

  return (
    <div
      ref={buttonRef}
      className="w-full overflow-hidden rounded-lg"
      style={{ colorScheme: 'normal' }}
    />
  );
}
