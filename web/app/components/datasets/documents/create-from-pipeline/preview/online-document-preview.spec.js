"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const toast_1 = require("@/app/components/base/toast");
const online_document_preview_1 = require("./online-document-preview");
// Uses global react-i18next mock from web/vitest.setup.ts
// Spy on Toast.notify
const toastNotifySpy = vi.spyOn(toast_1.default, 'notify');
// Mock dataset-detail context - needs mock to control return values
const mockPipelineId = vi.fn();
vi.mock('@/context/dataset-detail', () => ({
    useDatasetDetailContextWithSelector: (_selector) => {
        return mockPipelineId();
    },
}));
// Mock usePreviewOnlineDocument hook - needs mock to control mutation behavior
const mockMutateAsync = vi.fn();
const mockUsePreviewOnlineDocument = vi.fn();
vi.mock('@/service/use-pipeline', () => ({
    usePreviewOnlineDocument: () => mockUsePreviewOnlineDocument(),
}));
// Mock data source store - needs mock to control store state
const mockCurrentCredentialId = 'credential-123';
const mockGetState = vi.fn(() => ({
    currentCredentialId: mockCurrentCredentialId,
}));
vi.mock('../data-source/store', () => ({
    useDataSourceStore: () => ({
        getState: mockGetState,
    }),
}));
// Test data factory
const createMockNotionPage = (overrides) => ({
    page_id: 'page-123',
    page_name: 'Test Notion Page',
    workspace_id: 'workspace-456',
    type: 'page',
    page_icon: null,
    parent_id: 'parent-789',
    is_bound: true,
    ...overrides,
});
const defaultProps = {
    currentPage: createMockNotionPage(),
    datasourceNodeId: 'datasource-node-123',
    hidePreview: vi.fn(),
};
describe('OnlineDocumentPreview', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockPipelineId.mockReturnValue('pipeline-123');
        mockUsePreviewOnlineDocument.mockReturnValue({
            mutateAsync: mockMutateAsync,
            isPending: false,
        });
        mockMutateAsync.mockImplementation((params, callbacks) => {
            callbacks.onSuccess({ content: 'Test content' });
            return Promise.resolve({ content: 'Test content' });
        });
    });
    describe('Rendering', () => {
        it('should render the component with page information', () => {
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            // i18n mock returns key by default
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.stepOne.preview')).toBeInTheDocument();
            expect(react_1.screen.getByText('Test Notion Page')).toBeInTheDocument();
        });
        it('should display page type', () => {
            const currentPage = createMockNotionPage({ type: 'database' });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps} currentPage={currentPage}/>);
            expect(react_1.screen.getByText('database')).toBeInTheDocument();
        });
        it('should render close button', () => {
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
    });
    describe('Data Fetching', () => {
        it('should call mutateAsync with correct parameters on mount', async () => {
            const currentPage = createMockNotionPage({
                workspace_id: 'ws-123',
                page_id: 'pg-456',
                type: 'page',
            });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps} currentPage={currentPage} datasourceNodeId="node-789"/>);
            await (0, react_1.waitFor)(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith({
                    workspaceID: 'ws-123',
                    pageID: 'pg-456',
                    pageType: 'page',
                    pipelineId: 'pipeline-123',
                    datasourceNodeId: 'node-789',
                    credentialId: mockCurrentCredentialId,
                }, expect.objectContaining({
                    onSuccess: expect.any(Function),
                    onError: expect.any(Function),
                }));
            });
        });
        it('should fetch data again when page_id changes', async () => {
            const currentPage1 = createMockNotionPage({ page_id: 'page-1' });
            const currentPage2 = createMockNotionPage({ page_id: 'page-2' });
            const { rerender } = (0, react_1.render)(<online_document_preview_1.default {...defaultProps} currentPage={currentPage1}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockMutateAsync).toHaveBeenCalledTimes(1);
            });
            rerender(<online_document_preview_1.default {...defaultProps} currentPage={currentPage2}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockMutateAsync).toHaveBeenCalledTimes(2);
            });
        });
        it('should handle empty pipelineId', async () => {
            mockPipelineId.mockReturnValue(undefined);
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                    pipelineId: '',
                }), expect.anything());
            });
        });
    });
    describe('Loading State', () => {
        it('should render loading component when isPending is true', () => {
            mockUsePreviewOnlineDocument.mockReturnValue({
                mutateAsync: mockMutateAsync,
                isPending: true,
            });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            // Loading component renders skeleton
            expect(document.querySelector('.overflow-hidden')).toBeInTheDocument();
        });
        it('should not render markdown content when loading', () => {
            mockUsePreviewOnlineDocument.mockReturnValue({
                mutateAsync: mockMutateAsync,
                isPending: true,
            });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            // Content area should not be present
            expect(react_1.screen.queryByText('Test content')).not.toBeInTheDocument();
        });
    });
    describe('Content Display', () => {
        it('should render markdown content when loaded', async () => {
            mockMutateAsync.mockImplementation((params, callbacks) => {
                callbacks.onSuccess({ content: 'Markdown content here' });
                return Promise.resolve({ content: 'Markdown content here' });
            });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                // Markdown component renders the content
                const contentArea = document.querySelector('.overflow-hidden.px-6.py-5');
                expect(contentArea).toBeInTheDocument();
            });
        });
        it('should display character count', async () => {
            mockMutateAsync.mockImplementation((params, callbacks) => {
                callbacks.onSuccess({ content: 'Hello' }); // 5 characters
                return Promise.resolve({ content: 'Hello' });
            });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                // Real formatNumberAbbreviated returns "5" for numbers < 1000
                expect(react_1.screen.getByText(/5/)).toBeInTheDocument();
            });
        });
        it('should format large character counts', async () => {
            const longContent = 'a'.repeat(2500);
            mockMutateAsync.mockImplementation((params, callbacks) => {
                callbacks.onSuccess({ content: longContent });
                return Promise.resolve({ content: longContent });
            });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                // Real formatNumberAbbreviated uses lowercase 'k': "2.5k"
                expect(react_1.screen.getByText(/2\.5k/)).toBeInTheDocument();
            });
        });
        it('should show character count based on fetched content', async () => {
            // When content is set via onSuccess, character count is displayed
            mockMutateAsync.mockImplementation((params, callbacks) => {
                callbacks.onSuccess({ content: 'Test content' }); // 12 characters
                return Promise.resolve({ content: 'Test content' });
            });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByText(/12/)).toBeInTheDocument();
            });
        });
    });
    describe('Error Handling', () => {
        it('should show toast notification on error', async () => {
            const errorMessage = 'Failed to fetch document';
            mockMutateAsync.mockImplementation((params, callbacks) => {
                callbacks.onError(new Error(errorMessage));
                // Return a resolved promise to avoid unhandled rejection
                return Promise.resolve();
            });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                expect(toastNotifySpy).toHaveBeenCalledWith({
                    type: 'error',
                    message: errorMessage,
                });
            });
        });
        it('should handle network errors', async () => {
            const networkError = new Error('Network Error');
            mockMutateAsync.mockImplementation((params, callbacks) => {
                callbacks.onError(networkError);
                // Return a resolved promise to avoid unhandled rejection
                return Promise.resolve();
            });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                expect(toastNotifySpy).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'Network Error',
                });
            });
        });
    });
    describe('User Interactions', () => {
        it('should call hidePreview when close button is clicked', () => {
            const hidePreview = vi.fn();
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps} hidePreview={hidePreview}/>);
            // Find the close button in the header area (not toast buttons)
            const headerArea = document.querySelector('.flex.gap-x-2.border-b');
            const closeButton = headerArea?.querySelector('button');
            expect(closeButton).toBeInTheDocument();
            react_1.fireEvent.click(closeButton);
            expect(hidePreview).toHaveBeenCalledTimes(1);
        });
    });
    describe('Edge Cases', () => {
        it('should handle undefined page_name', () => {
            const currentPage = createMockNotionPage({ page_name: '' });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps} currentPage={currentPage}/>);
            // Find the close button in the header area
            const headerArea = document.querySelector('.flex.gap-x-2.border-b');
            const closeButton = headerArea?.querySelector('button');
            expect(closeButton).toBeInTheDocument();
        });
        it('should handle different page types', () => {
            const currentPage = createMockNotionPage({ type: 'database' });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps} currentPage={currentPage}/>);
            expect(react_1.screen.getByText('database')).toBeInTheDocument();
        });
        it('should use credentialId from store', async () => {
            mockGetState.mockReturnValue({
                currentCredentialId: 'custom-credential',
            });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                    credentialId: 'custom-credential',
                }), expect.anything());
            });
        });
        it('should not render markdown content when content is empty and not pending', async () => {
            mockMutateAsync.mockImplementation((params, callbacks) => {
                callbacks.onSuccess({ content: '' });
                return Promise.resolve({ content: '' });
            });
            mockUsePreviewOnlineDocument.mockReturnValue({
                mutateAsync: mockMutateAsync,
                isPending: false,
            });
            (0, react_1.render)(<online_document_preview_1.default {...defaultProps}/>);
            // Content is empty, markdown area should still render but be empty
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.queryByText('Test content')).not.toBeInTheDocument();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25saW5lLWRvY3VtZW50LXByZXZpZXcuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9ubGluZS1kb2N1bWVudC1wcmV2aWV3LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5Qix1REFBK0M7QUFDL0MsdUVBQTZEO0FBRTdELDBEQUEwRDtBQUUxRCxzQkFBc0I7QUFDdEIsTUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxlQUFLLEVBQUUsUUFBUSxDQUFDLENBQUE7QUFFaEQsb0VBQW9FO0FBQ3BFLE1BQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM5QixFQUFFLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekMsbUNBQW1DLEVBQUUsQ0FBQyxTQUE4RCxFQUFFLEVBQUU7UUFDdEcsT0FBTyxjQUFjLEVBQUUsQ0FBQTtJQUN6QixDQUFDO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFFSCwrRUFBK0U7QUFDL0UsTUFBTSxlQUFlLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQy9CLE1BQU0sNEJBQTRCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzVDLEVBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN2Qyx3QkFBd0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRTtDQUMvRCxDQUFDLENBQUMsQ0FBQTtBQUVILDZEQUE2RDtBQUM3RCxNQUFNLHVCQUF1QixHQUFHLGdCQUFnQixDQUFBO0FBQ2hELE1BQU0sWUFBWSxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoQyxtQkFBbUIsRUFBRSx1QkFBdUI7Q0FDN0MsQ0FBQyxDQUFDLENBQUE7QUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDckMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN6QixRQUFRLEVBQUUsWUFBWTtLQUN2QixDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCxvQkFBb0I7QUFDcEIsTUFBTSxvQkFBb0IsR0FBRyxDQUFDLFNBQStCLEVBQWMsRUFBRSxDQUFDLENBQUM7SUFDN0UsT0FBTyxFQUFFLFVBQVU7SUFDbkIsU0FBUyxFQUFFLGtCQUFrQjtJQUM3QixZQUFZLEVBQUUsZUFBZTtJQUM3QixJQUFJLEVBQUUsTUFBTTtJQUNaLFNBQVMsRUFBRSxJQUFJO0lBQ2YsU0FBUyxFQUFFLFlBQVk7SUFDdkIsUUFBUSxFQUFFLElBQUk7SUFDZCxHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRixNQUFNLFlBQVksR0FBRztJQUNuQixXQUFXLEVBQUUsb0JBQW9CLEVBQUU7SUFDbkMsZ0JBQWdCLEVBQUUscUJBQXFCO0lBQ3ZDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFO0NBQ3JCLENBQUE7QUFFRCxRQUFRLENBQUMsdUJBQXVCLEVBQUUsR0FBRyxFQUFFO0lBQ3JDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDZCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUE7UUFDbEIsY0FBYyxDQUFDLGVBQWUsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUM5Qyw0QkFBNEIsQ0FBQyxlQUFlLENBQUM7WUFDM0MsV0FBVyxFQUFFLGVBQWU7WUFDNUIsU0FBUyxFQUFFLEtBQUs7U0FDakIsQ0FBQyxDQUFBO1FBQ0YsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFO1lBQ3ZELFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQTtZQUNoRCxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQTtRQUNyRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtZQUMzRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGlDQUFxQixDQUFDLElBQUksWUFBWSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRW5ELG1DQUFtQztZQUNuQyxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUM1RixNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUNsRSxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUU7WUFDbEMsTUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQTtZQUU5RCxJQUFBLGNBQU0sRUFBQyxDQUFDLGlDQUFxQixDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTdFLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMxRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUU7WUFDcEMsSUFBQSxjQUFNLEVBQUMsQ0FBQyxpQ0FBcUIsQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVuRCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEQsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLEVBQUUsQ0FBQywwREFBMEQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN4RSxNQUFNLFdBQVcsR0FBRyxvQkFBb0IsQ0FBQztnQkFDdkMsWUFBWSxFQUFFLFFBQVE7Z0JBQ3RCLE9BQU8sRUFBRSxRQUFRO2dCQUNqQixJQUFJLEVBQUUsTUFBTTthQUNiLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUNKLENBQUMsaUNBQXFCLENBQ3BCLElBQUksWUFBWSxDQUFDLENBQ2pCLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUN6QixnQkFBZ0IsQ0FBQyxVQUFVLEVBQzNCLENBQ0gsQ0FBQTtZQUVELE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsb0JBQW9CLENBQzFDO29CQUNFLFdBQVcsRUFBRSxRQUFRO29CQUNyQixNQUFNLEVBQUUsUUFBUTtvQkFDaEIsUUFBUSxFQUFFLE1BQU07b0JBQ2hCLFVBQVUsRUFBRSxjQUFjO29CQUMxQixnQkFBZ0IsRUFBRSxVQUFVO29CQUM1QixZQUFZLEVBQUUsdUJBQXVCO2lCQUN0QyxFQUNELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDdEIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDO29CQUMvQixPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7aUJBQzlCLENBQUMsQ0FDSCxDQUFBO1lBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM1RCxNQUFNLFlBQVksR0FBRyxvQkFBb0IsQ0FBQyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFBO1lBQ2hFLE1BQU0sWUFBWSxHQUFHLG9CQUFvQixDQUFDLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7WUFFaEUsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUEsY0FBTSxFQUN6QixDQUFDLGlDQUFxQixDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsWUFBWSxDQUFDLEVBQUcsQ0FDdkUsQ0FBQTtZQUVELE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDbEQsQ0FBQyxDQUFDLENBQUE7WUFFRixRQUFRLENBQUMsQ0FBQyxpQ0FBcUIsQ0FBQyxJQUFJLFlBQVksQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVoRixNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ2xELENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsZ0NBQWdDLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDOUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtZQUV6QyxJQUFBLGNBQU0sRUFBQyxDQUFDLGlDQUFxQixDQUFDLElBQUksWUFBWSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRW5ELE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsZUFBZSxDQUFDLENBQUMsb0JBQW9CLENBQzFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztvQkFDdEIsVUFBVSxFQUFFLEVBQUU7aUJBQ2YsQ0FBQyxFQUNGLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FDbEIsQ0FBQTtZQUNILENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFO1FBQzdCLEVBQUUsQ0FBQyx3REFBd0QsRUFBRSxHQUFHLEVBQUU7WUFDaEUsNEJBQTRCLENBQUMsZUFBZSxDQUFDO2dCQUMzQyxXQUFXLEVBQUUsZUFBZTtnQkFDNUIsU0FBUyxFQUFFLElBQUk7YUFDaEIsQ0FBQyxDQUFBO1lBRUYsSUFBQSxjQUFNLEVBQUMsQ0FBQyxpQ0FBcUIsQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVuRCxxQ0FBcUM7WUFDckMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDeEUsQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsaURBQWlELEVBQUUsR0FBRyxFQUFFO1lBQ3pELDRCQUE0QixDQUFDLGVBQWUsQ0FBQztnQkFDM0MsV0FBVyxFQUFFLGVBQWU7Z0JBQzVCLFNBQVMsRUFBRSxJQUFJO2FBQ2hCLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsaUNBQXFCLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFbkQscUNBQXFDO1lBQ3JDLE1BQU0sQ0FBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDcEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7UUFDL0IsRUFBRSxDQUFDLDRDQUE0QyxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzFELGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRTtnQkFDdkQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUE7Z0JBQ3pELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxDQUFDLENBQUE7WUFDOUQsQ0FBQyxDQUFDLENBQUE7WUFFRixJQUFBLGNBQU0sRUFBQyxDQUFDLGlDQUFxQixDQUFDLElBQUksWUFBWSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRW5ELE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQix5Q0FBeUM7Z0JBQ3pDLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtnQkFDeEUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDekMsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRSxLQUFLLElBQUksRUFBRTtZQUM5QyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUU7Z0JBQ3ZELFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQSxDQUFDLGVBQWU7Z0JBQ3pELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO1lBQzlDLENBQUMsQ0FBQyxDQUFBO1lBRUYsSUFBQSxjQUFNLEVBQUMsQ0FBQyxpQ0FBcUIsQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVuRCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsOERBQThEO2dCQUM5RCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDbkQsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNwRCxNQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3BDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRTtnQkFDdkQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFBO2dCQUM3QyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQTtZQUNsRCxDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsaUNBQXFCLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFbkQsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLDBEQUEwRDtnQkFDMUQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3ZELENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsc0RBQXNELEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDcEUsa0VBQWtFO1lBQ2xFLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRTtnQkFDdkQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsQ0FBQyxDQUFBLENBQUMsZ0JBQWdCO2dCQUNqRSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQTtZQUNyRCxDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsaUNBQXFCLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFbkQsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUNwRCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7SUFFRixRQUFRLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFO1FBQzlCLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN2RCxNQUFNLFlBQVksR0FBRywwQkFBMEIsQ0FBQTtZQUMvQyxlQUFlLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUU7Z0JBQ3ZELFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQTtnQkFDMUMseURBQXlEO2dCQUN6RCxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUMxQixDQUFDLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsaUNBQXFCLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFbkQsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDMUMsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLFlBQVk7aUJBQ3RCLENBQUMsQ0FBQTtZQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFRixFQUFFLENBQUMsOEJBQThCLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDNUMsTUFBTSxZQUFZLEdBQUcsSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUE7WUFDL0MsZUFBZSxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFO2dCQUN2RCxTQUFTLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFBO2dCQUMvQix5REFBeUQ7Z0JBQ3pELE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQzFCLENBQUMsQ0FBQyxDQUFBO1lBRUYsSUFBQSxjQUFNLEVBQUMsQ0FBQyxpQ0FBcUIsQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVuRCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDLG9CQUFvQixDQUFDO29CQUMxQyxJQUFJLEVBQUUsT0FBTztvQkFDYixPQUFPLEVBQUUsZUFBZTtpQkFDekIsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRTtRQUNqQyxFQUFFLENBQUMsc0RBQXNELEVBQUUsR0FBRyxFQUFFO1lBQzlELE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtZQUUzQixJQUFBLGNBQU0sRUFBQyxDQUFDLGlDQUFxQixDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTdFLCtEQUErRDtZQUMvRCxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUE7WUFDbkUsTUFBTSxXQUFXLEdBQUcsVUFBVSxFQUFFLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUN2RCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtZQUN2QyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxXQUFZLENBQUMsQ0FBQTtZQUU3QixNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLFFBQVEsQ0FBQyxZQUFZLEVBQUUsR0FBRyxFQUFFO1FBQzFCLEVBQUUsQ0FBQyxtQ0FBbUMsRUFBRSxHQUFHLEVBQUU7WUFDM0MsTUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQUMsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUUzRCxJQUFBLGNBQU0sRUFBQyxDQUFDLGlDQUFxQixDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTdFLDJDQUEyQztZQUMzQyxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUE7WUFDbkUsTUFBTSxXQUFXLEdBQUcsVUFBVSxFQUFFLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUN2RCxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUN6QyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxHQUFHLEVBQUU7WUFDNUMsTUFBTSxXQUFXLEdBQUcsb0JBQW9CLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQTtZQUU5RCxJQUFBLGNBQU0sRUFBQyxDQUFDLGlDQUFxQixDQUFDLElBQUksWUFBWSxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRTdFLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMxRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRSxLQUFLLElBQUksRUFBRTtZQUNsRCxZQUFZLENBQUMsZUFBZSxDQUFDO2dCQUMzQixtQkFBbUIsRUFBRSxtQkFBbUI7YUFDekMsQ0FBQyxDQUFBO1lBRUYsSUFBQSxjQUFNLEVBQUMsQ0FBQyxpQ0FBcUIsQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUVuRCxNQUFNLElBQUEsZUFBTyxFQUFDLEdBQUcsRUFBRTtnQkFDakIsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLG9CQUFvQixDQUMxQyxNQUFNLENBQUMsZ0JBQWdCLENBQUM7b0JBQ3RCLFlBQVksRUFBRSxtQkFBbUI7aUJBQ2xDLENBQUMsRUFDRixNQUFNLENBQUMsUUFBUSxFQUFFLENBQ2xCLENBQUE7WUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLDBFQUEwRSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3hGLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRTtnQkFDdkQsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO2dCQUNwQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUN6QyxDQUFDLENBQUMsQ0FBQTtZQUNGLDRCQUE0QixDQUFDLGVBQWUsQ0FBQztnQkFDM0MsV0FBVyxFQUFFLGVBQWU7Z0JBQzVCLFNBQVMsRUFBRSxLQUFLO2FBQ2pCLENBQUMsQ0FBQTtZQUVGLElBQUEsY0FBTSxFQUFDLENBQUMsaUNBQXFCLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFbkQsbUVBQW1FO1lBQ25FLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQ3BFLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOb3Rpb25QYWdlIH0gZnJvbSAnQC9tb2RlbHMvY29tbW9uJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCBUb2FzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5pbXBvcnQgT25saW5lRG9jdW1lbnRQcmV2aWV3IGZyb20gJy4vb25saW5lLWRvY3VtZW50LXByZXZpZXcnXG5cbi8vIFVzZXMgZ2xvYmFsIHJlYWN0LWkxOG5leHQgbW9jayBmcm9tIHdlYi92aXRlc3Quc2V0dXAudHNcblxuLy8gU3B5IG9uIFRvYXN0Lm5vdGlmeVxuY29uc3QgdG9hc3ROb3RpZnlTcHkgPSB2aS5zcHlPbihUb2FzdCwgJ25vdGlmeScpXG5cbi8vIE1vY2sgZGF0YXNldC1kZXRhaWwgY29udGV4dCAtIG5lZWRzIG1vY2sgdG8gY29udHJvbCByZXR1cm4gdmFsdWVzXG5jb25zdCBtb2NrUGlwZWxpbmVJZCA9IHZpLmZuKClcbnZpLm1vY2soJ0AvY29udGV4dC9kYXRhc2V0LWRldGFpbCcsICgpID0+ICh7XG4gIHVzZURhdGFzZXREZXRhaWxDb250ZXh0V2l0aFNlbGVjdG9yOiAoX3NlbGVjdG9yOiAoczogeyBkYXRhc2V0OiB7IHBpcGVsaW5lX2lkOiBzdHJpbmcgfSB9KSA9PiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gbW9ja1BpcGVsaW5lSWQoKVxuICB9LFxufSkpXG5cbi8vIE1vY2sgdXNlUHJldmlld09ubGluZURvY3VtZW50IGhvb2sgLSBuZWVkcyBtb2NrIHRvIGNvbnRyb2wgbXV0YXRpb24gYmVoYXZpb3JcbmNvbnN0IG1vY2tNdXRhdGVBc3luYyA9IHZpLmZuKClcbmNvbnN0IG1vY2tVc2VQcmV2aWV3T25saW5lRG9jdW1lbnQgPSB2aS5mbigpXG52aS5tb2NrKCdAL3NlcnZpY2UvdXNlLXBpcGVsaW5lJywgKCkgPT4gKHtcbiAgdXNlUHJldmlld09ubGluZURvY3VtZW50OiAoKSA9PiBtb2NrVXNlUHJldmlld09ubGluZURvY3VtZW50KCksXG59KSlcblxuLy8gTW9jayBkYXRhIHNvdXJjZSBzdG9yZSAtIG5lZWRzIG1vY2sgdG8gY29udHJvbCBzdG9yZSBzdGF0ZVxuY29uc3QgbW9ja0N1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZGVudGlhbC0xMjMnXG5jb25zdCBtb2NrR2V0U3RhdGUgPSB2aS5mbigoKSA9PiAoe1xuICBjdXJyZW50Q3JlZGVudGlhbElkOiBtb2NrQ3VycmVudENyZWRlbnRpYWxJZCxcbn0pKVxudmkubW9jaygnLi4vZGF0YS1zb3VyY2Uvc3RvcmUnLCAoKSA9PiAoe1xuICB1c2VEYXRhU291cmNlU3RvcmU6ICgpID0+ICh7XG4gICAgZ2V0U3RhdGU6IG1vY2tHZXRTdGF0ZSxcbiAgfSksXG59KSlcblxuLy8gVGVzdCBkYXRhIGZhY3RvcnlcbmNvbnN0IGNyZWF0ZU1vY2tOb3Rpb25QYWdlID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8Tm90aW9uUGFnZT4pOiBOb3Rpb25QYWdlID0+ICh7XG4gIHBhZ2VfaWQ6ICdwYWdlLTEyMycsXG4gIHBhZ2VfbmFtZTogJ1Rlc3QgTm90aW9uIFBhZ2UnLFxuICB3b3Jrc3BhY2VfaWQ6ICd3b3Jrc3BhY2UtNDU2JyxcbiAgdHlwZTogJ3BhZ2UnLFxuICBwYWdlX2ljb246IG51bGwsXG4gIHBhcmVudF9pZDogJ3BhcmVudC03ODknLFxuICBpc19ib3VuZDogdHJ1ZSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICBjdXJyZW50UGFnZTogY3JlYXRlTW9ja05vdGlvblBhZ2UoKSxcbiAgZGF0YXNvdXJjZU5vZGVJZDogJ2RhdGFzb3VyY2Utbm9kZS0xMjMnLFxuICBoaWRlUHJldmlldzogdmkuZm4oKSxcbn1cblxuZGVzY3JpYmUoJ09ubGluZURvY3VtZW50UHJldmlldycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1BpcGVsaW5lSWQubW9ja1JldHVyblZhbHVlKCdwaXBlbGluZS0xMjMnKVxuICAgIG1vY2tVc2VQcmV2aWV3T25saW5lRG9jdW1lbnQubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIG11dGF0ZUFzeW5jOiBtb2NrTXV0YXRlQXN5bmMsXG4gICAgICBpc1BlbmRpbmc6IGZhbHNlLFxuICAgIH0pXG4gICAgbW9ja011dGF0ZUFzeW5jLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCBjYWxsYmFja3MpID0+IHtcbiAgICAgIGNhbGxiYWNrcy5vblN1Y2Nlc3MoeyBjb250ZW50OiAnVGVzdCBjb250ZW50JyB9KVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGNvbnRlbnQ6ICdUZXN0IGNvbnRlbnQnIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBjb21wb25lbnQgd2l0aCBwYWdlIGluZm9ybWF0aW9uJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIGkxOG4gbW9jayByZXR1cm5zIGtleSBieSBkZWZhdWx0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmFkZERvY3VtZW50cy5zdGVwT25lLnByZXZpZXcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgTm90aW9uIFBhZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgcGFnZSB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHR5cGU6ICdkYXRhYmFzZScgfSlcblxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gY3VycmVudFBhZ2U9e2N1cnJlbnRQYWdlfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFiYXNlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2xvc2UgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0RhdGEgRmV0Y2hpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG11dGF0ZUFzeW5jIHdpdGggY29ycmVjdCBwYXJhbWV0ZXJzIG9uIG1vdW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7XG4gICAgICAgIHdvcmtzcGFjZV9pZDogJ3dzLTEyMycsXG4gICAgICAgIHBhZ2VfaWQ6ICdwZy00NTYnLFxuICAgICAgICB0eXBlOiAncGFnZScsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxPbmxpbmVEb2N1bWVudFByZXZpZXdcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIGN1cnJlbnRQYWdlPXtjdXJyZW50UGFnZX1cbiAgICAgICAgICBkYXRhc291cmNlTm9kZUlkPVwibm9kZS03ODlcIlxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTXV0YXRlQXN5bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHdvcmtzcGFjZUlEOiAnd3MtMTIzJyxcbiAgICAgICAgICAgIHBhZ2VJRDogJ3BnLTQ1NicsXG4gICAgICAgICAgICBwYWdlVHlwZTogJ3BhZ2UnLFxuICAgICAgICAgICAgcGlwZWxpbmVJZDogJ3BpcGVsaW5lLTEyMycsXG4gICAgICAgICAgICBkYXRhc291cmNlTm9kZUlkOiAnbm9kZS03ODknLFxuICAgICAgICAgICAgY3JlZGVudGlhbElkOiBtb2NrQ3VycmVudENyZWRlbnRpYWxJZCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIG9uU3VjY2VzczogZXhwZWN0LmFueShGdW5jdGlvbiksXG4gICAgICAgICAgICBvbkVycm9yOiBleHBlY3QuYW55KEZ1bmN0aW9uKSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBmZXRjaCBkYXRhIGFnYWluIHdoZW4gcGFnZV9pZCBjaGFuZ2VzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFBhZ2UxID0gY3JlYXRlTW9ja05vdGlvblBhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJyB9KVxuICAgICAgY29uc3QgY3VycmVudFBhZ2UyID0gY3JlYXRlTW9ja05vdGlvblBhZ2UoeyBwYWdlX2lkOiAncGFnZS0yJyB9KVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxPbmxpbmVEb2N1bWVudFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gY3VycmVudFBhZ2U9e2N1cnJlbnRQYWdlMX0gLz4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja011dGF0ZUFzeW5jKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIHJlcmVuZGVyKDxPbmxpbmVEb2N1bWVudFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gY3VycmVudFBhZ2U9e2N1cnJlbnRQYWdlMn0gLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja011dGF0ZUFzeW5jKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHBpcGVsaW5lSWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrUGlwZWxpbmVJZC5tb2NrUmV0dXJuVmFsdWUodW5kZWZpbmVkKVxuXG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTXV0YXRlQXN5bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIHBpcGVsaW5lSWQ6ICcnLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGV4cGVjdC5hbnl0aGluZygpLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0xvYWRpbmcgU3RhdGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbG9hZGluZyBjb21wb25lbnQgd2hlbiBpc1BlbmRpbmcgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIG1vY2tVc2VQcmV2aWV3T25saW5lRG9jdW1lbnQubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgbXV0YXRlQXN5bmM6IG1vY2tNdXRhdGVBc3luYyxcbiAgICAgICAgaXNQZW5kaW5nOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIExvYWRpbmcgY29tcG9uZW50IHJlbmRlcnMgc2tlbGV0b25cbiAgICAgIGV4cGVjdChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcub3ZlcmZsb3ctaGlkZGVuJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIG1hcmtkb3duIGNvbnRlbnQgd2hlbiBsb2FkaW5nJywgKCkgPT4ge1xuICAgICAgbW9ja1VzZVByZXZpZXdPbmxpbmVEb2N1bWVudC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBtdXRhdGVBc3luYzogbW9ja011dGF0ZUFzeW5jLFxuICAgICAgICBpc1BlbmRpbmc6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQ29udGVudCBhcmVhIHNob3VsZCBub3QgYmUgcHJlc2VudFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnVGVzdCBjb250ZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ29udGVudCBEaXNwbGF5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIG1hcmtkb3duIGNvbnRlbnQgd2hlbiBsb2FkZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIGNhbGxiYWNrcykgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25TdWNjZXNzKHsgY29udGVudDogJ01hcmtkb3duIGNvbnRlbnQgaGVyZScgfSlcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGNvbnRlbnQ6ICdNYXJrZG93biBjb250ZW50IGhlcmUnIH0pXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIC8vIE1hcmtkb3duIGNvbXBvbmVudCByZW5kZXJzIHRoZSBjb250ZW50XG4gICAgICAgIGNvbnN0IGNvbnRlbnRBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm92ZXJmbG93LWhpZGRlbi5weC02LnB5LTUnKVxuICAgICAgICBleHBlY3QoY29udGVudEFyZWEpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjaGFyYWN0ZXIgY291bnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIGNhbGxiYWNrcykgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25TdWNjZXNzKHsgY29udGVudDogJ0hlbGxvJyB9KSAvLyA1IGNoYXJhY3RlcnNcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGNvbnRlbnQ6ICdIZWxsbycgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgLy8gUmVhbCBmb3JtYXROdW1iZXJBYmJyZXZpYXRlZCByZXR1cm5zIFwiNVwiIGZvciBudW1iZXJzIDwgMTAwMFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvNS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGZvcm1hdCBsYXJnZSBjaGFyYWN0ZXIgY291bnRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbG9uZ0NvbnRlbnQgPSAnYScucmVwZWF0KDI1MDApXG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIGNhbGxiYWNrcykgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25TdWNjZXNzKHsgY29udGVudDogbG9uZ0NvbnRlbnQgfSlcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGNvbnRlbnQ6IGxvbmdDb250ZW50IH0pXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50UHJldmlldyB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIC8vIFJlYWwgZm9ybWF0TnVtYmVyQWJicmV2aWF0ZWQgdXNlcyBsb3dlcmNhc2UgJ2snOiBcIjIuNWtcIlxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMlxcLjVrLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjaGFyYWN0ZXIgY291bnQgYmFzZWQgb24gZmV0Y2hlZCBjb250ZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gV2hlbiBjb250ZW50IGlzIHNldCB2aWEgb25TdWNjZXNzLCBjaGFyYWN0ZXIgY291bnQgaXMgZGlzcGxheWVkXG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIGNhbGxiYWNrcykgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25TdWNjZXNzKHsgY29udGVudDogJ1Rlc3QgY29udGVudCcgfSkgLy8gMTIgY2hhcmFjdGVyc1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHsgY29udGVudDogJ1Rlc3QgY29udGVudCcgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoLzEyLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IHRvYXN0IG5vdGlmaWNhdGlvbiBvbiBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9ICdGYWlsZWQgdG8gZmV0Y2ggZG9jdW1lbnQnXG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja0ltcGxlbWVudGF0aW9uKChwYXJhbXMsIGNhbGxiYWNrcykgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25FcnJvcihuZXcgRXJyb3IoZXJyb3JNZXNzYWdlKSlcbiAgICAgICAgLy8gUmV0dXJuIGEgcmVzb2x2ZWQgcHJvbWlzZSB0byBhdm9pZCB1bmhhbmRsZWQgcmVqZWN0aW9uXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QodG9hc3ROb3RpZnlTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6IGVycm9yTWVzc2FnZSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG5ldHdvcmsgZXJyb3JzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbmV0d29ya0Vycm9yID0gbmV3IEVycm9yKCdOZXR3b3JrIEVycm9yJylcbiAgICAgIG1vY2tNdXRhdGVBc3luYy5tb2NrSW1wbGVtZW50YXRpb24oKHBhcmFtcywgY2FsbGJhY2tzKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrcy5vbkVycm9yKG5ldHdvcmtFcnJvcilcbiAgICAgICAgLy8gUmV0dXJuIGEgcmVzb2x2ZWQgcHJvbWlzZSB0byBhdm9pZCB1bmhhbmRsZWQgcmVqZWN0aW9uXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QodG9hc3ROb3RpZnlTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdOZXR3b3JrIEVycm9yJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhpZGVQcmV2aWV3IHdoZW4gY2xvc2UgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBoaWRlUHJldmlldyA9IHZpLmZuKClcblxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gaGlkZVByZXZpZXc9e2hpZGVQcmV2aWV3fSAvPilcblxuICAgICAgLy8gRmluZCB0aGUgY2xvc2UgYnV0dG9uIGluIHRoZSBoZWFkZXIgYXJlYSAobm90IHRvYXN0IGJ1dHRvbnMpXG4gICAgICBjb25zdCBoZWFkZXJBcmVhID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZsZXguZ2FwLXgtMi5ib3JkZXItYicpXG4gICAgICBjb25zdCBjbG9zZUJ1dHRvbiA9IGhlYWRlckFyZWE/LnF1ZXJ5U2VsZWN0b3IoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoY2xvc2VCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGZpcmVFdmVudC5jbGljayhjbG9zZUJ1dHRvbiEpXG5cbiAgICAgIGV4cGVjdChoaWRlUHJldmlldykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgcGFnZV9uYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHBhZ2VfbmFtZTogJycgfSlcblxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gY3VycmVudFBhZ2U9e2N1cnJlbnRQYWdlfSAvPilcblxuICAgICAgLy8gRmluZCB0aGUgY2xvc2UgYnV0dG9uIGluIHRoZSBoZWFkZXIgYXJlYVxuICAgICAgY29uc3QgaGVhZGVyQXJlYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5mbGV4LmdhcC14LTIuYm9yZGVyLWInKVxuICAgICAgY29uc3QgY2xvc2VCdXR0b24gPSBoZWFkZXJBcmVhPy5xdWVyeVNlbGVjdG9yKCdidXR0b24nKVxuICAgICAgZXhwZWN0KGNsb3NlQnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRpZmZlcmVudCBwYWdlIHR5cGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudFBhZ2UgPSBjcmVhdGVNb2NrTm90aW9uUGFnZSh7IHR5cGU6ICdkYXRhYmFzZScgfSlcblxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudFByZXZpZXcgey4uLmRlZmF1bHRQcm9wc30gY3VycmVudFBhZ2U9e2N1cnJlbnRQYWdlfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFiYXNlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgY3JlZGVudGlhbElkIGZyb20gc3RvcmUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrR2V0U3RhdGUubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgY3VycmVudENyZWRlbnRpYWxJZDogJ2N1c3RvbS1jcmVkZW50aWFsJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tNdXRhdGVBc3luYykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgY3JlZGVudGlhbElkOiAnY3VzdG9tLWNyZWRlbnRpYWwnLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIGV4cGVjdC5hbnl0aGluZygpLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgbWFya2Rvd24gY29udGVudCB3aGVuIGNvbnRlbnQgaXMgZW1wdHkgYW5kIG5vdCBwZW5kaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja011dGF0ZUFzeW5jLm1vY2tJbXBsZW1lbnRhdGlvbigocGFyYW1zLCBjYWxsYmFja3MpID0+IHtcbiAgICAgICAgY2FsbGJhY2tzLm9uU3VjY2Vzcyh7IGNvbnRlbnQ6ICcnIH0pXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyBjb250ZW50OiAnJyB9KVxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQcmV2aWV3T25saW5lRG9jdW1lbnQubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgbXV0YXRlQXN5bmM6IG1vY2tNdXRhdGVBc3luYyxcbiAgICAgICAgaXNQZW5kaW5nOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRQcmV2aWV3IHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBDb250ZW50IGlzIGVtcHR5LCBtYXJrZG93biBhcmVhIHNob3VsZCBzdGlsbCByZW5kZXIgYnV0IGJlIGVtcHR5XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnVGVzdCBjb250ZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19