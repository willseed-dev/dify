"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidCronExpression = exports.parseCronExpression = void 0;
const cron_parser_1 = require("cron-parser");
// Convert a UTC date from cron-parser to user timezone representation
// This ensures consistency with other execution time calculations
const convertToUserTimezoneRepresentation = (utcDate, timezone) => {
    // Get the time string in the target timezone
    const userTimeStr = utcDate.toLocaleString('en-CA', {
        timeZone: timezone,
        hour12: false,
    });
    const [dateStr, timeStr] = userTimeStr.split(', ');
    const [year, month, day] = dateStr.split('-').map(Number);
    const [hour, minute, second] = timeStr.split(':').map(Number);
    // Create a new Date object representing this time as "local" time
    // This matches the behavior expected by the execution-time-calculator
    return new Date(year, month - 1, day, hour, minute, second);
};
/**
 * Parse a cron expression and return the next 5 execution times
 *
 * @param cronExpression - Standard 5-field cron expression (minute hour day month dayOfWeek)
 * @param timezone - IANA timezone identifier (e.g., 'UTC', 'America/New_York')
 * @returns Array of Date objects representing the next 5 execution times
 */
const parseCronExpression = (cronExpression, timezone = 'UTC') => {
    if (!cronExpression || cronExpression.trim() === '')
        return [];
    const parts = cronExpression.trim().split(/\s+/);
    // Support both 5-field format and predefined expressions
    if (parts.length !== 5 && !cronExpression.startsWith('@'))
        return [];
    try {
        // Parse the cron expression with timezone support
        // Use the actual current time for cron-parser to handle properly
        const interval = cron_parser_1.CronExpressionParser.parse(cronExpression, {
            tz: timezone,
        });
        // Get the next 5 execution times using the take() method
        const nextCronDates = interval.take(5);
        // Convert CronDate objects to Date objects and ensure they represent
        // the time in user timezone (consistent with execution-time-calculator.ts)
        return nextCronDates.map((cronDate) => {
            const utcDate = cronDate.toDate();
            return convertToUserTimezoneRepresentation(utcDate, timezone);
        });
    }
    catch {
        // Return empty array if parsing fails
        return [];
    }
};
exports.parseCronExpression = parseCronExpression;
/**
 * Validate a cron expression format and syntax
 *
 * @param cronExpression - Standard 5-field cron expression to validate
 * @returns boolean indicating if the cron expression is valid
 */
