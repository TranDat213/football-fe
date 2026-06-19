'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import {
  Field,
  PasswordField,
  Spinner,
  MailIcon,
  LockIcon,
  ShieldIcon,
} from './authFormFields';
import { useForgotPassword } from '../hooks/useForgotPassword';

/* ─── Props ──────────────────────────────────────────────────── */

interface ForgotPasswordFormProps {
  onClose: () => void;
}

/* ─── Component ──────────────────────────────────────────────── */

export default function ForgotPasswordForm({ onClose }: ForgotPasswordFormProps) {
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
  } = useForgotPassword(onClose);

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
  const steps = ['Email', 'OTP', 'Mật khẩu'];
  const stepIndex = step === 'email' ? 0 : step === 'otp' ? 1 : 2;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-semibold text-[#1B3A2D]">Quên mật khẩu</h2>
          <p className="text-[12px] text-[#6B8C7A] mt-0.5">
            {step === 'email' && 'Nhập email để nhận mã xác thực.'}
            {step === 'otp'   && `Nhập mã OTP đã gửi đến ${email}`}
            {step === 'reset' && 'Tạo mật khẩu mới cho tài khoản của bạn.'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="text-[#9CB8A9] hover:text-[#40916C] transition-colors"
        >
          <CloseIcon />
        </button>
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

      {/* ── Step 1: Email ─────────────────────────────────────── */}
      {step === 'email' && (
        <form onSubmit={handleStep1} noValidate className="space-y-4">
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={emailValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmailValue(e.target.value)}
            error={emailError}
            autoComplete="email"
            icon={<MailIcon />}
          />
          <SubmitButton loading={isRequesting} label="Gửi mã OTP" />
        </form>
      )}

      {/* ── Step 2: OTP ───────────────────────────────────────── */}
      {step === 'otp' && (
        <form onSubmit={handleStep2} noValidate className="space-y-4">
          <Field
            label="Mã OTP (6 chữ số)"
            name="otp"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            error={otpError}
            autoComplete="one-time-code"
            icon={<ShieldIcon />}
          />

          {/* Resend */}
          <p className="text-[12px] text-[#6B8C7A]">
            Không nhận được mã?{' '}
            {countdown > 0 ? (
              <span className="text-[#9CB8A9]">Gửi lại sau {countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isRequesting}
                className="text-[#40916C] hover:underline font-medium disabled:opacity-50"
              >
                Gửi lại OTP
              </button>
            )}
          </p>

          <div className="flex gap-2">
            <BackButton onClick={goBack} />
            <SubmitButton loading={isVerifying} label="Xác nhận OTP" />
          </div>
        </form>
      )}

      {/* ── Step 3: Reset password ────────────────────────────── */}
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
            <SubmitButton loading={isResetting} label="Đặt lại mật khẩu" />
          </div>
        </form>
      )}
    </>
  );
}

/* ─── Small helpers ──────────────────────────────────────────── */

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="
        flex-1 h-10 rounded-lg
        bg-[#40916C] hover:bg-[#2D6A4F] active:scale-[0.99]
        text-white text-[14px] font-medium
        transition-all duration-150
        disabled:opacity-60 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
      "
    >
      {loading ? <><Spinner /> Đang xử lý…</> : label}
    </button>
  );
}

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

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
