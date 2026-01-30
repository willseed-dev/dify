/**
 * Parse plugin error message from nested error structure
 * Extracts the real error message from PluginInvokeError JSON string
 *
 * @example
 * Input: { message: "req_id: xxx PluginInvokeError: {\"message\":\"Bad credentials\"}" }
 * Output: "Bad credentials"
 *
 * @param error - Error object (can be Response object or error with message property)
 * @returns Promise<string> or string - Parsed error message
 */
export declare const parsePluginErrorMessage: (error: any) => Promise<string>;
