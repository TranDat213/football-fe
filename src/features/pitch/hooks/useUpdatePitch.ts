import { PitchFormData } from '../schema/pitch.schema';
import { useUploadImageMutation, useCreateFieldUpdateRequestMutation } from '../api/pitchAPI';
import { CreateFootballFieldUpdateRequestPayload } from '../types/pich.types';

export function useSubmitPitchUpdateRequest() {
  const [uploadImage] = useUploadImageMutation();
  const [createFieldUpdateRequest] = useCreateFieldUpdateRequestMutation();

  const submitPitchUpdateRequest = async (fieldId: string, data: PitchFormData) => {
    // 1. Upload ảnh mới song song
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

    // 2. Build payload update request
    const payload: CreateFootballFieldUpdateRequestPayload = {
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

    // 3. Gửi yêu cầu chỉnh sửa (chờ admin duyệt, không update trực tiếp)
    const result = await createFieldUpdateRequest({ id: fieldId, body: payload }).unwrap();
    return result.data;
  };

  return { submitPitchUpdateRequest };
} 