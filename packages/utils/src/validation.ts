// @common/utils/src/validation.ts

export function sanitizeInput(val: string): string {
  if (!val) return '';
  let cleaned = val.replace(/\s+/g, '');
  try {
    cleaned = cleaned.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '');
  } catch (e) {
    cleaned = cleaned.replace(
      /[\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u1F1E0-\u1F1FF\u2700-\u27BF\u1F900-\u1F9FF\u2600-\u26FF]/g,
      ''
    );
  }
  return cleaned;
}

export function sanitizeAlphabetsOnly(val: string): string {
  if (!val) return '';
  return val.replace(/[^A-Za-z]/g, '');
}

export function sanitizeDigitsOnly(val: string): string {
  if (!val) return '';
  return val.replace(/\D/g, '');
}

export function validateEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/.test(val);
}

export function validateUsername(val: string): boolean {
  return /^[A-Za-z0-9_]{3,20}$/.test(val);
}

export function validateMobile(val: string): boolean {
  const digits = sanitizeDigitsOnly(val);
  return digits.length >= 7 && digits.length <= 15;
}

export function validatePassword(val: string): { valid: boolean; message?: string } {
  if (!val || val.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  return { valid: true };
}
