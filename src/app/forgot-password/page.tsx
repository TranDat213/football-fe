'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/lib/route.constants';
import { useForgotPassword } from '@/features/auth/hooks/useForgotPassword';
import {
  Field,
  PasswordField,
  Spinner,
  MailIcon,
  LockIcon,
  ShieldIcon,
  ArrowIcon,
} from '@/features/auth/components/authFormFields';
import { ChangeEvent, FormEvent, useState } from 'react';

/**
 * ForgotPasswordFlow — page đầy đủ 3 bước trong 1 component cha.
 * Step machine được quản lý bởi useForgotPassword:
 *   'email' → 'otp' → 'reset' → redirect login
 *
 * KHÔNG có route riêng cho từng bước — điều hướng thẳng URL vào bước 3
 * mà không qua bước 2 là không thể.
 */
export default function ForgotPasswordFlow() {
  const router = useRouter();

  const handleDone = () => {
    toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
    router.push(ROUTES.login);
  };

  const {
    step,
    email,
    error,
    countdown,
    isRequesting,
    isVerifying,
    isResetting,
    handleRequestOtp,
    handleResendOtp,
    handleVerifyOtp,
    handleResetPassword,
    goBack,
  } = useForgotPassword(handleDone);

  /* ── Step 1 state ─────────────────────────────────────────── */
  const [emailValue, setEmailValue] = useState('');
  const [emailError, setEmailError] = useState('');

  /* ── Step 2 state ─────────────────────────────────────────── */
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  /* ── Step 3 state ─────────────────────────────────────────── */
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwErrors, setPwErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  /* ── Step 1 submit ────────────────────────────────────────── */
  const handleStep1 = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailValue) { setEmailError('Email không được để trống'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
      setEmailError('Email không hợp lệ');
      return;
    }
    setEmailError('');
    await handleRequestOtp(emailValue);
  };

  /* ── Step 2 submit ────────────────────────────────────────── */
  const handleStep2 = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) { setOtpError('Mã OTP phải là 6 chữ số'); return; }
    setOtpError('');
    await handleVerifyOtp(otp);
  };

  /* ── Step 3 submit ────────────────────────────────────────── */
  const handleStep3 = async (e: FormEvent) => {
    e.preventDefault();
    const errs: typeof pwErrors = {};
    if (password.length < 8) errs.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    if (password !== confirmPassword) errs.confirmPassword = 'Mật khẩu xác nhận không khớp';
    if (Object.keys(errs).length) { setPwErrors(errs); return; }
    setPwErrors({});
    await handleResetPassword(password, confirmPassword);
  };

  /* ── Step indicator ───────────────────────────────────────── */
  // ponytail: Hide OTP step
  const steps = ['Email', 'Mật khẩu'];
  const stepIndex = step === 'email' ? 0 : 1;

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
              Lấy lại <span className="text-[#40916C]">quyền truy cập.</span>
            </h1>

            <p className="mt-3 text-[14px] text-[#6B8C7A] leading-relaxed">
              Đừng lo lắng nếu bạn quên mật khẩu. Điền email và tạo mật
              khẩu mới chỉ trong vài bước đơn giản.
            </p>

            <div className="relative mt-8 rounded-2xl overflow-hidden h-[220px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=80"
                alt="Sân vận động"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
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
            {/* Logo — mobile only */}
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
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[20px] font-semibold text-[#1B3A2D]">Quên mật khẩu</h2>
                  <Link
                    href={ROUTES.login}
                    className="text-[12px] text-[#9CB8A9] hover:text-[#40916C] transition-colors"
                  >
                    Quay lại đăng nhập
                  </Link>
                </div>
                <p className="text-[12px] text-[#6B8C7A] mt-0.5">
                  {step === 'email' && 'Nhập email để đặt lại mật khẩu mới.'}
                  {step === 'otp'   && `Nhập mã OTP đã gửi đến ${email}`}
                  {step === 'reset' && 'Tạo mật khẩu mới cho tài khoản của bạn.'}
                </p>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                {steps.map((label, i) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className={`
                      w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold transition-colors
                      ${i < stepIndex  ? 'bg-[#40916C] text-white'
                      : i === stepIndex ? 'bg-[#40916C] text-white ring-2 ring-[#40916C]/30'
                      :                   'bg-[#E2EDE8] text-[#9CB8A9]'}
                    `}>
                      {i < stepIndex ? <CheckIcon /> : i + 1}
                    </div>
                    <span className={`text-[11px] ${i === stepIndex ? 'text-[#1B3A2D] font-medium' : 'text-[#9CB8A9]'}`}>
                      {label}
                    </span>
                    {i < steps.length - 1 && <div className="w-6 h-px bg-[#E2EDE8]" />}
                  </div>
                ))}
              </div>

              {/* Global API error */}
              {error && (
                <div className="mb-4 flex items-start gap-2.5 bg-[#FFF1F1] border border-[#FECACA] rounded-lg px-3.5 py-3">
                  <AlertIcon />
                  <p className="text-[13px] text-[#B91C1C] leading-snug">{error}</p>
                </div>
              )}

              {/* ── Step 1: Email ─────────────────────────────── */}
              {step === 'email' && (
                <form onSubmit={handleStep1} noValidate className="space-y-4">
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={emailValue}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setEmailValue(e.target.value);
                      setEmailError('');
                    }}
                    error={emailError}
                    autoComplete="email"
                    icon={<MailIcon />}
                  />
                  <button
                    type="submit"
                    disabled={isRequesting}
                    className="
                      w-full h-11 rounded-lg
                      bg-[#40916C] hover:bg-[#2D6A4F] active:scale-[0.99]
                      text-white text-[14px] font-medium
                      transition-all duration-150
                      disabled:opacity-60 disabled:cursor-not-allowed
                      flex items-center justify-center gap-2
                    "
                  >
                    {isRequesting ? <><Spinner />Đang xử lý…</> : <><span>Tiếp tục</span><ArrowIcon /></>}
                  </button>
                </form>
              )}

              {/* ── Step 2: OTP ───────────────────────────────── */}
              {step === 'otp' && (
                <form onSubmit={handleStep2} noValidate className="space-y-4">
                  <Field
                    label="Mã OTP (6 chữ số)"
                    name="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setOtpError('');
                    }}
                    error={otpError}
                    autoComplete="one-time-code"
                    icon={<ShieldIcon />}
                  />

                  <p className="text-[12px] text-[#6B8C7A]">
                    Không nhận được mã?{' '}
                    {countdown > 0 ? (
                      <span className="text-[#9CB8A9]">
                        Gửi lại sau <span className="font-semibold text-[#40916C]">{countdown}s</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isRequesting}
                        className="text-[#40916C] hover:underline font-medium disabled:opacity-50 focus:outline-none"
                      >
                        Gửi lại OTP
                      </button>
                    )}
                  </p>

                  <div className="flex gap-2">
                    <BackButton onClick={goBack} />
                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="
                        flex-1 h-10 rounded-lg
                        bg-[#40916C] hover:bg-[#2D6A4F] active:scale-[0.99]
                        text-white text-[14px] font-medium
                        transition-all duration-150
                        disabled:opacity-60 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2
                      "
                    >
                      {isVerifying ? <><Spinner />Đang xác thực…</> : 'Xác nhận OTP'}
                    </button>
                  </div>
                </form>
              )}

              {/* ── Step 3: Reset password ────────────────────── */}
              {step === 'reset' && (
                <form onSubmit={handleStep3} noValidate className="space-y-4">
                  <PasswordField
                    label="Mật khẩu mới"
                    name="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    error={pwErrors.password}
                    show={showPw}
                    onToggle={() => setShowPw((v) => !v)}
                    autoComplete="new-password"
                    icon={<LockIcon />}
                  />
                  <PasswordField
                    label="Xác nhận mật khẩu"
                    name="confirmPassword"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    error={pwErrors.confirmPassword}
                    show={showConfirm}
                    onToggle={() => setShowConfirm((v) => !v)}
                    autoComplete="new-password"
                    icon={<LockIcon />}
                  />
                  <div className="flex gap-2">
                    <BackButton onClick={goBack} />
                    <button
                      type="submit"
                      disabled={isResetting}
                      className="
                        flex-1 h-10 rounded-lg
                        bg-[#40916C] hover:bg-[#2D6A4F] active:scale-[0.99]
                        text-white text-[14px] font-medium
                        transition-all duration-150
                        disabled:opacity-60 disabled:cursor-not-allowed
                        flex items-center justify-center gap-2
                      "
                    >
                      {isResetting ? <><Spinner />Đang xử lý…</> : 'Đặt lại mật khẩu'}
                    </button>
                  </div>
                </form>
              )}

              {/* Link về trang đăng nhập */}
              <p className="text-center text-[13px] text-[#6B8C7A] mt-6">
                Nhớ mật khẩu rồi?{' '}
                <Link href={ROUTES.login} className="text-[#40916C] hover:underline font-medium">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#E2EDE8] bg-white px-6 py-5 lg:px-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[12px] text-[#9CB8A9]">
          <span>© 2026 Chân đèn club. Quản lý sân chuyên nghiệp.</span>
          <div className="flex items-center gap-5">
            <Link href="/support" className="hover:text-[#40916C]">Hỗ trợ</Link>
            <Link href="/terms" className="hover:text-[#40916C]">Điều khoản</Link>
            <Link href="/privacy" className="hover:text-[#40916C]">Bảo mật</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Small helpers ─────────────────────────────────────── */

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        h-10 px-4 rounded-lg border border-[#D1E5DA]
        text-[13px] font-medium text-[#1B3A2D]
        hover:bg-[#F6F9F7] active:scale-[0.99]
        transition-all duration-150
      "
    >
      Quay lại
    </button>
  );
}

function AlertIcon() {
  return (
    <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 15 15" fill="#EF4444">
      <path d="M7.5 1a6.5 6.5 0 100 13A6.5 6.5 0 007.5 1zm0 1A5.5 5.5 0 117.5 13 5.5 5.5 0 017.5 2zm0 2.5a.5.5 0 00-.5.5v3.5a.5.5 0 001 0V5a.5.5 0 00-.5-.5zm0 6a.6.6 0 100-1.2.6.6 0 000 1.2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}
