import { useSignInMutation } from '@/features/auth/api/authAPI';
import { useState } from 'react';
import { ROUTES } from '@/lib/route.constants';
import { useRouter } from 'next/navigation';
import { SignInFormData } from '../schema/auth.schema';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setUser } from '../slice/authSlice';
import { userApi } from '@/features/user/api/userAPI';

export function useSignIn() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [login, { isLoading }] = useSignInMutation();

  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const signIn = async (data: SignInFormData) => {
    try {
      setError(null);
      setFieldErrors({});
     const res= await login(data).unwrap();
console.log(res);
      dispatch(userApi.util.resetApiState());
      dispatch(setUser(res.data.user));

      toast.success('Đăng nhập thành công!');
      
      const role = res.data.user.role;
      if (role === 'OWNER') {
        router.push(ROUTES.ownerDashboard);
      } else if (role === 'ADMIN') {
        router.push(ROUTES.adminDashboard);
      } else {
        router.push(ROUTES.home);
      }
    } catch (err: any) {
      // Nếu backend trả về validation errors
      if (err?.data?.errors) {
        setFieldErrors(err.data.errors);
      }

      const message =
        err?.data?.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.';

      setError(message);
      toast.error(message);
    }
  };

  return {
    signIn,
    isLoading,
    error,
    fieldErrors,
  };
}
