export function toHHmm(time: string): string {
  if (!time) return '';
  // Bắt giờ:phút ngay sau "T" trong ISO datetime, tránh Date() bị convert theo local timezone
  const isoMatch = time.match(/T(\d{2}):(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}:${isoMatch[2]}`;

  // Fallback cho trường hợp đã là "HH:mm" hoặc "HH:mm:ss"
  const plainMatch = time.match(/^(\d{2}):(\d{2})/);
  return plainMatch ? `${plainMatch[1]}:${plainMatch[2]}` : time;
}
