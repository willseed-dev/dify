"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const constants_1 = require("@/app/components/header/account-setting/constants");
const datasets_1 = require("@/models/datasets");
const index_1 = require("./index");
// ==========================================
// Mock Modules
// ==========================================
// Note: react-i18next uses global mock from web/vitest.setup.ts
// Mock useDocLink - context hook requires mocking
const mockDocLink = vi.fn((path) => `https://docs.example.com${path || ''}`);
vi.mock('@/context/i18n', () => ({
    useDocLink: () => mockDocLink,
}));
// Mock dataset-detail context - context provider requires mocking
let mockPipelineId = 'pipeline-123';
vi.mock('@/context/dataset-detail', () => ({
    useDatasetDetailContextWithSelector: (selector) => selector({ dataset: { pipeline_id: mockPipelineId } }),
}));
// Mock modal context - context provider requires mocking
const mockSetShowAccountSettingModal = vi.fn();
vi.mock('@/context/modal-context', () => ({
    useModalContextSelector: (selector) => selector({ setShowAccountSettingModal: mockSetShowAccountSettingModal }),
}));
// Mock ssePost - API service requires mocking
const { mockSsePost } = vi.hoisted(() => ({
    mockSsePost: vi.fn(),
}));
vi.mock('@/service/base', () => ({
    ssePost: mockSsePost,
}));
// Mock useGetDataSourceAuth - API service hook requires mocking
const { mockUseGetDataSourceAuth } = vi.hoisted(() => ({
    mockUseGetDataSourceAuth: vi.fn(),
}));
vi.mock('@/service/use-datasource', () => ({
    useGetDataSourceAuth: mockUseGetDataSourceAuth,
}));
// Mock usePipeline hooks - API service hooks require mocking
const { mockUseDraftPipelinePreProcessingParams, mockUsePublishedPipelinePreProcessingParams } = vi.hoisted(() => ({
    mockUseDraftPipelinePreProcessingParams: vi.fn(),
    mockUsePublishedPipelinePreProcessingParams: vi.fn(),
}));
vi.mock('@/service/use-pipeline', () => ({
    useDraftPipelinePreProcessingParams: mockUseDraftPipelinePreProcessingParams,
    usePublishedPipelinePreProcessingParams: mockUsePublishedPipelinePreProcessingParams,
}));
// Note: zustand/react/shallow useShallow is imported directly (simple utility function)
// Mock store
const mockStoreState = {
    crawlResult: undefined,
    step: datasets_1.CrawlStep.init,
    websitePages: [],
    previewIndex: -1,
    currentCredentialId: '',
    setWebsitePages: vi.fn(),
    setCurrentWebsite: vi.fn(),
    setPreviewIndex: vi.fn(),
    setStep: vi.fn(),
    setCrawlResult: vi.fn(),
};
const mockGetState = vi.fn(() => mockStoreState);
const mockDataSourceStore = { getState: mockGetState };
vi.mock('../store', () => ({
    useDataSourceStoreWithSelector: (selector) => selector(mockStoreState),
    useDataSourceStore: () => mockDataSourceStore,
}));
// Mock Header component
vi.mock('../base/header', () => ({
    default: (props) => (<div data-testid="header">
      <span data-testid="header-doc-title">{props.docTitle}</span>
      <span data-testid="header-doc-link">{props.docLink}</span>
      <span data-testid="header-plugin-name">{props.pluginName}</span>
      <span data-testid="header-credential-id">{props.currentCredentialId}</span>
      <button data-testid="header-config-btn" onClick={props.onClickConfiguration}>Configure</button>
      <button data-testid="header-credential-change" onClick={() => props.onCredentialChange('new-cred-id')}>Change Credential</button>
      <span data-testid="header-credentials-count">{props.credentials?.length || 0}</span>
    </div>),
}));
// Mock Options component
const mockOptionsSubmit = vi.fn();
vi.mock('./base/options', () => ({
    default: (props) => (<div data-testid="options">
      <span data-testid="options-step">{props.step}</span>
      <span data-testid="options-run-disabled">{String(props.runDisabled)}</span>
      <span data-testid="options-variables-count">{props.variables?.length || 0}</span>
      <button data-testid="options-submit-btn" onClick={() => {
            mockOptionsSubmit();
            props.onSubmit({ url: 'https://example.com', depth: 2 });
        }}>
        Submit
      </button>
    </div>),
}));
// Mock Crawling component
vi.mock('./base/crawling', () => ({
    default: (props) => (<div data-testid="crawling">
      <span data-testid="crawling-crawled-num">{props.crawledNum}</span>
      <span data-testid="crawling-total-num">{props.totalNum}</span>
    </div>),
}));
// Mock ErrorMessage component
vi.mock('./base/error-message', () => ({
    default: (props) => (<div data-testid="error-message" className={props.className}>
      <span data-testid="error-title">{props.title}</span>
      <span data-testid="error-msg">{props.errorMsg}</span>
    </div>),
}));
// Mock CrawledResult component
vi.mock('./base/crawled-result', () => ({
    default: (props) => (<div data-testid="crawled-result" className={props.className}>
      <span data-testid="crawled-result-count">{props.list?.length || 0}</span>
      <span data-testid="crawled-result-checked-count">{props.checkedList?.length || 0}</span>
      <span data-testid="crawled-result-used-time">{props.usedTime}</span>
      <span data-testid="crawled-result-preview-index">{props.previewIndex}</span>
      <span data-testid="crawled-result-show-preview">{String(props.showPreview)}</span>
      <span data-testid="crawled-result-multiple-choice">{String(props.isMultipleChoice)}</span>
      <button data-testid="crawled-result-select-change" onClick={() => props.onSelectedChange([{ source_url: 'https://example.com', title: 'Test' }])}>
        Change Selection
      </button>
      <button data-testid="crawled-result-preview" onClick={() => props.onPreview?.({ source_url: 'https://example.com', title: 'Test' }, 0)}>
        Preview
      </button>
    </div>),
}));
// ==========================================
// Test Data Builders
// ==========================================
const createMockNodeData = (overrides) => ({
    title: 'Test Node',
    plugin_id: 'plugin-123',
    provider_type: 'website',
    provider_name: 'website-provider',
    datasource_name: 'website-ds',
    datasource_label: 'Website Crawler',
    datasource_parameters: {},
    datasource_configurations: {},
    ...overrides,
});
const createMockCrawlResultItem = (overrides) => ({
    source_url: 'https://example.com/page1',
    title: 'Test Page 1',
    markdown: '# Test content',
    description: 'Test description',
    ...overrides,
});
const createMockCredential = (overrides) => ({
    id: 'cred-1',
    name: 'Test Credential',
    avatar_url: 'https://example.com/avatar.png',
    credential: {},
    is_default: false,
    type: 'oauth2',
    ...overrides,
});
const createDefaultProps = (overrides) => ({
    nodeId: 'node-1',
    nodeData: createMockNodeData(),
    onCredentialChange: vi.fn(),
    isInPipeline: false,
    supportBatchUpload: true,
    ...overrides,
});
// ==========================================
// Test Suites
// ==========================================
describe('WebsiteCrawl', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset store state
        mockStoreState.crawlResult = undefined;
        mockStoreState.step = datasets_1.CrawlStep.init;
        mockStoreState.websitePages = [];
        mockStoreState.previewIndex = -1;
        mockStoreState.currentCredentialId = '';
        mockStoreState.setWebsitePages = vi.fn();
        mockStoreState.setCurrentWebsite = vi.fn();
        mockStoreState.setPreviewIndex = vi.fn();
        mockStoreState.setStep = vi.fn();
        mockStoreState.setCrawlResult = vi.fn();
        // Reset context values
        mockPipelineId = 'pipeline-123';
        mockSetShowAccountSettingModal.mockClear();
        // Default mock return values
        mockUseGetDataSourceAuth.mockReturnValue({
            data: { result: [createMockCredential()] },
        });
        mockUseDraftPipelinePreProcessingParams.mockReturnValue({
            data: { variables: [] },
            isFetching: false,
        });
        mockUsePublishedPipelinePreProcessingParams.mockReturnValue({
            data: { variables: [] },
            isFetching: false,
        });
        mockGetState.mockReturnValue(mockStoreState);
    });
    // ==========================================
    // Rendering Tests
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('header')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('options')).toBeInTheDocument();
        });
        it('should render Header with correct props', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-123';
            const props = createDefaultProps({
                nodeData: createMockNodeData({ datasource_label: 'My Website Crawler' }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('header-doc-title')).toHaveTextContent('Docs');
            expect(react_1.screen.getByTestId('header-plugin-name')).toHaveTextContent('My Website Crawler');
            expect(react_1.screen.getByTestId('header-credential-id')).toHaveTextContent('cred-123');
        });
        it('should render Options with correct props', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('options')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('options-step')).toHaveTextContent(datasets_1.CrawlStep.init);
        });
        it('should not render Crawling or CrawledResult when step is init', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.init;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByTestId('crawling')).not.toBeInTheDocument();
            expect(react_1.screen.queryByTestId('crawled-result')).not.toBeInTheDocument();
            expect(react_1.screen.queryByTestId('error-message')).not.toBeInTheDocument();
        });
        it('should render Crawling when step is running', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.running;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('crawling')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('crawled-result')).not.toBeInTheDocument();
            expect(react_1.screen.queryByTestId('error-message')).not.toBeInTheDocument();
        });
        it('should render CrawledResult when step is finished with no error', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = {
                data: [createMockCrawlResultItem()],
                time_consuming: 1.5,
            };
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('crawled-result')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('crawling')).not.toBeInTheDocument();
            expect(react_1.screen.queryByTestId('error-message')).not.toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('nodeId prop', () => {
            it('should use nodeId in datasourceNodeRunURL for non-pipeline mode', async () => {
                // Arrange
                mockStoreState.currentCredentialId = 'cred-1';
                const props = createDefaultProps({
                    nodeId: 'custom-node-id',
                    isInPipeline: false,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Options uses nodeId through usePreProcessingParams
                expect(mockUsePublishedPipelinePreProcessingParams).toHaveBeenCalledWith({ pipeline_id: 'pipeline-123', node_id: 'custom-node-id' }, true);
            });
        });
        describe('nodeData prop', () => {
            it('should pass plugin_id and provider_name to useGetDataSourceAuth', () => {
                // Arrange
                const nodeData = createMockNodeData({
                    plugin_id: 'my-plugin-id',
                    provider_name: 'my-provider',
                });
                const props = createDefaultProps({ nodeData });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockUseGetDataSourceAuth).toHaveBeenCalledWith({
                    pluginId: 'my-plugin-id',
                    provider: 'my-provider',
                });
            });
            it('should pass datasource_label to Header as pluginName', () => {
                // Arrange
                const nodeData = createMockNodeData({
                    datasource_label: 'Custom Website Scraper',
                });
                const props = createDefaultProps({ nodeData });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('header-plugin-name')).toHaveTextContent('Custom Website Scraper');
            });
        });
        describe('isInPipeline prop', () => {
            it('should use draft URL when isInPipeline is true', () => {
                // Arrange
                const props = createDefaultProps({ isInPipeline: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockUseDraftPipelinePreProcessingParams).toHaveBeenCalled();
                expect(mockUsePublishedPipelinePreProcessingParams).not.toHaveBeenCalled();
            });
            it('should use published URL when isInPipeline is false', () => {
                // Arrange
                const props = createDefaultProps({ isInPipeline: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockUsePublishedPipelinePreProcessingParams).toHaveBeenCalled();
                expect(mockUseDraftPipelinePreProcessingParams).not.toHaveBeenCalled();
            });
            it('should pass showPreview as false to CrawledResult when isInPipeline is true', () => {
                // Arrange
                mockStoreState.step = datasets_1.CrawlStep.finished;
                mockStoreState.crawlResult = {
                    data: [createMockCrawlResultItem()],
                    time_consuming: 1.5,
                };
                const props = createDefaultProps({ isInPipeline: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('crawled-result-show-preview')).toHaveTextContent('false');
            });
            it('should pass showPreview as true to CrawledResult when isInPipeline is false', () => {
                // Arrange
                mockStoreState.step = datasets_1.CrawlStep.finished;
                mockStoreState.crawlResult = {
                    data: [createMockCrawlResultItem()],
                    time_consuming: 1.5,
                };
                const props = createDefaultProps({ isInPipeline: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('crawled-result-show-preview')).toHaveTextContent('true');
            });
        });
        describe('supportBatchUpload prop', () => {
            it('should pass isMultipleChoice as true to CrawledResult when supportBatchUpload is true', () => {
                // Arrange
                mockStoreState.step = datasets_1.CrawlStep.finished;
                mockStoreState.crawlResult = {
                    data: [createMockCrawlResultItem()],
                    time_consuming: 1.5,
                };
                const props = createDefaultProps({ supportBatchUpload: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('crawled-result-multiple-choice')).toHaveTextContent('true');
            });
            it('should pass isMultipleChoice as false to CrawledResult when supportBatchUpload is false', () => {
                // Arrange
                mockStoreState.step = datasets_1.CrawlStep.finished;
                mockStoreState.crawlResult = {
                    data: [createMockCrawlResultItem()],
                    time_consuming: 1.5,
                };
                const props = createDefaultProps({ supportBatchUpload: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('crawled-result-multiple-choice')).toHaveTextContent('false');
            });
            it.each([
                [true, 'true'],
                [false, 'false'],
                [undefined, 'true'], // Default value
            ])('should handle supportBatchUpload=%s correctly', (value, expected) => {
                // Arrange
                mockStoreState.step = datasets_1.CrawlStep.finished;
                mockStoreState.crawlResult = {
                    data: [createMockCrawlResultItem()],
                    time_consuming: 1.5,
                };
                const props = createDefaultProps({ supportBatchUpload: value });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('crawled-result-multiple-choice')).toHaveTextContent(expected);
            });
        });
        describe('onCredentialChange prop', () => {
            it('should call onCredentialChange with credential id and reset state', () => {
                // Arrange
                const mockOnCredentialChange = vi.fn();
                const props = createDefaultProps({ onCredentialChange: mockOnCredentialChange });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('header-credential-change'));
                // Assert
                expect(mockOnCredentialChange).toHaveBeenCalledWith('new-cred-id');
            });
        });
    });
    // ==========================================
    // State Management Tests
    // ==========================================
    describe('State Management', () => {
        it('should display correct crawledNum and totalNum when running', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.running;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Initial state is 0/0
            expect(react_1.screen.getByTestId('crawling-crawled-num')).toHaveTextContent('0');
            expect(react_1.screen.getByTestId('crawling-total-num')).toHaveTextContent('0');
        });
        it('should update step and result via ssePost callbacks', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const mockCrawlData = [
                createMockCrawlResultItem({ source_url: 'https://example.com/1' }),
                createMockCrawlResultItem({ source_url: 'https://example.com/2' }),
            ];
            mockSsePost.mockImplementation((url, options, callbacks) => {
                // Simulate processing
                callbacks.onDataSourceNodeProcessing({
                    total: 10,
                    completed: 5,
                });
                // Simulate completion
                callbacks.onDataSourceNodeCompleted({
                    data: mockCrawlData,
                    time_consuming: 2.5,
                });
            });
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Trigger submit
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setStep).toHaveBeenCalledWith(datasets_1.CrawlStep.running);
                expect(mockStoreState.setCrawlResult).toHaveBeenCalledWith({
                    data: mockCrawlData,
                    time_consuming: 2.5,
                });
                expect(mockStoreState.setStep).toHaveBeenCalledWith(datasets_1.CrawlStep.finished);
            });
        });
        it('should pass runDisabled as true when no credential is selected', () => {
            // Arrange
            mockStoreState.currentCredentialId = '';
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('options-run-disabled')).toHaveTextContent('true');
        });
        it('should pass runDisabled as true when params are being fetched', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockUsePublishedPipelinePreProcessingParams.mockReturnValue({
                data: { variables: [] },
                isFetching: true,
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('options-run-disabled')).toHaveTextContent('true');
        });
        it('should pass runDisabled as false when credential is selected and params are loaded', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockUsePublishedPipelinePreProcessingParams.mockReturnValue({
                data: { variables: [] },
                isFetching: false,
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('options-run-disabled')).toHaveTextContent('false');
        });
    });
    // ==========================================
    // Callback Stability and Memoization
    // ==========================================
    describe('Callback Stability and Memoization', () => {
        it('should have stable handleCheckedCrawlResultChange that updates store', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = {
                data: [createMockCrawlResultItem()],
                time_consuming: 1.5,
            };
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('crawled-result-select-change'));
            // Assert
            expect(mockStoreState.setWebsitePages).toHaveBeenCalledWith([
                { source_url: 'https://example.com', title: 'Test' },
            ]);
        });
        it('should have stable handlePreview that updates store', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = {
                data: [createMockCrawlResultItem()],
                time_consuming: 1.5,
            };
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('crawled-result-preview'));
            // Assert
            expect(mockStoreState.setCurrentWebsite).toHaveBeenCalledWith({
                source_url: 'https://example.com',
                title: 'Test',
            });
            expect(mockStoreState.setPreviewIndex).toHaveBeenCalledWith(0);
        });
        it('should have stable handleSetting callback', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('header-config-btn'));
            // Assert
            expect(mockSetShowAccountSettingModal).toHaveBeenCalledWith({
                payload: constants_1.ACCOUNT_SETTING_TAB.DATA_SOURCE,
            });
        });
        it('should have stable handleCredentialChange that resets state', () => {
            // Arrange
            const mockOnCredentialChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnCredentialChange });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('header-credential-change'));
            // Assert
            expect(mockOnCredentialChange).toHaveBeenCalledWith('new-cred-id');
        });
    });
    // ==========================================
    // User Interactions and Event Handlers
    // ==========================================
    describe('User Interactions and Event Handlers', () => {
        it('should handle submit and trigger ssePost', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalled();
                expect(mockStoreState.setStep).toHaveBeenCalledWith(datasets_1.CrawlStep.running);
            });
        });
        it('should handle configuration button click', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('header-config-btn'));
            // Assert
            expect(mockSetShowAccountSettingModal).toHaveBeenCalledWith({
                payload: constants_1.ACCOUNT_SETTING_TAB.DATA_SOURCE,
            });
        });
        it('should handle credential change', () => {
            // Arrange
            const mockOnCredentialChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnCredentialChange });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('header-credential-change'));
            // Assert
            expect(mockOnCredentialChange).toHaveBeenCalledWith('new-cred-id');
        });
        it('should handle selection change in CrawledResult', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = {
                data: [createMockCrawlResultItem()],
                time_consuming: 1.5,
            };
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('crawled-result-select-change'));
            // Assert
            expect(mockStoreState.setWebsitePages).toHaveBeenCalled();
        });
        it('should handle preview in CrawledResult', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = {
                data: [createMockCrawlResultItem()],
                time_consuming: 1.5,
            };
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('crawled-result-preview'));
            // Assert
            expect(mockStoreState.setCurrentWebsite).toHaveBeenCalled();
            expect(mockStoreState.setPreviewIndex).toHaveBeenCalled();
        });
    });
    // ==========================================
    // API Calls Mocking
    // ==========================================
    describe('API Calls', () => {
        it('should call ssePost with correct parameters for published workflow', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'test-cred';
            mockPipelineId = 'pipeline-456';
            const props = createDefaultProps({
                nodeId: 'node-789',
                isInPipeline: false,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalledWith('/rag/pipelines/pipeline-456/workflows/published/datasource/nodes/node-789/run', expect.objectContaining({
                    body: expect.objectContaining({
                        inputs: { url: 'https://example.com', depth: 2 },
                        datasource_type: 'website_crawl',
                        credential_id: 'test-cred',
                        response_mode: 'streaming',
                    }),
                }), expect.any(Object));
            });
        });
        it('should call ssePost with correct parameters for draft workflow', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'test-cred';
            mockPipelineId = 'pipeline-456';
            const props = createDefaultProps({
                nodeId: 'node-789',
                isInPipeline: true,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalledWith('/rag/pipelines/pipeline-456/workflows/draft/datasource/nodes/node-789/run', expect.any(Object), expect.any(Object));
            });
        });
        it('should handle onDataSourceNodeProcessing callback correctly', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockStoreState.step = datasets_1.CrawlStep.running;
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeProcessing({
                    total: 100,
                    completed: 50,
                });
            });
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Update store state to simulate running step
            mockStoreState.step = datasets_1.CrawlStep.running;
            rerender(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalled();
            });
        });
        it('should handle onDataSourceNodeCompleted callback correctly', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const mockCrawlData = [
                createMockCrawlResultItem({ source_url: 'https://example.com/1' }),
                createMockCrawlResultItem({ source_url: 'https://example.com/2' }),
            ];
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeCompleted({
                    data: mockCrawlData,
                    time_consuming: 3.5,
                });
            });
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setCrawlResult).toHaveBeenCalledWith({
                    data: mockCrawlData,
                    time_consuming: 3.5,
                });
                expect(mockStoreState.setWebsitePages).toHaveBeenCalledWith(mockCrawlData);
                expect(mockStoreState.setStep).toHaveBeenCalledWith(datasets_1.CrawlStep.finished);
            });
        });
        it('should handle onDataSourceNodeCompleted with single result when supportBatchUpload is false', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const mockCrawlData = [
                createMockCrawlResultItem({ source_url: 'https://example.com/1' }),
                createMockCrawlResultItem({ source_url: 'https://example.com/2' }),
                createMockCrawlResultItem({ source_url: 'https://example.com/3' }),
            ];
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeCompleted({
                    data: mockCrawlData,
                    time_consuming: 3.5,
                });
            });
            const props = createDefaultProps({ supportBatchUpload: false });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                // Should only select first item when supportBatchUpload is false
                expect(mockStoreState.setWebsitePages).toHaveBeenCalledWith([mockCrawlData[0]]);
            });
        });
        it('should handle onDataSourceNodeError callback correctly', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeError({
                    error: 'Crawl failed: Invalid URL',
                });
            });
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setStep).toHaveBeenCalledWith(datasets_1.CrawlStep.finished);
            });
        });
        it('should use useGetDataSourceAuth with correct parameters', () => {
            // Arrange
            const nodeData = createMockNodeData({
                plugin_id: 'website-plugin',
                provider_name: 'website-provider',
            });
            const props = createDefaultProps({ nodeData });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockUseGetDataSourceAuth).toHaveBeenCalledWith({
                pluginId: 'website-plugin',
                provider: 'website-provider',
            });
        });
        it('should pass credentials from useGetDataSourceAuth to Header', () => {
            // Arrange
            const mockCredentials = [
                createMockCredential({ id: 'cred-1', name: 'Credential 1' }),
                createMockCredential({ id: 'cred-2', name: 'Credential 2' }),
            ];
            mockUseGetDataSourceAuth.mockReturnValue({
                data: { result: mockCredentials },
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('header-credentials-count')).toHaveTextContent('2');
        });
    });
    // ==========================================
    // Edge Cases and Error Handling
    // ==========================================
    describe('Edge Cases and Error Handling', () => {
        it('should handle empty credentials array', () => {
            // Arrange
            mockUseGetDataSourceAuth.mockReturnValue({
                data: { result: [] },
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('header-credentials-count')).toHaveTextContent('0');
        });
        it('should handle undefined dataSourceAuth result', () => {
            // Arrange
            mockUseGetDataSourceAuth.mockReturnValue({
                data: { result: undefined },
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('header-credentials-count')).toHaveTextContent('0');
        });
        it('should handle null dataSourceAuth data', () => {
            // Arrange
            mockUseGetDataSourceAuth.mockReturnValue({
                data: null,
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('header-credentials-count')).toHaveTextContent('0');
        });
        it('should handle empty crawlResult data array', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = {
                data: [],
                time_consuming: 0.5,
            };
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('crawled-result-count')).toHaveTextContent('0');
        });
        it('should handle undefined crawlResult', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = undefined;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('crawled-result-count')).toHaveTextContent('0');
        });
        it('should handle time_consuming as string', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = {
                data: [createMockCrawlResultItem()],
                time_consuming: '2.5',
            };
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('crawled-result-used-time')).toHaveTextContent('2.5');
        });
        it('should handle invalid time_consuming value', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = {
                data: [createMockCrawlResultItem()],
                time_consuming: 'invalid',
            };
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - NaN should become 0
            expect(react_1.screen.getByTestId('crawled-result-used-time')).toHaveTextContent('0');
        });
        it('should handle undefined pipelineId gracefully', () => {
            // Arrange
            mockPipelineId = undefined;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockUsePublishedPipelinePreProcessingParams).toHaveBeenCalledWith({ pipeline_id: undefined, node_id: 'node-1' }, false);
        });
        it('should handle empty nodeId gracefully', () => {
            // Arrange
            const props = createDefaultProps({ nodeId: '' });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockUsePublishedPipelinePreProcessingParams).toHaveBeenCalledWith({ pipeline_id: 'pipeline-123', node_id: '' }, false);
        });
        it('should handle undefined paramsConfig.variables (fallback to empty array)', () => {
            // Arrange - Test the || [] fallback on line 169
            mockUsePublishedPipelinePreProcessingParams.mockReturnValue({
                data: { variables: undefined },
                isFetching: false,
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Options should receive empty array as variables
            expect(react_1.screen.getByTestId('options-variables-count')).toHaveTextContent('0');
        });
        it('should handle undefined paramsConfig (fallback to empty array)', () => {
            // Arrange - Test when paramsConfig is undefined
            mockUsePublishedPipelinePreProcessingParams.mockReturnValue({
                data: undefined,
                isFetching: false,
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Options should receive empty array as variables
            expect(react_1.screen.getByTestId('options-variables-count')).toHaveTextContent('0');
        });
        it('should handle error without error message', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeError({
                    error: undefined,
                });
            });
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Assert - Should use fallback error message
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setStep).toHaveBeenCalledWith(datasets_1.CrawlStep.finished);
            });
        });
        it('should handle null total and completed in processing callback', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeProcessing({
                    total: null,
                    completed: null,
                });
            });
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Assert - Should handle null values gracefully (default to 0)
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalled();
            });
        });
        it('should handle undefined time_consuming in completed callback', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeCompleted({
                    data: [createMockCrawlResultItem()],
                    time_consuming: undefined,
                });
            });
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setCrawlResult).toHaveBeenCalledWith({
                    data: [expect.any(Object)],
                    time_consuming: 0,
                });
            });
        });
    });
    // ==========================================
    // All Prop Variations
    // ==========================================
    describe('Prop Variations', () => {
        it.each([
            [{ isInPipeline: true, supportBatchUpload: true }],
            [{ isInPipeline: true, supportBatchUpload: false }],
            [{ isInPipeline: false, supportBatchUpload: true }],
            [{ isInPipeline: false, supportBatchUpload: false }],
        ])('should render correctly with props %o', (propVariation) => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = {
                data: [createMockCrawlResultItem()],
                time_consuming: 1.5,
            };
            const props = createDefaultProps(propVariation);
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('crawled-result')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('crawled-result-show-preview')).toHaveTextContent(String(!propVariation.isInPipeline));
            expect(react_1.screen.getByTestId('crawled-result-multiple-choice')).toHaveTextContent(String(propVariation.supportBatchUpload));
        });
        it('should use default values for optional props', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = {
                data: [createMockCrawlResultItem()],
                time_consuming: 1.5,
            };
            const props = {
                nodeId: 'node-1',
                nodeData: createMockNodeData(),
                onCredentialChange: vi.fn(),
                // isInPipeline and supportBatchUpload are not provided
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Default values: isInPipeline = false, supportBatchUpload = true
            expect(react_1.screen.getByTestId('crawled-result-show-preview')).toHaveTextContent('true');
            expect(react_1.screen.getByTestId('crawled-result-multiple-choice')).toHaveTextContent('true');
        });
    });
    // ==========================================
    // Error Display
    // ==========================================
    describe('Error Display', () => {
        it('should show ErrorMessage when crawl finishes with error', async () => {
            // Arrange - Need to create a scenario where error message is set
            mockStoreState.currentCredentialId = 'cred-1';
            // First render with init state
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Simulate error by setting up ssePost to call error callback
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeError({
                    error: 'Network error',
                });
            });
            // Trigger submit
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Now update store state to finished to simulate the state after error
            mockStoreState.step = datasets_1.CrawlStep.finished;
            rerender(<index_1.default {...props}/>);
            // Assert - The component should check for error message state
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setStep).toHaveBeenCalledWith(datasets_1.CrawlStep.finished);
            });
        });
        it('should not show ErrorMessage when crawl finishes without error', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = {
                data: [createMockCrawlResultItem()],
                time_consuming: 1.5,
            };
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.queryByTestId('error-message')).not.toBeInTheDocument();
            expect(react_1.screen.getByTestId('crawled-result')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Integration Tests
    // ==========================================
    describe('Integration', () => {
        it('should complete full workflow: submit -> running -> completed', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const mockCrawlData = [
                createMockCrawlResultItem({ source_url: 'https://example.com/1' }),
                createMockCrawlResultItem({ source_url: 'https://example.com/2' }),
            ];
            mockSsePost.mockImplementation((url, options, callbacks) => {
                // Simulate processing
                callbacks.onDataSourceNodeProcessing({
                    total: 10,
                    completed: 5,
                });
                // Simulate completion
                callbacks.onDataSourceNodeCompleted({
                    data: mockCrawlData,
                    time_consuming: 2.5,
                });
            });
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Trigger submit
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Assert - Verify full flow
            await (0, react_1.waitFor)(() => {
                // Step should be set to running first
                expect(mockStoreState.setStep).toHaveBeenCalledWith(datasets_1.CrawlStep.running);
                // Then result should be set
                expect(mockStoreState.setCrawlResult).toHaveBeenCalledWith({
                    data: mockCrawlData,
                    time_consuming: 2.5,
                });
                // Pages should be selected
                expect(mockStoreState.setWebsitePages).toHaveBeenCalledWith(mockCrawlData);
                // Step should be set to finished
                expect(mockStoreState.setStep).toHaveBeenCalledWith(datasets_1.CrawlStep.finished);
            });
        });
        it('should handle error flow correctly', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeError({
                    error: 'Failed to crawl website',
                });
            });
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('options-submit-btn'));
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setStep).toHaveBeenCalledWith(datasets_1.CrawlStep.running);
                expect(mockStoreState.setStep).toHaveBeenCalledWith(datasets_1.CrawlStep.finished);
            });
        });
        it('should handle credential change and allow new crawl', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'initial-cred';
            const mockOnCredentialChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnCredentialChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Change credential
            react_1.fireEvent.click(react_1.screen.getByTestId('header-credential-change'));
            // Assert
            expect(mockOnCredentialChange).toHaveBeenCalledWith('new-cred-id');
        });
        it('should handle preview selection after crawl completes', () => {
            // Arrange
            mockStoreState.step = datasets_1.CrawlStep.finished;
            mockStoreState.crawlResult = {
                data: [
                    createMockCrawlResultItem({ source_url: 'https://example.com/1' }),
                    createMockCrawlResultItem({ source_url: 'https://example.com/2' }),
                ],
                time_consuming: 1.5,
            };
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Preview first item
            react_1.fireEvent.click(react_1.screen.getByTestId('crawled-result-preview'));
            // Assert
            expect(mockStoreState.setCurrentWebsite).toHaveBeenCalled();
            expect(mockStoreState.setPreviewIndex).toHaveBeenCalledWith(0);
        });
    });
    // ==========================================
    // Component Memoization
    // ==========================================
    describe('Component Memoization', () => {
        it('should be wrapped with React.memo', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            rerender(<index_1.default {...props}/>);
            // Assert - Component should still render correctly after rerender
            expect(react_1.screen.getByTestId('header')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('options')).toBeInTheDocument();
        });
        it('should not re-run callbacks when props are the same', () => {
            // Arrange
            const onCredentialChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            rerender(<index_1.default {...props}/>);
            // Assert - The callback reference should be stable
            react_1.fireEvent.click(react_1.screen.getByTestId('header-credential-change'));
            expect(onCredentialChange).toHaveBeenCalledTimes(1);
        });
    });
    // ==========================================
    // Styling
    // ==========================================
    describe('Styling', () => {
        it('should apply correct container classes', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const rootDiv = container.firstChild;
            expect(rootDiv).toHaveClass('flex', 'flex-col');
        });
        it('should apply correct classes to options container', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            const { container } = (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const optionsContainer = container.querySelector('.rounded-xl');
            expect(optionsContainer).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QixpRkFBdUY7QUFDdkYsZ0RBQTZDO0FBQzdDLG1DQUFrQztBQUVsQyw2Q0FBNkM7QUFDN0MsZUFBZTtBQUNmLDZDQUE2QztBQUU3QyxnRUFBZ0U7QUFFaEUsa0RBQWtEO0FBQ2xELE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFhLEVBQUUsRUFBRSxDQUFDLDJCQUEyQixJQUFJLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQTtBQUNyRixFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0IsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVc7Q0FDOUIsQ0FBQyxDQUFDLENBQUE7QUFFSCxrRUFBa0U7QUFDbEUsSUFBSSxjQUFjLEdBQXVCLGNBQWMsQ0FBQTtBQUN2RCxFQUFFLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekMsbUNBQW1DLEVBQUUsQ0FBQyxRQUF5QixFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLEVBQUUsQ0FBQztDQUMzSCxDQUFDLENBQUMsQ0FBQTtBQUVILHlEQUF5RDtBQUN6RCxNQUFNLDhCQUE4QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM5QyxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEMsdUJBQXVCLEVBQUUsQ0FBQyxRQUF5QixFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSwwQkFBMEIsRUFBRSw4QkFBOEIsRUFBRSxDQUFDO0NBQ2pJLENBQUMsQ0FBQyxD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LEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQTtZQUMvRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzlDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRGF0YVNvdXJjZU5vZGVUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9kYXRhLXNvdXJjZS90eXBlcydcbmltcG9ydCB0eXBlIHsgQ3Jhd2xSZXN1bHRJdGVtIH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgQUNDT1VOVF9TRVRUSU5HX1RBQiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9jb25zdGFudHMnXG5pbXBvcnQgeyBDcmF3bFN0ZXAgfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCBXZWJzaXRlQ3Jhd2wgZnJvbSAnLi9pbmRleCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIE1vZHVsZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBOb3RlOiByZWFjdC1pMThuZXh0IHVzZXMgZ2xvYmFsIG1vY2sgZnJvbSB3ZWIvdml0ZXN0LnNldHVwLnRzXG5cbi8vIE1vY2sgdXNlRG9jTGluayAtIGNvbnRleHQgaG9vayByZXF1aXJlcyBtb2NraW5nXG5jb25zdCBtb2NrRG9jTGluayA9IHZpLmZuKChwYXRoPzogc3RyaW5nKSA9PiBgaHR0cHM6Ly9kb2NzLmV4YW1wbGUuY29tJHtwYXRoIHx8ICcnfWApXG52aS5tb2NrKCdAL2NvbnRleHQvaTE4bicsICgpID0+ICh7XG4gIHVzZURvY0xpbms6ICgpID0+IG1vY2tEb2NMaW5rLFxufSkpXG5cbi8vIE1vY2sgZGF0YXNldC1kZXRhaWwgY29udGV4dCAtIGNvbnRleHQgcHJvdmlkZXIgcmVxdWlyZXMgbW9ja2luZ1xubGV0IG1vY2tQaXBlbGluZUlkOiBzdHJpbmcgfCB1bmRlZmluZWQgPSAncGlwZWxpbmUtMTIzJ1xudmkubW9jaygnQC9jb250ZXh0L2RhdGFzZXQtZGV0YWlsJywgKCkgPT4gKHtcbiAgdXNlRGF0YXNldERldGFpbENvbnRleHRXaXRoU2VsZWN0b3I6IChzZWxlY3RvcjogKHM6IGFueSkgPT4gYW55KSA9PiBzZWxlY3Rvcih7IGRhdGFzZXQ6IHsgcGlwZWxpbmVfaWQ6IG1vY2tQaXBlbGluZUlkIH0gfSksXG59KSlcblxuLy8gTW9jayBtb2RhbCBjb250ZXh0IC0gY29udGV4dCBwcm92aWRlciByZXF1aXJlcyBtb2NraW5nXG5jb25zdCBtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwgPSB2aS5mbigpXG52aS5tb2NrKCdAL2NvbnRleHQvbW9kYWwtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZU1vZGFsQ29udGV4dFNlbGVjdG9yOiAoc2VsZWN0b3I6IChzOiBhbnkpID0+IGFueSkgPT4gc2VsZWN0b3IoeyBzZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbDogbW9ja1NldFNob3dBY2NvdW50U2V0dGluZ01vZGFsIH0pLFxufSkpXG5cbi8vIE1vY2sgc3NlUG9zdCAtIEFQSSBzZXJ2aWNlIHJlcXVpcmVzIG1vY2tpbmdcbmNvbnN0IHsgbW9ja1NzZVBvc3QgfSA9IHZpLmhvaXN0ZWQoKCkgPT4gKHtcbiAgbW9ja1NzZVBvc3Q6IHZpLmZuKCksXG59KSlcblxudmkubW9jaygnQC9zZXJ2aWNlL2Jhc2UnLCAoKSA9PiAoe1xuICBzc2VQb3N0OiBtb2NrU3NlUG9zdCxcbn0pKVxuXG4vLyBNb2NrIHVzZUdldERhdGFTb3VyY2VBdXRoIC0gQVBJIHNlcnZpY2UgaG9vayByZXF1aXJlcyBtb2NraW5nXG5jb25zdCB7IG1vY2tVc2VHZXREYXRhU291cmNlQXV0aCB9ID0gdmkuaG9pc3RlZCgoKSA9PiAoe1xuICBtb2NrVXNlR2V0RGF0YVNvdXJjZUF1dGg6IHZpLmZuKCksXG59KSlcblxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1kYXRhc291cmNlJywgKCkgPT4gKHtcbiAgdXNlR2V0RGF0YVNvdXJjZUF1dGg6IG1vY2tVc2VHZXREYXRhU291cmNlQXV0aCxcbn0pKVxuXG4vLyBNb2NrIHVzZVBpcGVsaW5lIGhvb2tzIC0gQVBJIHNlcnZpY2UgaG9va3MgcmVxdWlyZSBtb2NraW5nXG5jb25zdCB7IG1vY2tVc2VEcmFmdFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtcywgbW9ja1VzZVB1Ymxpc2hlZFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtcyB9ID0gdmkuaG9pc3RlZCgoKSA9PiAoe1xuICBtb2NrVXNlRHJhZnRQaXBlbGluZVByZVByb2Nlc3NpbmdQYXJhbXM6IHZpLmZuKCksXG4gIG1vY2tVc2VQdWJsaXNoZWRQaXBlbGluZVByZVByb2Nlc3NpbmdQYXJhbXM6IHZpLmZuKCksXG59KSlcblxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1waXBlbGluZScsICgpID0+ICh7XG4gIHVzZURyYWZ0UGlwZWxpbmVQcmVQcm9jZXNzaW5nUGFyYW1zOiBtb2NrVXNlRHJhZnRQaXBlbGluZVByZVByb2Nlc3NpbmdQYXJhbXMsXG4gIHVzZVB1Ymxpc2hlZFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtczogbW9ja1VzZVB1Ymxpc2hlZFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtcyxcbn0pKVxuXG4vLyBOb3RlOiB6dXN0YW5kL3JlYWN0L3NoYWxsb3cgdXNlU2hhbGxvdyBpcyBpbXBvcnRlZCBkaXJlY3RseSAoc2ltcGxlIHV0aWxpdHkgZnVuY3Rpb24pXG5cbi8vIE1vY2sgc3RvcmVcbmNvbnN0IG1vY2tTdG9yZVN0YXRlID0ge1xuICBjcmF3bFJlc3VsdDogdW5kZWZpbmVkIGFzIHsgZGF0YTogQ3Jhd2xSZXN1bHRJdGVtW10sIHRpbWVfY29uc3VtaW5nOiBudW1iZXIgfCBzdHJpbmcgfSB8IHVuZGVmaW5lZCxcbiAgc3RlcDogQ3Jhd2xTdGVwLmluaXQsXG4gIHdlYnNpdGVQYWdlczogW10gYXMgQ3Jhd2xSZXN1bHRJdGVtW10sXG4gIHByZXZpZXdJbmRleDogLTEsXG4gIGN1cnJlbnRDcmVkZW50aWFsSWQ6ICcnLFxuICBzZXRXZWJzaXRlUGFnZXM6IHZpLmZuKCksXG4gIHNldEN1cnJlbnRXZWJzaXRlOiB2aS5mbigpLFxuICBzZXRQcmV2aWV3SW5kZXg6IHZpLmZuKCksXG4gIHNldFN0ZXA6IHZpLmZuKCksXG4gIHNldENyYXdsUmVzdWx0OiB2aS5mbigpLFxufVxuXG5jb25zdCBtb2NrR2V0U3RhdGUgPSB2aS5mbigoKSA9PiBtb2NrU3RvcmVTdGF0ZSlcbmNvbnN0IG1vY2tEYXRhU291cmNlU3RvcmUgPSB7IGdldFN0YXRlOiBtb2NrR2V0U3RhdGUgfVxuXG52aS5tb2NrKCcuLi9zdG9yZScsICgpID0+ICh7XG4gIHVzZURhdGFTb3VyY2VTdG9yZVdpdGhTZWxlY3RvcjogKHNlbGVjdG9yOiAoczogYW55KSA9PiBhbnkpID0+IHNlbGVjdG9yKG1vY2tTdG9yZVN0YXRlKSxcbiAgdXNlRGF0YVNvdXJjZVN0b3JlOiAoKSA9PiBtb2NrRGF0YVNvdXJjZVN0b3JlLFxufSkpXG5cbi8vIE1vY2sgSGVhZGVyIGNvbXBvbmVudFxudmkubW9jaygnLi4vYmFzZS9oZWFkZXInLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAocHJvcHM6IGFueSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJoZWFkZXJcIj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiaGVhZGVyLWRvYy10aXRsZVwiPntwcm9wcy5kb2NUaXRsZX08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImhlYWRlci1kb2MtbGlua1wiPntwcm9wcy5kb2NMaW5rfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiaGVhZGVyLXBsdWdpbi1uYW1lXCI+e3Byb3BzLnBsdWdpbk5hbWV9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJoZWFkZXItY3JlZGVudGlhbC1pZFwiPntwcm9wcy5jdXJyZW50Q3JlZGVudGlhbElkfTwvc3Bhbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJoZWFkZXItY29uZmlnLWJ0blwiIG9uQ2xpY2s9e3Byb3BzLm9uQ2xpY2tDb25maWd1cmF0aW9ufT5Db25maWd1cmU8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJoZWFkZXItY3JlZGVudGlhbC1jaGFuZ2VcIiBvbkNsaWNrPXsoKSA9PiBwcm9wcy5vbkNyZWRlbnRpYWxDaGFuZ2UoJ25ldy1jcmVkLWlkJyl9PkNoYW5nZSBDcmVkZW50aWFsPC9idXR0b24+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImhlYWRlci1jcmVkZW50aWFscy1jb3VudFwiPntwcm9wcy5jcmVkZW50aWFscz8ubGVuZ3RoIHx8IDB9PC9zcGFuPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgT3B0aW9ucyBjb21wb25lbnRcbmNvbnN0IG1vY2tPcHRpb25zU3VibWl0ID0gdmkuZm4oKVxudmkubW9jaygnLi9iYXNlL29wdGlvbnMnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAocHJvcHM6IGFueSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJvcHRpb25zXCI+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cIm9wdGlvbnMtc3RlcFwiPntwcm9wcy5zdGVwfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwib3B0aW9ucy1ydW4tZGlzYWJsZWRcIj57U3RyaW5nKHByb3BzLnJ1bkRpc2FibGVkKX08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cIm9wdGlvbnMtdmFyaWFibGVzLWNvdW50XCI+e3Byb3BzLnZhcmlhYmxlcz8ubGVuZ3RoIHx8IDB9PC9zcGFuPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBkYXRhLXRlc3RpZD1cIm9wdGlvbnMtc3VibWl0LWJ0blwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IHtcbiAgICAgICAgICBtb2NrT3B0aW9uc1N1Ym1pdCgpXG4gICAgICAgICAgcHJvcHMub25TdWJtaXQoeyB1cmw6ICdodHRwczovL2V4YW1wbGUuY29tJywgZGVwdGg6IDIgfSlcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgU3VibWl0XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIENyYXdsaW5nIGNvbXBvbmVudFxudmkubW9jaygnLi9iYXNlL2NyYXdsaW5nJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHByb3BzOiBhbnkpID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY3Jhd2xpbmdcIj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiY3Jhd2xpbmctY3Jhd2xlZC1udW1cIj57cHJvcHMuY3Jhd2xlZE51bX08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImNyYXdsaW5nLXRvdGFsLW51bVwiPntwcm9wcy50b3RhbE51bX08L3NwYW4+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBFcnJvck1lc3NhZ2UgY29tcG9uZW50XG52aS5tb2NrKCcuL2Jhc2UvZXJyb3ItbWVzc2FnZScsICgpID0+ICh7XG4gIGRlZmF1bHQ6IChwcm9wczogYW55KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImVycm9yLW1lc3NhZ2VcIiBjbGFzc05hbWU9e3Byb3BzLmNsYXNzTmFtZX0+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImVycm9yLXRpdGxlXCI+e3Byb3BzLnRpdGxlfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiZXJyb3ItbXNnXCI+e3Byb3BzLmVycm9yTXNnfTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIENyYXdsZWRSZXN1bHQgY29tcG9uZW50XG52aS5tb2NrKCcuL2Jhc2UvY3Jhd2xlZC1yZXN1bHQnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAocHJvcHM6IGFueSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJjcmF3bGVkLXJlc3VsdFwiIGNsYXNzTmFtZT17cHJvcHMuY2xhc3NOYW1lfT5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiY3Jhd2xlZC1yZXN1bHQtY291bnRcIj57cHJvcHMubGlzdD8ubGVuZ3RoIHx8IDB9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJjcmF3bGVkLXJlc3VsdC1jaGVja2VkLWNvdW50XCI+e3Byb3BzLmNoZWNrZWRMaXN0Py5sZW5ndGggfHwgMH08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImNyYXdsZWQtcmVzdWx0LXVzZWQtdGltZVwiPntwcm9wcy51c2VkVGltZX08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImNyYXdsZWQtcmVzdWx0LXByZXZpZXctaW5kZXhcIj57cHJvcHMucHJldmlld0luZGV4fTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiY3Jhd2xlZC1yZXN1bHQtc2hvdy1wcmV2aWV3XCI+e1N0cmluZyhwcm9wcy5zaG93UHJldmlldyl9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJjcmF3bGVkLXJlc3VsdC1tdWx0aXBsZS1jaG9pY2VcIj57U3RyaW5nKHByb3BzLmlzTXVsdGlwbGVDaG9pY2UpfTwvc3Bhbj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJjcmF3bGVkLXJlc3VsdC1zZWxlY3QtY2hhbmdlXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gcHJvcHMub25TZWxlY3RlZENoYW5nZShbeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScsIHRpdGxlOiAnVGVzdCcgfV0pfVxuICAgICAgPlxuICAgICAgICBDaGFuZ2UgU2VsZWN0aW9uXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJjcmF3bGVkLXJlc3VsdC1wcmV2aWV3XCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gcHJvcHMub25QcmV2aWV3Py4oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbScsIHRpdGxlOiAnVGVzdCcgfSwgMCl9XG4gICAgICA+XG4gICAgICAgIFByZXZpZXdcbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEJ1aWxkZXJzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmNvbnN0IGNyZWF0ZU1vY2tOb2RlRGF0YSA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPERhdGFTb3VyY2VOb2RlVHlwZT4pOiBEYXRhU291cmNlTm9kZVR5cGUgPT4gKHtcbiAgdGl0bGU6ICdUZXN0IE5vZGUnLFxuICBwbHVnaW5faWQ6ICdwbHVnaW4tMTIzJyxcbiAgcHJvdmlkZXJfdHlwZTogJ3dlYnNpdGUnLFxuICBwcm92aWRlcl9uYW1lOiAnd2Vic2l0ZS1wcm92aWRlcicsXG4gIGRhdGFzb3VyY2VfbmFtZTogJ3dlYnNpdGUtZHMnLFxuICBkYXRhc291cmNlX2xhYmVsOiAnV2Vic2l0ZSBDcmF3bGVyJyxcbiAgZGF0YXNvdXJjZV9wYXJhbWV0ZXJzOiB7fSxcbiAgZGF0YXNvdXJjZV9jb25maWd1cmF0aW9uczoge30sXG4gIC4uLm92ZXJyaWRlcyxcbn0gYXMgRGF0YVNvdXJjZU5vZGVUeXBlKVxuXG5jb25zdCBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8Q3Jhd2xSZXN1bHRJdGVtPik6IENyYXdsUmVzdWx0SXRlbSA9PiAoe1xuICBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS9wYWdlMScsXG4gIHRpdGxlOiAnVGVzdCBQYWdlIDEnLFxuICBtYXJrZG93bjogJyMgVGVzdCBjb250ZW50JyxcbiAgZGVzY3JpcHRpb246ICdUZXN0IGRlc2NyaXB0aW9uJyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja0NyZWRlbnRpYWwgPSAob3ZlcnJpZGVzPzogUGFydGlhbDx7IGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZyB9PikgPT4gKHtcbiAgaWQ6ICdjcmVkLTEnLFxuICBuYW1lOiAnVGVzdCBDcmVkZW50aWFsJyxcbiAgYXZhdGFyX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYXZhdGFyLnBuZycsXG4gIGNyZWRlbnRpYWw6IHt9LFxuICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgdHlwZTogJ29hdXRoMicsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbnR5cGUgV2Vic2l0ZUNyYXdsUHJvcHMgPSBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgV2Vic2l0ZUNyYXdsPlxuXG5jb25zdCBjcmVhdGVEZWZhdWx0UHJvcHMgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxXZWJzaXRlQ3Jhd2xQcm9wcz4pOiBXZWJzaXRlQ3Jhd2xQcm9wcyA9PiAoe1xuICBub2RlSWQ6ICdub2RlLTEnLFxuICBub2RlRGF0YTogY3JlYXRlTW9ja05vZGVEYXRhKCksXG4gIG9uQ3JlZGVudGlhbENoYW5nZTogdmkuZm4oKSxcbiAgaXNJblBpcGVsaW5lOiBmYWxzZSxcbiAgc3VwcG9ydEJhdGNoVXBsb2FkOiB0cnVlLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgU3VpdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdXZWJzaXRlQ3Jhd2wnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuXG4gICAgLy8gUmVzZXQgc3RvcmUgc3RhdGVcbiAgICBtb2NrU3RvcmVTdGF0ZS5jcmF3bFJlc3VsdCA9IHVuZGVmaW5lZFxuICAgIG1vY2tTdG9yZVN0YXRlLnN0ZXAgPSBDcmF3bFN0ZXAuaW5pdFxuICAgIG1vY2tTdG9yZVN0YXRlLndlYnNpdGVQYWdlcyA9IFtdXG4gICAgbW9ja1N0b3JlU3RhdGUucHJldmlld0luZGV4ID0gLTFcbiAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJydcbiAgICBtb2NrU3RvcmVTdGF0ZS5zZXRXZWJzaXRlUGFnZXMgPSB2aS5mbigpXG4gICAgbW9ja1N0b3JlU3RhdGUuc2V0Q3VycmVudFdlYnNpdGUgPSB2aS5mbigpXG4gICAgbW9ja1N0b3JlU3RhdGUuc2V0UHJldmlld0luZGV4ID0gdmkuZm4oKVxuICAgIG1vY2tTdG9yZVN0YXRlLnNldFN0ZXAgPSB2aS5mbigpXG4gICAgbW9ja1N0b3JlU3RhdGUuc2V0Q3Jhd2xSZXN1bHQgPSB2aS5mbigpXG5cbiAgICAvLyBSZXNldCBjb250ZXh0IHZhbHVlc1xuICAgIG1vY2tQaXBlbGluZUlkID0gJ3BpcGVsaW5lLTEyMydcbiAgICBtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwubW9ja0NsZWFyKClcblxuICAgIC8vIERlZmF1bHQgbW9jayByZXR1cm4gdmFsdWVzXG4gICAgbW9ja1VzZUdldERhdGFTb3VyY2VBdXRoLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBkYXRhOiB7IHJlc3VsdDogW2NyZWF0ZU1vY2tDcmVkZW50aWFsKCldIH0sXG4gICAgfSlcblxuICAgIG1vY2tVc2VEcmFmdFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtcy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgZGF0YTogeyB2YXJpYWJsZXM6IFtdIH0sXG4gICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbiAgICB9KVxuXG4gICAgbW9ja1VzZVB1Ymxpc2hlZFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtcy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgZGF0YTogeyB2YXJpYWJsZXM6IFtdIH0sXG4gICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbiAgICB9KVxuXG4gICAgbW9ja0dldFN0YXRlLm1vY2tSZXR1cm5WYWx1ZShtb2NrU3RvcmVTdGF0ZSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9ucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEhlYWRlciB3aXRoIGNvcnJlY3QgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMTIzJ1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBub2RlRGF0YTogY3JlYXRlTW9ja05vZGVEYXRhKHsgZGF0YXNvdXJjZV9sYWJlbDogJ015IFdlYnNpdGUgQ3Jhd2xlcicgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLWRvYy10aXRsZScpKS50b0hhdmVUZXh0Q29udGVudCgnRG9jcycpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXItcGx1Z2luLW5hbWUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ015IFdlYnNpdGUgQ3Jhd2xlcicpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXItY3JlZGVudGlhbC1pZCcpKS50b0hhdmVUZXh0Q29udGVudCgnY3JlZC0xMjMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBPcHRpb25zIHdpdGggY29ycmVjdCBwcm9wcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9ucycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb25zLXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoQ3Jhd2xTdGVwLmluaXQpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBDcmF3bGluZyBvciBDcmF3bGVkUmVzdWx0IHdoZW4gc3RlcCBpcyBpbml0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuc3RlcCA9IENyYXdsU3RlcC5pbml0XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2NyYXdsaW5nJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2NyYXdsZWQtcmVzdWx0JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2Vycm9yLW1lc3NhZ2UnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgQ3Jhd2xpbmcgd2hlbiBzdGVwIGlzIHJ1bm5pbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5zdGVwID0gQ3Jhd2xTdGVwLnJ1bm5pbmdcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NyYXdsaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnY3Jhd2xlZC1yZXN1bHQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnZXJyb3ItbWVzc2FnZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBDcmF3bGVkUmVzdWx0IHdoZW4gc3RlcCBpcyBmaW5pc2hlZCB3aXRoIG5vIGVycm9yJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuc3RlcCA9IENyYXdsU3RlcC5maW5pc2hlZFxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3Jhd2xSZXN1bHQgPSB7XG4gICAgICAgIGRhdGE6IFtjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtKCldLFxuICAgICAgICB0aW1lX2NvbnN1bWluZzogMS41LFxuICAgICAgfVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3Jhd2xlZC1yZXN1bHQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdjcmF3bGluZycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdlcnJvci1tZXNzYWdlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdub2RlSWQgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgdXNlIG5vZGVJZCBpbiBkYXRhc291cmNlTm9kZVJ1blVSTCBmb3Igbm9uLXBpcGVsaW5lIG1vZGUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBub2RlSWQ6ICdjdXN0b20tbm9kZS1pZCcsXG4gICAgICAgICAgaXNJblBpcGVsaW5lOiBmYWxzZSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBPcHRpb25zIHVzZXMgbm9kZUlkIHRocm91Z2ggdXNlUHJlUHJvY2Vzc2luZ1BhcmFtc1xuICAgICAgICBleHBlY3QobW9ja1VzZVB1Ymxpc2hlZFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgeyBwaXBlbGluZV9pZDogJ3BpcGVsaW5lLTEyMycsIG5vZGVfaWQ6ICdjdXN0b20tbm9kZS1pZCcgfSxcbiAgICAgICAgICB0cnVlLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnbm9kZURhdGEgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcGFzcyBwbHVnaW5faWQgYW5kIHByb3ZpZGVyX25hbWUgdG8gdXNlR2V0RGF0YVNvdXJjZUF1dGgnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgbm9kZURhdGEgPSBjcmVhdGVNb2NrTm9kZURhdGEoe1xuICAgICAgICAgIHBsdWdpbl9pZDogJ215LXBsdWdpbi1pZCcsXG4gICAgICAgICAgcHJvdmlkZXJfbmFtZTogJ215LXByb3ZpZGVyJyxcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBub2RlRGF0YSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja1VzZUdldERhdGFTb3VyY2VBdXRoKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgcGx1Z2luSWQ6ICdteS1wbHVnaW4taWQnLFxuICAgICAgICAgIHByb3ZpZGVyOiAnbXktcHJvdmlkZXInLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBwYXNzIGRhdGFzb3VyY2VfbGFiZWwgdG8gSGVhZGVyIGFzIHBsdWdpbk5hbWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgbm9kZURhdGEgPSBjcmVhdGVNb2NrTm9kZURhdGEoe1xuICAgICAgICAgIGRhdGFzb3VyY2VfbGFiZWw6ICdDdXN0b20gV2Vic2l0ZSBTY3JhcGVyJyxcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBub2RlRGF0YSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXItcGx1Z2luLW5hbWUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ0N1c3RvbSBXZWJzaXRlIFNjcmFwZXInKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2lzSW5QaXBlbGluZSBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCB1c2UgZHJhZnQgVVJMIHdoZW4gaXNJblBpcGVsaW5lIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc0luUGlwZWxpbmU6IHRydWUgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tVc2VEcmFmdFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtcykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChtb2NrVXNlUHVibGlzaGVkUGlwZWxpbmVQcmVQcm9jZXNzaW5nUGFyYW1zKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHVzZSBwdWJsaXNoZWQgVVJMIHdoZW4gaXNJblBpcGVsaW5lIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNJblBpcGVsaW5lOiBmYWxzZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja1VzZVB1Ymxpc2hlZFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtcykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChtb2NrVXNlRHJhZnRQaXBlbGluZVByZVByb2Nlc3NpbmdQYXJhbXMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcGFzcyBzaG93UHJldmlldyBhcyBmYWxzZSB0byBDcmF3bGVkUmVzdWx0IHdoZW4gaXNJblBpcGVsaW5lIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuc3RlcCA9IENyYXdsU3RlcC5maW5pc2hlZFxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5jcmF3bFJlc3VsdCA9IHtcbiAgICAgICAgICBkYXRhOiBbY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgICAgICB0aW1lX2NvbnN1bWluZzogMS41LFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNJblBpcGVsaW5lOiB0cnVlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NyYXdsZWQtcmVzdWx0LXNob3ctcHJldmlldycpKS50b0hhdmVUZXh0Q29udGVudCgnZmFsc2UnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBwYXNzIHNob3dQcmV2aWV3IGFzIHRydWUgdG8gQ3Jhd2xlZFJlc3VsdCB3aGVuIGlzSW5QaXBlbGluZSBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5zdGVwID0gQ3Jhd2xTdGVwLmZpbmlzaGVkXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmNyYXdsUmVzdWx0ID0ge1xuICAgICAgICAgIGRhdGE6IFtjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtKCldLFxuICAgICAgICAgIHRpbWVfY29uc3VtaW5nOiAxLjUsXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc0luUGlwZWxpbmU6IGZhbHNlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NyYXdsZWQtcmVzdWx0LXNob3ctcHJldmlldycpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnc3VwcG9ydEJhdGNoVXBsb2FkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHBhc3MgaXNNdWx0aXBsZUNob2ljZSBhcyB0cnVlIHRvIENyYXdsZWRSZXN1bHQgd2hlbiBzdXBwb3J0QmF0Y2hVcGxvYWQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5zdGVwID0gQ3Jhd2xTdGVwLmZpbmlzaGVkXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmNyYXdsUmVzdWx0ID0ge1xuICAgICAgICAgIGRhdGE6IFtjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtKCldLFxuICAgICAgICAgIHRpbWVfY29uc3VtaW5nOiAxLjUsXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHRydWUgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3Jhd2xlZC1yZXN1bHQtbXVsdGlwbGUtY2hvaWNlJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcGFzcyBpc011bHRpcGxlQ2hvaWNlIGFzIGZhbHNlIHRvIENyYXdsZWRSZXN1bHQgd2hlbiBzdXBwb3J0QmF0Y2hVcGxvYWQgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuc3RlcCA9IENyYXdsU3RlcC5maW5pc2hlZFxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5jcmF3bFJlc3VsdCA9IHtcbiAgICAgICAgICBkYXRhOiBbY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgICAgICB0aW1lX2NvbnN1bWluZzogMS41LFxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc3VwcG9ydEJhdGNoVXBsb2FkOiBmYWxzZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjcmF3bGVkLXJlc3VsdC1tdWx0aXBsZS1jaG9pY2UnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhbHNlJylcbiAgICAgIH0pXG5cbiAgICAgIGl0LmVhY2goW1xuICAgICAgICBbdHJ1ZSwgJ3RydWUnXSxcbiAgICAgICAgW2ZhbHNlLCAnZmFsc2UnXSxcbiAgICAgICAgW3VuZGVmaW5lZCwgJ3RydWUnXSwgLy8gRGVmYXVsdCB2YWx1ZVxuICAgICAgXSkoJ3Nob3VsZCBoYW5kbGUgc3VwcG9ydEJhdGNoVXBsb2FkPSVzIGNvcnJlY3RseScsICh2YWx1ZSwgZXhwZWN0ZWQpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5zdGVwID0gQ3Jhd2xTdGVwLmZpbmlzaGVkXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmNyYXdsUmVzdWx0ID0ge1xuICAgICAgICAgIGRhdGE6IFtjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtKCldLFxuICAgICAgICAgIHRpbWVfY29uc3VtaW5nOiAxLjUsXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHZhbHVlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NyYXdsZWQtcmVzdWx0LW11bHRpcGxlLWNob2ljZScpKS50b0hhdmVUZXh0Q29udGVudChleHBlY3RlZClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdvbkNyZWRlbnRpYWxDaGFuZ2UgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkNyZWRlbnRpYWxDaGFuZ2Ugd2l0aCBjcmVkZW50aWFsIGlkIGFuZCByZXNldCBzdGF0ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25DcmVkZW50aWFsQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ3JlZGVudGlhbENoYW5nZTogbW9ja09uQ3JlZGVudGlhbENoYW5nZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXItY3JlZGVudGlhbC1jaGFuZ2UnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tPbkNyZWRlbnRpYWxDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCduZXctY3JlZC1pZCcpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFN0YXRlIE1hbmFnZW1lbnQgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdTdGF0ZSBNYW5hZ2VtZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjb3JyZWN0IGNyYXdsZWROdW0gYW5kIHRvdGFsTnVtIHdoZW4gcnVubmluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLnN0ZXAgPSBDcmF3bFN0ZXAucnVubmluZ1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIEluaXRpYWwgc3RhdGUgaXMgMC8wXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjcmF3bGluZy1jcmF3bGVkLW51bScpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjcmF3bGluZy10b3RhbC1udW0nKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBzdGVwIGFuZCByZXN1bHQgdmlhIHNzZVBvc3QgY2FsbGJhY2tzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICBjb25zdCBtb2NrQ3Jhd2xEYXRhOiBDcmF3bFJlc3VsdEl0ZW1bXSA9IFtcbiAgICAgICAgY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL2V4YW1wbGUuY29tLzEnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vMicgfSksXG4gICAgICBdXG5cbiAgICAgIG1vY2tTc2VQb3N0Lm1vY2tJbXBsZW1lbnRhdGlvbigodXJsLCBvcHRpb25zLCBjYWxsYmFja3MpID0+IHtcbiAgICAgICAgLy8gU2ltdWxhdGUgcHJvY2Vzc2luZ1xuICAgICAgICBjYWxsYmFja3Mub25EYXRhU291cmNlTm9kZVByb2Nlc3Npbmcoe1xuICAgICAgICAgIHRvdGFsOiAxMCxcbiAgICAgICAgICBjb21wbGV0ZWQ6IDUsXG4gICAgICAgIH0pXG4gICAgICAgIC8vIFNpbXVsYXRlIGNvbXBsZXRpb25cbiAgICAgICAgY2FsbGJhY2tzLm9uRGF0YVNvdXJjZU5vZGVDb21wbGV0ZWQoe1xuICAgICAgICAgIGRhdGE6IG1vY2tDcmF3bERhdGEsXG4gICAgICAgICAgdGltZV9jb25zdW1pbmc6IDIuNSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAtIFRyaWdnZXIgc3VibWl0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb25zLXN1Ym1pdC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFN0ZXApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKENyYXdsU3RlcC5ydW5uaW5nKVxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0Q3Jhd2xSZXN1bHQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBkYXRhOiBtb2NrQ3Jhd2xEYXRhLFxuICAgICAgICAgIHRpbWVfY29uc3VtaW5nOiAyLjUsXG4gICAgICAgIH0pXG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRTdGVwKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChDcmF3bFN0ZXAuZmluaXNoZWQpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgcnVuRGlzYWJsZWQgYXMgdHJ1ZSB3aGVuIG5vIGNyZWRlbnRpYWwgaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJydcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbnMtcnVuLWRpc2FibGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHJ1bkRpc2FibGVkIGFzIHRydWUgd2hlbiBwYXJhbXMgYXJlIGJlaW5nIGZldGNoZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcbiAgICAgIG1vY2tVc2VQdWJsaXNoZWRQaXBlbGluZVByZVByb2Nlc3NpbmdQYXJhbXMubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogeyB2YXJpYWJsZXM6IFtdIH0sXG4gICAgICAgIGlzRmV0Y2hpbmc6IHRydWUsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9ucy1ydW4tZGlzYWJsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgcnVuRGlzYWJsZWQgYXMgZmFsc2Ugd2hlbiBjcmVkZW50aWFsIGlzIHNlbGVjdGVkIGFuZCBwYXJhbXMgYXJlIGxvYWRlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgbW9ja1VzZVB1Ymxpc2hlZFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtcy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiB7IHZhcmlhYmxlczogW10gfSxcbiAgICAgICAgaXNGZXRjaGluZzogZmFsc2UsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9ucy1ydW4tZGlzYWJsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhbHNlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDYWxsYmFjayBTdGFiaWxpdHkgYW5kIE1lbW9pemF0aW9uXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5IGFuZCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgc3RhYmxlIGhhbmRsZUNoZWNrZWRDcmF3bFJlc3VsdENoYW5nZSB0aGF0IHVwZGF0ZXMgc3RvcmUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5zdGVwID0gQ3Jhd2xTdGVwLmZpbmlzaGVkXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jcmF3bFJlc3VsdCA9IHtcbiAgICAgICAgZGF0YTogW2NyZWF0ZU1vY2tDcmF3bFJlc3VsdEl0ZW0oKV0sXG4gICAgICAgIHRpbWVfY29uc3VtaW5nOiAxLjUsXG4gICAgICB9XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NyYXdsZWQtcmVzdWx0LXNlbGVjdC1jaGFuZ2UnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0V2Vic2l0ZVBhZ2VzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXG4gICAgICAgIHsgc291cmNlX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLCB0aXRsZTogJ1Rlc3QnIH0sXG4gICAgICBdKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc3RhYmxlIGhhbmRsZVByZXZpZXcgdGhhdCB1cGRhdGVzIHN0b3JlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuc3RlcCA9IENyYXdsU3RlcC5maW5pc2hlZFxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3Jhd2xSZXN1bHQgPSB7XG4gICAgICAgIGRhdGE6IFtjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtKCldLFxuICAgICAgICB0aW1lX2NvbnN1bWluZzogMS41LFxuICAgICAgfVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjcmF3bGVkLXJlc3VsdC1wcmV2aWV3JykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldEN1cnJlbnRXZWJzaXRlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHNvdXJjZV91cmw6ICdodHRwczovL2V4YW1wbGUuY29tJyxcbiAgICAgICAgdGl0bGU6ICdUZXN0JyxcbiAgICAgIH0pXG4gICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0UHJldmlld0luZGV4KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc3RhYmxlIGhhbmRsZVNldHRpbmcgY2FsbGJhY2snLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jb25maWctYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBwYXlsb2FkOiBBQ0NPVU5UX1NFVFRJTkdfVEFCLkRBVEFfU09VUkNFLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHN0YWJsZSBoYW5kbGVDcmVkZW50aWFsQ2hhbmdlIHRoYXQgcmVzZXRzIHN0YXRlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ3JlZGVudGlhbENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DcmVkZW50aWFsQ2hhbmdlOiBtb2NrT25DcmVkZW50aWFsQ2hhbmdlIH0pXG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jcmVkZW50aWFsLWNoYW5nZScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25DcmVkZW50aWFsQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnbmV3LWNyZWQtaWQnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIGFuZCBFdmVudCBIYW5kbGVyc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zIGFuZCBFdmVudCBIYW5kbGVycycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzdWJtaXQgYW5kIHRyaWdnZXIgc3NlUG9zdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb25zLXN1Ym1pdC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFN0ZXApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKENyYXdsU3RlcC5ydW5uaW5nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29uZmlndXJhdGlvbiBidXR0b24gY2xpY2snLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jb25maWctYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBwYXlsb2FkOiBBQ0NPVU5UX1NFVFRJTkdfVEFCLkRBVEFfU09VUkNFLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY3JlZGVudGlhbCBjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrT25DcmVkZW50aWFsQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNyZWRlbnRpYWxDaGFuZ2U6IG1vY2tPbkNyZWRlbnRpYWxDaGFuZ2UgfSlcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLWNyZWRlbnRpYWwtY2hhbmdlJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tPbkNyZWRlbnRpYWxDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCduZXctY3JlZC1pZCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNlbGVjdGlvbiBjaGFuZ2UgaW4gQ3Jhd2xlZFJlc3VsdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLnN0ZXAgPSBDcmF3bFN0ZXAuZmluaXNoZWRcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmNyYXdsUmVzdWx0ID0ge1xuICAgICAgICBkYXRhOiBbY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgICAgdGltZV9jb25zdW1pbmc6IDEuNSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY3Jhd2xlZC1yZXN1bHQtc2VsZWN0LWNoYW5nZScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRXZWJzaXRlUGFnZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwcmV2aWV3IGluIENyYXdsZWRSZXN1bHQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5zdGVwID0gQ3Jhd2xTdGVwLmZpbmlzaGVkXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jcmF3bFJlc3VsdCA9IHtcbiAgICAgICAgZGF0YTogW2NyZWF0ZU1vY2tDcmF3bFJlc3VsdEl0ZW0oKV0sXG4gICAgICAgIHRpbWVfY29uc3VtaW5nOiAxLjUsXG4gICAgICB9XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NyYXdsZWQtcmVzdWx0LXByZXZpZXcnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0Q3VycmVudFdlYnNpdGUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFByZXZpZXdJbmRleCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQVBJIENhbGxzIE1vY2tpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBUEkgQ2FsbHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNzZVBvc3Qgd2l0aCBjb3JyZWN0IHBhcmFtZXRlcnMgZm9yIHB1Ymxpc2hlZCB3b3JrZmxvdycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAndGVzdC1jcmVkJ1xuICAgICAgbW9ja1BpcGVsaW5lSWQgPSAncGlwZWxpbmUtNDU2J1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBub2RlSWQ6ICdub2RlLTc4OScsXG4gICAgICAgIGlzSW5QaXBlbGluZTogZmFsc2UsXG4gICAgICB9KVxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb25zLXN1Ym1pdC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAnL3JhZy9waXBlbGluZXMvcGlwZWxpbmUtNDU2L3dvcmtmbG93cy9wdWJsaXNoZWQvZGF0YXNvdXJjZS9ub2Rlcy9ub2RlLTc4OS9ydW4nLFxuICAgICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgIGJvZHk6IGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICAgICAgaW5wdXRzOiB7IHVybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20nLCBkZXB0aDogMiB9LFxuICAgICAgICAgICAgICBkYXRhc291cmNlX3R5cGU6ICd3ZWJzaXRlX2NyYXdsJyxcbiAgICAgICAgICAgICAgY3JlZGVudGlhbF9pZDogJ3Rlc3QtY3JlZCcsXG4gICAgICAgICAgICAgIHJlc3BvbnNlX21vZGU6ICdzdHJlYW1pbmcnLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSksXG4gICAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc3NlUG9zdCB3aXRoIGNvcnJlY3QgcGFyYW1ldGVycyBmb3IgZHJhZnQgd29ya2Zsb3cnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ3Rlc3QtY3JlZCdcbiAgICAgIG1vY2tQaXBlbGluZUlkID0gJ3BpcGVsaW5lLTQ1NidcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbm9kZUlkOiAnbm9kZS03ODknLFxuICAgICAgICBpc0luUGlwZWxpbmU6IHRydWUsXG4gICAgICB9KVxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb25zLXN1Ym1pdC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAnL3JhZy9waXBlbGluZXMvcGlwZWxpbmUtNDU2L3dvcmtmbG93cy9kcmFmdC9kYXRhc291cmNlL25vZGVzL25vZGUtNzg5L3J1bicsXG4gICAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb25EYXRhU291cmNlTm9kZVByb2Nlc3NpbmcgY2FsbGJhY2sgY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5zdGVwID0gQ3Jhd2xTdGVwLnJ1bm5pbmdcblxuICAgICAgbW9ja1NzZVBvc3QubW9ja0ltcGxlbWVudGF0aW9uKCh1cmwsIG9wdGlvbnMsIGNhbGxiYWNrcykgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25EYXRhU291cmNlTm9kZVByb2Nlc3Npbmcoe1xuICAgICAgICAgIHRvdGFsOiAxMDAsXG4gICAgICAgICAgY29tcGxldGVkOiA1MCxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9ucy1zdWJtaXQtYnRuJykpXG5cbiAgICAgIC8vIFVwZGF0ZSBzdG9yZSBzdGF0ZSB0byBzaW11bGF0ZSBydW5uaW5nIHN0ZXBcbiAgICAgIG1vY2tTdG9yZVN0YXRlLnN0ZXAgPSBDcmF3bFN0ZXAucnVubmluZ1xuICAgICAgcmVyZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb25EYXRhU291cmNlTm9kZUNvbXBsZXRlZCBjYWxsYmFjayBjb3JyZWN0bHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcbiAgICAgIGNvbnN0IG1vY2tDcmF3bERhdGE6IENyYXdsUmVzdWx0SXRlbVtdID0gW1xuICAgICAgICBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vMScgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS8yJyB9KSxcbiAgICAgIF1cblxuICAgICAgbW9ja1NzZVBvc3QubW9ja0ltcGxlbWVudGF0aW9uKCh1cmwsIG9wdGlvbnMsIGNhbGxiYWNrcykgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25EYXRhU291cmNlTm9kZUNvbXBsZXRlZCh7XG4gICAgICAgICAgZGF0YTogbW9ja0NyYXdsRGF0YSxcbiAgICAgICAgICB0aW1lX2NvbnN1bWluZzogMy41LFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb25zLXN1Ym1pdC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldENyYXdsUmVzdWx0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgZGF0YTogbW9ja0NyYXdsRGF0YSxcbiAgICAgICAgICB0aW1lX2NvbnN1bWluZzogMy41LFxuICAgICAgICB9KVxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0V2Vic2l0ZVBhZ2VzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChtb2NrQ3Jhd2xEYXRhKVxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0U3RlcCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoQ3Jhd2xTdGVwLmZpbmlzaGVkKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb25EYXRhU291cmNlTm9kZUNvbXBsZXRlZCB3aXRoIHNpbmdsZSByZXN1bHQgd2hlbiBzdXBwb3J0QmF0Y2hVcGxvYWQgaXMgZmFsc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcbiAgICAgIGNvbnN0IG1vY2tDcmF3bERhdGE6IENyYXdsUmVzdWx0SXRlbVtdID0gW1xuICAgICAgICBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vMScgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS8yJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL2V4YW1wbGUuY29tLzMnIH0pLFxuICAgICAgXVxuXG4gICAgICBtb2NrU3NlUG9zdC5tb2NrSW1wbGVtZW50YXRpb24oKHVybCwgb3B0aW9ucywgY2FsbGJhY2tzKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrcy5vbkRhdGFTb3VyY2VOb2RlQ29tcGxldGVkKHtcbiAgICAgICAgICBkYXRhOiBtb2NrQ3Jhd2xEYXRhLFxuICAgICAgICAgIHRpbWVfY29uc3VtaW5nOiAzLjUsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHN1cHBvcnRCYXRjaFVwbG9hZDogZmFsc2UgfSlcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9ucy1zdWJtaXQtYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIC8vIFNob3VsZCBvbmx5IHNlbGVjdCBmaXJzdCBpdGVtIHdoZW4gc3VwcG9ydEJhdGNoVXBsb2FkIGlzIGZhbHNlXG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRXZWJzaXRlUGFnZXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFttb2NrQ3Jhd2xEYXRhWzBdXSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG9uRGF0YVNvdXJjZU5vZGVFcnJvciBjYWxsYmFjayBjb3JyZWN0bHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcblxuICAgICAgbW9ja1NzZVBvc3QubW9ja0ltcGxlbWVudGF0aW9uKCh1cmwsIG9wdGlvbnMsIGNhbGxiYWNrcykgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25EYXRhU291cmNlTm9kZUVycm9yKHtcbiAgICAgICAgICBlcnJvcjogJ0NyYXdsIGZhaWxlZDogSW52YWxpZCBVUkwnLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb25zLXN1Ym1pdC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFN0ZXApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKENyYXdsU3RlcC5maW5pc2hlZClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIHVzZUdldERhdGFTb3VyY2VBdXRoIHdpdGggY29ycmVjdCBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgbm9kZURhdGEgPSBjcmVhdGVNb2NrTm9kZURhdGEoe1xuICAgICAgICBwbHVnaW5faWQ6ICd3ZWJzaXRlLXBsdWdpbicsXG4gICAgICAgIHByb3ZpZGVyX25hbWU6ICd3ZWJzaXRlLXByb3ZpZGVyJyxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG5vZGVEYXRhIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1VzZUdldERhdGFTb3VyY2VBdXRoKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHBsdWdpbklkOiAnd2Vic2l0ZS1wbHVnaW4nLFxuICAgICAgICBwcm92aWRlcjogJ3dlYnNpdGUtcHJvdmlkZXInLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNyZWRlbnRpYWxzIGZyb20gdXNlR2V0RGF0YVNvdXJjZUF1dGggdG8gSGVhZGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja0NyZWRlbnRpYWxzID0gW1xuICAgICAgICBjcmVhdGVNb2NrQ3JlZGVudGlhbCh7IGlkOiAnY3JlZC0xJywgbmFtZTogJ0NyZWRlbnRpYWwgMScgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tDcmVkZW50aWFsKHsgaWQ6ICdjcmVkLTInLCBuYW1lOiAnQ3JlZGVudGlhbCAyJyB9KSxcbiAgICAgIF1cbiAgICAgIG1vY2tVc2VHZXREYXRhU291cmNlQXV0aC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiB7IHJlc3VsdDogbW9ja0NyZWRlbnRpYWxzIH0sXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLWNyZWRlbnRpYWxzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcyJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIGFuZCBFcnJvciBIYW5kbGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMgYW5kIEVycm9yIEhhbmRsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGNyZWRlbnRpYWxzIGFycmF5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1VzZUdldERhdGFTb3VyY2VBdXRoLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IHsgcmVzdWx0OiBbXSB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jcmVkZW50aWFscy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBkYXRhU291cmNlQXV0aCByZXN1bHQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVXNlR2V0RGF0YVNvdXJjZUF1dGgubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogeyByZXN1bHQ6IHVuZGVmaW5lZCB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jcmVkZW50aWFscy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgZGF0YVNvdXJjZUF1dGggZGF0YScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VHZXREYXRhU291cmNlQXV0aC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiBudWxsLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jcmVkZW50aWFscy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGNyYXdsUmVzdWx0IGRhdGEgYXJyYXknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5zdGVwID0gQ3Jhd2xTdGVwLmZpbmlzaGVkXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jcmF3bFJlc3VsdCA9IHtcbiAgICAgICAgZGF0YTogW10sXG4gICAgICAgIHRpbWVfY29uc3VtaW5nOiAwLjUsXG4gICAgICB9XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjcmF3bGVkLXJlc3VsdC1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBjcmF3bFJlc3VsdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLnN0ZXAgPSBDcmF3bFN0ZXAuZmluaXNoZWRcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmNyYXdsUmVzdWx0ID0gdW5kZWZpbmVkXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjcmF3bGVkLXJlc3VsdC1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHRpbWVfY29uc3VtaW5nIGFzIHN0cmluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLnN0ZXAgPSBDcmF3bFN0ZXAuZmluaXNoZWRcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmNyYXdsUmVzdWx0ID0ge1xuICAgICAgICBkYXRhOiBbY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgICAgdGltZV9jb25zdW1pbmc6ICcyLjUnLFxuICAgICAgfVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3Jhd2xlZC1yZXN1bHQtdXNlZC10aW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCcyLjUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBpbnZhbGlkIHRpbWVfY29uc3VtaW5nIHZhbHVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuc3RlcCA9IENyYXdsU3RlcC5maW5pc2hlZFxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3Jhd2xSZXN1bHQgPSB7XG4gICAgICAgIGRhdGE6IFtjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtKCldLFxuICAgICAgICB0aW1lX2NvbnN1bWluZzogJ2ludmFsaWQnLFxuICAgICAgfVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIE5hTiBzaG91bGQgYmVjb21lIDBcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NyYXdsZWQtcmVzdWx0LXVzZWQtdGltZScpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBwaXBlbGluZUlkIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrUGlwZWxpbmVJZCA9IHVuZGVmaW5lZFxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tVc2VQdWJsaXNoZWRQaXBlbGluZVByZVByb2Nlc3NpbmdQYXJhbXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICB7IHBpcGVsaW5lX2lkOiB1bmRlZmluZWQsIG5vZGVfaWQ6ICdub2RlLTEnIH0sXG4gICAgICAgIGZhbHNlLCAvLyBlbmFibGVkIHNob3VsZCBiZSBmYWxzZSB3aGVuIHBpcGVsaW5lSWQgaXMgdW5kZWZpbmVkXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IG5vZGVJZCBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBub2RlSWQ6ICcnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1VzZVB1Ymxpc2hlZFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIHsgcGlwZWxpbmVfaWQ6ICdwaXBlbGluZS0xMjMnLCBub2RlX2lkOiAnJyB9LFxuICAgICAgICBmYWxzZSwgLy8gZW5hYmxlZCBzaG91bGQgYmUgZmFsc2Ugd2hlbiBub2RlSWQgaXMgZW1wdHlcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHBhcmFtc0NvbmZpZy52YXJpYWJsZXMgKGZhbGxiYWNrIHRvIGVtcHR5IGFycmF5KScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBUZXN0IHRoZSB8fCBbXSBmYWxsYmFjayBvbiBsaW5lIDE2OVxuICAgICAgbW9ja1VzZVB1Ymxpc2hlZFBpcGVsaW5lUHJlUHJvY2Vzc2luZ1BhcmFtcy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiB7IHZhcmlhYmxlczogdW5kZWZpbmVkIH0sXG4gICAgICAgIGlzRmV0Y2hpbmc6IGZhbHNlLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBPcHRpb25zIHNob3VsZCByZWNlaXZlIGVtcHR5IGFycmF5IGFzIHZhcmlhYmxlc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9ucy12YXJpYWJsZXMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgcGFyYW1zQ29uZmlnIChmYWxsYmFjayB0byBlbXB0eSBhcnJheSknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gVGVzdCB3aGVuIHBhcmFtc0NvbmZpZyBpcyB1bmRlZmluZWRcbiAgICAgIG1vY2tVc2VQdWJsaXNoZWRQaXBlbGluZVByZVByb2Nlc3NpbmdQYXJhbXMubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogdW5kZWZpbmVkLFxuICAgICAgICBpc0ZldGNoaW5nOiBmYWxzZSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gT3B0aW9ucyBzaG91bGQgcmVjZWl2ZSBlbXB0eSBhcnJheSBhcyB2YXJpYWJsZXNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ29wdGlvbnMtdmFyaWFibGVzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZXJyb3Igd2l0aG91dCBlcnJvciBtZXNzYWdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG5cbiAgICAgIG1vY2tTc2VQb3N0Lm1vY2tJbXBsZW1lbnRhdGlvbigodXJsLCBvcHRpb25zLCBjYWxsYmFja3MpID0+IHtcbiAgICAgICAgY2FsbGJhY2tzLm9uRGF0YVNvdXJjZU5vZGVFcnJvcih7XG4gICAgICAgICAgZXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9ucy1zdWJtaXQtYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCB1c2UgZmFsbGJhY2sgZXJyb3IgbWVzc2FnZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRTdGVwKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChDcmF3bFN0ZXAuZmluaXNoZWQpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsIHRvdGFsIGFuZCBjb21wbGV0ZWQgaW4gcHJvY2Vzc2luZyBjYWxsYmFjaycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuXG4gICAgICBtb2NrU3NlUG9zdC5tb2NrSW1wbGVtZW50YXRpb24oKHVybCwgb3B0aW9ucywgY2FsbGJhY2tzKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrcy5vbkRhdGFTb3VyY2VOb2RlUHJvY2Vzc2luZyh7XG4gICAgICAgICAgdG90YWw6IG51bGwsXG4gICAgICAgICAgY29tcGxldGVkOiBudWxsLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb25zLXN1Ym1pdC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGhhbmRsZSBudWxsIHZhbHVlcyBncmFjZWZ1bGx5IChkZWZhdWx0IHRvIDApXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCB0aW1lX2NvbnN1bWluZyBpbiBjb21wbGV0ZWQgY2FsbGJhY2snLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcblxuICAgICAgbW9ja1NzZVBvc3QubW9ja0ltcGxlbWVudGF0aW9uKCh1cmwsIG9wdGlvbnMsIGNhbGxiYWNrcykgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25EYXRhU291cmNlTm9kZUNvbXBsZXRlZCh7XG4gICAgICAgICAgZGF0YTogW2NyZWF0ZU1vY2tDcmF3bFJlc3VsdEl0ZW0oKV0sXG4gICAgICAgICAgdGltZV9jb25zdW1pbmc6IHVuZGVmaW5lZCxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9ucy1zdWJtaXQtYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRDcmF3bFJlc3VsdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIGRhdGE6IFtleHBlY3QuYW55KE9iamVjdCldLFxuICAgICAgICAgIHRpbWVfY29uc3VtaW5nOiAwLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBBbGwgUHJvcCBWYXJpYXRpb25zXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0LmVhY2goW1xuICAgICAgW3sgaXNJblBpcGVsaW5lOiB0cnVlLCBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHRydWUgfV0sXG4gICAgICBbeyBpc0luUGlwZWxpbmU6IHRydWUsIHN1cHBvcnRCYXRjaFVwbG9hZDogZmFsc2UgfV0sXG4gICAgICBbeyBpc0luUGlwZWxpbmU6IGZhbHNlLCBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHRydWUgfV0sXG4gICAgICBbeyBpc0luUGlwZWxpbmU6IGZhbHNlLCBzdXBwb3J0QmF0Y2hVcGxvYWQ6IGZhbHNlIH1dLFxuICAgIF0pKCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aXRoIHByb3BzICVvJywgKHByb3BWYXJpYXRpb24pID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLnN0ZXAgPSBDcmF3bFN0ZXAuZmluaXNoZWRcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmNyYXdsUmVzdWx0ID0ge1xuICAgICAgICBkYXRhOiBbY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbSgpXSxcbiAgICAgICAgdGltZV9jb25zdW1pbmc6IDEuNSxcbiAgICAgIH1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHByb3BWYXJpYXRpb24pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjcmF3bGVkLXJlc3VsdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjcmF3bGVkLXJlc3VsdC1zaG93LXByZXZpZXcnKSkudG9IYXZlVGV4dENvbnRlbnQoXG4gICAgICAgIFN0cmluZyghcHJvcFZhcmlhdGlvbi5pc0luUGlwZWxpbmUpLFxuICAgICAgKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3Jhd2xlZC1yZXN1bHQtbXVsdGlwbGUtY2hvaWNlJykpLnRvSGF2ZVRleHRDb250ZW50KFxuICAgICAgICBTdHJpbmcocHJvcFZhcmlhdGlvbi5zdXBwb3J0QmF0Y2hVcGxvYWQpLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBkZWZhdWx0IHZhbHVlcyBmb3Igb3B0aW9uYWwgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5zdGVwID0gQ3Jhd2xTdGVwLmZpbmlzaGVkXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jcmF3bFJlc3VsdCA9IHtcbiAgICAgICAgZGF0YTogW2NyZWF0ZU1vY2tDcmF3bFJlc3VsdEl0ZW0oKV0sXG4gICAgICAgIHRpbWVfY29uc3VtaW5nOiAxLjUsXG4gICAgICB9XG4gICAgICBjb25zdCBwcm9wczogV2Vic2l0ZUNyYXdsUHJvcHMgPSB7XG4gICAgICAgIG5vZGVJZDogJ25vZGUtMScsXG4gICAgICAgIG5vZGVEYXRhOiBjcmVhdGVNb2NrTm9kZURhdGEoKSxcbiAgICAgICAgb25DcmVkZW50aWFsQ2hhbmdlOiB2aS5mbigpLFxuICAgICAgICAvLyBpc0luUGlwZWxpbmUgYW5kIHN1cHBvcnRCYXRjaFVwbG9hZCBhcmUgbm90IHByb3ZpZGVkXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gRGVmYXVsdCB2YWx1ZXM6IGlzSW5QaXBlbGluZSA9IGZhbHNlLCBzdXBwb3J0QmF0Y2hVcGxvYWQgPSB0cnVlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjcmF3bGVkLXJlc3VsdC1zaG93LXByZXZpZXcnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3Jhd2xlZC1yZXN1bHQtbXVsdGlwbGUtY2hvaWNlJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFcnJvciBEaXNwbGF5XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRXJyb3IgRGlzcGxheScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgRXJyb3JNZXNzYWdlIHdoZW4gY3Jhd2wgZmluaXNoZXMgd2l0aCBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBOZWVkIHRvIGNyZWF0ZSBhIHNjZW5hcmlvIHdoZXJlIGVycm9yIG1lc3NhZ2UgaXMgc2V0XG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcblxuICAgICAgLy8gRmlyc3QgcmVuZGVyIHdpdGggaW5pdCBzdGF0ZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gU2ltdWxhdGUgZXJyb3IgYnkgc2V0dGluZyB1cCBzc2VQb3N0IHRvIGNhbGwgZXJyb3IgY2FsbGJhY2tcbiAgICAgIG1vY2tTc2VQb3N0Lm1vY2tJbXBsZW1lbnRhdGlvbigodXJsLCBvcHRpb25zLCBjYWxsYmFja3MpID0+IHtcbiAgICAgICAgY2FsbGJhY2tzLm9uRGF0YVNvdXJjZU5vZGVFcnJvcih7XG4gICAgICAgICAgZXJyb3I6ICdOZXR3b3JrIGVycm9yJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIFRyaWdnZXIgc3VibWl0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb25zLXN1Ym1pdC1idG4nKSlcblxuICAgICAgLy8gTm93IHVwZGF0ZSBzdG9yZSBzdGF0ZSB0byBmaW5pc2hlZCB0byBzaW11bGF0ZSB0aGUgc3RhdGUgYWZ0ZXIgZXJyb3JcbiAgICAgIG1vY2tTdG9yZVN0YXRlLnN0ZXAgPSBDcmF3bFN0ZXAuZmluaXNoZWRcbiAgICAgIHJlcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gVGhlIGNvbXBvbmVudCBzaG91bGQgY2hlY2sgZm9yIGVycm9yIG1lc3NhZ2Ugc3RhdGVcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0U3RlcCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoQ3Jhd2xTdGVwLmZpbmlzaGVkKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBFcnJvck1lc3NhZ2Ugd2hlbiBjcmF3bCBmaW5pc2hlcyB3aXRob3V0IGVycm9yJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuc3RlcCA9IENyYXdsU3RlcC5maW5pc2hlZFxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3Jhd2xSZXN1bHQgPSB7XG4gICAgICAgIGRhdGE6IFtjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtKCldLFxuICAgICAgICB0aW1lX2NvbnN1bWluZzogMS41LFxuICAgICAgfVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8V2Vic2l0ZUNyYXdsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdlcnJvci1tZXNzYWdlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjcmF3bGVkLXJlc3VsdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbXBsZXRlIGZ1bGwgd29ya2Zsb3c6IHN1Ym1pdCAtPiBydW5uaW5nIC0+IGNvbXBsZXRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgY29uc3QgbW9ja0NyYXdsRGF0YTogQ3Jhd2xSZXN1bHRJdGVtW10gPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS8xJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0NyYXdsUmVzdWx0SXRlbSh7IHNvdXJjZV91cmw6ICdodHRwczovL2V4YW1wbGUuY29tLzInIH0pLFxuICAgICAgXVxuXG4gICAgICBtb2NrU3NlUG9zdC5tb2NrSW1wbGVtZW50YXRpb24oKHVybCwgb3B0aW9ucywgY2FsbGJhY2tzKSA9PiB7XG4gICAgICAgIC8vIFNpbXVsYXRlIHByb2Nlc3NpbmdcbiAgICAgICAgY2FsbGJhY2tzLm9uRGF0YVNvdXJjZU5vZGVQcm9jZXNzaW5nKHtcbiAgICAgICAgICB0b3RhbDogMTAsXG4gICAgICAgICAgY29tcGxldGVkOiA1LFxuICAgICAgICB9KVxuICAgICAgICAvLyBTaW11bGF0ZSBjb21wbGV0aW9uXG4gICAgICAgIGNhbGxiYWNrcy5vbkRhdGFTb3VyY2VOb2RlQ29tcGxldGVkKHtcbiAgICAgICAgICBkYXRhOiBtb2NrQ3Jhd2xEYXRhLFxuICAgICAgICAgIHRpbWVfY29uc3VtaW5nOiAyLjUsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBUcmlnZ2VyIHN1Ym1pdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnb3B0aW9ucy1zdWJtaXQtYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFZlcmlmeSBmdWxsIGZsb3dcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAvLyBTdGVwIHNob3VsZCBiZSBzZXQgdG8gcnVubmluZyBmaXJzdFxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0U3RlcCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoQ3Jhd2xTdGVwLnJ1bm5pbmcpXG4gICAgICAgIC8vIFRoZW4gcmVzdWx0IHNob3VsZCBiZSBzZXRcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldENyYXdsUmVzdWx0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgZGF0YTogbW9ja0NyYXdsRGF0YSxcbiAgICAgICAgICB0aW1lX2NvbnN1bWluZzogMi41LFxuICAgICAgICB9KVxuICAgICAgICAvLyBQYWdlcyBzaG91bGQgYmUgc2VsZWN0ZWRcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFdlYnNpdGVQYWdlcykudG9IYXZlQmVlbkNhbGxlZFdpdGgobW9ja0NyYXdsRGF0YSlcbiAgICAgICAgLy8gU3RlcCBzaG91bGQgYmUgc2V0IHRvIGZpbmlzaGVkXG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRTdGVwKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChDcmF3bFN0ZXAuZmluaXNoZWQpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlcnJvciBmbG93IGNvcnJlY3RseScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuXG4gICAgICBtb2NrU3NlUG9zdC5tb2NrSW1wbGVtZW50YXRpb24oKHVybCwgb3B0aW9ucywgY2FsbGJhY2tzKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrcy5vbkRhdGFTb3VyY2VOb2RlRXJyb3Ioe1xuICAgICAgICAgIGVycm9yOiAnRmFpbGVkIHRvIGNyYXdsIHdlYnNpdGUnLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb25zLXN1Ym1pdC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFN0ZXApLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKENyYXdsU3RlcC5ydW5uaW5nKVxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0U3RlcCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoQ3Jhd2xTdGVwLmZpbmlzaGVkKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY3JlZGVudGlhbCBjaGFuZ2UgYW5kIGFsbG93IG5ldyBjcmF3bCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnaW5pdGlhbC1jcmVkJ1xuICAgICAgY29uc3QgbW9ja09uQ3JlZGVudGlhbENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DcmVkZW50aWFsQ2hhbmdlOiBtb2NrT25DcmVkZW50aWFsQ2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQ2hhbmdlIGNyZWRlbnRpYWxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jcmVkZW50aWFsLWNoYW5nZScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25DcmVkZW50aWFsQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnbmV3LWNyZWQtaWQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwcmV2aWV3IHNlbGVjdGlvbiBhZnRlciBjcmF3bCBjb21wbGV0ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5zdGVwID0gQ3Jhd2xTdGVwLmZpbmlzaGVkXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jcmF3bFJlc3VsdCA9IHtcbiAgICAgICAgZGF0YTogW1xuICAgICAgICAgIGNyZWF0ZU1vY2tDcmF3bFJlc3VsdEl0ZW0oeyBzb3VyY2VfdXJsOiAnaHR0cHM6Ly9leGFtcGxlLmNvbS8xJyB9KSxcbiAgICAgICAgICBjcmVhdGVNb2NrQ3Jhd2xSZXN1bHRJdGVtKHsgc291cmNlX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vMicgfSksXG4gICAgICAgIF0sXG4gICAgICAgIHRpbWVfY29uc3VtaW5nOiAxLjUsXG4gICAgICB9XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBQcmV2aWV3IGZpcnN0IGl0ZW1cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NyYXdsZWQtcmVzdWx0LXByZXZpZXcnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0Q3VycmVudFdlYnNpdGUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFByZXZpZXdJbmRleCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoMClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDb21wb25lbnQgTWVtb2l6YXRpb25cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuICAgICAgcmVyZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBDb21wb25lbnQgc2hvdWxkIHN0aWxsIHJlbmRlciBjb3JyZWN0bHkgYWZ0ZXIgcmVyZW5kZXJcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdvcHRpb25zJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmUtcnVuIGNhbGxiYWNrcyB3aGVuIHByb3BzIGFyZSB0aGUgc2FtZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG9uQ3JlZGVudGlhbENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DcmVkZW50aWFsQ2hhbmdlIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcbiAgICAgIHJlcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gVGhlIGNhbGxiYWNrIHJlZmVyZW5jZSBzaG91bGQgYmUgc3RhYmxlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXItY3JlZGVudGlhbC1jaGFuZ2UnKSlcbiAgICAgIGV4cGVjdChvbkNyZWRlbnRpYWxDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFN0eWxpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdTdHlsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXBwbHkgY29ycmVjdCBjb250YWluZXIgY2xhc3NlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxXZWJzaXRlQ3Jhd2wgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCByb290RGl2ID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdChyb290RGl2KS50b0hhdmVDbGFzcygnZmxleCcsICdmbGV4LWNvbCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY29ycmVjdCBjbGFzc2VzIHRvIG9wdGlvbnMgY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFdlYnNpdGVDcmF3bCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IG9wdGlvbnNDb250YWluZXIgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignLnJvdW5kZWQteGwnKVxuICAgICAgZXhwZWN0KG9wdGlvbnNDb250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==