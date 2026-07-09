import { z } from 'zod';

// Matches FieldImageCompletePayload (pre-upload shape, still has `file`)
export const newImageSchema = z.object({
  kind: z.literal('new'),
  file: z.instanceof(File, { message: 'Image file is required' }),
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
  price: z.number().min(0, 'Price must be positive'),
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
        message: 'Start time must be before end time',
        path: ['startTime'],
      });
    }
  });

// Matches YardCompletePayload (status removed — not part of the payload anymore)
export const yardSchema = z.object({
  name: z.string().min(1, 'Yard name is required'),

  type: z.enum(['FIVE_A_SIDE', 'SEVEN_A_SIDE', 'ELEVEN_A_SIDE'] as const),

  timeSlots: z
    .array(timeSlotSchema)
    .min(1, 'At least one time slot is required'),
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
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be HH:mm format'),
    close_time: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be HH:mm format'),

    // Step 1: Yards (with nested time slots + price rules)
    yards: z.array(yardSchema).min(1, 'At least one yard is required'),

    // Step 2: Images
    images: z.array(imageSchema).min(1, 'At least one image is required'),
  })
  .superRefine((data, ctx) => {
    if (data.open_time >= data.close_time) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Open time must be before close time',
        path: ['open_time'],
      });
    }

    data.yards.forEach((yard, yardIndex) => {
      yard.timeSlots.forEach((slot, slotIndex) => {
        if (slot.startTime < data.open_time) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Time slot cannot start before field opening time',
            path: ['yards', yardIndex, 'timeSlots', slotIndex, 'startTime'],
          });
        }

        if (slot.endTime > data.close_time) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Time slot cannot end after field closing time',
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
