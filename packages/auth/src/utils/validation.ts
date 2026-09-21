// src/lib/utils/validation.ts

/**
 * Sanitizes input text by removing spaces and emojis.
 */
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

/**
 * Sanitizes names to only contain alphabetical characters (no digits, spaces, emojis, or symbols).
 */
export function sanitizeAlphabetsOnly(val: string): string {
	if (!val) return '';
	return val.replace(/[^A-Za-z]/g, '');
}

/**
 * Sanitizes phone numbers to only contain digit characters (no letters, spaces, symbols).
 */
export function sanitizeDigitsOnly(val: string): string {
	if (!val) return '';
	return val.replace(/\D/g, '');
}

/**
 * Validates Email format
 */
export function validateEmail(val: string): boolean {
	return /^[^\s@]+@[^\s@]{2,}\.[^\s@]{2,}$/.test(val);
}

/**
 * Validates Username (min 4, max 16 alphanumeric characters, no spaces/special chars)
 */
export function validateUsername(val: string): boolean {
	return /^[A-Za-z0-9]{4,16}$/.test(val);
}

/**
 * Validates Mobile Number (min 7, max 12 digits)
 */
export function validateMobile(val: string): boolean {
	return /^\d{7,12}$/.test(val);
}

/**
 * Validates strong password constraint:
 * 8-16 characters, at least 1 lowercase, 1 uppercase, 1 digit, and 1 special character.
 */
// export function validatePassword(val: string): boolean {
// 	if (val.length < 8 || val.length > 16) return false;
// 	const hasLower = /[a-z]/.test(val);
// 	const hasUpper = /[A-Z]/.test(val);
// 	const hasDigit = /[0-9]/.test(val);
// 	const hasSpecial = /[^A-Za-z0-9]/.test(val);
// 	return hasLower && hasUpper && hasDigit && hasSpecial;
// }

export function validatePassword(val: string): boolean {
	if (val.length < 6 || val.length > 15) return false;
	return sanitizeInput(val) === val;
}
