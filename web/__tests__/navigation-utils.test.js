"use strict";
/**
 * Navigation Utilities Test
 *
 * Tests for the navigation utility functions to ensure they handle
 * query parameter preservation correctly across different scenarios.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("@/utils/navigation");
// Mock router for testing
const mockPush = vi.fn();
const mockRouter = { push: mockPush };
describe('Navigation Utilities', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('createNavigationPath', () => {
        it('preserves query parameters by default', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=3&limit=10&keyword=test' },
                writable: true,
            });
            const path = (0, navigation_1.createNavigationPath)('/datasets/123/documents');
            expect(path).toBe('/datasets/123/documents?page=3&limit=10&keyword=test');
        });
        it('returns clean path when preserveParams is false', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=3&limit=10' },
                writable: true,
            });
            const path = (0, navigation_1.createNavigationPath)('/datasets/123/documents', false);
            expect(path).toBe('/datasets/123/documents');
        });
        it('handles empty query parameters', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '' },
                writable: true,
            });
            const path = (0, navigation_1.createNavigationPath)('/datasets/123/documents');
            expect(path).toBe('/datasets/123/documents');
        });
        it('handles errors gracefully', () => {
            // Mock window.location to throw an error
            Object.defineProperty(window, 'location', {
                get: () => {
                    throw new Error('Location access denied');
                },
                configurable: true,
            });
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            const path = (0, navigation_1.createNavigationPath)('/datasets/123/documents');
            expect(path).toBe('/datasets/123/documents');
            expect(consoleSpy).toHaveBeenCalledWith('Failed to preserve query parameters:', expect.any(Error));
            consoleSpy.mockRestore();
        });
    });
    describe('createBackNavigation', () => {
        it('creates function that navigates with preserved params', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=2&limit=25' },
                writable: true,
            });
            const backFn = (0, navigation_1.createBackNavigation)(mockRouter, '/datasets/123/documents');
            backFn();
            expect(mockPush).toHaveBeenCalledWith('/datasets/123/documents?page=2&limit=25');
        });
        it('creates function that navigates without params when specified', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=2&limit=25' },
                writable: true,
            });
            const backFn = (0, navigation_1.createBackNavigation)(mockRouter, '/datasets/123/documents', false);
            backFn();
            expect(mockPush).toHaveBeenCalledWith('/datasets/123/documents');
        });
    });
    describe('extractQueryParams', () => {
        it('extracts specified parameters', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=3&limit=10&keyword=test&other=value' },
                writable: true,
            });
            const params = (0, navigation_1.extractQueryParams)(['page', 'limit', 'keyword']);
            expect(params).toEqual({
                page: '3',
                limit: '10',
                keyword: 'test',
            });
        });
        it('handles missing parameters', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=3' },
                writable: true,
            });
            const params = (0, navigation_1.extractQueryParams)(['page', 'limit', 'missing']);
            expect(params).toEqual({
                page: '3',
            });
        });
        it('handles errors gracefully', () => {
            Object.defineProperty(window, 'location', {
                get: () => {
                    throw new Error('Location access denied');
                },
                configurable: true,
            });
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            const params = (0, navigation_1.extractQueryParams)(['page', 'limit']);
            expect(params).toEqual({});
            expect(consoleSpy).toHaveBeenCalledWith('Failed to extract query parameters:', expect.any(Error));
            consoleSpy.mockRestore();
        });
    });
    describe('createNavigationPathWithParams', () => {
        it('creates path with specified parameters', () => {
            const path = (0, navigation_1.createNavigationPathWithParams)('/datasets/123/documents', {
                page: 1,
                limit: 25,
                keyword: 'search term',
            });
            expect(path).toBe('/datasets/123/documents?page=1&limit=25&keyword=search+term');
        });
        it('filters out empty values', () => {
            const path = (0, navigation_1.createNavigationPathWithParams)('/datasets/123/documents', {
                page: 1,
                limit: '',
                keyword: 'test',
                filter: '',
            });
            expect(path).toBe('/datasets/123/documents?page=1&keyword=test');
        });
        it('handles errors gracefully', () => {
            // Mock URLSearchParams to throw an error
            const originalURLSearchParams = globalThis.URLSearchParams;
            globalThis.URLSearchParams = vi.fn(() => {
                throw new Error('URLSearchParams error');
            });
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            const path = (0, navigation_1.createNavigationPathWithParams)('/datasets/123/documents', { page: 1 });
            expect(path).toBe('/datasets/123/documents');
            expect(consoleSpy).toHaveBeenCalledWith('Failed to create navigation path with params:', expect.any(Error));
            consoleSpy.mockRestore();
            globalThis.URLSearchParams = originalURLSearchParams;
        });
    });
    describe('mergeQueryParams', () => {
        it('merges new params with existing ones', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=3&limit=10' },
                writable: true,
            });
            const merged = (0, navigation_1.mergeQueryParams)({ keyword: 'test', page: '1' });
            const result = merged.toString();
            expect(result).toContain('page=1'); // overridden
            expect(result).toContain('limit=10'); // preserved
            expect(result).toContain('keyword=test'); // added
        });
        it('removes parameters when value is null', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=3&limit=10&keyword=test' },
                writable: true,
            });
            const merged = (0, navigation_1.mergeQueryParams)({ keyword: null, filter: 'active' });
            const result = merged.toString();
            expect(result).toContain('page=3');
            expect(result).toContain('limit=10');
            expect(result).not.toContain('keyword');
            expect(result).toContain('filter=active');
        });
        it('creates fresh params when preserveExisting is false', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=3&limit=10' },
                writable: true,
            });
            const merged = (0, navigation_1.mergeQueryParams)({ keyword: 'test' }, false);
            const result = merged.toString();
            expect(result).toBe('keyword=test');
        });
    });
    describe('datasetNavigation', () => {
        it('backToDocuments creates correct navigation function', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=2&limit=25' },
                writable: true,
            });
            const backFn = navigation_1.datasetNavigation.backToDocuments(mockRouter, 'dataset-123');
            backFn();
            expect(mockPush).toHaveBeenCalledWith('/datasets/dataset-123/documents?page=2&limit=25');
        });
        it('toDocumentDetail creates correct navigation function', () => {
            const detailFn = navigation_1.datasetNavigation.toDocumentDetail(mockRouter, 'dataset-123', 'doc-456');
            detailFn();
            expect(mockPush).toHaveBeenCalledWith('/datasets/dataset-123/documents/doc-456');
        });
        it('toDocumentSettings creates correct navigation function', () => {
            const settingsFn = navigation_1.datasetNavigation.toDocumentSettings(mockRouter, 'dataset-123', 'doc-456');
            settingsFn();
            expect(mockPush).toHaveBeenCalledWith('/datasets/dataset-123/documents/doc-456/settings');
        });
    });
    describe('Real-world Integration Scenarios', () => {
        it('complete user workflow: list -> detail -> back', () => {
            // User starts on page 3 with search
            Object.defineProperty(window, 'location', {
                value: { search: '?page=3&keyword=API&limit=25' },
                writable: true,
            });
            // Create back navigation function (as would be done in detail component)
            const backToDocuments = navigation_1.datasetNavigation.backToDocuments(mockRouter, 'main-dataset');
            // User clicks back
            backToDocuments();
            // Should return to exact same list state
            expect(mockPush).toHaveBeenCalledWith('/datasets/main-dataset/documents?page=3&keyword=API&limit=25');
        });
        it('user applies filters then views document', () => {
            // Complex filter state
            Object.defineProperty(window, 'location', {
                value: { search: '?page=1&limit=50&status=active&type=pdf&sort=created_at&order=desc' },
                writable: true,
            });
            const backFn = (0, navigation_1.createBackNavigation)(mockRouter, '/datasets/filtered-set/documents');
            backFn();
            expect(mockPush).toHaveBeenCalledWith('/datasets/filtered-set/documents?page=1&limit=50&status=active&type=pdf&sort=created_at&order=desc');
        });
    });
    describe('Edge Cases and Error Handling', () => {
        it('handles special characters in query parameters', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?keyword=hello%20world&filter=type%3Apdf&tag=%E4%B8%AD%E6%96%87' },
                writable: true,
            });
            const path = (0, navigation_1.createNavigationPath)('/datasets/123/documents');
            expect(path).toContain('hello+world');
            expect(path).toContain('type%3Apdf');
            expect(path).toContain('%E4%B8%AD%E6%96%87');
        });
        it('handles duplicate query parameters', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?tag=tag1&tag=tag2&tag=tag3' },
                writable: true,
            });
            const params = (0, navigation_1.extractQueryParams)(['tag']);
            // URLSearchParams.get() returns the first value
            expect(params.tag).toBe('tag1');
        });
        it('handles very long query strings', () => {
            const longValue = 'a'.repeat(1000);
            Object.defineProperty(window, 'location', {
                value: { search: `?data=${longValue}` },
                writable: true,
            });
            const path = (0, navigation_1.createNavigationPath)('/datasets/123/documents');
            expect(path).toContain(longValue);
            expect(path.length).toBeGreaterThan(1000);
        });
        it('handles empty string values in query parameters', () => {
            const path = (0, navigation_1.createNavigationPathWithParams)('/datasets/123/documents', {
                page: 1,
                keyword: '',
                filter: '',
                sort: 'name',
            });
            expect(path).toBe('/datasets/123/documents?page=1&sort=name');
            expect(path).not.toContain('keyword=');
            expect(path).not.toContain('filter=');
        });
        it('handles null and undefined values in mergeQueryParams', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=1&limit=10&keyword=test' },
                writable: true,
            });
            const merged = (0, navigation_1.mergeQueryParams)({
                keyword: null,
                filter: undefined,
                sort: 'name',
            });
            const result = merged.toString();
            expect(result).toContain('page=1');
            expect(result).toContain('limit=10');
            expect(result).not.toContain('keyword');
            expect(result).toContain('sort=name');
        });
        it('handles navigation with hash fragments', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=1', hash: '#section-2' },
                writable: true,
            });
            const path = (0, navigation_1.createNavigationPath)('/datasets/123/documents');
            // Should preserve query params but not hash
            expect(path).toBe('/datasets/123/documents?page=1');
        });
        it('handles malformed query strings gracefully', () => {
            Object.defineProperty(window, 'location', {
                value: { search: '?page=1&invalid&limit=10&=value&key=' },
                writable: true,
            });
            const params = (0, navigation_1.extractQueryParams)(['page', 'limit', 'invalid', 'key']);
            expect(params.page).toBe('1');
            expect(params.limit).toBe('10');
            // Malformed params should be handled by URLSearchParams
            expect(params.invalid).toBe(''); // for `&invalid`
            expect(params.key).toBe(''); // for `&key=`
        });
    });
    describe('Performance Tests', () => {
        it('handles large number of query parameters efficiently', () => {
            const manyParams = Array.from({ length: 50 }, (_, i) => `param${i}=value${i}`).join('&');
            Object.defineProperty(window, 'location', {
                value: { search: `?${manyParams}` },
                writable: true,
            });
            const startTime = Date.now();
            const path = (0, navigation_1.createNavigationPath)('/datasets/123/documents');
            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThan(50); // Should be fast
            expect(path).toContain('param0=value0');
            expect(path).toContain('param49=value49');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi11dGlscy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmF2aWdhdGlvbi11dGlscy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7R0FLRzs7QUFFSCxtREFPMkI7QUFFM0IsMEJBQTBCO0FBQzFCLE1BQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUN4QixNQUFNLFVBQVUsR0FBRyxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsQ0FBQTtBQUVyQyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO0lBQ3BDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDcEIsQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7WUFDL0MsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO2dCQUN4QyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsK0JBQStCLEVBQUU7Z0JBQ2xELFFBQVEsRUFBRSxJQUFJO2FBQ2YsQ0FBQyxDQUFBO1lBRUYsTUFBTSxJQUFJLEdBQUcsSUFBQSxpQ0FBb0IsRUFBQyx5QkFBeUIsQ0FBQyxDQUFBO1lBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsc0RBQXNELENBQUMsQ0FBQTtRQUMzRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7WUFDekQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO2dCQUN4QyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsa0JBQWtCLEVBQUU7Z0JBQ3JDLFFBQVEsRUFBRSxJQUFJO2FBQ2YsQ0FBQyxDQUFBO1lBRUYsTUFBTSxJQUFJLEdBQUcsSUFB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Q0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRTtnQkFDeEMsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksVUFBVSxFQUFFLEVBQUU7Z0JBQ25DLFFBQVEsRUFBRSxJQUFJO2FBQ2YsQ0FBQyxDQUFBO1lBRUYsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFBO1lBQzVCLE1BQU0sSUFBSSxHQUFHLElBQUEsaUNBQW9CLEVBQUMseUJBQXlCLENBQUMsQ0FBQTtZQUM1RCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUE7WUFFMUIsTUFBTSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLENBQUEsQ0FBQyxpQkFBaUI7WUFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLENBQUE7UUFDM0MsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBOYXZpZ2F0aW9uIFV0aWxpdGllcyBUZXN0XG4gKlxuICogVGVzdHMgZm9yIHRoZSBuYXZpZ2F0aW9uIHV0aWxpdHkgZnVuY3Rpb25zIHRvIGVuc3VyZSB0aGV5IGhhbmRsZVxuICogcXVlcnkgcGFyYW1ldGVyIHByZXNlcnZhdGlvbiBjb3JyZWN0bHkgYWNyb3NzIGRpZmZlcmVudCBzY2VuYXJpb3MuXG4gKi9cblxuaW1wb3J0IHtcbiAgY3JlYXRlQmFja05hdmlnYXRpb24sXG4gIGNyZWF0ZU5hdmlnYXRpb25QYXRoLFxuICBjcmVhdGVOYXZpZ2F0aW9uUGF0aFdpdGhQYXJhbXMsXG4gIGRhdGFzZXROYXZpZ2F0aW9uLFxuICBleHRyYWN0UXVlcnlQYXJhbXMsXG4gIG1lcmdlUXVlcnlQYXJhbXMsXG59IGZyb20gJ0AvdXRpbHMvbmF2aWdhdGlvbidcblxuLy8gTW9jayByb3V0ZXIgZm9yIHRlc3RpbmdcbmNvbnN0IG1vY2tQdXNoID0gdmkuZm4oKVxuY29uc3QgbW9ja1JvdXRlciA9IHsgcHVzaDogbW9ja1B1c2ggfVxuXG5kZXNjcmliZSgnTmF2aWdhdGlvbiBVdGlsaXRpZXMnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdjcmVhdGVOYXZpZ2F0aW9uUGF0aCcsICgpID0+IHtcbiAgICBpdCgncHJlc2VydmVzIHF1ZXJ5IHBhcmFtZXRlcnMgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdsb2NhdGlvbicsIHtcbiAgICAgICAgdmFsdWU6IHsgc2VhcmNoOiAnP3BhZ2U9MyZsaW1pdD0xMCZrZXl3b3JkPXRlc3QnIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcGF0aCA9IGNyZWF0ZU5hdmlnYXRpb25QYXRoKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycpXG4gICAgICBleHBlY3QocGF0aCkudG9CZSgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHM/cGFnZT0zJmxpbWl0PTEwJmtleXdvcmQ9dGVzdCcpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIGNsZWFuIHBhdGggd2hlbiBwcmVzZXJ2ZVBhcmFtcyBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdsb2NhdGlvbicsIHtcbiAgICAgICAgdmFsdWU6IHsgc2VhcmNoOiAnP3BhZ2U9MyZsaW1pdD0xMCcgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwYXRoID0gY3JlYXRlTmF2aWdhdGlvblBhdGgoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzJywgZmFsc2UpXG4gICAgICBleHBlY3QocGF0aCkudG9CZSgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBlbXB0eSBxdWVyeSBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2xvY2F0aW9uJywge1xuICAgICAgICB2YWx1ZTogeyBzZWFyY2g6ICcnIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcGF0aCA9IGNyZWF0ZU5hdmlnYXRpb25QYXRoKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycpXG4gICAgICBleHBlY3QocGF0aCkudG9CZSgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBlcnJvcnMgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIC8vIE1vY2sgd2luZG93LmxvY2F0aW9uIHRvIHRocm93IGFuIGVycm9yXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnbG9jYXRpb24nLCB7XG4gICAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTG9jYXRpb24gYWNjZXNzIGRlbmllZCcpXG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNvbnNvbGVTcHkgPSB2aS5zcHlPbihjb25zb2xlLCAnd2FybicpLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7IC8qIG5vb3AgKi8gfSlcbiAgICAgIGNvbnN0IHBhdGggPSBjcmVhdGVOYXZpZ2F0aW9uUGF0aCgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnKVxuXG4gICAgICBleHBlY3QocGF0aCkudG9CZSgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnKVxuICAgICAgZXhwZWN0KGNvbnNvbGVTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdGYWlsZWQgdG8gcHJlc2VydmUgcXVlcnkgcGFyYW1ldGVyczonLCBleHBlY3QuYW55KEVycm9yKSlcblxuICAgICAgY29uc29sZVNweS5tb2NrUmVzdG9yZSgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnY3JlYXRlQmFja05hdmlnYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ2NyZWF0ZXMgZnVuY3Rpb24gdGhhdCBuYXZpZ2F0ZXMgd2l0aCBwcmVzZXJ2ZWQgcGFyYW1zJywgKCkgPT4ge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2xvY2F0aW9uJywge1xuICAgICAgICB2YWx1ZTogeyBzZWFyY2g6ICc/cGFnZT0yJmxpbWl0PTI1JyB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGJhY2tGbiA9IGNyZWF0ZUJhY2tOYXZpZ2F0aW9uKG1vY2tSb3V0ZXIsICcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycpXG4gICAgICBiYWNrRm4oKVxuXG4gICAgICBleHBlY3QobW9ja1B1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cz9wYWdlPTImbGltaXQ9MjUnKVxuICAgIH0pXG5cbiAgICBpdCgnY3JlYXRlcyBmdW5jdGlvbiB0aGF0IG5hdmlnYXRlcyB3aXRob3V0IHBhcmFtcyB3aGVuIHNwZWNpZmllZCcsICgpID0+IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdsb2NhdGlvbicsIHtcbiAgICAgICAgdmFsdWU6IHsgc2VhcmNoOiAnP3BhZ2U9MiZsaW1pdD0yNScgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBiYWNrRm4gPSBjcmVhdGVCYWNrTmF2aWdhdGlvbihtb2NrUm91dGVyLCAnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnLCBmYWxzZSlcbiAgICAgIGJhY2tGbigpXG5cbiAgICAgIGV4cGVjdChtb2NrUHVzaCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdleHRyYWN0UXVlcnlQYXJhbXMnLCAoKSA9PiB7XG4gICAgaXQoJ2V4dHJhY3RzIHNwZWNpZmllZCBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2xvY2F0aW9uJywge1xuICAgICAgICB2YWx1ZTogeyBzZWFyY2g6ICc/cGFnZT0zJmxpbWl0PTEwJmtleXdvcmQ9dGVzdCZvdGhlcj12YWx1ZScgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwYXJhbXMgPSBleHRyYWN0UXVlcnlQYXJhbXMoWydwYWdlJywgJ2xpbWl0JywgJ2tleXdvcmQnXSlcbiAgICAgIGV4cGVjdChwYXJhbXMpLnRvRXF1YWwoe1xuICAgICAgICBwYWdlOiAnMycsXG4gICAgICAgIGxpbWl0OiAnMTAnLFxuICAgICAgICBrZXl3b3JkOiAndGVzdCcsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBtaXNzaW5nIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnbG9jYXRpb24nLCB7XG4gICAgICAgIHZhbHVlOiB7IHNlYXJjaDogJz9wYWdlPTMnIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcGFyYW1zID0gZXh0cmFjdFF1ZXJ5UGFyYW1zKFsncGFnZScsICdsaW1pdCcsICdtaXNzaW5nJ10pXG4gICAgICBleHBlY3QocGFyYW1zKS50b0VxdWFsKHtcbiAgICAgICAgcGFnZTogJzMnLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ2hhbmRsZXMgZXJyb3JzIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnbG9jYXRpb24nLCB7XG4gICAgICAgIGdldDogKCkgPT4ge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTG9jYXRpb24gYWNjZXNzIGRlbmllZCcpXG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNvbnNvbGVTcHkgPSB2aS5zcHlPbihjb25zb2xlLCAnd2FybicpLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7IC8qIG5vb3AgKi8gfSlcbiAgICAgIGNvbnN0IHBhcmFtcyA9IGV4dHJhY3RRdWVyeVBhcmFtcyhbJ3BhZ2UnLCAnbGltaXQnXSlcblxuICAgICAgZXhwZWN0KHBhcmFtcykudG9FcXVhbCh7fSlcbiAgICAgIGV4cGVjdChjb25zb2xlU3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnRmFpbGVkIHRvIGV4dHJhY3QgcXVlcnkgcGFyYW1ldGVyczonLCBleHBlY3QuYW55KEVycm9yKSlcblxuICAgICAgY29uc29sZVNweS5tb2NrUmVzdG9yZSgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnY3JlYXRlTmF2aWdhdGlvblBhdGhXaXRoUGFyYW1zJywgKCkgPT4ge1xuICAgIGl0KCdjcmVhdGVzIHBhdGggd2l0aCBzcGVjaWZpZWQgcGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhdGggPSBjcmVhdGVOYXZpZ2F0aW9uUGF0aFdpdGhQYXJhbXMoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzJywge1xuICAgICAgICBwYWdlOiAxLFxuICAgICAgICBsaW1pdDogMjUsXG4gICAgICAgIGtleXdvcmQ6ICdzZWFyY2ggdGVybScsXG4gICAgICB9KVxuXG4gICAgICBleHBlY3QocGF0aCkudG9CZSgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHM/cGFnZT0xJmxpbWl0PTI1JmtleXdvcmQ9c2VhcmNoK3Rlcm0nKVxuICAgIH0pXG5cbiAgICBpdCgnZmlsdGVycyBvdXQgZW1wdHkgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGF0aCA9IGNyZWF0ZU5hdmlnYXRpb25QYXRoV2l0aFBhcmFtcygnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnLCB7XG4gICAgICAgIHBhZ2U6IDEsXG4gICAgICAgIGxpbWl0OiAnJyxcbiAgICAgICAga2V5d29yZDogJ3Rlc3QnLFxuICAgICAgICBmaWx0ZXI6ICcnLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHBhdGgpLnRvQmUoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzP3BhZ2U9MSZrZXl3b3JkPXRlc3QnKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBlcnJvcnMgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIC8vIE1vY2sgVVJMU2VhcmNoUGFyYW1zIHRvIHRocm93IGFuIGVycm9yXG4gICAgICBjb25zdCBvcmlnaW5hbFVSTFNlYXJjaFBhcmFtcyA9IGdsb2JhbFRoaXMuVVJMU2VhcmNoUGFyYW1zXG4gICAgICBnbG9iYWxUaGlzLlVSTFNlYXJjaFBhcmFtcyA9IHZpLmZuKCgpID0+IHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVUkxTZWFyY2hQYXJhbXMgZXJyb3InKVxuICAgICAgfSkgYXMgYW55XG5cbiAgICAgIGNvbnN0IGNvbnNvbGVTcHkgPSB2aS5zcHlPbihjb25zb2xlLCAnd2FybicpLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7IC8qIG5vb3AgKi8gfSlcbiAgICAgIGNvbnN0IHBhdGggPSBjcmVhdGVOYXZpZ2F0aW9uUGF0aFdpdGhQYXJhbXMoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzJywgeyBwYWdlOiAxIH0pXG5cbiAgICAgIGV4cGVjdChwYXRoKS50b0JlKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycpXG4gICAgICBleHBlY3QoY29uc29sZVNweSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ0ZhaWxlZCB0byBjcmVhdGUgbmF2aWdhdGlvbiBwYXRoIHdpdGggcGFyYW1zOicsIGV4cGVjdC5hbnkoRXJyb3IpKVxuXG4gICAgICBjb25zb2xlU3B5Lm1vY2tSZXN0b3JlKClcbiAgICAgIGdsb2JhbFRoaXMuVVJMU2VhcmNoUGFyYW1zID0gb3JpZ2luYWxVUkxTZWFyY2hQYXJhbXNcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdtZXJnZVF1ZXJ5UGFyYW1zJywgKCkgPT4ge1xuICAgIGl0KCdtZXJnZXMgbmV3IHBhcmFtcyB3aXRoIGV4aXN0aW5nIG9uZXMnLCAoKSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnbG9jYXRpb24nLCB7XG4gICAgICAgIHZhbHVlOiB7IHNlYXJjaDogJz9wYWdlPTMmbGltaXQ9MTAnIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgbWVyZ2VkID0gbWVyZ2VRdWVyeVBhcmFtcyh7IGtleXdvcmQ6ICd0ZXN0JywgcGFnZTogJzEnIH0pXG4gICAgICBjb25zdCByZXN1bHQgPSBtZXJnZWQudG9TdHJpbmcoKVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0NvbnRhaW4oJ3BhZ2U9MScpIC8vIG92ZXJyaWRkZW5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbignbGltaXQ9MTAnKSAvLyBwcmVzZXJ2ZWRcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQ29udGFpbigna2V5d29yZD10ZXN0JykgLy8gYWRkZWRcbiAgICB9KVxuXG4gICAgaXQoJ3JlbW92ZXMgcGFyYW1ldGVycyB3aGVuIHZhbHVlIGlzIG51bGwnLCAoKSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnbG9jYXRpb24nLCB7XG4gICAgICAgIHZhbHVlOiB7IHNlYXJjaDogJz9wYWdlPTMmbGltaXQ9MTAma2V5d29yZD10ZXN0JyB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IG1lcmdlZCA9IG1lcmdlUXVlcnlQYXJhbXMoeyBrZXl3b3JkOiBudWxsLCBmaWx0ZXI6ICdhY3RpdmUnIH0pXG4gICAgICBjb25zdCByZXN1bHQgPSBtZXJnZWQudG9TdHJpbmcoKVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0NvbnRhaW4oJ3BhZ2U9MycpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0NvbnRhaW4oJ2xpbWl0PTEwJylcbiAgICAgIGV4cGVjdChyZXN1bHQpLm5vdC50b0NvbnRhaW4oJ2tleXdvcmQnKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKCdmaWx0ZXI9YWN0aXZlJylcbiAgICB9KVxuXG4gICAgaXQoJ2NyZWF0ZXMgZnJlc2ggcGFyYW1zIHdoZW4gcHJlc2VydmVFeGlzdGluZyBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdsb2NhdGlvbicsIHtcbiAgICAgICAgdmFsdWU6IHsgc2VhcmNoOiAnP3BhZ2U9MyZsaW1pdD0xMCcgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBtZXJnZWQgPSBtZXJnZVF1ZXJ5UGFyYW1zKHsga2V5d29yZDogJ3Rlc3QnIH0sIGZhbHNlKVxuICAgICAgY29uc3QgcmVzdWx0ID0gbWVyZ2VkLnRvU3RyaW5nKClcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSgna2V5d29yZD10ZXN0JylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdkYXRhc2V0TmF2aWdhdGlvbicsICgpID0+IHtcbiAgICBpdCgnYmFja1RvRG9jdW1lbnRzIGNyZWF0ZXMgY29ycmVjdCBuYXZpZ2F0aW9uIGZ1bmN0aW9uJywgKCkgPT4ge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2xvY2F0aW9uJywge1xuICAgICAgICB2YWx1ZTogeyBzZWFyY2g6ICc/cGFnZT0yJmxpbWl0PTI1JyB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGJhY2tGbiA9IGRhdGFzZXROYXZpZ2F0aW9uLmJhY2tUb0RvY3VtZW50cyhtb2NrUm91dGVyLCAnZGF0YXNldC0xMjMnKVxuICAgICAgYmFja0ZuKClcblxuICAgICAgZXhwZWN0KG1vY2tQdXNoKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnL2RhdGFzZXRzL2RhdGFzZXQtMTIzL2RvY3VtZW50cz9wYWdlPTImbGltaXQ9MjUnKVxuICAgIH0pXG5cbiAgICBpdCgndG9Eb2N1bWVudERldGFpbCBjcmVhdGVzIGNvcnJlY3QgbmF2aWdhdGlvbiBmdW5jdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGRldGFpbEZuID0gZGF0YXNldE5hdmlnYXRpb24udG9Eb2N1bWVudERldGFpbChtb2NrUm91dGVyLCAnZGF0YXNldC0xMjMnLCAnZG9jLTQ1NicpXG4gICAgICBkZXRhaWxGbigpXG5cbiAgICAgIGV4cGVjdChtb2NrUHVzaCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJy9kYXRhc2V0cy9kYXRhc2V0LTEyMy9kb2N1bWVudHMvZG9jLTQ1NicpXG4gICAgfSlcblxuICAgIGl0KCd0b0RvY3VtZW50U2V0dGluZ3MgY3JlYXRlcyBjb3JyZWN0IG5hdmlnYXRpb24gZnVuY3Rpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBzZXR0aW5nc0ZuID0gZGF0YXNldE5hdmlnYXRpb24udG9Eb2N1bWVudFNldHRpbmdzKG1vY2tSb3V0ZXIsICdkYXRhc2V0LTEyMycsICdkb2MtNDU2JylcbiAgICAgIHNldHRpbmdzRm4oKVxuXG4gICAgICBleHBlY3QobW9ja1B1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvZGF0YXNldHMvZGF0YXNldC0xMjMvZG9jdW1lbnRzL2RvYy00NTYvc2V0dGluZ3MnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlYWwtd29ybGQgSW50ZWdyYXRpb24gU2NlbmFyaW9zJywgKCkgPT4ge1xuICAgIGl0KCdjb21wbGV0ZSB1c2VyIHdvcmtmbG93OiBsaXN0IC0+IGRldGFpbCAtPiBiYWNrJywgKCkgPT4ge1xuICAgICAgLy8gVXNlciBzdGFydHMgb24gcGFnZSAzIHdpdGggc2VhcmNoXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnbG9jYXRpb24nLCB7XG4gICAgICAgIHZhbHVlOiB7IHNlYXJjaDogJz9wYWdlPTMma2V5d29yZD1BUEkmbGltaXQ9MjUnIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgLy8gQ3JlYXRlIGJhY2sgbmF2aWdhdGlvbiBmdW5jdGlvbiAoYXMgd291bGQgYmUgZG9uZSBpbiBkZXRhaWwgY29tcG9uZW50KVxuICAgICAgY29uc3QgYmFja1RvRG9jdW1lbnRzID0gZGF0YXNldE5hdmlnYXRpb24uYmFja1RvRG9jdW1lbnRzKG1vY2tSb3V0ZXIsICdtYWluLWRhdGFzZXQnKVxuXG4gICAgICAvLyBVc2VyIGNsaWNrcyBiYWNrXG4gICAgICBiYWNrVG9Eb2N1bWVudHMoKVxuXG4gICAgICAvLyBTaG91bGQgcmV0dXJuIHRvIGV4YWN0IHNhbWUgbGlzdCBzdGF0ZVxuICAgICAgZXhwZWN0KG1vY2tQdXNoKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnL2RhdGFzZXRzL21haW4tZGF0YXNldC9kb2N1bWVudHM/cGFnZT0zJmtleXdvcmQ9QVBJJmxpbWl0PTI1JylcbiAgICB9KVxuXG4gICAgaXQoJ3VzZXIgYXBwbGllcyBmaWx0ZXJzIHRoZW4gdmlld3MgZG9jdW1lbnQnLCAoKSA9PiB7XG4gICAgICAvLyBDb21wbGV4IGZpbHRlciBzdGF0ZVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2xvY2F0aW9uJywge1xuICAgICAgICB2YWx1ZTogeyBzZWFyY2g6ICc/cGFnZT0xJmxpbWl0PTUwJnN0YXR1cz1hY3RpdmUmdHlwZT1wZGYmc29ydD1jcmVhdGVkX2F0Jm9yZGVyPWRlc2MnIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgYmFja0ZuID0gY3JlYXRlQmFja05hdmlnYXRpb24obW9ja1JvdXRlciwgJy9kYXRhc2V0cy9maWx0ZXJlZC1zZXQvZG9jdW1lbnRzJylcbiAgICAgIGJhY2tGbigpXG5cbiAgICAgIGV4cGVjdChtb2NrUHVzaCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJy9kYXRhc2V0cy9maWx0ZXJlZC1zZXQvZG9jdW1lbnRzP3BhZ2U9MSZsaW1pdD01MCZzdGF0dXM9YWN0aXZlJnR5cGU9cGRmJnNvcnQ9Y3JlYXRlZF9hdCZvcmRlcj1kZXNjJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnaGFuZGxlcyBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gcXVlcnkgcGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdsb2NhdGlvbicsIHtcbiAgICAgICAgdmFsdWU6IHsgc2VhcmNoOiAnP2tleXdvcmQ9aGVsbG8lMjB3b3JsZCZmaWx0ZXI9dHlwZSUzQXBkZiZ0YWc9JUU0JUI4JUFEJUU2JTk2JTg3JyB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHBhdGggPSBjcmVhdGVOYXZpZ2F0aW9uUGF0aCgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnKVxuICAgICAgZXhwZWN0KHBhdGgpLnRvQ29udGFpbignaGVsbG8rd29ybGQnKVxuICAgICAgZXhwZWN0KHBhdGgpLnRvQ29udGFpbigndHlwZSUzQXBkZicpXG4gICAgICBleHBlY3QocGF0aCkudG9Db250YWluKCclRTQlQjglQUQlRTYlOTYlODcnKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBkdXBsaWNhdGUgcXVlcnkgcGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdsb2NhdGlvbicsIHtcbiAgICAgICAgdmFsdWU6IHsgc2VhcmNoOiAnP3RhZz10YWcxJnRhZz10YWcyJnRhZz10YWczJyB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHBhcmFtcyA9IGV4dHJhY3RRdWVyeVBhcmFtcyhbJ3RhZyddKVxuICAgICAgLy8gVVJMU2VhcmNoUGFyYW1zLmdldCgpIHJldHVybnMgdGhlIGZpcnN0IHZhbHVlXG4gICAgICBleHBlY3QocGFyYW1zLnRhZykudG9CZSgndGFnMScpXG4gICAgfSlcblxuICAgIGl0KCdoYW5kbGVzIHZlcnkgbG9uZyBxdWVyeSBzdHJpbmdzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9uZ1ZhbHVlID0gJ2EnLnJlcGVhdCgxMDAwKVxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2xvY2F0aW9uJywge1xuICAgICAgICB2YWx1ZTogeyBzZWFyY2g6IGA/ZGF0YT0ke2xvbmdWYWx1ZX1gIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgcGF0aCA9IGNyZWF0ZU5hdmlnYXRpb25QYXRoKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycpXG4gICAgICBleHBlY3QocGF0aCkudG9Db250YWluKGxvbmdWYWx1ZSlcbiAgICAgIGV4cGVjdChwYXRoLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDEwMDApXG4gICAgfSlcblxuICAgIGl0KCdoYW5kbGVzIGVtcHR5IHN0cmluZyB2YWx1ZXMgaW4gcXVlcnkgcGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBhdGggPSBjcmVhdGVOYXZpZ2F0aW9uUGF0aFdpdGhQYXJhbXMoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzJywge1xuICAgICAgICBwYWdlOiAxLFxuICAgICAgICBrZXl3b3JkOiAnJyxcbiAgICAgICAgZmlsdGVyOiAnJyxcbiAgICAgICAgc29ydDogJ25hbWUnLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHBhdGgpLnRvQmUoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzP3BhZ2U9MSZzb3J0PW5hbWUnKVxuICAgICAgZXhwZWN0KHBhdGgpLm5vdC50b0NvbnRhaW4oJ2tleXdvcmQ9JylcbiAgICAgIGV4cGVjdChwYXRoKS5ub3QudG9Db250YWluKCdmaWx0ZXI9JylcbiAgICB9KVxuXG4gICAgaXQoJ2hhbmRsZXMgbnVsbCBhbmQgdW5kZWZpbmVkIHZhbHVlcyBpbiBtZXJnZVF1ZXJ5UGFyYW1zJywgKCkgPT4ge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2xvY2F0aW9uJywge1xuICAgICAgICB2YWx1ZTogeyBzZWFyY2g6ICc/cGFnZT0xJmxpbWl0PTEwJmtleXdvcmQ9dGVzdCcgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBtZXJnZWQgPSBtZXJnZVF1ZXJ5UGFyYW1zKHtcbiAgICAgICAga2V5d29yZDogbnVsbCxcbiAgICAgICAgZmlsdGVyOiB1bmRlZmluZWQsXG4gICAgICAgIHNvcnQ6ICduYW1lJyxcbiAgICAgIH0pXG4gICAgICBjb25zdCByZXN1bHQgPSBtZXJnZWQudG9TdHJpbmcoKVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0NvbnRhaW4oJ3BhZ2U9MScpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0NvbnRhaW4oJ2xpbWl0PTEwJylcbiAgICAgIGV4cGVjdChyZXN1bHQpLm5vdC50b0NvbnRhaW4oJ2tleXdvcmQnKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9Db250YWluKCdzb3J0PW5hbWUnKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBuYXZpZ2F0aW9uIHdpdGggaGFzaCBmcmFnbWVudHMnLCAoKSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnbG9jYXRpb24nLCB7XG4gICAgICAgIHZhbHVlOiB7IHNlYXJjaDogJz9wYWdlPTEnLCBoYXNoOiAnI3NlY3Rpb24tMicgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwYXRoID0gY3JlYXRlTmF2aWdhdGlvblBhdGgoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzJylcbiAgICAgIC8vIFNob3VsZCBwcmVzZXJ2ZSBxdWVyeSBwYXJhbXMgYnV0IG5vdCBoYXNoXG4gICAgICBleHBlY3QocGF0aCkudG9CZSgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHM/cGFnZT0xJylcbiAgICB9KVxuXG4gICAgaXQoJ2hhbmRsZXMgbWFsZm9ybWVkIHF1ZXJ5IHN0cmluZ3MgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdsb2NhdGlvbicsIHtcbiAgICAgICAgdmFsdWU6IHsgc2VhcmNoOiAnP3BhZ2U9MSZpbnZhbGlkJmxpbWl0PTEwJj12YWx1ZSZrZXk9JyB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHBhcmFtcyA9IGV4dHJhY3RRdWVyeVBhcmFtcyhbJ3BhZ2UnLCAnbGltaXQnLCAnaW52YWxpZCcsICdrZXknXSlcbiAgICAgIGV4cGVjdChwYXJhbXMucGFnZSkudG9CZSgnMScpXG4gICAgICBleHBlY3QocGFyYW1zLmxpbWl0KS50b0JlKCcxMCcpXG4gICAgICAvLyBNYWxmb3JtZWQgcGFyYW1zIHNob3VsZCBiZSBoYW5kbGVkIGJ5IFVSTFNlYXJjaFBhcmFtc1xuICAgICAgZXhwZWN0KHBhcmFtcy5pbnZhbGlkKS50b0JlKCcnKSAvLyBmb3IgYCZpbnZhbGlkYFxuICAgICAgZXhwZWN0KHBhcmFtcy5rZXkpLnRvQmUoJycpIC8vIGZvciBgJmtleT1gXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUGVyZm9ybWFuY2UgVGVzdHMnLCAoKSA9PiB7XG4gICAgaXQoJ2hhbmRsZXMgbGFyZ2UgbnVtYmVyIG9mIHF1ZXJ5IHBhcmFtZXRlcnMgZWZmaWNpZW50bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBtYW55UGFyYW1zID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogNTAgfSwgKF8sIGkpID0+IGBwYXJhbSR7aX09dmFsdWUke2l9YCkuam9pbignJicpXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnbG9jYXRpb24nLCB7XG4gICAgICAgIHZhbHVlOiB7IHNlYXJjaDogYD8ke21hbnlQYXJhbXN9YCB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IERhdGUubm93KClcbiAgICAgIGNvbnN0IHBhdGggPSBjcmVhdGVOYXZpZ2F0aW9uUGF0aCgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnKVxuICAgICAgY29uc3QgZW5kVGltZSA9IERhdGUubm93KClcblxuICAgICAgZXhwZWN0KGVuZFRpbWUgLSBzdGFydFRpbWUpLnRvQmVMZXNzVGhhbig1MCkgLy8gU2hvdWxkIGJlIGZhc3RcbiAgICAgIGV4cGVjdChwYXRoKS50b0NvbnRhaW4oJ3BhcmFtMD12YWx1ZTAnKVxuICAgICAgZXhwZWN0KHBhdGgpLnRvQ29udGFpbigncGFyYW00OT12YWx1ZTQ5JylcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==