"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test suite for clipboard utilities
 *
 * This module provides cross-browser clipboard functionality with automatic fallback:
 * 1. Modern Clipboard API (navigator.clipboard.writeText) - preferred method
 * 2. Legacy execCommand('copy') - fallback for older browsers
 *
 * The implementation ensures clipboard operations work across all supported browsers
 * while gracefully handling permissions and API availability.
 */
const clipboard_1 = require("./clipboard");
describe('Clipboard Utilities', () => {
    describe('writeTextToClipboard', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });
        /**
         * Test modern Clipboard API usage
         * When navigator.clipboard is available, should use the modern API
         */
        it('should use navigator.clipboard.writeText when available', async () => {
            const mockWriteText = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: mockWriteText },
                writable: true,
                configurable: true,
            });
            await (0, clipboard_1.writeTextToClipboard)('test text');
            expect(mockWriteText).toHaveBeenCalledWith('test text');
        });
        /**
         * Test fallback to legacy execCommand method
         * When Clipboard API is unavailable, should use document.execCommand('copy')
         * This involves creating a temporary textarea element
         */
        it('should fallback to execCommand when clipboard API not available', async () => {
            Object.defineProperty(navigator, 'clipboard', {
                value: undefined,
                writable: true,
                configurable: true,
            });
            const mockExecCommand = vi.fn().mockReturnValue(true);
            document.execCommand = mockExecCommand;
            const appendChildSpy = vi.spyOn(document.body, 'appendChild');
            const removeChildSpy = vi.spyOn(document.body, 'removeChild');
            await (0, clipboard_1.writeTextToClipboard)('fallback text');
            expect(appendChildSpy).toHaveBeenCalled();
            expect(mockExecCommand).toHaveBeenCalledWith('copy');
            expect(removeChildSpy).toHaveBeenCalled();
        });
        /**
         * Test error handling when execCommand returns false
         * execCommand returns false when the operation fails
         */
        it('should handle execCommand failure', async () => {
            Object.defineProperty(navigator, 'clipboard', {
                value: undefined,
                writable: true,
                configurable: true,
            });
            const mockExecCommand = vi.fn().mockReturnValue(false);
            document.execCommand = mockExecCommand;
            await expect((0, clipboard_1.writeTextToClipboard)('fail text')).rejects.toThrow();
        });
        /**
         * Test error handling when execCommand throws an exception
         * Should propagate the error to the caller
         */
        it('should handle execCommand exception', async () => {
            Object.defineProperty(navigator, 'clipboard', {
                value: undefined,
                writable: true,
                configurable: true,
            });
            const mockExecCommand = vi.fn().mockImplementation(() => {
                throw new Error('execCommand error');
            });
            document.execCommand = mockExecCommand;
            await expect((0, clipboard_1.writeTextToClipboard)('error text')).rejects.toThrow('execCommand error');
        });
        /**
         * Test proper cleanup of temporary DOM elements
         * The temporary textarea should be removed after copying
         */
        it('should clean up textarea after fallback', async () => {
            Object.defineProperty(navigator, 'clipboard', {
                value: undefined,
                writable: true,
                configurable: true,
            });
            document.execCommand = vi.fn().mockReturnValue(true);
            const removeChildSpy = vi.spyOn(document.body, 'removeChild');
            await (0, clipboard_1.writeTextToClipboard)('cleanup test');
            expect(removeChildSpy).toHaveBeenCalled();
        });
        /**
         * Test copying empty strings
         * Should handle edge case of empty clipboard content
         */
        it('should handle empty string', async () => {
            const mockWriteText = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: mockWriteText },
                writable: true,
                configurable: true,
            });
            await (0, clipboard_1.writeTextToClipboard)('');
            expect(mockWriteText).toHaveBeenCalledWith('');
        });
        /**
         * Test copying text with special characters
         * Should preserve newlines, tabs, quotes, unicode, and emojis
         */
        it('should handle special characters', async () => {
            const mockWriteText = vi.fn().mockResolvedValue(undefined);
            Object.defineProperty(navigator, 'clipboard', {
                value: { writeText: mockWriteText },
                writable: true,
                configurable: true,
            });
            const specialText = 'Test\n\t"quotes"\n中文\n😀';
            await (0, clipboard_1.writeTextToClipboard)(specialText);
            expect(mockWriteText).toHaveBeenCalledWith(specialText);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpcGJvYXJkLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjbGlwYm9hcmQuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7R0FTRztBQUNILDJDQUFrRDtBQUVsRCxRQUFRLENBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO0lBQ25DLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLEVBQUU7UUFDcEMsU0FBUyxDQUFDLEdBQUcsRUFBRTtZQUNiLEVBQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQTtRQUN0QixDQUFDLENBQUMsQ0FBQTtRQUVGOzs7V0FHRztRQUNILEVBQUUsQ0FBQyx5REFBeUQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN2RSxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDMUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFO2dCQUM1QyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFO2dCQUNuQyxRQUFRLEVBQUUsSUFBSTtnQkFDZCxZQUFZLEVBQUUsSUFBSTthQUNuQixDQUFDLENBQUE7WUFFRixNQUFNLElBQUEsZ0NBQW9CLEVBQUMsV0FBVyxDQUFDLENBQUE7WUFDdkMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ3pELENBQUMsQ0FBQyxDQUFBO1FBRUY7Ozs7V0FJRztRQUNILEVBQUUsQ0FBQyxpRUFBaUUsRUFBRSxLQUFLLElBQUksRUFBRTtZQUMvRSxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUU7Z0JBQzVDLEtBQUssRUFBRSxTQUFTO2dCQUNoQixRQUFRLEVBQUUsSUFBSTtnQkFDZCxZQUFZLEVBQUUsSUFBSTthQUNuQixDQUFDLENBQUE7WUFFRixNQUFNLGVBQWUsR0FBRyxFQUFFLENB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RTtZQUMxQyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUE7WUFDMUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFO2dCQUM1QyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsYUFBYSxFQUFFO2dCQUNuQyxRQUFRLEVBQUUsSUFBSTtnQkFDZCxZQUFZLEVBQUUsSUFBSTthQUNuQixDQUFDLENBQUE7WUFFRixNQUFNLElBQUEsZ0NBQW9CLEVBQUMsRUFBRSxDQUFDLENBQUE7WUFDOUIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2hELENBQUMsQ0FBQyxDQUFBO1FBRUY7OztXQUdHO1FBQ0gsRUFBRSxDQUFDLGtDQUFrQyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ2hELE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUMxRCxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUU7Z0JBQzVDLEtBQUssRUFBRSxFQUFFLFNBQVMsRUFBRSxhQUFhLEVBQUU7Z0JBQ25DLFFBQVEsRUFBRSxJQUFJO2dCQUNkLFlBQVksRUFBRSxJQUFJO2FBQ25CLENBQUMsQ0FBQTtZQUVGLE1BQU0sV0FBVyxHQUFHLDBCQUEwQixDQUFBO1lBQzlDLE1BQU0sSUFBQSxnQ0FBb0IsRUFBQyxXQUFXLENBQUMsQ0FBQTtZQUN2QyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDLENBQUE7UUFDekQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUZXN0IHN1aXRlIGZvciBjbGlwYm9hcmQgdXRpbGl0aWVzXG4gKlxuICogVGhpcyBtb2R1bGUgcHJvdmlkZXMgY3Jvc3MtYnJvd3NlciBjbGlwYm9hcmQgZnVuY3Rpb25hbGl0eSB3aXRoIGF1dG9tYXRpYyBmYWxsYmFjazpcbiAqIDEuIE1vZGVybiBDbGlwYm9hcmQgQVBJIChuYXZpZ2F0b3IuY2xpcGJvYXJkLndyaXRlVGV4dCkgLSBwcmVmZXJyZWQgbWV0aG9kXG4gKiAyLiBMZWdhY3kgZXhlY0NvbW1hbmQoJ2NvcHknKSAtIGZhbGxiYWNrIGZvciBvbGRlciBicm93c2Vyc1xuICpcbiAqIFRoZSBpbXBsZW1lbnRhdGlvbiBlbnN1cmVzIGNsaXBib2FyZCBvcGVyYXRpb25zIHdvcmsgYWNyb3NzIGFsbCBzdXBwb3J0ZWQgYnJvd3NlcnNcbiAqIHdoaWxlIGdyYWNlZnVsbHkgaGFuZGxpbmcgcGVybWlzc2lvbnMgYW5kIEFQSSBhdmFpbGFiaWxpdHkuXG4gKi9cbmltcG9ydCB7IHdyaXRlVGV4dFRvQ2xpcGJvYXJkIH0gZnJvbSAnLi9jbGlwYm9hcmQnXG5cbmRlc2NyaWJlKCdDbGlwYm9hcmQgVXRpbGl0aWVzJywgKCkgPT4ge1xuICBkZXNjcmliZSgnd3JpdGVUZXh0VG9DbGlwYm9hcmQnLCAoKSA9PiB7XG4gICAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICAgIHZpLnJlc3RvcmVBbGxNb2NrcygpXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgbW9kZXJuIENsaXBib2FyZCBBUEkgdXNhZ2VcbiAgICAgKiBXaGVuIG5hdmlnYXRvci5jbGlwYm9hcmQgaXMgYXZhaWxhYmxlLCBzaG91bGQgdXNlIHRoZSBtb2Rlcm4gQVBJXG4gICAgICovXG4gICAgaXQoJ3Nob3VsZCB1c2UgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQgd2hlbiBhdmFpbGFibGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrV3JpdGVUZXh0ID0gdmkuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZSh1bmRlZmluZWQpXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobmF2aWdhdG9yLCAnY2xpcGJvYXJkJywge1xuICAgICAgICB2YWx1ZTogeyB3cml0ZVRleHQ6IG1vY2tXcml0ZVRleHQgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdyaXRlVGV4dFRvQ2xpcGJvYXJkKCd0ZXN0IHRleHQnKVxuICAgICAgZXhwZWN0KG1vY2tXcml0ZVRleHQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd0ZXN0IHRleHQnKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IGZhbGxiYWNrIHRvIGxlZ2FjeSBleGVjQ29tbWFuZCBtZXRob2RcbiAgICAgKiBXaGVuIENsaXBib2FyZCBBUEkgaXMgdW5hdmFpbGFibGUsIHNob3VsZCB1c2UgZG9jdW1lbnQuZXhlY0NvbW1hbmQoJ2NvcHknKVxuICAgICAqIFRoaXMgaW52b2x2ZXMgY3JlYXRpbmcgYSB0ZW1wb3JhcnkgdGV4dGFyZWEgZWxlbWVudFxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgZmFsbGJhY2sgdG8gZXhlY0NvbW1hbmQgd2hlbiBjbGlwYm9hcmQgQVBJIG5vdCBhdmFpbGFibGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobmF2aWdhdG9yLCAnY2xpcGJvYXJkJywge1xuICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgbW9ja0V4ZWNDb21tYW5kID0gdmkuZm4oKS5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcbiAgICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kID0gbW9ja0V4ZWNDb21tYW5kXG5cbiAgICAgIGNvbnN0IGFwcGVuZENoaWxkU3B5ID0gdmkuc3B5T24oZG9jdW1lbnQuYm9keSwgJ2FwcGVuZENoaWxkJylcbiAgICAgIGNvbnN0IHJlbW92ZUNoaWxkU3B5ID0gdmkuc3B5T24oZG9jdW1lbnQuYm9keSwgJ3JlbW92ZUNoaWxkJylcblxuICAgICAgYXdhaXQgd3JpdGVUZXh0VG9DbGlwYm9hcmQoJ2ZhbGxiYWNrIHRleHQnKVxuXG4gICAgICBleHBlY3QoYXBwZW5kQ2hpbGRTcHkpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KG1vY2tFeGVjQ29tbWFuZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2NvcHknKVxuICAgICAgZXhwZWN0KHJlbW92ZUNoaWxkU3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBlcnJvciBoYW5kbGluZyB3aGVuIGV4ZWNDb21tYW5kIHJldHVybnMgZmFsc2VcbiAgICAgKiBleGVjQ29tbWFuZCByZXR1cm5zIGZhbHNlIHdoZW4gdGhlIG9wZXJhdGlvbiBmYWlsc1xuICAgICAqL1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGV4ZWNDb21tYW5kIGZhaWx1cmUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobmF2aWdhdG9yLCAnY2xpcGJvYXJkJywge1xuICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgbW9ja0V4ZWNDb21tYW5kID0gdmkuZm4oKS5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCA9IG1vY2tFeGVjQ29tbWFuZFxuXG4gICAgICBhd2FpdCBleHBlY3Qod3JpdGVUZXh0VG9DbGlwYm9hcmQoJ2ZhaWwgdGV4dCcpKS5yZWplY3RzLnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0IGVycm9yIGhhbmRsaW5nIHdoZW4gZXhlY0NvbW1hbmQgdGhyb3dzIGFuIGV4Y2VwdGlvblxuICAgICAqIFNob3VsZCBwcm9wYWdhdGUgdGhlIGVycm9yIHRvIHRoZSBjYWxsZXJcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBleGVjQ29tbWFuZCBleGNlcHRpb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobmF2aWdhdG9yLCAnY2xpcGJvYXJkJywge1xuICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgbW9ja0V4ZWNDb21tYW5kID0gdmkuZm4oKS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2V4ZWNDb21tYW5kIGVycm9yJylcbiAgICAgIH0pXG4gICAgICBkb2N1bWVudC5leGVjQ29tbWFuZCA9IG1vY2tFeGVjQ29tbWFuZFxuXG4gICAgICBhd2FpdCBleHBlY3Qod3JpdGVUZXh0VG9DbGlwYm9hcmQoJ2Vycm9yIHRleHQnKSkucmVqZWN0cy50b1Rocm93KCdleGVjQ29tbWFuZCBlcnJvcicpXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgcHJvcGVyIGNsZWFudXAgb2YgdGVtcG9yYXJ5IERPTSBlbGVtZW50c1xuICAgICAqIFRoZSB0ZW1wb3JhcnkgdGV4dGFyZWEgc2hvdWxkIGJlIHJlbW92ZWQgYWZ0ZXIgY29weWluZ1xuICAgICAqL1xuICAgIGl0KCdzaG91bGQgY2xlYW4gdXAgdGV4dGFyZWEgYWZ0ZXIgZmFsbGJhY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobmF2aWdhdG9yLCAnY2xpcGJvYXJkJywge1xuICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgZG9jdW1lbnQuZXhlY0NvbW1hbmQgPSB2aS5mbigpLm1vY2tSZXR1cm5WYWx1ZSh0cnVlKVxuICAgICAgY29uc3QgcmVtb3ZlQ2hpbGRTcHkgPSB2aS5zcHlPbihkb2N1bWVudC5ib2R5LCAncmVtb3ZlQ2hpbGQnKVxuXG4gICAgICBhd2FpdCB3cml0ZVRleHRUb0NsaXBib2FyZCgnY2xlYW51cCB0ZXN0JylcblxuICAgICAgZXhwZWN0KHJlbW92ZUNoaWxkU3B5KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdCBjb3B5aW5nIGVtcHR5IHN0cmluZ3NcbiAgICAgKiBTaG91bGQgaGFuZGxlIGVkZ2UgY2FzZSBvZiBlbXB0eSBjbGlwYm9hcmQgY29udGVudFxuICAgICAqL1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHN0cmluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tXcml0ZVRleHQgPSB2aS5mbigpLm1vY2tSZXNvbHZlZFZhbHVlKHVuZGVmaW5lZClcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShuYXZpZ2F0b3IsICdjbGlwYm9hcmQnLCB7XG4gICAgICAgIHZhbHVlOiB7IHdyaXRlVGV4dDogbW9ja1dyaXRlVGV4dCB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd3JpdGVUZXh0VG9DbGlwYm9hcmQoJycpXG4gICAgICBleHBlY3QobW9ja1dyaXRlVGV4dCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJycpXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3QgY29weWluZyB0ZXh0IHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzXG4gICAgICogU2hvdWxkIHByZXNlcnZlIG5ld2xpbmVzLCB0YWJzLCBxdW90ZXMsIHVuaWNvZGUsIGFuZCBlbW9qaXNcbiAgICAgKi9cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrV3JpdGVUZXh0ID0gdmkuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZSh1bmRlZmluZWQpXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobmF2aWdhdG9yLCAnY2xpcGJvYXJkJywge1xuICAgICAgICB2YWx1ZTogeyB3cml0ZVRleHQ6IG1vY2tXcml0ZVRleHQgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHNwZWNpYWxUZXh0ID0gJ1Rlc3RcXG5cXHRcInF1b3Rlc1wiXFxu5Lit5paHXFxu8J+YgCdcbiAgICAgIGF3YWl0IHdyaXRlVGV4dFRvQ2xpcGJvYXJkKHNwZWNpYWxUZXh0KVxuICAgICAgZXhwZWN0KG1vY2tXcml0ZVRleHQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHNwZWNpYWxUZXh0KVxuICAgIH0pXG4gIH0pXG59KVxuIl19