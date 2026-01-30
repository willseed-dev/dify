/**
 * Navigation Utilities
 *
 * Provides helper functions for consistent navigation behavior throughout the application,
 * specifically for preserving query parameters when navigating between related pages.
 */
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
export declare function createNavigationPath(basePath: string, preserveParams?: boolean): string;
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
export declare function createBackNavigation(router: {
    push: (path: string) => void;
}, basePath: string, preserveParams?: boolean): () => void;
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
export declare function extractQueryParams(paramNames: string[]): Record<string, string>;
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
export declare function createNavigationPathWithParams(basePath: string, params: Record<string, string | number>): string;
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
export declare function mergeQueryParams(newParams: Record<string, string | number | null | undefined>, preserveExisting?: boolean): URLSearchParams;
/**
 * Navigation utilities for common dataset/document patterns
 */
export declare const datasetNavigation: {
    /**
     * Creates navigation back to dataset documents list with preserved state
     */
    backToDocuments: (router: {
        push: (path: string) => void;
    }, datasetId: string) => () => void;
    /**
     * Creates navigation to document detail
     */
    toDocumentDetail: (router: {
        push: (path: string) => void;
    }, datasetId: string, documentId: string) => () => void;
    /**
     * Creates navigation to document settings
     */
    toDocumentSettings: (router: {
        push: (path: string) => void;
    }, datasetId: string, documentId: string) => () => void;
};
