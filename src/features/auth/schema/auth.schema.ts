import { z } from 'zod';

export const registerSchema = z
  .object({
    first_name: z.string().min(1, 'Họ không được để trống'),

    last_name: z.string().min(1, 'Tên không được để trống'),

    email: z
      .string()
      .min(1, 'Email không được để trống')
      .max(255, 'Email không được vượt quá 255 ký tự')
      .email('Email không hợp lệ'),

    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),

    confirmPassword: z
      .string()
      .min(8, 'Xác nhận mật khẩu phải có ít nhất 8 ký tự'),
  })
  .refine(
    (data) => {
      if (!data.password || !data.confirmPassword) return true;
      return data.password === data.confirmPassword;
    },
    {
      message: 'Mật khẩu xác nhận không khớp',
      path: ['confirmPassword'],
    },
  );

export const signInSchema = z.object({
  username: z.string().optional(),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Mật khẩu không được để trống'),
});
export type RegisterFormData = z.infer<typeof registerSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;

export const requestOtpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
});

export const verifyOtpSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ'),
  otp: z
    .string()
    .length(6, 'Mã OTP phải có đúng 6 ký tự')
    .regex(/^\d{6}$/, 'Mã OTP chỉ gồm chữ số'),
});

export type RequestOtpFormData = z.infer<typeof requestOtpSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

export const forgotPasswordSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email không được để trống')
      .email('Email không hợp lệ'),

    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),

    confirmPassword: z
      .string()
      .min(8, 'Xác nhận mật khẩu phải có ít nhất 8 ký tự'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
