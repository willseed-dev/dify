"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const datasets_1 = require("@/models/datasets");
const app_1 = require("@/types/app");
const indexing_progress_item_1 = require("./indexing-progress-item");
const rule_detail_1 = require("./rule-detail");
const upgrade_banner_1 = require("./upgrade-banner");
const use_indexing_status_polling_1 = require("./use-indexing-status-polling");
const utils_1 = require("./utils");
// =============================================================================
// Mock External Dependencies
// =============================================================================
// Mock next/navigation
const mockPush = vi.fn();
const mockRouter = { push: mockPush };
vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
}));
// Mock next/image
vi.mock('next/image', () => ({
    default: ({ src, alt, className }) => (
    // eslint-disable-next-line next/no-img-element
    <img src={src} alt={alt} className={className} data-testid="next-image"/>),
}));
// Mock API service
const mockFetchIndexingStatusBatch = vi.fn();
vi.mock('@/service/datasets', () => ({
    fetchIndexingStatusBatch: (params) => mockFetchIndexingStatusBatch(params),
}));
// Mock service hooks
const mockProcessRuleData = undefined;
vi.mock('@/service/knowledge/use-dataset', () => ({
    useProcessRule: vi.fn(() => ({ data: mockProcessRuleData })),
}));
const mockInvalidDocumentList = vi.fn();
vi.mock('@/service/knowledge/use-document', () => ({
    useInvalidDocumentList: () => mockInvalidDocumentList,
}));
// Mock useDatasetApiAccessUrl hook
vi.mock('@/hooks/use-api-access-url', () => ({
    useDatasetApiAccessUrl: () => 'https://api.example.com/docs',
}));
// Mock provider context
let mockEnableBilling = false;
let mockPlanType = 'sandbox';
vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => ({
        enableBilling: mockEnableBilling,
        plan: { type: mockPlanType },
    }),
}));
// Mock icons
vi.mock('../icons', () => ({
    indexMethodIcon: {
        economical: '/icons/economical.svg',
        high_quality: '/icons/high-quality.svg',
    },
    retrievalIcon: {
        fullText: '/icons/full-text.svg',
        hybrid: '/icons/hybrid.svg',
        vector: '/icons/vector.svg',
    },
}));
// Mock IndexingType enum from step-two
vi.mock('../step-two', () => ({
    IndexingType: {
        QUALIFIED: 'high_quality',
        ECONOMICAL: 'economy',
    },
}));
// =============================================================================
// Factory Functions for Test Data
// =============================================================================
/**
 * Create a mock IndexingStatusResponse
 */
const createMockIndexingStatus = (overrides = {}) => ({
    id: 'doc-1',
    indexing_status: 'completed',
    processing_started_at: Date.now(),
    parsing_completed_at: Date.now(),
    cleaning_completed_at: Date.now(),
    splitting_completed_at: Date.now(),
    completed_at: Date.now(),
    paused_at: null,
    error: null,
    stopped_at: null,
    completed_segments: 10,
    total_segments: 10,
    ...overrides,
});
/**
 * Create a mock FullDocumentDetail
 */
const createMockDocument = (overrides = {}) => ({
    id: 'doc-1',
    name: 'test-document.txt',
    data_source_type: datasets_1.DataSourceType.FILE,
    data_source_info: {
        upload_file: {
            id: 'file-1',
            name: 'test-document.txt',
            extension: 'txt',
            mime_type: 'text/plain',
            size: 1024,
            created_by: 'user-1',
            created_at: Date.now(),
        },
    },
    batch: 'batch-1',
    created_api_request_id: 'req-1',
    processing_started_at: Date.now(),
    parsing_completed_at: Date.now(),
    cleaning_completed_at: Date.now(),
    splitting_completed_at: Date.now(),
    tokens: 100,
    indexing_latency: 5000,
    completed_at: Date.now(),
    paused_by: '',
    paused_at: 0,
    stopped_at: 0,
    indexing_status: 'completed',
    disabled_at: 0,
    ...overrides,
});
/**
 * Create a mock ProcessRuleResponse
 */
