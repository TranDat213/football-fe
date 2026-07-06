import { PitchFormData } from '../schema/pitch.schema';
import { useUploadImageMutation, useCreateCompleteFieldMutation } from '../api/pitchAPI';
import { CreateFootballFieldCompletePayload } from '../types/pich.types';

export function useSubmitPitch() {
  const [uploadImage] = useUploadImageMutation();
  const [createComplete] = useCreateCompleteFieldMutation();

  const submitPitch = async (data: PitchFormData) => {
    // 1. Upload images in parallel
    const uploadedImages = await Promise.all(
      data.images.map(async (img) => {
        const formData = new FormData();
        formData.append('image', img.file);
        const response = await uploadImage(formData).unwrap();
        return {
          url: response.data.url,
          publicId: response.data.publicId,
          sortOrder: img.sortOrder,
          isCover: img.isCover,
        };
      }),
    );

    // 2. Build atomic payload
    const payload: CreateFootballFieldCompletePayload = {
      name: data.name,
      description: data.description || undefined,
      categoryId: data.category_id,
      address: data.address,
      province: data.province,
      district: data.district,
      ward: data.ward || undefined,
      latitude: data.latitude ?? undefined,
      longitude: data.longitude ?? undefined,
      openTime: data.open_time,
      closeTime: data.close_time,
      images: uploadedImages,
      yards: data.yards.map((yard) => ({
        name: yard.name,
        type: yard.type,

        timeSlots: yard.timeSlots.map((slot) => ({
          tempId: slot.tempId ?? undefined,
          dayOfWeek: slot.dayOfWeek,
          startTime: slot.startTime,
          endTime: slot.endTime,
          label: slot.label,
          sortOrder: slot.sortOrder,
          priceRule: slot.priceRule,
          })),
      })),
    };

    // 3. Create everything atomically
    const result = await createComplete(payload).unwrap();
    return result.data;
  };

  return { submitPitch };
}