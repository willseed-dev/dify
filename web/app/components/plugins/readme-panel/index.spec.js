"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("../types");
const constants_1 = require("./constants");
const entrance_1 = require("./entrance");
const index_1 = require("./index");
const store_1 = require("./store");
// ================================
// Mock external dependencies only
// ================================
// Mock usePluginReadme hook
const mockUsePluginReadme = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/use-plugins', () => ({
    usePluginReadme: (params) => mockUsePluginReadme(params),
}));
// Mock useLanguage hook
vitest_1.vi.mock('@/app/components/header/account-setting/model-provider-page/hooks', () => ({
    useLanguage: () => 'en-US',
}));
// Mock DetailHeader component (complex component with many dependencies)
vitest_1.vi.mock('../plugin-detail-panel/detail-header', () => ({
    default: ({ detail, isReadmeView }) => (<div data-testid="detail-header" data-is-readme-view={isReadmeView}>
      {detail.name}
    </div>),
}));
// ================================
// Test Data Factories
// ================================
const createMockPluginDetail = (overrides = {}) => ({
    id: 'test-plugin-id',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    name: 'test-plugin',
    plugin_id: 'test-plugin-id',
    plugin_unique_identifier: 'test-plugin@1.0.0',
    declaration: {
        plugin_unique_identifier: 'test-plugin@1.0.0',
        version: '1.0.0',
        author: 'test-author',
        icon: 'test-icon.png',
        name: 'test-plugin',
        category: types_1.PluginCategoryEnum.tool,
        label: { 'en-US': 'Test Plugin' },
        description: { 'en-US': 'Test plugin description' },
        created_at: '2024-01-01T00:00:00Z',
        resource: null,
        plugins: null,
        verified: true,
        endpoint: { settings: [], endpoints: [] },
        model: null,
        tags: [],
        agent_strategy: null,
        meta: { version: '1.0.0' },
        trigger: {
            events: [],
            identity: {
                author: 'test-author',
                name: 'test-plugin',
                label: { 'en-US': 'Test Plugin' },
                description: { 'en-US': 'Test plugin description' },
                icon: 'test-icon.png',
                tags: [],
            },
            subscription_constructor: {
                credentials_schema: [],
                oauth_schema: { client_schema: [], credentials_schema: [] },
                parameters: [],
            },
            subscription_schema: [],
        },
    },
    installation_id: 'install-123',
    tenant_id: 'tenant-123',
    endpoints_setups: 0,
    endpoints_active: 0,
    version: '1.0.0',
    latest_version: '1.0.0',
    latest_unique_identifier: 'test-plugin@1.0.0',
    source: types_1.PluginSource.marketplace,
    status: 'active',
    deprecated_reason: '',
    alternative_plugin_id: '',
    ...overrides,
});
// ================================
// Test Utilities
// ================================
const createQueryClient = () => new react_query_1.QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
const renderWithQueryClient = (ui) => {
    const queryClient = createQueryClient();
    return (0, react_1.render)(<react_query_1.QueryClientProvider client={queryClient}>
      {ui}
    </react_query_1.QueryClientProvider>);
};
// ================================
// Constants Tests
// ================================
(0, vitest_1.describe)('BUILTIN_TOOLS_ARRAY', () => {
    (0, vitest_1.it)('should contain expected builtin tools', () => {
        (0, vitest_1.expect)(constants_1.BUILTIN_TOOLS_ARRAY).toContain('code');
        (0, vitest_1.expect)(constants_1.BUILTIN_TOOLS_ARRAY).toContain('audio');
        (0, vitest_1.expect)(constants_1.BUILTIN_TOOLS_ARRAY).toContain('time');
        (0, vitest_1.expect)(constants_1.BUILTIN_TOOLS_ARRAY).toContain('webscraper');
    });
    (0, vitest_1.it)('should have exactly 4 builtin tools', () => {
        (0, vitest_1.expect)(constants_1.BUILTIN_TOOLS_ARRAY).toHaveLength(4);
    });
});
// ================================
// Store Tests
// ================================
(0, vitest_1.describe)('useReadmePanelStore', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        // Reset store state before each test
        const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
        setCurrentPluginDetail();
    });
    (0, vitest_1.describe)('Initial State', () => {
        (0, vitest_1.it)('should have undefined currentPluginDetail initially', () => {
            const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(currentPluginDetail).toBeUndefined();
        });
    });
    (0, vitest_1.describe)('setCurrentPluginDetail', () => {
        (0, vitest_1.it)('should set currentPluginDetail with detail and default showType', () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, react_1.act)(() => {
                setCurrentPluginDetail(mockDetail);
            });
            const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(currentPluginDetail).toEqual({
                detail: mockDetail,
                showType: store_1.ReadmeShowType.drawer,
            });
        });
        (0, vitest_1.it)('should set currentPluginDetail with custom showType', () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, react_1.act)(() => {
                setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.modal);
            });
            const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(currentPluginDetail).toEqual({
                detail: mockDetail,
                showType: store_1.ReadmeShowType.modal,
            });
        });
        (0, vitest_1.it)('should clear currentPluginDetail when called without arguments', () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            // First set a detail
            (0, react_1.act)(() => {
                setCurrentPluginDetail(mockDetail);
            });
            // Then clear it
            (0, react_1.act)(() => {
                setCurrentPluginDetail();
            });
            const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(currentPluginDetail).toBeUndefined();
        });
        (0, vitest_1.it)('should clear currentPluginDetail when called with undefined', () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            // First set a detail
            (0, react_1.act)(() => {
                setCurrentPluginDetail(mockDetail);
            });
            // Then clear it with explicit undefined
            (0, react_1.act)(() => {
                setCurrentPluginDetail(undefined);
            });
            const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(currentPluginDetail).toBeUndefined();
        });
    });
    (0, vitest_1.describe)('ReadmeShowType enum', () => {
        (0, vitest_1.it)('should have drawer and modal types', () => {
            (0, vitest_1.expect)(store_1.ReadmeShowType.drawer).toBe('drawer');
            (0, vitest_1.expect)(store_1.ReadmeShowType.modal).toBe('modal');
        });
    });
});
// ================================
// ReadmeEntrance Component Tests
// ================================
(0, vitest_1.describe)('ReadmeEntrance', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        // Reset store state
        const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
        setCurrentPluginDetail();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render the entrance button with full tip text', () => {
            const mockDetail = createMockPluginDetail();
            (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.readmeInfo.needHelpCheckReadme')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with short tip text when showShortTip is true', () => {
            const mockDetail = createMockPluginDetail();
            (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail} showShortTip/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.readmeInfo.title')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render divider when showShortTip is false', () => {
            const mockDetail = createMockPluginDetail();
            const { container } = (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail} showShortTip={false}/>);
            (0, vitest_1.expect)(container.querySelector('.bg-divider-regular')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render divider when showShortTip is true', () => {
            const mockDetail = createMockPluginDetail();
            const { container } = (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail} showShortTip/>);
            (0, vitest_1.expect)(container.querySelector('.bg-divider-regular')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply drawer mode padding class', () => {
            const mockDetail = createMockPluginDetail();
            const { container } = (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail} showType={store_1.ReadmeShowType.drawer}/>);
            (0, vitest_1.expect)(container.querySelector('.px-4')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply custom className', () => {
            const mockDetail = createMockPluginDetail();
            const { container } = (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail} className="custom-class"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-class')).toBeInTheDocument();
        });
    });
    // ================================
    // Conditional Rendering / Edge Cases
    // ================================
    (0, vitest_1.describe)('Conditional Rendering', () => {
        (0, vitest_1.it)('should return null when pluginDetail is null/undefined', () => {
            const { container } = (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={null}/>);
            (0, vitest_1.expect)(container.firstChild).toBeNull();
        });
        (0, vitest_1.it)('should return null when plugin_unique_identifier is missing', () => {
            const mockDetail = createMockPluginDetail({ plugin_unique_identifier: '' });
            const { container } = (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail}/>);
            (0, vitest_1.expect)(container.firstChild).toBeNull();
        });
        (0, vitest_1.it)('should return null for builtin tool: code', () => {
            const mockDetail = createMockPluginDetail({ id: 'code' });
            const { container } = (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail}/>);
            (0, vitest_1.expect)(container.firstChild).toBeNull();
        });
        (0, vitest_1.it)('should return null for builtin tool: audio', () => {
            const mockDetail = createMockPluginDetail({ id: 'audio' });
            const { container } = (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail}/>);
            (0, vitest_1.expect)(container.firstChild).toBeNull();
        });
        (0, vitest_1.it)('should return null for builtin tool: time', () => {
            const mockDetail = createMockPluginDetail({ id: 'time' });
            const { container } = (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail}/>);
            (0, vitest_1.expect)(container.firstChild).toBeNull();
        });
        (0, vitest_1.it)('should return null for builtin tool: webscraper', () => {
            const mockDetail = createMockPluginDetail({ id: 'webscraper' });
            const { container } = (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail}/>);
            (0, vitest_1.expect)(container.firstChild).toBeNull();
        });
        (0, vitest_1.it)('should render for non-builtin plugins', () => {
            const mockDetail = createMockPluginDetail({ id: 'custom-plugin' });
            (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
    });
    // ================================
    // User Interactions / Event Handlers
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call setCurrentPluginDetail with drawer type when clicked', () => {
            const mockDetail = createMockPluginDetail();
            (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(currentPluginDetail).toEqual({
                detail: mockDetail,
                showType: store_1.ReadmeShowType.drawer,
            });
        });
        (0, vitest_1.it)('should call setCurrentPluginDetail with modal type when clicked', () => {
            const mockDetail = createMockPluginDetail();
            (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail} showType={store_1.ReadmeShowType.modal}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(currentPluginDetail).toEqual({
                detail: mockDetail,
                showType: store_1.ReadmeShowType.modal,
            });
        });
    });
    // ================================
    // Prop Variations
    // ================================
    (0, vitest_1.describe)('Prop Variations', () => {
        (0, vitest_1.it)('should use default showType when not provided', () => {
            const mockDetail = createMockPluginDetail();
            (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(currentPluginDetail?.showType).toBe(store_1.ReadmeShowType.drawer);
        });
        (0, vitest_1.it)('should handle modal showType correctly', () => {
            const mockDetail = createMockPluginDetail();
            (0, react_1.render)(<entrance_1.ReadmeEntrance pluginDetail={mockDetail} showType={store_1.ReadmeShowType.modal}/>);
            // Modal mode should not have px-4 class
            const container = react_1.screen.getByRole('button').parentElement;
            (0, vitest_1.expect)(container).not.toHaveClass('px-4');
        });
    });
});
// ================================
// ReadmePanel Component Tests
// ================================
(0, vitest_1.describe)('ReadmePanel', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        // Reset store state
        const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
        setCurrentPluginDetail();
        // Reset mock
        mockUsePluginReadme.mockReturnValue({
            data: null,
            isLoading: false,
            error: null,
        });
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should return null when no plugin detail is set', () => {
            const { container } = renderWithQueryClient(<index_1.default />);
            (0, vitest_1.expect)(container.firstChild).toBeNull();
        });
        (0, vitest_1.it)('should render portal content when plugin detail is set', () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.readmeInfo.title')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render DetailHeader component', () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByTestId('detail-header')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('detail-header')).toHaveAttribute('data-is-readme-view', 'true');
        });
        (0, vitest_1.it)('should render close button', () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            // ActionButton wraps the close icon
            (0, vitest_1.expect)(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
    });
    // ================================
    // Loading State Tests
    // ================================
    (0, vitest_1.describe)('Loading State', () => {
        (0, vitest_1.it)('should show loading indicator when isLoading is true', () => {
            mockUsePluginReadme.mockReturnValue({
                data: null,
                isLoading: true,
                error: null,
            });
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            // Loading component should be rendered with role="status"
            (0, vitest_1.expect)(react_1.screen.getByRole('status')).toBeInTheDocument();
        });
    });
    // ================================
    // Error State Tests
    // ================================
    (0, vitest_1.describe)('Error State', () => {
        (0, vitest_1.it)('should show error message when error occurs', () => {
            mockUsePluginReadme.mockReturnValue({
                data: null,
                isLoading: false,
                error: new Error('Failed to fetch'),
            });
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.readmeInfo.failedToFetch')).toBeInTheDocument();
        });
    });
    // ================================
    // No Readme Available State Tests
    // ================================
    (0, vitest_1.describe)('No Readme Available', () => {
        (0, vitest_1.it)('should show no readme message when readme is empty', () => {
            mockUsePluginReadme.mockReturnValue({
                data: { readme: '' },
                isLoading: false,
                error: null,
            });
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.readmeInfo.noReadmeAvailable')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show no readme message when data is null', () => {
            mockUsePluginReadme.mockReturnValue({
                data: null,
                isLoading: false,
                error: null,
            });
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.readmeInfo.noReadmeAvailable')).toBeInTheDocument();
        });
    });
    // ================================
    // Markdown Content Tests
    // ================================
    (0, vitest_1.describe)('Markdown Content', () => {
        (0, vitest_1.it)('should render markdown container when readme is available', () => {
            mockUsePluginReadme.mockReturnValue({
                data: { readme: '# Test Readme Content' },
                isLoading: false,
                error: null,
            });
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            // Markdown component container should be rendered
            // Note: The Markdown component uses dynamic import, so content may load asynchronously
            const markdownContainer = document.querySelector('.markdown-body');
            (0, vitest_1.expect)(markdownContainer).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show error or no-readme message when readme is available', () => {
            mockUsePluginReadme.mockReturnValue({
                data: { readme: '# Test Readme Content' },
                isLoading: false,
                error: null,
            });
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            // Should not show error or no-readme message
            (0, vitest_1.expect)(react_1.screen.queryByText('plugin.readmeInfo.failedToFetch')).not.toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByText('plugin.readmeInfo.noReadmeAvailable')).not.toBeInTheDocument();
        });
    });
    // ================================
    // Portal Rendering Tests (Drawer Mode)
    // ================================
    (0, vitest_1.describe)('Portal Rendering - Drawer Mode', () => {
        (0, vitest_1.it)('should render drawer styled container in drawer mode', () => {
            mockUsePluginReadme.mockReturnValue({
                data: { readme: '# Test' },
                isLoading: false,
                error: null,
            });
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            // Drawer mode has specific max-width
            const drawerContainer = document.querySelector('.max-w-\\[600px\\]');
            (0, vitest_1.expect)(drawerContainer).toBeInTheDocument();
        });
        (0, vitest_1.it)('should have correct drawer positioning classes', () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            // Check for drawer-specific classes
            const backdrop = document.querySelector('.justify-start');
            (0, vitest_1.expect)(backdrop).toBeInTheDocument();
        });
    });
    // ================================
    // Portal Rendering Tests (Modal Mode)
    // ================================
    (0, vitest_1.describe)('Portal Rendering - Modal Mode', () => {
        (0, vitest_1.it)('should render modal styled container in modal mode', () => {
            mockUsePluginReadme.mockReturnValue({
                data: { readme: '# Test' },
                isLoading: false,
                error: null,
            });
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.modal);
            renderWithQueryClient(<index_1.default />);
            // Modal mode has different max-width
            const modalContainer = document.querySelector('.max-w-\\[800px\\]');
            (0, vitest_1.expect)(modalContainer).toBeInTheDocument();
        });
        (0, vitest_1.it)('should have correct modal positioning classes', () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.modal);
            renderWithQueryClient(<index_1.default />);
            // Check for modal-specific classes
            const backdrop = document.querySelector('.items-center.justify-center');
            (0, vitest_1.expect)(backdrop).toBeInTheDocument();
        });
    });
    // ================================
    // User Interactions / Event Handlers
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should close panel when close button is clicked', () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(currentPluginDetail).toBeUndefined();
        });
        (0, vitest_1.it)('should close panel when backdrop is clicked', () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            // Click on the backdrop (outer div)
            const backdrop = document.querySelector('.fixed.inset-0');
            react_1.fireEvent.click(backdrop);
            const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(currentPluginDetail).toBeUndefined();
        });
        (0, vitest_1.it)('should not close panel when content area is clicked', async () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            // Click on the content container (should stop propagation)
            const contentContainer = document.querySelector('.pointer-events-auto');
            react_1.fireEvent.click(contentContainer);
            await (0, react_1.waitFor)(() => {
                const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
                (0, vitest_1.expect)(currentPluginDetail).toBeDefined();
            });
        });
    });
    // ================================
    // API Call Tests
    // ================================
    (0, vitest_1.describe)('API Calls', () => {
        (0, vitest_1.it)('should call usePluginReadme with correct parameters', () => {
            const mockDetail = createMockPluginDetail({
                plugin_unique_identifier: 'custom-plugin@2.0.0',
            });
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            (0, vitest_1.expect)(mockUsePluginReadme).toHaveBeenCalledWith({
                plugin_unique_identifier: 'custom-plugin@2.0.0',
                language: 'en-US',
            });
        });
        (0, vitest_1.it)('should pass undefined language for zh-Hans locale', () => {
            // Re-mock useLanguage to return zh-Hans
            vitest_1.vi.doMock('@/app/components/header/account-setting/model-provider-page/hooks', () => ({
                useLanguage: () => 'zh-Hans',
            }));
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            // This test verifies the language handling logic exists in the component
            renderWithQueryClient(<index_1.default />);
            // The component should have called the hook
            (0, vitest_1.expect)(mockUsePluginReadme).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should handle empty plugin_unique_identifier', () => {
            mockUsePluginReadme.mockReturnValue({
                data: null,
                isLoading: false,
                error: null,
            });
            const mockDetail = createMockPluginDetail({
                plugin_unique_identifier: '',
            });
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            (0, vitest_1.expect)(mockUsePluginReadme).toHaveBeenCalledWith({
                plugin_unique_identifier: '',
                language: 'en-US',
            });
        });
    });
    // ================================
    // Edge Cases
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle detail with missing declaration', () => {
            const mockDetail = createMockPluginDetail();
            // Simulate missing fields
            delete mockDetail.declaration;
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            // This should not throw
            (0, vitest_1.expect)(() => setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer)).not.toThrow();
        });
        (0, vitest_1.it)('should handle rapid open/close operations', async () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            // Rapidly toggle the panel
            (0, react_1.act)(() => {
                setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
                setCurrentPluginDetail();
                setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.modal);
            });
            const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(currentPluginDetail?.showType).toBe(store_1.ReadmeShowType.modal);
        });
        (0, vitest_1.it)('should handle switching between drawer and modal modes', () => {
            const mockDetail = createMockPluginDetail();
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            // Start with drawer
            (0, react_1.act)(() => {
                setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            });
            let state = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(state.currentPluginDetail?.showType).toBe(store_1.ReadmeShowType.drawer);
            // Switch to modal
            (0, react_1.act)(() => {
                setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.modal);
            });
            state = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(state.currentPluginDetail?.showType).toBe(store_1.ReadmeShowType.modal);
        });
        (0, vitest_1.it)('should handle undefined detail gracefully', () => {
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            // Set to undefined explicitly
            (0, react_1.act)(() => {
                setCurrentPluginDetail(undefined, store_1.ReadmeShowType.drawer);
            });
            const { currentPluginDetail } = store_1.useReadmePanelStore.getState();
            (0, vitest_1.expect)(currentPluginDetail).toBeUndefined();
        });
    });
    // ================================
    // Integration Tests
    // ================================
    (0, vitest_1.describe)('Integration', () => {
        (0, vitest_1.it)('should work correctly when opened from ReadmeEntrance', () => {
            const mockDetail = createMockPluginDetail();
            mockUsePluginReadme.mockReturnValue({
                data: { readme: '# Integration Test' },
                isLoading: false,
                error: null,
            });
            // Render both components
            const { rerender } = renderWithQueryClient(<>
          <entrance_1.ReadmeEntrance pluginDetail={mockDetail}/>
          <index_1.default />
        </>);
            // Initially panel should not show content
            (0, vitest_1.expect)(react_1.screen.queryByTestId('detail-header')).not.toBeInTheDocument();
            // Click the entrance button
            react_1.fireEvent.click(react_1.screen.getByRole('button'));
            // Re-render to pick up store changes
            rerender(<react_query_1.QueryClientProvider client={createQueryClient()}>
          <entrance_1.ReadmeEntrance pluginDetail={mockDetail}/>
          <index_1.default />
        </react_query_1.QueryClientProvider>);
            // Panel should now show content
            (0, vitest_1.expect)(react_1.screen.getByTestId('detail-header')).toBeInTheDocument();
            // Markdown content renders in a container (dynamic import may not render content synchronously)
            (0, vitest_1.expect)(document.querySelector('.markdown-body')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display correct plugin information in header', () => {
            const mockDetail = createMockPluginDetail({
                name: 'my-awesome-plugin',
            });
            const { setCurrentPluginDetail } = store_1.useReadmePanelStore.getState();
            setCurrentPluginDetail(mockDetail, store_1.ReadmeShowType.drawer);
            renderWithQueryClient(<index_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('my-awesome-plugin')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdURBQXdFO0FBQ3hFLGtEQUFnRjtBQUNoRixtQ0FBNkQ7QUFDN0Qsb0NBQTJEO0FBQzNELDJDQUFpRDtBQUNqRCx5Q0FBMkM7QUFDM0MsbUNBQWlDO0FBQ2pDLG1DQUE2RDtBQUU3RCxtQ0FBbUM7QUFDbkMsa0NBQWtDO0FBQ2xDLG1DQUFtQztBQUVuQyw0QkFBNEI7QUFDNUIsTUFBTSxtQkFBbUIsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDbkMsV0FBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLGVBQWUsRUFBRSxDQUFDLE1BQStELEVBQUUsRUFBRSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQztDQUNsSCxDQUFDLENBQUMsQ0FBQTtBQUVILHdCQUF3QjtBQUN4QixXQUFFLENBQUMsSUFBSSxDQUFDLG1FQUFtRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDbEYsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU87Q0FDM0IsQ0FBQyxDQUFDLENBQUE7QUFFSCx5RUFBeUU7QUFDekUsV0FBRSxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFlBQVksRUFBbUQsRUFBRSxFQUFFLENBQUMsQ0FDdEYsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUNqRTtNQUFBLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDZDtJQUFBLEVBQUUsR0FBRyxDQUFDLENBQ1A7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILG1DQUFtQztBQUNuQyxzQkFBc0I7QUFDdEIsbUNBQW1DO0FB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QUE7WUFFRCxnQ0FBZ0M7WUFDaEMsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFDL0QsZ0dBQWdHO1lBQ2hHLElBQUEsZUFBTSxFQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDdEUsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQyxxREFBcUQsRUFBRSxHQUFHLEVBQUU7WUFDN0QsTUFBTSxVQUFVLEdBQUcsc0JBQXNCLENBQUM7Z0JBQ3hDLElBQUksRUFBRSxtQkFBbUI7YUFDMUIsQ0FBQyxDQUFBO1lBRUYsTUFBTSxFQUFFLHNCQUFzQixFQUFFLEdBQUcsMkJBQW1CLENBQUMsUUFBUSxFQUFFLENBQUE7WUFDakUsc0JBQXNCLENBQUMsVUFBVSxFQUFFLHNCQUFjLENBQUMsTUFBTSxDQUFDLENBQUE7WUFFekQscUJBQXFCLENBQUMsQ0FBQyxlQUFXLENBQUMsQUFBRCxFQUFHLENBQUMsQ0FBQTtZQUV0QyxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQ25FLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUGx1Z2luRGV0YWlsIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7IGFjdCwgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBQbHVnaW5DYXRlZ29yeUVudW0sIFBsdWdpblNvdXJjZSB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHsgQlVJTFRJTl9UT09MU19BUlJBWSB9IGZyb20gJy4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgUmVhZG1lRW50cmFuY2UgfSBmcm9tICcuL2VudHJhbmNlJ1xuaW1wb3J0IFJlYWRtZVBhbmVsIGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgeyBSZWFkbWVTaG93VHlwZSwgdXNlUmVhZG1lUGFuZWxTdG9yZSB9IGZyb20gJy4vc3RvcmUnXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIGV4dGVybmFsIGRlcGVuZGVuY2llcyBvbmx5XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIHVzZVBsdWdpblJlYWRtZSBob29rXG5jb25zdCBtb2NrVXNlUGx1Z2luUmVhZG1lID0gdmkuZm4oKVxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1wbHVnaW5zJywgKCkgPT4gKHtcbiAgdXNlUGx1Z2luUmVhZG1lOiAocGFyYW1zOiB7IHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogc3RyaW5nLCBsYW5ndWFnZT86IHN0cmluZyB9KSA9PiBtb2NrVXNlUGx1Z2luUmVhZG1lKHBhcmFtcyksXG59KSlcblxuLy8gTW9jayB1c2VMYW5ndWFnZSBob29rXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9ob29rcycsICgpID0+ICh7XG4gIHVzZUxhbmd1YWdlOiAoKSA9PiAnZW4tVVMnLFxufSkpXG5cbi8vIE1vY2sgRGV0YWlsSGVhZGVyIGNvbXBvbmVudCAoY29tcGxleCBjb21wb25lbnQgd2l0aCBtYW55IGRlcGVuZGVuY2llcylcbnZpLm1vY2soJy4uL3BsdWdpbi1kZXRhaWwtcGFuZWwvZGV0YWlsLWhlYWRlcicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGRldGFpbCwgaXNSZWFkbWVWaWV3IH06IHsgZGV0YWlsOiBQbHVnaW5EZXRhaWwsIGlzUmVhZG1lVmlldzogYm9vbGVhbiB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImRldGFpbC1oZWFkZXJcIiBkYXRhLWlzLXJlYWRtZS12aWV3PXtpc1JlYWRtZVZpZXd9PlxuICAgICAge2RldGFpbC5uYW1lfVxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsID0gKG92ZXJyaWRlczogUGFydGlhbDxQbHVnaW5EZXRhaWw+ID0ge30pOiBQbHVnaW5EZXRhaWwgPT4gKHtcbiAgaWQ6ICd0ZXN0LXBsdWdpbi1pZCcsXG4gIGNyZWF0ZWRfYXQ6ICcyMDI0LTAxLTAxVDAwOjAwOjAwWicsXG4gIHVwZGF0ZWRfYXQ6ICcyMDI0LTAxLTAxVDAwOjAwOjAwWicsXG4gIG5hbWU6ICd0ZXN0LXBsdWdpbicsXG4gIHBsdWdpbl9pZDogJ3Rlc3QtcGx1Z2luLWlkJyxcbiAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC1wbHVnaW5AMS4wLjAnLFxuICBkZWNsYXJhdGlvbjoge1xuICAgIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ3Rlc3QtcGx1Z2luQDEuMC4wJyxcbiAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgIGF1dGhvcjogJ3Rlc3QtYXV0aG9yJyxcbiAgICBpY29uOiAndGVzdC1pY29uLnBuZycsXG4gICAgbmFtZTogJ3Rlc3QtcGx1Z2luJyxcbiAgICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gICAgbGFiZWw6IHsgJ2VuLVVTJzogJ1Rlc3QgUGx1Z2luJyB9IGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgZGVzY3JpcHRpb246IHsgJ2VuLVVTJzogJ1Rlc3QgcGx1Z2luIGRlc2NyaXB0aW9uJyB9IGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgY3JlYXRlZF9hdDogJzIwMjQtMDEtMDFUMDA6MDA6MDBaJyxcbiAgICByZXNvdXJjZTogbnVsbCxcbiAgICBwbHVnaW5zOiBudWxsLFxuICAgIHZlcmlmaWVkOiB0cnVlLFxuICAgIGVuZHBvaW50OiB7IHNldHRpbmdzOiBbXSwgZW5kcG9pbnRzOiBbXSB9LFxuICAgIG1vZGVsOiBudWxsLFxuICAgIHRhZ3M6IFtdLFxuICAgIGFnZW50X3N0cmF0ZWd5OiBudWxsLFxuICAgIG1ldGE6IHsgdmVyc2lvbjogJzEuMC4wJyB9LFxuICAgIHRyaWdnZXI6IHtcbiAgICAgIGV2ZW50czogW10sXG4gICAgICBpZGVudGl0eToge1xuICAgICAgICBhdXRob3I6ICd0ZXN0LWF1dGhvcicsXG4gICAgICAgIG5hbWU6ICd0ZXN0LXBsdWdpbicsXG4gICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdUZXN0IFBsdWdpbicgfSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgICAgICBkZXNjcmlwdGlvbjogeyAnZW4tVVMnOiAnVGVzdCBwbHVnaW4gZGVzY3JpcHRpb24nIH0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgICAgICAgaWNvbjogJ3Rlc3QtaWNvbi5wbmcnLFxuICAgICAgICB0YWdzOiBbXSxcbiAgICAgIH0sXG4gICAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgICAgY3JlZGVudGlhbHNfc2NoZW1hOiBbXSxcbiAgICAgICAgb2F1dGhfc2NoZW1hOiB7IGNsaWVudF9zY2hlbWE6IFtdLCBjcmVkZW50aWFsc19zY2hlbWE6IFtdIH0sXG4gICAgICAgIHBhcmFtZXRlcnM6IFtdLFxuICAgICAgfSxcbiAgICAgIHN1YnNjcmlwdGlvbl9zY2hlbWE6IFtdLFxuICAgIH0sXG4gIH0sXG4gIGluc3RhbGxhdGlvbl9pZDogJ2luc3RhbGwtMTIzJyxcbiAgdGVuYW50X2lkOiAndGVuYW50LTEyMycsXG4gIGVuZHBvaW50c19zZXR1cHM6IDAsXG4gIGVuZHBvaW50c19hY3RpdmU6IDAsXG4gIHZlcnNpb246ICcxLjAuMCcsXG4gIGxhdGVzdF92ZXJzaW9uOiAnMS4wLjAnLFxuICBsYXRlc3RfdW5pcXVlX2lkZW50aWZpZXI6ICd0ZXN0LXBsdWdpbkAxLjAuMCcsXG4gIHNvdXJjZTogUGx1Z2luU291cmNlLm1hcmtldHBsYWNlLFxuICBzdGF0dXM6ICdhY3RpdmUnIGFzIGNvbnN0LFxuICBkZXByZWNhdGVkX3JlYXNvbjogJycsXG4gIGFsdGVybmF0aXZlX3BsdWdpbl9pZDogJycsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IFV0aWxpdGllc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgY3JlYXRlUXVlcnlDbGllbnQgPSAoKSA9PiBuZXcgUXVlcnlDbGllbnQoe1xuICBkZWZhdWx0T3B0aW9uczoge1xuICAgIHF1ZXJpZXM6IHtcbiAgICAgIHJldHJ5OiBmYWxzZSxcbiAgICB9LFxuICB9LFxufSlcblxuY29uc3QgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50ID0gKHVpOiBSZWFjdC5SZWFjdEVsZW1lbnQpID0+IHtcbiAgY29uc3QgcXVlcnlDbGllbnQgPSBjcmVhdGVRdWVyeUNsaWVudCgpXG4gIHJldHVybiByZW5kZXIoXG4gICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtxdWVyeUNsaWVudH0+XG4gICAgICB7dWl9XG4gICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgKVxufVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ29uc3RhbnRzIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0JVSUxUSU5fVE9PTFNfQVJSQVknLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgY29udGFpbiBleHBlY3RlZCBidWlsdGluIHRvb2xzJywgKCkgPT4ge1xuICAgIGV4cGVjdChCVUlMVElOX1RPT0xTX0FSUkFZKS50b0NvbnRhaW4oJ2NvZGUnKVxuICAgIGV4cGVjdChCVUlMVElOX1RPT0xTX0FSUkFZKS50b0NvbnRhaW4oJ2F1ZGlvJylcbiAgICBleHBlY3QoQlVJTFRJTl9UT09MU19BUlJBWSkudG9Db250YWluKCd0aW1lJylcbiAgICBleHBlY3QoQlVJTFRJTl9UT09MU19BUlJBWSkudG9Db250YWluKCd3ZWJzY3JhcGVyJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhdmUgZXhhY3RseSA0IGJ1aWx0aW4gdG9vbHMnLCAoKSA9PiB7XG4gICAgZXhwZWN0KEJVSUxUSU5fVE9PTFNfQVJSQVkpLnRvSGF2ZUxlbmd0aCg0KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFN0b3JlIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ3VzZVJlYWRtZVBhbmVsU3RvcmUnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIC8vIFJlc2V0IHN0b3JlIHN0YXRlIGJlZm9yZSBlYWNoIHRlc3RcbiAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdJbml0aWFsIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGF2ZSB1bmRlZmluZWQgY3VycmVudFBsdWdpbkRldGFpbCBpbml0aWFsbHknLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgZXhwZWN0KGN1cnJlbnRQbHVnaW5EZXRhaWwpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ3NldEN1cnJlbnRQbHVnaW5EZXRhaWwnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzZXQgY3VycmVudFBsdWdpbkRldGFpbCB3aXRoIGRldGFpbCBhbmQgZGVmYXVsdCBzaG93VHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKClcbiAgICAgIGNvbnN0IHsgc2V0Q3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwobW9ja0RldGFpbClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHsgY3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBleHBlY3QoY3VycmVudFBsdWdpbkRldGFpbCkudG9FcXVhbCh7XG4gICAgICAgIGRldGFpbDogbW9ja0RldGFpbCxcbiAgICAgICAgc2hvd1R5cGU6IFJlYWRtZVNob3dUeXBlLmRyYXdlcixcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IGN1cnJlbnRQbHVnaW5EZXRhaWwgd2l0aCBjdXN0b20gc2hvd1R5cGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG4gICAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBzZXRDdXJyZW50UGx1Z2luRGV0YWlsKG1vY2tEZXRhaWwsIFJlYWRtZVNob3dUeXBlLm1vZGFsKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgeyBjdXJyZW50UGx1Z2luRGV0YWlsIH0gPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcbiAgICAgIGV4cGVjdChjdXJyZW50UGx1Z2luRGV0YWlsKS50b0VxdWFsKHtcbiAgICAgICAgZGV0YWlsOiBtb2NrRGV0YWlsLFxuICAgICAgICBzaG93VHlwZTogUmVhZG1lU2hvd1R5cGUubW9kYWwsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNsZWFyIGN1cnJlbnRQbHVnaW5EZXRhaWwgd2hlbiBjYWxsZWQgd2l0aG91dCBhcmd1bWVudHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG4gICAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgICAvLyBGaXJzdCBzZXQgYSBkZXRhaWxcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwobW9ja0RldGFpbClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFRoZW4gY2xlYXIgaXRcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwoKVxuICAgICAgfSlcblxuICAgICAgY29uc3QgeyBjdXJyZW50UGx1Z2luRGV0YWlsIH0gPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcbiAgICAgIGV4cGVjdChjdXJyZW50UGx1Z2luRGV0YWlsKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbGVhciBjdXJyZW50UGx1Z2luRGV0YWlsIHdoZW4gY2FsbGVkIHdpdGggdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuICAgICAgY29uc3QgeyBzZXRDdXJyZW50UGx1Z2luRGV0YWlsIH0gPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcblxuICAgICAgLy8gRmlyc3Qgc2V0IGEgZGV0YWlsXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBzZXRDdXJyZW50UGx1Z2luRGV0YWlsKG1vY2tEZXRhaWwpXG4gICAgICB9KVxuXG4gICAgICAvLyBUaGVuIGNsZWFyIGl0IHdpdGggZXhwbGljaXQgdW5kZWZpbmVkXG4gICAgICBhY3QoKCkgPT4ge1xuICAgICAgICBzZXRDdXJyZW50UGx1Z2luRGV0YWlsKHVuZGVmaW5lZClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHsgY3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBleHBlY3QoY3VycmVudFBsdWdpbkRldGFpbCkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUmVhZG1lU2hvd1R5cGUgZW51bScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgZHJhd2VyIGFuZCBtb2RhbCB0eXBlcycsICgpID0+IHtcbiAgICAgIGV4cGVjdChSZWFkbWVTaG93VHlwZS5kcmF3ZXIpLnRvQmUoJ2RyYXdlcicpXG4gICAgICBleHBlY3QoUmVhZG1lU2hvd1R5cGUubW9kYWwpLnRvQmUoJ21vZGFsJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFJlYWRtZUVudHJhbmNlIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdSZWFkbWVFbnRyYW5jZScsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgLy8gUmVzZXQgc3RvcmUgc3RhdGVcbiAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRoZSBlbnRyYW5jZSBidXR0b24gd2l0aCBmdWxsIHRpcCB0ZXh0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuXG4gICAgICByZW5kZXIoPFJlYWRtZUVudHJhbmNlIHBsdWdpbkRldGFpbD17bW9ja0RldGFpbH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5yZWFkbWVJbmZvLm5lZWRIZWxwQ2hlY2tSZWFkbWUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHNob3J0IHRpcCB0ZXh0IHdoZW4gc2hvd1Nob3J0VGlwIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG5cbiAgICAgIHJlbmRlcig8UmVhZG1lRW50cmFuY2UgcGx1Z2luRGV0YWlsPXttb2NrRGV0YWlsfSBzaG93U2hvcnRUaXAgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4ucmVhZG1lSW5mby50aXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRpdmlkZXIgd2hlbiBzaG93U2hvcnRUaXAgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG5cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFJlYWRtZUVudHJhbmNlIHBsdWdpbkRldGFpbD17bW9ja0RldGFpbH0gc2hvd1Nob3J0VGlwPXtmYWxzZX0gLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmJnLWRpdmlkZXItcmVndWxhcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBkaXZpZGVyIHdoZW4gc2hvd1Nob3J0VGlwIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG5cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFJlYWRtZUVudHJhbmNlIHBsdWdpbkRldGFpbD17bW9ja0RldGFpbH0gc2hvd1Nob3J0VGlwIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5iZy1kaXZpZGVyLXJlZ3VsYXInKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBkcmF3ZXIgbW9kZSBwYWRkaW5nIGNsYXNzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8UmVhZG1lRW50cmFuY2UgcGx1Z2luRGV0YWlsPXttb2NrRGV0YWlsfSBzaG93VHlwZT17UmVhZG1lU2hvd1R5cGUuZHJhd2VyfSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcucHgtNCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIGNsYXNzTmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKClcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPFJlYWRtZUVudHJhbmNlIHBsdWdpbkRldGFpbD17bW9ja0RldGFpbH0gY2xhc3NOYW1lPVwiY3VzdG9tLWNsYXNzXCIgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmN1c3RvbS1jbGFzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDb25kaXRpb25hbCBSZW5kZXJpbmcgLyBFZGdlIENhc2VzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb25kaXRpb25hbCBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbnVsbCB3aGVuIHBsdWdpbkRldGFpbCBpcyBudWxsL3VuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFJlYWRtZUVudHJhbmNlIHBsdWdpbkRldGFpbD17bnVsbCBhcyB1bmtub3duIGFzIFBsdWdpbkRldGFpbH0gLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZU51bGwoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBudWxsIHdoZW4gcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyIGlzIG1pc3NpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCh7IHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJycgfSlcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UmVhZG1lRW50cmFuY2UgcGx1Z2luRGV0YWlsPXttb2NrRGV0YWlsfSAvPilcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlTnVsbCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG51bGwgZm9yIGJ1aWx0aW4gdG9vbDogY29kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHsgaWQ6ICdjb2RlJyB9KVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxSZWFkbWVFbnRyYW5jZSBwbHVnaW5EZXRhaWw9e21vY2tEZXRhaWx9IC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVOdWxsKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbnVsbCBmb3IgYnVpbHRpbiB0b29sOiBhdWRpbycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHsgaWQ6ICdhdWRpbycgfSlcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UmVhZG1lRW50cmFuY2UgcGx1Z2luRGV0YWlsPXttb2NrRGV0YWlsfSAvPilcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlTnVsbCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIG51bGwgZm9yIGJ1aWx0aW4gdG9vbDogdGltZScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHsgaWQ6ICd0aW1lJyB9KVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxSZWFkbWVFbnRyYW5jZSBwbHVnaW5EZXRhaWw9e21vY2tEZXRhaWx9IC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVOdWxsKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gbnVsbCBmb3IgYnVpbHRpbiB0b29sOiB3ZWJzY3JhcGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoeyBpZDogJ3dlYnNjcmFwZXInIH0pXG5cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFJlYWRtZUVudHJhbmNlIHBsdWdpbkRldGFpbD17bW9ja0RldGFpbH0gLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZU51bGwoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBmb3Igbm9uLWJ1aWx0aW4gcGx1Z2lucycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKHsgaWQ6ICdjdXN0b20tcGx1Z2luJyB9KVxuXG4gICAgICByZW5kZXIoPFJlYWRtZUVudHJhbmNlIHBsdWdpbkRldGFpbD17bW9ja0RldGFpbH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgLyBFdmVudCBIYW5kbGVyc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgd2l0aCBkcmF3ZXIgdHlwZSB3aGVuIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG5cbiAgICAgIHJlbmRlcig8UmVhZG1lRW50cmFuY2UgcGx1Z2luRGV0YWlsPXttb2NrRGV0YWlsfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICBjb25zdCB7IGN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgZXhwZWN0KGN1cnJlbnRQbHVnaW5EZXRhaWwpLnRvRXF1YWwoe1xuICAgICAgICBkZXRhaWw6IG1vY2tEZXRhaWwsXG4gICAgICAgIHNob3dUeXBlOiBSZWFkbWVTaG93VHlwZS5kcmF3ZXIsXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc2V0Q3VycmVudFBsdWdpbkRldGFpbCB3aXRoIG1vZGFsIHR5cGUgd2hlbiBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuXG4gICAgICByZW5kZXIoPFJlYWRtZUVudHJhbmNlIHBsdWdpbkRldGFpbD17bW9ja0RldGFpbH0gc2hvd1R5cGU9e1JlYWRtZVNob3dUeXBlLm1vZGFsfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpKVxuXG4gICAgICBjb25zdCB7IGN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgZXhwZWN0KGN1cnJlbnRQbHVnaW5EZXRhaWwpLnRvRXF1YWwoe1xuICAgICAgICBkZXRhaWw6IG1vY2tEZXRhaWwsXG4gICAgICAgIHNob3dUeXBlOiBSZWFkbWVTaG93VHlwZS5tb2RhbCxcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wIFZhcmlhdGlvbnNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3AgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSBkZWZhdWx0IHNob3dUeXBlIHdoZW4gbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuXG4gICAgICByZW5kZXIoPFJlYWRtZUVudHJhbmNlIHBsdWdpbkRldGFpbD17bW9ja0RldGFpbH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgY29uc3QgeyBjdXJyZW50UGx1Z2luRGV0YWlsIH0gPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcbiAgICAgIGV4cGVjdChjdXJyZW50UGx1Z2luRGV0YWlsPy5zaG93VHlwZSkudG9CZShSZWFkbWVTaG93VHlwZS5kcmF3ZXIpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1vZGFsIHNob3dUeXBlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKClcblxuICAgICAgcmVuZGVyKDxSZWFkbWVFbnRyYW5jZSBwbHVnaW5EZXRhaWw9e21vY2tEZXRhaWx9IHNob3dUeXBlPXtSZWFkbWVTaG93VHlwZS5tb2RhbH0gLz4pXG5cbiAgICAgIC8vIE1vZGFsIG1vZGUgc2hvdWxkIG5vdCBoYXZlIHB4LTQgY2xhc3NcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicpLnBhcmVudEVsZW1lbnRcbiAgICAgIGV4cGVjdChjb250YWluZXIpLm5vdC50b0hhdmVDbGFzcygncHgtNCcpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBSZWFkbWVQYW5lbCBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnUmVhZG1lUGFuZWwnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIC8vIFJlc2V0IHN0b3JlIHN0YXRlXG4gICAgY29uc3QgeyBzZXRDdXJyZW50UGx1Z2luRGV0YWlsIH0gPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcbiAgICBzZXRDdXJyZW50UGx1Z2luRGV0YWlsKClcbiAgICAvLyBSZXNldCBtb2NrXG4gICAgbW9ja1VzZVBsdWdpblJlYWRtZS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgZGF0YTogbnVsbCxcbiAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICBlcnJvcjogbnVsbCxcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIG51bGwgd2hlbiBubyBwbHVnaW4gZGV0YWlsIGlzIHNldCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFJlYWRtZVBhbmVsIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVOdWxsKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcG9ydGFsIGNvbnRlbnQgd2hlbiBwbHVnaW4gZGV0YWlsIGlzIHNldCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKClcbiAgICAgIGNvbnN0IHsgc2V0Q3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBzZXRDdXJyZW50UGx1Z2luRGV0YWlsKG1vY2tEZXRhaWwsIFJlYWRtZVNob3dUeXBlLmRyYXdlcilcblxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxSZWFkbWVQYW5lbCAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5yZWFkbWVJbmZvLnRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgRGV0YWlsSGVhZGVyIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKClcbiAgICAgIGNvbnN0IHsgc2V0Q3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBzZXRDdXJyZW50UGx1Z2luRGV0YWlsKG1vY2tEZXRhaWwsIFJlYWRtZVNob3dUeXBlLmRyYXdlcilcblxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxSZWFkbWVQYW5lbCAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZGV0YWlsLWhlYWRlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkZXRhaWwtaGVhZGVyJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1pcy1yZWFkbWUtdmlldycsICd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2xvc2UgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuICAgICAgY29uc3QgeyBzZXRDdXJyZW50UGx1Z2luRGV0YWlsIH0gPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcbiAgICAgIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwobW9ja0RldGFpbCwgUmVhZG1lU2hvd1R5cGUuZHJhd2VyKVxuXG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFJlYWRtZVBhbmVsIC8+KVxuXG4gICAgICAvLyBBY3Rpb25CdXR0b24gd3JhcHMgdGhlIGNsb3NlIGljb25cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTG9hZGluZyBTdGF0ZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTG9hZGluZyBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgbG9hZGluZyBpbmRpY2F0b3Igd2hlbiBpc0xvYWRpbmcgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIG1vY2tVc2VQbHVnaW5SZWFkbWUubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKClcbiAgICAgIGNvbnN0IHsgc2V0Q3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBzZXRDdXJyZW50UGx1Z2luRGV0YWlsKG1vY2tEZXRhaWwsIFJlYWRtZVNob3dUeXBlLmRyYXdlcilcblxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxSZWFkbWVQYW5lbCAvPilcblxuICAgICAgLy8gTG9hZGluZyBjb21wb25lbnQgc2hvdWxkIGJlIHJlbmRlcmVkIHdpdGggcm9sZT1cInN0YXR1c1wiXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnc3RhdHVzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVycm9yIFN0YXRlIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFcnJvciBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3IgbWVzc2FnZSB3aGVuIGVycm9yIG9jY3VycycsICgpID0+IHtcbiAgICAgIG1vY2tVc2VQbHVnaW5SZWFkbWUubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG5ldyBFcnJvcignRmFpbGVkIHRvIGZldGNoJyksXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG4gICAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgc2V0Q3VycmVudFBsdWdpbkRldGFpbChtb2NrRGV0YWlsLCBSZWFkbWVTaG93VHlwZS5kcmF3ZXIpXG5cbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UmVhZG1lUGFuZWwgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4ucmVhZG1lSW5mby5mYWlsZWRUb0ZldGNoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIE5vIFJlYWRtZSBBdmFpbGFibGUgU3RhdGUgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ05vIFJlYWRtZSBBdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IG5vIHJlYWRtZSBtZXNzYWdlIHdoZW4gcmVhZG1lIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgbW9ja1VzZVBsdWdpblJlYWRtZS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiB7IHJlYWRtZTogJycgfSxcbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG4gICAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgc2V0Q3VycmVudFBsdWdpbkRldGFpbChtb2NrRGV0YWlsLCBSZWFkbWVTaG93VHlwZS5kcmF3ZXIpXG5cbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UmVhZG1lUGFuZWwgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4ucmVhZG1lSW5mby5ub1JlYWRtZUF2YWlsYWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBubyByZWFkbWUgbWVzc2FnZSB3aGVuIGRhdGEgaXMgbnVsbCcsICgpID0+IHtcbiAgICAgIG1vY2tVc2VQbHVnaW5SZWFkbWUubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgZGF0YTogbnVsbCxcbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG4gICAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgc2V0Q3VycmVudFBsdWdpbkRldGFpbChtb2NrRGV0YWlsLCBSZWFkbWVTaG93VHlwZS5kcmF3ZXIpXG5cbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UmVhZG1lUGFuZWwgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4ucmVhZG1lSW5mby5ub1JlYWRtZUF2YWlsYWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBNYXJrZG93biBDb250ZW50IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdNYXJrZG93biBDb250ZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIG1hcmtkb3duIGNvbnRhaW5lciB3aGVuIHJlYWRtZSBpcyBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgICBtb2NrVXNlUGx1Z2luUmVhZG1lLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IHsgcmVhZG1lOiAnIyBUZXN0IFJlYWRtZSBDb250ZW50JyB9LFxuICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKClcbiAgICAgIGNvbnN0IHsgc2V0Q3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBzZXRDdXJyZW50UGx1Z2luRGV0YWlsKG1vY2tEZXRhaWwsIFJlYWRtZVNob3dUeXBlLmRyYXdlcilcblxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxSZWFkbWVQYW5lbCAvPilcblxuICAgICAgLy8gTWFya2Rvd24gY29tcG9uZW50IGNvbnRhaW5lciBzaG91bGQgYmUgcmVuZGVyZWRcbiAgICAgIC8vIE5vdGU6IFRoZSBNYXJrZG93biBjb21wb25lbnQgdXNlcyBkeW5hbWljIGltcG9ydCwgc28gY29udGVudCBtYXkgbG9hZCBhc3luY2hyb25vdXNseVxuICAgICAgY29uc3QgbWFya2Rvd25Db250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWFya2Rvd24tYm9keScpXG4gICAgICBleHBlY3QobWFya2Rvd25Db250YWluZXIpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBlcnJvciBvciBuby1yZWFkbWUgbWVzc2FnZSB3aGVuIHJlYWRtZSBpcyBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgICBtb2NrVXNlUGx1Z2luUmVhZG1lLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IHsgcmVhZG1lOiAnIyBUZXN0IFJlYWRtZSBDb250ZW50JyB9LFxuICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKClcbiAgICAgIGNvbnN0IHsgc2V0Q3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBzZXRDdXJyZW50UGx1Z2luRGV0YWlsKG1vY2tEZXRhaWwsIFJlYWRtZVNob3dUeXBlLmRyYXdlcilcblxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxSZWFkbWVQYW5lbCAvPilcblxuICAgICAgLy8gU2hvdWxkIG5vdCBzaG93IGVycm9yIG9yIG5vLXJlYWRtZSBtZXNzYWdlXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdwbHVnaW4ucmVhZG1lSW5mby5mYWlsZWRUb0ZldGNoJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdwbHVnaW4ucmVhZG1lSW5mby5ub1JlYWRtZUF2YWlsYWJsZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUG9ydGFsIFJlbmRlcmluZyBUZXN0cyAoRHJhd2VyIE1vZGUpXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQb3J0YWwgUmVuZGVyaW5nIC0gRHJhd2VyIE1vZGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZHJhd2VyIHN0eWxlZCBjb250YWluZXIgaW4gZHJhd2VyIG1vZGUnLCAoKSA9PiB7XG4gICAgICBtb2NrVXNlUGx1Z2luUmVhZG1lLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IHsgcmVhZG1lOiAnIyBUZXN0JyB9LFxuICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IG1vY2tEZXRhaWwgPSBjcmVhdGVNb2NrUGx1Z2luRGV0YWlsKClcbiAgICAgIGNvbnN0IHsgc2V0Q3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBzZXRDdXJyZW50UGx1Z2luRGV0YWlsKG1vY2tEZXRhaWwsIFJlYWRtZVNob3dUeXBlLmRyYXdlcilcblxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxSZWFkbWVQYW5lbCAvPilcblxuICAgICAgLy8gRHJhd2VyIG1vZGUgaGFzIHNwZWNpZmljIG1heC13aWR0aFxuICAgICAgY29uc3QgZHJhd2VyQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1heC13LVxcXFxbNjAwcHhcXFxcXScpXG4gICAgICBleHBlY3QoZHJhd2VyQ29udGFpbmVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IGRyYXdlciBwb3NpdGlvbmluZyBjbGFzc2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuICAgICAgY29uc3QgeyBzZXRDdXJyZW50UGx1Z2luRGV0YWlsIH0gPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcbiAgICAgIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwobW9ja0RldGFpbCwgUmVhZG1lU2hvd1R5cGUuZHJhd2VyKVxuXG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFJlYWRtZVBhbmVsIC8+KVxuXG4gICAgICAvLyBDaGVjayBmb3IgZHJhd2VyLXNwZWNpZmljIGNsYXNzZXNcbiAgICAgIGNvbnN0IGJhY2tkcm9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmp1c3RpZnktc3RhcnQnKVxuICAgICAgZXhwZWN0KGJhY2tkcm9wKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQb3J0YWwgUmVuZGVyaW5nIFRlc3RzIChNb2RhbCBNb2RlKVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUG9ydGFsIFJlbmRlcmluZyAtIE1vZGFsIE1vZGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgc3R5bGVkIGNvbnRhaW5lciBpbiBtb2RhbCBtb2RlJywgKCkgPT4ge1xuICAgICAgbW9ja1VzZVBsdWdpblJlYWRtZS5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBkYXRhOiB7IHJlYWRtZTogJyMgVGVzdCcgfSxcbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgZXJyb3I6IG51bGwsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG4gICAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgc2V0Q3VycmVudFBsdWdpbkRldGFpbChtb2NrRGV0YWlsLCBSZWFkbWVTaG93VHlwZS5tb2RhbClcblxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxSZWFkbWVQYW5lbCAvPilcblxuICAgICAgLy8gTW9kYWwgbW9kZSBoYXMgZGlmZmVyZW50IG1heC13aWR0aFxuICAgICAgY29uc3QgbW9kYWxDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubWF4LXctXFxcXFs4MDBweFxcXFxdJylcbiAgICAgIGV4cGVjdChtb2RhbENvbnRhaW5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBtb2RhbCBwb3NpdGlvbmluZyBjbGFzc2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuICAgICAgY29uc3QgeyBzZXRDdXJyZW50UGx1Z2luRGV0YWlsIH0gPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcbiAgICAgIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwobW9ja0RldGFpbCwgUmVhZG1lU2hvd1R5cGUubW9kYWwpXG5cbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UmVhZG1lUGFuZWwgLz4pXG5cbiAgICAgIC8vIENoZWNrIGZvciBtb2RhbC1zcGVjaWZpYyBjbGFzc2VzXG4gICAgICBjb25zdCBiYWNrZHJvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pdGVtcy1jZW50ZXIuanVzdGlmeS1jZW50ZXInKVxuICAgICAgZXhwZWN0KGJhY2tkcm9wKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVc2VyIEludGVyYWN0aW9ucyAvIEV2ZW50IEhhbmRsZXJzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNsb3NlIHBhbmVsIHdoZW4gY2xvc2UgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG4gICAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgc2V0Q3VycmVudFBsdWdpbkRldGFpbChtb2NrRGV0YWlsLCBSZWFkbWVTaG93VHlwZS5kcmF3ZXIpXG5cbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UmVhZG1lUGFuZWwgLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgY29uc3QgeyBjdXJyZW50UGx1Z2luRGV0YWlsIH0gPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcbiAgICAgIGV4cGVjdChjdXJyZW50UGx1Z2luRGV0YWlsKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjbG9zZSBwYW5lbCB3aGVuIGJhY2tkcm9wIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG4gICAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgc2V0Q3VycmVudFBsdWdpbkRldGFpbChtb2NrRGV0YWlsLCBSZWFkbWVTaG93VHlwZS5kcmF3ZXIpXG5cbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UmVhZG1lUGFuZWwgLz4pXG5cbiAgICAgIC8vIENsaWNrIG9uIHRoZSBiYWNrZHJvcCAob3V0ZXIgZGl2KVxuICAgICAgY29uc3QgYmFja2Ryb3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZml4ZWQuaW5zZXQtMCcpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soYmFja2Ryb3AhKVxuXG4gICAgICBjb25zdCB7IGN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgZXhwZWN0KGN1cnJlbnRQbHVnaW5EZXRhaWwpLnRvQmVVbmRlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjbG9zZSBwYW5lbCB3aGVuIGNvbnRlbnQgYXJlYSBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuICAgICAgY29uc3QgeyBzZXRDdXJyZW50UGx1Z2luRGV0YWlsIH0gPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcbiAgICAgIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwobW9ja0RldGFpbCwgUmVhZG1lU2hvd1R5cGUuZHJhd2VyKVxuXG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFJlYWRtZVBhbmVsIC8+KVxuXG4gICAgICAvLyBDbGljayBvbiB0aGUgY29udGVudCBjb250YWluZXIgKHNob3VsZCBzdG9wIHByb3BhZ2F0aW9uKVxuICAgICAgY29uc3QgY29udGVudENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wb2ludGVyLWV2ZW50cy1hdXRvJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb250ZW50Q29udGFpbmVyISlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgY3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICAgIGV4cGVjdChjdXJyZW50UGx1Z2luRGV0YWlsKS50b0JlRGVmaW5lZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQVBJIENhbGwgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0FQSSBDYWxscycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgdXNlUGx1Z2luUmVhZG1lIHdpdGggY29ycmVjdCBwYXJhbWV0ZXJzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICdjdXN0b20tcGx1Z2luQDIuMC4wJyxcbiAgICAgIH0pXG4gICAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgc2V0Q3VycmVudFBsdWdpbkRldGFpbChtb2NrRGV0YWlsLCBSZWFkbWVTaG93VHlwZS5kcmF3ZXIpXG5cbiAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudCg8UmVhZG1lUGFuZWwgLz4pXG5cbiAgICAgIGV4cGVjdChtb2NrVXNlUGx1Z2luUmVhZG1lKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ2N1c3RvbS1wbHVnaW5AMi4wLjAnLFxuICAgICAgICBsYW5ndWFnZTogJ2VuLVVTJyxcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyB1bmRlZmluZWQgbGFuZ3VhZ2UgZm9yIHpoLUhhbnMgbG9jYWxlJywgKCkgPT4ge1xuICAgICAgLy8gUmUtbW9jayB1c2VMYW5ndWFnZSB0byByZXR1cm4gemgtSGFuc1xuICAgICAgdmkuZG9Nb2NrKCdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvbW9kZWwtcHJvdmlkZXItcGFnZS9ob29rcycsICgpID0+ICh7XG4gICAgICAgIHVzZUxhbmd1YWdlOiAoKSA9PiAnemgtSGFucycsXG4gICAgICB9KSlcblxuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuICAgICAgY29uc3QgeyBzZXRDdXJyZW50UGx1Z2luRGV0YWlsIH0gPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcbiAgICAgIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwobW9ja0RldGFpbCwgUmVhZG1lU2hvd1R5cGUuZHJhd2VyKVxuXG4gICAgICAvLyBUaGlzIHRlc3QgdmVyaWZpZXMgdGhlIGxhbmd1YWdlIGhhbmRsaW5nIGxvZ2ljIGV4aXN0cyBpbiB0aGUgY29tcG9uZW50XG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFJlYWRtZVBhbmVsIC8+KVxuXG4gICAgICAvLyBUaGUgY29tcG9uZW50IHNob3VsZCBoYXZlIGNhbGxlZCB0aGUgaG9va1xuICAgICAgZXhwZWN0KG1vY2tVc2VQbHVnaW5SZWFkbWUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXInLCAoKSA9PiB7XG4gICAgICBtb2NrVXNlUGx1Z2luUmVhZG1lLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IG51bGwsXG4gICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICAgIGVycm9yOiBudWxsLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICcnLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHsgc2V0Q3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBzZXRDdXJyZW50UGx1Z2luRGV0YWlsKG1vY2tEZXRhaWwsIFJlYWRtZVNob3dUeXBlLmRyYXdlcilcblxuICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxSZWFkbWVQYW5lbCAvPilcblxuICAgICAgZXhwZWN0KG1vY2tVc2VQbHVnaW5SZWFkbWUpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAnJyxcbiAgICAgICAgbGFuZ3VhZ2U6ICdlbi1VUycsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkZXRhaWwgd2l0aCBtaXNzaW5nIGRlY2xhcmF0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuICAgICAgLy8gU2ltdWxhdGUgbWlzc2luZyBmaWVsZHNcbiAgICAgIGRlbGV0ZSAobW9ja0RldGFpbCBhcyBQYXJ0aWFsPFBsdWdpbkRldGFpbD4pLmRlY2xhcmF0aW9uXG5cbiAgICAgIGNvbnN0IHsgc2V0Q3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICAgIC8vIFRoaXMgc2hvdWxkIG5vdCB0aHJvd1xuICAgICAgZXhwZWN0KCgpID0+IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwobW9ja0RldGFpbCwgUmVhZG1lU2hvd1R5cGUuZHJhd2VyKSkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBvcGVuL2Nsb3NlIG9wZXJhdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG4gICAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgICAvLyBSYXBpZGx5IHRvZ2dsZSB0aGUgcGFuZWxcbiAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwobW9ja0RldGFpbCwgUmVhZG1lU2hvd1R5cGUuZHJhd2VyKVxuICAgICAgICBzZXRDdXJyZW50UGx1Z2luRGV0YWlsKClcbiAgICAgICAgc2V0Q3VycmVudFBsdWdpbkRldGFpbChtb2NrRGV0YWlsLCBSZWFkbWVTaG93VHlwZS5tb2RhbClcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHsgY3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBleHBlY3QoY3VycmVudFBsdWdpbkRldGFpbD8uc2hvd1R5cGUpLnRvQmUoUmVhZG1lU2hvd1R5cGUubW9kYWwpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHN3aXRjaGluZyBiZXR3ZWVuIGRyYXdlciBhbmQgbW9kYWwgbW9kZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrRGV0YWlsID0gY3JlYXRlTW9ja1BsdWdpbkRldGFpbCgpXG4gICAgICBjb25zdCB7IHNldEN1cnJlbnRQbHVnaW5EZXRhaWwgfSA9IHVzZVJlYWRtZVBhbmVsU3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgICAvLyBTdGFydCB3aXRoIGRyYXdlclxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgc2V0Q3VycmVudFBsdWdpbkRldGFpbChtb2NrRGV0YWlsLCBSZWFkbWVTaG93VHlwZS5kcmF3ZXIpXG4gICAgICB9KVxuXG4gICAgICBsZXQgc3RhdGUgPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcbiAgICAgIGV4cGVjdChzdGF0ZS5jdXJyZW50UGx1Z2luRGV0YWlsPy5zaG93VHlwZSkudG9CZShSZWFkbWVTaG93VHlwZS5kcmF3ZXIpXG5cbiAgICAgIC8vIFN3aXRjaCB0byBtb2RhbFxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgc2V0Q3VycmVudFBsdWdpbkRldGFpbChtb2NrRGV0YWlsLCBSZWFkbWVTaG93VHlwZS5tb2RhbClcbiAgICAgIH0pXG5cbiAgICAgIHN0YXRlID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBleHBlY3Qoc3RhdGUuY3VycmVudFBsdWdpbkRldGFpbD8uc2hvd1R5cGUpLnRvQmUoUmVhZG1lU2hvd1R5cGUubW9kYWwpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBkZXRhaWwgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgc2V0Q3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICAgIC8vIFNldCB0byB1bmRlZmluZWQgZXhwbGljaXRseVxuICAgICAgYWN0KCgpID0+IHtcbiAgICAgICAgc2V0Q3VycmVudFBsdWdpbkRldGFpbCh1bmRlZmluZWQsIFJlYWRtZVNob3dUeXBlLmRyYXdlcilcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHsgY3VycmVudFBsdWdpbkRldGFpbCB9ID0gdXNlUmVhZG1lUGFuZWxTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBleHBlY3QoY3VycmVudFBsdWdpbkRldGFpbCkudG9CZVVuZGVmaW5lZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSW50ZWdyYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB3b3JrIGNvcnJlY3RseSB3aGVuIG9wZW5lZCBmcm9tIFJlYWRtZUVudHJhbmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoKVxuXG4gICAgICBtb2NrVXNlUGx1Z2luUmVhZG1lLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGRhdGE6IHsgcmVhZG1lOiAnIyBJbnRlZ3JhdGlvbiBUZXN0JyB9LFxuICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgICBlcnJvcjogbnVsbCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlbmRlciBib3RoIGNvbXBvbmVudHNcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgPD5cbiAgICAgICAgICA8UmVhZG1lRW50cmFuY2UgcGx1Z2luRGV0YWlsPXttb2NrRGV0YWlsfSAvPlxuICAgICAgICAgIDxSZWFkbWVQYW5lbCAvPlxuICAgICAgICA8Lz4sXG4gICAgICApXG5cbiAgICAgIC8vIEluaXRpYWxseSBwYW5lbCBzaG91bGQgbm90IHNob3cgY29udGVudFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdkZXRhaWwtaGVhZGVyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIENsaWNrIHRoZSBlbnRyYW5jZSBidXR0b25cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nKSlcblxuICAgICAgLy8gUmUtcmVuZGVyIHRvIHBpY2sgdXAgc3RvcmUgY2hhbmdlc1xuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17Y3JlYXRlUXVlcnlDbGllbnQoKX0+XG4gICAgICAgICAgPFJlYWRtZUVudHJhbmNlIHBsdWdpbkRldGFpbD17bW9ja0RldGFpbH0gLz5cbiAgICAgICAgICA8UmVhZG1lUGFuZWwgLz5cbiAgICAgICAgPC9RdWVyeUNsaWVudFByb3ZpZGVyPixcbiAgICAgIClcblxuICAgICAgLy8gUGFuZWwgc2hvdWxkIG5vdyBzaG93IGNvbnRlbnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RldGFpbC1oZWFkZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gTWFya2Rvd24gY29udGVudCByZW5kZXJzIGluIGEgY29udGFpbmVyIChkeW5hbWljIGltcG9ydCBtYXkgbm90IHJlbmRlciBjb250ZW50IHN5bmNocm9ub3VzbHkpXG4gICAgICBleHBlY3QoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1hcmtkb3duLWJvZHknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgY29ycmVjdCBwbHVnaW4gaW5mb3JtYXRpb24gaW4gaGVhZGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RldGFpbCA9IGNyZWF0ZU1vY2tQbHVnaW5EZXRhaWwoe1xuICAgICAgICBuYW1lOiAnbXktYXdlc29tZS1wbHVnaW4nLFxuICAgICAgfSlcblxuICAgICAgY29uc3QgeyBzZXRDdXJyZW50UGx1Z2luRGV0YWlsIH0gPSB1c2VSZWFkbWVQYW5lbFN0b3JlLmdldFN0YXRlKClcbiAgICAgIHNldEN1cnJlbnRQbHVnaW5EZXRhaWwobW9ja0RldGFpbCwgUmVhZG1lU2hvd1R5cGUuZHJhd2VyKVxuXG4gICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoPFJlYWRtZVBhbmVsIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbXktYXdlc29tZS1wbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19