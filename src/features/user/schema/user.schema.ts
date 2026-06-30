import { z } from "zod";

export const updateProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

export const CreateOwnerSchema = z.object({
    firstName: z.string().min(1, 'Họ không được để trống'),
    lastName: z.string().min(1, 'Tên không được để trống'),
    email: z.string()
      .min(1, 'Email không được để trống')
      .max(255, 'Email không được vượt quá 255 ký tự')
      .email('Email không hợp lệ'),
    phone: z.string().min(1, 'Số điện thoại không được để trống')
    .regex(/^\d{10,11}$/, 'Số điện thoại không hợp lệ'),
    password: z.string().optional(),
});

export type CreateOwnerFormData = z.infer<typeof CreateOwnerSchema>;

export const OwnerRegisterSchema = z.object({
    user_id: z.string().optional(),
    first_name: z.string().min(1, 'Họ không được để trống'),
    last_name: z.string().min(1, 'Tên không được để trống'),
    email: z.string()
      .min(1, 'Email không được để trống')
      .max(255, 'Email không được vượt quá 255 ký tự')
      .email('Email không hợp lệ'),
    phone: z.string().min(1, 'Số điện thoại không được để trống')
    .regex(/^\d{10,11}$/, 'Số điện thoại không hợp lệ'),
    stadium_name: z.string().min(1, 'Tên sân không được để trống'),
    address: z.string().min(1, 'Địa chỉ không được để trống'),
});

export type OwnerRegisterFormData = z.infer<typeof OwnerRegisterSchema>;

export const UpdateRoleSchema = z.object({
    role: z.enum(["ADMIN", "OWNER", "USER"]),
});

export type UpdateRoleFormData = z.infer<typeof UpdateRoleSchema>;