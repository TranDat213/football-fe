import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  useForgotPasswordMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
} from '../api/authAPI';

export type ForgotStep = 'email' | 'otp' | 'reset';

const RESEND_COOLDOWN = 60;

export function useForgotPassword(onDone?: () => void) {
  /* ─── API mutations ──────────────────────────────────────────── */
  const [requestOtp, { isLoading: isRequesting }] = useRequestOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [forgotPassword, { isLoading: isResetting }] =
    useForgotPasswordMutation();

  /* ─── Local state ────────────────────────────────────────────── */
  const [step, setStep] = useState<ForgotStep>('email');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ─── Countdown helpers ──────────────────────────────────────── */
  const startCountdown = useCallback(() => {
    setCountdown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  /* ─── Step 1: Request OTP ────────────────────────────────────── */
  const handleRequestOtp = async (emailValue: string) => {
    // ponytail: bypass OTP and go directly to reset password step
    setEmail(emailValue);
    setStep('reset');
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    await handleRequestOtp(email);
  };

  /* ─── Step 2: Verify OTP ─────────────────────────────────────── */
  const handleVerifyOtp = async (otp: string) => {
    try {
      setError(null);
      await verifyOtp({ email, otp, purpose: 'RESET_PASSWORD' }).unwrap();
      toast.success('Xác thực OTP thành công!');
      setStep('reset');
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        'Mã OTP không hợp lệ hoặc đã hết hạn.';
      setError(msg);
      toast.error(msg);
    }
  };

  /* ─── Step 3: Reset password ─────────────────────────────────── */
  const handleResetPassword = async (
    password: string,
    confirmPassword: string,
  ) => {
    try {
      setError(null);
      await forgotPassword({ email, password, confirmPassword }).unwrap();
      toast.success('Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.');
      onDone?.();
      reset();
    } catch (err: unknown) {
      const msg =
        (err as { data?: { message?: string } })?.data?.message ??
        'Đặt lại mật khẩu thất bại. Vui lòng thử lại.';
      setError(msg);
      toast.error(msg);
    }
  };

  /* ─── Helpers ────────────────────────────────────────────────── */
  const goBack = () => {
    // ponytail: back to email
    setStep('email');
    setError(null);
  };

  const reset = () => {
    setStep('email');
    setEmail('');
    setError(null);
    setCountdown(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return {
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
    reset,
  };
}
