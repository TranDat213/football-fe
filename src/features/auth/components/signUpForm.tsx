'use client';

import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';

import { useSignUp } from '../hooks/useSignUp';
import { SignUpPayload } from '../types/auth.types';
import { ROUTES } from '@/lib/route.constants';
import {
  Field,
  PasswordField,
  Spinner,
  UserIcon,
  MailIcon,
  LockIcon,
  ShieldIcon,
} from './authFormFields';
import GoogleSignInButton from './googleSignInButton';

/* ─── Props ──────────────────────────────────────────────────── */

export interface SignUpFormProps {
  /** Called with the registered email after a successful signup. */
  onSuccess: (email: string) => void;
}

/* ─── Initial state ──────────────────────────────────────────── */

const initialForm: SignUpPayload = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

/* ─── Component ──────────────────────────────────────────────── */

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { isLoading, error, fieldErrors, signUp } = useSignUp();
  const [form, setForm] = useState<SignUpPayload>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agreed) return;
    const registeredEmail = await signUp(form);
    if (registeredEmail) {
      onSuccess(registeredEmail);
    }
  };

  return (
    <>
      <h1 className="text-[22px] font-semibold text-[#1B3A2D] mb-1">
        Tạo tài khoản
      </h1>
      <p className="text-[13px] text-[#6B8C7A] mb-7">
        Bắt đầu hành trình của bạn trên sân cỏ.
      </p>

      {/* Global error */}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 bg-[#FFF1F1] border border-[#FECACA] rounded-lg px-3.5 py-3">
          <AlertIcon />
          <p className="text-[13px] text-[#B91C1C] leading-snug">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Tên + Họ */}
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Tên"
            name="first_name"
            type="text"
            placeholder="John"
            value={form.first_name}
            onChange={handleChange}
            error={fieldErrors.first_name}
            autoComplete="given-name"
            icon={<UserIcon />}
          />
          <Field
            label="Họ"
            name="last_name"
            type="text"
            placeholder="Doe"
            value={form.last_name}
            onChange={handleChange}
            error={fieldErrors.last_name}
            autoComplete="family-name"
            icon={<UserIcon />}
          />
        </div>

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

        {/* Mật khẩu + Xác nhận */}
        <div className="grid grid-cols-2 gap-3">
          <PasswordField
            label="Mật khẩu"
            name="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
            show={showPassword}
            onToggle={() => setShowPassword((v) => !v)}
            autoComplete="new-password"
            icon={<LockIcon />}
          />
          <PasswordField
            label="Xác nhận"
            name="confirmPassword"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            error={fieldErrors.confirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm((v) => !v)}
            autoComplete="new-password"
            icon={<ShieldIcon />}
          />
        </div>

        {/* Đồng ý điều khoản */}
        <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#D1E5DA] text-[#40916C] focus:ring-[#40916C]/30"
          />
          <span className="text-[12.5px] text-[#6B8C7A] leading-snug">
            Tôi đồng ý với{' '}
            <Link href="/terms" className="text-[#40916C] hover:underline font-medium">
              Điều khoản sử dụng
            </Link>{' '}
            và{' '}
            <Link href="/privacy" className="text-[#40916C] hover:underline font-medium">
              Chính sách bảo mật
            </Link>
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !agreed}
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
              Đang gửi mã OTP…
            </>
          ) : (
            'Tiếp tục'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-[#E2EDE8]" />
        <span className="text-[12px] text-[#9CB8A9]">hoặc đăng ký với</span>
        <div className="flex-1 h-px bg-[#E2EDE8]" />
      </div>

      <GoogleSignInButton />

      <p className="text-center text-[13px] text-[#6B8C7A] mt-6">
        Đã có tài khoản?{' '}
        <Link href={ROUTES.login} className="text-[#40916C] hover:underline font-medium">
          Đăng nhập
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
