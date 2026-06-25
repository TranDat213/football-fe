import { useCreateYardMutation } from '../api/pitchAPI';
import { CreateYardPayload } from '../types/pich.types';

/**
 * Hook to create a yard under an existing field (POST /field-yard).
 * Returns { createYard, isLoading, error }.
 */
export function useCreateFieldYard() {
  const [mutate, { isLoading, error }] = useCreateYardMutation();

  const createYard = async (payload: CreateYardPayload) => {
    const result = await mutate(payload).unwrap();
    return result.data; // returns FieldYard
  };

  return { createYard, isLoading, error };
}
