import { useCreateFieldImageMutation } from '../api/pitchAPI';
import { CreateFieldImagePayload } from '../types/pich.types';

/**
 * Hook to upload a field image via multipart/form-data (POST /field/image).
 * Constructs FormData internally so callers don't need to.
 * Returns { uploadImage, isLoading, error }.
 */
export function useCreateFieldImage() {
  const [mutate, { isLoading, error }] = useCreateFieldImageMutation();

  const uploadImage = async (payload: CreateFieldImagePayload) => {
    const formData = new FormData();
    formData.append('image', payload.file);
    formData.append('footballFieldId', payload.footballFieldId);
    formData.append('sortOrder', String(payload.sortOrder));
    formData.append('isCover', String(payload.isCover));

    const result = await mutate(formData).unwrap();
    return result.data; // returns { url }
  };

  return { uploadImage, isLoading, error };
}
