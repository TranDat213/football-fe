import { z } from 'zod';

// Matches CreateFieldYardDto: name, field_id(auto), type(YardType), status(YardStatus)
export const yardSchema = z.object({
  name: z.string().min(1, 'Yard name is required'),
  type: z.enum(['FIVE_A_SIDE', 'SEVEN_A_SIDE', 'ELEVEN_A_SIDE'] as const),
  status: z.enum(['ACTIVE', 'INACTIVE', 'MAINTENANCE'] as const),
});

// Matches CreateFieldImageDto: footballFieldId(auto), sortOrder, isCover + file via multer
export const imageSchema = z.object({
  file: z.instanceof(File, { message: 'Image file is required' }),
  sortOrder: z.number().int().min(0),
  isCover: z.boolean(),
});

// Matches CreateFieldPriceRuleDto
export const priceRuleSchema = z
  .object({
    yardIndex: z.number(), // local reference, replaced by real yardId on submit
    dayOfWeek: z.number().int().min(0).max(6).optional().nullable(),
    specialDate: z.string().optional().nullable(),
    startTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be HH:mm format'),
    endTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be HH:mm format'),
    price: z.number().min(0, 'Price must be positive'),
    label: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.dayOfWeek == null && !data.specialDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Must specify Day of Week or Special Date',
        path: ['dayOfWeek'],
      });
    }
    if (data.startTime >= data.endTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start time must be before end time',
        path: ['startTime'],
      });
    }
  });

// Matches CreateFieldOperatingHourDto
export const operatingHourSchema = z
  .object({
    yardIndex: z.number(), // local reference
    dayOfWeek: z.number().int().min(0).max(6),
    openTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be HH:mm format'),
    closeTime: z
      .string()
      .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Must be HH:mm format'),
  })
  .refine((data) => data.openTime < data.closeTime, {
    message: 'Open time must be before close time',
    path: ['openTime'],
  });

// Matches FieldDto
export const PitchFormSchema = z
  .object({
    // Step 0: Field Information
    category_id: z.string().min(1, 'Category is required'),
    name: z.string().min(1, 'Pitch name is required'),
    description: z.string().min(1, 'Description is required'),
    address: z.string().min(1, 'Address is required'),
    province: z.string().min(1, 'Province is required'),
    district: z.string().min(1, 'District is required'),
    ward: z.string().min(1, 'Ward is required'),
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

    // Step 1: Yards
    yards: z.array(yardSchema).min(1, 'At least one yard is required'),

    // Step 2: Images
    images: z.array(imageSchema).min(1, 'At least one image is required'),

    // Step 3: Price Rules (optional but validated if present)
    priceRules: z.array(priceRuleSchema).optional(),

    // Step 4: Operating Hours
    operatingHours: z
      .array(operatingHourSchema)
      .min(1, 'At least one operating hour is required'),
  })
  .refine((data) => data.open_time < data.close_time, {
    message: 'Open time must be before close time',
    path: ['open_time'],
  });

export type PitchFormData = z.infer<typeof PitchFormSchema>;
export type YardFormData = z.infer<typeof yardSchema>;
export type ImageFormData = z.infer<typeof imageSchema>;
export type PriceRuleFormData = z.infer<typeof priceRuleSchema>;
export type OperatingHourFormData = z.infer<typeof operatingHourSchema>;
