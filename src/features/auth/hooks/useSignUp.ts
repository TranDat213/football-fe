import { useState } from 'react';
import { toast } from 'sonner';

import { useRegisterMutation } from '../api/authAPI';
import { RegisterFormData } from '../schema/auth.schema';

export function useSignUp() {
  const [register, { isLoading }] = useRegisterMutation();

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  /**
   * Returns the registered email on success, or null on failure.
   * The caller decides what to do next (e.g. show OTP form).
   */
  const signUp = async (data: RegisterFormData): Promise<string | null> => {
    try {
      setError(null);
      setFieldErrors({});

      await register(data).unwrap();

      toast.success('Đăng ký thành công! Vui lòng xác thực email của bạn.');
      return data.email;
    } catch (err: any) {
      if (err?.data?.errors) {
        setFieldErrors(err.data.errors);
      }

      const message =
        err?.data?.message ?? 'Đăng ký thất bại. Vui lòng thử lại.';

      setError(message);
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
