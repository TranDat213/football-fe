import {
  AuthTokens,
  SignUpPayload,
  SignInResponse,
  UserProfile,
  SignInPayload,
} from '@/types/auth.types';
import { authTokenService } from './auth-token.service';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
      statusCode: res.status,
    }));
    throw error;
  }
  return res.json();
}

export const authService = {
  /** Đăng ký tài khoản mới */
  async signUp(payload: SignUpPayload): Promise<void> {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
        firstName: payload.firstName,
        lastName: payload.lastName,
        phone: payload.phone,
      }),
    });

    return handleResponse<void>(res);
  },

  async getMe(): Promise<UserProfile> {
    const token = authTokenService.getAccessToken();
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse<UserProfile>(res);
  },

  async singIn(payload: SignInPayload): Promise<SignInResponse> {
    const res = await fetch('${BASE_URL}/api/auth/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: payload.email,
        password: payload.password,
      }),
    });
    return handleResponse<SignInResponse>(res);
  },

  async logout(): Promise<void> {
    const token = authTokenService.getAccessToken();
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    authTokenService.clearTokens();
  },
};
