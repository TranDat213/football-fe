import { z } from 'zod';

export const casualMatchSchema = z
  .object({
    title: z.string().min(1, 'Vui lòng nhập tiêu đề').max(255, 'Tiêu đề quá dài'),
    description: z.string().optional(),
    totalSlots: z.coerce.number().int('Số slot phải là số nguyên').min(1).max(100),
    slotPrice: z.coerce.number().positive('Giá mỗi slot phải lớn hơn 0'),
    joinDeadline: z.string().min(1, 'Vui lòng chọn hạn tham gia'),
    visibility: z.enum(['PUBLIC', 'PRIVATE']),
    teamMode: z.enum(['NO_TEAM', 'OPTIONAL_TEAM', 'REQUIRED_TEAM']),
    skillLevel: z.enum(['ANY', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    matchStartAt: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const deadline = new Date(value.joinDeadline);
    if (Number.isNaN(deadline.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['joinDeadline'], message: 'Hạn tham gia không hợp lệ' });
      return;
    }

    if (deadline <= new Date()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['joinDeadline'], message: 'Hạn tham gia phải sau thời điểm hiện tại' });
    }

    if (value.matchStartAt && deadline >= new Date(value.matchStartAt)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['joinDeadline'], message: 'Hạn tham gia phải trước giờ đá' });
    }
  });

export type CasualMatchFormValues = z.infer<typeof casualMatchSchema>;
