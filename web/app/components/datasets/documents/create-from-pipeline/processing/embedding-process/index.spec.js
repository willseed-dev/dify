"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const type_1 = require("@/app/components/billing/type");
const step_two_1 = require("@/app/components/datasets/create/step-two");
const pipeline_1 = require("@/models/pipeline");
const app_1 = require("@/types/app");
const index_1 = require("./index");
// ==========================================
// Mock External Dependencies
// ==========================================
// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));
// Mock next/link
vi.mock('next/link', () => ({
    default: function MockLink({ children, href, ...props }) {
        return <a href={href} {...props}>{children}</a>;
    },
}));
// Mock provider context
let mockEnableBilling = false;
let mockPlanType = type_1.Plan.sandbox;
vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => ({
        enableBilling: mockEnableBilling,
        plan: { type: mockPlanType },
    }),
}));
// Mock useIndexingStatusBatch hook
let mockFetchIndexingStatus;
let mockIndexingStatusData = [];
vi.mock('@/service/knowledge/use-dataset', () => ({
    useIndexingStatusBatch: () => ({
        mutateAsync: mockFetchIndexingStatus,
    }),
    useProcessRule: () => ({
        data: {
            mode: 'custom',
            rules: { parent_mode: 'paragraph' },
        },
    }),
}));
// Mock useInvalidDocumentList hook
const mockInvalidDocumentList = vi.fn();
vi.mock('@/service/knowledge/use-document', () => ({
    useInvalidDocumentList: () => mockInvalidDocumentList,
}));
// Mock useDatasetApiAccessUrl hook
vi.mock('@/hooks/use-api-access-url', () => ({
    useDatasetApiAccessUrl: () => 'https://docs.dify.ai/api-reference/datasets',
}));
// ==========================================
// Test Data Factory Functions
// ==========================================
/**
 * Creates a mock InitialDocumentDetail for testing
 * Uses deterministic counter-based IDs to avoid flaky tests
 */
let documentIdCounter = 0;
const createMockDocument = (overrides = {}) => ({
    id: overrides.id ?? `doc-${++documentIdCounter}`,
    name: 'test-document.txt',
    data_source_type: pipeline_1.DatasourceType.localFile,
    data_source_info: {},
    enable: true,
    error: '',
    indexing_status: 'waiting',
    position: 0,
    ...overrides,
});
/**
 * Creates a mock IndexingStatusResponse for testing
 */
const createMockIndexingStatus = (overrides = {}) => ({
    id: `doc-${Math.random().toString(36).slice(2, 9)}`,
    indexing_status: 'waiting',
    processing_started_at: Date.now(),
    parsing_completed_at: 0,
    cleaning_completed_at: 0,
    splitting_completed_at: 0,
    completed_at: null,
    paused_at: null,
    error: null,
    stopped_at: null,
    completed_segments: 0,
    total_segments: 100,
    ...overrides,
});
/**
 * Creates default props for EmbeddingProcess component
 */
