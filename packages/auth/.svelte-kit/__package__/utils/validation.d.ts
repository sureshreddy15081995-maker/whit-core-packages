/**
 * Sanitizes input text by removing spaces and emojis.
 */
export declare function sanitizeInput(val: string): string;
/**
 * Sanitizes names to only contain alphabetical characters (no digits, spaces, emojis, or symbols).
 */
export declare function sanitizeAlphabetsOnly(val: string): string;
/**
 * Sanitizes phone numbers to only contain digit characters (no letters, spaces, symbols).
 */
export declare function sanitizeDigitsOnly(val: string): string;
/**
 * Validates Email format
 */
export declare function validateEmail(val: string): boolean;
/**
 * Validates Username (min 4, max 16 alphanumeric characters, no spaces/special chars)
 */
export declare function validateUsername(val: string): boolean;
/**
 * Validates Mobile Number (min 7, max 12 digits)
 */
export declare function validateMobile(val: string): boolean;
/**
 * Validates strong password constraint:
 * 8-16 characters, at least 1 lowercase, 1 uppercase, 1 digit, and 1 special character.
 */
export declare function validatePassword(val: string): boolean;
//# sourceMappingURL=validation.d.ts.map