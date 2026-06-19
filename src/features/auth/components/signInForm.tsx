'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';

import { useSignIn } from '../hooks/useSignIn';
import { SignInPayload } from '../types/auth.types';
import { ROUTES } from '@/lib/route.constants';
import {
  Field,
  PasswordField,
  Spinner,
  MailIcon,
  LockIcon,
  ArrowIcon,
} from './authFormFields';
import GoogleSignInButton from './googleSignInButton';

/* ─── Initial state ──────────────────────────────────────────── */

const initialForm: SignInPayload = {
  email: '',
  password: '',
};

/* ─── Component ──────────────────────────────────────────────── */

export default function SignInForm() {
  const { isLoading, error, fieldErrors, signIn } = useSignIn();
  const [form, setForm] = useState<SignInPayload>(initialForm);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signIn(form);
  };

  return (
    <>
      <h1 className="text-[22px] font-semibold text-[#1B3A2D] mb-1">
        Đăng nhập
      </h1>
      <p className="text-[13px] text-[#6B8C7A] mb-7">
        Rất vui được gặp lại bạn trên sân cỏ.
      </p>

      {/* Global error */}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 bg-[#FFF1F1] border border-[#FECACA] rounded-lg px-3.5 py-3">
          <AlertIcon />
          <p className="text-[13px] text-[#B91C1C] leading-snug">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Email */}
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          autoComplete="email"
          icon={<MailIcon />}
        />

        {/* Mật khẩu */}
        <PasswordField
          label="Mật khẩu"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          show={showPassword}
          onToggle={() => setShowPassword((v) => !v)}
          autoComplete="current-password"
          icon={<LockIcon />}
          rightLabel={
            <Link
              href="/forgot-password"
              className="text-[12px] font-medium text-[#40916C] hover:underline"
            >
              Quên mật khẩu?
            </Link>
          }
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full mt-2 h-11 rounded-lg
            bg-[#40916C] hover:bg-[#2D6A4F] active:scale-[0.99]
            text-white text-[14px] font-medium
            transition-all duration-150
            disabled:opacity-60 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {isLoading ? (
            <>
              <Spinner />
              Đang đăng nhập…
            </>
          ) : (
            <>
              Đăng nhập
              <ArrowIcon />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#E2EDE8]" />
        <span className="text-[12px] text-[#9CB8A9]">hoặc đăng nhập với</span>
        <div className="flex-1 h-px bg-[#E2EDE8]" />
      </div>

      {/* OAuth */}
      <GoogleSignInButton />

      <p className="text-center text-[13px] text-[#6B8C7A] mt-6">
        Chưa có tài khoản?{' '}
        <Link href={ROUTES.register} className="text-[#40916C] hover:underline font-medium">
          Đăng ký ngay
        </Link>
      </p>
    </>
  );
}

function AlertIcon() {
  return (
    <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 15 15" fill="#EF4444">
      <path d="M7.5 1a6.5 6.5 0 100 13A6.5 6.5 0 007.5 1zm0 1A5.5 5.5 0 117.5 13 5.5 5.5 0 017.5 2zm0 2.5a.5.5 0 00-.5.5v3.5a.5.5 0 001 0V5a.5.5 0 00-.5-.5zm0 6a.6.6 0 100-1.2.6.6 0 000 1.2z" />
    </svg>
  );
}
