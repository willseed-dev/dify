"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("@/app/components/plugins/types");
const index_1 = require("./index");
const list_with_collection_1 = require("./list-with-collection");
const list_wrapper_1 = require("./list-wrapper");
// ================================
// Mock External Dependencies Only
// ================================
// Mock i18n translation hook
vitest_1.vi.mock('#i18n', () => ({
    useTranslation: () => ({
        t: (key, options) => {
            // Build full key with namespace prefix if provided
            const fullKey = options?.ns ? `${options.ns}.${key}` : key;
            const translations = {
                'plugin.marketplace.viewMore': 'View More',
                'plugin.marketplace.pluginsResult': `${options?.num || 0} plugins found`,
                'plugin.marketplace.noPluginFound': 'No plugins found',
                'plugin.detailPanel.operation.install': 'Install',
                'plugin.detailPanel.operation.detail': 'Detail',
            };
            return translations[fullKey] || key;
        },
    }),
    useLocale: () => 'en-US',
}));
// Mock marketplace state hooks with controllable values
const { mockMarketplaceData, mockMoreClick } = vitest_1.vi.hoisted(() => {
    return {
        mockMarketplaceData: {
            plugins: undefined,
            pluginsTotal: 0,
            marketplaceCollections: undefined,
            marketplaceCollectionPluginsMap: undefined,
            isLoading: false,
            page: 1,
        },
        mockMoreClick: vitest_1.vi.fn(),
    };
});
vitest_1.vi.mock('../state', () => ({
    useMarketplaceData: () => mockMarketplaceData,
}));
vitest_1.vi.mock('../atoms', () => ({
    useMarketplaceMoreClick: () => mockMoreClick,
}));
// Mock useLocale context
vitest_1.vi.mock('@/context/i18n', () => ({
    useLocale: () => 'en-US',
}));
// Mock next-themes
vitest_1.vi.mock('next-themes', () => ({
    useTheme: () => ({
        theme: 'light',
    }),
}));
// Mock useTags hook
const mockTags = [
    { name: 'search', label: 'Search' },
    { name: 'image', label: 'Image' },
];
vitest_1.vi.mock('@/app/components/plugins/hooks', () => ({
    useTags: () => ({
        tags: mockTags,
        tagsMap: mockTags.reduce((acc, tag) => {
            acc[tag.name] = tag;
            return acc;
        }, {}),
        getTagLabel: (name) => {
            const tag = mockTags.find(t => t.name === name);
            return tag?.label || name;
        },
    }),
}));
// Mock ahooks useBoolean with controllable state
let mockUseBooleanValue = false;
const mockSetTrue = vitest_1.vi.fn(() => {
    mockUseBooleanValue = true;
});
const mockSetFalse = vitest_1.vi.fn(() => {
    mockUseBooleanValue = false;
});
vitest_1.vi.mock('ahooks', () => ({
    useBoolean: (_defaultValue) => {
        return [
            mockUseBooleanValue,
            {
                setTrue: mockSetTrue,
                setFalse: mockSetFalse,
                toggle: vitest_1.vi.fn(),
            },
        ];
    },
}));
// Mock i18n-config/language
vitest_1.vi.mock('@/i18n-config/language', () => ({
    getLanguage: (locale) => locale || 'en-US',
}));
// Mock marketplace utils
vitest_1.vi.mock('../utils', () => ({
    getPluginLinkInMarketplace: (plugin, _params) => `/plugins/${plugin.org}/${plugin.name}`,
    getPluginDetailLinkInMarketplace: (plugin) => `/plugins/${plugin.org}/${plugin.name}`,
}));
// Mock Card component
vitest_1.vi.mock('@/app/components/plugins/card', () => ({
    default: ({ payload, footer }) => (<div data-testid={`card-${payload.name}`}>
      <div data-testid="card-name">{payload.name}</div>
      <div data-testid="card-label">{payload.label?.['en-US'] || payload.name}</div>
      {footer && <div data-testid="card-footer">{footer}</div>}
    </div>),
}));
// Mock CardMoreInfo component
vitest_1.vi.mock('@/app/components/plugins/card/card-more-info', () => ({
    default: ({ downloadCount, tags }) => (<div data-testid="card-more-info">
      <span data-testid="download-count">{downloadCount}</span>
      <span data-testid="tags">{tags.join(',')}</span>
    </div>),
}));
// Mock InstallFromMarketplace component
vitest_1.vi.mock('@/app/components/plugins/install-plugin/install-from-marketplace', () => ({
    default: ({ onClose }) => (<div data-testid="install-from-marketplace">
      <button onClick={onClose} data-testid="close-install-modal">Close</button>
    </div>),
}));
// Mock SortDropdown component
vitest_1.vi.mock('../sort-dropdown', () => ({
    default: () => (<div data-testid="sort-dropdown">Sort</div>),
}));
// Mock Empty component
vitest_1.vi.mock('../empty', () => ({
    default: ({ className }) => (<div data-testid="empty-component" className={className}>
      No plugins found
    </div>),
}));
// Mock Loading component
vitest_1.vi.mock('@/app/components/base/loading', () => ({
    default: () => <div data-testid="loading-component">Loading...</div>,
}));
// ================================
// Test Data Factories
// ================================
const createMockPlugin = (overrides) => ({
    type: 'plugin',
    org: 'test-org',
    name: `test-plugin-${Math.random().toString(36).substring(7)}`,
    plugin_id: `plugin-${Math.random().toString(36).substring(7)}`,
    version: '1.0.0',
    latest_version: '1.0.0',
    latest_package_identifier: 'test-org/test-plugin:1.0.0',
    icon: '/icon.png',
    verified: true,
    label: { 'en-US': 'Test Plugin' },
    brief: { 'en-US': 'Test plugin brief description' },
    description: { 'en-US': 'Test plugin full description' },
    introduction: 'Test plugin introduction',
    repository: 'https://github.com/test/plugin',
    category: types_1.PluginCategoryEnum.tool,
    install_count: 1000,
    endpoint: { settings: [] },
    tags: [{ name: 'search' }],
    badges: [],
    verification: { authorized_category: 'community' },
    from: 'marketplace',
    ...overrides,
});
const createMockPluginList = (count) => Array.from({ length: count }, (_, i) => createMockPlugin({
    name: `plugin-${i}`,
    plugin_id: `plugin-id-${i}`,
    label: { 'en-US': `Plugin ${i}` },
}));
const createMockCollection = (overrides) => ({
    name: `collection-${Math.random().toString(36).substring(7)}`,
    label: { 'en-US': 'Test Collection' },
    description: { 'en-US': 'Test collection description' },
    rule: 'test-rule',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    searchable: true,
    search_params: { query: 'test' },
    ...overrides,
});
const createMockCollectionList = (count) => Array.from({ length: count }, (_, i) => createMockCollection({
    name: `collection-${i}`,
    label: { 'en-US': `Collection ${i}` },
    description: { 'en-US': `Description for collection ${i}` },
}));
// ================================
// List Component Tests
// ================================
(0, vitest_1.describe)('List', () => {
    const defaultProps = {
        marketplaceCollections: [],
        marketplaceCollectionPluginsMap: {},
        plugins: undefined,
        showInstallButton: false,
        cardContainerClassName: '',
        cardRender: undefined,
        onMoreClick: undefined,
        emptyClassName: '',
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Component should render without errors
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render ListWithCollection when plugins prop is undefined', () => {
            const collections = createMockCollectionList(2);
            const pluginsMap = {
                'collection-0': createMockPluginList(2),
                'collection-1': createMockPluginList(3),
            };
            (0, react_1.render)(<index_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap}/>);
            // Should render collection titles
            (0, vitest_1.expect)(react_1.screen.getByText('Collection 0')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Collection 1')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render plugin cards when plugins array is provided', () => {
            const plugins = createMockPluginList(3);
            (0, react_1.render)(<index_1.default {...defaultProps} plugins={plugins}/>);
            // Should render plugin cards
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-plugin-0')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-plugin-1')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-plugin-2')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Empty component when plugins array is empty', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} plugins={[]}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('empty-component')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render ListWithCollection when plugins is defined', () => {
            const collections = createMockCollectionList(2);
            const pluginsMap = {
                'collection-0': createMockPluginList(2),
            };
            (0, react_1.render)(<index_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap} plugins={[]}/>);
            // Should not render collection titles
            (0, vitest_1.expect)(react_1.screen.queryByText('Collection 0')).not.toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should apply cardContainerClassName to grid container', () => {
            const plugins = createMockPluginList(2);
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} plugins={plugins} cardContainerClassName="custom-grid-class"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-grid-class')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply emptyClassName to Empty component', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} plugins={[]} emptyClassName="custom-empty-class"/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('empty-component')).toHaveClass('custom-empty-class');
        });
        (0, vitest_1.it)('should pass showInstallButton to CardWrapper', () => {
            const plugins = createMockPluginList(1);
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} plugins={plugins} showInstallButton={true}/>);
            // CardWrapper should be rendered (via Card mock)
            (0, vitest_1.expect)(container.querySelector('[data-testid="card-plugin-0"]')).toBeInTheDocument();
        });
    });
    // ================================
    // Custom Card Render Tests
    // ================================
    (0, vitest_1.describe)('Custom Card Render', () => {
        (0, vitest_1.it)('should use cardRender function when provided', () => {
            const plugins = createMockPluginList(2);
            const customCardRender = (plugin) => (<div key={plugin.name} data-testid={`custom-card-${plugin.name}`}>
          Custom:
          {' '}
          {plugin.name}
        </div>);
            (0, react_1.render)(<index_1.default {...defaultProps} plugins={plugins} cardRender={customCardRender}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-card-plugin-0')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-card-plugin-1')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Custom: plugin-0')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle cardRender returning null', () => {
            const plugins = createMockPluginList(2);
            const customCardRender = (plugin) => {
                if (plugin.name === 'plugin-0')
                    return null;
                return (<div key={plugin.name} data-testid={`custom-card-${plugin.name}`}>
            {plugin.name}
          </div>);
            };
            (0, react_1.render)(<index_1.default {...defaultProps} plugins={plugins} cardRender={customCardRender}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('custom-card-plugin-0')).not.toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-card-plugin-1')).toBeInTheDocument();
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty marketplaceCollections', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}}/>);
            // Should not throw and render nothing
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined plugins correctly', () => {
            const collections = createMockCollectionList(1);
            const pluginsMap = {
                'collection-0': createMockPluginList(1),
            };
            (0, react_1.render)(<index_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap} plugins={undefined}/>);
            // Should render ListWithCollection
            (0, vitest_1.expect)(react_1.screen.getByText('Collection 0')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle large number of plugins', () => {
            const plugins = createMockPluginList(100);
            const { container } = (0, react_1.render)(<index_1.default {...defaultProps} plugins={plugins}/>);
            // Should render all plugin cards
            const cards = container.querySelectorAll('[data-testid^="card-plugin-"]');
            (0, vitest_1.expect)(cards.length).toBe(100);
        });
        (0, vitest_1.it)('should handle plugins with special characters in name', () => {
            const specialPlugin = createMockPlugin({
                name: 'plugin-with-special-chars!@#',
                org: 'test-org',
            });
            (0, react_1.render)(<index_1.default {...defaultProps} plugins={[specialPlugin]}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-plugin-with-special-chars!@#')).toBeInTheDocument();
        });
    });
});
// ================================
// ListWithCollection Component Tests
// ================================
(0, vitest_1.describe)('ListWithCollection', () => {
    const defaultProps = {
        marketplaceCollections: [],
        marketplaceCollectionPluginsMap: {},
        showInstallButton: false,
        cardContainerClassName: '',
        cardRender: undefined,
        onMoreClick: undefined,
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<list_with_collection_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render collection labels and descriptions', () => {
            const collections = createMockCollectionList(2);
            const pluginsMap = {
                'collection-0': createMockPluginList(1),
                'collection-1': createMockPluginList(1),
            };
            (0, react_1.render)(<list_with_collection_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Collection 0')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Description for collection 0')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Collection 1')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Description for collection 1')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render plugin cards within collections', () => {
            const collections = createMockCollectionList(1);
            const pluginsMap = {
                'collection-0': createMockPluginList(3),
            };
            (0, react_1.render)(<list_with_collection_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-plugin-0')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-plugin-1')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-plugin-2')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render collections with no plugins', () => {
            const collections = createMockCollectionList(2);
            const pluginsMap = {
                'collection-0': createMockPluginList(1),
                'collection-1': [], // Empty plugins
            };
            (0, react_1.render)(<list_with_collection_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Collection 0')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByText('Collection 1')).not.toBeInTheDocument();
        });
    });
    // ================================
    // View More Button Tests
    // ================================
    (0, vitest_1.describe)('View More Button', () => {
        (0, vitest_1.it)('should render View More button when collection is searchable', () => {
            const collections = [createMockCollection({
                    name: 'collection-0',
                    searchable: true,
                    search_params: { query: 'test' },
                })];
            const pluginsMap = {
                'collection-0': createMockPluginList(1),
            };
            (0, react_1.render)(<list_with_collection_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('View More')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render View More button when collection is not searchable', () => {
            const collections = [createMockCollection({
                    name: 'collection-0',
                    searchable: false,
                })];
            const pluginsMap = {
                'collection-0': createMockPluginList(1),
            };
            (0, react_1.render)(<list_with_collection_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText('View More')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should call moreClick hook with search_params when View More is clicked', () => {
            const searchParams = { query: 'test-query', sort_by: 'install_count' };
            const collections = [createMockCollection({
                    name: 'collection-0',
                    searchable: true,
                    search_params: searchParams,
                })];
            const pluginsMap = {
                'collection-0': createMockPluginList(1),
            };
            (0, react_1.render)(<list_with_collection_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap}/>);
            react_1.fireEvent.click(react_1.screen.getByText('View More'));
            (0, vitest_1.expect)(mockMoreClick).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(mockMoreClick).toHaveBeenCalledWith(searchParams);
        });
    });
    // ================================
    // Custom Card Render Tests
    // ================================
    (0, vitest_1.describe)('Custom Card Render', () => {
        (0, vitest_1.it)('should use cardRender function when provided', () => {
            const collections = createMockCollectionList(1);
            const pluginsMap = {
                'collection-0': createMockPluginList(2),
            };
            const customCardRender = (plugin) => (<div key={plugin.plugin_id} data-testid={`custom-${plugin.name}`}>
          Custom:
          {' '}
          {plugin.name}
        </div>);
            (0, react_1.render)(<list_with_collection_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap} cardRender={customCardRender}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-plugin-0')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Custom: plugin-0')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should apply cardContainerClassName to grid', () => {
            const collections = createMockCollectionList(1);
            const pluginsMap = {
                'collection-0': createMockPluginList(1),
            };
            const { container } = (0, react_1.render)(<list_with_collection_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap} cardContainerClassName="custom-container"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-container')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass showInstallButton to CardWrapper', () => {
            const collections = createMockCollectionList(1);
            const pluginsMap = {
                'collection-0': createMockPluginList(1),
            };
            const { container } = (0, react_1.render)(<list_with_collection_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap} showInstallButton={true}/>);
            // CardWrapper should be rendered
            (0, vitest_1.expect)(container.querySelector('[data-testid="card-plugin-0"]')).toBeInTheDocument();
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty collections array', () => {
            (0, react_1.render)(<list_with_collection_1.default {...defaultProps} marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle missing plugins in map', () => {
            const collections = createMockCollectionList(1);
            // pluginsMap doesn't have the collection
            const pluginsMap = {};
            (0, react_1.render)(<list_with_collection_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap}/>);
            // Collection should not be rendered because it has no plugins
            (0, vitest_1.expect)(react_1.screen.queryByText('Collection 0')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined plugins in map', () => {
            const collections = createMockCollectionList(1);
            const pluginsMap = {
                'collection-0': undefined,
            };
            (0, react_1.render)(<list_with_collection_1.default {...defaultProps} marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap}/>);
            // Collection should not be rendered
            (0, vitest_1.expect)(react_1.screen.queryByText('Collection 0')).not.toBeInTheDocument();
        });
    });
});
// ================================
// ListWrapper Component Tests
// ================================
(0, vitest_1.describe)('ListWrapper', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        // Reset mock data
        mockMarketplaceData.plugins = undefined;
        mockMarketplaceData.pluginsTotal = 0;
        mockMarketplaceData.marketplaceCollections = undefined;
        mockMarketplaceData.marketplaceCollectionPluginsMap = undefined;
        mockMarketplaceData.isLoading = false;
        mockMarketplaceData.page = 1;
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<list_wrapper_1.default />);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with scrollbarGutter style', () => {
            const { container } = (0, react_1.render)(<list_wrapper_1.default />);
            const wrapper = container.firstChild;
            (0, vitest_1.expect)(wrapper).toHaveStyle({ scrollbarGutter: 'stable' });
        });
        (0, vitest_1.it)('should render Loading component when isLoading is true and page is 1', () => {
            mockMarketplaceData.isLoading = true;
            mockMarketplaceData.page = 1;
            (0, react_1.render)(<list_wrapper_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByTestId('loading-component')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render Loading component when page > 1', () => {
            mockMarketplaceData.isLoading = true;
            mockMarketplaceData.page = 2;
            (0, react_1.render)(<list_wrapper_1.default />);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('loading-component')).not.toBeInTheDocument();
        });
    });
    // ================================
    // Plugins Header Tests
    // ================================
    (0, vitest_1.describe)('Plugins Header', () => {
        (0, vitest_1.it)('should render plugins result count when plugins are present', () => {
            mockMarketplaceData.plugins = createMockPluginList(5);
            mockMarketplaceData.pluginsTotal = 5;
            (0, react_1.render)(<list_wrapper_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('5 plugins found')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render SortDropdown when plugins are present', () => {
            mockMarketplaceData.plugins = createMockPluginList(1);
            (0, react_1.render)(<list_wrapper_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByTestId('sort-dropdown')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render plugins header when plugins is undefined', () => {
            mockMarketplaceData.plugins = undefined;
            (0, react_1.render)(<list_wrapper_1.default />);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('sort-dropdown')).not.toBeInTheDocument();
        });
    });
    // ================================
    // List Rendering Logic Tests
    // ================================
    (0, vitest_1.describe)('List Rendering Logic', () => {
        (0, vitest_1.it)('should render collections when not loading', () => {
            mockMarketplaceData.isLoading = false;
            mockMarketplaceData.marketplaceCollections = createMockCollectionList(1);
            mockMarketplaceData.marketplaceCollectionPluginsMap = {
                'collection-0': createMockPluginList(1),
            };
            (0, react_1.render)(<list_wrapper_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Collection 0')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render List when loading but page > 1', () => {
            mockMarketplaceData.isLoading = true;
            mockMarketplaceData.page = 2;
            mockMarketplaceData.marketplaceCollections = createMockCollectionList(1);
            mockMarketplaceData.marketplaceCollectionPluginsMap = {
                'collection-0': createMockPluginList(1),
            };
            (0, react_1.render)(<list_wrapper_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('Collection 0')).toBeInTheDocument();
        });
    });
    // ================================
    // Data Integration Tests
    // ================================
    (0, vitest_1.describe)('Data Integration', () => {
        (0, vitest_1.it)('should pass plugins from state to List', () => {
            mockMarketplaceData.plugins = createMockPluginList(2);
            (0, react_1.render)(<list_wrapper_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-plugin-0')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-plugin-1')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show View More button and call moreClick hook', () => {
            mockMarketplaceData.marketplaceCollections = [createMockCollection({
                    name: 'collection-0',
                    searchable: true,
                    search_params: { query: 'test' },
                })];
            mockMarketplaceData.marketplaceCollectionPluginsMap = {
                'collection-0': createMockPluginList(1),
            };
            (0, react_1.render)(<list_wrapper_1.default />);
            react_1.fireEvent.click(react_1.screen.getByText('View More'));
            (0, vitest_1.expect)(mockMoreClick).toHaveBeenCalled();
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty plugins array', () => {
            mockMarketplaceData.plugins = [];
            mockMarketplaceData.pluginsTotal = 0;
            (0, react_1.render)(<list_wrapper_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('0 plugins found')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('empty-component')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle large pluginsTotal', () => {
            mockMarketplaceData.plugins = createMockPluginList(10);
            mockMarketplaceData.pluginsTotal = 10000;
            (0, react_1.render)(<list_wrapper_1.default />);
            (0, vitest_1.expect)(react_1.screen.getByText('10000 plugins found')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle both loading and has plugins', () => {
            mockMarketplaceData.isLoading = true;
            mockMarketplaceData.page = 2;
            mockMarketplaceData.plugins = createMockPluginList(5);
            mockMarketplaceData.pluginsTotal = 50;
            (0, react_1.render)(<list_wrapper_1.default />);
            // Should show plugins header and list
            (0, vitest_1.expect)(react_1.screen.getByText('50 plugins found')).toBeInTheDocument();
            // Should not show loading because page > 1
            (0, vitest_1.expect)(react_1.screen.queryByTestId('loading-component')).not.toBeInTheDocument();
        });
    });
});
// ================================
// CardWrapper Component Tests (via List integration)
// ================================
(0, vitest_1.describe)('CardWrapper (via List integration)', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockUseBooleanValue = false;
    });
    (0, vitest_1.describe)('Card Rendering', () => {
        (0, vitest_1.it)('should render Card with plugin data', () => {
            const plugin = createMockPlugin({
                name: 'test-plugin',
                label: { 'en-US': 'Test Plugin Label' },
            });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-test-plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render CardMoreInfo with download count and tags', () => {
            const plugin = createMockPlugin({
                name: 'test-plugin',
                install_count: 5000,
                tags: [{ name: 'search' }, { name: 'image' }],
            });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-more-info')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('download-count')).toHaveTextContent('5000');
        });
    });
    (0, vitest_1.describe)('Plugin Key Generation', () => {
        (0, vitest_1.it)('should use org/name as key for plugins', () => {
            const plugins = [
                createMockPlugin({ org: 'org1', name: 'plugin1' }),
                createMockPlugin({ org: 'org2', name: 'plugin2' }),
            ];
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={plugins}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-plugin1')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-plugin2')).toBeInTheDocument();
        });
    });
    // ================================
    // showInstallButton Branch Tests
    // ================================
    (0, vitest_1.describe)('showInstallButton=true branch', () => {
        (0, vitest_1.it)('should render install and detail buttons when showInstallButton is true', () => {
            const plugin = createMockPlugin({ name: 'install-test-plugin' });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]} showInstallButton={true}/>);
            // Should render the card
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-install-test-plugin')).toBeInTheDocument();
            // Should render install button
            (0, vitest_1.expect)(react_1.screen.getByText('Install')).toBeInTheDocument();
            // Should render detail button
            (0, vitest_1.expect)(react_1.screen.getByText('Detail')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should call showInstallFromMarketplace when install button is clicked', () => {
            const plugin = createMockPlugin({ name: 'click-test-plugin' });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]} showInstallButton={true}/>);
            const installButton = react_1.screen.getByText('Install');
            react_1.fireEvent.click(installButton);
            (0, vitest_1.expect)(mockSetTrue).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should render detail link with correct href', () => {
            const plugin = createMockPlugin({
                name: 'link-test-plugin',
                org: 'test-org',
            });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]} showInstallButton={true}/>);
            const detailLink = react_1.screen.getByText('Detail').closest('a');
            (0, vitest_1.expect)(detailLink).toHaveAttribute('href', '/plugins/test-org/link-test-plugin');
            (0, vitest_1.expect)(detailLink).toHaveAttribute('target', '_blank');
        });
        (0, vitest_1.it)('should render InstallFromMarketplace modal when isShowInstallFromMarketplace is true', () => {
            mockUseBooleanValue = true;
            const plugin = createMockPlugin({ name: 'modal-test-plugin' });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]} showInstallButton={true}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-marketplace')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render InstallFromMarketplace modal when isShowInstallFromMarketplace is false', () => {
            mockUseBooleanValue = false;
            const plugin = createMockPlugin({ name: 'no-modal-test-plugin' });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]} showInstallButton={true}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('install-from-marketplace')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should call hideInstallFromMarketplace when modal close is triggered', () => {
            mockUseBooleanValue = true;
            const plugin = createMockPlugin({ name: 'close-modal-plugin' });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]} showInstallButton={true}/>);
            const closeButton = react_1.screen.getByTestId('close-install-modal');
            react_1.fireEvent.click(closeButton);
            (0, vitest_1.expect)(mockSetFalse).toHaveBeenCalled();
        });
    });
    // ================================
    // showInstallButton=false Branch Tests
    // ================================
    (0, vitest_1.describe)('showInstallButton=false branch', () => {
        (0, vitest_1.it)('should render as a link when showInstallButton is false', () => {
            const plugin = createMockPlugin({
                name: 'link-plugin',
                org: 'test-org',
            });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]} showInstallButton={false}/>);
            // Should not render install/detail buttons
            (0, vitest_1.expect)(react_1.screen.queryByText('Install')).not.toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByText('Detail')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render card within link for non-install mode', () => {
            const plugin = createMockPlugin({
                name: 'card-link-plugin',
                org: 'card-org',
            });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]} showInstallButton={false}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-card-link-plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with undefined showInstallButton (default false)', () => {
            const plugin = createMockPlugin({ name: 'default-plugin' });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]}/>);
            // Should not render install button (default behavior)
            (0, vitest_1.expect)(react_1.screen.queryByText('Install')).not.toBeInTheDocument();
        });
    });
    // ================================
    // Tag Labels Memoization Tests
    // ================================
    (0, vitest_1.describe)('Tag Labels', () => {
        (0, vitest_1.it)('should render tag labels correctly', () => {
            const plugin = createMockPlugin({
                name: 'tag-plugin',
                tags: [{ name: 'search' }, { name: 'image' }],
            });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('tags')).toHaveTextContent('Search,Image');
        });
        (0, vitest_1.it)('should handle empty tags array', () => {
            const plugin = createMockPlugin({
                name: 'no-tags-plugin',
                tags: [],
            });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('tags')).toHaveTextContent('');
        });
        (0, vitest_1.it)('should handle unknown tag names', () => {
            const plugin = createMockPlugin({
                name: 'unknown-tag-plugin',
                tags: [{ name: 'unknown-tag' }],
            });
            (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={[plugin]}/>);
            // Unknown tags should show the original name
            (0, vitest_1.expect)(react_1.screen.getByTestId('tags')).toHaveTextContent('unknown-tag');
        });
    });
});
// ================================
// Combined Workflow Tests
// ================================
(0, vitest_1.describe)('Combined Workflows', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockMarketplaceData.plugins = undefined;
        mockMarketplaceData.pluginsTotal = 0;
        mockMarketplaceData.isLoading = false;
        mockMarketplaceData.page = 1;
        mockMarketplaceData.marketplaceCollections = undefined;
        mockMarketplaceData.marketplaceCollectionPluginsMap = undefined;
    });
    (0, vitest_1.it)('should transition from loading to showing collections', async () => {
        mockMarketplaceData.isLoading = true;
        mockMarketplaceData.page = 1;
        const { rerender } = (0, react_1.render)(<list_wrapper_1.default />);
        (0, vitest_1.expect)(react_1.screen.getByTestId('loading-component')).toBeInTheDocument();
        // Simulate loading complete
        mockMarketplaceData.isLoading = false;
        mockMarketplaceData.marketplaceCollections = createMockCollectionList(1);
        mockMarketplaceData.marketplaceCollectionPluginsMap = {
            'collection-0': createMockPluginList(1),
        };
        rerender(<list_wrapper_1.default />);
        (0, vitest_1.expect)(react_1.screen.queryByTestId('loading-component')).not.toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('Collection 0')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should transition from collections to search results', async () => {
        mockMarketplaceData.marketplaceCollections = createMockCollectionList(1);
        mockMarketplaceData.marketplaceCollectionPluginsMap = {
            'collection-0': createMockPluginList(1),
        };
        const { rerender } = (0, react_1.render)(<list_wrapper_1.default />);
        (0, vitest_1.expect)(react_1.screen.getByText('Collection 0')).toBeInTheDocument();
        // Simulate search results
        mockMarketplaceData.plugins = createMockPluginList(5);
        mockMarketplaceData.pluginsTotal = 5;
        rerender(<list_wrapper_1.default />);
        (0, vitest_1.expect)(react_1.screen.queryByText('Collection 0')).not.toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('5 plugins found')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should handle empty search results', () => {
        mockMarketplaceData.plugins = [];
        mockMarketplaceData.pluginsTotal = 0;
        (0, react_1.render)(<list_wrapper_1.default />);
        (0, vitest_1.expect)(react_1.screen.getByTestId('empty-component')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('0 plugins found')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should support pagination (page > 1)', () => {
        mockMarketplaceData.plugins = createMockPluginList(40);
        mockMarketplaceData.pluginsTotal = 80;
        mockMarketplaceData.isLoading = true;
        mockMarketplaceData.page = 2;
        (0, react_1.render)(<list_wrapper_1.default />);
        // Should show existing results while loading more
        (0, vitest_1.expect)(react_1.screen.getByText('80 plugins found')).toBeInTheDocument();
        // Should not show loading spinner for pagination
        (0, vitest_1.expect)(react_1.screen.queryByTestId('loading-component')).not.toBeInTheDocument();
    });
});
// ================================
// Accessibility Tests
// ================================
(0, vitest_1.describe)('Accessibility', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockMarketplaceData.plugins = undefined;
        mockMarketplaceData.isLoading = false;
        mockMarketplaceData.page = 1;
    });
    (0, vitest_1.it)('should have semantic structure with collections', () => {
        const collections = createMockCollectionList(1);
        const pluginsMap = {
            'collection-0': createMockPluginList(1),
        };
        const { container } = (0, react_1.render)(<list_with_collection_1.default marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap}/>);
        // Should have proper heading structure
        const headings = container.querySelectorAll('.title-xl-semi-bold');
        (0, vitest_1.expect)(headings.length).toBeGreaterThan(0);
    });
    (0, vitest_1.it)('should have clickable View More button', () => {
        const collections = [createMockCollection({
                name: 'collection-0',
                searchable: true,
            })];
        const pluginsMap = {
            'collection-0': createMockPluginList(1),
        };
        (0, react_1.render)(<list_with_collection_1.default marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap}/>);
        const viewMoreButton = react_1.screen.getByText('View More');
        (0, vitest_1.expect)(viewMoreButton).toBeInTheDocument();
        (0, vitest_1.expect)(viewMoreButton.closest('div')).toHaveClass('cursor-pointer');
    });
    (0, vitest_1.it)('should have proper grid layout for cards', () => {
        const plugins = createMockPluginList(4);
        const { container } = (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={plugins}/>);
        const grid = container.querySelector('.grid-cols-4');
        (0, vitest_1.expect)(grid).toBeInTheDocument();
    });
});
// ================================
// Performance Tests
// ================================
(0, vitest_1.describe)('Performance', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should handle rendering many plugins efficiently', () => {
        const plugins = createMockPluginList(50);
        const startTime = performance.now();
        (0, react_1.render)(<index_1.default marketplaceCollections={[]} marketplaceCollectionPluginsMap={{}} plugins={plugins}/>);
        const endTime = performance.now();
        // Should render in reasonable time (less than 1 second)
        (0, vitest_1.expect)(endTime - startTime).toBeLessThan(1000);
    });
    (0, vitest_1.it)('should handle rendering many collections efficiently', () => {
        const collections = createMockCollectionList(10);
        const pluginsMap = {};
        collections.forEach((collection) => {
            pluginsMap[collection.name] = createMockPluginList(5);
        });
        const startTime = performance.now();
        (0, react_1.render)(<list_with_collection_1.default marketplaceCollections={collections} marketplaceCollectionPluginsMap={pluginsMap}/>);
        const endTime = performance.now();
        // Should render in reasonable time (less than 1 second)
        (0, vitest_1.expect)(endTime - startTime).toBeLessThan(1000);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsa0RBQWtFO0FBQ2xFLG1DQUE2RDtBQUM3RCwwREFBbUU7QUFDbkUsbUNBQTBCO0FBQzFCLGlFQUF1RDtBQUN2RCxpREFBd0M7QUFFeEMsbUNBQW1DO0FBQ25DLGtDQUFrQztBQUNsQyxtQ0FBbUM7QUFFbkMsNkJBQTZCO0FBQzdCLFdBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEIsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDckIsQ0FBQyxFQUFFLENBQUMsR0FBVyxFQUFFLE9BQXVDLEVBQUUsRUFBRTtZQUMxRCxtREFBbUQ7WUFDbkQsTUFBTSxPQUFPLEdBQUcsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUE7WUFDMUQsTUFBTSxZQUFZLEdBQTJCO2dCQUMzQyw2QkFBNkIsRUFBRSxXQUFXO2dCQUMxQyxrQ0FBa0MsRUFBRSxHQUFHLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQyxnQkFBZ0I7Z0JBQ3hFLGtDQUFrQyxFQUFFLGtCQUFrQjtnQkFDdEQsc0NBQXNDLEVBQUUsU0FBUztnQkFDakQscUNBQXFDLEVBQUUsUUFBUTthQUNoRCxDQUFBO1lBQ0QsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksR0FBRyxDQUFBO1FBQ3JDLENBQUM7S0FDRixDQUFDO0lBQ0YsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU87Q0FDekIsQ0FBQyxDQUFDLENBQUE7QUFFSCx3REFBd0Q7QUFDeEQsTUFBTSxFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRSxHQUFHLFdBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO0lBQzdELE9B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QUFHLEVBQUU7UUFDOUQsTUFBTSxXQUFXLEdBQUcsd0JBQXdCLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDaEQsTUFBTSxVQUFVLEdBQTZCLEVBQUUsQ0FBQTtRQUMvQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDakMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2RCxDQUFDLENBQUMsQ0FBQTtRQUVGLE1BQU0sU0FBUyxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtRQUNuQyxJQUFBLGNBQU0sRUFDSixDQUFDLDhCQUFrQixDQUNqQixzQkFBc0IsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUNwQywrQkFBK0IsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUM1QyxDQUNILENBQUE7UUFDRCxNQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUE7UUFFakMsd0RBQXdEO1FBQ3hELElBQUEsZUFBTSxFQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDaEQsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTWFya2V0cGxhY2VDb2xsZWN0aW9uLCBTZWFyY2hQYXJhbXNGcm9tQ29sbGVjdGlvbiB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvdHlwZXMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB7IFBsdWdpbkNhdGVnb3J5RW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy90eXBlcydcbmltcG9ydCBMaXN0IGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgTGlzdFdpdGhDb2xsZWN0aW9uIGZyb20gJy4vbGlzdC13aXRoLWNvbGxlY3Rpb24nXG5pbXBvcnQgTGlzdFdyYXBwZXIgZnJvbSAnLi9saXN0LXdyYXBwZXInXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBNb2NrIEV4dGVybmFsIERlcGVuZGVuY2llcyBPbmx5XG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4vLyBNb2NrIGkxOG4gdHJhbnNsYXRpb24gaG9va1xudmkubW9jaygnI2kxOG4nLCAoKSA9PiAoe1xuICB1c2VUcmFuc2xhdGlvbjogKCkgPT4gKHtcbiAgICB0OiAoa2V5OiBzdHJpbmcsIG9wdGlvbnM/OiB7IG5zPzogc3RyaW5nLCBudW0/OiBudW1iZXIgfSkgPT4ge1xuICAgICAgLy8gQnVpbGQgZnVsbCBrZXkgd2l0aCBuYW1lc3BhY2UgcHJlZml4IGlmIHByb3ZpZGVkXG4gICAgICBjb25zdCBmdWxsS2V5ID0gb3B0aW9ucz8ubnMgPyBgJHtvcHRpb25zLm5zfS4ke2tleX1gIDoga2V5XG4gICAgICBjb25zdCB0cmFuc2xhdGlvbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgICdwbHVnaW4ubWFya2V0cGxhY2Uudmlld01vcmUnOiAnVmlldyBNb3JlJyxcbiAgICAgICAgJ3BsdWdpbi5tYXJrZXRwbGFjZS5wbHVnaW5zUmVzdWx0JzogYCR7b3B0aW9ucz8ubnVtIHx8IDB9IHBsdWdpbnMgZm91bmRgLFxuICAgICAgICAncGx1Z2luLm1hcmtldHBsYWNlLm5vUGx1Z2luRm91bmQnOiAnTm8gcGx1Z2lucyBmb3VuZCcsXG4gICAgICAgICdwbHVnaW4uZGV0YWlsUGFuZWwub3BlcmF0aW9uLmluc3RhbGwnOiAnSW5zdGFsbCcsXG4gICAgICAgICdwbHVnaW4uZGV0YWlsUGFuZWwub3BlcmF0aW9uLmRldGFpbCc6ICdEZXRhaWwnLFxuICAgICAgfVxuICAgICAgcmV0dXJuIHRyYW5zbGF0aW9uc1tmdWxsS2V5XSB8fCBrZXlcbiAgICB9LFxuICB9KSxcbiAgdXNlTG9jYWxlOiAoKSA9PiAnZW4tVVMnLFxufSkpXG5cbi8vIE1vY2sgbWFya2V0cGxhY2Ugc3RhdGUgaG9va3Mgd2l0aCBjb250cm9sbGFibGUgdmFsdWVzXG5jb25zdCB7IG1vY2tNYXJrZXRwbGFjZURhdGEsIG1vY2tNb3JlQ2xpY2sgfSA9IHZpLmhvaXN0ZWQoKCkgPT4ge1xuICByZXR1cm4ge1xuICAgIG1vY2tNYXJrZXRwbGFjZURhdGE6IHtcbiAgICAgIHBsdWdpbnM6IHVuZGVmaW5lZCBhcyBQbHVnaW5bXSB8IHVuZGVmaW5lZCxcbiAgICAgIHBsdWdpbnNUb3RhbDogMCxcbiAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM6IHVuZGVmaW5lZCBhcyBNYXJrZXRwbGFjZUNvbGxlY3Rpb25bXSB8IHVuZGVmaW5lZCxcbiAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXA6IHVuZGVmaW5lZCBhcyBSZWNvcmQ8c3RyaW5nLCBQbHVnaW5bXT4gfCB1bmRlZmluZWQsXG4gICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgcGFnZTogMSxcbiAgICB9LFxuICAgIG1vY2tNb3JlQ2xpY2s6IHZpLmZuKCksXG4gIH1cbn0pXG5cbnZpLm1vY2soJy4uL3N0YXRlJywgKCkgPT4gKHtcbiAgdXNlTWFya2V0cGxhY2VEYXRhOiAoKSA9PiBtb2NrTWFya2V0cGxhY2VEYXRhLFxufSkpXG5cbnZpLm1vY2soJy4uL2F0b21zJywgKCkgPT4gKHtcbiAgdXNlTWFya2V0cGxhY2VNb3JlQ2xpY2s6ICgpID0+IG1vY2tNb3JlQ2xpY2ssXG59KSlcblxuLy8gTW9jayB1c2VMb2NhbGUgY29udGV4dFxudmkubW9jaygnQC9jb250ZXh0L2kxOG4nLCAoKSA9PiAoe1xuICB1c2VMb2NhbGU6ICgpID0+ICdlbi1VUycsXG59KSlcblxuLy8gTW9jayBuZXh0LXRoZW1lc1xudmkubW9jaygnbmV4dC10aGVtZXMnLCAoKSA9PiAoe1xuICB1c2VUaGVtZTogKCkgPT4gKHtcbiAgICB0aGVtZTogJ2xpZ2h0JyxcbiAgfSksXG59KSlcblxuLy8gTW9jayB1c2VUYWdzIGhvb2tcbmNvbnN0IG1vY2tUYWdzID0gW1xuICB7IG5hbWU6ICdzZWFyY2gnLCBsYWJlbDogJ1NlYXJjaCcgfSxcbiAgeyBuYW1lOiAnaW1hZ2UnLCBsYWJlbDogJ0ltYWdlJyB9LFxuXVxuXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvaG9va3MnLCAoKSA9PiAoe1xuICB1c2VUYWdzOiAoKSA9PiAoe1xuICAgIHRhZ3M6IG1vY2tUYWdzLFxuICAgIHRhZ3NNYXA6IG1vY2tUYWdzLnJlZHVjZSgoYWNjLCB0YWcpID0+IHtcbiAgICAgIGFjY1t0YWcubmFtZV0gPSB0YWdcbiAgICAgIHJldHVybiBhY2NcbiAgICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCB7IG5hbWU6IHN0cmluZywgbGFiZWw6IHN0cmluZyB9PiksXG4gICAgZ2V0VGFnTGFiZWw6IChuYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgIGNvbnN0IHRhZyA9IG1vY2tUYWdzLmZpbmQodCA9PiB0Lm5hbWUgPT09IG5hbWUpXG4gICAgICByZXR1cm4gdGFnPy5sYWJlbCB8fCBuYW1lXG4gICAgfSxcbiAgfSksXG59KSlcblxuLy8gTW9jayBhaG9va3MgdXNlQm9vbGVhbiB3aXRoIGNvbnRyb2xsYWJsZSBzdGF0ZVxubGV0IG1vY2tVc2VCb29sZWFuVmFsdWUgPSBmYWxzZVxuY29uc3QgbW9ja1NldFRydWUgPSB2aS5mbigoKSA9PiB7XG4gIG1vY2tVc2VCb29sZWFuVmFsdWUgPSB0cnVlXG59KVxuY29uc3QgbW9ja1NldEZhbHNlID0gdmkuZm4oKCkgPT4ge1xuICBtb2NrVXNlQm9vbGVhblZhbHVlID0gZmFsc2Vcbn0pXG5cbnZpLm1vY2soJ2Fob29rcycsICgpID0+ICh7XG4gIHVzZUJvb2xlYW46IChfZGVmYXVsdFZhbHVlOiBib29sZWFuKSA9PiB7XG4gICAgcmV0dXJuIFtcbiAgICAgIG1vY2tVc2VCb29sZWFuVmFsdWUsXG4gICAgICB7XG4gICAgICAgIHNldFRydWU6IG1vY2tTZXRUcnVlLFxuICAgICAgICBzZXRGYWxzZTogbW9ja1NldEZhbHNlLFxuICAgICAgICB0b2dnbGU6IHZpLmZuKCksXG4gICAgICB9LFxuICAgIF1cbiAgfSxcbn0pKVxuXG4vLyBNb2NrIGkxOG4tY29uZmlnL2xhbmd1YWdlXG52aS5tb2NrKCdAL2kxOG4tY29uZmlnL2xhbmd1YWdlJywgKCkgPT4gKHtcbiAgZ2V0TGFuZ3VhZ2U6IChsb2NhbGU6IHN0cmluZykgPT4gbG9jYWxlIHx8ICdlbi1VUycsXG59KSlcblxuLy8gTW9jayBtYXJrZXRwbGFjZSB1dGlsc1xudmkubW9jaygnLi4vdXRpbHMnLCAoKSA9PiAoe1xuICBnZXRQbHVnaW5MaW5rSW5NYXJrZXRwbGFjZTogKHBsdWdpbjogUGx1Z2luLCBfcGFyYW1zPzogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgdW5kZWZpbmVkPikgPT5cbiAgICBgL3BsdWdpbnMvJHtwbHVnaW4ub3JnfS8ke3BsdWdpbi5uYW1lfWAsXG4gIGdldFBsdWdpbkRldGFpbExpbmtJbk1hcmtldHBsYWNlOiAocGx1Z2luOiBQbHVnaW4pID0+XG4gICAgYC9wbHVnaW5zLyR7cGx1Z2luLm9yZ30vJHtwbHVnaW4ubmFtZX1gLFxufSkpXG5cbi8vIE1vY2sgQ2FyZCBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9jYXJkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgcGF5bG9hZCwgZm9vdGVyIH06IHsgcGF5bG9hZDogUGx1Z2luLCBmb290ZXI/OiBSZWFjdC5SZWFjdE5vZGUgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9e2BjYXJkLSR7cGF5bG9hZC5uYW1lfWB9PlxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImNhcmQtbmFtZVwiPntwYXlsb2FkLm5hbWV9PC9kaXY+XG4gICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY2FyZC1sYWJlbFwiPntwYXlsb2FkLmxhYmVsPy5bJ2VuLVVTJ10gfHwgcGF5bG9hZC5uYW1lfTwvZGl2PlxuICAgICAge2Zvb3RlciAmJiA8ZGl2IGRhdGEtdGVzdGlkPVwiY2FyZC1mb290ZXJcIj57Zm9vdGVyfTwvZGl2Pn1cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIENhcmRNb3JlSW5mbyBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9jYXJkL2NhcmQtbW9yZS1pbmZvJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgZG93bmxvYWRDb3VudCwgdGFncyB9OiB7IGRvd25sb2FkQ291bnQ6IG51bWJlciwgdGFnczogc3RyaW5nW10gfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJjYXJkLW1vcmUtaW5mb1wiPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJkb3dubG9hZC1jb3VudFwiPntkb3dubG9hZENvdW50fTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwidGFnc1wiPnt0YWdzLmpvaW4oJywnKX08L3NwYW4+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBJbnN0YWxsRnJvbU1hcmtldHBsYWNlIGNvbXBvbmVudFxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL2luc3RhbGwtcGx1Z2luL2luc3RhbGwtZnJvbS1tYXJrZXRwbGFjZScsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IG9uQ2xvc2UgfTogeyBvbkNsb3NlOiAoKSA9PiB2b2lkIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiaW5zdGFsbC1mcm9tLW1hcmtldHBsYWNlXCI+XG4gICAgICA8YnV0dG9uIG9uQ2xpY2s9e29uQ2xvc2V9IGRhdGEtdGVzdGlkPVwiY2xvc2UtaW5zdGFsbC1tb2RhbFwiPkNsb3NlPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBTb3J0RHJvcGRvd24gY29tcG9uZW50XG52aS5tb2NrKCcuLi9zb3J0LWRyb3Bkb3duJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJzb3J0LWRyb3Bkb3duXCI+U29ydDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgRW1wdHkgY29tcG9uZW50XG52aS5tb2NrKCcuLi9lbXB0eScsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGNsYXNzTmFtZSB9OiB7IGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImVtcHR5LWNvbXBvbmVudFwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgIE5vIHBsdWdpbnMgZm91bmRcbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIExvYWRpbmcgY29tcG9uZW50XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvbG9hZGluZycsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+IDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2FkaW5nLWNvbXBvbmVudFwiPkxvYWRpbmcuLi48L2Rpdj4sXG59KSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgRGF0YSBGYWN0b3JpZXNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZU1vY2tQbHVnaW4gPSAob3ZlcnJpZGVzPzogUGFydGlhbDxQbHVnaW4+KTogUGx1Z2luID0+ICh7XG4gIHR5cGU6ICdwbHVnaW4nLFxuICBvcmc6ICd0ZXN0LW9yZycsXG4gIG5hbWU6IGB0ZXN0LXBsdWdpbi0ke01hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cmluZyg3KX1gLFxuICBwbHVnaW5faWQ6IGBwbHVnaW4tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNyl9YCxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgbGF0ZXN0X3ZlcnNpb246ICcxLjAuMCcsXG4gIGxhdGVzdF9wYWNrYWdlX2lkZW50aWZpZXI6ICd0ZXN0LW9yZy90ZXN0LXBsdWdpbjoxLjAuMCcsXG4gIGljb246ICcvaWNvbi5wbmcnLFxuICB2ZXJpZmllZDogdHJ1ZSxcbiAgbGFiZWw6IHsgJ2VuLVVTJzogJ1Rlc3QgUGx1Z2luJyB9LFxuICBicmllZjogeyAnZW4tVVMnOiAnVGVzdCBwbHVnaW4gYnJpZWYgZGVzY3JpcHRpb24nIH0sXG4gIGRlc2NyaXB0aW9uOiB7ICdlbi1VUyc6ICdUZXN0IHBsdWdpbiBmdWxsIGRlc2NyaXB0aW9uJyB9LFxuICBpbnRyb2R1Y3Rpb246ICdUZXN0IHBsdWdpbiBpbnRyb2R1Y3Rpb24nLFxuICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9naXRodWIuY29tL3Rlc3QvcGx1Z2luJyxcbiAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICBpbnN0YWxsX2NvdW50OiAxMDAwLFxuICBlbmRwb2ludDogeyBzZXR0aW5nczogW10gfSxcbiAgdGFnczogW3sgbmFtZTogJ3NlYXJjaCcgfV0sXG4gIGJhZGdlczogW10sXG4gIHZlcmlmaWNhdGlvbjogeyBhdXRob3JpemVkX2NhdGVnb3J5OiAnY29tbXVuaXR5JyB9LFxuICBmcm9tOiAnbWFya2V0cGxhY2UnLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVNb2NrUGx1Z2luTGlzdCA9IChjb3VudDogbnVtYmVyKTogUGx1Z2luW10gPT5cbiAgQXJyYXkuZnJvbSh7IGxlbmd0aDogY291bnQgfSwgKF8sIGkpID0+XG4gICAgY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICBuYW1lOiBgcGx1Z2luLSR7aX1gLFxuICAgICAgcGx1Z2luX2lkOiBgcGx1Z2luLWlkLSR7aX1gLFxuICAgICAgbGFiZWw6IHsgJ2VuLVVTJzogYFBsdWdpbiAke2l9YCB9LFxuICAgIH0pKVxuXG5jb25zdCBjcmVhdGVNb2NrQ29sbGVjdGlvbiA9IChvdmVycmlkZXM/OiBQYXJ0aWFsPE1hcmtldHBsYWNlQ29sbGVjdGlvbj4pOiBNYXJrZXRwbGFjZUNvbGxlY3Rpb24gPT4gKHtcbiAgbmFtZTogYGNvbGxlY3Rpb24tJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNyl9YCxcbiAgbGFiZWw6IHsgJ2VuLVVTJzogJ1Rlc3QgQ29sbGVjdGlvbicgfSxcbiAgZGVzY3JpcHRpb246IHsgJ2VuLVVTJzogJ1Rlc3QgY29sbGVjdGlvbiBkZXNjcmlwdGlvbicgfSxcbiAgcnVsZTogJ3Rlc3QtcnVsZScsXG4gIGNyZWF0ZWRfYXQ6ICcyMDI0LTAxLTAxVDAwOjAwOjAwWicsXG4gIHVwZGF0ZWRfYXQ6ICcyMDI0LTAxLTAxVDAwOjAwOjAwWicsXG4gIHNlYXJjaGFibGU6IHRydWUsXG4gIHNlYXJjaF9wYXJhbXM6IHsgcXVlcnk6ICd0ZXN0JyB9LFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVNb2NrQ29sbGVjdGlvbkxpc3QgPSAoY291bnQ6IG51bWJlcik6IE1hcmtldHBsYWNlQ29sbGVjdGlvbltdID0+XG4gIEFycmF5LmZyb20oeyBsZW5ndGg6IGNvdW50IH0sIChfLCBpKSA9PlxuICAgIGNyZWF0ZU1vY2tDb2xsZWN0aW9uKHtcbiAgICAgIG5hbWU6IGBjb2xsZWN0aW9uLSR7aX1gLFxuICAgICAgbGFiZWw6IHsgJ2VuLVVTJzogYENvbGxlY3Rpb24gJHtpfWAgfSxcbiAgICAgIGRlc2NyaXB0aW9uOiB7ICdlbi1VUyc6IGBEZXNjcmlwdGlvbiBmb3IgY29sbGVjdGlvbiAke2l9YCB9LFxuICAgIH0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTGlzdCBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnTGlzdCcsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM6IFtdIGFzIE1hcmtldHBsYWNlQ29sbGVjdGlvbltdLFxuICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXA6IHt9IGFzIFJlY29yZDxzdHJpbmcsIFBsdWdpbltdPixcbiAgICBwbHVnaW5zOiB1bmRlZmluZWQsXG4gICAgc2hvd0luc3RhbGxCdXR0b246IGZhbHNlLFxuICAgIGNhcmRDb250YWluZXJDbGFzc05hbWU6ICcnLFxuICAgIGNhcmRSZW5kZXI6IHVuZGVmaW5lZCxcbiAgICBvbk1vcmVDbGljazogdW5kZWZpbmVkLFxuICAgIGVtcHR5Q2xhc3NOYW1lOiAnJyxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPExpc3Qgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIENvbXBvbmVudCBzaG91bGQgcmVuZGVyIHdpdGhvdXQgZXJyb3JzXG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBMaXN0V2l0aENvbGxlY3Rpb24gd2hlbiBwbHVnaW5zIHByb3AgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSBjcmVhdGVNb2NrQ29sbGVjdGlvbkxpc3QoMilcbiAgICAgIGNvbnN0IHBsdWdpbnNNYXA6IFJlY29yZDxzdHJpbmcsIFBsdWdpbltdPiA9IHtcbiAgICAgICAgJ2NvbGxlY3Rpb24tMCc6IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDIpLFxuICAgICAgICAnY29sbGVjdGlvbi0xJzogY3JlYXRlTW9ja1BsdWdpbkxpc3QoMyksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPExpc3RcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM9e2NvbGxlY3Rpb25zfVxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXA9e3BsdWdpbnNNYXB9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBTaG91bGQgcmVuZGVyIGNvbGxlY3Rpb24gdGl0bGVzXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ29sbGVjdGlvbiAwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDb2xsZWN0aW9uIDEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwbHVnaW4gY2FyZHMgd2hlbiBwbHVnaW5zIGFycmF5IGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2lucyA9IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDMpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPExpc3RcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIHBsdWdpbnM9e3BsdWdpbnN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBTaG91bGQgcmVuZGVyIHBsdWdpbiBjYXJkc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2FyZC1wbHVnaW4tMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLXBsdWdpbi0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhcmQtcGx1Z2luLTInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBFbXB0eSBjb21wb25lbnQgd2hlbiBwbHVnaW5zIGFycmF5IGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8TGlzdFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgcGx1Z2lucz17W119XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbXB0eS1jb21wb25lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgTGlzdFdpdGhDb2xsZWN0aW9uIHdoZW4gcGx1Z2lucyBpcyBkZWZpbmVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSBjcmVhdGVNb2NrQ29sbGVjdGlvbkxpc3QoMilcbiAgICAgIGNvbnN0IHBsdWdpbnNNYXA6IFJlY29yZDxzdHJpbmcsIFBsdWdpbltdPiA9IHtcbiAgICAgICAgJ2NvbGxlY3Rpb24tMCc6IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDIpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxMaXN0XG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtjb2xsZWN0aW9uc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXtwbHVnaW5zTWFwfVxuICAgICAgICAgIHBsdWdpbnM9e1tdfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gU2hvdWxkIG5vdCByZW5kZXIgY29sbGVjdGlvbiB0aXRsZXNcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0NvbGxlY3Rpb24gMCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhcHBseSBjYXJkQ29udGFpbmVyQ2xhc3NOYW1lIHRvIGdyaWQgY29udGFpbmVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2lucyA9IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDIpXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8TGlzdFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgcGx1Z2lucz17cGx1Z2luc31cbiAgICAgICAgICBjYXJkQ29udGFpbmVyQ2xhc3NOYW1lPVwiY3VzdG9tLWdyaWQtY2xhc3NcIlxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY3VzdG9tLWdyaWQtY2xhc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IGVtcHR5Q2xhc3NOYW1lIHRvIEVtcHR5IGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPExpc3RcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIHBsdWdpbnM9e1tdfVxuICAgICAgICAgIGVtcHR5Q2xhc3NOYW1lPVwiY3VzdG9tLWVtcHR5LWNsYXNzXCJcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VtcHR5LWNvbXBvbmVudCcpKS50b0hhdmVDbGFzcygnY3VzdG9tLWVtcHR5LWNsYXNzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHNob3dJbnN0YWxsQnV0dG9uIHRvIENhcmRXcmFwcGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2lucyA9IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDEpXG5cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxMaXN0XG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBwbHVnaW5zPXtwbHVnaW5zfVxuICAgICAgICAgIHNob3dJbnN0YWxsQnV0dG9uPXt0cnVlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gQ2FyZFdyYXBwZXIgc2hvdWxkIGJlIHJlbmRlcmVkICh2aWEgQ2FyZCBtb2NrKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdbZGF0YS10ZXN0aWQ9XCJjYXJkLXBsdWdpbi0wXCJdJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEN1c3RvbSBDYXJkIFJlbmRlciBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ3VzdG9tIENhcmQgUmVuZGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXNlIGNhcmRSZW5kZXIgZnVuY3Rpb24gd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbnMgPSBjcmVhdGVNb2NrUGx1Z2luTGlzdCgyKVxuICAgICAgY29uc3QgY3VzdG9tQ2FyZFJlbmRlciA9IChwbHVnaW46IFBsdWdpbikgPT4gKFxuICAgICAgICA8ZGl2IGtleT17cGx1Z2luLm5hbWV9IGRhdGEtdGVzdGlkPXtgY3VzdG9tLWNhcmQtJHtwbHVnaW4ubmFtZX1gfT5cbiAgICAgICAgICBDdXN0b206XG4gICAgICAgICAgeycgJ31cbiAgICAgICAgICB7cGx1Z2luLm5hbWV9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxMaXN0XG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBwbHVnaW5zPXtwbHVnaW5zfVxuICAgICAgICAgIGNhcmRSZW5kZXI9e2N1c3RvbUNhcmRSZW5kZXJ9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXN0b20tY2FyZC1wbHVnaW4tMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXN0b20tY2FyZC1wbHVnaW4tMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ3VzdG9tOiBwbHVnaW4tMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNhcmRSZW5kZXIgcmV0dXJuaW5nIG51bGwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5zID0gY3JlYXRlTW9ja1BsdWdpbkxpc3QoMilcbiAgICAgIGNvbnN0IGN1c3RvbUNhcmRSZW5kZXIgPSAocGx1Z2luOiBQbHVnaW4pID0+IHtcbiAgICAgICAgaWYgKHBsdWdpbi5uYW1lID09PSAncGx1Z2luLTAnKVxuICAgICAgICAgIHJldHVybiBudWxsXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdiBrZXk9e3BsdWdpbi5uYW1lfSBkYXRhLXRlc3RpZD17YGN1c3RvbS1jYXJkLSR7cGx1Z2luLm5hbWV9YH0+XG4gICAgICAgICAgICB7cGx1Z2luLm5hbWV9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIClcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8TGlzdFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgcGx1Z2lucz17cGx1Z2luc31cbiAgICAgICAgICBjYXJkUmVuZGVyPXtjdXN0b21DYXJkUmVuZGVyfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdjdXN0b20tY2FyZC1wbHVnaW4tMCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLWNhcmQtcGx1Z2luLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8TGlzdFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9ucz17W119XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc01hcD17e319XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBTaG91bGQgbm90IHRocm93IGFuZCByZW5kZXIgbm90aGluZ1xuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHBsdWdpbnMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSBjcmVhdGVNb2NrQ29sbGVjdGlvbkxpc3QoMSlcbiAgICAgIGNvbnN0IHBsdWdpbnNNYXA6IFJlY29yZDxzdHJpbmcsIFBsdWdpbltdPiA9IHtcbiAgICAgICAgJ2NvbGxlY3Rpb24tMCc6IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDEpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxMaXN0XG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtjb2xsZWN0aW9uc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXtwbHVnaW5zTWFwfVxuICAgICAgICAgIHBsdWdpbnM9e3VuZGVmaW5lZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFNob3VsZCByZW5kZXIgTGlzdFdpdGhDb2xsZWN0aW9uXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ29sbGVjdGlvbiAwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbGFyZ2UgbnVtYmVyIG9mIHBsdWdpbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5zID0gY3JlYXRlTW9ja1BsdWdpbkxpc3QoMTAwKVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8TGlzdFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgcGx1Z2lucz17cGx1Z2luc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFNob3VsZCByZW5kZXIgYWxsIHBsdWdpbiBjYXJkc1xuICAgICAgY29uc3QgY2FyZHMgPSBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtdGVzdGlkXj1cImNhcmQtcGx1Z2luLVwiXScpXG4gICAgICBleHBlY3QoY2FyZHMubGVuZ3RoKS50b0JlKDEwMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGx1Z2lucyB3aXRoIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3Qgc3BlY2lhbFBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBuYW1lOiAncGx1Z2luLXdpdGgtc3BlY2lhbC1jaGFycyFAIycsXG4gICAgICAgIG9yZzogJ3Rlc3Qtb3JnJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPExpc3RcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIHBsdWdpbnM9e1tzcGVjaWFsUGx1Z2luXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhcmQtcGx1Z2luLXdpdGgtc3BlY2lhbC1jaGFycyFAIycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBMaXN0V2l0aENvbGxlY3Rpb24gQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0xpc3RXaXRoQ29sbGVjdGlvbicsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM6IFtdIGFzIE1hcmtldHBsYWNlQ29sbGVjdGlvbltdLFxuICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXA6IHt9IGFzIFJlY29yZDxzdHJpbmcsIFBsdWdpbltdPixcbiAgICBzaG93SW5zdGFsbEJ1dHRvbjogZmFsc2UsXG4gICAgY2FyZENvbnRhaW5lckNsYXNzTmFtZTogJycsXG4gICAgY2FyZFJlbmRlcjogdW5kZWZpbmVkLFxuICAgIG9uTW9yZUNsaWNrOiB1bmRlZmluZWQsXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMaXN0V2l0aENvbGxlY3Rpb24gey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChkb2N1bWVudC5ib2R5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvbGxlY3Rpb24gbGFiZWxzIGFuZCBkZXNjcmlwdGlvbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IGNyZWF0ZU1vY2tDb2xsZWN0aW9uTGlzdCgyKVxuICAgICAgY29uc3QgcGx1Z2luc01hcDogUmVjb3JkPHN0cmluZywgUGx1Z2luW10+ID0ge1xuICAgICAgICAnY29sbGVjdGlvbi0wJzogY3JlYXRlTW9ja1BsdWdpbkxpc3QoMSksXG4gICAgICAgICdjb2xsZWN0aW9uLTEnOiBjcmVhdGVNb2NrUGx1Z2luTGlzdCgxKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8TGlzdFdpdGhDb2xsZWN0aW9uXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtjb2xsZWN0aW9uc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXtwbHVnaW5zTWFwfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NvbGxlY3Rpb24gMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRGVzY3JpcHRpb24gZm9yIGNvbGxlY3Rpb24gMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ29sbGVjdGlvbiAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEZXNjcmlwdGlvbiBmb3IgY29sbGVjdGlvbiAxJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGx1Z2luIGNhcmRzIHdpdGhpbiBjb2xsZWN0aW9ucycsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb25zID0gY3JlYXRlTW9ja0NvbGxlY3Rpb25MaXN0KDEpXG4gICAgICBjb25zdCBwbHVnaW5zTWFwOiBSZWNvcmQ8c3RyaW5nLCBQbHVnaW5bXT4gPSB7XG4gICAgICAgICdjb2xsZWN0aW9uLTAnOiBjcmVhdGVNb2NrUGx1Z2luTGlzdCgzKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8TGlzdFdpdGhDb2xsZWN0aW9uXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtjb2xsZWN0aW9uc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXtwbHVnaW5zTWFwfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2FyZC1wbHVnaW4tMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLXBsdWdpbi0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhcmQtcGx1Z2luLTInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgY29sbGVjdGlvbnMgd2l0aCBubyBwbHVnaW5zJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSBjcmVhdGVNb2NrQ29sbGVjdGlvbkxpc3QoMilcbiAgICAgIGNvbnN0IHBsdWdpbnNNYXA6IFJlY29yZDxzdHJpbmcsIFBsdWdpbltdPiA9IHtcbiAgICAgICAgJ2NvbGxlY3Rpb24tMCc6IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDEpLFxuICAgICAgICAnY29sbGVjdGlvbi0xJzogW10sIC8vIEVtcHR5IHBsdWdpbnNcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8TGlzdFdpdGhDb2xsZWN0aW9uXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtjb2xsZWN0aW9uc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXtwbHVnaW5zTWFwfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NvbGxlY3Rpb24gMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdDb2xsZWN0aW9uIDEnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFZpZXcgTW9yZSBCdXR0b24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1ZpZXcgTW9yZSBCdXR0b24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgVmlldyBNb3JlIGJ1dHRvbiB3aGVuIGNvbGxlY3Rpb24gaXMgc2VhcmNoYWJsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb25zID0gW2NyZWF0ZU1vY2tDb2xsZWN0aW9uKHtcbiAgICAgICAgbmFtZTogJ2NvbGxlY3Rpb24tMCcsXG4gICAgICAgIHNlYXJjaGFibGU6IHRydWUsXG4gICAgICAgIHNlYXJjaF9wYXJhbXM6IHsgcXVlcnk6ICd0ZXN0JyB9LFxuICAgICAgfSldXG4gICAgICBjb25zdCBwbHVnaW5zTWFwOiBSZWNvcmQ8c3RyaW5nLCBQbHVnaW5bXT4gPSB7XG4gICAgICAgICdjb2xsZWN0aW9uLTAnOiBjcmVhdGVNb2NrUGx1Z2luTGlzdCgxKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8TGlzdFdpdGhDb2xsZWN0aW9uXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtjb2xsZWN0aW9uc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXtwbHVnaW5zTWFwfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1ZpZXcgTW9yZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBWaWV3IE1vcmUgYnV0dG9uIHdoZW4gY29sbGVjdGlvbiBpcyBub3Qgc2VhcmNoYWJsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGNvbGxlY3Rpb25zID0gW2NyZWF0ZU1vY2tDb2xsZWN0aW9uKHtcbiAgICAgICAgbmFtZTogJ2NvbGxlY3Rpb24tMCcsXG4gICAgICAgIHNlYXJjaGFibGU6IGZhbHNlLFxuICAgICAgfSldXG4gICAgICBjb25zdCBwbHVnaW5zTWFwOiBSZWNvcmQ8c3RyaW5nLCBQbHVnaW5bXT4gPSB7XG4gICAgICAgICdjb2xsZWN0aW9uLTAnOiBjcmVhdGVNb2NrUGx1Z2luTGlzdCgxKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8TGlzdFdpdGhDb2xsZWN0aW9uXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtjb2xsZWN0aW9uc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXtwbHVnaW5zTWFwfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnVmlldyBNb3JlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBtb3JlQ2xpY2sgaG9vayB3aXRoIHNlYXJjaF9wYXJhbXMgd2hlbiBWaWV3IE1vcmUgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHNlYXJjaFBhcmFtczogU2VhcmNoUGFyYW1zRnJvbUNvbGxlY3Rpb24gPSB7IHF1ZXJ5OiAndGVzdC1xdWVyeScsIHNvcnRfYnk6ICdpbnN0YWxsX2NvdW50JyB9XG4gICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IFtjcmVhdGVNb2NrQ29sbGVjdGlvbih7XG4gICAgICAgIG5hbWU6ICdjb2xsZWN0aW9uLTAnLFxuICAgICAgICBzZWFyY2hhYmxlOiB0cnVlLFxuICAgICAgICBzZWFyY2hfcGFyYW1zOiBzZWFyY2hQYXJhbXMsXG4gICAgICB9KV1cbiAgICAgIGNvbnN0IHBsdWdpbnNNYXA6IFJlY29yZDxzdHJpbmcsIFBsdWdpbltdPiA9IHtcbiAgICAgICAgJ2NvbGxlY3Rpb24tMCc6IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDEpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxMaXN0V2l0aENvbGxlY3Rpb25cbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM9e2NvbGxlY3Rpb25zfVxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXA9e3BsdWdpbnNNYXB9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnVmlldyBNb3JlJykpXG5cbiAgICAgIGV4cGVjdChtb2NrTW9yZUNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChtb2NrTW9yZUNsaWNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChzZWFyY2hQYXJhbXMpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDdXN0b20gQ2FyZCBSZW5kZXIgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0N1c3RvbSBDYXJkIFJlbmRlcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSBjYXJkUmVuZGVyIGZ1bmN0aW9uIHdoZW4gcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IGNyZWF0ZU1vY2tDb2xsZWN0aW9uTGlzdCgxKVxuICAgICAgY29uc3QgcGx1Z2luc01hcDogUmVjb3JkPHN0cmluZywgUGx1Z2luW10+ID0ge1xuICAgICAgICAnY29sbGVjdGlvbi0wJzogY3JlYXRlTW9ja1BsdWdpbkxpc3QoMiksXG4gICAgICB9XG4gICAgICBjb25zdCBjdXN0b21DYXJkUmVuZGVyID0gKHBsdWdpbjogUGx1Z2luKSA9PiAoXG4gICAgICAgIDxkaXYga2V5PXtwbHVnaW4ucGx1Z2luX2lkfSBkYXRhLXRlc3RpZD17YGN1c3RvbS0ke3BsdWdpbi5uYW1lfWB9PlxuICAgICAgICAgIEN1c3RvbTpcbiAgICAgICAgICB7JyAnfVxuICAgICAgICAgIHtwbHVnaW4ubmFtZX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPExpc3RXaXRoQ29sbGVjdGlvblxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9ucz17Y29sbGVjdGlvbnN9XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc01hcD17cGx1Z2luc01hcH1cbiAgICAgICAgICBjYXJkUmVuZGVyPXtjdXN0b21DYXJkUmVuZGVyfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLXBsdWdpbi0wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDdXN0b206IHBsdWdpbi0wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXBwbHkgY2FyZENvbnRhaW5lckNsYXNzTmFtZSB0byBncmlkJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSBjcmVhdGVNb2NrQ29sbGVjdGlvbkxpc3QoMSlcbiAgICAgIGNvbnN0IHBsdWdpbnNNYXA6IFJlY29yZDxzdHJpbmcsIFBsdWdpbltdPiA9IHtcbiAgICAgICAgJ2NvbGxlY3Rpb24tMCc6IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDEpLFxuICAgICAgfVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8TGlzdFdpdGhDb2xsZWN0aW9uXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtjb2xsZWN0aW9uc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXtwbHVnaW5zTWFwfVxuICAgICAgICAgIGNhcmRDb250YWluZXJDbGFzc05hbWU9XCJjdXN0b20tY29udGFpbmVyXCJcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmN1c3RvbS1jb250YWluZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3Mgc2hvd0luc3RhbGxCdXR0b24gdG8gQ2FyZFdyYXBwZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IGNyZWF0ZU1vY2tDb2xsZWN0aW9uTGlzdCgxKVxuICAgICAgY29uc3QgcGx1Z2luc01hcDogUmVjb3JkPHN0cmluZywgUGx1Z2luW10+ID0ge1xuICAgICAgICAnY29sbGVjdGlvbi0wJzogY3JlYXRlTW9ja1BsdWdpbkxpc3QoMSksXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxMaXN0V2l0aENvbGxlY3Rpb25cbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM9e2NvbGxlY3Rpb25zfVxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXA9e3BsdWdpbnNNYXB9XG4gICAgICAgICAgc2hvd0luc3RhbGxCdXR0b249e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBDYXJkV3JhcHBlciBzaG91bGQgYmUgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignW2RhdGEtdGVzdGlkPVwiY2FyZC1wbHVnaW4tMFwiXScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGNvbGxlY3Rpb25zIGFycmF5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8TGlzdFdpdGhDb2xsZWN0aW9uXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtbXX1cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXt7fX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChkb2N1bWVudC5ib2R5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1pc3NpbmcgcGx1Z2lucyBpbiBtYXAnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjb2xsZWN0aW9ucyA9IGNyZWF0ZU1vY2tDb2xsZWN0aW9uTGlzdCgxKVxuICAgICAgLy8gcGx1Z2luc01hcCBkb2Vzbid0IGhhdmUgdGhlIGNvbGxlY3Rpb25cbiAgICAgIGNvbnN0IHBsdWdpbnNNYXA6IFJlY29yZDxzdHJpbmcsIFBsdWdpbltdPiA9IHt9XG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPExpc3RXaXRoQ29sbGVjdGlvblxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9ucz17Y29sbGVjdGlvbnN9XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc01hcD17cGx1Z2luc01hcH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIENvbGxlY3Rpb24gc2hvdWxkIG5vdCBiZSByZW5kZXJlZCBiZWNhdXNlIGl0IGhhcyBubyBwbHVnaW5zXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdDb2xsZWN0aW9uIDAnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIHBsdWdpbnMgaW4gbWFwJywgKCkgPT4ge1xuICAgICAgY29uc3QgY29sbGVjdGlvbnMgPSBjcmVhdGVNb2NrQ29sbGVjdGlvbkxpc3QoMSlcbiAgICAgIGNvbnN0IHBsdWdpbnNNYXA6IFJlY29yZDxzdHJpbmcsIFBsdWdpbltdPiA9IHtcbiAgICAgICAgJ2NvbGxlY3Rpb24tMCc6IHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIFBsdWdpbltdLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxMaXN0V2l0aENvbGxlY3Rpb25cbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM9e2NvbGxlY3Rpb25zfVxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXA9e3BsdWdpbnNNYXB9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBDb2xsZWN0aW9uIHNob3VsZCBub3QgYmUgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0NvbGxlY3Rpb24gMCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTGlzdFdyYXBwZXIgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0xpc3RXcmFwcGVyJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICAvLyBSZXNldCBtb2NrIGRhdGFcbiAgICBtb2NrTWFya2V0cGxhY2VEYXRhLnBsdWdpbnMgPSB1bmRlZmluZWRcbiAgICBtb2NrTWFya2V0cGxhY2VEYXRhLnBsdWdpbnNUb3RhbCA9IDBcbiAgICBtb2NrTWFya2V0cGxhY2VEYXRhLm1hcmtldHBsYWNlQ29sbGVjdGlvbnMgPSB1bmRlZmluZWRcbiAgICBtb2NrTWFya2V0cGxhY2VEYXRhLm1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXAgPSB1bmRlZmluZWRcbiAgICBtb2NrTWFya2V0cGxhY2VEYXRhLmlzTG9hZGluZyA9IGZhbHNlXG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5wYWdlID0gMVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPExpc3RXcmFwcGVyIC8+KVxuXG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHNjcm9sbGJhckd1dHRlciBzdHlsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExpc3RXcmFwcGVyIC8+KVxuXG4gICAgICBjb25zdCB3cmFwcGVyID0gY29udGFpbmVyLmZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnRcbiAgICAgIGV4cGVjdCh3cmFwcGVyKS50b0hhdmVTdHlsZSh7IHNjcm9sbGJhckd1dHRlcjogJ3N0YWJsZScgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgTG9hZGluZyBjb21wb25lbnQgd2hlbiBpc0xvYWRpbmcgaXMgdHJ1ZSBhbmQgcGFnZSBpcyAxJywgKCkgPT4ge1xuICAgICAgbW9ja01hcmtldHBsYWNlRGF0YS5pc0xvYWRpbmcgPSB0cnVlXG4gICAgICBtb2NrTWFya2V0cGxhY2VEYXRhLnBhZ2UgPSAxXG5cbiAgICAgIHJlbmRlcig8TGlzdFdyYXBwZXIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRpbmctY29tcG9uZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIExvYWRpbmcgY29tcG9uZW50IHdoZW4gcGFnZSA+IDEnLCAoKSA9PiB7XG4gICAgICBtb2NrTWFya2V0cGxhY2VEYXRhLmlzTG9hZGluZyA9IHRydWVcbiAgICAgIG1vY2tNYXJrZXRwbGFjZURhdGEucGFnZSA9IDJcblxuICAgICAgcmVuZGVyKDxMaXN0V3JhcHBlciAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdsb2FkaW5nLWNvbXBvbmVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUGx1Z2lucyBIZWFkZXIgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1BsdWdpbnMgSGVhZGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBsdWdpbnMgcmVzdWx0IGNvdW50IHdoZW4gcGx1Z2lucyBhcmUgcHJlc2VudCcsICgpID0+IHtcbiAgICAgIG1vY2tNYXJrZXRwbGFjZURhdGEucGx1Z2lucyA9IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDUpXG4gICAgICBtb2NrTWFya2V0cGxhY2VEYXRhLnBsdWdpbnNUb3RhbCA9IDVcblxuICAgICAgcmVuZGVyKDxMaXN0V3JhcHBlciAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzUgcGx1Z2lucyBmb3VuZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFNvcnREcm9wZG93biB3aGVuIHBsdWdpbnMgYXJlIHByZXNlbnQnLCAoKSA9PiB7XG4gICAgICBtb2NrTWFya2V0cGxhY2VEYXRhLnBsdWdpbnMgPSBjcmVhdGVNb2NrUGx1Z2luTGlzdCgxKVxuXG4gICAgICByZW5kZXIoPExpc3RXcmFwcGVyIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzb3J0LWRyb3Bkb3duJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIHBsdWdpbnMgaGVhZGVyIHdoZW4gcGx1Z2lucyBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrTWFya2V0cGxhY2VEYXRhLnBsdWdpbnMgPSB1bmRlZmluZWRcblxuICAgICAgcmVuZGVyKDxMaXN0V3JhcHBlciAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdzb3J0LWRyb3Bkb3duJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBMaXN0IFJlbmRlcmluZyBMb2dpYyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTGlzdCBSZW5kZXJpbmcgTG9naWMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY29sbGVjdGlvbnMgd2hlbiBub3QgbG9hZGluZycsICgpID0+IHtcbiAgICAgIG1vY2tNYXJrZXRwbGFjZURhdGEuaXNMb2FkaW5nID0gZmFsc2VcbiAgICAgIG1vY2tNYXJrZXRwbGFjZURhdGEubWFya2V0cGxhY2VDb2xsZWN0aW9ucyA9IGNyZWF0ZU1vY2tDb2xsZWN0aW9uTGlzdCgxKVxuICAgICAgbW9ja01hcmtldHBsYWNlRGF0YS5tYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwID0ge1xuICAgICAgICAnY29sbGVjdGlvbi0wJzogY3JlYXRlTW9ja1BsdWdpbkxpc3QoMSksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8TGlzdFdyYXBwZXIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDb2xsZWN0aW9uIDAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBMaXN0IHdoZW4gbG9hZGluZyBidXQgcGFnZSA+IDEnLCAoKSA9PiB7XG4gICAgICBtb2NrTWFya2V0cGxhY2VEYXRhLmlzTG9hZGluZyA9IHRydWVcbiAgICAgIG1vY2tNYXJrZXRwbGFjZURhdGEucGFnZSA9IDJcbiAgICAgIG1vY2tNYXJrZXRwbGFjZURhdGEubWFya2V0cGxhY2VDb2xsZWN0aW9ucyA9IGNyZWF0ZU1vY2tDb2xsZWN0aW9uTGlzdCgxKVxuICAgICAgbW9ja01hcmtldHBsYWNlRGF0YS5tYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwID0ge1xuICAgICAgICAnY29sbGVjdGlvbi0wJzogY3JlYXRlTW9ja1BsdWdpbkxpc3QoMSksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8TGlzdFdyYXBwZXIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDb2xsZWN0aW9uIDAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRGF0YSBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRGF0YSBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3MgcGx1Z2lucyBmcm9tIHN0YXRlIHRvIExpc3QnLCAoKSA9PiB7XG4gICAgICBtb2NrTWFya2V0cGxhY2VEYXRhLnBsdWdpbnMgPSBjcmVhdGVNb2NrUGx1Z2luTGlzdCgyKVxuXG4gICAgICByZW5kZXIoPExpc3RXcmFwcGVyIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLXBsdWdpbi0wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhcmQtcGx1Z2luLTEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgVmlldyBNb3JlIGJ1dHRvbiBhbmQgY2FsbCBtb3JlQ2xpY2sgaG9vaycsICgpID0+IHtcbiAgICAgIG1vY2tNYXJrZXRwbGFjZURhdGEubWFya2V0cGxhY2VDb2xsZWN0aW9ucyA9IFtjcmVhdGVNb2NrQ29sbGVjdGlvbih7XG4gICAgICAgIG5hbWU6ICdjb2xsZWN0aW9uLTAnLFxuICAgICAgICBzZWFyY2hhYmxlOiB0cnVlLFxuICAgICAgICBzZWFyY2hfcGFyYW1zOiB7IHF1ZXJ5OiAndGVzdCcgfSxcbiAgICAgIH0pXVxuICAgICAgbW9ja01hcmtldHBsYWNlRGF0YS5tYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwID0ge1xuICAgICAgICAnY29sbGVjdGlvbi0wJzogY3JlYXRlTW9ja1BsdWdpbkxpc3QoMSksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8TGlzdFdyYXBwZXIgLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdWaWV3IE1vcmUnKSlcblxuICAgICAgZXhwZWN0KG1vY2tNb3JlQ2xpY2spLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBwbHVnaW5zIGFycmF5JywgKCkgPT4ge1xuICAgICAgbW9ja01hcmtldHBsYWNlRGF0YS5wbHVnaW5zID0gW11cbiAgICAgIG1vY2tNYXJrZXRwbGFjZURhdGEucGx1Z2luc1RvdGFsID0gMFxuXG4gICAgICByZW5kZXIoPExpc3RXcmFwcGVyIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMCBwbHVnaW5zIGZvdW5kJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2VtcHR5LWNvbXBvbmVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGxhcmdlIHBsdWdpbnNUb3RhbCcsICgpID0+IHtcbiAgICAgIG1vY2tNYXJrZXRwbGFjZURhdGEucGx1Z2lucyA9IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDEwKVxuICAgICAgbW9ja01hcmtldHBsYWNlRGF0YS5wbHVnaW5zVG90YWwgPSAxMDAwMFxuXG4gICAgICByZW5kZXIoPExpc3RXcmFwcGVyIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMTAwMDAgcGx1Z2lucyBmb3VuZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGJvdGggbG9hZGluZyBhbmQgaGFzIHBsdWdpbnMnLCAoKSA9PiB7XG4gICAgICBtb2NrTWFya2V0cGxhY2VEYXRhLmlzTG9hZGluZyA9IHRydWVcbiAgICAgIG1vY2tNYXJrZXRwbGFjZURhdGEucGFnZSA9IDJcbiAgICAgIG1vY2tNYXJrZXRwbGFjZURhdGEucGx1Z2lucyA9IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDUpXG4gICAgICBtb2NrTWFya2V0cGxhY2VEYXRhLnBsdWdpbnNUb3RhbCA9IDUwXG5cbiAgICAgIHJlbmRlcig8TGlzdFdyYXBwZXIgLz4pXG5cbiAgICAgIC8vIFNob3VsZCBzaG93IHBsdWdpbnMgaGVhZGVyIGFuZCBsaXN0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnNTAgcGx1Z2lucyBmb3VuZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBTaG91bGQgbm90IHNob3cgbG9hZGluZyBiZWNhdXNlIHBhZ2UgPiAxXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2xvYWRpbmctY29tcG9uZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDYXJkV3JhcHBlciBDb21wb25lbnQgVGVzdHMgKHZpYSBMaXN0IGludGVncmF0aW9uKVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdDYXJkV3JhcHBlciAodmlhIExpc3QgaW50ZWdyYXRpb24pJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrVXNlQm9vbGVhblZhbHVlID0gZmFsc2VcbiAgfSlcblxuICBkZXNjcmliZSgnQ2FyZCBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgQ2FyZCB3aXRoIHBsdWdpbiBkYXRhJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIG5hbWU6ICd0ZXN0LXBsdWdpbicsXG4gICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdUZXN0IFBsdWdpbiBMYWJlbCcgfSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPExpc3RcbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtbXX1cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXt7fX1cbiAgICAgICAgICBwbHVnaW5zPXtbcGx1Z2luXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhcmQtdGVzdC1wbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBDYXJkTW9yZUluZm8gd2l0aCBkb3dubG9hZCBjb3VudCBhbmQgdGFncycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBuYW1lOiAndGVzdC1wbHVnaW4nLFxuICAgICAgICBpbnN0YWxsX2NvdW50OiA1MDAwLFxuICAgICAgICB0YWdzOiBbeyBuYW1lOiAnc2VhcmNoJyB9LCB7IG5hbWU6ICdpbWFnZScgfV0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxMaXN0XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9ucz17W119XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc01hcD17e319XG4gICAgICAgICAgcGx1Z2lucz17W3BsdWdpbl19XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLW1vcmUtaW5mbycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdkb3dubG9hZC1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnNTAwMCcpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUGx1Z2luIEtleSBHZW5lcmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXNlIG9yZy9uYW1lIGFzIGtleSBmb3IgcGx1Z2lucycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbnMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tQbHVnaW4oeyBvcmc6ICdvcmcxJywgbmFtZTogJ3BsdWdpbjEnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrUGx1Z2luKHsgb3JnOiAnb3JnMicsIG5hbWU6ICdwbHVnaW4yJyB9KSxcbiAgICAgIF1cblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8TGlzdFxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM9e1tdfVxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXA9e3t9fVxuICAgICAgICAgIHBsdWdpbnM9e3BsdWdpbnN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLXBsdWdpbjEnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2FyZC1wbHVnaW4yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIHNob3dJbnN0YWxsQnV0dG9uIEJyYW5jaCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnc2hvd0luc3RhbGxCdXR0b249dHJ1ZSBicmFuY2gnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgaW5zdGFsbCBhbmQgZGV0YWlsIGJ1dHRvbnMgd2hlbiBzaG93SW5zdGFsbEJ1dHRvbiBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7IG5hbWU6ICdpbnN0YWxsLXRlc3QtcGx1Z2luJyB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxMaXN0XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9ucz17W119XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc01hcD17e319XG4gICAgICAgICAgcGx1Z2lucz17W3BsdWdpbl19XG4gICAgICAgICAgc2hvd0luc3RhbGxCdXR0b249e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBTaG91bGQgcmVuZGVyIHRoZSBjYXJkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLWluc3RhbGwtdGVzdC1wbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gU2hvdWxkIHJlbmRlciBpbnN0YWxsIGJ1dHRvblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0luc3RhbGwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gU2hvdWxkIHJlbmRlciBkZXRhaWwgYnV0dG9uXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRGV0YWlsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNob3dJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHdoZW4gaW5zdGFsbCBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oeyBuYW1lOiAnY2xpY2stdGVzdC1wbHVnaW4nIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPExpc3RcbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtbXX1cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXt7fX1cbiAgICAgICAgICBwbHVnaW5zPXtbcGx1Z2luXX1cbiAgICAgICAgICBzaG93SW5zdGFsbEJ1dHRvbj17dHJ1ZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGluc3RhbGxCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdJbnN0YWxsJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhpbnN0YWxsQnV0dG9uKVxuXG4gICAgICBleHBlY3QobW9ja1NldFRydWUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkZXRhaWwgbGluayB3aXRoIGNvcnJlY3QgaHJlZicsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBuYW1lOiAnbGluay10ZXN0LXBsdWdpbicsXG4gICAgICAgIG9yZzogJ3Rlc3Qtb3JnJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPExpc3RcbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtbXX1cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXt7fX1cbiAgICAgICAgICBwbHVnaW5zPXtbcGx1Z2luXX1cbiAgICAgICAgICBzaG93SW5zdGFsbEJ1dHRvbj17dHJ1ZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGNvbnN0IGRldGFpbExpbmsgPSBzY3JlZW4uZ2V0QnlUZXh0KCdEZXRhaWwnKS5jbG9zZXN0KCdhJylcbiAgICAgIGV4cGVjdChkZXRhaWxMaW5rKS50b0hhdmVBdHRyaWJ1dGUoJ2hyZWYnLCAnL3BsdWdpbnMvdGVzdC1vcmcvbGluay10ZXN0LXBsdWdpbicpXG4gICAgICBleHBlY3QoZGV0YWlsTGluaykudG9IYXZlQXR0cmlidXRlKCd0YXJnZXQnLCAnX2JsYW5rJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSW5zdGFsbEZyb21NYXJrZXRwbGFjZSBtb2RhbCB3aGVuIGlzU2hvd0luc3RhbGxGcm9tTWFya2V0cGxhY2UgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIG1vY2tVc2VCb29sZWFuVmFsdWUgPSB0cnVlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHsgbmFtZTogJ21vZGFsLXRlc3QtcGx1Z2luJyB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxMaXN0XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9ucz17W119XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc01hcD17e319XG4gICAgICAgICAgcGx1Z2lucz17W3BsdWdpbl19XG4gICAgICAgICAgc2hvd0luc3RhbGxCdXR0b249e3RydWV9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWZyb20tbWFya2V0cGxhY2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgSW5zdGFsbEZyb21NYXJrZXRwbGFjZSBtb2RhbCB3aGVuIGlzU2hvd0luc3RhbGxGcm9tTWFya2V0cGxhY2UgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBtb2NrVXNlQm9vbGVhblZhbHVlID0gZmFsc2VcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oeyBuYW1lOiAnbm8tbW9kYWwtdGVzdC1wbHVnaW4nIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPExpc3RcbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtbXX1cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXt7fX1cbiAgICAgICAgICBwbHVnaW5zPXtbcGx1Z2luXX1cbiAgICAgICAgICBzaG93SW5zdGFsbEJ1dHRvbj17dHJ1ZX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnaW5zdGFsbC1mcm9tLW1hcmtldHBsYWNlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBoaWRlSW5zdGFsbEZyb21NYXJrZXRwbGFjZSB3aGVuIG1vZGFsIGNsb3NlIGlzIHRyaWdnZXJlZCcsICgpID0+IHtcbiAgICAgIG1vY2tVc2VCb29sZWFuVmFsdWUgPSB0cnVlXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHsgbmFtZTogJ2Nsb3NlLW1vZGFsLXBsdWdpbicgfSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8TGlzdFxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM9e1tdfVxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXA9e3t9fVxuICAgICAgICAgIHBsdWdpbnM9e1twbHVnaW5dfVxuICAgICAgICAgIHNob3dJbnN0YWxsQnV0dG9uPXt0cnVlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgY29uc3QgY2xvc2VCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Nsb3NlLWluc3RhbGwtbW9kYWwnKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNsb3NlQnV0dG9uKVxuXG4gICAgICBleHBlY3QobW9ja1NldEZhbHNlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIHNob3dJbnN0YWxsQnV0dG9uPWZhbHNlIEJyYW5jaCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnc2hvd0luc3RhbGxCdXR0b249ZmFsc2UgYnJhbmNoJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGFzIGEgbGluayB3aGVuIHNob3dJbnN0YWxsQnV0dG9uIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIG5hbWU6ICdsaW5rLXBsdWdpbicsXG4gICAgICAgIG9yZzogJ3Rlc3Qtb3JnJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPExpc3RcbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtbXX1cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXt7fX1cbiAgICAgICAgICBwbHVnaW5zPXtbcGx1Z2luXX1cbiAgICAgICAgICBzaG93SW5zdGFsbEJ1dHRvbj17ZmFsc2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBTaG91bGQgbm90IHJlbmRlciBpbnN0YWxsL2RldGFpbCBidXR0b25zXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdJbnN0YWxsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdEZXRhaWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2FyZCB3aXRoaW4gbGluayBmb3Igbm9uLWluc3RhbGwgbW9kZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBuYW1lOiAnY2FyZC1saW5rLXBsdWdpbicsXG4gICAgICAgIG9yZzogJ2NhcmQtb3JnJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPExpc3RcbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtbXX1cbiAgICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXt7fX1cbiAgICAgICAgICBwbHVnaW5zPXtbcGx1Z2luXX1cbiAgICAgICAgICBzaG93SW5zdGFsbEJ1dHRvbj17ZmFsc2V9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLWNhcmQtbGluay1wbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRoIHVuZGVmaW5lZCBzaG93SW5zdGFsbEJ1dHRvbiAoZGVmYXVsdCBmYWxzZSknLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHsgbmFtZTogJ2RlZmF1bHQtcGx1Z2luJyB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxMaXN0XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9ucz17W119XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc01hcD17e319XG4gICAgICAgICAgcGx1Z2lucz17W3BsdWdpbl19XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBTaG91bGQgbm90IHJlbmRlciBpbnN0YWxsIGJ1dHRvbiAoZGVmYXVsdCBiZWhhdmlvcilcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0luc3RhbGwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFRhZyBMYWJlbHMgTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1RhZyBMYWJlbHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGFnIGxhYmVscyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHtcbiAgICAgICAgbmFtZTogJ3RhZy1wbHVnaW4nLFxuICAgICAgICB0YWdzOiBbeyBuYW1lOiAnc2VhcmNoJyB9LCB7IG5hbWU6ICdpbWFnZScgfV0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxMaXN0XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9ucz17W119XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc01hcD17e319XG4gICAgICAgICAgcGx1Z2lucz17W3BsdWdpbl19XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0YWdzJykpLnRvSGF2ZVRleHRDb250ZW50KCdTZWFyY2gsSW1hZ2UnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSB0YWdzIGFycmF5JywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIG5hbWU6ICduby10YWdzLXBsdWdpbicsXG4gICAgICAgIHRhZ3M6IFtdLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKFxuICAgICAgICA8TGlzdFxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM9e1tdfVxuICAgICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXA9e3t9fVxuICAgICAgICAgIHBsdWdpbnM9e1twbHVnaW5dfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndGFncycpKS50b0hhdmVUZXh0Q29udGVudCgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5rbm93biB0YWcgbmFtZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHtcbiAgICAgICAgbmFtZTogJ3Vua25vd24tdGFnLXBsdWdpbicsXG4gICAgICAgIHRhZ3M6IFt7IG5hbWU6ICd1bmtub3duLXRhZycgfV0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxMaXN0XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9ucz17W119XG4gICAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc01hcD17e319XG4gICAgICAgICAgcGx1Z2lucz17W3BsdWdpbl19XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBVbmtub3duIHRhZ3Mgc2hvdWxkIHNob3cgdGhlIG9yaWdpbmFsIG5hbWVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RhZ3MnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3Vua25vd24tdGFnJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIENvbWJpbmVkIFdvcmtmbG93IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0NvbWJpbmVkIFdvcmtmbG93cycsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5wbHVnaW5zID0gdW5kZWZpbmVkXG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5wbHVnaW5zVG90YWwgPSAwXG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5pc0xvYWRpbmcgPSBmYWxzZVxuICAgIG1vY2tNYXJrZXRwbGFjZURhdGEucGFnZSA9IDFcbiAgICBtb2NrTWFya2V0cGxhY2VEYXRhLm1hcmtldHBsYWNlQ29sbGVjdGlvbnMgPSB1bmRlZmluZWRcbiAgICBtb2NrTWFya2V0cGxhY2VEYXRhLm1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXAgPSB1bmRlZmluZWRcbiAgfSlcblxuICBpdCgnc2hvdWxkIHRyYW5zaXRpb24gZnJvbSBsb2FkaW5nIHRvIHNob3dpbmcgY29sbGVjdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5pc0xvYWRpbmcgPSB0cnVlXG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5wYWdlID0gMVxuXG4gICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxMaXN0V3JhcHBlciAvPilcblxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRpbmctY29tcG9uZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgIC8vIFNpbXVsYXRlIGxvYWRpbmcgY29tcGxldGVcbiAgICBtb2NrTWFya2V0cGxhY2VEYXRhLmlzTG9hZGluZyA9IGZhbHNlXG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5tYXJrZXRwbGFjZUNvbGxlY3Rpb25zID0gY3JlYXRlTW9ja0NvbGxlY3Rpb25MaXN0KDEpXG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5tYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwID0ge1xuICAgICAgJ2NvbGxlY3Rpb24tMCc6IGNyZWF0ZU1vY2tQbHVnaW5MaXN0KDEpLFxuICAgIH1cblxuICAgIHJlcmVuZGVyKDxMaXN0V3JhcHBlciAvPilcblxuICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnbG9hZGluZy1jb21wb25lbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQ29sbGVjdGlvbiAwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHRyYW5zaXRpb24gZnJvbSBjb2xsZWN0aW9ucyB0byBzZWFyY2ggcmVzdWx0cycsIGFzeW5jICgpID0+IHtcbiAgICBtb2NrTWFya2V0cGxhY2VEYXRhLm1hcmtldHBsYWNlQ29sbGVjdGlvbnMgPSBjcmVhdGVNb2NrQ29sbGVjdGlvbkxpc3QoMSlcbiAgICBtb2NrTWFya2V0cGxhY2VEYXRhLm1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXAgPSB7XG4gICAgICAnY29sbGVjdGlvbi0wJzogY3JlYXRlTW9ja1BsdWdpbkxpc3QoMSksXG4gICAgfVxuXG4gICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxMaXN0V3JhcHBlciAvPilcblxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDb2xsZWN0aW9uIDAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgLy8gU2ltdWxhdGUgc2VhcmNoIHJlc3VsdHNcbiAgICBtb2NrTWFya2V0cGxhY2VEYXRhLnBsdWdpbnMgPSBjcmVhdGVNb2NrUGx1Z2luTGlzdCg1KVxuICAgIG1vY2tNYXJrZXRwbGFjZURhdGEucGx1Z2luc1RvdGFsID0gNVxuXG4gICAgcmVyZW5kZXIoPExpc3RXcmFwcGVyIC8+KVxuXG4gICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnQ29sbGVjdGlvbiAwJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzUgcGx1Z2lucyBmb3VuZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc2VhcmNoIHJlc3VsdHMnLCAoKSA9PiB7XG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5wbHVnaW5zID0gW11cbiAgICBtb2NrTWFya2V0cGxhY2VEYXRhLnBsdWdpbnNUb3RhbCA9IDBcblxuICAgIHJlbmRlcig8TGlzdFdyYXBwZXIgLz4pXG5cbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlbXB0eS1jb21wb25lbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcwIHBsdWdpbnMgZm91bmQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgc3VwcG9ydCBwYWdpbmF0aW9uIChwYWdlID4gMSknLCAoKSA9PiB7XG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5wbHVnaW5zID0gY3JlYXRlTW9ja1BsdWdpbkxpc3QoNDApXG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5wbHVnaW5zVG90YWwgPSA4MFxuICAgIG1vY2tNYXJrZXRwbGFjZURhdGEuaXNMb2FkaW5nID0gdHJ1ZVxuICAgIG1vY2tNYXJrZXRwbGFjZURhdGEucGFnZSA9IDJcblxuICAgIHJlbmRlcig8TGlzdFdyYXBwZXIgLz4pXG5cbiAgICAvLyBTaG91bGQgc2hvdyBleGlzdGluZyByZXN1bHRzIHdoaWxlIGxvYWRpbmcgbW9yZVxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCc4MCBwbHVnaW5zIGZvdW5kJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAvLyBTaG91bGQgbm90IHNob3cgbG9hZGluZyBzcGlubmVyIGZvciBwYWdpbmF0aW9uXG4gICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdsb2FkaW5nLWNvbXBvbmVudCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5wbHVnaW5zID0gdW5kZWZpbmVkXG4gICAgbW9ja01hcmtldHBsYWNlRGF0YS5pc0xvYWRpbmcgPSBmYWxzZVxuICAgIG1vY2tNYXJrZXRwbGFjZURhdGEucGFnZSA9IDFcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhdmUgc2VtYW50aWMgc3RydWN0dXJlIHdpdGggY29sbGVjdGlvbnMnLCAoKSA9PiB7XG4gICAgY29uc3QgY29sbGVjdGlvbnMgPSBjcmVhdGVNb2NrQ29sbGVjdGlvbkxpc3QoMSlcbiAgICBjb25zdCBwbHVnaW5zTWFwOiBSZWNvcmQ8c3RyaW5nLCBQbHVnaW5bXT4gPSB7XG4gICAgICAnY29sbGVjdGlvbi0wJzogY3JlYXRlTW9ja1BsdWdpbkxpc3QoMSksXG4gICAgfVxuXG4gICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgIDxMaXN0V2l0aENvbGxlY3Rpb25cbiAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9ucz17Y29sbGVjdGlvbnN9XG4gICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvblBsdWdpbnNNYXA9e3BsdWdpbnNNYXB9XG4gICAgICAvPixcbiAgICApXG5cbiAgICAvLyBTaG91bGQgaGF2ZSBwcm9wZXIgaGVhZGluZyBzdHJ1Y3R1cmVcbiAgICBjb25zdCBoZWFkaW5ncyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCcudGl0bGUteGwtc2VtaS1ib2xkJylcbiAgICBleHBlY3QoaGVhZGluZ3MubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhdmUgY2xpY2thYmxlIFZpZXcgTW9yZSBidXR0b24nLCAoKSA9PiB7XG4gICAgY29uc3QgY29sbGVjdGlvbnMgPSBbY3JlYXRlTW9ja0NvbGxlY3Rpb24oe1xuICAgICAgbmFtZTogJ2NvbGxlY3Rpb24tMCcsXG4gICAgICBzZWFyY2hhYmxlOiB0cnVlLFxuICAgIH0pXVxuICAgIGNvbnN0IHBsdWdpbnNNYXA6IFJlY29yZDxzdHJpbmcsIFBsdWdpbltdPiA9IHtcbiAgICAgICdjb2xsZWN0aW9uLTAnOiBjcmVhdGVNb2NrUGx1Z2luTGlzdCgxKSxcbiAgICB9XG5cbiAgICByZW5kZXIoXG4gICAgICA8TGlzdFdpdGhDb2xsZWN0aW9uXG4gICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM9e2NvbGxlY3Rpb25zfVxuICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXtwbHVnaW5zTWFwfVxuICAgICAgLz4sXG4gICAgKVxuXG4gICAgY29uc3Qgdmlld01vcmVCdXR0b24gPSBzY3JlZW4uZ2V0QnlUZXh0KCdWaWV3IE1vcmUnKVxuICAgIGV4cGVjdCh2aWV3TW9yZUJ1dHRvbikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdCh2aWV3TW9yZUJ1dHRvbi5jbG9zZXN0KCdkaXYnKSkudG9IYXZlQ2xhc3MoJ2N1cnNvci1wb2ludGVyJylcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhdmUgcHJvcGVyIGdyaWQgbGF5b3V0IGZvciBjYXJkcycsICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5zID0gY3JlYXRlTW9ja1BsdWdpbkxpc3QoNClcblxuICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICA8TGlzdFxuICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25zPXtbXX1cbiAgICAgICAgbWFya2V0cGxhY2VDb2xsZWN0aW9uUGx1Z2luc01hcD17e319XG4gICAgICAgIHBsdWdpbnM9e3BsdWdpbnN9XG4gICAgICAvPixcbiAgICApXG5cbiAgICBjb25zdCBncmlkID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5ncmlkLWNvbHMtNCcpXG4gICAgZXhwZWN0KGdyaWQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQZXJmb3JtYW5jZSBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdQZXJmb3JtYW5jZScsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYW5kbGUgcmVuZGVyaW5nIG1hbnkgcGx1Z2lucyBlZmZpY2llbnRseScsICgpID0+IHtcbiAgICBjb25zdCBwbHVnaW5zID0gY3JlYXRlTW9ja1BsdWdpbkxpc3QoNTApXG5cbiAgICBjb25zdCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlbmRlcihcbiAgICAgIDxMaXN0XG4gICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM9e1tdfVxuICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXt7fX1cbiAgICAgICAgcGx1Z2lucz17cGx1Z2luc31cbiAgICAgIC8+LFxuICAgIClcbiAgICBjb25zdCBlbmRUaW1lID0gcGVyZm9ybWFuY2Uubm93KClcblxuICAgIC8vIFNob3VsZCByZW5kZXIgaW4gcmVhc29uYWJsZSB0aW1lIChsZXNzIHRoYW4gMSBzZWNvbmQpXG4gICAgZXhwZWN0KGVuZFRpbWUgLSBzdGFydFRpbWUpLnRvQmVMZXNzVGhhbigxMDAwKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIHJlbmRlcmluZyBtYW55IGNvbGxlY3Rpb25zIGVmZmljaWVudGx5JywgKCkgPT4ge1xuICAgIGNvbnN0IGNvbGxlY3Rpb25zID0gY3JlYXRlTW9ja0NvbGxlY3Rpb25MaXN0KDEwKVxuICAgIGNvbnN0IHBsdWdpbnNNYXA6IFJlY29yZDxzdHJpbmcsIFBsdWdpbltdPiA9IHt9XG4gICAgY29sbGVjdGlvbnMuZm9yRWFjaCgoY29sbGVjdGlvbikgPT4ge1xuICAgICAgcGx1Z2luc01hcFtjb2xsZWN0aW9uLm5hbWVdID0gY3JlYXRlTW9ja1BsdWdpbkxpc3QoNSlcbiAgICB9KVxuXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICByZW5kZXIoXG4gICAgICA8TGlzdFdpdGhDb2xsZWN0aW9uXG4gICAgICAgIG1hcmtldHBsYWNlQ29sbGVjdGlvbnM9e2NvbGxlY3Rpb25zfVxuICAgICAgICBtYXJrZXRwbGFjZUNvbGxlY3Rpb25QbHVnaW5zTWFwPXtwbHVnaW5zTWFwfVxuICAgICAgLz4sXG4gICAgKVxuICAgIGNvbnN0IGVuZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKVxuXG4gICAgLy8gU2hvdWxkIHJlbmRlciBpbiByZWFzb25hYmxlIHRpbWUgKGxlc3MgdGhhbiAxIHNlY29uZClcbiAgICBleHBlY3QoZW5kVGltZSAtIHN0YXJ0VGltZSkudG9CZUxlc3NUaGFuKDEwMDApXG4gIH0pXG59KVxuIl19