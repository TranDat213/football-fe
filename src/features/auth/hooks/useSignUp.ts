import { useState } from 'react';
import { toast } from 'sonner';

import { useRequestOtpMutation } from '../api/authAPI';
import { RegisterFormData } from '../schema/auth.schema';

function mapErrorMessageToField(message: string): { field: string | null; message: string } {
  const lower = message.toLowerCase();

  if (lower.includes('email') && (lower.includes('already exists') || lower.includes('đã tồn tại'))) {
    return { field: 'email', message: 'Email này đã được sử dụng' };
  }
  if (lower.includes('username') && (lower.includes('already exists') || lower.includes('đã tồn tại'))) {
    return { field: 'user_name', message: 'Tên đăng nhập này đã được sử dụng' };
  }
  if (lower.includes('passwords do not match') || lower.includes('không khớp')) {
    return { field: 'confirmPassword', message: 'Mật khẩu xác nhận không khớp' };
  }
  if (lower.includes('please wait') || lower.includes('vui lòng chờ')) {
    return { field: null, message: 'Bạn vừa yêu cầu OTP, vui lòng chờ trước khi gửi lại' };
  }

  return { field: null, message };
}

export function useSignUp() {
  const [requestOtp, { isLoading: isOtpLoading }] = useRequestOtpMutation();
  const isLoading = isOtpLoading;

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const signUp = async (data: RegisterFormData): Promise<string | null> => {
    try {
      setError(null);
      setFieldErrors({});

      await requestOtp({
        purpose: 'SIGN_UP',
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        user_name: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      toast.success('Mã OTP đã được gửi đến email của bạn!');
      return data.email;
    } catch (err: unknown) {
      const anyErr = err as {
        data?: { message?: string; errors?: Record<string, string[]> };
      };

      if (anyErr?.data?.errors) {
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(anyErr.data.errors)) {
          flat[k] = Array.isArray(v) ? v[0] : String(v);
        }
        setFieldErrors(flat);
        const firstMsg = Object.values(flat)[0];
        setError(firstMsg ?? 'Yêu cầu OTP thất bại. Vui lòng thử lại.');
        toast.error(firstMsg ?? 'Yêu cầu OTP thất bại. Vui lòng thử lại.');
        return null;
      }

      const rawMessage = anyErr?.data?.message ?? 'Yêu cầu OTP thất bại. Vui lòng thử lại.';
      const { field, message } = mapErrorMessageToField(rawMessage);

      if (field) {
        setFieldErrors({ [field]: message });
      } else {
        setError(message);
      }
      toast.error(message);
      return null;
    }
  };

  return {
    signUp,
    isLoading,
    error,
    fieldErrors,
  };
}