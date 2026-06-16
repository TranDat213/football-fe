export interface SignUpPayload{
    email:string;
    password:string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone?: string;
}

export interface SignInResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface UserProfile{
    id:string;
    username: string;
    email:string;
    role:string;
    firstName:string;
    lastName:string;
    phone?:string;
    avatar?:string;
    createdAt:Date;
    updatedAt:Date;
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
  email: string;
  password: string;
  rememberMe: boolean;
}

