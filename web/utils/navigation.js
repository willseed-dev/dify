"use strict";
/**
 * Navigation Utilities
 *
 * Provides helper functions for consistent navigation behavior throughout the application,
 * specifically for preserving query parameters when navigating between related pages.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.datasetNavigation = void 0;
exports.createNavigationPath = createNavigationPath;
exports.createBackNavigation = createBackNavigation;
exports.extractQueryParams = extractQueryParams;
exports.createNavigationPathWithParams = createNavigationPathWithParams;
exports.mergeQueryParams = mergeQueryParams;
/**
 * Creates a navigation path that preserves current URL query parameters
 *
 * @param basePath - The base path to navigate to (e.g., '/datasets/123/documents')
 * @param preserveParams - Whether to preserve current query parameters (default: true)
 * @returns The complete navigation path with preserved query parameters
 *
 * @example
 * // Current URL: /datasets/123/documents/456?page=3&limit=10&keyword=test
 * const backPath = createNavigationPath('/datasets/123/documents')
 * // Returns: '/datasets/123/documents?page=3&limit=10&keyword=test'
 *
 * @example
 * // Navigate without preserving params
 * const cleanPath = createNavigationPath('/datasets/123/documents', false)
 * // Returns: '/datasets/123/documents'
 */
function createNavigationPath(basePath, preserveParams = true) {
    if (!preserveParams)
        return basePath;
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const queryString = searchParams.toString();
        const separator = queryString ? '?' : '';
        return `${basePath}${separator}${queryString}`;
    }
    catch (error) {
        // Fallback to base path if there's any error accessing location
        console.warn('Failed to preserve query parameters:', error);
        return basePath;
    }
}
/**
 * Creates a back navigation function that preserves query parameters
 *
 * @param router - Next.js router instance
 * @param basePath - The base path to navigate back to
 * @param preserveParams - Whether to preserve current query parameters (default: true)
 * @returns A function that navigates back with preserved parameters
 *
 * @example
 * const router = useRouter()
 * const backToPrev = createBackNavigation(router, `/datasets/${datasetId}/documents`)
 *
 * // Later, when user clicks back:
 * backToPrev()
 */
function createBackNavigation(router, basePath, preserveParams = true) {
    return () => {
        const navigationPath = createNavigationPath(basePath, preserveParams);
        router.push(navigationPath);
    };
}
/**
 * Extracts specific query parameters from current URL
 *
 * @param paramNames - Array of parameter names to extract
 * @returns Object with extracted parameters
 *
 * @example
 * // Current URL: /page?page=3&limit=10&keyword=test&other=value
 * const params = extractQueryParams(['page', 'limit', 'keyword'])
 * // Returns: { page: '3', limit: '10', keyword: 'test' }
 */
function extractQueryParams(paramNames) {
    try {
        const searchParams = new URLSearchParams(window.location.search);
        const extracted = {};
        paramNames.forEach((name) => {
            const value = searchParams.get(name);
            if (value !== null)
                extracted[name] = value;
        });
        return extracted;
    }
    catch (error) {
        console.warn('Failed to extract query parameters:', error);
        return {};
    }
}
/**
 * Creates a navigation path with specific query parameters
 *
 * @param basePath - The base path
 * @param params - Object of query parameters to include
 * @returns Navigation path with specified parameters
 *
 * @example
 * const path = createNavigationPathWithParams('/datasets/123/documents', {
 *   page: '1',
 *   limit: '25',
 *   keyword: 'search term'
 * })
 * // Returns: '/datasets/123/documents?page=1&limit=25&keyword=search+term'
 */
