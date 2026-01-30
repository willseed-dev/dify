"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const pipeline_1 = require("@/models/pipeline");
const index_1 = require("./index");
// Mock Next.js router
const mockPush = vi.fn();
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: mockPush,
        back: mockBack,
    }),
}));
// Mock dataset detail context
const mockPipelineId = 'pipeline-123';
vi.mock('@/context/dataset-detail', () => ({
    useDatasetDetailContextWithSelector: (selector) => selector({ dataset: { pipeline_id: mockPipelineId, doc_form: 'text_model' } }),
}));
// Mock API hooks for PipelineSettings
const mockUsePipelineExecutionLog = vi.fn();
const mockMutateAsync = vi.fn();
const mockUseRunPublishedPipeline = vi.fn();
vi.mock('@/service/use-pipeline', () => ({
    usePipelineExecutionLog: (params) => mockUsePipelineExecutionLog(params),
    useRunPublishedPipeline: () => mockUseRunPublishedPipeline(),
    // For ProcessDocuments component
    usePublishedPipelineProcessingParams: () => ({
        data: { variables: [] },
        isFetching: false,
    }),
}));
// Mock document invalidation hooks
const mockInvalidDocumentList = vi.fn();
const mockInvalidDocumentDetail = vi.fn();
vi.mock('@/service/knowledge/use-document', () => ({
    useInvalidDocumentList: () => mockInvalidDocumentList,
    useInvalidDocumentDetail: () => mockInvalidDocumentDetail,
}));
// Mock Form component in ProcessDocuments - internal dependencies are too complex
vi.mock('../../../create-from-pipeline/process-documents/form', () => ({
    default: function MockForm({ ref, initialData, configurations, onSubmit, onPreview, isRunning, }) {
        if (ref && typeof ref === 'object' && 'current' in ref) {
            ref.current = {
                submit: () => onSubmit(initialData),
            };
        }
        return (<form data-testid="process-form" onSubmit={(e) => {
                e.preventDefault();
                onSubmit(initialData);
            }}>
        {configurations.map((config, index) => (<div key={index} data-testid={`field-${config.variable}`}>
            <label>{config.label}</label>
          </div>))}
        <button type="button" data-testid="preview-btn" onClick={onPreview} disabled={isRunning}>
          Preview
        </button>
      </form>);
    },
}));
// Mock ChunkPreview - has complex internal state and many dependencies
vi.mock('../../../create-from-pipeline/preview/chunk-preview', () => ({
    default: function MockChunkPreview({ dataSourceType, localFiles, onlineDocuments, websitePages, onlineDriveFiles, isIdle, isPending, estimateData, }) {
        return (<div data-testid="chunk-preview">
        <span data-testid="datasource-type">{dataSourceType}</span>
        <span data-testid="local-files-count">{localFiles.length}</span>
        <span data-testid="online-documents-count">{onlineDocuments.length}</span>
        <span data-testid="website-pages-count">{websitePages.length}</span>
        <span data-testid="online-drive-files-count">{onlineDriveFiles.length}</span>
        <span data-testid="is-idle">{String(isIdle)}</span>
        <span data-testid="is-pending">{String(isPending)}</span>
        <span data-testid="has-estimate-data">{String(!!estimateData)}</span>
      </div>);
    },
}));
// Test utilities
const createQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    },
});
const renderWithProviders = (ui) => {
    const queryClient = createQueryClient();
    return (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
      {ui}
    </react_query_1.QueryClientProvider>);
};
// Factory functions for test data
const createMockExecutionLogResponse = (overrides = {}) => ({
    datasource_type: pipeline_1.DatasourceType.localFile,
    input_data: { chunk_size: '100' },
    datasource_node_id: 'datasource-node-1',
    datasource_info: {
        related_id: 'file-1',
        name: 'test-file.pdf',
        extension: 'pdf',
    },
    ...overrides,
});
const createDefaultProps = () => ({
    datasetId: 'dataset-123',
    documentId: 'document-456',
});
describe('PipelineSettings', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockPush.mockClear();
        mockBack.mockClear();
        mockMutateAsync.mockClear();
        mockInvalidDocumentList.mockClear();
        mockInvalidDocumentDetail.mockClear();
        // Default: successful data fetch
        mockUsePipelineExecutionLog.mockReturnValue({
            data: createMockExecutionLogResponse(),
            isFetching: false,
            isError: false,
        });
        // Default: useRunPublishedPipeline mock
        mockUseRunPublishedPipeline.mockReturnValue({
            mutateAsync: mockMutateAsync,
            isIdle: true,
            isPending: false,
        });
    });
    // ==================== Rendering Tests ====================
    // Test basic rendering with real components
    describe('Rendering', () => {
        it('should render without crashing when data is loaded', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert - Real LeftHeader should render with correct content
            expect(react_1.screen.getByText('datasetPipeline.documentSettings.title')).toBeInTheDocument();
            expect(react_1.screen.getByText('datasetPipeline.addDocuments.steps.processDocuments')).toBeInTheDocument();
            // Real ProcessDocuments should render
            expect(react_1.screen.getByTestId('process-form')).toBeInTheDocument();
            // ChunkPreview should render
            expect(react_1.screen.getByTestId('chunk-preview')).toBeInTheDocument();
        });
        it('should render Loading component when fetching data', () => {
            // Arrange
            mockUsePipelineExecutionLog.mockReturnValue({
                data: undefined,
                isFetching: true,
                isError: false,
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert - Loading component should be rendered, not main content
            expect(react_1.screen.queryByText('datasetPipeline.documentSettings.title')).not.toBeInTheDocument();
            expect(react_1.screen.queryByTestId('process-form')).not.toBeInTheDocument();
        });
        it('should render AppUnavailable when there is an error', () => {
            // Arrange
            mockUsePipelineExecutionLog.mockReturnValue({
                data: undefined,
                isFetching: false,
                isError: true,
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert - AppUnavailable should be rendered
            expect(react_1.screen.queryByText('datasetPipeline.documentSettings.title')).not.toBeInTheDocument();
        });
        it('should render container with correct CSS classes', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = renderWithProviders(<index_1.default {...props}/>);
            // Assert
            const mainContainer = container.firstChild;
            expect(mainContainer).toHaveClass('relative', 'flex', 'min-w-[1024px]');
        });
    });
    // ==================== LeftHeader Integration ====================
    // Test real LeftHeader component behavior
    describe('LeftHeader Integration', () => {
        it('should render LeftHeader with title prop', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert - LeftHeader displays the title
            expect(react_1.screen.getByText('datasetPipeline.documentSettings.title')).toBeInTheDocument();
        });
        it('should render back button in LeftHeader', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert - Back button should exist with proper aria-label
            const backButton = react_1.screen.getByRole('button', { name: 'common.operation.back' });
            expect(backButton).toBeInTheDocument();
        });
        it('should call router.back when back button is clicked', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            const backButton = react_1.screen.getByRole('button', { name: 'common.operation.back' });
            react_1.fireEvent.click(backButton);
            // Assert
            expect(mockBack).toHaveBeenCalledTimes(1);
        });
    });
    // ==================== Props Testing ====================
    describe('Props', () => {
        it('should pass datasetId and documentId to usePipelineExecutionLog', () => {
            // Arrange
            const props = { datasetId: 'custom-dataset', documentId: 'custom-document' };
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(mockUsePipelineExecutionLog).toHaveBeenCalledWith({
                dataset_id: 'custom-dataset',
                document_id: 'custom-document',
            });
        });
    });
    // ==================== Memoization - Data Transformation ====================
    describe('Memoization - Data Transformation', () => {
        it('should transform localFile datasource correctly', () => {
            // Arrange
            const mockData = createMockExecutionLogResponse({
                datasource_type: pipeline_1.DatasourceType.localFile,
                datasource_info: {
                    related_id: 'file-123',
                    name: 'document.pdf',
                    extension: 'pdf',
                },
            });
            mockUsePipelineExecutionLog.mockReturnValue({
                data: mockData,
                isFetching: false,
                isError: false,
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('local-files-count')).toHaveTextContent('1');
            expect(react_1.screen.getByTestId('datasource-type')).toHaveTextContent(pipeline_1.DatasourceType.localFile);
        });
        it('should transform websiteCrawl datasource correctly', () => {
            // Arrange
            const mockData = createMockExecutionLogResponse({
                datasource_type: pipeline_1.DatasourceType.websiteCrawl,
                datasource_info: {
                    content: 'Page content',
                    description: 'Page description',
                    source_url: 'https://example.com/page',
                    title: 'Page Title',
                },
            });
            mockUsePipelineExecutionLog.mockReturnValue({
                data: mockData,
                isFetching: false,
                isError: false,
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('website-pages-count')).toHaveTextContent('1');
            expect(react_1.screen.getByTestId('local-files-count')).toHaveTextContent('0');
        });
        it('should transform onlineDocument datasource correctly', () => {
            // Arrange
            const mockData = createMockExecutionLogResponse({
                datasource_type: pipeline_1.DatasourceType.onlineDocument,
                datasource_info: {
                    workspace_id: 'workspace-1',
                    page: { page_id: 'page-1', page_name: 'Notion Page' },
                },
            });
            mockUsePipelineExecutionLog.mockReturnValue({
                data: mockData,
                isFetching: false,
                isError: false,
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('online-documents-count')).toHaveTextContent('1');
        });
        it('should transform onlineDrive datasource correctly', () => {
            // Arrange
            const mockData = createMockExecutionLogResponse({
                datasource_type: pipeline_1.DatasourceType.onlineDrive,
                datasource_info: { id: 'drive-1', type: 'doc', name: 'Google Doc', size: 1024 },
            });
            mockUsePipelineExecutionLog.mockReturnValue({
                data: mockData,
                isFetching: false,
                isError: false,
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('online-drive-files-count')).toHaveTextContent('1');
        });
    });
    // ==================== User Interactions - Process ====================
    describe('User Interactions - Process', () => {
        it('should trigger form submit when process button is clicked', async () => {
            // Arrange
            mockMutateAsync.mockResolvedValue({});
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Find the "Save and Process" button (from real ProcessDocuments > Actions)
            const processButton = react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' });
            react_1.fireEvent.click(processButton);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockMutateAsync).toHaveBeenCalled();
            });
        });
        it('should call handleProcess with is_preview=false', async () => {
            // Arrange
            mockMutateAsync.mockResolvedValue({});
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                    is_preview: false,
                    pipeline_id: mockPipelineId,
                    original_document_id: 'document-456',
                }), expect.any(Object));
            });
        });
        it('should navigate to documents list after successful process', async () => {
            // Arrange
            mockMutateAsync.mockImplementation((_request, options) => {
                options?.onSuccess?.();
                return Promise.resolve({});
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockPush).toHaveBeenCalledWith('/datasets/dataset-123/documents');
            });
        });
        it('should invalidate document cache after successful process', async () => {
            // Arrange
            mockMutateAsync.mockImplementation((_request, options) => {
                options?.onSuccess?.();
                return Promise.resolve({});
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockInvalidDocumentList).toHaveBeenCalled();
                expect(mockInvalidDocumentDetail).toHaveBeenCalled();
            });
        });
    });
    // ==================== User Interactions - Preview ====================
    describe('User Interactions - Preview', () => {
        it('should trigger preview when preview button is clicked', async () => {
            // Arrange
            mockMutateAsync.mockResolvedValue({ data: { outputs: {} } });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('preview-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockMutateAsync).toHaveBeenCalled();
            });
        });
        it('should call handlePreviewChunks with is_preview=true', async () => {
            // Arrange
            mockMutateAsync.mockResolvedValue({ data: { outputs: {} } });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('preview-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                    is_preview: true,
                    pipeline_id: mockPipelineId,
                }), expect.any(Object));
            });
        });
        it('should update estimateData on successful preview', async () => {
            // Arrange
            const mockOutputs = { chunks: [], total_tokens: 50 };
            mockMutateAsync.mockImplementation((_req, opts) => {
                opts?.onSuccess?.({ data: { outputs: mockOutputs } });
                return Promise.resolve({ data: { outputs: mockOutputs } });
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('preview-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('has-estimate-data')).toHaveTextContent('true');
            });
        });
    });
    // ==================== API Integration ====================
    describe('API Integration', () => {
        it('should pass correct parameters for preview', async () => {
            // Arrange
            const mockData = createMockExecutionLogResponse({
                datasource_type: pipeline_1.DatasourceType.localFile,
                datasource_node_id: 'node-xyz',
                datasource_info: { related_id: 'file-1', name: 'test.pdf', extension: 'pdf' },
                input_data: {},
            });
            mockUsePipelineExecutionLog.mockReturnValue({
                data: mockData,
                isFetching: false,
                isError: false,
            });
            mockMutateAsync.mockResolvedValue({ data: { outputs: {} } });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('preview-btn'));
            // Assert - inputs come from initialData which is transformed by useInitialData
            // Since usePublishedPipelineProcessingParams returns empty variables, inputs is {}
            await (0, react_1.waitFor)(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith({
                    pipeline_id: mockPipelineId,
                    inputs: {},
                    start_node_id: 'node-xyz',
                    datasource_type: pipeline_1.DatasourceType.localFile,
                    datasource_info_list: [{ related_id: 'file-1', name: 'test.pdf', extension: 'pdf' }],
                    is_preview: true,
                }, expect.any(Object));
            });
        });
    });
    // ==================== Edge Cases ====================
    describe('Edge Cases', () => {
        it.each([
            [pipeline_1.DatasourceType.localFile, 'local-files-count', '1'],
            [pipeline_1.DatasourceType.websiteCrawl, 'website-pages-count', '1'],
            [pipeline_1.DatasourceType.onlineDocument, 'online-documents-count', '1'],
            [pipeline_1.DatasourceType.onlineDrive, 'online-drive-files-count', '1'],
        ])('should handle %s datasource type correctly', (datasourceType, testId, expectedCount) => {
            // Arrange
            const datasourceInfoMap = {
                [pipeline_1.DatasourceType.localFile]: { related_id: 'f1', name: 'file.pdf', extension: 'pdf' },
                [pipeline_1.DatasourceType.websiteCrawl]: { content: 'c', description: 'd', source_url: 'u', title: 't' },
                [pipeline_1.DatasourceType.onlineDocument]: { workspace_id: 'w1', page: { page_id: 'p1' } },
                [pipeline_1.DatasourceType.onlineDrive]: { id: 'd1', type: 'doc', name: 'n', size: 100 },
            };
            const mockData = createMockExecutionLogResponse({
                datasource_type: datasourceType,
                datasource_info: datasourceInfoMap[datasourceType],
            });
            mockUsePipelineExecutionLog.mockReturnValue({
                data: mockData,
                isFetching: false,
                isError: false,
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId(testId)).toHaveTextContent(expectedCount);
        });
        it('should show loading state during initial fetch', () => {
            // Arrange
            mockUsePipelineExecutionLog.mockReturnValue({
                data: undefined,
                isFetching: true,
                isError: false,
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByTestId('process-form')).not.toBeInTheDocument();
        });
        it('should show error state when API fails', () => {
            // Arrange
            mockUsePipelineExecutionLog.mockReturnValue({
                data: undefined,
                isFetching: false,
                isError: true,
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByTestId('process-form')).not.toBeInTheDocument();
        });
    });
    // ==================== State Management ====================
    describe('State Management', () => {
        it('should initialize with undefined estimateData', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('has-estimate-data')).toHaveTextContent('false');
        });
        it('should update estimateData after successful preview', async () => {
            // Arrange
            const mockEstimateData = { chunks: [], total_tokens: 50 };
            mockMutateAsync.mockImplementation((_req, opts) => {
                opts?.onSuccess?.({ data: { outputs: mockEstimateData } });
                return Promise.resolve({ data: { outputs: mockEstimateData } });
            });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('preview-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('has-estimate-data')).toHaveTextContent('true');
            });
        });
        it('should set isPreview ref to false when process is clicked', async () => {
            // Arrange
            mockMutateAsync.mockResolvedValue({});
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' }));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({ is_preview: false }), expect.any(Object));
            });
        });
        it('should set isPreview ref to true when preview is clicked', async () => {
            // Arrange
            mockMutateAsync.mockResolvedValue({ data: { outputs: {} } });
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('preview-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({ is_preview: true }), expect.any(Object));
            });
        });
        it('should pass isPending=true to ChunkPreview when preview is pending', async () => {
            // Arrange - Start with isPending=false so buttons are enabled
            let isPendingState = false;
            mockUseRunPublishedPipeline.mockImplementation(() => ({
                mutateAsync: mockMutateAsync,
                isIdle: !isPendingState,
                isPending: isPendingState,
            }));
            // A promise that never resolves to keep the pending state
            const pendingPromise = new Promise(() => undefined);
            // When mutateAsync is called, set isPending to true and trigger rerender
            mockMutateAsync.mockImplementation(() => {
                isPendingState = true;
                return pendingPromise;
            });
            const props = createDefaultProps();
            const { rerender } = renderWithProviders(<index_1.default {...props}/>);
            // Act - Click preview button (sets isPreview.current = true and calls mutateAsync)
            react_1.fireEvent.click(react_1.screen.getByTestId('preview-btn'));
            // Update mock and rerender to reflect isPending=true state
            mockUseRunPublishedPipeline.mockReturnValue({
                mutateAsync: mockMutateAsync,
                isIdle: false,
                isPending: true,
            });
            rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
          <index_1.default {...props}/>
        </react_query_1.QueryClientProvider>);
            // Assert - isPending && isPreview.current should both be true now
            expect(react_1.screen.getByTestId('is-pending')).toHaveTextContent('true');
        });
        it('should pass isPending=false to ChunkPreview when process is pending (not preview)', async () => {
            // Arrange - isPending is true but isPreview.current is false
            mockUseRunPublishedPipeline.mockReturnValue({
                mutateAsync: mockMutateAsync,
                isIdle: false,
                isPending: true,
            });
            mockMutateAsync.mockReturnValue(new Promise(() => undefined));
            const props = createDefaultProps();
            // Act
            renderWithProviders(<index_1.default {...props}/>);
            // Click process (not preview) to set isPreview.current = false
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'datasetPipeline.operations.saveAndProcess' }));
            // Assert - isPending && isPreview.current should be false (true && false = false)
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('is-pending')).toHaveTextContent('false');
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdURBQXdFO0FBQ3hFLGtEQUEyRTtBQUMzRSxnREFBa0Q7QUFDbEQsbUNBQXNDO0FBRXRDLHNCQUFzQjtBQUN0QixNQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDeEIsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ3hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNoQyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUNoQixJQUFJLEVBQUUsUUFBUTtRQUNkLElBQUksRUFBRSxRQUFRO0tBQ2YsQ0FBQztDQUNILENBQUMsQ0FBQyxDQUFBO0FBRUgsOEJBQThCO0FBQzlCLE1BQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQTtBQUNyQyxFQUFFLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekMsbUNBQW1DLEVBQUUsQ0FBQyxRQUFvRixFQUFFLEVBQUUsQ0FDNUgsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQztDQUNqRixDQUFDLENBQUMsQ0FBQTtBQUVILHNDQUFzQztBQUN0QyxNQUFNLDJCQUEyQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUMzQyxNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDL0IsTUFBTSwyQkFBMkIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDM0MsRUFBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLHVCQUF1QixF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dXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUGlwZWxpbmVFeGVjdXRpb25Mb2dSZXNwb25zZSB9IGZyb20gJ0AvbW9kZWxzL3BpcGVsaW5lJ1xuaW1wb3J0IHsgUXVlcnlDbGllbnQsIFF1ZXJ5Q2xpZW50UHJvdmlkZXIgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IERhdGFzb3VyY2VUeXBlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgUGlwZWxpbmVTZXR0aW5ncyBmcm9tICcuL2luZGV4J1xuXG4vLyBNb2NrIE5leHQuanMgcm91dGVyXG5jb25zdCBtb2NrUHVzaCA9IHZpLmZuKClcbmNvbnN0IG1vY2tCYWNrID0gdmkuZm4oKVxudmkubW9jaygnbmV4dC9uYXZpZ2F0aW9uJywgKCkgPT4gKHtcbiAgdXNlUm91dGVyOiAoKSA9PiAoe1xuICAgIHB1c2g6IG1vY2tQdXNoLFxuICAgIGJhY2s6IG1vY2tCYWNrLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIGRhdGFzZXQgZGV0YWlsIGNvbnRleHRcbmNvbnN0IG1vY2tQaXBlbGluZUlkID0gJ3BpcGVsaW5lLTEyMydcbnZpLm1vY2soJ0AvY29udGV4dC9kYXRhc2V0LWRldGFpbCcsICgpID0+ICh7XG4gIHVzZURhdGFzZXREZXRhaWxDb250ZXh0V2l0aFNlbGVjdG9yOiAoc2VsZWN0b3I6IChzdGF0ZTogeyBkYXRhc2V0OiB7IHBpcGVsaW5lX2lkOiBzdHJpbmcsIGRvY19mb3JtOiBzdHJpbmcgfSB9KSA9PiB1bmtub3duKSA9PlxuICAgIHNlbGVjdG9yKHsgZGF0YXNldDogeyBwaXBlbGluZV9pZDogbW9ja1BpcGVsaW5lSWQsIGRvY19mb3JtOiAndGV4dF9tb2RlbCcgfSB9KSxcbn0pKVxuXG4vLyBNb2NrIEFQSSBob29rcyBmb3IgUGlwZWxpbmVTZXR0aW5nc1xuY29uc3QgbW9ja1VzZVBpcGVsaW5lRXhlY3V0aW9uTG9nID0gdmkuZm4oKVxuY29uc3QgbW9ja011dGF0ZUFzeW5jID0gdmkuZm4oKVxuY29uc3QgbW9ja1VzZVJ1blB1Ymxpc2hlZFBpcGVsaW5lID0gdmkuZm4oKVxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1waXBlbGluZScsICgpID0+ICh7XG4gIHVzZVBpcGVsaW5lRXhlY3V0aW9uTG9nOiAocGFyYW1zOiB7IGRhdGFzZXRfaWQ6IHN0cmluZywgZG9jdW1lbnRfaWQ6IHN0cmluZyB9KSA9PiBtb2NrVXNlUGlwZWxpbmVFeGVjdXRpb25Mb2cocGFyYW1zKSxcbiAgdXNlUnVuUHVibGlzaGVkUGlwZWxpbmU6ICgpID0+IG1vY2tVc2VSdW5QdWJsaXNoZWRQaXBlbGluZSgpLFxuICAvLyBGb3IgUHJvY2Vzc0RvY3VtZW50cyBjb21wb25lbnRcbiAgdXNlUHVibGlzaGVkUGlwZWxpbmVQcm9jZXNzaW5nUGFyYW1zOiAoKSA9PiAoe1xuICAgIGRhdGE6IHsgdmFyaWFibGVzOiBbXSB9LFxuICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIGRvY3VtZW50IGludmFsaWRhdGlvbiBob29rc1xuY29uc3QgbW9ja0ludmFsaWREb2N1bWVudExpc3QgPSB2aS5mbigpXG5jb25zdCBtb2NrSW52YWxpZERvY3VtZW50RGV0YWlsID0gdmkuZm4oKVxudmkubW9jaygnQC9zZXJ2aWNlL2tub3dsZWRnZS91c2UtZG9jdW1lbnQnLCAoKSA9PiAoe1xuICB1c2VJbnZhbGlkRG9jdW1lbnRMaXN0OiAoKSA9PiBtb2NrSW52YWxpZERvY3VtZW50TGlzdCxcbiAgdXNlSW52YWxpZERvY3VtZW50RGV0YWlsOiAoKSA9PiBtb2NrSW52YWxpZERvY3VtZW50RGV0YWlsLFxufSkpXG5cbi8vIE1vY2sgRm9ybSBjb21wb25lbnQgaW4gUHJvY2Vzc0RvY3VtZW50cyAtIGludGVybmFsIGRlcGVuZGVuY2llcyBhcmUgdG9vIGNvbXBsZXhcbnZpLm1vY2soJy4uLy4uLy4uL2NyZWF0ZS1mcm9tLXBpcGVsaW5lL3Byb2Nlc3MtZG9jdW1lbnRzL2Zvcm0nLCAoKSA9PiAoe1xuICBkZWZhdWx0OiBmdW5jdGlvbiBNb2NrRm9ybSh7XG4gICAgcmVmLFxuICAgIGluaXRpYWxEYXRhLFxuICAgIGNvbmZpZ3VyYXRpb25zLFxuICAgIG9uU3VibWl0LFxuICAgIG9uUHJldmlldyxcbiAgICBpc1J1bm5pbmcsXG4gIH06IHtcbiAgICByZWY6IFJlYWN0LlJlZk9iamVjdDx7IHN1Ym1pdDogKCkgPT4gdm9pZCB9PlxuICAgIGluaXRpYWxEYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICAgIGNvbmZpZ3VyYXRpb25zOiBBcnJheTx7IHZhcmlhYmxlOiBzdHJpbmcsIGxhYmVsOiBzdHJpbmcsIHR5cGU6IHN0cmluZyB9PlxuICAgIHNjaGVtYTogdW5rbm93blxuICAgIG9uU3VibWl0OiAoZGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pID0+IHZvaWRcbiAgICBvblByZXZpZXc6ICgpID0+IHZvaWRcbiAgICBpc1J1bm5pbmc6IGJvb2xlYW5cbiAgfSkge1xuICAgIGlmIChyZWYgJiYgdHlwZW9mIHJlZiA9PT0gJ29iamVjdCcgJiYgJ2N1cnJlbnQnIGluIHJlZikge1xuICAgICAgKHJlZiBhcyBSZWFjdC5NdXRhYmxlUmVmT2JqZWN0PHsgc3VibWl0OiAoKSA9PiB2b2lkIH0+KS5jdXJyZW50ID0ge1xuICAgICAgICBzdWJtaXQ6ICgpID0+IG9uU3VibWl0KGluaXRpYWxEYXRhKSxcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxmb3JtXG4gICAgICAgIGRhdGEtdGVzdGlkPVwicHJvY2Vzcy1mb3JtXCJcbiAgICAgICAgb25TdWJtaXQ9eyhlKSA9PiB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgICAgb25TdWJtaXQoaW5pdGlhbERhdGEpXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIHtjb25maWd1cmF0aW9ucy5tYXAoKGNvbmZpZywgaW5kZXgpID0+IChcbiAgICAgICAgICA8ZGl2IGtleT17aW5kZXh9IGRhdGEtdGVzdGlkPXtgZmllbGQtJHtjb25maWcudmFyaWFibGV9YH0+XG4gICAgICAgICAgICA8bGFiZWw+e2NvbmZpZy5sYWJlbH08L2xhYmVsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApKX1cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10ZXN0aWQ9XCJwcmV2aWV3LWJ0blwiIG9uQ2xpY2s9e29uUHJldmlld30gZGlzYWJsZWQ9e2lzUnVubmluZ30+XG4gICAgICAgICAgUHJldmlld1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZm9ybT5cbiAgICApXG4gIH0sXG59KSlcblxuLy8gTW9jayBDaHVua1ByZXZpZXcgLSBoYXMgY29tcGxleCBpbnRlcm5hbCBzdGF0ZSBhbmQgbWFueSBkZXBlbmRlbmNpZXNcbnZpLm1vY2soJy4uLy4uLy4uL2NyZWF0ZS1mcm9tLXBpcGVsaW5lL3ByZXZpZXcvY2h1bmstcHJldmlldycsICgpID0+ICh7XG4gIGRlZmF1bHQ6IGZ1bmN0aW9uIE1vY2tDaHVua1ByZXZpZXcoe1xuICAgIGRhdGFTb3VyY2VUeXBlLFxuICAgIGxvY2FsRmlsZXMsXG4gICAgb25saW5lRG9jdW1lbnRzLFxuICAgIHdlYnNpdGVQYWdlcyxcbiAgICBvbmxpbmVEcml2ZUZpbGVzLFxuICAgIGlzSWRsZSxcbiAgICBpc1BlbmRpbmcsXG4gICAgZXN0aW1hdGVEYXRhLFxuICB9OiB7XG4gICAgZGF0YVNvdXJjZVR5cGU6IHN0cmluZ1xuICAgIGxvY2FsRmlsZXM6IHVua25vd25bXVxuICAgIG9ubGluZURvY3VtZW50czogdW5rbm93bltdXG4gICAgd2Vic2l0ZVBhZ2VzOiB1bmtub3duW11cbiAgICBvbmxpbmVEcml2ZUZpbGVzOiB1bmtub3duW11cbiAgICBpc0lkbGU6IGJvb2xlYW5cbiAgICBpc1BlbmRpbmc6IGJvb2xlYW5cbiAgICBlc3RpbWF0ZURhdGE6IHVua25vd25cbiAgfSkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY2h1bmstcHJldmlld1wiPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImRhdGFzb3VyY2UtdHlwZVwiPntkYXRhU291cmNlVHlwZX08L3NwYW4+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwibG9jYWwtZmlsZXMtY291bnRcIj57bG9jYWxGaWxlcy5sZW5ndGh9PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cIm9ubGluZS1kb2N1bWVudHMtY291bnRcIj57b25saW5lRG9jdW1lbnRzLmxlbmd0aH08L3NwYW4+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwid2Vic2l0ZS1wYWdlcy1jb3VudFwiPnt3ZWJzaXRlUGFnZXMubGVuZ3RofTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJvbmxpbmUtZHJpdmUtZmlsZXMtY291bnRcIj57b25saW5lRHJpdmVGaWxlcy5sZW5ndGh9PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImlzLWlkbGVcIj57U3RyaW5nKGlzSWRsZSl9PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImlzLXBlbmRpbmdcIj57U3RyaW5nKGlzUGVuZGluZyl9PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImhhcy1lc3RpbWF0ZS1kYXRhXCI+e1N0cmluZyghIWVzdGltYXRlRGF0YSl9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxufSkpXG5cbi8vIFRlc3QgdXRpbGl0aWVzXG5jb25zdCBjcmVhdGVRdWVyeUNsaWVudCA9ICgpID0+XG4gIG5ldyBRdWVyeUNsaWVudCh7XG4gICAgZGVmYXVsdE9wdGlvbnM6IHtcbiAgICAgIHF1ZXJpZXM6IHsgcmV0cnk6IGZhbHNlIH0sXG4gICAgICBtdXRhdGlvbnM6IHsgcmV0cnk6IGZhbHNlIH0sXG4gICAgfSxcbiAgfSlcblxuY29uc3QgcmVuZGVyV2l0aFByb3ZpZGVycyA9ICh1aTogUmVhY3QuUmVhY3RFbGVtZW50KSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gY3JlYXRlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gcmVuZGVyKFxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAge3VpfVxuICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gIClcbn1cblxuLy8gRmFjdG9yeSBmdW5jdGlvbnMgZm9yIHRlc3QgZGF0YVxuY29uc3QgY3JlYXRlTW9ja0V4ZWN1dGlvbkxvZ1Jlc3BvbnNlID0gKFxuICBvdmVycmlkZXM6IFBhcnRpYWw8UGlwZWxpbmVFeGVjdXRpb25Mb2dSZXNwb25zZT4gPSB7fSxcbik6IFBpcGVsaW5lRXhlY3V0aW9uTG9nUmVzcG9uc2UgPT4gKHtcbiAgZGF0YXNvdXJjZV90eXBlOiBEYXRhc291cmNlVHlwZS5sb2NhbEZpbGUsXG4gIGlucHV0X2RhdGE6IHsgY2h1bmtfc2l6ZTogJzEwMCcgfSxcbiAgZGF0YXNvdXJjZV9ub2RlX2lkOiAnZGF0YXNvdXJjZS1ub2RlLTEnLFxuICBkYXRhc291cmNlX2luZm86IHtcbiAgICByZWxhdGVkX2lkOiAnZmlsZS0xJyxcbiAgICBuYW1lOiAndGVzdC1maWxlLnBkZicsXG4gICAgZXh0ZW5zaW9uOiAncGRmJyxcbiAgfSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlRGVmYXVsdFByb3BzID0gKCkgPT4gKHtcbiAgZGF0YXNldElkOiAnZGF0YXNldC0xMjMnLFxuICBkb2N1bWVudElkOiAnZG9jdW1lbnQtNDU2Jyxcbn0pXG5cbmRlc2NyaWJlKCdQaXBlbGluZVNldHRpbmdzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrUHVzaC5tb2NrQ2xlYXIoKVxuICAgIG1vY2tCYWNrLm1vY2tDbGVhcigpXG4gICAgbW9ja011dGF0ZUFzeW5jLm1vY2tDbGVhcigpXG4gICAgbW9ja0ludmFsaWREb2N1bWVudExpc3QubW9ja0NsZWFyKClcbiAgICBtb2NrSW52YWxpZERvY3VtZW50RGV0YWlsLm1vY2tDbGVhcigpXG5cbiAgICAvLyBEZWZhdWx0OiBzdWNjZXNzZnVsIGRhdGEgZmV0Y2hcbiAgICBtb2NrVXNlUGlwZWxpbmVFeGVjdXRpb25Mb2cubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGRhdGE6IGNyZWF0ZU1vY2tFeGVjdXRpb25Mb2dSZXNwb25zZSgpLFxuICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICBpc0Vycm9yOiBmYWxzZSxcbiAgICB9KVxuXG4gICAgLy8gRGVmYXVsdDogdXNlUnVuUHVibGlzaGVkUGlwZWxpbmUgbW9ja1xuICAgIG1vY2tVc2VSdW5QdWJsaXNoZWRQaXBlbGluZS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgbXV0YXRlQXN5bmM6IG1vY2tNdXRhdGVBc3luYyxcbiAgICAgIGlzSWRsZTogdHJ1ZSxcbiAgICAgIGlzUGVuZGluZzogZmFsc2UsXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBSZW5kZXJpbmcgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGVzdCBiYXNpYyByZW5kZXJpbmcgd2l0aCByZWFsIGNvbXBvbmVudHNcbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nIHdoZW4gZGF0YSBpcyBsb2FkZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UGlwZWxpbmVTZXR0aW5ncyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBSZWFsIExlZnRIZWFkZXIgc2hvdWxkIHJlbmRlciB3aXRoIGNvcnJlY3QgY29udGVudFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5kb2N1bWVudFNldHRpbmdzLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdkYXRhc2V0UGlwZWxpbmUuYWRkRG9jdW1lbnRzLnN0ZXBzLnByb2Nlc3NEb2N1bWVudHMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gUmVhbCBQcm9jZXNzRG9jdW1lbnRzIHNob3VsZCByZW5kZXJcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3Byb2Nlc3MtZm9ybScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBDaHVua1ByZXZpZXcgc2hvdWxkIHJlbmRlclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2h1bmstcHJldmlldycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIExvYWRpbmcgY29tcG9uZW50IHdoZW4gZmV0Y2hpbmcgZGF0YScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VQaXBlbGluZUV4ZWN1dGlvbkxvZy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICAgIGlzRmV0Y2hpbmc6IHRydWUsXG4gICAgICAgIGlzRXJyb3I6IGZhbHNlLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQaXBlbGluZVNldHRpbmdzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIExvYWRpbmcgY29tcG9uZW50IHNob3VsZCBiZSByZW5kZXJlZCwgbm90IG1haW4gY29udGVudFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmRvY3VtZW50U2V0dGluZ3MudGl0bGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncHJvY2Vzcy1mb3JtJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEFwcFVuYXZhaWxhYmxlIHdoZW4gdGhlcmUgaXMgYW4gZXJyb3InLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVXNlUGlwZWxpbmVFeGVjdXRpb25Mb2cubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogdW5kZWZpbmVkLFxuICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgaXNFcnJvcjogdHJ1ZSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UGlwZWxpbmVTZXR0aW5ncyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBBcHBVbmF2YWlsYWJsZSBzaG91bGQgYmUgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ2RhdGFzZXRQaXBlbGluZS5kb2N1bWVudFNldHRpbmdzLnRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvbnRhaW5lciB3aXRoIGNvcnJlY3QgQ1NTIGNsYXNzZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcldpdGhQcm92aWRlcnMoPFBpcGVsaW5lU2V0dGluZ3Mgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBtYWluQ29udGFpbmVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdChtYWluQ29udGFpbmVyKS50b0hhdmVDbGFzcygncmVsYXRpdmUnLCAnZmxleCcsICdtaW4tdy1bMTAyNHB4XScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBMZWZ0SGVhZGVyIEludGVncmF0aW9uID09PT09PT09PT09PT09PT09PT09XG4gIC8vIFRlc3QgcmVhbCBMZWZ0SGVhZGVyIGNvbXBvbmVudCBiZWhhdmlvclxuICBkZXNjcmliZSgnTGVmdEhlYWRlciBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBMZWZ0SGVhZGVyIHdpdGggdGl0bGUgcHJvcCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQaXBlbGluZVNldHRpbmdzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIExlZnRIZWFkZXIgZGlzcGxheXMgdGhlIHRpdGxlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnZGF0YXNldFBpcGVsaW5lLmRvY3VtZW50U2V0dGluZ3MudGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBiYWNrIGJ1dHRvbiBpbiBMZWZ0SGVhZGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFBpcGVsaW5lU2V0dGluZ3Mgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gQmFjayBidXR0b24gc2hvdWxkIGV4aXN0IHdpdGggcHJvcGVyIGFyaWEtbGFiZWxcbiAgICAgIGNvbnN0IGJhY2tCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLmJhY2snIH0pXG4gICAgICBleHBlY3QoYmFja0J1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgcm91dGVyLmJhY2sgd2hlbiBiYWNrIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFBpcGVsaW5lU2V0dGluZ3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGNvbnN0IGJhY2tCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLmJhY2snIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYmFja0J1dHRvbilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0JhY2spLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gUHJvcHMgVGVzdGluZyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIGRhdGFzZXRJZCBhbmQgZG9jdW1lbnRJZCB0byB1c2VQaXBlbGluZUV4ZWN1dGlvbkxvZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0geyBkYXRhc2V0SWQ6ICdjdXN0b20tZGF0YXNldCcsIGRvY3VtZW50SWQ6ICdjdXN0b20tZG9jdW1lbnQnIH1cblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQaXBlbGluZVNldHRpbmdzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tVc2VQaXBlbGluZUV4ZWN1dGlvbkxvZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBkYXRhc2V0X2lkOiAnY3VzdG9tLWRhdGFzZXQnLFxuICAgICAgICBkb2N1bWVudF9pZDogJ2N1c3RvbS1kb2N1bWVudCcsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gTWVtb2l6YXRpb24gLSBEYXRhIFRyYW5zZm9ybWF0aW9uID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbiAtIERhdGEgVHJhbnNmb3JtYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0cmFuc2Zvcm0gbG9jYWxGaWxlIGRhdGFzb3VyY2UgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0RhdGEgPSBjcmVhdGVNb2NrRXhlY3V0aW9uTG9nUmVzcG9uc2Uoe1xuICAgICAgICBkYXRhc291cmNlX3R5cGU6IERhdGFzb3VyY2VUeXBlLmxvY2FsRmlsZSxcbiAgICAgICAgZGF0YXNvdXJjZV9pbmZvOiB7XG4gICAgICAgICAgcmVsYXRlZF9pZDogJ2ZpbGUtMTIzJyxcbiAgICAgICAgICBuYW1lOiAnZG9jdW1lbnQucGRmJyxcbiAgICAgICAgICBleHRlbnNpb246ICdwZGYnLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQaXBlbGluZUV4ZWN1dGlvbkxvZy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiBtb2NrRGF0YSxcbiAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICAgIGlzRXJyb3I6IGZhbHNlLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQaXBlbGluZVNldHRpbmdzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9jYWwtZmlsZXMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzEnKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZGF0YXNvdXJjZS10eXBlJykpLnRvSGF2ZVRleHRDb250ZW50KERhdGFzb3VyY2VUeXBlLmxvY2FsRmlsZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmFuc2Zvcm0gd2Vic2l0ZUNyYXdsIGRhdGFzb3VyY2UgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0RhdGEgPSBjcmVhdGVNb2NrRXhlY3V0aW9uTG9nUmVzcG9uc2Uoe1xuICAgICAgICBkYXRhc291cmNlX3R5cGU6IERhdGFzb3VyY2VUeXBlLndlYnNpdGVDcmF3bCxcbiAgICAgICAgZGF0YXNvdXJjZV9pbmZvOiB7XG4gICAgICAgICAgY29udGVudDogJ1BhZ2UgY29udGVudCcsXG4gICAgICAgICAgZGVzY3JpcHRpb246ICdQYWdlIGRlc2NyaXB0aW9uJyxcbiAgICAgICAgICBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdlJyxcbiAgICAgICAgICB0aXRsZTogJ1BhZ2UgVGl0bGUnLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQaXBlbGluZUV4ZWN1dGlvbkxvZy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiBtb2NrRGF0YSxcbiAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICAgIGlzRXJyb3I6IGZhbHNlLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQaXBlbGluZVNldHRpbmdzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnd2Vic2l0ZS1wYWdlcy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2NhbC1maWxlcy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJhbnNmb3JtIG9ubGluZURvY3VtZW50IGRhdGFzb3VyY2UgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0RhdGEgPSBjcmVhdGVNb2NrRXhlY3V0aW9uTG9nUmVzcG9uc2Uoe1xuICAgICAgICBkYXRhc291cmNlX3R5cGU6IERhdGFzb3VyY2VUeXBlLm9ubGluZURvY3VtZW50LFxuICAgICAgICBkYXRhc291cmNlX2luZm86IHtcbiAgICAgICAgICB3b3Jrc3BhY2VfaWQ6ICd3b3Jrc3BhY2UtMScsXG4gICAgICAgICAgcGFnZTogeyBwYWdlX2lkOiAncGFnZS0xJywgcGFnZV9uYW1lOiAnTm90aW9uIFBhZ2UnIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBpcGVsaW5lRXhlY3V0aW9uTG9nLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IG1vY2tEYXRhLFxuICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgaXNFcnJvcjogZmFsc2UsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFBpcGVsaW5lU2V0dGluZ3Mgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdvbmxpbmUtZG9jdW1lbnRzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcxJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmFuc2Zvcm0gb25saW5lRHJpdmUgZGF0YXNvdXJjZSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrRGF0YSA9IGNyZWF0ZU1vY2tFeGVjdXRpb25Mb2dSZXNwb25zZSh7XG4gICAgICAgIGRhdGFzb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUub25saW5lRHJpdmUsXG4gICAgICAgIGRhdGFzb3VyY2VfaW5mbzogeyBpZDogJ2RyaXZlLTEnLCB0eXBlOiAnZG9jJywgbmFtZTogJ0dvb2dsZSBEb2MnLCBzaXplOiAxMDI0IH0sXG4gICAgICB9KVxuICAgICAgbW9ja1VzZVBpcGVsaW5lRXhlY3V0aW9uTG9nLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IG1vY2tEYXRhLFxuICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbiAgICAgICAgaXNFcnJvcjogZmFsc2UsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFBpcGVsaW5lU2V0dGluZ3Mgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdvbmxpbmUtZHJpdmUtZmlsZXMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzEnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gVXNlciBJbnRlcmFjdGlvbnMgLSBQcm9jZXNzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucyAtIFByb2Nlc3MnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIGZvcm0gc3VibWl0IHdoZW4gcHJvY2VzcyBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tNdXRhdGVBc3luYy5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQaXBlbGluZVNldHRpbmdzIHsuLi5wcm9wc30gLz4pXG4gICAgICAvLyBGaW5kIHRoZSBcIlNhdmUgYW5kIFByb2Nlc3NcIiBidXR0b24gKGZyb20gcmVhbCBQcm9jZXNzRG9jdW1lbnRzID4gQWN0aW9ucylcbiAgICAgIGNvbnN0IHByb2Nlc3NCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5zYXZlQW5kUHJvY2VzcycgfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhwcm9jZXNzQnV0dG9uKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja011dGF0ZUFzeW5jKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVQcm9jZXNzIHdpdGggaXNfcHJldmlldz1mYWxzZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tNdXRhdGVBc3luYy5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQaXBlbGluZVNldHRpbmdzIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuc2F2ZUFuZFByb2Nlc3MnIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja011dGF0ZUFzeW5jKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBpc19wcmV2aWV3OiBmYWxzZSxcbiAgICAgICAgICAgIHBpcGVsaW5lX2lkOiBtb2NrUGlwZWxpbmVJZCxcbiAgICAgICAgICAgIG9yaWdpbmFsX2RvY3VtZW50X2lkOiAnZG9jdW1lbnQtNDU2JyxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbmF2aWdhdGUgdG8gZG9jdW1lbnRzIGxpc3QgYWZ0ZXIgc3VjY2Vzc2Z1bCBwcm9jZXNzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja011dGF0ZUFzeW5jLm1vY2tJbXBsZW1lbnRhdGlvbigoX3JlcXVlc3QsIG9wdGlvbnMpID0+IHtcbiAgICAgICAgb3B0aW9ucz8ub25TdWNjZXNzPy4oKVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHt9KVxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQaXBlbGluZVNldHRpbmdzIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuc2F2ZUFuZFByb2Nlc3MnIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1B1c2gpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvZGF0YXNldHMvZGF0YXNldC0xMjMvZG9jdW1lbnRzJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaW52YWxpZGF0ZSBkb2N1bWVudCBjYWNoZSBhZnRlciBzdWNjZXNzZnVsIHByb2Nlc3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja0ltcGxlbWVudGF0aW9uKChfcmVxdWVzdCwgb3B0aW9ucykgPT4ge1xuICAgICAgICBvcHRpb25zPy5vblN1Y2Nlc3M/LigpXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFBpcGVsaW5lU2V0dGluZ3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdkYXRhc2V0UGlwZWxpbmUub3BlcmF0aW9ucy5zYXZlQW5kUHJvY2VzcycgfSkpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSW52YWxpZERvY3VtZW50TGlzdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChtb2NrSW52YWxpZERvY3VtZW50RGV0YWlsKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBVc2VyIEludGVyYWN0aW9ucyAtIFByZXZpZXcgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zIC0gUHJldmlldycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRyaWdnZXIgcHJldmlldyB3aGVuIHByZXZpZXcgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja1Jlc29sdmVkVmFsdWUoeyBkYXRhOiB7IG91dHB1dHM6IHt9IH0gfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQaXBlbGluZVNldHRpbmdzIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwcmV2aWV3LWJ0bicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja011dGF0ZUFzeW5jKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVQcmV2aWV3Q2h1bmtzIHdpdGggaXNfcHJldmlldz10cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja011dGF0ZUFzeW5jLm1vY2tSZXNvbHZlZFZhbHVlKHsgZGF0YTogeyBvdXRwdXRzOiB7fSB9IH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UGlwZWxpbmVTZXR0aW5ncyB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncHJldmlldy1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tNdXRhdGVBc3luYykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgaXNfcHJldmlldzogdHJ1ZSxcbiAgICAgICAgICAgIHBpcGVsaW5lX2lkOiBtb2NrUGlwZWxpbmVJZCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGVzdGltYXRlRGF0YSBvbiBzdWNjZXNzZnVsIHByZXZpZXcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT3V0cHV0cyA9IHsgY2h1bmtzOiBbXSwgdG90YWxfdG9rZW5zOiA1MCB9XG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja0ltcGxlbWVudGF0aW9uKChfcmVxLCBvcHRzKSA9PiB7XG4gICAgICAgIG9wdHM/Lm9uU3VjY2Vzcz8uKHsgZGF0YTogeyBvdXRwdXRzOiBtb2NrT3V0cHV0cyB9IH0pXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoeyBkYXRhOiB7IG91dHB1dHM6IG1vY2tPdXRwdXRzIH0gfSlcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UGlwZWxpbmVTZXR0aW5ncyB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncHJldmlldy1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaGFzLWVzdGltYXRlLWRhdGEnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IEFQSSBJbnRlZ3JhdGlvbiA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQVBJIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IHBhcmFtZXRlcnMgZm9yIHByZXZpZXcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrRGF0YSA9IGNyZWF0ZU1vY2tFeGVjdXRpb25Mb2dSZXNwb25zZSh7XG4gICAgICAgIGRhdGFzb3VyY2VfdHlwZTogRGF0YXNvdXJjZVR5cGUubG9jYWxGaWxlLFxuICAgICAgICBkYXRhc291cmNlX25vZGVfaWQ6ICdub2RlLXh5eicsXG4gICAgICAgIGRhdGFzb3VyY2VfaW5mbzogeyByZWxhdGVkX2lkOiAnZmlsZS0xJywgbmFtZTogJ3Rlc3QucGRmJywgZXh0ZW5zaW9uOiAncGRmJyB9LFxuICAgICAgICBpbnB1dF9kYXRhOiB7fSxcbiAgICAgIH0pXG4gICAgICBtb2NrVXNlUGlwZWxpbmVFeGVjdXRpb25Mb2cubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogbW9ja0RhdGEsXG4gICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgICBpc0Vycm9yOiBmYWxzZSxcbiAgICAgIH0pXG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja1Jlc29sdmVkVmFsdWUoeyBkYXRhOiB7IG91dHB1dHM6IHt9IH0gfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQaXBlbGluZVNldHRpbmdzIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwcmV2aWV3LWJ0bicpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBpbnB1dHMgY29tZSBmcm9tIGluaXRpYWxEYXRhIHdoaWNoIGlzIHRyYW5zZm9ybWVkIGJ5IHVzZUluaXRpYWxEYXRhXG4gICAgICAvLyBTaW5jZSB1c2VQdWJsaXNoZWRQaXBlbGluZVByb2Nlc3NpbmdQYXJhbXMgcmV0dXJucyBlbXB0eSB2YXJpYWJsZXMsIGlucHV0cyBpcyB7fVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTXV0YXRlQXN5bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHBpcGVsaW5lX2lkOiBtb2NrUGlwZWxpbmVJZCxcbiAgICAgICAgICAgIGlucHV0czoge30sXG4gICAgICAgICAgICBzdGFydF9ub2RlX2lkOiAnbm9kZS14eXonLFxuICAgICAgICAgICAgZGF0YXNvdXJjZV90eXBlOiBEYXRhc291cmNlVHlwZS5sb2NhbEZpbGUsXG4gICAgICAgICAgICBkYXRhc291cmNlX2luZm9fbGlzdDogW3sgcmVsYXRlZF9pZDogJ2ZpbGUtMScsIG5hbWU6ICd0ZXN0LnBkZicsIGV4dGVuc2lvbjogJ3BkZicgfV0sXG4gICAgICAgICAgICBpc19wcmV2aWV3OiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gRWRnZSBDYXNlcyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdC5lYWNoKFtcbiAgICAgIFtEYXRhc291cmNlVHlwZS5sb2NhbEZpbGUsICdsb2NhbC1maWxlcy1jb3VudCcsICcxJ10sXG4gICAgICBbRGF0YXNvdXJjZVR5cGUud2Vic2l0ZUNyYXdsLCAnd2Vic2l0ZS1wYWdlcy1jb3VudCcsICcxJ10sXG4gICAgICBbRGF0YXNvdXJjZVR5cGUub25saW5lRG9jdW1lbnQsICdvbmxpbmUtZG9jdW1lbnRzLWNvdW50JywgJzEnXSxcbiAgICAgIFtEYXRhc291cmNlVHlwZS5vbmxpbmVEcml2ZSwgJ29ubGluZS1kcml2ZS1maWxlcy1jb3VudCcsICcxJ10sXG4gICAgXSkoJ3Nob3VsZCBoYW5kbGUgJXMgZGF0YXNvdXJjZSB0eXBlIGNvcnJlY3RseScsIChkYXRhc291cmNlVHlwZSwgdGVzdElkLCBleHBlY3RlZENvdW50KSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkYXRhc291cmNlSW5mb01hcDogUmVjb3JkPERhdGFzb3VyY2VUeXBlLCBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4gPSB7XG4gICAgICAgIFtEYXRhc291cmNlVHlwZS5sb2NhbEZpbGVdOiB7IHJlbGF0ZWRfaWQ6ICdmMScsIG5hbWU6ICdmaWxlLnBkZicsIGV4dGVuc2lvbjogJ3BkZicgfSxcbiAgICAgICAgW0RhdGFzb3VyY2VUeXBlLndlYnNpdGVDcmF3bF06IHsgY29udGVudDogJ2MnLCBkZXNjcmlwdGlvbjogJ2QnLCBzb3VyY2VfdXJsOiAndScsIHRpdGxlOiAndCcgfSxcbiAgICAgICAgW0RhdGFzb3VyY2VUeXBlLm9ubGluZURvY3VtZW50XTogeyB3b3Jrc3BhY2VfaWQ6ICd3MScsIHBhZ2U6IHsgcGFnZV9pZDogJ3AxJyB9IH0sXG4gICAgICAgIFtEYXRhc291cmNlVHlwZS5vbmxpbmVEcml2ZV06IHsgaWQ6ICdkMScsIHR5cGU6ICdkb2MnLCBuYW1lOiAnbicsIHNpemU6IDEwMCB9LFxuICAgICAgfVxuXG4gICAgICBjb25zdCBtb2NrRGF0YSA9IGNyZWF0ZU1vY2tFeGVjdXRpb25Mb2dSZXNwb25zZSh7XG4gICAgICAgIGRhdGFzb3VyY2VfdHlwZTogZGF0YXNvdXJjZVR5cGUsXG4gICAgICAgIGRhdGFzb3VyY2VfaW5mbzogZGF0YXNvdXJjZUluZm9NYXBbZGF0YXNvdXJjZVR5cGVdLFxuICAgICAgfSlcbiAgICAgIG1vY2tVc2VQaXBlbGluZUV4ZWN1dGlvbkxvZy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiBtb2NrRGF0YSxcbiAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICAgIGlzRXJyb3I6IGZhbHNlLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQaXBlbGluZVNldHRpbmdzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCh0ZXN0SWQpKS50b0hhdmVUZXh0Q29udGVudChleHBlY3RlZENvdW50KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgbG9hZGluZyBzdGF0ZSBkdXJpbmcgaW5pdGlhbCBmZXRjaCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VQaXBlbGluZUV4ZWN1dGlvbkxvZy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiB1bmRlZmluZWQsXG4gICAgICAgIGlzRmV0Y2hpbmc6IHRydWUsXG4gICAgICAgIGlzRXJyb3I6IGZhbHNlLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXJXaXRoUHJvdmlkZXJzKDxQaXBlbGluZVNldHRpbmdzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwcm9jZXNzLWZvcm0nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIHN0YXRlIHdoZW4gQVBJIGZhaWxzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1VzZVBpcGVsaW5lRXhlY3V0aW9uTG9nLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICAgIGlzRXJyb3I6IHRydWUsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFBpcGVsaW5lU2V0dGluZ3Mgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3Byb2Nlc3MtZm9ybScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gU3RhdGUgTWFuYWdlbWVudCA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCB1bmRlZmluZWQgZXN0aW1hdGVEYXRhJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFBpcGVsaW5lU2V0dGluZ3Mgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdoYXMtZXN0aW1hdGUtZGF0YScpKS50b0hhdmVUZXh0Q29udGVudCgnZmFsc2UnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBlc3RpbWF0ZURhdGEgYWZ0ZXIgc3VjY2Vzc2Z1bCBwcmV2aWV3JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0VzdGltYXRlRGF0YSA9IHsgY2h1bmtzOiBbXSwgdG90YWxfdG9rZW5zOiA1MCB9XG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja0ltcGxlbWVudGF0aW9uKChfcmVxLCBvcHRzKSA9PiB7XG4gICAgICAgIG9wdHM/Lm9uU3VjY2Vzcz8uKHsgZGF0YTogeyBvdXRwdXRzOiBtb2NrRXN0aW1hdGVEYXRhIH0gfSlcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGRhdGE6IHsgb3V0cHV0czogbW9ja0VzdGltYXRlRGF0YSB9IH0pXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFBpcGVsaW5lU2V0dGluZ3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ByZXZpZXctYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hhcy1lc3RpbWF0ZS1kYXRhJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IGlzUHJldmlldyByZWYgdG8gZmFsc2Ugd2hlbiBwcm9jZXNzIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja1Jlc29sdmVkVmFsdWUoe30pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UGlwZWxpbmVTZXR0aW5ncyB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2RhdGFzZXRQaXBlbGluZS5vcGVyYXRpb25zLnNhdmVBbmRQcm9jZXNzJyB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tNdXRhdGVBc3luYykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyBpc19wcmV2aWV3OiBmYWxzZSB9KSxcbiAgICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IGlzUHJldmlldyByZWYgdG8gdHJ1ZSB3aGVuIHByZXZpZXcgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tNdXRhdGVBc3luYy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IGRhdGE6IHsgb3V0cHV0czoge30gfSB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcldpdGhQcm92aWRlcnMoPFBpcGVsaW5lU2V0dGluZ3Mgey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ByZXZpZXctYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTXV0YXRlQXN5bmMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHsgaXNfcHJldmlldzogdHJ1ZSB9KSxcbiAgICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBpc1BlbmRpbmc9dHJ1ZSB0byBDaHVua1ByZXZpZXcgd2hlbiBwcmV2aWV3IGlzIHBlbmRpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gU3RhcnQgd2l0aCBpc1BlbmRpbmc9ZmFsc2Ugc28gYnV0dG9ucyBhcmUgZW5hYmxlZFxuICAgICAgbGV0IGlzUGVuZGluZ1N0YXRlID0gZmFsc2VcbiAgICAgIG1vY2tVc2VSdW5QdWJsaXNoZWRQaXBlbGluZS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gKHtcbiAgICAgICAgbXV0YXRlQXN5bmM6IG1vY2tNdXRhdGVBc3luYyxcbiAgICAgICAgaXNJZGxlOiAhaXNQZW5kaW5nU3RhdGUsXG4gICAgICAgIGlzUGVuZGluZzogaXNQZW5kaW5nU3RhdGUsXG4gICAgICB9KSlcblxuICAgICAgLy8gQSBwcm9taXNlIHRoYXQgbmV2ZXIgcmVzb2x2ZXMgdG8ga2VlcCB0aGUgcGVuZGluZyBzdGF0ZVxuICAgICAgY29uc3QgcGVuZGluZ1Byb21pc2UgPSBuZXcgUHJvbWlzZTx2b2lkPigoKSA9PiB1bmRlZmluZWQpXG4gICAgICAvLyBXaGVuIG11dGF0ZUFzeW5jIGlzIGNhbGxlZCwgc2V0IGlzUGVuZGluZyB0byB0cnVlIGFuZCB0cmlnZ2VyIHJlcmVuZGVyXG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IHtcbiAgICAgICAgaXNQZW5kaW5nU3RhdGUgPSB0cnVlXG4gICAgICAgIHJldHVybiBwZW5kaW5nUHJvbWlzZVxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyV2l0aFByb3ZpZGVycyg8UGlwZWxpbmVTZXR0aW5ncyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBDbGljayBwcmV2aWV3IGJ1dHRvbiAoc2V0cyBpc1ByZXZpZXcuY3VycmVudCA9IHRydWUgYW5kIGNhbGxzIG11dGF0ZUFzeW5jKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncHJldmlldy1idG4nKSlcblxuICAgICAgLy8gVXBkYXRlIG1vY2sgYW5kIHJlcmVuZGVyIHRvIHJlZmxlY3QgaXNQZW5kaW5nPXRydWUgc3RhdGVcbiAgICAgIG1vY2tVc2VSdW5QdWJsaXNoZWRQaXBlbGluZS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBtdXRhdGVBc3luYzogbW9ja011dGF0ZUFzeW5jLFxuICAgICAgICBpc0lkbGU6IGZhbHNlLFxuICAgICAgICBpc1BlbmRpbmc6IHRydWUsXG4gICAgICB9KVxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17Y3JlYXRlUXVlcnlDbGllbnQoKX0+XG4gICAgICAgICAgPFBpcGVsaW5lU2V0dGluZ3Mgey4uLnByb3BzfSAvPlxuICAgICAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnQgLSBpc1BlbmRpbmcgJiYgaXNQcmV2aWV3LmN1cnJlbnQgc2hvdWxkIGJvdGggYmUgdHJ1ZSBub3dcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lzLXBlbmRpbmcnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgaXNQZW5kaW5nPWZhbHNlIHRvIENodW5rUHJldmlldyB3aGVuIHByb2Nlc3MgaXMgcGVuZGluZyAobm90IHByZXZpZXcpJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAtIGlzUGVuZGluZyBpcyB0cnVlIGJ1dCBpc1ByZXZpZXcuY3VycmVudCBpcyBmYWxzZVxuICAgICAgbW9ja1VzZVJ1blB1Ymxpc2hlZFBpcGVsaW5lLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIG11dGF0ZUFzeW5jOiBtb2NrTXV0YXRlQXN5bmMsXG4gICAgICAgIGlzSWRsZTogZmFsc2UsXG4gICAgICAgIGlzUGVuZGluZzogdHJ1ZSxcbiAgICAgIH0pXG4gICAgICBtb2NrTXV0YXRlQXN5bmMubW9ja1JldHVyblZhbHVlKG5ldyBQcm9taXNlPHZvaWQ+KCgpID0+IHVuZGVmaW5lZCkpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyV2l0aFByb3ZpZGVycyg8UGlwZWxpbmVTZXR0aW5ncyB7Li4ucHJvcHN9IC8+KVxuICAgICAgLy8gQ2xpY2sgcHJvY2VzcyAobm90IHByZXZpZXcpIHRvIHNldCBpc1ByZXZpZXcuY3VycmVudCA9IGZhbHNlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnZGF0YXNldFBpcGVsaW5lLm9wZXJhdGlvbnMuc2F2ZUFuZFByb2Nlc3MnIH0pKVxuXG4gICAgICAvLyBBc3NlcnQgLSBpc1BlbmRpbmcgJiYgaXNQcmV2aWV3LmN1cnJlbnQgc2hvdWxkIGJlIGZhbHNlICh0cnVlICYmIGZhbHNlID0gZmFsc2UpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXMtcGVuZGluZycpKS50b0hhdmVUZXh0Q29udGVudCgnZmFsc2UnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==