'use client';

import {
  ChangeEvent,
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useRef,
  useState,
} from 'react';
import { useOtp, UseOtpOptions } from '../hooks/useOtp';
import { requestOtpSchema, verifyOtpSchema } from '../schema/auth.schema';

/* ─── Props ────────────────────────────────────────────────────── */

export interface OtpFormProps extends UseOtpOptions {
  /** Pre-fill the email field. */
  defaultEmail?: string;
}

/* ─── Main Component ────────────────────────────────────────────── */

export default function OtpForm({ onVerified, defaultEmail = '', resendCooldownSeconds }: OtpFormProps) {
  const {
    step,
    email,
    error,
    countdown,
    isRequesting,
    isVerifying,
    handleRequestOtp,
    handleResendOtp,
    handleVerifyOtp,
    goBack,
  } = useOtp({ onVerified, resendCooldownSeconds });

  return (
    <div className="w-full max-w-[440px]">
      <div className="bg-white rounded-2xl border border-[#E2EDE8] px-8 py-9 shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
        {/* Icon header */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-xl bg-[#F0FAF5] border border-[#C8E6D4] flex items-center justify-center">
            {step === 'request' ? <MailIcon /> : <ShieldIcon />}
          </div>
        </div>

        {step === 'request' ? (
          <RequestStep
            defaultEmail={defaultEmail}
            error={error}
            isLoading={isRequesting}
            onSubmit={handleRequestOtp}
          />
        ) : (
          <VerifyStep
            email={email}
            error={error}
            countdown={countdown}
            isLoading={isVerifying}
            onSubmit={handleVerifyOtp}
            onResend={handleResendOtp}
            onBack={goBack}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Step 1: Request OTP ───────────────────────────────────────── */

interface RequestStepProps {
  defaultEmail: string;
  error: string | null;
  isLoading: boolean;
  onSubmit: (email: string) => Promise<void>;
}

function RequestStep({ defaultEmail, error, isLoading, onSubmit }: RequestStepProps) {
  const [emailValue, setEmailValue] = useState(defaultEmail);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError(null);

    const result = requestOtpSchema.safeParse({ email: emailValue });
    if (!result.success) {
      setFieldError(result.error.issues[0].message);
      return;
    }

    await onSubmit(result.data.email);
  };

  return (
    <>
      <h2 className="text-[20px] font-semibold text-[#1B3A2D] mb-1 text-center">
        Xác thực qua Email
      </h2>
      <p className="text-[13px] text-[#6B8C7A] mb-6 text-center leading-relaxed">
        Nhập email của bạn. Chúng tôi sẽ gửi mã OTP 6 chữ số để xác thực.
      </p>

      {/* Global API error */}
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-[#1B3A2D] mb-1.5">
            Email
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CB8A9] pointer-events-none">
              <MailIconSm />
            </span>
            <input
              type="email"
              name="email"
              value={emailValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmailValue(e.target.value);
                setFieldError(null);
              }}
              placeholder="john@example.com"
              autoComplete="email"
              className={`
                w-full h-10 pl-9 pr-3.5 rounded-lg text-[14px]
                border outline-none transition-colors
                placeholder:text-[#AECABF] text-[#1B3A2D]
                ${
                  fieldError
                    ? 'border-red-400 bg-red-50 focus:border-red-400'
                    : 'border-[#D1E5DA] bg-white focus:border-[#40916C] focus:ring-2 focus:ring-[#40916C]/10'
                }
              `}
            />
          </div>
          {fieldError && <p className="mt-1 text-[12px] text-red-500">{fieldError}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="
            w-full mt-1 h-11 rounded-lg
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
              Đang gửi…
            </>
          ) : (
            <>
              Gửi mã OTP
              <ArrowIcon />
            </>
          )}
        </button>
      </form>
    </>
  );
}

/* ─── Step 2: Verify OTP ────────────────────────────────────────── */

const OTP_LENGTH = 6;

interface VerifyStepProps {
  email: string;
  error: string | null;
  countdown: number;
  isLoading: boolean;
  onSubmit: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
}

function VerifyStep({
  email,
  error,
  countdown,
  isLoading,
  onSubmit,
  onResend,
  onBack,
}: VerifyStepProps) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [fieldError, setFieldError] = useState<string | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const focusAt = (index: number) => inputRefs.current[index]?.focus();

  const updateDigit = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = cleaned;
      return next;
    });
    if (cleaned && index < OTP_LENGTH - 1) {
      focusAt(index + 1);
    }
    setFieldError(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        updateDigit(index, '');
      } else if (index > 0) {
        focusAt(index - 1);
        updateDigit(index - 1, '');
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusAt(index - 1);
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      focusAt(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill('');
    [...pasted].forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    focusAt(Math.min(pasted.length, OTP_LENGTH - 1));
    setFieldError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError(null);
    const otp = digits.join('');

    const result = verifyOtpSchema.safeParse({ email, otp });
    if (!result.success) {
      setFieldError(result.error.issues[0].message);
      return;
    }

    await onSubmit(otp);
  };

  const allFilled = digits.every(Boolean);

  return (
    <>
      <h2 className="text-[20px] font-semibold text-[#1B3A2D] mb-1 text-center">
        Nhập mã xác thực
      </h2>
      <p className="text-[13px] text-[#6B8C7A] mb-1 text-center leading-relaxed">
        Chúng tôi đã gửi mã OTP tới
      </p>
      <p className="text-[13px] font-semibold text-[#40916C] mb-6 text-center break-all">
        {email}
      </p>

      {/* Global API error */}
      {error && <ErrorAlert message={error} />}

      <form onSubmit={handleSubmit} noValidate>
        {/* OTP digit inputs */}
        <div className="flex justify-center gap-2.5 mb-2">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e: ChangeEvent<HTMLInputElement>) => updateDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={handlePaste}
              onFocus={(e) => e.target.select()}
              className={`
                w-11 h-12 rounded-lg text-center text-[18px] font-semibold
                border outline-none transition-all duration-150 caret-[#40916C]
                text-[#1B3A2D]
                ${
                  fieldError
                    ? 'border-red-400 bg-red-50'
                    : digit
                    ? 'border-[#40916C] bg-[#F0FAF5] ring-2 ring-[#40916C]/10'
                    : 'border-[#D1E5DA] bg-white focus:border-[#40916C] focus:ring-2 focus:ring-[#40916C]/10'
                }
              `}
            />
          ))}
        </div>

        {fieldError && (
          <p className="text-center text-[12px] text-red-500 mb-3">{fieldError}</p>
        )}

        <button
          type="submit"
          disabled={isLoading || !allFilled}
          className="
            w-full mt-4 h-11 rounded-lg
            bg-[#40916C] hover:bg-[#2D6A4F] active:scale-[0.99]
            text-white text-[14px] font-medium
            transition-all duration-150
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center justify-center gap-2
          "
        >
          {isLoading ? (
            <>
              <Spinner />
              Đang xác thực…
            </>
          ) : (
            <>
              Xác nhận
              <ArrowIcon />
            </>
          )}
        </button>
      </form>

      {/* Resend + Back */}
      <div className="mt-5 flex flex-col items-center gap-2">
        <p className="text-[13px] text-[#6B8C7A]">
          Không nhận được mã?{' '}
          {countdown > 0 ? (
            <span className="text-[#9CB8A9]">
              Gửi lại sau <span className="font-semibold text-[#40916C]">{countdown}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              className="font-medium text-[#40916C] hover:underline focus:outline-none"
            >
              Gửi lại
            </button>
          )}
        </p>

        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-[12px] text-[#9CB8A9] hover:text-[#40916C] transition-colors"
        >
          <ChevronLeftIcon />
          Đổi email
        </button>
      </div>
    </>
  );
}

/* ─── Shared Helpers ────────────────────────────────────────────── */

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="mb-5 flex items-start gap-2.5 bg-[#FFF1F1] border border-[#FECACA] rounded-lg px-3.5 py-3">
      <AlertCircleIcon />
      <p className="text-[13px] text-[#B91C1C] leading-snug">{message}</p>
    </div>
  );
}

/* ─── Icons ─────────────────────────────────────────────────────── */

function MailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#40916C" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function MailIconSm() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#40916C" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
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

function ChevronLeftIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function AlertCircleIcon() {
  return (
    <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 15 15" fill="#EF4444">
      <path d="M7.5 1a6.5 6.5 0 100 13A6.5 6.5 0 007.5 1zm0 1A5.5 5.5 0 117.5 13 5.5 5.5 0 017.5 2zm0 2.5a.5.5 0 00-.5.5v3.5a.5.5 0 001 0V5a.5.5 0 00-.5-.5zm0 6a.6.6 0 100-1.2.6.6 0 000 1.2z" />
    </svg>
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
