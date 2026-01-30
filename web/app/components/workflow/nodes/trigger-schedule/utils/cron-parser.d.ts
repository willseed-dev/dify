/**
 * Parse a cron expression and return the next 5 execution times
 *
 * @param cronExpression - Standard 5-field cron expression (minute hour day month dayOfWeek)
 * @param timezone - IANA timezone identifier (e.g., 'UTC', 'America/New_York')
 * @returns Array of Date objects representing the next 5 execution times
 */
export declare const parseCronExpression: (cronExpression: string, timezone?: string) => Date[];
/**
 * Validate a cron expression format and syntax
 *
 * @param cronExpression - Standard 5-field cron expression to validate
 * @returns boolean indicating if the cron expression is valid
 */
export declare const isValidCronExpression: (cronExpression: string) => boolean;
