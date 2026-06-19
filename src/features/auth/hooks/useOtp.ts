import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useRequestOtpMutation, useVerifyOtpMutation } from '../api/authAPI';

export type OtpStep = 'request' | 'verify';

export interface UseOtpOptions {
  /** Called when OTP is verified successfully. Receives verified email. */
  onVerified?: (email: string) => void;
  resendCooldownSeconds?: number;
}

export function useOtp({
  onVerified,
  resendCooldownSeconds = 60,
}: UseOtpOptions = {}) {
  const [requestOtp, { isLoading: isRequesting }] = useRequestOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const [step, setStep] = useState<OtpStep>('request');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = useCallback(() => {
    setCountdown(resendCooldownSeconds);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [resendCooldownSeconds]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleRequestOtp = async (emailValue: string) => {
    try {
      setError(null);
      await requestOtp({ email: emailValue }).unwrap();
      setEmail(emailValue);
      setStep('verify');
      startCountdown();
      toast.success('Mã OTP đã được gửi đến email của bạn!');
    } catch (err: unknown) {
      const anyErr = err as { data?: { message?: string } };
      const msg = anyErr?.data?.message ?? 'Gửi OTP thất bại. Vui lòng thử lại.';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    await handleRequestOtp(email);
  };

  const handleVerifyOtp = async (otpValue: string) => {
    try {
      setError(null);
      await verifyOtp({ email, otp: otpValue }).unwrap();
      toast.success('Xác thực OTP thành công!');
      onVerified?.(email);
    } catch (err: unknown) {
      const anyErr = err as { data?: { message?: string } };
      const msg = anyErr?.data?.message ?? 'Mã OTP không hợp lệ hoặc đã hết hạn.';
      setError(msg);
      toast.error(msg);
    }
  };

  const goBack = () => {
    setStep('request');
    setError(null);
  };

  return {
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
  };
}
