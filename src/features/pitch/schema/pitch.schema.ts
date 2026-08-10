import { z } from 'zod';

// Matches FieldImageCompletePayload (pre-upload shape, still has `file`)
export const newImageSchema = z.object({
  kind: z.literal('new'),
  file: z.instanceof(File, { message: 'Ảnh là bắt buộc' }),
  sortOrder: z.number().int().min(0),
  isCover: z.boolean(),
});

// Ảnh cũ đã tồn tại trên server (Cloudinary)
export const existingImageSchema = z.object({
  kind: z.literal('existing'),
  url: z.string(),
  publicId: z.string(),
  sortOrder: z.number().int().min(0),
  isCover: z.boolean(),
});

export const imageSchema = z.discriminatedUnion('kind', [
  newImageSchema,
  existingImageSchema,
]);

// Matches priceRules entry inside YardCompletePayload.timeSlots[].priceRules
export const priceRuleSchema = z.object({
  price: z.number().min(0, 'Giá phải lớn hơn 0'),
});

// Matches YardCompletePayload.timeSlots[]
export const timeSlotSchema = z
  .object({
    tempId: z.string().optional().nullable(),
    dayOfWeek: z.number().int().min(0).max(6),

    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be HH:mm format'),

    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be HH:mm format'),

    label: z.enum(['REGULAR', 'PEAK', 'LATE_NIGHT'] as const),

    sortOrder: z.number().int().min(0),

    priceRule: priceRuleSchema,
  })
  .superRefine((data, ctx) => {
    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Thời gian bắt đầu phải trước thời gian kết thúc',
        path: ['startTime'],
      });
    }
  });

// Matches YardCompletePayload (status removed — not part of the payload anymore)
export const yardSchema = z
  .object({
    name: z.string().min(1, 'Tên sân con là bắt buộc'),

    type: z.enum(['FIVE_A_SIDE', 'SEVEN_A_SIDE', 'ELEVEN_A_SIDE'] as const),

    timeSlots: z
      .array(timeSlotSchema)
      .min(1, 'Bạn phải thêm ít nhất một khung giờ'),
  })
  .superRefine((data, ctx) => {
    // Nhóm slots theo ngày trong tuần
    const byDay = new Map<
      number,
      { start: string; end: string; index: number }[]
    >();

    data.timeSlots.forEach((slot, index) => {
      const list = byDay.get(slot.dayOfWeek) ?? [];
      list.push({ start: slot.startTime, end: slot.endTime, index });
      byDay.set(slot.dayOfWeek, list);
    });

    // Kiểm tra overlap từng cặp slot trong cùng ngày
    // Hai slot A và B overlap khi: A.start < B.end VÀ B.start < A.end
    // (Trường hợp giáp nhau A.end === B.start thì KHÔNG overlap)
    byDay.forEach((slots) => {
      for (let i = 0; i < slots.length; i++) {
        for (let j = i + 1; j < slots.length; j++) {
          const a = slots[i];
          const b = slots[j];
          const overlaps = a.start < b.end && b.start < a.end;
          if (overlaps) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Khung giờ bị trùng với khung giờ ${a.index + 1} (${a.start}–${a.end})`,
              path: ['timeSlots', b.index, 'startTime'],
            });
          }
        }
      }
    });
  });


// Matches CreateFootballFieldCompletePayload
export const PitchFormSchema = z
  .object({
    // Step 0: Field Information
    category_id: z.string().min(1, 'Loại sân là bắt buộc'),
    name: z.string().min(1, 'Tên sân là bắt buộc'),
    description: z.string().min(1, 'Mô tả là bắt buộc'),
    address: z.string().min(1, 'Địa chỉ là bắt buộc'),
    province: z.string().min(1, 'Tỉnh là bắt buộc'),
    district: z.string().min(1, 'Quận là bắt buộc'),
    ward: z.string().min(1, 'Phường là bắt buộc'),
    latitude: z.preprocess(
      (val) => (val === '' || val == null ? undefined : Number(val)),
      z.number().optional(),
    ),
    longitude: z.preprocess(
      (val) => (val === '' || val == null ? undefined : Number(val)),
      z.number().optional(),
    ),
    open_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Sai định dạng'),
    close_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Sai định dạng'),

    // Step 1: Yards (with nested time slots + price rules)
    yards: z.array(yardSchema).min(1, 'Bạn phải thêm ít nhất một sân con'),

    // Step 2: Images
    images: z.array(imageSchema).min(1, 'Bạn phải thêm ít nhất một ảnh'),
  })
  .superRefine((data, ctx) => {
    if (data.open_time >= data.close_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Thời gian mở cửa phải trước thời gian đóng cửa',
        path: ['open_time'],
      });
    }

    data.yards.forEach((yard, yardIndex) => {
      yard.timeSlots.forEach((slot, slotIndex) => {
        if (slot.startTime < data.open_time) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Thời gian bắt đầu phải sau thời gian mở cửa',
            path: ['yards', yardIndex, 'timeSlots', slotIndex, 'startTime'],
          });
        }

        if (slot.endTime > data.close_time) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Thời gian kết thúc phải sau thời gian đóng cửa',
            path: ['yards', yardIndex, 'timeSlots', slotIndex, 'endTime'],
          });
        }
      });
    });
  });

  export const UpdateFootballFieldRequestStatusSchema =z.object({
    status: z.enum(['PENDING' , 'CONFIRMED' , 'REJECTED'] as const),
    reason: z.string().optional(),
  })

export type PitchFormData = z.infer<typeof PitchFormSchema>;
export type YardFormData = z.infer<typeof yardSchema>;
export type NewImageFormData = z.infer<typeof newImageSchema>;
export type ExistingImageFormData = z.infer<typeof existingImageSchema>;
export type PriceRuleFormData = z.infer<typeof priceRuleSchema>;
export type TimeSlotFormData = z.infer<typeof timeSlotSchema>;
export type UpdateFieldRequestData = z.infer<typeof UpdateFootballFieldRequestStatusSchema>;
