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
      yards: data.yards.map((yard, index) => ({
        name: yard.name,
        type: yard.type,
        operatingHours: (data.operatingHours ?? [])
          .filter((oh) => oh.yardIndex === index)
          .map((oh) => ({
            dayOfWeek: oh.dayOfWeek,
            openTime: oh.openTime,
            closeTime: oh.closeTime,
          })),
        priceRules: (data.priceRules ?? [])
          .filter((pr) => pr.yardIndex === index)
          .map((pr) => ({
            dayOfWeek: pr.dayOfWeek ?? undefined,
            specialDate: pr.specialDate || undefined,
            startTime: pr.startTime,
            endTime: pr.endTime,
            price: pr.price,
            label: pr.label || undefined,
          })),
      })),
    };

    // 3. Create everything atomically
    const result = await createComplete(payload).unwrap();
    return result.data;
  };

  return { submitPitch };
}