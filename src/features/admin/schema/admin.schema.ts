// features/pitch/schema/admin.schema.ts
import { z } from 'zod';

export const UpdateFieldStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']),
});

export type UpdateFieldStatusFormData = z.infer<typeof UpdateFieldStatusSchema>;