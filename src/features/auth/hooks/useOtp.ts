// hooks/useOtp.ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useRequestOtpMutation, useVerifyOtpMutation } from '../api/authAPI';
import { OtpPurpose, RequestOtpPayload } from '../types/auth.types';

export type OtpStep = 'request' | 'verify';

export interface UseOtpOptions {
  purpose: OtpPurpose;
  /** Data bổ sung cần gửi kèm khi request OTP (vd: first_name, password... cho SIGN_UP) */
  extraRequestData?: Omit<RequestOtpPayload, 'email' | 'purpose'>;
  /** Nhận resetToken hoặc user tuỳ purpose, sau khi verify OTP thành công */
  onVerified?: (result: { email: string; resetToken?: string; user?: unknown }) => void;
  resendCooldownSeconds?: number;
  /** Khởi đầu thẻ nào. Mặc định là 'request'. Dùng 'verify' khi OTP đã được gửi bởi bước trước (vd RegisterFlow). */
  initialStep?: OtpStep;
  /** Email được pre-fill và dùng ngay khi initialStep='verify'. */
  initialEmail?: string;
}

export function useOtp({
  purpose,
  extraRequestData,
  onVerified,
  resendCooldownSeconds = 60,
  initialStep = 'request',
  initialEmail = '',
}: UseOtpOptions) {
  const [requestOtp, { isLoading: isRequesting }] = useRequestOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();

  const [step, setStep] = useState<OtpStep>(initialStep);
  const [email, setEmail] = useState(initialEmail);
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
    // Nếu bắt đầu thẳng tại bước verify (OTP đã gửi từ bước trước),
    // khởi động countdown để user biết khi nào có thể gửi lại.
    if (initialStep === 'verify') {
      startCountdown();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequestOtp = async (emailValue: string) => {
    try {
      setError(null);
      await requestOtp({ email: emailValue, purpose, ...extraRequestData }).unwrap();
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
      const res = await verifyOtp({ email, otp: otpValue, purpose }).unwrap();
      toast.success('Xác thực OTP thành công!');
      onVerified?.({
        email,
        resetToken: res.data.resetToken,
        user: res.data.user,
      });
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