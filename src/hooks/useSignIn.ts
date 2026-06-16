import { authTokenService } from "@/services/auth-token.service";
import { authService } from "@/services/auth.service";
import { fetchCurrentUser } from "@/store/slice/authSlice";
import { ApiError, SignInPayload } from "@/types/auth.types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from '@/store/store';
import { ROUTES } from "@/lib/route.constants";
import { useRouter } from "next/navigation";

interface UseSignInReturn {
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
  signIn: (payload: SignInPayload) => Promise<void>;
}

export function useSignIn(): UseSignInReturn {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

   const signIn = async (payload: SignInPayload) => {
       // --- Client-side validation ---
       const localErrors: Record<string, string> = {};

       if (!payload.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
         localErrors.email = "Email không hợp lệ";
       }
       if (payload.password.length < 8) {
         localErrors.password = "Mật khẩu tối thiểu 8 ký tự";
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
          const response = await authService.singIn(payload);
     
          // 2. Lưu tokens
          authTokenService.persistTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
     
          // 3. Fetch current user → dispatch → Redux state updated → isAuthenticated = true
          await dispatch(fetchCurrentUser()).unwrap();
     
          // 4. Redirect
          router.replace(ROUTES.home);
        } catch (err: unknown) {
          const apiErr = err as ApiError;
    };

}
    return { isLoading, error, fieldErrors, signIn }
}