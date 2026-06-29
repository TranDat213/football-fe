import { useEffect, useRef } from 'react';
import { useGoogleIdentity } from './googleIdentityProvider';

export default function GoogleSignInButton() {
  const { isInitialized } = useGoogleIdentity();
  const buttonRef = useRef<HTMLDivElement>(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    // We only want to call renderButton once per component mount instance
    // and only after context says GSI is ready.
    if (!isInitialized || !buttonRef.current || renderedRef.current) return;

    console.log('[GSI] Rendering Google Sign-In button...');
    
    window.google?.accounts?.id.renderButton(buttonRef.current, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
      // width: buttonRef.current.offsetWidth || 400, // Optional: adjust width as needed
      text: 'continue_with',
      logo_alignment: 'left',
    });

    renderedRef.current = true;

    // Optional: Cleanup if needed. GSI doesn't provide a direct unmount, 
    // but we can at least clear our ref if we want to allow re-render on some trigger.
  }, [isInitialized]);

  return (
    <div
      ref={buttonRef}
      className="w-full flex justify-center overflow-hidden rounded-lg min-h-[44px]"
      style={{ colorScheme: 'normal' }}
    />
  );
}
