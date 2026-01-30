"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../../../types");
const cron_parser_1 = require("./cron-parser");
const execution_time_calculator_1 = require("./execution-time-calculator");
// Comprehensive integration tests for cron-parser and execution-time-calculator compatibility
describe('cron-parser + execution-time-calculator integration', () => {
    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date('2024-01-15T10:00:00Z'));
    });
    afterAll(() => {
        vi.useRealTimers();
    });
    const createCronData = (overrides = {}) => ({
        type: types_1.BlockEnum.TriggerSchedule,
        title: 'test-schedule',
        mode: 'cron',
        frequency: 'daily',
        timezone: 'UTC',
        ...overrides,
    });
    describe('backward compatibility validation', () => {
        it('maintains exact behavior for legacy cron expressions', () => {
            const legacyExpressions = [
                '15 10 1 * *', // Monthly 1st at 10:15
                '0 0 * * 0', // Weekly Sunday midnight
                '*/5 * * * *', // Every 5 minutes
                '0 9-17 * * 1-5', // Business hours weekdays
                '30 14 * * 1', // Monday 14:30
                '0 0 1,15 * *', // 1st and 15th midnight
            ];
            legacyExpressions.forEach((expression) => {
                // Test direct cron-parser usage
                const directResult = (0, cron_parser_1.parseCronExpression)(expression, 'UTC');
                expect(directResult).toHaveLength(5);
                expect((0, cron_parser_1.isValidCronExpression)(expression)).toBe(true);
                // Test through execution-time-calculator
                const data = createCronData({ cron_expression: expression });
                const calculatorResult = (0, execution_time_calculator_1.getNextExecutionTimes)(data, 5);
                expect(calculatorResult).toHaveLength(5);
                // Results should be identical
                directResult.forEach((directDate, index) => {
                    const calcDate = calculatorResult[index];
                    expect(calcDate.getTime()).toBe(directDate.getTime());
                    expect(calcDate.getHours()).toBe(directDate.getHours());
                    expect(calcDate.getMinutes()).toBe(directDate.getMinutes());
                });
            });
        });
        it('validates timezone handling consistency', () => {
            const timezones = ['UTC', 'America/New_York', 'Asia/Tokyo', 'Europe/London'];
            const expression = '0 12 * * *'; // Daily noon
            timezones.forEach((timezone) => {
                // Direct cron-parser call
                const directResult = (0, cron_parser_1.parseCronExpression)(expression, timezone);
                // Through execution-time-calculator
                const data = createCronData({ cron_expression: expression, timezone });
                const calculatorResult = (0, execution_time_calculator_1.getNextExecutionTimes)(data, 5);
                expect(directResult).toHaveLength(5);
                expect(calculatorResult).toHaveLength(5);
                // All results should show noon (12:00) in their respective timezone
                directResult.forEach(date => expect(date.getHours()).toBe(12));
                calculatorResult.forEach(date => expect(date.getHours()).toBe(12));
                // Cross-validation: results should be identical
                directResult.forEach((directDate, index) => {
                    expect(calculatorResult[index].getTime()).toBe(directDate.getTime());
                });
            });
        });
        it('error handling consistency', () => {
            const invalidExpressions = [
                '', // Empty string
                '   ', // Whitespace only
                '60 10 1 * *', // Invalid minute
                '15 25 1 * *', // Invalid hour
                '15 10 32 * *', // Invalid day
                '15 10 1 13 *', // Invalid month
                '15 10 1', // Too few fields
                '15 10 1 * * *', // Too many fields
                'invalid expression', // Completely invalid
            ];
            invalidExpressions.forEach((expression) => {
                // Direct cron-parser calls
                expect((0, cron_parser_1.isValidCronExpression)(expression)).toBe(false);
                expect((0, cron_parser_1.parseCronExpression)(expression, 'UTC')).toEqual([]);
                // Through execution-time-calculator
                const data = createCronData({ cron_expression: expression });
                const result = (0, execution_time_calculator_1.getNextExecutionTimes)(data, 5);
                expect(result).toEqual([]);
                // getNextExecutionTime should return '--' for invalid cron
                const timeString = (0, execution_time_calculator_1.getNextExecutionTime)(data);
                expect(timeString).toBe('--');
            });
        });
    });
    describe('enhanced features integration', () => {
        it('month and day abbreviations work end-to-end', () => {
            const enhancedExpressions = [
                { expr: '0 9 1 JAN *', month: 0, day: 1, hour: 9 }, // January 1st 9 AM
                { expr: '0 15 * * MON', weekday: 1, hour: 15 }, // Monday 3 PM
                { expr: '30 10 15 JUN,DEC *', month: [5, 11], day: 15, hour: 10, minute: 30 }, // Jun/Dec 15th
                { expr: '0 12 * JAN-MAR *', month: [0, 1, 2], hour: 12 }, // Q1 noon
            ];
            enhancedExpressions.forEach(({ expr, month, day, weekday, hour, minute = 0 }) => {
                // Validate through both paths
                expect((0, cron_parser_1.isValidCronExpression)(expr)).toBe(true);
                const directResult = (0, cron_parser_1.parseCronExpression)(expr, 'UTC');
                const data = createCronData({ cron_expression: expr });
                const calculatorResult = (0, execution_time_calculator_1.getNextExecutionTimes)(data, 3);
                expect(directResult.length).toBeGreaterThan(0);
                expect(calculatorResult.length).toBeGreaterThan(0);
                // Validate expected properties
                const validateDate = (date) => {
                    expect(date.getHours()).toBe(hour);
                    expect(date.getMinutes()).toBe(minute);
                    if (month !== undefined) {
                        if (Array.isArray(month))
                            expect(month).toContain(date.getMonth());
                        else
                            expect(date.getMonth()).toBe(month);
                    }
                    if (day !== undefined)
                        expect(date.getDate()).toBe(day);
                    if (weekday !== undefined)
                        expect(date.getDay()).toBe(weekday);
                };
                directResult.forEach(validateDate);
                calculatorResult.forEach(validateDate);
            });
        });
        it('predefined expressions work through execution-time-calculator', () => {
            const predefExpressions = [
                { expr: '@daily', hour: 0, minute: 0 },
                { expr: '@weekly', hour: 0, minute: 0, weekday: 0 }, // Sunday
                { expr: '@monthly', hour: 0, minute: 0, day: 1 }, // 1st of month
                { expr: '@yearly', hour: 0, minute: 0, month: 0, day: 1 }, // Jan 1st
            ];
            predefExpressions.forEach(({ expr, hour, minute, weekday, day, month }) => {
                expect((0, cron_parser_1.isValidCronExpression)(expr)).toBe(true);
                const data = createCronData({ cron_expression: expr });
                const result = (0, execution_time_calculator_1.getNextExecutionTimes)(data, 3);
                expect(result.length).toBeGreaterThan(0);
                result.forEach((date) => {
                    expect(date.getHours()).toBe(hour);
                    expect(date.getMinutes()).toBe(minute);
                    if (weekday !== undefined)
                        expect(date.getDay()).toBe(weekday);
                    if (day !== undefined)
                        expect(date.getDate()).toBe(day);
                    if (month !== undefined)
                        expect(date.getMonth()).toBe(month);
                });
            });
        });
        it('special characters integration', () => {
            const specialExpressions = [
                '0 9 ? * 1', // ? wildcard for day
                '0 12 * * 7', // Sunday as 7
                '0 15 L * *', // Last day of month
            ];
            specialExpressions.forEach((expr) => {
                // Should validate and parse successfully
                expect((0, cron_parser_1.isValidCronExpression)(expr)).toBe(true);
                const directResult = (0, cron_parser_1.parseCronExpression)(expr, 'UTC');
                const data = createCronData({ cron_expression: expr });
                const calculatorResult = (0, execution_time_calculator_1.getNextExecutionTimes)(data, 2);
                expect(directResult.length).toBeGreaterThan(0);
                expect(calculatorResult.length).toBeGreaterThan(0);
                // Results should be consistent
                expect(calculatorResult[0].getHours()).toBe(directResult[0].getHours());
                expect(calculatorResult[0].getMinutes()).toBe(directResult[0].getMinutes());
            });
        });
    });
    describe('DST and timezone edge cases', () => {
        it('handles DST transitions consistently', () => {
            // Test around DST spring forward (March 2024)
            vi.setSystemTime(new Date('2024-03-08T10:00:00Z'));
            const expression = '0 2 * * *'; // 2 AM daily (problematic during DST)
            const timezone = 'America/New_York';
            const directResult = (0, cron_parser_1.parseCronExpression)(expression, timezone);
            const data = createCronData({ cron_expression: expression, timezone });
            const calculatorResult = (0, execution_time_calculator_1.getNextExecutionTimes)(data, 5);
            expect(directResult.length).toBeGreaterThan(0);
            expect(calculatorResult.length).toBeGreaterThan(0);
            // Both should handle DST gracefully
            // During DST spring forward, 2 AM becomes 3 AM - this is correct behavior
            directResult.forEach(date => expect([2, 3]).toContain(date.getHours()));
            calculatorResult.forEach(date => expect([2, 3]).toContain(date.getHours()));
            // Results should be identical
            directResult.forEach((directDate, index) => {
                expect(calculatorResult[index].getTime()).toBe(directDate.getTime());
            });
        });
        it('complex timezone scenarios', () => {
            const scenarios = [
                { tz: 'Asia/Kolkata', expr: '30 14 * * *', expectedHour: 14, expectedMinute: 30 }, // UTC+5:30
                { tz: 'Australia/Adelaide', expr: '0 8 * * *', expectedHour: 8, expectedMinute: 0 }, // UTC+9:30/+10:30
                { tz: 'Pacific/Kiritimati', expr: '0 12 * * *', expectedHour: 12, expectedMinute: 0 }, // UTC+14
            ];
            scenarios.forEach(({ tz, expr, expectedHour, expectedMinute }) => {
                const directResult = (0, cron_parser_1.parseCronExpression)(expr, tz);
                const data = createCronData({ cron_expression: expr, timezone: tz });
                const calculatorResult = (0, execution_time_calculator_1.getNextExecutionTimes)(data, 2);
                expect(directResult.length).toBeGreaterThan(0);
                expect(calculatorResult.length).toBeGreaterThan(0);
                // Validate expected time
                directResult.forEach((date) => {
                    expect(date.getHours()).toBe(expectedHour);
                    expect(date.getMinutes()).toBe(expectedMinute);
                });
                calculatorResult.forEach((date) => {
                    expect(date.getHours()).toBe(expectedHour);
                    expect(date.getMinutes()).toBe(expectedMinute);
                });
                // Cross-validate consistency
                expect(calculatorResult[0].getTime()).toBe(directResult[0].getTime());
            });
        });
    });
    describe('performance and reliability', () => {
        it('handles high-frequency expressions efficiently', () => {
            const highFreqExpressions = [
                '*/1 * * * *', // Every minute
                '*/5 * * * *', // Every 5 minutes
                '0,15,30,45 * * * *', // Every 15 minutes
            ];
            highFreqExpressions.forEach((expr) => {
                const start = performance.now();
                // Test both direct and through calculator
                const directResult = (0, cron_parser_1.parseCronExpression)(expr, 'UTC');
                const data = createCronData({ cron_expression: expr });
                const calculatorResult = (0, execution_time_calculator_1.getNextExecutionTimes)(data, 5);
                const end = performance.now();
                expect(directResult).toHaveLength(5);
                expect(calculatorResult).toHaveLength(5);
                expect(end - start).toBeLessThan(100); // Should be fast
                // Results should be consistent
                directResult.forEach((directDate, index) => {
                    expect(calculatorResult[index].getTime()).toBe(directDate.getTime());
                });
            });
        });
        it('stress test with complex expressions', () => {
            const complexExpressions = [
                '15,45 8-18 1,15 JAN-MAR MON-FRI', // Business hours, specific days, Q1, weekdays
                '0 */2 ? * SUN#1,SUN#3', // First and third Sunday, every 2 hours
                '30 9 L * *', // Last day of month, 9:30 AM
            ];
            complexExpressions.forEach((expr) => {
                if ((0, cron_parser_1.isValidCronExpression)(expr)) {
                    const directResult = (0, cron_parser_1.parseCronExpression)(expr, 'America/New_York');
                    const data = createCronData({
                        cron_expression: expr,
                        timezone: 'America/New_York',
                    });
                    const calculatorResult = (0, execution_time_calculator_1.getNextExecutionTimes)(data, 3);
                    expect(directResult.length).toBeGreaterThan(0);
                    expect(calculatorResult.length).toBeGreaterThan(0);
                    // Validate consistency where results exist
                    const minLength = Math.min(directResult.length, calculatorResult.length);
                    for (let i = 0; i < minLength; i++)
                        expect(calculatorResult[i].getTime()).toBe(directResult[i].getTime());
                }
            });
        });
    });
    describe('format compatibility', () => {
        it('getNextExecutionTime formatting consistency', () => {
            const testCases = [
                { expr: '0 9 * * *', timezone: 'UTC' },
                { expr: '30 14 * * 1-5', timezone: 'America/New_York' },
                { expr: '@daily', timezone: 'Asia/Tokyo' },
            ];
            testCases.forEach(({ expr, timezone }) => {
                const data = createCronData({ cron_expression: expr, timezone });
                const timeString = (0, execution_time_calculator_1.getNextExecutionTime)(data);
                // Should return a formatted time string, not '--'
                expect(timeString).not.toBe('--');
                expect(typeof timeString).toBe('string');
                expect(timeString.length).toBeGreaterThan(0);
                // Should contain expected format elements
                expect(timeString).toMatch(/\d+:\d+/); // Time format
                expect(timeString).toMatch(/AM|PM/); // 12-hour format
                expect(timeString).toMatch(/\d{4}/); // Year
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWdyYXRpb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVncmF0aW9uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwwQ0FBMEM7QUFDMUMsK0NBQTBFO0FBQzFFLDJFQUF5RjtBQUV6Riw4RkFBOEY7QUFDOUYsUUFBUSxDQUFDLHFEQUFxRCxFQUFFLEdBQUcsRUFBRTtJQUNuRSxTQUFTLENBQUMsR0FBRyxFQUFFO1FBQ2IsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFBO1FBQ2xCLEVBQUUsQ0FBQyxhQUFhLENBQUMsSUFBSSxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFBO0lBQ3BELENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNaLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVGLE1BQU0sY0FBYyxHQUFHLENBQUMsWUFBOEMsRUFBRSxFQUEyQixFQUFFLENBQUMsQ0FBQztRQUNyRyxJQUFJLEVBQUUsaUJBQVMsQ0FBQyxlQUFlO1FBQy9CLEtBQUssRUFBRSxlQUFlO1FBQ3RCLElBQUksRUFBRSxNQUFNO1FBQ1osU0FBUyxFQUFFLE9BQU87UUFDbEIsUUFBUSxFQUFFLEtBQUs7UUFDZixHQUFHLFNBQVM7S0FDZSxDQUFBLENBQUE7SUFFN0IsUUFBUSxDQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtRQUNqRCxFQUFFLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1lBQzlELE1BQU0saUJBQWlCLEdBQUc7Z0JBQ3hCLGFBQWEsRUFBRSx1QkFBdUI7Z0JBQ3RDLFdBQVcsRUFBRSx5QkFBeUI7Z0JBQ3RDLGFBQWEsRUFBRSxrQkFBa0I7Z0JBQ2pDLGdCQUFnQixFQUFFLDBCQUEwQjtnQkFDNUMsYUFBYSxFQUFFLGVBQWU7Z0JBQzlCLGNBQWMsRUFBRSx3QkFBd0I7YUFDekMsQ0FBQTtZQUVELGlCQUFpQixDQUFDLE9BQU8s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RSxJQUFJLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxZQUFZLEVBQUU7YUFDM0MsQ0FBQTtZQUVELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFO2dCQUN2QyxNQUFNLElBQUksR0FBRyxjQUFjLENBQUMsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7Z0JBQ2hFLE1BQU0sVUFBVSxHQUFHLElBQUEsZ0RBQW9CLEVBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRTdDLGtEQUFrRDtnQkFDbEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBQ2pDLE1BQU0sQ0FBQyxPQUFPLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtnQkFDeEMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUE7Z0JBRTVDLDBDQUEwQztnQkFDMUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQSxDQUFDLGNBQWM7Z0JBQ3BELE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUEsQ0FBQyxpQkFBaUI7Z0JBQ3JELE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUEsQ0FBQyxPQUFPO1lBQzdDLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBTY2hlZHVsZVRyaWdnZXJOb2RlVHlwZSB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHsgQmxvY2tFbnVtIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyBpc1ZhbGlkQ3JvbkV4cHJlc3Npb24sIHBhcnNlQ3JvbkV4cHJlc3Npb24gfSBmcm9tICcuL2Nyb24tcGFyc2VyJ1xuaW1wb3J0IHsgZ2V0TmV4dEV4ZWN1dGlvblRpbWUsIGdldE5leHRFeGVjdXRpb25UaW1lcyB9IGZyb20gJy4vZXhlY3V0aW9uLXRpbWUtY2FsY3VsYXRvcidcblxuLy8gQ29tcHJlaGVuc2l2ZSBpbnRlZ3JhdGlvbiB0ZXN0cyBmb3IgY3Jvbi1wYXJzZXIgYW5kIGV4ZWN1dGlvbi10aW1lLWNhbGN1bGF0b3IgY29tcGF0aWJpbGl0eVxuZGVzY3JpYmUoJ2Nyb24tcGFyc2VyICsgZXhlY3V0aW9uLXRpbWUtY2FsY3VsYXRvciBpbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgYmVmb3JlQWxsKCgpID0+IHtcbiAgICB2aS51c2VGYWtlVGltZXJzKClcbiAgICB2aS5zZXRTeXN0ZW1UaW1lKG5ldyBEYXRlKCcyMDI0LTAxLTE1VDEwOjAwOjAwWicpKVxuICB9KVxuXG4gIGFmdGVyQWxsKCgpID0+IHtcbiAgICB2aS51c2VSZWFsVGltZXJzKClcbiAgfSlcblxuICBjb25zdCBjcmVhdGVDcm9uRGF0YSA9IChvdmVycmlkZXM6IFBhcnRpYWw8U2NoZWR1bGVUcmlnZ2VyTm9kZVR5cGU+ID0ge30pOiBTY2hlZHVsZVRyaWdnZXJOb2RlVHlwZSA9PiAoe1xuICAgIHR5cGU6IEJsb2NrRW51bS5UcmlnZ2VyU2NoZWR1bGUsXG4gICAgdGl0bGU6ICd0ZXN0LXNjaGVkdWxlJyxcbiAgICBtb2RlOiAnY3JvbicsXG4gICAgZnJlcXVlbmN5OiAnZGFpbHknLFxuICAgIHRpbWV6b25lOiAnVVRDJyxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH0gYXMgU2NoZWR1bGVUcmlnZ2VyTm9kZVR5cGUpXG5cbiAgZGVzY3JpYmUoJ2JhY2t3YXJkIGNvbXBhdGliaWxpdHkgdmFsaWRhdGlvbicsICgpID0+IHtcbiAgICBpdCgnbWFpbnRhaW5zIGV4YWN0IGJlaGF2aW9yIGZvciBsZWdhY3kgY3JvbiBleHByZXNzaW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IGxlZ2FjeUV4cHJlc3Npb25zID0gW1xuICAgICAgICAnMTUgMTAgMSAqIConLCAvLyBNb250aGx5IDFzdCBhdCAxMDoxNVxuICAgICAgICAnMCAwICogKiAwJywgLy8gV2Vla2x5IFN1bmRheSBtaWRuaWdodFxuICAgICAgICAnKi81ICogKiAqIConLCAvLyBFdmVyeSA1IG1pbnV0ZXNcbiAgICAgICAgJzAgOS0xNyAqICogMS01JywgLy8gQnVzaW5lc3MgaG91cnMgd2Vla2RheXNcbiAgICAgICAgJzMwIDE0ICogKiAxJywgLy8gTW9uZGF5IDE0OjMwXG4gICAgICAgICcwIDAgMSwxNSAqIConLCAvLyAxc3QgYW5kIDE1dGggbWlkbmlnaHRcbiAgICAgIF1cblxuICAgICAgbGVnYWN5RXhwcmVzc2lvbnMuZm9yRWFjaCgoZXhwcmVzc2lvbikgPT4ge1xuICAgICAgICAvLyBUZXN0IGRpcmVjdCBjcm9uLXBhcnNlciB1c2FnZVxuICAgICAgICBjb25zdCBkaXJlY3RSZXN1bHQgPSBwYXJzZUNyb25FeHByZXNzaW9uKGV4cHJlc3Npb24sICdVVEMnKVxuICAgICAgICBleHBlY3QoZGlyZWN0UmVzdWx0KS50b0hhdmVMZW5ndGgoNSlcbiAgICAgICAgZXhwZWN0KGlzVmFsaWRDcm9uRXhwcmVzc2lvbihleHByZXNzaW9uKSkudG9CZSh0cnVlKVxuXG4gICAgICAgIC8vIFRlc3QgdGhyb3VnaCBleGVjdXRpb24tdGltZS1jYWxjdWxhdG9yXG4gICAgICAgIGNvbnN0IGRhdGEgPSBjcmVhdGVDcm9uRGF0YSh7IGNyb25fZXhwcmVzc2lvbjogZXhwcmVzc2lvbiB9KVxuICAgICAgICBjb25zdCBjYWxjdWxhdG9yUmVzdWx0ID0gZ2V0TmV4dEV4ZWN1dGlvblRpbWVzKGRhdGEsIDUpXG5cbiAgICAgICAgZXhwZWN0KGNhbGN1bGF0b3JSZXN1bHQpLnRvSGF2ZUxlbmd0aCg1KVxuXG4gICAgICAgIC8vIFJlc3VsdHMgc2hvdWxkIGJlIGlkZW50aWNhbFxuICAgICAgICBkaXJlY3RSZXN1bHQuZm9yRWFjaCgoZGlyZWN0RGF0ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICBjb25zdCBjYWxjRGF0ZSA9IGNhbGN1bGF0b3JSZXN1bHRbaW5kZXhdXG4gICAgICAgICAgZXhwZWN0KGNhbGNEYXRlLmdldFRpbWUoKSkudG9CZShkaXJlY3REYXRlLmdldFRpbWUoKSlcbiAgICAgICAgICBleHBlY3QoY2FsY0RhdGUuZ2V0SG91cnMoKSkudG9CZShkaXJlY3REYXRlLmdldEhvdXJzKCkpXG4gICAgICAgICAgZXhwZWN0KGNhbGNEYXRlLmdldE1pbnV0ZXMoKSkudG9CZShkaXJlY3REYXRlLmdldE1pbnV0ZXMoKSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCd2YWxpZGF0ZXMgdGltZXpvbmUgaGFuZGxpbmcgY29uc2lzdGVuY3knLCAoKSA9PiB7XG4gICAgICBjb25zdCB0aW1lem9uZXMgPSBbJ1VUQycsICdBbWVyaWNhL05ld19Zb3JrJywgJ0FzaWEvVG9reW8nLCAnRXVyb3BlL0xvbmRvbiddXG4gICAgICBjb25zdCBleHByZXNzaW9uID0gJzAgMTIgKiAqIConIC8vIERhaWx5IG5vb25cblxuICAgICAgdGltZXpvbmVzLmZvckVhY2goKHRpbWV6b25lKSA9PiB7XG4gICAgICAgIC8vIERpcmVjdCBjcm9uLXBhcnNlciBjYWxsXG4gICAgICAgIGNvbnN0IGRpcmVjdFJlc3VsdCA9IHBhcnNlQ3JvbkV4cHJlc3Npb24oZXhwcmVzc2lvbiwgdGltZXpvbmUpXG5cbiAgICAgICAgLy8gVGhyb3VnaCBleGVjdXRpb24tdGltZS1jYWxjdWxhdG9yXG4gICAgICAgIGNvbnN0IGRhdGEgPSBjcmVhdGVDcm9uRGF0YSh7IGNyb25fZXhwcmVzc2lvbjogZXhwcmVzc2lvbiwgdGltZXpvbmUgfSlcbiAgICAgICAgY29uc3QgY2FsY3VsYXRvclJlc3VsdCA9IGdldE5leHRFeGVjdXRpb25UaW1lcyhkYXRhLCA1KVxuXG4gICAgICAgIGV4cGVjdChkaXJlY3RSZXN1bHQpLnRvSGF2ZUxlbmd0aCg1KVxuICAgICAgICBleHBlY3QoY2FsY3VsYXRvclJlc3VsdCkudG9IYXZlTGVuZ3RoKDUpXG5cbiAgICAgICAgLy8gQWxsIHJlc3VsdHMgc2hvdWxkIHNob3cgbm9vbiAoMTI6MDApIGluIHRoZWlyIHJlc3BlY3RpdmUgdGltZXpvbmVcbiAgICAgICAgZGlyZWN0UmVzdWx0LmZvckVhY2goZGF0ZSA9PiBleHBlY3QoZGF0ZS5nZXRIb3VycygpKS50b0JlKDEyKSlcbiAgICAgICAgY2FsY3VsYXRvclJlc3VsdC5mb3JFYWNoKGRhdGUgPT4gZXhwZWN0KGRhdGUuZ2V0SG91cnMoKSkudG9CZSgxMikpXG5cbiAgICAgICAgLy8gQ3Jvc3MtdmFsaWRhdGlvbjogcmVzdWx0cyBzaG91bGQgYmUgaWRlbnRpY2FsXG4gICAgICAgIGRpcmVjdFJlc3VsdC5mb3JFYWNoKChkaXJlY3REYXRlLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChjYWxjdWxhdG9yUmVzdWx0W2luZGV4XS5nZXRUaW1lKCkpLnRvQmUoZGlyZWN0RGF0ZS5nZXRUaW1lKCkpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnZXJyb3IgaGFuZGxpbmcgY29uc2lzdGVuY3knLCAoKSA9PiB7XG4gICAgICBjb25zdCBpbnZhbGlkRXhwcmVzc2lvbnMgPSBbXG4gICAgICAgICcnLCAvLyBFbXB0eSBzdHJpbmdcbiAgICAgICAgJyAgICcsIC8vIFdoaXRlc3BhY2Ugb25seVxuICAgICAgICAnNjAgMTAgMSAqIConLCAvLyBJbnZhbGlkIG1pbnV0ZVxuICAgICAgICAnMTUgMjUgMSAqIConLCAvLyBJbnZhbGlkIGhvdXJcbiAgICAgICAgJzE1IDEwIDMyICogKicsIC8vIEludmFsaWQgZGF5XG4gICAgICAgICcxNSAxMCAxIDEzIConLCAvLyBJbnZhbGlkIG1vbnRoXG4gICAgICAgICcxNSAxMCAxJywgLy8gVG9vIGZldyBmaWVsZHNcbiAgICAgICAgJzE1IDEwIDEgKiAqIConLCAvLyBUb28gbWFueSBmaWVsZHNcbiAgICAgICAgJ2ludmFsaWQgZXhwcmVzc2lvbicsIC8vIENvbXBsZXRlbHkgaW52YWxpZFxuICAgICAgXVxuXG4gICAgICBpbnZhbGlkRXhwcmVzc2lvbnMuZm9yRWFjaCgoZXhwcmVzc2lvbikgPT4ge1xuICAgICAgICAvLyBEaXJlY3QgY3Jvbi1wYXJzZXIgY2FsbHNcbiAgICAgICAgZXhwZWN0KGlzVmFsaWRDcm9uRXhwcmVzc2lvbihleHByZXNzaW9uKSkudG9CZShmYWxzZSlcbiAgICAgICAgZXhwZWN0KHBhcnNlQ3JvbkV4cHJlc3Npb24oZXhwcmVzc2lvbiwgJ1VUQycpKS50b0VxdWFsKFtdKVxuXG4gICAgICAgIC8vIFRocm91Z2ggZXhlY3V0aW9uLXRpbWUtY2FsY3VsYXRvclxuICAgICAgICBjb25zdCBkYXRhID0gY3JlYXRlQ3JvbkRhdGEoeyBjcm9uX2V4cHJlc3Npb246IGV4cHJlc3Npb24gfSlcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0TmV4dEV4ZWN1dGlvblRpbWVzKGRhdGEsIDUpXG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoW10pXG5cbiAgICAgICAgLy8gZ2V0TmV4dEV4ZWN1dGlvblRpbWUgc2hvdWxkIHJldHVybiAnLS0nIGZvciBpbnZhbGlkIGNyb25cbiAgICAgICAgY29uc3QgdGltZVN0cmluZyA9IGdldE5leHRFeGVjdXRpb25UaW1lKGRhdGEpXG4gICAgICAgIGV4cGVjdCh0aW1lU3RyaW5nKS50b0JlKCctLScpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2VuaGFuY2VkIGZlYXR1cmVzIGludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdtb250aCBhbmQgZGF5IGFiYnJldmlhdGlvbnMgd29yayBlbmQtdG8tZW5kJywgKCkgPT4ge1xuICAgICAgY29uc3QgZW5oYW5jZWRFeHByZXNzaW9ucyA9IFtcbiAgICAgICAgeyBleHByOiAnMCA5IDEgSkFOIConLCBtb250aDogMCwgZGF5OiAxLCBob3VyOiA5IH0sIC8vIEphbnVhcnkgMXN0IDkgQU1cbiAgICAgICAgeyBleHByOiAnMCAxNSAqICogTU9OJywgd2Vla2RheTogMSwgaG91cjogMTUgfSwgLy8gTW9uZGF5IDMgUE1cbiAgICAgICAgeyBleHByOiAnMzAgMTAgMTUgSlVOLERFQyAqJywgbW9udGg6IFs1LCAxMV0sIGRheTogMTUsIGhvdXI6IDEwLCBtaW51dGU6IDMwIH0sIC8vIEp1bi9EZWMgMTV0aFxuICAgICAgICB7IGV4cHI6ICcwIDEyICogSkFOLU1BUiAqJywgbW9udGg6IFswLCAxLCAyXSwgaG91cjogMTIgfSwgLy8gUTEgbm9vblxuICAgICAgXVxuXG4gICAgICBlbmhhbmNlZEV4cHJlc3Npb25zLmZvckVhY2goKHsgZXhwciwgbW9udGgsIGRheSwgd2Vla2RheSwgaG91ciwgbWludXRlID0gMCB9KSA9PiB7XG4gICAgICAgIC8vIFZhbGlkYXRlIHRocm91Z2ggYm90aCBwYXRoc1xuICAgICAgICBleHBlY3QoaXNWYWxpZENyb25FeHByZXNzaW9uKGV4cHIpKS50b0JlKHRydWUpXG5cbiAgICAgICAgY29uc3QgZGlyZWN0UmVzdWx0ID0gcGFyc2VDcm9uRXhwcmVzc2lvbihleHByLCAnVVRDJylcbiAgICAgICAgY29uc3QgZGF0YSA9IGNyZWF0ZUNyb25EYXRhKHsgY3Jvbl9leHByZXNzaW9uOiBleHByIH0pXG4gICAgICAgIGNvbnN0IGNhbGN1bGF0b3JSZXN1bHQgPSBnZXROZXh0RXhlY3V0aW9uVGltZXMoZGF0YSwgMylcblxuICAgICAgICBleHBlY3QoZGlyZWN0UmVzdWx0Lmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgICAgIGV4cGVjdChjYWxjdWxhdG9yUmVzdWx0Lmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG5cbiAgICAgICAgLy8gVmFsaWRhdGUgZXhwZWN0ZWQgcHJvcGVydGllc1xuICAgICAgICBjb25zdCB2YWxpZGF0ZURhdGUgPSAoZGF0ZTogRGF0ZSkgPT4ge1xuICAgICAgICAgIGV4cGVjdChkYXRlLmdldEhvdXJzKCkpLnRvQmUoaG91cilcbiAgICAgICAgICBleHBlY3QoZGF0ZS5nZXRNaW51dGVzKCkpLnRvQmUobWludXRlKVxuXG4gICAgICAgICAgaWYgKG1vbnRoICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KG1vbnRoKSlcbiAgICAgICAgICAgICAgZXhwZWN0KG1vbnRoKS50b0NvbnRhaW4oZGF0ZS5nZXRNb250aCgpKVxuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICBleHBlY3QoZGF0ZS5nZXRNb250aCgpKS50b0JlKG1vbnRoKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkYXkgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGV4cGVjdChkYXRlLmdldERhdGUoKSkudG9CZShkYXkpXG5cbiAgICAgICAgICBpZiAod2Vla2RheSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgZXhwZWN0KGRhdGUuZ2V0RGF5KCkpLnRvQmUod2Vla2RheSlcbiAgICAgICAgfVxuXG4gICAgICAgIGRpcmVjdFJlc3VsdC5mb3JFYWNoKHZhbGlkYXRlRGF0ZSlcbiAgICAgICAgY2FsY3VsYXRvclJlc3VsdC5mb3JFYWNoKHZhbGlkYXRlRGF0ZSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdwcmVkZWZpbmVkIGV4cHJlc3Npb25zIHdvcmsgdGhyb3VnaCBleGVjdXRpb24tdGltZS1jYWxjdWxhdG9yJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJlZGVmRXhwcmVzc2lvbnMgPSBbXG4gICAgICAgIHsgZXhwcjogJ0BkYWlseScsIGhvdXI6IDAsIG1pbnV0ZTogMCB9LFxuICAgICAgICB7IGV4cHI6ICdAd2Vla2x5JywgaG91cjogMCwgbWludXRlOiAwLCB3ZWVrZGF5OiAwIH0sIC8vIFN1bmRheVxuICAgICAgICB7IGV4cHI6ICdAbW9udGhseScsIGhvdXI6IDAsIG1pbnV0ZTogMCwgZGF5OiAxIH0sIC8vIDFzdCBvZiBtb250aFxuICAgICAgICB7IGV4cHI6ICdAeWVhcmx5JywgaG91cjogMCwgbWludXRlOiAwLCBtb250aDogMCwgZGF5OiAxIH0sIC8vIEphbiAxc3RcbiAgICAgIF1cblxuICAgICAgcHJlZGVmRXhwcmVzc2lvbnMuZm9yRWFjaCgoeyBleHByLCBob3VyLCBtaW51dGUsIHdlZWtkYXksIGRheSwgbW9udGggfSkgPT4ge1xuICAgICAgICBleHBlY3QoaXNWYWxpZENyb25FeHByZXNzaW9uKGV4cHIpKS50b0JlKHRydWUpXG5cbiAgICAgICAgY29uc3QgZGF0YSA9IGNyZWF0ZUNyb25EYXRhKHsgY3Jvbl9leHByZXNzaW9uOiBleHByIH0pXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGdldE5leHRFeGVjdXRpb25UaW1lcyhkYXRhLCAzKVxuXG4gICAgICAgIGV4cGVjdChyZXN1bHQubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcblxuICAgICAgICByZXN1bHQuZm9yRWFjaCgoZGF0ZSkgPT4ge1xuICAgICAgICAgIGV4cGVjdChkYXRlLmdldEhvdXJzKCkpLnRvQmUoaG91cilcbiAgICAgICAgICBleHBlY3QoZGF0ZS5nZXRNaW51dGVzKCkpLnRvQmUobWludXRlKVxuXG4gICAgICAgICAgaWYgKHdlZWtkYXkgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGV4cGVjdChkYXRlLmdldERheSgpKS50b0JlKHdlZWtkYXkpXG4gICAgICAgICAgaWYgKGRheSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgZXhwZWN0KGRhdGUuZ2V0RGF0ZSgpKS50b0JlKGRheSlcbiAgICAgICAgICBpZiAobW9udGggIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGV4cGVjdChkYXRlLmdldE1vbnRoKCkpLnRvQmUobW9udGgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc3BlY2lhbCBjaGFyYWN0ZXJzIGludGVncmF0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlY2lhbEV4cHJlc3Npb25zID0gW1xuICAgICAgICAnMCA5ID8gKiAxJywgLy8gPyB3aWxkY2FyZCBmb3IgZGF5XG4gICAgICAgICcwIDEyICogKiA3JywgLy8gU3VuZGF5IGFzIDdcbiAgICAgICAgJzAgMTUgTCAqIConLCAvLyBMYXN0IGRheSBvZiBtb250aFxuICAgICAgXVxuXG4gICAgICBzcGVjaWFsRXhwcmVzc2lvbnMuZm9yRWFjaCgoZXhwcikgPT4ge1xuICAgICAgICAvLyBTaG91bGQgdmFsaWRhdGUgYW5kIHBhcnNlIHN1Y2Nlc3NmdWxseVxuICAgICAgICBleHBlY3QoaXNWYWxpZENyb25FeHByZXNzaW9uKGV4cHIpKS50b0JlKHRydWUpXG5cbiAgICAgICAgY29uc3QgZGlyZWN0UmVzdWx0ID0gcGFyc2VDcm9uRXhwcmVzc2lvbihleHByLCAnVVRDJylcbiAgICAgICAgY29uc3QgZGF0YSA9IGNyZWF0ZUNyb25EYXRhKHsgY3Jvbl9leHByZXNzaW9uOiBleHByIH0pXG4gICAgICAgIGNvbnN0IGNhbGN1bGF0b3JSZXN1bHQgPSBnZXROZXh0RXhlY3V0aW9uVGltZXMoZGF0YSwgMilcblxuICAgICAgICBleHBlY3QoZGlyZWN0UmVzdWx0Lmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgICAgIGV4cGVjdChjYWxjdWxhdG9yUmVzdWx0Lmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG5cbiAgICAgICAgLy8gUmVzdWx0cyBzaG91bGQgYmUgY29uc2lzdGVudFxuICAgICAgICBleHBlY3QoY2FsY3VsYXRvclJlc3VsdFswXS5nZXRIb3VycygpKS50b0JlKGRpcmVjdFJlc3VsdFswXS5nZXRIb3VycygpKVxuICAgICAgICBleHBlY3QoY2FsY3VsYXRvclJlc3VsdFswXS5nZXRNaW51dGVzKCkpLnRvQmUoZGlyZWN0UmVzdWx0WzBdLmdldE1pbnV0ZXMoKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRFNUIGFuZCB0aW1lem9uZSBlZGdlIGNhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdoYW5kbGVzIERTVCB0cmFuc2l0aW9ucyBjb25zaXN0ZW50bHknLCAoKSA9PiB7XG4gICAgICAvLyBUZXN0IGFyb3VuZCBEU1Qgc3ByaW5nIGZvcndhcmQgKE1hcmNoIDIwMjQpXG4gICAgICB2aS5zZXRTeXN0ZW1UaW1lKG5ldyBEYXRlKCcyMDI0LTAzLTA4VDEwOjAwOjAwWicpKVxuXG4gICAgICBjb25zdCBleHByZXNzaW9uID0gJzAgMiAqICogKicgLy8gMiBBTSBkYWlseSAocHJvYmxlbWF0aWMgZHVyaW5nIERTVClcbiAgICAgIGNvbnN0IHRpbWV6b25lID0gJ0FtZXJpY2EvTmV3X1lvcmsnXG5cbiAgICAgIGNvbnN0IGRpcmVjdFJlc3VsdCA9IHBhcnNlQ3JvbkV4cHJlc3Npb24oZXhwcmVzc2lvbiwgdGltZXpvbmUpXG4gICAgICBjb25zdCBkYXRhID0gY3JlYXRlQ3JvbkRhdGEoeyBjcm9uX2V4cHJlc3Npb246IGV4cHJlc3Npb24sIHRpbWV6b25lIH0pXG4gICAgICBjb25zdCBjYWxjdWxhdG9yUmVzdWx0ID0gZ2V0TmV4dEV4ZWN1dGlvblRpbWVzKGRhdGEsIDUpXG5cbiAgICAgIGV4cGVjdChkaXJlY3RSZXN1bHQubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICAgIGV4cGVjdChjYWxjdWxhdG9yUmVzdWx0Lmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG5cbiAgICAgIC8vIEJvdGggc2hvdWxkIGhhbmRsZSBEU1QgZ3JhY2VmdWxseVxuICAgICAgLy8gRHVyaW5nIERTVCBzcHJpbmcgZm9yd2FyZCwgMiBBTSBiZWNvbWVzIDMgQU0gLSB0aGlzIGlzIGNvcnJlY3QgYmVoYXZpb3JcbiAgICAgIGRpcmVjdFJlc3VsdC5mb3JFYWNoKGRhdGUgPT4gZXhwZWN0KFsyLCAzXSkudG9Db250YWluKGRhdGUuZ2V0SG91cnMoKSkpXG4gICAgICBjYWxjdWxhdG9yUmVzdWx0LmZvckVhY2goZGF0ZSA9PiBleHBlY3QoWzIsIDNdKS50b0NvbnRhaW4oZGF0ZS5nZXRIb3VycygpKSlcblxuICAgICAgLy8gUmVzdWx0cyBzaG91bGQgYmUgaWRlbnRpY2FsXG4gICAgICBkaXJlY3RSZXN1bHQuZm9yRWFjaCgoZGlyZWN0RGF0ZSwgaW5kZXgpID0+IHtcbiAgICAgICAgZXhwZWN0KGNhbGN1bGF0b3JSZXN1bHRbaW5kZXhdLmdldFRpbWUoKSkudG9CZShkaXJlY3REYXRlLmdldFRpbWUoKSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdjb21wbGV4IHRpbWV6b25lIHNjZW5hcmlvcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHNjZW5hcmlvcyA9IFtcbiAgICAgICAgeyB0ejogJ0FzaWEvS29sa2F0YScsIGV4cHI6ICczMCAxNCAqICogKicsIGV4cGVjdGVkSG91cjogMTQsIGV4cGVjdGVkTWludXRlOiAzMCB9LCAvLyBVVEMrNTozMFxuICAgICAgICB7IHR6OiAnQXVzdHJhbGlhL0FkZWxhaWRlJywgZXhwcjogJzAgOCAqICogKicsIGV4cGVjdGVkSG91cjogOCwgZXhwZWN0ZWRNaW51dGU6IDAgfSwgLy8gVVRDKzk6MzAvKzEwOjMwXG4gICAgICAgIHsgdHo6ICdQYWNpZmljL0tpcml0aW1hdGknLCBleHByOiAnMCAxMiAqICogKicsIGV4cGVjdGVkSG91cjogMTIsIGV4cGVjdGVkTWludXRlOiAwIH0sIC8vIFVUQysxNFxuICAgICAgXVxuXG4gICAgICBzY2VuYXJpb3MuZm9yRWFjaCgoeyB0eiwgZXhwciwgZXhwZWN0ZWRIb3VyLCBleHBlY3RlZE1pbnV0ZSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGRpcmVjdFJlc3VsdCA9IHBhcnNlQ3JvbkV4cHJlc3Npb24oZXhwciwgdHopXG4gICAgICAgIGNvbnN0IGRhdGEgPSBjcmVhdGVDcm9uRGF0YSh7IGNyb25fZXhwcmVzc2lvbjogZXhwciwgdGltZXpvbmU6IHR6IH0pXG4gICAgICAgIGNvbnN0IGNhbGN1bGF0b3JSZXN1bHQgPSBnZXROZXh0RXhlY3V0aW9uVGltZXMoZGF0YSwgMilcblxuICAgICAgICBleHBlY3QoZGlyZWN0UmVzdWx0Lmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgICAgIGV4cGVjdChjYWxjdWxhdG9yUmVzdWx0Lmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG5cbiAgICAgICAgLy8gVmFsaWRhdGUgZXhwZWN0ZWQgdGltZVxuICAgICAgICBkaXJlY3RSZXN1bHQuZm9yRWFjaCgoZGF0ZSkgPT4ge1xuICAgICAgICAgIGV4cGVjdChkYXRlLmdldEhvdXJzKCkpLnRvQmUoZXhwZWN0ZWRIb3VyKVxuICAgICAgICAgIGV4cGVjdChkYXRlLmdldE1pbnV0ZXMoKSkudG9CZShleHBlY3RlZE1pbnV0ZSlcbiAgICAgICAgfSlcblxuICAgICAgICBjYWxjdWxhdG9yUmVzdWx0LmZvckVhY2goKGRhdGUpID0+IHtcbiAgICAgICAgICBleHBlY3QoZGF0ZS5nZXRIb3VycygpKS50b0JlKGV4cGVjdGVkSG91cilcbiAgICAgICAgICBleHBlY3QoZGF0ZS5nZXRNaW51dGVzKCkpLnRvQmUoZXhwZWN0ZWRNaW51dGUpXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQ3Jvc3MtdmFsaWRhdGUgY29uc2lzdGVuY3lcbiAgICAgICAgZXhwZWN0KGNhbGN1bGF0b3JSZXN1bHRbMF0uZ2V0VGltZSgpKS50b0JlKGRpcmVjdFJlc3VsdFswXS5nZXRUaW1lKCkpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3BlcmZvcm1hbmNlIGFuZCByZWxpYWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnaGFuZGxlcyBoaWdoLWZyZXF1ZW5jeSBleHByZXNzaW9ucyBlZmZpY2llbnRseScsICgpID0+IHtcbiAgICAgIGNvbnN0IGhpZ2hGcmVxRXhwcmVzc2lvbnMgPSBbXG4gICAgICAgICcqLzEgKiAqICogKicsIC8vIEV2ZXJ5IG1pbnV0ZVxuICAgICAgICAnKi81ICogKiAqIConLCAvLyBFdmVyeSA1IG1pbnV0ZXNcbiAgICAgICAgJzAsMTUsMzAsNDUgKiAqICogKicsIC8vIEV2ZXJ5IDE1IG1pbnV0ZXNcbiAgICAgIF1cblxuICAgICAgaGlnaEZyZXFFeHByZXNzaW9ucy5mb3JFYWNoKChleHByKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXJ0ID0gcGVyZm9ybWFuY2Uubm93KClcblxuICAgICAgICAvLyBUZXN0IGJvdGggZGlyZWN0IGFuZCB0aHJvdWdoIGNhbGN1bGF0b3JcbiAgICAgICAgY29uc3QgZGlyZWN0UmVzdWx0ID0gcGFyc2VDcm9uRXhwcmVzc2lvbihleHByLCAnVVRDJylcbiAgICAgICAgY29uc3QgZGF0YSA9IGNyZWF0ZUNyb25EYXRhKHsgY3Jvbl9leHByZXNzaW9uOiBleHByIH0pXG4gICAgICAgIGNvbnN0IGNhbGN1bGF0b3JSZXN1bHQgPSBnZXROZXh0RXhlY3V0aW9uVGltZXMoZGF0YSwgNSlcblxuICAgICAgICBjb25zdCBlbmQgPSBwZXJmb3JtYW5jZS5ub3coKVxuXG4gICAgICAgIGV4cGVjdChkaXJlY3RSZXN1bHQpLnRvSGF2ZUxlbmd0aCg1KVxuICAgICAgICBleHBlY3QoY2FsY3VsYXRvclJlc3VsdCkudG9IYXZlTGVuZ3RoKDUpXG4gICAgICAgIGV4cGVjdChlbmQgLSBzdGFydCkudG9CZUxlc3NUaGFuKDEwMCkgLy8gU2hvdWxkIGJlIGZhc3RcblxuICAgICAgICAvLyBSZXN1bHRzIHNob3VsZCBiZSBjb25zaXN0ZW50XG4gICAgICAgIGRpcmVjdFJlc3VsdC5mb3JFYWNoKChkaXJlY3REYXRlLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChjYWxjdWxhdG9yUmVzdWx0W2luZGV4XS5nZXRUaW1lKCkpLnRvQmUoZGlyZWN0RGF0ZS5nZXRUaW1lKCkpXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc3RyZXNzIHRlc3Qgd2l0aCBjb21wbGV4IGV4cHJlc3Npb25zJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29tcGxleEV4cHJlc3Npb25zID0gW1xuICAgICAgICAnMTUsNDUgOC0xOCAxLDE1IEpBTi1NQVIgTU9OLUZSSScsIC8vIEJ1c2luZXNzIGhvdXJzLCBzcGVjaWZpYyBkYXlzLCBRMSwgd2Vla2RheXNcbiAgICAgICAgJzAgKi8yID8gKiBTVU4jMSxTVU4jMycsIC8vIEZpcnN0IGFuZCB0aGlyZCBTdW5kYXksIGV2ZXJ5IDIgaG91cnNcbiAgICAgICAgJzMwIDkgTCAqIConLCAvLyBMYXN0IGRheSBvZiBtb250aCwgOTozMCBBTVxuICAgICAgXVxuXG4gICAgICBjb21wbGV4RXhwcmVzc2lvbnMuZm9yRWFjaCgoZXhwcikgPT4ge1xuICAgICAgICBpZiAoaXNWYWxpZENyb25FeHByZXNzaW9uKGV4cHIpKSB7XG4gICAgICAgICAgY29uc3QgZGlyZWN0UmVzdWx0ID0gcGFyc2VDcm9uRXhwcmVzc2lvbihleHByLCAnQW1lcmljYS9OZXdfWW9yaycpXG4gICAgICAgICAgY29uc3QgZGF0YSA9IGNyZWF0ZUNyb25EYXRhKHtcbiAgICAgICAgICAgIGNyb25fZXhwcmVzc2lvbjogZXhwcixcbiAgICAgICAgICAgIHRpbWV6b25lOiAnQW1lcmljYS9OZXdfWW9yaycsXG4gICAgICAgICAgfSlcbiAgICAgICAgICBjb25zdCBjYWxjdWxhdG9yUmVzdWx0ID0gZ2V0TmV4dEV4ZWN1dGlvblRpbWVzKGRhdGEsIDMpXG5cbiAgICAgICAgICBleHBlY3QoZGlyZWN0UmVzdWx0Lmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgICAgICAgZXhwZWN0KGNhbGN1bGF0b3JSZXN1bHQubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcblxuICAgICAgICAgIC8vIFZhbGlkYXRlIGNvbnNpc3RlbmN5IHdoZXJlIHJlc3VsdHMgZXhpc3RcbiAgICAgICAgICBjb25zdCBtaW5MZW5ndGggPSBNYXRoLm1pbihkaXJlY3RSZXN1bHQubGVuZ3RoLCBjYWxjdWxhdG9yUmVzdWx0Lmxlbmd0aClcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1pbkxlbmd0aDsgaSsrKVxuICAgICAgICAgICAgZXhwZWN0KGNhbGN1bGF0b3JSZXN1bHRbaV0uZ2V0VGltZSgpKS50b0JlKGRpcmVjdFJlc3VsdFtpXS5nZXRUaW1lKCkpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZm9ybWF0IGNvbXBhdGliaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ2dldE5leHRFeGVjdXRpb25UaW1lIGZvcm1hdHRpbmcgY29uc2lzdGVuY3knLCAoKSA9PiB7XG4gICAgICBjb25zdCB0ZXN0Q2FzZXMgPSBbXG4gICAgICAgIHsgZXhwcjogJzAgOSAqICogKicsIHRpbWV6b25lOiAnVVRDJyB9LFxuICAgICAgICB7IGV4cHI6ICczMCAxNCAqICogMS01JywgdGltZXpvbmU6ICdBbWVyaWNhL05ld19Zb3JrJyB9LFxuICAgICAgICB7IGV4cHI6ICdAZGFpbHknLCB0aW1lem9uZTogJ0FzaWEvVG9reW8nIH0sXG4gICAgICBdXG5cbiAgICAgIHRlc3RDYXNlcy5mb3JFYWNoKCh7IGV4cHIsIHRpbWV6b25lIH0pID0+IHtcbiAgICAgICAgY29uc3QgZGF0YSA9IGNyZWF0ZUNyb25EYXRhKHsgY3Jvbl9leHByZXNzaW9uOiBleHByLCB0aW1lem9uZSB9KVxuICAgICAgICBjb25zdCB0aW1lU3RyaW5nID0gZ2V0TmV4dEV4ZWN1dGlvblRpbWUoZGF0YSlcblxuICAgICAgICAvLyBTaG91bGQgcmV0dXJuIGEgZm9ybWF0dGVkIHRpbWUgc3RyaW5nLCBub3QgJy0tJ1xuICAgICAgICBleHBlY3QodGltZVN0cmluZykubm90LnRvQmUoJy0tJylcbiAgICAgICAgZXhwZWN0KHR5cGVvZiB0aW1lU3RyaW5nKS50b0JlKCdzdHJpbmcnKVxuICAgICAgICBleHBlY3QodGltZVN0cmluZy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuXG4gICAgICAgIC8vIFNob3VsZCBjb250YWluIGV4cGVjdGVkIGZvcm1hdCBlbGVtZW50c1xuICAgICAgICBleHBlY3QodGltZVN0cmluZykudG9NYXRjaCgvXFxkKzpcXGQrLykgLy8gVGltZSBmb3JtYXRcbiAgICAgICAgZXhwZWN0KHRpbWVTdHJpbmcpLnRvTWF0Y2goL0FNfFBNLykgLy8gMTItaG91ciBmb3JtYXRcbiAgICAgICAgZXhwZWN0KHRpbWVTdHJpbmcpLnRvTWF0Y2goL1xcZHs0fS8pIC8vIFllYXJcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=