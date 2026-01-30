"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test suite for useFormatTimeFromNow hook
 *
 * This hook provides internationalized relative time formatting (e.g., "2 hours ago", "3 days ago")
 * using dayjs with the relativeTime plugin. It automatically uses the correct locale based on
 * the user's i18n settings.
 *
 * Key features:
 * - Supports 20+ locales with proper translations
 * - Automatically syncs with user's interface language
 * - Uses dayjs for consistent time calculations
 * - Returns human-readable relative time strings
 */
const react_1 = require("@testing-library/react");
// Import after mock to get the mocked version
const i18n_1 = require("@/context/i18n");
const use_format_time_from_now_1 = require("./use-format-time-from-now");
// Mock the i18n context
vi.mock('@/context/i18n', () => ({
    useLocale: vi.fn(() => 'en-US'),
}));
describe('useFormatTimeFromNow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Basic functionality', () => {
        /**
         * Test that the hook returns a formatTimeFromNow function
         * This is the primary interface of the hook
         */
        it('should return formatTimeFromNow function', () => {
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            expect(result.current).toHaveProperty('formatTimeFromNow');
            expect(typeof result.current.formatTimeFromNow).toBe('function');
        });
        /**
         * Test basic relative time formatting with English locale
         * Should return human-readable relative time strings
         */
        it('should format time from now in English', () => {
            ;
            i18n_1.useLocale.mockReturnValue('en-US');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const now = Date.now();
            const oneHourAgo = now - (60 * 60 * 1000);
            const formatted = result.current.formatTimeFromNow(oneHourAgo);
            // Should contain "hour" or "hours" and "ago"
            expect(formatted).toMatch(/hour|hours/);
            expect(formatted).toMatch(/ago/);
        });
        /**
         * Test that recent times are formatted as "a few seconds ago"
         * Very recent timestamps should show seconds
         */
        it('should format very recent times', () => {
            ;
            i18n_1.useLocale.mockReturnValue('en-US');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const now = Date.now();
            const fiveSecondsAgo = now - (5 * 1000);
            const formatted = result.current.formatTimeFromNow(fiveSecondsAgo);
            expect(formatted).toMatch(/second|seconds|few seconds/);
        });
        /**
         * Test formatting of times in the past (days ago)
         * Should handle day-level granularity
         */
        it('should format times from days ago', () => {
            ;
            i18n_1.useLocale.mockReturnValue('en-US');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const now = Date.now();
            const threeDaysAgo = now - (3 * 24 * 60 * 60 * 1000);
            const formatted = result.current.formatTimeFromNow(threeDaysAgo);
            expect(formatted).toMatch(/day|days/);
            expect(formatted).toMatch(/ago/);
        });
        /**
         * Test formatting of future times
         * dayjs fromNow also supports future times (e.g., "in 2 hours")
         */
        it('should format future times', () => {
            ;
            i18n_1.useLocale.mockReturnValue('en-US');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const now = Date.now();
            const twoHoursFromNow = now + (2 * 60 * 60 * 1000);
            const formatted = result.current.formatTimeFromNow(twoHoursFromNow);
            expect(formatted).toMatch(/in/);
            expect(formatted).toMatch(/hour|hours/);
        });
    });
    describe('Locale support', () => {
        /**
         * Test Chinese (Simplified) locale formatting
         * Should use Chinese characters for time units
         */
        it('should format time in Chinese (Simplified)', () => {
            ;
            i18n_1.useLocale.mockReturnValue('zh-Hans');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const now = Date.now();
            const oneHourAgo = now - (60 * 60 * 1000);
            const formatted = result.current.formatTimeFromNow(oneHourAgo);
            // Chinese should contain Chinese characters
            expect(formatted).toMatch(/[\u4E00-\u9FA5]/);
        });
        /**
         * Test Spanish locale formatting
         * Should use Spanish words for relative time
         */
        it('should format time in Spanish', () => {
            ;
            i18n_1.useLocale.mockReturnValue('es-ES');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const now = Date.now();
            const oneHourAgo = now - (60 * 60 * 1000);
            const formatted = result.current.formatTimeFromNow(oneHourAgo);
            // Spanish should contain "hace" (ago)
            expect(formatted).toMatch(/hace/);
        });
        /**
         * Test French locale formatting
         * Should use French words for relative time
         */
        it('should format time in French', () => {
            ;
            i18n_1.useLocale.mockReturnValue('fr-FR');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const now = Date.now();
            const oneHourAgo = now - (60 * 60 * 1000);
            const formatted = result.current.formatTimeFromNow(oneHourAgo);
            // French should contain "il y a" (ago)
            expect(formatted).toMatch(/il y a/);
        });
        /**
         * Test Japanese locale formatting
         * Should use Japanese characters
         */
        it('should format time in Japanese', () => {
            ;
            i18n_1.useLocale.mockReturnValue('ja-JP');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const now = Date.now();
            const oneHourAgo = now - (60 * 60 * 1000);
            const formatted = result.current.formatTimeFromNow(oneHourAgo);
            // Japanese should contain Japanese characters
            expect(formatted).toMatch(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/);
        });
        /**
         * Test Portuguese (Brazil) locale formatting
         * Should use pt-br locale mapping
         */
        it('should format time in Portuguese (Brazil)', () => {
            ;
            i18n_1.useLocale.mockReturnValue('pt-BR');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const now = Date.now();
            const oneHourAgo = now - (60 * 60 * 1000);
            const formatted = result.current.formatTimeFromNow(oneHourAgo);
            // Portuguese should contain "há" (ago)
            expect(formatted).toMatch(/há/);
        });
        /**
         * Test fallback to English for unsupported locales
         * Unknown locales should default to English
         */
        it('should fallback to English for unsupported locale', () => {
            ;
            i18n_1.useLocale.mockReturnValue('xx-XX');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const now = Date.now();
            const oneHourAgo = now - (60 * 60 * 1000);
            const formatted = result.current.formatTimeFromNow(oneHourAgo);
            // Should still return a valid string (in English)
            expect(typeof formatted).toBe('string');
            expect(formatted.length).toBeGreaterThan(0);
        });
    });
    describe('Edge cases', () => {
        /**
         * Test handling of timestamp 0 (Unix epoch)
         * Should format as a very old date
         */
        it('should handle timestamp 0', () => {
            ;
            i18n_1.useLocale.mockReturnValue('en-US');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const formatted = result.current.formatTimeFromNow(0);
            expect(typeof formatted).toBe('string');
            expect(formatted.length).toBeGreaterThan(0);
            expect(formatted).toMatch(/year|years/);
        });
        /**
         * Test handling of very large timestamps
         * Should handle dates far in the future
         */
        it('should handle very large timestamps', () => {
            ;
            i18n_1.useLocale.mockReturnValue('en-US');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const farFuture = Date.now() + (365 * 24 * 60 * 60 * 1000); // 1 year from now
            const formatted = result.current.formatTimeFromNow(farFuture);
            expect(typeof formatted).toBe('string');
            expect(formatted).toMatch(/in/);
        });
        /**
         * Test that the function is memoized based on locale
         * Changing locale should update the function
         */
        it('should update when locale changes', () => {
            const { result, rerender } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const now = Date.now();
            const oneHourAgo = now - (60 * 60 * 1000);
            i18n_1.useLocale.mockReturnValue('en-US');
            rerender();
            const englishResult = result.current.formatTimeFromNow(oneHourAgo);
            i18n_1.useLocale.mockReturnValue('es-ES');
            rerender();
            const spanishResult = result.current.formatTimeFromNow(oneHourAgo);
            // Results should be different
            expect(englishResult).not.toBe(spanishResult);
        });
    });
    describe('Time granularity', () => {
        /**
         * Test different time granularities (seconds, minutes, hours, days, months, years)
         * dayjs should automatically choose the appropriate unit
         */
        it('should use appropriate time units for different durations', () => {
            ;
            i18n_1.useLocale.mockReturnValue('en-US');
            const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const now = Date.now();
            // Seconds
            const seconds = result.current.formatTimeFromNow(now - 30 * 1000);
            expect(seconds).toMatch(/second/);
            // Minutes
            const minutes = result.current.formatTimeFromNow(now - 5 * 60 * 1000);
            expect(minutes).toMatch(/minute/);
            // Hours
            const hours = result.current.formatTimeFromNow(now - 3 * 60 * 60 * 1000);
            expect(hours).toMatch(/hour/);
            // Days
            const days = result.current.formatTimeFromNow(now - 5 * 24 * 60 * 60 * 1000);
            expect(days).toMatch(/day/);
            // Months
            const months = result.current.formatTimeFromNow(now - 60 * 24 * 60 * 60 * 1000);
            expect(months).toMatch(/month/);
        });
    });
    describe('Locale mapping', () => {
        /**
         * Test that all supported locales in the localeMap are handled correctly
         * This ensures the mapping from app locales to dayjs locales works
         */
        it('should handle all mapped locales', () => {
            const locales = [
                'en-US',
                'zh-Hans',
                'zh-Hant',
                'pt-BR',
                'es-ES',
                'fr-FR',
                'de-DE',
                'ja-JP',
                'ko-KR',
                'ru-RU',
                'it-IT',
                'th-TH',
                'id-ID',
                'uk-UA',
                'vi-VN',
                'ro-RO',
                'pl-PL',
                'hi-IN',
                'tr-TR',
                'fa-IR',
                'sl-SI',
            ];
            const now = Date.now();
            const oneHourAgo = now - (60 * 60 * 1000);
            locales.forEach((locale) => {
                ;
                i18n_1.useLocale.mockReturnValue(locale);
                const { result } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
                const formatted = result.current.formatTimeFromNow(oneHourAgo);
                // Should return a non-empty string for each locale
                expect(typeof formatted).toBe('string');
                expect(formatted.length).toBeGreaterThan(0);
            });
        });
    });
    describe('Performance', () => {
        /**
         * Test that the hook doesn't create new functions on every render
         * The formatTimeFromNow function should be memoized with useCallback
         */
        it('should memoize formatTimeFromNow function', () => {
            ;
            i18n_1.useLocale.mockReturnValue('en-US');
            const { result, rerender } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            const firstFunction = result.current.formatTimeFromNow;
            rerender();
            const secondFunction = result.current.formatTimeFromNow;
            // Same locale should return the same function reference
            expect(firstFunction).toBe(secondFunction);
        });
        /**
         * Test that changing locale creates a new function
         * This ensures the memoization dependency on locale works correctly
         */
        it('should create new function when locale changes', () => {
            const { result, rerender } = (0, react_1.renderHook)(() => (0, use_format_time_from_now_1.useFormatTimeFromNow)());
            i18n_1.useLocale.mockReturnValue('en-US');
            rerender();
            const englishFunction = result.current.formatTimeFromNow;
            i18n_1.useLocale.mockReturnValue('es-ES');
            rerender();
            const spanishFunction = result.current.formatTimeFromNow;
            // Different locale should return different function reference
            expect(englishFunction).not.toBe(spanishFunction);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWZvcm1hdC10aW1lLWZyb20tbm93LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtZm9ybWF0LXRpbWUtZnJvbS1ub3cuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBOzs7Ozs7Ozs7Ozs7R0FZRztBQUNILGtEQUFtRDtBQUNuRCw4Q0FBOEM7QUFDOUMseUNBQTBDO0FBRTFDLHlFQUFpRTtBQUVqRSx3QkFBd0I7QUFDeEIsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQztDQUNoQyxDQUFDLENBQUMsQ0FBQTtBQUVILFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7SUFDcEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtRQUNkLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNwQixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7UUFDbkM7OztXQUdHO1FBQ0gsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtZQUNsRCxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsK0NBQW9CLEdBQUUsQ0FBQyxDQUFBO1lBRTNELE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUE7WUFDMUQsTUFBTSxDQUFDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUNsRSxDQUFDLENBQUMsQ0FBQTtRQUVGOzs7V0FHRztRQUNILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRSxHQUFHLEVBQUU7WUFDaEQsQ0FBQztZQUFDLGdCQUFr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LE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQTtZQUV2RCx3REFBd0Q7WUFDeEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUM1QyxDQUFDLENBQUMsQ0FBQTtRQUVGOzs7V0FHRztRQUNILEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7WUFDeEQsTUFBTSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSwrQ0FBb0IsR0FBRSxDQUFDLENBRXBFO1lBQUMsZ0JBQWtCLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQzdDLFFBQVEsRUFBRSxDQUFBO1lBQ1YsTUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FFdkQ7WUFBQyxnQkFBa0IsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUE7WUFDN0MsUUFBUSxFQUFFLENBQUE7WUFDVixNQUFNLGVBQWUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFBO1lBRXhELDhEQUE4RDtZQUM5RCxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUNuRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1vY2sgfSBmcm9tICd2aXRlc3QnXG4vKipcbiAqIFRlc3Qgc3VpdGUgZm9yIHVzZUZvcm1hdFRpbWVGcm9tTm93IGhvb2tcbiAqXG4gKiBUaGlzIGhvb2sgcHJvdmlkZXMgaW50ZXJuYXRpb25hbGl6ZWQgcmVsYXRpdmUgdGltZSBmb3JtYXR0aW5nIChlLmcuLCBcIjIgaG91cnMgYWdvXCIsIFwiMyBkYXlzIGFnb1wiKVxuICogdXNpbmcgZGF5anMgd2l0aCB0aGUgcmVsYXRpdmVUaW1lIHBsdWdpbi4gSXQgYXV0b21hdGljYWxseSB1c2VzIHRoZSBjb3JyZWN0IGxvY2FsZSBiYXNlZCBvblxuICogdGhlIHVzZXIncyBpMThuIHNldHRpbmdzLlxuICpcbiAqIEtleSBmZWF0dXJlczpcbiAqIC0gU3VwcG9ydHMgMjArIGxvY2FsZXMgd2l0aCBwcm9wZXIgdHJhbnNsYXRpb25zXG4gKiAtIEF1dG9tYXRpY2FsbHkgc3luY3Mgd2l0aCB1c2VyJ3MgaW50ZXJmYWNlIGxhbmd1YWdlXG4gKiAtIFVzZXMgZGF5anMgZm9yIGNvbnNpc3RlbnQgdGltZSBjYWxjdWxhdGlvbnNcbiAqIC0gUmV0dXJucyBodW1hbi1yZWFkYWJsZSByZWxhdGl2ZSB0aW1lIHN0cmluZ3NcbiAqL1xuaW1wb3J0IHsgcmVuZGVySG9vayB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG4vLyBJbXBvcnQgYWZ0ZXIgbW9jayB0byBnZXQgdGhlIG1vY2tlZCB2ZXJzaW9uXG5pbXBvcnQgeyB1c2VMb2NhbGUgfSBmcm9tICdAL2NvbnRleHQvaTE4bidcblxuaW1wb3J0IHsgdXNlRm9ybWF0VGltZUZyb21Ob3cgfSBmcm9tICcuL3VzZS1mb3JtYXQtdGltZS1mcm9tLW5vdydcblxuLy8gTW9jayB0aGUgaTE4biBjb250ZXh0XG52aS5tb2NrKCdAL2NvbnRleHQvaTE4bicsICgpID0+ICh7XG4gIHVzZUxvY2FsZTogdmkuZm4oKCkgPT4gJ2VuLVVTJyksXG59KSlcblxuZGVzY3JpYmUoJ3VzZUZvcm1hdFRpbWVGcm9tTm93JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBkZXNjcmliZSgnQmFzaWMgZnVuY3Rpb25hbGl0eScsICgpID0+IHtcbiAgICAvKipcbiAgICAgKiBUZXN0IHRoYXQgdGhlIGhvb2sgcmV0dXJucyBhIGZvcm1hdFRpbWVGcm9tTm93IGZ1bmN0aW9uXG4gICAgICogVGhpcyBpcyB0aGUgcHJpbWFyeSBpbnRlcmZhY2Ugb2YgdGhlIGhvb2tcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmb3JtYXRUaW1lRnJvbU5vdyBmdW5jdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUZvcm1hdFRpbWVGcm9tTm93KCkpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuY3VycmVudCkudG9IYXZlUHJvcGVydHkoJ2Zvcm1hdFRpbWVGcm9tTm93JylcbiAgICAgIGV4cGVjdCh0eXBlb2YgcmVzdWx0LmN1cnJlbnQuZm9ybWF0VGltZUZyb21Ob3cpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBiYXNpYyByZWxhdGl2ZSB0aW1lIGZvcm1hdHRpbmcgd2l0aCBFbmdsaXNoIGxvY2FsZVxuICAgICAqIFNob3VsZCByZXR1cm4gaHVtYW4tcmVhZGFibGUgcmVsYXRpdmUgdGltZSBzdHJpbmdzXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBmb3JtYXQgdGltZSBmcm9tIG5vdyBpbiBFbmdsaXNoJywgKCkgPT4ge1xuICAgICAgOyh1c2VMb2NhbGUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKCdlbi1VUycpXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUZvcm1hdFRpbWVGcm9tTm93KCkpXG5cbiAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcbiAgICAgIGNvbnN0IG9uZUhvdXJBZ28gPSBub3cgLSAoNjAgKiA2MCAqIDEwMDApXG4gICAgICBjb25zdCBmb3JtYXR0ZWQgPSByZXN1bHQuY3VycmVudC5mb3JtYXRUaW1lRnJvbU5vdyhvbmVIb3VyQWdvKVxuXG4gICAgICAvLyBTaG91bGQgY29udGFpbiBcImhvdXJcIiBvciBcImhvdXJzXCIgYW5kIFwiYWdvXCJcbiAgICAgIGV4cGVjdChmb3JtYXR0ZWQpLnRvTWF0Y2goL2hvdXJ8aG91cnMvKVxuICAgICAgZXhwZWN0KGZvcm1hdHRlZCkudG9NYXRjaCgvYWdvLylcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCB0aGF0IHJlY2VudCB0aW1lcyBhcmUgZm9ybWF0dGVkIGFzIFwiYSBmZXcgc2Vjb25kcyBhZ29cIlxuICAgICAqIFZlcnkgcmVjZW50IHRpbWVzdGFtcHMgc2hvdWxkIHNob3cgc2Vjb25kc1xuICAgICAqL1xuICAgIGl0KCdzaG91bGQgZm9ybWF0IHZlcnkgcmVjZW50IHRpbWVzJywgKCkgPT4ge1xuICAgICAgOyh1c2VMb2NhbGUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKCdlbi1VUycpXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUZvcm1hdFRpbWVGcm9tTm93KCkpXG5cbiAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcbiAgICAgIGNvbnN0IGZpdmVTZWNvbmRzQWdvID0gbm93IC0gKDUgKiAxMDAwKVxuICAgICAgY29uc3QgZm9ybWF0dGVkID0gcmVzdWx0LmN1cnJlbnQuZm9ybWF0VGltZUZyb21Ob3coZml2ZVNlY29uZHNBZ28pXG5cbiAgICAgIGV4cGVjdChmb3JtYXR0ZWQpLnRvTWF0Y2goL3NlY29uZHxzZWNvbmRzfGZldyBzZWNvbmRzLylcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBmb3JtYXR0aW5nIG9mIHRpbWVzIGluIHRoZSBwYXN0IChkYXlzIGFnbylcbiAgICAgKiBTaG91bGQgaGFuZGxlIGRheS1sZXZlbCBncmFudWxhcml0eVxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgZm9ybWF0IHRpbWVzIGZyb20gZGF5cyBhZ28nLCAoKSA9PiB7XG4gICAgICA7KHVzZUxvY2FsZSBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoJ2VuLVVTJylcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlRm9ybWF0VGltZUZyb21Ob3coKSlcblxuICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKVxuICAgICAgY29uc3QgdGhyZWVEYXlzQWdvID0gbm93IC0gKDMgKiAyNCAqIDYwICogNjAgKiAxMDAwKVxuICAgICAgY29uc3QgZm9ybWF0dGVkID0gcmVzdWx0LmN1cnJlbnQuZm9ybWF0VGltZUZyb21Ob3codGhyZWVEYXlzQWdvKVxuXG4gICAgICBleHBlY3QoZm9ybWF0dGVkKS50b01hdGNoKC9kYXl8ZGF5cy8pXG4gICAgICBleHBlY3QoZm9ybWF0dGVkKS50b01hdGNoKC9hZ28vKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IGZvcm1hdHRpbmcgb2YgZnV0dXJlIHRpbWVzXG4gICAgICogZGF5anMgZnJvbU5vdyBhbHNvIHN1cHBvcnRzIGZ1dHVyZSB0aW1lcyAoZS5nLiwgXCJpbiAyIGhvdXJzXCIpXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBmb3JtYXQgZnV0dXJlIHRpbWVzJywgKCkgPT4ge1xuICAgICAgOyh1c2VMb2NhbGUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKCdlbi1VUycpXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUZvcm1hdFRpbWVGcm9tTm93KCkpXG5cbiAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcbiAgICAgIGNvbnN0IHR3b0hvdXJzRnJvbU5vdyA9IG5vdyArICgyICogNjAgKiA2MCAqIDEwMDApXG4gICAgICBjb25zdCBmb3JtYXR0ZWQgPSByZXN1bHQuY3VycmVudC5mb3JtYXRUaW1lRnJvbU5vdyh0d29Ib3Vyc0Zyb21Ob3cpXG5cbiAgICAgIGV4cGVjdChmb3JtYXR0ZWQpLnRvTWF0Y2goL2luLylcbiAgICAgIGV4cGVjdChmb3JtYXR0ZWQpLnRvTWF0Y2goL2hvdXJ8aG91cnMvKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0xvY2FsZSBzdXBwb3J0JywgKCkgPT4ge1xuICAgIC8qKlxuICAgICAqIFRlc3QgQ2hpbmVzZSAoU2ltcGxpZmllZCkgbG9jYWxlIGZvcm1hdHRpbmdcbiAgICAgKiBTaG91bGQgdXNlIENoaW5lc2UgY2hhcmFjdGVycyBmb3IgdGltZSB1bml0c1xuICAgICAqL1xuICAgIGl0KCdzaG91bGQgZm9ybWF0IHRpbWUgaW4gQ2hpbmVzZSAoU2ltcGxpZmllZCknLCAoKSA9PiB7XG4gICAgICA7KHVzZUxvY2FsZSBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoJ3poLUhhbnMnKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VGb3JtYXRUaW1lRnJvbU5vdygpKVxuXG4gICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpXG4gICAgICBjb25zdCBvbmVIb3VyQWdvID0gbm93IC0gKDYwICogNjAgKiAxMDAwKVxuICAgICAgY29uc3QgZm9ybWF0dGVkID0gcmVzdWx0LmN1cnJlbnQuZm9ybWF0VGltZUZyb21Ob3cob25lSG91ckFnbylcblxuICAgICAgLy8gQ2hpbmVzZSBzaG91bGQgY29udGFpbiBDaGluZXNlIGNoYXJhY3RlcnNcbiAgICAgIGV4cGVjdChmb3JtYXR0ZWQpLnRvTWF0Y2goL1tcXHU0RTAwLVxcdTlGQTVdLylcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBTcGFuaXNoIGxvY2FsZSBmb3JtYXR0aW5nXG4gICAgICogU2hvdWxkIHVzZSBTcGFuaXNoIHdvcmRzIGZvciByZWxhdGl2ZSB0aW1lXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBmb3JtYXQgdGltZSBpbiBTcGFuaXNoJywgKCkgPT4ge1xuICAgICAgOyh1c2VMb2NhbGUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKCdlcy1FUycpXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUZvcm1hdFRpbWVGcm9tTm93KCkpXG5cbiAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcbiAgICAgIGNvbnN0IG9uZUhvdXJBZ28gPSBub3cgLSAoNjAgKiA2MCAqIDEwMDApXG4gICAgICBjb25zdCBmb3JtYXR0ZWQgPSByZXN1bHQuY3VycmVudC5mb3JtYXRUaW1lRnJvbU5vdyhvbmVIb3VyQWdvKVxuXG4gICAgICAvLyBTcGFuaXNoIHNob3VsZCBjb250YWluIFwiaGFjZVwiIChhZ28pXG4gICAgICBleHBlY3QoZm9ybWF0dGVkKS50b01hdGNoKC9oYWNlLylcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBGcmVuY2ggbG9jYWxlIGZvcm1hdHRpbmdcbiAgICAgKiBTaG91bGQgdXNlIEZyZW5jaCB3b3JkcyBmb3IgcmVsYXRpdmUgdGltZVxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgZm9ybWF0IHRpbWUgaW4gRnJlbmNoJywgKCkgPT4ge1xuICAgICAgOyh1c2VMb2NhbGUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKCdmci1GUicpXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUZvcm1hdFRpbWVGcm9tTm93KCkpXG5cbiAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcbiAgICAgIGNvbnN0IG9uZUhvdXJBZ28gPSBub3cgLSAoNjAgKiA2MCAqIDEwMDApXG4gICAgICBjb25zdCBmb3JtYXR0ZWQgPSByZXN1bHQuY3VycmVudC5mb3JtYXRUaW1lRnJvbU5vdyhvbmVIb3VyQWdvKVxuXG4gICAgICAvLyBGcmVuY2ggc2hvdWxkIGNvbnRhaW4gXCJpbCB5IGFcIiAoYWdvKVxuICAgICAgZXhwZWN0KGZvcm1hdHRlZCkudG9NYXRjaCgvaWwgeSBhLylcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBKYXBhbmVzZSBsb2NhbGUgZm9ybWF0dGluZ1xuICAgICAqIFNob3VsZCB1c2UgSmFwYW5lc2UgY2hhcmFjdGVyc1xuICAgICAqL1xuICAgIGl0KCdzaG91bGQgZm9ybWF0IHRpbWUgaW4gSmFwYW5lc2UnLCAoKSA9PiB7XG4gICAgICA7KHVzZUxvY2FsZSBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoJ2phLUpQJylcblxuICAgICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlRm9ybWF0VGltZUZyb21Ob3coKSlcblxuICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKVxuICAgICAgY29uc3Qgb25lSG91ckFnbyA9IG5vdyAtICg2MCAqIDYwICogMTAwMClcbiAgICAgIGNvbnN0IGZvcm1hdHRlZCA9IHJlc3VsdC5jdXJyZW50LmZvcm1hdFRpbWVGcm9tTm93KG9uZUhvdXJBZ28pXG5cbiAgICAgIC8vIEphcGFuZXNlIHNob3VsZCBjb250YWluIEphcGFuZXNlIGNoYXJhY3RlcnNcbiAgICAgIGV4cGVjdChmb3JtYXR0ZWQpLnRvTWF0Y2goL1tcXHUzMDQwLVxcdTMwOUZcXHUzMEEwLVxcdTMwRkZcXHU0RTAwLVxcdTlGQUZdLylcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBQb3J0dWd1ZXNlIChCcmF6aWwpIGxvY2FsZSBmb3JtYXR0aW5nXG4gICAgICogU2hvdWxkIHVzZSBwdC1iciBsb2NhbGUgbWFwcGluZ1xuICAgICAqL1xuICAgIGl0KCdzaG91bGQgZm9ybWF0IHRpbWUgaW4gUG9ydHVndWVzZSAoQnJhemlsKScsICgpID0+IHtcbiAgICAgIDsodXNlTG9jYWxlIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSgncHQtQlInKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VGb3JtYXRUaW1lRnJvbU5vdygpKVxuXG4gICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpXG4gICAgICBjb25zdCBvbmVIb3VyQWdvID0gbm93IC0gKDYwICogNjAgKiAxMDAwKVxuICAgICAgY29uc3QgZm9ybWF0dGVkID0gcmVzdWx0LmN1cnJlbnQuZm9ybWF0VGltZUZyb21Ob3cob25lSG91ckFnbylcblxuICAgICAgLy8gUG9ydHVndWVzZSBzaG91bGQgY29udGFpbiBcImjDoVwiIChhZ28pXG4gICAgICBleHBlY3QoZm9ybWF0dGVkKS50b01hdGNoKC9ow6EvKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IGZhbGxiYWNrIHRvIEVuZ2xpc2ggZm9yIHVuc3VwcG9ydGVkIGxvY2FsZXNcbiAgICAgKiBVbmtub3duIGxvY2FsZXMgc2hvdWxkIGRlZmF1bHQgdG8gRW5nbGlzaFxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgZmFsbGJhY2sgdG8gRW5nbGlzaCBmb3IgdW5zdXBwb3J0ZWQgbG9jYWxlJywgKCkgPT4ge1xuICAgICAgOyh1c2VMb2NhbGUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKCd4eC1YWCcgYXMgYW55KVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VGb3JtYXRUaW1lRnJvbU5vdygpKVxuXG4gICAgICBjb25zdCBub3cgPSBEYXRlLm5vdygpXG4gICAgICBjb25zdCBvbmVIb3VyQWdvID0gbm93IC0gKDYwICogNjAgKiAxMDAwKVxuICAgICAgY29uc3QgZm9ybWF0dGVkID0gcmVzdWx0LmN1cnJlbnQuZm9ybWF0VGltZUZyb21Ob3cob25lSG91ckFnbylcblxuICAgICAgLy8gU2hvdWxkIHN0aWxsIHJldHVybiBhIHZhbGlkIHN0cmluZyAoaW4gRW5nbGlzaClcbiAgICAgIGV4cGVjdCh0eXBlb2YgZm9ybWF0dGVkKS50b0JlKCdzdHJpbmcnKVxuICAgICAgZXhwZWN0KGZvcm1hdHRlZC5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgY2FzZXMnLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdCBoYW5kbGluZyBvZiB0aW1lc3RhbXAgMCAoVW5peCBlcG9jaClcbiAgICAgKiBTaG91bGQgZm9ybWF0IGFzIGEgdmVyeSBvbGQgZGF0ZVxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHRpbWVzdGFtcCAwJywgKCkgPT4ge1xuICAgICAgOyh1c2VMb2NhbGUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKCdlbi1VUycpXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUZvcm1hdFRpbWVGcm9tTm93KCkpXG5cbiAgICAgIGNvbnN0IGZvcm1hdHRlZCA9IHJlc3VsdC5jdXJyZW50LmZvcm1hdFRpbWVGcm9tTm93KDApXG5cbiAgICAgIGV4cGVjdCh0eXBlb2YgZm9ybWF0dGVkKS50b0JlKCdzdHJpbmcnKVxuICAgICAgZXhwZWN0KGZvcm1hdHRlZC5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgICAgZXhwZWN0KGZvcm1hdHRlZCkudG9NYXRjaCgveWVhcnx5ZWFycy8pXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgaGFuZGxpbmcgb2YgdmVyeSBsYXJnZSB0aW1lc3RhbXBzXG4gICAgICogU2hvdWxkIGhhbmRsZSBkYXRlcyBmYXIgaW4gdGhlIGZ1dHVyZVxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbGFyZ2UgdGltZXN0YW1wcycsICgpID0+IHtcbiAgICAgIDsodXNlTG9jYWxlIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSgnZW4tVVMnKVxuXG4gICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VGb3JtYXRUaW1lRnJvbU5vdygpKVxuXG4gICAgICBjb25zdCBmYXJGdXR1cmUgPSBEYXRlLm5vdygpICsgKDM2NSAqIDI0ICogNjAgKiA2MCAqIDEwMDApIC8vIDEgeWVhciBmcm9tIG5vd1xuICAgICAgY29uc3QgZm9ybWF0dGVkID0gcmVzdWx0LmN1cnJlbnQuZm9ybWF0VGltZUZyb21Ob3coZmFyRnV0dXJlKVxuXG4gICAgICBleHBlY3QodHlwZW9mIGZvcm1hdHRlZCkudG9CZSgnc3RyaW5nJylcbiAgICAgIGV4cGVjdChmb3JtYXR0ZWQpLnRvTWF0Y2goL2luLylcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCB0aGF0IHRoZSBmdW5jdGlvbiBpcyBtZW1vaXplZCBiYXNlZCBvbiBsb2NhbGVcbiAgICAgKiBDaGFuZ2luZyBsb2NhbGUgc2hvdWxkIHVwZGF0ZSB0aGUgZnVuY3Rpb25cbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB3aGVuIGxvY2FsZSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXN1bHQsIHJlcmVuZGVyIH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUZvcm1hdFRpbWVGcm9tTm93KCkpXG5cbiAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcbiAgICAgIGNvbnN0IG9uZUhvdXJBZ28gPSBub3cgLSAoNjAgKiA2MCAqIDEwMDApXG5cbiAgICAgIC8vIEZpcnN0IHJlbmRlciB3aXRoIEVuZ2xpc2hcbiAgICAgIDsodXNlTG9jYWxlIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSgnZW4tVVMnKVxuICAgICAgcmVyZW5kZXIoKVxuICAgICAgY29uc3QgZW5nbGlzaFJlc3VsdCA9IHJlc3VsdC5jdXJyZW50LmZvcm1hdFRpbWVGcm9tTm93KG9uZUhvdXJBZ28pXG5cbiAgICAgIC8vIFNlY29uZCByZW5kZXIgd2l0aCBTcGFuaXNoXG4gICAgICA7KHVzZUxvY2FsZSBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoJ2VzLUVTJylcbiAgICAgIHJlcmVuZGVyKClcbiAgICAgIGNvbnN0IHNwYW5pc2hSZXN1bHQgPSByZXN1bHQuY3VycmVudC5mb3JtYXRUaW1lRnJvbU5vdyhvbmVIb3VyQWdvKVxuXG4gICAgICAvLyBSZXN1bHRzIHNob3VsZCBiZSBkaWZmZXJlbnRcbiAgICAgIGV4cGVjdChlbmdsaXNoUmVzdWx0KS5ub3QudG9CZShzcGFuaXNoUmVzdWx0KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1RpbWUgZ3JhbnVsYXJpdHknLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdCBkaWZmZXJlbnQgdGltZSBncmFudWxhcml0aWVzIChzZWNvbmRzLCBtaW51dGVzLCBob3VycywgZGF5cywgbW9udGhzLCB5ZWFycylcbiAgICAgKiBkYXlqcyBzaG91bGQgYXV0b21hdGljYWxseSBjaG9vc2UgdGhlIGFwcHJvcHJpYXRlIHVuaXRcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIHVzZSBhcHByb3ByaWF0ZSB0aW1lIHVuaXRzIGZvciBkaWZmZXJlbnQgZHVyYXRpb25zJywgKCkgPT4ge1xuICAgICAgOyh1c2VMb2NhbGUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKCdlbi1VUycpXG5cbiAgICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUZvcm1hdFRpbWVGcm9tTm93KCkpXG5cbiAgICAgIGNvbnN0IG5vdyA9IERhdGUubm93KClcblxuICAgICAgLy8gU2Vjb25kc1xuICAgICAgY29uc3Qgc2Vjb25kcyA9IHJlc3VsdC5jdXJyZW50LmZvcm1hdFRpbWVGcm9tTm93KG5vdyAtIDMwICogMTAwMClcbiAgICAgIGV4cGVjdChzZWNvbmRzKS50b01hdGNoKC9zZWNvbmQvKVxuXG4gICAgICAvLyBNaW51dGVzXG4gICAgICBjb25zdCBtaW51dGVzID0gcmVzdWx0LmN1cnJlbnQuZm9ybWF0VGltZUZyb21Ob3cobm93IC0gNSAqIDYwICogMTAwMClcbiAgICAgIGV4cGVjdChtaW51dGVzKS50b01hdGNoKC9taW51dGUvKVxuXG4gICAgICAvLyBIb3Vyc1xuICAgICAgY29uc3QgaG91cnMgPSByZXN1bHQuY3VycmVudC5mb3JtYXRUaW1lRnJvbU5vdyhub3cgLSAzICogNjAgKiA2MCAqIDEwMDApXG4gICAgICBleHBlY3QoaG91cnMpLnRvTWF0Y2goL2hvdXIvKVxuXG4gICAgICAvLyBEYXlzXG4gICAgICBjb25zdCBkYXlzID0gcmVzdWx0LmN1cnJlbnQuZm9ybWF0VGltZUZyb21Ob3cobm93IC0gNSAqIDI0ICogNjAgKiA2MCAqIDEwMDApXG4gICAgICBleHBlY3QoZGF5cykudG9NYXRjaCgvZGF5LylcblxuICAgICAgLy8gTW9udGhzXG4gICAgICBjb25zdCBtb250aHMgPSByZXN1bHQuY3VycmVudC5mb3JtYXRUaW1lRnJvbU5vdyhub3cgLSA2MCAqIDI0ICogNjAgKiA2MCAqIDEwMDApXG4gICAgICBleHBlY3QobW9udGhzKS50b01hdGNoKC9tb250aC8pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnTG9jYWxlIG1hcHBpbmcnLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdCB0aGF0IGFsbCBzdXBwb3J0ZWQgbG9jYWxlcyBpbiB0aGUgbG9jYWxlTWFwIGFyZSBoYW5kbGVkIGNvcnJlY3RseVxuICAgICAqIFRoaXMgZW5zdXJlcyB0aGUgbWFwcGluZyBmcm9tIGFwcCBsb2NhbGVzIHRvIGRheWpzIGxvY2FsZXMgd29ya3NcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhbGwgbWFwcGVkIGxvY2FsZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb2NhbGVzID0gW1xuICAgICAgICAnZW4tVVMnLFxuICAgICAgICAnemgtSGFucycsXG4gICAgICAgICd6aC1IYW50JyxcbiAgICAgICAgJ3B0LUJSJyxcbiAgICAgICAgJ2VzLUVTJyxcbiAgICAgICAgJ2ZyLUZSJyxcbiAgICAgICAgJ2RlLURFJyxcbiAgICAgICAgJ2phLUpQJyxcbiAgICAgICAgJ2tvLUtSJyxcbiAgICAgICAgJ3J1LVJVJyxcbiAgICAgICAgJ2l0LUlUJyxcbiAgICAgICAgJ3RoLVRIJyxcbiAgICAgICAgJ2lkLUlEJyxcbiAgICAgICAgJ3VrLVVBJyxcbiAgICAgICAgJ3ZpLVZOJyxcbiAgICAgICAgJ3JvLVJPJyxcbiAgICAgICAgJ3BsLVBMJyxcbiAgICAgICAgJ2hpLUlOJyxcbiAgICAgICAgJ3RyLVRSJyxcbiAgICAgICAgJ2ZhLUlSJyxcbiAgICAgICAgJ3NsLVNJJyxcbiAgICAgIF1cblxuICAgICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKVxuICAgICAgY29uc3Qgb25lSG91ckFnbyA9IG5vdyAtICg2MCAqIDYwICogMTAwMClcblxuICAgICAgbG9jYWxlcy5mb3JFYWNoKChsb2NhbGUpID0+IHtcbiAgICAgICAgOyh1c2VMb2NhbGUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKGxvY2FsZSlcblxuICAgICAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VGb3JtYXRUaW1lRnJvbU5vdygpKVxuICAgICAgICBjb25zdCBmb3JtYXR0ZWQgPSByZXN1bHQuY3VycmVudC5mb3JtYXRUaW1lRnJvbU5vdyhvbmVIb3VyQWdvKVxuXG4gICAgICAgIC8vIFNob3VsZCByZXR1cm4gYSBub24tZW1wdHkgc3RyaW5nIGZvciBlYWNoIGxvY2FsZVxuICAgICAgICBleHBlY3QodHlwZW9mIGZvcm1hdHRlZCkudG9CZSgnc3RyaW5nJylcbiAgICAgICAgZXhwZWN0KGZvcm1hdHRlZC5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQZXJmb3JtYW5jZScsICgpID0+IHtcbiAgICAvKipcbiAgICAgKiBUZXN0IHRoYXQgdGhlIGhvb2sgZG9lc24ndCBjcmVhdGUgbmV3IGZ1bmN0aW9ucyBvbiBldmVyeSByZW5kZXJcbiAgICAgKiBUaGUgZm9ybWF0VGltZUZyb21Ob3cgZnVuY3Rpb24gc2hvdWxkIGJlIG1lbW9pemVkIHdpdGggdXNlQ2FsbGJhY2tcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIG1lbW9pemUgZm9ybWF0VGltZUZyb21Ob3cgZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgICA7KHVzZUxvY2FsZSBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoJ2VuLVVTJylcblxuICAgICAgY29uc3QgeyByZXN1bHQsIHJlcmVuZGVyIH0gPSByZW5kZXJIb29rKCgpID0+IHVzZUZvcm1hdFRpbWVGcm9tTm93KCkpXG5cbiAgICAgIGNvbnN0IGZpcnN0RnVuY3Rpb24gPSByZXN1bHQuY3VycmVudC5mb3JtYXRUaW1lRnJvbU5vd1xuICAgICAgcmVyZW5kZXIoKVxuICAgICAgY29uc3Qgc2Vjb25kRnVuY3Rpb24gPSByZXN1bHQuY3VycmVudC5mb3JtYXRUaW1lRnJvbU5vd1xuXG4gICAgICAvLyBTYW1lIGxvY2FsZSBzaG91bGQgcmV0dXJuIHRoZSBzYW1lIGZ1bmN0aW9uIHJlZmVyZW5jZVxuICAgICAgZXhwZWN0KGZpcnN0RnVuY3Rpb24pLnRvQmUoc2Vjb25kRnVuY3Rpb24pXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgdGhhdCBjaGFuZ2luZyBsb2NhbGUgY3JlYXRlcyBhIG5ldyBmdW5jdGlvblxuICAgICAqIFRoaXMgZW5zdXJlcyB0aGUgbWVtb2l6YXRpb24gZGVwZW5kZW5jeSBvbiBsb2NhbGUgd29ya3MgY29ycmVjdGx5XG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCBjcmVhdGUgbmV3IGZ1bmN0aW9uIHdoZW4gbG9jYWxlIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlc3VsdCwgcmVyZW5kZXIgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlRm9ybWF0VGltZUZyb21Ob3coKSlcblxuICAgICAgOyh1c2VMb2NhbGUgYXMgTW9jaykubW9ja1JldHVyblZhbHVlKCdlbi1VUycpXG4gICAgICByZXJlbmRlcigpXG4gICAgICBjb25zdCBlbmdsaXNoRnVuY3Rpb24gPSByZXN1bHQuY3VycmVudC5mb3JtYXRUaW1lRnJvbU5vd1xuXG4gICAgICA7KHVzZUxvY2FsZSBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoJ2VzLUVTJylcbiAgICAgIHJlcmVuZGVyKClcbiAgICAgIGNvbnN0IHNwYW5pc2hGdW5jdGlvbiA9IHJlc3VsdC5jdXJyZW50LmZvcm1hdFRpbWVGcm9tTm93XG5cbiAgICAgIC8vIERpZmZlcmVudCBsb2NhbGUgc2hvdWxkIHJldHVybiBkaWZmZXJlbnQgZnVuY3Rpb24gcmVmZXJlbmNlXG4gICAgICBleHBlY3QoZW5nbGlzaEZ1bmN0aW9uKS5ub3QudG9CZShzcGFuaXNoRnVuY3Rpb24pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=