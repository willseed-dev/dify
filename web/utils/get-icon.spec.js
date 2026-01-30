"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@/config");
/**
 * Test suite for icon utility functions
 * Tests the generation of marketplace plugin icon URLs
 */
const get_icon_1 = require("./get-icon");
describe('get-icon', () => {
    describe('getIconFromMarketPlace', () => {
        /**
         * Tests basic URL generation for marketplace plugin icons
         */
        it('returns correct marketplace icon URL', () => {
            const pluginId = 'test-plugin-123';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            expect(result).toBe(`${config_1.MARKETPLACE_API_PREFIX}/plugins/${pluginId}/icon`);
        });
        /**
         * Tests URL generation with plugin IDs containing special characters
         * like dashes and underscores
         */
        it('handles plugin ID with special characters', () => {
            const pluginId = 'plugin-with-dashes_and_underscores';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            expect(result).toBe(`${config_1.MARKETPLACE_API_PREFIX}/plugins/${pluginId}/icon`);
        });
        /**
         * Tests behavior with empty plugin ID
         * Note: This creates a malformed URL but doesn't throw an error
         */
        it('handles empty plugin ID', () => {
            const pluginId = '';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            expect(result).toBe(`${config_1.MARKETPLACE_API_PREFIX}/plugins//icon`);
        });
        /**
         * Tests URL generation with plugin IDs containing spaces
         * Spaces will be URL-encoded when actually used
         */
        it('handles plugin ID with spaces', () => {
            const pluginId = 'plugin with spaces';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            expect(result).toBe(`${config_1.MARKETPLACE_API_PREFIX}/plugins/${pluginId}/icon`);
        });
        /**
         * Security tests: Path traversal attempts
         * These tests document current behavior and potential security concerns
         * Note: Current implementation does not sanitize path traversal sequences
         */
        it('handles path traversal attempts', () => {
            const pluginId = '../../../etc/passwd';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            // Current implementation includes path traversal sequences in URL
            // This is a potential security concern that should be addressed
            expect(result).toContain('../');
            expect(result).toContain(pluginId);
        });
        it('handles multiple path traversal attempts', () => {
            const pluginId = '../../../../etc/passwd';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            // Current implementation includes path traversal sequences in URL
            expect(result).toContain('../');
            expect(result).toContain(pluginId);
        });
        it('passes through URL-encoded path traversal sequences', () => {
            const pluginId = '..%2F..%2Fetc%2Fpasswd';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            expect(result).toContain(pluginId);
        });
        /**
         * Security tests: Null and undefined handling
         * These tests document current behavior with invalid input types
         * Note: Current implementation converts null/undefined to strings instead of throwing
         */
        it('handles null plugin ID', () => {
            // Current implementation converts null to string "null"
            const result = (0, get_icon_1.getIconFromMarketPlace)(null);
            expect(result).toContain('null');
            // This is a potential issue - should validate input type
        });
        it('handles undefined plugin ID', () => {
            // Current implementation converts undefined to string "undefined"
            const result = (0, get_icon_1.getIconFromMarketPlace)(undefined);
            expect(result).toContain('undefined');
            // This is a potential issue - should validate input type
        });
        /**
         * Security tests: URL-sensitive characters
         * These tests verify that URL-sensitive characters are handled appropriately
         */
        it('does not encode URL-sensitive characters', () => {
            const pluginId = 'plugin/with?special=chars#hash';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            // Note: Current implementation doesn't encode, but test documents the behavior
            expect(result).toContain(pluginId);
            expect(result).toContain('?');
            expect(result).toContain('#');
            expect(result).toContain('=');
        });
        it('handles URL characters like & and %', () => {
            const pluginId = 'plugin&with%encoding';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            expect(result).toContain(pluginId);
        });
        /**
         * Edge case tests: Extreme inputs
         * These tests verify behavior with unusual but valid inputs
         */
        it('handles very long plugin ID', () => {
            const pluginId = 'a'.repeat(10000);
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            expect(result).toContain(pluginId);
            expect(result.length).toBeGreaterThan(10000);
        });
        it('handles Unicode characters', () => {
            const pluginId = '插件-🚀-测试-日本語';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            expect(result).toContain(pluginId);
        });
        it('handles control characters', () => {
            const pluginId = 'plugin\nwith\ttabs\r\nand\0null';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            expect(result).toContain(pluginId);
        });
        /**
         * Security tests: XSS attempts
         * These tests verify that XSS attempts are handled appropriately
         */
        it('handles XSS attempts with script tags', () => {
            const pluginId = '<script>alert("xss")</script>';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            expect(result).toContain(pluginId);
            // Note: Current implementation doesn't sanitize, but test documents the behavior
        });
        it('handles XSS attempts with event handlers', () => {
            const pluginId = 'plugin"onerror="alert(1)"';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            expect(result).toContain(pluginId);
        });
        it('handles XSS attempts with encoded script tags', () => {
            const pluginId = '%3Cscript%3Ealert%28%22xss%22%29%3C%2Fscript%3E';
            const result = (0, get_icon_1.getIconFromMarketPlace)(pluginId);
            expect(result).toContain(pluginId);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWljb24uc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdldC1pY29uLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBaUQ7QUFDakQ7OztHQUdHO0FBQ0gseUNBQW1EO0FBRW5ELFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO0lBQ3hCLFFBQVEsQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUU7UUFDdEM7O1dBRUc7UUFDSCxFQUFFLENBQUMsc0NBQXNDLEVBQUUsR0FBRyxFQUFFO1lBQzlDLE1BQU0sUUFBUSxHQUFHLGlCQUFpQixDQUFBO1lBQ2xDLE1BQU0sTUFBTSxHQUFHLElBQUEsaUNBQXNCLEVBQUMsUUFBUSxDQUFDLENBQUE7WUFDL0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLCtCQUFzQixZQUFZLFFBQVEsT0FBTyxDQUFDLENBQUE7UUFDM0UsQ0FBQyxDQUFDLENBQUE7UUFFRjs7O1dBR0c7UUFDSCxFQUFFLENBQUMsMkNBQTJDLEVBQUUsR0FBRyxFQUFFO1lBQ25ELE1BQU0sUUFBUSxHQUFHLG9DQUFvQyxDQUFBO1lBQ3JELE1BQU0sTUFBTSxHQUFHLElBQUEsaUNBQXNCLEVBQUMsUUFBUSxDQUFDLENBQUE7WUFDL0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLCtCQUFzQixZQUFZLFFBQVEsT0FBTyxDQUFDLENBQUE7UUFDM0UsQ0FBQyxDQUFDLENBQUE7UUFFRjs7O1dBR0c7UUFDSCxFQUFFLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFO1lBQ2pDLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQTtZQUNuQixNQUFNLE1BQU0sR0FBRyxJQUFBLGlDQUFzQixFQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRywrQkFBc0IsZ0JBQWdCLENBQUMsQ0FBQTtRQUNoRSxD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QUFBO1FBRUY7OztXQUdHO1FBQ0gsRUFBRSxDQUFDLHVDQUF1QyxFQUFFLEdBQUcsRUFBRTtZQUMvQyxNQUFNLFFBQVEsR0FBRywrQkFBK0IsQ0FBQTtZQUNoRCxNQUFNLE1BQU0sR0FBRyxJQUFBLGlDQUFzQixFQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDbEMsaUZBQWlGO1FBQ25GLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBDQUEwQyxFQUFFLEdBQUcsRUFBRTtZQUNsRCxNQUFNLFFBQVEsR0FBRywyQkFBMkIsQ0FBQTtZQUM1QyxNQUFNLE1BQU0sR0FBRyxJQUFBLGlDQUFzQixFQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQy9DLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDcEMsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsK0NBQStDLEVBQUUsR0FBRyxFQUFFO1lBQ3ZELE1BQU0sUUFBUSxHQUFHLGlEQUFpRCxDQUFBO1lBQ2xFLE1BQU0sTUFBTSxHQUFHLElBQUEsaUNBQXNCLEVBQUMsUUFBUSxDQUFDLENBQUE7WUFDL0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNwQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNQVJLRVRQTEFDRV9BUElfUFJFRklYIH0gZnJvbSAnQC9jb25maWcnXG4vKipcbiAqIFRlc3Qgc3VpdGUgZm9yIGljb24gdXRpbGl0eSBmdW5jdGlvbnNcbiAqIFRlc3RzIHRoZSBnZW5lcmF0aW9uIG9mIG1hcmtldHBsYWNlIHBsdWdpbiBpY29uIFVSTHNcbiAqL1xuaW1wb3J0IHsgZ2V0SWNvbkZyb21NYXJrZXRQbGFjZSB9IGZyb20gJy4vZ2V0LWljb24nXG5cbmRlc2NyaWJlKCdnZXQtaWNvbicsICgpID0+IHtcbiAgZGVzY3JpYmUoJ2dldEljb25Gcm9tTWFya2V0UGxhY2UnLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdHMgYmFzaWMgVVJMIGdlbmVyYXRpb24gZm9yIG1hcmtldHBsYWNlIHBsdWdpbiBpY29uc1xuICAgICAqL1xuICAgIGl0KCdyZXR1cm5zIGNvcnJlY3QgbWFya2V0cGxhY2UgaWNvbiBVUkwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5JZCA9ICd0ZXN0LXBsdWdpbi0xMjMnXG4gICAgICBjb25zdCByZXN1bHQgPSBnZXRJY29uRnJvbU1hcmtldFBsYWNlKHBsdWdpbklkKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZShgJHtNQVJLRVRQTEFDRV9BUElfUFJFRklYfS9wbHVnaW5zLyR7cGx1Z2luSWR9L2ljb25gKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0cyBVUkwgZ2VuZXJhdGlvbiB3aXRoIHBsdWdpbiBJRHMgY29udGFpbmluZyBzcGVjaWFsIGNoYXJhY3RlcnNcbiAgICAgKiBsaWtlIGRhc2hlcyBhbmQgdW5kZXJzY29yZXNcbiAgICAgKi9cbiAgICBpdCgnaGFuZGxlcyBwbHVnaW4gSUQgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5JZCA9ICdwbHVnaW4td2l0aC1kYXNoZXNfYW5kX3VuZGVyc2NvcmVzJ1xuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0SWNvbkZyb21NYXJrZXRQbGFjZShwbHVnaW5JZClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoYCR7TUFSS0VUUExBQ0VfQVBJX1BSRUZJWH0vcGx1Z2lucy8ke3BsdWdpbklkfS9pY29uYClcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogVGVzdHMgYmVoYXZpb3Igd2l0aCBlbXB0eSBwbHVnaW4gSURcbiAgICAgKiBOb3RlOiBUaGlzIGNyZWF0ZXMgYSBtYWxmb3JtZWQgVVJMIGJ1dCBkb2Vzbid0IHRocm93IGFuIGVycm9yXG4gICAgICovXG4gICAgaXQoJ2hhbmRsZXMgZW1wdHkgcGx1Z2luIElEJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luSWQgPSAnJ1xuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0SWNvbkZyb21NYXJrZXRQbGFjZShwbHVnaW5JZClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoYCR7TUFSS0VUUExBQ0VfQVBJX1BSRUZJWH0vcGx1Z2lucy8vaWNvbmApXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3RzIFVSTCBnZW5lcmF0aW9uIHdpdGggcGx1Z2luIElEcyBjb250YWluaW5nIHNwYWNlc1xuICAgICAqIFNwYWNlcyB3aWxsIGJlIFVSTC1lbmNvZGVkIHdoZW4gYWN0dWFsbHkgdXNlZFxuICAgICAqL1xuICAgIGl0KCdoYW5kbGVzIHBsdWdpbiBJRCB3aXRoIHNwYWNlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbklkID0gJ3BsdWdpbiB3aXRoIHNwYWNlcydcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldEljb25Gcm9tTWFya2V0UGxhY2UocGx1Z2luSWQpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKGAke01BUktFVFBMQUNFX0FQSV9QUkVGSVh9L3BsdWdpbnMvJHtwbHVnaW5JZH0vaWNvbmApXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFNlY3VyaXR5IHRlc3RzOiBQYXRoIHRyYXZlcnNhbCBhdHRlbXB0c1xuICAgICAqIFRoZXNlIHRlc3RzIGRvY3VtZW50IGN1cnJlbnQgYmVoYXZpb3IgYW5kIHBvdGVudGlhbCBzZWN1cml0eSBjb25jZXJuc1xuICAgICAqIE5vdGU6IEN1cnJlbnQgaW1wbGVtZW50YXRpb24gZG9lcyBub3Qgc2FuaXRpemUgcGF0aCB0cmF2ZXJzYWwgc2VxdWVuY2VzXG4gICAgICovXG4gICAgaXQoJ2hhbmRsZXMgcGF0aCB0cmF2ZXJzYWwgYXR0ZW1wdHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5JZCA9ICcuLi8uLi8uLi9ldGMvcGFzc3dkJ1xuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0SWNvbkZyb21NYXJrZXRQbGFjZShwbHVnaW5JZClcbiAgICAgIC8vIEN1cnJlbnQgaW1wbGVtZW50YXRpb24gaW5jbHVkZXMgcGF0aCB0cmF2ZXJzYWwgc2VxdWVuY2VzIGluIFVSTFxuICAgICAgLy8gVGhpcyBpcyBhIHBvdGVudGlhbCBzZWN1cml0eSBjb25jZXJuIHRoYXQgc2hvdWxkIGJlIGFkZHJlc3NlZFxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKCcuLi8nKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKHBsdWdpbklkKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBtdWx0aXBsZSBwYXRoIHRyYXZlcnNhbCBhdHRlbXB0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbklkID0gJy4uLy4uLy4uLy4uL2V0Yy9wYXNzd2QnXG4gICAgICBjb25zdCByZXN1bHQgPSBnZXRJY29uRnJvbU1hcmtldFBsYWNlKHBsdWdpbklkKVxuICAgICAgLy8gQ3VycmVudCBpbXBsZW1lbnRhdGlvbiBpbmNsdWRlcyBwYXRoIHRyYXZlcnNhbCBzZXF1ZW5jZXMgaW4gVVJMXG4gICAgICBleHBlY3QocmVzdWx0KS50b0NvbnRhaW4oJy4uLycpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0NvbnRhaW4ocGx1Z2luSWQpXG4gICAgfSlcblxuICAgIGl0KCdwYXNzZXMgdGhyb3VnaCBVUkwtZW5jb2RlZCBwYXRoIHRyYXZlcnNhbCBzZXF1ZW5jZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5JZCA9ICcuLiUyRi4uJTJGZXRjJTJGcGFzc3dkJ1xuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0SWNvbkZyb21NYXJrZXRQbGFjZShwbHVnaW5JZClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbihwbHVnaW5JZClcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogU2VjdXJpdHkgdGVzdHM6IE51bGwgYW5kIHVuZGVmaW5lZCBoYW5kbGluZ1xuICAgICAqIFRoZXNlIHRlc3RzIGRvY3VtZW50IGN1cnJlbnQgYmVoYXZpb3Igd2l0aCBpbnZhbGlkIGlucHV0IHR5cGVzXG4gICAgICogTm90ZTogQ3VycmVudCBpbXBsZW1lbnRhdGlvbiBjb252ZXJ0cyBudWxsL3VuZGVmaW5lZCB0byBzdHJpbmdzIGluc3RlYWQgb2YgdGhyb3dpbmdcbiAgICAgKi9cbiAgICBpdCgnaGFuZGxlcyBudWxsIHBsdWdpbiBJRCcsICgpID0+IHtcbiAgICAgIC8vIEN1cnJlbnQgaW1wbGVtZW50YXRpb24gY29udmVydHMgbnVsbCB0byBzdHJpbmcgXCJudWxsXCJcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldEljb25Gcm9tTWFya2V0UGxhY2UobnVsbCBhcyBhbnkpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0NvbnRhaW4oJ251bGwnKVxuICAgICAgLy8gVGhpcyBpcyBhIHBvdGVudGlhbCBpc3N1ZSAtIHNob3VsZCB2YWxpZGF0ZSBpbnB1dCB0eXBlXG4gICAgfSlcblxuICAgIGl0KCdoYW5kbGVzIHVuZGVmaW5lZCBwbHVnaW4gSUQnLCAoKSA9PiB7XG4gICAgICAvLyBDdXJyZW50IGltcGxlbWVudGF0aW9uIGNvbnZlcnRzIHVuZGVmaW5lZCB0byBzdHJpbmcgXCJ1bmRlZmluZWRcIlxuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0SWNvbkZyb21NYXJrZXRQbGFjZSh1bmRlZmluZWQgYXMgYW55KVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKCd1bmRlZmluZWQnKVxuICAgICAgLy8gVGhpcyBpcyBhIHBvdGVudGlhbCBpc3N1ZSAtIHNob3VsZCB2YWxpZGF0ZSBpbnB1dCB0eXBlXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFNlY3VyaXR5IHRlc3RzOiBVUkwtc2Vuc2l0aXZlIGNoYXJhY3RlcnNcbiAgICAgKiBUaGVzZSB0ZXN0cyB2ZXJpZnkgdGhhdCBVUkwtc2Vuc2l0aXZlIGNoYXJhY3RlcnMgYXJlIGhhbmRsZWQgYXBwcm9wcmlhdGVseVxuICAgICAqL1xuICAgIGl0KCdkb2VzIG5vdCBlbmNvZGUgVVJMLXNlbnNpdGl2ZSBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luSWQgPSAncGx1Z2luL3dpdGg/c3BlY2lhbD1jaGFycyNoYXNoJ1xuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0SWNvbkZyb21NYXJrZXRQbGFjZShwbHVnaW5JZClcbiAgICAgIC8vIE5vdGU6IEN1cnJlbnQgaW1wbGVtZW50YXRpb24gZG9lc24ndCBlbmNvZGUsIGJ1dCB0ZXN0IGRvY3VtZW50cyB0aGUgYmVoYXZpb3JcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbihwbHVnaW5JZClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbignPycpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0NvbnRhaW4oJyMnKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKCc9JylcbiAgICB9KVxuXG4gICAgaXQoJ2hhbmRsZXMgVVJMIGNoYXJhY3RlcnMgbGlrZSAmIGFuZCAlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luSWQgPSAncGx1Z2luJndpdGglZW5jb2RpbmcnXG4gICAgICBjb25zdCByZXN1bHQgPSBnZXRJY29uRnJvbU1hcmtldFBsYWNlKHBsdWdpbklkKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKHBsdWdpbklkKVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBFZGdlIGNhc2UgdGVzdHM6IEV4dHJlbWUgaW5wdXRzXG4gICAgICogVGhlc2UgdGVzdHMgdmVyaWZ5IGJlaGF2aW9yIHdpdGggdW51c3VhbCBidXQgdmFsaWQgaW5wdXRzXG4gICAgICovXG4gICAgaXQoJ2hhbmRsZXMgdmVyeSBsb25nIHBsdWdpbiBJRCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbklkID0gJ2EnLnJlcGVhdCgxMDAwMClcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGdldEljb25Gcm9tTWFya2V0UGxhY2UocGx1Z2luSWQpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0NvbnRhaW4ocGx1Z2luSWQpXG4gICAgICBleHBlY3QocmVzdWx0Lmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDEwMDAwKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBVbmljb2RlIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5JZCA9ICfmj5Lku7Yt8J+agC3mtYvor5Ut5pel5pys6KqeJ1xuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0SWNvbkZyb21NYXJrZXRQbGFjZShwbHVnaW5JZClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbihwbHVnaW5JZClcbiAgICB9KVxuXG4gICAgaXQoJ2hhbmRsZXMgY29udHJvbCBjaGFyYWN0ZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luSWQgPSAncGx1Z2luXFxud2l0aFxcdHRhYnNcXHJcXG5hbmRcXDBudWxsJ1xuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0SWNvbkZyb21NYXJrZXRQbGFjZShwbHVnaW5JZClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbihwbHVnaW5JZClcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogU2VjdXJpdHkgdGVzdHM6IFhTUyBhdHRlbXB0c1xuICAgICAqIFRoZXNlIHRlc3RzIHZlcmlmeSB0aGF0IFhTUyBhdHRlbXB0cyBhcmUgaGFuZGxlZCBhcHByb3ByaWF0ZWx5XG4gICAgICovXG4gICAgaXQoJ2hhbmRsZXMgWFNTIGF0dGVtcHRzIHdpdGggc2NyaXB0IHRhZ3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5JZCA9ICc8c2NyaXB0PmFsZXJ0KFwieHNzXCIpPC9zY3JpcHQ+J1xuICAgICAgY29uc3QgcmVzdWx0ID0gZ2V0SWNvbkZyb21NYXJrZXRQbGFjZShwbHVnaW5JZClcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbihwbHVnaW5JZClcbiAgICAgIC8vIE5vdGU6IEN1cnJlbnQgaW1wbGVtZW50YXRpb24gZG9lc24ndCBzYW5pdGl6ZSwgYnV0IHRlc3QgZG9jdW1lbnRzIHRoZSBiZWhhdmlvclxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBYU1MgYXR0ZW1wdHMgd2l0aCBldmVudCBoYW5kbGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbklkID0gJ3BsdWdpblwib25lcnJvcj1cImFsZXJ0KDEpXCInXG4gICAgICBjb25zdCByZXN1bHQgPSBnZXRJY29uRnJvbU1hcmtldFBsYWNlKHBsdWdpbklkKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKHBsdWdpbklkKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBYU1MgYXR0ZW1wdHMgd2l0aCBlbmNvZGVkIHNjcmlwdCB0YWdzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luSWQgPSAnJTNDc2NyaXB0JTNFYWxlcnQlMjglMjJ4c3MlMjIlMjklM0MlMkZzY3JpcHQlM0UnXG4gICAgICBjb25zdCByZXN1bHQgPSBnZXRJY29uRnJvbU1hcmtldFBsYWNlKHBsdWdpbklkKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKHBsdWdpbklkKVxuICAgIH0pXG4gIH0pXG59KVxuIl19