'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useOAuth } from '../hooks/useOAuth';

/* ─── Types ─────────────────────────────────────────────────── */

interface GoogleIdentityContextType {
  isInitialized: boolean;
  clientId: string | undefined;
}

const GoogleIdentityContext = createContext<GoogleIdentityContextType | null>(
  null,
);

/* ─── Provider ──────────────────────────────────────────────── */

export function GoogleIdentityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { handleGoogleCallback } = useOAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Singleton flags
  const scriptLoadingRef = useRef(false);
  const initializedRef = useRef(false);
  
  // Use a ref for the callback to handle updates without re-initializing GSI
  const callbackRef = useRef(handleGoogleCallback);
  
  useEffect(() => {
    callbackRef.current = handleGoogleCallback;
  }, [handleGoogleCallback]);

  const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!CLIENT_ID) {
      console.warn('[GSI] NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing');
      return;
    }

    if (initializedRef.current) return;

    const initializeGsi = () => {
      if (!window.google?.accounts?.id || initializedRef.current) return;

      console.log('[GSI] Initializing Google Identity Services singleton...');
      
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        // Always call the latest callback via ref
        callback: (response: any) => callbackRef.current(response),
        auto_select: false, // Prevents unintended auto-login if not desired
      });

      initializedRef.current = true;
      setIsInitialized(true);
    };

    // Load script
    if (!scriptLoadingRef.current) {
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      );

      if (existingScript) {
        scriptLoadingRef.current = true;
        initializeGsi();
      } else {
        scriptLoadingRef.current = true;
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = initializeGsi;
        document.body.appendChild(script);
      }
    }
  }, [CLIENT_ID]);

  return (
    <GoogleIdentityContext.Provider value={{ isInitialized, clientId: CLIENT_ID }}>
      {children}
    </GoogleIdentityContext.Provider>
  );
}

/* ─── Hook ──────────────────────────────────────────────────── */

export function useGoogleIdentity() {
  const context = useContext(GoogleIdentityContext);
  if (!context) {
    throw new Error(
      'useGoogleIdentity must be used within a GoogleIdentityProvider',
    );
  }
  return context;
}
