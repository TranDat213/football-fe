"use client";
import { ROUTES } from '@/lib/route.constants';
import { authService } from '@/services/auth.service';
import { ApiError, SignUpPayload } from '@/types/auth.types';
import { useRouter } from "next/navigation";
import { useState } from 'react';

interface UseSignUpReturn {
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  signUp: (payload: SignUpPayload) => Promise<void>;
}


export function useSignUp(): UseSignUpReturn {
  const router = useRouter();
 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
 
  const signUp = async (payload: SignUpPayload) => {
    // --- Client-side validation ---
    const localErrors: Record<string, string> = {};
 
    if (!payload.firstName.trim()) {
      localErrors.firstName = "Vui lòng nhập tên";
    }
    if (!payload.lastName.trim()) {
      localErrors.lastName = "Vui lòng nhập họ";
    }
    if (!payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      localErrors.email = "Email không hợp lệ";
    }
    if (payload.password.length < 8) {
      localErrors.password = "Mật khẩu tối thiểu 8 ký tự";
    }
    if (payload.password !== payload.confirmPassword) {
      localErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
 
    if (Object.keys(localErrors).length > 0) {
      setFieldErrors(localErrors);
      return;
    }
 
    setFieldErrors({});
    setError(null);
    setIsLoading(true);
 
    try {
      // 1. Gọi POST /api/auth/sign-up
      await authService.signUp(payload);
 
      // 4. Redirect
      router.replace(ROUTES.login);
    } catch (err: unknown) {
      const apiErr = err as ApiError;
 
      // Xử lý lỗi từng field nếu BE trả về
      if (apiErr.errors) {
        const mapped: Record<string, string> = {};
        for (const [field, messages] of Object.entries(apiErr.errors)) {
          mapped[field] = messages[0];
        }
        setFieldErrors(mapped);
      } else {
        setError(apiErr.message ?? "Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };
 
  return { isLoading, error, fieldErrors, signUp };
}