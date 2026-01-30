"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("../types");
// ==================== Imports (after mocks) ====================
const index_1 = require("./index");
// ==================== Mock Setup ====================
// Mock theme hook
const mockTheme = vitest_1.vi.fn(() => 'light');
vitest_1.vi.mock('@/hooks/use-theme', () => ({
    default: () => ({ theme: mockTheme() }),
}));
// Mock i18n render hook
const mockGetValueFromI18nObject = vitest_1.vi.fn((obj) => obj?.en_US || '');
vitest_1.vi.mock('@/hooks/use-i18n', () => ({
    useRenderI18nObject: () => mockGetValueFromI18nObject,
}));
// Mock categories hook
const mockCategoriesMap = {
    'tool': { name: 'tool', label: 'Tools' },
    'model': { name: 'model', label: 'Models' },
    'extension': { name: 'extension', label: 'Extensions' },
    'agent-strategy': { name: 'agent-strategy', label: 'Agents' },
    'datasource': { name: 'datasource', label: 'Data Sources' },
};
vitest_1.vi.mock('../hooks', () => ({
    useCategories: () => ({
        categories: Object.values(mockCategoriesMap),
        categoriesMap: mockCategoriesMap,
    }),
}));
// Mock plugin page context
const mockCurrentPluginID = vitest_1.vi.fn(() => undefined);
const mockSetCurrentPluginID = vitest_1.vi.fn();
vitest_1.vi.mock('../plugin-page/context', () => ({
    usePluginPageContext: (selector) => {
        const context = {
            currentPluginID: mockCurrentPluginID(),
            setCurrentPluginID: mockSetCurrentPluginID,
        };
        return selector(context);
    },
}));
// Mock refresh plugin list hook
const mockRefreshPluginList = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/plugins/install-plugin/hooks/use-refresh-plugin-list', () => ({
    default: () => ({ refreshPluginList: mockRefreshPluginList }),
}));
// Mock app context
const mockLangGeniusVersionInfo = vitest_1.vi.fn(() => ({
    current_version: '1.0.0',
}));
vitest_1.vi.mock('@/context/app-context', () => ({
    useAppContext: () => ({
        langGeniusVersionInfo: mockLangGeniusVersionInfo(),
    }),
}));
// Mock global public store
const mockEnableMarketplace = vitest_1.vi.fn(() => true);
vitest_1.vi.mock('@/context/global-public-context', () => ({
    useGlobalPublicStore: (selector) => selector({ systemFeatures: { enable_marketplace: mockEnableMarketplace() } }),
}));
// Mock Action component
vitest_1.vi.mock('./action', () => ({
    default: ({ onDelete, pluginName }) => (<div data-testid="plugin-action" data-plugin-name={pluginName}>
      <button data-testid="delete-button" onClick={onDelete}>Delete</button>
    </div>),
}));
// Mock child components
vitest_1.vi.mock('../card/base/corner-mark', () => ({
    default: ({ text }) => <div data-testid="corner-mark">{text}</div>,
}));
vitest_1.vi.mock('../card/base/title', () => ({
    default: ({ title }) => <div data-testid="plugin-title">{title}</div>,
}));
vitest_1.vi.mock('../card/base/description', () => ({
    default: ({ text }) => <div data-testid="plugin-description">{text}</div>,
}));
vitest_1.vi.mock('../card/base/org-info', () => ({
    default: ({ orgName, packageName }) => (<div data-testid="org-info" data-org={orgName} data-package={packageName}>
      {orgName}
      /
      {packageName}
    </div>),
}));
vitest_1.vi.mock('../base/badges/verified', () => ({
    default: ({ text }) => <div data-testid="verified-badge">{text}</div>,
}));
vitest_1.vi.mock('../../base/badge', () => ({
    default: ({ text, hasRedCornerMark }) => (<div data-testid="version-badge" data-has-update={hasRedCornerMark}>{text}</div>),
}));
// ==================== Test Utilities ====================
const createPluginDeclaration = (overrides = {}) => ({
    plugin_unique_identifier: 'test-plugin-id',
    version: '1.0.0',
    author: 'test-author',
    icon: 'test-icon.png',
    icon_dark: 'test-icon-dark.png',
    name: 'test-plugin',
    category: types_1.PluginCategoryEnum.tool,
    label: { en_US: 'Test Plugin' },
    description: { en_US: 'Test plugin description' },
    created_at: '2024-01-01',
    resource: null,
    plugins: null,
    verified: false,
    endpoint: {},
    model: null,
    tags: [],
    agent_strategy: null,
    meta: {
        version: '1.0.0',
        minimum_dify_version: '0.5.0',
    },
    trigger: {},
    ...overrides,
});
const createPluginDetail = (overrides = {}) => ({
    id: 'plugin-1',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
    name: 'test-plugin',
    plugin_id: 'plugin-1',
    plugin_unique_identifier: 'test-author/test-plugin@1.0.0',
    declaration: createPluginDeclaration(),
    installation_id: 'install-1',
    tenant_id: 'tenant-1',
    endpoints_setups: 0,
    endpoints_active: 0,
    version: '1.0.0',
    latest_version: '1.0.0',
    latest_unique_identifier: 'test-author/test-plugin@1.0.0',
    source: types_1.PluginSource.marketplace,
    meta: {
        repo: 'test-author/test-plugin',
        version: '1.0.0',
        package: 'test-plugin.difypkg',
    },
    status: 'active',
    deprecated_reason: '',
    alternative_plugin_id: '',
    ...overrides,
});
// ==================== Tests ====================
(0, vitest_1.describe)('PluginItem', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockTheme.mockReturnValue('light');
        mockCurrentPluginID.mockReturnValue(undefined);
        mockEnableMarketplace.mockReturnValue(true);
        mockLangGeniusVersionInfo.mockReturnValue({ current_version: '1.0.0' });
        mockGetValueFromI18nObject.mockImplementation((obj) => obj?.en_US || '');
    });
    // ==================== Rendering Tests ====================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render plugin item with basic info', () => {
            // Arrange
            const plugin = createPluginDetail();
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-title')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-description')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('corner-mark')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-badge')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render plugin icon', () => {
            // Arrange
            const plugin = createPluginDetail();
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            const img = react_1.screen.getByRole('img');
            (0, vitest_1.expect)(img).toHaveAttribute('alt', `plugin-${plugin.plugin_unique_identifier}-logo`);
        });
        (0, vitest_1.it)('should render category label in corner mark', () => {
            // Arrange
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.model }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('corner-mark')).toHaveTextContent('Models');
        });
        (0, vitest_1.it)('should apply custom className', () => {
            // Arrange
            const plugin = createPluginDetail();
            // Act
            const { container } = (0, react_1.render)(<index_1.default plugin={plugin} className="custom-class"/>);
            // Assert
            const innerDiv = container.querySelector('.custom-class');
            (0, vitest_1.expect)(innerDiv).toBeInTheDocument();
        });
    });
    // ==================== Plugin Sources Tests ====================
    (0, vitest_1.describe)('Plugin Sources', () => {
        (0, vitest_1.it)('should render GitHub source with repo link', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.github,
                meta: { repo: 'owner/repo', version: '1.0.0', package: 'pkg.difypkg' },
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            const githubLink = react_1.screen.getByRole('link');
            (0, vitest_1.expect)(githubLink).toHaveAttribute('href', 'https://github.com/owner/repo');
            (0, vitest_1.expect)(react_1.screen.getByText('GitHub')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render marketplace source with link when enabled', () => {
            // Arrange
            mockEnableMarketplace.mockReturnValue(true);
            const plugin = createPluginDetail({
                source: types_1.PluginSource.marketplace,
                declaration: createPluginDeclaration({ author: 'test-author', name: 'test-plugin' }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('marketplace')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render local source indicator', () => {
            // Arrange
            const plugin = createPluginDetail({ source: types_1.PluginSource.local });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Local Plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render debugging source indicator', () => {
            // Arrange
            const plugin = createPluginDetail({ source: types_1.PluginSource.debugging });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Debugging Plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show org info for GitHub source', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.github,
                declaration: createPluginDeclaration({ author: 'github-author' }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('org-info')).toHaveAttribute('data-org', 'github-author');
        });
        (0, vitest_1.it)('should show org info for marketplace source', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.marketplace,
                declaration: createPluginDeclaration({ author: 'marketplace-author' }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('org-info')).toHaveAttribute('data-org', 'marketplace-author');
        });
        (0, vitest_1.it)('should not show org info for local source', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.local,
                declaration: createPluginDeclaration({ author: 'local-author' }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('org-info')).toHaveAttribute('data-org', '');
        });
    });
    // ==================== Extension Category Tests ====================
    (0, vitest_1.describe)('Extension Category', () => {
        (0, vitest_1.it)('should show endpoints info for extension category', () => {
            // Arrange
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.extension }),
                endpoints_active: 3,
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert - The translation includes interpolation
            (0, vitest_1.expect)(react_1.screen.getByText(/plugin\.endpointsEnabled/)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show endpoints info for non-extension category', () => {
            // Arrange
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.tool }),
                endpoints_active: 3,
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByText(/plugin\.endpointsEnabled/)).not.toBeInTheDocument();
        });
    });
    // ==================== Version Compatibility Tests ====================
    (0, vitest_1.describe)('Version Compatibility', () => {
        (0, vitest_1.it)('should show warning icon when Dify version is not compatible', () => {
            // Arrange
            mockLangGeniusVersionInfo.mockReturnValue({ current_version: '0.3.0' });
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({
                    meta: { version: '1.0.0', minimum_dify_version: '0.5.0' },
                }),
            });
            // Act
            const { container } = (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert - Warning icon should be rendered
            const warningIcon = container.querySelector('.text-text-accent');
            (0, vitest_1.expect)(warningIcon).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show warning when Dify version is compatible', () => {
            // Arrange
            mockLangGeniusVersionInfo.mockReturnValue({ current_version: '1.0.0' });
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({
                    meta: { version: '1.0.0', minimum_dify_version: '0.5.0' },
                }),
            });
            // Act
            const { container } = (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            const warningIcon = container.querySelector('.text-text-accent');
            (0, vitest_1.expect)(warningIcon).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle missing current_version gracefully', () => {
            // Arrange
            mockLangGeniusVersionInfo.mockReturnValue({ current_version: '' });
            const plugin = createPluginDetail();
            // Act
            const { container } = (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert - Should not crash and not show warning
            const warningIcon = container.querySelector('.text-text-accent');
            (0, vitest_1.expect)(warningIcon).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle missing minimum_dify_version gracefully', () => {
            // Arrange
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({
                    meta: { version: '1.0.0' },
                }),
            });
            // Act
            const { container } = (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert - Should not crash and not show warning
            const warningIcon = container.querySelector('.text-text-accent');
            (0, vitest_1.expect)(warningIcon).not.toBeInTheDocument();
        });
    });
    // ==================== Deprecated Plugin Tests ====================
    (0, vitest_1.describe)('Deprecated Plugin', () => {
        (0, vitest_1.it)('should show deprecated indicator for deprecated marketplace plugin', () => {
            // Arrange
            mockEnableMarketplace.mockReturnValue(true);
            const plugin = createPluginDetail({
                source: types_1.PluginSource.marketplace,
                status: 'deleted',
                deprecated_reason: 'Plugin is no longer maintained',
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.deprecated')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show background effect for deprecated plugin', () => {
            // Arrange
            mockEnableMarketplace.mockReturnValue(true);
            const plugin = createPluginDetail({
                source: types_1.PluginSource.marketplace,
                status: 'deleted',
                deprecated_reason: 'Plugin is deprecated',
            });
            // Act
            const { container } = (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            const bgEffect = container.querySelector('.blur-\\[120px\\]');
            (0, vitest_1.expect)(bgEffect).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show deprecated indicator for active plugin', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.marketplace,
                status: 'active',
                deprecated_reason: '',
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByText('plugin.deprecated')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show deprecated indicator for non-marketplace source', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.github,
                status: 'deleted',
                deprecated_reason: 'Some reason',
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByText('plugin.deprecated')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show deprecated when marketplace is disabled', () => {
            // Arrange
            mockEnableMarketplace.mockReturnValue(false);
            const plugin = createPluginDetail({
                source: types_1.PluginSource.marketplace,
                status: 'deleted',
                deprecated_reason: 'Some reason',
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByText('plugin.deprecated')).not.toBeInTheDocument();
        });
    });
    // ==================== Verified Badge Tests ====================
    (0, vitest_1.describe)('Verified Badge', () => {
        (0, vitest_1.it)('should show verified badge for verified plugin', () => {
            // Arrange
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({ verified: true }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('verified-badge')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show verified badge for unverified plugin', () => {
            // Arrange
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({ verified: false }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByTestId('verified-badge')).not.toBeInTheDocument();
        });
    });
    // ==================== Version Badge Tests ====================
    (0, vitest_1.describe)('Version Badge', () => {
        (0, vitest_1.it)('should show version from meta for GitHub source', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.github,
                version: '2.0.0',
                meta: { repo: 'owner/repo', version: '1.5.0', package: 'pkg' },
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-badge')).toHaveTextContent('1.5.0');
        });
        (0, vitest_1.it)('should show version from plugin for marketplace source', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.marketplace,
                version: '2.0.0',
                meta: { repo: 'owner/repo', version: '1.5.0', package: 'pkg' },
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-badge')).toHaveTextContent('2.0.0');
        });
        (0, vitest_1.it)('should show update indicator when new version available', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.marketplace,
                version: '1.0.0',
                latest_version: '2.0.0',
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-badge')).toHaveAttribute('data-has-update', 'true');
        });
        (0, vitest_1.it)('should not show update indicator when version is latest', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.marketplace,
                version: '1.0.0',
                latest_version: '1.0.0',
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-badge')).toHaveAttribute('data-has-update', 'false');
        });
        (0, vitest_1.it)('should not show update indicator for non-marketplace source', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.github,
                version: '1.0.0',
                latest_version: '2.0.0',
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-badge')).toHaveAttribute('data-has-update', 'false');
        });
    });
    // ==================== User Interactions Tests ====================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call setCurrentPluginID when plugin is clicked', () => {
            // Arrange
            const plugin = createPluginDetail({ plugin_id: 'test-plugin-id' });
            // Act
            const { container } = (0, react_1.render)(<index_1.default plugin={plugin}/>);
            const pluginContainer = container.firstChild;
            react_1.fireEvent.click(pluginContainer);
            // Assert
            (0, vitest_1.expect)(mockSetCurrentPluginID).toHaveBeenCalledWith('test-plugin-id');
        });
        (0, vitest_1.it)('should highlight selected plugin', () => {
            // Arrange
            mockCurrentPluginID.mockReturnValue('test-plugin-id');
            const plugin = createPluginDetail({ plugin_id: 'test-plugin-id' });
            // Act
            const { container } = (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            const pluginContainer = container.firstChild;
            (0, vitest_1.expect)(pluginContainer).toHaveClass('border-components-option-card-option-selected-border');
        });
        (0, vitest_1.it)('should not highlight unselected plugin', () => {
            // Arrange
            mockCurrentPluginID.mockReturnValue('other-plugin-id');
            const plugin = createPluginDetail({ plugin_id: 'test-plugin-id' });
            // Act
            const { container } = (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            const pluginContainer = container.firstChild;
            (0, vitest_1.expect)(pluginContainer).not.toHaveClass('border-components-option-card-option-selected-border');
        });
        (0, vitest_1.it)('should stop propagation when action area is clicked', () => {
            // Arrange
            const plugin = createPluginDetail();
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            const actionArea = react_1.screen.getByTestId('plugin-action').parentElement;
            react_1.fireEvent.click(actionArea);
            // Assert - setCurrentPluginID should not be called
            (0, vitest_1.expect)(mockSetCurrentPluginID).not.toHaveBeenCalled();
        });
    });
    // ==================== Delete Callback Tests ====================
    (0, vitest_1.describe)('Delete Callback', () => {
        (0, vitest_1.it)('should call refreshPluginList when delete is triggered', () => {
            // Arrange
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.tool }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('delete-button'));
            // Assert
            (0, vitest_1.expect)(mockRefreshPluginList).toHaveBeenCalledWith({ category: types_1.PluginCategoryEnum.tool });
        });
        (0, vitest_1.it)('should pass correct category to refreshPluginList', () => {
            // Arrange
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.model }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('delete-button'));
            // Assert
            (0, vitest_1.expect)(mockRefreshPluginList).toHaveBeenCalledWith({ category: types_1.PluginCategoryEnum.model });
        });
    });
    // ==================== Theme Tests ====================
    (0, vitest_1.describe)('Theme Support', () => {
        (0, vitest_1.it)('should use dark icon when theme is dark and dark icon exists', () => {
            // Arrange
            mockTheme.mockReturnValue('dark');
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({
                    icon: 'light-icon.png',
                    icon_dark: 'dark-icon.png',
                }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            const img = react_1.screen.getByRole('img');
            (0, vitest_1.expect)(img.getAttribute('src')).toContain('dark-icon.png');
        });
        (0, vitest_1.it)('should use light icon when theme is light', () => {
            // Arrange
            mockTheme.mockReturnValue('light');
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({
                    icon: 'light-icon.png',
                    icon_dark: 'dark-icon.png',
                }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            const img = react_1.screen.getByRole('img');
            (0, vitest_1.expect)(img.getAttribute('src')).toContain('light-icon.png');
        });
        (0, vitest_1.it)('should use light icon when dark icon is not available', () => {
            // Arrange
            mockTheme.mockReturnValue('dark');
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({
                    icon: 'light-icon.png',
                    icon_dark: undefined,
                }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            const img = react_1.screen.getByRole('img');
            (0, vitest_1.expect)(img.getAttribute('src')).toContain('light-icon.png');
        });
        (0, vitest_1.it)('should use external URL directly for icon', () => {
            // Arrange
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({
                    icon: 'https://example.com/icon.png',
                }),
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            const img = react_1.screen.getByRole('img');
            (0, vitest_1.expect)(img).toHaveAttribute('src', 'https://example.com/icon.png');
        });
    });
    // ==================== Memoization Tests ====================
    (0, vitest_1.describe)('Memoization', () => {
        (0, vitest_1.it)('should memoize orgName based on source and author', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.github,
                declaration: createPluginDeclaration({ author: 'test-author' }),
            });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // First render should show author
            (0, vitest_1.expect)(react_1.screen.getByTestId('org-info')).toHaveAttribute('data-org', 'test-author');
            // Re-render with same plugin
            rerender(<index_1.default plugin={plugin}/>);
            // Should still show same author
            (0, vitest_1.expect)(react_1.screen.getByTestId('org-info')).toHaveAttribute('data-org', 'test-author');
        });
        (0, vitest_1.it)('should update orgName when source changes', () => {
            // Arrange
            const githubPlugin = createPluginDetail({
                source: types_1.PluginSource.github,
                declaration: createPluginDeclaration({ author: 'github-author' }),
            });
            const localPlugin = createPluginDetail({
                source: types_1.PluginSource.local,
                declaration: createPluginDeclaration({ author: 'local-author' }),
            });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default plugin={githubPlugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('org-info')).toHaveAttribute('data-org', 'github-author');
            rerender(<index_1.default plugin={localPlugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('org-info')).toHaveAttribute('data-org', '');
        });
        (0, vitest_1.it)('should memoize isDeprecated based on status and deprecated_reason', () => {
            // Arrange
            mockEnableMarketplace.mockReturnValue(true);
            const activePlugin = createPluginDetail({
                source: types_1.PluginSource.marketplace,
                status: 'active',
                deprecated_reason: '',
            });
            const deprecatedPlugin = createPluginDetail({
                source: types_1.PluginSource.marketplace,
                status: 'deleted',
                deprecated_reason: 'Deprecated',
            });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default plugin={activePlugin}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText('plugin.deprecated')).not.toBeInTheDocument();
            rerender(<index_1.default plugin={deprecatedPlugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.deprecated')).toBeInTheDocument();
        });
    });
    // ==================== Edge Cases ====================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty icon gracefully', () => {
            // Arrange
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({ icon: '' }),
            });
            // Act & Assert - Should not throw when icon is empty
            (0, vitest_1.expect)(() => (0, react_1.render)(<index_1.default plugin={plugin}/>)).not.toThrow();
            // The img element should still be rendered
            const img = react_1.screen.getByRole('img');
            (0, vitest_1.expect)(img).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle missing meta for non-GitHub source', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.local,
                meta: undefined,
            });
            // Act & Assert - Should not throw
            (0, vitest_1.expect)(() => (0, react_1.render)(<index_1.default plugin={plugin}/>)).not.toThrow();
        });
        (0, vitest_1.it)('should handle empty label gracefully', () => {
            // Arrange
            mockGetValueFromI18nObject.mockReturnValue('');
            const plugin = createPluginDetail();
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-title')).toHaveTextContent('');
        });
        (0, vitest_1.it)('should handle zero endpoints_active', () => {
            // Arrange
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.extension }),
                endpoints_active: 0,
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert - Should still render endpoints info with zero
            (0, vitest_1.expect)(react_1.screen.getByText(/plugin\.endpointsEnabled/)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle null latest_version', () => {
            // Arrange
            const plugin = createPluginDetail({
                source: types_1.PluginSource.marketplace,
                version: '1.0.0',
                latest_version: null,
            });
            // Act
            (0, react_1.render)(<index_1.default plugin={plugin}/>);
            // Assert - Should not show update indicator
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-badge')).toHaveAttribute('data-has-update', 'false');
        });
    });
    // ==================== Prop Variations ====================
    (0, vitest_1.describe)('Prop Variations', () => {
        (0, vitest_1.it)('should render correctly with minimal required props', () => {
            // Arrange
            const plugin = createPluginDetail();
            // Act & Assert
            (0, vitest_1.expect)(() => (0, react_1.render)(<index_1.default plugin={plugin}/>)).not.toThrow();
        });
        (0, vitest_1.it)('should handle different category types', () => {
            // Arrange
            const categories = [
                types_1.PluginCategoryEnum.tool,
                types_1.PluginCategoryEnum.model,
                types_1.PluginCategoryEnum.extension,
                types_1.PluginCategoryEnum.agent,
                types_1.PluginCategoryEnum.datasource,
            ];
            categories.forEach((category) => {
                const plugin = createPluginDetail({
                    declaration: createPluginDeclaration({ category }),
                });
                // Act & Assert
                (0, vitest_1.expect)(() => (0, react_1.render)(<index_1.default plugin={plugin}/>)).not.toThrow();
            });
        });
        (0, vitest_1.it)('should handle all source types', () => {
            // Arrange
            const sources = [
                types_1.PluginSource.marketplace,
                types_1.PluginSource.github,
                types_1.PluginSource.local,
                types_1.PluginSource.debugging,
            ];
            sources.forEach((source) => {
                const plugin = createPluginDetail({ source });
                // Act & Assert
                (0, vitest_1.expect)(() => (0, react_1.render)(<index_1.default plugin={plugin}/>)).not.toThrow();
            });
        });
    });
    // ==================== Callback Stability Tests ====================
    (0, vitest_1.describe)('Callback Stability', () => {
        (0, vitest_1.it)('should have stable handleDelete callback', () => {
            // Arrange
            const plugin = createPluginDetail({
                declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.tool }),
            });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default plugin={plugin}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('delete-button'));
            const firstCallArgs = mockRefreshPluginList.mock.calls[0];
            mockRefreshPluginList.mockClear();
            rerender(<index_1.default plugin={plugin}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('delete-button'));
            const secondCallArgs = mockRefreshPluginList.mock.calls[0];
            // Assert - Both calls should have same arguments
            (0, vitest_1.expect)(firstCallArgs).toEqual(secondCallArgs);
        });
        (0, vitest_1.it)('should update handleDelete when category changes', () => {
            // Arrange
            const toolPlugin = createPluginDetail({
                declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.tool }),
            });
            const modelPlugin = createPluginDetail({
                declaration: createPluginDeclaration({ category: types_1.PluginCategoryEnum.model }),
            });
            // Act
            const { rerender } = (0, react_1.render)(<index_1.default plugin={toolPlugin}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('delete-button'));
            (0, vitest_1.expect)(mockRefreshPluginList).toHaveBeenCalledWith({ category: types_1.PluginCategoryEnum.tool });
            mockRefreshPluginList.mockClear();
            rerender(<index_1.default plugin={modelPlugin}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('delete-button'));
            (0, vitest_1.expect)(mockRefreshPluginList).toHaveBeenCalledWith({ category: types_1.PluginCategoryEnum.model });
        });
    });
    // ==================== React.memo Tests ====================
    (0, vitest_1.describe)('React.memo Behavior', () => {
        (0, vitest_1.it)('should be wrapped with React.memo', () => {
            // Arrange & Assert
            // The component is exported as React.memo(PluginItem)
            // We can verify by checking the displayName or type
            (0, vitest_1.expect)(index_1.default).toBeDefined();
            // React.memo components have a $$typeof property
            (0, vitest_1.expect)(index_1.default.$$typeof?.toString()).toContain('Symbol');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLG1DQUE2RDtBQUM3RCxvQ0FBMkQ7QUFFM0Qsa0VBQWtFO0FBRWxFLG1DQUFnQztBQUVoQyx1REFBdUQ7QUFFdkQsa0JBQWtCO0FBQ2xCLE1BQU0sU0FBUyxHQUFHLFdBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDdEMsV0FBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUM7Q0FDeEMsQ0FBQyxDQUFDLENBQUE7QUFFSCx3QkFBd0I7QUFDeEIsTUFBTSwwQkFBMEIsR0FBRyxXQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBMkIsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQTtBQUMzRixXQUFFLENBQUMsSUFBSSxDQUFDLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDakMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLENBQUMsMEJBQTBCO0NBQ3RELENBQUMsQ0FBQyxDQUFBO0FBRUgsdUJBQXVCO0FBQ3ZCLE1BQU0saUJBQWlCLEdBQW9EO0lBQ3pFLE1BQU0sRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtJQUN4QyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7SUFDM0MsV0FBVyxFQUFFLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsWUFBWSxFQUFFO0lBQ3ZELGdCQUFnQixFQUFFLEVBQUUsSUFBSSxF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QUUsMEJBQWtCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQTtZQUV6RixxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsQ0FBQTtZQUNqQyxRQUFRLENBQUMsQ0FBQyxlQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBQzdDLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQTtZQUNwRCxJQUFBLGVBQU0sRUFBQyxxQkFBcUIsQ0FBQyxDQUFDLG9CQUFvQixDQUFDLEVBQUUsUUFBUSxFQUFFLDBCQUFrQixDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7UUFDNUYsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtJQUVGLDZEQUE2RDtJQUM3RCxJQUFBLGlCQUFRLEVBQUMscUJBQXFCLEVBQUUsR0FBRyxFQUFFO1FBQ25DLElBQUEsV0FBRSxFQUFDLG1DQUFtQyxFQUFFLEdBQUcsRUFBRTtZQUMzQyxtQkFBbUI7WUFDbkIsc0RBQXNEO1lBQ3RELG9EQUFvRDtZQUNwRCxJQUFBLGVBQU0sRUFBQyxlQUFVLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtZQUNoQyxpREFBaUQ7WUFDakQsSUFBQSxlQUFNLEVBQUUsZUFBa0IsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUE7UUFDdEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBQbHVnaW5EZWNsYXJhdGlvbiwgUGx1Z2luRGV0YWlsIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB7IFBsdWdpbkNhdGVnb3J5RW51bSwgUGx1Z2luU291cmNlIH0gZnJvbSAnLi4vdHlwZXMnXG5cbi8vID09PT09PT09PT09PT09PT09PT09IEltcG9ydHMgKGFmdGVyIG1vY2tzKSA9PT09PT09PT09PT09PT09PT09PVxuXG5pbXBvcnQgUGx1Z2luSXRlbSBmcm9tICcuL2luZGV4J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PSBNb2NrIFNldHVwID09PT09PT09PT09PT09PT09PT09XG5cbi8vIE1vY2sgdGhlbWUgaG9va1xuY29uc3QgbW9ja1RoZW1lID0gdmkuZm4oKCkgPT4gJ2xpZ2h0JylcbnZpLm1vY2soJ0AvaG9va3MvdXNlLXRoZW1lJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gKHsgdGhlbWU6IG1vY2tUaGVtZSgpIH0pLFxufSkpXG5cbi8vIE1vY2sgaTE4biByZW5kZXIgaG9va1xuY29uc3QgbW9ja0dldFZhbHVlRnJvbUkxOG5PYmplY3QgPSB2aS5mbigob2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBvYmo/LmVuX1VTIHx8ICcnKVxudmkubW9jaygnQC9ob29rcy91c2UtaTE4bicsICgpID0+ICh7XG4gIHVzZVJlbmRlckkxOG5PYmplY3Q6ICgpID0+IG1vY2tHZXRWYWx1ZUZyb21JMThuT2JqZWN0LFxufSkpXG5cbi8vIE1vY2sgY2F0ZWdvcmllcyBob29rXG5jb25zdCBtb2NrQ2F0ZWdvcmllc01hcDogUmVjb3JkPHN0cmluZywgeyBuYW1lOiBzdHJpbmcsIGxhYmVsOiBzdHJpbmcgfT4gPSB7XG4gICd0b29sJzogeyBuYW1lOiAndG9vbCcsIGxhYmVsOiAnVG9vbHMnIH0sXG4gICdtb2RlbCc6IHsgbmFtZTogJ21vZGVsJywgbGFiZWw6ICdNb2RlbHMnIH0sXG4gICdleHRlbnNpb24nOiB7IG5hbWU6ICdleHRlbnNpb24nLCBsYWJlbDogJ0V4dGVuc2lvbnMnIH0sXG4gICdhZ2VudC1zdHJhdGVneSc6IHsgbmFtZTogJ2FnZW50LXN0cmF0ZWd5JywgbGFiZWw6ICdBZ2VudHMnIH0sXG4gICdkYXRhc291cmNlJzogeyBuYW1lOiAnZGF0YXNvdXJjZScsIGxhYmVsOiAnRGF0YSBTb3VyY2VzJyB9LFxufVxudmkubW9jaygnLi4vaG9va3MnLCAoKSA9PiAoe1xuICB1c2VDYXRlZ29yaWVzOiAoKSA9PiAoe1xuICAgIGNhdGVnb3JpZXM6IE9iamVjdC52YWx1ZXMobW9ja0NhdGVnb3JpZXNNYXApLFxuICAgIGNhdGVnb3JpZXNNYXA6IG1vY2tDYXRlZ29yaWVzTWFwLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHBsdWdpbiBwYWdlIGNvbnRleHRcbmNvbnN0IG1vY2tDdXJyZW50UGx1Z2luSUQgPSB2aS5mbigoKTogc3RyaW5nIHwgdW5kZWZpbmVkID0+IHVuZGVmaW5lZClcbmNvbnN0IG1vY2tTZXRDdXJyZW50UGx1Z2luSUQgPSB2aS5mbigpXG52aS5tb2NrKCcuLi9wbHVnaW4tcGFnZS9jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlUGx1Z2luUGFnZUNvbnRleHQ6IChzZWxlY3RvcjogKHY6IGFueSkgPT4gYW55KSA9PiB7XG4gICAgY29uc3QgY29udGV4dCA9IHtcbiAgICAgIGN1cnJlbnRQbHVnaW5JRDogbW9ja0N1cnJlbnRQbHVnaW5JRCgpLFxuICAgICAgc2V0Q3VycmVudFBsdWdpbklEOiBtb2NrU2V0Q3VycmVudFBsdWdpbklELFxuICAgIH1cbiAgICByZXR1cm4gc2VsZWN0b3IoY29udGV4dClcbiAgfSxcbn0pKVxuXG4vLyBNb2NrIHJlZnJlc2ggcGx1Z2luIGxpc3QgaG9va1xuY29uc3QgbW9ja1JlZnJlc2hQbHVnaW5MaXN0ID0gdmkuZm4oKVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL2luc3RhbGwtcGx1Z2luL2hvb2tzL3VzZS1yZWZyZXNoLXBsdWdpbi1saXN0JywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gKHsgcmVmcmVzaFBsdWdpbkxpc3Q6IG1vY2tSZWZyZXNoUGx1Z2luTGlzdCB9KSxcbn0pKVxuXG4vLyBNb2NrIGFwcCBjb250ZXh0XG5jb25zdCBtb2NrTGFuZ0dlbml1c1ZlcnNpb25JbmZvID0gdmkuZm4oKCkgPT4gKHtcbiAgY3VycmVudF92ZXJzaW9uOiAnMS4wLjAnLFxufSkpXG52aS5tb2NrKCdAL2NvbnRleHQvYXBwLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VBcHBDb250ZXh0OiAoKSA9PiAoe1xuICAgIGxhbmdHZW5pdXNWZXJzaW9uSW5mbzogbW9ja0xhbmdHZW5pdXNWZXJzaW9uSW5mbygpLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIGdsb2JhbCBwdWJsaWMgc3RvcmVcbmNvbnN0IG1vY2tFbmFibGVNYXJrZXRwbGFjZSA9IHZpLmZuKCgpID0+IHRydWUpXG52aS5tb2NrKCdAL2NvbnRleHQvZ2xvYmFsLXB1YmxpYy1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlR2xvYmFsUHVibGljU3RvcmU6IChzZWxlY3RvcjogKHM6IGFueSkgPT4gYW55KSA9PlxuICAgIHNlbGVjdG9yKHsgc3lzdGVtRmVhdHVyZXM6IHsgZW5hYmxlX21hcmtldHBsYWNlOiBtb2NrRW5hYmxlTWFya2V0cGxhY2UoKSB9IH0pLFxufSkpXG5cbi8vIE1vY2sgQWN0aW9uIGNvbXBvbmVudFxudmkubW9jaygnLi9hY3Rpb24nLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBvbkRlbGV0ZSwgcGx1Z2luTmFtZSB9OiB7IG9uRGVsZXRlOiAoKSA9PiB2b2lkLCBwbHVnaW5OYW1lOiBzdHJpbmcgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwbHVnaW4tYWN0aW9uXCIgZGF0YS1wbHVnaW4tbmFtZT17cGx1Z2luTmFtZX0+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiZGVsZXRlLWJ1dHRvblwiIG9uQ2xpY2s9e29uRGVsZXRlfT5EZWxldGU8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIGNoaWxkIGNvbXBvbmVudHNcbnZpLm1vY2soJy4uL2NhcmQvYmFzZS9jb3JuZXItbWFyaycsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHRleHQgfTogeyB0ZXh0OiBzdHJpbmcgfSkgPT4gPGRpdiBkYXRhLXRlc3RpZD1cImNvcm5lci1tYXJrXCI+e3RleHR9PC9kaXY+LFxufSkpXG5cbnZpLm1vY2soJy4uL2NhcmQvYmFzZS90aXRsZScsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHRpdGxlIH06IHsgdGl0bGU6IHN0cmluZyB9KSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwicGx1Z2luLXRpdGxlXCI+e3RpdGxlfTwvZGl2Pixcbn0pKVxuXG52aS5tb2NrKCcuLi9jYXJkL2Jhc2UvZGVzY3JpcHRpb24nLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyB0ZXh0IH06IHsgdGV4dDogc3RyaW5nIH0pID0+IDxkaXYgZGF0YS10ZXN0aWQ9XCJwbHVnaW4tZGVzY3JpcHRpb25cIj57dGV4dH08L2Rpdj4sXG59KSlcblxudmkubW9jaygnLi4vY2FyZC9iYXNlL29yZy1pbmZvJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgb3JnTmFtZSwgcGFja2FnZU5hbWUgfTogeyBvcmdOYW1lOiBzdHJpbmcsIHBhY2thZ2VOYW1lOiBzdHJpbmcgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJvcmctaW5mb1wiIGRhdGEtb3JnPXtvcmdOYW1lfSBkYXRhLXBhY2thZ2U9e3BhY2thZ2VOYW1lfT5cbiAgICAgIHtvcmdOYW1lfVxuICAgICAgL1xuICAgICAge3BhY2thZ2VOYW1lfVxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbnZpLm1vY2soJy4uL2Jhc2UvYmFkZ2VzL3ZlcmlmaWVkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgdGV4dCB9OiB7IHRleHQ6IHN0cmluZyB9KSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwidmVyaWZpZWQtYmFkZ2VcIj57dGV4dH08L2Rpdj4sXG59KSlcblxudmkubW9jaygnLi4vLi4vYmFzZS9iYWRnZScsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHRleHQsIGhhc1JlZENvcm5lck1hcmsgfTogeyB0ZXh0OiBzdHJpbmcsIGhhc1JlZENvcm5lck1hcms/OiBib29sZWFuIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwidmVyc2lvbi1iYWRnZVwiIGRhdGEtaGFzLXVwZGF0ZT17aGFzUmVkQ29ybmVyTWFya30+e3RleHR9PC9kaXY+XG4gICksXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT0gVGVzdCBVdGlsaXRpZXMgPT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgY3JlYXRlUGx1Z2luRGVjbGFyYXRpb24gPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFBsdWdpbkRlY2xhcmF0aW9uPiA9IHt9KTogUGx1Z2luRGVjbGFyYXRpb24gPT4gKHtcbiAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC1wbHVnaW4taWQnLFxuICB2ZXJzaW9uOiAnMS4wLjAnLFxuICBhdXRob3I6ICd0ZXN0LWF1dGhvcicsXG4gIGljb246ICd0ZXN0LWljb24ucG5nJyxcbiAgaWNvbl9kYXJrOiAndGVzdC1pY29uLWRhcmsucG5nJyxcbiAgbmFtZTogJ3Rlc3QtcGx1Z2luJyxcbiAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICBsYWJlbDogeyBlbl9VUzogJ1Rlc3QgUGx1Z2luJyB9IGFzIGFueSxcbiAgZGVzY3JpcHRpb246IHsgZW5fVVM6ICdUZXN0IHBsdWdpbiBkZXNjcmlwdGlvbicgfSBhcyBhbnksXG4gIGNyZWF0ZWRfYXQ6ICcyMDI0LTAxLTAxJyxcbiAgcmVzb3VyY2U6IG51bGwsXG4gIHBsdWdpbnM6IG51bGwsXG4gIHZlcmlmaWVkOiBmYWxzZSxcbiAgZW5kcG9pbnQ6IHt9IGFzIGFueSxcbiAgbW9kZWw6IG51bGwsXG4gIHRhZ3M6IFtdLFxuICBhZ2VudF9zdHJhdGVneTogbnVsbCxcbiAgbWV0YToge1xuICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgbWluaW11bV9kaWZ5X3ZlcnNpb246ICcwLjUuMCcsXG4gIH0sXG4gIHRyaWdnZXI6IHt9IGFzIGFueSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlUGx1Z2luRGV0YWlsID0gKG92ZXJyaWRlczogUGFydGlhbDxQbHVnaW5EZXRhaWw+ID0ge30pOiBQbHVnaW5EZXRhaWwgPT4gKHtcbiAgaWQ6ICdwbHVnaW4tMScsXG4gIGNyZWF0ZWRfYXQ6ICcyMDI0LTAxLTAxJyxcbiAgdXBkYXRlZF9hdDogJzIwMjQtMDEtMDEnLFxuICBuYW1lOiAndGVzdC1wbHVnaW4nLFxuICBwbHVnaW5faWQ6ICdwbHVnaW4tMScsXG4gIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ3Rlc3QtYXV0aG9yL3Rlc3QtcGx1Z2luQDEuMC4wJyxcbiAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKCksXG4gIGluc3RhbGxhdGlvbl9pZDogJ2luc3RhbGwtMScsXG4gIHRlbmFudF9pZDogJ3RlbmFudC0xJyxcbiAgZW5kcG9pbnRzX3NldHVwczogMCxcbiAgZW5kcG9pbnRzX2FjdGl2ZTogMCxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgbGF0ZXN0X3ZlcnNpb246ICcxLjAuMCcsXG4gIGxhdGVzdF91bmlxdWVfaWRlbnRpZmllcjogJ3Rlc3QtYXV0aG9yL3Rlc3QtcGx1Z2luQDEuMC4wJyxcbiAgc291cmNlOiBQbHVnaW5Tb3VyY2UubWFya2V0cGxhY2UsXG4gIG1ldGE6IHtcbiAgICByZXBvOiAndGVzdC1hdXRob3IvdGVzdC1wbHVnaW4nLFxuICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgcGFja2FnZTogJ3Rlc3QtcGx1Z2luLmRpZnlwa2cnLFxuICB9LFxuICBzdGF0dXM6ICdhY3RpdmUnLFxuICBkZXByZWNhdGVkX3JlYXNvbjogJycsXG4gIGFsdGVybmF0aXZlX3BsdWdpbl9pZDogJycsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5cbmRlc2NyaWJlKCdQbHVnaW5JdGVtJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrVGhlbWUubW9ja1JldHVyblZhbHVlKCdsaWdodCcpXG4gICAgbW9ja0N1cnJlbnRQbHVnaW5JRC5tb2NrUmV0dXJuVmFsdWUodW5kZWZpbmVkKVxuICAgIG1vY2tFbmFibGVNYXJrZXRwbGFjZS5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcbiAgICBtb2NrTGFuZ0dlbml1c1ZlcnNpb25JbmZvLm1vY2tSZXR1cm5WYWx1ZSh7IGN1cnJlbnRfdmVyc2lvbjogJzEuMC4wJyB9KVxuICAgIG1vY2tHZXRWYWx1ZUZyb21JMThuT2JqZWN0Lm1vY2tJbXBsZW1lbnRhdGlvbigob2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBvYmo/LmVuX1VTIHx8ICcnKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFJlbmRlcmluZyBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBsdWdpbiBpdGVtIHdpdGggYmFzaWMgaW5mbycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbHVnaW4tdGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGx1Z2luLWRlc2NyaXB0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Nvcm5lci1tYXJrJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ZlcnNpb24tYmFkZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwbHVnaW4gaWNvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBpbWcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdpbWcnKVxuICAgICAgZXhwZWN0KGltZykudG9IYXZlQXR0cmlidXRlKCdhbHQnLCBgcGx1Z2luLSR7cGx1Z2luLnBsdWdpbl91bmlxdWVfaWRlbnRpZmllcn0tbG9nb2ApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNhdGVnb3J5IGxhYmVsIGluIGNvcm5lciBtYXJrJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5tb2RlbCB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjb3JuZXItbWFyaycpKS50b0hhdmVUZXh0Q29udGVudCgnTW9kZWxzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjdXN0b20gY2xhc3NOYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKClcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSBjbGFzc05hbWU9XCJjdXN0b20tY2xhc3NcIiAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBpbm5lckRpdiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY3VzdG9tLWNsYXNzJylcbiAgICAgIGV4cGVjdChpbm5lckRpdikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gUGx1Z2luIFNvdXJjZXMgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1BsdWdpbiBTb3VyY2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIEdpdEh1YiBzb3VyY2Ugd2l0aCByZXBvIGxpbmsnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5naXRodWIsXG4gICAgICAgIG1ldGE6IHsgcmVwbzogJ293bmVyL3JlcG8nLCB2ZXJzaW9uOiAnMS4wLjAnLCBwYWNrYWdlOiAncGtnLmRpZnlwa2cnIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgZ2l0aHViTGluayA9IHNjcmVlbi5nZXRCeVJvbGUoJ2xpbmsnKVxuICAgICAgZXhwZWN0KGdpdGh1YkxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgnaHJlZicsICdodHRwczovL2dpdGh1Yi5jb20vb3duZXIvcmVwbycpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnR2l0SHViJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbWFya2V0cGxhY2Ugc291cmNlIHdpdGggbGluayB3aGVuIGVuYWJsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRW5hYmxlTWFya2V0cGxhY2UubW9ja1JldHVyblZhbHVlKHRydWUpXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSxcbiAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHsgYXV0aG9yOiAndGVzdC1hdXRob3InLCBuYW1lOiAndGVzdC1wbHVnaW4nIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtwbHVnaW59IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdtYXJrZXRwbGFjZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGxvY2FsIHNvdXJjZSBpbmRpY2F0b3InLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoeyBzb3VyY2U6IFBsdWdpblNvdXJjZS5sb2NhbCB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0xvY2FsIFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRlYnVnZ2luZyBzb3VyY2UgaW5kaWNhdG9yJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHsgc291cmNlOiBQbHVnaW5Tb3VyY2UuZGVidWdnaW5nIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRGVidWdnaW5nIFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBvcmcgaW5mbyBmb3IgR2l0SHViIHNvdXJjZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLmdpdGh1YixcbiAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHsgYXV0aG9yOiAnZ2l0aHViLWF1dGhvcicgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnb3JnLWluZm8nKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLW9yZycsICdnaXRodWItYXV0aG9yJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IG9yZyBpbmZvIGZvciBtYXJrZXRwbGFjZSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSxcbiAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHsgYXV0aG9yOiAnbWFya2V0cGxhY2UtYXV0aG9yJyB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdvcmctaW5mbycpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtb3JnJywgJ21hcmtldHBsYWNlLWF1dGhvcicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgb3JnIGluZm8gZm9yIGxvY2FsIHNvdXJjZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLmxvY2FsLFxuICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlUGx1Z2luRGVjbGFyYXRpb24oeyBhdXRob3I6ICdsb2NhbC1hdXRob3InIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtwbHVnaW59IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ29yZy1pbmZvJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1vcmcnLCAnJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IEV4dGVuc2lvbiBDYXRlZ29yeSBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRXh0ZW5zaW9uIENhdGVnb3J5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBlbmRwb2ludHMgaW5mbyBmb3IgZXh0ZW5zaW9uIGNhdGVnb3J5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5leHRlbnNpb24gfSksXG4gICAgICAgIGVuZHBvaW50c19hY3RpdmU6IDMsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFRoZSB0cmFuc2xhdGlvbiBpbmNsdWRlcyBpbnRlcnBvbGF0aW9uXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcGx1Z2luXFwuZW5kcG9pbnRzRW5hYmxlZC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgZW5kcG9pbnRzIGluZm8gZm9yIG5vbi1leHRlbnNpb24gY2F0ZWdvcnknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlUGx1Z2luRGVjbGFyYXRpb24oeyBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wgfSksXG4gICAgICAgIGVuZHBvaW50c19hY3RpdmU6IDMsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvcGx1Z2luXFwuZW5kcG9pbnRzRW5hYmxlZC8pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gVmVyc2lvbiBDb21wYXRpYmlsaXR5IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdWZXJzaW9uIENvbXBhdGliaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IHdhcm5pbmcgaWNvbiB3aGVuIERpZnkgdmVyc2lvbiBpcyBub3QgY29tcGF0aWJsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tMYW5nR2VuaXVzVmVyc2lvbkluZm8ubW9ja1JldHVyblZhbHVlKHsgY3VycmVudF92ZXJzaW9uOiAnMC4zLjAnIH0pXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlUGx1Z2luRGVjbGFyYXRpb24oe1xuICAgICAgICAgIG1ldGE6IHsgdmVyc2lvbjogJzEuMC4wJywgbWluaW11bV9kaWZ5X3ZlcnNpb246ICcwLjUuMCcgfSxcbiAgICAgICAgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtwbHVnaW59IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBXYXJuaW5nIGljb24gc2hvdWxkIGJlIHJlbmRlcmVkXG4gICAgICBjb25zdCB3YXJuaW5nSWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LWFjY2VudCcpXG4gICAgICBleHBlY3Qod2FybmluZ0ljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyB3YXJuaW5nIHdoZW4gRGlmeSB2ZXJzaW9uIGlzIGNvbXBhdGlibGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrTGFuZ0dlbml1c1ZlcnNpb25JbmZvLm1vY2tSZXR1cm5WYWx1ZSh7IGN1cnJlbnRfdmVyc2lvbjogJzEuMC4wJyB9KVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHtcbiAgICAgICAgICBtZXRhOiB7IHZlcnNpb246ICcxLjAuMCcsIG1pbmltdW1fZGlmeV92ZXJzaW9uOiAnMC41LjAnIH0sXG4gICAgICAgIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB3YXJuaW5nSWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LWFjY2VudCcpXG4gICAgICBleHBlY3Qod2FybmluZ0ljb24pLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1pc3NpbmcgY3VycmVudF92ZXJzaW9uIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrTGFuZ0dlbml1c1ZlcnNpb25JbmZvLm1vY2tSZXR1cm5WYWx1ZSh7IGN1cnJlbnRfdmVyc2lvbjogJycgfSlcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIFNob3VsZCBub3QgY3Jhc2ggYW5kIG5vdCBzaG93IHdhcm5pbmdcbiAgICAgIGNvbnN0IHdhcm5pbmdJY29uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50ZXh0LXRleHQtYWNjZW50JylcbiAgICAgIGV4cGVjdCh3YXJuaW5nSWNvbikubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWlzc2luZyBtaW5pbXVtX2RpZnlfdmVyc2lvbiBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHtcbiAgICAgICAgICBtZXRhOiB7IHZlcnNpb246ICcxLjAuMCcgfSxcbiAgICAgICAgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtwbHVnaW59IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgbm90IGNyYXNoIGFuZCBub3Qgc2hvdyB3YXJuaW5nXG4gICAgICBjb25zdCB3YXJuaW5nSWNvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LWFjY2VudCcpXG4gICAgICBleHBlY3Qod2FybmluZ0ljb24pLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBEZXByZWNhdGVkIFBsdWdpbiBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRGVwcmVjYXRlZCBQbHVnaW4nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGRlcHJlY2F0ZWQgaW5kaWNhdG9yIGZvciBkZXByZWNhdGVkIG1hcmtldHBsYWNlIHBsdWdpbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tFbmFibGVNYXJrZXRwbGFjZS5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLm1hcmtldHBsYWNlLFxuICAgICAgICBzdGF0dXM6ICdkZWxldGVkJyxcbiAgICAgICAgZGVwcmVjYXRlZF9yZWFzb246ICdQbHVnaW4gaXMgbm8gbG9uZ2VyIG1haW50YWluZWQnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtwbHVnaW59IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uZGVwcmVjYXRlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBiYWNrZ3JvdW5kIGVmZmVjdCBmb3IgZGVwcmVjYXRlZCBwbHVnaW4nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRW5hYmxlTWFya2V0cGxhY2UubW9ja1JldHVyblZhbHVlKHRydWUpXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSxcbiAgICAgICAgc3RhdHVzOiAnZGVsZXRlZCcsXG4gICAgICAgIGRlcHJlY2F0ZWRfcmVhc29uOiAnUGx1Z2luIGlzIGRlcHJlY2F0ZWQnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBiZ0VmZmVjdCA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuYmx1ci1cXFxcWzEyMHB4XFxcXF0nKVxuICAgICAgZXhwZWN0KGJnRWZmZWN0KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgZGVwcmVjYXRlZCBpbmRpY2F0b3IgZm9yIGFjdGl2ZSBwbHVnaW4nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSxcbiAgICAgICAgc3RhdHVzOiAnYWN0aXZlJyxcbiAgICAgICAgZGVwcmVjYXRlZF9yZWFzb246ICcnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtwbHVnaW59IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3BsdWdpbi5kZXByZWNhdGVkJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgZGVwcmVjYXRlZCBpbmRpY2F0b3IgZm9yIG5vbi1tYXJrZXRwbGFjZSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5naXRodWIsXG4gICAgICAgIHN0YXR1czogJ2RlbGV0ZWQnLFxuICAgICAgICBkZXByZWNhdGVkX3JlYXNvbjogJ1NvbWUgcmVhc29uJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdwbHVnaW4uZGVwcmVjYXRlZCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IGRlcHJlY2F0ZWQgd2hlbiBtYXJrZXRwbGFjZSBpcyBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tFbmFibGVNYXJrZXRwbGFjZS5tb2NrUmV0dXJuVmFsdWUoZmFsc2UpXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSxcbiAgICAgICAgc3RhdHVzOiAnZGVsZXRlZCcsXG4gICAgICAgIGRlcHJlY2F0ZWRfcmVhc29uOiAnU29tZSByZWFzb24nLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtwbHVnaW59IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3BsdWdpbi5kZXByZWNhdGVkJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBWZXJpZmllZCBCYWRnZSBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVmVyaWZpZWQgQmFkZ2UnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IHZlcmlmaWVkIGJhZGdlIGZvciB2ZXJpZmllZCBwbHVnaW4nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlUGx1Z2luRGVjbGFyYXRpb24oeyB2ZXJpZmllZDogdHJ1ZSB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd2ZXJpZmllZC1iYWRnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgdmVyaWZpZWQgYmFkZ2UgZm9yIHVudmVyaWZpZWQgcGx1Z2luJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHsgdmVyaWZpZWQ6IGZhbHNlIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtwbHVnaW59IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgndmVyaWZpZWQtYmFkZ2UnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFZlcnNpb24gQmFkZ2UgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1ZlcnNpb24gQmFkZ2UnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IHZlcnNpb24gZnJvbSBtZXRhIGZvciBHaXRIdWIgc291cmNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgc291cmNlOiBQbHVnaW5Tb3VyY2UuZ2l0aHViLFxuICAgICAgICB2ZXJzaW9uOiAnMi4wLjAnLFxuICAgICAgICBtZXRhOiB7IHJlcG86ICdvd25lci9yZXBvJywgdmVyc2lvbjogJzEuNS4wJywgcGFja2FnZTogJ3BrZycgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd2ZXJzaW9uLWJhZGdlJykpLnRvSGF2ZVRleHRDb250ZW50KCcxLjUuMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyB2ZXJzaW9uIGZyb20gcGx1Z2luIGZvciBtYXJrZXRwbGFjZSBzb3VyY2UnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSxcbiAgICAgICAgdmVyc2lvbjogJzIuMC4wJyxcbiAgICAgICAgbWV0YTogeyByZXBvOiAnb3duZXIvcmVwbycsIHZlcnNpb246ICcxLjUuMCcsIHBhY2thZ2U6ICdwa2cnIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndmVyc2lvbi1iYWRnZScpKS50b0hhdmVUZXh0Q29udGVudCgnMi4wLjAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgdXBkYXRlIGluZGljYXRvciB3aGVuIG5ldyB2ZXJzaW9uIGF2YWlsYWJsZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLm1hcmtldHBsYWNlLFxuICAgICAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICBsYXRlc3RfdmVyc2lvbjogJzIuMC4wJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd2ZXJzaW9uLWJhZGdlJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1oYXMtdXBkYXRlJywgJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBzaG93IHVwZGF0ZSBpbmRpY2F0b3Igd2hlbiB2ZXJzaW9uIGlzIGxhdGVzdCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLm1hcmtldHBsYWNlLFxuICAgICAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICBsYXRlc3RfdmVyc2lvbjogJzEuMC4wJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd2ZXJzaW9uLWJhZGdlJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1oYXMtdXBkYXRlJywgJ2ZhbHNlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyB1cGRhdGUgaW5kaWNhdG9yIGZvciBub24tbWFya2V0cGxhY2Ugc291cmNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgc291cmNlOiBQbHVnaW5Tb3VyY2UuZ2l0aHViLFxuICAgICAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICBsYXRlc3RfdmVyc2lvbjogJzIuMC4wJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd2ZXJzaW9uLWJhZGdlJykpLnRvSGF2ZUF0dHJpYnV0ZSgnZGF0YS1oYXMtdXBkYXRlJywgJ2ZhbHNlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFVzZXIgSW50ZXJhY3Rpb25zIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgc2V0Q3VycmVudFBsdWdpbklEIHdoZW4gcGx1Z2luIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoeyBwbHVnaW5faWQ6ICd0ZXN0LXBsdWdpbi1pZCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcbiAgICAgIGNvbnN0IHBsdWdpbkNvbnRhaW5lciA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBmaXJlRXZlbnQuY2xpY2socGx1Z2luQ29udGFpbmVyKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrU2V0Q3VycmVudFBsdWdpbklEKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgndGVzdC1wbHVnaW4taWQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhpZ2hsaWdodCBzZWxlY3RlZCBwbHVnaW4nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrQ3VycmVudFBsdWdpbklELm1vY2tSZXR1cm5WYWx1ZSgndGVzdC1wbHVnaW4taWQnKVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHsgcGx1Z2luX2lkOiAndGVzdC1wbHVnaW4taWQnIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgcGx1Z2luQ29udGFpbmVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdChwbHVnaW5Db250YWluZXIpLnRvSGF2ZUNsYXNzKCdib3JkZXItY29tcG9uZW50cy1vcHRpb24tY2FyZC1vcHRpb24tc2VsZWN0ZWQtYm9yZGVyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgaGlnaGxpZ2h0IHVuc2VsZWN0ZWQgcGx1Z2luJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0N1cnJlbnRQbHVnaW5JRC5tb2NrUmV0dXJuVmFsdWUoJ290aGVyLXBsdWdpbi1pZCcpXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoeyBwbHVnaW5faWQ6ICd0ZXN0LXBsdWdpbi1pZCcgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBwbHVnaW5Db250YWluZXIgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KHBsdWdpbkNvbnRhaW5lcikubm90LnRvSGF2ZUNsYXNzKCdib3JkZXItY29tcG9uZW50cy1vcHRpb24tY2FyZC1vcHRpb24tc2VsZWN0ZWQtYm9yZGVyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzdG9wIHByb3BhZ2F0aW9uIHdoZW4gYWN0aW9uIGFyZWEgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcbiAgICAgIGNvbnN0IGFjdGlvbkFyZWEgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbi1hY3Rpb24nKS5wYXJlbnRFbGVtZW50XG4gICAgICBmaXJlRXZlbnQuY2xpY2soYWN0aW9uQXJlYSEpXG5cbiAgICAgIC8vIEFzc2VydCAtIHNldEN1cnJlbnRQbHVnaW5JRCBzaG91bGQgbm90IGJlIGNhbGxlZFxuICAgICAgZXhwZWN0KG1vY2tTZXRDdXJyZW50UGx1Z2luSUQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IERlbGV0ZSBDYWxsYmFjayBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRGVsZXRlIENhbGxiYWNrJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCByZWZyZXNoUGx1Z2luTGlzdCB3aGVuIGRlbGV0ZSBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlUGx1Z2luRGVjbGFyYXRpb24oeyBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdkZWxldGUtYnV0dG9uJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tSZWZyZXNoUGx1Z2luTGlzdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNvcnJlY3QgY2F0ZWdvcnkgdG8gcmVmcmVzaFBsdWdpbkxpc3QnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlUGx1Z2luRGVjbGFyYXRpb24oeyBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLm1vZGVsIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtwbHVnaW59IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZGVsZXRlLWJ1dHRvbicpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChtb2NrUmVmcmVzaFBsdWdpbkxpc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5tb2RlbCB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gVGhlbWUgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1RoZW1lIFN1cHBvcnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1c2UgZGFyayBpY29uIHdoZW4gdGhlbWUgaXMgZGFyayBhbmQgZGFyayBpY29uIGV4aXN0cycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tUaGVtZS5tb2NrUmV0dXJuVmFsdWUoJ2RhcmsnKVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHtcbiAgICAgICAgICBpY29uOiAnbGlnaHQtaWNvbi5wbmcnLFxuICAgICAgICAgIGljb25fZGFyazogJ2RhcmstaWNvbi5wbmcnLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBpbWcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdpbWcnKVxuICAgICAgZXhwZWN0KGltZy5nZXRBdHRyaWJ1dGUoJ3NyYycpKS50b0NvbnRhaW4oJ2RhcmstaWNvbi5wbmcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBsaWdodCBpY29uIHdoZW4gdGhlbWUgaXMgbGlnaHQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVGhlbWUubW9ja1JldHVyblZhbHVlKCdsaWdodCcpXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlUGx1Z2luRGVjbGFyYXRpb24oe1xuICAgICAgICAgIGljb246ICdsaWdodC1pY29uLnBuZycsXG4gICAgICAgICAgaWNvbl9kYXJrOiAnZGFyay1pY29uLnBuZycsXG4gICAgICAgIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtwbHVnaW59IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGNvbnN0IGltZyA9IHNjcmVlbi5nZXRCeVJvbGUoJ2ltZycpXG4gICAgICBleHBlY3QoaW1nLmdldEF0dHJpYnV0ZSgnc3JjJykpLnRvQ29udGFpbignbGlnaHQtaWNvbi5wbmcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBsaWdodCBpY29uIHdoZW4gZGFyayBpY29uIGlzIG5vdCBhdmFpbGFibGUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVGhlbWUubW9ja1JldHVyblZhbHVlKCdkYXJrJylcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiBjcmVhdGVQbHVnaW5EZWNsYXJhdGlvbih7XG4gICAgICAgICAgaWNvbjogJ2xpZ2h0LWljb24ucG5nJyxcbiAgICAgICAgICBpY29uX2Rhcms6IHVuZGVmaW5lZCxcbiAgICAgICAgfSksXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgY29uc3QgaW1nID0gc2NyZWVuLmdldEJ5Um9sZSgnaW1nJylcbiAgICAgIGV4cGVjdChpbWcuZ2V0QXR0cmlidXRlKCdzcmMnKSkudG9Db250YWluKCdsaWdodC1pY29uLnBuZycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGV4dGVybmFsIFVSTCBkaXJlY3RseSBmb3IgaWNvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiBjcmVhdGVQbHVnaW5EZWNsYXJhdGlvbih7XG4gICAgICAgICAgaWNvbjogJ2h0dHBzOi8vZXhhbXBsZS5jb20vaWNvbi5wbmcnLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCBpbWcgPSBzY3JlZW4uZ2V0QnlSb2xlKCdpbWcnKVxuICAgICAgZXhwZWN0KGltZykudG9IYXZlQXR0cmlidXRlKCdzcmMnLCAnaHR0cHM6Ly9leGFtcGxlLmNvbS9pY29uLnBuZycpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBNZW1vaXphdGlvbiBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtZW1vaXplIG9yZ05hbWUgYmFzZWQgb24gc291cmNlIGFuZCBhdXRob3InLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBzb3VyY2U6IFBsdWdpblNvdXJjZS5naXRodWIsXG4gICAgICAgIGRlY2xhcmF0aW9uOiBjcmVhdGVQbHVnaW5EZWNsYXJhdGlvbih7IGF1dGhvcjogJ3Rlc3QtYXV0aG9yJyB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gRmlyc3QgcmVuZGVyIHNob3VsZCBzaG93IGF1dGhvclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnb3JnLWluZm8nKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLW9yZycsICd0ZXN0LWF1dGhvcicpXG5cbiAgICAgIC8vIFJlLXJlbmRlciB3aXRoIHNhbWUgcGx1Z2luXG4gICAgICByZXJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pXG5cbiAgICAgIC8vIFNob3VsZCBzdGlsbCBzaG93IHNhbWUgYXV0aG9yXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdvcmctaW5mbycpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtb3JnJywgJ3Rlc3QtYXV0aG9yJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgb3JnTmFtZSB3aGVuIHNvdXJjZSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgZ2l0aHViUGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgc291cmNlOiBQbHVnaW5Tb3VyY2UuZ2l0aHViLFxuICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlUGx1Z2luRGVjbGFyYXRpb24oeyBhdXRob3I6ICdnaXRodWItYXV0aG9yJyB9KSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBsb2NhbFBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLmxvY2FsLFxuICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlUGx1Z2luRGVjbGFyYXRpb24oeyBhdXRob3I6ICdsb2NhbC1hdXRob3InIH0pLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtnaXRodWJQbHVnaW59IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnb3JnLWluZm8nKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLW9yZycsICdnaXRodWItYXV0aG9yJylcblxuICAgICAgcmVyZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtsb2NhbFBsdWdpbn0gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdvcmctaW5mbycpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtb3JnJywgJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWVtb2l6ZSBpc0RlcHJlY2F0ZWQgYmFzZWQgb24gc3RhdHVzIGFuZCBkZXByZWNhdGVkX3JlYXNvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tFbmFibGVNYXJrZXRwbGFjZS5tb2NrUmV0dXJuVmFsdWUodHJ1ZSlcbiAgICAgIGNvbnN0IGFjdGl2ZVBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLm1hcmtldHBsYWNlLFxuICAgICAgICBzdGF0dXM6ICdhY3RpdmUnLFxuICAgICAgICBkZXByZWNhdGVkX3JlYXNvbjogJycsXG4gICAgICB9KVxuICAgICAgY29uc3QgZGVwcmVjYXRlZFBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLm1hcmtldHBsYWNlLFxuICAgICAgICBzdGF0dXM6ICdkZWxldGVkJyxcbiAgICAgICAgZGVwcmVjYXRlZF9yZWFzb246ICdEZXByZWNhdGVkJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17YWN0aXZlUGx1Z2lufSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ3BsdWdpbi5kZXByZWNhdGVkJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIHJlcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17ZGVwcmVjYXRlZFBsdWdpbn0gLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmRlcHJlY2F0ZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gRWRnZSBDYXNlcyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBpY29uIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVQbHVnaW5EZXRhaWwoe1xuICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlUGx1Z2luRGVjbGFyYXRpb24oeyBpY29uOiAnJyB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydCAtIFNob3VsZCBub3QgdGhyb3cgd2hlbiBpY29uIGlzIGVtcHR5XG4gICAgICBleHBlY3QoKCkgPT4gcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPikpLm5vdC50b1Rocm93KClcblxuICAgICAgLy8gVGhlIGltZyBlbGVtZW50IHNob3VsZCBzdGlsbCBiZSByZW5kZXJlZFxuICAgICAgY29uc3QgaW1nID0gc2NyZWVuLmdldEJ5Um9sZSgnaW1nJylcbiAgICAgIGV4cGVjdChpbWcpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWlzc2luZyBtZXRhIGZvciBub24tR2l0SHViIHNvdXJjZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIHNvdXJjZTogUGx1Z2luU291cmNlLmxvY2FsLFxuICAgICAgICBtZXRhOiB1bmRlZmluZWQsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3QgJiBBc3NlcnQgLSBTaG91bGQgbm90IHRocm93XG4gICAgICBleHBlY3QoKCkgPT4gcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPikpLm5vdC50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgbGFiZWwgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tHZXRWYWx1ZUZyb21JMThuT2JqZWN0Lm1vY2tSZXR1cm5WYWx1ZSgnJylcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbHVnaW4tdGl0bGUnKSkudG9IYXZlVGV4dENvbnRlbnQoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHplcm8gZW5kcG9pbnRzX2FjdGl2ZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiBjcmVhdGVQbHVnaW5EZWNsYXJhdGlvbih7IGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0uZXh0ZW5zaW9uIH0pLFxuICAgICAgICBlbmRwb2ludHNfYWN0aXZlOiAwLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPFBsdWdpbkl0ZW0gcGx1Z2luPXtwbHVnaW59IC8+KVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgc3RpbGwgcmVuZGVyIGVuZHBvaW50cyBpbmZvIHdpdGggemVyb1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3BsdWdpblxcLmVuZHBvaW50c0VuYWJsZWQvKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsIGxhdGVzdF92ZXJzaW9uJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgc291cmNlOiBQbHVnaW5Tb3VyY2UubWFya2V0cGxhY2UsXG4gICAgICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgIGxhdGVzdF92ZXJzaW9uOiBudWxsIGFzIGFueSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcblxuICAgICAgLy8gQXNzZXJ0IC0gU2hvdWxkIG5vdCBzaG93IHVwZGF0ZSBpbmRpY2F0b3JcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ZlcnNpb24tYmFkZ2UnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWhhcy11cGRhdGUnLCAnZmFsc2UnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gUHJvcCBWYXJpYXRpb25zID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29ycmVjdGx5IHdpdGggbWluaW1hbCByZXF1aXJlZCBwcm9wcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCgpXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgZXhwZWN0KCgpID0+IHJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pKS5ub3QudG9UaHJvdygpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRpZmZlcmVudCBjYXRlZ29yeSB0eXBlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBbXG4gICAgICAgIFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICAgICAgICBQbHVnaW5DYXRlZ29yeUVudW0ubW9kZWwsXG4gICAgICAgIFBsdWdpbkNhdGVnb3J5RW51bS5leHRlbnNpb24sXG4gICAgICAgIFBsdWdpbkNhdGVnb3J5RW51bS5hZ2VudCxcbiAgICAgICAgUGx1Z2luQ2F0ZWdvcnlFbnVtLmRhdGFzb3VyY2UsXG4gICAgICBdXG5cbiAgICAgIGNhdGVnb3JpZXMuZm9yRWFjaCgoY2F0ZWdvcnkpID0+IHtcbiAgICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgICBkZWNsYXJhdGlvbjogY3JlYXRlUGx1Z2luRGVjbGFyYXRpb24oeyBjYXRlZ29yeSB9KSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3QgJiBBc3NlcnRcbiAgICAgICAgZXhwZWN0KCgpID0+IHJlbmRlcig8UGx1Z2luSXRlbSBwbHVnaW49e3BsdWdpbn0gLz4pKS5ub3QudG9UaHJvdygpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBhbGwgc291cmNlIHR5cGVzJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3Qgc291cmNlcyA9IFtcbiAgICAgICAgUGx1Z2luU291cmNlLm1hcmtldHBsYWNlLFxuICAgICAgICBQbHVnaW5Tb3VyY2UuZ2l0aHViLFxuICAgICAgICBQbHVnaW5Tb3VyY2UubG9jYWwsXG4gICAgICAgIFBsdWdpblNvdXJjZS5kZWJ1Z2dpbmcsXG4gICAgICBdXG5cbiAgICAgIHNvdXJjZXMuZm9yRWFjaCgoc291cmNlKSA9PiB7XG4gICAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7IHNvdXJjZSB9KVxuXG4gICAgICAgIC8vIEFjdCAmIEFzc2VydFxuICAgICAgICBleHBlY3QoKCkgPT4gcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPikpLm5vdC50b1Rocm93KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBDYWxsYmFjayBTdGFiaWxpdHkgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIFN0YWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgc3RhYmxlIGhhbmRsZURlbGV0ZSBjYWxsYmFjaycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZVBsdWdpbkRldGFpbCh7XG4gICAgICAgIGRlY2xhcmF0aW9uOiBjcmVhdGVQbHVnaW5EZWNsYXJhdGlvbih7IGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RlbGV0ZS1idXR0b24nKSlcbiAgICAgIGNvbnN0IGZpcnN0Q2FsbEFyZ3MgPSBtb2NrUmVmcmVzaFBsdWdpbkxpc3QubW9jay5jYWxsc1swXVxuXG4gICAgICBtb2NrUmVmcmVzaFBsdWdpbkxpc3QubW9ja0NsZWFyKClcbiAgICAgIHJlcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17cGx1Z2lufSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2RlbGV0ZS1idXR0b24nKSlcbiAgICAgIGNvbnN0IHNlY29uZENhbGxBcmdzID0gbW9ja1JlZnJlc2hQbHVnaW5MaXN0Lm1vY2suY2FsbHNbMF1cblxuICAgICAgLy8gQXNzZXJ0IC0gQm90aCBjYWxscyBzaG91bGQgaGF2ZSBzYW1lIGFyZ3VtZW50c1xuICAgICAgZXhwZWN0KGZpcnN0Q2FsbEFyZ3MpLnRvRXF1YWwoc2Vjb25kQ2FsbEFyZ3MpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGhhbmRsZURlbGV0ZSB3aGVuIGNhdGVnb3J5IGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCB0b29sUGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sIH0pLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IG1vZGVsUGx1Z2luID0gY3JlYXRlUGx1Z2luRGV0YWlsKHtcbiAgICAgICAgZGVjbGFyYXRpb246IGNyZWF0ZVBsdWdpbkRlY2xhcmF0aW9uKHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5tb2RlbCB9KSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17dG9vbFBsdWdpbn0gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdkZWxldGUtYnV0dG9uJykpXG4gICAgICBleHBlY3QobW9ja1JlZnJlc2hQbHVnaW5MaXN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCB9KVxuXG4gICAgICBtb2NrUmVmcmVzaFBsdWdpbkxpc3QubW9ja0NsZWFyKClcbiAgICAgIHJlcmVuZGVyKDxQbHVnaW5JdGVtIHBsdWdpbj17bW9kZWxQbHVnaW59IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZGVsZXRlLWJ1dHRvbicpKVxuICAgICAgZXhwZWN0KG1vY2tSZWZyZXNoUGx1Z2luTGlzdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoeyBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLm1vZGVsIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBSZWFjdC5tZW1vIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZWFjdC5tZW1vIEJlaGF2aW9yJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlICYgQXNzZXJ0XG4gICAgICAvLyBUaGUgY29tcG9uZW50IGlzIGV4cG9ydGVkIGFzIFJlYWN0Lm1lbW8oUGx1Z2luSXRlbSlcbiAgICAgIC8vIFdlIGNhbiB2ZXJpZnkgYnkgY2hlY2tpbmcgdGhlIGRpc3BsYXlOYW1lIG9yIHR5cGVcbiAgICAgIGV4cGVjdChQbHVnaW5JdGVtKS50b0JlRGVmaW5lZCgpXG4gICAgICAvLyBSZWFjdC5tZW1vIGNvbXBvbmVudHMgaGF2ZSBhICQkdHlwZW9mIHByb3BlcnR5XG4gICAgICBleHBlY3QoKFBsdWdpbkl0ZW0gYXMgYW55KS4kJHR5cGVvZj8udG9TdHJpbmcoKSkudG9Db250YWluKCdTeW1ib2wnKVxuICAgIH0pXG4gIH0pXG59KVxuIl19