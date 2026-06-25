import { useCreatePriceRuleMutation } from '../api/pitchAPI';
import { CreatePriceRulePayload } from '../types/pich.types';

/**
 * Hook to create a price rule for a specific yard (POST /price-rule/:yardId).
 * Returns { createPriceRule, isLoading, error }.
 */
export function useCreatePriceRule() {
  const [mutate, { isLoading, error }] = useCreatePriceRuleMutation();

  const createPriceRule = async (
    yardId: string,
    payload: CreatePriceRulePayload,
  ) => {
    const result = await mutate({ yardId, body: payload }).unwrap();
    return result.data;
  };

  return { createPriceRule, isLoading, error };
}
