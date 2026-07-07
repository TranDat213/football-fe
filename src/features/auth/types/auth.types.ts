export type OtpPurpose = 'SIGN_UP' | 'RESET_PASSWORD';
export interface SignUpPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export type SignInResponse = ApiResponse<{
  user: UserProfile;
}>;
export type SignUpResponse = ApiResponse<{
  user: UserProfile;
}>;

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface SignInPayload {
  username?: string;
  email: string;
  password: string;
}

export interface RefreshResponse {
  message: string;
}

export interface ForgotPasswordPayload {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RequestOtpPayload {
  email: string;
  purpose: OtpPurpose;
  // Chỉ cần khi purpose === 'SIGN_UP'
  first_name?: string;
  last_name?: string;
  user_name?: string;
  password?: string;
  confirmPassword?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
  purpose: OtpPurpose;
}

export interface VerifyOtpResponse {
  message: string;
  data: {
    user?: SignUpResponse['data']['user']; // khi purpose = SIGN_UP
    resetToken?: string; // khi purpose = RESET_PASSWORD
  };
}

export interface OAuthPayload {
  email: string;
  provider: string;
  providerId: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}
