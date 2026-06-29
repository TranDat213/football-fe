// features/pitch/schema/admin.schema.ts
import { z } from 'zod';

export const UpdateFieldStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']),
});

export const UpdateOwnerRegisterStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONTACTING', 'APPROVED', 'REJECTED']),
});

export const CreateOwnerSchema = z.object({
  firstName: z.string().min(1, 'Họ không được để trống'),
  lastName: z.string().min(1, 'Tên không được để trống'),
  email: z.string().email('Email không hợp lệ'),
  phone: z
    .string()
    .regex(/^(0|\+84)[3-9][0-9]{8}$/, 'Số điện thoại không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự').optional(),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  display_order: z.number().int().min(0, 'Thứ tự hiển thị phải >= 0'),
});

export const UpdateCategorySchema = z.object({
  id: z.string().uuid('ID không hợp lệ'),
  name: z.string().min(1, 'Tên danh mục không được để trống'),
  display_order: z.number().int().min(0, 'Thứ tự hiển thị phải >= 0'),
});

export const DeleteCategorySchema = z.object({
  id: z.string().uuid('ID không hợp lệ'),
});

export type UpdateFieldStatusFormData = z.infer<typeof UpdateFieldStatusSchema>;
export type UpdateOwnerRegisterStatusFormData = z.infer<
  typeof UpdateOwnerRegisterStatusSchema
>;
export type CreateOwnerFormData = z.infer<typeof CreateOwnerSchema>;
export type CreateCategoryFormData = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof UpdateCategorySchema>;
export type DeleteCategoryFormData = z.infer<typeof DeleteCategorySchema>;