function createNavigationPathWithParams(basePath, params) {
    try {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '')
                searchParams.set(key, String(value));
        });
        const queryString = searchParams.toString();
        const separator = queryString ? '?' : '';
        return `${basePath}${separator}${queryString}`;
    }
    catch (error) {
        console.warn('Failed to create navigation path with params:', error);
        return basePath;
    }
}
/**
 * Merges current query parameters with new ones
 *
 * @param newParams - New parameters to add or override
 * @param preserveExisting - Whether to preserve existing parameters (default: true)
 * @returns URLSearchParams object with merged parameters
 *
 * @example
 * // Current URL: /page?page=3&limit=10
 * const merged = mergeQueryParams({ keyword: 'test', page: '1' })
 * // Results in: page=1&limit=10&keyword=test (page overridden, limit preserved, keyword added)
 */
function mergeQueryParams(newParams, preserveExisting = true) {
    const searchParams = preserveExisting
        ? new URLSearchParams(window.location.search)
        : new URLSearchParams();
    Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined)
            searchParams.delete(key);
        else if (value !== '')
            searchParams.set(key, String(value));
    });
    return searchParams;
}
/**
 * Navigation utilities for common dataset/document patterns
 */
exports.datasetNavigation = {
    /**
     * Creates navigation back to dataset documents list with preserved state
     */
    backToDocuments: (router, datasetId) => {
        return createBackNavigation(router, `/datasets/${datasetId}/documents`);
    },
    /**
     * Creates navigation to document detail
     */
    toDocumentDetail: (router, datasetId, documentId) => {
        return () => router.push(`/datasets/${datasetId}/documents/${documentId}`);
    },
    /**
     * Creates navigation to document settings
     */
    toDocumentSettings: (router, datasetId, documentId) => {
        return () => router.push(`/datasets/${datasetId}/documents/${documentId}/settings`);
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmF2aWdhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm5hdmlnYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7OztHQUtHOzs7QUFtQkgsb0RBZUM7QUFpQkQsb0RBU0M7QUFhRCxnREFpQkM7QUFpQkQsd0VBb0JDO0FBY0QsNENBZ0JDO0FBM0pEOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQUMsUUFBZ0IsRUFBRSxpQkFBMEIsSUFBSTtJQUNuRixJQUFJLENBQUMsY0FBYztRQUNqQixPQUFPLFFBQVEsQ0FBQTtJQUVqQixJQUFJLENBQUM7UUFDSCxNQUFNLFlBQVksR0FBRyxJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2hFLE1BQU0sV0FBVyxHQUFHLFlBQVksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUMzQyxNQUFNLFNBQVMsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFBO1FBQ3hDLE9BQU8sR0FBRyxRQUFRLEdBQUcsU0FBUyxHQUFHLFdBQVcsRUFBRSxDQUFBO0lBQ2hELENBQUM7SUFDRCxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2IsZ0VBQWdFO1FBQ2hFLE9BQU8sQ0FBQyxJQUFJLENBQUMsc0NBQXNDLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDM0QsT0FBTyxRQUFRLENBQUE7SUFDakIsQ0FBQztBQUNILENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUNILFNBQWdCLG9CQUFvQixDQUNsQyxNQUF3QyxFQUN4QyxRQUFnQixFQUNoQixpQkFBMEIsSUFBSTtJQUU5QixPQUFPLEdBQUcsRUFBRTtRQUNWLE1BQU0sY0FBYyxHQUFHLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQTtRQUNyRSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQzdC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L0UsT0FBTyxvQkFBb0IsQ0FBQyxNQUFNLEVBQUUsYUFBYSxTQUFTLFlBQVksQ0FBQyxDQUFBO0lBQ3pFLENBQUM7SUFFRDs7T0FFRztJQUNILGdCQUFnQixFQUFFLENBQUMsTUFBd0MsRUFBRSxTQUFpQixFQUFFLFVBQWtCLEVBQUUsRUFBRTtRQUNwRyxPQUFPLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxTQUFTLGNBQWMsVUFBVSxFQUFFLENBQUMsQ0FBQTtJQUM1RSxDQUFDO0lBRUQ7O09BRUc7SUFDSCxrQkFBa0IsRUFBRSxDQUFDLE1BQXdDLEVBQUUsU0FBaUIsRUFBRSxVQUFrQixFQUFFLEVBQUU7UUFDdEcsT0FBTyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsU0FBUyxjQUFjLFVBQVUsV0FBVyxDQUFDLENBQUE7SUFDckYsQ0FBQztDQUNGLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE5hdmlnYXRpb24gVXRpbGl0aWVzXG4gKlxuICogUHJvdmlkZXMgaGVscGVyIGZ1bmN0aW9ucyBmb3IgY29uc2lzdGVudCBuYXZpZ2F0aW9uIGJlaGF2aW9yIHRocm91Z2hvdXQgdGhlIGFwcGxpY2F0aW9uLFxuICogc3BlY2lmaWNhbGx5IGZvciBwcmVzZXJ2aW5nIHF1ZXJ5IHBhcmFtZXRlcnMgd2hlbiBuYXZpZ2F0aW5nIGJldHdlZW4gcmVsYXRlZCBwYWdlcy5cbiAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYSBuYXZpZ2F0aW9uIHBhdGggdGhhdCBwcmVzZXJ2ZXMgY3VycmVudCBVUkwgcXVlcnkgcGFyYW1ldGVyc1xuICpcbiAqIEBwYXJhbSBiYXNlUGF0aCAtIFRoZSBiYXNlIHBhdGggdG8gbmF2aWdhdGUgdG8gKGUuZy4sICcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycpXG4gKiBAcGFyYW0gcHJlc2VydmVQYXJhbXMgLSBXaGV0aGVyIHRvIHByZXNlcnZlIGN1cnJlbnQgcXVlcnkgcGFyYW1ldGVycyAoZGVmYXVsdDogdHJ1ZSlcbiAqIEByZXR1cm5zIFRoZSBjb21wbGV0ZSBuYXZpZ2F0aW9uIHBhdGggd2l0aCBwcmVzZXJ2ZWQgcXVlcnkgcGFyYW1ldGVyc1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBDdXJyZW50IFVSTDogL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMvNDU2P3BhZ2U9MyZsaW1pdD0xMCZrZXl3b3JkPXRlc3RcbiAqIGNvbnN0IGJhY2tQYXRoID0gY3JlYXRlTmF2aWdhdGlvblBhdGgoJy9kYXRhc2V0cy8xMjMvZG9jdW1lbnRzJylcbiAqIC8vIFJldHVybnM6ICcvZGF0YXNldHMvMTIzL2RvY3VtZW50cz9wYWdlPTMmbGltaXQ9MTAma2V5d29yZD10ZXN0J1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBOYXZpZ2F0ZSB3aXRob3V0IHByZXNlcnZpbmcgcGFyYW1zXG4gKiBjb25zdCBjbGVhblBhdGggPSBjcmVhdGVOYXZpZ2F0aW9uUGF0aCgnL2RhdGFzZXRzLzEyMy9kb2N1bWVudHMnLCBmYWxzZSlcbiAqIC8vIFJldHVybnM6ICcvZGF0YXNldHMvMTIzL2RvY3VtZW50cydcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5hdmlnYXRpb25QYXRoKGJhc2VQYXRoOiBzdHJpbmcsIHByZXNlcnZlUGFyYW1zOiBib29sZWFuID0gdHJ1ZSk6IHN0cmluZyB7XG4gIGlmICghcHJlc2VydmVQYXJhbXMpXG4gICAgcmV0dXJuIGJhc2VQYXRoXG5cbiAgdHJ5IHtcbiAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpXG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSBzZWFyY2hQYXJhbXMudG9TdHJpbmcoKVxuICAgIGNvbnN0IHNlcGFyYXRvciA9IHF1ZXJ5U3RyaW5nID8gJz8nIDogJydcbiAgICByZXR1cm4gYCR7YmFzZVBhdGh9JHtzZXBhcmF0b3J9JHtxdWVyeVN0cmluZ31gXG4gIH1cbiAgY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gRmFsbGJhY2sgdG8gYmFzZSBwYXRoIGlmIHRoZXJlJ3MgYW55IGVycm9yIGFjY2Vzc2luZyBsb2NhdGlvblxuICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIHByZXNlcnZlIHF1ZXJ5IHBhcmFtZXRlcnM6JywgZXJyb3IpXG4gICAgcmV0dXJuIGJhc2VQYXRoXG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgYmFjayBuYXZpZ2F0aW9uIGZ1bmN0aW9uIHRoYXQgcHJlc2VydmVzIHF1ZXJ5IHBhcmFtZXRlcnNcbiAqXG4gKiBAcGFyYW0gcm91dGVyIC0gTmV4dC5qcyByb3V0ZXIgaW5zdGFuY2VcbiAqIEBwYXJhbSBiYXNlUGF0aCAtIFRoZSBiYXNlIHBhdGggdG8gbmF2aWdhdGUgYmFjayB0b1xuICogQHBhcmFtIHByZXNlcnZlUGFyYW1zIC0gV2hldGhlciB0byBwcmVzZXJ2ZSBjdXJyZW50IHF1ZXJ5IHBhcmFtZXRlcnMgKGRlZmF1bHQ6IHRydWUpXG4gKiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRoYXQgbmF2aWdhdGVzIGJhY2sgd2l0aCBwcmVzZXJ2ZWQgcGFyYW1ldGVyc1xuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKVxuICogY29uc3QgYmFja1RvUHJldiA9IGNyZWF0ZUJhY2tOYXZpZ2F0aW9uKHJvdXRlciwgYC9kYXRhc2V0cy8ke2RhdGFzZXRJZH0vZG9jdW1lbnRzYClcbiAqXG4gKiAvLyBMYXRlciwgd2hlbiB1c2VyIGNsaWNrcyBiYWNrOlxuICogYmFja1RvUHJldigpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCYWNrTmF2aWdhdGlvbihcbiAgcm91dGVyOiB7IHB1c2g6IChwYXRoOiBzdHJpbmcpID0+IHZvaWQgfSxcbiAgYmFzZVBhdGg6IHN0cmluZyxcbiAgcHJlc2VydmVQYXJhbXM6IGJvb2xlYW4gPSB0cnVlLFxuKTogKCkgPT4gdm9pZCB7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgY29uc3QgbmF2aWdhdGlvblBhdGggPSBjcmVhdGVOYXZpZ2F0aW9uUGF0aChiYXNlUGF0aCwgcHJlc2VydmVQYXJhbXMpXG4gICAgcm91dGVyLnB1c2gobmF2aWdhdGlvblBhdGgpXG4gIH1cbn1cblxuLyoqXG4gKiBFeHRyYWN0cyBzcGVjaWZpYyBxdWVyeSBwYXJhbWV0ZXJzIGZyb20gY3VycmVudCBVUkxcbiAqXG4gKiBAcGFyYW0gcGFyYW1OYW1lcyAtIEFycmF5IG9mIHBhcmFtZXRlciBuYW1lcyB0byBleHRyYWN0XG4gKiBAcmV0dXJucyBPYmplY3Qgd2l0aCBleHRyYWN0ZWQgcGFyYW1ldGVyc1xuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBDdXJyZW50IFVSTDogL3BhZ2U/cGFnZT0zJmxpbWl0PTEwJmtleXdvcmQ9dGVzdCZvdGhlcj12YWx1ZVxuICogY29uc3QgcGFyYW1zID0gZXh0cmFjdFF1ZXJ5UGFyYW1zKFsncGFnZScsICdsaW1pdCcsICdrZXl3b3JkJ10pXG4gKiAvLyBSZXR1cm5zOiB7IHBhZ2U6ICczJywgbGltaXQ6ICcxMCcsIGtleXdvcmQ6ICd0ZXN0JyB9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0UXVlcnlQYXJhbXMocGFyYW1OYW1lczogc3RyaW5nW10pOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpXG4gICAgY29uc3QgZXh0cmFjdGVkOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge31cblxuICAgIHBhcmFtTmFtZXMuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBzZWFyY2hQYXJhbXMuZ2V0KG5hbWUpXG4gICAgICBpZiAodmFsdWUgIT09IG51bGwpXG4gICAgICAgIGV4dHJhY3RlZFtuYW1lXSA9IHZhbHVlXG4gICAgfSlcblxuICAgIHJldHVybiBleHRyYWN0ZWRcbiAgfVxuICBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBleHRyYWN0IHF1ZXJ5IHBhcmFtZXRlcnM6JywgZXJyb3IpXG4gICAgcmV0dXJuIHt9XG4gIH1cbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmF2aWdhdGlvbiBwYXRoIHdpdGggc3BlY2lmaWMgcXVlcnkgcGFyYW1ldGVyc1xuICpcbiAqIEBwYXJhbSBiYXNlUGF0aCAtIFRoZSBiYXNlIHBhdGhcbiAqIEBwYXJhbSBwYXJhbXMgLSBPYmplY3Qgb2YgcXVlcnkgcGFyYW1ldGVycyB0byBpbmNsdWRlXG4gKiBAcmV0dXJucyBOYXZpZ2F0aW9uIHBhdGggd2l0aCBzcGVjaWZpZWQgcGFyYW1ldGVyc1xuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBwYXRoID0gY3JlYXRlTmF2aWdhdGlvblBhdGhXaXRoUGFyYW1zKCcvZGF0YXNldHMvMTIzL2RvY3VtZW50cycsIHtcbiAqICAgcGFnZTogJzEnLFxuICogICBsaW1pdDogJzI1JyxcbiAqICAga2V5d29yZDogJ3NlYXJjaCB0ZXJtJ1xuICogfSlcbiAqIC8vIFJldHVybnM6ICcvZGF0YXNldHMvMTIzL2RvY3VtZW50cz9wYWdlPTEmbGltaXQ9MjUma2V5d29yZD1zZWFyY2grdGVybSdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5hdmlnYXRpb25QYXRoV2l0aFBhcmFtcyhcbiAgYmFzZVBhdGg6IHN0cmluZyxcbiAgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXI+LFxuKTogc3RyaW5nIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKClcblxuICAgIE9iamVjdC5lbnRyaWVzKHBhcmFtcykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gJycpXG4gICAgICAgIHNlYXJjaFBhcmFtcy5zZXQoa2V5LCBTdHJpbmcodmFsdWUpKVxuICAgIH0pXG5cbiAgICBjb25zdCBxdWVyeVN0cmluZyA9IHNlYXJjaFBhcmFtcy50b1N0cmluZygpXG4gICAgY29uc3Qgc2VwYXJhdG9yID0gcXVlcnlTdHJpbmcgPyAnPycgOiAnJ1xuICAgIHJldHVybiBgJHtiYXNlUGF0aH0ke3NlcGFyYXRvcn0ke3F1ZXJ5U3RyaW5nfWBcbiAgfVxuICBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLndhcm4oJ0ZhaWxlZCB0byBjcmVhdGUgbmF2aWdhdGlvbiBwYXRoIHdpdGggcGFyYW1zOicsIGVycm9yKVxuICAgIHJldHVybiBiYXNlUGF0aFxuICB9XG59XG5cbi8qKlxuICogTWVyZ2VzIGN1cnJlbnQgcXVlcnkgcGFyYW1ldGVycyB3aXRoIG5ldyBvbmVzXG4gKlxuICogQHBhcmFtIG5ld1BhcmFtcyAtIE5ldyBwYXJhbWV0ZXJzIHRvIGFkZCBvciBvdmVycmlkZVxuICogQHBhcmFtIHByZXNlcnZlRXhpc3RpbmcgLSBXaGV0aGVyIHRvIHByZXNlcnZlIGV4aXN0aW5nIHBhcmFtZXRlcnMgKGRlZmF1bHQ6IHRydWUpXG4gKiBAcmV0dXJucyBVUkxTZWFyY2hQYXJhbXMgb2JqZWN0IHdpdGggbWVyZ2VkIHBhcmFtZXRlcnNcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gQ3VycmVudCBVUkw6IC9wYWdlP3BhZ2U9MyZsaW1pdD0xMFxuICogY29uc3QgbWVyZ2VkID0gbWVyZ2VRdWVyeVBhcmFtcyh7IGtleXdvcmQ6ICd0ZXN0JywgcGFnZTogJzEnIH0pXG4gKiAvLyBSZXN1bHRzIGluOiBwYWdlPTEmbGltaXQ9MTAma2V5d29yZD10ZXN0IChwYWdlIG92ZXJyaWRkZW4sIGxpbWl0IHByZXNlcnZlZCwga2V5d29yZCBhZGRlZClcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlUXVlcnlQYXJhbXMoXG4gIG5ld1BhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZD4sXG4gIHByZXNlcnZlRXhpc3Rpbmc6IGJvb2xlYW4gPSB0cnVlLFxuKTogVVJMU2VhcmNoUGFyYW1zIHtcbiAgY29uc3Qgc2VhcmNoUGFyYW1zID0gcHJlc2VydmVFeGlzdGluZ1xuICAgID8gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKVxuICAgIDogbmV3IFVSTFNlYXJjaFBhcmFtcygpXG5cbiAgT2JqZWN0LmVudHJpZXMobmV3UGFyYW1zKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZClcbiAgICAgIHNlYXJjaFBhcmFtcy5kZWxldGUoa2V5KVxuICAgIGVsc2UgaWYgKHZhbHVlICE9PSAnJylcbiAgICAgIHNlYXJjaFBhcmFtcy5zZXQoa2V5LCBTdHJpbmcodmFsdWUpKVxuICB9KVxuXG4gIHJldHVybiBzZWFyY2hQYXJhbXNcbn1cblxuLyoqXG4gKiBOYXZpZ2F0aW9uIHV0aWxpdGllcyBmb3IgY29tbW9uIGRhdGFzZXQvZG9jdW1lbnQgcGF0dGVybnNcbiAqL1xuZXhwb3J0IGNvbnN0IGRhdGFzZXROYXZpZ2F0aW9uID0ge1xuICAvKipcbiAgICogQ3JlYXRlcyBuYXZpZ2F0aW9uIGJhY2sgdG8gZGF0YXNldCBkb2N1bWVudHMgbGlzdCB3aXRoIHByZXNlcnZlZCBzdGF0ZVxuICAgKi9cbiAgYmFja1RvRG9jdW1lbnRzOiAocm91dGVyOiB7IHB1c2g6IChwYXRoOiBzdHJpbmcpID0+IHZvaWQgfSwgZGF0YXNldElkOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gY3JlYXRlQmFja05hdmlnYXRpb24ocm91dGVyLCBgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHNgKVxuICB9LFxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIG5hdmlnYXRpb24gdG8gZG9jdW1lbnQgZGV0YWlsXG4gICAqL1xuICB0b0RvY3VtZW50RGV0YWlsOiAocm91dGVyOiB7IHB1c2g6IChwYXRoOiBzdHJpbmcpID0+IHZvaWQgfSwgZGF0YXNldElkOiBzdHJpbmcsIGRvY3VtZW50SWQ6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiAoKSA9PiByb3V0ZXIucHVzaChgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHMvJHtkb2N1bWVudElkfWApXG4gIH0sXG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgbmF2aWdhdGlvbiB0byBkb2N1bWVudCBzZXR0aW5nc1xuICAgKi9cbiAgdG9Eb2N1bWVudFNldHRpbmdzOiAocm91dGVyOiB7IHB1c2g6IChwYXRoOiBzdHJpbmcpID0+IHZvaWQgfSwgZGF0YXNldElkOiBzdHJpbmcsIGRvY3VtZW50SWQ6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiAoKSA9PiByb3V0ZXIucHVzaChgL2RhdGFzZXRzLyR7ZGF0YXNldElkfS9kb2N1bWVudHMvJHtkb2N1bWVudElkfS9zZXR0aW5nc2ApXG4gIH0sXG59XG4iXX0=