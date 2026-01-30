"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const types_1 = require("@/app/components/workflow/nodes/_base/types");
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
// Mock Toast.notify - static method that manipulates DOM, needs mocking to verify calls
const { mockToastNotify } = vi.hoisted(() => ({
    mockToastNotify: vi.fn(),
}));
vi.mock('@/app/components/base/toast', () => ({
    default: {
        notify: mockToastNotify,
    },
}));
// Mock useGetDataSourceAuth - API service hook requires mocking
const { mockUseGetDataSourceAuth } = vi.hoisted(() => ({
    mockUseGetDataSourceAuth: vi.fn(),
}));
vi.mock('@/service/use-datasource', () => ({
    useGetDataSourceAuth: mockUseGetDataSourceAuth,
}));
// Note: zustand/react/shallow useShallow is imported directly (simple utility function)
// Mock store
const mockStoreState = {
    documentsData: [],
    searchValue: '',
    selectedPagesId: new Set(),
    currentCredentialId: '',
    setDocumentsData: vi.fn(),
    setSearchValue: vi.fn(),
    setSelectedPagesId: vi.fn(),
    setOnlineDocuments: vi.fn(),
    setCurrentDocument: vi.fn(),
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
// Mock SearchInput component
vi.mock('@/app/components/base/notion-page-selector/search-input', () => ({
    default: ({ value, onChange }) => (<div data-testid="search-input">
      <input data-testid="search-input-field" value={value} onChange={e => onChange(e.target.value)} placeholder="Search"/>
    </div>),
}));
// Mock PageSelector component
vi.mock('./page-selector', () => ({
    default: (props) => (<div data-testid="page-selector">
      <span data-testid="page-selector-checked-count">{props.checkedIds?.size || 0}</span>
      <span data-testid="page-selector-search-value">{props.searchValue}</span>
      <span data-testid="page-selector-can-preview">{String(props.canPreview)}</span>
      <span data-testid="page-selector-multiple-choice">{String(props.isMultipleChoice)}</span>
      <span data-testid="page-selector-credential-id">{props.currentCredentialId}</span>
      <button data-testid="page-selector-select-btn" onClick={() => props.onSelect(new Set(['page-1', 'page-2']))}>
        Select Pages
      </button>
      <button data-testid="page-selector-preview-btn" onClick={() => props.onPreview?.('page-1')}>
        Preview Page
      </button>
    </div>),
}));
// Mock Title component
vi.mock('./title', () => ({
    default: ({ name }) => (<div data-testid="title">
      <span data-testid="title-name">{name}</span>
    </div>),
}));
// ==========================================
// Test Data Builders
// ==========================================
const createMockNodeData = (overrides) => ({
    title: 'Test Node',
    plugin_id: 'plugin-123',
    provider_type: 'notion',
    provider_name: 'notion-provider',
    datasource_name: 'notion-ds',
    datasource_label: 'Notion',
    datasource_parameters: {},
    datasource_configurations: {},
    ...overrides,
});
const createMockPage = (overrides) => ({
    page_id: 'page-1',
    page_name: 'Test Page',
    page_icon: null,
    is_bound: false,
    parent_id: 'root',
    type: 'page',
    workspace_id: 'workspace-1',
    ...overrides,
});
const createMockWorkspace = (overrides) => ({
    workspace_id: 'workspace-1',
    workspace_name: 'Test Workspace',
    workspace_icon: null,
    pages: [createMockPage()],
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
describe('OnlineDocuments', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset store state
        mockStoreState.documentsData = [];
        mockStoreState.searchValue = '';
        mockStoreState.selectedPagesId = new Set();
        mockStoreState.currentCredentialId = '';
        mockStoreState.setDocumentsData = vi.fn();
        mockStoreState.setSearchValue = vi.fn();
        mockStoreState.setSelectedPagesId = vi.fn();
        mockStoreState.setOnlineDocuments = vi.fn();
        mockStoreState.setCurrentDocument = vi.fn();
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
        });
        it('should render Header with correct props', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-123';
            const props = createDefaultProps({
                nodeData: createMockNodeData({ datasource_label: 'My Notion' }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('header-doc-title')).toHaveTextContent('Docs');
            expect(react_1.screen.getByTestId('header-plugin-name')).toHaveTextContent('My Notion');
            expect(react_1.screen.getByTestId('header-credential-id')).toHaveTextContent('cred-123');
        });
        it('should render Loading when documentsData is empty', () => {
            // Arrange
            mockStoreState.documentsData = [];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByRole('status')).toBeInTheDocument();
        });
        it('should render PageSelector when documentsData has content', () => {
            // Arrange
            mockStoreState.documentsData = [createMockWorkspace()];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('page-selector')).toBeInTheDocument();
            expect(react_1.screen.queryByRole('status')).not.toBeInTheDocument();
        });
        it('should render Title with datasource_label', () => {
            // Arrange
            mockStoreState.documentsData = [createMockWorkspace()];
            const props = createDefaultProps({
                nodeData: createMockNodeData({ datasource_label: 'Notion Integration' }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('title-name')).toHaveTextContent('Notion Integration');
        });
        it('should render SearchInput with current searchValue', () => {
            // Arrange
            mockStoreState.searchValue = 'test search';
            mockStoreState.documentsData = [createMockWorkspace()];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            const searchInput = react_1.screen.getByTestId('search-input-field');
            expect(searchInput.value).toBe('test search');
        });
    });
    // ==========================================
    // Props Testing
    // ==========================================
    describe('Props', () => {
        describe('nodeId prop', () => {
            it('should use nodeId in datasourceNodeRunURL for non-pipeline mode', () => {
                // Arrange
                mockStoreState.currentCredentialId = 'cred-1';
                const props = createDefaultProps({
                    nodeId: 'custom-node-id',
                    isInPipeline: false,
                });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert - Effect triggers ssePost with correct URL
                expect(mockSsePost).toHaveBeenCalledWith(expect.stringContaining('/nodes/custom-node-id/run'), expect.any(Object), expect.any(Object));
            });
        });
        describe('nodeData prop', () => {
            it('should pass datasource_parameters to ssePost', () => {
                // Arrange
                mockStoreState.currentCredentialId = 'cred-1';
                const nodeData = createMockNodeData({
                    datasource_parameters: {
                        param1: { type: types_1.VarKindType.constant, value: 'value1' },
                        param2: { type: types_1.VarKindType.constant, value: 'value2' },
                    },
                });
                const props = createDefaultProps({ nodeData });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockSsePost).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
                    body: expect.objectContaining({
                        inputs: { param1: 'value1', param2: 'value2' },
                    }),
                }), expect.any(Object));
            });
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
        });
        describe('isInPipeline prop', () => {
            it('should use draft URL when isInPipeline is true', () => {
                // Arrange
                mockStoreState.currentCredentialId = 'cred-1';
                const props = createDefaultProps({ isInPipeline: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockSsePost).toHaveBeenCalledWith(expect.stringContaining('/workflows/draft/'), expect.any(Object), expect.any(Object));
            });
            it('should use published URL when isInPipeline is false', () => {
                // Arrange
                mockStoreState.currentCredentialId = 'cred-1';
                const props = createDefaultProps({ isInPipeline: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(mockSsePost).toHaveBeenCalledWith(expect.stringContaining('/workflows/published/'), expect.any(Object), expect.any(Object));
            });
            it('should pass canPreview as false to PageSelector when isInPipeline is true', () => {
                // Arrange
                mockStoreState.documentsData = [createMockWorkspace()];
                const props = createDefaultProps({ isInPipeline: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('page-selector-can-preview')).toHaveTextContent('false');
            });
            it('should pass canPreview as true to PageSelector when isInPipeline is false', () => {
                // Arrange
                mockStoreState.documentsData = [createMockWorkspace()];
                const props = createDefaultProps({ isInPipeline: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('page-selector-can-preview')).toHaveTextContent('true');
            });
        });
        describe('supportBatchUpload prop', () => {
            it('should pass isMultipleChoice as true to PageSelector when supportBatchUpload is true', () => {
                // Arrange
                mockStoreState.documentsData = [createMockWorkspace()];
                const props = createDefaultProps({ supportBatchUpload: true });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('page-selector-multiple-choice')).toHaveTextContent('true');
            });
            it('should pass isMultipleChoice as false to PageSelector when supportBatchUpload is false', () => {
                // Arrange
                mockStoreState.documentsData = [createMockWorkspace()];
                const props = createDefaultProps({ supportBatchUpload: false });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('page-selector-multiple-choice')).toHaveTextContent('false');
            });
            it.each([
                [true, 'true'],
                [false, 'false'],
                [undefined, 'true'], // Default value
            ])('should handle supportBatchUpload=%s correctly', (value, expected) => {
                // Arrange
                mockStoreState.documentsData = [createMockWorkspace()];
                const props = createDefaultProps({ supportBatchUpload: value });
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                expect(react_1.screen.getByTestId('page-selector-multiple-choice')).toHaveTextContent(expected);
            });
        });
        describe('onCredentialChange prop', () => {
            it('should pass onCredentialChange to Header', () => {
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
    // Side Effects and Cleanup
    // ==========================================
    describe('Side Effects and Cleanup', () => {
        it('should call getOnlineDocuments when currentCredentialId changes', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockSsePost).toHaveBeenCalledTimes(1);
        });
        it('should not call getOnlineDocuments when currentCredentialId is empty', () => {
            // Arrange
            mockStoreState.currentCredentialId = '';
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockSsePost).not.toHaveBeenCalled();
        });
        it('should pass correct body parameters to ssePost', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-123';
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockSsePost).toHaveBeenCalledWith(expect.any(String), {
                body: {
                    inputs: {},
                    credential_id: 'cred-123',
                    datasource_type: 'online_document',
                },
            }, expect.any(Object));
        });
        it('should handle onDataSourceNodeCompleted callback correctly', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const mockWorkspaces = [createMockWorkspace()];
            mockSsePost.mockImplementation((url, options, callbacks) => {
                // Simulate successful response
                callbacks.onDataSourceNodeCompleted({
                    event: 'datasource_completed',
                    data: mockWorkspaces,
                    time_consuming: 1000,
                });
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setDocumentsData).toHaveBeenCalledWith(mockWorkspaces);
            });
        });
        it('should handle onDataSourceNodeError callback correctly', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockSsePost.mockImplementation((url, options, callbacks) => {
                // Simulate error response
                callbacks.onDataSourceNodeError({
                    event: 'datasource_error',
                    error: 'Something went wrong',
                });
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockToastNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'Something went wrong',
                });
            });
        });
        it('should construct correct URL for draft workflow', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockPipelineId = 'pipeline-456';
            const props = createDefaultProps({
                nodeId: 'node-789',
                isInPipeline: true,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockSsePost).toHaveBeenCalledWith('/rag/pipelines/pipeline-456/workflows/draft/datasource/nodes/node-789/run', expect.any(Object), expect.any(Object));
        });
        it('should construct correct URL for published workflow', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockPipelineId = 'pipeline-456';
            const props = createDefaultProps({
                nodeId: 'node-789',
                isInPipeline: false,
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockSsePost).toHaveBeenCalledWith('/rag/pipelines/pipeline-456/workflows/published/datasource/nodes/node-789/run', expect.any(Object), expect.any(Object));
        });
    });
    // ==========================================
    // Callback Stability and Memoization
    // ==========================================
    describe('Callback Stability and Memoization', () => {
        it('should have stable handleSearchValueChange that updates store', () => {
            // Arrange
            mockStoreState.documentsData = [createMockWorkspace()];
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const searchInput = react_1.screen.getByTestId('search-input-field');
            react_1.fireEvent.change(searchInput, { target: { value: 'new search value' } });
            // Assert
            expect(mockStoreState.setSearchValue).toHaveBeenCalledWith('new search value');
        });
        it('should have stable handleSelectPages that updates store', () => {
            // Arrange
            mockStoreState.documentsData = [createMockWorkspace()];
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('page-selector-select-btn'));
            // Assert
            expect(mockStoreState.setSelectedPagesId).toHaveBeenCalled();
            expect(mockStoreState.setOnlineDocuments).toHaveBeenCalled();
        });
        it('should have stable handlePreviewPage that updates store', () => {
            // Arrange
            const mockPages = [
                createMockPage({ page_id: 'page-1', page_name: 'Page 1' }),
            ];
            mockStoreState.documentsData = [createMockWorkspace({ pages: mockPages })];
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('page-selector-preview-btn'));
            // Assert
            expect(mockStoreState.setCurrentDocument).toHaveBeenCalled();
        });
        it('should have stable handleSetting callback', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('header-config-btn'));
            // Assert
            expect(mockSetShowAccountSettingModal).toHaveBeenCalledWith({
                payload: 'data-source',
            });
        });
    });
    // ==========================================
    // Memoization Logic and Dependencies
    // ==========================================
    describe('Memoization Logic and Dependencies', () => {
        it('should compute PagesMapAndSelectedPagesId correctly from documentsData', () => {
            // Arrange
            const mockPages = [
                createMockPage({ page_id: 'page-1', page_name: 'Page 1' }),
                createMockPage({ page_id: 'page-2', page_name: 'Page 2' }),
            ];
            mockStoreState.documentsData = [
                createMockWorkspace({ workspace_id: 'ws-1', pages: mockPages }),
            ];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - PageSelector receives the pagesMap (verified via mock)
            expect(react_1.screen.getByTestId('page-selector')).toBeInTheDocument();
        });
        it('should recompute PagesMapAndSelectedPagesId when documentsData changes', () => {
            // Arrange
            const initialPages = [createMockPage({ page_id: 'page-1' })];
            mockStoreState.documentsData = [createMockWorkspace({ pages: initialPages })];
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Act - Update documentsData
            const newPages = [
                createMockPage({ page_id: 'page-1' }),
                createMockPage({ page_id: 'page-2' }),
            ];
            mockStoreState.documentsData = [createMockWorkspace({ pages: newPages })];
            rerender(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('page-selector')).toBeInTheDocument();
        });
        it('should handle empty documentsData in PagesMapAndSelectedPagesId computation', () => {
            // Arrange
            mockStoreState.documentsData = [];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should show loading instead of PageSelector
            expect(react_1.screen.getByRole('status')).toBeInTheDocument();
        });
    });
    // ==========================================
    // User Interactions and Event Handlers
    // ==========================================
    describe('User Interactions and Event Handlers', () => {
        it('should handle search input changes', () => {
            // Arrange
            mockStoreState.documentsData = [createMockWorkspace()];
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const searchInput = react_1.screen.getByTestId('search-input-field');
            react_1.fireEvent.change(searchInput, { target: { value: 'search query' } });
            // Assert
            expect(mockStoreState.setSearchValue).toHaveBeenCalledWith('search query');
        });
        it('should handle page selection', () => {
            // Arrange
            const mockPages = [
                createMockPage({ page_id: 'page-1', page_name: 'Page 1' }),
                createMockPage({ page_id: 'page-2', page_name: 'Page 2' }),
            ];
            mockStoreState.documentsData = [createMockWorkspace({ pages: mockPages })];
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('page-selector-select-btn'));
            // Assert
            expect(mockStoreState.setSelectedPagesId).toHaveBeenCalled();
            expect(mockStoreState.setOnlineDocuments).toHaveBeenCalled();
        });
        it('should handle page preview', () => {
            // Arrange
            const mockPages = [createMockPage({ page_id: 'page-1', page_name: 'Page 1' })];
            mockStoreState.documentsData = [createMockWorkspace({ pages: mockPages })];
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('page-selector-preview-btn'));
            // Assert
            expect(mockStoreState.setCurrentDocument).toHaveBeenCalled();
        });
        it('should handle configuration button click', () => {
            // Arrange
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            react_1.fireEvent.click(react_1.screen.getByTestId('header-config-btn'));
            // Assert
            expect(mockSetShowAccountSettingModal).toHaveBeenCalledWith({
                payload: 'data-source',
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
    });
    // ==========================================
    // API Calls Mocking
    // ==========================================
    describe('API Calls', () => {
        it('should call ssePost with correct parameters', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'test-cred';
            const props = createDefaultProps({
                nodeData: createMockNodeData({
                    datasource_parameters: {
                        workspace: { type: types_1.VarKindType.constant, value: 'ws-123' },
                        database: { type: types_1.VarKindType.constant, value: 'db-456' },
                    },
                }),
            });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockSsePost).toHaveBeenCalledWith(expect.any(String), {
                body: {
                    inputs: { workspace: 'ws-123', database: 'db-456' },
                    credential_id: 'test-cred',
                    datasource_type: 'online_document',
                },
            }, expect.objectContaining({
                onDataSourceNodeCompleted: expect.any(Function),
                onDataSourceNodeError: expect.any(Function),
            }));
        });
        it('should handle successful API response', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const mockData = [createMockWorkspace()];
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeCompleted({
                    event: 'datasource_completed',
                    data: mockData,
                    time_consuming: 500,
                });
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setDocumentsData).toHaveBeenCalledWith(mockData);
            });
        });
        it('should handle API error response', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeError({
                    event: 'datasource_error',
                    error: 'API Error Message',
                });
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockToastNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'API Error Message',
                });
            });
        });
        it('should use useGetDataSourceAuth with correct parameters', () => {
            // Arrange
            const nodeData = createMockNodeData({
                plugin_id: 'notion-plugin',
                provider_name: 'notion-provider',
            });
            const props = createDefaultProps({ nodeData });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockUseGetDataSourceAuth).toHaveBeenCalledWith({
                pluginId: 'notion-plugin',
                provider: 'notion-provider',
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
        it('should handle documentsData with empty pages array', () => {
            // Arrange
            mockStoreState.documentsData = [createMockWorkspace({ pages: [] })];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('page-selector')).toBeInTheDocument();
        });
        it('should handle undefined documentsData in useMemo (line 59 branch)', () => {
            // Arrange - Set documentsData to undefined to test the || [] fallback
            mockStoreState.documentsData = undefined;
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should show loading when documentsData is undefined
            expect(react_1.screen.getByRole('status')).toBeInTheDocument();
        });
        it('should handle undefined datasource_parameters (line 79 branch)', () => {
            // Arrange - Set datasource_parameters to undefined to test the || {} fallback
            mockStoreState.currentCredentialId = 'cred-1';
            const nodeData = createMockNodeData();
            // @ts-expect-error - Testing undefined case for branch coverage
            nodeData.datasource_parameters = undefined;
            const props = createDefaultProps({ nodeData });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - ssePost should be called with empty inputs
            expect(mockSsePost).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
                body: expect.objectContaining({
                    inputs: {},
                }),
            }), expect.any(Object));
        });
        it('should handle datasource_parameters value without value property (line 80 else branch)', () => {
            // Arrange - Test the else branch where value is not an object with 'value' property
            // This tests: typeof value === 'object' && value !== null && 'value' in value ? value.value : value
            // The else branch (: value) is executed when value is a primitive or object without 'value' key
            mockStoreState.currentCredentialId = 'cred-1';
            const nodeData = createMockNodeData({
                datasource_parameters: {
                    // Object without 'value' key - should use the object itself
                    objWithoutValue: { type: types_1.VarKindType.constant, other: 'data' },
                },
            });
            const props = createDefaultProps({ nodeData });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - The object without 'value' property should be passed as-is
            expect(mockSsePost).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
                body: expect.objectContaining({
                    inputs: expect.objectContaining({
                        objWithoutValue: expect.objectContaining({ type: types_1.VarKindType.constant, other: 'data' }),
                    }),
                }),
            }), expect.any(Object));
        });
        it('should handle multiple workspaces in documentsData', () => {
            // Arrange
            mockStoreState.documentsData = [
                createMockWorkspace({ workspace_id: 'ws-1', pages: [createMockPage({ page_id: 'page-1' })] }),
                createMockWorkspace({ workspace_id: 'ws-2', pages: [createMockPage({ page_id: 'page-2' })] }),
            ];
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('page-selector')).toBeInTheDocument();
        });
        it('should handle special characters in searchValue', () => {
            // Arrange
            mockStoreState.documentsData = [createMockWorkspace()];
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const searchInput = react_1.screen.getByTestId('search-input-field');
            react_1.fireEvent.change(searchInput, { target: { value: 'test<script>alert("xss")</script>' } });
            // Assert
            expect(mockStoreState.setSearchValue).toHaveBeenCalledWith('test<script>alert("xss")</script>');
        });
        it('should handle unicode characters in searchValue', () => {
            // Arrange
            mockStoreState.documentsData = [createMockWorkspace()];
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Act
            const searchInput = react_1.screen.getByTestId('search-input-field');
            react_1.fireEvent.change(searchInput, { target: { value: '测试搜索 🔍' } });
            // Assert
            expect(mockStoreState.setSearchValue).toHaveBeenCalledWith('测试搜索 🔍');
        });
        it('should handle empty string currentCredentialId', () => {
            // Arrange
            mockStoreState.currentCredentialId = '';
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockSsePost).not.toHaveBeenCalled();
        });
        it('should handle complex datasource_parameters with nested objects', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const nodeData = createMockNodeData({
                datasource_parameters: {
                    simple: { type: types_1.VarKindType.constant, value: 'value' },
                    nested: { type: types_1.VarKindType.constant, value: 'nested-value' },
                },
            });
            const props = createDefaultProps({ nodeData });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(mockSsePost).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
                body: expect.objectContaining({
                    inputs: expect.objectContaining({
                        simple: 'value',
                        nested: 'nested-value',
                    }),
                }),
            }), expect.any(Object));
        });
        it('should handle undefined pipelineId gracefully', () => {
            // Arrange
            mockPipelineId = undefined;
            mockStoreState.currentCredentialId = 'cred-1';
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Should still call ssePost with undefined in URL
            expect(mockSsePost).toHaveBeenCalled();
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
            mockStoreState.documentsData = [createMockWorkspace()];
            const props = createDefaultProps(propVariation);
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            expect(react_1.screen.getByTestId('page-selector')).toBeInTheDocument();
            expect(react_1.screen.getByTestId('page-selector-can-preview')).toHaveTextContent(String(!propVariation.isInPipeline));
            expect(react_1.screen.getByTestId('page-selector-multiple-choice')).toHaveTextContent(String(propVariation.supportBatchUpload));
        });
        it('should use default values for optional props', () => {
            // Arrange
            mockStoreState.documentsData = [createMockWorkspace()];
            const props = {
                nodeId: 'node-1',
                nodeData: createMockNodeData(),
                onCredentialChange: vi.fn(),
                // isInPipeline and supportBatchUpload are not provided
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Default values: isInPipeline = false, supportBatchUpload = true
            expect(react_1.screen.getByTestId('page-selector-can-preview')).toHaveTextContent('true');
            expect(react_1.screen.getByTestId('page-selector-multiple-choice')).toHaveTextContent('true');
        });
    });
    // ==========================================
    // Integration Tests
    // ==========================================
    describe('Integration', () => {
        it('should complete full workflow: load data -> search -> select -> preview', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            const mockPages = [
                createMockPage({ page_id: 'page-1', page_name: 'Test Page 1' }),
                createMockPage({ page_id: 'page-2', page_name: 'Test Page 2' }),
            ];
            const mockWorkspace = createMockWorkspace({ pages: mockPages });
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeCompleted({
                    event: 'datasource_completed',
                    data: [mockWorkspace],
                    time_consuming: 100,
                });
            });
            // Update store state after API call
            mockStoreState.documentsData = [mockWorkspace];
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - Data loaded and PageSelector shown
            await (0, react_1.waitFor)(() => {
                expect(mockStoreState.setDocumentsData).toHaveBeenCalled();
            });
            // Act - Search
            const searchInput = react_1.screen.getByTestId('search-input-field');
            react_1.fireEvent.change(searchInput, { target: { value: 'Test' } });
            expect(mockStoreState.setSearchValue).toHaveBeenCalledWith('Test');
            // Act - Select pages
            react_1.fireEvent.click(react_1.screen.getByTestId('page-selector-select-btn'));
            expect(mockStoreState.setSelectedPagesId).toHaveBeenCalled();
            // Act - Preview page
            react_1.fireEvent.click(react_1.screen.getByTestId('page-selector-preview-btn'));
            expect(mockStoreState.setCurrentDocument).toHaveBeenCalled();
        });
        it('should handle error flow correctly', async () => {
            // Arrange
            mockStoreState.currentCredentialId = 'cred-1';
            mockSsePost.mockImplementation((url, options, callbacks) => {
                callbacks.onDataSourceNodeError({
                    event: 'datasource_error',
                    error: 'Failed to fetch documents',
                });
            });
            const props = createDefaultProps();
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert
            await (0, react_1.waitFor)(() => {
                expect(mockToastNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'Failed to fetch documents',
                });
            });
            // Should still show loading since documentsData is empty
            expect(react_1.screen.getByRole('status')).toBeInTheDocument();
        });
        it('should handle credential change and refetch documents', () => {
            // Arrange
            mockStoreState.currentCredentialId = 'initial-cred';
            const mockOnCredentialChange = vi.fn();
            const props = createDefaultProps({ onCredentialChange: mockOnCredentialChange });
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Initial fetch
            expect(mockSsePost).toHaveBeenCalledTimes(1);
            // Change credential
            react_1.fireEvent.click(react_1.screen.getByTestId('header-credential-change'));
            expect(mockOnCredentialChange).toHaveBeenCalledWith('new-cred-id');
        });
    });
    // ==========================================
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQTJFO0FBQzNFLCtCQUE4QjtBQUM5Qix1RUFBeUU7QUFDekUsbUNBQXFDO0FBRXJDLDZDQUE2QztBQUM3QyxlQUFlO0FBQ2YsNkNBQTZDO0FBRTdDLGdFQUFnRTtBQUVoRSxrREFBa0Q7QUFDbEQsTUFBTSxXQUFXLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQWEsRUFBRSxFQUFFLENBQUMsMkJBQTJCLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0FBQ3JGLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMvQixVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVztDQUM5QixDQUFDLENBQUMsQ0FBQTtBQUVILGtFQUFrRTtBQUNsRSxJQUFJLGNBQWMsR0FBRyxjQUFjLENBQUE7QUFDbkMsRUFBRSxDQUFDLElBQUksQ0FBQywwQkFBMEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3pDLG1DQUFtQyxFQUFFLENBQUMsUUFBeUIsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxFQUFFLENBQUM7Q0FDM0gsQ0FBQyxDQUFDLENBQUE7QUFFSCx5REFBeUQ7QUFDekQsTUFBTSw4QkFBOEIsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDOUMsRUFBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLHVCQUF1QixFQUFFLENBQUMsUUFBeUIsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsMEJBQTBCLEVBQUUsOEJBQThCLEVBQUUsQ0FBQztDQUNqSSxDQUFDLENBQUMsQ0FBQTtBQUVILDhDQUE4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Q0FBQyxlQUFlLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDM0MsSUFBSSxFQUFFLE9BQU87b0JBQ2IsT0FBTyxFQUFFLDJCQUEyQjtpQkFDckMsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFDLENBQUE7WUFFRix5REFBeUQ7WUFDekQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ3hELENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLHVEQUF1RCxFQUFFLEdBQUcsRUFBRTtZQUMvRCxVQUFVO1lBQ1YsY0FBYyxDQUFDLG1CQUFtQixHQUFHLGNBQWMsQ0FBQTtZQUNuRCxNQUFNLHNCQUFzQixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtZQUN0QyxNQUFNLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxFQUFFLGtCQUFrQixFQUFFLHNCQUFzQixFQUFFLENBQUMsQ0FBQTtZQUVoRixNQUFNO1lBQ04sSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFdEMsZ0JBQWdCO1lBQ2hCLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUU1QyxvQkFBb0I7WUFDcEIsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENBQUE7WUFDL0QsTUFBTSxDQUFDLHNCQUFzQixDQUFDLENBQUMsb0JBQW9CLENBQUMsYUFBYSxDQUFDLENBQUE7UUFDcEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZDQUE2QztBQUMvQyxDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRGF0YVNvdXJjZU5vZGVUeXBlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9kYXRhLXNvdXJjZS90eXBlcydcbmltcG9ydCB0eXBlIHsgRGF0YVNvdXJjZU5vdGlvbldvcmtzcGFjZSwgTm90aW9uUGFnZSB9IGZyb20gJ0AvbW9kZWxzL2NvbW1vbidcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBWYXJLaW5kVHlwZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvbm9kZXMvX2Jhc2UvdHlwZXMnXG5pbXBvcnQgT25saW5lRG9jdW1lbnRzIGZyb20gJy4vaW5kZXgnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBNb2R1bGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTm90ZTogcmVhY3QtaTE4bmV4dCB1c2VzIGdsb2JhbCBtb2NrIGZyb20gd2ViL3ZpdGVzdC5zZXR1cC50c1xuXG4vLyBNb2NrIHVzZURvY0xpbmsgLSBjb250ZXh0IGhvb2sgcmVxdWlyZXMgbW9ja2luZ1xuY29uc3QgbW9ja0RvY0xpbmsgPSB2aS5mbigocGF0aD86IHN0cmluZykgPT4gYGh0dHBzOi8vZG9jcy5leGFtcGxlLmNvbSR7cGF0aCB8fCAnJ31gKVxudmkubW9jaygnQC9jb250ZXh0L2kxOG4nLCAoKSA9PiAoe1xuICB1c2VEb2NMaW5rOiAoKSA9PiBtb2NrRG9jTGluayxcbn0pKVxuXG4vLyBNb2NrIGRhdGFzZXQtZGV0YWlsIGNvbnRleHQgLSBjb250ZXh0IHByb3ZpZGVyIHJlcXVpcmVzIG1vY2tpbmdcbmxldCBtb2NrUGlwZWxpbmVJZCA9ICdwaXBlbGluZS0xMjMnXG52aS5tb2NrKCdAL2NvbnRleHQvZGF0YXNldC1kZXRhaWwnLCAoKSA9PiAoe1xuICB1c2VEYXRhc2V0RGV0YWlsQ29udGV4dFdpdGhTZWxlY3RvcjogKHNlbGVjdG9yOiAoczogYW55KSA9PiBhbnkpID0+IHNlbGVjdG9yKHsgZGF0YXNldDogeyBwaXBlbGluZV9pZDogbW9ja1BpcGVsaW5lSWQgfSB9KSxcbn0pKVxuXG4vLyBNb2NrIG1vZGFsIGNvbnRleHQgLSBjb250ZXh0IHByb3ZpZGVyIHJlcXVpcmVzIG1vY2tpbmdcbmNvbnN0IG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCA9IHZpLmZuKClcbnZpLm1vY2soJ0AvY29udGV4dC9tb2RhbC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlTW9kYWxDb250ZXh0U2VsZWN0b3I6IChzZWxlY3RvcjogKHM6IGFueSkgPT4gYW55KSA9PiBzZWxlY3Rvcih7IHNldFNob3dBY2NvdW50U2V0dGluZ01vZGFsOiBtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwgfSksXG59KSlcblxuLy8gTW9jayBzc2VQb3N0IC0gQVBJIHNlcnZpY2UgcmVxdWlyZXMgbW9ja2luZ1xuY29uc3QgeyBtb2NrU3NlUG9zdCB9ID0gdmkuaG9pc3RlZCgoKSA9PiAoe1xuICBtb2NrU3NlUG9zdDogdmkuZm4oKSxcbn0pKVxuXG52aS5tb2NrKCdAL3NlcnZpY2UvYmFzZScsICgpID0+ICh7XG4gIHNzZVBvc3Q6IG1vY2tTc2VQb3N0LFxufSkpXG5cbi8vIE1vY2sgVG9hc3Qubm90aWZ5IC0gc3RhdGljIG1ldGhvZCB0aGF0IG1hbmlwdWxhdGVzIERPTSwgbmVlZHMgbW9ja2luZyB0byB2ZXJpZnkgY2FsbHNcbmNvbnN0IHsgbW9ja1RvYXN0Tm90aWZ5IH0gPSB2aS5ob2lzdGVkKCgpID0+ICh7XG4gIG1vY2tUb2FzdE5vdGlmeTogdmkuZm4oKSxcbn0pKVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiB7XG4gICAgbm90aWZ5OiBtb2NrVG9hc3ROb3RpZnksXG4gIH0sXG59KSlcblxuLy8gTW9jayB1c2VHZXREYXRhU291cmNlQXV0aCAtIEFQSSBzZXJ2aWNlIGhvb2sgcmVxdWlyZXMgbW9ja2luZ1xuY29uc3QgeyBtb2NrVXNlR2V0RGF0YVNvdXJjZUF1dGggfSA9IHZpLmhvaXN0ZWQoKCkgPT4gKHtcbiAgbW9ja1VzZUdldERhdGFTb3VyY2VBdXRoOiB2aS5mbigpLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtZGF0YXNvdXJjZScsICgpID0+ICh7XG4gIHVzZUdldERhdGFTb3VyY2VBdXRoOiBtb2NrVXNlR2V0RGF0YVNvdXJjZUF1dGgsXG59KSlcblxuLy8gTm90ZTogenVzdGFuZC9yZWFjdC9zaGFsbG93IHVzZVNoYWxsb3cgaXMgaW1wb3J0ZWQgZGlyZWN0bHkgKHNpbXBsZSB1dGlsaXR5IGZ1bmN0aW9uKVxuXG4vLyBNb2NrIHN0b3JlXG5jb25zdCBtb2NrU3RvcmVTdGF0ZSA9IHtcbiAgZG9jdW1lbnRzRGF0YTogW10gYXMgRGF0YVNvdXJjZU5vdGlvbldvcmtzcGFjZVtdLFxuICBzZWFyY2hWYWx1ZTogJycsXG4gIHNlbGVjdGVkUGFnZXNJZDogbmV3IFNldDxzdHJpbmc+KCksXG4gIGN1cnJlbnRDcmVkZW50aWFsSWQ6ICcnLFxuICBzZXREb2N1bWVudHNEYXRhOiB2aS5mbigpLFxuICBzZXRTZWFyY2hWYWx1ZTogdmkuZm4oKSxcbiAgc2V0U2VsZWN0ZWRQYWdlc0lkOiB2aS5mbigpLFxuICBzZXRPbmxpbmVEb2N1bWVudHM6IHZpLmZuKCksXG4gIHNldEN1cnJlbnREb2N1bWVudDogdmkuZm4oKSxcbn1cblxuY29uc3QgbW9ja0dldFN0YXRlID0gdmkuZm4oKCkgPT4gbW9ja1N0b3JlU3RhdGUpXG5jb25zdCBtb2NrRGF0YVNvdXJjZVN0b3JlID0geyBnZXRTdGF0ZTogbW9ja0dldFN0YXRlIH1cblxudmkubW9jaygnLi4vc3RvcmUnLCAoKSA9PiAoe1xuICB1c2VEYXRhU291cmNlU3RvcmVXaXRoU2VsZWN0b3I6IChzZWxlY3RvcjogKHM6IGFueSkgPT4gYW55KSA9PiBzZWxlY3Rvcihtb2NrU3RvcmVTdGF0ZSksXG4gIHVzZURhdGFTb3VyY2VTdG9yZTogKCkgPT4gbW9ja0RhdGFTb3VyY2VTdG9yZSxcbn0pKVxuXG4vLyBNb2NrIEhlYWRlciBjb21wb25lbnRcbnZpLm1vY2soJy4uL2Jhc2UvaGVhZGVyJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHByb3BzOiBhbnkpID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiaGVhZGVyXCI+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImhlYWRlci1kb2MtdGl0bGVcIj57cHJvcHMuZG9jVGl0bGV9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJoZWFkZXItZG9jLWxpbmtcIj57cHJvcHMuZG9jTGlua308L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImhlYWRlci1wbHVnaW4tbmFtZVwiPntwcm9wcy5wbHVnaW5OYW1lfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiaGVhZGVyLWNyZWRlbnRpYWwtaWRcIj57cHJvcHMuY3VycmVudENyZWRlbnRpYWxJZH08L3NwYW4+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiaGVhZGVyLWNvbmZpZy1idG5cIiBvbkNsaWNrPXtwcm9wcy5vbkNsaWNrQ29uZmlndXJhdGlvbn0+Q29uZmlndXJlPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiaGVhZGVyLWNyZWRlbnRpYWwtY2hhbmdlXCIgb25DbGljaz17KCkgPT4gcHJvcHMub25DcmVkZW50aWFsQ2hhbmdlKCduZXctY3JlZC1pZCcpfT5DaGFuZ2UgQ3JlZGVudGlhbDwvYnV0dG9uPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJoZWFkZXItY3JlZGVudGlhbHMtY291bnRcIj57cHJvcHMuY3JlZGVudGlhbHM/Lmxlbmd0aCB8fCAwfTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIFNlYXJjaElucHV0IGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL25vdGlvbi1wYWdlLXNlbGVjdG9yL3NlYXJjaC1pbnB1dCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHZhbHVlLCBvbkNoYW5nZSB9OiB7IHZhbHVlOiBzdHJpbmcsIG9uQ2hhbmdlOiAodjogc3RyaW5nKSA9PiB2b2lkIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwic2VhcmNoLWlucHV0XCI+XG4gICAgICA8aW5wdXRcbiAgICAgICAgZGF0YS10ZXN0aWQ9XCJzZWFyY2gtaW5wdXQtZmllbGRcIlxuICAgICAgICB2YWx1ZT17dmFsdWV9XG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IG9uQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgICAgcGxhY2Vob2xkZXI9XCJTZWFyY2hcIlxuICAgICAgLz5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIFBhZ2VTZWxlY3RvciBjb21wb25lbnRcbnZpLm1vY2soJy4vcGFnZS1zZWxlY3RvcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6IChwcm9wczogYW55KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInBhZ2Utc2VsZWN0b3JcIj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicGFnZS1zZWxlY3Rvci1jaGVja2VkLWNvdW50XCI+e3Byb3BzLmNoZWNrZWRJZHM/LnNpemUgfHwgMH08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInBhZ2Utc2VsZWN0b3Itc2VhcmNoLXZhbHVlXCI+e3Byb3BzLnNlYXJjaFZhbHVlfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicGFnZS1zZWxlY3Rvci1jYW4tcHJldmlld1wiPntTdHJpbmcocHJvcHMuY2FuUHJldmlldyl9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJwYWdlLXNlbGVjdG9yLW11bHRpcGxlLWNob2ljZVwiPntTdHJpbmcocHJvcHMuaXNNdWx0aXBsZUNob2ljZSl9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJwYWdlLXNlbGVjdG9yLWNyZWRlbnRpYWwtaWRcIj57cHJvcHMuY3VycmVudENyZWRlbnRpYWxJZH08L3NwYW4+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGRhdGEtdGVzdGlkPVwicGFnZS1zZWxlY3Rvci1zZWxlY3QtYnRuXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gcHJvcHMub25TZWxlY3QobmV3IFNldChbJ3BhZ2UtMScsICdwYWdlLTInXSkpfVxuICAgICAgPlxuICAgICAgICBTZWxlY3QgUGFnZXNcbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBkYXRhLXRlc3RpZD1cInBhZ2Utc2VsZWN0b3ItcHJldmlldy1idG5cIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBwcm9wcy5vblByZXZpZXc/LigncGFnZS0xJyl9XG4gICAgICA+XG4gICAgICAgIFByZXZpZXcgUGFnZVxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBUaXRsZSBjb21wb25lbnRcbnZpLm1vY2soJy4vdGl0bGUnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBuYW1lIH06IHsgbmFtZTogc3RyaW5nIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwidGl0bGVcIj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwidGl0bGUtbmFtZVwiPntuYW1lfTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgRGF0YSBCdWlsZGVyc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5jb25zdCBjcmVhdGVNb2NrTm9kZURhdGEgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxEYXRhU291cmNlTm9kZVR5cGU+KTogRGF0YVNvdXJjZU5vZGVUeXBlID0+ICh7XG4gIHRpdGxlOiAnVGVzdCBOb2RlJyxcbiAgcGx1Z2luX2lkOiAncGx1Z2luLTEyMycsXG4gIHByb3ZpZGVyX3R5cGU6ICdub3Rpb24nLFxuICBwcm92aWRlcl9uYW1lOiAnbm90aW9uLXByb3ZpZGVyJyxcbiAgZGF0YXNvdXJjZV9uYW1lOiAnbm90aW9uLWRzJyxcbiAgZGF0YXNvdXJjZV9sYWJlbDogJ05vdGlvbicsXG4gIGRhdGFzb3VyY2VfcGFyYW1ldGVyczoge30sXG4gIGRhdGFzb3VyY2VfY29uZmlndXJhdGlvbnM6IHt9LFxuICAuLi5vdmVycmlkZXMsXG59IGFzIERhdGFTb3VyY2VOb2RlVHlwZSlcblxuY29uc3QgY3JlYXRlTW9ja1BhZ2UgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxOb3Rpb25QYWdlPik6IE5vdGlvblBhZ2UgPT4gKHtcbiAgcGFnZV9pZDogJ3BhZ2UtMScsXG4gIHBhZ2VfbmFtZTogJ1Rlc3QgUGFnZScsXG4gIHBhZ2VfaWNvbjogbnVsbCxcbiAgaXNfYm91bmQ6IGZhbHNlLFxuICBwYXJlbnRfaWQ6ICdyb290JyxcbiAgdHlwZTogJ3BhZ2UnLFxuICB3b3Jrc3BhY2VfaWQ6ICd3b3Jrc3BhY2UtMScsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tXb3Jrc3BhY2UgPSAob3ZlcnJpZGVzPzogUGFydGlhbDxEYXRhU291cmNlTm90aW9uV29ya3NwYWNlPik6IERhdGFTb3VyY2VOb3Rpb25Xb3Jrc3BhY2UgPT4gKHtcbiAgd29ya3NwYWNlX2lkOiAnd29ya3NwYWNlLTEnLFxuICB3b3Jrc3BhY2VfbmFtZTogJ1Rlc3QgV29ya3NwYWNlJyxcbiAgd29ya3NwYWNlX2ljb246IG51bGwsXG4gIHBhZ2VzOiBbY3JlYXRlTW9ja1BhZ2UoKV0sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tDcmVkZW50aWFsID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8eyBpZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcgfT4pID0+ICh7XG4gIGlkOiAnY3JlZC0xJyxcbiAgbmFtZTogJ1Rlc3QgQ3JlZGVudGlhbCcsXG4gIGF2YXRhcl91cmw6ICdodHRwczovL2V4YW1wbGUuY29tL2F2YXRhci5wbmcnLFxuICBjcmVkZW50aWFsOiB7fSxcbiAgaXNfZGVmYXVsdDogZmFsc2UsXG4gIHR5cGU6ICdvYXV0aDInLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG50eXBlIE9ubGluZURvY3VtZW50c1Byb3BzID0gUmVhY3QuQ29tcG9uZW50UHJvcHM8dHlwZW9mIE9ubGluZURvY3VtZW50cz5cblxuY29uc3QgY3JlYXRlRGVmYXVsdFByb3BzID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8T25saW5lRG9jdW1lbnRzUHJvcHM+KTogT25saW5lRG9jdW1lbnRzUHJvcHMgPT4gKHtcbiAgbm9kZUlkOiAnbm9kZS0xJyxcbiAgbm9kZURhdGE6IGNyZWF0ZU1vY2tOb2RlRGF0YSgpLFxuICBvbkNyZWRlbnRpYWxDaGFuZ2U6IHZpLmZuKCksXG4gIGlzSW5QaXBlbGluZTogZmFsc2UsXG4gIHN1cHBvcnRCYXRjaFVwbG9hZDogdHJ1ZSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IFN1aXRlc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnT25saW5lRG9jdW1lbnRzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcblxuICAgIC8vIFJlc2V0IHN0b3JlIHN0YXRlXG4gICAgbW9ja1N0b3JlU3RhdGUuZG9jdW1lbnRzRGF0YSA9IFtdXG4gICAgbW9ja1N0b3JlU3RhdGUuc2VhcmNoVmFsdWUgPSAnJ1xuICAgIG1vY2tTdG9yZVN0YXRlLnNlbGVjdGVkUGFnZXNJZCA9IG5ldyBTZXQoKVxuICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnJ1xuICAgIG1vY2tTdG9yZVN0YXRlLnNldERvY3VtZW50c0RhdGEgPSB2aS5mbigpXG4gICAgbW9ja1N0b3JlU3RhdGUuc2V0U2VhcmNoVmFsdWUgPSB2aS5mbigpXG4gICAgbW9ja1N0b3JlU3RhdGUuc2V0U2VsZWN0ZWRQYWdlc0lkID0gdmkuZm4oKVxuICAgIG1vY2tTdG9yZVN0YXRlLnNldE9ubGluZURvY3VtZW50cyA9IHZpLmZuKClcbiAgICBtb2NrU3RvcmVTdGF0ZS5zZXRDdXJyZW50RG9jdW1lbnQgPSB2aS5mbigpXG5cbiAgICAvLyBSZXNldCBjb250ZXh0IHZhbHVlc1xuICAgIG1vY2tQaXBlbGluZUlkID0gJ3BpcGVsaW5lLTEyMydcbiAgICBtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwubW9ja0NsZWFyKClcblxuICAgIC8vIERlZmF1bHQgbW9jayByZXR1cm4gdmFsdWVzXG4gICAgbW9ja1VzZUdldERhdGFTb3VyY2VBdXRoLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBkYXRhOiB7IHJlc3VsdDogW2NyZWF0ZU1vY2tDcmVkZW50aWFsKCldIH0sXG4gICAgfSlcblxuICAgIG1vY2tHZXRTdGF0ZS5tb2NrUmV0dXJuVmFsdWUobW9ja1N0b3JlU3RhdGUpXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSGVhZGVyIHdpdGggY29ycmVjdCBwcm9wcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xMjMnXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG5vZGVEYXRhOiBjcmVhdGVNb2NrTm9kZURhdGEoeyBkYXRhc291cmNlX2xhYmVsOiAnTXkgTm90aW9uJyB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXItZG9jLXRpdGxlJykpLnRvSGF2ZVRleHRDb250ZW50KCdEb2NzJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1wbHVnaW4tbmFtZScpKS50b0hhdmVUZXh0Q29udGVudCgnTXkgTm90aW9uJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jcmVkZW50aWFsLWlkJykpLnRvSGF2ZVRleHRDb250ZW50KCdjcmVkLTEyMycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIExvYWRpbmcgd2hlbiBkb2N1bWVudHNEYXRhIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuZG9jdW1lbnRzRGF0YSA9IFtdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnc3RhdHVzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUGFnZVNlbGVjdG9yIHdoZW4gZG9jdW1lbnRzRGF0YSBoYXMgY29udGVudCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmRvY3VtZW50c0RhdGEgPSBbY3JlYXRlTW9ja1dvcmtzcGFjZSgpXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFnZS1zZWxlY3RvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCdzdGF0dXMnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgVGl0bGUgd2l0aCBkYXRhc291cmNlX2xhYmVsJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuZG9jdW1lbnRzRGF0YSA9IFtjcmVhdGVNb2NrV29ya3NwYWNlKCldXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG5vZGVEYXRhOiBjcmVhdGVNb2NrTm9kZURhdGEoeyBkYXRhc291cmNlX2xhYmVsOiAnTm90aW9uIEludGVncmF0aW9uJyB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0aXRsZS1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdOb3Rpb24gSW50ZWdyYXRpb24nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBTZWFyY2hJbnB1dCB3aXRoIGN1cnJlbnQgc2VhcmNoVmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5zZWFyY2hWYWx1ZSA9ICd0ZXN0IHNlYXJjaCdcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmRvY3VtZW50c0RhdGEgPSBbY3JlYXRlTW9ja1dvcmtzcGFjZSgpXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlYXJjaC1pbnB1dC1maWVsZCcpIGFzIEhUTUxJbnB1dEVsZW1lbnRcbiAgICAgIGV4cGVjdChzZWFyY2hJbnB1dC52YWx1ZSkudG9CZSgndGVzdCBzZWFyY2gnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBkZXNjcmliZSgnbm9kZUlkIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHVzZSBub2RlSWQgaW4gZGF0YXNvdXJjZU5vZGVSdW5VUkwgZm9yIG5vbi1waXBlbGluZSBtb2RlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbm9kZUlkOiAnY3VzdG9tLW5vZGUtaWQnLFxuICAgICAgICAgIGlzSW5QaXBlbGluZTogZmFsc2UsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gRWZmZWN0IHRyaWdnZXJzIHNzZVBvc3Qgd2l0aCBjb3JyZWN0IFVSTFxuICAgICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5zdHJpbmdDb250YWluaW5nKCcvbm9kZXMvY3VzdG9tLW5vZGUtaWQvcnVuJyksXG4gICAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ25vZGVEYXRhIHByb3AnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHBhc3MgZGF0YXNvdXJjZV9wYXJhbWV0ZXJzIHRvIHNzZVBvc3QnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICAgIGNvbnN0IG5vZGVEYXRhID0gY3JlYXRlTW9ja05vZGVEYXRhKHtcbiAgICAgICAgICBkYXRhc291cmNlX3BhcmFtZXRlcnM6IHtcbiAgICAgICAgICAgIHBhcmFtMTogeyB0eXBlOiBWYXJLaW5kVHlwZS5jb25zdGFudCwgdmFsdWU6ICd2YWx1ZTEnIH0sXG4gICAgICAgICAgICBwYXJhbTI6IHsgdHlwZTogVmFyS2luZFR5cGUuY29uc3RhbnQsIHZhbHVlOiAndmFsdWUyJyB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgbm9kZURhdGEgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICBleHBlY3QuYW55KFN0cmluZyksXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgYm9keTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICBpbnB1dHM6IHsgcGFyYW0xOiAndmFsdWUxJywgcGFyYW0yOiAndmFsdWUyJyB9LFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSksXG4gICAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgICApXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHBhc3MgcGx1Z2luX2lkIGFuZCBwcm92aWRlcl9uYW1lIHRvIHVzZUdldERhdGFTb3VyY2VBdXRoJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG5vZGVEYXRhID0gY3JlYXRlTW9ja05vZGVEYXRhKHtcbiAgICAgICAgICBwbHVnaW5faWQ6ICdteS1wbHVnaW4taWQnLFxuICAgICAgICAgIHByb3ZpZGVyX25hbWU6ICdteS1wcm92aWRlcicsXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgbm9kZURhdGEgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG1vY2tVc2VHZXREYXRhU291cmNlQXV0aCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHBsdWdpbklkOiAnbXktcGx1Z2luLWlkJyxcbiAgICAgICAgICBwcm92aWRlcjogJ215LXByb3ZpZGVyJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdpc0luUGlwZWxpbmUgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgdXNlIGRyYWZ0IFVSTCB3aGVuIGlzSW5QaXBlbGluZSBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IGlzSW5QaXBlbGluZTogdHJ1ZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5zdHJpbmdDb250YWluaW5nKCcvd29ya2Zsb3dzL2RyYWZ0LycpLFxuICAgICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgIClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgdXNlIHB1Ymxpc2hlZCBVUkwgd2hlbiBpc0luUGlwZWxpbmUgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNJblBpcGVsaW5lOiBmYWxzZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgIGV4cGVjdC5zdHJpbmdDb250YWluaW5nKCcvd29ya2Zsb3dzL3B1Ymxpc2hlZC8nKSxcbiAgICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgICApXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHBhc3MgY2FuUHJldmlldyBhcyBmYWxzZSB0byBQYWdlU2VsZWN0b3Igd2hlbiBpc0luUGlwZWxpbmUgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5kb2N1bWVudHNEYXRhID0gW2NyZWF0ZU1vY2tXb3Jrc3BhY2UoKV1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBpc0luUGlwZWxpbmU6IHRydWUgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFnZS1zZWxlY3Rvci1jYW4tcHJldmlldycpKS50b0hhdmVUZXh0Q29udGVudCgnZmFsc2UnKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBwYXNzIGNhblByZXZpZXcgYXMgdHJ1ZSB0byBQYWdlU2VsZWN0b3Igd2hlbiBpc0luUGlwZWxpbmUgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuZG9jdW1lbnRzRGF0YSA9IFtjcmVhdGVNb2NrV29ya3NwYWNlKCldXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgaXNJblBpcGVsaW5lOiBmYWxzZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWdlLXNlbGVjdG9yLWNhbi1wcmV2aWV3JykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdzdXBwb3J0QmF0Y2hVcGxvYWQgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcGFzcyBpc011bHRpcGxlQ2hvaWNlIGFzIHRydWUgdG8gUGFnZVNlbGVjdG9yIHdoZW4gc3VwcG9ydEJhdGNoVXBsb2FkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuZG9jdW1lbnRzRGF0YSA9IFtjcmVhdGVNb2NrV29ya3NwYWNlKCldXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc3VwcG9ydEJhdGNoVXBsb2FkOiB0cnVlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhZ2Utc2VsZWN0b3ItbXVsdGlwbGUtY2hvaWNlJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcGFzcyBpc011bHRpcGxlQ2hvaWNlIGFzIGZhbHNlIHRvIFBhZ2VTZWxlY3RvciB3aGVuIHN1cHBvcnRCYXRjaFVwbG9hZCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBtb2NrU3RvcmVTdGF0ZS5kb2N1bWVudHNEYXRhID0gW2NyZWF0ZU1vY2tXb3Jrc3BhY2UoKV1cbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBzdXBwb3J0QmF0Y2hVcGxvYWQ6IGZhbHNlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhZ2Utc2VsZWN0b3ItbXVsdGlwbGUtY2hvaWNlJykpLnRvSGF2ZVRleHRDb250ZW50KCdmYWxzZScpXG4gICAgICB9KVxuXG4gICAgICBpdC5lYWNoKFtcbiAgICAgICAgW3RydWUsICd0cnVlJ10sXG4gICAgICAgIFtmYWxzZSwgJ2ZhbHNlJ10sXG4gICAgICAgIFt1bmRlZmluZWQsICd0cnVlJ10sIC8vIERlZmF1bHQgdmFsdWVcbiAgICAgIF0pKCdzaG91bGQgaGFuZGxlIHN1cHBvcnRCYXRjaFVwbG9hZD0lcyBjb3JyZWN0bHknLCAodmFsdWUsIGV4cGVjdGVkKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1N0b3JlU3RhdGUuZG9jdW1lbnRzRGF0YSA9IFtjcmVhdGVNb2NrV29ya3NwYWNlKCldXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgc3VwcG9ydEJhdGNoVXBsb2FkOiB2YWx1ZSB9KVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWdlLXNlbGVjdG9yLW11bHRpcGxlLWNob2ljZScpKS50b0hhdmVUZXh0Q29udGVudChleHBlY3RlZClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdvbkNyZWRlbnRpYWxDaGFuZ2UgcHJvcCcsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcGFzcyBvbkNyZWRlbnRpYWxDaGFuZ2UgdG8gSGVhZGVyJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG1vY2tPbkNyZWRlbnRpYWxDaGFuZ2UgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DcmVkZW50aWFsQ2hhbmdlOiBtb2NrT25DcmVkZW50aWFsQ2hhbmdlIH0pXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jcmVkZW50aWFsLWNoYW5nZScpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja09uQ3JlZGVudGlhbENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ25ldy1jcmVkLWlkJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU2lkZSBFZmZlY3RzIGFuZCBDbGVhbnVwXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU2lkZSBFZmZlY3RzIGFuZCBDbGVhbnVwJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBnZXRPbmxpbmVEb2N1bWVudHMgd2hlbiBjdXJyZW50Q3JlZGVudGlhbElkIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU3NlUG9zdCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgZ2V0T25saW5lRG9jdW1lbnRzIHdoZW4gY3VycmVudENyZWRlbnRpYWxJZCBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnJ1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IGJvZHkgcGFyYW1ldGVycyB0byBzc2VQb3N0JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEyMydcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU3NlUG9zdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgIGV4cGVjdC5hbnkoU3RyaW5nKSxcbiAgICAgICAge1xuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIGlucHV0czoge30sXG4gICAgICAgICAgICBjcmVkZW50aWFsX2lkOiAnY3JlZC0xMjMnLFxuICAgICAgICAgICAgZGF0YXNvdXJjZV90eXBlOiAnb25saW5lX2RvY3VtZW50JyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG9uRGF0YVNvdXJjZU5vZGVDb21wbGV0ZWQgY2FsbGJhY2sgY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICBjb25zdCBtb2NrV29ya3NwYWNlcyA9IFtjcmVhdGVNb2NrV29ya3NwYWNlKCldXG5cbiAgICAgIG1vY2tTc2VQb3N0Lm1vY2tJbXBsZW1lbnRhdGlvbigodXJsLCBvcHRpb25zLCBjYWxsYmFja3MpID0+IHtcbiAgICAgICAgLy8gU2ltdWxhdGUgc3VjY2Vzc2Z1bCByZXNwb25zZVxuICAgICAgICBjYWxsYmFja3Mub25EYXRhU291cmNlTm9kZUNvbXBsZXRlZCh7XG4gICAgICAgICAgZXZlbnQ6ICdkYXRhc291cmNlX2NvbXBsZXRlZCcsXG4gICAgICAgICAgZGF0YTogbW9ja1dvcmtzcGFjZXMsXG4gICAgICAgICAgdGltZV9jb25zdW1pbmc6IDEwMDAsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldERvY3VtZW50c0RhdGEpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKG1vY2tXb3Jrc3BhY2VzKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgb25EYXRhU291cmNlTm9kZUVycm9yIGNhbGxiYWNrIGNvcnJlY3RseScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuXG4gICAgICBtb2NrU3NlUG9zdC5tb2NrSW1wbGVtZW50YXRpb24oKHVybCwgb3B0aW9ucywgY2FsbGJhY2tzKSA9PiB7XG4gICAgICAgIC8vIFNpbXVsYXRlIGVycm9yIHJlc3BvbnNlXG4gICAgICAgIGNhbGxiYWNrcy5vbkRhdGFTb3VyY2VOb2RlRXJyb3Ioe1xuICAgICAgICAgIGV2ZW50OiAnZGF0YXNvdXJjZV9lcnJvcicsXG4gICAgICAgICAgZXJyb3I6ICdTb21ldGhpbmcgd2VudCB3cm9uZycsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ1NvbWV0aGluZyB3ZW50IHdyb25nJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY29uc3RydWN0IGNvcnJlY3QgVVJMIGZvciBkcmFmdCB3b3JrZmxvdycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgbW9ja1BpcGVsaW5lSWQgPSAncGlwZWxpbmUtNDU2J1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBub2RlSWQ6ICdub2RlLTc4OScsXG4gICAgICAgIGlzSW5QaXBlbGluZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAnL3JhZy9waXBlbGluZXMvcGlwZWxpbmUtNDU2L3dvcmtmbG93cy9kcmFmdC9kYXRhc291cmNlL25vZGVzL25vZGUtNzg5L3J1bicsXG4gICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNvbnN0cnVjdCBjb3JyZWN0IFVSTCBmb3IgcHVibGlzaGVkIHdvcmtmbG93JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICBtb2NrUGlwZWxpbmVJZCA9ICdwaXBlbGluZS00NTYnXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG5vZGVJZDogJ25vZGUtNzg5JyxcbiAgICAgICAgaXNJblBpcGVsaW5lOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAnL3JhZy9waXBlbGluZXMvcGlwZWxpbmUtNDU2L3dvcmtmbG93cy9wdWJsaXNoZWQvZGF0YXNvdXJjZS9ub2Rlcy9ub2RlLTc4OS9ydW4nLFxuICAgICAgICBleHBlY3QuYW55KE9iamVjdCksXG4gICAgICAgIGV4cGVjdC5hbnkoT2JqZWN0KSxcbiAgICAgIClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDYWxsYmFjayBTdGFiaWxpdHkgYW5kIE1lbW9pemF0aW9uXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5IGFuZCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgc3RhYmxlIGhhbmRsZVNlYXJjaFZhbHVlQ2hhbmdlIHRoYXQgdXBkYXRlcyBzdG9yZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmRvY3VtZW50c0RhdGEgPSBbY3JlYXRlTW9ja1dvcmtzcGFjZSgpXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCBzZWFyY2hJbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VhcmNoLWlucHV0LWZpZWxkJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoc2VhcmNoSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnbmV3IHNlYXJjaCB2YWx1ZScgfSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRTZWFyY2hWYWx1ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ25ldyBzZWFyY2ggdmFsdWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc3RhYmxlIGhhbmRsZVNlbGVjdFBhZ2VzIHRoYXQgdXBkYXRlcyBzdG9yZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmRvY3VtZW50c0RhdGEgPSBbY3JlYXRlTW9ja1dvcmtzcGFjZSgpXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWdlLXNlbGVjdG9yLXNlbGVjdC1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0U2VsZWN0ZWRQYWdlc0lkKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRPbmxpbmVEb2N1bWVudHMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc3RhYmxlIGhhbmRsZVByZXZpZXdQYWdlIHRoYXQgdXBkYXRlcyBzdG9yZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IG1vY2tQYWdlcyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJywgcGFnZV9uYW1lOiAnUGFnZSAxJyB9KSxcbiAgICAgIF1cbiAgICAgIG1vY2tTdG9yZVN0YXRlLmRvY3VtZW50c0RhdGEgPSBbY3JlYXRlTW9ja1dvcmtzcGFjZSh7IHBhZ2VzOiBtb2NrUGFnZXMgfSldXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhZ2Utc2VsZWN0b3ItcHJldmlldy1idG4nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0Q3VycmVudERvY3VtZW50KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHN0YWJsZSBoYW5kbGVTZXR0aW5nIGNhbGxiYWNrJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXItY29uZmlnLWJ0bicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgcGF5bG9hZDogJ2RhdGEtc291cmNlJyxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTWVtb2l6YXRpb24gTG9naWMgYW5kIERlcGVuZGVuY2llc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uIExvZ2ljIGFuZCBEZXBlbmRlbmNpZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb21wdXRlIFBhZ2VzTWFwQW5kU2VsZWN0ZWRQYWdlc0lkIGNvcnJlY3RseSBmcm9tIGRvY3VtZW50c0RhdGEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrUGFnZXMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMScsIHBhZ2VfbmFtZTogJ1BhZ2UgMScgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMicsIHBhZ2VfbmFtZTogJ1BhZ2UgMicgfSksXG4gICAgICBdXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5kb2N1bWVudHNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrV29ya3NwYWNlKHsgd29ya3NwYWNlX2lkOiAnd3MtMScsIHBhZ2VzOiBtb2NrUGFnZXMgfSksXG4gICAgICBdXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gUGFnZVNlbGVjdG9yIHJlY2VpdmVzIHRoZSBwYWdlc01hcCAodmVyaWZpZWQgdmlhIG1vY2spXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWdlLXNlbGVjdG9yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZWNvbXB1dGUgUGFnZXNNYXBBbmRTZWxlY3RlZFBhZ2VzSWQgd2hlbiBkb2N1bWVudHNEYXRhIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBpbml0aWFsUGFnZXMgPSBbY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJyB9KV1cbiAgICAgIG1vY2tTdG9yZVN0YXRlLmRvY3VtZW50c0RhdGEgPSBbY3JlYXRlTW9ja1dvcmtzcGFjZSh7IHBhZ2VzOiBpbml0aWFsUGFnZXMgfSldXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3QgLSBVcGRhdGUgZG9jdW1lbnRzRGF0YVxuICAgICAgY29uc3QgbmV3UGFnZXMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMScgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMicgfSksXG4gICAgICBdXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5kb2N1bWVudHNEYXRhID0gW2NyZWF0ZU1vY2tXb3Jrc3BhY2UoeyBwYWdlczogbmV3UGFnZXMgfSldXG4gICAgICByZXJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFnZS1zZWxlY3RvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGRvY3VtZW50c0RhdGEgaW4gUGFnZXNNYXBBbmRTZWxlY3RlZFBhZ2VzSWQgY29tcHV0YXRpb24nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5kb2N1bWVudHNEYXRhID0gW11cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc2hvdyBsb2FkaW5nIGluc3RlYWQgb2YgUGFnZVNlbGVjdG9yXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnc3RhdHVzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyBhbmQgRXZlbnQgSGFuZGxlcnNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucyBhbmQgRXZlbnQgSGFuZGxlcnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc2VhcmNoIGlucHV0IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5kb2N1bWVudHNEYXRhID0gW2NyZWF0ZU1vY2tXb3Jrc3BhY2UoKV1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlYXJjaC1pbnB1dC1maWVsZCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNlYXJjaElucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ3NlYXJjaCBxdWVyeScgfSB9KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXRTZWFyY2hWYWx1ZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3NlYXJjaCBxdWVyeScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHBhZ2Ugc2VsZWN0aW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1BhZ2VzID0gW1xuICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTEnLCBwYWdlX25hbWU6ICdQYWdlIDEnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTInLCBwYWdlX25hbWU6ICdQYWdlIDInIH0pLFxuICAgICAgXVxuICAgICAgbW9ja1N0b3JlU3RhdGUuZG9jdW1lbnRzRGF0YSA9IFtjcmVhdGVNb2NrV29ya3NwYWNlKHsgcGFnZXM6IG1vY2tQYWdlcyB9KV1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncGFnZS1zZWxlY3Rvci1zZWxlY3QtYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFNlbGVjdGVkUGFnZXNJZCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0T25saW5lRG9jdW1lbnRzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFnZSBwcmV2aWV3JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja1BhZ2VzID0gW2NyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMScsIHBhZ2VfbmFtZTogJ1BhZ2UgMScgfSldXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5kb2N1bWVudHNEYXRhID0gW2NyZWF0ZU1vY2tXb3Jrc3BhY2UoeyBwYWdlczogbW9ja1BhZ2VzIH0pXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWdlLXNlbGVjdG9yLXByZXZpZXctYnRuJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldEN1cnJlbnREb2N1bWVudCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbmZpZ3VyYXRpb24gYnV0dG9uIGNsaWNrJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQWN0XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXItY29uZmlnLWJ0bicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgcGF5bG9hZDogJ2RhdGEtc291cmNlJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNyZWRlbnRpYWwgY2hhbmdlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgbW9ja09uQ3JlZGVudGlhbENoYW5nZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgb25DcmVkZW50aWFsQ2hhbmdlOiBtb2NrT25DcmVkZW50aWFsQ2hhbmdlIH0pXG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hlYWRlci1jcmVkZW50aWFsLWNoYW5nZScpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrT25DcmVkZW50aWFsQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnbmV3LWNyZWQtaWQnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEFQSSBDYWxscyBNb2NraW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQVBJIENhbGxzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBzc2VQb3N0IHdpdGggY29ycmVjdCBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICd0ZXN0LWNyZWQnXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG5vZGVEYXRhOiBjcmVhdGVNb2NrTm9kZURhdGEoe1xuICAgICAgICAgIGRhdGFzb3VyY2VfcGFyYW1ldGVyczoge1xuICAgICAgICAgICAgd29ya3NwYWNlOiB7IHR5cGU6IFZhcktpbmRUeXBlLmNvbnN0YW50LCB2YWx1ZTogJ3dzLTEyMycgfSxcbiAgICAgICAgICAgIGRhdGFiYXNlOiB7IHR5cGU6IFZhcktpbmRUeXBlLmNvbnN0YW50LCB2YWx1ZTogJ2RiLTQ1NicgfSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3QuYW55KFN0cmluZyksXG4gICAgICAgIHtcbiAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICBpbnB1dHM6IHsgd29ya3NwYWNlOiAnd3MtMTIzJywgZGF0YWJhc2U6ICdkYi00NTYnIH0sXG4gICAgICAgICAgICBjcmVkZW50aWFsX2lkOiAndGVzdC1jcmVkJyxcbiAgICAgICAgICAgIGRhdGFzb3VyY2VfdHlwZTogJ29ubGluZV9kb2N1bWVudCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgIG9uRGF0YVNvdXJjZU5vZGVDb21wbGV0ZWQ6IGV4cGVjdC5hbnkoRnVuY3Rpb24pLFxuICAgICAgICAgIG9uRGF0YVNvdXJjZU5vZGVFcnJvcjogZXhwZWN0LmFueShGdW5jdGlvbiksXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzdWNjZXNzZnVsIEFQSSByZXNwb25zZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgY29uc3QgbW9ja0RhdGEgPSBbY3JlYXRlTW9ja1dvcmtzcGFjZSgpXVxuXG4gICAgICBtb2NrU3NlUG9zdC5tb2NrSW1wbGVtZW50YXRpb24oKHVybCwgb3B0aW9ucywgY2FsbGJhY2tzKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrcy5vbkRhdGFTb3VyY2VOb2RlQ29tcGxldGVkKHtcbiAgICAgICAgICBldmVudDogJ2RhdGFzb3VyY2VfY29tcGxldGVkJyxcbiAgICAgICAgICBkYXRhOiBtb2NrRGF0YSxcbiAgICAgICAgICB0aW1lX2NvbnN1bWluZzogNTAwLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrU3RvcmVTdGF0ZS5zZXREb2N1bWVudHNEYXRhKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChtb2NrRGF0YSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIEFQSSBlcnJvciByZXNwb25zZScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuXG4gICAgICBtb2NrU3NlUG9zdC5tb2NrSW1wbGVtZW50YXRpb24oKHVybCwgb3B0aW9ucywgY2FsbGJhY2tzKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrcy5vbkRhdGFTb3VyY2VOb2RlRXJyb3Ioe1xuICAgICAgICAgIGV2ZW50OiAnZGF0YXNvdXJjZV9lcnJvcicsXG4gICAgICAgICAgZXJyb3I6ICdBUEkgRXJyb3IgTWVzc2FnZScsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ0FQSSBFcnJvciBNZXNzYWdlJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIHVzZUdldERhdGFTb3VyY2VBdXRoIHdpdGggY29ycmVjdCBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgbm9kZURhdGEgPSBjcmVhdGVNb2NrTm9kZURhdGEoe1xuICAgICAgICBwbHVnaW5faWQ6ICdub3Rpb24tcGx1Z2luJyxcbiAgICAgICAgcHJvdmlkZXJfbmFtZTogJ25vdGlvbi1wcm92aWRlcicsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBub2RlRGF0YSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tVc2VHZXREYXRhU291cmNlQXV0aCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICBwbHVnaW5JZDogJ25vdGlvbi1wbHVnaW4nLFxuICAgICAgICBwcm92aWRlcjogJ25vdGlvbi1wcm92aWRlcicsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgY3JlZGVudGlhbHMgZnJvbSB1c2VHZXREYXRhU291cmNlQXV0aCB0byBIZWFkZXInLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBtb2NrQ3JlZGVudGlhbHMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tDcmVkZW50aWFsKHsgaWQ6ICdjcmVkLTEnLCBuYW1lOiAnQ3JlZGVudGlhbCAxJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0NyZWRlbnRpYWwoeyBpZDogJ2NyZWQtMicsIG5hbWU6ICdDcmVkZW50aWFsIDInIH0pLFxuICAgICAgXVxuICAgICAgbW9ja1VzZUdldERhdGFTb3VyY2VBdXRoLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IHsgcmVzdWx0OiBtb2NrQ3JlZGVudGlhbHMgfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdoZWFkZXItY3JlZGVudGlhbHMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgYW5kIEVycm9yIEhhbmRsaW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcyBhbmQgRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgY3JlZGVudGlhbHMgYXJyYXknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVXNlR2V0RGF0YVNvdXJjZUF1dGgubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogeyByZXN1bHQ6IFtdIH0sXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLWNyZWRlbnRpYWxzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGRhdGFTb3VyY2VBdXRoIHJlc3VsdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVc2VHZXREYXRhU291cmNlQXV0aC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiB7IHJlc3VsdDogdW5kZWZpbmVkIH0sXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLWNyZWRlbnRpYWxzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBkYXRhU291cmNlQXV0aCBkYXRhJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1VzZUdldERhdGFTb3VyY2VBdXRoLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IG51bGwsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLWNyZWRlbnRpYWxzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZG9jdW1lbnRzRGF0YSB3aXRoIGVtcHR5IHBhZ2VzIGFycmF5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuZG9jdW1lbnRzRGF0YSA9IFtjcmVhdGVNb2NrV29ya3NwYWNlKHsgcGFnZXM6IFtdIH0pXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFnZS1zZWxlY3RvcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBkb2N1bWVudHNEYXRhIGluIHVzZU1lbW8gKGxpbmUgNTkgYnJhbmNoKScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2UgLSBTZXQgZG9jdW1lbnRzRGF0YSB0byB1bmRlZmluZWQgdG8gdGVzdCB0aGUgfHwgW10gZmFsbGJhY2tcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmRvY3VtZW50c0RhdGEgPSB1bmRlZmluZWQgYXMgdW5rbm93biBhcyBEYXRhU291cmNlTm90aW9uV29ya3NwYWNlW11cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc2hvdyBsb2FkaW5nIHdoZW4gZG9jdW1lbnRzRGF0YSBpcyB1bmRlZmluZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdzdGF0dXMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgZGF0YXNvdXJjZV9wYXJhbWV0ZXJzIChsaW5lIDc5IGJyYW5jaCknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gU2V0IGRhdGFzb3VyY2VfcGFyYW1ldGVycyB0byB1bmRlZmluZWQgdG8gdGVzdCB0aGUgfHwge30gZmFsbGJhY2tcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgY29uc3Qgbm9kZURhdGEgPSBjcmVhdGVNb2NrTm9kZURhdGEoKVxuICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciAtIFRlc3RpbmcgdW5kZWZpbmVkIGNhc2UgZm9yIGJyYW5jaCBjb3ZlcmFnZVxuICAgICAgbm9kZURhdGEuZGF0YXNvdXJjZV9wYXJhbWV0ZXJzID0gdW5kZWZpbmVkXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG5vZGVEYXRhIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gc3NlUG9zdCBzaG91bGQgYmUgY2FsbGVkIHdpdGggZW1wdHkgaW5wdXRzXG4gICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICBleHBlY3QuYW55KFN0cmluZyksXG4gICAgICAgIGV4cGVjdC5vYmplY3RDb250YWluaW5nKHtcbiAgICAgICAgICBib2R5OiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICBpbnB1dHM6IHt9LFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkYXRhc291cmNlX3BhcmFtZXRlcnMgdmFsdWUgd2l0aG91dCB2YWx1ZSBwcm9wZXJ0eSAobGluZSA4MCBlbHNlIGJyYW5jaCknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gVGVzdCB0aGUgZWxzZSBicmFuY2ggd2hlcmUgdmFsdWUgaXMgbm90IGFuIG9iamVjdCB3aXRoICd2YWx1ZScgcHJvcGVydHlcbiAgICAgIC8vIFRoaXMgdGVzdHM6IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgJiYgJ3ZhbHVlJyBpbiB2YWx1ZSA/IHZhbHVlLnZhbHVlIDogdmFsdWVcbiAgICAgIC8vIFRoZSBlbHNlIGJyYW5jaCAoOiB2YWx1ZSkgaXMgZXhlY3V0ZWQgd2hlbiB2YWx1ZSBpcyBhIHByaW1pdGl2ZSBvciBvYmplY3Qgd2l0aG91dCAndmFsdWUnIGtleVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdjcmVkLTEnXG4gICAgICBjb25zdCBub2RlRGF0YSA9IGNyZWF0ZU1vY2tOb2RlRGF0YSh7XG4gICAgICAgIGRhdGFzb3VyY2VfcGFyYW1ldGVyczoge1xuICAgICAgICAgIC8vIE9iamVjdCB3aXRob3V0ICd2YWx1ZScga2V5IC0gc2hvdWxkIHVzZSB0aGUgb2JqZWN0IGl0c2VsZlxuICAgICAgICAgIG9ialdpdGhvdXRWYWx1ZTogeyB0eXBlOiBWYXJLaW5kVHlwZS5jb25zdGFudCwgb3RoZXI6ICdkYXRhJyB9IGFzIGFueSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG5vZGVEYXRhIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gVGhlIG9iamVjdCB3aXRob3V0ICd2YWx1ZScgcHJvcGVydHkgc2hvdWxkIGJlIHBhc3NlZCBhcy1pc1xuICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0LmFueShTdHJpbmcpLFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgYm9keTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgaW5wdXRzOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgIG9ialdpdGhvdXRWYWx1ZTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyB0eXBlOiBWYXJLaW5kVHlwZS5jb25zdGFudCwgb3RoZXI6ICdkYXRhJyB9KSxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtdWx0aXBsZSB3b3Jrc3BhY2VzIGluIGRvY3VtZW50c0RhdGEnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5kb2N1bWVudHNEYXRhID0gW1xuICAgICAgICBjcmVhdGVNb2NrV29ya3NwYWNlKHsgd29ya3NwYWNlX2lkOiAnd3MtMScsIHBhZ2VzOiBbY3JlYXRlTW9ja1BhZ2UoeyBwYWdlX2lkOiAncGFnZS0xJyB9KV0gfSksXG4gICAgICAgIGNyZWF0ZU1vY2tXb3Jrc3BhY2UoeyB3b3Jrc3BhY2VfaWQ6ICd3cy0yJywgcGFnZXM6IFtjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTInIH0pXSB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhZ2Utc2VsZWN0b3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gc2VhcmNoVmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5kb2N1bWVudHNEYXRhID0gW2NyZWF0ZU1vY2tXb3Jrc3BhY2UoKV1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlYXJjaC1pbnB1dC1maWVsZCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNlYXJjaElucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ3Rlc3Q8c2NyaXB0PmFsZXJ0KFwieHNzXCIpPC9zY3JpcHQ+JyB9IH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFNlYXJjaFZhbHVlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgndGVzdDxzY3JpcHQ+YWxlcnQoXCJ4c3NcIik8L3NjcmlwdD4nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmljb2RlIGNoYXJhY3RlcnMgaW4gc2VhcmNoVmFsdWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5kb2N1bWVudHNEYXRhID0gW2NyZWF0ZU1vY2tXb3Jrc3BhY2UoKV1cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3Qgc2VhcmNoSW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlYXJjaC1pbnB1dC1maWVsZCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKHNlYXJjaElucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ+a1i+ivleaQnOe0oiDwn5SNJyB9IH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFNlYXJjaFZhbHVlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgn5rWL6K+V5pCc57SiIPCflI0nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcgY3VycmVudENyZWRlbnRpYWxJZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnJ1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNvbXBsZXggZGF0YXNvdXJjZV9wYXJhbWV0ZXJzIHdpdGggbmVzdGVkIG9iamVjdHMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcbiAgICAgIGNvbnN0IG5vZGVEYXRhID0gY3JlYXRlTW9ja05vZGVEYXRhKHtcbiAgICAgICAgZGF0YXNvdXJjZV9wYXJhbWV0ZXJzOiB7XG4gICAgICAgICAgc2ltcGxlOiB7IHR5cGU6IFZhcktpbmRUeXBlLmNvbnN0YW50LCB2YWx1ZTogJ3ZhbHVlJyB9LFxuICAgICAgICAgIG5lc3RlZDogeyB0eXBlOiBWYXJLaW5kVHlwZS5jb25zdGFudCwgdmFsdWU6ICduZXN0ZWQtdmFsdWUnIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBub2RlRGF0YSB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8T25saW5lRG9jdW1lbnRzIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgZXhwZWN0LmFueShTdHJpbmcpLFxuICAgICAgICBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgYm9keTogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgaW5wdXRzOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgIHNpbXBsZTogJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgbmVzdGVkOiAnbmVzdGVkLXZhbHVlJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pLFxuICAgICAgICB9KSxcbiAgICAgICAgZXhwZWN0LmFueShPYmplY3QpLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgcGlwZWxpbmVJZCBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1BpcGVsaW5lSWQgPSB1bmRlZmluZWQgYXMgYW55XG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc3RpbGwgY2FsbCBzc2VQb3N0IHdpdGggdW5kZWZpbmVkIGluIFVSTFxuICAgICAgZXhwZWN0KG1vY2tTc2VQb3N0KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBBbGwgUHJvcCBWYXJpYXRpb25zXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0LmVhY2goW1xuICAgICAgW3sgaXNJblBpcGVsaW5lOiB0cnVlLCBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHRydWUgfV0sXG4gICAgICBbeyBpc0luUGlwZWxpbmU6IHRydWUsIHN1cHBvcnRCYXRjaFVwbG9hZDogZmFsc2UgfV0sXG4gICAgICBbeyBpc0luUGlwZWxpbmU6IGZhbHNlLCBzdXBwb3J0QmF0Y2hVcGxvYWQ6IHRydWUgfV0sXG4gICAgICBbeyBpc0luUGlwZWxpbmU6IGZhbHNlLCBzdXBwb3J0QmF0Y2hVcGxvYWQ6IGZhbHNlIH1dLFxuICAgIF0pKCdzaG91bGQgcmVuZGVyIGNvcnJlY3RseSB3aXRoIHByb3BzICVvJywgKHByb3BWYXJpYXRpb24pID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmRvY3VtZW50c0RhdGEgPSBbY3JlYXRlTW9ja1dvcmtzcGFjZSgpXVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMocHJvcFZhcmlhdGlvbilcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhZ2Utc2VsZWN0b3InKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFnZS1zZWxlY3Rvci1jYW4tcHJldmlldycpKS50b0hhdmVUZXh0Q29udGVudChcbiAgICAgICAgU3RyaW5nKCFwcm9wVmFyaWF0aW9uLmlzSW5QaXBlbGluZSksXG4gICAgICApXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWdlLXNlbGVjdG9yLW11bHRpcGxlLWNob2ljZScpKS50b0hhdmVUZXh0Q29udGVudChcbiAgICAgICAgU3RyaW5nKHByb3BWYXJpYXRpb24uc3VwcG9ydEJhdGNoVXBsb2FkKSxcbiAgICAgIClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgZGVmYXVsdCB2YWx1ZXMgZm9yIG9wdGlvbmFsIHByb3BzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuZG9jdW1lbnRzRGF0YSA9IFtjcmVhdGVNb2NrV29ya3NwYWNlKCldXG4gICAgICBjb25zdCBwcm9wczogT25saW5lRG9jdW1lbnRzUHJvcHMgPSB7XG4gICAgICAgIG5vZGVJZDogJ25vZGUtMScsXG4gICAgICAgIG5vZGVEYXRhOiBjcmVhdGVNb2NrTm9kZURhdGEoKSxcbiAgICAgICAgb25DcmVkZW50aWFsQ2hhbmdlOiB2aS5mbigpLFxuICAgICAgICAvLyBpc0luUGlwZWxpbmUgYW5kIHN1cHBvcnRCYXRjaFVwbG9hZCBhcmUgbm90IHByb3ZpZGVkXG4gICAgICB9XG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gRGVmYXVsdCB2YWx1ZXM6IGlzSW5QaXBlbGluZSA9IGZhbHNlLCBzdXBwb3J0QmF0Y2hVcGxvYWQgPSB0cnVlXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWdlLXNlbGVjdG9yLWNhbi1wcmV2aWV3JykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhZ2Utc2VsZWN0b3ItbXVsdGlwbGUtY2hvaWNlJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29tcGxldGUgZnVsbCB3b3JrZmxvdzogbG9hZCBkYXRhIC0+IHNlYXJjaCAtPiBzZWxlY3QgLT4gcHJldmlldycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tTdG9yZVN0YXRlLmN1cnJlbnRDcmVkZW50aWFsSWQgPSAnY3JlZC0xJ1xuICAgICAgY29uc3QgbW9ja1BhZ2VzID0gW1xuICAgICAgICBjcmVhdGVNb2NrUGFnZSh7IHBhZ2VfaWQ6ICdwYWdlLTEnLCBwYWdlX25hbWU6ICdUZXN0IFBhZ2UgMScgfSksXG4gICAgICAgIGNyZWF0ZU1vY2tQYWdlKHsgcGFnZV9pZDogJ3BhZ2UtMicsIHBhZ2VfbmFtZTogJ1Rlc3QgUGFnZSAyJyB9KSxcbiAgICAgIF1cbiAgICAgIGNvbnN0IG1vY2tXb3Jrc3BhY2UgPSBjcmVhdGVNb2NrV29ya3NwYWNlKHsgcGFnZXM6IG1vY2tQYWdlcyB9KVxuXG4gICAgICBtb2NrU3NlUG9zdC5tb2NrSW1wbGVtZW50YXRpb24oKHVybCwgb3B0aW9ucywgY2FsbGJhY2tzKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrcy5vbkRhdGFTb3VyY2VOb2RlQ29tcGxldGVkKHtcbiAgICAgICAgICBldmVudDogJ2RhdGFzb3VyY2VfY29tcGxldGVkJyxcbiAgICAgICAgICBkYXRhOiBbbW9ja1dvcmtzcGFjZV0sXG4gICAgICAgICAgdGltZV9jb25zdW1pbmc6IDEwMCxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIFVwZGF0ZSBzdG9yZSBzdGF0ZSBhZnRlciBBUEkgY2FsbFxuICAgICAgbW9ja1N0b3JlU3RhdGUuZG9jdW1lbnRzRGF0YSA9IFttb2NrV29ya3NwYWNlXVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBEYXRhIGxvYWRlZCBhbmQgUGFnZVNlbGVjdG9yIHNob3duXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldERvY3VtZW50c0RhdGEpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gQWN0IC0gU2VhcmNoXG4gICAgICBjb25zdCBzZWFyY2hJbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VhcmNoLWlucHV0LWZpZWxkJylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2Uoc2VhcmNoSW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnVGVzdCcgfSB9KVxuICAgICAgZXhwZWN0KG1vY2tTdG9yZVN0YXRlLnNldFNlYXJjaFZhbHVlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnVGVzdCcpXG5cbiAgICAgIC8vIEFjdCAtIFNlbGVjdCBwYWdlc1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncGFnZS1zZWxlY3Rvci1zZWxlY3QtYnRuJykpXG4gICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0U2VsZWN0ZWRQYWdlc0lkKS50b0hhdmVCZWVuQ2FsbGVkKClcblxuICAgICAgLy8gQWN0IC0gUHJldmlldyBwYWdlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWdlLXNlbGVjdG9yLXByZXZpZXctYnRuJykpXG4gICAgICBleHBlY3QobW9ja1N0b3JlU3RhdGUuc2V0Q3VycmVudERvY3VtZW50KS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZXJyb3IgZmxvdyBjb3JyZWN0bHknLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrU3RvcmVTdGF0ZS5jdXJyZW50Q3JlZGVudGlhbElkID0gJ2NyZWQtMSdcblxuICAgICAgbW9ja1NzZVBvc3QubW9ja0ltcGxlbWVudGF0aW9uKCh1cmwsIG9wdGlvbnMsIGNhbGxiYWNrcykgPT4ge1xuICAgICAgICBjYWxsYmFja3Mub25EYXRhU291cmNlTm9kZUVycm9yKHtcbiAgICAgICAgICBldmVudDogJ2RhdGFzb3VyY2VfZXJyb3InLFxuICAgICAgICAgIGVycm9yOiAnRmFpbGVkIHRvIGZldGNoIGRvY3VtZW50cycsXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxPbmxpbmVEb2N1bWVudHMgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgICAgbWVzc2FnZTogJ0ZhaWxlZCB0byBmZXRjaCBkb2N1bWVudHMnLFxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgLy8gU2hvdWxkIHN0aWxsIHNob3cgbG9hZGluZyBzaW5jZSBkb2N1bWVudHNEYXRhIGlzIGVtcHR5XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnc3RhdHVzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY3JlZGVudGlhbCBjaGFuZ2UgYW5kIHJlZmV0Y2ggZG9jdW1lbnRzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja1N0b3JlU3RhdGUuY3VycmVudENyZWRlbnRpYWxJZCA9ICdpbml0aWFsLWNyZWQnXG4gICAgICBjb25zdCBtb2NrT25DcmVkZW50aWFsQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBvbkNyZWRlbnRpYWxDaGFuZ2U6IG1vY2tPbkNyZWRlbnRpYWxDaGFuZ2UgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPE9ubGluZURvY3VtZW50cyB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBJbml0aWFsIGZldGNoXG4gICAgICBleHBlY3QobW9ja1NzZVBvc3QpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuXG4gICAgICAvLyBDaGFuZ2UgY3JlZGVudGlhbFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaGVhZGVyLWNyZWRlbnRpYWwtY2hhbmdlJykpXG4gICAgICBleHBlY3QobW9ja09uQ3JlZGVudGlhbENoYW5nZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ25ldy1jcmVkLWlkJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxufSlcbiJdfQ==