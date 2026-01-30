"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const common_1 = require("@/models/common");
const datasets_1 = require("@/models/datasets");
const app_1 = require("@/types/app");
const index_1 = require("./index");
// IndexingType values from step-two (defined here since we mock step-two)
// Using type assertion to match the expected IndexingType enum from step-two
const IndexingTypeValues = {
    QUALIFIED: 'high_quality',
    ECONOMICAL: 'economy',
};
// ==========================================
// Mock External Dependencies
// ==========================================
// Mock next/link
vi.mock('next/link', () => {
    return function MockLink({ children, href }) {
        return <a href={href}>{children}</a>;
    };
});
// Mock modal context
const mockSetShowAccountSettingModal = vi.fn();
vi.mock('@/context/modal-context', () => ({
    useModalContextSelector: (selector) => {
        const state = {
            setShowAccountSettingModal: mockSetShowAccountSettingModal,
        };
        return selector(state);
    },
}));
// Mock dataset detail context
let mockDatasetDetail;
vi.mock('@/context/dataset-detail', () => ({
    useDatasetDetailContextWithSelector: (selector) => {
        const state = {
            dataset: mockDatasetDetail,
        };
        return selector(state);
    },
}));
// Mock useDefaultModel hook
let mockEmbeddingsDefaultModel;
vi.mock('@/app/components/header/account-setting/model-provider-page/hooks', () => ({
    useDefaultModel: () => ({
        data: mockEmbeddingsDefaultModel,
        mutate: vi.fn(),
        isLoading: false,
    }),
}));
// Mock useGetDefaultDataSourceListAuth hook
let mockDataSourceList;
let mockIsLoadingDataSourceList = false;
let mockFetchingError = false;
vi.mock('@/service/use-datasource', () => ({
    useGetDefaultDataSourceListAuth: () => ({
        data: mockDataSourceList,
        isLoading: mockIsLoadingDataSourceList,
        isError: mockFetchingError,
    }),
}));
// ==========================================
// Mock Child Components
// ==========================================
// Track props passed to child components
let stepOneProps = {};
let stepTwoProps = {};
let stepThreeProps = {};
// _topBarProps is assigned but not directly used in assertions - values checked via data-testid
let _topBarProps = {};
vi.mock('./step-one', () => ({
    default: (props) => {
        stepOneProps = props;
        return (<div data-testid="step-one">
        <span data-testid="step-one-data-source-type">{props.dataSourceType}</span>
        <span data-testid="step-one-files-count">{props.files?.length || 0}</span>
        <span data-testid="step-one-notion-pages-count">{props.notionPages?.length || 0}</span>
        <span data-testid="step-one-website-pages-count">{props.websitePages?.length || 0}</span>
        <button data-testid="step-one-next" onClick={props.onStepChange}>Next Step</button>
        <button data-testid="step-one-setting" onClick={props.onSetting}>Open Settings</button>
        <button data-testid="step-one-change-type" onClick={() => props.changeType(datasets_1.DataSourceType.NOTION)}>
          Change Type
        </button>
        <button data-testid="step-one-update-files" onClick={() => props.updateFileList([{ fileID: 'test-1', file: { name: 'test.txt' }, progress: 0 }])}>
          Add File
        </button>
        <button data-testid="step-one-update-file-progress" onClick={() => {
                const mockFile = { fileID: 'test-1', file: { name: 'test.txt' }, progress: 0 };
                props.updateFile(mockFile, 50, [mockFile]);
            }}>
          Update File Progress
        </button>
        <button data-testid="step-one-update-notion-pages" onClick={() => props.updateNotionPages([{ page_id: 'page-1', type: 'page' }])}>
          Add Notion Page
        </button>
        <button data-testid="step-one-update-notion-credential" onClick={() => props.updateNotionCredentialId('credential-123')}>
          Update Credential
        </button>
        <button data-testid="step-one-update-website-pages" onClick={() => props.updateWebsitePages([{ title: 'Test', markdown: '', description: '', source_url: 'https://test.com' }])}>
          Add Website Page
        </button>
        <button data-testid="step-one-update-crawl-options" onClick={() => props.onCrawlOptionsChange({ ...props.crawlOptions, limit: 20 })}>
          Update Crawl Options
        </button>
        <button data-testid="step-one-update-crawl-provider" onClick={() => props.onWebsiteCrawlProviderChange(common_1.DataSourceProvider.fireCrawl)}>
          Update Crawl Provider
        </button>
        <button data-testid="step-one-update-job-id" onClick={() => props.onWebsiteCrawlJobIdChange('job-123')}>
          Update Job ID
        </button>
      </div>);
    },
}));
vi.mock('./step-two', () => ({
    default: (props) => {
        stepTwoProps = props;
        return (<div data-testid="step-two">
        <span data-testid="step-two-is-api-key-set">{String(props.isAPIKeySet)}</span>
        <span data-testid="step-two-data-source-type">{props.dataSourceType}</span>
        <span data-testid="step-two-files-count">{props.files?.length || 0}</span>
        <button data-testid="step-two-prev" onClick={() => props.onStepChange(-1)}>Prev Step</button>
        <button data-testid="step-two-next" onClick={() => props.onStepChange(1)}>Next Step</button>
        <button data-testid="step-two-setting" onClick={props.onSetting}>Open Settings</button>
        <button data-testid="step-two-update-indexing-cache" onClick={() => props.updateIndexingTypeCache('high_quality')}>
          Update Indexing Cache
        </button>
        <button data-testid="step-two-update-retrieval-cache" onClick={() => props.updateRetrievalMethodCache('semantic_search')}>
          Update Retrieval Cache
        </button>
        <button data-testid="step-two-update-result-cache" onClick={() => props.updateResultCache({ batch: 'batch-1', documents: [] })}>
          Update Result Cache
        </button>
      </div>);
    },
}));
vi.mock('./step-three', () => ({
    default: (props) => {
        stepThreeProps = props;
        return (<div data-testid="step-three">
        <span data-testid="step-three-dataset-id">{props.datasetId || 'none'}</span>
        <span data-testid="step-three-dataset-name">{props.datasetName || 'none'}</span>
        <span data-testid="step-three-indexing-type">{props.indexingType || 'none'}</span>
        <span data-testid="step-three-retrieval-method">{props.retrievalMethod || 'none'}</span>
      </div>);
    },
}));
vi.mock('./top-bar', () => ({
    TopBar: (props) => {
        _topBarProps = props;
        return (<div data-testid="top-bar">
        <span data-testid="top-bar-active-index">{props.activeIndex}</span>
        <span data-testid="top-bar-dataset-id">{props.datasetId || 'none'}</span>
      </div>);
    },
}));
// ==========================================
// Test Data Builders
// ==========================================
const createMockDataset = (overrides) => ({
    id: 'dataset-123',
    name: 'Test Dataset',
    indexing_status: 'completed',
    icon_info: { icon: '', icon_background: '', icon_type: 'emoji' },
    description: 'Test description',
    permission: datasets_1.DatasetPermission.onlyMe,
    data_source_type: datasets_1.DataSourceType.FILE,
    indexing_technique: IndexingTypeValues.QUALIFIED,
    created_by: 'user-1',
    updated_by: 'user-1',
    updated_at: Date.now(),
    app_count: 0,
    doc_form: datasets_1.ChunkingMode.text,
    document_count: 0,
    total_document_count: 0,
    word_count: 0,
    provider: 'openai',
    embedding_model: 'text-embedding-ada-002',
    embedding_model_provider: 'openai',
    embedding_available: true,
    retrieval_model_dict: {
        search_method: app_1.RETRIEVE_METHOD.semantic,
        reranking_enable: false,
        reranking_mode: undefined,
        reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
        weights: undefined,
        top_k: 3,
        score_threshold_enabled: false,
        score_threshold: 0,
    },
    retrieval_model: {
        search_method: app_1.RETRIEVE_METHOD.semantic,
        reranking_enable: false,
        reranking_mode: undefined,
        reranking_model: { reranking_provider_name: '', reranking_model_name: '' },
        weights: undefined,
        top_k: 3,
        score_threshold_enabled: false,
        score_threshold: 0,
    },
    tags: [],
    external_knowledge_info: {
        external_knowledge_id: '',
        external_knowledge_api_id: '',
        external_knowledge_api_name: '',
        external_knowledge_api_endpoint: '',
    },
    external_retrieval_model: {
        top_k: 3,
        score_threshold: 0.5,
        score_threshold_enabled: false,
    },
    built_in_field_enabled: false,
    runtime_mode: 'general',
    enable_api: false,
    is_multimodal: false,
    ...overrides,
});
const createMockDataSourceAuth = (overrides) => ({
    credential_id: 'cred-1',
    provider: 'notion',
    plugin_id: 'plugin-1',
    ...overrides,
});
// ==========================================
// Test Suite
// ==========================================
describe('DatasetUpdateForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mock state
        mockDatasetDetail = undefined;
        mockEmbeddingsDefaultModel = { model: 'text-embedding-ada-002', provider: 'openai' };
        mockDataSourceList = { result: [createMockDataSourceAuth()] };
        mockIsLoadingDataSourceList = false;
        mockFetchingError = false;
        // Reset captured props
        stepOneProps = {};
        stepTwoProps = {};
        stepThreeProps = {};
        _topBarProps = {};
    });
    // ==========================================
    // Rendering Tests - Verify component renders correctly in different states
    // ==========================================
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('top-bar')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('step-one')).toBeInTheDocument();
        });
        it('should render TopBar with correct active index for step 1', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('top-bar-active-index')).toHaveTextContent('0');
        });
        it('should render StepOne by default', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('step-one')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('step-two')).not.toBeInTheDocument();
            expect(react_1.screen.queryByTestId('step-three')).not.toBeInTheDocument();
        });
        it('should show loading state when data source list is loading', () => {
            // Arrange
            mockIsLoadingDataSourceList = true;
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert - Loading component should be rendered (not the steps)
            expect(react_1.screen.queryByTestId('step-one')).not.toBeInTheDocument();
        });
        it('should show error state when fetching fails', () => {
            // Arrange
            mockFetchingError = true;
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByText('datasetCreation.error.unavailable')).toBeInTheDocument();
        });
    });
    // ==========================================
    // Props Testing - Verify datasetId prop behavior
    // ==========================================
    describe('Props', () => {
        describe('datasetId prop', () => {
            it('should pass datasetId to TopBar', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default datasetId="dataset-abc"/>);
                // Assert
                expect(react_1.screen.getByTestId('top-bar-dataset-id')).toHaveTextContent('dataset-abc');
            });
            it('should pass datasetId to StepOne', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default datasetId="dataset-abc"/>);
                // Assert
                expect(stepOneProps.datasetId).toBe('dataset-abc');
            });
            it('should render without datasetId', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default />);
                // Assert
                expect(react_1.screen.getByTestId('top-bar-dataset-id')).toHaveTextContent('none');
                expect(stepOneProps.datasetId).toBeUndefined();
            });
        });
    });
    // ==========================================
    // State Management - Test state initialization and transitions
    // ==========================================
    describe('State Management', () => {
        describe('dataSourceType state', () => {
            it('should initialize with FILE data source type', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default />);
                // Assert
                expect(react_1.screen.getByTestId('step-one-data-source-type')).toHaveTextContent(datasets_1.DataSourceType.FILE);
            });
            it('should update dataSourceType when changeType is called', () => {
                // Arrange
                (0, react_1.render)(<index_1.default />);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('step-one-change-type'));
                // Assert
                expect(react_1.screen.getByTestId('step-one-data-source-type')).toHaveTextContent(datasets_1.DataSourceType.NOTION);
            });
        });
        describe('step state', () => {
            it('should initialize at step 1', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default />);
                // Assert
                expect(react_1.screen.getByTestId('step-one')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('top-bar-active-index')).toHaveTextContent('0');
            });
            it('should transition to step 2 when nextStep is called', () => {
                // Arrange
                (0, react_1.render)(<index_1.default />);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
                // Assert
                expect(react_1.screen.queryByTestId('step-one')).not.toBeInTheDocument();
                expect(react_1.screen.getByTestId('step-two')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('top-bar-active-index')).toHaveTextContent('1');
            });
            it('should transition to step 3 from step 2', () => {
                // Arrange
                (0, react_1.render)(<index_1.default />);
                // First go to step 2
                react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
                // Act - go to step 3
                react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
                // Assert
                expect(react_1.screen.queryByTestId('step-two')).not.toBeInTheDocument();
                expect(react_1.screen.getByTestId('step-three')).toBeInTheDocument();
                expect(react_1.screen.getByTestId('top-bar-active-index')).toHaveTextContent('2');
            });
            it('should go back to step 1 from step 2', () => {
                // Arrange
                (0, react_1.render)(<index_1.default />);
                react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('step-two-prev'));
                // Assert
                expect(react_1.screen.getByTestId('step-one')).toBeInTheDocument();
                expect(react_1.screen.queryByTestId('step-two')).not.toBeInTheDocument();
            });
        });
        describe('fileList state', () => {
            it('should initialize with empty file list', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default />);
                // Assert
                expect(react_1.screen.getByTestId('step-one-files-count')).toHaveTextContent('0');
            });
            it('should update file list when updateFileList is called', () => {
                // Arrange
                (0, react_1.render)(<index_1.default />);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-files'));
                // Assert
                expect(react_1.screen.getByTestId('step-one-files-count')).toHaveTextContent('1');
            });
        });
        describe('notionPages state', () => {
            it('should initialize with empty notion pages', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default />);
                // Assert
                expect(react_1.screen.getByTestId('step-one-notion-pages-count')).toHaveTextContent('0');
            });
            it('should update notion pages when updateNotionPages is called', () => {
                // Arrange
                (0, react_1.render)(<index_1.default />);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-notion-pages'));
                // Assert
                expect(react_1.screen.getByTestId('step-one-notion-pages-count')).toHaveTextContent('1');
            });
        });
        describe('websitePages state', () => {
            it('should initialize with empty website pages', () => {
                // Arrange & Act
                (0, react_1.render)(<index_1.default />);
                // Assert
                expect(react_1.screen.getByTestId('step-one-website-pages-count')).toHaveTextContent('0');
            });
            it('should update website pages when setWebsitePages is called', () => {
                // Arrange
                (0, react_1.render)(<index_1.default />);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-website-pages'));
                // Assert
                expect(react_1.screen.getByTestId('step-one-website-pages-count')).toHaveTextContent('1');
            });
        });
    });
    // ==========================================
    // Callback Stability - Test memoization of callbacks
    // ==========================================
    describe('Callback Stability and Memoization', () => {
        it('should provide stable updateNotionPages callback reference', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default />);
            const initialCallback = stepOneProps.updateNotionPages;
            // Act - trigger a rerender
            rerender(<index_1.default />);
            // Assert - callback reference should be the same due to useCallback
            expect(stepOneProps.updateNotionPages).toBe(initialCallback);
        });
        it('should provide stable updateNotionCredentialId callback reference', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default />);
            const initialCallback = stepOneProps.updateNotionCredentialId;
            // Act
            rerender(<index_1.default />);
            // Assert
            expect(stepOneProps.updateNotionCredentialId).toBe(initialCallback);
        });
        it('should provide stable updateFileList callback reference', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default />);
            const initialCallback = stepOneProps.updateFileList;
            // Act
            rerender(<index_1.default />);
            // Assert
            expect(stepOneProps.updateFileList).toBe(initialCallback);
        });
        it('should provide stable updateFile callback reference', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default />);
            const initialCallback = stepOneProps.updateFile;
            // Act
            rerender(<index_1.default />);
            // Assert
            expect(stepOneProps.updateFile).toBe(initialCallback);
        });
        it('should provide stable updateIndexingTypeCache callback reference', () => {
            // Arrange
            const { rerender } = (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            const initialCallback = stepTwoProps.updateIndexingTypeCache;
            // Act - trigger a rerender without changing step
            rerender(<index_1.default />);
            // Assert - callbacks with same dependencies should be stable
            expect(stepTwoProps.updateIndexingTypeCache).toBe(initialCallback);
        });
    });
    // ==========================================
    // User Interactions - Test event handlers
    // ==========================================
    describe('User Interactions', () => {
        it('should open account settings when onSetting is called from StepOne', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-setting'));
            // Assert
            expect(mockSetShowAccountSettingModal).toHaveBeenCalledWith({ payload: 'data-source' });
        });
        it('should open provider settings when onSetting is called from StepTwo', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-setting'));
            // Assert
            expect(mockSetShowAccountSettingModal).toHaveBeenCalledWith({ payload: 'provider' });
        });
        it('should update crawl options when onCrawlOptionsChange is called', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-crawl-options'));
            // Assert
            expect(stepOneProps.crawlOptions.limit).toBe(20);
        });
        it('should update crawl provider when onWebsiteCrawlProviderChange is called', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-crawl-provider'));
            // Assert - Need to verify state through StepTwo props
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            expect(stepTwoProps.websiteCrawlProvider).toBe(common_1.DataSourceProvider.fireCrawl);
        });
        it('should update job id when onWebsiteCrawlJobIdChange is called', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-job-id'));
            // Assert - Verify through StepTwo props
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            expect(stepTwoProps.websiteCrawlJobId).toBe('job-123');
        });
        it('should update file progress correctly using immer produce', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-files'));
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-file-progress'));
            // Assert - Progress should be updated
            expect(stepOneProps.files[0].progress).toBe(50);
        });
        it('should update notion credential id', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-notion-credential'));
            // Assert
            expect(stepOneProps.notionCredentialId).toBe('credential-123');
        });
    });
    // ==========================================
    // Step Two Specific Tests
    // ==========================================
    describe('StepTwo Rendering and Props', () => {
        it('should pass isAPIKeySet as true when embeddingsDefaultModel exists', () => {
            // Arrange
            mockEmbeddingsDefaultModel = { model: 'model-1', provider: 'openai' };
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Assert
            expect(react_1.screen.getByTestId('step-two-is-api-key-set')).toHaveTextContent('true');
        });
        it('should pass isAPIKeySet as false when embeddingsDefaultModel is undefined', () => {
            // Arrange
            mockEmbeddingsDefaultModel = undefined;
            (0, react_1.render)(<index_1.default />);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Assert
            expect(react_1.screen.getByTestId('step-two-is-api-key-set')).toHaveTextContent('false');
        });
        it('should pass correct dataSourceType to StepTwo', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-change-type'));
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Assert
            expect(react_1.screen.getByTestId('step-two-data-source-type')).toHaveTextContent(datasets_1.DataSourceType.NOTION);
        });
        it('should pass files mapped to file property to StepTwo', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-files'));
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Assert
            expect(react_1.screen.getByTestId('step-two-files-count')).toHaveTextContent('1');
        });
        it('should update indexing type cache from StepTwo', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-update-indexing-cache'));
            // Assert - Go to step 3 and verify
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            expect(react_1.screen.getByTestId('step-three-indexing-type')).toHaveTextContent('high_quality');
        });
        it('should update retrieval method cache from StepTwo', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-update-retrieval-cache'));
            // Assert - Go to step 3 and verify
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            expect(react_1.screen.getByTestId('step-three-retrieval-method')).toHaveTextContent('semantic_search');
        });
        it('should update result cache from StepTwo', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-update-result-cache'));
            // Assert - Go to step 3 and verify creationCache is passed
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            expect(stepThreeProps.creationCache).toBeDefined();
            expect(stepThreeProps.creationCache?.batch).toBe('batch-1');
        });
    });
    // ==========================================
    // Step Two with datasetId and datasetDetail
    // ==========================================
    describe('StepTwo with existing dataset', () => {
        it('should not render StepTwo when datasetId exists but datasetDetail is undefined', () => {
            // Arrange
            mockDatasetDetail = undefined;
            (0, react_1.render)(<index_1.default datasetId="dataset-123"/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Assert - StepTwo should not render due to condition
            expect(react_1.screen.queryByTestId('step-two')).not.toBeInTheDocument();
        });
        it('should render StepTwo when datasetId exists and datasetDetail is defined', () => {
            // Arrange
            mockDatasetDetail = createMockDataset();
            (0, react_1.render)(<index_1.default datasetId="dataset-123"/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Assert
            expect(react_1.screen.getByTestId('step-two')).toBeInTheDocument();
        });
        it('should pass indexingType from datasetDetail to StepTwo', () => {
            // Arrange
            mockDatasetDetail = createMockDataset({ indexing_technique: IndexingTypeValues.ECONOMICAL });
            (0, react_1.render)(<index_1.default datasetId="dataset-123"/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Assert
            expect(stepTwoProps.indexingType).toBe('economy');
        });
    });
    // ==========================================
    // Step Three Tests
    // ==========================================
    describe('StepThree Rendering and Props', () => {
        it('should pass datasetId to StepThree', () => {
            // Arrange - Need datasetDetail for StepTwo to render when datasetId exists
            mockDatasetDetail = createMockDataset();
            (0, react_1.render)(<index_1.default datasetId="dataset-456"/>);
            // Act - Navigate to step 3
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            // Assert
            expect(react_1.screen.getByTestId('step-three-dataset-id')).toHaveTextContent('dataset-456');
        });
        it('should pass datasetName from datasetDetail to StepThree', () => {
            // Arrange
            mockDatasetDetail = createMockDataset({ name: 'My Special Dataset' });
            (0, react_1.render)(<index_1.default datasetId="dataset-123"/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            // Assert
            expect(react_1.screen.getByTestId('step-three-dataset-name')).toHaveTextContent('My Special Dataset');
        });
        it('should use cached indexing type when datasetDetail indexing_technique is not available', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Navigate to step 2 and set cache
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-update-indexing-cache'));
            // Act - Navigate to step 3
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            // Assert
            expect(react_1.screen.getByTestId('step-three-indexing-type')).toHaveTextContent('high_quality');
        });
        it('should use datasetDetail indexing_technique over cached value', () => {
            // Arrange
            mockDatasetDetail = createMockDataset({ indexing_technique: IndexingTypeValues.ECONOMICAL });
            (0, react_1.render)(<index_1.default datasetId="dataset-123"/>);
            // Navigate to step 2 and set different cache
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-update-indexing-cache'));
            // Act - Navigate to step 3
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            // Assert - Should use datasetDetail value, not cache
            expect(react_1.screen.getByTestId('step-three-indexing-type')).toHaveTextContent('economy');
        });
        it('should use retrieval method from datasetDetail when available', () => {
            // Arrange
            mockDatasetDetail = createMockDataset();
            mockDatasetDetail.retrieval_model_dict = {
                ...mockDatasetDetail.retrieval_model_dict,
                search_method: app_1.RETRIEVE_METHOD.fullText,
            };
            (0, react_1.render)(<index_1.default datasetId="dataset-123"/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            // Assert
            expect(react_1.screen.getByTestId('step-three-retrieval-method')).toHaveTextContent('full_text_search');
        });
    });
    // ==========================================
    // StepOne Props Tests
    // ==========================================
    describe('StepOne Props', () => {
        it('should pass authedDataSourceList from hook response', () => {
            // Arrange
            const mockAuth = createMockDataSourceAuth({ provider: 'google-drive' });
            mockDataSourceList = { result: [mockAuth] };
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(stepOneProps.authedDataSourceList).toEqual([mockAuth]);
        });
        it('should pass empty array when dataSourceList is undefined', () => {
            // Arrange
            mockDataSourceList = undefined;
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(stepOneProps.authedDataSourceList).toEqual([]);
        });
        it('should pass dataSourceTypeDisable as true when datasetDetail has data_source_type', () => {
            // Arrange
            mockDatasetDetail = createMockDataset({ data_source_type: datasets_1.DataSourceType.FILE });
            // Act
            (0, react_1.render)(<index_1.default datasetId="dataset-123"/>);
            // Assert
            expect(stepOneProps.dataSourceTypeDisable).toBe(true);
        });
        it('should pass dataSourceTypeDisable as false when datasetDetail is undefined', () => {
            // Arrange
            mockDatasetDetail = undefined;
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(stepOneProps.dataSourceTypeDisable).toBe(false);
        });
        it('should pass default crawl options', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(stepOneProps.crawlOptions).toEqual({
                crawl_sub_pages: true,
                only_main_content: true,
                includes: '',
                excludes: '',
                limit: 10,
                max_depth: '',
                use_sitemap: true,
            });
        });
    });
    // ==========================================
    // Edge Cases - Test boundary conditions and error handling
    // ==========================================
    describe('Edge Cases', () => {
        it('should handle empty data source list', () => {
            // Arrange
            mockDataSourceList = { result: [] };
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(stepOneProps.authedDataSourceList).toEqual([]);
        });
        it('should handle undefined datasetDetail retrieval_model_dict', () => {
            // Arrange
            mockDatasetDetail = createMockDataset();
            // @ts-expect-error - Testing undefined case
            mockDatasetDetail.retrieval_model_dict = undefined;
            (0, react_1.render)(<index_1.default datasetId="dataset-123"/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-update-retrieval-cache'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            // Assert - Should use cached value
            expect(react_1.screen.getByTestId('step-three-retrieval-method')).toHaveTextContent('semantic_search');
        });
        it('should handle step state correctly after multiple navigations', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act - Navigate forward and back multiple times
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next')); // to step 2
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-prev')); // back to step 1
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next')); // to step 2
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next')); // to step 3
            // Assert
            expect(react_1.screen.getByTestId('step-three')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('top-bar-active-index')).toHaveTextContent('2');
        });
        it('should handle result cache being undefined', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Act - Navigate to step 3 without setting result cache
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            // Assert
            expect(stepThreeProps.creationCache).toBeUndefined();
        });
        it('should pass result cache to step three', async () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Set result cache value
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-update-result-cache'));
            // Navigate to step 3
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            // Assert - Result cache is correctly passed to step three
            expect(stepThreeProps.creationCache).toBeDefined();
            expect(stepThreeProps.creationCache?.batch).toBe('batch-1');
        });
        it('should preserve state when navigating between steps', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Set up various states
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-change-type'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-files'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-notion-pages'));
            // Navigate to step 2 and back
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-prev'));
            // Assert - All state should be preserved
            expect(react_1.screen.getByTestId('step-one-data-source-type')).toHaveTextContent(datasets_1.DataSourceType.NOTION);
            expect(react_1.screen.getByTestId('step-one-files-count')).toHaveTextContent('1');
            expect(react_1.screen.getByTestId('step-one-notion-pages-count')).toHaveTextContent('1');
        });
    });
    // ==========================================
    // Integration Tests - Test complete flows
    // ==========================================
    describe('Integration', () => {
        it('should complete full flow from step 1 to step 3 with all state updates', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Step 1: Set up data
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-files'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Step 2: Set caches
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-update-indexing-cache'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-update-retrieval-cache'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-update-result-cache'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            // Assert - All data flows through to Step 3
            expect(react_1.screen.getByTestId('step-three-indexing-type')).toHaveTextContent('high_quality');
            expect(react_1.screen.getByTestId('step-three-retrieval-method')).toHaveTextContent('semantic_search');
            expect(stepThreeProps.creationCache?.batch).toBe('batch-1');
        });
        it('should handle complete website crawl workflow', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Set website data source through button click
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-website-pages'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-crawl-options'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-crawl-provider'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-job-id'));
            // Navigate to step 2
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Assert - All website data passed to StepTwo
            expect(stepTwoProps.websitePages.length).toBe(1);
            expect(stepTwoProps.websiteCrawlProvider).toBe(common_1.DataSourceProvider.fireCrawl);
            expect(stepTwoProps.websiteCrawlJobId).toBe('job-123');
            expect(stepTwoProps.crawlOptions.limit).toBe(20);
        });
        it('should handle complete notion workflow', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Set notion data source
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-change-type'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-notion-pages'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-notion-credential'));
            // Navigate to step 2
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Assert
            expect(stepTwoProps.notionPages.length).toBe(1);
            expect(stepTwoProps.notionCredentialId).toBe('credential-123');
        });
        it('should handle edit mode with existing dataset', () => {
            // Arrange
            mockDatasetDetail = createMockDataset({
                name: 'Existing Dataset',
                indexing_technique: IndexingTypeValues.QUALIFIED,
                data_source_type: datasets_1.DataSourceType.NOTION,
            });
            (0, react_1.render)(<index_1.default datasetId="dataset-123"/>);
            // Assert - Step 1 should have disabled data source type
            expect(stepOneProps.dataSourceTypeDisable).toBe(true);
            // Navigate through
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            // Assert - Step 2 should receive dataset info
            expect(stepTwoProps.indexingType).toBe('high_quality');
            expect(stepTwoProps.datasetId).toBe('dataset-123');
            // Navigate to Step 3
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-next'));
            // Assert - Step 3 should show dataset details
            expect(react_1.screen.getByTestId('step-three-dataset-name')).toHaveTextContent('Existing Dataset');
            expect(react_1.screen.getByTestId('step-three-indexing-type')).toHaveTextContent('high_quality');
        });
    });
    // ==========================================
    // Default Crawl Options Tests
    // ==========================================
    describe('Default Crawl Options', () => {
        it('should have correct default crawl options structure', () => {
            // Arrange & Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            const crawlOptions = stepOneProps.crawlOptions;
            expect(crawlOptions).toMatchObject({
                crawl_sub_pages: true,
                only_main_content: true,
                includes: '',
                excludes: '',
                limit: 10,
                max_depth: '',
                use_sitemap: true,
            });
        });
        it('should preserve crawl options when navigating steps', () => {
            // Arrange
            (0, react_1.render)(<index_1.default />);
            // Update crawl options
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-update-crawl-options'));
            // Navigate to step 2 and back
            react_1.fireEvent.click(react_1.screen.getByTestId('step-one-next'));
            react_1.fireEvent.click(react_1.screen.getByTestId('step-two-prev'));
            // Assert
            expect(stepOneProps.crawlOptions.limit).toBe(20);
        });
    });
    // ==========================================
    // Error State Tests
    // ==========================================
    describe('Error States', () => {
        it('should display error message when fetching data source list fails', () => {
            // Arrange
            mockFetchingError = true;
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            const errorElement = react_1.screen.getByText('datasetCreation.error.unavailable');
            expect(errorElement).toBeInTheDocument();
        });
        it('should not render steps when in error state', () => {
            // Arrange
            mockFetchingError = true;
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.queryByTestId('step-one')).not.toBeInTheDocument();
            expect(react_1.screen.queryByTestId('step-two')).not.toBeInTheDocument();
            expect(react_1.screen.queryByTestId('step-three')).not.toBeInTheDocument();
        });
        it('should render error page with 500 code when in error state', () => {
            // Arrange
            mockFetchingError = true;
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert - Error state renders AppUnavailable, not the normal layout
            expect(react_1.screen.getByText('500')).toBeInTheDocument();
            expect(react_1.screen.queryByTestId('top-bar')).not.toBeInTheDocument();
        });
    });
    // ==========================================
    // Loading State Tests
    // ==========================================
    describe('Loading States', () => {
        it('should not render steps while loading', () => {
            // Arrange
            mockIsLoadingDataSourceList = true;
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.queryByTestId('step-one')).not.toBeInTheDocument();
        });
        it('should render TopBar while loading', () => {
            // Arrange
            mockIsLoadingDataSourceList = true;
            // Act
            (0, react_1.render)(<index_1.default />);
            // Assert
            expect(react_1.screen.getByTestId('top-bar')).toBeInTheDocument();
        });
        it('should render StepOne after loading completes', async () => {
            // Arrange
            mockIsLoadingDataSourceList = true;
            const { rerender } = (0, react_1.render)(<index_1.default />);
            // Assert - Initially not rendered
            expect(react_1.screen.queryByTestId('step-one')).not.toBeInTheDocument();
            // Act - Loading completes
            mockIsLoadingDataSourceList = false;
            rerender(<index_1.default />);
            // Assert - Now rendered
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('step-one')).toBeInTheDocument();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5Qiw0Q0FBb0Q7QUFDcEQsZ0RBQW1GO0FBQ25GLHFDQUE2QztBQUM3QyxtQ0FBdUM7QUFFdkMsMEVBQTBFO0FBQzFFLDZFQUE2RTtBQUM3RSxNQUFNLGtCQUFrQixHQUFHO0lBQ3pCLFNBQVMsRUFBRSxjQUF1QjtJQUNsQyxVQUFVLEVBQUUsU0FBa0I7Q0FDL0IsQ0FBQTtBQUVELDZDQUE2QztBQUM3Qyw2QkFBNkI7QUFDN0IsNkNBQTZDO0FBRTdDLGlCQUFpQjtBQUNqQixFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7SUFDeEIsT0FBTyxTQUFTLFFBQVEsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQStDO1FBQ3RGLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtJQUN0QyxDQUFDLENBQUE7QUFDSCxDQUFDLENBQUMsQ0FBQTtBQUVGLHFCQUFxQjtBQUNyQixNQUFNLDhCQUE4QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM5QyxFQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEMsdUJBQXVCLEVBQUUsQ0FBQyxRQUE2QixFQUFFLEVBQUU7UUFDekQsTUFBTSxLQUFLLEdBQUc7WUFDWiwwQkFBMEIsRUFBRSw4QkFBOEI7U0FDM0QsQ0FBQTtRQUNELE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3hCLENBQUM7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILDhCQUE4QjtBQUM5QixJQUFJLGlCQUFzQyxDQUFBO0FBQzFDLEVBQUUsQ0FBQyxJQUFJLENB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QUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFFaEUsMEJBQTBCO1lBQzFCLDJCQUEyQixHQUFHLEtBQUssQ0FBQTtZQUNuQyxRQUFRLENBQUMsQ0FBQyxlQUFpQixDQUFDLEFBQUQsRUFBRyxDQUFDLENBQUE7WUFFL0Isd0JBQXdCO1lBQ3hCLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixNQUFNLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDNUQsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IERhdGFTb3VyY2VBdXRoIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL2RhdGEtc291cmNlLXBhZ2UtbmV3L3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBEYXRhU2V0IH0gZnJvbSAnQC9tb2RlbHMvZGF0YXNldHMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgRGF0YVNvdXJjZVByb3ZpZGVyIH0gZnJvbSAnQC9tb2RlbHMvY29tbW9uJ1xuaW1wb3J0IHsgQ2h1bmtpbmdNb2RlLCBEYXRhc2V0UGVybWlzc2lvbiwgRGF0YVNvdXJjZVR5cGUgfSBmcm9tICdAL21vZGVscy9kYXRhc2V0cydcbmltcG9ydCB7IFJFVFJJRVZFX01FVEhPRCB9IGZyb20gJ0AvdHlwZXMvYXBwJ1xuaW1wb3J0IERhdGFzZXRVcGRhdGVGb3JtIGZyb20gJy4vaW5kZXgnXG5cbi8vIEluZGV4aW5nVHlwZSB2YWx1ZXMgZnJvbSBzdGVwLXR3byAoZGVmaW5lZCBoZXJlIHNpbmNlIHdlIG1vY2sgc3RlcC10d28pXG4vLyBVc2luZyB0eXBlIGFzc2VydGlvbiB0byBtYXRjaCB0aGUgZXhwZWN0ZWQgSW5kZXhpbmdUeXBlIGVudW0gZnJvbSBzdGVwLXR3b1xuY29uc3QgSW5kZXhpbmdUeXBlVmFsdWVzID0ge1xuICBRVUFMSUZJRUQ6ICdoaWdoX3F1YWxpdHknIGFzIGNvbnN0LFxuICBFQ09OT01JQ0FMOiAnZWNvbm9teScgYXMgY29uc3QsXG59XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIG5leHQvbGlua1xudmkubW9jaygnbmV4dC9saW5rJywgKCkgPT4ge1xuICByZXR1cm4gZnVuY3Rpb24gTW9ja0xpbmsoeyBjaGlsZHJlbiwgaHJlZiB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUsIGhyZWY6IHN0cmluZyB9KSB7XG4gICAgcmV0dXJuIDxhIGhyZWY9e2hyZWZ9PntjaGlsZHJlbn08L2E+XG4gIH1cbn0pXG5cbi8vIE1vY2sgbW9kYWwgY29udGV4dFxuY29uc3QgbW9ja1NldFNob3dBY2NvdW50U2V0dGluZ01vZGFsID0gdmkuZm4oKVxudmkubW9jaygnQC9jb250ZXh0L21vZGFsLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VNb2RhbENvbnRleHRTZWxlY3RvcjogKHNlbGVjdG9yOiAoc3RhdGU6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgY29uc3Qgc3RhdGUgPSB7XG4gICAgICBzZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbDogbW9ja1NldFNob3dBY2NvdW50U2V0dGluZ01vZGFsLFxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3Ioc3RhdGUpXG4gIH0sXG59KSlcblxuLy8gTW9jayBkYXRhc2V0IGRldGFpbCBjb250ZXh0XG5sZXQgbW9ja0RhdGFzZXREZXRhaWw6IERhdGFTZXQgfCB1bmRlZmluZWRcbnZpLm1vY2soJ0AvY29udGV4dC9kYXRhc2V0LWRldGFpbCcsICgpID0+ICh7XG4gIHVzZURhdGFzZXREZXRhaWxDb250ZXh0V2l0aFNlbGVjdG9yOiAoc2VsZWN0b3I6IChzdGF0ZTogYW55KSA9PiBhbnkpID0+IHtcbiAgICBjb25zdCBzdGF0ZSA9IHtcbiAgICAgIGRhdGFzZXQ6IG1vY2tEYXRhc2V0RGV0YWlsLFxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3Ioc3RhdGUpXG4gIH0sXG59KSlcblxuLy8gTW9jayB1c2VEZWZhdWx0TW9kZWwgaG9va1xubGV0IG1vY2tFbWJlZGRpbmdzRGVmYXVsdE1vZGVsOiB7IG1vZGVsOiBzdHJpbmcsIHByb3ZpZGVyOiBzdHJpbmcgfSB8IHVuZGVmaW5lZFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9oZWFkZXIvYWNjb3VudC1zZXR0aW5nL21vZGVsLXByb3ZpZGVyLXBhZ2UvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VEZWZhdWx0TW9kZWw6ICgpID0+ICh7XG4gICAgZGF0YTogbW9ja0VtYmVkZGluZ3NEZWZhdWx0TW9kZWwsXG4gICAgbXV0YXRlOiB2aS5mbigpLFxuICAgIGlzTG9hZGluZzogZmFsc2UsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgdXNlR2V0RGVmYXVsdERhdGFTb3VyY2VMaXN0QXV0aCBob29rXG5sZXQgbW9ja0RhdGFTb3VyY2VMaXN0OiB7IHJlc3VsdDogRGF0YVNvdXJjZUF1dGhbXSB9IHwgdW5kZWZpbmVkXG5sZXQgbW9ja0lzTG9hZGluZ0RhdGFTb3VyY2VMaXN0ID0gZmFsc2VcbmxldCBtb2NrRmV0Y2hpbmdFcnJvciA9IGZhbHNlXG52aS5tb2NrKCdAL3NlcnZpY2UvdXNlLWRhdGFzb3VyY2UnLCAoKSA9PiAoe1xuICB1c2VHZXREZWZhdWx0RGF0YVNvdXJjZUxpc3RBdXRoOiAoKSA9PiAoe1xuICAgIGRhdGE6IG1vY2tEYXRhU291cmNlTGlzdCxcbiAgICBpc0xvYWRpbmc6IG1vY2tJc0xvYWRpbmdEYXRhU291cmNlTGlzdCxcbiAgICBpc0Vycm9yOiBtb2NrRmV0Y2hpbmdFcnJvcixcbiAgfSksXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIENoaWxkIENvbXBvbmVudHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBUcmFjayBwcm9wcyBwYXNzZWQgdG8gY2hpbGQgY29tcG9uZW50c1xubGV0IHN0ZXBPbmVQcm9wczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XG5sZXQgc3RlcFR3b1Byb3BzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cbmxldCBzdGVwVGhyZWVQcm9wczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XG4vLyBfdG9wQmFyUHJvcHMgaXMgYXNzaWduZWQgYnV0IG5vdCBkaXJlY3RseSB1c2VkIGluIGFzc2VydGlvbnMgLSB2YWx1ZXMgY2hlY2tlZCB2aWEgZGF0YS10ZXN0aWRcbmxldCBfdG9wQmFyUHJvcHM6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxuXG52aS5tb2NrKCcuL3N0ZXAtb25lJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHByb3BzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gICAgc3RlcE9uZVByb3BzID0gcHJvcHNcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInN0ZXAtb25lXCI+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwic3RlcC1vbmUtZGF0YS1zb3VyY2UtdHlwZVwiPntwcm9wcy5kYXRhU291cmNlVHlwZX08L3NwYW4+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwic3RlcC1vbmUtZmlsZXMtY291bnRcIj57cHJvcHMuZmlsZXM/Lmxlbmd0aCB8fCAwfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJzdGVwLW9uZS1ub3Rpb24tcGFnZXMtY291bnRcIj57cHJvcHMubm90aW9uUGFnZXM/Lmxlbmd0aCB8fCAwfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJzdGVwLW9uZS13ZWJzaXRlLXBhZ2VzLWNvdW50XCI+e3Byb3BzLndlYnNpdGVQYWdlcz8ubGVuZ3RoIHx8IDB9PC9zcGFuPlxuICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwic3RlcC1vbmUtbmV4dFwiIG9uQ2xpY2s9e3Byb3BzLm9uU3RlcENoYW5nZX0+TmV4dCBTdGVwPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJzdGVwLW9uZS1zZXR0aW5nXCIgb25DbGljaz17cHJvcHMub25TZXR0aW5nfT5PcGVuIFNldHRpbmdzPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInN0ZXAtb25lLWNoYW5nZS10eXBlXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwcm9wcy5jaGFuZ2VUeXBlKERhdGFTb3VyY2VUeXBlLk5PVElPTil9XG4gICAgICAgID5cbiAgICAgICAgICBDaGFuZ2UgVHlwZVxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic3RlcC1vbmUtdXBkYXRlLWZpbGVzXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwcm9wcy51cGRhdGVGaWxlTGlzdChbeyBmaWxlSUQ6ICd0ZXN0LTEnLCBmaWxlOiB7IG5hbWU6ICd0ZXN0LnR4dCcgfSwgcHJvZ3Jlc3M6IDAgfV0pfVxuICAgICAgICA+XG4gICAgICAgICAgQWRkIEZpbGVcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInN0ZXAtb25lLXVwZGF0ZS1maWxlLXByb2dyZXNzXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBtb2NrRmlsZSA9IHsgZmlsZUlEOiAndGVzdC0xJywgZmlsZTogeyBuYW1lOiAndGVzdC50eHQnIH0sIHByb2dyZXNzOiAwIH1cbiAgICAgICAgICAgIHByb3BzLnVwZGF0ZUZpbGUobW9ja0ZpbGUsIDUwLCBbbW9ja0ZpbGVdKVxuICAgICAgICAgIH19XG4gICAgICAgID5cbiAgICAgICAgICBVcGRhdGUgRmlsZSBQcm9ncmVzc1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic3RlcC1vbmUtdXBkYXRlLW5vdGlvbi1wYWdlc1wiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gcHJvcHMudXBkYXRlTm90aW9uUGFnZXMoW3sgcGFnZV9pZDogJ3BhZ2UtMScsIHR5cGU6ICdwYWdlJyB9XSl9XG4gICAgICAgID5cbiAgICAgICAgICBBZGQgTm90aW9uIFBhZ2VcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInN0ZXAtb25lLXVwZGF0ZS1ub3Rpb24tY3JlZGVudGlhbFwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gcHJvcHMudXBkYXRlTm90aW9uQ3JlZGVudGlhbElkKCdjcmVkZW50aWFsLTEyMycpfVxuICAgICAgICA+XG4gICAgICAgICAgVXBkYXRlIENyZWRlbnRpYWxcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInN0ZXAtb25lLXVwZGF0ZS13ZWJzaXRlLXBhZ2VzXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwcm9wcy51cGRhdGVXZWJzaXRlUGFnZXMoW3sgdGl0bGU6ICdUZXN0JywgbWFya2Rvd246ICcnLCBkZXNjcmlwdGlvbjogJycsIHNvdXJjZV91cmw6ICdodHRwczovL3Rlc3QuY29tJyB9XSl9XG4gICAgICAgID5cbiAgICAgICAgICBBZGQgV2Vic2l0ZSBQYWdlXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzdGVwLW9uZS11cGRhdGUtY3Jhd2wtb3B0aW9uc1wiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gcHJvcHMub25DcmF3bE9wdGlvbnNDaGFuZ2UoeyAuLi5wcm9wcy5jcmF3bE9wdGlvbnMsIGxpbWl0OiAyMCB9KX1cbiAgICAgICAgPlxuICAgICAgICAgIFVwZGF0ZSBDcmF3bCBPcHRpb25zXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJzdGVwLW9uZS11cGRhdGUtY3Jhd2wtcHJvdmlkZXJcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHByb3BzLm9uV2Vic2l0ZUNyYXdsUHJvdmlkZXJDaGFuZ2UoRGF0YVNvdXJjZVByb3ZpZGVyLmZpcmVDcmF3bCl9XG4gICAgICAgID5cbiAgICAgICAgICBVcGRhdGUgQ3Jhd2wgUHJvdmlkZXJcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInN0ZXAtb25lLXVwZGF0ZS1qb2ItaWRcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHByb3BzLm9uV2Vic2l0ZUNyYXdsSm9iSWRDaGFuZ2UoJ2pvYi0xMjMnKX1cbiAgICAgICAgPlxuICAgICAgICAgIFVwZGF0ZSBKb2IgSURcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG59KSlcblxudmkubW9jaygnLi9zdGVwLXR3bycsICgpID0+ICh7XG4gIGRlZmF1bHQ6IChwcm9wczogUmVjb3JkPHN0cmluZywgYW55PikgPT4ge1xuICAgIHN0ZXBUd29Qcm9wcyA9IHByb3BzXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJzdGVwLXR3b1wiPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInN0ZXAtdHdvLWlzLWFwaS1rZXktc2V0XCI+e1N0cmluZyhwcm9wcy5pc0FQSUtleVNldCl9PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInN0ZXAtdHdvLWRhdGEtc291cmNlLXR5cGVcIj57cHJvcHMuZGF0YVNvdXJjZVR5cGV9PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInN0ZXAtdHdvLWZpbGVzLWNvdW50XCI+e3Byb3BzLmZpbGVzPy5sZW5ndGggfHwgMH08L3NwYW4+XG4gICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJzdGVwLXR3by1wcmV2XCIgb25DbGljaz17KCkgPT4gcHJvcHMub25TdGVwQ2hhbmdlKC0xKX0+UHJldiBTdGVwPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJzdGVwLXR3by1uZXh0XCIgb25DbGljaz17KCkgPT4gcHJvcHMub25TdGVwQ2hhbmdlKDEpfT5OZXh0IFN0ZXA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInN0ZXAtdHdvLXNldHRpbmdcIiBvbkNsaWNrPXtwcm9wcy5vblNldHRpbmd9Pk9wZW4gU2V0dGluZ3M8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwic3RlcC10d28tdXBkYXRlLWluZGV4aW5nLWNhY2hlXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBwcm9wcy51cGRhdGVJbmRleGluZ1R5cGVDYWNoZSgnaGlnaF9xdWFsaXR5Jyl9XG4gICAgICAgID5cbiAgICAgICAgICBVcGRhdGUgSW5kZXhpbmcgQ2FjaGVcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInN0ZXAtdHdvLXVwZGF0ZS1yZXRyaWV2YWwtY2FjaGVcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHByb3BzLnVwZGF0ZVJldHJpZXZhbE1ldGhvZENhY2hlKCdzZW1hbnRpY19zZWFyY2gnKX1cbiAgICAgICAgPlxuICAgICAgICAgIFVwZGF0ZSBSZXRyaWV2YWwgQ2FjaGVcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInN0ZXAtdHdvLXVwZGF0ZS1yZXN1bHQtY2FjaGVcIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHByb3BzLnVwZGF0ZVJlc3VsdENhY2hlKHsgYmF0Y2g6ICdiYXRjaC0xJywgZG9jdW1lbnRzOiBbXSB9KX1cbiAgICAgICAgPlxuICAgICAgICAgIFVwZGF0ZSBSZXN1bHQgQ2FjaGVcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG59KSlcblxudmkubW9jaygnLi9zdGVwLXRocmVlJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHByb3BzOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KSA9PiB7XG4gICAgc3RlcFRocmVlUHJvcHMgPSBwcm9wc1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwic3RlcC10aHJlZVwiPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInN0ZXAtdGhyZWUtZGF0YXNldC1pZFwiPntwcm9wcy5kYXRhc2V0SWQgfHwgJ25vbmUnfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJzdGVwLXRocmVlLWRhdGFzZXQtbmFtZVwiPntwcm9wcy5kYXRhc2V0TmFtZSB8fCAnbm9uZSd9PC9zcGFuPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInN0ZXAtdGhyZWUtaW5kZXhpbmctdHlwZVwiPntwcm9wcy5pbmRleGluZ1R5cGUgfHwgJ25vbmUnfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJzdGVwLXRocmVlLXJldHJpZXZhbC1tZXRob2RcIj57cHJvcHMucmV0cmlldmFsTWV0aG9kIHx8ICdub25lJ308L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG59KSlcblxudmkubW9jaygnLi90b3AtYmFyJywgKCkgPT4gKHtcbiAgVG9wQmFyOiAocHJvcHM6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IHtcbiAgICBfdG9wQmFyUHJvcHMgPSBwcm9wc1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwidG9wLWJhclwiPlxuICAgICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInRvcC1iYXItYWN0aXZlLWluZGV4XCI+e3Byb3BzLmFjdGl2ZUluZGV4fTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJ0b3AtYmFyLWRhdGFzZXQtaWRcIj57cHJvcHMuZGF0YXNldElkIHx8ICdub25lJ308L3NwYW4+XG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH0sXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgQnVpbGRlcnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVNb2NrRGF0YXNldCA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPERhdGFTZXQ+KTogRGF0YVNldCA9PiAoe1xuICBpZDogJ2RhdGFzZXQtMTIzJyxcbiAgbmFtZTogJ1Rlc3QgRGF0YXNldCcsXG4gIGluZGV4aW5nX3N0YXR1czogJ2NvbXBsZXRlZCcsXG4gIGljb25faW5mbzogeyBpY29uOiAnJywgaWNvbl9iYWNrZ3JvdW5kOiAnJywgaWNvbl90eXBlOiAnZW1vamknIGFzIGNvbnN0IH0sXG4gIGRlc2NyaXB0aW9uOiAnVGVzdCBkZXNjcmlwdGlvbicsXG4gIHBlcm1pc3Npb246IERhdGFzZXRQZXJtaXNzaW9uLm9ubHlNZSxcbiAgZGF0YV9zb3VyY2VfdHlwZTogRGF0YVNvdXJjZVR5cGUuRklMRSxcbiAgaW5kZXhpbmdfdGVjaG5pcXVlOiBJbmRleGluZ1R5cGVWYWx1ZXMuUVVBTElGSUVEIGFzIGFueSxcbiAgY3JlYXRlZF9ieTogJ3VzZXItMScsXG4gIHVwZGF0ZWRfYnk6ICd1c2VyLTEnLFxuICB1cGRhdGVkX2F0OiBEYXRlLm5vdygpLFxuICBhcHBfY291bnQ6IDAsXG4gIGRvY19mb3JtOiBDaHVua2luZ01vZGUudGV4dCxcbiAgZG9jdW1lbnRfY291bnQ6IDAsXG4gIHRvdGFsX2RvY3VtZW50X2NvdW50OiAwLFxuICB3b3JkX2NvdW50OiAwLFxuICBwcm92aWRlcjogJ29wZW5haScsXG4gIGVtYmVkZGluZ19tb2RlbDogJ3RleHQtZW1iZWRkaW5nLWFkYS0wMDInLFxuICBlbWJlZGRpbmdfbW9kZWxfcHJvdmlkZXI6ICdvcGVuYWknLFxuICBlbWJlZGRpbmdfYXZhaWxhYmxlOiB0cnVlLFxuICByZXRyaWV2YWxfbW9kZWxfZGljdDoge1xuICAgIHNlYXJjaF9tZXRob2Q6IFJFVFJJRVZFX01FVEhPRC5zZW1hbnRpYyxcbiAgICByZXJhbmtpbmdfZW5hYmxlOiBmYWxzZSxcbiAgICByZXJhbmtpbmdfbW9kZTogdW5kZWZpbmVkLFxuICAgIHJlcmFua2luZ19tb2RlbDogeyByZXJhbmtpbmdfcHJvdmlkZXJfbmFtZTogJycsIHJlcmFua2luZ19tb2RlbF9uYW1lOiAnJyB9LFxuICAgIHdlaWdodHM6IHVuZGVmaW5lZCxcbiAgICB0b3BfazogMyxcbiAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gICAgc2NvcmVfdGhyZXNob2xkOiAwLFxuICB9LFxuICByZXRyaWV2YWxfbW9kZWw6IHtcbiAgICBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0Quc2VtYW50aWMsXG4gICAgcmVyYW5raW5nX2VuYWJsZTogZmFsc2UsXG4gICAgcmVyYW5raW5nX21vZGU6IHVuZGVmaW5lZCxcbiAgICByZXJhbmtpbmdfbW9kZWw6IHsgcmVyYW5raW5nX3Byb3ZpZGVyX25hbWU6ICcnLCByZXJhbmtpbmdfbW9kZWxfbmFtZTogJycgfSxcbiAgICB3ZWlnaHRzOiB1bmRlZmluZWQsXG4gICAgdG9wX2s6IDMsXG4gICAgc2NvcmVfdGhyZXNob2xkX2VuYWJsZWQ6IGZhbHNlLFxuICAgIHNjb3JlX3RocmVzaG9sZDogMCxcbiAgfSxcbiAgdGFnczogW10sXG4gIGV4dGVybmFsX2tub3dsZWRnZV9pbmZvOiB7XG4gICAgZXh0ZXJuYWxfa25vd2xlZGdlX2lkOiAnJyxcbiAgICBleHRlcm5hbF9rbm93bGVkZ2VfYXBpX2lkOiAnJyxcbiAgICBleHRlcm5hbF9rbm93bGVkZ2VfYXBpX25hbWU6ICcnLFxuICAgIGV4dGVybmFsX2tub3dsZWRnZV9hcGlfZW5kcG9pbnQ6ICcnLFxuICB9LFxuICBleHRlcm5hbF9yZXRyaWV2YWxfbW9kZWw6IHtcbiAgICB0b3BfazogMyxcbiAgICBzY29yZV90aHJlc2hvbGQ6IDAuNSxcbiAgICBzY29yZV90aHJlc2hvbGRfZW5hYmxlZDogZmFsc2UsXG4gIH0sXG4gIGJ1aWx0X2luX2ZpZWxkX2VuYWJsZWQ6IGZhbHNlLFxuICBydW50aW1lX21vZGU6ICdnZW5lcmFsJyBhcyBjb25zdCxcbiAgZW5hYmxlX2FwaTogZmFsc2UsXG4gIGlzX211bHRpbW9kYWw6IGZhbHNlLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVNb2NrRGF0YVNvdXJjZUF1dGggPSAob3ZlcnJpZGVzPzogUGFydGlhbDxEYXRhU291cmNlQXV0aD4pOiBEYXRhU291cmNlQXV0aCA9PiAoe1xuICBjcmVkZW50aWFsX2lkOiAnY3JlZC0xJyxcbiAgcHJvdmlkZXI6ICdub3Rpb24nLFxuICBwbHVnaW5faWQ6ICdwbHVnaW4tMScsXG4gIC4uLm92ZXJyaWRlcyxcbn0gYXMgRGF0YVNvdXJjZUF1dGgpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBTdWl0ZVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdEYXRhc2V0VXBkYXRlRm9ybScsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgLy8gUmVzZXQgbW9jayBzdGF0ZVxuICAgIG1vY2tEYXRhc2V0RGV0YWlsID0gdW5kZWZpbmVkXG4gICAgbW9ja0VtYmVkZGluZ3NEZWZhdWx0TW9kZWwgPSB7IG1vZGVsOiAndGV4dC1lbWJlZGRpbmctYWRhLTAwMicsIHByb3ZpZGVyOiAnb3BlbmFpJyB9XG4gICAgbW9ja0RhdGFTb3VyY2VMaXN0ID0geyByZXN1bHQ6IFtjcmVhdGVNb2NrRGF0YVNvdXJjZUF1dGgoKV0gfVxuICAgIG1vY2tJc0xvYWRpbmdEYXRhU291cmNlTGlzdCA9IGZhbHNlXG4gICAgbW9ja0ZldGNoaW5nRXJyb3IgPSBmYWxzZVxuICAgIC8vIFJlc2V0IGNhcHR1cmVkIHByb3BzXG4gICAgc3RlcE9uZVByb3BzID0ge31cbiAgICBzdGVwVHdvUHJvcHMgPSB7fVxuICAgIHN0ZXBUaHJlZVByb3BzID0ge31cbiAgICBfdG9wQmFyUHJvcHMgPSB7fVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHMgLSBWZXJpZnkgY29tcG9uZW50IHJlbmRlcnMgY29ycmVjdGx5IGluIGRpZmZlcmVudCBzdGF0ZXNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndG9wLWJhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFRvcEJhciB3aXRoIGNvcnJlY3QgYWN0aXZlIGluZGV4IGZvciBzdGVwIDEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RvcC1iYXItYWN0aXZlLWluZGV4JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgU3RlcE9uZSBieSBkZWZhdWx0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3N0ZXAtdHdvJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3N0ZXAtdGhyZWUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgc3RhdGUgd2hlbiBkYXRhIHNvdXJjZSBsaXN0IGlzIGxvYWRpbmcnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrSXNMb2FkaW5nRGF0YVNvdXJjZUxpc3QgPSB0cnVlXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gTG9hZGluZyBjb21wb25lbnQgc2hvdWxkIGJlIHJlbmRlcmVkIChub3QgdGhlIHN0ZXBzKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdzdGVwLW9uZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3Igc3RhdGUgd2hlbiBmZXRjaGluZyBmYWlscycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaGluZ0Vycm9yID0gdHJ1ZVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5lcnJvci51bmF2YWlsYWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZyAtIFZlcmlmeSBkYXRhc2V0SWQgcHJvcCBiZWhhdmlvclxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdkYXRhc2V0SWQgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcGFzcyBkYXRhc2V0SWQgdG8gVG9wQmFyJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gZGF0YXNldElkPVwiZGF0YXNldC1hYmNcIiAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndG9wLWJhci1kYXRhc2V0LWlkJykpLnRvSGF2ZVRleHRDb250ZW50KCdkYXRhc2V0LWFiYycpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHBhc3MgZGF0YXNldElkIHRvIFN0ZXBPbmUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSBkYXRhc2V0SWQ9XCJkYXRhc2V0LWFiY1wiIC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc3RlcE9uZVByb3BzLmRhdGFzZXRJZCkudG9CZSgnZGF0YXNldC1hYmMnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBkYXRhc2V0SWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndG9wLWJhci1kYXRhc2V0LWlkJykpLnRvSGF2ZVRleHRDb250ZW50KCdub25lJylcbiAgICAgICAgZXhwZWN0KHN0ZXBPbmVQcm9wcy5kYXRhc2V0SWQpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTdGF0ZSBNYW5hZ2VtZW50IC0gVGVzdCBzdGF0ZSBpbml0aWFsaXphdGlvbiBhbmQgdHJhbnNpdGlvbnNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdTdGF0ZSBNYW5hZ2VtZW50JywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdkYXRhU291cmNlVHlwZSBzdGF0ZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIEZJTEUgZGF0YSBzb3VyY2UgdHlwZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1kYXRhLXNvdXJjZS10eXBlJykpLnRvSGF2ZVRleHRDb250ZW50KERhdGFTb3VyY2VUeXBlLkZJTEUpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHVwZGF0ZSBkYXRhU291cmNlVHlwZSB3aGVuIGNoYW5nZVR5cGUgaXMgY2FsbGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLWNoYW5nZS10eXBlJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLWRhdGEtc291cmNlLXR5cGUnKSkudG9IYXZlVGV4dENvbnRlbnQoRGF0YVNvdXJjZVR5cGUuTk9USU9OKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3N0ZXAgc3RhdGUnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgYXQgc3RlcCAxJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndG9wLWJhci1hY3RpdmUtaW5kZXgnKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB0cmFuc2l0aW9uIHRvIHN0ZXAgMiB3aGVuIG5leHRTdGVwIGlzIGNhbGxlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1uZXh0JykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnc3RlcC1vbmUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0b3AtYmFyLWFjdGl2ZS1pbmRleCcpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHRyYW5zaXRpb24gdG8gc3RlcCAzIGZyb20gc3RlcCAyJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgICAgLy8gRmlyc3QgZ28gdG8gc3RlcCAyXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5leHQnKSlcblxuICAgICAgICAvLyBBY3QgLSBnbyB0byBzdGVwIDNcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tbmV4dCcpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3N0ZXAtdHdvJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdGhyZWUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0b3AtYmFyLWFjdGl2ZS1pbmRleCcpKS50b0hhdmVUZXh0Q29udGVudCgnMicpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGdvIGJhY2sgdG8gc3RlcCAxIGZyb20gc3RlcCAyJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5leHQnKSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tcHJldicpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnc3RlcC10d28nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdmaWxlTGlzdCBzdGF0ZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIGVtcHR5IGZpbGUgbGlzdCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1maWxlcy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHVwZGF0ZSBmaWxlIGxpc3Qgd2hlbiB1cGRhdGVGaWxlTGlzdCBpcyBjYWxsZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtdXBkYXRlLWZpbGVzJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLWZpbGVzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcxJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdub3Rpb25QYWdlcyBzdGF0ZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaW5pdGlhbGl6ZSB3aXRoIGVtcHR5IG5vdGlvbiBwYWdlcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZSAmIEFjdFxuICAgICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1ub3Rpb24tcGFnZXMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB1cGRhdGUgbm90aW9uIHBhZ2VzIHdoZW4gdXBkYXRlTm90aW9uUGFnZXMgaXMgY2FsbGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLXVwZGF0ZS1ub3Rpb24tcGFnZXMnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtbm90aW9uLXBhZ2VzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcxJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3ZWJzaXRlUGFnZXMgc3RhdGUnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGluaXRpYWxpemUgd2l0aCBlbXB0eSB3ZWJzaXRlIHBhZ2VzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlICYgQWN0XG4gICAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLXdlYnNpdGUtcGFnZXMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB1cGRhdGUgd2Vic2l0ZSBwYWdlcyB3aGVuIHNldFdlYnNpdGVQYWdlcyBpcyBjYWxsZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtdXBkYXRlLXdlYnNpdGUtcGFnZXMnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtd2Vic2l0ZS1wYWdlcy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSAtIFRlc3QgbWVtb2l6YXRpb24gb2YgY2FsbGJhY2tzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5IGFuZCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHByb3ZpZGUgc3RhYmxlIHVwZGF0ZU5vdGlvblBhZ2VzIGNhbGxiYWNrIHJlZmVyZW5jZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG4gICAgICBjb25zdCBpbml0aWFsQ2FsbGJhY2sgPSBzdGVwT25lUHJvcHMudXBkYXRlTm90aW9uUGFnZXNcblxuICAgICAgLy8gQWN0IC0gdHJpZ2dlciBhIHJlcmVuZGVyXG4gICAgICByZXJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIGNhbGxiYWNrIHJlZmVyZW5jZSBzaG91bGQgYmUgdGhlIHNhbWUgZHVlIHRvIHVzZUNhbGxiYWNrXG4gICAgICBleHBlY3Qoc3RlcE9uZVByb3BzLnVwZGF0ZU5vdGlvblBhZ2VzKS50b0JlKGluaXRpYWxDYWxsYmFjaylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcm92aWRlIHN0YWJsZSB1cGRhdGVOb3Rpb25DcmVkZW50aWFsSWQgY2FsbGJhY2sgcmVmZXJlbmNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcbiAgICAgIGNvbnN0IGluaXRpYWxDYWxsYmFjayA9IHN0ZXBPbmVQcm9wcy51cGRhdGVOb3Rpb25DcmVkZW50aWFsSWRcblxuICAgICAgLy8gQWN0XG4gICAgICByZXJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHN0ZXBPbmVQcm9wcy51cGRhdGVOb3Rpb25DcmVkZW50aWFsSWQpLnRvQmUoaW5pdGlhbENhbGxiYWNrKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByb3ZpZGUgc3RhYmxlIHVwZGF0ZUZpbGVMaXN0IGNhbGxiYWNrIHJlZmVyZW5jZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG4gICAgICBjb25zdCBpbml0aWFsQ2FsbGJhY2sgPSBzdGVwT25lUHJvcHMudXBkYXRlRmlsZUxpc3RcblxuICAgICAgLy8gQWN0XG4gICAgICByZXJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHN0ZXBPbmVQcm9wcy51cGRhdGVGaWxlTGlzdCkudG9CZShpbml0aWFsQ2FsbGJhY2spXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJvdmlkZSBzdGFibGUgdXBkYXRlRmlsZSBjYWxsYmFjayByZWZlcmVuY2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuICAgICAgY29uc3QgaW5pdGlhbENhbGxiYWNrID0gc3RlcE9uZVByb3BzLnVwZGF0ZUZpbGVcblxuICAgICAgLy8gQWN0XG4gICAgICByZXJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHN0ZXBPbmVQcm9wcy51cGRhdGVGaWxlKS50b0JlKGluaXRpYWxDYWxsYmFjaylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcm92aWRlIHN0YWJsZSB1cGRhdGVJbmRleGluZ1R5cGVDYWNoZSBjYWxsYmFjayByZWZlcmVuY2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtbmV4dCcpKVxuICAgICAgY29uc3QgaW5pdGlhbENhbGxiYWNrID0gc3RlcFR3b1Byb3BzLnVwZGF0ZUluZGV4aW5nVHlwZUNhY2hlXG5cbiAgICAgIC8vIEFjdCAtIHRyaWdnZXIgYSByZXJlbmRlciB3aXRob3V0IGNoYW5naW5nIHN0ZXBcbiAgICAgIHJlcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gY2FsbGJhY2tzIHdpdGggc2FtZSBkZXBlbmRlbmNpZXMgc2hvdWxkIGJlIHN0YWJsZVxuICAgICAgZXhwZWN0KHN0ZXBUd29Qcm9wcy51cGRhdGVJbmRleGluZ1R5cGVDYWNoZSkudG9CZShpbml0aWFsQ2FsbGJhY2spXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgLSBUZXN0IGV2ZW50IGhhbmRsZXJzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBvcGVuIGFjY291bnQgc2V0dGluZ3Mgd2hlbiBvblNldHRpbmcgaXMgY2FsbGVkIGZyb20gU3RlcE9uZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtc2V0dGluZycpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgcGF5bG9hZDogJ2RhdGEtc291cmNlJyB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG9wZW4gcHJvdmlkZXIgc2V0dGluZ3Mgd2hlbiBvblNldHRpbmcgaXMgY2FsbGVkIGZyb20gU3RlcFR3bycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1uZXh0JykpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tc2V0dGluZycpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgcGF5bG9hZDogJ3Byb3ZpZGVyJyB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjcmF3bCBvcHRpb25zIHdoZW4gb25DcmF3bE9wdGlvbnNDaGFuZ2UgaXMgY2FsbGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS11cGRhdGUtY3Jhd2wtb3B0aW9ucycpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzdGVwT25lUHJvcHMuY3Jhd2xPcHRpb25zLmxpbWl0KS50b0JlKDIwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBjcmF3bCBwcm92aWRlciB3aGVuIG9uV2Vic2l0ZUNyYXdsUHJvdmlkZXJDaGFuZ2UgaXMgY2FsbGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS11cGRhdGUtY3Jhd2wtcHJvdmlkZXInKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gTmVlZCB0byB2ZXJpZnkgc3RhdGUgdGhyb3VnaCBTdGVwVHdvIHByb3BzXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1uZXh0JykpXG4gICAgICBleHBlY3Qoc3RlcFR3b1Byb3BzLndlYnNpdGVDcmF3bFByb3ZpZGVyKS50b0JlKERhdGFTb3VyY2VQcm92aWRlci5maXJlQ3Jhd2wpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGpvYiBpZCB3aGVuIG9uV2Vic2l0ZUNyYXdsSm9iSWRDaGFuZ2UgaXMgY2FsbGVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS11cGRhdGUtam9iLWlkJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFZlcmlmeSB0aHJvdWdoIFN0ZXBUd28gcHJvcHNcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5leHQnKSlcbiAgICAgIGV4cGVjdChzdGVwVHdvUHJvcHMud2Vic2l0ZUNyYXdsSm9iSWQpLnRvQmUoJ2pvYi0xMjMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBmaWxlIHByb2dyZXNzIGNvcnJlY3RseSB1c2luZyBpbW1lciBwcm9kdWNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLXVwZGF0ZS1maWxlcycpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLXVwZGF0ZS1maWxlLXByb2dyZXNzJykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFByb2dyZXNzIHNob3VsZCBiZSB1cGRhdGVkXG4gICAgICBleHBlY3Qoc3RlcE9uZVByb3BzLmZpbGVzWzBdLnByb2dyZXNzKS50b0JlKDUwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBub3Rpb24gY3JlZGVudGlhbCBpZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtdXBkYXRlLW5vdGlvbi1jcmVkZW50aWFsJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHN0ZXBPbmVQcm9wcy5ub3Rpb25DcmVkZW50aWFsSWQpLnRvQmUoJ2NyZWRlbnRpYWwtMTIzJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTdGVwIFR3byBTcGVjaWZpYyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0ZXBUd28gUmVuZGVyaW5nIGFuZCBQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3MgaXNBUElLZXlTZXQgYXMgdHJ1ZSB3aGVuIGVtYmVkZGluZ3NEZWZhdWx0TW9kZWwgZXhpc3RzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0VtYmVkZGluZ3NEZWZhdWx0TW9kZWwgPSB7IG1vZGVsOiAnbW9kZWwtMScsIHByb3ZpZGVyOiAnb3BlbmFpJyB9XG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5leHQnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLXR3by1pcy1hcGkta2V5LXNldCcpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBpc0FQSUtleVNldCBhcyBmYWxzZSB3aGVuIGVtYmVkZGluZ3NEZWZhdWx0TW9kZWwgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0VtYmVkZGluZ3NEZWZhdWx0TW9kZWwgPSB1bmRlZmluZWRcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtbmV4dCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvLWlzLWFwaS1rZXktc2V0JykpLnRvSGF2ZVRleHRDb250ZW50KCdmYWxzZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IGRhdGFTb3VyY2VUeXBlIHRvIFN0ZXBUd28nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtY2hhbmdlLXR5cGUnKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1uZXh0JykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tZGF0YS1zb3VyY2UtdHlwZScpKS50b0hhdmVUZXh0Q29udGVudChEYXRhU291cmNlVHlwZS5OT1RJT04pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBmaWxlcyBtYXBwZWQgdG8gZmlsZSBwcm9wZXJ0eSB0byBTdGVwVHdvJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLXVwZGF0ZS1maWxlcycpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5leHQnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLXR3by1maWxlcy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGluZGV4aW5nIHR5cGUgY2FjaGUgZnJvbSBTdGVwVHdvJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5leHQnKSlcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLXR3by11cGRhdGUtaW5kZXhpbmctY2FjaGUnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gR28gdG8gc3RlcCAzIGFuZCB2ZXJpZnlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvLW5leHQnKSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdGhyZWUtaW5kZXhpbmctdHlwZScpKS50b0hhdmVUZXh0Q29udGVudCgnaGlnaF9xdWFsaXR5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgcmV0cmlldmFsIG1ldGhvZCBjYWNoZSBmcm9tIFN0ZXBUd28nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtbmV4dCcpKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvLXVwZGF0ZS1yZXRyaWV2YWwtY2FjaGUnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gR28gdG8gc3RlcCAzIGFuZCB2ZXJpZnlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvLW5leHQnKSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdGhyZWUtcmV0cmlldmFsLW1ldGhvZCcpKS50b0hhdmVUZXh0Q29udGVudCgnc2VtYW50aWNfc2VhcmNoJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgcmVzdWx0IGNhY2hlIGZyb20gU3RlcFR3bycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1uZXh0JykpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tdXBkYXRlLXJlc3VsdC1jYWNoZScpKVxuXG4gICAgICAvLyBBc3NlcnQgLSBHbyB0byBzdGVwIDMgYW5kIHZlcmlmeSBjcmVhdGlvbkNhY2hlIGlzIHBhc3NlZFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tbmV4dCcpKVxuICAgICAgZXhwZWN0KHN0ZXBUaHJlZVByb3BzLmNyZWF0aW9uQ2FjaGUpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChzdGVwVGhyZWVQcm9wcy5jcmVhdGlvbkNhY2hlPy5iYXRjaCkudG9CZSgnYmF0Y2gtMScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU3RlcCBUd28gd2l0aCBkYXRhc2V0SWQgYW5kIGRhdGFzZXREZXRhaWxcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdTdGVwVHdvIHdpdGggZXhpc3RpbmcgZGF0YXNldCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgU3RlcFR3byB3aGVuIGRhdGFzZXRJZCBleGlzdHMgYnV0IGRhdGFzZXREZXRhaWwgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFzZXREZXRhaWwgPSB1bmRlZmluZWRcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gZGF0YXNldElkPVwiZGF0YXNldC0xMjNcIiAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1uZXh0JykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFN0ZXBUd28gc2hvdWxkIG5vdCByZW5kZXIgZHVlIHRvIGNvbmRpdGlvblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdzdGVwLXR3bycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBTdGVwVHdvIHdoZW4gZGF0YXNldElkIGV4aXN0cyBhbmQgZGF0YXNldERldGFpbCBpcyBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFzZXREZXRhaWwgPSBjcmVhdGVNb2NrRGF0YXNldCgpXG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCIgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtbmV4dCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGluZGV4aW5nVHlwZSBmcm9tIGRhdGFzZXREZXRhaWwgdG8gU3RlcFR3bycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc2V0RGV0YWlsID0gY3JlYXRlTW9ja0RhdGFzZXQoeyBpbmRleGluZ190ZWNobmlxdWU6IEluZGV4aW5nVHlwZVZhbHVlcy5FQ09OT01JQ0FMIGFzIGFueSB9KVxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSBkYXRhc2V0SWQ9XCJkYXRhc2V0LTEyM1wiIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5leHQnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc3RlcFR3b1Byb3BzLmluZGV4aW5nVHlwZSkudG9CZSgnZWNvbm9teScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU3RlcCBUaHJlZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0ZXBUaHJlZSBSZW5kZXJpbmcgYW5kIFByb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBkYXRhc2V0SWQgdG8gU3RlcFRocmVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAtIE5lZWQgZGF0YXNldERldGFpbCBmb3IgU3RlcFR3byB0byByZW5kZXIgd2hlbiBkYXRhc2V0SWQgZXhpc3RzXG4gICAgICBtb2NrRGF0YXNldERldGFpbCA9IGNyZWF0ZU1vY2tEYXRhc2V0KClcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gZGF0YXNldElkPVwiZGF0YXNldC00NTZcIiAvPilcblxuICAgICAgLy8gQWN0IC0gTmF2aWdhdGUgdG8gc3RlcCAzXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1uZXh0JykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLXR3by1uZXh0JykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10aHJlZS1kYXRhc2V0LWlkJykpLnRvSGF2ZVRleHRDb250ZW50KCdkYXRhc2V0LTQ1NicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBkYXRhc2V0TmFtZSBmcm9tIGRhdGFzZXREZXRhaWwgdG8gU3RlcFRocmVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0RhdGFzZXREZXRhaWwgPSBjcmVhdGVNb2NrRGF0YXNldCh7IG5hbWU6ICdNeSBTcGVjaWFsIERhdGFzZXQnIH0pXG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCIgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtbmV4dCcpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tbmV4dCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdGhyZWUtZGF0YXNldC1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdNeSBTcGVjaWFsIERhdGFzZXQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBjYWNoZWQgaW5kZXhpbmcgdHlwZSB3aGVuIGRhdGFzZXREZXRhaWwgaW5kZXhpbmdfdGVjaG5pcXVlIGlzIG5vdCBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAvLyBOYXZpZ2F0ZSB0byBzdGVwIDIgYW5kIHNldCBjYWNoZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtbmV4dCcpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tdXBkYXRlLWluZGV4aW5nLWNhY2hlJykpXG5cbiAgICAgIC8vIEFjdCAtIE5hdmlnYXRlIHRvIHN0ZXAgM1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tbmV4dCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdGhyZWUtaW5kZXhpbmctdHlwZScpKS50b0hhdmVUZXh0Q29udGVudCgnaGlnaF9xdWFsaXR5JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgZGF0YXNldERldGFpbCBpbmRleGluZ190ZWNobmlxdWUgb3ZlciBjYWNoZWQgdmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YXNldERldGFpbCA9IGNyZWF0ZU1vY2tEYXRhc2V0KHsgaW5kZXhpbmdfdGVjaG5pcXVlOiBJbmRleGluZ1R5cGVWYWx1ZXMuRUNPTk9NSUNBTCBhcyBhbnkgfSlcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gZGF0YXNldElkPVwiZGF0YXNldC0xMjNcIiAvPilcblxuICAgICAgLy8gTmF2aWdhdGUgdG8gc3RlcCAyIGFuZCBzZXQgZGlmZmVyZW50IGNhY2hlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1uZXh0JykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLXR3by11cGRhdGUtaW5kZXhpbmctY2FjaGUnKSlcblxuICAgICAgLy8gQWN0IC0gTmF2aWdhdGUgdG8gc3RlcCAzXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLXR3by1uZXh0JykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCB1c2UgZGF0YXNldERldGFpbCB2YWx1ZSwgbm90IGNhY2hlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLXRocmVlLWluZGV4aW5nLXR5cGUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2Vjb25vbXknKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSByZXRyaWV2YWwgbWV0aG9kIGZyb20gZGF0YXNldERldGFpbCB3aGVuIGF2YWlsYWJsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc2V0RGV0YWlsID0gY3JlYXRlTW9ja0RhdGFzZXQoKVxuICAgICAgbW9ja0RhdGFzZXREZXRhaWwucmV0cmlldmFsX21vZGVsX2RpY3QgPSB7XG4gICAgICAgIC4uLm1vY2tEYXRhc2V0RGV0YWlsLnJldHJpZXZhbF9tb2RlbF9kaWN0LFxuICAgICAgICBzZWFyY2hfbWV0aG9kOiBSRVRSSUVWRV9NRVRIT0QuZnVsbFRleHQsXG4gICAgICB9XG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCIgLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtbmV4dCcpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tbmV4dCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdGhyZWUtcmV0cmlldmFsLW1ldGhvZCcpKS50b0hhdmVUZXh0Q29udGVudCgnZnVsbF90ZXh0X3NlYXJjaCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU3RlcE9uZSBQcm9wcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0ZXBPbmUgUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIGF1dGhlZERhdGFTb3VyY2VMaXN0IGZyb20gaG9vayByZXNwb25zZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tBdXRoID0gY3JlYXRlTW9ja0RhdGFTb3VyY2VBdXRoKHsgcHJvdmlkZXI6ICdnb29nbGUtZHJpdmUnIH0pXG4gICAgICBtb2NrRGF0YVNvdXJjZUxpc3QgPSB7IHJlc3VsdDogW21vY2tBdXRoXSB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc3RlcE9uZVByb3BzLmF1dGhlZERhdGFTb3VyY2VMaXN0KS50b0VxdWFsKFttb2NrQXV0aF0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBlbXB0eSBhcnJheSB3aGVuIGRhdGFTb3VyY2VMaXN0IGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhU291cmNlTGlzdCA9IHVuZGVmaW5lZFxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHN0ZXBPbmVQcm9wcy5hdXRoZWREYXRhU291cmNlTGlzdCkudG9FcXVhbChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGRhdGFTb3VyY2VUeXBlRGlzYWJsZSBhcyB0cnVlIHdoZW4gZGF0YXNldERldGFpbCBoYXMgZGF0YV9zb3VyY2VfdHlwZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc2V0RGV0YWlsID0gY3JlYXRlTW9ja0RhdGFzZXQoeyBkYXRhX3NvdXJjZV90eXBlOiBEYXRhU291cmNlVHlwZS5GSUxFIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSBkYXRhc2V0SWQ9XCJkYXRhc2V0LTEyM1wiIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzdGVwT25lUHJvcHMuZGF0YVNvdXJjZVR5cGVEaXNhYmxlKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBkYXRhU291cmNlVHlwZURpc2FibGUgYXMgZmFsc2Ugd2hlbiBkYXRhc2V0RGV0YWlsIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc2V0RGV0YWlsID0gdW5kZWZpbmVkXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc3RlcE9uZVByb3BzLmRhdGFTb3VyY2VUeXBlRGlzYWJsZSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGRlZmF1bHQgY3Jhd2wgb3B0aW9ucycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHN0ZXBPbmVQcm9wcy5jcmF3bE9wdGlvbnMpLnRvRXF1YWwoe1xuICAgICAgICBjcmF3bF9zdWJfcGFnZXM6IHRydWUsXG4gICAgICAgIG9ubHlfbWFpbl9jb250ZW50OiB0cnVlLFxuICAgICAgICBpbmNsdWRlczogJycsXG4gICAgICAgIGV4Y2x1ZGVzOiAnJyxcbiAgICAgICAgbGltaXQ6IDEwLFxuICAgICAgICBtYXhfZGVwdGg6ICcnLFxuICAgICAgICB1c2Vfc2l0ZW1hcDogdHJ1ZSxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyAtIFRlc3QgYm91bmRhcnkgY29uZGl0aW9ucyBhbmQgZXJyb3IgaGFuZGxpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGRhdGEgc291cmNlIGxpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YVNvdXJjZUxpc3QgPSB7IHJlc3VsdDogW10gfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHN0ZXBPbmVQcm9wcy5hdXRoZWREYXRhU291cmNlTGlzdCkudG9FcXVhbChbXSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGRhdGFzZXREZXRhaWwgcmV0cmlldmFsX21vZGVsX2RpY3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRGF0YXNldERldGFpbCA9IGNyZWF0ZU1vY2tEYXRhc2V0KClcbiAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgLSBUZXN0aW5nIHVuZGVmaW5lZCBjYXNlXG4gICAgICBtb2NrRGF0YXNldERldGFpbC5yZXRyaWV2YWxfbW9kZWxfZGljdCA9IHVuZGVmaW5lZFxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSBkYXRhc2V0SWQ9XCJkYXRhc2V0LTEyM1wiIC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5leHQnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvLXVwZGF0ZS1yZXRyaWV2YWwtY2FjaGUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvLW5leHQnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHVzZSBjYWNoZWQgdmFsdWVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdGhyZWUtcmV0cmlldmFsLW1ldGhvZCcpKS50b0hhdmVUZXh0Q29udGVudCgnc2VtYW50aWNfc2VhcmNoJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3RlcCBzdGF0ZSBjb3JyZWN0bHkgYWZ0ZXIgbXVsdGlwbGUgbmF2aWdhdGlvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAvLyBBY3QgLSBOYXZpZ2F0ZSBmb3J3YXJkIGFuZCBiYWNrIG11bHRpcGxlIHRpbWVzXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1uZXh0JykpIC8vIHRvIHN0ZXAgMlxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tcHJldicpKSAvLyBiYWNrIHRvIHN0ZXAgMVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtbmV4dCcpKSAvLyB0byBzdGVwIDJcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvLW5leHQnKSkgLy8gdG8gc3RlcCAzXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10aHJlZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0b3AtYmFyLWFjdGl2ZS1pbmRleCcpKS50b0hhdmVUZXh0Q29udGVudCgnMicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJlc3VsdCBjYWNoZSBiZWluZyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAvLyBBY3QgLSBOYXZpZ2F0ZSB0byBzdGVwIDMgd2l0aG91dCBzZXR0aW5nIHJlc3VsdCBjYWNoZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtbmV4dCcpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tbmV4dCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzdGVwVGhyZWVQcm9wcy5jcmVhdGlvbkNhY2hlKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHJlc3VsdCBjYWNoZSB0byBzdGVwIHRocmVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5leHQnKSlcblxuICAgICAgLy8gU2V0IHJlc3VsdCBjYWNoZSB2YWx1ZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC10d28tdXBkYXRlLXJlc3VsdC1jYWNoZScpKVxuXG4gICAgICAvLyBOYXZpZ2F0ZSB0byBzdGVwIDNcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvLW5leHQnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gUmVzdWx0IGNhY2hlIGlzIGNvcnJlY3RseSBwYXNzZWQgdG8gc3RlcCB0aHJlZVxuICAgICAgZXhwZWN0KHN0ZXBUaHJlZVByb3BzLmNyZWF0aW9uQ2FjaGUpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChzdGVwVGhyZWVQcm9wcy5jcmVhdGlvbkNhY2hlPy5iYXRjaCkudG9CZSgnYmF0Y2gtMScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcHJlc2VydmUgc3RhdGUgd2hlbiBuYXZpZ2F0aW5nIGJldHdlZW4gc3RlcHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAvLyBTZXQgdXAgdmFyaW91cyBzdGF0ZXNcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLWNoYW5nZS10eXBlJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS11cGRhdGUtZmlsZXMnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLXVwZGF0ZS1ub3Rpb24tcGFnZXMnKSlcblxuICAgICAgLy8gTmF2aWdhdGUgdG8gc3RlcCAyIGFuZCBiYWNrXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1uZXh0JykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLXR3by1wcmV2JykpXG5cbiAgICAgIC8vIEFzc2VydCAtIEFsbCBzdGF0ZSBzaG91bGQgYmUgcHJlc2VydmVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1kYXRhLXNvdXJjZS10eXBlJykpLnRvSGF2ZVRleHRDb250ZW50KERhdGFTb3VyY2VUeXBlLk5PVElPTilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLWZpbGVzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcxJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5vdGlvbi1wYWdlcy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gSW50ZWdyYXRpb24gVGVzdHMgLSBUZXN0IGNvbXBsZXRlIGZsb3dzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb21wbGV0ZSBmdWxsIGZsb3cgZnJvbSBzdGVwIDEgdG8gc3RlcCAzIHdpdGggYWxsIHN0YXRlIHVwZGF0ZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAvLyBTdGVwIDE6IFNldCB1cCBkYXRhXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS11cGRhdGUtZmlsZXMnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5leHQnKSlcblxuICAgICAgLy8gU3RlcCAyOiBTZXQgY2FjaGVzXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLXR3by11cGRhdGUtaW5kZXhpbmctY2FjaGUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvLXVwZGF0ZS1yZXRyaWV2YWwtY2FjaGUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvLXVwZGF0ZS1yZXN1bHQtY2FjaGUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvLW5leHQnKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gQWxsIGRhdGEgZmxvd3MgdGhyb3VnaCB0byBTdGVwIDNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdGhyZWUtaW5kZXhpbmctdHlwZScpKS50b0hhdmVUZXh0Q29udGVudCgnaGlnaF9xdWFsaXR5JylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdGhyZWUtcmV0cmlldmFsLW1ldGhvZCcpKS50b0hhdmVUZXh0Q29udGVudCgnc2VtYW50aWNfc2VhcmNoJylcbiAgICAgIGV4cGVjdChzdGVwVGhyZWVQcm9wcy5jcmVhdGlvbkNhY2hlPy5iYXRjaCkudG9CZSgnYmF0Y2gtMScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbXBsZXRlIHdlYnNpdGUgY3Jhd2wgd29ya2Zsb3cnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAvLyBTZXQgd2Vic2l0ZSBkYXRhIHNvdXJjZSB0aHJvdWdoIGJ1dHRvbiBjbGlja1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtdXBkYXRlLXdlYnNpdGUtcGFnZXMnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLXVwZGF0ZS1jcmF3bC1vcHRpb25zJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS11cGRhdGUtY3Jhd2wtcHJvdmlkZXInKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLXVwZGF0ZS1qb2ItaWQnKSlcblxuICAgICAgLy8gTmF2aWdhdGUgdG8gc3RlcCAyXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1uZXh0JykpXG5cbiAgICAgIC8vIEFzc2VydCAtIEFsbCB3ZWJzaXRlIGRhdGEgcGFzc2VkIHRvIFN0ZXBUd29cbiAgICAgIGV4cGVjdChzdGVwVHdvUHJvcHMud2Vic2l0ZVBhZ2VzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KHN0ZXBUd29Qcm9wcy53ZWJzaXRlQ3Jhd2xQcm92aWRlcikudG9CZShEYXRhU291cmNlUHJvdmlkZXIuZmlyZUNyYXdsKVxuICAgICAgZXhwZWN0KHN0ZXBUd29Qcm9wcy53ZWJzaXRlQ3Jhd2xKb2JJZCkudG9CZSgnam9iLTEyMycpXG4gICAgICBleHBlY3Qoc3RlcFR3b1Byb3BzLmNyYXdsT3B0aW9ucy5saW1pdCkudG9CZSgyMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29tcGxldGUgbm90aW9uIHdvcmtmbG93JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgLy8gU2V0IG5vdGlvbiBkYXRhIHNvdXJjZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUtY2hhbmdlLXR5cGUnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLXVwZGF0ZS1ub3Rpb24tcGFnZXMnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLXVwZGF0ZS1ub3Rpb24tY3JlZGVudGlhbCcpKVxuXG4gICAgICAvLyBOYXZpZ2F0ZSB0byBzdGVwIDJcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5leHQnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc3RlcFR3b1Byb3BzLm5vdGlvblBhZ2VzLmxlbmd0aCkudG9CZSgxKVxuICAgICAgZXhwZWN0KHN0ZXBUd29Qcm9wcy5ub3Rpb25DcmVkZW50aWFsSWQpLnRvQmUoJ2NyZWRlbnRpYWwtMTIzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZWRpdCBtb2RlIHdpdGggZXhpc3RpbmcgZGF0YXNldCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tEYXRhc2V0RGV0YWlsID0gY3JlYXRlTW9ja0RhdGFzZXQoe1xuICAgICAgICBuYW1lOiAnRXhpc3RpbmcgRGF0YXNldCcsXG4gICAgICAgIGluZGV4aW5nX3RlY2huaXF1ZTogSW5kZXhpbmdUeXBlVmFsdWVzLlFVQUxJRklFRCBhcyBhbnksXG4gICAgICAgIGRhdGFfc291cmNlX3R5cGU6IERhdGFTb3VyY2VUeXBlLk5PVElPTixcbiAgICAgIH0pXG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIGRhdGFzZXRJZD1cImRhdGFzZXQtMTIzXCIgLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFN0ZXAgMSBzaG91bGQgaGF2ZSBkaXNhYmxlZCBkYXRhIHNvdXJjZSB0eXBlXG4gICAgICBleHBlY3Qoc3RlcE9uZVByb3BzLmRhdGFTb3VyY2VUeXBlRGlzYWJsZSkudG9CZSh0cnVlKVxuXG4gICAgICAvLyBOYXZpZ2F0ZSB0aHJvdWdoXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS1uZXh0JykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFN0ZXAgMiBzaG91bGQgcmVjZWl2ZSBkYXRhc2V0IGluZm9cbiAgICAgIGV4cGVjdChzdGVwVHdvUHJvcHMuaW5kZXhpbmdUeXBlKS50b0JlKCdoaWdoX3F1YWxpdHknKVxuICAgICAgZXhwZWN0KHN0ZXBUd29Qcm9wcy5kYXRhc2V0SWQpLnRvQmUoJ2RhdGFzZXQtMTIzJylcblxuICAgICAgLy8gTmF2aWdhdGUgdG8gU3RlcCAzXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLXR3by1uZXh0JykpXG5cbiAgICAgIC8vIEFzc2VydCAtIFN0ZXAgMyBzaG91bGQgc2hvdyBkYXRhc2V0IGRldGFpbHNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdGhyZWUtZGF0YXNldC1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdFeGlzdGluZyBEYXRhc2V0JylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdGhyZWUtaW5kZXhpbmctdHlwZScpKS50b0hhdmVUZXh0Q29udGVudCgnaGlnaF9xdWFsaXR5JylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBEZWZhdWx0IENyYXdsIE9wdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdEZWZhdWx0IENyYXdsIE9wdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgZGVmYXVsdCBjcmF3bCBvcHRpb25zIHN0cnVjdHVyZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgJiBBY3RcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgY3Jhd2xPcHRpb25zID0gc3RlcE9uZVByb3BzLmNyYXdsT3B0aW9uc1xuICAgICAgZXhwZWN0KGNyYXdsT3B0aW9ucykudG9NYXRjaE9iamVjdCh7XG4gICAgICAgIGNyYXdsX3N1Yl9wYWdlczogdHJ1ZSxcbiAgICAgICAgb25seV9tYWluX2NvbnRlbnQ6IHRydWUsXG4gICAgICAgIGluY2x1ZGVzOiAnJyxcbiAgICAgICAgZXhjbHVkZXM6ICcnLFxuICAgICAgICBsaW1pdDogMTAsXG4gICAgICAgIG1heF9kZXB0aDogJycsXG4gICAgICAgIHVzZV9zaXRlbWFwOiB0cnVlLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBjcmF3bCBvcHRpb25zIHdoZW4gbmF2aWdhdGluZyBzdGVwcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIFVwZGF0ZSBjcmF3bCBvcHRpb25zXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGVwLW9uZS11cGRhdGUtY3Jhd2wtb3B0aW9ucycpKVxuXG4gICAgICAvLyBOYXZpZ2F0ZSB0byBzdGVwIDIgYW5kIGJhY2tcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtb25lLW5leHQnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0ZXAtdHdvLXByZXYnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc3RlcE9uZVByb3BzLmNyYXdsT3B0aW9ucy5saW1pdCkudG9CZSgyMClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFcnJvciBTdGF0ZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0Vycm9yIFN0YXRlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgZXJyb3IgbWVzc2FnZSB3aGVuIGZldGNoaW5nIGRhdGEgc291cmNlIGxpc3QgZmFpbHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hpbmdFcnJvciA9IHRydWVcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGVycm9yRWxlbWVudCA9IHNjcmVlbi5nZXRCeVRleHQoJ2RhdGFzZXRDcmVhdGlvbi5lcnJvci51bmF2YWlsYWJsZScpXG4gICAgICBleHBlY3QoZXJyb3JFbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBzdGVwcyB3aGVuIGluIGVycm9yIHN0YXRlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0ZldGNoaW5nRXJyb3IgPSB0cnVlXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3N0ZXAtb25lJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3N0ZXAtdHdvJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3N0ZXAtdGhyZWUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZXJyb3IgcGFnZSB3aXRoIDUwMCBjb2RlIHdoZW4gaW4gZXJyb3Igc3RhdGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hpbmdFcnJvciA9IHRydWVcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBFcnJvciBzdGF0ZSByZW5kZXJzIEFwcFVuYXZhaWxhYmxlLCBub3QgdGhlIG5vcm1hbCBsYXlvdXRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCc1MDAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCd0b3AtYmFyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTG9hZGluZyBTdGF0ZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0xvYWRpbmcgU3RhdGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBzdGVwcyB3aGlsZSBsb2FkaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzTG9hZGluZ0RhdGFTb3VyY2VMaXN0ID0gdHJ1ZVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8RGF0YXNldFVwZGF0ZUZvcm0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdzdGVwLW9uZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBUb3BCYXIgd2hpbGUgbG9hZGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tJc0xvYWRpbmdEYXRhU291cmNlTGlzdCA9IHRydWVcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPERhdGFzZXRVcGRhdGVGb3JtIC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RvcC1iYXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBTdGVwT25lIGFmdGVyIGxvYWRpbmcgY29tcGxldGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0lzTG9hZGluZ0RhdGFTb3VyY2VMaXN0ID0gdHJ1ZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gSW5pdGlhbGx5IG5vdCByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdzdGVwLW9uZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBBY3QgLSBMb2FkaW5nIGNvbXBsZXRlc1xuICAgICAgbW9ja0lzTG9hZGluZ0RhdGFTb3VyY2VMaXN0ID0gZmFsc2VcbiAgICAgIHJlcmVuZGVyKDxEYXRhc2V0VXBkYXRlRm9ybSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gTm93IHJlbmRlcmVkXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RlcC1vbmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==