const isValidCronExpression = (cronExpression) => {
    if (!cronExpression || cronExpression.trim() === '')
        return false;
    const parts = cronExpression.trim().split(/\s+/);
    // Support both 5-field format and predefined expressions
    if (parts.length !== 5 && !cronExpression.startsWith('@'))
        return false;
    try {
        // Use cron-parser to validate the expression
        cron_parser_1.CronExpressionParser.parse(cronExpression);
        return true;
    }
    catch {
        return false;
    }
};
exports.isValidCronExpression = isValidCronExpression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3Jvbi1wYXJzZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjcm9uLXBhcnNlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2Q0FBa0Q7QUFFbEQsc0VBQXNFO0FBQ3RFLGtFQUFrRTtBQUNsRSxNQUFNLG1DQUFtQyxHQUFHLENBQUMsT0FBYSxFQUFFLFFBQWdCLEVBQVEsRUFBRTtJQUNwRiw2Q0FBNkM7SUFDN0MsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUU7UUFDbEQsUUFBUSxFQUFFLFFBQVE7UUFDbEIsTUFBTSxFQUFFLEtBQUs7S0FDZCxDQUFDLENBQUE7SUFDRixNQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDbEQsTUFBTSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDekQsTUFBTSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFN0Qsa0VBQWtFO0lBQ2xFLHNFQUFzRTtJQUN0RSxPQUFPLElBQUksSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFBO0FBQzdELENBQUMsQ0FBQTtBQUVEOzs7Ozs7R0FNRztBQUNJLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxjQUFzQixFQUFFLFdBQW1CLEtBQUssRUFBVSxFQUFFO0lBQzlGLElBQUksQ0FBQyxjQUFjLElBQUksY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUU7UUFDakQsT0FBTyxFQUFFLENBQUE7SUFFWCxNQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRWhELHlEQUF5RDtJQUN6RCxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUM7UUFDdkQsT0FBTyxFQUFFLENBQUE7SUFFWCxJQUFJLENBQUM7UUFDSCxrREFBa0Q7UUFDbEQsaUVBQWlFO1FBQ2pFLE1BQU0sUUFBUSxHQUFHLGtDQUFvQixDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUU7WUFDMUQsRUFBRSxFQUFFLFFBQVE7U0FDYixDQUFDLENBQUE7UUFFRix5REFBeUQ7UUFDekQsTUFBTSxhQUFhLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUV0QyxxRUFBcUU7UUFDckUsMkVBQTJFO1FBQzNFLE9BQU8sYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ3BDLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQTtZQUNqQyxPQUFPLG1DQUFtQyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUMvRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxNQUFNLENBQUM7UUFDTCxzQ0FBc0M7UUFDdEMsT0FBTyxFQUFFLENBQUE7SUFDWCxDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBL0JZLFFBQUEsbUJBQW1CLHVCQStCL0I7QUFFRDs7Ozs7R0FLRztBQUNJLE1BQU0scUJBQXFCLEdBQUcsQ0FBQyxjQUFzQixFQUFXLEVBQUU7SUFDdkUsSUFBSSxDQUFDLGNBQWMsSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtRQUNqRCxPQUFPLEtBQUssQ0FBQTtJQUVkLE1BQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFaEQseURBQXlEO0lBQ3pELElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQztRQUN2RCxPQUFPLEtBQUssQ0FBQTtJQUVkLElBQUksQ0FBQztRQUNILDZDQUE2QztRQUM3QyxrQ0FBb0IsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDMUMsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBQ0QsTUFBTSxDQUFDO1FBQ0wsT0FBTyxLQUFLLENBQUE7SUFDZCxDQUFDO0FBQ0gsQ0FBQyxDQUFBO0FBbEJZLFFBQUEscUJBQXFCLHlCQWtCakMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDcm9uRXhwcmVzc2lvblBhcnNlciB9IGZyb20gJ2Nyb24tcGFyc2VyJ1xuXG4vLyBDb252ZXJ0IGEgVVRDIGRhdGUgZnJvbSBjcm9uLXBhcnNlciB0byB1c2VyIHRpbWV6b25lIHJlcHJlc2VudGF0aW9uXG4vLyBUaGlzIGVuc3VyZXMgY29uc2lzdGVuY3kgd2l0aCBvdGhlciBleGVjdXRpb24gdGltZSBjYWxjdWxhdGlvbnNcbmNvbnN0IGNvbnZlcnRUb1VzZXJUaW1lem9uZVJlcHJlc2VudGF0aW9uID0gKHV0Y0RhdGU6IERhdGUsIHRpbWV6b25lOiBzdHJpbmcpOiBEYXRlID0+IHtcbiAgLy8gR2V0IHRoZSB0aW1lIHN0cmluZyBpbiB0aGUgdGFyZ2V0IHRpbWV6b25lXG4gIGNvbnN0IHVzZXJUaW1lU3RyID0gdXRjRGF0ZS50b0xvY2FsZVN0cmluZygnZW4tQ0EnLCB7XG4gICAgdGltZVpvbmU6IHRpbWV6b25lLFxuICAgIGhvdXIxMjogZmFsc2UsXG4gIH0pXG4gIGNvbnN0IFtkYXRlU3RyLCB0aW1lU3RyXSA9IHVzZXJUaW1lU3RyLnNwbGl0KCcsICcpXG4gIGNvbnN0IFt5ZWFyLCBtb250aCwgZGF5XSA9IGRhdGVTdHIuc3BsaXQoJy0nKS5tYXAoTnVtYmVyKVxuICBjb25zdCBbaG91ciwgbWludXRlLCBzZWNvbmRdID0gdGltZVN0ci5zcGxpdCgnOicpLm1hcChOdW1iZXIpXG5cbiAgLy8gQ3JlYXRlIGEgbmV3IERhdGUgb2JqZWN0IHJlcHJlc2VudGluZyB0aGlzIHRpbWUgYXMgXCJsb2NhbFwiIHRpbWVcbiAgLy8gVGhpcyBtYXRjaGVzIHRoZSBiZWhhdmlvciBleHBlY3RlZCBieSB0aGUgZXhlY3V0aW9uLXRpbWUtY2FsY3VsYXRvclxuICByZXR1cm4gbmV3IERhdGUoeWVhciwgbW9udGggLSAxLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kKVxufVxuXG4vKipcbiAqIFBhcnNlIGEgY3JvbiBleHByZXNzaW9uIGFuZCByZXR1cm4gdGhlIG5leHQgNSBleGVjdXRpb24gdGltZXNcbiAqXG4gKiBAcGFyYW0gY3JvbkV4cHJlc3Npb24gLSBTdGFuZGFyZCA1LWZpZWxkIGNyb24gZXhwcmVzc2lvbiAobWludXRlIGhvdXIgZGF5IG1vbnRoIGRheU9mV2VlaylcbiAqIEBwYXJhbSB0aW1lem9uZSAtIElBTkEgdGltZXpvbmUgaWRlbnRpZmllciAoZS5nLiwgJ1VUQycsICdBbWVyaWNhL05ld19Zb3JrJylcbiAqIEByZXR1cm5zIEFycmF5IG9mIERhdGUgb2JqZWN0cyByZXByZXNlbnRpbmcgdGhlIG5leHQgNSBleGVjdXRpb24gdGltZXNcbiAqL1xuZXhwb3J0IGNvbnN0IHBhcnNlQ3JvbkV4cHJlc3Npb24gPSAoY3JvbkV4cHJlc3Npb246IHN0cmluZywgdGltZXpvbmU6IHN0cmluZyA9ICdVVEMnKTogRGF0ZVtdID0+IHtcbiAgaWYgKCFjcm9uRXhwcmVzc2lvbiB8fCBjcm9uRXhwcmVzc2lvbi50cmltKCkgPT09ICcnKVxuICAgIHJldHVybiBbXVxuXG4gIGNvbnN0IHBhcnRzID0gY3JvbkV4cHJlc3Npb24udHJpbSgpLnNwbGl0KC9cXHMrLylcblxuICAvLyBTdXBwb3J0IGJvdGggNS1maWVsZCBmb3JtYXQgYW5kIHByZWRlZmluZWQgZXhwcmVzc2lvbnNcbiAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gNSAmJiAhY3JvbkV4cHJlc3Npb24uc3RhcnRzV2l0aCgnQCcpKVxuICAgIHJldHVybiBbXVxuXG4gIHRyeSB7XG4gICAgLy8gUGFyc2UgdGhlIGNyb24gZXhwcmVzc2lvbiB3aXRoIHRpbWV6b25lIHN1cHBvcnRcbiAgICAvLyBVc2UgdGhlIGFjdHVhbCBjdXJyZW50IHRpbWUgZm9yIGNyb24tcGFyc2VyIHRvIGhhbmRsZSBwcm9wZXJseVxuICAgIGNvbnN0IGludGVydmFsID0gQ3JvbkV4cHJlc3Npb25QYXJzZXIucGFyc2UoY3JvbkV4cHJlc3Npb24sIHtcbiAgICAgIHR6OiB0aW1lem9uZSxcbiAgICB9KVxuXG4gICAgLy8gR2V0IHRoZSBuZXh0IDUgZXhlY3V0aW9uIHRpbWVzIHVzaW5nIHRoZSB0YWtlKCkgbWV0aG9kXG4gICAgY29uc3QgbmV4dENyb25EYXRlcyA9IGludGVydmFsLnRha2UoNSlcblxuICAgIC8vIENvbnZlcnQgQ3JvbkRhdGUgb2JqZWN0cyB0byBEYXRlIG9iamVjdHMgYW5kIGVuc3VyZSB0aGV5IHJlcHJlc2VudFxuICAgIC8vIHRoZSB0aW1lIGluIHVzZXIgdGltZXpvbmUgKGNvbnNpc3RlbnQgd2l0aCBleGVjdXRpb24tdGltZS1jYWxjdWxhdG9yLnRzKVxuICAgIHJldHVybiBuZXh0Q3JvbkRhdGVzLm1hcCgoY3JvbkRhdGUpID0+IHtcbiAgICAgIGNvbnN0IHV0Y0RhdGUgPSBjcm9uRGF0ZS50b0RhdGUoKVxuICAgICAgcmV0dXJuIGNvbnZlcnRUb1VzZXJUaW1lem9uZVJlcHJlc2VudGF0aW9uKHV0Y0RhdGUsIHRpbWV6b25lKVxuICAgIH0pXG4gIH1cbiAgY2F0Y2gge1xuICAgIC8vIFJldHVybiBlbXB0eSBhcnJheSBpZiBwYXJzaW5nIGZhaWxzXG4gICAgcmV0dXJuIFtdXG4gIH1cbn1cblxuLyoqXG4gKiBWYWxpZGF0ZSBhIGNyb24gZXhwcmVzc2lvbiBmb3JtYXQgYW5kIHN5bnRheFxuICpcbiAqIEBwYXJhbSBjcm9uRXhwcmVzc2lvbiAtIFN0YW5kYXJkIDUtZmllbGQgY3JvbiBleHByZXNzaW9uIHRvIHZhbGlkYXRlXG4gKiBAcmV0dXJucyBib29sZWFuIGluZGljYXRpbmcgaWYgdGhlIGNyb24gZXhwcmVzc2lvbiBpcyB2YWxpZFxuICovXG5leHBvcnQgY29uc3QgaXNWYWxpZENyb25FeHByZXNzaW9uID0gKGNyb25FeHByZXNzaW9uOiBzdHJpbmcpOiBib29sZWFuID0+IHtcbiAgaWYgKCFjcm9uRXhwcmVzc2lvbiB8fCBjcm9uRXhwcmVzc2lvbi50cmltKCkgPT09ICcnKVxuICAgIHJldHVybiBmYWxzZVxuXG4gIGNvbnN0IHBhcnRzID0gY3JvbkV4cHJlc3Npb24udHJpbSgpLnNwbGl0KC9cXHMrLylcblxuICAvLyBTdXBwb3J0IGJvdGggNS1maWVsZCBmb3JtYXQgYW5kIHByZWRlZmluZWQgZXhwcmVzc2lvbnNcbiAgaWYgKHBhcnRzLmxlbmd0aCAhPT0gNSAmJiAhY3JvbkV4cHJlc3Npb24uc3RhcnRzV2l0aCgnQCcpKVxuICAgIHJldHVybiBmYWxzZVxuXG4gIHRyeSB7XG4gICAgLy8gVXNlIGNyb24tcGFyc2VyIHRvIHZhbGlkYXRlIHRoZSBleHByZXNzaW9uXG4gICAgQ3JvbkV4cHJlc3Npb25QYXJzZXIucGFyc2UoY3JvbkV4cHJlc3Npb24pXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuICBjYXRjaCB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cbiJdfQ==