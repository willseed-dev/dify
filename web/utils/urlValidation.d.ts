/**
 * Validates that a URL is safe for redirection.
 * Only allows HTTP and HTTPS protocols to prevent XSS attacks.
 *
 * @param url - The URL string to validate
 * @throws Error if the URL has an unsafe protocol
 */
export declare function validateRedirectUrl(url: string): void;
/**
 * Check if URL is a private/local network address or cloud debug URL
 * @param url - The URL string to check
 * @returns true if the URL is a private/local address or cloud debug URL
 */
export declare function isPrivateOrLocalAddress(url: string): boolean;
