import { useCreateFieldMutation } from '../api/pitchAPI';
import { CreateFieldPayload } from '../types/pich.types';

/**
 * Hook to create a new football field (POST /field/create).
 * Returns { createField, isLoading, error }.
 */
export function useCreateField() {
  const [mutate, { isLoading, error }] = useCreateFieldMutation();

  const createField = async (payload: CreateFieldPayload) => {
    const result = await mutate(payload).unwrap();
    return result.data; // returns Pitch
  };

  return { createField, isLoading, error };
}
