export interface SignUpPayload {
  first_name: string;
  last_name: string;
  username: string;
  phone?: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export type SignInResponse = ApiResponse<{
  user: UserProfile;
}>;
export type SignUpResponse = ApiResponse<{
  message: string;
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
  username?: string;
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