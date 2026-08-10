/**
 * Fixes corrupted Vietnamese text caused by Latin1/ISO-8859-1 double encoding (Mojibake).
 * Example: "Tráº§n Nguyá»…n Äáº¡t" -> "Trần Nguyễn Đạt"
 */
export function fixMojibake(text: string | null | undefined): string {
  if (!text) return '';
  
  // Check if string contains characteristic Mojibake patterns from double UTF-8 / Latin1 mis-encoding
  if (
    /[\u00C2-\u00C5\u00E1\u00E0\u00FA\u00F4\u00C4][\u0080-\u00BF]/.test(text) ||
    text.includes('áº') ||
    text.includes('á»') ||
    text.includes('Äá')
  ) {
    try {
      const bytes = new Uint8Array(text.length);
      for (let i = 0; i < text.length; i++) {
        bytes[i] = text.charCodeAt(i) & 0xff;
      }
      const decoded = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
      if (!decoded.includes('\uFFFD') && decoded !== text) {
        return decoded;
      }
    } catch {
      // Fallback to original text if decoding fails
    }
  }

  return text;
}
