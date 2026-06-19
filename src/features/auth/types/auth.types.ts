export interface SignUpPayload {
  first_name: string;
  last_name: string;
  user_name: string;
  phone?: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ApiResponse<T> {
  message: string;
  data: T;
}
export type SignInResponse = ApiResponse<{
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}>;
export interface SignUpResponse {
  message: string;
}

export interface UserProfile {
  id: string;
  user_name: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface SignInPayload {
  user_name?: string;
  email: string;
  password: string;
}

export interface RefreshResponse {
  data: {
    accessToken: string;
  };
}

export interface ForgotPasswordPayload {
  user_name?: string;
  email?: string;
  password: string;
  confirmPassword: string;
}

export interface RequestOtpPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface OAuthPayload {
  email:string;
  provider: string;
 providerId: string;
}