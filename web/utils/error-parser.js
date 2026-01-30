"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePluginErrorMessage = void 0;
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
const parsePluginErrorMessage = async (error) => {
    let rawMessage = '';
    // Handle Response object from fetch/ky
    if (error instanceof Response) {
        try {
            const body = await error.clone().json();
            rawMessage = body?.message || error.statusText || 'Unknown error';
        }
        catch {
            rawMessage = error.statusText || 'Unknown error';
        }
    }
    else {
        rawMessage = error?.message || error?.toString() || 'Unknown error';
    }
    console.log('rawMessage', rawMessage);
    // Try to extract nested JSON from PluginInvokeError
    // Use greedy match .+ to capture the complete JSON object with nested braces
    const pluginErrorPattern = /PluginInvokeError:\s*(\{.+\})/;
    const match = rawMessage.match(pluginErrorPattern);
    if (match) {
        try {
            const errorData = JSON.parse(match[1]);
            // Return the inner message if exists
            if (errorData.message)
                return errorData.message;
            // Fallback to error_type if message not available
            if (errorData.error_type)
                return errorData.error_type;
        }
        catch (parseError) {
            console.warn('Failed to parse plugin error JSON:', parseError);
        }
    }
    return rawMessage;
};
exports.parsePluginErrorMessage = parsePluginErrorMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXJyb3ItcGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7Ozs7Ozs7O0dBVUc7QUFDSSxNQUFNLHVCQUF1QixHQUFHLEtBQUssRUFBRSxLQUFVLEVBQW1CLEVBQUU7SUFDM0UsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFBO0lBRW5CLHVDQUF1QztJQUN2QyxJQUFJLEtBQUssWUFBWSxRQUFRLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUM7WUFDSCxNQUFNLElBQUksR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtZQUN2QyxVQUFVLEdBQUcsSUFBSSxFQUFFLE9BQU8sSUFBSSxLQUFLLENBQUMsVUFBVSxJQUFJLGVBQWUsQ0FBQTtRQUNuRSxDQUFDO1FBQ0QsTUFBTSxDQUFDO1lBQ0wsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLElBQUksZUFBZSxDQUFBO1FBQ2xELENBQUM7SUFDSCxDQUFDO1NBQ0ksQ0FBQztRQUNKLFVBQVUsR0FBRyxLQUFLLEVBQUUsT0FBTyxJQUFJLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxlQUFlLENBQUE7SUFDckUsQ0FBQztJQUVELE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBRXJDLG9EQUFvRDtJQUNwRCw2RUFBNkU7SUFDN0UsTUFBTSxrQkFBa0IsR0FBRywrQkFBK0IsQ0FBQTtJQUMxRCxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUE7SUFFbEQsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUNWLElBQUksQ0FBQztZQUNILE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDdEMscUNBQXFDO1lBQ3JDLElBQUksU0FBUyxDQUFDLE9BQU87Z0JBQ25CLE9BQU8sU0FBUyxDQUFDLE9BQU8sQ0FBQTtZQUMxQixrREFBa0Q7WUFDbEQsSUFBSSxTQUFTLENBQUMsVUFBVTtnQkFDdEIsT0FBTyxTQUFTLENBQUMsVUFBVSxDQUFBO1FBQy9CLENBQUM7UUFDRCxPQUFPLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQUMsb0NBQW9DLEVBQUUsVUFBVSxDQUFDLENBQUE7UUFDaEUsQ0FBQztJQUNILENBQUM7SUFFRCxPQUFPLFVBQVUsQ0FBQTtBQUNuQixDQUFDLENBQUE7QUF4Q1ksUUFBQSx1QkFBdUIsMkJBd0NuQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUGFyc2UgcGx1Z2luIGVycm9yIG1lc3NhZ2UgZnJvbSBuZXN0ZWQgZXJyb3Igc3RydWN0dXJlXG4gKiBFeHRyYWN0cyB0aGUgcmVhbCBlcnJvciBtZXNzYWdlIGZyb20gUGx1Z2luSW52b2tlRXJyb3IgSlNPTiBzdHJpbmdcbiAqXG4gKiBAZXhhbXBsZVxuICogSW5wdXQ6IHsgbWVzc2FnZTogXCJyZXFfaWQ6IHh4eCBQbHVnaW5JbnZva2VFcnJvcjoge1xcXCJtZXNzYWdlXFxcIjpcXFwiQmFkIGNyZWRlbnRpYWxzXFxcIn1cIiB9XG4gKiBPdXRwdXQ6IFwiQmFkIGNyZWRlbnRpYWxzXCJcbiAqXG4gKiBAcGFyYW0gZXJyb3IgLSBFcnJvciBvYmplY3QgKGNhbiBiZSBSZXNwb25zZSBvYmplY3Qgb3IgZXJyb3Igd2l0aCBtZXNzYWdlIHByb3BlcnR5KVxuICogQHJldHVybnMgUHJvbWlzZTxzdHJpbmc+IG9yIHN0cmluZyAtIFBhcnNlZCBlcnJvciBtZXNzYWdlXG4gKi9cbmV4cG9ydCBjb25zdCBwYXJzZVBsdWdpbkVycm9yTWVzc2FnZSA9IGFzeW5jIChlcnJvcjogYW55KTogUHJvbWlzZTxzdHJpbmc+ID0+IHtcbiAgbGV0IHJhd01lc3NhZ2UgPSAnJ1xuXG4gIC8vIEhhbmRsZSBSZXNwb25zZSBvYmplY3QgZnJvbSBmZXRjaC9reVxuICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBib2R5ID0gYXdhaXQgZXJyb3IuY2xvbmUoKS5qc29uKClcbiAgICAgIHJhd01lc3NhZ2UgPSBib2R5Py5tZXNzYWdlIHx8IGVycm9yLnN0YXR1c1RleHQgfHwgJ1Vua25vd24gZXJyb3InXG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgIHJhd01lc3NhZ2UgPSBlcnJvci5zdGF0dXNUZXh0IHx8ICdVbmtub3duIGVycm9yJ1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICByYXdNZXNzYWdlID0gZXJyb3I/Lm1lc3NhZ2UgfHwgZXJyb3I/LnRvU3RyaW5nKCkgfHwgJ1Vua25vd24gZXJyb3InXG4gIH1cblxuICBjb25zb2xlLmxvZygncmF3TWVzc2FnZScsIHJhd01lc3NhZ2UpXG5cbiAgLy8gVHJ5IHRvIGV4dHJhY3QgbmVzdGVkIEpTT04gZnJvbSBQbHVnaW5JbnZva2VFcnJvclxuICAvLyBVc2UgZ3JlZWR5IG1hdGNoIC4rIHRvIGNhcHR1cmUgdGhlIGNvbXBsZXRlIEpTT04gb2JqZWN0IHdpdGggbmVzdGVkIGJyYWNlc1xuICBjb25zdCBwbHVnaW5FcnJvclBhdHRlcm4gPSAvUGx1Z2luSW52b2tlRXJyb3I6XFxzKihcXHsuK1xcfSkvXG4gIGNvbnN0IG1hdGNoID0gcmF3TWVzc2FnZS5tYXRjaChwbHVnaW5FcnJvclBhdHRlcm4pXG5cbiAgaWYgKG1hdGNoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGVycm9yRGF0YSA9IEpTT04ucGFyc2UobWF0Y2hbMV0pXG4gICAgICAvLyBSZXR1cm4gdGhlIGlubmVyIG1lc3NhZ2UgaWYgZXhpc3RzXG4gICAgICBpZiAoZXJyb3JEYXRhLm1lc3NhZ2UpXG4gICAgICAgIHJldHVybiBlcnJvckRhdGEubWVzc2FnZVxuICAgICAgLy8gRmFsbGJhY2sgdG8gZXJyb3JfdHlwZSBpZiBtZXNzYWdlIG5vdCBhdmFpbGFibGVcbiAgICAgIGlmIChlcnJvckRhdGEuZXJyb3JfdHlwZSlcbiAgICAgICAgcmV0dXJuIGVycm9yRGF0YS5lcnJvcl90eXBlXG4gICAgfVxuICAgIGNhdGNoIChwYXJzZUVycm9yKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBwYXJzZSBwbHVnaW4gZXJyb3IgSlNPTjonLCBwYXJzZUVycm9yKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByYXdNZXNzYWdlXG59XG4iXX0=