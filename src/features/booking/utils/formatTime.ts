export const formatBookingTime = (timeStr?: string): string => {
  if (!timeStr) return '';
  if (timeStr.includes('T')) {
    try {
      const date = new Date(timeStr);
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;

    } catch {
      return timeStr.slice(0, 5);
    }
  }
  return timeStr.slice(0, 5);
};
