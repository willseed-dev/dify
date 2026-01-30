"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetUser = exports.setUserProperties = exports.setUserId = exports.trackEvent = void 0;
const amplitude = require("@amplitude/analytics-browser");
const AmplitudeProvider_1 = require("./AmplitudeProvider");
/**
 * Track custom event
 * @param eventName Event name
 * @param eventProperties Event properties (optional)
 */
const trackEvent = (eventName, eventProperties) => {
    if (!(0, AmplitudeProvider_1.isAmplitudeEnabled)())
        return;
    amplitude.track(eventName, eventProperties);
};
exports.trackEvent = trackEvent;
/**
 * Set user ID
 * @param userId User ID
 */
const setUserId = (userId) => {
    if (!(0, AmplitudeProvider_1.isAmplitudeEnabled)())
        return;
    amplitude.setUserId(userId);
};
exports.setUserId = setUserId;
/**
 * Set user properties
 * @param properties User properties
 */
const setUserProperties = (properties) => {
    if (!(0, AmplitudeProvider_1.isAmplitudeEnabled)())
        return;
    const identifyEvent = new amplitude.Identify();
    Object.entries(properties).forEach(([key, value]) => {
        identifyEvent.set(key, value);
    });
    amplitude.identify(identifyEvent);
};
exports.setUserProperties = setUserProperties;
/**
 * Reset user (e.g., when user logs out)
 */
const resetUser = () => {
    if (!(0, AmplitudeProvider_1.isAmplitudeEnabled)())
        return;
    amplitude.reset();
};
exports.resetUser = resetUser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwwREFBeUQ7QUFDekQsMkRBQXdEO0FBRXhEOzs7O0dBSUc7QUFDSSxNQUFNLFVBQVUsR0FBRyxDQUFDLFNBQWlCLEVBQUUsZUFBcUMsRUFBRSxFQUFFO0lBQ3JGLElBQUksQ0FBQyxJQUFBLHNDQUFrQixHQUFFO1FBQ3ZCLE9BQU07SUFDUixTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQTtBQUM3QyxDQUFDLENBQUE7QUFKWSxRQUFBLFVBQVUsY0FJdEI7QUFFRDs7O0dBR0c7QUFDSSxNQUFNLFNBQVMsR0FBRyxDQUFDLE1BQWMsRUFBRSxFQUFFO0lBQzFDLElBQUksQ0FBQyxJQUFBLHNDQUFrQixHQUFFO1FBQ3ZCLE9BQU07SUFDUixTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0FBQzdCLENBQUMsQ0FBQTtBQUpZLFFBQUEsU0FBUyxhQUlyQjtBQUVEOzs7R0FHRztBQUNJLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxVQUErQixFQUFFLEVBQUU7SUFDbkUsSUFBSSxDQUFDLElBQUEsc0NBQWtCLEdBQUU7UUFDdkIsT0FBTTtJQUNSLE1BQU0sYUFBYSxHQUFHLElBQUksU0FBUyxDQUFDLFFBQVEsRUFBRSxDQUFBO0lBQzlDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtRQUNsRCxhQUFhLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtJQUMvQixDQUFDLENBQUMsQ0FBQTtJQUNGLFNBQVMsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUE7QUFDbkMsQ0FBQyxDQUFBO0FBUlksUUFBQSxpQkFBaUIscUJBUTdCO0FBRUQ7O0dBRUc7QUFDSSxNQUFNLFNBQVMsR0FBRyxHQUFHLEVBQUU7SUFDNUIsSUFBSSxDQUFDLElBQUEsc0NBQWtCLEdBQUU7UUFDdkIsT0FBTTtJQUNSLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtBQUNuQixDQUFDLENBQUE7QUFKWSxRQUFBLFNBQVMsYUFJckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhbXBsaXR1ZGUgZnJvbSAnQGFtcGxpdHVkZS9hbmFseXRpY3MtYnJvd3NlcidcbmltcG9ydCB7IGlzQW1wbGl0dWRlRW5hYmxlZCB9IGZyb20gJy4vQW1wbGl0dWRlUHJvdmlkZXInXG5cbi8qKlxuICogVHJhY2sgY3VzdG9tIGV2ZW50XG4gKiBAcGFyYW0gZXZlbnROYW1lIEV2ZW50IG5hbWVcbiAqIEBwYXJhbSBldmVudFByb3BlcnRpZXMgRXZlbnQgcHJvcGVydGllcyAob3B0aW9uYWwpXG4gKi9cbmV4cG9ydCBjb25zdCB0cmFja0V2ZW50ID0gKGV2ZW50TmFtZTogc3RyaW5nLCBldmVudFByb3BlcnRpZXM/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gIGlmICghaXNBbXBsaXR1ZGVFbmFibGVkKCkpXG4gICAgcmV0dXJuXG4gIGFtcGxpdHVkZS50cmFjayhldmVudE5hbWUsIGV2ZW50UHJvcGVydGllcylcbn1cblxuLyoqXG4gKiBTZXQgdXNlciBJRFxuICogQHBhcmFtIHVzZXJJZCBVc2VyIElEXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRVc2VySWQgPSAodXNlcklkOiBzdHJpbmcpID0+IHtcbiAgaWYgKCFpc0FtcGxpdHVkZUVuYWJsZWQoKSlcbiAgICByZXR1cm5cbiAgYW1wbGl0dWRlLnNldFVzZXJJZCh1c2VySWQpXG59XG5cbi8qKlxuICogU2V0IHVzZXIgcHJvcGVydGllc1xuICogQHBhcmFtIHByb3BlcnRpZXMgVXNlciBwcm9wZXJ0aWVzXG4gKi9cbmV4cG9ydCBjb25zdCBzZXRVc2VyUHJvcGVydGllcyA9IChwcm9wZXJ0aWVzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gIGlmICghaXNBbXBsaXR1ZGVFbmFibGVkKCkpXG4gICAgcmV0dXJuXG4gIGNvbnN0IGlkZW50aWZ5RXZlbnQgPSBuZXcgYW1wbGl0dWRlLklkZW50aWZ5KClcbiAgT2JqZWN0LmVudHJpZXMocHJvcGVydGllcykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgaWRlbnRpZnlFdmVudC5zZXQoa2V5LCB2YWx1ZSlcbiAgfSlcbiAgYW1wbGl0dWRlLmlkZW50aWZ5KGlkZW50aWZ5RXZlbnQpXG59XG5cbi8qKlxuICogUmVzZXQgdXNlciAoZS5nLiwgd2hlbiB1c2VyIGxvZ3Mgb3V0KVxuICovXG5leHBvcnQgY29uc3QgcmVzZXRVc2VyID0gKCkgPT4ge1xuICBpZiAoIWlzQW1wbGl0dWRlRW5hYmxlZCgpKVxuICAgIHJldHVyblxuICBhbXBsaXR1ZGUucmVzZXQoKVxufVxuIl19