import { PitchFormData } from '../schema/pitch.schema';
import { useCreateField } from './useCreateField';
import { useCreateFieldImage } from './useCreateFieldImage';
import { useCreateFieldYard } from './useCreateFieldYard';
import { useCreateOperatingHour } from './useCreateOperatingHour';
import { useCreatePriceRule } from './useCreatePriceRule';

/**
 * Orchestration hook — runs all creation steps in the correct order:
 * 1. Create field  → get fieldId
 * 2. Create yards  → get yardIds[]
 * 3. Upload images
 * 4. Create price rules (mapped by yardIndex → yardId)
 * 5. Create operating hours (mapped by yardIndex → yardId)
 *
 * Returns { submitPitch, isSubmitting }.
 * Throws on any step failure so the caller can catch and toast.
 */
export function useSubmitPitch() {
  const { createField } = useCreateField();
  const { createYard } = useCreateFieldYard();
  const { uploadImage } = useCreateFieldImage();
  const { createPriceRule } = useCreatePriceRule();
  const { createOperatingHour } = useCreateOperatingHour();

  const submitPitch = async (data: PitchFormData) => {
    // 1. Field
    const field = await createField({
      category_id: data.category_id,
      name: data.name,
      description: data.description,
      address: data.address,
      province: data.province,
      district: data.district,
      ward: data.ward,
      latitude: data.latitude || undefined,
      longitude: data.longitude || undefined,
      open_time: data.open_time,
      close_time: data.close_time,
    });

    const fieldId = field.id;

    // 2. Yards — preserve order so yardIndex mapping stays correct
    const yardIds: string[] = [];
    for (const yard of data.yards) {
      const created = await createYard({
        name: yard.name,
        field_id: fieldId,
        type: yard.type,
        status: yard.status,
      });
      yardIds.push(created.id);
    }

    // 3. Images
    for (let i = 0; i < data.images.length; i++) {
      const img = data.images[i];
      await uploadImage({
        file: img.file,
        footballFieldId: fieldId,
        sortOrder: img.sortOrder,
        isCover: img.isCover,
      });
    }

    // 4. Price rules
    for (const rule of data.priceRules ?? []) {
      const yardId = yardIds[rule.yardIndex];
      if (!yardId) continue;
      await createPriceRule(yardId, {
        dayOfWeek: rule.dayOfWeek ?? null,
        startTime: rule.startTime,
        endTime: rule.endTime,
        specialDate: rule.specialDate ?? null,
        price: rule.price,
        label: rule.label,
      });
    }

    // 5. Operating hours
    for (const hour of data.operatingHours ?? []) {
      const yardId = yardIds[hour.yardIndex];
      if (!yardId) continue;
      await createOperatingHour(yardId, {
        dayOfWeek: hour.dayOfWeek,
        openTime: hour.openTime,
        closeTime: hour.closeTime,
      });
    }

    return fieldId;
  };

  return { submitPitch };
}
