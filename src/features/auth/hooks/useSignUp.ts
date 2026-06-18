import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { useRegisterMutation } from '../api/authAPI';
import { RegisterFormData } from '../schema/auth.schema';
import { ROUTES } from '@/lib/route.constants';

export function useSignUp() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const signUp = async (data: RegisterFormData) => {
    try {
      setError(null);
      setFieldErrors({});

      await register(data).unwrap();

      toast.success('Đăng ký thành công!');
      router.push(ROUTES.login);
    } catch (err: any) {
      // Nếu backend trả về validation errors
      if (err?.data?.errors) {
        setFieldErrors(err.data.errors);
      }

      const message =
        err?.data?.message ?? 'Đăng ký thất bại. Vui lòng thử lại.';

      setError(message);
      toast.error(message);
    }
  };

  return {
    signUp,
    isLoading,
    error,
    fieldErrors,
  };
}
