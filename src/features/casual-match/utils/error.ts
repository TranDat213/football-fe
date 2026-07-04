import { toast } from 'sonner';

export function getApiErrorMessage(error: unknown, fallback = 'Có lỗi xảy ra') {
  const data = (error as { data?: { message?: string | string[] } })?.data;
  if (Array.isArray(data?.message)) return data.message.join(', ');
  return data?.message || (error as { message?: string })?.message || fallback;
}

export function toastApiError(error: unknown, fallback?: string) {
  toast.error(getApiErrorMessage(error, fallback));
}