const createMockProcessRule = (overrides = {}) => ({
    mode: datasets_1.ProcessMode.general,
    rules: {
        segmentation: {
            separator: '\n',
            max_tokens: 500,
            chunk_overlap: 50,
        },
        pre_processing_rules: [
            { id: 'remove_extra_spaces', enabled: true },
            { id: 'remove_urls_emails', enabled: false },
        ],
    },
    ...overrides,
});
// =============================================================================
// Utils Tests
// =============================================================================
describe('utils', () => {
    // Test utility functions for document handling
    describe('isLegacyDataSourceInfo', () => {
        it('should return true for legacy data source with upload_file object', () => {
            // Arrange
            const info = {
                upload_file: { id: 'file-1', name: 'test.txt' },
            };
            // Act & Assert
            expect((0, utils_1.isLegacyDataSourceInfo)(info)).toBe(true);
        });
        it('should return false for null', () => {
            expect((0, utils_1.isLegacyDataSourceInfo)(null)).toBe(false);
        });
        it('should return false for undefined', () => {
            expect((0, utils_1.isLegacyDataSourceInfo)(undefined)).toBe(false);
        });
        it('should return false when upload_file is not an object', () => {
            // Arrange
            const info = { upload_file: 'string-value' };
            // Act & Assert
            expect((0, utils_1.isLegacyDataSourceInfo)(info)).toBe(false);
        });
    });
    describe('isSourceEmbedding', () => {
        it.each([
            ['indexing', true],
            ['splitting', true],
            ['parsing', true],
            ['cleaning', true],
            ['waiting', true],
            ['completed', false],
            ['error', false],
            ['paused', false],
        ])('should return %s for status "%s"', (status, expected) => {
            // Arrange
            const detail = createMockIndexingStatus({ indexing_status: status });
            // Act & Assert
            expect((0, utils_1.isSourceEmbedding)(detail)).toBe(expected);
        });
    });
    describe('getSourcePercent', () => {
        it('should return 0 when total_segments is 0', () => {
            // Arrange
            const detail = createMockIndexingStatus({
                completed_segments: 0,
                total_segments: 0,
            });
            // Act & Assert
            expect((0, utils_1.getSourcePercent)(detail)).toBe(0);
        });
        it('should calculate correct percentage', () => {
            // Arrange
            const detail = createMockIndexingStatus({
                completed_segments: 5,
                total_segments: 10,
            });
            // Act & Assert
            expect((0, utils_1.getSourcePercent)(detail)).toBe(50);
        });
        it('should cap percentage at 100', () => {
            // Arrange
            const detail = createMockIndexingStatus({
                completed_segments: 15,
                total_segments: 10,
            });
            // Act & Assert
            expect((0, utils_1.getSourcePercent)(detail)).toBe(100);
        });
        it('should handle undefined values', () => {
            // Arrange
            const detail = { indexing_status: 'indexing' };
            // Act & Assert
            expect((0, utils_1.getSourcePercent)(detail)).toBe(0);
        });
        it('should round to nearest integer', () => {
            // Arrange
            const detail = createMockIndexingStatus({
                completed_segments: 1,
                total_segments: 3,
            });
            // Act & Assert
            expect((0, utils_1.getSourcePercent)(detail)).toBe(33);
        });
    });
    describe('getFileType', () => {
        it('should extract extension from filename', () => {
            expect((0, utils_1.getFileType)('document.pdf')).toBe('pdf');
            expect((0, utils_1.getFileType)('file.name.txt')).toBe('txt');
            expect((0, utils_1.getFileType)('archive.tar.gz')).toBe('gz');
        });
        it('should return "txt" for undefined', () => {
            expect((0, utils_1.getFileType)(undefined)).toBe('txt');
        });
        it('should return filename without extension', () => {
            expect((0, utils_1.getFileType)('filename')).toBe('filename');
        });
    });
    describe('createDocumentLookup', () => {
        it('should create lookup functions for documents', () => {
            // Arrange
            const documents = [
                createMockDocument({ id: 'doc-1', name: 'file1.txt' }),
                createMockDocument({ id: 'doc-2', name: 'file2.pdf', data_source_type: datasets_1.DataSourceType.NOTION }),
            ];
            // Act
            const lookup = (0, utils_1.createDocumentLookup)(documents);
            // Assert
            expect(lookup.getName('doc-1')).toBe('file1.txt');
            expect(lookup.getName('doc-2')).toBe('file2.pdf');
            expect(lookup.getName('non-existent')).toBeUndefined();
        });
        it('should return source type correctly', () => {
            // Arrange
            const documents = [
                createMockDocument({ id: 'doc-1', data_source_type: datasets_1.DataSourceType.FILE }),
                createMockDocument({ id: 'doc-2', data_source_type: datasets_1.DataSourceType.NOTION }),
            ];
            const lookup = (0, utils_1.createDocumentLookup)(documents);
            // Assert
            expect(lookup.getSourceType('doc-1')).toBe(datasets_1.DataSourceType.FILE);
            expect(lookup.getSourceType('doc-2')).toBe(datasets_1.DataSourceType.NOTION);
        });
        it('should return notion icon for legacy data source', () => {
            // Arrange
            const documents = [
                createMockDocument({
                    id: 'doc-1',
                    data_source_info: {
                        upload_file: { id: 'f1' },
                        notion_page_icon: '📄',
                    },
                }),
            ];
            const lookup = (0, utils_1.createDocumentLookup)(documents);
            // Assert
            expect(lookup.getNotionIcon('doc-1')).toBe('📄');
        });
        it('should return undefined for non-legacy notion icon', () => {
            // Arrange
            const documents = [
                createMockDocument({
                    id: 'doc-1',
                    data_source_info: { some_other_field: 'value' },
                }),
            ];
            const lookup = (0, utils_1.createDocumentLookup)(documents);
            // Assert
            expect(lookup.getNotionIcon('doc-1')).toBeUndefined();
        });
        it('should memoize lookups with Map for performance', () => {
            // Arrange
            const documents = Array.from({ length: 1000 }, (_, i) => createMockDocument({ id: `doc-${i}`, name: `file${i}.txt` }));
            // Act
            const lookup = (0, utils_1.createDocumentLookup)(documents);
            const startTime = performance.now();
            for (let i = 0; i < 1000; i++)
                lookup.getName(`doc-${i}`);
            const duration = performance.now() - startTime;
            // Assert - should be very fast due to Map lookup
            expect(duration).toBeLessThan(50);
        });
    });
});
// =============================================================================
// useIndexingStatusPolling Hook Tests
// =============================================================================
describe('useIndexingStatusPolling', () => {
    // Test the polling hook for indexing status
    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    it('should fetch status on mount', async () => {
        // Arrange
        const mockStatus = [createMockIndexingStatus({ indexing_status: 'completed' })];
        mockFetchIndexingStatusBatch.mockResolvedValue({ data: mockStatus });
        // Act
        const { result } = (0, react_1.renderHook)(() => (0, use_indexing_status_polling_1.useIndexingStatusPolling)({ datasetId: 'ds-1', batchId: 'batch-1' }));
        await (0, react_1.act)(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
        // Assert
        expect(mockFetchIndexingStatusBatch).toHaveBeenCalledWith({
            datasetId: 'ds-1',
            batchId: 'batch-1',
        });
        expect(result.current.statusList).toEqual(mockStatus);
    });
    it('should stop polling when all statuses are completed', async () => {
        // Arrange
        const mockStatus = [createMockIndexingStatus({ indexing_status: 'completed' })];
        mockFetchIndexingStatusBatch.mockResolvedValue({ data: mockStatus });
        // Act
        (0, react_1.renderHook)(() => (0, use_indexing_status_polling_1.useIndexingStatusPolling)({ datasetId: 'ds-1', batchId: 'batch-1' }));
        await (0, react_1.act)(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
        // Assert - should only be called once since status is completed
        expect(mockFetchIndexingStatusBatch).toHaveBeenCalledTimes(1);
    });
    it('should continue polling when status is indexing', async () => {
        // Arrange
        const indexingStatus = [createMockIndexingStatus({ indexing_status: 'indexing' })];
        const completedStatus = [createMockIndexingStatus({ indexing_status: 'completed' })];
        mockFetchIndexingStatusBatch
            .mockResolvedValueOnce({ data: indexingStatus })
            .mockResolvedValueOnce({ data: completedStatus });
        // Act
        (0, react_1.renderHook)(() => (0, use_indexing_status_polling_1.useIndexingStatusPolling)({ datasetId: 'ds-1', batchId: 'batch-1' }));
        // First poll
        await (0, react_1.act)(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
        // Advance timer for next poll (2500ms)
        await (0, react_1.act)(async () => {
            await vi.advanceTimersByTimeAsync(2500);
        });
        // Assert
        expect(mockFetchIndexingStatusBatch).toHaveBeenCalledTimes(2);
    });
    it('should stop polling when status is error', async () => {
        // Arrange
        const mockStatus = [createMockIndexingStatus({ indexing_status: 'error', error: 'Some error' })];
        mockFetchIndexingStatusBatch.mockResolvedValue({ data: mockStatus });
        // Act
        const { result } = (0, react_1.renderHook)(() => (0, use_indexing_status_polling_1.useIndexingStatusPolling)({ datasetId: 'ds-1', batchId: 'batch-1' }));
        await (0, react_1.act)(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
        // Assert
        expect(result.current.isEmbeddingCompleted).toBe(true);
        expect(mockFetchIndexingStatusBatch).toHaveBeenCalledTimes(1);
    });
    it('should stop polling when status is paused', async () => {
        // Arrange
        const mockStatus = [createMockIndexingStatus({ indexing_status: 'paused' })];
        mockFetchIndexingStatusBatch.mockResolvedValue({ data: mockStatus });
        // Act
        const { result } = (0, react_1.renderHook)(() => (0, use_indexing_status_polling_1.useIndexingStatusPolling)({ datasetId: 'ds-1', batchId: 'batch-1' }));
        await (0, react_1.act)(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
        // Assert
        expect(result.current.isEmbeddingCompleted).toBe(true);
    });
    it('should continue polling on API error', async () => {
        // Arrange
        mockFetchIndexingStatusBatch
            .mockRejectedValueOnce(new Error('Network error'))
            .mockResolvedValueOnce({ data: [createMockIndexingStatus({ indexing_status: 'completed' })] });
        // Act
        (0, react_1.renderHook)(() => (0, use_indexing_status_polling_1.useIndexingStatusPolling)({ datasetId: 'ds-1', batchId: 'batch-1' }));
        await (0, react_1.act)(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
        await (0, react_1.act)(async () => {
            await vi.advanceTimersByTimeAsync(2500);
        });
        // Assert - should retry after error
        expect(mockFetchIndexingStatusBatch).toHaveBeenCalledTimes(2);
    });
    it('should return correct isEmbedding state', async () => {
        // Arrange
        const mockStatus = [createMockIndexingStatus({ indexing_status: 'indexing' })];
        mockFetchIndexingStatusBatch.mockResolvedValue({ data: mockStatus });
        // Act
        const { result } = (0, react_1.renderHook)(() => (0, use_indexing_status_polling_1.useIndexingStatusPolling)({ datasetId: 'ds-1', batchId: 'batch-1' }));
        await (0, react_1.act)(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
        // Assert
        expect(result.current.isEmbedding).toBe(true);
        expect(result.current.isEmbeddingCompleted).toBe(false);
    });
    it('should cleanup timeout on unmount', async () => {
        // Arrange
        const mockStatus = [createMockIndexingStatus({ indexing_status: 'indexing' })];
        mockFetchIndexingStatusBatch.mockResolvedValue({ data: mockStatus });
        // Act
        const { unmount } = (0, react_1.renderHook)(() => (0, use_indexing_status_polling_1.useIndexingStatusPolling)({ datasetId: 'ds-1', batchId: 'batch-1' }));
        await (0, react_1.act)(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
        const callCountBeforeUnmount = mockFetchIndexingStatusBatch.mock.calls.length;
        unmount();
        // Advance timers - should not trigger more calls after unmount
        await (0, react_1.act)(async () => {
            await vi.advanceTimersByTimeAsync(5000);
        });
        // Assert - no additional calls after unmount
        expect(mockFetchIndexingStatusBatch).toHaveBeenCalledTimes(callCountBeforeUnmount);
    });
    it('should handle multiple documents with mixed statuses', async () => {
        // Arrange
        const mockStatus = [
            createMockIndexingStatus({ id: 'doc-1', indexing_status: 'completed' }),
            createMockIndexingStatus({ id: 'doc-2', indexing_status: 'indexing' }),
        ];
        mockFetchIndexingStatusBatch.mockResolvedValue({ data: mockStatus });
        // Act
        const { result } = (0, react_1.renderHook)(() => (0, use_indexing_status_polling_1.useIndexingStatusPolling)({ datasetId: 'ds-1', batchId: 'batch-1' }));
        await (0, react_1.act)(async () => {
            await vi.runOnlyPendingTimersAsync();
        });
        // Assert
        expect(result.current.isEmbedding).toBe(true);
        expect(result.current.isEmbeddingCompleted).toBe(false);
        expect(result.current.statusList).toHaveLength(2);
    });
    it('should return empty statusList initially', () => {
        // Arrange & Act
        const { result } = (0, react_1.renderHook)(() => (0, use_indexing_status_polling_1.useIndexingStatusPolling)({ datasetId: 'ds-1', batchId: 'batch-1' }));
        // Assert
        expect(result.current.statusList).toEqual([]);
        expect(result.current.isEmbedding).toBe(false);
        expect(result.current.isEmbeddingCompleted).toBe(false);
    });
});
// =============================================================================
// UpgradeBanner Component Tests
// =============================================================================
describe('UpgradeBanner', () => {
    // Test the upgrade banner component
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('should render upgrade message', () => {
        // Arrange & Act
        (0, react_1.render)(<upgrade_banner_1.default />);
        // Assert
        expect(react_1.screen.getByText(/billing\.plansCommon\.documentProcessingPriorityUpgrade/i)).toBeInTheDocument();
    });
    it('should render ZapFast icon', () => {
        // Arrange & Act
        const { container } = (0, react_1.render)(<upgrade_banner_1.default />);
        // Assert
        expect(container.querySelector('svg')).toBeInTheDocument();
    });
    it('should render UpgradeBtn component', () => {
        // Arrange & Act
        (0, react_1.render)(<upgrade_banner_1.default />);
        // Assert - UpgradeBtn should be rendered
        const upgradeContainer = react_1.screen.getByText(/billing\.plansCommon\.documentProcessingPriorityUpgrade/i).parentElement;
        expect(upgradeContainer).toBeInTheDocument();
    });
});
// =============================================================================
// IndexingProgressItem Component Tests
// =============================================================================
describe('IndexingProgressItem', () => {
    // Test the progress item component for individual documents
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render document name', () => {
            // Arrange
            const detail = createMockIndexingStatus();
            // Act
            (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="test-document.txt"/>);
            // Assert
            expect(react_1.screen.getByText('test-document.txt')).toBeInTheDocument();
        });
        it('should render progress percentage when embedding', () => {
            // Arrange
            const detail = createMockIndexingStatus({
                indexing_status: 'indexing',
                completed_segments: 5,
                total_segments: 10,
            });
            // Act
            (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="test.txt"/>);
            // Assert
            expect(react_1.screen.getByText('50%')).toBeInTheDocument();
        });
        it('should not render progress percentage when completed', () => {
            // Arrange
            const detail = createMockIndexingStatus({ indexing_status: 'completed' });
            // Act
            (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="test.txt"/>);
            // Assert
            expect(react_1.screen.queryByText('%')).not.toBeInTheDocument();
        });
    });
    describe('Status Icons', () => {
        it('should render success icon for completed status', () => {
            // Arrange
            const detail = createMockIndexingStatus({ indexing_status: 'completed' });
            // Act
            const { container } = (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="test.txt"/>);
            // Assert
            expect(container.querySelector('.text-text-success')).toBeInTheDocument();
        });
        it('should render error icon for error status', () => {
            // Arrange
            const detail = createMockIndexingStatus({
                indexing_status: 'error',
                error: 'Processing failed',
            });
            // Act
            const { container } = (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="test.txt"/>);
            // Assert
            expect(container.querySelector('.text-text-destructive')).toBeInTheDocument();
        });
        it('should not render status icon for indexing status', () => {
            // Arrange
            const detail = createMockIndexingStatus({ indexing_status: 'indexing' });
            // Act
            const { container } = (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="test.txt"/>);
            // Assert
            expect(container.querySelector('.text-text-success')).not.toBeInTheDocument();
            expect(container.querySelector('.text-text-destructive')).not.toBeInTheDocument();
        });
    });
    describe('Source Type Icons', () => {
        it('should render file icon for FILE source type', () => {
            // Arrange
            const detail = createMockIndexingStatus();
            // Act
            (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="document.pdf" sourceType={datasets_1.DataSourceType.FILE}/>);
            // Assert - DocumentFileIcon should be rendered
            expect(react_1.screen.getByText('document.pdf')).toBeInTheDocument();
        });
        // DocumentFileIcon branch coverage: different file extensions
        describe('DocumentFileIcon file extensions', () => {
            it.each([
                ['document.pdf', 'pdf'],
                ['data.json', 'json'],
                ['page.html', 'html'],
                ['readme.txt', 'txt'],
                ['notes.markdown', 'markdown'],
                ['readme.md', 'md'],
                ['spreadsheet.xlsx', 'xlsx'],
                ['legacy.xls', 'xls'],
                ['data.csv', 'csv'],
                ['letter.doc', 'doc'],
                ['report.docx', 'docx'],
            ])('should render file icon for %s (%s extension)', (filename) => {
                // Arrange
                const detail = createMockIndexingStatus();
                // Act
                (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name={filename} sourceType={datasets_1.DataSourceType.FILE}/>);
                // Assert
                expect(react_1.screen.getByText(filename)).toBeInTheDocument();
            });
            it('should handle unknown file extension with default icon', () => {
                // Arrange
                const detail = createMockIndexingStatus();
                // Act
                (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="archive.zip" sourceType={datasets_1.DataSourceType.FILE}/>);
                // Assert - should still render with default document icon
                expect(react_1.screen.getByText('archive.zip')).toBeInTheDocument();
            });
            it('should handle uppercase extension', () => {
                // Arrange
                const detail = createMockIndexingStatus();
                // Act
                (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="REPORT.PDF" sourceType={datasets_1.DataSourceType.FILE}/>);
                // Assert
                expect(react_1.screen.getByText('REPORT.PDF')).toBeInTheDocument();
            });
            it('should handle mixed case extension', () => {
                // Arrange
                const detail = createMockIndexingStatus();
                // Act
                (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="Document.Docx" sourceType={datasets_1.DataSourceType.FILE}/>);
                // Assert
                expect(react_1.screen.getByText('Document.Docx')).toBeInTheDocument();
            });
            it('should handle filename with multiple dots', () => {
                // Arrange
                const detail = createMockIndexingStatus();
                // Act
                (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="my.file.name.pdf" sourceType={datasets_1.DataSourceType.FILE}/>);
                // Assert - should extract "pdf" as extension
                expect(react_1.screen.getByText('my.file.name.pdf')).toBeInTheDocument();
            });
            it('should handle filename without extension', () => {
                // Arrange
                const detail = createMockIndexingStatus();
                // Act
                (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="noextension" sourceType={datasets_1.DataSourceType.FILE}/>);
                // Assert - should use filename itself as fallback
                expect(react_1.screen.getByText('noextension')).toBeInTheDocument();
            });
        });
        it('should render notion icon for NOTION source type', () => {
            // Arrange
            const detail = createMockIndexingStatus();
            // Act
            (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="Notion Page" sourceType={datasets_1.DataSourceType.NOTION} notionIcon="📄"/>);
            // Assert
            expect(react_1.screen.getByText('Notion Page')).toBeInTheDocument();
        });
    });
    describe('Progress Bar', () => {
        it('should render progress bar when embedding', () => {
            // Arrange
            const detail = createMockIndexingStatus({
                indexing_status: 'indexing',
                completed_segments: 30,
                total_segments: 100,
            });
            // Act
            const { container } = (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="test.txt"/>);
            // Assert
            const progressBar = container.querySelector('[style*="width: 30%"]');
            expect(progressBar).toBeInTheDocument();
        });
        it('should not render progress bar when completed', () => {
            // Arrange
            const detail = createMockIndexingStatus({ indexing_status: 'completed' });
            // Act
            const { container } = (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="test.txt"/>);
            // Assert
            const progressBar = container.querySelector('.bg-components-progress-bar-progress');
            expect(progressBar).not.toBeInTheDocument();
        });
        it('should apply error styling for error status', () => {
            // Arrange
            const detail = createMockIndexingStatus({ indexing_status: 'error' });
            // Act
            const { container } = (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="test.txt"/>);
            // Assert
            expect(container.querySelector('.bg-state-destructive-hover-alt')).toBeInTheDocument();
        });
    });
    describe('Billing', () => {
        it('should render PriorityLabel when enableBilling is true', () => {
            // Arrange
            const detail = createMockIndexingStatus();
            // Act
            (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="test.txt" enableBilling/>);
            // Assert - PriorityLabel component should be in the DOM
            const container = react_1.screen.getByText('test.txt').parentElement;
            expect(container).toBeInTheDocument();
        });
        it('should not render PriorityLabel when enableBilling is false', () => {
            // Arrange
            const detail = createMockIndexingStatus();
            // Act
            (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="test.txt" enableBilling={false}/>);
            // Assert
            expect(react_1.screen.getByText('test.txt')).toBeInTheDocument();
        });
    });
    describe('Edge Cases', () => {
        it('should handle undefined name', () => {
            // Arrange
            const detail = createMockIndexingStatus();
            // Act
            (0, react_1.render)(<indexing_progress_item_1.default detail={detail}/>);
            // Assert - should not crash
            expect(document.body).toBeInTheDocument();
        });
        it('should handle undefined sourceType', () => {
            // Arrange
            const detail = createMockIndexingStatus();
            // Act
            (0, react_1.render)(<indexing_progress_item_1.default detail={detail} name="test.txt"/>);
            // Assert - should render without source icon
            expect(react_1.screen.getByText('test.txt')).toBeInTheDocument();
        });
    });
});
// =============================================================================
// RuleDetail Component Tests
// =============================================================================
describe('RuleDetail', () => {
    // Test the rule detail component for process configuration display
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default />);
            // Assert
            expect(react_1.screen.getByText(/datasetDocuments\.embedding\.mode/i)).toBeInTheDocument();
        });
        it('should render all field labels', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default />);
            // Assert
            expect(react_1.screen.getByText(/datasetDocuments\.embedding\.mode/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/datasetDocuments\.embedding\.segmentLength/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/datasetDocuments\.embedding\.textCleaning/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/datasetCreation\.stepTwo\.indexMode/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/datasetSettings\.form\.retrievalSetting\.title/i)).toBeInTheDocument();
        });
    });
    describe('Mode Display', () => {
        it('should show "-" when sourceData is undefined', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default />);
            // Assert
            expect(react_1.screen.getAllByText('-')).toHaveLength(3); // mode, segmentLength, textCleaning
        });
        it('should show "custom" for general process mode', () => {
            // Arrange
            const sourceData = createMockProcessRule({ mode: datasets_1.ProcessMode.general });
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData}/>);
            // Assert
            expect(react_1.screen.getByText(/datasetDocuments\.embedding\.custom/i)).toBeInTheDocument();
        });
        it('should show hierarchical mode with paragraph parent', () => {
            // Arrange
            const sourceData = createMockProcessRule({
                mode: datasets_1.ProcessMode.parentChild,
                rules: {
                    parent_mode: 'paragraph',
                    segmentation: { max_tokens: 500 },
                },
            });
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData}/>);
            // Assert
            expect(react_1.screen.getByText(/datasetDocuments\.embedding\.hierarchical/i)).toBeInTheDocument();
        });
    });
    describe('Segment Length Display', () => {
        it('should show max_tokens for general mode', () => {
            // Arrange
            const sourceData = createMockProcessRule({
                mode: datasets_1.ProcessMode.general,
                rules: {
                    segmentation: { max_tokens: 500 },
                },
            });
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData}/>);
            // Assert
            expect(react_1.screen.getByText('500')).toBeInTheDocument();
        });
        it('should show parent and child tokens for hierarchical mode', () => {
            // Arrange
            const sourceData = createMockProcessRule({
                mode: datasets_1.ProcessMode.parentChild,
                rules: {
                    segmentation: { max_tokens: 1000 },
                    subchunk_segmentation: { max_tokens: 200 },
                },
            });
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData}/>);
            // Assert
            expect(react_1.screen.getByText(/1000/)).toBeInTheDocument();
            expect(react_1.screen.getByText(/200/)).toBeInTheDocument();
        });
    });
    describe('Text Cleaning Rules', () => {
        it('should show enabled rule names', () => {
            // Arrange
            const sourceData = createMockProcessRule({
                mode: datasets_1.ProcessMode.general,
                rules: {
                    pre_processing_rules: [
                        { id: 'remove_extra_spaces', enabled: true },
                        { id: 'remove_urls_emails', enabled: true },
                        { id: 'remove_stopwords', enabled: false },
                    ],
                },
            });
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData}/>);
            // Assert
            expect(react_1.screen.getByText(/removeExtraSpaces/i)).toBeInTheDocument();
            expect(react_1.screen.getByText(/removeUrlEmails/i)).toBeInTheDocument();
        });
        it('should show "-" when no rules are enabled', () => {
            // Arrange
            const sourceData = createMockProcessRule({
                mode: datasets_1.ProcessMode.general,
                rules: {
                    pre_processing_rules: [
                        { id: 'remove_extra_spaces', enabled: false },
                    ],
                },
            });
            // Act
            (0, react_1.render)(<rule_detail_1.default sourceData={sourceData}/>);
            // Assert - textCleaning should show "-"
            const dashElements = react_1.screen.getAllByText('-');
            expect(dashElements.length).toBeGreaterThan(0);
        });
    });
    describe('Indexing Type', () => {
        it('should show qualified for high_quality indexing', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType="high_quality"/>);
            // Assert
            expect(react_1.screen.getByText(/datasetCreation\.stepTwo\.qualified/i)).toBeInTheDocument();
        });
        it('should show economical for economy indexing', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType="economy"/>);
            // Assert
            expect(react_1.screen.getByText(/datasetCreation\.stepTwo\.economical/i)).toBeInTheDocument();
        });
        it('should render correct icon for indexing type', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType="high_quality"/>);
            // Assert
            const images = react_1.screen.getAllByTestId('next-image');
            expect(images.length).toBeGreaterThan(0);
        });
    });
    describe('Retrieval Method', () => {
        it('should show semantic search by default', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default />);
            // Assert
            expect(react_1.screen.getByText(/dataset\.retrieval\.semantic_search\.title/i)).toBeInTheDocument();
        });
        it('should show keyword search for economical indexing', () => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default indexingType="economy"/>);
            // Assert
            expect(react_1.screen.getByText(/dataset\.retrieval\.keyword_search\.title/i)).toBeInTheDocument();
        });
        it.each([
            [app_1.RETRIEVE_METHOD.fullText, 'full_text_search'],
            [app_1.RETRIEVE_METHOD.hybrid, 'hybrid_search'],
            [app_1.RETRIEVE_METHOD.semantic, 'semantic_search'],
        ])('should show correct label for %s retrieval method', (method, expectedKey) => {
            // Arrange & Act
            (0, react_1.render)(<rule_detail_1.default retrievalMethod={method}/>);
            // Assert
            expect(react_1.screen.getByText(new RegExp(`dataset\\.retrieval\\.${expectedKey}\\.title`, 'i'))).toBeInTheDocument();
        });
    });
});
// =============================================================================
// EmbeddingProcess Integration Tests
// =============================================================================
describe('EmbeddingProcess', () => {
    // Integration tests for the main EmbeddingProcess component
    // Import the main component after mocks are set up
    let EmbeddingProcess;
    beforeEach(async () => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        mockEnableBilling = false;
        mockPlanType = 'sandbox';
        // Dynamically import to get fresh component with mocks
        const embeddingModule = await Promise.resolve().then(() => require('./index'));
        EmbeddingProcess = embeddingModule.default;
    });
    afterEach(() => {
        vi.useRealTimers();
    });
    describe('Rendering', () => {
        it('should render without crashing', async () => {
            // Arrange
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: [] });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1"/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert
            expect(document.body).toBeInTheDocument();
        });
        it('should render status header', async () => {
            // Arrange
            const mockStatus = [createMockIndexingStatus({ indexing_status: 'indexing' })];
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: mockStatus });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1"/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert
            expect(react_1.screen.getByText(/datasetDocuments\.embedding\.processing/i)).toBeInTheDocument();
        });
        it('should show completed status when all documents are done', async () => {
            // Arrange
            const mockStatus = [createMockIndexingStatus({ indexing_status: 'completed' })];
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: mockStatus });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1"/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert
            expect(react_1.screen.getByText(/datasetDocuments\.embedding\.completed/i)).toBeInTheDocument();
        });
    });
    describe('Progress Items', () => {
        it('should render progress items for each document', async () => {
            // Arrange
            const documents = [
                createMockDocument({ id: 'doc-1', name: 'file1.txt' }),
                createMockDocument({ id: 'doc-2', name: 'file2.pdf' }),
            ];
            const mockStatus = [
                createMockIndexingStatus({ id: 'doc-1' }),
                createMockIndexingStatus({ id: 'doc-2' }),
            ];
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: mockStatus });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1" documents={documents}/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert
            expect(react_1.screen.getByText('file1.txt')).toBeInTheDocument();
            expect(react_1.screen.getByText('file2.pdf')).toBeInTheDocument();
        });
    });
    describe('Upgrade Banner', () => {
        it('should show upgrade banner when billing is enabled and not team plan', async () => {
            // Arrange
            mockEnableBilling = true;
            mockPlanType = 'sandbox';
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: [] });
            // Re-import to get updated mock values
            const embeddingModule = await Promise.resolve().then(() => require('./index'));
            EmbeddingProcess = embeddingModule.default;
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1"/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert
            expect(react_1.screen.getByText(/billing\.plansCommon\.documentProcessingPriorityUpgrade/i)).toBeInTheDocument();
        });
        it('should not show upgrade banner when billing is disabled', async () => {
            // Arrange
            mockEnableBilling = false;
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: [] });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1"/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert
            expect(react_1.screen.queryByText(/billing\.plansCommon\.documentProcessingPriorityUpgrade/i)).not.toBeInTheDocument();
        });
        it('should not show upgrade banner for team plan', async () => {
            // Arrange
            mockEnableBilling = true;
            mockPlanType = 'team';
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: [] });
            // Re-import to get updated mock values
            const embeddingModule = await Promise.resolve().then(() => require('./index'));
            EmbeddingProcess = embeddingModule.default;
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1"/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert
            expect(react_1.screen.queryByText(/billing\.plansCommon\.documentProcessingPriorityUpgrade/i)).not.toBeInTheDocument();
        });
    });
    describe('Action Buttons', () => {
        it('should render API access button with correct link', async () => {
            // Arrange
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: [] });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1"/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert
            const apiButton = react_1.screen.getByText('Access the API');
            expect(apiButton).toBeInTheDocument();
            expect(apiButton.closest('a')).toHaveAttribute('href', 'https://api.example.com/docs');
        });
        it('should render navigation button', async () => {
            // Arrange
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: [] });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1"/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert
            expect(react_1.screen.getByText(/datasetCreation\.stepThree\.navTo/i)).toBeInTheDocument();
        });
        it('should navigate to documents list when nav button clicked', async () => {
            // Arrange
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: [] });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1"/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            const navButton = react_1.screen.getByText(/datasetCreation\.stepThree\.navTo/i);
            await (0, react_1.act)(async () => {
                navButton.click();
            });
            // Assert
            expect(mockInvalidDocumentList).toHaveBeenCalled();
            expect(mockPush).toHaveBeenCalledWith('/datasets/ds-1/documents');
        });
    });
    describe('Rule Detail', () => {
        it('should render RuleDetail component', async () => {
            // Arrange
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: [] });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1" indexingType="high_quality" retrievalMethod={app_1.RETRIEVE_METHOD.semantic}/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert
            expect(react_1.screen.getByText(/datasetDocuments\.embedding\.mode/i)).toBeInTheDocument();
        });
        it('should pass indexingType to RuleDetail', async () => {
            // Arrange
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: [] });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1" indexingType="economy"/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert
            expect(react_1.screen.getByText(/datasetCreation\.stepTwo\.economical/i)).toBeInTheDocument();
        });
    });
    describe('Document Lookup Memoization', () => {
        it('should memoize document lookup based on documents array', async () => {
            // Arrange
            const documents = [createMockDocument({ id: 'doc-1', name: 'test.txt' })];
            mockFetchIndexingStatusBatch.mockResolvedValue({
                data: [createMockIndexingStatus({ id: 'doc-1' })],
            });
            // Act
            const { rerender } = (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1" documents={documents}/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Rerender with same documents reference
            rerender(<EmbeddingProcess datasetId="ds-1" batchId="batch-1" documents={documents}/>);
            // Assert - component should render without issues
            expect(react_1.screen.getByText('test.txt')).toBeInTheDocument();
        });
    });
    describe('Edge Cases', () => {
        it('should handle empty documents array', async () => {
            // Arrange
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: [] });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1" documents={[]}/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert - should render without crashing
            expect(document.body).toBeInTheDocument();
        });
        it('should handle undefined documents', async () => {
            // Arrange
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: [] });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1"/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert - should render without crashing
            expect(document.body).toBeInTheDocument();
        });
        it('should handle status with missing document', async () => {
            // Arrange
            const documents = [createMockDocument({ id: 'doc-1', name: 'test.txt' })];
            mockFetchIndexingStatusBatch.mockResolvedValue({
                data: [
                    createMockIndexingStatus({ id: 'doc-1' }),
                    createMockIndexingStatus({ id: 'doc-unknown' }), // No matching document
                ],
            });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1" documents={documents}/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert - should render known document and handle unknown gracefully
            expect(react_1.screen.getByText('test.txt')).toBeInTheDocument();
        });
        it('should handle undefined retrievalMethod', async () => {
            // Arrange
            mockFetchIndexingStatusBatch.mockResolvedValue({ data: [] });
            // Act
            (0, react_1.render)(<EmbeddingProcess datasetId="ds-1" batchId="batch-1" indexingType="high_quality"/>);
            await (0, react_1.act)(async () => {
                await vi.runOnlyPendingTimersAsync();
            });
            // Assert - should use default semantic search
            expect(react_1.screen.getByText(/dataset\.retrieval\.semantic_search\.title/i)).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQXdFO0FBQ3hFLGdEQUErRDtBQUMvRCxxQ0FBNkM7QUFDN0MscUVBQTJEO0FBQzNELCtDQUFzQztBQUN0QyxxREFBNEM7QUFDNUMsK0VBQXdFO0FBQ3hFLG1DQU1nQjtBQUVoQixnRkFBZ0Y7QUFDaEYsNkJBQTZCO0FBQzdCLGdGQUFnRjtBQUVoRix1QkFBdUI7QUFDdkIsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ3hCLE1BQU0sVUFBVSxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFBO0FBQ3JDLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsVUFBVTtDQUM1QixDQUFDLENBQUMsQ0FBQTtBQUVILGtCQUFrQjtBQUNsQixFQUFFLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLE9BQU8sRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQW9ELEVBQUUsRUFBRSxDQUFDO0lBQ3RGLCtDQUErQztJQUMvQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsWUFBWSxFQUFHLENBQzNFO0NBQ0YsQ0FBQyxDQUFDLENBQUE7QUFFSCxtQkFBbUI7QUFDbkIsTUFBTSw0QkFBNEIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDNUMsRUFBRSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFD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LFNBQVMsQ0FBQyxNQUFNLENBQ2hCLE9BQU8sQ0FBQyxTQUFTLENBQ2pCLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUNyQixDQUNILENBQUE7WUFFRCxNQUFNLElBQUEsV0FBRyxFQUFDLEtBQUssSUFBSSxFQUFFO2dCQUNuQixNQUFNLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxDQUFBO1lBQ3RDLENBQUMsQ0FBQyxDQUFBO1lBRUYsc0VBQXNFO1lBQ3RFLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMxRCxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN2RCxVQUFVO1lBQ1YsNEJBQTRCLENBQUMsaUJBQWlCLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUU1RCxNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQ0osQ0FBQyxnQkFBZ0IsQ0FDZixTQUFTLENBQUMsTUFBTSxDQUNoQixPQUFPLENBQUMsU0FBUyxDQUNqQixZQUFZLENBQUMsY0FBYyxFQUMzQixDQUNILENBQUE7WUFFRCxNQUFNLElBQUEsV0FBRyxFQUFDLEtBQUssSUFBSSxFQUFFO2dCQUNuQixNQUFNLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRSxDQUFBO1lBQ3RDLENBQUMsQ0FBQyxDQUFBO1lBRUYsOENBQThDO1lBQzlDLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDZDQUE2QyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzdGLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRnVsbERvY3VtZW50RGV0YWlsLCBJbmRleGluZ1N0YXR1c1Jlc3BvbnNlLCBQcm9jZXNzUnVsZVJlc3BvbnNlIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBhY3QsIHJlbmRlciwgcmVuZGVySG9vaywgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IERhdGFTb3VyY2VUeXBlLCBQcm9jZXNzTW9kZSB9IGZyb20gJ0AvbW9kZWxzL2RhdGFzZXRzJ1xuaW1wb3J0IHsgUkVUUklFVkVfTUVUSE9EIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgSW5kZXhpbmdQcm9ncmVzc0l0ZW0gZnJvbSAnLi9pbmRleGluZy1wcm9ncmVzcy1pdGVtJ1xuaW1wb3J0IFJ1bGVEZXRhaWwgZnJvbSAnLi9ydWxlLWRldGFpbCdcbmltcG9ydCBVcGdyYWRlQmFubmVyIGZyb20gJy4vdXBncmFkZS1iYW5uZXInXG5pbXBvcnQgeyB1c2VJbmRleGluZ1N0YXR1c1BvbGxpbmcgfSBmcm9tICcuL3VzZS1pbmRleGluZy1zdGF0dXMtcG9sbGluZydcbmltcG9ydCB7XG4gIGNyZWF0ZURvY3VtZW50TG9va3VwLFxuICBnZXRGaWxlVHlwZSxcbiAgZ2V0U291cmNlUGVyY2VudCxcbiAgaXNMZWdhY3lEYXRhU291cmNlSW5mbyxcbiAgaXNTb3VyY2VFbWJlZGRpbmcsXG59IGZyb20gJy4vdXRpbHMnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIEV4dGVybmFsIERlcGVuZGVuY2llc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayBuZXh0L25hdmlnYXRpb25cbmNvbnN0IG1vY2tQdXNoID0gdmkuZm4oKVxuY29uc3QgbW9ja1JvdXRlciA9IHsgcHVzaDogbW9ja1B1c2ggfVxudmkubW9jaygnbmV4dC9uYXZpZ2F0aW9uJywgKCkgPT4gKHtcbiAgdXNlUm91dGVyOiAoKSA9PiBtb2NrUm91dGVyLFxufSkpXG5cbi8vIE1vY2sgbmV4dC9pbWFnZVxudmkubW9jaygnbmV4dC9pbWFnZScsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHNyYywgYWx0LCBjbGFzc05hbWUgfTogeyBzcmM6IHN0cmluZywgYWx0OiBzdHJpbmcsIGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiAoXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5leHQvbm8taW1nLWVsZW1lbnRcbiAgICA8aW1nIHNyYz17c3JjfSBhbHQ9e2FsdH0gY2xhc3NOYW1lPXtjbGFzc05hbWV9IGRhdGEtdGVzdGlkPVwibmV4dC1pbWFnZVwiIC8+XG4gICksXG59KSlcblxuLy8gTW9jayBBUEkgc2VydmljZVxuY29uc3QgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaCA9IHZpLmZuKClcbnZpLm1vY2soJ0Avc2VydmljZS9kYXRhc2V0cycsICgpID0+ICh7XG4gIGZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaDogKHBhcmFtczogeyBkYXRhc2V0SWQ6IHN0cmluZywgYmF0Y2hJZDogc3RyaW5nIH0pID0+XG4gICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaChwYXJhbXMpLFxufSkpXG5cbi8vIE1vY2sgc2VydmljZSBob29rc1xuY29uc3QgbW9ja1Byb2Nlc3NSdWxlRGF0YTogUHJvY2Vzc1J1bGVSZXNwb25zZSB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxudmkubW9jaygnQC9zZXJ2aWNlL2tub3dsZWRnZS91c2UtZGF0YXNldCcsICgpID0+ICh7XG4gIHVzZVByb2Nlc3NSdWxlOiB2aS5mbigoKSA9PiAoeyBkYXRhOiBtb2NrUHJvY2Vzc1J1bGVEYXRhIH0pKSxcbn0pKVxuXG5jb25zdCBtb2NrSW52YWxpZERvY3VtZW50TGlzdCA9IHZpLmZuKClcbnZpLm1vY2soJ0Avc2VydmljZS9rbm93bGVkZ2UvdXNlLWRvY3VtZW50JywgKCkgPT4gKHtcbiAgdXNlSW52YWxpZERvY3VtZW50TGlzdDogKCkgPT4gbW9ja0ludmFsaWREb2N1bWVudExpc3QsXG59KSlcblxuLy8gTW9jayB1c2VEYXRhc2V0QXBpQWNjZXNzVXJsIGhvb2tcbnZpLm1vY2soJ0AvaG9va3MvdXNlLWFwaS1hY2Nlc3MtdXJsJywgKCkgPT4gKHtcbiAgdXNlRGF0YXNldEFwaUFjY2Vzc1VybDogKCkgPT4gJ2h0dHBzOi8vYXBpLmV4YW1wbGUuY29tL2RvY3MnLFxufSkpXG5cbi8vIE1vY2sgcHJvdmlkZXIgY29udGV4dFxubGV0IG1vY2tFbmFibGVCaWxsaW5nID0gZmFsc2VcbmxldCBtb2NrUGxhblR5cGUgPSAnc2FuZGJveCdcbnZpLm1vY2soJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlUHJvdmlkZXJDb250ZXh0OiAoKSA9PiAoe1xuICAgIGVuYWJsZUJpbGxpbmc6IG1vY2tFbmFibGVCaWxsaW5nLFxuICAgIHBsYW46IHsgdHlwZTogbW9ja1BsYW5UeXBlIH0sXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgaWNvbnNcbnZpLm1vY2soJy4uL2ljb25zJywgKCkgPT4gKHtcbiAgaW5kZXhNZXRob2RJY29uOiB7XG4gICAgZWNvbm9taWNhbDogJy9pY29ucy9lY29ub21pY2FsLnN2ZycsXG4gICAgaGlnaF9xdWFsaXR5OiAnL2ljb25zL2hpZ2gtcXVhbGl0eS5zdmcnLFxuICB9LFxuICByZXRyaWV2YWxJY29uOiB7XG4gICAgZnVsbFRleHQ6ICcvaWNvbnMvZnVsbC10ZXh0LnN2ZycsXG4gICAgaHlicmlkOiAnL2ljb25zL2h5YnJpZC5zdmcnLFxuICAgIHZlY3RvcjogJy9pY29ucy92ZWN0b3Iuc3ZnJyxcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIEluZGV4aW5nVHlwZSBlbnVtIGZyb20gc3RlcC10d29cbnZpLm1vY2soJy4uL3N0ZXAtdHdvJywgKCkgPT4gKHtcbiAgSW5kZXhpbmdUeXBlOiB7XG4gICAgUVVBTElGSUVEOiAnaGlnaF9xdWFsaXR5JyxcbiAgICBFQ09OT01JQ0FMOiAnZWNvbm9teScsXG4gIH0sXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEZhY3RvcnkgRnVuY3Rpb25zIGZvciBUZXN0IERhdGFcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8qKlxuICogQ3JlYXRlIGEgbW9jayBJbmRleGluZ1N0YXR1c1Jlc3BvbnNlXG4gKi9cbmNvbnN0IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyA9IChcbiAgb3ZlcnJpZGVzOiBQYXJ0aWFsPEluZGV4aW5nU3RhdHVzUmVzcG9uc2U+ID0ge30sXG4pOiBJbmRleGluZ1N0YXR1c1Jlc3BvbnNlID0+ICh7XG4gIGlkOiAnZG9jLTEnLFxuICBpbmRleGluZ19zdGF0dXM6ICdjb21wbGV0ZWQnLFxuICBwcm9jZXNzaW5nX3N0YXJ0ZWRfYXQ6IERhdGUubm93KCksXG4gIHBhcnNpbmdfY29tcGxldGVkX2F0OiBEYXRlLm5vdygpLFxuICBjbGVhbmluZ19jb21wbGV0ZWRfYXQ6IERhdGUubm93KCksXG4gIHNwbGl0dGluZ19jb21wbGV0ZWRfYXQ6IERhdGUubm93KCksXG4gIGNvbXBsZXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgcGF1c2VkX2F0OiBudWxsLFxuICBlcnJvcjogbnVsbCxcbiAgc3RvcHBlZF9hdDogbnVsbCxcbiAgY29tcGxldGVkX3NlZ21lbnRzOiAxMCxcbiAgdG90YWxfc2VnbWVudHM6IDEwLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vKipcbiAqIENyZWF0ZSBhIG1vY2sgRnVsbERvY3VtZW50RGV0YWlsXG4gKi9cbmNvbnN0IGNyZWF0ZU1vY2tEb2N1bWVudCA9IChcbiAgb3ZlcnJpZGVzOiBQYXJ0aWFsPEZ1bGxEb2N1bWVudERldGFpbD4gPSB7fSxcbik6IEZ1bGxEb2N1bWVudERldGFpbCA9PiAoe1xuICBpZDogJ2RvYy0xJyxcbiAgbmFtZTogJ3Rlc3QtZG9jdW1lbnQudHh0JyxcbiAgZGF0YV9zb3VyY2VfdHlwZTogRGF0YVNvdXJjZVR5cGUuRklMRSxcbiAgZGF0YV9zb3VyY2VfaW5mbzoge1xuICAgIHVwbG9hZF9maWxlOiB7XG4gICAgICBpZDogJ2ZpbGUtMScsXG4gICAgICBuYW1lOiAndGVzdC1kb2N1bWVudC50eHQnLFxuICAgICAgZXh0ZW5zaW9uOiAndHh0JyxcbiAgICAgIG1pbWVfdHlwZTogJ3RleHQvcGxhaW4nLFxuICAgICAgc2l6ZTogMTAyNCxcbiAgICAgIGNyZWF0ZWRfYnk6ICd1c2VyLTEnLFxuICAgICAgY3JlYXRlZF9hdDogRGF0ZS5ub3coKSxcbiAgICB9LFxuICB9LFxuICBiYXRjaDogJ2JhdGNoLTEnLFxuICBjcmVhdGVkX2FwaV9yZXF1ZXN0X2lkOiAncmVxLTEnLFxuICBwcm9jZXNzaW5nX3N0YXJ0ZWRfYXQ6IERhdGUubm93KCksXG4gIHBhcnNpbmdfY29tcGxldGVkX2F0OiBEYXRlLm5vdygpLFxuICBjbGVhbmluZ19jb21wbGV0ZWRfYXQ6IERhdGUubm93KCksXG4gIHNwbGl0dGluZ19jb21wbGV0ZWRfYXQ6IERhdGUubm93KCksXG4gIHRva2VuczogMTAwLFxuICBpbmRleGluZ19sYXRlbmN5OiA1MDAwLFxuICBjb21wbGV0ZWRfYXQ6IERhdGUubm93KCksXG4gIHBhdXNlZF9ieTogJycsXG4gIHBhdXNlZF9hdDogMCxcbiAgc3RvcHBlZF9hdDogMCxcbiAgaW5kZXhpbmdfc3RhdHVzOiAnY29tcGxldGVkJyxcbiAgZGlzYWJsZWRfYXQ6IDAsXG4gIC4uLm92ZXJyaWRlcyxcbn0gYXMgRnVsbERvY3VtZW50RGV0YWlsKVxuXG4vKipcbiAqIENyZWF0ZSBhIG1vY2sgUHJvY2Vzc1J1bGVSZXNwb25zZVxuICovXG5jb25zdCBjcmVhdGVNb2NrUHJvY2Vzc1J1bGUgPSAoXG4gIG92ZXJyaWRlczogUGFydGlhbDxQcm9jZXNzUnVsZVJlc3BvbnNlPiA9IHt9LFxuKTogUHJvY2Vzc1J1bGVSZXNwb25zZSA9PiAoe1xuICBtb2RlOiBQcm9jZXNzTW9kZS5nZW5lcmFsLFxuICBydWxlczoge1xuICAgIHNlZ21lbnRhdGlvbjoge1xuICAgICAgc2VwYXJhdG9yOiAnXFxuJyxcbiAgICAgIG1heF90b2tlbnM6IDUwMCxcbiAgICAgIGNodW5rX292ZXJsYXA6IDUwLFxuICAgIH0sXG4gICAgcHJlX3Byb2Nlc3NpbmdfcnVsZXM6IFtcbiAgICAgIHsgaWQ6ICdyZW1vdmVfZXh0cmFfc3BhY2VzJywgZW5hYmxlZDogdHJ1ZSB9LFxuICAgICAgeyBpZDogJ3JlbW92ZV91cmxzX2VtYWlscycsIGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgXSxcbiAgfSxcbiAgLi4ub3ZlcnJpZGVzLFxufSBhcyBQcm9jZXNzUnVsZVJlc3BvbnNlKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVXRpbHMgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCd1dGlscycsICgpID0+IHtcbiAgLy8gVGVzdCB1dGlsaXR5IGZ1bmN0aW9ucyBmb3IgZG9jdW1lbnQgaGFuZGxpbmdcblxuICBkZXNjcmliZSgnaXNMZWdhY3lEYXRhU291cmNlSW5mbycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiB0cnVlIGZvciBsZWdhY3kgZGF0YSBzb3VyY2Ugd2l0aCB1cGxvYWRfZmlsZSBvYmplY3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbmZvID0ge1xuICAgICAgICB1cGxvYWRfZmlsZTogeyBpZDogJ2ZpbGUtMScsIG5hbWU6ICd0ZXN0LnR4dCcgfSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0XG4gICAgICBleHBlY3QoaXNMZWdhY3lEYXRhU291cmNlSW5mbyhpbmZvIGFzIFBhcmFtZXRlcnM8dHlwZW9mIGlzTGVnYWN5RGF0YVNvdXJjZUluZm8+WzBdKSkudG9CZSh0cnVlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBmb3IgbnVsbCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChpc0xlZ2FjeURhdGFTb3VyY2VJbmZvKG51bGwgYXMgdW5rbm93biBhcyBQYXJhbWV0ZXJzPHR5cGVvZiBpc0xlZ2FjeURhdGFTb3VyY2VJbmZvPlswXSkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGZvciB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoaXNMZWdhY3lEYXRhU291cmNlSW5mbyh1bmRlZmluZWQgYXMgdW5rbm93biBhcyBQYXJhbWV0ZXJzPHR5cGVvZiBpc0xlZ2FjeURhdGFTb3VyY2VJbmZvPlswXSkpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gdXBsb2FkX2ZpbGUgaXMgbm90IGFuIG9iamVjdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGluZm8gPSB7IHVwbG9hZF9maWxlOiAnc3RyaW5nLXZhbHVlJyB9XG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgZXhwZWN0KGlzTGVnYWN5RGF0YVNvdXJjZUluZm8oaW5mbyBhcyB1bmtub3duIGFzIFBhcmFtZXRlcnM8dHlwZW9mIGlzTGVnYWN5RGF0YVNvdXJjZUluZm8+WzBdKSkudG9CZShmYWxzZSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdpc1NvdXJjZUVtYmVkZGluZycsICgpID0+IHtcbiAgICBpdC5lYWNoKFtcbiAgICAgIFsnaW5kZXhpbmcnLCB0cnVlXSxcbiAgICAgIFsnc3BsaXR0aW5nJywgdHJ1ZV0sXG4gICAgICBbJ3BhcnNpbmcnLCB0cnVlXSxcbiAgICAgIFsnY2xlYW5pbmcnLCB0cnVlXSxcbiAgICAgIFsnd2FpdGluZycsIHRydWVdLFxuICAgICAgWydjb21wbGV0ZWQnLCBmYWxzZV0sXG4gICAgICBbJ2Vycm9yJywgZmFsc2VdLFxuICAgICAgWydwYXVzZWQnLCBmYWxzZV0sXG4gICAgXSkoJ3Nob3VsZCByZXR1cm4gJXMgZm9yIHN0YXR1cyBcIiVzXCInLCAoc3RhdHVzLCBleHBlY3RlZCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaW5kZXhpbmdfc3RhdHVzOiBzdGF0dXMgYXMgSW5kZXhpbmdTdGF0dXNSZXNwb25zZVsnaW5kZXhpbmdfc3RhdHVzJ10gfSlcblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0XG4gICAgICBleHBlY3QoaXNTb3VyY2VFbWJlZGRpbmcoZGV0YWlsKSkudG9CZShleHBlY3RlZClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdnZXRTb3VyY2VQZXJjZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIDAgd2hlbiB0b3RhbF9zZWdtZW50cyBpcyAwJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHtcbiAgICAgICAgY29tcGxldGVkX3NlZ21lbnRzOiAwLFxuICAgICAgICB0b3RhbF9zZWdtZW50czogMCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgZXhwZWN0KGdldFNvdXJjZVBlcmNlbnQoZGV0YWlsKSkudG9CZSgwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGN1bGF0ZSBjb3JyZWN0IHBlcmNlbnRhZ2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoe1xuICAgICAgICBjb21wbGV0ZWRfc2VnbWVudHM6IDUsXG4gICAgICAgIHRvdGFsX3NlZ21lbnRzOiAxMCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgZXhwZWN0KGdldFNvdXJjZVBlcmNlbnQoZGV0YWlsKSkudG9CZSg1MClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYXAgcGVyY2VudGFnZSBhdCAxMDAnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoe1xuICAgICAgICBjb21wbGV0ZWRfc2VnbWVudHM6IDE1LFxuICAgICAgICB0b3RhbF9zZWdtZW50czogMTAsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnRcbiAgICAgIGV4cGVjdChnZXRTb3VyY2VQZXJjZW50KGRldGFpbCkpLnRvQmUoMTAwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZGV0YWlsID0geyBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSBhcyBJbmRleGluZ1N0YXR1c1Jlc3BvbnNlXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgZXhwZWN0KGdldFNvdXJjZVBlcmNlbnQoZGV0YWlsKSkudG9CZSgwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJvdW5kIHRvIG5lYXJlc3QgaW50ZWdlcicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7XG4gICAgICAgIGNvbXBsZXRlZF9zZWdtZW50czogMSxcbiAgICAgICAgdG90YWxfc2VnbWVudHM6IDMsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnRcbiAgICAgIGV4cGVjdChnZXRTb3VyY2VQZXJjZW50KGRldGFpbCkpLnRvQmUoMzMpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnZ2V0RmlsZVR5cGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBleHRyYWN0IGV4dGVuc2lvbiBmcm9tIGZpbGVuYW1lJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdkb2N1bWVudC5wZGYnKSkudG9CZSgncGRmJylcbiAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgnZmlsZS5uYW1lLnR4dCcpKS50b0JlKCd0eHQnKVxuICAgICAgZXhwZWN0KGdldEZpbGVUeXBlKCdhcmNoaXZlLnRhci5neicpKS50b0JlKCdneicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIFwidHh0XCIgZm9yIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSh1bmRlZmluZWQpKS50b0JlKCd0eHQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmaWxlbmFtZSB3aXRob3V0IGV4dGVuc2lvbicsICgpID0+IHtcbiAgICAgIGV4cGVjdChnZXRGaWxlVHlwZSgnZmlsZW5hbWUnKSkudG9CZSgnZmlsZW5hbWUnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2NyZWF0ZURvY3VtZW50TG9va3VwJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY3JlYXRlIGxvb2t1cCBmdW5jdGlvbnMgZm9yIGRvY3VtZW50cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvY3VtZW50cyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMScsIG5hbWU6ICdmaWxlMS50eHQnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrRG9jdW1lbnQoeyBpZDogJ2RvYy0yJywgbmFtZTogJ2ZpbGUyLnBkZicsIGRhdGFfc291cmNlX3R5cGU6IERhdGFTb3VyY2VUeXBlLk5PVElPTiB9KSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBsb29rdXAgPSBjcmVhdGVEb2N1bWVudExvb2t1cChkb2N1bWVudHMpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGxvb2t1cC5nZXROYW1lKCdkb2MtMScpKS50b0JlKCdmaWxlMS50eHQnKVxuICAgICAgZXhwZWN0KGxvb2t1cC5nZXROYW1lKCdkb2MtMicpKS50b0JlKCdmaWxlMi5wZGYnKVxuICAgICAgZXhwZWN0KGxvb2t1cC5nZXROYW1lKCdub24tZXhpc3RlbnQnKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHNvdXJjZSB0eXBlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvY3VtZW50cyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMScsIGRhdGFfc291cmNlX3R5cGU6IERhdGFTb3VyY2VUeXBlLkZJTEUgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTInLCBkYXRhX3NvdXJjZV90eXBlOiBEYXRhU291cmNlVHlwZS5OT1RJT04gfSksXG4gICAgICBdXG4gICAgICBjb25zdCBsb29rdXAgPSBjcmVhdGVEb2N1bWVudExvb2t1cChkb2N1bWVudHMpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGxvb2t1cC5nZXRTb3VyY2VUeXBlKCdkb2MtMScpKS50b0JlKERhdGFTb3VyY2VUeXBlLkZJTEUpXG4gICAgICBleHBlY3QobG9va3VwLmdldFNvdXJjZVR5cGUoJ2RvYy0yJykpLnRvQmUoRGF0YVNvdXJjZVR5cGUuTk9USU9OKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBub3Rpb24gaWNvbiBmb3IgbGVnYWN5IGRhdGEgc291cmNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jdW1lbnRzID0gW1xuICAgICAgICBjcmVhdGVNb2NrRG9jdW1lbnQoe1xuICAgICAgICAgIGlkOiAnZG9jLTEnLFxuICAgICAgICAgIGRhdGFfc291cmNlX2luZm86IHtcbiAgICAgICAgICAgIHVwbG9hZF9maWxlOiB7IGlkOiAnZjEnIH0sXG4gICAgICAgICAgICBub3Rpb25fcGFnZV9pY29uOiAn8J+ThCcsXG4gICAgICAgICAgfSBhcyBGdWxsRG9jdW1lbnREZXRhaWxbJ2RhdGFfc291cmNlX2luZm8nXSxcbiAgICAgICAgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBsb29rdXAgPSBjcmVhdGVEb2N1bWVudExvb2t1cChkb2N1bWVudHMpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGxvb2t1cC5nZXROb3Rpb25JY29uKCdkb2MtMScpKS50b0JlKCfwn5OEJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGZvciBub24tbGVnYWN5IG5vdGlvbiBpY29uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jdW1lbnRzID0gW1xuICAgICAgICBjcmVhdGVNb2NrRG9jdW1lbnQoe1xuICAgICAgICAgIGlkOiAnZG9jLTEnLFxuICAgICAgICAgIGRhdGFfc291cmNlX2luZm86IHsgc29tZV9vdGhlcl9maWVsZDogJ3ZhbHVlJyB9IGFzIHVua25vd24gYXMgRnVsbERvY3VtZW50RGV0YWlsWydkYXRhX3NvdXJjZV9pbmZvJ10sXG4gICAgICAgIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgbG9va3VwID0gY3JlYXRlRG9jdW1lbnRMb29rdXAoZG9jdW1lbnRzKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChsb29rdXAuZ2V0Tm90aW9uSWNvbignZG9jLTEnKSkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWVtb2l6ZSBsb29rdXBzIHdpdGggTWFwIGZvciBwZXJmb3JtYW5jZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRvY3VtZW50cyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwMDAgfSwgKF8sIGkpID0+XG4gICAgICAgIGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiBgZG9jLSR7aX1gLCBuYW1lOiBgZmlsZSR7aX0udHh0YCB9KSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBsb29rdXAgPSBjcmVhdGVEb2N1bWVudExvb2t1cChkb2N1bWVudHMpXG4gICAgICBjb25zdCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxMDAwOyBpKyspXG4gICAgICAgIGxvb2t1cC5nZXROYW1lKGBkb2MtJHtpfWApXG5cbiAgICAgIGNvbnN0IGR1cmF0aW9uID0gcGVyZm9ybWFuY2Uubm93KCkgLSBzdGFydFRpbWVcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIGJlIHZlcnkgZmFzdCBkdWUgdG8gTWFwIGxvb2t1cFxuICAgICAgZXhwZWN0KGR1cmF0aW9uKS50b0JlTGVzc1RoYW4oNTApXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyB1c2VJbmRleGluZ1N0YXR1c1BvbGxpbmcgSG9vayBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuZGVzY3JpYmUoJ3VzZUluZGV4aW5nU3RhdHVzUG9sbGluZycsICgpID0+IHtcbiAgLy8gVGVzdCB0aGUgcG9sbGluZyBob29rIGZvciBpbmRleGluZyBzdGF0dXNcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICB2aS51c2VGYWtlVGltZXJzKClcbiAgfSlcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIHZpLnVzZVJlYWxUaW1lcnMoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgZmV0Y2ggc3RhdHVzIG9uIG1vdW50JywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBtb2NrU3RhdHVzID0gW2NyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGluZGV4aW5nX3N0YXR1czogJ2NvbXBsZXRlZCcgfSldXG4gICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaC5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGRhdGE6IG1vY2tTdGF0dXMgfSlcblxuICAgIC8vIEFjdFxuICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICB1c2VJbmRleGluZ1N0YXR1c1BvbGxpbmcoeyBkYXRhc2V0SWQ6ICdkcy0xJywgYmF0Y2hJZDogJ2JhdGNoLTEnIH0pLFxuICAgIClcblxuICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB2aS5ydW5Pbmx5UGVuZGluZ1RpbWVyc0FzeW5jKClcbiAgICB9KVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzQmF0Y2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgIGRhdGFzZXRJZDogJ2RzLTEnLFxuICAgICAgYmF0Y2hJZDogJ2JhdGNoLTEnLFxuICAgIH0pXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnN0YXR1c0xpc3QpLnRvRXF1YWwobW9ja1N0YXR1cylcbiAgfSlcblxuICBpdCgnc2hvdWxkIHN0b3AgcG9sbGluZyB3aGVuIGFsbCBzdGF0dXNlcyBhcmUgY29tcGxldGVkJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBtb2NrU3RhdHVzID0gW2NyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGluZGV4aW5nX3N0YXR1czogJ2NvbXBsZXRlZCcgfSldXG4gICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaC5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGRhdGE6IG1vY2tTdGF0dXMgfSlcblxuICAgIC8vIEFjdFxuICAgIHJlbmRlckhvb2soKCkgPT5cbiAgICAgIHVzZUluZGV4aW5nU3RhdHVzUG9sbGluZyh7IGRhdGFzZXRJZDogJ2RzLTEnLCBiYXRjaElkOiAnYmF0Y2gtMScgfSksXG4gICAgKVxuXG4gICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHZpLnJ1bk9ubHlQZW5kaW5nVGltZXJzQXN5bmMoKVxuICAgIH0pXG5cbiAgICAvLyBBc3NlcnQgLSBzaG91bGQgb25seSBiZSBjYWxsZWQgb25jZSBzaW5jZSBzdGF0dXMgaXMgY29tcGxldGVkXG4gICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzQmF0Y2gpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgY29udGludWUgcG9sbGluZyB3aGVuIHN0YXR1cyBpcyBpbmRleGluZycsIGFzeW5jICgpID0+IHtcbiAgICAvLyBBcnJhbmdlXG4gICAgY29uc3QgaW5kZXhpbmdTdGF0dXMgPSBbY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaW5kZXhpbmdfc3RhdHVzOiAnaW5kZXhpbmcnIH0pXVxuICAgIGNvbnN0IGNvbXBsZXRlZFN0YXR1cyA9IFtjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpbmRleGluZ19zdGF0dXM6ICdjb21wbGV0ZWQnIH0pXVxuXG4gICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaFxuICAgICAgLm1vY2tSZXNvbHZlZFZhbHVlT25jZSh7IGRhdGE6IGluZGV4aW5nU3RhdHVzIH0pXG4gICAgICAubW9ja1Jlc29sdmVkVmFsdWVPbmNlKHsgZGF0YTogY29tcGxldGVkU3RhdHVzIH0pXG5cbiAgICAvLyBBY3RcbiAgICByZW5kZXJIb29rKCgpID0+XG4gICAgICB1c2VJbmRleGluZ1N0YXR1c1BvbGxpbmcoeyBkYXRhc2V0SWQ6ICdkcy0xJywgYmF0Y2hJZDogJ2JhdGNoLTEnIH0pLFxuICAgIClcblxuICAgIC8vIEZpcnN0IHBvbGxcbiAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdmkucnVuT25seVBlbmRpbmdUaW1lcnNBc3luYygpXG4gICAgfSlcblxuICAgIC8vIEFkdmFuY2UgdGltZXIgZm9yIG5leHQgcG9sbCAoMjUwMG1zKVxuICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB2aS5hZHZhbmNlVGltZXJzQnlUaW1lQXN5bmMoMjUwMClcbiAgICB9KVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzQmF0Y2gpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgc3RvcCBwb2xsaW5nIHdoZW4gc3RhdHVzIGlzIGVycm9yJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBtb2NrU3RhdHVzID0gW2NyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGluZGV4aW5nX3N0YXR1czogJ2Vycm9yJywgZXJyb3I6ICdTb21lIGVycm9yJyB9KV1cbiAgICBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1c0JhdGNoLm1vY2tSZXNvbHZlZFZhbHVlKHsgZGF0YTogbW9ja1N0YXR1cyB9KVxuXG4gICAgLy8gQWN0XG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgIHVzZUluZGV4aW5nU3RhdHVzUG9sbGluZyh7IGRhdGFzZXRJZDogJ2RzLTEnLCBiYXRjaElkOiAnYmF0Y2gtMScgfSksXG4gICAgKVxuXG4gICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHZpLnJ1bk9ubHlQZW5kaW5nVGltZXJzQXN5bmMoKVxuICAgIH0pXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaXNFbWJlZGRpbmdDb21wbGV0ZWQpLnRvQmUodHJ1ZSlcbiAgICBleHBlY3QobW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBzdG9wIHBvbGxpbmcgd2hlbiBzdGF0dXMgaXMgcGF1c2VkJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBtb2NrU3RhdHVzID0gW2NyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGluZGV4aW5nX3N0YXR1czogJ3BhdXNlZCcgfSldXG4gICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaC5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGRhdGE6IG1vY2tTdGF0dXMgfSlcblxuICAgIC8vIEFjdFxuICAgIGNvbnN0IHsgcmVzdWx0IH0gPSByZW5kZXJIb29rKCgpID0+XG4gICAgICB1c2VJbmRleGluZ1N0YXR1c1BvbGxpbmcoeyBkYXRhc2V0SWQ6ICdkcy0xJywgYmF0Y2hJZDogJ2JhdGNoLTEnIH0pLFxuICAgIClcblxuICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB2aS5ydW5Pbmx5UGVuZGluZ1RpbWVyc0FzeW5jKClcbiAgICB9KVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmlzRW1iZWRkaW5nQ29tcGxldGVkKS50b0JlKHRydWUpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBjb250aW51ZSBwb2xsaW5nIG9uIEFQSSBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAvLyBBcnJhbmdlXG4gICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaFxuICAgICAgLm1vY2tSZWplY3RlZFZhbHVlT25jZShuZXcgRXJyb3IoJ05ldHdvcmsgZXJyb3InKSlcbiAgICAgIC5tb2NrUmVzb2x2ZWRWYWx1ZU9uY2UoeyBkYXRhOiBbY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaW5kZXhpbmdfc3RhdHVzOiAnY29tcGxldGVkJyB9KV0gfSlcblxuICAgIC8vIEFjdFxuICAgIHJlbmRlckhvb2soKCkgPT5cbiAgICAgIHVzZUluZGV4aW5nU3RhdHVzUG9sbGluZyh7IGRhdGFzZXRJZDogJ2RzLTEnLCBiYXRjaElkOiAnYmF0Y2gtMScgfSksXG4gICAgKVxuXG4gICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHZpLnJ1bk9ubHlQZW5kaW5nVGltZXJzQXN5bmMoKVxuICAgIH0pXG5cbiAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdmkuYWR2YW5jZVRpbWVyc0J5VGltZUFzeW5jKDI1MDApXG4gICAgfSlcblxuICAgIC8vIEFzc2VydCAtIHNob3VsZCByZXRyeSBhZnRlciBlcnJvclxuICAgIGV4cGVjdChtb2NrRmV0Y2hJbmRleGluZ1N0YXR1c0JhdGNoKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMilcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGlzRW1iZWRkaW5nIHN0YXRlJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBtb2NrU3RhdHVzID0gW2NyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGluZGV4aW5nX3N0YXR1czogJ2luZGV4aW5nJyB9KV1cbiAgICBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1c0JhdGNoLm1vY2tSZXNvbHZlZFZhbHVlKHsgZGF0YTogbW9ja1N0YXR1cyB9KVxuXG4gICAgLy8gQWN0XG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgIHVzZUluZGV4aW5nU3RhdHVzUG9sbGluZyh7IGRhdGFzZXRJZDogJ2RzLTEnLCBiYXRjaElkOiAnYmF0Y2gtMScgfSksXG4gICAgKVxuXG4gICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHZpLnJ1bk9ubHlQZW5kaW5nVGltZXJzQXN5bmMoKVxuICAgIH0pXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaXNFbWJlZGRpbmcpLnRvQmUodHJ1ZSlcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaXNFbWJlZGRpbmdDb21wbGV0ZWQpLnRvQmUoZmFsc2UpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBjbGVhbnVwIHRpbWVvdXQgb24gdW5tb3VudCcsIGFzeW5jICgpID0+IHtcbiAgICAvLyBBcnJhbmdlXG4gICAgY29uc3QgbW9ja1N0YXR1cyA9IFtjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSldXG4gICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaC5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGRhdGE6IG1vY2tTdGF0dXMgfSlcblxuICAgIC8vIEFjdFxuICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgdXNlSW5kZXhpbmdTdGF0dXNQb2xsaW5nKHsgZGF0YXNldElkOiAnZHMtMScsIGJhdGNoSWQ6ICdiYXRjaC0xJyB9KSxcbiAgICApXG5cbiAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgYXdhaXQgdmkucnVuT25seVBlbmRpbmdUaW1lcnNBc3luYygpXG4gICAgfSlcblxuICAgIGNvbnN0IGNhbGxDb3VudEJlZm9yZVVubW91bnQgPSBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1c0JhdGNoLm1vY2suY2FsbHMubGVuZ3RoXG5cbiAgICB1bm1vdW50KClcblxuICAgIC8vIEFkdmFuY2UgdGltZXJzIC0gc2hvdWxkIG5vdCB0cmlnZ2VyIG1vcmUgY2FsbHMgYWZ0ZXIgdW5tb3VudFxuICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICBhd2FpdCB2aS5hZHZhbmNlVGltZXJzQnlUaW1lQXN5bmMoNTAwMClcbiAgICB9KVxuXG4gICAgLy8gQXNzZXJ0IC0gbm8gYWRkaXRpb25hbCBjYWxscyBhZnRlciB1bm1vdW50XG4gICAgZXhwZWN0KG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzQmF0Y2gpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcyhjYWxsQ291bnRCZWZvcmVVbm1vdW50KVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIGRvY3VtZW50cyB3aXRoIG1peGVkIHN0YXR1c2VzJywgYXN5bmMgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2VcbiAgICBjb25zdCBtb2NrU3RhdHVzID0gW1xuICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdkb2MtMScsIGluZGV4aW5nX3N0YXR1czogJ2NvbXBsZXRlZCcgfSksXG4gICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0yJywgaW5kZXhpbmdfc3RhdHVzOiAnaW5kZXhpbmcnIH0pLFxuICAgIF1cbiAgICBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1c0JhdGNoLm1vY2tSZXNvbHZlZFZhbHVlKHsgZGF0YTogbW9ja1N0YXR1cyB9KVxuXG4gICAgLy8gQWN0XG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT5cbiAgICAgIHVzZUluZGV4aW5nU3RhdHVzUG9sbGluZyh7IGRhdGFzZXRJZDogJ2RzLTEnLCBiYXRjaElkOiAnYmF0Y2gtMScgfSksXG4gICAgKVxuXG4gICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgIGF3YWl0IHZpLnJ1bk9ubHlQZW5kaW5nVGltZXJzQXN5bmMoKVxuICAgIH0pXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaXNFbWJlZGRpbmcpLnRvQmUodHJ1ZSlcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaXNFbWJlZGRpbmdDb21wbGV0ZWQpLnRvQmUoZmFsc2UpXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnN0YXR1c0xpc3QpLnRvSGF2ZUxlbmd0aCgyKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IHN0YXR1c0xpc3QgaW5pdGlhbGx5JywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PlxuICAgICAgdXNlSW5kZXhpbmdTdGF0dXNQb2xsaW5nKHsgZGF0YXNldElkOiAnZHMtMScsIGJhdGNoSWQ6ICdiYXRjaC0xJyB9KSxcbiAgICApXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc3RhdHVzTGlzdCkudG9FcXVhbChbXSlcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaXNFbWJlZGRpbmcpLnRvQmUoZmFsc2UpXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmlzRW1iZWRkaW5nQ29tcGxldGVkKS50b0JlKGZhbHNlKVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFVwZ3JhZGVCYW5uZXIgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnVXBncmFkZUJhbm5lcicsICgpID0+IHtcbiAgLy8gVGVzdCB0aGUgdXBncmFkZSBiYW5uZXIgY29tcG9uZW50XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZW5kZXIgdXBncmFkZSBtZXNzYWdlJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICByZW5kZXIoPFVwZ3JhZGVCYW5uZXIgLz4pXG5cbiAgICAvLyBBc3NlcnRcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYmlsbGluZ1xcLnBsYW5zQ29tbW9uXFwuZG9jdW1lbnRQcm9jZXNzaW5nUHJpb3JpdHlVcGdyYWRlL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZW5kZXIgWmFwRmFzdCBpY29uJywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxVcGdyYWRlQmFubmVyIC8+KVxuXG4gICAgLy8gQXNzZXJ0XG4gICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdzdmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVuZGVyIFVwZ3JhZGVCdG4gY29tcG9uZW50JywgKCkgPT4ge1xuICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICByZW5kZXIoPFVwZ3JhZGVCYW5uZXIgLz4pXG5cbiAgICAvLyBBc3NlcnQgLSBVcGdyYWRlQnRuIHNob3VsZCBiZSByZW5kZXJlZFxuICAgIGNvbnN0IHVwZ3JhZGVDb250YWluZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KC9iaWxsaW5nXFwucGxhbnNDb21tb25cXC5kb2N1bWVudFByb2Nlc3NpbmdQcmlvcml0eVVwZ3JhZGUvaSkucGFyZW50RWxlbWVudFxuICAgIGV4cGVjdCh1cGdyYWRlQ29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSW5kZXhpbmdQcm9ncmVzc0l0ZW0gQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnSW5kZXhpbmdQcm9ncmVzc0l0ZW0nLCAoKSA9PiB7XG4gIC8vIFRlc3QgdGhlIHByb2dyZXNzIGl0ZW0gY29tcG9uZW50IGZvciBpbmRpdmlkdWFsIGRvY3VtZW50c1xuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZG9jdW1lbnQgbmFtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxJbmRleGluZ1Byb2dyZXNzSXRlbSBkZXRhaWw9e2RldGFpbH0gbmFtZT1cInRlc3QtZG9jdW1lbnQudHh0XCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3QtZG9jdW1lbnQudHh0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcHJvZ3Jlc3MgcGVyY2VudGFnZSB3aGVuIGVtYmVkZGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7XG4gICAgICAgIGluZGV4aW5nX3N0YXR1czogJ2luZGV4aW5nJyxcbiAgICAgICAgY29tcGxldGVkX3NlZ21lbnRzOiA1LFxuICAgICAgICB0b3RhbF9zZWdtZW50czogMTAsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5kZXhpbmdQcm9ncmVzc0l0ZW0gZGV0YWlsPXtkZXRhaWx9IG5hbWU9XCJ0ZXN0LnR4dFwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCc1MCUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgcHJvZ3Jlc3MgcGVyY2VudGFnZSB3aGVuIGNvbXBsZXRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGluZGV4aW5nX3N0YXR1czogJ2NvbXBsZXRlZCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEluZGV4aW5nUHJvZ3Jlc3NJdGVtIGRldGFpbD17ZGV0YWlsfSBuYW1lPVwidGVzdC50eHRcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCclJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnU3RhdHVzIEljb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHN1Y2Nlc3MgaWNvbiBmb3IgY29tcGxldGVkIHN0YXR1cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGluZGV4aW5nX3N0YXR1czogJ2NvbXBsZXRlZCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJbmRleGluZ1Byb2dyZXNzSXRlbSBkZXRhaWw9e2RldGFpbH0gbmFtZT1cInRlc3QudHh0XCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXN1Y2Nlc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBlcnJvciBpY29uIGZvciBlcnJvciBzdGF0dXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoe1xuICAgICAgICBpbmRleGluZ19zdGF0dXM6ICdlcnJvcicsXG4gICAgICAgIGVycm9yOiAnUHJvY2Vzc2luZyBmYWlsZWQnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJbmRleGluZ1Byb2dyZXNzSXRlbSBkZXRhaWw9e2RldGFpbH0gbmFtZT1cInRlc3QudHh0XCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LWRlc3RydWN0aXZlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIHN0YXR1cyBpY29uIGZvciBpbmRleGluZyBzdGF0dXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJbmRleGluZ1Byb2dyZXNzSXRlbSBkZXRhaWw9e2RldGFpbH0gbmFtZT1cInRlc3QudHh0XCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXN1Y2Nlc3MnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnRleHQtdGV4dC1kZXN0cnVjdGl2ZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1NvdXJjZSBUeXBlIEljb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZpbGUgaWNvbiBmb3IgRklMRSBzb3VyY2UgdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5kZXhpbmdQcm9ncmVzc0l0ZW1cbiAgICAgICAgICBkZXRhaWw9e2RldGFpbH1cbiAgICAgICAgICBuYW1lPVwiZG9jdW1lbnQucGRmXCJcbiAgICAgICAgICBzb3VyY2VUeXBlPXtEYXRhU291cmNlVHlwZS5GSUxFfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQXNzZXJ0IC0gRG9jdW1lbnRGaWxlSWNvbiBzaG91bGQgYmUgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkb2N1bWVudC5wZGYnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICAvLyBEb2N1bWVudEZpbGVJY29uIGJyYW5jaCBjb3ZlcmFnZTogZGlmZmVyZW50IGZpbGUgZXh0ZW5zaW9uc1xuICAgIGRlc2NyaWJlKCdEb2N1bWVudEZpbGVJY29uIGZpbGUgZXh0ZW5zaW9ucycsICgpID0+IHtcbiAgICAgIGl0LmVhY2goW1xuICAgICAgICBbJ2RvY3VtZW50LnBkZicsICdwZGYnXSxcbiAgICAgICAgWydkYXRhLmpzb24nLCAnanNvbiddLFxuICAgICAgICBbJ3BhZ2UuaHRtbCcsICdodG1sJ10sXG4gICAgICAgIFsncmVhZG1lLnR4dCcsICd0eHQnXSxcbiAgICAgICAgWydub3Rlcy5tYXJrZG93bicsICdtYXJrZG93biddLFxuICAgICAgICBbJ3JlYWRtZS5tZCcsICdtZCddLFxuICAgICAgICBbJ3NwcmVhZHNoZWV0Lnhsc3gnLCAneGxzeCddLFxuICAgICAgICBbJ2xlZ2FjeS54bHMnLCAneGxzJ10sXG4gICAgICAgIFsnZGF0YS5jc3YnLCAnY3N2J10sXG4gICAgICAgIFsnbGV0dGVyLmRvYycsICdkb2MnXSxcbiAgICAgICAgWydyZXBvcnQuZG9jeCcsICdkb2N4J10sXG4gICAgICBdKSgnc2hvdWxkIHJlbmRlciBmaWxlIGljb24gZm9yICVzICglcyBleHRlbnNpb24pJywgKGZpbGVuYW1lKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgIDxJbmRleGluZ1Byb2dyZXNzSXRlbVxuICAgICAgICAgICAgZGV0YWlsPXtkZXRhaWx9XG4gICAgICAgICAgICBuYW1lPXtmaWxlbmFtZX1cbiAgICAgICAgICAgIHNvdXJjZVR5cGU9e0RhdGFTb3VyY2VUeXBlLkZJTEV9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoZmlsZW5hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmtub3duIGZpbGUgZXh0ZW5zaW9uIHdpdGggZGVmYXVsdCBpY29uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cygpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8SW5kZXhpbmdQcm9ncmVzc0l0ZW1cbiAgICAgICAgICAgIGRldGFpbD17ZGV0YWlsfVxuICAgICAgICAgICAgbmFtZT1cImFyY2hpdmUuemlwXCJcbiAgICAgICAgICAgIHNvdXJjZVR5cGU9e0RhdGFTb3VyY2VUeXBlLkZJTEV9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnQgLSBzaG91bGQgc3RpbGwgcmVuZGVyIHdpdGggZGVmYXVsdCBkb2N1bWVudCBpY29uXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdhcmNoaXZlLnppcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSB1cHBlcmNhc2UgZXh0ZW5zaW9uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cygpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8SW5kZXhpbmdQcm9ncmVzc0l0ZW1cbiAgICAgICAgICAgIGRldGFpbD17ZGV0YWlsfVxuICAgICAgICAgICAgbmFtZT1cIlJFUE9SVC5QREZcIlxuICAgICAgICAgICAgc291cmNlVHlwZT17RGF0YVNvdXJjZVR5cGUuRklMRX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnUkVQT1JULlBERicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBtaXhlZCBjYXNlIGV4dGVuc2lvbicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPEluZGV4aW5nUHJvZ3Jlc3NJdGVtXG4gICAgICAgICAgICBkZXRhaWw9e2RldGFpbH1cbiAgICAgICAgICAgIG5hbWU9XCJEb2N1bWVudC5Eb2N4XCJcbiAgICAgICAgICAgIHNvdXJjZVR5cGU9e0RhdGFTb3VyY2VUeXBlLkZJTEV9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0RvY3VtZW50LkRvY3gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmlsZW5hbWUgd2l0aCBtdWx0aXBsZSBkb3RzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cygpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8SW5kZXhpbmdQcm9ncmVzc0l0ZW1cbiAgICAgICAgICAgIGRldGFpbD17ZGV0YWlsfVxuICAgICAgICAgICAgbmFtZT1cIm15LmZpbGUubmFtZS5wZGZcIlxuICAgICAgICAgICAgc291cmNlVHlwZT17RGF0YVNvdXJjZVR5cGUuRklMRX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIHNob3VsZCBleHRyYWN0IFwicGRmXCIgYXMgZXh0ZW5zaW9uXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdteS5maWxlLm5hbWUucGRmJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGZpbGVuYW1lIHdpdGhvdXQgZXh0ZW5zaW9uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cygpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8SW5kZXhpbmdQcm9ncmVzc0l0ZW1cbiAgICAgICAgICAgIGRldGFpbD17ZGV0YWlsfVxuICAgICAgICAgICAgbmFtZT1cIm5vZXh0ZW5zaW9uXCJcbiAgICAgICAgICAgIHNvdXJjZVR5cGU9e0RhdGFTb3VyY2VUeXBlLkZJTEV9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnQgLSBzaG91bGQgdXNlIGZpbGVuYW1lIGl0c2VsZiBhcyBmYWxsYmFja1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbm9leHRlbnNpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbm90aW9uIGljb24gZm9yIE5PVElPTiBzb3VyY2UgdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5kZXhpbmdQcm9ncmVzc0l0ZW1cbiAgICAgICAgICBkZXRhaWw9e2RldGFpbH1cbiAgICAgICAgICBuYW1lPVwiTm90aW9uIFBhZ2VcIlxuICAgICAgICAgIHNvdXJjZVR5cGU9e0RhdGFTb3VyY2VUeXBlLk5PVElPTn1cbiAgICAgICAgICBub3Rpb25JY29uPVwi8J+ThFwiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdOb3Rpb24gUGFnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUHJvZ3Jlc3MgQmFyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHByb2dyZXNzIGJhciB3aGVuIGVtYmVkZGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7XG4gICAgICAgIGluZGV4aW5nX3N0YXR1czogJ2luZGV4aW5nJyxcbiAgICAgICAgY29tcGxldGVkX3NlZ21lbnRzOiAzMCxcbiAgICAgICAgdG90YWxfc2VnbWVudHM6IDEwMCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8SW5kZXhpbmdQcm9ncmVzc0l0ZW0gZGV0YWlsPXtkZXRhaWx9IG5hbWU9XCJ0ZXN0LnR4dFwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHByb2dyZXNzQmFyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ1tzdHlsZSo9XCJ3aWR0aDogMzAlXCJdJylcbiAgICAgIGV4cGVjdChwcm9ncmVzc0JhcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgcHJvZ3Jlc3MgYmFyIHdoZW4gY29tcGxldGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZGV0YWlsID0gY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaW5kZXhpbmdfc3RhdHVzOiAnY29tcGxldGVkJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEluZGV4aW5nUHJvZ3Jlc3NJdGVtIGRldGFpbD17ZGV0YWlsfSBuYW1lPVwidGVzdC50eHRcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwcm9ncmVzc0JhciA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYmctY29tcG9uZW50cy1wcm9ncmVzcy1iYXItcHJvZ3Jlc3MnKVxuICAgICAgZXhwZWN0KHByb2dyZXNzQmFyKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGVycm9yIHN0eWxpbmcgZm9yIGVycm9yIHN0YXR1cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGluZGV4aW5nX3N0YXR1czogJ2Vycm9yJyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEluZGV4aW5nUHJvZ3Jlc3NJdGVtIGRldGFpbD17ZGV0YWlsfSBuYW1lPVwidGVzdC50eHRcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5iZy1zdGF0ZS1kZXN0cnVjdGl2ZS1ob3Zlci1hbHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0JpbGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUHJpb3JpdHlMYWJlbCB3aGVuIGVuYWJsZUJpbGxpbmcgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxJbmRleGluZ1Byb2dyZXNzSXRlbSBkZXRhaWw9e2RldGFpbH0gbmFtZT1cInRlc3QudHh0XCIgZW5hYmxlQmlsbGluZyAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gUHJpb3JpdHlMYWJlbCBjb21wb25lbnQgc2hvdWxkIGJlIGluIHRoZSBET01cbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3QudHh0JykucGFyZW50RWxlbWVudFxuICAgICAgZXhwZWN0KGNvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgUHJpb3JpdHlMYWJlbCB3aGVuIGVuYWJsZUJpbGxpbmcgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5kZXhpbmdQcm9ncmVzc0l0ZW0gZGV0YWlsPXtkZXRhaWx9IG5hbWU9XCJ0ZXN0LnR4dFwiIGVuYWJsZUJpbGxpbmc9e2ZhbHNlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgndGVzdC50eHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIG5hbWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkZXRhaWwgPSBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SW5kZXhpbmdQcm9ncmVzc0l0ZW0gZGV0YWlsPXtkZXRhaWx9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgbm90IGNyYXNoXG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgc291cmNlVHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRldGFpbCA9IGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxJbmRleGluZ1Byb2dyZXNzSXRlbSBkZXRhaWw9e2RldGFpbH0gbmFtZT1cInRlc3QudHh0XCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIHNob3VsZCByZW5kZXIgd2l0aG91dCBzb3VyY2UgaWNvblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3QudHh0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFJ1bGVEZXRhaWwgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgnUnVsZURldGFpbCcsICgpID0+IHtcbiAgLy8gVGVzdCB0aGUgcnVsZSBkZXRhaWwgY29tcG9uZW50IGZvciBwcm9jZXNzIGNvbmZpZ3VyYXRpb24gZGlzcGxheVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8UnVsZURldGFpbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldERvY3VtZW50c1xcLmVtYmVkZGluZ1xcLm1vZGUvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGZpZWxkIGxhYmVscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8UnVsZURldGFpbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldERvY3VtZW50c1xcLmVtYmVkZGluZ1xcLm1vZGUvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0RG9jdW1lbnRzXFwuZW1iZWRkaW5nXFwuc2VnbWVudExlbmd0aC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXREb2N1bWVudHNcXC5lbWJlZGRpbmdcXC50ZXh0Q2xlYW5pbmcvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0Q3JlYXRpb25cXC5zdGVwVHdvXFwuaW5kZXhNb2RlL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldFNldHRpbmdzXFwuZm9ybVxcLnJldHJpZXZhbFNldHRpbmdcXC50aXRsZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ01vZGUgRGlzcGxheScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgXCItXCIgd2hlbiBzb3VyY2VEYXRhIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8UnVsZURldGFpbCAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5VGV4dCgnLScpKS50b0hhdmVMZW5ndGgoMykgLy8gbW9kZSwgc2VnbWVudExlbmd0aCwgdGV4dENsZWFuaW5nXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBcImN1c3RvbVwiIGZvciBnZW5lcmFsIHByb2Nlc3MgbW9kZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNvdXJjZURhdGEgPSBjcmVhdGVNb2NrUHJvY2Vzc1J1bGUoeyBtb2RlOiBQcm9jZXNzTW9kZS5nZW5lcmFsIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSdWxlRGV0YWlsIHNvdXJjZURhdGE9e3NvdXJjZURhdGF9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0RG9jdW1lbnRzXFwuZW1iZWRkaW5nXFwuY3VzdG9tL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBoaWVyYXJjaGljYWwgbW9kZSB3aXRoIHBhcmFncmFwaCBwYXJlbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzb3VyY2VEYXRhID0gY3JlYXRlTW9ja1Byb2Nlc3NSdWxlKHtcbiAgICAgICAgbW9kZTogUHJvY2Vzc01vZGUucGFyZW50Q2hpbGQsXG4gICAgICAgIHJ1bGVzOiB7XG4gICAgICAgICAgcGFyZW50X21vZGU6ICdwYXJhZ3JhcGgnLFxuICAgICAgICAgIHNlZ21lbnRhdGlvbjogeyBtYXhfdG9rZW5zOiA1MDAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0gYXMgUGFydGlhbDxQcm9jZXNzUnVsZVJlc3BvbnNlPilcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgc291cmNlRGF0YT17c291cmNlRGF0YSBhcyBQcm9jZXNzUnVsZVJlc3BvbnNlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldERvY3VtZW50c1xcLmVtYmVkZGluZ1xcLmhpZXJhcmNoaWNhbC9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1NlZ21lbnQgTGVuZ3RoIERpc3BsYXknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IG1heF90b2tlbnMgZm9yIGdlbmVyYWwgbW9kZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNvdXJjZURhdGEgPSBjcmVhdGVNb2NrUHJvY2Vzc1J1bGUoe1xuICAgICAgICBtb2RlOiBQcm9jZXNzTW9kZS5nZW5lcmFsLFxuICAgICAgICBydWxlczoge1xuICAgICAgICAgIHNlZ21lbnRhdGlvbjogeyBtYXhfdG9rZW5zOiA1MDAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0gYXMgUGFydGlhbDxQcm9jZXNzUnVsZVJlc3BvbnNlPilcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgc291cmNlRGF0YT17c291cmNlRGF0YSBhcyBQcm9jZXNzUnVsZVJlc3BvbnNlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnNTAwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHBhcmVudCBhbmQgY2hpbGQgdG9rZW5zIGZvciBoaWVyYXJjaGljYWwgbW9kZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHNvdXJjZURhdGEgPSBjcmVhdGVNb2NrUHJvY2Vzc1J1bGUoe1xuICAgICAgICBtb2RlOiBQcm9jZXNzTW9kZS5wYXJlbnRDaGlsZCxcbiAgICAgICAgcnVsZXM6IHtcbiAgICAgICAgICBzZWdtZW50YXRpb246IHsgbWF4X3Rva2VuczogMTAwMCB9LFxuICAgICAgICAgIHN1YmNodW5rX3NlZ21lbnRhdGlvbjogeyBtYXhfdG9rZW5zOiAyMDAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0gYXMgUGFydGlhbDxQcm9jZXNzUnVsZVJlc3BvbnNlPilcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgc291cmNlRGF0YT17c291cmNlRGF0YSBhcyBQcm9jZXNzUnVsZVJlc3BvbnNlfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMTAwMC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvMjAwLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdUZXh0IENsZWFuaW5nIFJ1bGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBlbmFibGVkIHJ1bGUgbmFtZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBzb3VyY2VEYXRhID0gY3JlYXRlTW9ja1Byb2Nlc3NSdWxlKHtcbiAgICAgICAgbW9kZTogUHJvY2Vzc01vZGUuZ2VuZXJhbCxcbiAgICAgICAgcnVsZXM6IHtcbiAgICAgICAgICBwcmVfcHJvY2Vzc2luZ19ydWxlczogW1xuICAgICAgICAgICAgeyBpZDogJ3JlbW92ZV9leHRyYV9zcGFjZXMnLCBlbmFibGVkOiB0cnVlIH0sXG4gICAgICAgICAgICB7IGlkOiAncmVtb3ZlX3VybHNfZW1haWxzJywgZW5hYmxlZDogdHJ1ZSB9LFxuICAgICAgICAgICAgeyBpZDogJ3JlbW92ZV9zdG9wd29yZHMnLCBlbmFibGVkOiBmYWxzZSB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9IGFzIFBhcnRpYWw8UHJvY2Vzc1J1bGVSZXNwb25zZT4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxSdWxlRGV0YWlsIHNvdXJjZURhdGE9e3NvdXJjZURhdGEgYXMgUHJvY2Vzc1J1bGVSZXNwb25zZX0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3JlbW92ZUV4dHJhU3BhY2VzL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcmVtb3ZlVXJsRW1haWxzL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBcIi1cIiB3aGVuIG5vIHJ1bGVzIGFyZSBlbmFibGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc291cmNlRGF0YSA9IGNyZWF0ZU1vY2tQcm9jZXNzUnVsZSh7XG4gICAgICAgIG1vZGU6IFByb2Nlc3NNb2RlLmdlbmVyYWwsXG4gICAgICAgIHJ1bGVzOiB7XG4gICAgICAgICAgcHJlX3Byb2Nlc3NpbmdfcnVsZXM6IFtcbiAgICAgICAgICAgIHsgaWQ6ICdyZW1vdmVfZXh0cmFfc3BhY2VzJywgZW5hYmxlZDogZmFsc2UgfSxcbiAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgICAgfSBhcyBQYXJ0aWFsPFByb2Nlc3NSdWxlUmVzcG9uc2U+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UnVsZURldGFpbCBzb3VyY2VEYXRhPXtzb3VyY2VEYXRhIGFzIFByb2Nlc3NSdWxlUmVzcG9uc2V9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSB0ZXh0Q2xlYW5pbmcgc2hvdWxkIHNob3cgXCItXCJcbiAgICAgIGNvbnN0IGRhc2hFbGVtZW50cyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoJy0nKVxuICAgICAgZXhwZWN0KGRhc2hFbGVtZW50cy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0luZGV4aW5nIFR5cGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IHF1YWxpZmllZCBmb3IgaGlnaF9xdWFsaXR5IGluZGV4aW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxSdWxlRGV0YWlsIGluZGV4aW5nVHlwZT1cImhpZ2hfcXVhbGl0eVwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0Q3JlYXRpb25cXC5zdGVwVHdvXFwucXVhbGlmaWVkL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlY29ub21pY2FsIGZvciBlY29ub215IGluZGV4aW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxSdWxlRGV0YWlsIGluZGV4aW5nVHlwZT1cImVjb25vbXlcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldENyZWF0aW9uXFwuc3RlcFR3b1xcLmVjb25vbWljYWwvaSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdCBpY29uIGZvciBpbmRleGluZyB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxSdWxlRGV0YWlsIGluZGV4aW5nVHlwZT1cImhpZ2hfcXVhbGl0eVwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGltYWdlcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnbmV4dC1pbWFnZScpXG4gICAgICBleHBlY3QoaW1hZ2VzLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUmV0cmlldmFsIE1ldGhvZCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgc2VtYW50aWMgc2VhcmNoIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXRcXC5yZXRyaWV2YWxcXC5zZW1hbnRpY19zZWFyY2hcXC50aXRsZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cga2V5d29yZCBzZWFyY2ggZm9yIGVjb25vbWljYWwgaW5kZXhpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgaW5kZXhpbmdUeXBlPVwiZWNvbm9teVwiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0XFwucmV0cmlldmFsXFwua2V5d29yZF9zZWFyY2hcXC50aXRsZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdC5lYWNoKFtcbiAgICAgIFtSRVRSSUVWRV9NRVRIT0QuZnVsbFRleHQsICdmdWxsX3RleHRfc2VhcmNoJ10sXG4gICAgICBbUkVUUklFVkVfTUVUSE9ELmh5YnJpZCwgJ2h5YnJpZF9zZWFyY2gnXSxcbiAgICAgIFtSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsICdzZW1hbnRpY19zZWFyY2gnXSxcbiAgICBdKSgnc2hvdWxkIHNob3cgY29ycmVjdCBsYWJlbCBmb3IgJXMgcmV0cmlldmFsIG1ldGhvZCcsIChtZXRob2QsIGV4cGVjdGVkS2V5KSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPFJ1bGVEZXRhaWwgcmV0cmlldmFsTWV0aG9kPXttZXRob2R9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KG5ldyBSZWdFeHAoYGRhdGFzZXRcXFxcLnJldHJpZXZhbFxcXFwuJHtleHBlY3RlZEtleX1cXFxcLnRpdGxlYCwgJ2knKSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEVtYmVkZGluZ1Byb2Nlc3MgSW50ZWdyYXRpb24gVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdFbWJlZGRpbmdQcm9jZXNzJywgKCkgPT4ge1xuICAvLyBJbnRlZ3JhdGlvbiB0ZXN0cyBmb3IgdGhlIG1haW4gRW1iZWRkaW5nUHJvY2VzcyBjb21wb25lbnRcblxuICAvLyBJbXBvcnQgdGhlIG1haW4gY29tcG9uZW50IGFmdGVyIG1vY2tzIGFyZSBzZXQgdXBcbiAgbGV0IEVtYmVkZGluZ1Byb2Nlc3M6IHR5cGVvZiBpbXBvcnQoJy4vaW5kZXgnKS5kZWZhdWx0XG5cbiAgYmVmb3JlRWFjaChhc3luYyAoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgdmkudXNlRmFrZVRpbWVycygpXG4gICAgbW9ja0VuYWJsZUJpbGxpbmcgPSBmYWxzZVxuICAgIG1vY2tQbGFuVHlwZSA9ICdzYW5kYm94J1xuXG4gICAgLy8gRHluYW1pY2FsbHkgaW1wb3J0IHRvIGdldCBmcmVzaCBjb21wb25lbnQgd2l0aCBtb2Nrc1xuICAgIGNvbnN0IGVtYmVkZGluZ01vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi9pbmRleCcpXG4gICAgRW1iZWRkaW5nUHJvY2VzcyA9IGVtYmVkZGluZ01vZHVsZS5kZWZhdWx0XG4gIH0pXG5cbiAgYWZ0ZXJFYWNoKCgpID0+IHtcbiAgICB2aS51c2VSZWFsVGltZXJzKClcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1c0JhdGNoLm1vY2tSZXNvbHZlZFZhbHVlKHsgZGF0YTogW10gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3MgZGF0YXNldElkPVwiZHMtMVwiIGJhdGNoSWQ9XCJiYXRjaC0xXCIgLz4pXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHZpLnJ1bk9ubHlQZW5kaW5nVGltZXJzQXN5bmMoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBzdGF0dXMgaGVhZGVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1N0YXR1cyA9IFtjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpbmRleGluZ19zdGF0dXM6ICdpbmRleGluZycgfSldXG4gICAgICBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1c0JhdGNoLm1vY2tSZXNvbHZlZFZhbHVlKHsgZGF0YTogbW9ja1N0YXR1cyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyBkYXRhc2V0SWQ9XCJkcy0xXCIgYmF0Y2hJZD1cImJhdGNoLTFcIiAvPilcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdmkucnVuT25seVBlbmRpbmdUaW1lcnNBc3luYygpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0RG9jdW1lbnRzXFwuZW1iZWRkaW5nXFwucHJvY2Vzc2luZy9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgY29tcGxldGVkIHN0YXR1cyB3aGVuIGFsbCBkb2N1bWVudHMgYXJlIGRvbmUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrU3RhdHVzID0gW2NyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGluZGV4aW5nX3N0YXR1czogJ2NvbXBsZXRlZCcgfSldXG4gICAgICBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1c0JhdGNoLm1vY2tSZXNvbHZlZFZhbHVlKHsgZGF0YTogbW9ja1N0YXR1cyB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyBkYXRhc2V0SWQ9XCJkcy0xXCIgYmF0Y2hJZD1cImJhdGNoLTFcIiAvPilcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdmkucnVuT25seVBlbmRpbmdUaW1lcnNBc3luYygpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9kYXRhc2V0RG9jdW1lbnRzXFwuZW1iZWRkaW5nXFwuY29tcGxldGVkL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUHJvZ3Jlc3MgSXRlbXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcHJvZ3Jlc3MgaXRlbXMgZm9yIGVhY2ggZG9jdW1lbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkb2N1bWVudHMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnLCBuYW1lOiAnZmlsZTEudHh0JyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0RvY3VtZW50KHsgaWQ6ICdkb2MtMicsIG5hbWU6ICdmaWxlMi5wZGYnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgbW9ja1N0YXR1cyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0luZGV4aW5nU3RhdHVzKHsgaWQ6ICdkb2MtMScgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tJbmRleGluZ1N0YXR1cyh7IGlkOiAnZG9jLTInIH0pLFxuICAgICAgXVxuICAgICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaC5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGRhdGE6IG1vY2tTdGF0dXMgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxFbWJlZGRpbmdQcm9jZXNzXG4gICAgICAgICAgZGF0YXNldElkPVwiZHMtMVwiXG4gICAgICAgICAgYmF0Y2hJZD1cImJhdGNoLTFcIlxuICAgICAgICAgIGRvY3VtZW50cz17ZG9jdW1lbnRzfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdmkucnVuT25seVBlbmRpbmdUaW1lcnNBc3luYygpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdmaWxlMS50eHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ZpbGUyLnBkZicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVXBncmFkZSBCYW5uZXInLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IHVwZ3JhZGUgYmFubmVyIHdoZW4gYmlsbGluZyBpcyBlbmFibGVkIGFuZCBub3QgdGVhbSBwbGFuJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0VuYWJsZUJpbGxpbmcgPSB0cnVlXG4gICAgICBtb2NrUGxhblR5cGUgPSAnc2FuZGJveCdcbiAgICAgIG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzQmF0Y2gubW9ja1Jlc29sdmVkVmFsdWUoeyBkYXRhOiBbXSB9KVxuXG4gICAgICAvLyBSZS1pbXBvcnQgdG8gZ2V0IHVwZGF0ZWQgbW9jayB2YWx1ZXNcbiAgICAgIGNvbnN0IGVtYmVkZGluZ01vZHVsZSA9IGF3YWl0IGltcG9ydCgnLi9pbmRleCcpXG4gICAgICBFbWJlZGRpbmdQcm9jZXNzID0gZW1iZWRkaW5nTW9kdWxlLmRlZmF1bHRcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3MgZGF0YXNldElkPVwiZHMtMVwiIGJhdGNoSWQ9XCJiYXRjaC0xXCIgLz4pXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHZpLnJ1bk9ubHlQZW5kaW5nVGltZXJzQXN5bmMoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvYmlsbGluZ1xcLnBsYW5zQ29tbW9uXFwuZG9jdW1lbnRQcm9jZXNzaW5nUHJpb3JpdHlVcGdyYWRlL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgdXBncmFkZSBiYW5uZXIgd2hlbiBiaWxsaW5nIGlzIGRpc2FibGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0VuYWJsZUJpbGxpbmcgPSBmYWxzZVxuICAgICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaC5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGRhdGE6IFtdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIGRhdGFzZXRJZD1cImRzLTFcIiBiYXRjaElkPVwiYmF0Y2gtMVwiIC8+KVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB2aS5ydW5Pbmx5UGVuZGluZ1RpbWVyc0FzeW5jKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvYmlsbGluZ1xcLnBsYW5zQ29tbW9uXFwuZG9jdW1lbnRQcm9jZXNzaW5nUHJpb3JpdHlVcGdyYWRlL2kpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHVwZ3JhZGUgYmFubmVyIGZvciB0ZWFtIHBsYW4nLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRW5hYmxlQmlsbGluZyA9IHRydWVcbiAgICAgIG1vY2tQbGFuVHlwZSA9ICd0ZWFtJ1xuICAgICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaC5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGRhdGE6IFtdIH0pXG5cbiAgICAgIC8vIFJlLWltcG9ydCB0byBnZXQgdXBkYXRlZCBtb2NrIHZhbHVlc1xuICAgICAgY29uc3QgZW1iZWRkaW5nTW9kdWxlID0gYXdhaXQgaW1wb3J0KCcuL2luZGV4JylcbiAgICAgIEVtYmVkZGluZ1Byb2Nlc3MgPSBlbWJlZGRpbmdNb2R1bGUuZGVmYXVsdFxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyBkYXRhc2V0SWQ9XCJkcy0xXCIgYmF0Y2hJZD1cImJhdGNoLTFcIiAvPilcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdmkucnVuT25seVBlbmRpbmdUaW1lcnNBc3luYygpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoL2JpbGxpbmdcXC5wbGFuc0NvbW1vblxcLmRvY3VtZW50UHJvY2Vzc2luZ1ByaW9yaXR5VXBncmFkZS9pKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdBY3Rpb24gQnV0dG9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBBUEkgYWNjZXNzIGJ1dHRvbiB3aXRoIGNvcnJlY3QgbGluaycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzQmF0Y2gubW9ja1Jlc29sdmVkVmFsdWUoeyBkYXRhOiBbXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyBkYXRhc2V0SWQ9XCJkcy0xXCIgYmF0Y2hJZD1cImJhdGNoLTFcIiAvPilcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdmkucnVuT25seVBlbmRpbmdUaW1lcnNBc3luYygpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGFwaUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVRleHQoJ0FjY2VzcyB0aGUgQVBJJylcbiAgICAgIGV4cGVjdChhcGlCdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChhcGlCdXR0b24uY2xvc2VzdCgnYScpKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnaHR0cHM6Ly9hcGkuZXhhbXBsZS5jb20vZG9jcycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG5hdmlnYXRpb24gYnV0dG9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaC5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGRhdGE6IFtdIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxFbWJlZGRpbmdQcm9jZXNzIGRhdGFzZXRJZD1cImRzLTFcIiBiYXRjaElkPVwiYmF0Y2gtMVwiIC8+KVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB2aS5ydW5Pbmx5UGVuZGluZ1RpbWVyc0FzeW5jKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXRDcmVhdGlvblxcLnN0ZXBUaHJlZVxcLm5hdlRvL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbmF2aWdhdGUgdG8gZG9jdW1lbnRzIGxpc3Qgd2hlbiBuYXYgYnV0dG9uIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1c0JhdGNoLm1vY2tSZXNvbHZlZFZhbHVlKHsgZGF0YTogW10gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3MgZGF0YXNldElkPVwiZHMtMVwiIGJhdGNoSWQ9XCJiYXRjaC0xXCIgLz4pXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHZpLnJ1bk9ubHlQZW5kaW5nVGltZXJzQXN5bmMoKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgbmF2QnV0dG9uID0gc2NyZWVuLmdldEJ5VGV4dCgvZGF0YXNldENyZWF0aW9uXFwuc3RlcFRocmVlXFwubmF2VG8vaSlcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgbmF2QnV0dG9uLmNsaWNrKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tJbnZhbGlkRG9jdW1lbnRMaXN0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChtb2NrUHVzaCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJy9kYXRhc2V0cy9kcy0xL2RvY3VtZW50cycpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUnVsZSBEZXRhaWwnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUnVsZURldGFpbCBjb21wb25lbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1c0JhdGNoLm1vY2tSZXNvbHZlZFZhbHVlKHsgZGF0YTogW10gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxFbWJlZGRpbmdQcm9jZXNzXG4gICAgICAgICAgZGF0YXNldElkPVwiZHMtMVwiXG4gICAgICAgICAgYmF0Y2hJZD1cImJhdGNoLTFcIlxuICAgICAgICAgIGluZGV4aW5nVHlwZT1cImhpZ2hfcXVhbGl0eVwiXG4gICAgICAgICAgcmV0cmlldmFsTWV0aG9kPXtSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB2aS5ydW5Pbmx5UGVuZGluZ1RpbWVyc0FzeW5jKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXREb2N1bWVudHNcXC5lbWJlZGRpbmdcXC5tb2RlL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBpbmRleGluZ1R5cGUgdG8gUnVsZURldGFpbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzQmF0Y2gubW9ja1Jlc29sdmVkVmFsdWUoeyBkYXRhOiBbXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEVtYmVkZGluZ1Byb2Nlc3NcbiAgICAgICAgICBkYXRhc2V0SWQ9XCJkcy0xXCJcbiAgICAgICAgICBiYXRjaElkPVwiYmF0Y2gtMVwiXG4gICAgICAgICAgaW5kZXhpbmdUeXBlPVwiZWNvbm9teVwiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB2aS5ydW5Pbmx5UGVuZGluZ1RpbWVyc0FzeW5jKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXRDcmVhdGlvblxcLnN0ZXBUd29cXC5lY29ub21pY2FsL2kpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRG9jdW1lbnQgTG9va3VwIE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWVtb2l6ZSBkb2N1bWVudCBsb29rdXAgYmFzZWQgb24gZG9jdW1lbnRzIGFycmF5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jdW1lbnRzID0gW2NyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnLCBuYW1lOiAndGVzdC50eHQnIH0pXVxuICAgICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaC5tb2NrUmVzb2x2ZWRWYWx1ZSh7XG4gICAgICAgIGRhdGE6IFtjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJyB9KV0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPEVtYmVkZGluZ1Byb2Nlc3NcbiAgICAgICAgICBkYXRhc2V0SWQ9XCJkcy0xXCJcbiAgICAgICAgICBiYXRjaElkPVwiYmF0Y2gtMVwiXG4gICAgICAgICAgZG9jdW1lbnRzPXtkb2N1bWVudHN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBhd2FpdCB2aS5ydW5Pbmx5UGVuZGluZ1RpbWVyc0FzeW5jKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggc2FtZSBkb2N1bWVudHMgcmVmZXJlbmNlXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPEVtYmVkZGluZ1Byb2Nlc3NcbiAgICAgICAgICBkYXRhc2V0SWQ9XCJkcy0xXCJcbiAgICAgICAgICBiYXRjaElkPVwiYmF0Y2gtMVwiXG4gICAgICAgICAgZG9jdW1lbnRzPXtkb2N1bWVudHN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBjb21wb25lbnQgc2hvdWxkIHJlbmRlciB3aXRob3V0IGlzc3Vlc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3QudHh0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGRvY3VtZW50cyBhcnJheScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzQmF0Y2gubW9ja1Jlc29sdmVkVmFsdWUoeyBkYXRhOiBbXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RW1iZWRkaW5nUHJvY2VzcyBkYXRhc2V0SWQ9XCJkcy0xXCIgYmF0Y2hJZD1cImJhdGNoLTFcIiBkb2N1bWVudHM9e1tdfSAvPilcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgYXdhaXQgdmkucnVuT25seVBlbmRpbmdUaW1lcnNBc3luYygpXG4gICAgICB9KVxuXG4gICAgICAvLyBBc3NlcnQgLSBzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmdcbiAgICAgIGV4cGVjdChkb2N1bWVudC5ib2R5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBkb2N1bWVudHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hJbmRleGluZ1N0YXR1c0JhdGNoLm1vY2tSZXNvbHZlZFZhbHVlKHsgZGF0YTogW10gfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEVtYmVkZGluZ1Byb2Nlc3MgZGF0YXNldElkPVwiZHMtMVwiIGJhdGNoSWQ9XCJiYXRjaC0xXCIgLz4pXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHZpLnJ1bk9ubHlQZW5kaW5nVGltZXJzQXN5bmMoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nXG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzdGF0dXMgd2l0aCBtaXNzaW5nIGRvY3VtZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZG9jdW1lbnRzID0gW2NyZWF0ZU1vY2tEb2N1bWVudCh7IGlkOiAnZG9jLTEnLCBuYW1lOiAndGVzdC50eHQnIH0pXVxuICAgICAgbW9ja0ZldGNoSW5kZXhpbmdTdGF0dXNCYXRjaC5tb2NrUmVzb2x2ZWRWYWx1ZSh7XG4gICAgICAgIGRhdGE6IFtcbiAgICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy0xJyB9KSxcbiAgICAgICAgICBjcmVhdGVNb2NrSW5kZXhpbmdTdGF0dXMoeyBpZDogJ2RvYy11bmtub3duJyB9KSwgLy8gTm8gbWF0Y2hpbmcgZG9jdW1lbnRcbiAgICAgICAgXSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKFxuICAgICAgICA8RW1iZWRkaW5nUHJvY2Vzc1xuICAgICAgICAgIGRhdGFzZXRJZD1cImRzLTFcIlxuICAgICAgICAgIGJhdGNoSWQ9XCJiYXRjaC0xXCJcbiAgICAgICAgICBkb2N1bWVudHM9e2RvY3VtZW50c31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHZpLnJ1bk9ubHlQZW5kaW5nVGltZXJzQXN5bmMoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHJlbmRlciBrbm93biBkb2N1bWVudCBhbmQgaGFuZGxlIHVua25vd24gZ3JhY2VmdWxseVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3QudHh0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHJldHJpZXZhbE1ldGhvZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaEluZGV4aW5nU3RhdHVzQmF0Y2gubW9ja1Jlc29sdmVkVmFsdWUoeyBkYXRhOiBbXSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEVtYmVkZGluZ1Byb2Nlc3NcbiAgICAgICAgICBkYXRhc2V0SWQ9XCJkcy0xXCJcbiAgICAgICAgICBiYXRjaElkPVwiYmF0Y2gtMVwiXG4gICAgICAgICAgaW5kZXhpbmdUeXBlPVwiaGlnaF9xdWFsaXR5XCJcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHZpLnJ1bk9ubHlQZW5kaW5nVGltZXJzQXN5bmMoKVxuICAgICAgfSlcblxuICAgICAgLy8gQXNzZXJ0IC0gc2hvdWxkIHVzZSBkZWZhdWx0IHNlbWFudGljIHNlYXJjaFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL2RhdGFzZXRcXC5yZXRyaWV2YWxcXC5zZW1hbnRpY19zZWFyY2hcXC50aXRsZS9pKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19