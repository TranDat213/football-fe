'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import SignUpForm from './signUpForm';
import OtpForm from './otpForm';
import { ROUTES } from '@/lib/route.constants';

type RegisterStep = 'form' | 'otp';

/**
 * RegisterFlow — quản lý toàn bộ luồng đăng ký 2 bước:
 *
 * 1. SignUpForm: validate form → useSignUp gọi requestOtp(purpose='SIGN_UP', ...formData)
 *    Backend lưu pendingSignUp trong OTP store, gửi mail OTP.
 *
 * 2. OtpForm: user nhập OTP → verifyOtp(purpose='SIGN_UP') → backend tạo user trong DB.
 *    CHỈ KHI verifyOtp thành công mới redirect sang login.
 *
 * UI không cho phép bỏ qua bước OTP: chỉ khi verifyOtp thành công mới redirect.
 */
export default function RegisterFlow() {
  const router = useRouter();
  const [step, setStep] = useState<RegisterStep>('form');
  const [registeredEmail, setRegisteredEmail] = useState('');

  /**
   * Gọi từ SignUpForm.onSuccess — requestOtp đã gửi thành công, email đã được
   * lưu tạm trong OTP store của backend kèm pendingSignUp.
   */
  const handleRegistered = (email: string) => {
    setRegisteredEmail(email);
    setStep('otp');
  };

  /**
   * Gọi từ OtpForm.onVerified — verifyOtp thành công, backend đã tạo user trong DB.
   * Lúc này mới coi là đăng ký hoàn tất.
   */
  const handleVerified = (_result: { email: string; resetToken?: string; user?: unknown }) => {
    toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
    router.push(ROUTES.login);
  };

  return (
    <>
      {step === 'form' ? (
        <SignUpForm onSuccess={handleRegistered} />
      ) : (
        <OtpForm
          purpose="SIGN_UP"
          defaultEmail={registeredEmail}
          initialStep="verify"
          initialEmail={registeredEmail}
          onVerified={handleVerified}
        />
      )}
    </>
  );
}
