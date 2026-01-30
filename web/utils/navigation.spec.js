"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test suite for navigation utility functions
 * Tests URL and query parameter manipulation for consistent navigation behavior
 * Includes helpers for preserving state during navigation (pagination, filters, etc.)
 */
const navigation_1 = require("./navigation");
describe('navigation', () => {
    const originalWindow = globalThis.window;
    beforeEach(() => {
        // Mock window.location with sample query parameters
        delete globalThis.window;
        globalThis.window = {
            location: {
                search: '?page=3&limit=10&keyword=test',
            },
        };
    });
    afterEach(() => {
        globalThis.window = originalWindow;
    });
    /**
     * Tests createNavigationPath which builds URLs with optional query parameter preservation
     */
    describe('createNavigationPath', () => {
        it('preserves query parameters by default', () => {
            const result = (0, navigation_1.createNavigationPath)('/datasets/123/documents');
            expect(result).toBe('/datasets/123/documents?page=3&limit=10&keyword=test');
        });
        it('returns clean path when preserveParams is false', () => {
            const result = (0, navigation_1.createNavigationPath)('/datasets/123/documents', false);
            expect(result).toBe('/datasets/123/documents');
        });
        it('handles empty query string', () => {
            globalThis.window.location.search = '';
            const result = (0, navigation_1.createNavigationPath)('/datasets/123/documents');
            expect(result).toBe('/datasets/123/documents');
        });
        it('handles path with trailing slash', () => {
            const result = (0, navigation_1.createNavigationPath)('/datasets/123/documents/');
            expect(result).toBe('/datasets/123/documents/?page=3&limit=10&keyword=test');
        });
        it('handles root path', () => {
            const result = (0, navigation_1.createNavigationPath)('/');
            expect(result).toBe('/?page=3&limit=10&keyword=test');
        });
    });
    /**
     * Tests createBackNavigation which creates a navigation callback function
     */
    describe('createBackNavigation', () => {
        /**
         * Tests that the returned function properly navigates with preserved params
         */
        it('returns function that calls router.push with correct path', () => {
            const mockRouter = { push: vi.fn() };
            const backNav = (0, navigation_1.createBackNavigation)(mockRouter, '/datasets/123/documents');
            backNav();
            expect(mockRouter.push).toHaveBeenCalledWith('/datasets/123/documents?page=3&limit=10&keyword=test');
        });
        it('returns function that navigates without params when preserveParams is false', () => {
            const mockRouter = { push: vi.fn() };
            const backNav = (0, navigation_1.createBackNavigation)(mockRouter, '/datasets/123/documents', false);
            backNav();
            expect(mockRouter.push).toHaveBeenCalledWith('/datasets/123/documents');
        });
        it('can be called multiple times', () => {
            const mockRouter = { push: vi.fn() };
            const backNav = (0, navigation_1.createBackNavigation)(mockRouter, '/datasets/123/documents');
            backNav();
            backNav();
            expect(mockRouter.push).toHaveBeenCalledTimes(2);
        });
    });
    /**
     * Tests extractQueryParams which extracts specific parameters from current URL
     */
    describe('extractQueryParams', () => {
        /**
         * Tests selective parameter extraction
         */
        it('extracts specified parameters', () => {
            const result = (0, navigation_1.extractQueryParams)(['page', 'limit']);
            expect(result).toEqual({ page: '3', limit: '10' });
        });
        it('extracts all specified parameters including keyword', () => {
            const result = (0, navigation_1.extractQueryParams)(['page', 'limit', 'keyword']);
            expect(result).toEqual({ page: '3', limit: '10', keyword: 'test' });
        });
        it('ignores non-existent parameters', () => {
            const result = (0, navigation_1.extractQueryParams)(['page', 'nonexistent']);
            expect(result).toEqual({ page: '3' });
        });
        it('returns empty object when no parameters match', () => {
            const result = (0, navigation_1.extractQueryParams)(['foo', 'bar']);
            expect(result).toEqual({});
        });
        it('returns empty object for empty array', () => {
            const result = (0, navigation_1.extractQueryParams)([]);
            expect(result).toEqual({});
        });
        it('handles empty query string', () => {
            globalThis.window.location.search = '';
            const result = (0, navigation_1.extractQueryParams)(['page', 'limit']);
            expect(result).toEqual({});
        });
    });
    /**
     * Tests createNavigationPathWithParams which builds URLs with specific parameters
     */
    describe('createNavigationPathWithParams', () => {
        /**
         * Tests URL construction with custom parameters
         */
        it('creates path with specified parameters', () => {
            const result = (0, navigation_1.createNavigationPathWithParams)('/datasets/123/documents', {
                page: '1',
                limit: '25',
            });
            expect(result).toBe('/datasets/123/documents?page=1&limit=25');
        });
        it('handles string and number values', () => {
            const result = (0, navigation_1.createNavigationPathWithParams)('/datasets/123/documents', {
                page: 1,
                limit: 25,
                keyword: 'search',
            });
            expect(result).toBe('/datasets/123/documents?page=1&limit=25&keyword=search');
        });
        it('filters out empty string values', () => {
            const result = (0, navigation_1.createNavigationPathWithParams)('/datasets/123/documents', {
                page: '1',
                keyword: '',
            });
            expect(result).toBe('/datasets/123/documents?page=1');
        });
        it('filters out null and undefined values', () => {
            const result = (0, navigation_1.createNavigationPathWithParams)('/datasets/123/documents', {
                page: '1',
                keyword: null,
                filter: undefined,
            });
            expect(result).toBe('/datasets/123/documents?page=1');
        });
        it('returns base path when params are empty', () => {
            const result = (0, navigation_1.createNavigationPathWithParams)('/datasets/123/documents', {});
            expect(result).toBe('/datasets/123/documents');
        });
        it('encodes special characters in values', () => {
            const result = (0, navigation_1.createNavigationPathWithParams)('/datasets/123/documents', {
                keyword: 'search term',
            });
            expect(result).toBe('/datasets/123/documents?keyword=search+term');
        });
    });
    /**
     * Tests mergeQueryParams which combines new parameters with existing URL params
     */
    describe('mergeQueryParams', () => {
        /**
         * Tests parameter merging and overriding
         */
        it('merges new params with existing ones', () => {
            const result = (0, navigation_1.mergeQueryParams)({ keyword: 'new', page: '1' });
            expect(result.get('page')).toBe('1');
            expect(result.get('limit')).toBe('10');
            expect(result.get('keyword')).toBe('new');
        });
        it('overrides existing parameters', () => {
            const result = (0, navigation_1.mergeQueryParams)({ page: '5' });
            expect(result.get('page')).toBe('5');
            expect(result.get('limit')).toBe('10');
        });
        it('adds new parameters', () => {
            const result = (0, navigation_1.mergeQueryParams)({ filter: 'active' });
            expect(result.get('filter')).toBe('active');
            expect(result.get('page')).toBe('3');
        });
        it('removes parameters with null value', () => {
            const result = (0, navigation_1.mergeQueryParams)({ page: null });
            expect(result.get('page')).toBeNull();
            expect(result.get('limit')).toBe('10');
        });
        it('removes parameters with undefined value', () => {
            const result = (0, navigation_1.mergeQueryParams)({ page: undefined });
            expect(result.get('page')).toBeNull();
            expect(result.get('limit')).toBe('10');
        });
        it('does not preserve existing when preserveExisting is false', () => {
            const result = (0, navigation_1.mergeQueryParams)({ filter: 'active' }, false);
            expect(result.get('filter')).toBe('active');
            expect(result.get('page')).toBeNull();
            expect(result.get('limit')).toBeNull();
        });
        it('handles number values', () => {
            const result = (0, navigation_1.mergeQueryParams)({ page: 5, limit: 20 });
            expect(result.get('page')).toBe('5');
            expect(result.get('limit')).toBe('20');
        });
        it('does not add empty string values', () => {
            const result = (0, navigation_1.mergeQueryParams)({ newParam: '' });
            expect(result.get('newParam')).toBeNull();
            // Existing params are preserved
            expect(result.get('keyword')).toBe('test');
        });
    });
    /**
     * Tests datasetNavigation helper object with common dataset navigation patterns
     */
    describe('datasetNavigation', () => {
        /**
         * Tests navigation back to dataset documents list
         */
        describe('backToDocuments', () => {
            it('creates navigation function with preserved params', () => {
                const mockRouter = { push: vi.fn() };
                const backNav = navigation_1.datasetNavigation.backToDocuments(mockRouter, 'dataset-123');
                backNav();
                expect(mockRouter.push).toHaveBeenCalledWith('/datasets/dataset-123/documents?page=3&limit=10&keyword=test');
            });
        });
        /**
         * Tests navigation to document detail page
         */
        describe('toDocumentDetail', () => {
            it('creates navigation function to document detail', () => {
                const mockRouter = { push: vi.fn() };
                const navFunc = navigation_1.datasetNavigation.toDocumentDetail(mockRouter, 'dataset-123', 'doc-456');
                navFunc();
                expect(mockRouter.push).toHaveBeenCalledWith('/datasets/dataset-123/documents/doc-456');
            });
        });
        /**
         * Tests navigation to document settings page
         */
        describe('toDocumentSettings', () => {
            it('creates navigation function to document settings', () => {
                const mockRouter = { push: vi.fn() };
                const navFunc = navigation_1.datasetNavigation.toDocumentSettings(mockRouter, 'dataset-123', 'doc-456');
                navFunc();
                expect(mockRouter.push).toHaveBeenCalledWith('/datasets/dataset-123/documents/doc-456/settings');
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibmF2aWdhdGlvbi5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7R0FJRztBQUNILDZDQU9xQjtBQUVyQixRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTtJQUMxQixNQUFNLGNBQWMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFBO0lBRXhDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxvREFBb0Q7UUFDcEQsT0FBUSxVQUFrQixDQUFDLE1BQU0sQ0FBQTtRQUNqQyxVQUFVLENBQUMsTUFBTSxHQUFHO1lBQ2xCLFFBQVEsRUFBRTtnQkFDUixNQUFNLEVBQUUsK0JBQStCO2FBQ3hDO1NBQ0ssQ0FBQTtJQUNWLENBQUMsQ0FBQyxDQUFBO0lBRUYsU0FBUyxDQUFDLEdBQUcsRUFBRTtRQUNiLFVBQVUsQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFBO0lBQ3BDLENBQUMsQ0FBQyxDQUFBO0lBRUY7O09BRUc7SUFDSCxRQUFRLENBQUMsc0JBQXNCLEVBQUUsR0FBRyxFQUFFO1FBQ3BDLEVBQUUsQ0FBQyx1Q0FBdUMsRUFBRSxHQUFHLEVBQUU7WUFDL0MsTUFBTSxNQUFNLEdBQUcsSUFBQSxpQ0FBb0IsRUFBQyx5QkFBeUIsQ0FBQyxDQUFBO1lBQzlELE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsc0RBQXNELENBQUMsQ0FBQTtRQUM3RSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxpREFBaUQsRUFBRSxHQUFHLEVBQUU7WUFDekQsTUFBTSxNQUFNLEdBQUcsSUFBQSxpQ0FBb0IsRUFBQyx5QkFBeUIsRUFBRSxLQUFLLENBQUMsQ0FBQTtZQUNyRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUE7UUFDaEQsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsNEJBQTRCLEVBQUUsR0FB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b24gdXRpbGl0eSBmdW5jdGlvbnNcbiAqIFRlc3RzIFVSTCBhbmQgcXVlcnkgcGFyYW1ldGVyIG1hbmlwdWxhdGlvbiBmb3IgY29uc2lzdGVudCBuYXZpZ2F0aW9uIGJlaGF2aW9yXG4gKiBJbmNsdWRlcyBoZWxwZXJzIGZvciBwcmVzZXJ2aW5nIHN0YXRlIGR1cmluZyBuYXZpZ2F0aW9uIChwYWdpbmF0aW9uLCBmaWx0ZXJzLCBldGMuKVxuICovXG5pbXBvcnQge1xuICBjcmVhdGVCYWNrTmF2aWdhdGlvbixcbiAgY3JlYXRlTmF2aWdhdGlvblBhdGgsXG4gIGNyZWF0ZU5hdmlnYXRpb25QYXRoV2l0aFBhcmFtcyxcbiAgZGF0YXNldE5hdmlnYXRpb24sXG4gIGV4dHJhY3RRdWVyeVBhcmFtcyxcbiAgbWVyZ2VRdWVyeVBhcmFtcyxcbn0gZnJvbSAnLi9uYXZpZ2F0aW9uJ1xuXG5kZXNjcmliZSgnbmF2aWdhdGlvbicsICgpID0+IHtcbiAgY29uc3Qgb3JpZ2luYWxXaW5kb3cgPSBnbG9iYWxUaGlzLndpbmRvd1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIC8vIE1vY2sgd2luZG93LmxvY2F0aW9uIHdpdGggc2FtcGxlIHF1ZXJ5IHBhcmFtZXRlcnNcbiAgICBkZWxldGUgKGdsb2JhbFRoaXMgYXMgYW55KS53aW5kb3dcbiAgICBnbG9iYWxUaGlzLndpbmRvdyA9IHtcbiAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgIHNlYXJjaDogJz9wYWdlPTMmbGltaXQ9MTAma2V5d29yZD10ZXN0JyxcbiAgICAgIH0sXG4gICAgfSBhcyBhbnlcbiAgfSlcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIGdsb2JhbFRoaXMud2luZG93ID0gb3JpZ2luYWxXaW5kb3dcbiAgfSlcblxuICAvKipcbiAgICogVGVzdHMgY3JlYXRlTmF2aWdhdGlvblBhdGggd2hpY2ggYnVpbGRzIFVSTHMgd2l0aCBvcHRpb25hbCBxdWVyeSBwYXJhbWV0ZXIgcHJlc2VydmF0aW9uXG4gICAqL1xuICBkZXNjcmliZSgnY3JlYXRlTmF2aWdhdGlvblBhdGgnLCAoKSA9PiB7XG4gICAgaXQoJ3ByZXNlcnZlcyBxdWVyeSBwYXJhbWV0ZXJzIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBjcmVhdGVOYXZpZ2F0aW9uUGF0aCgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHM/cGFnZT0zJmxpbWl0PTEwJmtleXdvcmQ9dGVzdCcpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIGNsZWFuIHBhdGggd2hlbiBwcmVzZXJ2ZVBhcmFtcyBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNyZWF0ZU5hdmlnYXRpb25QYXRoKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycsIGZhbHNlKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBlbXB0eSBxdWVyeSBzdHJpbmcnLCAoKSA9PiB7XG4gICAgICBnbG9iYWxUaGlzLndpbmRvdy5sb2NhdGlvbi5zZWFyY2ggPSAnJ1xuICAgICAgY29uc3QgcmVzdWx0ID0gY3JlYXRlTmF2aWdhdGlvblBhdGgoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzJylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzJylcbiAgICB9KVxuXG4gICAgaXQoJ2hhbmRsZXMgcGF0aCB3aXRoIHRyYWlsaW5nIHNsYXNoJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gY3JlYXRlTmF2aWdhdGlvblBhdGgoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzLycpXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cy8/cGFnZT0zJmxpbWl0PTEwJmtleXdvcmQ9dGVzdCcpXG4gICAgfSlcblxuICAgIGl0KCdoYW5kbGVzIHJvb3QgcGF0aCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNyZWF0ZU5hdmlnYXRpb25QYXRoKCcvJylcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoJy8/cGFnZT0zJmxpbWl0PTEwJmtleXdvcmQ9dGVzdCcpXG4gICAgfSlcbiAgfSlcblxuICAvKipcbiAgICogVGVzdHMgY3JlYXRlQmFja05hdmlnYXRpb24gd2hpY2ggY3JlYXRlcyBhIG5hdmlnYXRpb24gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICovXG4gIGRlc2NyaWJlKCdjcmVhdGVCYWNrTmF2aWdhdGlvbicsICgpID0+IHtcbiAgICAvKipcbiAgICAgKiBUZXN0cyB0aGF0IHRoZSByZXR1cm5lZCBmdW5jdGlvbiBwcm9wZXJseSBuYXZpZ2F0ZXMgd2l0aCBwcmVzZXJ2ZWQgcGFyYW1zXG4gICAgICovXG4gICAgaXQoJ3JldHVybnMgZnVuY3Rpb24gdGhhdCBjYWxscyByb3V0ZXIucHVzaCB3aXRoIGNvcnJlY3QgcGF0aCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tSb3V0ZXIgPSB7IHB1c2g6IHZpLmZuKCkgfVxuICAgICAgY29uc3QgYmFja05hdiA9IGNyZWF0ZUJhY2tOYXZpZ2F0aW9uKG1vY2tSb3V0ZXIsICcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycpXG5cbiAgICAgIGJhY2tOYXYoKVxuXG4gICAgICBleHBlY3QobW9ja1JvdXRlci5wdXNoKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHM/cGFnZT0zJmxpbWl0PTEwJmtleXdvcmQ9dGVzdCcpXG4gICAgfSlcblxuICAgIGl0KCdyZXR1cm5zIGZ1bmN0aW9uIHRoYXQgbmF2aWdhdGVzIHdpdGhvdXQgcGFyYW1zIHdoZW4gcHJlc2VydmVQYXJhbXMgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrUm91dGVyID0geyBwdXNoOiB2aS5mbigpIH1cbiAgICAgIGNvbnN0IGJhY2tOYXYgPSBjcmVhdGVCYWNrTmF2aWdhdGlvbihtb2NrUm91dGVyLCAnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnLCBmYWxzZSlcblxuICAgICAgYmFja05hdigpXG5cbiAgICAgIGV4cGVjdChtb2NrUm91dGVyLnB1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycpXG4gICAgfSlcblxuICAgIGl0KCdjYW4gYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja1JvdXRlciA9IHsgcHVzaDogdmkuZm4oKSB9XG4gICAgICBjb25zdCBiYWNrTmF2ID0gY3JlYXRlQmFja05hdmlnYXRpb24obW9ja1JvdXRlciwgJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzJylcblxuICAgICAgYmFja05hdigpXG4gICAgICBiYWNrTmF2KClcblxuICAgICAgZXhwZWN0KG1vY2tSb3V0ZXIucHVzaCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpXG4gICAgfSlcbiAgfSlcblxuICAvKipcbiAgICogVGVzdHMgZXh0cmFjdFF1ZXJ5UGFyYW1zIHdoaWNoIGV4dHJhY3RzIHNwZWNpZmljIHBhcmFtZXRlcnMgZnJvbSBjdXJyZW50IFVSTFxuICAgKi9cbiAgZGVzY3JpYmUoJ2V4dHJhY3RRdWVyeVBhcmFtcycsICgpID0+IHtcbiAgICAvKipcbiAgICAgKiBUZXN0cyBzZWxlY3RpdmUgcGFyYW1ldGVyIGV4dHJhY3Rpb25cbiAgICAgKi9cbiAgICBpdCgnZXh0cmFjdHMgc3BlY2lmaWVkIHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBleHRyYWN0UXVlcnlQYXJhbXMoWydwYWdlJywgJ2xpbWl0J10pXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHsgcGFnZTogJzMnLCBsaW1pdDogJzEwJyB9KVxuICAgIH0pXG5cbiAgICBpdCgnZXh0cmFjdHMgYWxsIHNwZWNpZmllZCBwYXJhbWV0ZXJzIGluY2x1ZGluZyBrZXl3b3JkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZXh0cmFjdFF1ZXJ5UGFyYW1zKFsncGFnZScsICdsaW1pdCcsICdrZXl3b3JkJ10pXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHsgcGFnZTogJzMnLCBsaW1pdDogJzEwJywga2V5d29yZDogJ3Rlc3QnIH0pXG4gICAgfSlcblxuICAgIGl0KCdpZ25vcmVzIG5vbi1leGlzdGVudCBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZXh0cmFjdFF1ZXJ5UGFyYW1zKFsncGFnZScsICdub25leGlzdGVudCddKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7IHBhZ2U6ICczJyB9KVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBlbXB0eSBvYmplY3Qgd2hlbiBubyBwYXJhbWV0ZXJzIG1hdGNoJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gZXh0cmFjdFF1ZXJ5UGFyYW1zKFsnZm9vJywgJ2JhciddKVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbCh7fSlcbiAgICB9KVxuXG4gICAgaXQoJ3JldHVybnMgZW1wdHkgb2JqZWN0IGZvciBlbXB0eSBhcnJheScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGV4dHJhY3RRdWVyeVBhcmFtcyhbXSlcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe30pXG4gICAgfSlcblxuICAgIGl0KCdoYW5kbGVzIGVtcHR5IHF1ZXJ5IHN0cmluZycsICgpID0+IHtcbiAgICAgIGdsb2JhbFRoaXMud2luZG93LmxvY2F0aW9uLnNlYXJjaCA9ICcnXG4gICAgICBjb25zdCByZXN1bHQgPSBleHRyYWN0UXVlcnlQYXJhbXMoWydwYWdlJywgJ2xpbWl0J10pXG4gICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKHt9KVxuICAgIH0pXG4gIH0pXG5cbiAgLyoqXG4gICAqIFRlc3RzIGNyZWF0ZU5hdmlnYXRpb25QYXRoV2l0aFBhcmFtcyB3aGljaCBidWlsZHMgVVJMcyB3aXRoIHNwZWNpZmljIHBhcmFtZXRlcnNcbiAgICovXG4gIGRlc2NyaWJlKCdjcmVhdGVOYXZpZ2F0aW9uUGF0aFdpdGhQYXJhbXMnLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdHMgVVJMIGNvbnN0cnVjdGlvbiB3aXRoIGN1c3RvbSBwYXJhbWV0ZXJzXG4gICAgICovXG4gICAgaXQoJ2NyZWF0ZXMgcGF0aCB3aXRoIHNwZWNpZmllZCBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gY3JlYXRlTmF2aWdhdGlvblBhdGhXaXRoUGFyYW1zKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycsIHtcbiAgICAgICAgcGFnZTogJzEnLFxuICAgICAgICBsaW1pdDogJzI1JyxcbiAgICAgIH0pXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cz9wYWdlPTEmbGltaXQ9MjUnKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBzdHJpbmcgYW5kIG51bWJlciB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBjcmVhdGVOYXZpZ2F0aW9uUGF0aFdpdGhQYXJhbXMoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzJywge1xuICAgICAgICBwYWdlOiAxLFxuICAgICAgICBsaW1pdDogMjUsXG4gICAgICAgIGtleXdvcmQ6ICdzZWFyY2gnLFxuICAgICAgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzP3BhZ2U9MSZsaW1pdD0yNSZrZXl3b3JkPXNlYXJjaCcpXG4gICAgfSlcblxuICAgIGl0KCdmaWx0ZXJzIG91dCBlbXB0eSBzdHJpbmcgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gY3JlYXRlTmF2aWdhdGlvblBhdGhXaXRoUGFyYW1zKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycsIHtcbiAgICAgICAgcGFnZTogJzEnLFxuICAgICAgICBrZXl3b3JkOiAnJyxcbiAgICAgIH0pXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cz9wYWdlPTEnKVxuICAgIH0pXG5cbiAgICBpdCgnZmlsdGVycyBvdXQgbnVsbCBhbmQgdW5kZWZpbmVkIHZhbHVlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNyZWF0ZU5hdmlnYXRpb25QYXRoV2l0aFBhcmFtcygnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnLCB7XG4gICAgICAgIHBhZ2U6ICcxJyxcbiAgICAgICAga2V5d29yZDogbnVsbCBhcyBhbnksXG4gICAgICAgIGZpbHRlcjogdW5kZWZpbmVkIGFzIGFueSxcbiAgICAgIH0pXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cz9wYWdlPTEnKVxuICAgIH0pXG5cbiAgICBpdCgncmV0dXJucyBiYXNlIHBhdGggd2hlbiBwYXJhbXMgYXJlIGVtcHR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gY3JlYXRlTmF2aWdhdGlvblBhdGhXaXRoUGFyYW1zKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycsIHt9KVxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnKVxuICAgIH0pXG5cbiAgICBpdCgnZW5jb2RlcyBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gY3JlYXRlTmF2aWdhdGlvblBhdGhXaXRoUGFyYW1zKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycsIHtcbiAgICAgICAga2V5d29yZDogJ3NlYXJjaCB0ZXJtJyxcbiAgICAgIH0pXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cz9rZXl3b3JkPXNlYXJjaCt0ZXJtJylcbiAgICB9KVxuICB9KVxuXG4gIC8qKlxuICAgKiBUZXN0cyBtZXJnZVF1ZXJ5UGFyYW1zIHdoaWNoIGNvbWJpbmVzIG5ldyBwYXJhbWV0ZXJzIHdpdGggZXhpc3RpbmcgVVJMIHBhcmFtc1xuICAgKi9cbiAgZGVzY3JpYmUoJ21lcmdlUXVlcnlQYXJhbXMnLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdHMgcGFyYW1ldGVyIG1lcmdpbmcgYW5kIG92ZXJyaWRpbmdcbiAgICAgKi9cbiAgICBpdCgnbWVyZ2VzIG5ldyBwYXJhbXMgd2l0aCBleGlzdGluZyBvbmVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbWVyZ2VRdWVyeVBhcmFtcyh7IGtleXdvcmQ6ICduZXcnLCBwYWdlOiAnMScgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQuZ2V0KCdwYWdlJykpLnRvQmUoJzEnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5nZXQoJ2xpbWl0JykpLnRvQmUoJzEwJylcbiAgICAgIGV4cGVjdChyZXN1bHQuZ2V0KCdrZXl3b3JkJykpLnRvQmUoJ25ldycpXG4gICAgfSlcblxuICAgIGl0KCdvdmVycmlkZXMgZXhpc3RpbmcgcGFyYW1ldGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IG1lcmdlUXVlcnlQYXJhbXMoeyBwYWdlOiAnNScgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQuZ2V0KCdwYWdlJykpLnRvQmUoJzUnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5nZXQoJ2xpbWl0JykpLnRvQmUoJzEwJylcbiAgICB9KVxuXG4gICAgaXQoJ2FkZHMgbmV3IHBhcmFtZXRlcnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBtZXJnZVF1ZXJ5UGFyYW1zKHsgZmlsdGVyOiAnYWN0aXZlJyB9KVxuICAgICAgZXhwZWN0KHJlc3VsdC5nZXQoJ2ZpbHRlcicpKS50b0JlKCdhY3RpdmUnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5nZXQoJ3BhZ2UnKSkudG9CZSgnMycpXG4gICAgfSlcblxuICAgIGl0KCdyZW1vdmVzIHBhcmFtZXRlcnMgd2l0aCBudWxsIHZhbHVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbWVyZ2VRdWVyeVBhcmFtcyh7IHBhZ2U6IG51bGwgfSlcbiAgICAgIGV4cGVjdChyZXN1bHQuZ2V0KCdwYWdlJykpLnRvQmVOdWxsKClcbiAgICAgIGV4cGVjdChyZXN1bHQuZ2V0KCdsaW1pdCcpKS50b0JlKCcxMCcpXG4gICAgfSlcblxuICAgIGl0KCdyZW1vdmVzIHBhcmFtZXRlcnMgd2l0aCB1bmRlZmluZWQgdmFsdWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBtZXJnZVF1ZXJ5UGFyYW1zKHsgcGFnZTogdW5kZWZpbmVkIH0pXG4gICAgICBleHBlY3QocmVzdWx0LmdldCgncGFnZScpKS50b0JlTnVsbCgpXG4gICAgICBleHBlY3QocmVzdWx0LmdldCgnbGltaXQnKSkudG9CZSgnMTAnKVxuICAgIH0pXG5cbiAgICBpdCgnZG9lcyBub3QgcHJlc2VydmUgZXhpc3Rpbmcgd2hlbiBwcmVzZXJ2ZUV4aXN0aW5nIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbWVyZ2VRdWVyeVBhcmFtcyh7IGZpbHRlcjogJ2FjdGl2ZScgfSwgZmFsc2UpXG4gICAgICBleHBlY3QocmVzdWx0LmdldCgnZmlsdGVyJykpLnRvQmUoJ2FjdGl2ZScpXG4gICAgICBleHBlY3QocmVzdWx0LmdldCgncGFnZScpKS50b0JlTnVsbCgpXG4gICAgICBleHBlY3QocmVzdWx0LmdldCgnbGltaXQnKSkudG9CZU51bGwoKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBudW1iZXIgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gbWVyZ2VRdWVyeVBhcmFtcyh7IHBhZ2U6IDUsIGxpbWl0OiAyMCB9KVxuICAgICAgZXhwZWN0KHJlc3VsdC5nZXQoJ3BhZ2UnKSkudG9CZSgnNScpXG4gICAgICBleHBlY3QocmVzdWx0LmdldCgnbGltaXQnKSkudG9CZSgnMjAnKVxuICAgIH0pXG5cbiAgICBpdCgnZG9lcyBub3QgYWRkIGVtcHR5IHN0cmluZyB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBtZXJnZVF1ZXJ5UGFyYW1zKHsgbmV3UGFyYW06ICcnIH0pXG4gICAgICBleHBlY3QocmVzdWx0LmdldCgnbmV3UGFyYW0nKSkudG9CZU51bGwoKVxuICAgICAgLy8gRXhpc3RpbmcgcGFyYW1zIGFyZSBwcmVzZXJ2ZWRcbiAgICAgIGV4cGVjdChyZXN1bHQuZ2V0KCdrZXl3b3JkJykpLnRvQmUoJ3Rlc3QnKVxuICAgIH0pXG4gIH0pXG5cbiAgLyoqXG4gICAqIFRlc3RzIGRhdGFzZXROYXZpZ2F0aW9uIGhlbHBlciBvYmplY3Qgd2l0aCBjb21tb24gZGF0YXNldCBuYXZpZ2F0aW9uIHBhdHRlcm5zXG4gICAqL1xuICBkZXNjcmliZSgnZGF0YXNldE5hdmlnYXRpb24nLCAoKSA9PiB7XG4gICAgLyoqXG4gICAgICogVGVzdHMgbmF2aWdhdGlvbiBiYWNrIHRvIGRhdGFzZXQgZG9jdW1lbnRzIGxpc3RcbiAgICAgKi9cbiAgICBkZXNjcmliZSgnYmFja1RvRG9jdW1lbnRzJywgKCkgPT4ge1xuICAgICAgaXQoJ2NyZWF0ZXMgbmF2aWdhdGlvbiBmdW5jdGlvbiB3aXRoIHByZXNlcnZlZCBwYXJhbXMnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG1vY2tSb3V0ZXIgPSB7IHB1c2g6IHZpLmZuKCkgfVxuICAgICAgICBjb25zdCBiYWNrTmF2ID0gZGF0YXNldE5hdmlnYXRpb24uYmFja1RvRG9jdW1lbnRzKG1vY2tSb3V0ZXIsICdkYXRhc2V0LTEyMycpXG5cbiAgICAgICAgYmFja05hdigpXG5cbiAgICAgICAgZXhwZWN0KG1vY2tSb3V0ZXIucHVzaCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJy9kYXRhc2V0cy9kYXRhc2V0LTEyMy9kb2N1bWVudHM/cGFnZT0zJmxpbWl0PTEwJmtleXdvcmQ9dGVzdCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBUZXN0cyBuYXZpZ2F0aW9uIHRvIGRvY3VtZW50IGRldGFpbCBwYWdlXG4gICAgICovXG4gICAgZGVzY3JpYmUoJ3RvRG9jdW1lbnREZXRhaWwnLCAoKSA9PiB7XG4gICAgICBpdCgnY3JlYXRlcyBuYXZpZ2F0aW9uIGZ1bmN0aW9uIHRvIGRvY3VtZW50IGRldGFpbCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgbW9ja1JvdXRlciA9IHsgcHVzaDogdmkuZm4oKSB9XG4gICAgICAgIGNvbnN0IG5hdkZ1bmMgPSBkYXRhc2V0TmF2aWdhdGlvbi50b0RvY3VtZW50RGV0YWlsKG1vY2tSb3V0ZXIsICdkYXRhc2V0LTEyMycsICdkb2MtNDU2JylcblxuICAgICAgICBuYXZGdW5jKClcblxuICAgICAgICBleHBlY3QobW9ja1JvdXRlci5wdXNoKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnL2RhdGFzZXRzL2RhdGFzZXQtMTIzL2RvY3VtZW50cy9kb2MtNDU2JylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIC8qKlxuICAgICAqIFRlc3RzIG5hdmlnYXRpb24gdG8gZG9jdW1lbnQgc2V0dGluZ3MgcGFnZVxuICAgICAqL1xuICAgIGRlc2NyaWJlKCd0b0RvY3VtZW50U2V0dGluZ3MnLCAoKSA9PiB7XG4gICAgICBpdCgnY3JlYXRlcyBuYXZpZ2F0aW9uIGZ1bmN0aW9uIHRvIGRvY3VtZW50IHNldHRpbmdzJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBtb2NrUm91dGVyID0geyBwdXNoOiB2aS5mbigpIH1cbiAgICAgICAgY29uc3QgbmF2RnVuYyA9IGRhdGFzZXROYXZpZ2F0aW9uLnRvRG9jdW1lbnRTZXR0aW5ncyhtb2NrUm91dGVyLCAnZGF0YXNldC0xMjMnLCAnZG9jLTQ1NicpXG5cbiAgICAgICAgbmF2RnVuYygpXG5cbiAgICAgICAgZXhwZWN0KG1vY2tSb3V0ZXIucHVzaCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJy9kYXRhc2V0cy9kYXRhc2V0LTEyMy9kb2N1bWVudHMvZG9jLTQ1Ni9zZXR0aW5ncycpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19