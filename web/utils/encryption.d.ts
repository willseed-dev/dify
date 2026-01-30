/**
 * Field Encoding Utilities
 * Provides Base64 encoding for sensitive fields (password, verification code)
 * during transmission from frontend to backend.
 *
 * Note: This uses Base64 encoding for obfuscation, not cryptographic encryption.
 * Real security relies on HTTPS for transport layer encryption.
 */
/**
 * Encode sensitive field using Base64
 * @param plaintext - The plain text to encode
 * @returns Base64 encoded text
 */
export declare function encryptField(plaintext: string): string;
/**
 * Encrypt password field for login
 * @param password - Plain password
 * @returns Encrypted password or original if encryption disabled
 */
export declare function encryptPassword(password: string): string;
/**
 * Encrypt verification code for email code login
 * @param code - Plain verification code
 * @returns Encrypted code or original if encryption disabled
 */
export declare function encryptVerificationCode(code: string): string;
