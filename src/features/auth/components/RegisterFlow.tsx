'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import SignUpForm from './signUpForm';
import OtpForm from './otpForm';
import { ROUTES } from '@/lib/route.constants';

type RegisterStep = 'form' | 'otp';

/**
 * RegisterFlow — quản lý luồng đăng ký qua mã OTP:
 *
 * 1. SignUpForm: submit form → call requestOtp(purpose='SIGN_UP', ...formData)
 *    Backend lưu pendingSignUp trong OTP store, gửi mail chứa OTP 6 số.
 *
 * 2. OtpForm: user nhập OTP 6 số → verifyOtp(purpose='SIGN_UP') → backend tạo user trong DB.
 *    KHI verifyOtp thành công mới redirect sang trang đăng nhập.
 */
export default function RegisterFlow() {
  const router = useRouter();
  const [step, setStep] = useState<RegisterStep>('form');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleRegistered = (email: string) => {
    setRegisteredEmail(email);
    setStep('otp');
  };

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
