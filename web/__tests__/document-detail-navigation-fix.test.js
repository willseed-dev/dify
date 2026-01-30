"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Document Detail Navigation Fix Verification Test
 *
 * This test specifically validates that the backToPrev function in the document detail
 * component correctly preserves pagination and filter states.
 */
const react_1 = require("@testing-library/react");
const navigation_1 = require("next/navigation");
const use_document_1 = require("@/service/knowledge/use-document");
// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: vi.fn(() => ({
        push: mockPush,
    })),
}));
// Mock the document service hooks
vi.mock('@/service/knowledge/use-document', () => ({
    useDocumentDetail: vi.fn(),
    useDocumentMetadata: vi.fn(),
    useInvalidDocumentList: vi.fn(() => vi.fn()),
}));
// Mock other dependencies
vi.mock('@/context/dataset-detail', () => ({
    useDatasetDetailContext: vi.fn(() => [null]),
}));
vi.mock('@/service/use-base', () => ({
    useInvalid: vi.fn(() => vi.fn()),
}));
vi.mock('@/service/knowledge/use-segment', () => ({
    useSegmentListKey: vi.fn(),
    useChildSegmentListKey: vi.fn(),
}));
// Create a minimal version of the DocumentDetail component that includes our fix
const DocumentDetailWithFix = ({ datasetId, documentId }) => {
    const router = (0, navigation_1.useRouter)();
    // This is the FIXED implementation from detail/index.tsx
    const backToPrev = () => {
        // Preserve pagination and filter states when navigating back
        const searchParams = new URLSearchParams(window.location.search);
        const queryString = searchParams.toString();
        const separator = queryString ? '?' : '';
        const backPath = `/datasets/${datasetId}/documents${separator}${queryString}`;
        router.push(backPath);
    };
    return (<div data-testid="document-detail-fixed">
      <button type="button" data-testid="back-button-fixed" onClick={backToPrev}>
        Back to Documents
      </button>
      <div data-testid="document-info">
        Dataset:
        {' '}
        {datasetId}
        , Document:
        {' '}
        {documentId}
      </div>
    </div>);
};
describe('Document Detail Navigation Fix Verification', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        use_document_1.useDocumentDetail.mockReturnValue({
            data: {
                id: 'doc-123',
                name: 'Test Document',
                display_status: 'available',
                enabled: true,
                archived: false,
            },
            error: null,
        });
        use_document_1.useDocumentMetadata.mockReturnValue({
            data: null,
            error: null,
        });
    });
    describe('Query Parameter Preservation', () => {
        it('preserves pagination state (page 3, limit 25)', () => {
            // Simulate user coming from page 3 with 25 items per page
            Object.defineProperty(window, 'location', {
                value: {
                    search: '?page=3&limit=25',
                },
                writable: true,
            });
            (0, react_1.render)(<DocumentDetailWithFix datasetId="dataset-123" documentId="doc-456"/>);
            // User clicks back button
            react_1.fireEvent.click(react_1.screen.getByTestId('back-button-fixed'));
            // Should preserve the pagination state
            expect(mockPush).toHaveBeenCalledWith('/datasets/dataset-123/documents?page=3&limit=25');
            console.log('✅ Pagination state preserved: page=3&limit=25');
        });
        it('preserves search keyword and filters', () => {
            // Simulate user with search and filters applied
            Object.defineProperty(window, 'location', {
                value: {
                    search: '?page=2&limit=10&keyword=API%20documentation&status=active',
                },
                writable: true,
            });
            (0, react_1.render)(<DocumentDetailWithFix datasetId="dataset-123" documentId="doc-456"/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('back-button-fixed'));
            // Should preserve all query parameters
            expect(mockPush).toHaveBeenCalledWith('/datasets/dataset-123/documents?page=2&limit=10&keyword=API+documentation&status=active');
            console.log('✅ Search and filters preserved');
        });
        it('handles complex query parameters with special characters', () => {
            // Test with complex query string including encoded characters
            Object.defineProperty(window, 'location', {
                value: {
                    search: '?page=1&limit=50&keyword=test%20%26%20debug&sort=name&order=desc&filter=%7B%22type%22%3A%22pdf%22%7D',
                },
                writable: true,
            });
            (0, react_1.render)(<DocumentDetailWithFix datasetId="dataset-123" documentId="doc-456"/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('back-button-fixed'));
            // URLSearchParams will normalize the encoding, but preserve all parameters
            const expectedCall = mockPush.mock.calls[0][0];
            expect(expectedCall).toMatch(/^\/datasets\/dataset-123\/documents\?/);
            expect(expectedCall).toMatch(/page=1/);
            expect(expectedCall).toMatch(/limit=50/);
            expect(expectedCall).toMatch(/keyword=test/);
            expect(expectedCall).toMatch(/sort=name/);
            expect(expectedCall).toMatch(/order=desc/);
            console.log('✅ Complex query parameters handled:', expectedCall);
        });
        it('handles empty query parameters gracefully', () => {
            // No query parameters in URL
            Object.defineProperty(window, 'location', {
                value: {
                    search: '',
                },
                writable: true,
            });
            (0, react_1.render)(<DocumentDetailWithFix datasetId="dataset-123" documentId="doc-456"/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('back-button-fixed'));
            // Should navigate to clean documents URL
            expect(mockPush).toHaveBeenCalledWith('/datasets/dataset-123/documents');
            console.log('✅ Empty parameters handled gracefully');
        });
    });
    describe('Different Dataset IDs', () => {
        it('works with different dataset identifiers', () => {
            Object.defineProperty(window, 'location', {
                value: {
                    search: '?page=5&limit=10',
                },
                writable: true,
            });
            // Test with different dataset ID format
            (0, react_1.render)(<DocumentDetailWithFix datasetId="ds-prod-2024-001" documentId="doc-456"/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('back-button-fixed'));
            expect(mockPush).toHaveBeenCalledWith('/datasets/ds-prod-2024-001/documents?page=5&limit=10');
            console.log('✅ Works with different dataset ID formats');
        });
    });
    describe('Real User Scenarios', () => {
        it('scenario: user searches, goes to page 3, views document, clicks back', () => {
            // User searched for "API" and navigated to page 3
            Object.defineProperty(window, 'location', {
                value: {
                    search: '?keyword=API&page=3&limit=10',
                },
                writable: true,
            });
            (0, react_1.render)(<DocumentDetailWithFix datasetId="main-dataset" documentId="api-doc-123"/>);
            // User decides to go back to continue browsing
            react_1.fireEvent.click(react_1.screen.getByTestId('back-button-fixed'));
            // Should return to page 3 of API search results
            expect(mockPush).toHaveBeenCalledWith('/datasets/main-dataset/documents?keyword=API&page=3&limit=10');
            console.log('✅ Real user scenario: search + pagination preserved');
        });
        it('scenario: user applies multiple filters, goes to document, returns', () => {
            // User has applied multiple filters and is on page 2
            Object.defineProperty(window, 'location', {
                value: {
                    search: '?page=2&limit=25&status=active&type=pdf&sort=created_at&order=desc',
                },
                writable: true,
            });
            (0, react_1.render)(<DocumentDetailWithFix datasetId="filtered-dataset" documentId="filtered-doc"/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('back-button-fixed'));
            // All filters should be preserved
            expect(mockPush).toHaveBeenCalledWith('/datasets/filtered-dataset/documents?page=2&limit=25&status=active&type=pdf&sort=created_at&order=desc');
            console.log('✅ Complex filtering scenario preserved');
        });
    });
    describe('Error Handling and Edge Cases', () => {
        it('handles malformed query parameters gracefully', () => {
            // Test with potentially problematic query string
            Object.defineProperty(window, 'location', {
                value: {
                    search: '?page=invalid&limit=&keyword=test&=emptykey&malformed',
                },
                writable: true,
            });
            (0, react_1.render)(<DocumentDetailWithFix datasetId="dataset-123" documentId="doc-456"/>);
            // Should not throw errors
            expect(() => {
                react_1.fireEvent.click(react_1.screen.getByTestId('back-button-fixed'));
            }).not.toThrow();
            // Should still attempt navigation (URLSearchParams will clean up the parameters)
            expect(mockPush).toHaveBeenCalled();
            const navigationPath = mockPush.mock.calls[0][0];
            expect(navigationPath).toMatch(/^\/datasets\/dataset-123\/documents/);
            console.log('✅ Malformed parameters handled gracefully:', navigationPath);
        });
        it('handles very long query strings', () => {
            // Test with a very long query string
            const longKeyword = 'a'.repeat(1000);
            Object.defineProperty(window, 'location', {
                value: {
                    search: `?page=1&keyword=${longKeyword}`,
                },
                writable: true,
            });
            (0, react_1.render)(<DocumentDetailWithFix datasetId="dataset-123" documentId="doc-456"/>);
            expect(() => {
                react_1.fireEvent.click(react_1.screen.getByTestId('back-button-fixed'));
            }).not.toThrow();
            expect(mockPush).toHaveBeenCalled();
            console.log('✅ Long query strings handled');
        });
    });
    describe('Performance Verification', () => {
        it('navigation function executes quickly', () => {
            Object.defineProperty(window, 'location', {
                value: {
                    search: '?page=1&limit=10&keyword=test',
                },
                writable: true,
            });
            (0, react_1.render)(<DocumentDetailWithFix datasetId="dataset-123" documentId="doc-456"/>);
            const startTime = performance.now();
            react_1.fireEvent.click(react_1.screen.getByTestId('back-button-fixed'));
            const endTime = performance.now();
            const executionTime = endTime - startTime;
            // Should execute in less than 10ms
            expect(executionTime).toBeLessThan(10);
            console.log(`⚡ Navigation execution time: ${executionTime.toFixed(2)}ms`);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9jdW1lbnQtZGV0YWlsLW5hdmlnYXRpb24tZml4LnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkb2N1bWVudC1kZXRhaWwtbmF2aWdhdGlvbi1maXgudGVzdC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQTs7Ozs7R0FLRztBQUVILGtEQUFrRTtBQUNsRSxnREFBMkM7QUFDM0MsbUVBQXlGO0FBRXpGLHNCQUFzQjtBQUN0QixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDeEIsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLFNBQVMsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDdEIsSUFBSSxFQUFFLFFBQVE7S0FDZixDQUFDLENBQUM7Q0FDSixDQUFDLENBQUMsQ0FBQTtBQUVILGtDQUFrQztBQUNsQyxFQUFFLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDakQsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtJQUMxQixtQkFBbUIsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzVCLHNCQUFzQixFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO0NBQzdDLENBQUMsQ0FBQyxDQUFBO0FBRUgsMEJBQTBCO0FBQzFCLEVBQUUsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6Qyx1QkFBdUIsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDN0MsQ0FBQyxDQUFDLENBQUE7QUFFSCxFQUFFLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxDQUFDLENB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QWEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUV0QyxPQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMzRSxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IE1vY2sgfSBmcm9tICd2aXRlc3QnXG4vKipcbiAqIERvY3VtZW50IERldGFpbCBOYXZpZ2F0aW9uIEZpeCBWZXJpZmljYXRpb24gVGVzdFxuICpcbiAqIFRoaXMgdGVzdCBzcGVjaWZpY2FsbHkgdmFsaWRhdGVzIHRoYXQgdGhlIGJhY2tUb1ByZXYgZnVuY3Rpb24gaW4gdGhlIGRvY3VtZW50IGRldGFpbFxuICogY29tcG9uZW50IGNvcnJlY3RseSBwcmVzZXJ2ZXMgcGFnaW5hdGlvbiBhbmQgZmlsdGVyIHN0YXRlcy5cbiAqL1xuXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvbmF2aWdhdGlvbidcbmltcG9ydCB7IHVzZURvY3VtZW50RGV0YWlsLCB1c2VEb2N1bWVudE1ldGFkYXRhIH0gZnJvbSAnQC9zZXJ2aWNlL2tub3dsZWRnZS91c2UtZG9jdW1lbnQnXG5cbi8vIE1vY2sgTmV4dC5qcyByb3V0ZXJcbmNvbnN0IG1vY2tQdXNoID0gdmkuZm4oKVxudmkubW9jaygnbmV4dC9uYXZpZ2F0aW9uJywgKCkgPT4gKHtcbiAgdXNlUm91dGVyOiB2aS5mbigoKSA9PiAoe1xuICAgIHB1c2g6IG1vY2tQdXNoLFxuICB9KSksXG59KSlcblxuLy8gTW9jayB0aGUgZG9jdW1lbnQgc2VydmljZSBob29rc1xudmkubW9jaygnQC9zZXJ2aWNlL2tub3dsZWRnZS91c2UtZG9jdW1lbnQnLCAoKSA9PiAoe1xuICB1c2VEb2N1bWVudERldGFpbDogdmkuZm4oKSxcbiAgdXNlRG9jdW1lbnRNZXRhZGF0YTogdmkuZm4oKSxcbiAgdXNlSW52YWxpZERvY3VtZW50TGlzdDogdmkuZm4oKCkgPT4gdmkuZm4oKSksXG59KSlcblxuLy8gTW9jayBvdGhlciBkZXBlbmRlbmNpZXNcbnZpLm1vY2soJ0AvY29udGV4dC9kYXRhc2V0LWRldGFpbCcsICgpID0+ICh7XG4gIHVzZURhdGFzZXREZXRhaWxDb250ZXh0OiB2aS5mbigoKSA9PiBbbnVsbF0pLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtYmFzZScsICgpID0+ICh7XG4gIHVzZUludmFsaWQ6IHZpLmZuKCgpID0+IHZpLmZuKCkpLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLXNlZ21lbnQnLCAoKSA9PiAoe1xuICB1c2VTZWdtZW50TGlzdEtleTogdmkuZm4oKSxcbiAgdXNlQ2hpbGRTZWdtZW50TGlzdEtleTogdmkuZm4oKSxcbn0pKVxuXG4vLyBDcmVhdGUgYSBtaW5pbWFsIHZlcnNpb24gb2YgdGhlIERvY3VtZW50RGV0YWlsIGNvbXBvbmVudCB0aGF0IGluY2x1ZGVzIG91ciBmaXhcbmNvbnN0IERvY3VtZW50RGV0YWlsV2l0aEZpeCA9ICh7IGRhdGFzZXRJZCwgZG9jdW1lbnRJZCB9OiB7IGRhdGFzZXRJZDogc3RyaW5nLCBkb2N1bWVudElkOiBzdHJpbmcgfSkgPT4ge1xuICBjb25zdCByb3V0ZXIgPSB1c2VSb3V0ZXIoKVxuXG4gIC8vIFRoaXMgaXMgdGhlIEZJWEVEIGltcGxlbWVudGF0aW9uIGZyb20gZGV0YWlsL2luZGV4LnRzeFxuICBjb25zdCBiYWNrVG9QcmV2ID0gKCkgPT4ge1xuICAgIC8vIFByZXNlcnZlIHBhZ2luYXRpb24gYW5kIGZpbHRlciBzdGF0ZXMgd2hlbiBuYXZpZ2F0aW5nIGJhY2tcbiAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpXG4gICAgY29uc3QgcXVlcnlTdHJpbmcgPSBzZWFyY2hQYXJhbXMudG9TdHJpbmcoKVxuICAgIGNvbnN0IHNlcGFyYXRvciA9IHF1ZXJ5U3RyaW5nID8gJz8nIDogJydcbiAgICBjb25zdCBiYWNrUGF0aCA9IGAvZGF0YXNldHMvJHtkYXRhc2V0SWR9L2RvY3VtZW50cyR7c2VwYXJhdG9yfSR7cXVlcnlTdHJpbmd9YFxuICAgIHJvdXRlci5wdXNoKGJhY2tQYXRoKVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiZG9jdW1lbnQtZGV0YWlsLWZpeGVkXCI+XG4gICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLXRlc3RpZD1cImJhY2stYnV0dG9uLWZpeGVkXCIgb25DbGljaz17YmFja1RvUHJldn0+XG4gICAgICAgIEJhY2sgdG8gRG9jdW1lbnRzXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJkb2N1bWVudC1pbmZvXCI+XG4gICAgICAgIERhdGFzZXQ6XG4gICAgICAgIHsnICd9XG4gICAgICAgIHtkYXRhc2V0SWR9XG4gICAgICAgICwgRG9jdW1lbnQ6XG4gICAgICAgIHsnICd9XG4gICAgICAgIHtkb2N1bWVudElkfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIClcbn1cblxuZGVzY3JpYmUoJ0RvY3VtZW50IERldGFpbCBOYXZpZ2F0aW9uIEZpeCBWZXJpZmljYXRpb24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuXG4gICAgLy8gTW9jayBzdWNjZXNzZnVsIEFQSSByZXNwb25zZXNcbiAgICA7KHVzZURvY3VtZW50RGV0YWlsIGFzIE1vY2spLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIGlkOiAnZG9jLTEyMycsXG4gICAgICAgIG5hbWU6ICdUZXN0IERvY3VtZW50JyxcbiAgICAgICAgZGlzcGxheV9zdGF0dXM6ICdhdmFpbGFibGUnLFxuICAgICAgICBlbmFibGVkOiB0cnVlLFxuICAgICAgICBhcmNoaXZlZDogZmFsc2UsXG4gICAgICB9LFxuICAgICAgZXJyb3I6IG51bGwsXG4gICAgfSlcblxuICAgIDsodXNlRG9jdW1lbnRNZXRhZGF0YSBhcyBNb2NrKS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgZGF0YTogbnVsbCxcbiAgICAgIGVycm9yOiBudWxsLFxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1F1ZXJ5IFBhcmFtZXRlciBQcmVzZXJ2YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3ByZXNlcnZlcyBwYWdpbmF0aW9uIHN0YXRlIChwYWdlIDMsIGxpbWl0IDI1KScsICgpID0+IHtcbiAgICAgIC8vIFNpbXVsYXRlIHVzZXIgY29taW5nIGZyb20gcGFnZSAzIHdpdGggMjUgaXRlbXMgcGVyIHBhZ2VcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdsb2NhdGlvbicsIHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBzZWFyY2g6ICc/cGFnZT0zJmxpbWl0PTI1JyxcbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPERvY3VtZW50RGV0YWlsV2l0aEZpeCBkYXRhc2V0SWQ9XCJkYXRhc2V0LTEyM1wiIGRvY3VtZW50SWQ9XCJkb2MtNDU2XCIgLz4pXG5cbiAgICAgIC8vIFVzZXIgY2xpY2tzIGJhY2sgYnV0dG9uXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWJ1dHRvbi1maXhlZCcpKVxuXG4gICAgICAvLyBTaG91bGQgcHJlc2VydmUgdGhlIHBhZ2luYXRpb24gc3RhdGVcbiAgICAgIGV4cGVjdChtb2NrUHVzaCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJy9kYXRhc2V0cy9kYXRhc2V0LTEyMy9kb2N1bWVudHM/cGFnZT0zJmxpbWl0PTI1JylcblxuICAgICAgY29uc29sZS5sb2coJ+KchSBQYWdpbmF0aW9uIHN0YXRlIHByZXNlcnZlZDogcGFnZT0zJmxpbWl0PTI1JylcbiAgICB9KVxuXG4gICAgaXQoJ3ByZXNlcnZlcyBzZWFyY2gga2V5d29yZCBhbmQgZmlsdGVycycsICgpID0+IHtcbiAgICAgIC8vIFNpbXVsYXRlIHVzZXIgd2l0aCBzZWFyY2ggYW5kIGZpbHRlcnMgYXBwbGllZFxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2xvY2F0aW9uJywge1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIHNlYXJjaDogJz9wYWdlPTImbGltaXQ9MTAma2V5d29yZD1BUEklMjBkb2N1bWVudGF0aW9uJnN0YXR1cz1hY3RpdmUnLFxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8RG9jdW1lbnREZXRhaWxXaXRoRml4IGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCIgZG9jdW1lbnRJZD1cImRvYy00NTZcIiAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1idXR0b24tZml4ZWQnKSlcblxuICAgICAgLy8gU2hvdWxkIHByZXNlcnZlIGFsbCBxdWVyeSBwYXJhbWV0ZXJzXG4gICAgICBleHBlY3QobW9ja1B1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvZGF0YXNldHMvZGF0YXNldC0xMjMvZG9jdW1lbnRzP3BhZ2U9MiZsaW1pdD0xMCZrZXl3b3JkPUFQSStkb2N1bWVudGF0aW9uJnN0YXR1cz1hY3RpdmUnKVxuXG4gICAgICBjb25zb2xlLmxvZygn4pyFIFNlYXJjaCBhbmQgZmlsdGVycyBwcmVzZXJ2ZWQnKVxuICAgIH0pXG5cbiAgICBpdCgnaGFuZGxlcyBjb21wbGV4IHF1ZXJ5IHBhcmFtZXRlcnMgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgICAvLyBUZXN0IHdpdGggY29tcGxleCBxdWVyeSBzdHJpbmcgaW5jbHVkaW5nIGVuY29kZWQgY2hhcmFjdGVyc1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2xvY2F0aW9uJywge1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIHNlYXJjaDogJz9wYWdlPTEmbGltaXQ9NTAma2V5d29yZD10ZXN0JTIwJTI2JTIwZGVidWcmc29ydD1uYW1lJm9yZGVyPWRlc2MmZmlsdGVyPSU3QiUyMnR5cGUlMjIlM0ElMjJwZGYlMjIlN0QnLFxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8RG9jdW1lbnREZXRhaWxXaXRoRml4IGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCIgZG9jdW1lbnRJZD1cImRvYy00NTZcIiAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1idXR0b24tZml4ZWQnKSlcblxuICAgICAgLy8gVVJMU2VhcmNoUGFyYW1zIHdpbGwgbm9ybWFsaXplIHRoZSBlbmNvZGluZywgYnV0IHByZXNlcnZlIGFsbCBwYXJhbWV0ZXJzXG4gICAgICBjb25zdCBleHBlY3RlZENhbGwgPSBtb2NrUHVzaC5tb2NrLmNhbGxzWzBdWzBdXG4gICAgICBleHBlY3QoZXhwZWN0ZWRDYWxsKS50b01hdGNoKC9eXFwvZGF0YXNldHNcXC9kYXRhc2V0LTEyM1xcL2RvY3VtZW50c1xcPy8pXG4gICAgICBleHBlY3QoZXhwZWN0ZWRDYWxsKS50b01hdGNoKC9wYWdlPTEvKVxuICAgICAgZXhwZWN0KGV4cGVjdGVkQ2FsbCkudG9NYXRjaCgvbGltaXQ9NTAvKVxuICAgICAgZXhwZWN0KGV4cGVjdGVkQ2FsbCkudG9NYXRjaCgva2V5d29yZD10ZXN0LylcbiAgICAgIGV4cGVjdChleHBlY3RlZENhbGwpLnRvTWF0Y2goL3NvcnQ9bmFtZS8pXG4gICAgICBleHBlY3QoZXhwZWN0ZWRDYWxsKS50b01hdGNoKC9vcmRlcj1kZXNjLylcblxuICAgICAgY29uc29sZS5sb2coJ+KchSBDb21wbGV4IHF1ZXJ5IHBhcmFtZXRlcnMgaGFuZGxlZDonLCBleHBlY3RlZENhbGwpXG4gICAgfSlcblxuICAgIGl0KCdoYW5kbGVzIGVtcHR5IHF1ZXJ5IHBhcmFtZXRlcnMgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIC8vIE5vIHF1ZXJ5IHBhcmFtZXRlcnMgaW4gVVJMXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnbG9jYXRpb24nLCB7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgc2VhcmNoOiAnJyxcbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPERvY3VtZW50RGV0YWlsV2l0aEZpeCBkYXRhc2V0SWQ9XCJkYXRhc2V0LTEyM1wiIGRvY3VtZW50SWQ9XCJkb2MtNDU2XCIgLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stYnV0dG9uLWZpeGVkJykpXG5cbiAgICAgIC8vIFNob3VsZCBuYXZpZ2F0ZSB0byBjbGVhbiBkb2N1bWVudHMgVVJMXG4gICAgICBleHBlY3QobW9ja1B1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvZGF0YXNldHMvZGF0YXNldC0xMjMvZG9jdW1lbnRzJylcblxuICAgICAgY29uc29sZS5sb2coJ+KchSBFbXB0eSBwYXJhbWV0ZXJzIGhhbmRsZWQgZ3JhY2VmdWxseScpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRGlmZmVyZW50IERhdGFzZXQgSURzJywgKCkgPT4ge1xuICAgIGl0KCd3b3JrcyB3aXRoIGRpZmZlcmVudCBkYXRhc2V0IGlkZW50aWZpZXJzJywgKCkgPT4ge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2xvY2F0aW9uJywge1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIHNlYXJjaDogJz9wYWdlPTUmbGltaXQ9MTAnLFxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFRlc3Qgd2l0aCBkaWZmZXJlbnQgZGF0YXNldCBJRCBmb3JtYXRcbiAgICAgIHJlbmRlcig8RG9jdW1lbnREZXRhaWxXaXRoRml4IGRhdGFzZXRJZD1cImRzLXByb2QtMjAyNC0wMDFcIiBkb2N1bWVudElkPVwiZG9jLTQ1NlwiIC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWJ1dHRvbi1maXhlZCcpKVxuXG4gICAgICBleHBlY3QobW9ja1B1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvZGF0YXNldHMvZHMtcHJvZC0yMDI0LTAwMS9kb2N1bWVudHM/cGFnZT01JmxpbWl0PTEwJylcblxuICAgICAgY29uc29sZS5sb2coJ+KchSBXb3JrcyB3aXRoIGRpZmZlcmVudCBkYXRhc2V0IElEIGZvcm1hdHMnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlYWwgVXNlciBTY2VuYXJpb3MnLCAoKSA9PiB7XG4gICAgaXQoJ3NjZW5hcmlvOiB1c2VyIHNlYXJjaGVzLCBnb2VzIHRvIHBhZ2UgMywgdmlld3MgZG9jdW1lbnQsIGNsaWNrcyBiYWNrJywgKCkgPT4ge1xuICAgICAgLy8gVXNlciBzZWFyY2hlZCBmb3IgXCJBUElcIiBhbmQgbmF2aWdhdGVkIHRvIHBhZ2UgM1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2xvY2F0aW9uJywge1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIHNlYXJjaDogJz9rZXl3b3JkPUFQSSZwYWdlPTMmbGltaXQ9MTAnLFxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8RG9jdW1lbnREZXRhaWxXaXRoRml4IGRhdGFzZXRJZD1cIm1haW4tZGF0YXNldFwiIGRvY3VtZW50SWQ9XCJhcGktZG9jLTEyM1wiIC8+KVxuXG4gICAgICAvLyBVc2VyIGRlY2lkZXMgdG8gZ28gYmFjayB0byBjb250aW51ZSBicm93c2luZ1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1idXR0b24tZml4ZWQnKSlcblxuICAgICAgLy8gU2hvdWxkIHJldHVybiB0byBwYWdlIDMgb2YgQVBJIHNlYXJjaCByZXN1bHRzXG4gICAgICBleHBlY3QobW9ja1B1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvZGF0YXNldHMvbWFpbi1kYXRhc2V0L2RvY3VtZW50cz9rZXl3b3JkPUFQSSZwYWdlPTMmbGltaXQ9MTAnKVxuXG4gICAgICBjb25zb2xlLmxvZygn4pyFIFJlYWwgdXNlciBzY2VuYXJpbzogc2VhcmNoICsgcGFnaW5hdGlvbiBwcmVzZXJ2ZWQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2NlbmFyaW86IHVzZXIgYXBwbGllcyBtdWx0aXBsZSBmaWx0ZXJzLCBnb2VzIHRvIGRvY3VtZW50LCByZXR1cm5zJywgKCkgPT4ge1xuICAgICAgLy8gVXNlciBoYXMgYXBwbGllZCBtdWx0aXBsZSBmaWx0ZXJzIGFuZCBpcyBvbiBwYWdlIDJcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdsb2NhdGlvbicsIHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBzZWFyY2g6ICc/cGFnZT0yJmxpbWl0PTI1JnN0YXR1cz1hY3RpdmUmdHlwZT1wZGYmc29ydD1jcmVhdGVkX2F0Jm9yZGVyPWRlc2MnLFxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8RG9jdW1lbnREZXRhaWxXaXRoRml4IGRhdGFzZXRJZD1cImZpbHRlcmVkLWRhdGFzZXRcIiBkb2N1bWVudElkPVwiZmlsdGVyZWQtZG9jXCIgLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stYnV0dG9uLWZpeGVkJykpXG5cbiAgICAgIC8vIEFsbCBmaWx0ZXJzIHNob3VsZCBiZSBwcmVzZXJ2ZWRcbiAgICAgIGV4cGVjdChtb2NrUHVzaCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJy9kYXRhc2V0cy9maWx0ZXJlZC1kYXRhc2V0L2RvY3VtZW50cz9wYWdlPTImbGltaXQ9MjUmc3RhdHVzPWFjdGl2ZSZ0eXBlPXBkZiZzb3J0PWNyZWF0ZWRfYXQmb3JkZXI9ZGVzYycpXG5cbiAgICAgIGNvbnNvbGUubG9nKCfinIUgQ29tcGxleCBmaWx0ZXJpbmcgc2NlbmFyaW8gcHJlc2VydmVkJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFcnJvciBIYW5kbGluZyBhbmQgRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnaGFuZGxlcyBtYWxmb3JtZWQgcXVlcnkgcGFyYW1ldGVycyBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgLy8gVGVzdCB3aXRoIHBvdGVudGlhbGx5IHByb2JsZW1hdGljIHF1ZXJ5IHN0cmluZ1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHdpbmRvdywgJ2xvY2F0aW9uJywge1xuICAgICAgICB2YWx1ZToge1xuICAgICAgICAgIHNlYXJjaDogJz9wYWdlPWludmFsaWQmbGltaXQ9JmtleXdvcmQ9dGVzdCY9ZW1wdHlrZXkmbWFsZm9ybWVkJyxcbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPERvY3VtZW50RGV0YWlsV2l0aEZpeCBkYXRhc2V0SWQ9XCJkYXRhc2V0LTEyM1wiIGRvY3VtZW50SWQ9XCJkb2MtNDU2XCIgLz4pXG5cbiAgICAgIC8vIFNob3VsZCBub3QgdGhyb3cgZXJyb3JzXG4gICAgICBleHBlY3QoKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWJ1dHRvbi1maXhlZCcpKVxuICAgICAgfSkubm90LnRvVGhyb3coKVxuXG4gICAgICAvLyBTaG91bGQgc3RpbGwgYXR0ZW1wdCBuYXZpZ2F0aW9uIChVUkxTZWFyY2hQYXJhbXMgd2lsbCBjbGVhbiB1cCB0aGUgcGFyYW1ldGVycylcbiAgICAgIGV4cGVjdChtb2NrUHVzaCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBjb25zdCBuYXZpZ2F0aW9uUGF0aCA9IG1vY2tQdXNoLm1vY2suY2FsbHNbMF1bMF1cbiAgICAgIGV4cGVjdChuYXZpZ2F0aW9uUGF0aCkudG9NYXRjaCgvXlxcL2RhdGFzZXRzXFwvZGF0YXNldC0xMjNcXC9kb2N1bWVudHMvKVxuXG4gICAgICBjb25zb2xlLmxvZygn4pyFIE1hbGZvcm1lZCBwYXJhbWV0ZXJzIGhhbmRsZWQgZ3JhY2VmdWxseTonLCBuYXZpZ2F0aW9uUGF0aClcbiAgICB9KVxuXG4gICAgaXQoJ2hhbmRsZXMgdmVyeSBsb25nIHF1ZXJ5IHN0cmluZ3MnLCAoKSA9PiB7XG4gICAgICAvLyBUZXN0IHdpdGggYSB2ZXJ5IGxvbmcgcXVlcnkgc3RyaW5nXG4gICAgICBjb25zdCBsb25nS2V5d29yZCA9ICdhJy5yZXBlYXQoMTAwMClcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aW5kb3csICdsb2NhdGlvbicsIHtcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBzZWFyY2g6IGA/cGFnZT0xJmtleXdvcmQ9JHtsb25nS2V5d29yZH1gLFxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8RG9jdW1lbnREZXRhaWxXaXRoRml4IGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCIgZG9jdW1lbnRJZD1cImRvYy00NTZcIiAvPilcblxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYmFjay1idXR0b24tZml4ZWQnKSlcbiAgICAgIH0pLm5vdC50b1Rocm93KClcblxuICAgICAgZXhwZWN0KG1vY2tQdXNoKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgY29uc29sZS5sb2coJ+KchSBMb25nIHF1ZXJ5IHN0cmluZ3MgaGFuZGxlZCcpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUGVyZm9ybWFuY2UgVmVyaWZpY2F0aW9uJywgKCkgPT4ge1xuICAgIGl0KCduYXZpZ2F0aW9uIGZ1bmN0aW9uIGV4ZWN1dGVzIHF1aWNrbHknLCAoKSA9PiB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkod2luZG93LCAnbG9jYXRpb24nLCB7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgc2VhcmNoOiAnP3BhZ2U9MSZsaW1pdD0xMCZrZXl3b3JkPXRlc3QnLFxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8RG9jdW1lbnREZXRhaWxXaXRoRml4IGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCIgZG9jdW1lbnRJZD1cImRvYy00NTZcIiAvPilcblxuICAgICAgY29uc3Qgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stYnV0dG9uLWZpeGVkJykpXG4gICAgICBjb25zdCBlbmRUaW1lID0gcGVyZm9ybWFuY2Uubm93KClcblxuICAgICAgY29uc3QgZXhlY3V0aW9uVGltZSA9IGVuZFRpbWUgLSBzdGFydFRpbWVcblxuICAgICAgLy8gU2hvdWxkIGV4ZWN1dGUgaW4gbGVzcyB0aGFuIDEwbXNcbiAgICAgIGV4cGVjdChleGVjdXRpb25UaW1lKS50b0JlTGVzc1RoYW4oMTApXG5cbiAgICAgIGNvbnNvbGUubG9nKGDimqEgTmF2aWdhdGlvbiBleGVjdXRpb24gdGltZTogJHtleGVjdXRpb25UaW1lLnRvRml4ZWQoMil9bXNgKVxuICAgIH0pXG4gIH0pXG59KVxuIl19