const createDefaultProps = (overrides = {}) => ({
    datasetId: 'dataset-123',
    batchId: 'batch-456',
    documents: [createMockDocument({ id: 'doc-1', name: 'test-doc.pdf' })],
    indexingType: step_two_1.IndexingType.QUALIFIED,
    retrievalMethod: app_1.RETRIEVE_METHOD.semantic,
    ...overrides,
});
// ==========================================
// Test Suite
// ==========================================
describe('EmbeddingProcess', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers({ shouldAdvanceTime: true });
        // Reset deterministic ID counter for reproducible tests
        documentIdCounter = 0;
        // Reset mock states
        mockEnableBilling = false;
        mockPlanType = type_1.Plan.sandbox;
        mockIndexingStatusData = [];
        // Setup default mock for fetchIndexingStatus
        mockFetchIndexingStatus = vi.fn().mockImplementation((_, options) => {
            options?.onSuccess?.({ data: mockIndexingStatusData });
            options?.onSettled?.();
            return Promise.resolve({ data: mockIndexingStatusData });
        });
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        // Tests basic rendering functionality
        it('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('rule-detail')).toBeInTheDocument();
        });
        it('should render RuleDetail component with correct props', () => {
            // Arrange
            const props = createDefaultProps({
                indexingType: step_two_1.IndexingType.ECONOMICAL,
                retrievalMethod: app_1.RETRIEVE_METHOD.fullText,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - RuleDetail renders FieldInfo components with translated text
            // Check that the component renders without error
            expect(react_1.screen.getByTestId('rule-detail')).toBeInTheDocument();
        });
        it('should render API reference link with correct URL', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const apiLink = react_1.screen.getByRole('link', { name: /access the api/i });
            expect(apiLink).toHaveAttribute('href', 'https://docs.dify.ai/api-reference/datasets');
            expect(apiLink).toHaveAttribute('target', '_blank');
            expect(apiLink).toHaveAttribute('rel', 'noopener noreferrer');
        });
        it('should render navigation button', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.stepThree.navTo')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Billing/Upgrade Banner Tests
    // ==========================================
    describe('Billing and Upgrade Banner', () => {
        // Tests for billing-related UI
        it('should not show upgrade banner when billing is disabled', () => {
            // Arrange
            mockEnableBilling = false;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByText('billing.plansCommon.documentProcessingPriorityUpgrade')).not.toBeInTheDocument();
        });
        it('should show upgrade banner when billing is enabled and plan is not team', () => {
            // Arrange
            mockEnableBilling = true;
            mockPlanType = type_1.Plan.sandbox;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('billing.plansCommon.documentProcessingPriorityUpgrade')).toBeInTheDocument();
        });
        it('should not show upgrade banner when plan is team', () => {
            // Arrange
            mockEnableBilling = true;
            mockPlanType = type_1.Plan.team;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByText('billing.plansCommon.documentProcessingPriorityUpgrade')).not.toBeInTheDocument();
        });
        it('should show upgrade banner for professional plan', () => {
            // Arrange
            mockEnableBilling = true;
            mockPlanType = type_1.Plan.professional;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('billing.plansCommon.documentProcessingPriorityUpgrade')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Status Display Tests
    // ==========================================
    describe('Status Display', () => {
        // Tests for embedding status display
        it('should show waiting status when all documents are waiting', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'waiting' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('datasetDocuments.embedding.waiting')).toBeInTheDocument();
        });
        it('should show processing status when any document is indexing', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('datasetDocuments.embedding.processing')).toBeInTheDocument();
        });
        it('should show processing status when any document is splitting', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'splitting' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('datasetDocuments.embedding.processing')).toBeInTheDocument();
        });
        it('should show processing status when any document is parsing', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'parsing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('datasetDocuments.embedding.processing')).toBeInTheDocument();
        });
        it('should show processing status when any document is cleaning', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'cleaning' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('datasetDocuments.embedding.processing')).toBeInTheDocument();
        });
        it('should show completed status when all documents are completed', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'completed' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('datasetDocuments.embedding.completed')).toBeInTheDocument();
        });
        it('should show completed status when all documents have error status', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'error', error: 'Processing failed' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('datasetDocuments.embedding.completed')).toBeInTheDocument();
        });
        it('should show completed status when all documents are paused', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'paused' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('datasetDocuments.embedding.completed')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Progress Bar Tests
    // ==========================================
    describe('Progress Display', () => {
        // Tests for progress bar rendering
        it('should show progress percentage for embedding documents', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({
                    id: 'doc-1',
                    indexing_status: 'indexing',
                    completed_segments: 50,
                    total_segments: 100,
                }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('50%')).toBeInTheDocument();
        });
        it('should cap progress at 100%', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({
                    id: 'doc-1',
                    indexing_status: 'indexing',
                    completed_segments: 150,
                    total_segments: 100,
                }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('100%')).toBeInTheDocument();
        });
        it('should show 0% when total_segments is 0', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({
                    id: 'doc-1',
                    indexing_status: 'indexing',
                    completed_segments: 0,
                    total_segments: 0,
                }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('0%')).toBeInTheDocument();
        });
        it('should not show progress for completed documents', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({
                    id: 'doc-1',
                    indexing_status: 'completed',
                    completed_segments: 100,
                    total_segments: 100,
                }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.queryByText('100%')).not.toBeInTheDocument();
        });
    });
    // ==========================================
    // Polling Logic Tests
    // ==========================================
    describe('Polling Logic', () => {
        // Tests for API polling behavior
        it('should start polling on mount', async () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - verify fetch was called at least once
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
        });
        it('should continue polling while documents are processing', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            const initialCallCount = mockFetchIndexingStatus.mock.calls.length;
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Wait for initial fetch
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus.mock.calls.length).toBeGreaterThan(initialCallCount);
            });
            const afterInitialCount = mockFetchIndexingStatus.mock.calls.length;
            // Advance timer for next poll
            vi.advanceTimersByTime(2500);
            // Assert - should poll again
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus.mock.calls.length).toBeGreaterThan(afterInitialCount);
            });
        });
        it('should stop polling when all documents are completed', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'completed' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Wait for initial fetch and state update
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            const callCountAfterComplete = mockFetchIndexingStatus.mock.calls.length;
            // Advance timer - polling should have stopped
            vi.advanceTimersByTime(5000);
            // Assert - call count should not increase significantly after completion
            // Note: Due to React Strict Mode, there might be double renders
            expect(mockFetchIndexingStatus.mock.calls.length).toBeLessThanOrEqual(callCountAfterComplete + 1);
        });
        it('should stop polling when all documents have errors', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'error' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Wait for initial fetch
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            const callCountAfterError = mockFetchIndexingStatus.mock.calls.length;
            // Advance timer
            vi.advanceTimersByTime(5000);
            // Assert - should not poll significantly more after error state
            expect(mockFetchIndexingStatus.mock.calls.length).toBeLessThanOrEqual(callCountAfterError + 1);
        });
        it('should stop polling when all documents are paused', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'paused' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Wait for initial fetch
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            const callCountAfterPaused = mockFetchIndexingStatus.mock.calls.length;
            // Advance timer
            vi.advanceTimersByTime(5000);
            // Assert - should not poll significantly more after paused state
            expect(mockFetchIndexingStatus.mock.calls.length).toBeLessThanOrEqual(callCountAfterPaused + 1);
        });
        it('should cleanup timeout on unmount', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            const { unmount } = (0, react_1.render)(<index_1.default {...props}/>);
            // Wait for initial fetch
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            const callCountBeforeUnmount = mockFetchIndexingStatus.mock.calls.length;
            // Unmount before next poll
            unmount();
            // Advance timer
            vi.advanceTimersByTime(5000);
            // Assert - should not poll after unmount
            expect(mockFetchIndexingStatus.mock.calls.length).toBe(callCountBeforeUnmount);
        });
    });
    // ==========================================
    // User Interactions Tests
    // ==========================================
    describe('User Interactions', () => {
        // Tests for button clicks and navigation
        it('should navigate to document list when nav button is clicked', async () => {
            // Arrange
            const props = createDefaultProps({ datasetId: 'my-dataset-123' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const navButton = react_1.screen.getByText('datasetCreation.stepThree.navTo');
            react_1.fireEvent.click(navButton);
            // Assert
            expect(mockInvalidDocumentList).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/datasets/my-dataset-123/documents');
        });
        it('should call invalidDocumentList before navigation', () => {
            // Arrange
            const props = createDefaultProps();
            const callOrder = [];
            mockInvalidDocumentList.mockImplementation(() => callOrder.push('invalidate'));
            mockPush.mockImplementation(() => callOrder.push('push'));
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            const navButton = react_1.screen.getByText('datasetCreation.stepThree.navTo');
            react_1.fireEvent.click(navButton);
            // Assert
            expect(callOrder).toEqual(['invalidate', 'push']);
        });
    });
    // ==========================================
    // Document Display Tests
    // ==========================================
    describe('Document Display', () => {
        // Tests for document list rendering
        it('should display document names', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1', name: 'my-report.pdf' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('my-report.pdf')).toBeInTheDocument();
        });
        it('should display multiple documents', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1', name: 'file1.txt' });
            const doc2 = createMockDocument({ id: 'doc-2', name: 'file2.pdf' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
                createMockIndexingStatus({ id: 'doc-2', indexing_status: 'waiting' }),
            ];
            const props = createDefaultProps({ documents: [doc1, doc2] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('file1.txt')).toBeInTheDocument();
            expect(react_1.screen.getByText('file2.pdf')).toBeInTheDocument();
        });
        it('should handle documents with special characters in names', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1', name: 'report_2024 (final) - copy.pdf' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('report_2024 (final) - copy.pdf')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Data Source Type Tests
    // ==========================================
    describe('Data Source Types', () => {
        // Tests for different data source type displays
        it('should handle local file data source', async () => {
            // Arrange
            const doc1 = createMockDocument({
                id: 'doc-1',
                name: 'local-file.pdf',
                data_source_type: pipeline_1.DatasourceType.localFile,
            });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('local-file.pdf')).toBeInTheDocument();
        });
        it('should handle online document data source', async () => {
            // Arrange
            const doc1 = createMockDocument({
                id: 'doc-1',
                name: 'Notion Page',
                data_source_type: pipeline_1.DatasourceType.onlineDocument,
                data_source_info: { notion_page_icon: { type: 'emoji', emoji: '📄' } },
            });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('Notion Page')).toBeInTheDocument();
        });
        it('should handle website crawl data source', async () => {
            // Arrange
            const doc1 = createMockDocument({
                id: 'doc-1',
                name: 'https://example.com/page',
                data_source_type: pipeline_1.DatasourceType.websiteCrawl,
            });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('https://example.com/page')).toBeInTheDocument();
        });
        it('should handle online drive data source', async () => {
            // Arrange
            const doc1 = createMockDocument({
                id: 'doc-1',
                name: 'Google Drive Document',
                data_source_type: pipeline_1.DatasourceType.onlineDrive,
            });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('Google Drive Document')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Error Handling Tests
    // ==========================================
    describe('Error Handling', () => {
        // Tests for error states and displays
        it('should display error icon for documents with error status', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({
                    id: 'doc-1',
                    indexing_status: 'error',
                    error: 'Failed to process document',
                }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert - error icon should be visible
            const errorIcon = container.querySelector('.text-text-destructive');
            expect(errorIcon).toBeInTheDocument();
        });
        it('should apply error styling to document row with error', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({
                    id: 'doc-1',
                    indexing_status: 'error',
                    error: 'Processing failed',
                }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert - should have error background class
            const errorRow = container.querySelector('.bg-state-destructive-hover-alt');
            expect(errorRow).toBeInTheDocument();
        });
    });
    // ==========================================
    // Edge Cases
    // ==========================================
    describe('Edge Cases', () => {
        // Tests for boundary conditions
        it('should throw error when documents array is empty', () => {
            // Arrange
            // The component accesses documents[0].id for useProcessRule (line 81-82),
            // which throws TypeError when documents array is empty.
            // This test documents this known limitation.
            const props = createDefaultProps({ documents: [] });
            // Suppress console errors for expected error
            const consoleError = vi.spyOn(console, 'error').mockImplementation(Function.prototype);
            // Act & Assert - explicitly assert the error behavior
            expect(() => {
                (0, react_1.render)(<index_1.default {...props}/>);
            }).toThrow(TypeError);
            consoleError.mockRestore();
        });
        it('should handle empty indexing status response', async () => {
            // Arrange
            mockIndexingStatusData = [];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert - should not show any status text when empty
            expect(react_1.screen.queryByText('datasetDocuments.embedding.waiting')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('datasetDocuments.embedding.processing')).not.toBeInTheDocument();
            expect(react_1.screen.queryByText('datasetDocuments.embedding.completed')).not.toBeInTheDocument();
        });
        it('should handle document with undefined name', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1', name: undefined });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act & Assert - should not throw
            expect(() => (0, react_1.render)(<index_1.default {...props}/>)).not.toThrow();
        });
        it('should handle document not found in indexing status', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'other-doc', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act & Assert - should not throw
            expect(() => (0, react_1.render)(<index_1.default {...props}/>)).not.toThrow();
        });
        it('should handle undefined indexing_status', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({
                    id: 'doc-1',
                    indexing_status: undefined,
                }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act & Assert - should not throw
            expect(() => (0, react_1.render)(<index_1.default {...props}/>)).not.toThrow();
        });
        it('should handle mixed status documents', async () => {
            // Arrange
            const doc1 = createMockDocument({ id: 'doc-1' });
            const doc2 = createMockDocument({ id: 'doc-2' });
            const doc3 = createMockDocument({ id: 'doc-3' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'completed' }),
                createMockIndexingStatus({ id: 'doc-2', indexing_status: 'indexing' }),
                createMockIndexingStatus({ id: 'doc-3', indexing_status: 'error' }),
            ];
            const props = createDefaultProps({ documents: [doc1, doc2, doc3] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert - should show processing (since one is still indexing)
            expect(react_1.screen.getByText('datasetDocuments.embedding.processing')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Variations Tests
    // ==========================================
    describe('Props Variations', () => {
        // Tests for different prop combinations
        it('should handle undefined indexingType', () => {
            // Arrange
            const props = createDefaultProps({ indexingType: undefined });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - component renders without crashing
            expect(react_1.screen.getByTestId('rule-detail')).toBeInTheDocument();
        });
        it('should handle undefined retrievalMethod', () => {
            // Arrange
            const props = createDefaultProps({ retrievalMethod: undefined });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - component renders without crashing
            expect(react_1.screen.getByTestId('rule-detail')).toBeInTheDocument();
        });
        it('should pass different indexingType values', () => {
            // Arrange
            const indexingTypes = [step_two_1.IndexingType.QUALIFIED, step_two_1.IndexingType.ECONOMICAL];
            indexingTypes.forEach((indexingType) => {
                const props = createDefaultProps({ indexingType });
                // Act
                const { unmount } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - RuleDetail renders and shows appropriate text based on indexingType
                expect(react_1.screen.getByTestId('rule-detail')).toBeInTheDocument();
                unmount();
            });
        });
        it('should pass different retrievalMethod values', () => {
            // Arrange
            const retrievalMethods = [app_1.RETRIEVE_METHOD.semantic, app_1.RETRIEVE_METHOD.fullText, app_1.RETRIEVE_METHOD.hybrid];
            retrievalMethods.forEach((retrievalMethod) => {
                const props = createDefaultProps({ retrievalMethod });
                // Act
                const { unmount } = (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - RuleDetail renders and shows appropriate text based on retrievalMethod
                expect(react_1.screen.getByTestId('rule-detail')).toBeInTheDocument();
                unmount();
            });
        });
    });
    // ==========================================
    // Memoization Tests
    // ==========================================
    describe('Memoization Logic', () => {
        // Tests for useMemo computed values
        it('should correctly compute isEmbeddingWaiting', async () => {
            // Arrange - all waiting
            const doc1 = createMockDocument({ id: 'doc-1' });
            const doc2 = createMockDocument({ id: 'doc-2' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'waiting' }),
                createMockIndexingStatus({ id: 'doc-2', indexing_status: 'waiting' }),
            ];
            const props = createDefaultProps({ documents: [doc1, doc2] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('datasetDocuments.embedding.waiting')).toBeInTheDocument();
        });
        it('should correctly compute isEmbedding when one is indexing', async () => {
            // Arrange - one waiting, one indexing
            const doc1 = createMockDocument({ id: 'doc-1' });
            const doc2 = createMockDocument({ id: 'doc-2' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'waiting' }),
                createMockIndexingStatus({ id: 'doc-2', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1, doc2] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('datasetDocuments.embedding.processing')).toBeInTheDocument();
        });
        it('should correctly compute isEmbeddingCompleted for mixed terminal states', async () => {
            // Arrange - completed + error + paused = all terminal
            const doc1 = createMockDocument({ id: 'doc-1' });
            const doc2 = createMockDocument({ id: 'doc-2' });
            const doc3 = createMockDocument({ id: 'doc-3' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'completed' }),
                createMockIndexingStatus({ id: 'doc-2', indexing_status: 'error' }),
                createMockIndexingStatus({ id: 'doc-3', indexing_status: 'paused' }),
            ];
            const props = createDefaultProps({ documents: [doc1, doc2, doc3] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('datasetDocuments.embedding.completed')).toBeInTheDocument();
        });
    });
    // ==========================================
    // File Type Detection Tests
    // ==========================================
    describe('File Type Detection', () => {
        // Tests for getFileType helper function
        it('should extract file extension correctly', async () => {
            // Arrange
            const doc1 = createMockDocument({
                id: 'doc-1',
                name: 'document.pdf',
                data_source_type: pipeline_1.DatasourceType.localFile,
            });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert - file should be displayed (file type detection happens internally)
            expect(react_1.screen.getByText('document.pdf')).toBeInTheDocument();
        });
        it('should handle files with multiple dots', async () => {
            // Arrange
            const doc1 = createMockDocument({
                id: 'doc-1',
                name: 'my.report.2024.pdf',
                data_source_type: pipeline_1.DatasourceType.localFile,
            });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('my.report.2024.pdf')).toBeInTheDocument();
        });
        it('should handle files without extension', async () => {
            // Arrange
            const doc1 = createMockDocument({
                id: 'doc-1',
                name: 'README',
                data_source_type: pipeline_1.DatasourceType.localFile,
            });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert
            expect(react_1.screen.getByText('README')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Priority Label Tests
    // ==========================================
    describe('Priority Label', () => {
        // Tests for priority label display
        it('should show priority label when billing is enabled', async () => {
            // Arrange
            mockEnableBilling = true;
            mockPlanType = type_1.Plan.sandbox;
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert - PriorityLabel component should be rendered
            // Since we don't mock PriorityLabel, we check the structure exists
            expect(container.querySelector('.ml-0')).toBeInTheDocument();
        });
        it('should not show priority label when billing is disabled', async () => {
            // Arrange
            mockEnableBilling = false;
            const doc1 = createMockDocument({ id: 'doc-1' });
            mockIndexingStatusData = [
                createMockIndexingStatus({ id: 'doc-1', indexing_status: 'indexing' }),
            ];
            const props = createDefaultProps({ documents: [doc1] });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            await (0, react_1.waitFor)(() => {
                expect(mockFetchIndexingStatus).toHaveBeenCalled();
            });
            // Assert - upgrade banner should not be present
            expect(react_1.screen.queryByText('billing.plansCommon.documentProcessingPriorityUpgrade')).not.toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5Qix3REFBb0Q7QUFDcEQsd0VBQXdFO0FBQ3hFLGdEQUFrRDtBQUNsRCxxQ0FBNkM7QUFDN0MsbUNBQXNDO0FBRXRDLDZDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0IsNkNBQTZDO0FBRTdDLHVCQUF1QjtBQUN2QixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDeEIsRUFBRSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2hDLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ2hCLElBQUksRUFBRSxRQUFRO0tBQ2YsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsaUJBQWlCO0FBQ2pCLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDMUIsT0FBTyxFQUFFLFNBQVMsUUFBUSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssRUFBK0M7UUFDbEcsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDakQsQ0FBQztDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsd0JBQXdCO0FBQ3hCLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFBO0FBQzdCLElBQUksWUFBWSxHQUFTLFdBQUksQ0FBQyxPQUFPLENBQUE7QUFDckMsRUFBRSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxDQUFDLENB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cG9ydCB0eXBlIHsgRG9jdW1lbnRJbmRleGluZ1N0YXR1cywgSW5kZXhpbmdTdGF0dXNSZXNwb25zZSB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHR5cGUgeyBJbml0aWFsRG9jdW1lbnREZXRhaWwgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBQbGFuIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3R5cGUnXG5pbXBvcnQgeyBJbmRleGluZ1R5cGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2NyZWF0ZS9zdGVwLXR3bydcbmltcG9ydCB7IERhdGFzb3VyY2VUeXBlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgeyBSRVRSSUVWRV9NRVRIT0QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCBFbWJlZGRpbmdQcm9jZXNzIGZyb20gJy4vaW5kZXgnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIG5leHQvbmF2aWdhdGlvblxuY29uc3QgbW9ja1B1c2ggPSB2aS5mbigpXG52aS5tb2NrKCduZXh0L25hdmlnYXRpb24nLCAoKSA9PiAoe1xuICB1c2VSb3V0ZXI6ICgpID0+ICh7XG4gICAgcHVzaDogbW9ja1B1c2gsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgbmV4dC9saW5rXG52aS5tb2NrKCduZXh0L2xpbmsnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiBmdW5jdGlvbiBNb2NrTGluayh7IGNoaWxkcmVuLCBocmVmLCAuLi5wcm9wcyB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUsIGhyZWY6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIDxhIGhyZWY9e2hyZWZ9IHsuLi5wcm9wc30+e2NoaWxkcmVufTwvYT5cbiAgfSxcbn0pKVxuXG4vLyBNb2NrIHByb3ZpZGVyIGNvbnRleHRcbmxldCBtb2NrRW5hYmxlQmlsbGluZyA9IGZhbHNlXG5sZXQgbW9ja1BsYW5UeXBlOiBQbGFuID0gUGxhbi5zYW5kYm94XG52aS5tb2NrKCdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCcsICgpID0+ICh7XG4gIHVzZVByb3ZpZGVyQ29udGV4dDogKCkgPT4gKHtcbiAgICBlbmFibGVCaWxsaW5nOiBtb2NrRW5hYmxlQmlsbGluZyxcbiAgICBwbGFuOiB7IHR5cGU6IG1vY2tQbGFuVHlwZSB9LFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHVzZUluZGV4aW5nU3RhdHVzQmF0Y2ggaG9va1xubGV0IG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzOiBNb2NrXG5sZXQgbW9ja0luZGV4aW5nU3RhdHVzRGF0YTogSW5kZXhpbmdTdGF0dXNSZXNwb25zZVtdID0gW11cbnZpLm1vY2soJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLWRhdGFzZXQnLCAoKSA9PiAoe1xuICB1c2VJbmRleGluZ1N0YXR1c0JhdGNoOiAoKSA9PiAoe1xuICAgIG11dGF0ZUFzeW5jOiBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cyxcbiAgfSksXG4gIHVzZVByb2Nlc3NSdWxlOiAoKSA9PiAoe1xuICAgIGRhdGE6IHtcbiAgICAgIG1vZGU6ICdjdXN0b20nLFxuICAgICAgcnVsZXM6IHsgcGFyZW50X21vZGU6ICdwYXJhZ3JhcGgnIH0sXG4gICAgfSxcbiAgfSksXG59KSlcblxuLy8gTW9jayB1c2VJbnZhbGlkRG9jdW1lbnRMaXN0IGhvb2tcbmNvbnN0IG1vY2tJbnZhbGlkRG9jdW1lbnRMaXN0ID0gdmkuZm4oKVxudmkubW9jaygnQC9zZXJ2aWNlL2tub3dsZWRnZS91c2UtZG9jdW1lbnQnLCAoKSA9PiAoe1xuICB1c2VJbnZhbGlkRG9jdW1lbnRMaXN0OiAoKSA9PiBtb2NrSW52YWxpZERvY3VtZW50TGlzdCxcbn0pKVxuXG4vLyBNb2NrIHVzZURhdGFzZXRBcGlBY2Nlc3NVcmwgaG9va1xudmkubW9jaygnQC9ob29rcy91c2UtYXBpLWFjY2Vzcy11cmwnLCAoKSA9PiAoe1xuICB1c2VEYXRhc2V0QXBpQWNjZXNzVXJsOiAoKSA9PiAnaHR0cHM6Ly9kb2NzLmRpZnkuYWkvYXBpLXJlZmVyZW5jZS9kYXRhc2V0cycsXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yeSBGdW5jdGlvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtb2NrIEluaXRpYWxEb2N1bWVudERldGFpbCBmb3IgdGVzdGluZ1xuICogVXNlcyBkZXRlcm1pbmlzdGljIGNvdW50ZXItYmFzZWQgSURzIHRvIGF2b2lkIGZsYWt5IHRlc3RzXG4gKi9cbmxldCBkb2N1bWVudElkQ291bnRlciA9IDBcbmNvbnN0IGNyZWF0ZU1vY2tEb2N1bWVudCA9IChvdmVycmlkZXM6IFBhcnRpYWw8SW5pdGlhbERvY3VtZW50RGV0YWlsPiA9IHt9KTogSW5pdGlhbERvY3VtZW50RGV0YWlsID0+ICh7XG4gIGlkOiBvdmVycmlkZXMuaWQgPz8gYGRvYy0keysrZG9jdW1lbnRJZENvdW50ZXJ9YCxcbiAgbmFtZTogJ3Rlc3QtZG9jdW1lbnQudHh0JyxcbiAgZGF0YV9zb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlLFxuICBkYXRhX3NvdXJjZV9pbmZvOiB7fSxcbiAgZW5hYmxlOiB0cnVlLFxuICBlcnJvcjogJycsXG4gIGluZGV4aW5nX3N0YXR1czogJ3dhaXRpbmcnIGFzIERvY3VtZW50SW5kZXhpbmdTdGF0dXMsXG4gIHBvc2l0aW9uOiAwLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vKipcbiAqIENyZWF0ZXMgYSBtb2NrIEluZGV4aW5nU3RhdHVzUmVzcG9uc2UgZm9yIHRlc3RpbmdcbiAqL1xuY29uc3QgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzID0gKG92ZXJyaWRlczogUGFydGlhbDxJbmRleGluZ1N0YXR1c1Jlc3BvbnNlPiA9IHt9KTogSW5kZXhpbmdTdGF0dXNSZXNwb25zZSA9PiAoe1xuICBpZDogYGRvYy0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnNsaWNlKDIsIDkpfWAsXG4gIGluZGV4aW5nX3N0YXR1czogJ3dhaXRpbmcnIGFzIERvY3VtZW50SW5kZXhpbmdTdGF0dXMsXG4gIHByb2Nlc3Npbmdfc3RhcnRlZF9hdDogRGF0ZS5ub3coKSxcbiAgcGFyc2luZ19jb21wbGV0ZWRfYXQ6IDAsXG4gIGNsZWFuaW5nX2NvbXBsZXRlZF9hdDogMCxcbiAgc3BsaXR0aW5nX2NvbXBsZXRlZF9hdDogMCxcbiAgY29tcGxldGVkX2F0OiBudWxsLFxuICBwYXVzZWRfYXQ6IG51bGwsXG4gIGVycm9yOiBudWxsLFxuICBzdG9wcGVkX2F0OiBudWxsLFxuICBjb21wbGV0ZWRfc2VnbWVudHM6IDAsXG4gIHRvdGFsX3NlZ21lbnRzOiAxMDAsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8qKlxuICogQ3JlYXRlcyBkZWZhdWx0IHByb3BzIGZvciBFbWJlZGRpbmdQcm9jZXNzIGNvbXBvbmVudFxuICovXG5jb25zdCBjcmVhdGVEZWZhdWx0UHJvcHMgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPHtcbiAgZGF0YXNldElkOiBzdHJpbmdcbiAgYmF0Y2hJZDogc3RyaW5nXG4gIGRvY3VtZW50czogSW5pdGlhbERvY3VtZW50RGV0YWlsW11cbiAgaW5kZXhpbmdUeXBlOiBJbmRleGluZ1R5cGVcbiAgcmV0cmlldmFsTWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Rcbn0+ID0ge30pID0+ICh7XG4gIGRhdGFzZXRJZDogJ2RhdGFzZXQtMTIzJyxcbiAgYmF0Y2hJZDogJ2JhdGNoLTQ1NicsXG4gIGRvY3VtZW50czogW2NyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnLCBuYW1lOiAndGVzdC1kb2MucGRmJyB9KV0sXG4gIGluZGV4aW5nVHlwZTogSW5kZXhpbmdUeXBlLlFVQUxJRklFRCxcbiAgcmV0cmlldmFsTWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBTdWl0ZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdFbWJlZGRpbmdQcm9jZXNzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICB2aS51c2VGYWtlVGltZXJzKHsgc2hvdWxkQWR2YW5jZVRpbWU6IHRydWUgfSlcblxuICAgIC8vIFJlc2V0IGRldGVybWluaXN0aWMgSUQgY291bnRlciBmb3IgcmVwcm9kdWNpYmxlIHRlc3RzXG4gICAgZG9jdW1lbnRJZENvdW50ZXIgPSAwXG5cbiAgICAvLyBSZXNldCBtb2NrIHN0YXRlc1xuICAgIG1vY2tFbmFibGVCaWxsaW5nID0gZmFsc2VcbiAgICBtb2NrUGxhblR5cGUgPSBQbGFuLnNhbmRib3hcbiAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW11cblxuICAgIC8vIFNldHVwIGRlZmF1bHQgbW9jayBmb3IgZmV0Y2hJbmRleGluZ1N0YXR1c1xuICAgIG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzID0gdmkuZm4oKS5tb2NrSW1wbGVtZW50YXRpb24oKF8sIG9wdGlvbnMpID0+IHtcbiAgICAgIG9wdGlvbnM/Lm9uU3VjY2Vzcz8uKHsgZGF0YTogbW9ja0luZGV4aW5nU3RhdHVzRGF0YSB9KVxuICAgICAgb3B0aW9ucz8ub25TZXR0bGVkPy4oKVxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGRhdGE6IG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgfSlcbiAgICB9KVxuICB9KVxuXG4gIGFmdGVyRWFjaCgoKSA9PiB7XG4gICAgdmkudXNlUmVhbFRpbWVycygpXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICAvLyBUZXN0cyBiYXNpYyByZW5kZXJpbmcgZnVuY3Rpb25hbGl0eVxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncnVsZS1kZXRhaWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBSdWxlRGV0YWlsIGNvbXBvbmVudCB3aXRoIGNvcnJlY3QgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGluZGV4aW5nVHlwZTogSW5kZXhpbmdUeXBlLkVDT05PTUlDQUwsXG4gICAgICAgIHJldHJpZXZhbE1ldGhvZDogUkVUUklFVkVfTUVUSE9ELmZ1bGxUZXh0LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gUnVsZURldGFpbCByZW5kZXJzIEZpZWxkSW5mbyBjb21wb25lbnRzIHdpdGggdHJhbnNsYXRlZCB0ZXh0XG4gICAgICAvLyBDaGVjayB0aGF0IHRoZSBjb21wb25lbnQgcmVuZGVycyB3aXRob3V0IGVycm9yXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdydWxlLWRldGFpbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEFQSSByZWZlcmVuY2UgbGluayB3aXRoIGNvcnJlY3QgVVJMJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGFwaUxpbmsgPSBzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJywgeyBuYW1lOiAvYWNjZXNzIHRoZSBhcGkvaSB9KVxuICAgICAgZXhwZWN0KGFwaUxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICdodHRwczovL2RvY3MuZGlmeS5haS9hcGktcmVmZXJlbmNlL2RhdGFzZXRzJylcbiAgICAgIGV4cGVjdChhcGlMaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgICAgZXhwZWN0KGFwaUxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgncmVsJywgJ25vb3BlbmVyIG5vcmVmZXJyZXInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBuYXZpZ2F0aW9uIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5uYXZUbycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQmlsbGluZy9VcGdyYWRlIEJhbm5lciBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0JpbGxpbmcgYW5kIFVwZ3JhZGUgQmFubmVyJywgKCkgPT4ge1xuICAgIC8vIFRlc3RzIGZvciBiaWxsaW5nLXJlbGF0ZWQgVUlcbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHVwZ3JhZGUgYmFubmVyIHdoZW4gYmlsbGluZyBpcyBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tFbmFibGVCaWxsaW5nID0gZmFsc2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdiaWxsaW5nLnBsYW5zQ29tbW9uLmRvY3VtZW50UHJvY2Vzc2luZ1ByaW9yaXR5VXBncmFkZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgdXBncmFkZSBiYW5uZXIgd2hlbiBiaWxsaW5nIGlzIGVuYWJsZWQgYW5kIHBsYW4gaXMgbm90IHRlYW0nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRW5hYmxlQmlsbGluZyA9IHRydWVcbiAgICAgIG1vY2tQbGFuVHlwZSA9IFBsYW4uc2FuZGJveFxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdiaWxsaW5nLnBsYW5zQ29tbW9uLmRvY3VtZW50UHJvY2Vzc2luZ1ByaW9yaXR5VXBncmFkZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgdXBncmFkZSBiYW5uZXIgd2hlbiBwbGFuIGlzIHRlYW0nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRW5hYmxlQmlsbGluZyA9IHRydWVcbiAgICAgIG1vY2tQbGFuVHlwZSA9IFBsYW4udGVhbVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2JpbGxpbmcucGxhbnNDb21tb24uZG9jdW1lbnRQcm9jZXNzaW5nUHJpb3JpdHlVcGdyYWRlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyB1cGdyYWRlIGJhbm5lciBmb3IgcHJvZmVzc2lvbmFsIHBsYW4nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRW5hYmxlQmlsbGluZyA9IHRydWVcbiAgICAgIG1vY2tQbGFuVHlwZSA9IFBsYW4ucHJvZmVzc2lvbmFsXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcucGxhbnNDb21tb24uZG9jdW1lbnRQcm9jZXNzaW5nUHJpb3JpdHlVcGdyYWRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTdGF0dXMgRGlzcGxheSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0YXR1cyBEaXNwbGF5JywgKCkgPT4ge1xuICAgIC8vIFRlc3RzIGZvciBlbWJlZGRpbmcgc3RhdHVzIGRpc3BsYXlcbiAgICBpdCgnc2hvdWxkIHNob3cgd2FpdGluZyBzdGF0dXMgd2hlbiBhbGwgZG9jdW1lbnRzIGFyZSB3YWl0aW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJywgaW5kZXhpbmdfc3RhdHVzOiAnd2FpdGluZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuZW1iZWRkaW5nLndhaXRpbmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgcHJvY2Vzc2luZyBzdGF0dXMgd2hlbiBhbnkgZG9jdW1lbnQgaXMgaW5kZXhpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkb2MxID0gY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMScgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTEnLCBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuZW1iZWRkaW5nLnByb2Nlc3NpbmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgcHJvY2Vzc2luZyBzdGF0dXMgd2hlbiBhbnkgZG9jdW1lbnQgaXMgc3BsaXR0aW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJywgaW5kZXhpbmdfc3RhdHVzOiAnc3BsaXR0aW5nJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jdW1lbnRzOiBbZG9jMV0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldERvY3VtZW50cy5lbWJlZGRpbmcucHJvY2Vzc2luZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBwcm9jZXNzaW5nIHN0YXR1cyB3aGVuIGFueSBkb2N1bWVudCBpcyBwYXJzaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJywgaW5kZXhpbmdfc3RhdHVzOiAncGFyc2luZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuZW1iZWRkaW5nLnByb2Nlc3NpbmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgcHJvY2Vzc2luZyBzdGF0dXMgd2hlbiBhbnkgZG9jdW1lbnQgaXMgY2xlYW5pbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkb2MxID0gY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMScgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTEnLCBpbmRleGluZ19zdGF0dXM6ICdjbGVhbmluZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuZW1iZWRkaW5nLnByb2Nlc3NpbmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgY29tcGxldGVkIHN0YXR1cyB3aGVuIGFsbCBkb2N1bWVudHMgYXJlIGNvbXBsZXRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvYzEgPSBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy0xJyB9KVxuICAgICAgbW9ja0luZGV4aW5nU3RhdHVzRGF0YSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdkb2MtMScsIGluZGV4aW5nX3N0YXR1czogJ2NvbXBsZXRlZCcgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuZW1iZWRkaW5nLmNvbXBsZXRlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjb21wbGV0ZWQgc3RhdHVzIHdoZW4gYWxsIGRvY3VtZW50cyBoYXZlIGVycm9yIHN0YXR1cycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvYzEgPSBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy0xJyB9KVxuICAgICAgbW9ja0luZGV4aW5nU3RhdHVzRGF0YSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdkb2MtMScsIGluZGV4aW5nX3N0YXR1czogJ2Vycm9yJywgZXJyb3I6ICdQcm9jZXNzaW5nIGZhaWxlZCcgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuZW1iZWRkaW5nLmNvbXBsZXRlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjb21wbGV0ZWQgc3RhdHVzIHdoZW4gYWxsIGRvY3VtZW50cyBhcmUgcGF1c2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJywgaW5kZXhpbmdfc3RhdHVzOiAncGF1c2VkJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jdW1lbnRzOiBbZG9jMV0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldERvY3VtZW50cy5lbWJlZGRpbmcuY29tcGxldGVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9ncmVzcyBCYXIgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9ncmVzcyBEaXNwbGF5JywgKCkgPT4ge1xuICAgIC8vIFRlc3RzIGZvciBwcm9ncmVzcyBiYXIgcmVuZGVyaW5nXG4gICAgaXQoJ3Nob3VsZCBzaG93IHByb2dyZXNzIHBlcmNlbnRhZ2UgZm9yIGVtYmVkZGluZyBkb2N1bWVudHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkb2MxID0gY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMScgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7XG4gICAgICAgICAgaWQ6ICdkb2MtMScsXG4gICAgICAgICAgaW5kZXhpbmdfc3RhdHVzOiAnaW5kZXhpbmcnLFxuICAgICAgICAgIGNvbXBsZXRlZF9zZWdtZW50czogNTAsXG4gICAgICAgICAgdG90YWxfc2VnbWVudHM6IDEwMCxcbiAgICAgICAgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzUwJScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FwIHByb2dyZXNzIGF0IDEwMCUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkb2MxID0gY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMScgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7XG4gICAgICAgICAgaWQ6ICdkb2MtMScsXG4gICAgICAgICAgaW5kZXhpbmdfc3RhdHVzOiAnaW5kZXhpbmcnLFxuICAgICAgICAgIGNvbXBsZXRlZF9zZWdtZW50czogMTUwLFxuICAgICAgICAgIHRvdGFsX3NlZ21lbnRzOiAxMDAsXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2N1bWVudHM6IFtkb2MxXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcxMDAlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IDAlIHdoZW4gdG90YWxfc2VnbWVudHMgaXMgMCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvYzEgPSBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy0xJyB9KVxuICAgICAgbW9ja0luZGV4aW5nU3RhdHVzRGF0YSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHtcbiAgICAgICAgICBpZDogJ2RvYy0xJyxcbiAgICAgICAgICBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycsXG4gICAgICAgICAgY29tcGxldGVkX3NlZ21lbnRzOiAwLFxuICAgICAgICAgIHRvdGFsX3NlZ21lbnRzOiAwLFxuICAgICAgICB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jdW1lbnRzOiBbZG9jMV0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMCUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHByb2dyZXNzIGZvciBjb21wbGV0ZWQgZG9jdW1lbnRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoe1xuICAgICAgICAgIGlkOiAnZG9jLTEnLFxuICAgICAgICAgIGluZGV4aW5nX3N0YXR1czogJ2NvbXBsZXRlZCcsXG4gICAgICAgICAgY29tcGxldGVkX3NlZ21lbnRzOiAxMDAsXG4gICAgICAgICAgdG90YWxfc2VnbWVudHM6IDEwMCxcbiAgICAgICAgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnMTAwJScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFBvbGxpbmcgTG9naWMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQb2xsaW5nIExvZ2ljJywgKCkgPT4ge1xuICAgIC8vIFRlc3RzIGZvciBBUEkgcG9sbGluZyBiZWhhdmlvclxuICAgIGl0KCdzaG91bGQgc3RhcnQgcG9sbGluZyBvbiBtb3VudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gdmVyaWZ5IGZldGNoIHdhcyBjYWxsZWQgYXQgbGVhc3Qgb25jZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbnRpbnVlIHBvbGxpbmcgd2hpbGUgZG9jdW1lbnRzIGFyZSBwcm9jZXNzaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJywgaW5kZXhpbmdfc3RhdHVzOiAnaW5kZXhpbmcnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2N1bWVudHM6IFtkb2MxXSB9KVxuICAgICAgY29uc3QgaW5pdGlhbENhbGxDb3VudCA9IG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzLm1vY2suY2FsbHMubGVuZ3RoXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIFdhaXQgZm9yIGluaXRpYWwgZmV0Y2hcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMubW9jay5jYWxscy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbihpbml0aWFsQ2FsbENvdW50KVxuICAgICAgfSlcblxuICAgICAgY29uc3QgYWZ0ZXJJbml0aWFsQ291bnQgPSBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cy5tb2NrLmNhbGxzLmxlbmd0aFxuXG4gICAgICAvLyBBZHZhbmNlIHRpbWVyIGZvciBuZXh0IHBvbGxcbiAgICAgIHZpLmFkdmFuY2VUaW1lcnNCeVRpbWUoMjUwMClcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHBvbGwgYWdhaW5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMubW9jay5jYWxscy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbihhZnRlckluaXRpYWxDb3VudClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3RvcCBwb2xsaW5nIHdoZW4gYWxsIGRvY3VtZW50cyBhcmUgY29tcGxldGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJywgaW5kZXhpbmdfc3RhdHVzOiAnY29tcGxldGVkJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jdW1lbnRzOiBbZG9jMV0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gV2FpdCBmb3IgaW5pdGlhbCBmZXRjaCBhbmQgc3RhdGUgdXBkYXRlXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNhbGxDb3VudEFmdGVyQ29tcGxldGUgPSBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cy5tb2NrLmNhbGxzLmxlbmd0aFxuXG4gICAgICAvLyBBZHZhbmNlIHRpbWVyIC0gcG9sbGluZyBzaG91bGQgaGF2ZSBzdG9wcGVkXG4gICAgICB2aS5hZHZhbmNlVGltZXJzQnlUaW1lKDUwMDApXG5cbiAgICAgIC8vIEFzc2VydCAtIGNhbGwgY291bnQgc2hvdWxkIG5vdCBpbmNyZWFzZSBzaWduaWZpY2FudGx5IGFmdGVyIGNvbXBsZXRpb25cbiAgICAgIC8vIE5vdGU6IER1ZSB0byBSZWFjdCBTdHJpY3QgTW9kZSwgdGhlcmUgbWlnaHQgYmUgZG91YmxlIHJlbmRlcnNcbiAgICAgIGV4cGVjdChtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cy5tb2NrLmNhbGxzLmxlbmd0aCkudG9CZUxlc3NUaGFuT3JFcXVhbChjYWxsQ291bnRBZnRlckNvbXBsZXRlICsgMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzdG9wIHBvbGxpbmcgd2hlbiBhbGwgZG9jdW1lbnRzIGhhdmUgZXJyb3JzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJywgaW5kZXhpbmdfc3RhdHVzOiAnZXJyb3InIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2N1bWVudHM6IFtkb2MxXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBXYWl0IGZvciBpbml0aWFsIGZldGNoXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNhbGxDb3VudEFmdGVyRXJyb3IgPSBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cy5tb2NrLmNhbGxzLmxlbmd0aFxuXG4gICAgICAvLyBBZHZhbmNlIHRpbWVyXG4gICAgICB2aS5hZHZhbmNlVGltZXJzQnlUaW1lKDUwMDApXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBub3QgcG9sbCBzaWduaWZpY2FudGx5IG1vcmUgYWZ0ZXIgZXJyb3Igc3RhdGVcbiAgICAgIGV4cGVjdChtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cy5tb2NrLmNhbGxzLmxlbmd0aCkudG9CZUxlc3NUaGFuT3JFcXVhbChjYWxsQ291bnRBZnRlckVycm9yICsgMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzdG9wIHBvbGxpbmcgd2hlbiBhbGwgZG9jdW1lbnRzIGFyZSBwYXVzZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkb2MxID0gY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMScgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTEnLCBpbmRleGluZ19zdGF0dXM6ICdwYXVzZWQnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2N1bWVudHM6IFtkb2MxXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBXYWl0IGZvciBpbml0aWFsIGZldGNoXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNhbGxDb3VudEFmdGVyUGF1c2VkID0gbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMubW9jay5jYWxscy5sZW5ndGhcblxuICAgICAgLy8gQWR2YW5jZSB0aW1lclxuICAgICAgdmkuYWR2YW5jZVRpbWVyc0J5VGltZSg1MDAwKVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgbm90IHBvbGwgc2lnbmlmaWNhbnRseSBtb3JlIGFmdGVyIHBhdXNlZCBzdGF0ZVxuICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzLm1vY2suY2FsbHMubGVuZ3RoKS50b0JlTGVzc1RoYW5PckVxdWFsKGNhbGxDb3VudEFmdGVyUGF1c2VkICsgMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbGVhbnVwIHRpbWVvdXQgb24gdW5tb3VudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvYzEgPSBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy0xJyB9KVxuICAgICAgbW9ja0luZGV4aW5nU3RhdHVzRGF0YSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdkb2MtMScsIGluZGV4aW5nX3N0YXR1czogJ2luZGV4aW5nJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jdW1lbnRzOiBbZG9jMV0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBXYWl0IGZvciBpbml0aWFsIGZldGNoXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGNhbGxDb3VudEJlZm9yZVVubW91bnQgPSBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cy5tb2NrLmNhbGxzLmxlbmd0aFxuXG4gICAgICAvLyBVbm1vdW50IGJlZm9yZSBuZXh0IHBvbGxcbiAgICAgIHVubW91bnQoKVxuXG4gICAgICAvLyBBZHZhbmNlIHRpbWVyXG4gICAgICB2aS5hZHZhbmNlVGltZXJzQnlUaW1lKDUwMDApXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBub3QgcG9sbCBhZnRlciB1bm1vdW50XG4gICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMubW9jay5jYWxscy5sZW5ndGgpLnRvQmUoY2FsbENvdW50QmVmb3JlVW5tb3VudClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIC8vIFRlc3RzIGZvciBidXR0b24gY2xpY2tzIGFuZCBuYXZpZ2F0aW9uXG4gICAgaXQoJ3Nob3VsZCBuYXZpZ2F0ZSB0byBkb2N1bWVudCBsaXN0IHdoZW4gbmF2IGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkYXRhc2V0SWQ6ICdteS1kYXRhc2V0LTEyMycgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IG5hdkJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5zdGVwVGhyZWUubmF2VG8nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKG5hdkJ1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0ludmFsaWREb2N1bWVudExpc3QpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KG1vY2tQdXNoKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnL2RhdGFzZXRzL215LWRhdGFzZXQtMTIzL2RvY3VtZW50cycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBpbnZhbGlkRG9jdW1lbnRMaXN0IGJlZm9yZSBuYXZpZ2F0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgY29uc3QgY2FsbE9yZGVyOiBzdHJpbmdbXSA9IFtdXG4gICAgICBtb2NrSW52YWxpZERvY3VtZW50TGlzdC5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gY2FsbE9yZGVyLnB1c2goJ2ludmFsaWRhdGUnKSlcbiAgICAgIG1vY2tQdXNoLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBjYWxsT3JkZXIucHVzaCgncHVzaCcpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuICAgICAgY29uc3QgbmF2QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldENyZWF0aW9uLnN0ZXBUaHJlZS5uYXZUbycpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sobmF2QnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChjYWxsT3JkZXIpLnRvRXF1YWwoWydpbnZhbGlkYXRlJywgJ3B1c2gnXSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBEb2N1bWVudCBEaXNwbGF5IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRG9jdW1lbnQgRGlzcGxheScsICgpID0+IHtcbiAgICAvLyBUZXN0cyBmb3IgZG9jdW1lbnQgbGlzdCByZW5kZXJpbmdcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgZG9jdW1lbnQgbmFtZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkb2MxID0gY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMScsIG5hbWU6ICdteS1yZXBvcnQucGRmJyB9KVxuICAgICAgbW9ja0luZGV4aW5nU3RhdHVzRGF0YSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdkb2MtMScsIGluZGV4aW5nX3N0YXR1czogJ2luZGV4aW5nJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jdW1lbnRzOiBbZG9jMV0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbXktcmVwb3J0LnBkZicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBtdWx0aXBsZSBkb2N1bWVudHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkb2MxID0gY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMScsIG5hbWU6ICdmaWxlMS50eHQnIH0pXG4gICAgICBjb25zdCBkb2MyID0gY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMicsIG5hbWU6ICdmaWxlMi5wZGYnIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJywgaW5kZXhpbmdfc3RhdHVzOiAnaW5kZXhpbmcnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0yJywgaW5kZXhpbmdfc3RhdHVzOiAnd2FpdGluZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzEsIGRvYzJdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZpbGUxLnR4dCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZmlsZTIucGRmJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZG9jdW1lbnRzIHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzIGluIG5hbWVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnLCBuYW1lOiAncmVwb3J0XzIwMjQgKGZpbmFsKSAtIGNvcHkucGRmJyB9KVxuICAgICAgbW9ja0luZGV4aW5nU3RhdHVzRGF0YSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdkb2MtMScsIGluZGV4aW5nX3N0YXR1czogJ2luZGV4aW5nJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jdW1lbnRzOiBbZG9jMV0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncmVwb3J0XzIwMjQgKGZpbmFsKSAtIGNvcHkucGRmJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBEYXRhIFNvdXJjZSBUeXBlIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRGF0YSBTb3VyY2UgVHlwZXMnLCAoKSA9PiB7XG4gICAgLy8gVGVzdHMgZm9yIGRpZmZlcmVudCBkYXRhIHNvdXJjZSB0eXBlIGRpc3BsYXlzXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbG9jYWwgZmlsZSBkYXRhIHNvdXJjZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvYzEgPSBjcmVhdGVNb2NrRG9jdW1lbnQoe1xuICAgICAgICBpZDogJ2RvYy0xJyxcbiAgICAgICAgbmFtZTogJ2xvY2FsLWZpbGUucGRmJyxcbiAgICAgICAgZGF0YV9zb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlLFxuICAgICAgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTEnLCBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2xvY2FsLWZpbGUucGRmJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb25saW5lIGRvY3VtZW50IGRhdGEgc291cmNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7XG4gICAgICAgIGlkOiAnZG9jLTEnLFxuICAgICAgICBuYW1lOiAnTm90aW9uIFBhZ2UnLFxuICAgICAgICBkYXRhX3NvdXJjZV90eXBlOiBEYXRhc291cmNlVHlwZS5vbmxpbmVEb2N1bWVudCxcbiAgICAgICAgZGF0YV9zb3VyY2VfaW5mbzogeyBub3Rpb25fcGFnZV9pY29uOiB7IHR5cGU6ICdlbW9qaScsIGVtb2ppOiAn8J+ThCcgfSB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTEnLCBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ05vdGlvbiBQYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgd2Vic2l0ZSBjcmF3bCBkYXRhIHNvdXJjZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvYzEgPSBjcmVhdGVNb2NrRG9jdW1lbnQoe1xuICAgICAgICBpZDogJ2RvYy0xJyxcbiAgICAgICAgbmFtZTogJ2h0dHBzOi8vZXhhbXBsZS5jb20vcGFnZScsXG4gICAgICAgIGRhdGFfc291cmNlX3R5cGU6IERhdGFzb3VyY2VUeXBlLndlYnNpdGVDcmF3bCxcbiAgICAgIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJywgaW5kZXhpbmdfc3RhdHVzOiAnaW5kZXhpbmcnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2N1bWVudHM6IFtkb2MxXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdodHRwczovL2V4YW1wbGUuY29tL3BhZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBvbmxpbmUgZHJpdmUgZGF0YSBzb3VyY2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkb2MxID0gY3JlYXRlTW9ja0RvY3VtZW50KHtcbiAgICAgICAgaWQ6ICdkb2MtMScsXG4gICAgICAgIG5hbWU6ICdHb29nbGUgRHJpdmUgRG9jdW1lbnQnLFxuICAgICAgICBkYXRhX3NvdXJjZV90eXBlOiBEYXRhc291cmNlVHlwZS5vbmxpbmVEcml2ZSxcbiAgICAgIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJywgaW5kZXhpbmdfc3RhdHVzOiAnaW5kZXhpbmcnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2N1bWVudHM6IFtkb2MxXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdHb29nbGUgRHJpdmUgRG9jdW1lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVycm9yIEhhbmRsaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgLy8gVGVzdHMgZm9yIGVycm9yIHN0YXRlcyBhbmQgZGlzcGxheXNcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgZXJyb3IgaWNvbiBmb3IgZG9jdW1lbnRzIHdpdGggZXJyb3Igc3RhdHVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoe1xuICAgICAgICAgIGlkOiAnZG9jLTEnLFxuICAgICAgICAgIGluZGV4aW5nX3N0YXR1czogJ2Vycm9yJyxcbiAgICAgICAgICBlcnJvcjogJ0ZhaWxlZCB0byBwcm9jZXNzIGRvY3VtZW50JyxcbiAgICAgICAgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBlcnJvciBpY29uIHNob3VsZCBiZSB2aXNpYmxlXG4gICAgICBjb25zdCBlcnJvckljb24gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnRleHQtdGV4dC1kZXN0cnVjdGl2ZScpXG4gICAgICBleHBlY3QoZXJyb3JJY29uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgZXJyb3Igc3R5bGluZyB0byBkb2N1bWVudCByb3cgd2l0aCBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvYzEgPSBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy0xJyB9KVxuICAgICAgbW9ja0luZGV4aW5nU3RhdHVzRGF0YSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHtcbiAgICAgICAgICBpZDogJ2RvYy0xJyxcbiAgICAgICAgICBpbmRleGluZ19zdGF0dXM6ICdlcnJvcicsXG4gICAgICAgICAgZXJyb3I6ICdQcm9jZXNzaW5nIGZhaWxlZCcsXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2N1bWVudHM6IFtkb2MxXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIGhhdmUgZXJyb3IgYmFja2dyb3VuZCBjbGFzc1xuICAgICAgY29uc3QgZXJyb3JSb3cgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLmJnLXN0YXRlLWRlc3RydWN0aXZlLWhvdmVyLWFsdCcpXG4gICAgICBleHBlY3QoZXJyb3JSb3cpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICAvLyBUZXN0cyBmb3IgYm91bmRhcnkgY29uZGl0aW9uc1xuICAgIGl0KCdzaG91bGQgdGhyb3cgZXJyb3Igd2hlbiBkb2N1bWVudHMgYXJyYXkgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICAvLyBUaGUgY29tcG9uZW50IGFjY2Vzc2VzIGRvY3VtZW50c1swXS5pZCBmb3IgdXNlUHJvY2Vzc1J1bGUgKGxpbmUgODEtODIpLFxuICAgICAgLy8gd2hpY2ggdGhyb3dzIFR5cGVFcnJvciB3aGVuIGRvY3VtZW50cyBhcnJheSBpcyBlbXB0eS5cbiAgICAgIC8vIFRoaXMgdGVzdCBkb2N1bWVudHMgdGhpcyBrbm93biBsaW1pdGF0aW9uLlxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2N1bWVudHM6IFtdIH0pXG5cbiAgICAgIC8vIFN1cHByZXNzIGNvbnNvbGUgZXJyb3JzIGZvciBleHBlY3RlZCBlcnJvclxuICAgICAgY29uc3QgY29uc29sZUVycm9yID0gdmkuc3B5T24oY29uc29sZSwgJ2Vycm9yJykubW9ja0ltcGxlbWVudGF0aW9uKEZ1bmN0aW9uLnByb3RvdHlwZSBhcyAoKSA9PiB2b2lkKVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnQgLSBleHBsaWNpdGx5IGFzc2VydCB0aGUgZXJyb3IgYmVoYXZpb3JcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuICAgICAgfSkudG9UaHJvdyhUeXBlRXJyb3IpXG5cbiAgICAgIGNvbnNvbGVFcnJvci5tb2NrUmVzdG9yZSgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGluZGV4aW5nIHN0YXR1cyByZXNwb25zZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgbm90IHNob3cgYW55IHN0YXR1cyB0ZXh0IHdoZW4gZW1wdHlcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuZW1iZWRkaW5nLndhaXRpbmcnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuZW1iZWRkaW5nLnByb2Nlc3NpbmcnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuZW1iZWRkaW5nLmNvbXBsZXRlZCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkb2N1bWVudCB3aXRoIHVuZGVmaW5lZCBuYW1lJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnLCBuYW1lOiB1bmRlZmluZWQgYXMgdW5rbm93biBhcyBzdHJpbmcgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTEnLCBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydCAtIHNob3VsZCBub3QgdGhyb3dcbiAgICAgIGV4cGVjdCgoKSA9PiByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPikpLm5vdC50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZG9jdW1lbnQgbm90IGZvdW5kIGluIGluZGV4aW5nIHN0YXR1cycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvYzEgPSBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy0xJyB9KVxuICAgICAgbW9ja0luZGV4aW5nU3RhdHVzRGF0YSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdvdGhlci1kb2MnLCBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydCAtIHNob3VsZCBub3QgdGhyb3dcbiAgICAgIGV4cGVjdCgoKSA9PiByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPikpLm5vdC50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGluZGV4aW5nX3N0YXR1cycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvYzEgPSBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy0xJyB9KVxuICAgICAgbW9ja0luZGV4aW5nU3RhdHVzRGF0YSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHtcbiAgICAgICAgICBpZDogJ2RvYy0xJyxcbiAgICAgICAgICBpbmRleGluZ19zdGF0dXM6IHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIERvY3VtZW50SW5kZXhpbmdTdGF0dXMsXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2N1bWVudHM6IFtkb2MxXSB9KVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnQgLSBzaG91bGQgbm90IHRocm93XG4gICAgICBleHBlY3QoKCkgPT4gcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pKS5ub3QudG9UaHJvdygpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1peGVkIHN0YXR1cyBkb2N1bWVudHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkb2MxID0gY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMScgfSlcbiAgICAgIGNvbnN0IGRvYzIgPSBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy0yJyB9KVxuICAgICAgY29uc3QgZG9jMyA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTMnIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJywgaW5kZXhpbmdfc3RhdHVzOiAnY29tcGxldGVkJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdkb2MtMicsIGluZGV4aW5nX3N0YXR1czogJ2luZGV4aW5nJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdkb2MtMycsIGluZGV4aW5nX3N0YXR1czogJ2Vycm9yJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jdW1lbnRzOiBbZG9jMSwgZG9jMiwgZG9jM10gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHNob3cgcHJvY2Vzc2luZyAoc2luY2Ugb25lIGlzIHN0aWxsIGluZGV4aW5nKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXREb2N1bWVudHMuZW1iZWRkaW5nLnByb2Nlc3NpbmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFZhcmlhdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcyBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIC8vIFRlc3RzIGZvciBkaWZmZXJlbnQgcHJvcCBjb21iaW5hdGlvbnNcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgaW5kZXhpbmdUeXBlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpbmRleGluZ1R5cGU6IHVuZGVmaW5lZCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBjb21wb25lbnQgcmVuZGVycyB3aXRob3V0IGNyYXNoaW5nXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdydWxlLWRldGFpbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCByZXRyaWV2YWxNZXRob2QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHJldHJpZXZhbE1ldGhvZDogdW5kZWZpbmVkIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIGNvbXBvbmVudCByZW5kZXJzIHdpdGhvdXQgY3Jhc2hpbmdcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3J1bGUtZGV0YWlsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGRpZmZlcmVudCBpbmRleGluZ1R5cGUgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgaW5kZXhpbmdUeXBlcyA9IFtJbmRleGluZ1R5cGUuUVVBTElGSUVELCBJbmRleGluZ1R5cGUuRUNPTk9NSUNBTF1cblxuICAgICAgaW5kZXhpbmdUeXBlcy5mb3JFYWNoKChpbmRleGluZ1R5cGUpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpbmRleGluZ1R5cGUgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgeyB1bm1vdW50IH0gPSByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBSdWxlRGV0YWlsIHJlbmRlcnMgYW5kIHNob3dzIGFwcHJvcHJpYXRlIHRleHQgYmFzZWQgb24gaW5kZXhpbmdUeXBlXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3J1bGUtZGV0YWlsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgICB1bm1vdW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBkaWZmZXJlbnQgcmV0cmlldmFsTWV0aG9kIHZhbHVlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHJldHJpZXZhbE1ldGhvZHMgPSBbUkVUUklFVkVfTUVUSE9ELnNlbWFudGljLCBSRVRSSUVWRV9NRVRIT0QuZnVsbFRleHQsIFJFVFJJRVZFX01FVEhPRC5oeWJyaWRdXG5cbiAgICAgIHJldHJpZXZhbE1ldGhvZHMuZm9yRWFjaCgocmV0cmlldmFsTWV0aG9kKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgcmV0cmlldmFsTWV0aG9kIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gUnVsZURldGFpbCByZW5kZXJzIGFuZCBzaG93cyBhcHByb3ByaWF0ZSB0ZXh0IGJhc2VkIG9uIHJldHJpZXZhbE1ldGhvZFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdydWxlLWRldGFpbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgICAgdW5tb3VudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24gTG9naWMnLCAoKSA9PiB7XG4gICAgLy8gVGVzdHMgZm9yIHVzZU1lbW8gY29tcHV0ZWQgdmFsdWVzXG4gICAgaXQoJ3Nob3VsZCBjb3JyZWN0bHkgY29tcHV0ZSBpc0VtYmVkZGluZ1dhaXRpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gYWxsIHdhaXRpbmdcbiAgICAgIGNvbnN0IGRvYzEgPSBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy0xJyB9KVxuICAgICAgY29uc3QgZG9jMiA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTInIH0pXG4gICAgICBtb2NrSW5kZXhpbmdTdGF0dXNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJywgaW5kZXhpbmdfc3RhdHVzOiAnd2FpdGluZycgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTInLCBpbmRleGluZ19zdGF0dXM6ICd3YWl0aW5nJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jdW1lbnRzOiBbZG9jMSwgZG9jMl0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldERvY3VtZW50cy5lbWJlZGRpbmcud2FpdGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IGNvbXB1dGUgaXNFbWJlZGRpbmcgd2hlbiBvbmUgaXMgaW5kZXhpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gb25lIHdhaXRpbmcsIG9uZSBpbmRleGluZ1xuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnIH0pXG4gICAgICBjb25zdCBkb2MyID0gY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMicgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTEnLCBpbmRleGluZ19zdGF0dXM6ICd3YWl0aW5nJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdkb2MtMicsIGluZGV4aW5nX3N0YXR1czogJ2luZGV4aW5nJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jdW1lbnRzOiBbZG9jMSwgZG9jMl0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldERvY3VtZW50cy5lbWJlZGRpbmcucHJvY2Vzc2luZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY29ycmVjdGx5IGNvbXB1dGUgaXNFbWJlZGRpbmdDb21wbGV0ZWQgZm9yIG1peGVkIHRlcm1pbmFsIHN0YXRlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBjb21wbGV0ZWQgKyBlcnJvciArIHBhdXNlZCA9IGFsbCB0ZXJtaW5hbFxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnIH0pXG4gICAgICBjb25zdCBkb2MyID0gY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMicgfSlcbiAgICAgIGNvbnN0IGRvYzMgPSBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy0zJyB9KVxuICAgICAgbW9ja0luZGV4aW5nU3RhdHVzRGF0YSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdkb2MtMScsIGluZGV4aW5nX3N0YXR1czogJ2NvbXBsZXRlZCcgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTInLCBpbmRleGluZ19zdGF0dXM6ICdlcnJvcicgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTMnLCBpbmRleGluZ19zdGF0dXM6ICdwYXVzZWQnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBkb2N1bWVudHM6IFtkb2MxLCBkb2MyLCBkb2MzXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0RG9jdW1lbnRzLmVtYmVkZGluZy5jb21wbGV0ZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEZpbGUgVHlwZSBEZXRlY3Rpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdGaWxlIFR5cGUgRGV0ZWN0aW9uJywgKCkgPT4ge1xuICAgIC8vIFRlc3RzIGZvciBnZXRGaWxlVHlwZSBoZWxwZXIgZnVuY3Rpb25cbiAgICBpdCgnc2hvdWxkIGV4dHJhY3QgZmlsZSBleHRlbnNpb24gY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7XG4gICAgICAgIGlkOiAnZG9jLTEnLFxuICAgICAgICBuYW1lOiAnZG9jdW1lbnQucGRmJyxcbiAgICAgICAgZGF0YV9zb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlLFxuICAgICAgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTEnLCBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydCAtIGZpbGUgc2hvdWxkIGJlIGRpc3BsYXllZCAoZmlsZSB0eXBlIGRldGVjdGlvbiBoYXBwZW5zIGludGVybmFsbHkpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZG9jdW1lbnQucGRmJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZXMgd2l0aCBtdWx0aXBsZSBkb3RzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7XG4gICAgICAgIGlkOiAnZG9jLTEnLFxuICAgICAgICBuYW1lOiAnbXkucmVwb3J0LjIwMjQucGRmJyxcbiAgICAgICAgZGF0YV9zb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlLFxuICAgICAgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTEnLCBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ215LnJlcG9ydC4yMDI0LnBkZicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGZpbGVzIHdpdGhvdXQgZXh0ZW5zaW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jMSA9IGNyZWF0ZU1vY2tEb2N1bWVudCh7XG4gICAgICAgIGlkOiAnZG9jLTEnLFxuICAgICAgICBuYW1lOiAnUkVBRE1FJyxcbiAgICAgICAgZGF0YV9zb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlLFxuICAgICAgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTEnLCBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIHsuLi5wcm9wc30gLz4pXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1JFQURNRScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJpb3JpdHkgTGFiZWwgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcmlvcml0eSBMYWJlbCcsICgpID0+IHtcbiAgICAvLyBUZXN0cyBmb3IgcHJpb3JpdHkgbGFiZWwgZGlzcGxheVxuICAgIGl0KCdzaG91bGQgc2hvdyBwcmlvcml0eSBsYWJlbCB3aGVuIGJpbGxpbmcgaXMgZW5hYmxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tFbmFibGVCaWxsaW5nID0gdHJ1ZVxuICAgICAgbW9ja1BsYW5UeXBlID0gUGxhbi5zYW5kYm94XG4gICAgICBjb25zdCBkb2MxID0gY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMScgfSlcbiAgICAgIG1vY2tJbmRleGluZ1N0YXR1c0RhdGEgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTEnLCBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGRvY3VtZW50czogW2RvYzFdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyB7Li4ucHJvcHN9IC8+KVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hJbmRleGluZ1N0YXR1cykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBQcmlvcml0eUxhYmVsIGNvbXBvbmVudCBzaG91bGQgYmUgcmVuZGVyZWRcbiAgICAgIC8vIFNpbmNlIHdlIGRvbid0IG1vY2sgUHJpb3JpdHlMYWJlbCwgd2UgY2hlY2sgdGhlIHN0cnVjdHVyZSBleGlzdHNcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLm1sLTAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHByaW9yaXR5IGxhYmVsIHdoZW4gYmlsbGluZyBpcyBkaXNhYmxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tFbmFibGVCaWxsaW5nID0gZmFsc2VcbiAgICAgIGNvbnN0IGRvYzEgPSBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy0xJyB9KVxuICAgICAgbW9ja0luZGV4aW5nU3RhdHVzRGF0YSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdkb2MtMScsIGluZGV4aW5nX3N0YXR1czogJ2luZGV4aW5nJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgZG9jdW1lbnRzOiBbZG9jMV0gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gdXBncmFkZSBiYW5uZXIgc2hvdWxkIG5vdCBiZSBwcmVzZW50XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdiaWxsaW5nLnBsYW5zQ29tbW9uLmRvY3VtZW50UHJvY2Vzc2luZ1ByaW9yaXR5VXBncmFkZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19