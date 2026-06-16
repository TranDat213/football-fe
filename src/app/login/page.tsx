"use client";

import Link from "next/link";
import { useState, ChangeEvent, FormEvent, ReactNode } from "react";

import { SignInPayload } from "@/types/auth.types";
import { useSignIn } from "@/hooks/useSignIn";
import { ROUTES } from "@/lib/route.constants";


const initialForm: SignInPayload = {
  email: "",
  password: "",
  rememberMe: false,
};

export default function SignInPage() {
  const { isLoading, error, fieldErrors, signIn } = useSignIn();
  const [form, setForm] = useState<SignInPayload>(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signIn({ ...form, rememberMe: remember });
  };

  return (
    <div className="min-h-screen bg-[#F6F9F7] flex flex-col">
      <div className="flex-1 grid lg:grid-cols-2">
        {/* ─── Cột trái: Marketing ─────────────────────────── */}
        <div className="hidden lg:flex flex-col justify-center px-16 py-12">
          <div className="max-w-[420px]">
            <span className="text-[15px] font-bold text-[#40916C] tracking-tight">
              ChanDenclub
            </span>

            <h1 className="mt-4 text-[34px] font-bold text-[#1B3A2D] leading-[1.15]">
              Chào mừng <span className="text-[#40916C]">trở lại.</span>
            </h1>

            <p className="mt-3 text-[14px] text-[#6B8C7A] leading-relaxed">
              Đăng nhập để tiếp tục đặt sân, theo dõi giải đấu và kết nối với
              đội của bạn. Trận đấu tiếp theo đang chờ.
            </p>

            <div className="relative mt-8 rounded-2xl overflow-hidden h-[220px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=80"
                alt="Sân vận động về đêm"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#52D98B] opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#52D98B]" />
                </span>
                <span className="text-[11px] font-semibold text-white tracking-wide">
                  24 trận đang diễn ra
                </span>
              </div>

              <div className="absolute bottom-4 left-4 flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-white border-2 border-black/20" />
                  <div className="w-7 h-7 rounded-full bg-[#40916C] border-2 border-black/20" />
                  <div className="w-7 h-7 rounded-full bg-[#1B3A2D] border-2 border-black/20" />
                </div>
                <span className="text-[13px] font-semibold text-white">
                  Hơn 10.000+ người chơi đang hoạt động
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Cột phải: Form ──────────────────────────────── */}
        <div className="flex items-center justify-center px-4 py-12 sm:px-6">
          <div className="w-full max-w-[440px]">
            {/* Logo chỉ hiện trên mobile, vì cột trái đã ẩn */}
            <div className="flex lg:hidden items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-lg bg-[#40916C] flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M10 2L3 7v11h5v-5h4v5h5V7L10 2z"
                    fill="white"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </svg>
              </div>
              <span className="text-[15px] font-semibold text-[#1B3A2D] tracking-tight">
                Chân đèn club
              </span>
            </div>

            {/* Card */}
            <div className="bg-white rounded-2xl border border-[#E2EDE8] px-8 py-9 shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
              <h1 className="text-[22px] font-semibold text-[#1B3A2D] mb-1">
                Đăng nhập
              </h1>
              <p className="text-[13px] text-[#6B8C7A] mb-7">
                Rất vui được gặp lại bạn trên sân cỏ.
              </p>

              {/* Global error */}
              {error && (
                <div className="mb-5 flex items-start gap-2.5 bg-[#FFF1F1] border border-[#FECACA] rounded-lg px-3.5 py-3">
                  <svg
                    className="mt-0.5 shrink-0"
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="#EF4444"
                  >
                    <path d="M7.5 1a6.5 6.5 0 100 13A6.5 6.5 0 007.5 1zm0 1A5.5 5.5 0 117.5 13 5.5 5.5 0 017.5 2zm0 2.5a.5.5 0 00-.5.5v3.5a.5.5 0 001 0V5a.5.5 0 00-.5-.5zm0 6a.6.6 0 100-1.2.6.6 0 000 1.2z" />
                  </svg>
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

                {/* Ghi nhớ đăng nhập */}
                <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-[#D1E5DA] text-[#40916C] focus:ring-[#40916C]/30"
                  />
                  <span className="text-[12.5px] text-[#6B8C7A] leading-snug">
                    Ghi nhớ đăng nhập trong 30 ngày
                  </span>
                </label>

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
              <div className="grid grid-cols-2 gap-3">
                <OAuthButton provider="google" />
                <OAuthButton provider="apple" />
              </div>

              <p className="text-center text-[13px] text-[#6B8C7A] mt-6">
                Chưa có tài khoản?{" "}
                <Link href={ROUTES.register} className="text-[#40916C] hover:underline font-medium">
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer toàn trang */}
      <footer className="border-t border-[#E2EDE8] bg-white px-6 py-5 lg:px-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#9CB8A9]">
          <span>© 2026 Chân đèn club. Quản lý sân chuyên nghiệp.</span>
          <div className="flex items-center gap-5">
            <Link href="/support" className="hover:text-[#40916C]">
              Hỗ trợ
            </Link>
            <Link href="/terms" className="hover:text-[#40916C]">
              Điều khoản
            </Link>
            <Link href="/privacy" className="hover:text-[#40916C]">
              Bảo mật
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Icons ─────────────────────────────────────────────────── */

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

/* ─── Sub-components ───────────────────────────────────────── */

interface FieldProps {
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

function Field({
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
            w-full h-10 ${icon ? "pl-9" : "px-3.5"} pr-3.5 rounded-lg text-[14px]
            border outline-none transition-colors
            placeholder:text-[#AECABF]
            text-[#1B3A2D]
            ${
              error
                ? "border-red-400 bg-red-50 focus:border-red-400"
                : "border-[#D1E5DA] bg-white focus:border-[#40916C] focus:ring-2 focus:ring-[#40916C]/10"
            }
          `}
        />
      </div>
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

interface PasswordFieldProps {
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

function PasswordField({
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
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            w-full h-10 ${icon ? "pl-9" : "pl-3.5"} pr-9 rounded-lg text-[14px]
            border outline-none transition-colors
            placeholder:text-[#AECABF] text-[#1B3A2D]
            ${
              error
                ? "border-red-400 bg-red-50 focus:border-red-400"
                : "border-[#D1E5DA] bg-white focus:border-[#40916C] focus:ring-2 focus:ring-[#40916C]/10"
            }
          `}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CB8A9] hover:text-[#40916C] transition-colors"
          tabIndex={-1}
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
    </div>
  );
}

function OAuthButton({ provider }: { provider: "google" | "apple" }) {
  const handleOAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/auth/oauth?provider=${provider}&redirect=${encodeURIComponent(window.location.origin)}`;
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
      {provider === "google" ? (
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#1B3A2D">
          <path d="M16.36 1.5c.1 1.06-.3 2.1-.97 2.9-.69.82-1.8 1.46-2.9 1.37-.13-1.04.34-2.13 1-2.86.7-.78 1.86-1.36 2.87-1.41zM20.7 17.2c-.32.74-.7 1.45-1.16 2.1-.62.92-1.27 1.83-2.27 1.85-.97.02-1.29-.6-2.4-.6-1.12 0-1.47.58-2.39.62-.97.04-1.7-.95-2.33-1.86-1.28-1.86-2.27-5.27-.95-7.57.65-1.14 1.83-1.86 3.1-1.88.97-.02 1.6.62 2.41.62.8 0 1.32-.62 2.43-.6 1.04.02 2.13.66 2.78 1.7-2.44 1.49-2.05 5.06.78 5.62-.01.02-.01.01 0 0z" />
        </svg>
      )}
      {provider === "google" ? "Google" : "Apple"}
    </button>
  );
}

function Spinner() {
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