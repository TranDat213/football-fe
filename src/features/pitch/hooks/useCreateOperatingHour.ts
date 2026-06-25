import { useCreateOperatingHourMutation } from '../api/pitchAPI';
import { CreateOperatingHourPayload } from '../types/pich.types';

/**
 * Hook to create an operating hour entry for a specific yard (POST /operating-hour/:yardId).
 * Returns { createOperatingHour, isLoading, error }.
 */
export function useCreateOperatingHour() {
  const [mutate, { isLoading, error }] = useCreateOperatingHourMutation();

  const createOperatingHour = async (
    yardId: string,
    payload: CreateOperatingHourPayload,
  ) => {
    const result = await mutate({ yardId, body: payload }).unwrap();
    return result.data;
  };

  return { createOperatingHour, isLoading, error };
}
