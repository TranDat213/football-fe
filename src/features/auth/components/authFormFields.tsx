'use client';

import { ChangeEvent, ReactNode } from 'react';

/* ─── Field ─────────────────────────────────────────────────── */

export interface FieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
  optional?: boolean;
  icon?: ReactNode;
}

export function Field({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  optional,
  icon,
}: FieldProps) {
  return (
    <div>
      <label className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] font-medium text-[#1B3A2D]">{label}</span>
        {optional && (
          <span className="text-[11px] text-[#9CB8A9]">Không bắt buộc</span>
        )}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CB8A9] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            w-full h-10 ${icon ? 'pl-9' : 'px-3.5'} pr-3.5 rounded-lg text-[14px]
            border outline-none transition-colors
            placeholder:text-[#AECABF]
            text-[#1B3A2D]
            ${
              error
                ? 'border-red-400 bg-red-50 focus:border-red-400'
                : 'border-[#D1E5DA] bg-white focus:border-[#40916C] focus:ring-2 focus:ring-[#40916C]/10'
            }
          `}
        />
      </div>
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

/* ─── PasswordField ──────────────────────────────────────────── */

export interface PasswordFieldProps {
  label: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  show: boolean;
  onToggle: () => void;
  autoComplete?: string;
  icon?: ReactNode;
  rightLabel?: ReactNode;
}

export function PasswordField({
  label,
  name,
  placeholder,
  value,
  onChange,
  error,
  show,
  onToggle,
  autoComplete,
  icon,
  rightLabel,
}: PasswordFieldProps) {
  return (
    <div>
      <label className="flex items-center justify-between mb-1.5">
        <span className="text-[13px] font-medium text-[#1B3A2D]">{label}</span>
        {rightLabel}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CB8A9] pointer-events-none">
            {icon}
          </span>
        )}
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            w-full h-10 ${icon ? 'pl-9' : 'pl-3.5'} pr-9 rounded-lg text-[14px]
            border outline-none transition-colors
            placeholder:text-[#AECABF] text-[#1B3A2D]
            ${
              error
                ? 'border-red-400 bg-red-50 focus:border-red-400'
                : 'border-[#D1E5DA] bg-white focus:border-[#40916C] focus:ring-2 focus:ring-[#40916C]/10'
            }
          `}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CB8A9] hover:text-[#40916C] transition-colors"
          tabIndex={-1}
          aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

/* ─── OAuthButton ────────────────────────────────────────────── */

export function OAuthButton({ provider }: { provider: 'google' | 'apple' }) {
  const handleOAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'}/api/auth/oauth?provider=${provider}&redirect=${encodeURIComponent(window.location.origin)}`;
  };

  return (
    <button
      type="button"
      onClick={handleOAuth}
      className="
        w-full h-10 rounded-lg border border-[#D1E5DA]
        flex items-center justify-center gap-2
        text-[13px] font-medium text-[#1B3A2D]
        hover:bg-[#F6F9F7] active:scale-[0.99]
        transition-all duration-150
      "
    >
      {provider === 'google' ? <GoogleIcon /> : <AppleIcon />}
      {provider === 'google' ? 'Google' : 'Apple'}
    </button>
  );
}

export function OAuthButtonSingle() {
  const handleOAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'}/api/auth/oauth?provider=google&redirect=${encodeURIComponent(window.location.origin)}`;
  };

  return (
    <button
      type="button"
      onClick={handleOAuth}
      className="
        w-full h-10 rounded-lg border border-[#D1E5DA]
        flex items-center justify-center gap-2.5
        text-[13px] font-medium text-[#1B3A2D]
        hover:bg-[#F6F9F7] active:scale-[0.99]
        transition-all duration-150
      "
    >
      <GoogleIcon />
      Tiếp tục với Google
    </button>
  );
}

/* ─── Spinner ────────────────────────────────────────────────── */

export function Spinner() {
  return (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="white"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

/* ─── Icons ──────────────────────────────────────────────────── */

export function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}

export function ShieldIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9.5 12l1.8 1.8L14.5 10" />
    </svg>
  );
}

export function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#1B3A2D">
      <path d="M16.36 1.5c.1 1.06-.3 2.1-.97 2.9-.69.82-1.8 1.46-2.9 1.37-.13-1.04.34-2.13 1-2.86.7-.78 1.86-1.36 2.87-1.41zM20.7 17.2c-.32.74-.7 1.45-1.16 2.1-.62.92-1.27 1.83-2.27 1.85-.97.02-1.29-.6-2.4-.6-1.12 0-1.47.58-2.39.62-.97.04-1.7-.95-2.33-1.86-1.28-1.86-2.27-5.27-.95-7.57.65-1.14 1.83-1.86 3.1-1.88.97-.02 1.6.62 2.41.62.8 0 1.32-.62 2.43-.6 1.04.02 2.13.66 2.78 1.7-2.44 1.49-2.05 5.06.78 5.62-.01.02-.01.01 0 0z" />
    </svg>
  );
}
