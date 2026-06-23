import { z } from 'zod';

export const yardSchema = z.object({
  name: z.string().min(1, 'Yard name is required'),
  code: z.string().min(1, 'Yard code is required'),
  type: z.enum(['FIVE_A_SIDE', 'SEVEN_A_SIDE', 'ELEVEN_A_SIDE'] as const),
});

export const imageSchema = z.object({
  url: z.any().optional(), // File object or URL
  isCover: z.boolean().optional(),
});

export const priceRuleSchema = z.object({
  yardIndex: z.number(),
  dayOfWeek: z.number().nullable().optional(),
  specialDate: z.string().nullable().optional(),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  price: z.number().min(0, 'Price must be positive'),
  label: z.string().optional(),
}).refine(data => data.dayOfWeek !== null || !!data.specialDate, {
  message: 'Must specify Day of Week or Special Date',
  path: ['dayOfWeek'], // Attach error
});

export const operatingHourSchema = z.object({
  yardIndex: z.number(),
  dayOfWeek: z.number().min(0).max(6),
  openTime: z.string().min(1, 'Open time is required'),
  closeTime: z.string().min(1, 'Close time is required'),
}).refine(data => data.openTime < data.closeTime, {
  message: 'Open time must be before close time',
  path: ['openTime']
});

export const PitchFormSchema = z.object({
  name: z.string().min(1, 'Pitch name is required'),
  categoryId: z.string().optional(),
  description: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  province: z.string().min(1, 'Province is required'),
  district: z.string().min(1, 'District is required'),
  ward: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  yards: z.array(yardSchema).min(1, 'At least one yard is required'),
  images: z.array(imageSchema).optional(),
  priceRules: z.array(priceRuleSchema).optional(),
  operatingHours: z.array(operatingHourSchema).optional(),
});

export type PitchFormData = z.infer<typeof PitchFormSchema>;
