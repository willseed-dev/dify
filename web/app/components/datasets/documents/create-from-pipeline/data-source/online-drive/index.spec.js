"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const constants_1 = require("@/app/components/header/account-setting/constants");
const pipeline_1 = require("@/models/pipeline");
const header_1 = require("./header");
const index_1 = require("./index");
const utils_1 = require("./utils");
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
// Mock Toast
const { mockToastNotify } = vi.hoisted(() => ({
    mockToastNotify: vi.fn(),
}));
vi.mock('@/app/components/base/toast', () => ({
    default: {
        notify: mockToastNotify,
    },
}));
// Note: zustand/react/shallow useShallow is imported directly (simple utility function)
// Mock store state
const mockStoreState = {
    nextPageParameters: {},
    breadcrumbs: [],
    prefix: [],
    keywords: '',
    bucket: '',
    selectedFileIds: [],
    onlineDriveFileList: [],
    currentCredentialId: '',
    isTruncated: { current: false },
    currentNextPageParametersRef: { current: {} },
    setOnlineDriveFileList: vi.fn(),
    setKeywords: vi.fn(),
    setSelectedFileIds: vi.fn(),
    setBreadcrumbs: vi.fn(),
    setPrefix: vi.fn(),
    setBucket: vi.fn(),
    setHasBucket: vi.fn(),
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
// Mock FileList component
vi.mock('./file-list', () => ({
    default: (props) => (<div data-testid="file-list">
      <span data-testid="file-list-count">{props.fileList?.length || 0}</span>
      <span data-testid="file-list-selected-count">{props.selectedFileIds?.length || 0}</span>
      <span data-testid="file-list-breadcrumbs">{props.breadcrumbs?.join('/') || ''}</span>
      <span data-testid="file-list-keywords">{props.keywords}</span>
      <span data-testid="file-list-bucket">{props.bucket}</span>
      <span data-testid="file-list-loading">{String(props.isLoading)}</span>
      <span data-testid="file-list-is-in-pipeline">{String(props.isInPipeline)}</span>
      <span data-testid="file-list-support-batch">{String(props.supportBatchUpload)}</span>
      <input data-testid="file-list-search-input" onChange={e => props.updateKeywords(e.target.value)}/>
      <button data-testid="file-list-reset-keywords" onClick={props.resetKeywords}>Reset</button>
      <button data-testid="file-list-select-file" onClick={() => {
            const file = { id: 'file-1', name: 'test.txt', type: pipeline_1.OnlineDriveFileType.file };
            props.handleSelectFile(file);
        }}>
        Select File
      </button>
      <button data-testid="file-list-select-bucket" onClick={() => {
            const file = { id: 'bucket-1', name: 'my-bucket', type: pipeline_1.OnlineDriveFileType.bucket };
            props.handleSelectFile(file);
        }}>
        Select Bucket
      </button>
      <button data-testid="file-list-open-folder" onClick={() => {
            const file = { id: 'folder-1', name: 'my-folder', type: pipeline_1.OnlineDriveFileType.folder };
            props.handleOpenFolder(file);
        }}>
        Open Folder
      </button>
      <button data-testid="file-list-open-bucket" onClick={() => {
            const file = { id: 'bucket-1', name: 'my-bucket', type: pipeline_1.OnlineDriveFileType.bucket };
            props.handleOpenFolder(file);
        }}>
        Open Bucket
      </button>
      <button data-testid="file-list-open-file" onClick={() => {
            const file = { id: 'file-1', name: 'test.txt', type: pipeline_1.OnlineDriveFileType.file };
            props.handleOpenFolder(file);
        }}>
        Open File
      </button>
    </div>),
}));
// ==========================================
// Test Data Builders
// ==========================================
const createMockNodeData = (overrides) => ({
    title: 'Test Node',
    plugin_id: 'plugin-123',
    provider_type: 'online_drive',
    provider_name: 'online-drive-provider',
    datasource_name: 'online-drive-ds',
    datasource_label: 'Online Drive',
    datasource_parameters: {},
    datasource_configurations: {},
    ...overrides,
});
const createMockOnlineDriveFile = (overrides) => ({
    id: 'file-1',
    name: 'test-file.txt',
    size: 1024,
    type: pipeline_1.OnlineDriveFileType.file,
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
// Helper Functions
// ==========================================
const resetMockStoreState = () => {
    mockStoreState.nextPageParameters = {};
    mockStoreState.breadcrumbs = [];
    mockStoreState.prefix = [];
    mockStoreState.keywords = '';
    mockStoreState.bucket = '';
    mockStoreState.selectedFileIds = [];
    mockStoreState.onlineDriveFileList = [];
    mockStoreState.currentCredentialId = '';
    mockStoreState.isTruncated = { current: false };
    mockStoreState.currentNextPageParametersRef = { current: {} };
    mockStoreState.setOnlineDriveFileList = vi.fn();
    mockStoreState.setKeywords = vi.fn();
    mockStoreState.setSelectedFileIds = vi.fn();
    mockStoreState.setBreadcrumbs = vi.fn();
    mockStoreState.setPrefix = vi.fn();
    mockStoreState.setBucket = vi.fn();
    mockStoreState.setHasBucket = vi.fn();
};
// ==========================================
// Test Suites
// ==========================================
describe('OnlineDrive', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset store state
        resetMockStoreState();
        // Reset context values
        mockPipelineId = 'pipeline-123';
        mockSetShowAccountSettingModal.mockClear();
        // Default mock return values
        mockUseGetDataSourceAuth.mockReturnValue({
            data: { result: [createMockCredential()] },
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
            expect(react_1.screen.getByTestId('file-list')).toBeInTheDocument();
        });
        it('should render Header with correct props', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-123';
            const props = createDefaultProps({
                nodeData: createMockNodeData({ datasource_label: 'My Online Drive' }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('header-doc-title')).toHaveTextContent('Docs');
            expect(react_1.screen.getByTestId('header-plugin-name')).toHaveTextContent('My Online Drive');
            expect(react_1.screen.getByTestId('header-credential-id')).toHaveTextContent('cred-123');
        });
        it('should render FileList with correct props', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockStoreState.keywords = 'search-term';
            mockStoreState.breadcrumbs = ['folder1', 'folder2'];
            mockStoreState.bucket = 'my-bucket';
            mockStoreState.selectedFileIds = ['file-1', 'file-2'];
            mockStoreState.onlineDriveFileList = [
                createMockOnlineDriveFile({ id: 'file-1', name: 'file1.txt' }),
                createMockOnlineDriveFile({ id: 'file-2', name: 'file2.txt' }),
            ];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('file-list')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('file-list-keywords')).toHaveTextContent('search-term');
            expect(react_1.screen.getByTestId('file-list-breadcrumbs')).toHaveTextContent('folder1/folder2');
            expect(react_1.screen.getByTestId('file-list-bucket')).toHaveTextContent('my-bucket');
            expect(react_1.screen.getByTestId('file-list-selected-count')).toHaveTextContent('2');
        });
        it('should pass docLink with correct path to Header', () => {
            // Arrange
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockDocLink).toHaveBeenCalledWith('/guides/knowledge-base/knowledge-pipeline/authorize-data-source');
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
                // Assert - ssePost should be called with correct URL
                await (0, react_1.waitFor)(() => {
                    expect(mockSsePost).toHaveBeenCalledWith(expect.stringContaining('/rag/pipelines/pipeline-123/workflows/published/datasource/nodes/custom-node-id/run'), expect.any(Object), expect.any(Object));
                });
            });
            it('should use nodeId in datasourceNodeRunURL for pipeline mode', async () => {
                // Arrange
                mockStoreState.currentCredentialId = 'cred-1';
                const props = createDefaultProps({
                    nodeId: 'custom-node-id',
                    isInPipeline: true,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - ssePost should be called with correct URL for draft
                await (0, react_1.waitFor)(() => {
                    expect(mockSsePost).toHaveBeenCalledWith(expect.stringContaining('/rag/pipelines/pipeline-123/workflows/draft/datasource/nodes/custom-node-id/run'), expect.any(Object), expect.any(Object));
                });
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
                    datasource_label: 'Custom Online Drive',
                });
                const props = createDefaultProps({ nodeData });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('header-plugin-name')).toHaveTextContent('Custom Online Drive');
            });
        });
        describe('isInPipeline prop', () => {
            it('should use draft URL when isInPipeline is true', async () => {
                // Arrange
                mockStoreState.currentCredentialId = 'cred-1';
                const props = createDefaultProps({ isInPipeline: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                await (0, react_1.waitFor)(() => {
                    expect(mockSsePost).toHaveBeenCalledWith(expect.stringContaining('/workflows/draft/'), expect.any(Object), expect.any(Object));
                });
            });
            it('should use published URL when isInPipeline is false', async () => {
                // Arrange
                mockStoreState.currentCredentialId = 'cred-1';
                const props = createDefaultProps({ isInPipeline: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                await (0, react_1.waitFor)(() => {
                    expect(mockSsePost).toHaveBeenCalledWith(expect.stringContaining('/workflows/published/'), expect.any(Object), expect.any(Object));
                });
            });
            it('should pass isInPipeline to FileList', () => {
                // Arrange
                const props = createDefaultProps({ isInPipeline: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('file-list-is-in-pipeline')).toHaveTextContent('true');
            });
        });
        describe('supportBatchUpload prop', () => {
            it('should pass supportBatchUpload true to FileList when supportBatchUpload is true', () => {
                // Arrange
                const props = createDefaultProps({ supportBatchUpload: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('file-list-support-batch')).toHaveTextContent('true');
            });
            it('should pass supportBatchUpload false to FileList when supportBatchUpload is false', () => {
                // Arrange
                const props = createDefaultProps({ supportBatchUpload: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('file-list-support-batch')).toHaveTextContent('false');
            });
            it.each([
                [true, 'true'],
                [false, 'false'],
                [undefined, 'true'], // Default value
            ])('should handle supportBatchUpload=%s correctly', (value, expected) => {
                // Arrange
                const props = createDefaultProps({ supportBatchUpload: value });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('file-list-support-batch')).toHaveTextContent(expected);
            });
        });
        describe('onCredentialChange prop', () => {
            it('should call onCredentialChange with credential id', () => {
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
        it('should fetch files on initial mount when fileList is empty', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockStoreState.onlineDriveFileList = [];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalled();
            });
        });
        it('should not fetch files on initial mount when fileList is not empty', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockStoreState.onlineDriveFileList = [createMockOnlineDriveFile()];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Wait a bit to ensure no call is made
            await new Promise(resolve => setTimeout(resolve, 100));
            expect(mockSsePost).not.toHaveBeenCalled();
        });
        it('should not fetch files when currentCredentialId is empty', async () => {
            // Arrange
            mockStoreState.currentCredentialId = '';
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Wait a bit to ensure no call is made
            await new Promise(resolve => setTimeout(resolve, 100));
            expect(mockSsePost).not.toHaveBeenCalled();
        });
        it('should show loading state during fetch', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockSsePost.mockImplementation(() => {
                // Never resolves to keep loading state
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(react_1.screen.getByTestId('file-list-loading')).toHaveTextContent('true');
            });
        });
        it('should update file list on successful fetch', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const mockFiles = [
                { id: 'file-1', name: 'file1.txt', type: 'file' },
                { id: 'file-2', name: 'file2.txt', type: 'file' },
            ];
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeCompleted({
                    data: [{
                            bucket: '',
                            files: mockFiles,
                            is_truncated: false,
                            next_page_parameters: {},
                        }],
                    time_consuming: 1.0,
                });
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setOnlineDriveFileList).toHaveBeenCalled();
            });
        });
        it('should show error toast on fetch error', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const errorMessage = 'Failed to fetch files';
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeError({
                    error: errorMessage,
                });
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockToastNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: errorMessage,
                });
            });
        });
    });
    // ==========================================
    // Memoization Logic and Dependencies Tests
    // ==========================================
    describe('Memoization Logic', () => {
        it('should filter files by keywords', () => {
            // Arrange
            mockStoreState.keywords = 'test';
            mockStoreState.onlineDriveFileList = [
                createMockOnlineDriveFile({ id: '1', name: 'test-file.txt' }),
                createMockOnlineDriveFile({ id: '2', name: 'other-file.txt' }),
                createMockOnlineDriveFile({ id: '3', name: 'another-test.pdf' }),
            ];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - filteredOnlineDriveFileList should have 2 items matching 'test'
            expect(react_1.screen.getByTestId('file-list-count')).toHaveTextContent('2');
        });
        it('should return all files when keywords is empty', () => {
            // Arrange
            mockStoreState.keywords = '';
            mockStoreState.onlineDriveFileList = [
                createMockOnlineDriveFile({ id: '1', name: 'file1.txt' }),
                createMockOnlineDriveFile({ id: '2', name: 'file2.txt' }),
                createMockOnlineDriveFile({ id: '3', name: 'file3.pdf' }),
            ];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('file-list-count')).toHaveTextContent('3');
        });
        it('should filter files case-insensitively', () => {
            // Arrange
            mockStoreState.keywords = 'TEST';
            mockStoreState.onlineDriveFileList = [
                createMockOnlineDriveFile({ id: '1', name: 'test-file.txt' }),
                createMockOnlineDriveFile({ id: '2', name: 'Test-Document.pdf' }),
                createMockOnlineDriveFile({ id: '3', name: 'other.txt' }),
            ];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('file-list-count')).toHaveTextContent('2');
        });
    });
    // ==========================================
    // Callback Stability and Memoization
    // ==========================================
    describe('Callback Stability and Memoization', () => {
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
        it('should have stable updateKeywords that updates store', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.change(react_1.screen.getByTestId('file-list-search-input'), { target: { value: 'new-keyword' } });
            // Assert
            expect(mockStoreState.setKeywords).toHaveBeenCalledWith('new-keyword');
        });
        it('should have stable resetKeywords that clears keywords', () => {
            // Arrange
            mockStoreState.keywords = 'old-keyword';
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('file-list-reset-keywords'));
            // Assert
            expect(mockStoreState.setKeywords).toHaveBeenCalledWith('');
        });
    });
    // ==========================================
    // User Interactions and Event Handlers
    // ==========================================
    describe('User Interactions', () => {
        describe('File Selection', () => {
            it('should toggle file selection on file click', () => {
                // Arrange
                mockStoreState.selectedFileIds = [];
                const props = createDefaultProps();
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('file-list-select-file'));
                // Assert
                expect(mockStoreState.setSelectedFileIds).toHaveBeenCalledWith(['file-1']);
            });
            it('should deselect file if already selected', () => {
                // Arrange
                mockStoreState.selectedFileIds = ['file-1'];
                const props = createDefaultProps();
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('file-list-select-file'));
                // Assert
                expect(mockStoreState.setSelectedFileIds).toHaveBeenCalledWith([]);
            });
            it('should not select bucket type items', () => {
                // Arrange
                mockStoreState.selectedFileIds = [];
                const props = createDefaultProps();
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('file-list-select-bucket'));
                // Assert
                expect(mockStoreState.setSelectedFileIds).not.toHaveBeenCalled();
            });
            it('should limit selection to one file when supportBatchUpload is false', () => {
                // Arrange
                mockStoreState.selectedFileIds = ['existing-file'];
                const props = createDefaultProps({ supportBatchUpload: false });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('file-list-select-file'));
                // Assert - Should not add new file because there's already one selected
                expect(mockStoreState.setSelectedFileIds).toHaveBeenCalledWith(['existing-file']);
            });
            it('should allow multiple selections when supportBatchUpload is true', () => {
                // Arrange
                mockStoreState.selectedFileIds = ['existing-file'];
                const props = createDefaultProps({ supportBatchUpload: true });
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('file-list-select-file'));
                // Assert
                expect(mockStoreState.setSelectedFileIds).toHaveBeenCalledWith(['existing-file', 'file-1']);
            });
        });
        describe('Folder Navigation', () => {
            it('should open folder and update breadcrumbs/prefix', () => {
                // Arrange
                mockStoreState.breadcrumbs = [];
                mockStoreState.prefix = [];
                const props = createDefaultProps();
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('file-list-open-folder'));
                // Assert
                expect(mockStoreState.setOnlineDriveFileList).toHaveBeenCalledWith([]);
                expect(mockStoreState.setSelectedFileIds).toHaveBeenCalledWith([]);
                expect(mockStoreState.setBreadcrumbs).toHaveBeenCalledWith(['my-folder']);
                expect(mockStoreState.setPrefix).toHaveBeenCalledWith(['folder-1']);
            });
            it('should open bucket and set bucket name', () => {
                // Arrange
                const props = createDefaultProps();
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('file-list-open-bucket'));
                // Assert
                expect(mockStoreState.setOnlineDriveFileList).toHaveBeenCalledWith([]);
                expect(mockStoreState.setBucket).toHaveBeenCalledWith('my-bucket');
            });
            it('should not navigate when opening a file', () => {
                // Arrange
                const props = createDefaultProps();
                (0, react_1.render)(<index_1.default {...props}/>);
                // Act
                react_1.fireEvent.click(react_1.screen.getByTestId('file-list-open-file'));
                // Assert - No navigation functions should be called
                expect(mockStoreState.setBreadcrumbs).not.toHaveBeenCalled();
                expect(mockStoreState.setPrefix).not.toHaveBeenCalled();
                expect(mockStoreState.setBucket).not.toHaveBeenCalled();
            });
        });
        describe('Credential Change', () => {
            it('should call onCredentialChange prop', () => {
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
        describe('Configuration', () => {
            it('should open account setting modal on configuration click', () => {
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
        });
    });
    // ==========================================
    // Side Effects and Cleanup Tests
    // ==========================================
    describe('Side Effects and Cleanup', () => {
        it('should fetch files when nextPageParameters changes after initial mount', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockStoreState.onlineDriveFileList = [createMockOnlineDriveFile()];
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Simulate nextPageParameters change by re-rendering with updated state
            mockStoreState.nextPageParameters = { page: 2 };
            rerender(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalled();
            });
        });
        it('should fetch files when prefix changes after initial mount', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockStoreState.onlineDriveFileList = [createMockOnlineDriveFile()];
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Simulate prefix change by re-rendering with updated state
            mockStoreState.prefix = ['folder1'];
            rerender(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalled();
            });
        });
        it('should fetch files when bucket changes after initial mount', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockStoreState.onlineDriveFileList = [createMockOnlineDriveFile()];
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Simulate bucket change by re-rendering with updated state
            mockStoreState.bucket = 'new-bucket';
            rerender(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalled();
            });
        });
        it('should fetch files when currentCredentialId changes after initial mount', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockStoreState.onlineDriveFileList = [createMockOnlineDriveFile()];
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Simulate credential change by re-rendering with updated state
            mockStoreState.currentCredentialId = 'cred-2';
            rerender(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalled();
            });
        });
        it('should not fetch files concurrently (debounce)', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            let resolveFirst;
            const firstPromise = new Promise((resolve) => {
                resolveFirst = resolve;
            });
            mockSsePost.mockImplementationOnce((url, options, callbacks) => {
                firstPromise.then(() => {
                    callbacks.onDataSourceNodeCompleted({
                        data: [{ bucket: '', files: [], is_truncated: false, next_page_parameters: {} }],
                        time_consuming: 1.0,
                    });
                });
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Try to trigger another fetch while first is loading
            mockStoreState.prefix = ['folder1'];
            // Assert - Only one call should be made initially due to isLoadingRef guard
            expect(mockSsePost).toHaveBeenCalledTimes(1);
            // Cleanup
            resolveFirst();
        });
    });
    // ==========================================
    // API Calls Mocking Tests
    // ==========================================
    describe('API Calls', () => {
        it('should call ssePost with correct parameters', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockStoreState.prefix = ['folder1'];
            mockStoreState.bucket = 'my-bucket';
            mockStoreState.nextPageParameters = { cursor: 'abc' };
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalledWith(expect.any(String), {
                    body: {
                        inputs: {
                            prefix: 'folder1',
                            bucket: 'my-bucket',
                            next_page_parameters: { cursor: 'abc' },
                            max_keys: 30,
                        },
                        datasource_type: pipeline_1.DatasourceType.onlineDrive,
                        credential_id: 'cred-1',
                    },
                }, expect.objectContaining({
                    onDataSourceNodeCompleted: expect.any(Function),
                    onDataSourceNodeError: expect.any(Function),
                }));
            });
        });
        it('should handle completed response and update store', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockStoreState.breadcrumbs = ['folder1'];
            mockStoreState.bucket = 'my-bucket';
            const mockResponseData = [{
                    bucket: 'my-bucket',
                    files: [
                        { id: 'file-1', name: 'file1.txt', size: 1024, type: 'file' },
                        { id: 'file-2', name: 'file2.txt', size: 2048, type: 'file' },
                    ],
                    is_truncated: true,
                    next_page_parameters: { cursor: 'next-cursor' },
                }];
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeCompleted({
                    data: mockResponseData,
                    time_consuming: 1.5,
                });
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setOnlineDriveFileList).toHaveBeenCalled();
                expect(mockStoreState.setHasBucket).toHaveBeenCalledWith(true);
                expect(mockStoreState.isTruncated.current).toBe(true);
                expect(mockStoreState.currentNextPageParametersRef.current).toEqual({ cursor: 'next-cursor' });
            });
        });
        it('should handle error response and show toast', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const errorMessage = 'Access denied';
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeError({
                    error: errorMessage,
                });
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockToastNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: errorMessage,
                });
            });
        });
    });
    // ==========================================
    // Edge Cases and Error Handling
    // ==========================================
    describe('Edge Cases and Error Handling', () => {
        it('should handle empty credentials list', () => {
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
        it('should handle undefined credentials data', () => {
            // Arrange
            mockUseGetDataSourceAuth.mockReturnValue({
                data: undefined,
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('header-credentials-count')).toHaveTextContent('0');
        });
        it('should handle undefined pipelineId', async () => {
            // Arrange
            mockPipelineId = undefined;
            mockStoreState.currentCredentialId = 'cred-1';
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should still attempt to call ssePost with undefined in URL
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalledWith(expect.stringContaining('/rag/pipelines/undefined/'), expect.any(Object), expect.any(Object));
            });
        });
        it('should handle empty file list', () => {
            // Arrange
            mockStoreState.onlineDriveFileList = [];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('file-list-count')).toHaveTextContent('0');
        });
        it('should handle empty breadcrumbs', () => {
            // Arrange
            mockStoreState.breadcrumbs = [];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('file-list-breadcrumbs')).toHaveTextContent('');
        });
        it('should handle empty bucket', () => {
            // Arrange
            mockStoreState.bucket = '';
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('file-list-bucket')).toHaveTextContent('');
        });
        it('should handle special characters in keywords', () => {
            // Arrange
            mockStoreState.keywords = 'test.file[1]';
            mockStoreState.onlineDriveFileList = [
                createMockOnlineDriveFile({ id: '1', name: 'test.file[1].txt' }),
                createMockOnlineDriveFile({ id: '2', name: 'other.txt' }),
            ];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should find file with special characters
            expect(react_1.screen.getByTestId('file-list-count')).toHaveTextContent('1');
        });
        it('should handle very long file names', () => {
            // Arrange
            const longName = `${'a'.repeat(500)}.txt`;
            mockStoreState.onlineDriveFileList = [
                createMockOnlineDriveFile({ id: '1', name: longName }),
            ];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('file-list-count')).toHaveTextContent('1');
        });
        it('should handle bucket list initiation response', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockStoreState.bucket = '';
            mockStoreState.prefix = [];
            const mockBucketResponse = [
                { bucket: 'bucket-1', files: [], is_truncated: false, next_page_parameters: {} },
                { bucket: 'bucket-2', files: [], is_truncated: false, next_page_parameters: {} },
            ];
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeCompleted({
                    data: mockBucketResponse,
                    time_consuming: 1.0,
                });
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setHasBucket).toHaveBeenCalledWith(true);
            });
        });
    });
    // ==========================================
    // All Prop Variations Tests
    // ==========================================
    describe('Prop Variations', () => {
        it.each([
            { isInPipeline: true, supportBatchUpload: true },
            { isInPipeline: true, supportBatchUpload: false },
            { isInPipeline: false, supportBatchUpload: true },
            { isInPipeline: false, supportBatchUpload: false },
        ])('should render correctly with isInPipeline=%s and supportBatchUpload=%s', (propVariation) => {
            // Arrange
            const props = createDefaultProps(propVariation);
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('header')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('file-list')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('file-list-is-in-pipeline')).toHaveTextContent(String(propVariation.isInPipeline));
            expect(react_1.screen.getByTestId('file-list-support-batch')).toHaveTextContent(String(propVariation.supportBatchUpload));
        });
        it.each([
            { nodeId: 'node-a', expectedUrlPart: 'nodes/node-a/run' },
            { nodeId: 'node-b', expectedUrlPart: 'nodes/node-b/run' },
            { nodeId: '123-456', expectedUrlPart: 'nodes/123-456/run' },
        ])('should use correct URL for nodeId=%s', async ({ nodeId, expectedUrlPart }) => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const props = createDefaultProps({ nodeId });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockSsePost).toHaveBeenCalledWith(expect.stringContaining(expectedUrlPart), expect.any(Object), expect.any(Object));
            });
        });
        it.each([
            { pluginId: 'plugin-a', providerName: 'provider-a' },
            { pluginId: 'plugin-b', providerName: 'provider-b' },
            { pluginId: '', providerName: '' },
        ])('should call useGetDataSourceAuth with pluginId=%s and providerName=%s', ({ pluginId, providerName }) => {
            // Arrange
            const props = createDefaultProps({
                nodeData: createMockNodeData({
                    plugin_id: pluginId,
                    provider_name: providerName,
                }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockUseGetDataSourceAuth).toHaveBeenCalledWith({
                pluginId,
                provider: providerName,
            });
        });
    });
});
// ==========================================
// Header Component Tests
// ==========================================
describe('Header', () => {
    const createHeaderProps = (overrides) => ({
        onClickConfiguration: vi.fn(),
        docTitle: 'Documentation',
        docLink: 'https://docs.example.com/guide',
        ...overrides,
    });
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Rendering', () => {
        it('should render without crashing', () => {
            // Arrange
            const props = createHeaderProps();
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('Documentation')).toBeInTheDocument();
        });
        it('should render doc link with correct href', () => {
            // Arrange
            const props = createHeaderProps({
                docLink: 'https://custom-docs.com/path',
                docTitle: 'Custom Docs',
            });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            const link = react_1.screen.getByRole('link');
            expect(link).toHaveAttribute('href', 'https://custom-docs.com/path');
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        });
        it('should render doc title text', () => {
            // Arrange
            const props = createHeaderProps({ docTitle: 'My Documentation Title' });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByText('My Documentation Title')).toBeInTheDocument();
        });
        it('should render configuration button', () => {
            // Arrange
            const props = createHeaderProps();
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
    });
    describe('Props', () => {
        describe('docTitle prop', () => {
            it.each([
                'Getting Started',
                'API Reference',
                'Installation Guide',
                '',
            ])('should render docTitle="%s"', (docTitle) => {
                // Arrange
                const props = createHeaderProps({ docTitle });
                // Act
                (0, react_1.render)(<header_1.default {...props}/>);
                // Assert
                if (docTitle)
                    expect(react_1.screen.getByText(docTitle)).toBeInTheDocument();
            });
        });
        describe('docLink prop', () => {
            it.each([
                'https://docs.example.com',
                'https://docs.example.com/path/to/page',
                '/relative/path',
            ])('should set href to "%s"', (docLink) => {
                // Arrange
                const props = createHeaderProps({ docLink });
                // Act
                (0, react_1.render)(<header_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByRole('link')).toHaveAttribute('href', docLink);
            });
        });
        describe('onClickConfiguration prop', () => {
            it('should call onClickConfiguration when configuration icon is clicked', () => {
                // Arrange
                const mockOnClickConfiguration = vi.fn();
                const props = createHeaderProps({ onClickConfiguration: mockOnClickConfiguration });
                // Act
                (0, react_1.render)(<header_1.default {...props}/>);
                const configIcon = react_1.screen.getByRole('button').querySelector('svg');
                react_1.fireEvent.click(configIcon);
                // Assert
                expect(mockOnClickConfiguration).toHaveBeenCalledTimes(1);
            });
            it('should not throw when onClickConfiguration is undefined', () => {
                // Arrange
                const props = createHeaderProps({ onClickConfiguration: undefined });
                // Act & Assert
                expect(() => (0, react_1.render)(<header_1.default {...props}/>)).not.toThrow();
            });
        });
    });
    describe('Accessibility', () => {
        it('should have accessible link with title attribute', () => {
            // Arrange
            const props = createHeaderProps({ docTitle: 'Accessible Title' });
            // Act
            (0, react_1.render)(<header_1.default {...props}/>);
            // Assert
            const titleSpan = react_1.screen.getByTitle('Accessible Title');
            expect(titleSpan).toBeInTheDocument();
        });
    });
});
// ==========================================
// Utils Tests
// ==========================================
describe('utils', () => {
    // ==========================================
    // isFile Tests
    // ==========================================
    describe('isFile', () => {
        it('should return true for file type', () => {
            // Act & Assert
            expect((0, utils_1.isFile)('file')).toBe(true);
        });
        it('should return false for folder type', () => {
            // Act & Assert
            expect((0, utils_1.isFile)('folder')).toBe(false);
        });
        it.each([
            ['file', true],
            ['folder', false],
        ])('isFile(%s) should return %s', (type, expected) => {
            // Act & Assert
            expect((0, utils_1.isFile)(type)).toBe(expected);
        });
    });
    // ==========================================
    // isBucketListInitiation Tests
    // ==========================================
    describe('isBucketListInitiation', () => {
        it('should return false when bucket is not empty', () => {
            // Arrange
            const data = [
                { bucket: 'my-bucket', files: [], is_truncated: false, next_page_parameters: {} },
            ];
            // Act & Assert
            expect((0, utils_1.isBucketListInitiation)(data, [], 'existing-bucket')).toBe(false);
        });
        it('should return false when prefix is not empty', () => {
            // Arrange
            const data = [
                { bucket: 'my-bucket', files: [], is_truncated: false, next_page_parameters: {} },
            ];
            // Act & Assert
            expect((0, utils_1.isBucketListInitiation)(data, ['folder1'], '')).toBe(false);
        });
        it('should return false when data items have no bucket', () => {
            // Arrange
            const data = [
                { bucket: '', files: [{ id: '1', name: 'file.txt', size: 1024, type: 'file' }], is_truncated: false, next_page_parameters: {} },
            ];
            // Act & Assert
            expect((0, utils_1.isBucketListInitiation)(data, [], '')).toBe(false);
        });
        it('should return true for multiple buckets with no prefix and bucket', () => {
            // Arrange
            const data = [
                { bucket: 'bucket-1', files: [], is_truncated: false, next_page_parameters: {} },
                { bucket: 'bucket-2', files: [], is_truncated: false, next_page_parameters: {} },
            ];
            // Act & Assert
            expect((0, utils_1.isBucketListInitiation)(data, [], '')).toBe(true);
        });
        it('should return true for single bucket with no files, no prefix, and no bucket', () => {
            // Arrange
            const data = [
                { bucket: 'my-bucket', files: [], is_truncated: false, next_page_parameters: {} },
            ];
            // Act & Assert
            expect((0, utils_1.isBucketListInitiation)(data, [], '')).toBe(true);
        });
        it('should return false for single bucket with files', () => {
            // Arrange
            const data = [
                { bucket: 'my-bucket', files: [{ id: '1', name: 'file.txt', size: 1024, type: 'file' }], is_truncated: false, next_page_parameters: {} },
            ];
            // Act & Assert
            expect((0, utils_1.isBucketListInitiation)(data, [], '')).toBe(false);
        });
        it('should return false for empty data array', () => {
            // Arrange
            const data = [];
            // Act & Assert
            expect((0, utils_1.isBucketListInitiation)(data, [], '')).toBe(false);
        });
    });
    // ==========================================
    // convertOnlineDriveData Tests
    // ==========================================
    describe('convertOnlineDriveData', () => {
        describe('Empty data handling', () => {
            it('should return empty result for empty data array', () => {
                // Arrange
                const data = [];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], '');
                // Assert
                expect(result).toEqual({
                    fileList: [],
                    isTruncated: false,
                    nextPageParameters: {},
                    hasBucket: false,
                });
            });
        });
        describe('Bucket list initiation', () => {
            it('should convert multiple buckets to bucket file list', () => {
                // Arrange
                const data = [
                    { bucket: 'bucket-1', files: [], is_truncated: false, next_page_parameters: {} },
                    { bucket: 'bucket-2', files: [], is_truncated: false, next_page_parameters: {} },
                    { bucket: 'bucket-3', files: [], is_truncated: false, next_page_parameters: {} },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], '');
                // Assert
                expect(result.fileList).toHaveLength(3);
                expect(result.fileList[0]).toEqual({
                    id: 'bucket-1',
                    name: 'bucket-1',
                    type: pipeline_1.OnlineDriveFileType.bucket,
                });
                expect(result.fileList[1]).toEqual({
                    id: 'bucket-2',
                    name: 'bucket-2',
                    type: pipeline_1.OnlineDriveFileType.bucket,
                });
                expect(result.fileList[2]).toEqual({
                    id: 'bucket-3',
                    name: 'bucket-3',
                    type: pipeline_1.OnlineDriveFileType.bucket,
                });
                expect(result.hasBucket).toBe(true);
                expect(result.isTruncated).toBe(false);
                expect(result.nextPageParameters).toEqual({});
            });
            it('should convert single bucket with no files to bucket list', () => {
                // Arrange
                const data = [
                    { bucket: 'my-bucket', files: [], is_truncated: false, next_page_parameters: {} },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], '');
                // Assert
                expect(result.fileList).toHaveLength(1);
                expect(result.fileList[0]).toEqual({
                    id: 'my-bucket',
                    name: 'my-bucket',
                    type: pipeline_1.OnlineDriveFileType.bucket,
                });
                expect(result.hasBucket).toBe(true);
            });
        });
        describe('File list conversion', () => {
            it('should convert files correctly', () => {
                // Arrange
                const data = [
                    {
                        bucket: 'my-bucket',
                        files: [
                            { id: 'file-1', name: 'document.pdf', size: 1024, type: 'file' },
                            { id: 'file-2', name: 'image.png', size: 2048, type: 'file' },
                        ],
                        is_truncated: false,
                        next_page_parameters: {},
                    },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, ['folder1'], 'my-bucket');
                // Assert
                expect(result.fileList).toHaveLength(2);
                expect(result.fileList[0]).toEqual({
                    id: 'file-1',
                    name: 'document.pdf',
                    size: 1024,
                    type: pipeline_1.OnlineDriveFileType.file,
                });
                expect(result.fileList[1]).toEqual({
                    id: 'file-2',
                    name: 'image.png',
                    size: 2048,
                    type: pipeline_1.OnlineDriveFileType.file,
                });
                expect(result.hasBucket).toBe(true);
            });
            it('should convert folders correctly without size', () => {
                // Arrange
                const data = [
                    {
                        bucket: 'my-bucket',
                        files: [
                            { id: 'folder-1', name: 'Documents', size: 0, type: 'folder' },
                            { id: 'folder-2', name: 'Images', size: 0, type: 'folder' },
                        ],
                        is_truncated: false,
                        next_page_parameters: {},
                    },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], 'my-bucket');
                // Assert
                expect(result.fileList).toHaveLength(2);
                expect(result.fileList[0]).toEqual({
                    id: 'folder-1',
                    name: 'Documents',
                    size: undefined,
                    type: pipeline_1.OnlineDriveFileType.folder,
                });
                expect(result.fileList[1]).toEqual({
                    id: 'folder-2',
                    name: 'Images',
                    size: undefined,
                    type: pipeline_1.OnlineDriveFileType.folder,
                });
            });
            it('should handle mixed files and folders', () => {
                // Arrange
                const data = [
                    {
                        bucket: 'my-bucket',
                        files: [
                            { id: 'folder-1', name: 'Documents', size: 0, type: 'folder' },
                            { id: 'file-1', name: 'readme.txt', size: 256, type: 'file' },
                            { id: 'folder-2', name: 'Images', size: 0, type: 'folder' },
                            { id: 'file-2', name: 'data.json', size: 512, type: 'file' },
                        ],
                        is_truncated: false,
                        next_page_parameters: {},
                    },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], 'my-bucket');
                // Assert
                expect(result.fileList).toHaveLength(4);
                expect(result.fileList[0].type).toBe(pipeline_1.OnlineDriveFileType.folder);
                expect(result.fileList[1].type).toBe(pipeline_1.OnlineDriveFileType.file);
                expect(result.fileList[2].type).toBe(pipeline_1.OnlineDriveFileType.folder);
                expect(result.fileList[3].type).toBe(pipeline_1.OnlineDriveFileType.file);
            });
        });
        describe('Truncation and pagination', () => {
            it('should return isTruncated true when data is truncated', () => {
                // Arrange
                const data = [
                    {
                        bucket: 'my-bucket',
                        files: [{ id: 'file-1', name: 'file.txt', size: 1024, type: 'file' }],
                        is_truncated: true,
                        next_page_parameters: { cursor: 'next-cursor' },
                    },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], 'my-bucket');
                // Assert
                expect(result.isTruncated).toBe(true);
                expect(result.nextPageParameters).toEqual({ cursor: 'next-cursor' });
            });
            it('should return isTruncated false when not truncated', () => {
                // Arrange
                const data = [
                    {
                        bucket: 'my-bucket',
                        files: [{ id: 'file-1', name: 'file.txt', size: 1024, type: 'file' }],
                        is_truncated: false,
                        next_page_parameters: {},
                    },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], 'my-bucket');
                // Assert
                expect(result.isTruncated).toBe(false);
                expect(result.nextPageParameters).toEqual({});
            });
            it('should handle undefined is_truncated', () => {
                // Arrange
                const data = [
                    {
                        bucket: 'my-bucket',
                        files: [{ id: 'file-1', name: 'file.txt', size: 1024, type: 'file' }],
                        is_truncated: undefined,
                        next_page_parameters: undefined,
                    },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], 'my-bucket');
                // Assert
                expect(result.isTruncated).toBe(false);
                expect(result.nextPageParameters).toEqual({});
            });
        });
        describe('hasBucket flag', () => {
            it('should return hasBucket true when bucket exists in data', () => {
                // Arrange
                const data = [
                    {
                        bucket: 'my-bucket',
                        files: [{ id: 'file-1', name: 'file.txt', size: 1024, type: 'file' }],
                        is_truncated: false,
                        next_page_parameters: {},
                    },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], 'my-bucket');
                // Assert
                expect(result.hasBucket).toBe(true);
            });
            it('should return hasBucket false when bucket is empty in data', () => {
                // Arrange
                const data = [
                    {
                        bucket: '',
                        files: [{ id: 'file-1', name: 'file.txt', size: 1024, type: 'file' }],
                        is_truncated: false,
                        next_page_parameters: {},
                    },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], '');
                // Assert
                expect(result.hasBucket).toBe(false);
            });
        });
        describe('Edge cases', () => {
            it('should handle files with zero size', () => {
                // Arrange
                const data = [
                    {
                        bucket: 'my-bucket',
                        files: [{ id: 'file-1', name: 'empty.txt', size: 0, type: 'file' }],
                        is_truncated: false,
                        next_page_parameters: {},
                    },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], 'my-bucket');
                // Assert
                expect(result.fileList[0].size).toBe(0);
            });
            it('should handle files with very large size', () => {
                // Arrange
                const largeSize = Number.MAX_SAFE_INTEGER;
                const data = [
                    {
                        bucket: 'my-bucket',
                        files: [{ id: 'file-1', name: 'large.bin', size: largeSize, type: 'file' }],
                        is_truncated: false,
                        next_page_parameters: {},
                    },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], 'my-bucket');
                // Assert
                expect(result.fileList[0].size).toBe(largeSize);
            });
            it('should handle files with special characters in name', () => {
                // Arrange
                const data = [
                    {
                        bucket: 'my-bucket',
                        files: [
                            { id: 'file-1', name: 'file[1] (copy).txt', size: 1024, type: 'file' },
                            { id: 'file-2', name: 'doc-with-dash_and_underscore.pdf', size: 2048, type: 'file' },
                            { id: 'file-3', name: 'file with spaces.txt', size: 512, type: 'file' },
                        ],
                        is_truncated: false,
                        next_page_parameters: {},
                    },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], 'my-bucket');
                // Assert
                expect(result.fileList[0].name).toBe('file[1] (copy).txt');
                expect(result.fileList[1].name).toBe('doc-with-dash_and_underscore.pdf');
                expect(result.fileList[2].name).toBe('file with spaces.txt');
            });
            it('should handle complex next_page_parameters', () => {
                // Arrange
                const complexParams = {
                    cursor: 'abc123',
                    page: 2,
                    limit: 50,
                    nested: { key: 'value' },
                };
                const data = [
                    {
                        bucket: 'my-bucket',
                        files: [{ id: 'file-1', name: 'file.txt', size: 1024, type: 'file' }],
                        is_truncated: true,
                        next_page_parameters: complexParams,
                    },
                ];
                // Act
                const result = (0, utils_1.convertOnlineDriveData)(data, [], 'my-bucket');
                // Assert
                expect(result.nextPageParameters).toEqual(complexParams);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5QixpRkFBdUY7QUFDdkYsZ0RBQXVFO0FBQ3ZFLHFDQUE2QjtBQUM3QixtQ0FBaUM7QUFDakMsbUNBQWdGO0FBRWhGLDZDQUE2QztBQUM3QyxlQUFlO0FBQ2YsNkNBQTZDO0FBRTdDLGdFQUFnRTtBQUVoRSxrREFBa0Q7QUFDbEQsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQWEsRUFBRSxFQUFFLENBQUMsMkJBQTJCLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ3JGLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMvQixVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVztDQUM5QixDQUFDLENBQUMsQ0FBQTtBQUVILGtFQUFrRTtBQUNsRSxJQUFJLGNBQWMsR0FBdUIsY0FBYyxDQUFBO0FBQ3ZELEVBQUUsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6QyxtQ0FBbUMsRUFBRSxDQUFDLFFBQXlCLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLFdBQVcsRUFBRSxjQUFjLEVBQUUsRUFBRSxDQUFDO0NBQzNILENBQUMsQ0FBQyxDQUFBO0FBRUgseURBQXlEO0FBQ3pELE1BQU0sOEJBQThCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzlDLEVBQUUsQ0FBQyxJQUFJLENBQUMseUJBQXlCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN4Qyx1QkFBdUIsRUFBRSxDQUFDLFFBQXlCLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLDBCQUEwQixFQUFFLDhCQUE4QixF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cnQgdHlwZSB7IERhdGFTb3VyY2VOb2RlVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvZGF0YS1zb3VyY2UvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IE9ubGluZURyaXZlRmlsZSB9IGZyb20gJ0AvbW9kZWxzL3BpcGVsaW5lJ1xuaW1wb3J0IHR5cGUgeyBPbmxpbmVEcml2ZURhdGEgfSBmcm9tICdAL3R5cGVzL3BpcGVsaW5lJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IEFDQ09VTlRfU0VUVElOR19UQUIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvY29uc3RhbnRzJ1xuaW1wb3J0IHsgRGF0YXNvdXJjZVR5cGUsIE9ubGluZURyaXZlRmlsZVR5cGUgfSBmcm9tICdAL21vZGVscy9waXBlbGluZSdcbmltcG9ydCBIZWFkZXIgZnJvbSAnLi9oZWFkZXInXG5pbXBvcnQgT25saW5lRHJpdmUgZnJvbSAnLi9pbmRleCdcbmltcG9ydCB7IGNvbnZlcnRPbmxpbmVEcml2ZURhdGEsIGlzQnVja2V0TGlzdEluaXRpYXRpb24sIGlzRmlsZSB9IGZyb20gJy4vdXRpbHMnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBNb2R1bGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTm90ZTogcmVhY3QtaTE4bmV4dCB1c2VzIGdsb2JhbCBtb2NrIGZyb20gd2ViL3ZpdGVzdC5zZXR1cC50c1xuXG4vLyBNb2NrIHVzZURvY0xpbmsgLSBjb250ZXh0IGhvb2sgcmVxdWlyZXMgbW9ja2luZ1xuY29uc3QgbW9ja0RvY0xpbmsgPSB2aS5mbigocGF0aD86IHN0cmluZykgPT4gYGh0dHBzOi8vZG9jcy5leGFtcGxlLmNvbSR7cGF0aCB8fCAnJ31gKVxudmkubW9jaygnQC9jb250ZXh0L2kxOG4nLCAoKSA9PiAoe1xuICB1c2VEb2NMaW5rOiAoKSA9PiBtb2NrRG9jTGluayxcbn0pKVxuXG4vLyBNb2NrIGRhdGFzZXQtZGV0YWlsIGNvbnRleHQgLSBjb250ZXh0IHByb3ZpZGVyIHJlcXVpcmVzIG1vY2tpbmdcbmxldCBtb2NrUGlwZWxpbmVJZDogc3RyaW5nIHwgdW5kZWZpbmVkID0gJ3BpcGVsaW5lLTEyMydcbnZpLm1vY2soJ0AvY29udGV4dC9kYXRhc2V0LWRldGFpbCcsICgpID0+ICh7XG4gIHVzZURhdGFzZXREZXRhaWxDb250ZXh0V2l0aFNlbGVjdG9yOiAoc2VsZWN0b3I6IChzOiBhbnkpID0+IGFueSkgPT4gc2VsZWN0b3IoeyBkYXRhc2V0OiB7IHBpcGVsaW5lX2lkOiBtb2NrUGlwZWxpbmVJZCB9IH0pLFxufSkpXG5cbi8vIE1vY2sgbW9kYWwgY29udGV4dCAtIGNvbnRleHQgcHJvdmlkZXIgcmVxdWlyZXMgbW9ja2luZ1xuY29uc3QgbW9ja1NldFNob3dBY2NvdW50U2V0dGluZ01vZGFsID0gdmkuZm4oKVxudmkubW9jaygnQC9jb250ZXh0L21vZGFsLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VNb2RhbENvbnRleHRTZWxlY3RvcjogKHNlbGVjdG9yOiAoczogYW55KSA9PiBhbnkpID0+IHNlbGVjdG9yKHsgc2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWw6IG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCB9KSxcbn0pKVxuXG4vLyBNb2NrIHNzZVBvc3QgLSBBUEkgc2VydmljZSByZXF1aXJlcyBtb2NraW5nXG5jb25zdCB7IG1vY2tTc2VQb3N0IH0gPSB2aS5ob2lzdGVkKCgpID0+ICh7XG4gIG1vY2tTc2VQb3N0OiB2aS5mbigpLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS9iYXNlJywgKCkgPT4gKHtcbiAgc3NlUG9zdDogbW9ja1NzZVBvc3QsXG59KSlcblxuLy8gTW9jayB1c2VHZXREYXRhU291cmNlQXV0aCAtIEFQSSBzZXJ2aWNlIGhvb2sgcmVxdWlyZXMgbW9ja2luZ1xuY29uc3QgeyBtb2NrVXNlR2V0RGF0YVNvdXJjZUF1dGggfSA9IHZpLmhvaXN0ZWQoKCkgPT4gKHtcbiAgbW9ja1VzZUdldERhdGFTb3VyY2VBdXRoOiB2aS5mbigpLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtZGF0YXNvdXJjZScsICgpID0+ICh7XG4gIHVzZUdldERhdGFTb3VyY2VBdXRoOiBtb2NrVXNlR2V0RGF0YVNvdXJjZUF1dGgsXG59KSlcblxuLy8gTW9jayBUb2FzdFxuY29uc3QgeyBtb2NrVG9hc3ROb3RpZnkgfSA9IHZpLmhvaXN0ZWQoKCkgPT4gKHtcbiAgbW9ja1RvYXN0Tm90aWZ5OiB2aS5mbigpLFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6IHtcbiAgICBub3RpZnk6IG1vY2tUb2FzdE5vdGlmeSxcbiAgfSxcbn0pKVxuXG4vLyBOb3RlOiB6dXN0YW5kL3JlYWN0L3NoYWxsb3cgdXNlU2hhbGxvdyBpcyBpbXBvcnRlZCBkaXJlY3RseSAoc2ltcGxlIHV0aWxpdHkgZnVuY3Rpb24pXG5cbi8vIE1vY2sgc3RvcmUgc3RhdGVcbmNvbnN0IG1vY2tTdG9yZVN0YXRlID0ge1xuICBuZXh0UGFnZVBhcmFtZXRlcnM6IHt9IGFzIFJlY29yZDxzdHJpbmcsIGFueT4sXG4gIGJyZWFkY3J1bWJzOiBbXSBhcyBzdHJpbmdbXSxcbiAgcHJlZml4OiBbXSBhcyBzdHJpbmdbXSxcbiAga2V5d29yZHM6ICcnLFxuICBidWNrZXQ6ICcnLFxuICBzZWxlY3RlZEZpbGVJZHM6IFtdIGFzIHN0cmluZ1tdLFxuICBvbmxpbmVEcml2ZUZpbGVMaXN0OiBbXSBhcyBPbmxpbmVEcml2ZUZpbGVbXSxcbiAgY3VycmVudENyZWRlbnRpYWxJZDogJycsXG4gIGlzVHJ1bmNhdGVkOiB7IGN1cnJlbnQ6IGZhbHNlIH0sXG4gIGN1cnJlbnROZXh0UGFnZVBhcmFtZXRlcnNSZWY6IHsgY3VycmVudDoge30gfSxcbiAgc2V0T25saW5lRHJpdmVGaWxlTGlzdDogdmkuZm4oKSxcbiAgc2V0S2V5d29yZHM6IHZpLmZuKCksXG4gIHNldFNlbGVjdGVkRmlsZUlkczogdmkuZm4oKSxcbiAgc2V0QnJlYWRjcnVtYnM6IHZpLmZuKCksXG4gIHNldFByZWZpeDogdmkuZm4oKSxcbiAgc2V0QnVja2V0OiB2aS5mbigpLFxuICBzZXRIYXNCdWNrZXQ6IHZpLmZuKCksXG59XG5cbmNvbnN0IG1vY2tHZXRTdGF0ZSA9IHZpLmZuKCgpID0+IG1vY2tTdG9yZVN0YXRlKVxuY29uc3QgbW9ja0RhdGFTb3VyY2VTdG9yZSA9IHsgZ2V0U3RhdGU6IG1vY2tHZXRTdGF0ZSB9XG5cbnZpLm1vY2soJy4uL3N0b3JlJywgKCkgPT4gKHtcbiAgdXNlRGF0YVNvdXJjZVN0b3JlV2l0aFNlbGVjdG9yOiAoc2VsZWN0b3I6IChzOiBhbnkpID0+IGFueSkgPT4gc2VsZWN0b3IobW9ja1N0b3JlU3RhdGUpLFxuICB1c2VEYXRhU291cmNlU3RvcmU6ICgpID0+IG1vY2tEYXRhU291cmNlU3RvcmUsXG59KSlcblxuLy8gTW9jayBIZWFkZXIgY29tcG9uZW50XG52aS5tb2NrKCcuLi9iYXNlL2hlYWRlcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6IChwcm9wczogYW55KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImhlYWRlclwiPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJoZWFkZXItZG9jLXRpdGxlXCI+e3Byb3BzLmRvY1RpdGxlfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiaGVhZGVyLWRvYy1saW5rXCI+e3Byb3BzLmRvY0xpbmt9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJoZWFkZXItcGx1Z2luLW5hbWVcIj57cHJvcHMucGx1Z2luTmFtZX08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImhlYWRlci1jcmVkZW50aWFsLWlkXCI+e3Byb3BzLmN1cnJlbnRDcmVkZW50aWFsSWR9PC9zcGFuPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImhlYWRlci1jb25maWctYnRuXCIgb25DbGljaz17cHJvcHMub25DbGlja0NvbmZpZ3VyYXRpb259PkNvbmZpZ3VyZTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImhlYWRlci1jcmVkZW50aWFsLWNoYW5nZVwiIG9uQ2xpY2s9eygpID0+IHByb3BzLm9uQ3JlZGVudGlhbENoYW5nZSgnbmV3LWNyZWQtaWQnKX0+Q2hhbmdlIENyZWRlbnRpYWw8L2J1dHRvbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiaGVhZGVyLWNyZWRlbnRpYWxzLWNvdW50XCI+e3Byb3BzLmNyZWRlbnRpYWxzPy5sZW5ndGggfHwgMH08L3NwYW4+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBGaWxlTGlzdCBjb21wb25lbnRcbnZpLm1vY2soJy4vZmlsZS1saXN0JywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHByb3BzOiBhbnkpID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiZmlsZS1saXN0XCI+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImZpbGUtbGlzdC1jb3VudFwiPntwcm9wcy5maWxlTGlzdD8ubGVuZ3RoIHx8IDB9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLWxpc3Qtc2VsZWN0ZWQtY291bnRcIj57cHJvcHMuc2VsZWN0ZWRGaWxlSWRzPy5sZW5ndGggfHwgMH08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImZpbGUtbGlzdC1icmVhZGNydW1ic1wiPntwcm9wcy5icmVhZGNydW1icz8uam9pbignLycpIHx8ICcnfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiZmlsZS1saXN0LWtleXdvcmRzXCI+e3Byb3BzLmtleXdvcmRzfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiZmlsZS1saXN0LWJ1Y2tldFwiPntwcm9wcy5idWNrZXR9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJmaWxlLWxpc3QtbG9hZGluZ1wiPntTdHJpbmcocHJvcHMuaXNMb2FkaW5nKX08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImZpbGUtbGlzdC1pcy1pbi1waXBlbGluZVwiPntTdHJpbmcocHJvcHMuaXNJblBpcGVsaW5lKX08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImZpbGUtbGlzdC1zdXBwb3J0LWJhdGNoXCI+e1N0cmluZyhwcm9wcy5zdXBwb3J0QmF0Y2hVcGxvYWQpfTwvc3Bhbj5cbiAgICAgIDxpbnB1dFxuICAgICAgICBkYXRhLXRlc3RpZD1cImZpbGUtbGlzdC1zZWFyY2gtaW5wdXRcIlxuICAgICAgICBvbkNoYW5nZT17ZSA9PiBwcm9wcy51cGRhdGVLZXl3b3JkcyhlLnRhcmdldC52YWx1ZSl9XG4gICAgICAvPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImZpbGUtbGlzdC1yZXNldC1rZXl3b3Jkc1wiIG9uQ2xpY2s9e3Byb3BzLnJlc2V0S2V5d29yZHN9PlJlc2V0PC9idXR0b24+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGRhdGEtdGVzdGlkPVwiZmlsZS1saXN0LXNlbGVjdC1maWxlXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZpbGU6IE9ubGluZURyaXZlRmlsZSA9IHsgaWQ6ICdmaWxlLTEnLCBuYW1lOiAndGVzdC50eHQnLCB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmZpbGUgfVxuICAgICAgICAgIHByb3BzLmhhbmRsZVNlbGVjdEZpbGUoZmlsZSlcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgU2VsZWN0IEZpbGVcbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBkYXRhLXRlc3RpZD1cImZpbGUtbGlzdC1zZWxlY3QtYnVja2V0XCJcbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZpbGU6IE9ubGluZURyaXZlRmlsZSA9IHsgaWQ6ICdidWNrZXQtMScsIG5hbWU6ICdteS1idWNrZXQnLCB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmJ1Y2tldCB9XG4gICAgICAgICAgcHJvcHMuaGFuZGxlU2VsZWN0RmlsZShmaWxlKVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICBTZWxlY3QgQnVja2V0XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJmaWxlLWxpc3Qtb3Blbi1mb2xkZXJcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmlsZTogT25saW5lRHJpdmVGaWxlID0geyBpZDogJ2ZvbGRlci0xJywgbmFtZTogJ215LWZvbGRlcicsIHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuZm9sZGVyIH1cbiAgICAgICAgICBwcm9wcy5oYW5kbGVPcGVuRm9sZGVyKGZpbGUpXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIE9wZW4gRm9sZGVyXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJmaWxlLWxpc3Qtb3Blbi1idWNrZXRcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgY29uc3QgZmlsZTogT25saW5lRHJpdmVGaWxlID0geyBpZDogJ2J1Y2tldC0xJywgbmFtZTogJ215LWJ1Y2tldCcsIHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuYnVja2V0IH1cbiAgICAgICAgICBwcm9wcy5oYW5kbGVPcGVuRm9sZGVyKGZpbGUpXG4gICAgICAgIH19XG4gICAgICA+XG4gICAgICAgIE9wZW4gQnVja2V0XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b25cbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJmaWxlLWxpc3Qtb3Blbi1maWxlXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZpbGU6IE9ubGluZURyaXZlRmlsZSA9IHsgaWQ6ICdmaWxlLTEnLCBuYW1lOiAndGVzdC50eHQnLCB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmZpbGUgfVxuICAgICAgICAgIHByb3BzLmhhbmRsZU9wZW5Gb2xkZXIoZmlsZSlcbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAgT3BlbiBGaWxlXG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgRGF0YSBCdWlsZGVyc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCBjcmVhdGVNb2NrTm9kZURhdGEgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxEYXRhU291cmNlTm9kZVR5cGU+KTogRGF0YVNvdXJjZU5vZGVUeXBlID0+ICh7XG4gIHRpdGxlOiAnVGVzdCBOb2RlJyxcbiAgcGx1Z2luX2lkOiAncGx1Z2luLTEyMycsXG4gIHByb3ZpZGVyX3R5cGU6ICdvbmxpbmVfZHJpdmUnLFxuICBwcm92aWRlcl9uYW1lOiAnb25saW5lLWRyaXZlLXByb3ZpZGVyJyxcbiAgZGF0YXNvdXJjZV9uYW1lOiAnb25saW5lLWRyaXZlLWRzJyxcbiAgZGF0YXNvdXJjZV9sYWJlbDogJ09ubGluZSBEcml2ZScsXG4gIGRhdGFzb3VyY2VfcGFyYW1ldGVyczoge30sXG4gIGRhdGFzb3VyY2VfY29uZmlndXJhdGlvbnM6IHt9LFxuICAuLi5vdmVycmlkZXMsXG59IGFzIERhdGFTb3VyY2VOb2RlVHlwZSlcblxuY29uc3QgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPE9ubGluZURyaXZlRmlsZT4pOiBPbmxpbmVEcml2ZUZpbGUgPT4gKHtcbiAgaWQ6ICdmaWxlLTEnLFxuICBuYW1lOiAndGVzdC1maWxlLnR4dCcsXG4gIHNpemU6IDEwMjQsXG4gIHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuZmlsZSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja0NyZWRlbnRpYWwgPSAob3ZlcnJpZGVzPzogUGFydGlhbDx7IGlkOiBzdHJpbmcsIG5hbWU6IHN0cmluZyB9PikgPT4gKHtcbiAgaWQ6ICdjcmVkLTEnLFxuICBuYW1lOiAnVGVzdCBDcmVkZW50aWFsJyxcbiAgYXZhdGFyX3VybDogJ2h0dHBzOi8vZXhhbXBsZS5jb20vYXZhdGFyLnBuZycsXG4gIGNyZWRlbnRpYWw6IHt9LFxuICBpc19kZWZhdWx0OiBmYWxzZSxcbiAgdHlwZTogJ29hdXRoMicsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbnR5cGUgT25saW5lRHJpdmVQcm9wcyA9IFJlYWN0LkNvbXBvbmVudFByb3BzPHR5cGVvZiBPbmxpbmVEcml2ZT5cblxuY29uc3QgY3JlYXRlRGVmYXVsdFByb3BzID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8T25saW5lRHJpdmVQcm9wcz4pOiBPbmxpbmVEcml2ZVByb3BzID0+ICh7XG4gIG5vZGVJZDogJ25vZGUtMScsXG4gIG5vZGVEYXRhOiBjcmVhdGVNb2NrTm9kZURhdGEoKSxcbiAgb25DcmVkZW50aWFsQ2hhbmdlOiB2aS5mbigpLFxuICBpc0luUGlwZWxpbmU6IGZhbHNlLFxuICBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHRydWUsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSGVscGVyIEZ1bmN0aW9uc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCByZXNldE1vY2tTdG9yZVN0YXRlID0gKCkgPT4ge1xuICBtb2NrU3RvcmVTdGF0ZS5uZXh0UGFnZVBhcmFtZXRlcnMgPSB7fVxuICBtb2NrU3RvcmVTdGF0ZS5icmVhZGNydW1icyA9IFtdXG4gIG1vY2tTdG9yZVN0YXRlLnByZWZpeCA9IFtdXG4gIG1vY2tTdG9yZVN0YXRlLmtleXdvcmRzID0gJydcbiAgbW9ja1N0b3JlU3RhdGUuYnVja2V0ID0gJydcbiAgbW9ja1N0b3JlU3RhdGUuc2VsZWN0ZWRGaWxlSWRzID0gW11cbiAgbW9ja1N0b3JlU3RhdGUub25saW5lRHJpdmVGaWxlTGlzdCA9IFtdXG4gIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnJ1xuICBtb2NrU3RvcmVTdGF0ZS5pc1RydW5jYXRlZCA9IHsgY3VycmVudDogZmFsc2UgfVxuICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50TmV4dFBhZ2VQYXJhbWV0ZXJzUmVmID0geyBjdXJyZW50OiB7fSB9XG4gIG1vY2tTdG9yZVN0YXRlLnNldE9ubGluZURyaXZlRmlsZUxpc3QgPSB2aS5mbigpXG4gIG1vY2tTdG9yZVN0YXRlLnNldEtleXdvcmRzID0gdmkuZm4oKVxuICBtb2NrU3RvcmVTdGF0ZS5zZXRTZWxlY3RlZEZpbGVJZHMgPSB2aS5mbigpXG4gIG1vY2tTdG9yZVN0YXRlLnNldEJyZWFkY3J1bWJzID0gdmkuZm4oKVxuICBtb2NrU3RvcmVTdGF0ZS5zZXRQcmVmaXggPSB2aS5mbigpXG4gIG1vY2tTdG9yZVN0YXRlLnNldEJ1Y2tldCA9IHZpLmZuKClcbiAgbW9ja1N0b3JlU3RhdGUuc2V0SGFzQnVja2V0ID0gdmkuZm4oKVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgU3VpdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdPbmxpbmVEcml2ZScsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG5cbiAgICAvLyBSZXNldCBzdG9yZSBzdGF0ZVxuICAgIHJlc2V0TW9ja1N0b3JlU3RhdGUoKVxuXG4gICAgLy8gUmVzZXQgY29udGV4dCB2YWx1ZXNcbiAgICBtb2NrUGlwZWxpbmVJZCA9ICdwaXBlbGluZS0xMjMnXG4gICAgbW9ja1NldFNob3dBY2NvdW50U2V0dGluZ01vZGFsLm1vY2tDbGVhcigpXG5cbiAgICAvLyBEZWZhdWx0IG1vY2sgcmV0dXJuIHZhbHVlc1xuICAgIG1vY2tVc2VHZXREYXRhU291cmNlQXV0aC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgZGF0YTogeyByZXN1bHQ6IFtjcmVhdGVNb2NrQ3JlZGVudGlhbCgpXSB9LFxuICAgIH0pXG5cbiAgICBtb2NrR2V0U3RhdGUubW9ja1JldHVyblZhbHVlKG1vY2tTdG9yZVN0YXRlKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtbGlzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEhlYWRlciB3aXRoIGNvcnJlY3QgcHJvcHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMTIzJ1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBub2RlRGF0YTogY3JlYXRlTW9ja05vZGVEYXRhKHsgZGF0YXNvdXJjZV9sYWJlbDogJ015IE9ubGluZSBEcml2ZScgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXItZG9jLXRpdGxlJykpLnRvSGF2ZVRleHRDb250ZW50KCdEb2NzJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1wbHVnaW4tbmFtZScpKS50b0hhdmVUZXh0Q29udGVudCgnTXkgT25saW5lIERyaXZlJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jcmVkZW50aWFsLWlkJykpLnRvSGF2ZVRleHRDb250ZW50KCdjcmVkLTEyMycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEZpbGVMaXN0IHdpdGggY29ycmVjdCBwcm9wcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgbW9ja1N0b3JlU3RhdGUua2V5d29yZHMgPSAnc2VhcmNoLXRlcm0nXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5icmVhZGNydW1icyA9IFsnZm9sZGVyMScsICdmb2xkZXIyJ11cbiAgICAgIG1vY2tTdG9yZVN0YXRlLmJ1Y2tldCA9ICdteS1idWNrZXQnXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5zZWxlY3RlZEZpbGVJZHMgPSBbJ2ZpbGUtMScsICdmaWxlLTInXVxuICAgICAgbW9ja1N0b3JlU3RhdGUub25saW5lRHJpdmVGaWxlTGlzdCA9IFtcbiAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnZmlsZS0xJywgbmFtZTogJ2ZpbGUxLnR4dCcgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBpZDogJ2ZpbGUtMicsIG5hbWU6ICdmaWxlMi50eHQnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3QnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1saXN0LWtleXdvcmRzJykpLnRvSGF2ZVRleHRDb250ZW50KCdzZWFyY2gtdGVybScpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3QtYnJlYWRjcnVtYnMnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZvbGRlcjEvZm9sZGVyMicpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3QtYnVja2V0JykpLnRvSGF2ZVRleHRDb250ZW50KCdteS1idWNrZXQnKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1saXN0LXNlbGVjdGVkLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGRvY0xpbmsgd2l0aCBjb3JyZWN0IHBhdGggdG8gSGVhZGVyJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja0RvY0xpbmspLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcvZ3VpZGVzL2tub3dsZWRnZS1iYXNlL2tub3dsZWRnZS1waXBlbGluZS9hdXRob3JpemUtZGF0YS1zb3VyY2UnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnbm9kZUlkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHVzZSBub2RlSWQgaW4gZGF0YXNvdXJjZU5vZGVSdW5VUkwgZm9yIG5vbi1waXBlbGluZSBtb2RlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbm9kZUlkOiAnY3VzdG9tLW5vZGUtaWQnLFxuICAgICAgICAgIGlzSW5QaXBlbGluZTogZmFsc2UsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnQgLSBzc2VQb3N0IHNob3VsZCBiZSBjYWxsZWQgd2l0aCBjb3JyZWN0IFVSTFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ0NvbnRhaW5pbmcoJy9yYWcvcGlwZWxpbmVzL3BpcGVsaW5lLTEyMy93b3JrZmxvd3MvcHVibGlzaGVkL2RhdGFzb3VyY2Uvbm9kZXMvY3VzdG9tLW5vZGUtaWQvcnVuJyksXG4gICAgICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgICAgKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCB1c2Ugbm9kZUlkIGluIGRhdGFzb3VyY2VOb2RlUnVuVVJMIGZvciBwaXBlbGluZSBtb2RlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbm9kZUlkOiAnY3VzdG9tLW5vZGUtaWQnLFxuICAgICAgICAgIGlzSW5QaXBlbGluZTogdHJ1ZSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydCAtIHNzZVBvc3Qgc2hvdWxkIGJlIGNhbGxlZCB3aXRoIGNvcnJlY3QgVVJMIGZvciBkcmFmdFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ0NvbnRhaW5pbmcoJy9yYWcvcGlwZWxpbmVzL3BpcGVsaW5lLTEyMy93b3JrZmxvd3MvZHJhZnQvZGF0YXNvdXJjZS9ub2Rlcy9jdXN0b20tbm9kZS1pZC9ydW4nKSxcbiAgICAgICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgICAgICApXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnbm9kZURhdGEgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcGFzcyBwbHVnaW5faWQgYW5kIHByb3ZpZGVyX25hbWUgdG8gdXNlR2V0RGF0YVNvdXJjZUF1dGgnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgbm9kZURhdGEgPSBjcmVhdGVNb2NrTm9kZURhdGEoe1xuICAgICAgICAgIHBsdWdpbl9pZDogJ215LXBsdWdpbi1pZCcsXG4gICAgICAgICAgcHJvdmlkZXJfbmFtZTogJ215LXByb3ZpZGVyJyxcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBub2RlRGF0YSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrVXNlR2V0RGF0YVNvdXJjZUF1dGgpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBwbHVnaW5JZDogJ215LXBsdWdpbi1pZCcsXG4gICAgICAgICAgcHJvdmlkZXI6ICdteS1wcm92aWRlcicsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHBhc3MgZGF0YXNvdXJjZV9sYWJlbCB0byBIZWFkZXIgYXMgcGx1Z2luTmFtZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBub2RlRGF0YSA9IGNyZWF0ZU1vY2tOb2RlRGF0YSh7XG4gICAgICAgICAgZGF0YXNvdXJjZV9sYWJlbDogJ0N1c3RvbSBPbmxpbmUgRHJpdmUnLFxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG5vZGVEYXRhIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLXBsdWdpbi1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdDdXN0b20gT25saW5lIERyaXZlJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdpc0luUGlwZWxpbmUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgdXNlIGRyYWZ0IFVSTCB3aGVuIGlzSW5QaXBlbGluZSBpcyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzSW5QaXBlbGluZTogdHJ1ZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtb2NrU3NlUG9zdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgICBleHBlY3Quc3RyaW5nQ29udGFpbmluZygnL3dvcmtmbG93cy9kcmFmdC8nKSxcbiAgICAgICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgICAgICApXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHVzZSBwdWJsaXNoZWQgVVJMIHdoZW4gaXNJblBpcGVsaW5lIGlzIGZhbHNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzSW5QaXBlbGluZTogZmFsc2UgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICAgZXhwZWN0LnN0cmluZ0NvbnRhaW5pbmcoJy93b3JrZmxvd3MvcHVibGlzaGVkLycpLFxuICAgICAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcGFzcyBpc0luUGlwZWxpbmUgdG8gRmlsZUxpc3QnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc0luUGlwZWxpbmU6IHRydWUgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3QtaXMtaW4tcGlwZWxpbmUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ3N1cHBvcnRCYXRjaFVwbG9hZCBwcm9wJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBwYXNzIHN1cHBvcnRCYXRjaFVwbG9hZCB0cnVlIHRvIEZpbGVMaXN0IHdoZW4gc3VwcG9ydEJhdGNoVXBsb2FkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHRydWUgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3Qtc3VwcG9ydC1iYXRjaCcpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHBhc3Mgc3VwcG9ydEJhdGNoVXBsb2FkIGZhbHNlIHRvIEZpbGVMaXN0IHdoZW4gc3VwcG9ydEJhdGNoVXBsb2FkIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc3VwcG9ydEJhdGNoVXBsb2FkOiBmYWxzZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtbGlzdC1zdXBwb3J0LWJhdGNoJykpLnRvSGF2ZVRleHRDb250ZW50KCdmYWxzZScpXG4gICAgICB9KVxuXG4gICAgICBpdC5lYWNoKFtcbiAgICAgICAgW3RydWUsICd0cnVlJ10sXG4gICAgICAgIFtmYWxzZSwgJ2ZhbHNlJ10sXG4gICAgICAgIFt1bmRlZmluZWQsICd0cnVlJ10sIC8vIERlZmF1bHQgdmFsdWVcbiAgICAgIF0pKCdzaG91bGQgaGFuZGxlIHN1cHBvcnRCYXRjaFVwbG9hZD0lcyBjb3JyZWN0bHknLCAodmFsdWUsIGV4cGVjdGVkKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHZhbHVlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1saXN0LXN1cHBvcnQtYmF0Y2gnKSkudG9IYXZlVGV4dENvbnRlbnQoZXhwZWN0ZWQpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnb25DcmVkZW50aWFsQ2hhbmdlIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25DcmVkZW50aWFsQ2hhbmdlIHdpdGggY3JlZGVudGlhbCBpZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBtb2NrT25DcmVkZW50aWFsQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ3JlZGVudGlhbENoYW5nZTogbW9ja09uQ3JlZGVudGlhbENoYW5nZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jcmVkZW50aWFsLWNoYW5nZScpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja09uQ3JlZGVudGlhbENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ25ldy1jcmVkLWlkJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU3RhdGUgTWFuYWdlbWVudCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBmZXRjaCBmaWxlcyBvbiBpbml0aWFsIG1vdW50IHdoZW4gZmlsZUxpc3QgaXMgZW1wdHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcbiAgICAgIG1vY2tTdG9yZVN0YXRlLm9ubGluZURyaXZlRmlsZUxpc3QgPSBbXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGZldGNoIGZpbGVzIG9uIGluaXRpYWwgbW91bnQgd2hlbiBmaWxlTGlzdCBpcyBub3QgZW1wdHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcbiAgICAgIG1vY2tTdG9yZVN0YXRlLm9ubGluZURyaXZlRmlsZUxpc3QgPSBbY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSgpXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gV2FpdCBhIGJpdCB0byBlbnN1cmUgbm8gY2FsbCBpcyBtYWRlXG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwKSlcbiAgICAgIGV4cGVjdChtb2NrU3NlUG9zdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBmZXRjaCBmaWxlcyB3aGVuIGN1cnJlbnRDcmVkZW50aWFsSWQgaXMgZW1wdHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJydcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFdhaXQgYSBiaXQgdG8gZW5zdXJlIG5vIGNhbGwgaXMgbWFkZVxuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMCkpXG4gICAgICBleHBlY3QobW9ja1NzZVBvc3QpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgc3RhdGUgZHVyaW5nIGZldGNoJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICBtb2NrU3NlUG9zdC5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4ge1xuICAgICAgICAvLyBOZXZlciByZXNvbHZlcyB0byBrZWVwIGxvYWRpbmcgc3RhdGVcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3QtbG9hZGluZycpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBmaWxlIGxpc3Qgb24gc3VjY2Vzc2Z1bCBmZXRjaCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgY29uc3QgbW9ja0ZpbGVzID0gW1xuICAgICAgICB7IGlkOiAnZmlsZS0xJywgbmFtZTogJ2ZpbGUxLnR4dCcsIHR5cGU6ICdmaWxlJyBhcyBjb25zdCB9LFxuICAgICAgICB7IGlkOiAnZmlsZS0yJywgbmFtZTogJ2ZpbGUyLnR4dCcsIHR5cGU6ICdmaWxlJyBhcyBjb25zdCB9LFxuICAgICAgXVxuICAgICAgbW9ja1NzZVBvc3QubW9ja0ltcGxlbWVudGF0aW9uKCh1cmwsIG9wdGlvbnMsIGNhbGxiYWNrcykgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25EYXRhU291cmNlTm9kZUNvbXBsZXRlZCh7XG4gICAgICAgICAgZGF0YTogW3tcbiAgICAgICAgICAgIGJ1Y2tldDogJycsXG4gICAgICAgICAgICBmaWxlczogbW9ja0ZpbGVzLFxuICAgICAgICAgICAgaXNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7fSxcbiAgICAgICAgICB9XSxcbiAgICAgICAgICB0aW1lX2NvbnN1bWluZzogMS4wLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRPbmxpbmVEcml2ZUZpbGVMaXN0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciB0b2FzdCBvbiBmZXRjaCBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gJ0ZhaWxlZCB0byBmZXRjaCBmaWxlcydcbiAgICAgIG1vY2tTc2VQb3N0Lm1vY2tJbXBsZW1lbnRhdGlvbigodXJsLCBvcHRpb25zLCBjYWxsYmFja3MpID0+IHtcbiAgICAgICAgY2FsbGJhY2tzLm9uRGF0YVNvdXJjZU5vZGVFcnJvcih7XG4gICAgICAgICAgZXJyb3I6IGVycm9yTWVzc2FnZSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1RvYXN0Tm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvck1lc3NhZ2UsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIE1lbW9pemF0aW9uIExvZ2ljIGFuZCBEZXBlbmRlbmNpZXMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdNZW1vaXphdGlvbiBMb2dpYycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGZpbHRlciBmaWxlcyBieSBrZXl3b3JkcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmtleXdvcmRzID0gJ3Rlc3QnXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5vbmxpbmVEcml2ZUZpbGVMaXN0ID0gW1xuICAgICAgICBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6ICcxJywgbmFtZTogJ3Rlc3QtZmlsZS50eHQnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6ICcyJywgbmFtZTogJ290aGVyLWZpbGUudHh0JyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnMycsIG5hbWU6ICdhbm90aGVyLXRlc3QucGRmJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIGZpbHRlcmVkT25saW5lRHJpdmVGaWxlTGlzdCBzaG91bGQgaGF2ZSAyIGl0ZW1zIG1hdGNoaW5nICd0ZXN0J1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1saXN0LWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gYWxsIGZpbGVzIHdoZW4ga2V5d29yZHMgaXMgZW1wdHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5rZXl3b3JkcyA9ICcnXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5vbmxpbmVEcml2ZUZpbGVMaXN0ID0gW1xuICAgICAgICBjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKHsgaWQ6ICcxJywgbmFtZTogJ2ZpbGUxLnR4dCcgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBpZDogJzInLCBuYW1lOiAnZmlsZTIudHh0JyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnMycsIG5hbWU6ICdmaWxlMy5wZGYnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3QtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGZpbHRlciBmaWxlcyBjYXNlLWluc2Vuc2l0aXZlbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5rZXl3b3JkcyA9ICdURVNUJ1xuICAgICAgbW9ja1N0b3JlU3RhdGUub25saW5lRHJpdmVGaWxlTGlzdCA9IFtcbiAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnMScsIG5hbWU6ICd0ZXN0LWZpbGUudHh0JyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnMicsIG5hbWU6ICdUZXN0LURvY3VtZW50LnBkZicgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoeyBpZDogJzMnLCBuYW1lOiAnb3RoZXIudHh0JyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1saXN0LWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcyJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDYWxsYmFjayBTdGFiaWxpdHkgYW5kIE1lbW9pemF0aW9uXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5IGFuZCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgc3RhYmxlIGhhbmRsZVNldHRpbmcgY2FsbGJhY2snLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLWNvbmZpZy1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1NldFNob3dBY2NvdW50U2V0dGluZ01vZGFsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHBheWxvYWQ6IEFDQ09VTlRfU0VUVElOR19UQUIuREFUQV9TT1VSQ0UsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc3RhYmxlIHVwZGF0ZUtleXdvcmRzIHRoYXQgdXBkYXRlcyBzdG9yZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1saXN0LXNlYXJjaC1pbnB1dCcpLCB7IHRhcmdldDogeyB2YWx1ZTogJ25ldy1rZXl3b3JkJyB9IH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldEtleXdvcmRzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnbmV3LWtleXdvcmQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc3RhYmxlIHJlc2V0S2V5d29yZHMgdGhhdCBjbGVhcnMga2V5d29yZHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5rZXl3b3JkcyA9ICdvbGQta2V5d29yZCdcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3QtcmVzZXQta2V5d29yZHMnKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0S2V5d29yZHMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCcnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIGFuZCBFdmVudCBIYW5kbGVyc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdGaWxlIFNlbGVjdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgdG9nZ2xlIGZpbGUgc2VsZWN0aW9uIG9uIGZpbGUgY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuc2VsZWN0ZWRGaWxlSWRzID0gW11cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtbGlzdC1zZWxlY3QtZmlsZScpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0U2VsZWN0ZWRGaWxlSWRzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbJ2ZpbGUtMSddKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBkZXNlbGVjdCBmaWxlIGlmIGFscmVhZHkgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuc2VsZWN0ZWRGaWxlSWRzID0gWydmaWxlLTEnXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1saXN0LXNlbGVjdC1maWxlJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRTZWxlY3RlZEZpbGVJZHMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3Qgc2VsZWN0IGJ1Y2tldCB0eXBlIGl0ZW1zJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLnNlbGVjdGVkRmlsZUlkcyA9IFtdXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3Qtc2VsZWN0LWJ1Y2tldCcpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0U2VsZWN0ZWRGaWxlSWRzKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGxpbWl0IHNlbGVjdGlvbiB0byBvbmUgZmlsZSB3aGVuIHN1cHBvcnRCYXRjaFVwbG9hZCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5zZWxlY3RlZEZpbGVJZHMgPSBbJ2V4aXN0aW5nLWZpbGUnXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHN1cHBvcnRCYXRjaFVwbG9hZDogZmFsc2UgfSlcbiAgICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3Qtc2VsZWN0LWZpbGUnKSlcblxuICAgICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGFkZCBuZXcgZmlsZSBiZWNhdXNlIHRoZXJlJ3MgYWxyZWFkeSBvbmUgc2VsZWN0ZWRcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFNlbGVjdGVkRmlsZUlkcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoWydleGlzdGluZy1maWxlJ10pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGFsbG93IG11bHRpcGxlIHNlbGVjdGlvbnMgd2hlbiBzdXBwb3J0QmF0Y2hVcGxvYWQgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5zZWxlY3RlZEZpbGVJZHMgPSBbJ2V4aXN0aW5nLWZpbGUnXVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHN1cHBvcnRCYXRjaFVwbG9hZDogdHJ1ZSB9KVxuICAgICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtbGlzdC1zZWxlY3QtZmlsZScpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0U2VsZWN0ZWRGaWxlSWRzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbJ2V4aXN0aW5nLWZpbGUnLCAnZmlsZS0xJ10pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnRm9sZGVyIE5hdmlnYXRpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIG9wZW4gZm9sZGVyIGFuZCB1cGRhdGUgYnJlYWRjcnVtYnMvcHJlZml4JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmJyZWFkY3J1bWJzID0gW11cbiAgICAgICAgbW9ja1N0b3JlU3RhdGUucHJlZml4ID0gW11cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtbGlzdC1vcGVuLWZvbGRlcicpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0T25saW5lRHJpdmVGaWxlTGlzdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoW10pXG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRTZWxlY3RlZEZpbGVJZHMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFtdKVxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0QnJlYWRjcnVtYnMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFsnbXktZm9sZGVyJ10pXG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRQcmVmaXgpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFsnZm9sZGVyLTEnXSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgb3BlbiBidWNrZXQgYW5kIHNldCBidWNrZXQgbmFtZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1saXN0LW9wZW4tYnVja2V0JykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRPbmxpbmVEcml2ZUZpbGVMaXN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChbXSlcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldEJ1Y2tldCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ215LWJ1Y2tldCcpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCBuYXZpZ2F0ZSB3aGVuIG9wZW5pbmcgYSBmaWxlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3Qtb3Blbi1maWxlJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gTm8gbmF2aWdhdGlvbiBmdW5jdGlvbnMgc2hvdWxkIGJlIGNhbGxlZFxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0QnJlYWRjcnVtYnMpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFByZWZpeCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0QnVja2V0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ3JlZGVudGlhbCBDaGFuZ2UnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25DcmVkZW50aWFsQ2hhbmdlIHByb3AnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgbW9ja09uQ3JlZGVudGlhbENoYW5nZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNyZWRlbnRpYWxDaGFuZ2U6IG1vY2tPbkNyZWRlbnRpYWxDaGFuZ2UgfSlcbiAgICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXItY3JlZGVudGlhbC1jaGFuZ2UnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tPbkNyZWRlbnRpYWxDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCduZXctY3JlZC1pZCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnQ29uZmlndXJhdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgb3BlbiBhY2NvdW50IHNldHRpbmcgbW9kYWwgb24gY29uZmlndXJhdGlvbiBjbGljaycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLWNvbmZpZy1idG4nKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHBheWxvYWQ6IEFDQ09VTlRfU0VUVElOR19UQUIuREFUQV9TT1VSQ0UsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFNpZGUgRWZmZWN0cyBhbmQgQ2xlYW51cCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1NpZGUgRWZmZWN0cyBhbmQgQ2xlYW51cCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGZldGNoIGZpbGVzIHdoZW4gbmV4dFBhZ2VQYXJhbWV0ZXJzIGNoYW5nZXMgYWZ0ZXIgaW5pdGlhbCBtb3VudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgbW9ja1N0b3JlU3RhdGUub25saW5lRHJpdmVGaWxlTGlzdCA9IFtjcmVhdGVNb2NrT25saW5lRHJpdmVGaWxlKCldXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdCAtIFNpbXVsYXRlIG5leHRQYWdlUGFyYW1ldGVycyBjaGFuZ2UgYnkgcmUtcmVuZGVyaW5nIHdpdGggdXBkYXRlZCBzdGF0ZVxuICAgICAgbW9ja1N0b3JlU3RhdGUubmV4dFBhZ2VQYXJhbWV0ZXJzID0geyBwYWdlOiAyIH1cbiAgICAgIHJlcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBmZXRjaCBmaWxlcyB3aGVuIHByZWZpeCBjaGFuZ2VzIGFmdGVyIGluaXRpYWwgbW91bnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcbiAgICAgIG1vY2tTdG9yZVN0YXRlLm9ubGluZURyaXZlRmlsZUxpc3QgPSBbY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSgpXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBTaW11bGF0ZSBwcmVmaXggY2hhbmdlIGJ5IHJlLXJlbmRlcmluZyB3aXRoIHVwZGF0ZWQgc3RhdGVcbiAgICAgIG1vY2tTdG9yZVN0YXRlLnByZWZpeCA9IFsnZm9sZGVyMSddXG4gICAgICByZXJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZmV0Y2ggZmlsZXMgd2hlbiBidWNrZXQgY2hhbmdlcyBhZnRlciBpbml0aWFsIG1vdW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5vbmxpbmVEcml2ZUZpbGVMaXN0ID0gW2NyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoKV1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gU2ltdWxhdGUgYnVja2V0IGNoYW5nZSBieSByZS1yZW5kZXJpbmcgd2l0aCB1cGRhdGVkIHN0YXRlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5idWNrZXQgPSAnbmV3LWJ1Y2tldCdcbiAgICAgIHJlcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBmZXRjaCBmaWxlcyB3aGVuIGN1cnJlbnRDcmVkZW50aWFsSWQgY2hhbmdlcyBhZnRlciBpbml0aWFsIG1vdW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5vbmxpbmVEcml2ZUZpbGVMaXN0ID0gW2NyZWF0ZU1vY2tPbmxpbmVEcml2ZUZpbGUoKV1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0IC0gU2ltdWxhdGUgY3JlZGVudGlhbCBjaGFuZ2UgYnkgcmUtcmVuZGVyaW5nIHdpdGggdXBkYXRlZCBzdGF0ZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTInXG4gICAgICByZXJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGZldGNoIGZpbGVzIGNvbmN1cnJlbnRseSAoZGVib3VuY2UpJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICBsZXQgcmVzb2x2ZUZpcnN0OiAoKSA9PiB2b2lkXG4gICAgICBjb25zdCBmaXJzdFByb21pc2UgPSBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSkgPT4ge1xuICAgICAgICByZXNvbHZlRmlyc3QgPSByZXNvbHZlXG4gICAgICB9KVxuICAgICAgbW9ja1NzZVBvc3QubW9ja0ltcGxlbWVudGF0aW9uT25jZSgodXJsLCBvcHRpb25zLCBjYWxsYmFja3MpID0+IHtcbiAgICAgICAgZmlyc3RQcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGNhbGxiYWNrcy5vbkRhdGFTb3VyY2VOb2RlQ29tcGxldGVkKHtcbiAgICAgICAgICAgIGRhdGE6IFt7IGJ1Y2tldDogJycsIGZpbGVzOiBbXSwgaXNfdHJ1bmNhdGVkOiBmYWxzZSwgbmV4dF9wYWdlX3BhcmFtZXRlcnM6IHt9IH1dLFxuICAgICAgICAgICAgdGltZV9jb25zdW1pbmc6IDEuMCxcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIFRyeSB0byB0cmlnZ2VyIGFub3RoZXIgZmV0Y2ggd2hpbGUgZmlyc3QgaXMgbG9hZGluZ1xuICAgICAgbW9ja1N0b3JlU3RhdGUucHJlZml4ID0gWydmb2xkZXIxJ11cblxuICAgICAgLy8gQXNzZXJ0IC0gT25seSBvbmUgY2FsbCBzaG91bGQgYmUgbWFkZSBpbml0aWFsbHkgZHVlIHRvIGlzTG9hZGluZ1JlZiBndWFyZFxuICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblxuICAgICAgLy8gQ2xlYW51cFxuICAgICAgcmVzb2x2ZUZpcnN0ISgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQVBJIENhbGxzIE1vY2tpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBUEkgQ2FsbHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNzZVBvc3Qgd2l0aCBjb3JyZWN0IHBhcmFtZXRlcnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcbiAgICAgIG1vY2tTdG9yZVN0YXRlLnByZWZpeCA9IFsnZm9sZGVyMSddXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5idWNrZXQgPSAnbXktYnVja2V0J1xuICAgICAgbW9ja1N0b3JlU3RhdGUubmV4dFBhZ2VQYXJhbWV0ZXJzID0geyBjdXJzb3I6ICdhYmMnIH1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU3NlUG9zdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0LmFueShTdHJpbmcpLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgICAgaW5wdXRzOiB7XG4gICAgICAgICAgICAgICAgcHJlZml4OiAnZm9sZGVyMScsXG4gICAgICAgICAgICAgICAgYnVja2V0OiAnbXktYnVja2V0JyxcbiAgICAgICAgICAgICAgICBuZXh0X3BhZ2VfcGFyYW1ldGVyczogeyBjdXJzb3I6ICdhYmMnIH0sXG4gICAgICAgICAgICAgICAgbWF4X2tleXM6IDMwLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBkYXRhc291cmNlX3R5cGU6IERhdGFzb3VyY2VUeXBlLm9ubGluZURyaXZlLFxuICAgICAgICAgICAgICBjcmVkZW50aWFsX2lkOiAnY3JlZC0xJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBvbkRhdGFTb3VyY2VOb2RlQ29tcGxldGVkOiBleHBlY3QuYW55KEZ1bmN0aW9uKSxcbiAgICAgICAgICAgIG9uRGF0YVNvdXJjZU5vZGVFcnJvcjogZXhwZWN0LmFueShGdW5jdGlvbiksXG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbXBsZXRlZCByZXNwb25zZSBhbmQgdXBkYXRlIHN0b3JlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5icmVhZGNydW1icyA9IFsnZm9sZGVyMSddXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5idWNrZXQgPSAnbXktYnVja2V0J1xuICAgICAgY29uc3QgbW9ja1Jlc3BvbnNlRGF0YSA9IFt7XG4gICAgICAgIGJ1Y2tldDogJ215LWJ1Y2tldCcsXG4gICAgICAgIGZpbGVzOiBbXG4gICAgICAgICAgeyBpZDogJ2ZpbGUtMScsIG5hbWU6ICdmaWxlMS50eHQnLCBzaXplOiAxMDI0LCB0eXBlOiAnZmlsZScgYXMgY29uc3QgfSxcbiAgICAgICAgICB7IGlkOiAnZmlsZS0yJywgbmFtZTogJ2ZpbGUyLnR4dCcsIHNpemU6IDIwNDgsIHR5cGU6ICdmaWxlJyBhcyBjb25zdCB9LFxuICAgICAgICBdLFxuICAgICAgICBpc190cnVuY2F0ZWQ6IHRydWUsXG4gICAgICAgIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7IGN1cnNvcjogJ25leHQtY3Vyc29yJyB9LFxuICAgICAgfV1cbiAgICAgIG1vY2tTc2VQb3N0Lm1vY2tJbXBsZW1lbnRhdGlvbigodXJsLCBvcHRpb25zLCBjYWxsYmFja3MpID0+IHtcbiAgICAgICAgY2FsbGJhY2tzLm9uRGF0YVNvdXJjZU5vZGVDb21wbGV0ZWQoe1xuICAgICAgICAgIGRhdGE6IG1vY2tSZXNwb25zZURhdGEsXG4gICAgICAgICAgdGltZV9jb25zdW1pbmc6IDEuNSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0T25saW5lRHJpdmVGaWxlTGlzdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRIYXNCdWNrZXQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpXG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5pc1RydW5jYXRlZC5jdXJyZW50KS50b0JlKHRydWUpXG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5jdXJyZW50TmV4dFBhZ2VQYXJhbWV0ZXJzUmVmLmN1cnJlbnQpLnRvRXF1YWwoeyBjdXJzb3I6ICduZXh0LWN1cnNvcicgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVycm9yIHJlc3BvbnNlIGFuZCBzaG93IHRvYXN0JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICBjb25zdCBlcnJvck1lc3NhZ2UgPSAnQWNjZXNzIGRlbmllZCdcbiAgICAgIG1vY2tTc2VQb3N0Lm1vY2tJbXBsZW1lbnRhdGlvbigodXJsLCBvcHRpb25zLCBjYWxsYmFja3MpID0+IHtcbiAgICAgICAgY2FsbGJhY2tzLm9uRGF0YVNvdXJjZU5vZGVFcnJvcih7XG4gICAgICAgICAgZXJyb3I6IGVycm9yTWVzc2FnZSxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1RvYXN0Tm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiBlcnJvck1lc3NhZ2UsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgYW5kIEVycm9yIEhhbmRsaW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcyBhbmQgRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgY3JlZGVudGlhbHMgbGlzdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VHZXREYXRhU291cmNlQXV0aC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiB7IHJlc3VsdDogW10gfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jcmVkZW50aWFscy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBjcmVkZW50aWFscyBkYXRhJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1VzZUdldERhdGFTb3VyY2VBdXRoLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IHVuZGVmaW5lZCxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jcmVkZW50aWFscy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBwaXBlbGluZUlkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1BpcGVsaW5lSWQgPSB1bmRlZmluZWRcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIHN0aWxsIGF0dGVtcHQgdG8gY2FsbCBzc2VQb3N0IHdpdGggdW5kZWZpbmVkIGluIFVSTFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU3NlUG9zdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0LnN0cmluZ0NvbnRhaW5pbmcoJy9yYWcvcGlwZWxpbmVzL3VuZGVmaW5lZC8nKSxcbiAgICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBmaWxlIGxpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5vbmxpbmVEcml2ZUZpbGVMaXN0ID0gW11cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1saXN0LWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgYnJlYWRjcnVtYnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5icmVhZGNydW1icyA9IFtdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtbGlzdC1icmVhZGNydW1icycpKS50b0hhdmVUZXh0Q29udGVudCgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgYnVja2V0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuYnVja2V0ID0gJydcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1saXN0LWJ1Y2tldCcpKS50b0hhdmVUZXh0Q29udGVudCgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIGtleXdvcmRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUua2V5d29yZHMgPSAndGVzdC5maWxlWzFdJ1xuICAgICAgbW9ja1N0b3JlU3RhdGUub25saW5lRHJpdmVGaWxlTGlzdCA9IFtcbiAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnMScsIG5hbWU6ICd0ZXN0LmZpbGVbMV0udHh0JyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnMicsIG5hbWU6ICdvdGhlci50eHQnIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIGZpbmQgZmlsZSB3aXRoIHNwZWNpYWwgY2hhcmFjdGVyc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1saXN0LWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcxJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIGZpbGUgbmFtZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBsb25nTmFtZSA9IGAkeydhJy5yZXBlYXQoNTAwKX0udHh0YFxuICAgICAgbW9ja1N0b3JlU3RhdGUub25saW5lRHJpdmVGaWxlTGlzdCA9IFtcbiAgICAgICAgY3JlYXRlTW9ja09ubGluZURyaXZlRmlsZSh7IGlkOiAnMScsIG5hbWU6IGxvbmdOYW1lIH0pLFxuICAgICAgXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3QtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzEnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBidWNrZXQgbGlzdCBpbml0aWF0aW9uIHJlc3BvbnNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5idWNrZXQgPSAnJ1xuICAgICAgbW9ja1N0b3JlU3RhdGUucHJlZml4ID0gW11cbiAgICAgIGNvbnN0IG1vY2tCdWNrZXRSZXNwb25zZSA9IFtcbiAgICAgICAgeyBidWNrZXQ6ICdidWNrZXQtMScsIGZpbGVzOiBbXSwgaXNfdHJ1bmNhdGVkOiBmYWxzZSwgbmV4dF9wYWdlX3BhcmFtZXRlcnM6IHt9IH0sXG4gICAgICAgIHsgYnVja2V0OiAnYnVja2V0LTInLCBmaWxlczogW10sIGlzX3RydW5jYXRlZDogZmFsc2UsIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7fSB9LFxuICAgICAgXVxuICAgICAgbW9ja1NzZVBvc3QubW9ja0ltcGxlbWVudGF0aW9uKCh1cmwsIG9wdGlvbnMsIGNhbGxiYWNrcykgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25EYXRhU291cmNlTm9kZUNvbXBsZXRlZCh7XG4gICAgICAgICAgZGF0YTogbW9ja0J1Y2tldFJlc3BvbnNlLFxuICAgICAgICAgIHRpbWVfY29uc3VtaW5nOiAxLjAsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRHJpdmUgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldEhhc0J1Y2tldCkudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQWxsIFByb3AgVmFyaWF0aW9ucyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3AgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdC5lYWNoKFtcbiAgICAgIHsgaXNJblBpcGVsaW5lOiB0cnVlLCBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHRydWUgfSxcbiAgICAgIHsgaXNJblBpcGVsaW5lOiB0cnVlLCBzdXBwb3J0QmF0Y2hVcGxvYWQ6IGZhbHNlIH0sXG4gICAgICB7IGlzSW5QaXBlbGluZTogZmFsc2UsIHN1cHBvcnRCYXRjaFVwbG9hZDogdHJ1ZSB9LFxuICAgICAgeyBpc0luUGlwZWxpbmU6IGZhbHNlLCBzdXBwb3J0QmF0Y2hVcGxvYWQ6IGZhbHNlIH0sXG4gICAgXSkoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggaXNJblBpcGVsaW5lPSVzIGFuZCBzdXBwb3J0QmF0Y2hVcGxvYWQ9JXMnLCAocHJvcFZhcmlhdGlvbikgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMocHJvcFZhcmlhdGlvbilcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtbGlzdCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdmaWxlLWxpc3QtaXMtaW4tcGlwZWxpbmUnKSkudG9IYXZlVGV4dENvbnRlbnQoU3RyaW5nKHByb3BWYXJpYXRpb24uaXNJblBpcGVsaW5lKSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtbGlzdC1zdXBwb3J0LWJhdGNoJykpLnRvSGF2ZVRleHRDb250ZW50KFN0cmluZyhwcm9wVmFyaWF0aW9uLnN1cHBvcnRCYXRjaFVwbG9hZCkpXG4gICAgfSlcblxuICAgIGl0LmVhY2goW1xuICAgICAgeyBub2RlSWQ6ICdub2RlLWEnLCBleHBlY3RlZFVybFBhcnQ6ICdub2Rlcy9ub2RlLWEvcnVuJyB9LFxuICAgICAgeyBub2RlSWQ6ICdub2RlLWInLCBleHBlY3RlZFVybFBhcnQ6ICdub2Rlcy9ub2RlLWIvcnVuJyB9LFxuICAgICAgeyBub2RlSWQ6ICcxMjMtNDU2JywgZXhwZWN0ZWRVcmxQYXJ0OiAnbm9kZXMvMTIzLTQ1Ni9ydW4nIH0sXG4gICAgXSkoJ3Nob3VsZCB1c2UgY29ycmVjdCBVUkwgZm9yIG5vZGVJZD0lcycsIGFzeW5jICh7IG5vZGVJZCwgZXhwZWN0ZWRVcmxQYXJ0IH0pID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBub2RlSWQgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURyaXZlIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU3NlUG9zdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0LnN0cmluZ0NvbnRhaW5pbmcoZXhwZWN0ZWRVcmxQYXJ0KSxcbiAgICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdC5lYWNoKFtcbiAgICAgIHsgcGx1Z2luSWQ6ICdwbHVnaW4tYScsIHByb3ZpZGVyTmFtZTogJ3Byb3ZpZGVyLWEnIH0sXG4gICAgICB7IHBsdWdpbklkOiAncGx1Z2luLWInLCBwcm92aWRlck5hbWU6ICdwcm92aWRlci1iJyB9LFxuICAgICAgeyBwbHVnaW5JZDogJycsIHByb3ZpZGVyTmFtZTogJycgfSxcbiAgICBdKSgnc2hvdWxkIGNhbGwgdXNlR2V0RGF0YVNvdXJjZUF1dGggd2l0aCBwbHVnaW5JZD0lcyBhbmQgcHJvdmlkZXJOYW1lPSVzJywgKHsgcGx1Z2luSWQsIHByb3ZpZGVyTmFtZSB9KSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG5vZGVEYXRhOiBjcmVhdGVNb2NrTm9kZURhdGEoe1xuICAgICAgICAgIHBsdWdpbl9pZDogcGx1Z2luSWQsXG4gICAgICAgICAgcHJvdmlkZXJfbmFtZTogcHJvdmlkZXJOYW1lLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEcml2ZSB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrVXNlR2V0RGF0YVNvdXJjZUF1dGgpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgcGx1Z2luSWQsXG4gICAgICAgIHByb3ZpZGVyOiBwcm92aWRlck5hbWUsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEhlYWRlciBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0hlYWRlcicsICgpID0+IHtcbiAgY29uc3QgY3JlYXRlSGVhZGVyUHJvcHMgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgSGVhZGVyPj4pID0+ICh7XG4gICAgb25DbGlja0NvbmZpZ3VyYXRpb246IHZpLmZuKCksXG4gICAgZG9jVGl0bGU6ICdEb2N1bWVudGF0aW9uJyxcbiAgICBkb2NMaW5rOiAnaHR0cHM6Ly9kb2NzLmV4YW1wbGUuY29tL2d1aWRlJyxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH0pXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVIZWFkZXJQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRG9jdW1lbnRhdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRvYyBsaW5rIHdpdGggY29ycmVjdCBocmVmJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVIZWFkZXJQcm9wcyh7XG4gICAgICAgIGRvY0xpbms6ICdodHRwczovL2N1c3RvbS1kb2NzLmNvbS9wYXRoJyxcbiAgICAgICAgZG9jVGl0bGU6ICdDdXN0b20gRG9jcycsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgbGluayA9IHNjcmVlbi5nZXRCeVJvbGUoJ2xpbmsnKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICdodHRwczovL2N1c3RvbS1kb2NzLmNvbS9wYXRoJylcbiAgICAgIGV4cGVjdChsaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ3RhcmdldCcsICdfYmxhbmsnKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgncmVsJywgJ25vb3BlbmVyIG5vcmVmZXJyZXInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkb2MgdGl0bGUgdGV4dCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSGVhZGVyUHJvcHMoeyBkb2NUaXRsZTogJ015IERvY3VtZW50YXRpb24gVGl0bGUnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTXkgRG9jdW1lbnRhdGlvbiBUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvbmZpZ3VyYXRpb24gYnV0dG9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVIZWFkZXJQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnZG9jVGl0bGUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0LmVhY2goW1xuICAgICAgICAnR2V0dGluZyBTdGFydGVkJyxcbiAgICAgICAgJ0FQSSBSZWZlcmVuY2UnLFxuICAgICAgICAnSW5zdGFsbGF0aW9uIEd1aWRlJyxcbiAgICAgICAgJycsXG4gICAgICBdKSgnc2hvdWxkIHJlbmRlciBkb2NUaXRsZT1cIiVzXCInLCAoZG9jVGl0bGUpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUhlYWRlclByb3BzKHsgZG9jVGl0bGUgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgaWYgKGRvY1RpdGxlKVxuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KGRvY1RpdGxlKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2RvY0xpbmsgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0LmVhY2goW1xuICAgICAgICAnaHR0cHM6Ly9kb2NzLmV4YW1wbGUuY29tJyxcbiAgICAgICAgJ2h0dHBzOi8vZG9jcy5leGFtcGxlLmNvbS9wYXRoL3RvL3BhZ2UnLFxuICAgICAgICAnL3JlbGF0aXZlL3BhdGgnLFxuICAgICAgXSkoJ3Nob3VsZCBzZXQgaHJlZiB0byBcIiVzXCInLCAoZG9jTGluaykgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlSGVhZGVyUHJvcHMoeyBkb2NMaW5rIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8SGVhZGVyIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdsaW5rJykpLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsIGRvY0xpbmspXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnb25DbGlja0NvbmZpZ3VyYXRpb24gcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsaWNrQ29uZmlndXJhdGlvbiB3aGVuIGNvbmZpZ3VyYXRpb24gaWNvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tPbkNsaWNrQ29uZmlndXJhdGlvbiA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVIZWFkZXJQcm9wcyh7IG9uQ2xpY2tDb25maWd1cmF0aW9uOiBtb2NrT25DbGlja0NvbmZpZ3VyYXRpb24gfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPilcbiAgICAgICAgY29uc3QgY29uZmlnSWNvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhjb25maWdJY29uISlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tPbkNsaWNrQ29uZmlndXJhdGlvbikudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIG5vdCB0aHJvdyB3aGVuIG9uQ2xpY2tDb25maWd1cmF0aW9uIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUhlYWRlclByb3BzKHsgb25DbGlja0NvbmZpZ3VyYXRpb246IHVuZGVmaW5lZCB9KVxuXG4gICAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgICBleHBlY3QoKCkgPT4gcmVuZGVyKDxIZWFkZXIgey4uLnByb3BzfSAvPikpLm5vdC50b1Rocm93KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgYWNjZXNzaWJsZSBsaW5rIHdpdGggdGl0bGUgYXR0cmlidXRlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVIZWFkZXJQcm9wcyh7IGRvY1RpdGxlOiAnQWNjZXNzaWJsZSBUaXRsZScgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEhlYWRlciB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IHRpdGxlU3BhbiA9IHNjcmVlbi5nZXRCeVRpdGxlKCdBY2Nlc3NpYmxlIFRpdGxlJylcbiAgICAgIGV4cGVjdCh0aXRsZVNwYW4pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBVdGlscyBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgndXRpbHMnLCAoKSA9PiB7XG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBpc0ZpbGUgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdpc0ZpbGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3IgZmlsZSB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQWN0ICYgQXNzZXJ0XG4gICAgICBleHBlY3QoaXNGaWxlKCdmaWxlJykpLnRvQmUodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2UgZm9yIGZvbGRlciB0eXBlJywgKCkgPT4ge1xuICAgICAgLy8gQWN0ICYgQXNzZXJ0XG4gICAgICBleHBlY3QoaXNGaWxlKCdmb2xkZXInKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQuZWFjaChbXG4gICAgICBbJ2ZpbGUnLCB0cnVlXSxcbiAgICAgIFsnZm9sZGVyJywgZmFsc2VdLFxuICAgIF0gYXMgY29uc3QpKCdpc0ZpbGUoJXMpIHNob3VsZCByZXR1cm4gJXMnLCAodHlwZSwgZXhwZWN0ZWQpID0+IHtcbiAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgZXhwZWN0KGlzRmlsZSh0eXBlKSkudG9CZShleHBlY3RlZClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBpc0J1Y2tldExpc3RJbml0aWF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnaXNCdWNrZXRMaXN0SW5pdGlhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSB3aGVuIGJ1Y2tldCBpcyBub3QgZW1wdHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkYXRhOiBPbmxpbmVEcml2ZURhdGFbXSA9IFtcbiAgICAgICAgeyBidWNrZXQ6ICdteS1idWNrZXQnLCBmaWxlczogW10sIGlzX3RydW5jYXRlZDogZmFsc2UsIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7fSB9LFxuICAgICAgXVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnRcbiAgICAgIGV4cGVjdChpc0J1Y2tldExpc3RJbml0aWF0aW9uKGRhdGEsIFtdLCAnZXhpc3RpbmctYnVja2V0JykpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIHdoZW4gcHJlZml4IGlzIG5vdCBlbXB0eScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRhdGE6IE9ubGluZURyaXZlRGF0YVtdID0gW1xuICAgICAgICB7IGJ1Y2tldDogJ215LWJ1Y2tldCcsIGZpbGVzOiBbXSwgaXNfdHJ1bmNhdGVkOiBmYWxzZSwgbmV4dF9wYWdlX3BhcmFtZXRlcnM6IHt9IH0sXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgZXhwZWN0KGlzQnVja2V0TGlzdEluaXRpYXRpb24oZGF0YSwgWydmb2xkZXIxJ10sICcnKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gZmFsc2Ugd2hlbiBkYXRhIGl0ZW1zIGhhdmUgbm8gYnVja2V0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZGF0YTogT25saW5lRHJpdmVEYXRhW10gPSBbXG4gICAgICAgIHsgYnVja2V0OiAnJywgZmlsZXM6IFt7IGlkOiAnMScsIG5hbWU6ICdmaWxlLnR4dCcsIHNpemU6IDEwMjQsIHR5cGU6ICdmaWxlJyB9XSwgaXNfdHJ1bmNhdGVkOiBmYWxzZSwgbmV4dF9wYWdlX3BhcmFtZXRlcnM6IHt9IH0sXG4gICAgICBdXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgZXhwZWN0KGlzQnVja2V0TGlzdEluaXRpYXRpb24oZGF0YSwgW10sICcnKSkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdHJ1ZSBmb3IgbXVsdGlwbGUgYnVja2V0cyB3aXRoIG5vIHByZWZpeCBhbmQgYnVja2V0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZGF0YTogT25saW5lRHJpdmVEYXRhW10gPSBbXG4gICAgICAgIHsgYnVja2V0OiAnYnVja2V0LTEnLCBmaWxlczogW10sIGlzX3RydW5jYXRlZDogZmFsc2UsIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7fSB9LFxuICAgICAgICB7IGJ1Y2tldDogJ2J1Y2tldC0yJywgZmlsZXM6IFtdLCBpc190cnVuY2F0ZWQ6IGZhbHNlLCBuZXh0X3BhZ2VfcGFyYW1ldGVyczoge30gfSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0XG4gICAgICBleHBlY3QoaXNCdWNrZXRMaXN0SW5pdGlhdGlvbihkYXRhLCBbXSwgJycpKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHRydWUgZm9yIHNpbmdsZSBidWNrZXQgd2l0aCBubyBmaWxlcywgbm8gcHJlZml4LCBhbmQgbm8gYnVja2V0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZGF0YTogT25saW5lRHJpdmVEYXRhW10gPSBbXG4gICAgICAgIHsgYnVja2V0OiAnbXktYnVja2V0JywgZmlsZXM6IFtdLCBpc190cnVuY2F0ZWQ6IGZhbHNlLCBuZXh0X3BhZ2VfcGFyYW1ldGVyczoge30gfSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0XG4gICAgICBleHBlY3QoaXNCdWNrZXRMaXN0SW5pdGlhdGlvbihkYXRhLCBbXSwgJycpKS50b0JlKHRydWUpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGZhbHNlIGZvciBzaW5nbGUgYnVja2V0IHdpdGggZmlsZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBkYXRhOiBPbmxpbmVEcml2ZURhdGFbXSA9IFtcbiAgICAgICAgeyBidWNrZXQ6ICdteS1idWNrZXQnLCBmaWxlczogW3sgaWQ6ICcxJywgbmFtZTogJ2ZpbGUudHh0Jywgc2l6ZTogMTAyNCwgdHlwZTogJ2ZpbGUnIH1dLCBpc190cnVuY2F0ZWQ6IGZhbHNlLCBuZXh0X3BhZ2VfcGFyYW1ldGVyczoge30gfSxcbiAgICAgIF1cblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0XG4gICAgICBleHBlY3QoaXNCdWNrZXRMaXN0SW5pdGlhdGlvbihkYXRhLCBbXSwgJycpKS50b0JlKGZhbHNlKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBmYWxzZSBmb3IgZW1wdHkgZGF0YSBhcnJheScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGRhdGE6IE9ubGluZURyaXZlRGF0YVtdID0gW11cblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0XG4gICAgICBleHBlY3QoaXNCdWNrZXRMaXN0SW5pdGlhdGlvbihkYXRhLCBbXSwgJycpKS50b0JlKGZhbHNlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIGNvbnZlcnRPbmxpbmVEcml2ZURhdGEgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdjb252ZXJ0T25saW5lRHJpdmVEYXRhJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdFbXB0eSBkYXRhIGhhbmRsaW5nJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gZW1wdHkgcmVzdWx0IGZvciBlbXB0eSBkYXRhIGFycmF5JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRhdGE6IE9ubGluZURyaXZlRGF0YVtdID0gW11cblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydE9ubGluZURyaXZlRGF0YShkYXRhLCBbXSwgJycpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoe1xuICAgICAgICAgIGZpbGVMaXN0OiBbXSxcbiAgICAgICAgICBpc1RydW5jYXRlZDogZmFsc2UsXG4gICAgICAgICAgbmV4dFBhZ2VQYXJhbWV0ZXJzOiB7fSxcbiAgICAgICAgICBoYXNCdWNrZXQ6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0J1Y2tldCBsaXN0IGluaXRpYXRpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNvbnZlcnQgbXVsdGlwbGUgYnVja2V0cyB0byBidWNrZXQgZmlsZSBsaXN0JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRhdGE6IE9ubGluZURyaXZlRGF0YVtdID0gW1xuICAgICAgICAgIHsgYnVja2V0OiAnYnVja2V0LTEnLCBmaWxlczogW10sIGlzX3RydW5jYXRlZDogZmFsc2UsIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7fSB9LFxuICAgICAgICAgIHsgYnVja2V0OiAnYnVja2V0LTInLCBmaWxlczogW10sIGlzX3RydW5jYXRlZDogZmFsc2UsIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7fSB9LFxuICAgICAgICAgIHsgYnVja2V0OiAnYnVja2V0LTMnLCBmaWxlczogW10sIGlzX3RydW5jYXRlZDogZmFsc2UsIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7fSB9LFxuICAgICAgICBdXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRPbmxpbmVEcml2ZURhdGEoZGF0YSwgW10sICcnKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QocmVzdWx0LmZpbGVMaXN0KS50b0hhdmVMZW5ndGgoMylcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5maWxlTGlzdFswXSkudG9FcXVhbCh7XG4gICAgICAgICAgaWQ6ICdidWNrZXQtMScsXG4gICAgICAgICAgbmFtZTogJ2J1Y2tldC0xJyxcbiAgICAgICAgICB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmJ1Y2tldCxcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5maWxlTGlzdFsxXSkudG9FcXVhbCh7XG4gICAgICAgICAgaWQ6ICdidWNrZXQtMicsXG4gICAgICAgICAgbmFtZTogJ2J1Y2tldC0yJyxcbiAgICAgICAgICB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmJ1Y2tldCxcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5maWxlTGlzdFsyXSkudG9FcXVhbCh7XG4gICAgICAgICAgaWQ6ICdidWNrZXQtMycsXG4gICAgICAgICAgbmFtZTogJ2J1Y2tldC0zJyxcbiAgICAgICAgICB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmJ1Y2tldCxcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5oYXNCdWNrZXQpLnRvQmUodHJ1ZSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5pc1RydW5jYXRlZCkudG9CZShmYWxzZSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5uZXh0UGFnZVBhcmFtZXRlcnMpLnRvRXF1YWwoe30pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNvbnZlcnQgc2luZ2xlIGJ1Y2tldCB3aXRoIG5vIGZpbGVzIHRvIGJ1Y2tldCBsaXN0JywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRhdGE6IE9ubGluZURyaXZlRGF0YVtdID0gW1xuICAgICAgICAgIHsgYnVja2V0OiAnbXktYnVja2V0JywgZmlsZXM6IFtdLCBpc190cnVuY2F0ZWQ6IGZhbHNlLCBuZXh0X3BhZ2VfcGFyYW1ldGVyczoge30gfSxcbiAgICAgICAgXVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0T25saW5lRHJpdmVEYXRhKGRhdGEsIFtdLCAnJylcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5maWxlTGlzdCkudG9IYXZlTGVuZ3RoKDEpXG4gICAgICAgIGV4cGVjdChyZXN1bHQuZmlsZUxpc3RbMF0pLnRvRXF1YWwoe1xuICAgICAgICAgIGlkOiAnbXktYnVja2V0JyxcbiAgICAgICAgICBuYW1lOiAnbXktYnVja2V0JyxcbiAgICAgICAgICB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmJ1Y2tldCxcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5oYXNCdWNrZXQpLnRvQmUodHJ1ZSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdGaWxlIGxpc3QgY29udmVyc2lvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY29udmVydCBmaWxlcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZGF0YTogT25saW5lRHJpdmVEYXRhW10gPSBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYnVja2V0OiAnbXktYnVja2V0JyxcbiAgICAgICAgICAgIGZpbGVzOiBbXG4gICAgICAgICAgICAgIHsgaWQ6ICdmaWxlLTEnLCBuYW1lOiAnZG9jdW1lbnQucGRmJywgc2l6ZTogMTAyNCwgdHlwZTogJ2ZpbGUnIH0sXG4gICAgICAgICAgICAgIHsgaWQ6ICdmaWxlLTInLCBuYW1lOiAnaW1hZ2UucG5nJywgc2l6ZTogMjA0OCwgdHlwZTogJ2ZpbGUnIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaXNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7fSxcbiAgICAgICAgICB9LFxuICAgICAgICBdXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRPbmxpbmVEcml2ZURhdGEoZGF0YSwgWydmb2xkZXIxJ10sICdteS1idWNrZXQnKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QocmVzdWx0LmZpbGVMaXN0KS50b0hhdmVMZW5ndGgoMilcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5maWxlTGlzdFswXSkudG9FcXVhbCh7XG4gICAgICAgICAgaWQ6ICdmaWxlLTEnLFxuICAgICAgICAgIG5hbWU6ICdkb2N1bWVudC5wZGYnLFxuICAgICAgICAgIHNpemU6IDEwMjQsXG4gICAgICAgICAgdHlwZTogT25saW5lRHJpdmVGaWxlVHlwZS5maWxlLFxuICAgICAgICB9KVxuICAgICAgICBleHBlY3QocmVzdWx0LmZpbGVMaXN0WzFdKS50b0VxdWFsKHtcbiAgICAgICAgICBpZDogJ2ZpbGUtMicsXG4gICAgICAgICAgbmFtZTogJ2ltYWdlLnBuZycsXG4gICAgICAgICAgc2l6ZTogMjA0OCxcbiAgICAgICAgICB0eXBlOiBPbmxpbmVEcml2ZUZpbGVUeXBlLmZpbGUsXG4gICAgICAgIH0pXG4gICAgICAgIGV4cGVjdChyZXN1bHQuaGFzQnVja2V0KS50b0JlKHRydWUpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNvbnZlcnQgZm9sZGVycyBjb3JyZWN0bHkgd2l0aG91dCBzaXplJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRhdGE6IE9ubGluZURyaXZlRGF0YVtdID0gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJ1Y2tldDogJ215LWJ1Y2tldCcsXG4gICAgICAgICAgICBmaWxlczogW1xuICAgICAgICAgICAgICB7IGlkOiAnZm9sZGVyLTEnLCBuYW1lOiAnRG9jdW1lbnRzJywgc2l6ZTogMCwgdHlwZTogJ2ZvbGRlcicgfSxcbiAgICAgICAgICAgICAgeyBpZDogJ2ZvbGRlci0yJywgbmFtZTogJ0ltYWdlcycsIHNpemU6IDAsIHR5cGU6ICdmb2xkZXInIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaXNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7fSxcbiAgICAgICAgICB9LFxuICAgICAgICBdXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRPbmxpbmVEcml2ZURhdGEoZGF0YSwgW10sICdteS1idWNrZXQnKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QocmVzdWx0LmZpbGVMaXN0KS50b0hhdmVMZW5ndGgoMilcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5maWxlTGlzdFswXSkudG9FcXVhbCh7XG4gICAgICAgICAgaWQ6ICdmb2xkZXItMScsXG4gICAgICAgICAgbmFtZTogJ0RvY3VtZW50cycsXG4gICAgICAgICAgc2l6ZTogdW5kZWZpbmVkLFxuICAgICAgICAgIHR5cGU6IE9ubGluZURyaXZlRmlsZVR5cGUuZm9sZGVyLFxuICAgICAgICB9KVxuICAgICAgICBleHBlY3QocmVzdWx0LmZpbGVMaXN0WzFdKS50b0VxdWFsKHtcbiAgICAgICAgICBpZDogJ2ZvbGRlci0yJyxcbiAgICAgICAgICBuYW1lOiAnSW1hZ2VzJyxcbiAgICAgICAgICBzaXplOiB1bmRlZmluZWQsXG4gICAgICAgICAgdHlwZTogT25saW5lRHJpdmVGaWxlVHlwZS5mb2xkZXIsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBtaXhlZCBmaWxlcyBhbmQgZm9sZGVycycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBkYXRhOiBPbmxpbmVEcml2ZURhdGFbXSA9IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBidWNrZXQ6ICdteS1idWNrZXQnLFxuICAgICAgICAgICAgZmlsZXM6IFtcbiAgICAgICAgICAgICAgeyBpZDogJ2ZvbGRlci0xJywgbmFtZTogJ0RvY3VtZW50cycsIHNpemU6IDAsIHR5cGU6ICdmb2xkZXInIH0sXG4gICAgICAgICAgICAgIHsgaWQ6ICdmaWxlLTEnLCBuYW1lOiAncmVhZG1lLnR4dCcsIHNpemU6IDI1NiwgdHlwZTogJ2ZpbGUnIH0sXG4gICAgICAgICAgICAgIHsgaWQ6ICdmb2xkZXItMicsIG5hbWU6ICdJbWFnZXMnLCBzaXplOiAwLCB0eXBlOiAnZm9sZGVyJyB9LFxuICAgICAgICAgICAgICB7IGlkOiAnZmlsZS0yJywgbmFtZTogJ2RhdGEuanNvbicsIHNpemU6IDUxMiwgdHlwZTogJ2ZpbGUnIH0sXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgaXNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7fSxcbiAgICAgICAgICB9LFxuICAgICAgICBdXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRPbmxpbmVEcml2ZURhdGEoZGF0YSwgW10sICdteS1idWNrZXQnKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QocmVzdWx0LmZpbGVMaXN0KS50b0hhdmVMZW5ndGgoNClcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5maWxlTGlzdFswXS50eXBlKS50b0JlKE9ubGluZURyaXZlRmlsZVR5cGUuZm9sZGVyKVxuICAgICAgICBleHBlY3QocmVzdWx0LmZpbGVMaXN0WzFdLnR5cGUpLnRvQmUoT25saW5lRHJpdmVGaWxlVHlwZS5maWxlKVxuICAgICAgICBleHBlY3QocmVzdWx0LmZpbGVMaXN0WzJdLnR5cGUpLnRvQmUoT25saW5lRHJpdmVGaWxlVHlwZS5mb2xkZXIpXG4gICAgICAgIGV4cGVjdChyZXN1bHQuZmlsZUxpc3RbM10udHlwZSkudG9CZShPbmxpbmVEcml2ZUZpbGVUeXBlLmZpbGUpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnVHJ1bmNhdGlvbiBhbmQgcGFnaW5hdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmV0dXJuIGlzVHJ1bmNhdGVkIHRydWUgd2hlbiBkYXRhIGlzIHRydW5jYXRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBkYXRhOiBPbmxpbmVEcml2ZURhdGFbXSA9IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBidWNrZXQ6ICdteS1idWNrZXQnLFxuICAgICAgICAgICAgZmlsZXM6IFt7IGlkOiAnZmlsZS0xJywgbmFtZTogJ2ZpbGUudHh0Jywgc2l6ZTogMTAyNCwgdHlwZTogJ2ZpbGUnIH1dLFxuICAgICAgICAgICAgaXNfdHJ1bmNhdGVkOiB0cnVlLFxuICAgICAgICAgICAgbmV4dF9wYWdlX3BhcmFtZXRlcnM6IHsgY3Vyc29yOiAnbmV4dC1jdXJzb3InIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgXVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0T25saW5lRHJpdmVEYXRhKGRhdGEsIFtdLCAnbXktYnVja2V0JylcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5pc1RydW5jYXRlZCkudG9CZSh0cnVlKVxuICAgICAgICBleHBlY3QocmVzdWx0Lm5leHRQYWdlUGFyYW1ldGVycykudG9FcXVhbCh7IGN1cnNvcjogJ25leHQtY3Vyc29yJyB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gaXNUcnVuY2F0ZWQgZmFsc2Ugd2hlbiBub3QgdHJ1bmNhdGVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRhdGE6IE9ubGluZURyaXZlRGF0YVtdID0gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJ1Y2tldDogJ215LWJ1Y2tldCcsXG4gICAgICAgICAgICBmaWxlczogW3sgaWQ6ICdmaWxlLTEnLCBuYW1lOiAnZmlsZS50eHQnLCBzaXplOiAxMDI0LCB0eXBlOiAnZmlsZScgfV0sXG4gICAgICAgICAgICBpc190cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgbmV4dF9wYWdlX3BhcmFtZXRlcnM6IHt9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF1cblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydE9ubGluZURyaXZlRGF0YShkYXRhLCBbXSwgJ215LWJ1Y2tldCcpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChyZXN1bHQuaXNUcnVuY2F0ZWQpLnRvQmUoZmFsc2UpXG4gICAgICAgIGV4cGVjdChyZXN1bHQubmV4dFBhZ2VQYXJhbWV0ZXJzKS50b0VxdWFsKHt9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGlzX3RydW5jYXRlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBkYXRhOiBPbmxpbmVEcml2ZURhdGFbXSA9IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBidWNrZXQ6ICdteS1idWNrZXQnLFxuICAgICAgICAgICAgZmlsZXM6IFt7IGlkOiAnZmlsZS0xJywgbmFtZTogJ2ZpbGUudHh0Jywgc2l6ZTogMTAyNCwgdHlwZTogJ2ZpbGUnIH1dLFxuICAgICAgICAgICAgaXNfdHJ1bmNhdGVkOiB1bmRlZmluZWQgYXMgYW55LFxuICAgICAgICAgICAgbmV4dF9wYWdlX3BhcmFtZXRlcnM6IHVuZGVmaW5lZCBhcyBhbnksXG4gICAgICAgICAgfSxcbiAgICAgICAgXVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0T25saW5lRHJpdmVEYXRhKGRhdGEsIFtdLCAnbXktYnVja2V0JylcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5pc1RydW5jYXRlZCkudG9CZShmYWxzZSlcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5uZXh0UGFnZVBhcmFtZXRlcnMpLnRvRXF1YWwoe30pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnaGFzQnVja2V0IGZsYWcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJldHVybiBoYXNCdWNrZXQgdHJ1ZSB3aGVuIGJ1Y2tldCBleGlzdHMgaW4gZGF0YScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBkYXRhOiBPbmxpbmVEcml2ZURhdGFbXSA9IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBidWNrZXQ6ICdteS1idWNrZXQnLFxuICAgICAgICAgICAgZmlsZXM6IFt7IGlkOiAnZmlsZS0xJywgbmFtZTogJ2ZpbGUudHh0Jywgc2l6ZTogMTAyNCwgdHlwZTogJ2ZpbGUnIH1dLFxuICAgICAgICAgICAgaXNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7fSxcbiAgICAgICAgICB9LFxuICAgICAgICBdXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRPbmxpbmVEcml2ZURhdGEoZGF0YSwgW10sICdteS1idWNrZXQnKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QocmVzdWx0Lmhhc0J1Y2tldCkudG9CZSh0cnVlKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZXR1cm4gaGFzQnVja2V0IGZhbHNlIHdoZW4gYnVja2V0IGlzIGVtcHR5IGluIGRhdGEnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgZGF0YTogT25saW5lRHJpdmVEYXRhW10gPSBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYnVja2V0OiAnJyxcbiAgICAgICAgICAgIGZpbGVzOiBbeyBpZDogJ2ZpbGUtMScsIG5hbWU6ICdmaWxlLnR4dCcsIHNpemU6IDEwMjQsIHR5cGU6ICdmaWxlJyB9XSxcbiAgICAgICAgICAgIGlzX3RydW5jYXRlZDogZmFsc2UsXG4gICAgICAgICAgICBuZXh0X3BhZ2VfcGFyYW1ldGVyczoge30sXG4gICAgICAgICAgfSxcbiAgICAgICAgXVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0T25saW5lRHJpdmVEYXRhKGRhdGEsIFtdLCAnJylcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5oYXNCdWNrZXQpLnRvQmUoZmFsc2UpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnRWRnZSBjYXNlcycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGZpbGVzIHdpdGggemVybyBzaXplJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRhdGE6IE9ubGluZURyaXZlRGF0YVtdID0gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJ1Y2tldDogJ215LWJ1Y2tldCcsXG4gICAgICAgICAgICBmaWxlczogW3sgaWQ6ICdmaWxlLTEnLCBuYW1lOiAnZW1wdHkudHh0Jywgc2l6ZTogMCwgdHlwZTogJ2ZpbGUnIH1dLFxuICAgICAgICAgICAgaXNfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgICAgIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiB7fSxcbiAgICAgICAgICB9LFxuICAgICAgICBdXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRPbmxpbmVEcml2ZURhdGEoZGF0YSwgW10sICdteS1idWNrZXQnKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QocmVzdWx0LmZpbGVMaXN0WzBdLnNpemUpLnRvQmUoMClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGZpbGVzIHdpdGggdmVyeSBsYXJnZSBzaXplJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGxhcmdlU2l6ZSA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXG4gICAgICAgIGNvbnN0IGRhdGE6IE9ubGluZURyaXZlRGF0YVtdID0gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJ1Y2tldDogJ215LWJ1Y2tldCcsXG4gICAgICAgICAgICBmaWxlczogW3sgaWQ6ICdmaWxlLTEnLCBuYW1lOiAnbGFyZ2UuYmluJywgc2l6ZTogbGFyZ2VTaXplLCB0eXBlOiAnZmlsZScgfV0sXG4gICAgICAgICAgICBpc190cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICAgICAgbmV4dF9wYWdlX3BhcmFtZXRlcnM6IHt9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF1cblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydE9ubGluZURyaXZlRGF0YShkYXRhLCBbXSwgJ215LWJ1Y2tldCcpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChyZXN1bHQuZmlsZUxpc3RbMF0uc2l6ZSkudG9CZShsYXJnZVNpemUpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBmaWxlcyB3aXRoIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBuYW1lJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGRhdGE6IE9ubGluZURyaXZlRGF0YVtdID0gW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIGJ1Y2tldDogJ215LWJ1Y2tldCcsXG4gICAgICAgICAgICBmaWxlczogW1xuICAgICAgICAgICAgICB7IGlkOiAnZmlsZS0xJywgbmFtZTogJ2ZpbGVbMV0gKGNvcHkpLnR4dCcsIHNpemU6IDEwMjQsIHR5cGU6ICdmaWxlJyB9LFxuICAgICAgICAgICAgICB7IGlkOiAnZmlsZS0yJywgbmFtZTogJ2RvYy13aXRoLWRhc2hfYW5kX3VuZGVyc2NvcmUucGRmJywgc2l6ZTogMjA0OCwgdHlwZTogJ2ZpbGUnIH0sXG4gICAgICAgICAgICAgIHsgaWQ6ICdmaWxlLTMnLCBuYW1lOiAnZmlsZSB3aXRoIHNwYWNlcy50eHQnLCBzaXplOiA1MTIsIHR5cGU6ICdmaWxlJyB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIGlzX3RydW5jYXRlZDogZmFsc2UsXG4gICAgICAgICAgICBuZXh0X3BhZ2VfcGFyYW1ldGVyczoge30sXG4gICAgICAgICAgfSxcbiAgICAgICAgXVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICBjb25zdCByZXN1bHQgPSBjb252ZXJ0T25saW5lRHJpdmVEYXRhKGRhdGEsIFtdLCAnbXktYnVja2V0JylcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5maWxlTGlzdFswXS5uYW1lKS50b0JlKCdmaWxlWzFdIChjb3B5KS50eHQnKVxuICAgICAgICBleHBlY3QocmVzdWx0LmZpbGVMaXN0WzFdLm5hbWUpLnRvQmUoJ2RvYy13aXRoLWRhc2hfYW5kX3VuZGVyc2NvcmUucGRmJylcbiAgICAgICAgZXhwZWN0KHJlc3VsdC5maWxlTGlzdFsyXS5uYW1lKS50b0JlKCdmaWxlIHdpdGggc3BhY2VzLnR4dCcpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBjb21wbGV4IG5leHRfcGFnZV9wYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGNvbXBsZXhQYXJhbXMgPSB7XG4gICAgICAgICAgY3Vyc29yOiAnYWJjMTIzJyxcbiAgICAgICAgICBwYWdlOiAyLFxuICAgICAgICAgIGxpbWl0OiA1MCxcbiAgICAgICAgICBuZXN0ZWQ6IHsga2V5OiAndmFsdWUnIH0sXG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YTogT25saW5lRHJpdmVEYXRhW10gPSBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgYnVja2V0OiAnbXktYnVja2V0JyxcbiAgICAgICAgICAgIGZpbGVzOiBbeyBpZDogJ2ZpbGUtMScsIG5hbWU6ICdmaWxlLnR4dCcsIHNpemU6IDEwMjQsIHR5cGU6ICdmaWxlJyB9XSxcbiAgICAgICAgICAgIGlzX3RydW5jYXRlZDogdHJ1ZSxcbiAgICAgICAgICAgIG5leHRfcGFnZV9wYXJhbWV0ZXJzOiBjb21wbGV4UGFyYW1zLFxuICAgICAgICAgIH0sXG4gICAgICAgIF1cblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gY29udmVydE9ubGluZURyaXZlRGF0YShkYXRhLCBbXSwgJ215LWJ1Y2tldCcpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChyZXN1bHQubmV4dFBhZ2VQYXJhbWV0ZXJzKS50b0VxdWFsKGNvbXBsZXhQYXJhbXMpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19