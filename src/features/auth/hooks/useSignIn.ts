import { useSignInMutation } from '@/features/auth/api/authAPI';
import { useState } from 'react';
import { ROUTES } from '@/lib/route.constants';
import { useRouter } from 'next/navigation';
import { SignInFormData } from '../schema/auth.schema';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { setUser } from '../slice/authSlice';
import { userApi } from '@/features/user/api/userAPI';

function mapSignInError(message: string): { field: string | null; message: string } {
  const lower = message.toLowerCase();

  if (lower.includes('user not found')) {
    return { field: 'user_name', message: 'Email hoặc tên đăng nhập không tồn tại' };
  }
  if (lower.includes('invalid password')) {
    return { field: 'password', message: 'Mật khẩu không chính xác' };
  }
  if (lower.includes('has no password')) {
    return {
      field: null,
      message: 'Tài khoản này đăng nhập qua Google/Facebook, vui lòng dùng nút đăng nhập tương ứng',
    };
  }
  if (lower.includes('email or username is required')) {
    return { field: 'user_name', message: 'Vui lòng nhập email hoặc tên đăng nhập' };
  }

  return { field: null, message };
}

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

      const res = await login(data).unwrap();

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
      // Trường hợp backend trả sẵn errors theo field (nếu có sau này)
      if (err?.data?.errors) {
        setFieldErrors(err.data.errors);
        const firstMsg = Object.values(err.data.errors)[0] as string;
        setError(firstMsg ?? 'Đăng nhập thất bại. Vui lòng thử lại.');
        toast.error(firstMsg ?? 'Đăng nhập thất bại. Vui lòng thử lại.');
        return;
      }

      const rawMessage: string = err?.data?.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.';

      // Nếu backend đang bị bug nuốt exception, rawMessage lúc này luôn là
      // 'Failed to login' (500) — mapSignInError sẽ không nhận diện được gì
      // và trả về đúng message chung này.
      const { field, message } = mapSignInError(rawMessage);

      if (field) {
        setFieldErrors({ [field]: message });
      } else {
        setError(message);
      }
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