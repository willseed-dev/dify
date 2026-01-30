/**
 * Track custom event
 * @param eventName Event name
 * @param eventProperties Event properties (optional)
 */
export declare const trackEvent: (eventName: string, eventProperties?: Record<string, any>) => void;
/**
 * Set user ID
 * @param userId User ID
 */
export declare const setUserId: (userId: string) => void;
/**
 * Set user properties
 * @param properties User properties
 */
export declare const setUserProperties: (properties: Record<string, any>) => void;
/**
 * Reset user (e.g., when user logs out)
 */
export declare const resetUser: () => void;
