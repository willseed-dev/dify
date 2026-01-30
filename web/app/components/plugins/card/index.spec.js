"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const vitest_1 = require("vitest");
const types_1 = require("../types");
const card_icon_1 = require("./base/card-icon");
const corner_mark_1 = require("./base/corner-mark");
const description_1 = require("./base/description");
const download_count_1 = require("./base/download-count");
const org_info_1 = require("./base/org-info");
const placeholder_1 = require("./base/placeholder");
const title_1 = require("./base/title");
const card_more_info_1 = require("./card-more-info");
// ================================
// Import Components Under Test
// ================================
const index_1 = require("./index");
// ================================
// Mock External Dependencies Only
// ================================
// Mock useTheme hook
vitest_1.vi.mock('@/hooks/use-theme', () => ({
    default: () => ({ theme: 'light' }),
}));
// Mock i18n-config
vitest_1.vi.mock('@/i18n-config', () => ({
    renderI18nObject: (obj, locale) => {
        return obj?.[locale] || obj?.['en-US'] || '';
    },
}));
// Mock i18n-config/language
vitest_1.vi.mock('@/i18n-config/language', () => ({
    getLanguage: (locale) => locale || 'en-US',
}));
// Mock useCategories hook
const mockCategoriesMap = {
    'tool': { label: 'Tool' },
    'model': { label: 'Model' },
    'extension': { label: 'Extension' },
    'agent-strategy': { label: 'Agent' },
    'datasource': { label: 'Datasource' },
    'trigger': { label: 'Trigger' },
    'bundle': { label: 'Bundle' },
};
vitest_1.vi.mock('../hooks', () => ({
    useCategories: () => ({
        categoriesMap: mockCategoriesMap,
    }),
}));
// Mock formatNumber utility
vitest_1.vi.mock('@/utils/format', () => ({
    formatNumber: (num) => num.toLocaleString(),
}));
// Mock shouldUseMcpIcon utility
vitest_1.vi.mock('@/utils/mcp', () => ({
    shouldUseMcpIcon: (src) => typeof src === 'object' && src !== null && src?.content === '🔗',
}));
// Mock AppIcon component
vitest_1.vi.mock('@/app/components/base/app-icon', () => ({
    default: ({ icon, background, innerIcon, size, iconType }) => (<div data-testid="app-icon" data-icon={icon} data-background={background} data-size={size} data-icon-type={iconType}>
      {innerIcon && <div data-testid="inner-icon">{innerIcon}</div>}
    </div>),
}));
// Mock Mcp icon component
vitest_1.vi.mock('@/app/components/base/icons/src/vender/other', () => ({
    Mcp: ({ className }) => (<div data-testid="mcp-icon" className={className}>MCP</div>),
    Group: ({ className }) => (<div data-testid="group-icon" className={className}>Group</div>),
}));
// Mock LeftCorner icon component
vitest_1.vi.mock('../../base/icons/src/vender/plugin', () => ({
    LeftCorner: ({ className }) => (<div data-testid="left-corner" className={className}>LeftCorner</div>),
}));
// Mock Partner badge
vitest_1.vi.mock('../base/badges/partner', () => ({
    default: ({ className, text }) => (<div data-testid="partner-badge" className={className} title={text}>Partner</div>),
}));
// Mock Verified badge
vitest_1.vi.mock('../base/badges/verified', () => ({
    default: ({ className, text }) => (<div data-testid="verified-badge" className={className} title={text}>Verified</div>),
}));
// Mock Skeleton components
vitest_1.vi.mock('@/app/components/base/skeleton', () => ({
    SkeletonContainer: ({ children }) => (<div data-testid="skeleton-container">{children}</div>),
    SkeletonPoint: () => <div data-testid="skeleton-point"/>,
    SkeletonRectangle: ({ className }) => (<div data-testid="skeleton-rectangle" className={className}/>),
    SkeletonRow: ({ children, className }) => (<div data-testid="skeleton-row" className={className}>{children}</div>),
}));
// Mock Remix icons
vitest_1.vi.mock('@remixicon/react', () => ({
    RiCheckLine: ({ className }) => (<span data-testid="ri-check-line" className={className}>✓</span>),
    RiCloseLine: ({ className }) => (<span data-testid="ri-close-line" className={className}>✕</span>),
    RiInstallLine: ({ className }) => (<span data-testid="ri-install-line" className={className}>↓</span>),
    RiAlertFill: ({ className }) => (<span data-testid="ri-alert-fill" className={className}>⚠</span>),
}));
// ================================
// Test Data Factories
// ================================
const createMockPlugin = (overrides) => ({
    type: 'plugin',
    org: 'test-org',
    name: 'test-plugin',
    plugin_id: 'plugin-123',
    version: '1.0.0',
    latest_version: '1.0.0',
    latest_package_identifier: 'test-org/test-plugin:1.0.0',
    icon: '/test-icon.png',
    verified: false,
    label: { 'en-US': 'Test Plugin' },
    brief: { 'en-US': 'Test plugin description' },
    description: { 'en-US': 'Full test plugin description' },
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
// ================================
// Card Component Tests (index.tsx)
// ================================
(0, vitest_1.describe)('Card', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render plugin title from label', () => {
            const plugin = createMockPlugin({
                label: { 'en-US': 'My Plugin Title' },
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('My Plugin Title')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render plugin description from brief', () => {
            const plugin = createMockPlugin({
                brief: { 'en-US': 'This is a brief description' },
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('This is a brief description')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render organization info with org name and package name', () => {
            const plugin = createMockPlugin({
                org: 'my-org',
                name: 'my-plugin',
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('my-org')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('my-plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render plugin icon', () => {
            const plugin = createMockPlugin({
                icon: '/custom-icon.png',
            });
            const { container } = (0, react_1.render)(<index_1.default payload={plugin}/>);
            // Check for background image style on icon element
            const iconElement = container.querySelector('[style*="background-image"]');
            (0, vitest_1.expect)(iconElement).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render corner mark with category label', () => {
            const plugin = createMockPlugin({
                category: types_1.PluginCategoryEnum.tool,
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Tool')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should apply custom className', () => {
            const plugin = createMockPlugin();
            const { container } = (0, react_1.render)(<index_1.default payload={plugin} className="custom-class"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-class')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should hide corner mark when hideCornerMark is true', () => {
            const plugin = createMockPlugin({
                category: types_1.PluginCategoryEnum.tool,
            });
            (0, react_1.render)(<index_1.default payload={plugin} hideCornerMark={true}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('left-corner')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should show corner mark by default', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('left-corner')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass installed prop to Icon component', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin} installed={true}/>);
            // Check for the check icon that appears when installed
            (0, vitest_1.expect)(react_1.screen.getByTestId('ri-check-line')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass installFailed prop to Icon component', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin} installFailed={true}/>);
            // Check for the close icon that appears when install failed
            (0, vitest_1.expect)(react_1.screen.getByTestId('ri-close-line')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render footer when provided', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin} footer={<div data-testid="custom-footer">Footer Content</div>}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-footer')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Footer Content')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render titleLeft when provided', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin} titleLeft={<span data-testid="title-left">v1.0</span>}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('title-left')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should use custom descriptionLineRows', () => {
            const plugin = createMockPlugin();
            const { container } = (0, react_1.render)(<index_1.default payload={plugin} descriptionLineRows={1}/>);
            // Check for h-4 truncate class when descriptionLineRows is 1
            (0, vitest_1.expect)(container.querySelector('.h-4.truncate')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should use default descriptionLineRows of 2', () => {
            const plugin = createMockPlugin();
            const { container } = (0, react_1.render)(<index_1.default payload={plugin}/>);
            // Check for h-8 line-clamp-2 class when descriptionLineRows is 2 (default)
            (0, vitest_1.expect)(container.querySelector('.h-8.line-clamp-2')).toBeInTheDocument();
        });
    });
    // ================================
    // Loading State Tests
    // ================================
    (0, vitest_1.describe)('Loading State', () => {
        (0, vitest_1.it)('should render Placeholder when isLoading is true', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin} isLoading={true} loadingFileName="loading.txt"/>);
            // Should render skeleton elements
            (0, vitest_1.expect)(react_1.screen.getByTestId('skeleton-container')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render loadingFileName in Placeholder', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin} isLoading={true} loadingFileName="my-plugin.zip"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('my-plugin.zip')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render card content when loading', () => {
            const plugin = createMockPlugin({
                label: { 'en-US': 'Plugin Title' },
            });
            (0, react_1.render)(<index_1.default payload={plugin} isLoading={true} loadingFileName="file.txt"/>);
            // Plugin content should not be visible during loading
            (0, vitest_1.expect)(react_1.screen.queryByText('Plugin Title')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render loading state by default', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('skeleton-container')).not.toBeInTheDocument();
        });
    });
    // ================================
    // Badges Tests
    // ================================
    (0, vitest_1.describe)('Badges', () => {
        (0, vitest_1.it)('should render Partner badge when badges includes partner', () => {
            const plugin = createMockPlugin({
                badges: ['partner'],
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('partner-badge')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Verified badge when verified is true', () => {
            const plugin = createMockPlugin({
                verified: true,
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('verified-badge')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render both Partner and Verified badges', () => {
            const plugin = createMockPlugin({
                badges: ['partner'],
                verified: true,
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('partner-badge')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('verified-badge')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render Partner badge when badges is empty', () => {
            const plugin = createMockPlugin({
                badges: [],
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('partner-badge')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render Verified badge when verified is false', () => {
            const plugin = createMockPlugin({
                verified: false,
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('verified-badge')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined badges gracefully', () => {
            const plugin = createMockPlugin();
            // @ts-expect-error - Testing undefined badges
            plugin.badges = undefined;
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('partner-badge')).not.toBeInTheDocument();
        });
    });
    // ================================
    // Limited Install Warning Tests
    // ================================
    (0, vitest_1.describe)('Limited Install Warning', () => {
        (0, vitest_1.it)('should render warning when limitedInstall is true', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin} limitedInstall={true}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('ri-alert-fill')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render warning by default', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('ri-alert-fill')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply limited padding when limitedInstall is true', () => {
            const plugin = createMockPlugin();
            const { container } = (0, react_1.render)(<index_1.default payload={plugin} limitedInstall={true}/>);
            (0, vitest_1.expect)(container.querySelector('.pb-1')).toBeInTheDocument();
        });
    });
    // ================================
    // Category Type Tests
    // ================================
    (0, vitest_1.describe)('Category Types', () => {
        (0, vitest_1.it)('should display bundle label for bundle type', () => {
            const plugin = createMockPlugin({
                type: 'bundle',
                category: types_1.PluginCategoryEnum.tool,
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            // For bundle type, should show 'Bundle' instead of category
            (0, vitest_1.expect)(react_1.screen.getByText('Bundle')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display category label for non-bundle types', () => {
            const plugin = createMockPlugin({
                type: 'plugin',
                category: types_1.PluginCategoryEnum.model,
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Model')).toBeInTheDocument();
        });
    });
    // ================================
    // Memoization Tests
    // ================================
    (0, vitest_1.describe)('Memoization', () => {
        (0, vitest_1.it)('should be memoized with React.memo', () => {
            // Card is wrapped with React.memo
            (0, vitest_1.expect)(index_1.default).toBeDefined();
            // The component should have the memo display name characteristic
            (0, vitest_1.expect)(typeof index_1.default).toBe('object');
        });
        (0, vitest_1.it)('should not re-render when props are the same', () => {
            const plugin = createMockPlugin();
            const renderCount = vitest_1.vi.fn();
            const TestWrapper = ({ p }) => {
                renderCount();
                return <index_1.default payload={p}/>;
            };
            const { rerender } = (0, react_1.render)(<TestWrapper p={plugin}/>);
            (0, vitest_1.expect)(renderCount).toHaveBeenCalledTimes(1);
            // Re-render with same plugin reference
            rerender(<TestWrapper p={plugin}/>);
            (0, vitest_1.expect)(renderCount).toHaveBeenCalledTimes(2);
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty label object', () => {
            const plugin = createMockPlugin({
                label: {},
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            // Should render without crashing
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty brief object', () => {
            const plugin = createMockPlugin({
                brief: {},
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined label', () => {
            const plugin = createMockPlugin();
            // @ts-expect-error - Testing undefined label
            plugin.label = undefined;
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle special characters in plugin name', () => {
            const plugin = createMockPlugin({
                name: 'plugin-with-special-chars!@#$%',
                org: 'org<script>alert(1)</script>',
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin-with-special-chars!@#$%')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle very long title', () => {
            const longTitle = 'A'.repeat(500);
            const plugin = createMockPlugin({
                label: { 'en-US': longTitle },
            });
            const { container } = (0, react_1.render)(<index_1.default payload={plugin}/>);
            // Should have truncate class for long text
            (0, vitest_1.expect)(container.querySelector('.truncate')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle very long description', () => {
            const longDescription = 'B'.repeat(1000);
            const plugin = createMockPlugin({
                brief: { 'en-US': longDescription },
            });
            const { container } = (0, react_1.render)(<index_1.default payload={plugin}/>);
            // Should have line-clamp class for long text
            (0, vitest_1.expect)(container.querySelector('.line-clamp-2')).toBeInTheDocument();
        });
    });
});
// ================================
// CardMoreInfo Component Tests
// ================================
(0, vitest_1.describe)('CardMoreInfo', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<card_more_info_1.default downloadCount={100} tags={['tag1']}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render download count when provided', () => {
            (0, react_1.render)(<card_more_info_1.default downloadCount={1000} tags={[]}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('1,000')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render tags when provided', () => {
            (0, react_1.render)(<card_more_info_1.default tags={['search', 'image']}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('search')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('image')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render both download count and tags with separator', () => {
            (0, react_1.render)(<card_more_info_1.default downloadCount={500} tags={['tag1']}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('500')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('·')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('tag1')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should not render download count when undefined', () => {
            (0, react_1.render)(<card_more_info_1.default tags={['tag1']}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('ri-install-line')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render separator when download count is undefined', () => {
            (0, react_1.render)(<card_more_info_1.default tags={['tag1']}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText('·')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render separator when tags are empty', () => {
            (0, react_1.render)(<card_more_info_1.default downloadCount={100} tags={[]}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText('·')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render hash symbol before each tag', () => {
            (0, react_1.render)(<card_more_info_1.default tags={['search']}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('#')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should set title attribute with hash prefix for tags', () => {
            (0, react_1.render)(<card_more_info_1.default tags={['search']}/>);
            const tagElement = react_1.screen.getByTitle('# search');
            (0, vitest_1.expect)(tagElement).toBeInTheDocument();
        });
    });
    // ================================
    // Memoization Tests
    // ================================
    (0, vitest_1.describe)('Memoization', () => {
        (0, vitest_1.it)('should be memoized with React.memo', () => {
            (0, vitest_1.expect)(card_more_info_1.default).toBeDefined();
            (0, vitest_1.expect)(typeof card_more_info_1.default).toBe('object');
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle zero download count', () => {
            (0, react_1.render)(<card_more_info_1.default downloadCount={0} tags={[]}/>);
            // 0 should still render since downloadCount is defined
            (0, vitest_1.expect)(react_1.screen.getByText('0')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty tags array', () => {
            (0, react_1.render)(<card_more_info_1.default downloadCount={100} tags={[]}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText('#')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle large download count', () => {
            (0, react_1.render)(<card_more_info_1.default downloadCount={1234567890} tags={[]}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('1,234,567,890')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle many tags', () => {
            const tags = Array.from({ length: 10 }, (_, i) => `tag${i}`);
            (0, react_1.render)(<card_more_info_1.default downloadCount={100} tags={tags}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('tag0')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('tag9')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle tags with special characters', () => {
            (0, react_1.render)(<card_more_info_1.default tags={['tag-with-dash', 'tag_with_underscore']}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('tag-with-dash')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('tag_with_underscore')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should truncate long tag names', () => {
            const longTag = 'a'.repeat(200);
            const { container } = (0, react_1.render)(<card_more_info_1.default tags={[longTag]}/>);
            (0, vitest_1.expect)(container.querySelector('.truncate')).toBeInTheDocument();
        });
    });
});
// ================================
// Icon Component Tests (base/card-icon.tsx)
// ================================
(0, vitest_1.describe)('Icon', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing with string src', () => {
            (0, react_1.render)(<card_icon_1.default src="/icon.png"/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render without crashing with object src', () => {
            (0, react_1.render)(<card_icon_1.default src={{ content: '🎉', background: '#fff' }}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render background image for string src', () => {
            const { container } = (0, react_1.render)(<card_icon_1.default src="/test-icon.png"/>);
            const iconDiv = container.firstChild;
            (0, vitest_1.expect)(iconDiv).toHaveStyle({ backgroundImage: 'url(/test-icon.png)' });
        });
        (0, vitest_1.it)('should render AppIcon for object src', () => {
            (0, react_1.render)(<card_icon_1.default src={{ content: '🎉', background: '#ffffff' }}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('app-icon')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should apply custom className', () => {
            const { container } = (0, react_1.render)(<card_icon_1.default src="/icon.png" className="custom-icon-class"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-icon-class')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render check icon when installed is true', () => {
            (0, react_1.render)(<card_icon_1.default src="/icon.png" installed={true}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('ri-check-line')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render close icon when installFailed is true', () => {
            (0, react_1.render)(<card_icon_1.default src="/icon.png" installFailed={true}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('ri-close-line')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render status icon when neither installed nor failed', () => {
            (0, react_1.render)(<card_icon_1.default src="/icon.png"/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('ri-check-line')).not.toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('ri-close-line')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should use default size of large', () => {
            const { container } = (0, react_1.render)(<card_icon_1.default src="/icon.png"/>);
            (0, vitest_1.expect)(container.querySelector('.w-10.h-10')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply xs size class', () => {
            const { container } = (0, react_1.render)(<card_icon_1.default src="/icon.png" size="xs"/>);
            (0, vitest_1.expect)(container.querySelector('.w-4.h-4')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply tiny size class', () => {
            const { container } = (0, react_1.render)(<card_icon_1.default src="/icon.png" size="tiny"/>);
            (0, vitest_1.expect)(container.querySelector('.w-6.h-6')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply small size class', () => {
            const { container } = (0, react_1.render)(<card_icon_1.default src="/icon.png" size="small"/>);
            (0, vitest_1.expect)(container.querySelector('.w-8.h-8')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply medium size class', () => {
            const { container } = (0, react_1.render)(<card_icon_1.default src="/icon.png" size="medium"/>);
            (0, vitest_1.expect)(container.querySelector('.w-9.h-9')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply large size class', () => {
            const { container } = (0, react_1.render)(<card_icon_1.default src="/icon.png" size="large"/>);
            (0, vitest_1.expect)(container.querySelector('.w-10.h-10')).toBeInTheDocument();
        });
    });
    // ================================
    // MCP Icon Tests
    // ================================
    (0, vitest_1.describe)('MCP Icon', () => {
        (0, vitest_1.it)('should render MCP icon when src content is 🔗', () => {
            (0, react_1.render)(<card_icon_1.default src={{ content: '🔗', background: '#ffffff' }}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('mcp-icon')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render MCP icon for other emoji content', () => {
            (0, react_1.render)(<card_icon_1.default src={{ content: '🎉', background: '#ffffff' }}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('mcp-icon')).not.toBeInTheDocument();
        });
    });
    // ================================
    // Status Indicator Tests
    // ================================
    (0, vitest_1.describe)('Status Indicators', () => {
        (0, vitest_1.it)('should render success indicator with correct styling for installed', () => {
            const { container } = (0, react_1.render)(<card_icon_1.default src="/icon.png" installed={true}/>);
            (0, vitest_1.expect)(container.querySelector('.bg-state-success-solid')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render destructive indicator with correct styling for failed', () => {
            const { container } = (0, react_1.render)(<card_icon_1.default src="/icon.png" installFailed={true}/>);
            (0, vitest_1.expect)(container.querySelector('.bg-state-destructive-solid')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should prioritize installed over installFailed', () => {
            // When both are true, installed takes precedence (rendered first in code)
            (0, react_1.render)(<card_icon_1.default src="/icon.png" installed={true} installFailed={true}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('ri-check-line')).toBeInTheDocument();
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty string src', () => {
            const { container } = (0, react_1.render)(<card_icon_1.default src=""/>);
            (0, vitest_1.expect)(container.firstChild).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle special characters in URL', () => {
            const { container } = (0, react_1.render)(<card_icon_1.default src="/icon?name=test&size=large"/>);
            const iconDiv = container.firstChild;
            (0, vitest_1.expect)(iconDiv).toHaveStyle({ backgroundImage: 'url(/icon?name=test&size=large)' });
        });
    });
});
// ================================
// CornerMark Component Tests
// ================================
(0, vitest_1.describe)('CornerMark', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<corner_mark_1.default text="Tool"/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render text content', () => {
            (0, react_1.render)(<corner_mark_1.default text="Tool"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Tool')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render LeftCorner icon', () => {
            (0, react_1.render)(<corner_mark_1.default text="Model"/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('left-corner')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should display different category text', () => {
            const { rerender } = (0, react_1.render)(<corner_mark_1.default text="Tool"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Tool')).toBeInTheDocument();
            rerender(<corner_mark_1.default text="Model"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Model')).toBeInTheDocument();
            rerender(<corner_mark_1.default text="Extension"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Extension')).toBeInTheDocument();
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty text', () => {
            (0, react_1.render)(<corner_mark_1.default text=""/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle long text', () => {
            const longText = 'Very Long Category Name';
            (0, react_1.render)(<corner_mark_1.default text={longText}/>);
            (0, vitest_1.expect)(react_1.screen.getByText(longText)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle special characters in text', () => {
            (0, react_1.render)(<corner_mark_1.default text="Test & Demo"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Test & Demo')).toBeInTheDocument();
        });
    });
});
// ================================
// Description Component Tests
// ================================
(0, vitest_1.describe)('Description', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<description_1.default text="Test description" descriptionLineRows={2}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render text content', () => {
            (0, react_1.render)(<description_1.default text="This is a description" descriptionLineRows={2}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('This is a description')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should apply custom className', () => {
            const { container } = (0, react_1.render)(<description_1.default text="Test" descriptionLineRows={2} className="custom-desc-class"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-desc-class')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply h-4 truncate for 1 line row', () => {
            const { container } = (0, react_1.render)(<description_1.default text="Test" descriptionLineRows={1}/>);
            (0, vitest_1.expect)(container.querySelector('.h-4.truncate')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply h-8 line-clamp-2 for 2 line rows', () => {
            const { container } = (0, react_1.render)(<description_1.default text="Test" descriptionLineRows={2}/>);
            (0, vitest_1.expect)(container.querySelector('.h-8.line-clamp-2')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply h-12 line-clamp-3 for 3+ line rows', () => {
            const { container } = (0, react_1.render)(<description_1.default text="Test" descriptionLineRows={3}/>);
            (0, vitest_1.expect)(container.querySelector('.h-12.line-clamp-3')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply h-12 line-clamp-3 for values greater than 3', () => {
            const { container } = (0, react_1.render)(<description_1.default text="Test" descriptionLineRows={5}/>);
            (0, vitest_1.expect)(container.querySelector('.h-12.line-clamp-3')).toBeInTheDocument();
        });
    });
    // ================================
    // Memoization Tests
    // ================================
    (0, vitest_1.describe)('Memoization', () => {
        (0, vitest_1.it)('should memoize lineClassName based on descriptionLineRows', () => {
            const { container, rerender } = (0, react_1.render)(<description_1.default text="Test" descriptionLineRows={2}/>);
            (0, vitest_1.expect)(container.querySelector('.line-clamp-2')).toBeInTheDocument();
            // Re-render with same descriptionLineRows
            rerender(<description_1.default text="Different text" descriptionLineRows={2}/>);
            // Should still have same class (memoized)
            (0, vitest_1.expect)(container.querySelector('.line-clamp-2')).toBeInTheDocument();
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty text', () => {
            (0, react_1.render)(<description_1.default text="" descriptionLineRows={2}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle very long text', () => {
            const longText = 'A'.repeat(1000);
            const { container } = (0, react_1.render)(<description_1.default text={longText} descriptionLineRows={2}/>);
            (0, vitest_1.expect)(container.querySelector('.line-clamp-2')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle text with HTML entities', () => {
            (0, react_1.render)(<description_1.default text="<script>alert('xss')</script>" descriptionLineRows={2}/>);
            // Text should be escaped
            (0, vitest_1.expect)(react_1.screen.getByText('<script>alert(\'xss\')</script>')).toBeInTheDocument();
        });
    });
});
// ================================
// DownloadCount Component Tests
// ================================
(0, vitest_1.describe)('DownloadCount', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<download_count_1.default downloadCount={100}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render download count with formatted number', () => {
            (0, react_1.render)(<download_count_1.default downloadCount={1234567}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('1,234,567')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render install icon', () => {
            (0, react_1.render)(<download_count_1.default downloadCount={100}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('ri-install-line')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should display small download count', () => {
            (0, react_1.render)(<download_count_1.default downloadCount={5}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('5')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display large download count', () => {
            (0, react_1.render)(<download_count_1.default downloadCount={999999999}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('999,999,999')).toBeInTheDocument();
        });
    });
    // ================================
    // Memoization Tests
    // ================================
    (0, vitest_1.describe)('Memoization', () => {
        (0, vitest_1.it)('should be memoized with React.memo', () => {
            (0, vitest_1.expect)(download_count_1.default).toBeDefined();
            (0, vitest_1.expect)(typeof download_count_1.default).toBe('object');
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle zero download count', () => {
            (0, react_1.render)(<download_count_1.default downloadCount={0}/>);
            // 0 should still render with install icon
            (0, vitest_1.expect)(react_1.screen.getByText('0')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('ri-install-line')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle negative download count', () => {
            (0, react_1.render)(<download_count_1.default downloadCount={-100}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('-100')).toBeInTheDocument();
        });
    });
});
// ================================
// OrgInfo Component Tests
// ================================
(0, vitest_1.describe)('OrgInfo', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<org_info_1.default packageName="test-plugin"/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render package name', () => {
            (0, react_1.render)(<org_info_1.default packageName="my-plugin"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('my-plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render org name and separator when provided', () => {
            (0, react_1.render)(<org_info_1.default orgName="my-org" packageName="my-plugin"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('my-org')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('/')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('my-plugin')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should apply custom className', () => {
            const { container } = (0, react_1.render)(<org_info_1.default packageName="test" className="custom-org-class"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-org-class')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply packageNameClassName', () => {
            const { container } = (0, react_1.render)(<org_info_1.default packageName="test" packageNameClassName="custom-package-class"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-package-class')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render org name section when orgName is undefined', () => {
            (0, react_1.render)(<org_info_1.default packageName="test"/>);
            (0, vitest_1.expect)(react_1.screen.queryByText('/')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render org name section when orgName is empty', () => {
            (0, react_1.render)(<org_info_1.default orgName="" packageName="test"/>);
            (0, vitest_1.expect)(react_1.screen.queryByText('/')).not.toBeInTheDocument();
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle special characters in org name', () => {
            (0, react_1.render)(<org_info_1.default orgName="my-org_123" packageName="test"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('my-org_123')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle special characters in package name', () => {
            (0, react_1.render)(<org_info_1.default packageName="plugin@v1.0.0"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin@v1.0.0')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should truncate long package name', () => {
            const longName = 'a'.repeat(100);
            const { container } = (0, react_1.render)(<org_info_1.default packageName={longName}/>);
            (0, vitest_1.expect)(container.querySelector('.truncate')).toBeInTheDocument();
        });
    });
});
// ================================
// Placeholder Component Tests
// ================================
(0, vitest_1.describe)('Placeholder', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<placeholder_1.default wrapClassName="test-class"/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with wrapClassName', () => {
            const { container } = (0, react_1.render)(<placeholder_1.default wrapClassName="custom-wrapper"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-wrapper')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render skeleton elements', () => {
            (0, react_1.render)(<placeholder_1.default wrapClassName="test"/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('skeleton-container')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getAllByTestId('skeleton-rectangle').length).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('should render Group icon', () => {
            (0, react_1.render)(<placeholder_1.default wrapClassName="test"/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('group-icon')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should render Title when loadingFileName is provided', () => {
            (0, react_1.render)(<placeholder_1.default wrapClassName="test" loadingFileName="my-file.zip"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('my-file.zip')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render SkeletonRectangle when loadingFileName is not provided', () => {
            (0, react_1.render)(<placeholder_1.default wrapClassName="test"/>);
            // Should have skeleton rectangle for title area
            const rectangles = react_1.screen.getAllByTestId('skeleton-rectangle');
            (0, vitest_1.expect)(rectangles.length).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('should render SkeletonRow for org info', () => {
            (0, react_1.render)(<placeholder_1.default wrapClassName="test"/>);
            // There are multiple skeleton rows in the component
            const skeletonRows = react_1.screen.getAllByTestId('skeleton-row');
            (0, vitest_1.expect)(skeletonRows.length).toBeGreaterThan(0);
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty wrapClassName', () => {
            const { container } = (0, react_1.render)(<placeholder_1.default wrapClassName=""/>);
            (0, vitest_1.expect)(container.firstChild).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined loadingFileName', () => {
            (0, react_1.render)(<placeholder_1.default wrapClassName="test" loadingFileName={undefined}/>);
            // Should show skeleton instead of title
            const rectangles = react_1.screen.getAllByTestId('skeleton-rectangle');
            (0, vitest_1.expect)(rectangles.length).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('should handle long loadingFileName', () => {
            const longFileName = 'very-long-file-name-that-goes-on-forever.zip';
            (0, react_1.render)(<placeholder_1.default wrapClassName="test" loadingFileName={longFileName}/>);
            (0, vitest_1.expect)(react_1.screen.getByText(longFileName)).toBeInTheDocument();
        });
    });
});
// ================================
// LoadingPlaceholder Component Tests
// ================================
(0, vitest_1.describe)('LoadingPlaceholder', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<placeholder_1.LoadingPlaceholder />);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should have correct base classes', () => {
            const { container } = (0, react_1.render)(<placeholder_1.LoadingPlaceholder />);
            (0, vitest_1.expect)(container.querySelector('.h-2.rounded-sm')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should apply custom className', () => {
            const { container } = (0, react_1.render)(<placeholder_1.LoadingPlaceholder className="custom-loading"/>);
            (0, vitest_1.expect)(container.querySelector('.custom-loading')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should merge className with base classes', () => {
            const { container } = (0, react_1.render)(<placeholder_1.LoadingPlaceholder className="w-full"/>);
            (0, vitest_1.expect)(container.querySelector('.h-2.rounded-sm.w-full')).toBeInTheDocument();
        });
    });
});
// ================================
// Title Component Tests
// ================================
(0, vitest_1.describe)('Title', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            (0, react_1.render)(<title_1.default title="Test Title"/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render title text', () => {
            (0, react_1.render)(<title_1.default title="My Plugin Title"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('My Plugin Title')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should have truncate class', () => {
            const { container } = (0, react_1.render)(<title_1.default title="Test"/>);
            (0, vitest_1.expect)(container.querySelector('.truncate')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should have correct text styling', () => {
            const { container } = (0, react_1.render)(<title_1.default title="Test"/>);
            (0, vitest_1.expect)(container.querySelector('.system-md-semibold')).toBeInTheDocument();
            (0, vitest_1.expect)(container.querySelector('.text-text-secondary')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should display different titles', () => {
            const { rerender } = (0, react_1.render)(<title_1.default title="First Title"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('First Title')).toBeInTheDocument();
            rerender(<title_1.default title="Second Title"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Second Title')).toBeInTheDocument();
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty title', () => {
            (0, react_1.render)(<title_1.default title=""/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle very long title', () => {
            const longTitle = 'A'.repeat(500);
            const { container } = (0, react_1.render)(<title_1.default title={longTitle}/>);
            // Should have truncate for long text
            (0, vitest_1.expect)(container.querySelector('.truncate')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle special characters in title', () => {
            (0, react_1.render)(<title_1.default title={'Title with <special> & "chars"'}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Title with <special> & "chars"')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle unicode characters', () => {
            (0, react_1.render)(<title_1.default title="标题 🎉 タイトル"/>);
            (0, vitest_1.expect)(react_1.screen.getByText('标题 🎉 タイトル')).toBeInTheDocument();
        });
    });
});
// ================================
// Integration Tests
// ================================
(0, vitest_1.describe)('Card Integration', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('Complete Card Rendering', () => {
        (0, vitest_1.it)('should render a complete card with all elements', () => {
            const plugin = createMockPlugin({
                label: { 'en-US': 'Complete Plugin' },
                brief: { 'en-US': 'A complete plugin description' },
                org: 'complete-org',
                name: 'complete-plugin',
                category: types_1.PluginCategoryEnum.tool,
                verified: true,
                badges: ['partner'],
            });
            (0, react_1.render)(<index_1.default payload={plugin} footer={<card_more_info_1.default downloadCount={5000} tags={['search', 'api']}/>}/>);
            // Verify all elements are rendered
            (0, vitest_1.expect)(react_1.screen.getByText('Complete Plugin')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('A complete plugin description')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('complete-org')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('complete-plugin')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Tool')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('partner-badge')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('verified-badge')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('5,000')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('search')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('api')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render loading state correctly', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin} isLoading={true} loadingFileName="loading-plugin.zip"/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('skeleton-container')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('loading-plugin.zip')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('partner-badge')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle installed state with footer', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default payload={plugin} installed={true} footer={<card_more_info_1.default downloadCount={100} tags={['tag1']}/>}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('ri-check-line')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('100')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Component Hierarchy', () => {
        (0, vitest_1.it)('should render Icon inside Card', () => {
            const plugin = createMockPlugin({
                icon: '/test-icon.png',
            });
            const { container } = (0, react_1.render)(<index_1.default payload={plugin}/>);
            // Icon should be rendered with background image
            const iconElement = container.querySelector('[style*="background-image"]');
            (0, vitest_1.expect)(iconElement).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Title inside Card', () => {
            const plugin = createMockPlugin({
                label: { 'en-US': 'Test Title' },
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Test Title')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Description inside Card', () => {
            const plugin = createMockPlugin({
                brief: { 'en-US': 'Test Description' },
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Test Description')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render OrgInfo inside Card', () => {
            const plugin = createMockPlugin({
                org: 'test-org',
                name: 'test-name',
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('test-org')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('/')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('test-name')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render CornerMark inside Card', () => {
            const plugin = createMockPlugin({
                category: types_1.PluginCategoryEnum.model,
            });
            (0, react_1.render)(<index_1.default payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Model')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('left-corner')).toBeInTheDocument();
        });
    });
});
// ================================
// Accessibility Tests
// ================================
(0, vitest_1.describe)('Accessibility', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should have accessible text content', () => {
        const plugin = createMockPlugin({
            label: { 'en-US': 'Accessible Plugin' },
            brief: { 'en-US': 'This plugin is accessible' },
        });
        (0, react_1.render)(<index_1.default payload={plugin}/>);
        (0, vitest_1.expect)(react_1.screen.getByText('Accessible Plugin')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('This plugin is accessible')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should have title attribute on tags', () => {
        (0, react_1.render)(<card_more_info_1.default downloadCount={100} tags={['search']}/>);
        (0, vitest_1.expect)(react_1.screen.getByTitle('# search')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should have semantic structure', () => {
        const plugin = createMockPlugin();
        const { container } = (0, react_1.render)(<index_1.default payload={plugin}/>);
        // Card should have proper container structure
        (0, vitest_1.expect)(container.firstChild).toHaveClass('rounded-xl');
    });
});
// ================================
// Performance Tests
// ================================
(0, vitest_1.describe)('Performance', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.it)('should render multiple cards efficiently', () => {
        const plugins = Array.from({ length: 50 }, (_, i) => createMockPlugin({
            name: `plugin-${i}`,
            label: { 'en-US': `Plugin ${i}` },
        }));
        const startTime = performance.now();
        const { container } = (0, react_1.render)(<div>
        {plugins.map(plugin => (<index_1.default key={plugin.name} payload={plugin}/>))}
      </div>);
        const endTime = performance.now();
        // Should render all cards
        const cards = container.querySelectorAll('.rounded-xl');
        (0, vitest_1.expect)(cards.length).toBe(50);
        // Should render within reasonable time (less than 1 second)
        (0, vitest_1.expect)(endTime - startTime).toBeLessThan(1000);
    });
    (0, vitest_1.it)('should handle CardMoreInfo with many tags', () => {
        const tags = Array.from({ length: 20 }, (_, i) => `tag-${i}`);
        const startTime = performance.now();
        (0, react_1.render)(<card_more_info_1.default downloadCount={1000} tags={tags}/>);
        const endTime = performance.now();
        (0, vitest_1.expect)(endTime - startTime).toBeLessThan(100);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQXVEO0FBQ3ZELCtCQUE4QjtBQUM5QixtQ0FBNkQ7QUFDN0Qsb0NBQTZDO0FBRTdDLGdEQUFtQztBQUNuQyxvREFBMkM7QUFDM0Msb0RBQTRDO0FBQzVDLDBEQUFpRDtBQUNqRCw4Q0FBcUM7QUFDckMsb0RBQW9FO0FBQ3BFLHdDQUFnQztBQUNoQyxxREFBMkM7QUFDM0MsbUNBQW1DO0FBQ25DLCtCQUErQjtBQUMvQixtQ0FBbUM7QUFDbkMsbUNBQTBCO0FBRTFCLG1DQUFtQztBQUNuQyxrQ0FBa0M7QUFDbEMsbUNBQW1DO0FBRW5DLHFCQUFxQjtBQUNyQixXQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDbEMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUM7Q0FDcEMsQ0FBQyxDQUFDLENBQUE7QUFFSCxtQkFBbUI7QUFDbkIsV0FBRSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM5QixnQkFBZ0IsRUFBRSxDQUFDLEdBQTJCLEVBQUUsTUFBYyxFQUFFLEVBQUU7UUFDaEUsT0FBTyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDOUMsQ0FBQztDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsNEJBQTRCO0FBQzVCLFdBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN2QyxXQUFXLEVBQUUsQ0FBQyxNQUFjLEVBQUUsRUFBRSxDQUFDLE1BQU0sSUFBSSxPQUFPO0NBQ25ELENBQUMsQ0FBQyxDQUFBO0FBRUgsMEJBQTBCO0FB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Q0FBQyxJQUFJLENBQUMsRUFBRyxDQUFDLENBQUE7UUFDekQsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFBO1FBRWpDLElBQUEsZUFBTSxFQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDL0MsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB7IFBsdWdpbkNhdGVnb3J5RW51bSB9IGZyb20gJy4uL3R5cGVzJ1xuXG5pbXBvcnQgSWNvbiBmcm9tICcuL2Jhc2UvY2FyZC1pY29uJ1xuaW1wb3J0IENvcm5lck1hcmsgZnJvbSAnLi9iYXNlL2Nvcm5lci1tYXJrJ1xuaW1wb3J0IERlc2NyaXB0aW9uIGZyb20gJy4vYmFzZS9kZXNjcmlwdGlvbidcbmltcG9ydCBEb3dubG9hZENvdW50IGZyb20gJy4vYmFzZS9kb3dubG9hZC1jb3VudCdcbmltcG9ydCBPcmdJbmZvIGZyb20gJy4vYmFzZS9vcmctaW5mbydcbmltcG9ydCBQbGFjZWhvbGRlciwgeyBMb2FkaW5nUGxhY2Vob2xkZXIgfSBmcm9tICcuL2Jhc2UvcGxhY2Vob2xkZXInXG5pbXBvcnQgVGl0bGUgZnJvbSAnLi9iYXNlL3RpdGxlJ1xuaW1wb3J0IENhcmRNb3JlSW5mbyBmcm9tICcuL2NhcmQtbW9yZS1pbmZvJ1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEltcG9ydCBDb21wb25lbnRzIFVuZGVyIFRlc3Rcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5pbXBvcnQgQ2FyZCBmcm9tICcuL2luZGV4J1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXMgT25seVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayB1c2VUaGVtZSBob29rXG52aS5tb2NrKCdAL2hvb2tzL3VzZS10aGVtZScsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+ICh7IHRoZW1lOiAnbGlnaHQnIH0pLFxufSkpXG5cbi8vIE1vY2sgaTE4bi1jb25maWdcbnZpLm1vY2soJ0AvaTE4bi1jb25maWcnLCAoKSA9PiAoe1xuICByZW5kZXJJMThuT2JqZWN0OiAob2JqOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCBsb2NhbGU6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBvYmo/Lltsb2NhbGVdIHx8IG9iaj8uWydlbi1VUyddIHx8ICcnXG4gIH0sXG59KSlcblxuLy8gTW9jayBpMThuLWNvbmZpZy9sYW5ndWFnZVxudmkubW9jaygnQC9pMThuLWNvbmZpZy9sYW5ndWFnZScsICgpID0+ICh7XG4gIGdldExhbmd1YWdlOiAobG9jYWxlOiBzdHJpbmcpID0+IGxvY2FsZSB8fCAnZW4tVVMnLFxufSkpXG5cbi8vIE1vY2sgdXNlQ2F0ZWdvcmllcyBob29rXG5jb25zdCBtb2NrQ2F0ZWdvcmllc01hcDogUmVjb3JkPHN0cmluZywgeyBsYWJlbDogc3RyaW5nIH0+ID0ge1xuICAndG9vbCc6IHsgbGFiZWw6ICdUb29sJyB9LFxuICAnbW9kZWwnOiB7IGxhYmVsOiAnTW9kZWwnIH0sXG4gICdleHRlbnNpb24nOiB7IGxhYmVsOiAnRXh0ZW5zaW9uJyB9LFxuICAnYWdlbnQtc3RyYXRlZ3knOiB7IGxhYmVsOiAnQWdlbnQnIH0sXG4gICdkYXRhc291cmNlJzogeyBsYWJlbDogJ0RhdGFzb3VyY2UnIH0sXG4gICd0cmlnZ2VyJzogeyBsYWJlbDogJ1RyaWdnZXInIH0sXG4gICdidW5kbGUnOiB7IGxhYmVsOiAnQnVuZGxlJyB9LFxufVxuXG52aS5tb2NrKCcuLi9ob29rcycsICgpID0+ICh7XG4gIHVzZUNhdGVnb3JpZXM6ICgpID0+ICh7XG4gICAgY2F0ZWdvcmllc01hcDogbW9ja0NhdGVnb3JpZXNNYXAsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgZm9ybWF0TnVtYmVyIHV0aWxpdHlcbnZpLm1vY2soJ0AvdXRpbHMvZm9ybWF0JywgKCkgPT4gKHtcbiAgZm9ybWF0TnVtYmVyOiAobnVtOiBudW1iZXIpID0+IG51bS50b0xvY2FsZVN0cmluZygpLFxufSkpXG5cbi8vIE1vY2sgc2hvdWxkVXNlTWNwSWNvbiB1dGlsaXR5XG52aS5tb2NrKCdAL3V0aWxzL21jcCcsICgpID0+ICh7XG4gIHNob3VsZFVzZU1jcEljb246IChzcmM6IHVua25vd24pID0+IHR5cGVvZiBzcmMgPT09ICdvYmplY3QnICYmIHNyYyAhPT0gbnVsbCAmJiAoc3JjIGFzIHsgY29udGVudD86IHN0cmluZyB9KT8uY29udGVudCA9PT0gJ/CflJcnLFxufSkpXG5cbi8vIE1vY2sgQXBwSWNvbiBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9hcHAtaWNvbicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGljb24sIGJhY2tncm91bmQsIGlubmVySWNvbiwgc2l6ZSwgaWNvblR5cGUgfToge1xuICAgIGljb24/OiBzdHJpbmdcbiAgICBiYWNrZ3JvdW5kPzogc3RyaW5nXG4gICAgaW5uZXJJY29uPzogUmVhY3QuUmVhY3ROb2RlXG4gICAgc2l6ZT86IHN0cmluZ1xuICAgIGljb25UeXBlPzogc3RyaW5nXG4gIH0pID0+IChcbiAgICA8ZGl2XG4gICAgICBkYXRhLXRlc3RpZD1cImFwcC1pY29uXCJcbiAgICAgIGRhdGEtaWNvbj17aWNvbn1cbiAgICAgIGRhdGEtYmFja2dyb3VuZD17YmFja2dyb3VuZH1cbiAgICAgIGRhdGEtc2l6ZT17c2l6ZX1cbiAgICAgIGRhdGEtaWNvbi10eXBlPXtpY29uVHlwZX1cbiAgICA+XG4gICAgICB7aW5uZXJJY29uICYmIDxkaXYgZGF0YS10ZXN0aWQ9XCJpbm5lci1pY29uXCI+e2lubmVySWNvbn08L2Rpdj59XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBNY3AgaWNvbiBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvdmVuZGVyL290aGVyJywgKCkgPT4gKHtcbiAgTWNwOiAoeyBjbGFzc05hbWUgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJtY3AtaWNvblwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5NQ1A8L2Rpdj5cbiAgKSxcbiAgR3JvdXA6ICh7IGNsYXNzTmFtZSB9OiB7IGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImdyb3VwLWljb25cIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+R3JvdXA8L2Rpdj5cbiAgKSxcbn0pKVxuXG4vLyBNb2NrIExlZnRDb3JuZXIgaWNvbiBjb21wb25lbnRcbnZpLm1vY2soJy4uLy4uL2Jhc2UvaWNvbnMvc3JjL3ZlbmRlci9wbHVnaW4nLCAoKSA9PiAoe1xuICBMZWZ0Q29ybmVyOiAoeyBjbGFzc05hbWUgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsZWZ0LWNvcm5lclwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5MZWZ0Q29ybmVyPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBQYXJ0bmVyIGJhZGdlXG52aS5tb2NrKCcuLi9iYXNlL2JhZGdlcy9wYXJ0bmVyJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgY2xhc3NOYW1lLCB0ZXh0IH06IHsgY2xhc3NOYW1lPzogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicGFydG5lci1iYWRnZVwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSB0aXRsZT17dGV4dH0+UGFydG5lcjwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgVmVyaWZpZWQgYmFkZ2VcbnZpLm1vY2soJy4uL2Jhc2UvYmFkZ2VzL3ZlcmlmaWVkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgY2xhc3NOYW1lLCB0ZXh0IH06IHsgY2xhc3NOYW1lPzogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwidmVyaWZpZWQtYmFkZ2VcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0gdGl0bGU9e3RleHR9PlZlcmlmaWVkPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBTa2VsZXRvbiBjb21wb25lbnRzXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2Uvc2tlbGV0b24nLCAoKSA9PiAoe1xuICBTa2VsZXRvbkNvbnRhaW5lcjogKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwic2tlbGV0b24tY29udGFpbmVyXCI+e2NoaWxkcmVufTwvZGl2PlxuICApLFxuICBTa2VsZXRvblBvaW50OiAoKSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwic2tlbGV0b24tcG9pbnRcIiAvPixcbiAgU2tlbGV0b25SZWN0YW5nbGU6ICh7IGNsYXNzTmFtZSB9OiB7IGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInNrZWxldG9uLXJlY3RhbmdsZVwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSAvPlxuICApLFxuICBTa2VsZXRvblJvdzogKHsgY2hpbGRyZW4sIGNsYXNzTmFtZSB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUsIGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInNrZWxldG9uLXJvd1wiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT57Y2hpbGRyZW59PC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBSZW1peCBpY29uc1xudmkubW9jaygnQHJlbWl4aWNvbi9yZWFjdCcsICgpID0+ICh7XG4gIFJpQ2hlY2tMaW5lOiAoeyBjbGFzc05hbWUgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSkgPT4gKFxuICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicmktY2hlY2stbGluZVwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT7inJM8L3NwYW4+XG4gICksXG4gIFJpQ2xvc2VMaW5lOiAoeyBjbGFzc05hbWUgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSkgPT4gKFxuICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicmktY2xvc2UtbGluZVwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT7inJU8L3NwYW4+XG4gICksXG4gIFJpSW5zdGFsbExpbmU6ICh7IGNsYXNzTmFtZSB9OiB7IGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiAoXG4gICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJyaS1pbnN0YWxsLWxpbmVcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+4oaTPC9zcGFuPlxuICApLFxuICBSaUFsZXJ0RmlsbDogKHsgY2xhc3NOYW1lIH06IHsgY2xhc3NOYW1lPzogc3RyaW5nIH0pID0+IChcbiAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInJpLWFsZXJ0LWZpbGxcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+4pqgPC9zcGFuPlxuICApLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVNb2NrUGx1Z2luID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8UGx1Z2luPik6IFBsdWdpbiA9PiAoe1xuICB0eXBlOiAncGx1Z2luJyxcbiAgb3JnOiAndGVzdC1vcmcnLFxuICBuYW1lOiAndGVzdC1wbHVnaW4nLFxuICBwbHVnaW5faWQ6ICdwbHVnaW4tMTIzJyxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgbGF0ZXN0X3ZlcnNpb246ICcxLjAuMCcsXG4gIGxhdGVzdF9wYWNrYWdlX2lkZW50aWZpZXI6ICd0ZXN0LW9yZy90ZXN0LXBsdWdpbjoxLjAuMCcsXG4gIGljb246ICcvdGVzdC1pY29uLnBuZycsXG4gIHZlcmlmaWVkOiBmYWxzZSxcbiAgbGFiZWw6IHsgJ2VuLVVTJzogJ1Rlc3QgUGx1Z2luJyB9LFxuICBicmllZjogeyAnZW4tVVMnOiAnVGVzdCBwbHVnaW4gZGVzY3JpcHRpb24nIH0sXG4gIGRlc2NyaXB0aW9uOiB7ICdlbi1VUyc6ICdGdWxsIHRlc3QgcGx1Z2luIGRlc2NyaXB0aW9uJyB9LFxuICBpbnRyb2R1Y3Rpb246ICdUZXN0IHBsdWdpbiBpbnRyb2R1Y3Rpb24nLFxuICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9naXRodWIuY29tL3Rlc3QvcGx1Z2luJyxcbiAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICBpbnN0YWxsX2NvdW50OiAxMDAwLFxuICBlbmRwb2ludDogeyBzZXR0aW5nczogW10gfSxcbiAgdGFnczogW3sgbmFtZTogJ3NlYXJjaCcgfV0sXG4gIGJhZGdlczogW10sXG4gIHZlcmlmaWNhdGlvbjogeyBhdXRob3JpemVkX2NhdGVnb3J5OiAnY29tbXVuaXR5JyB9LFxuICBmcm9tOiAnbWFya2V0cGxhY2UnLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ2FyZCBDb21wb25lbnQgVGVzdHMgKGluZGV4LnRzeClcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnQ2FyZCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oKVxuICAgICAgcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gLz4pXG5cbiAgICAgIGV4cGVjdChkb2N1bWVudC5ib2R5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBsdWdpbiB0aXRsZSBmcm9tIGxhYmVsJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdNeSBQbHVnaW4gVGl0bGUnIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ015IFBsdWdpbiBUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBsdWdpbiBkZXNjcmlwdGlvbiBmcm9tIGJyaWVmJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIGJyaWVmOiB7ICdlbi1VUyc6ICdUaGlzIGlzIGEgYnJpZWYgZGVzY3JpcHRpb24nIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1RoaXMgaXMgYSBicmllZiBkZXNjcmlwdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG9yZ2FuaXphdGlvbiBpbmZvIHdpdGggb3JnIG5hbWUgYW5kIHBhY2thZ2UgbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBvcmc6ICdteS1vcmcnLFxuICAgICAgICBuYW1lOiAnbXktcGx1Z2luJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8Q2FyZCBwYXlsb2FkPXtwbHVnaW59IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbXktb3JnJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdteS1wbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwbHVnaW4gaWNvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBpY29uOiAnL2N1c3RvbS1pY29uLnBuZycsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gLz4pXG5cbiAgICAgIC8vIENoZWNrIGZvciBiYWNrZ3JvdW5kIGltYWdlIHN0eWxlIG9uIGljb24gZWxlbWVudFxuICAgICAgY29uc3QgaWNvbkVsZW1lbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW3N0eWxlKj1cImJhY2tncm91bmQtaW1hZ2VcIl0nKVxuICAgICAgZXhwZWN0KGljb25FbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNvcm5lciBtYXJrIHdpdGggY2F0ZWdvcnkgbGFiZWwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHtcbiAgICAgICAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUb29sJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIGNsYXNzTmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENhcmQgcGF5bG9hZD17cGx1Z2lufSBjbGFzc05hbWU9XCJjdXN0b20tY2xhc3NcIiAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY3VzdG9tLWNsYXNzJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoaWRlIGNvcm5lciBtYXJrIHdoZW4gaGlkZUNvcm5lck1hcmsgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSBoaWRlQ29ybmVyTWFyaz17dHJ1ZX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnbGVmdC1jb3JuZXInKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGNvcm5lciBtYXJrIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKClcblxuICAgICAgcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xlZnQtY29ybmVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGluc3RhbGxlZCBwcm9wIHRvIEljb24gY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbigpXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSBpbnN0YWxsZWQ9e3RydWV9IC8+KVxuXG4gICAgICAvLyBDaGVjayBmb3IgdGhlIGNoZWNrIGljb24gdGhhdCBhcHBlYXJzIHdoZW4gaW5zdGFsbGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyaS1jaGVjay1saW5lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGluc3RhbGxGYWlsZWQgcHJvcCB0byBJY29uIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oKVxuICAgICAgcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gaW5zdGFsbEZhaWxlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIENoZWNrIGZvciB0aGUgY2xvc2UgaWNvbiB0aGF0IGFwcGVhcnMgd2hlbiBpbnN0YWxsIGZhaWxlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmktY2xvc2UtbGluZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGZvb3RlciB3aGVuIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbigpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gZm9vdGVyPXs8ZGl2IGRhdGEtdGVzdGlkPVwiY3VzdG9tLWZvb3RlclwiPkZvb3RlciBDb250ZW50PC9kaXY+fSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VzdG9tLWZvb3RlcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRm9vdGVyIENvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0aXRsZUxlZnQgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8Q2FyZCBwYXlsb2FkPXtwbHVnaW59IHRpdGxlTGVmdD17PHNwYW4gZGF0YS10ZXN0aWQ9XCJ0aXRsZS1sZWZ0XCI+djEuMDwvc3Bhbj59IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0aXRsZS1sZWZ0JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgY3VzdG9tIGRlc2NyaXB0aW9uTGluZVJvd3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKClcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPENhcmQgcGF5bG9hZD17cGx1Z2lufSBkZXNjcmlwdGlvbkxpbmVSb3dzPXsxfSAvPixcbiAgICAgIClcblxuICAgICAgLy8gQ2hlY2sgZm9yIGgtNCB0cnVuY2F0ZSBjbGFzcyB3aGVuIGRlc2NyaXB0aW9uTGluZVJvd3MgaXMgMVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuaC00LnRydW5jYXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgZGVmYXVsdCBkZXNjcmlwdGlvbkxpbmVSb3dzIG9mIDInLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKClcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q2FyZCBwYXlsb2FkPXtwbHVnaW59IC8+KVxuXG4gICAgICAvLyBDaGVjayBmb3IgaC04IGxpbmUtY2xhbXAtMiBjbGFzcyB3aGVuIGRlc2NyaXB0aW9uTGluZVJvd3MgaXMgMiAoZGVmYXVsdClcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmgtOC5saW5lLWNsYW1wLTInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTG9hZGluZyBTdGF0ZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTG9hZGluZyBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBQbGFjZWhvbGRlciB3aGVuIGlzTG9hZGluZyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbigpXG5cbiAgICAgIHJlbmRlcig8Q2FyZCBwYXlsb2FkPXtwbHVnaW59IGlzTG9hZGluZz17dHJ1ZX0gbG9hZGluZ0ZpbGVOYW1lPVwibG9hZGluZy50eHRcIiAvPilcblxuICAgICAgLy8gU2hvdWxkIHJlbmRlciBza2VsZXRvbiBlbGVtZW50c1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2tlbGV0b24tY29udGFpbmVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbG9hZGluZ0ZpbGVOYW1lIGluIFBsYWNlaG9sZGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbigpXG5cbiAgICAgIHJlbmRlcig8Q2FyZCBwYXlsb2FkPXtwbHVnaW59IGlzTG9hZGluZz17dHJ1ZX0gbG9hZGluZ0ZpbGVOYW1lPVwibXktcGx1Z2luLnppcFwiIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbXktcGx1Z2luLnppcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBjYXJkIGNvbnRlbnQgd2hlbiBsb2FkaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdQbHVnaW4gVGl0bGUnIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSBpc0xvYWRpbmc9e3RydWV9IGxvYWRpbmdGaWxlTmFtZT1cImZpbGUudHh0XCIgLz4pXG5cbiAgICAgIC8vIFBsdWdpbiBjb250ZW50IHNob3VsZCBub3QgYmUgdmlzaWJsZSBkdXJpbmcgbG9hZGluZ1xuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnUGx1Z2luIFRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBsb2FkaW5nIHN0YXRlIGJ5IGRlZmF1bHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKClcblxuICAgICAgcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnc2tlbGV0b24tY29udGFpbmVyJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBCYWRnZXMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0JhZGdlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBQYXJ0bmVyIGJhZGdlIHdoZW4gYmFkZ2VzIGluY2x1ZGVzIHBhcnRuZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHtcbiAgICAgICAgYmFkZ2VzOiBbJ3BhcnRuZXInXSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8Q2FyZCBwYXlsb2FkPXtwbHVnaW59IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYXJ0bmVyLWJhZGdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgVmVyaWZpZWQgYmFkZ2Ugd2hlbiB2ZXJpZmllZCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIHZlcmlmaWVkOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ZlcmlmaWVkLWJhZGdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYm90aCBQYXJ0bmVyIGFuZCBWZXJpZmllZCBiYWRnZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHtcbiAgICAgICAgYmFkZ2VzOiBbJ3BhcnRuZXInXSxcbiAgICAgICAgdmVyaWZpZWQ6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFydG5lci1iYWRnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd2ZXJpZmllZC1iYWRnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBQYXJ0bmVyIGJhZGdlIHdoZW4gYmFkZ2VzIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIGJhZGdlczogW10sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwYXJ0bmVyLWJhZGdlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBWZXJpZmllZCBiYWRnZSB3aGVuIHZlcmlmaWVkIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIHZlcmlmaWVkOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8Q2FyZCBwYXlsb2FkPXtwbHVnaW59IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3ZlcmlmaWVkLWJhZGdlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBiYWRnZXMgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oKVxuICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciAtIFRlc3RpbmcgdW5kZWZpbmVkIGJhZGdlc1xuICAgICAgcGx1Z2luLmJhZGdlcyA9IHVuZGVmaW5lZFxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdwYXJ0bmVyLWJhZGdlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBMaW1pdGVkIEluc3RhbGwgV2FybmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTGltaXRlZCBJbnN0YWxsIFdhcm5pbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2FybmluZyB3aGVuIGxpbWl0ZWRJbnN0YWxsIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKClcblxuICAgICAgcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gbGltaXRlZEluc3RhbGw9e3RydWV9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyaS1hbGVydC1maWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIHdhcm5pbmcgYnkgZGVmYXVsdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oKVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdyaS1hbGVydC1maWxsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgbGltaXRlZCBwYWRkaW5nIHdoZW4gbGltaXRlZEluc3RhbGwgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oKVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gbGltaXRlZEluc3RhbGw9e3RydWV9IC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5wYi0xJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENhdGVnb3J5IFR5cGUgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NhdGVnb3J5IFR5cGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzcGxheSBidW5kbGUgbGFiZWwgZm9yIGJ1bmRsZSB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIHR5cGU6ICdidW5kbGUnLFxuICAgICAgICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgLy8gRm9yIGJ1bmRsZSB0eXBlLCBzaG91bGQgc2hvdyAnQnVuZGxlJyBpbnN0ZWFkIG9mIGNhdGVnb3J5XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQnVuZGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGNhdGVnb3J5IGxhYmVsIGZvciBub24tYnVuZGxlIHR5cGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIHR5cGU6ICdwbHVnaW4nLFxuICAgICAgICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLm1vZGVsLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdNb2RlbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBNZW1vaXphdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBDYXJkIGlzIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vXG4gICAgICBleHBlY3QoQ2FyZCkudG9CZURlZmluZWQoKVxuICAgICAgLy8gVGhlIGNvbXBvbmVudCBzaG91bGQgaGF2ZSB0aGUgbWVtbyBkaXNwbGF5IG5hbWUgY2hhcmFjdGVyaXN0aWNcbiAgICAgIGV4cGVjdCh0eXBlb2YgQ2FyZCkudG9CZSgnb2JqZWN0JylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmUtcmVuZGVyIHdoZW4gcHJvcHMgYXJlIHRoZSBzYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbigpXG4gICAgICBjb25zdCByZW5kZXJDb3VudCA9IHZpLmZuKClcblxuICAgICAgY29uc3QgVGVzdFdyYXBwZXIgPSAoeyBwIH06IHsgcDogUGx1Z2luIH0pID0+IHtcbiAgICAgICAgcmVuZGVyQ291bnQoKVxuICAgICAgICByZXR1cm4gPENhcmQgcGF5bG9hZD17cH0gLz5cbiAgICAgIH1cblxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxUZXN0V3JhcHBlciBwPXtwbHVnaW59IC8+KVxuICAgICAgZXhwZWN0KHJlbmRlckNvdW50KS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcblxuICAgICAgLy8gUmUtcmVuZGVyIHdpdGggc2FtZSBwbHVnaW4gcmVmZXJlbmNlXG4gICAgICByZXJlbmRlcig8VGVzdFdyYXBwZXIgcD17cGx1Z2lufSAvPilcbiAgICAgIGV4cGVjdChyZW5kZXJDb3VudCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDIpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGxhYmVsIG9iamVjdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBsYWJlbDoge30sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgLy8gU2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nXG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBicmllZiBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHtcbiAgICAgICAgYnJpZWY6IHt9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gLz4pXG5cbiAgICAgIGV4cGVjdChkb2N1bWVudC5ib2R5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBsYWJlbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oKVxuICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciAtIFRlc3RpbmcgdW5kZWZpbmVkIGxhYmVsXG4gICAgICBwbHVnaW4ubGFiZWwgPSB1bmRlZmluZWRcblxuICAgICAgcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gLz4pXG5cbiAgICAgIGV4cGVjdChkb2N1bWVudC5ib2R5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBwbHVnaW4gbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBuYW1lOiAncGx1Z2luLXdpdGgtc3BlY2lhbC1jaGFycyFAIyQlJyxcbiAgICAgICAgb3JnOiAnb3JnPHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0PicsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi13aXRoLXNwZWNpYWwtY2hhcnMhQCMkJScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyB0aXRsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvbmdUaXRsZSA9ICdBJy5yZXBlYXQoNTAwKVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6IGxvbmdUaXRsZSB9LFxuICAgICAgfSlcblxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q2FyZCBwYXlsb2FkPXtwbHVnaW59IC8+KVxuXG4gICAgICAvLyBTaG91bGQgaGF2ZSB0cnVuY2F0ZSBjbGFzcyBmb3IgbG9uZyB0ZXh0XG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50cnVuY2F0ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvbmdEZXNjcmlwdGlvbiA9ICdCJy5yZXBlYXQoMTAwMClcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBicmllZjogeyAnZW4tVVMnOiBsb25nRGVzY3JpcHRpb24gfSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgLy8gU2hvdWxkIGhhdmUgbGluZS1jbGFtcCBjbGFzcyBmb3IgbG9uZyB0ZXh0XG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5saW5lLWNsYW1wLTInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQ2FyZE1vcmVJbmZvIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdDYXJkTW9yZUluZm8nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENhcmRNb3JlSW5mbyBkb3dubG9hZENvdW50PXsxMDB9IHRhZ3M9e1sndGFnMSddfSAvPilcblxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZG93bmxvYWQgY291bnQgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q2FyZE1vcmVJbmZvIGRvd25sb2FkQ291bnQ9ezEwMDB9IHRhZ3M9e1tdfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzEsMDAwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGFncyB3aGVuIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDYXJkTW9yZUluZm8gdGFncz17WydzZWFyY2gnLCAnaW1hZ2UnXX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdzZWFyY2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2ltYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYm90aCBkb3dubG9hZCBjb3VudCBhbmQgdGFncyB3aXRoIHNlcGFyYXRvcicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q2FyZE1vcmVJbmZvIGRvd25sb2FkQ291bnQ9ezUwMH0gdGFncz17Wyd0YWcxJ119IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnNTAwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCfCtycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgndGFnMScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgZG93bmxvYWQgY291bnQgd2hlbiB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENhcmRNb3JlSW5mbyB0YWdzPXtbJ3RhZzEnXX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncmktaW5zdGFsbC1saW5lJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBzZXBhcmF0b3Igd2hlbiBkb3dubG9hZCBjb3VudCBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENhcmRNb3JlSW5mbyB0YWdzPXtbJ3RhZzEnXX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ8K3JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBzZXBhcmF0b3Igd2hlbiB0YWdzIGFyZSBlbXB0eScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q2FyZE1vcmVJbmZvIGRvd25sb2FkQ291bnQ9ezEwMH0gdGFncz17W119IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCfCtycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBoYXNoIHN5bWJvbCBiZWZvcmUgZWFjaCB0YWcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENhcmRNb3JlSW5mbyB0YWdzPXtbJ3NlYXJjaCddfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJyMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCB0aXRsZSBhdHRyaWJ1dGUgd2l0aCBoYXNoIHByZWZpeCBmb3IgdGFncycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q2FyZE1vcmVJbmZvIHRhZ3M9e1snc2VhcmNoJ119IC8+KVxuXG4gICAgICBjb25zdCB0YWdFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGl0bGUoJyMgc2VhcmNoJylcbiAgICAgIGV4cGVjdCh0YWdFbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBNZW1vaXphdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoQ2FyZE1vcmVJbmZvKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QodHlwZW9mIENhcmRNb3JlSW5mbykudG9CZSgnb2JqZWN0JylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgemVybyBkb3dubG9hZCBjb3VudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q2FyZE1vcmVJbmZvIGRvd25sb2FkQ291bnQ9ezB9IHRhZ3M9e1tdfSAvPilcblxuICAgICAgLy8gMCBzaG91bGQgc3RpbGwgcmVuZGVyIHNpbmNlIGRvd25sb2FkQ291bnQgaXMgZGVmaW5lZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSB0YWdzIGFycmF5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDYXJkTW9yZUluZm8gZG93bmxvYWRDb3VudD17MTAwfSB0YWdzPXtbXX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJyMnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbGFyZ2UgZG93bmxvYWQgY291bnQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENhcmRNb3JlSW5mbyBkb3dubG9hZENvdW50PXsxMjM0NTY3ODkwfSB0YWdzPXtbXX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcxLDIzNCw1NjcsODkwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWFueSB0YWdzJywgKCkgPT4ge1xuICAgICAgY29uc3QgdGFncyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwIH0sIChfLCBpKSA9PiBgdGFnJHtpfWApXG4gICAgICByZW5kZXIoPENhcmRNb3JlSW5mbyBkb3dubG9hZENvdW50PXsxMDB9IHRhZ3M9e3RhZ3N9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgndGFnMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgndGFnOScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHRhZ3Mgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENhcmRNb3JlSW5mbyB0YWdzPXtbJ3RhZy13aXRoLWRhc2gnLCAndGFnX3dpdGhfdW5kZXJzY29yZSddfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3RhZy13aXRoLWRhc2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3RhZ193aXRoX3VuZGVyc2NvcmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRydW5jYXRlIGxvbmcgdGFnIG5hbWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9uZ1RhZyA9ICdhJy5yZXBlYXQoMjAwKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8Q2FyZE1vcmVJbmZvIHRhZ3M9e1tsb25nVGFnXX0gLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnRydW5jYXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEljb24gQ29tcG9uZW50IFRlc3RzIChiYXNlL2NhcmQtaWNvbi50c3gpXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0ljb24nLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcgd2l0aCBzdHJpbmcgc3JjJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJY29uIHNyYz1cIi9pY29uLnBuZ1wiIC8+KVxuXG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nIHdpdGggb2JqZWN0IHNyYycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SWNvbiBzcmM9e3sgY29udGVudDogJ/CfjoknLCBiYWNrZ3JvdW5kOiAnI2ZmZicgfX0gLz4pXG5cbiAgICAgIGV4cGVjdChkb2N1bWVudC5ib2R5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGJhY2tncm91bmQgaW1hZ2UgZm9yIHN0cmluZyBzcmMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJY29uIHNyYz1cIi90ZXN0LWljb24ucG5nXCIgLz4pXG5cbiAgICAgIGNvbnN0IGljb25EaXYgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KGljb25EaXYpLnRvSGF2ZVN0eWxlKHsgYmFja2dyb3VuZEltYWdlOiAndXJsKC90ZXN0LWljb24ucG5nKScgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgQXBwSWNvbiBmb3Igb2JqZWN0IHNyYycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SWNvbiBzcmM9e3sgY29udGVudDogJ/CfjoknLCBiYWNrZ3JvdW5kOiAnI2ZmZmZmZicgfX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2FwcC1pY29uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIGNsYXNzTmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEljb24gc3JjPVwiL2ljb24ucG5nXCIgY2xhc3NOYW1lPVwiY3VzdG9tLWljb24tY2xhc3NcIiAvPilcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY3VzdG9tLWljb24tY2xhc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjaGVjayBpY29uIHdoZW4gaW5zdGFsbGVkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEljb24gc3JjPVwiL2ljb24ucG5nXCIgaW5zdGFsbGVkPXt0cnVlfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmktY2hlY2stbGluZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNsb3NlIGljb24gd2hlbiBpbnN0YWxsRmFpbGVkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEljb24gc3JjPVwiL2ljb24ucG5nXCIgaW5zdGFsbEZhaWxlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JpLWNsb3NlLWxpbmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgc3RhdHVzIGljb24gd2hlbiBuZWl0aGVyIGluc3RhbGxlZCBub3IgZmFpbGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJY29uIHNyYz1cIi9pY29uLnBuZ1wiIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3JpLWNoZWNrLWxpbmUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncmktY2xvc2UtbGluZScpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBkZWZhdWx0IHNpemUgb2YgbGFyZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJY29uIHNyYz1cIi9pY29uLnBuZ1wiIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy53LTEwLmgtMTAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHhzIHNpemUgY2xhc3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJY29uIHNyYz1cIi9pY29uLnBuZ1wiIHNpemU9XCJ4c1wiIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy53LTQuaC00JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSB0aW55IHNpemUgY2xhc3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJY29uIHNyYz1cIi9pY29uLnBuZ1wiIHNpemU9XCJ0aW55XCIgLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnctNi5oLTYnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHNtYWxsIHNpemUgY2xhc3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJY29uIHNyYz1cIi9pY29uLnBuZ1wiIHNpemU9XCJzbWFsbFwiIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy53LTguaC04JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBtZWRpdW0gc2l6ZSBjbGFzcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEljb24gc3JjPVwiL2ljb24ucG5nXCIgc2l6ZT1cIm1lZGl1bVwiIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy53LTkuaC05JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBsYXJnZSBzaXplIGNsYXNzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8SWNvbiBzcmM9XCIvaWNvbi5wbmdcIiBzaXplPVwibGFyZ2VcIiAvPilcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudy0xMC5oLTEwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIE1DUCBJY29uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdNQ1AgSWNvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBNQ1AgaWNvbiB3aGVuIHNyYyBjb250ZW50IGlzIPCflJcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEljb24gc3JjPXt7IGNvbnRlbnQ6ICfwn5SXJywgYmFja2dyb3VuZDogJyNmZmZmZmYnIH19IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdtY3AtaWNvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBNQ1AgaWNvbiBmb3Igb3RoZXIgZW1vamkgY29udGVudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SWNvbiBzcmM9e3sgY29udGVudDogJ/CfjoknLCBiYWNrZ3JvdW5kOiAnI2ZmZmZmZicgfX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnbWNwLWljb24nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFN0YXR1cyBJbmRpY2F0b3IgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0YXR1cyBJbmRpY2F0b3JzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHN1Y2Nlc3MgaW5kaWNhdG9yIHdpdGggY29ycmVjdCBzdHlsaW5nIGZvciBpbnN0YWxsZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJY29uIHNyYz1cIi9pY29uLnBuZ1wiIGluc3RhbGxlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmJnLXN0YXRlLXN1Y2Nlc3Mtc29saWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkZXN0cnVjdGl2ZSBpbmRpY2F0b3Igd2l0aCBjb3JyZWN0IHN0eWxpbmcgZm9yIGZhaWxlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPEljb24gc3JjPVwiL2ljb24ucG5nXCIgaW5zdGFsbEZhaWxlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmJnLXN0YXRlLWRlc3RydWN0aXZlLXNvbGlkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmlvcml0aXplIGluc3RhbGxlZCBvdmVyIGluc3RhbGxGYWlsZWQnLCAoKSA9PiB7XG4gICAgICAvLyBXaGVuIGJvdGggYXJlIHRydWUsIGluc3RhbGxlZCB0YWtlcyBwcmVjZWRlbmNlIChyZW5kZXJlZCBmaXJzdCBpbiBjb2RlKVxuICAgICAgcmVuZGVyKDxJY29uIHNyYz1cIi9pY29uLnBuZ1wiIGluc3RhbGxlZD17dHJ1ZX0gaW5zdGFsbEZhaWxlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JpLWNoZWNrLWxpbmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBzdHJpbmcgc3JjJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8SWNvbiBzcmM9XCJcIiAvPilcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBVUkwnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxJY29uIHNyYz1cIi9pY29uP25hbWU9dGVzdCZzaXplPWxhcmdlXCIgLz4pXG5cbiAgICAgIGNvbnN0IGljb25EaXYgPSBjb250YWluZXIuZmlyc3RDaGlsZCBhcyBIVE1MRWxlbWVudFxuICAgICAgZXhwZWN0KGljb25EaXYpLnRvSGF2ZVN0eWxlKHsgYmFja2dyb3VuZEltYWdlOiAndXJsKC9pY29uP25hbWU9dGVzdCZzaXplPWxhcmdlKScgfSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIENvcm5lck1hcmsgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0Nvcm5lck1hcmsnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPENvcm5lck1hcmsgdGV4dD1cIlRvb2xcIiAvPilcblxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGV4dCBjb250ZW50JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDb3JuZXJNYXJrIHRleHQ9XCJUb29sXCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUb29sJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgTGVmdENvcm5lciBpY29uJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDb3JuZXJNYXJrIHRleHQ9XCJNb2RlbFwiIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsZWZ0LWNvcm5lcicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgZGlmZmVyZW50IGNhdGVnb3J5IHRleHQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPENvcm5lck1hcmsgdGV4dD1cIlRvb2xcIiAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUb29sJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgcmVyZW5kZXIoPENvcm5lck1hcmsgdGV4dD1cIk1vZGVsXCIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTW9kZWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICByZXJlbmRlcig8Q29ybmVyTWFyayB0ZXh0PVwiRXh0ZW5zaW9uXCIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRXh0ZW5zaW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdGV4dCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8Q29ybmVyTWFyayB0ZXh0PVwiXCIgLz4pXG5cbiAgICAgIGV4cGVjdChkb2N1bWVudC5ib2R5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGxvbmcgdGV4dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvbmdUZXh0ID0gJ1ZlcnkgTG9uZyBDYXRlZ29yeSBOYW1lJ1xuICAgICAgcmVuZGVyKDxDb3JuZXJNYXJrIHRleHQ9e2xvbmdUZXh0fSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ1RleHQpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiB0ZXh0JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxDb3JuZXJNYXJrIHRleHQ9XCJUZXN0ICYgRGVtb1wiIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCAmIERlbW8nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gRGVzY3JpcHRpb24gQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0Rlc2NyaXB0aW9uJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEZXNjcmlwdGlvbiB0ZXh0PVwiVGVzdCBkZXNjcmlwdGlvblwiIGRlc2NyaXB0aW9uTGluZVJvd3M9ezJ9IC8+KVxuXG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0ZXh0IGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIHRleHQ9XCJUaGlzIGlzIGEgZGVzY3JpcHRpb25cIiBkZXNjcmlwdGlvbkxpbmVSb3dzPXsyfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1RoaXMgaXMgYSBkZXNjcmlwdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8RGVzY3JpcHRpb24gdGV4dD1cIlRlc3RcIiBkZXNjcmlwdGlvbkxpbmVSb3dzPXsyfSBjbGFzc05hbWU9XCJjdXN0b20tZGVzYy1jbGFzc1wiIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXN0b20tZGVzYy1jbGFzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgaC00IHRydW5jYXRlIGZvciAxIGxpbmUgcm93JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPERlc2NyaXB0aW9uIHRleHQ9XCJUZXN0XCIgZGVzY3JpcHRpb25MaW5lUm93cz17MX0gLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmgtNC50cnVuY2F0ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgaC04IGxpbmUtY2xhbXAtMiBmb3IgMiBsaW5lIHJvd3MnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8RGVzY3JpcHRpb24gdGV4dD1cIlRlc3RcIiBkZXNjcmlwdGlvbkxpbmVSb3dzPXsyfSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuaC04LmxpbmUtY2xhbXAtMicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgaC0xMiBsaW5lLWNsYW1wLTMgZm9yIDMrIGxpbmUgcm93cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxEZXNjcmlwdGlvbiB0ZXh0PVwiVGVzdFwiIGRlc2NyaXB0aW9uTGluZVJvd3M9ezN9IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5oLTEyLmxpbmUtY2xhbXAtMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgaC0xMiBsaW5lLWNsYW1wLTMgZm9yIHZhbHVlcyBncmVhdGVyIHRoYW4gMycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxEZXNjcmlwdGlvbiB0ZXh0PVwiVGVzdFwiIGRlc2NyaXB0aW9uTGluZVJvd3M9ezV9IC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5oLTEyLmxpbmUtY2xhbXAtMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBNZW1vaXphdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtZW1vaXplIGxpbmVDbGFzc05hbWUgYmFzZWQgb24gZGVzY3JpcHRpb25MaW5lUm93cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyLCByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8RGVzY3JpcHRpb24gdGV4dD1cIlRlc3RcIiBkZXNjcmlwdGlvbkxpbmVSb3dzPXsyfSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcubGluZS1jbGFtcC0yJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gUmUtcmVuZGVyIHdpdGggc2FtZSBkZXNjcmlwdGlvbkxpbmVSb3dzXG4gICAgICByZXJlbmRlcig8RGVzY3JpcHRpb24gdGV4dD1cIkRpZmZlcmVudCB0ZXh0XCIgZGVzY3JpcHRpb25MaW5lUm93cz17Mn0gLz4pXG5cbiAgICAgIC8vIFNob3VsZCBzdGlsbCBoYXZlIHNhbWUgY2xhc3MgKG1lbW9pemVkKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcubGluZS1jbGFtcC0yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdGV4dCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8RGVzY3JpcHRpb24gdGV4dD1cIlwiIGRlc2NyaXB0aW9uTGluZVJvd3M9ezJ9IC8+KVxuXG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgdGV4dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvbmdUZXh0ID0gJ0EnLnJlcGVhdCgxMDAwKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPERlc2NyaXB0aW9uIHRleHQ9e2xvbmdUZXh0fSBkZXNjcmlwdGlvbkxpbmVSb3dzPXsyfSAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcubGluZS1jbGFtcC0yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdGV4dCB3aXRoIEhUTUwgZW50aXRpZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERlc2NyaXB0aW9uIHRleHQ9XCI8c2NyaXB0PmFsZXJ0KCd4c3MnKTwvc2NyaXB0PlwiIGRlc2NyaXB0aW9uTGluZVJvd3M9ezJ9IC8+KVxuXG4gICAgICAvLyBUZXh0IHNob3VsZCBiZSBlc2NhcGVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnPHNjcmlwdD5hbGVydChcXCd4c3NcXCcpPC9zY3JpcHQ+JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIERvd25sb2FkQ291bnQgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0Rvd25sb2FkQ291bnQnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERvd25sb2FkQ291bnQgZG93bmxvYWRDb3VudD17MTAwfSAvPilcblxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZG93bmxvYWQgY291bnQgd2l0aCBmb3JtYXR0ZWQgbnVtYmVyJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEb3dubG9hZENvdW50IGRvd25sb2FkQ291bnQ9ezEyMzQ1Njd9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMSwyMzQsNTY3JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgaW5zdGFsbCBpY29uJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEb3dubG9hZENvdW50IGRvd25sb2FkQ291bnQ9ezEwMH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JpLWluc3RhbGwtbGluZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgc21hbGwgZG93bmxvYWQgY291bnQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPERvd25sb2FkQ291bnQgZG93bmxvYWRDb3VudD17NX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCc1JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGxhcmdlIGRvd25sb2FkIGNvdW50JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEb3dubG9hZENvdW50IGRvd25sb2FkQ291bnQ9ezk5OTk5OTk5OX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCc5OTksOTk5LDk5OScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBNZW1vaXphdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSBtZW1vaXplZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoRG93bmxvYWRDb3VudCkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHR5cGVvZiBEb3dubG9hZENvdW50KS50b0JlKCdvYmplY3QnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB6ZXJvIGRvd25sb2FkIGNvdW50JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEb3dubG9hZENvdW50IGRvd25sb2FkQ291bnQ9ezB9IC8+KVxuXG4gICAgICAvLyAwIHNob3VsZCBzdGlsbCByZW5kZXIgd2l0aCBpbnN0YWxsIGljb25cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JpLWluc3RhbGwtbGluZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG5lZ2F0aXZlIGRvd25sb2FkIGNvdW50JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxEb3dubG9hZENvdW50IGRvd25sb2FkQ291bnQ9ey0xMDB9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnLTEwMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBPcmdJbmZvIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdPcmdJbmZvJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxPcmdJbmZvIHBhY2thZ2VOYW1lPVwidGVzdC1wbHVnaW5cIiAvPilcblxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGFja2FnZSBuYW1lJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxPcmdJbmZvIHBhY2thZ2VOYW1lPVwibXktcGx1Z2luXCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdteS1wbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBvcmcgbmFtZSBhbmQgc2VwYXJhdG9yIHdoZW4gcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPE9yZ0luZm8gb3JnTmFtZT1cIm15LW9yZ1wiIHBhY2thZ2VOYW1lPVwibXktcGx1Z2luXCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdteS1vcmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJy8nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ215LXBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFwcGx5IGN1c3RvbSBjbGFzc05hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgICA8T3JnSW5mbyBwYWNrYWdlTmFtZT1cInRlc3RcIiBjbGFzc05hbWU9XCJjdXN0b20tb3JnLWNsYXNzXCIgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmN1c3RvbS1vcmctY2xhc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IHBhY2thZ2VOYW1lQ2xhc3NOYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcihcbiAgICAgICAgPE9yZ0luZm8gcGFja2FnZU5hbWU9XCJ0ZXN0XCIgcGFja2FnZU5hbWVDbGFzc05hbWU9XCJjdXN0b20tcGFja2FnZS1jbGFzc1wiIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXN0b20tcGFja2FnZS1jbGFzcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBvcmcgbmFtZSBzZWN0aW9uIHdoZW4gb3JnTmFtZSBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPE9yZ0luZm8gcGFja2FnZU5hbWU9XCJ0ZXN0XCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJy8nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIG9yZyBuYW1lIHNlY3Rpb24gd2hlbiBvcmdOYW1lIGlzIGVtcHR5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxPcmdJbmZvIG9yZ05hbWU9XCJcIiBwYWNrYWdlTmFtZT1cInRlc3RcIiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnLycpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gb3JnIG5hbWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPE9yZ0luZm8gb3JnTmFtZT1cIm15LW9yZ18xMjNcIiBwYWNrYWdlTmFtZT1cInRlc3RcIiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ215LW9yZ18xMjMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gcGFja2FnZSBuYW1lJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxPcmdJbmZvIHBhY2thZ2VOYW1lPVwicGx1Z2luQHYxLjAuMFwiIC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luQHYxLjAuMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJ1bmNhdGUgbG9uZyBwYWNrYWdlIG5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb25nTmFtZSA9ICdhJy5yZXBlYXQoMTAwKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8T3JnSW5mbyBwYWNrYWdlTmFtZT17bG9uZ05hbWV9IC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50cnVuY2F0ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQbGFjZWhvbGRlciBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnUGxhY2Vob2xkZXInLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFBsYWNlaG9sZGVyIHdyYXBDbGFzc05hbWU9XCJ0ZXN0LWNsYXNzXCIgLz4pXG5cbiAgICAgIGV4cGVjdChkb2N1bWVudC5ib2R5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggd3JhcENsYXNzTmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxQbGFjZWhvbGRlciB3cmFwQ2xhc3NOYW1lPVwiY3VzdG9tLXdyYXBwZXJcIiAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuY3VzdG9tLXdyYXBwZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBza2VsZXRvbiBlbGVtZW50cycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UGxhY2Vob2xkZXIgd3JhcENsYXNzTmFtZT1cInRlc3RcIiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2tlbGV0b24tY29udGFpbmVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3NrZWxldG9uLXJlY3RhbmdsZScpLmxlbmd0aCkudG9CZUdyZWF0ZXJUaGFuKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEdyb3VwIGljb24nLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFBsYWNlaG9sZGVyIHdyYXBDbGFzc05hbWU9XCJ0ZXN0XCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2dyb3VwLWljb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgVGl0bGUgd2hlbiBsb2FkaW5nRmlsZU5hbWUgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFBsYWNlaG9sZGVyIHdyYXBDbGFzc05hbWU9XCJ0ZXN0XCIgbG9hZGluZ0ZpbGVOYW1lPVwibXktZmlsZS56aXBcIiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ215LWZpbGUuemlwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgU2tlbGV0b25SZWN0YW5nbGUgd2hlbiBsb2FkaW5nRmlsZU5hbWUgaXMgbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxQbGFjZWhvbGRlciB3cmFwQ2xhc3NOYW1lPVwidGVzdFwiIC8+KVxuXG4gICAgICAvLyBTaG91bGQgaGF2ZSBza2VsZXRvbiByZWN0YW5nbGUgZm9yIHRpdGxlIGFyZWFcbiAgICAgIGNvbnN0IHJlY3RhbmdsZXMgPSBzY3JlZW4uZ2V0QWxsQnlUZXN0SWQoJ3NrZWxldG9uLXJlY3RhbmdsZScpXG4gICAgICBleHBlY3QocmVjdGFuZ2xlcy5sZW5ndGgpLnRvQmVHcmVhdGVyVGhhbigwKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBTa2VsZXRvblJvdyBmb3Igb3JnIGluZm8nLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFBsYWNlaG9sZGVyIHdyYXBDbGFzc05hbWU9XCJ0ZXN0XCIgLz4pXG5cbiAgICAgIC8vIFRoZXJlIGFyZSBtdWx0aXBsZSBza2VsZXRvbiByb3dzIGluIHRoZSBjb21wb25lbnRcbiAgICAgIGNvbnN0IHNrZWxldG9uUm93cyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgnc2tlbGV0b24tcm93JylcbiAgICAgIGV4cGVjdChza2VsZXRvblJvd3MubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgd3JhcENsYXNzTmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFBsYWNlaG9sZGVyIHdyYXBDbGFzc05hbWU9XCJcIiAvPilcblxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5maXJzdENoaWxkKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuZGVmaW5lZCBsb2FkaW5nRmlsZU5hbWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFBsYWNlaG9sZGVyIHdyYXBDbGFzc05hbWU9XCJ0ZXN0XCIgbG9hZGluZ0ZpbGVOYW1lPXt1bmRlZmluZWR9IC8+KVxuXG4gICAgICAvLyBTaG91bGQgc2hvdyBza2VsZXRvbiBpbnN0ZWFkIG9mIHRpdGxlXG4gICAgICBjb25zdCByZWN0YW5nbGVzID0gc2NyZWVuLmdldEFsbEJ5VGVzdElkKCdza2VsZXRvbi1yZWN0YW5nbGUnKVxuICAgICAgZXhwZWN0KHJlY3RhbmdsZXMubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbG9uZyBsb2FkaW5nRmlsZU5hbWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb25nRmlsZU5hbWUgPSAndmVyeS1sb25nLWZpbGUtbmFtZS10aGF0LWdvZXMtb24tZm9yZXZlci56aXAnXG4gICAgICByZW5kZXIoPFBsYWNlaG9sZGVyIHdyYXBDbGFzc05hbWU9XCJ0ZXN0XCIgbG9hZGluZ0ZpbGVOYW1lPXtsb25nRmlsZU5hbWV9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dChsb25nRmlsZU5hbWUpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBMb2FkaW5nUGxhY2Vob2xkZXIgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0xvYWRpbmdQbGFjZWhvbGRlcicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TG9hZGluZ1BsYWNlaG9sZGVyIC8+KVxuXG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgY29ycmVjdCBiYXNlIGNsYXNzZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxMb2FkaW5nUGxhY2Vob2xkZXIgLz4pXG5cbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLmgtMi5yb3VuZGVkLXNtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RpbmdcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYXBwbHkgY3VzdG9tIGNsYXNzTmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPExvYWRpbmdQbGFjZWhvbGRlciBjbGFzc05hbWU9XCJjdXN0b20tbG9hZGluZ1wiIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5jdXN0b20tbG9hZGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWVyZ2UgY2xhc3NOYW1lIHdpdGggYmFzZSBjbGFzc2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8TG9hZGluZ1BsYWNlaG9sZGVyIGNsYXNzTmFtZT1cInctZnVsbFwiIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5oLTIucm91bmRlZC1zbS53LWZ1bGwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGl0bGUgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ1RpdGxlJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxUaXRsZSB0aXRsZT1cIlRlc3QgVGl0bGVcIiAvPilcblxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdGl0bGUgdGV4dCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8VGl0bGUgdGl0bGU9XCJNeSBQbHVnaW4gVGl0bGVcIiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ015IFBsdWdpbiBUaXRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSB0cnVuY2F0ZSBjbGFzcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFRpdGxlIHRpdGxlPVwiVGVzdFwiIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy50cnVuY2F0ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHRleHQgc3R5bGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFRpdGxlIHRpdGxlPVwiVGVzdFwiIC8+KVxuXG4gICAgICBleHBlY3QoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zeXN0ZW0tbWQtc2VtaWJvbGQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcudGV4dC10ZXh0LXNlY29uZGFyeScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0aW5nXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgZGlmZmVyZW50IHRpdGxlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8VGl0bGUgdGl0bGU9XCJGaXJzdCBUaXRsZVwiIC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0ZpcnN0IFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgcmVyZW5kZXIoPFRpdGxlIHRpdGxlPVwiU2Vjb25kIFRpdGxlXCIgLz4pXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU2Vjb25kIFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdGl0bGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFRpdGxlIHRpdGxlPVwiXCIgLz4pXG5cbiAgICAgIGV4cGVjdChkb2N1bWVudC5ib2R5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHZlcnkgbG9uZyB0aXRsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGxvbmdUaXRsZSA9ICdBJy5yZXBlYXQoNTAwKVxuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8VGl0bGUgdGl0bGU9e2xvbmdUaXRsZX0gLz4pXG5cbiAgICAgIC8vIFNob3VsZCBoYXZlIHRydW5jYXRlIGZvciBsb25nIHRleHRcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignLnRydW5jYXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIHRpdGxlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxUaXRsZSB0aXRsZT17J1RpdGxlIHdpdGggPHNwZWNpYWw+ICYgXCJjaGFyc1wiJ30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUaXRsZSB3aXRoIDxzcGVjaWFsPiAmIFwiY2hhcnNcIicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVuaWNvZGUgY2hhcmFjdGVycycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8VGl0bGUgdGl0bGU9XCLmoIfpopgg8J+OiSDjgr/jgqTjg4jjg6tcIiAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ+agh+mimCDwn46JIOOCv+OCpOODiOODqycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBJbnRlZ3JhdGlvbiBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdDYXJkIEludGVncmF0aW9uJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICBkZXNjcmliZSgnQ29tcGxldGUgQ2FyZCBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYSBjb21wbGV0ZSBjYXJkIHdpdGggYWxsIGVsZW1lbnRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdDb21wbGV0ZSBQbHVnaW4nIH0sXG4gICAgICAgIGJyaWVmOiB7ICdlbi1VUyc6ICdBIGNvbXBsZXRlIHBsdWdpbiBkZXNjcmlwdGlvbicgfSxcbiAgICAgICAgb3JnOiAnY29tcGxldGUtb3JnJyxcbiAgICAgICAgbmFtZTogJ2NvbXBsZXRlLXBsdWdpbicsXG4gICAgICAgIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgICAgICAgdmVyaWZpZWQ6IHRydWUsXG4gICAgICAgIGJhZGdlczogWydwYXJ0bmVyJ10sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxDYXJkXG4gICAgICAgICAgcGF5bG9hZD17cGx1Z2lufVxuICAgICAgICAgIGZvb3Rlcj17PENhcmRNb3JlSW5mbyBkb3dubG9hZENvdW50PXs1MDAwfSB0YWdzPXtbJ3NlYXJjaCcsICdhcGknXX0gLz59XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBWZXJpZnkgYWxsIGVsZW1lbnRzIGFyZSByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0NvbXBsZXRlIFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnQSBjb21wbGV0ZSBwbHVnaW4gZGVzY3JpcHRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbXBsZXRlLW9yZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnY29tcGxldGUtcGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUb29sJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhcnRuZXItYmFkZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndmVyaWZpZWQtYmFkZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzUsMDAwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdzZWFyY2gnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2FwaScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGxvYWRpbmcgc3RhdGUgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbigpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENhcmRcbiAgICAgICAgICBwYXlsb2FkPXtwbHVnaW59XG4gICAgICAgICAgaXNMb2FkaW5nPXt0cnVlfVxuICAgICAgICAgIGxvYWRpbmdGaWxlTmFtZT1cImxvYWRpbmctcGx1Z2luLnppcFwiXG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdza2VsZXRvbi1jb250YWluZXInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2xvYWRpbmctcGx1Z2luLnppcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3BhcnRuZXItYmFkZ2UnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaW5zdGFsbGVkIHN0YXRlIHdpdGggZm9vdGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbigpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPENhcmRcbiAgICAgICAgICBwYXlsb2FkPXtwbHVnaW59XG4gICAgICAgICAgaW5zdGFsbGVkPXt0cnVlfVxuICAgICAgICAgIGZvb3Rlcj17PENhcmRNb3JlSW5mbyBkb3dubG9hZENvdW50PXsxMDB9IHRhZ3M9e1sndGFnMSddfSAvPn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JpLWNoZWNrLWxpbmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzEwMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ29tcG9uZW50IEhpZXJhcmNoeScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBJY29uIGluc2lkZSBDYXJkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIGljb246ICcvdGVzdC1pY29uLnBuZycsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gLz4pXG5cbiAgICAgIC8vIEljb24gc2hvdWxkIGJlIHJlbmRlcmVkIHdpdGggYmFja2dyb3VuZCBpbWFnZVxuICAgICAgY29uc3QgaWNvbkVsZW1lbnQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignW3N0eWxlKj1cImJhY2tncm91bmQtaW1hZ2VcIl0nKVxuICAgICAgZXhwZWN0KGljb25FbGVtZW50KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFRpdGxlIGluc2lkZSBDYXJkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdUZXN0IFRpdGxlJyB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxDYXJkIHBheWxvYWQ9e3BsdWdpbn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdUZXN0IFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgRGVzY3JpcHRpb24gaW5zaWRlIENhcmQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHtcbiAgICAgICAgYnJpZWY6IHsgJ2VuLVVTJzogJ1Rlc3QgRGVzY3JpcHRpb24nIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1Rlc3QgRGVzY3JpcHRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBPcmdJbmZvIGluc2lkZSBDYXJkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIG9yZzogJ3Rlc3Qtb3JnJyxcbiAgICAgICAgbmFtZTogJ3Rlc3QtbmFtZScsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3Rlc3Qtb3JnJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCcvJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCd0ZXN0LW5hbWUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBDb3JuZXJNYXJrIGluc2lkZSBDYXJkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0ubW9kZWwsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01vZGVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xlZnQtY29ybmVyJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEFjY2Vzc2liaWxpdHkgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYXZlIGFjY2Vzc2libGUgdGV4dCBjb250ZW50JywgKCkgPT4ge1xuICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgbGFiZWw6IHsgJ2VuLVVTJzogJ0FjY2Vzc2libGUgUGx1Z2luJyB9LFxuICAgICAgYnJpZWY6IHsgJ2VuLVVTJzogJ1RoaXMgcGx1Z2luIGlzIGFjY2Vzc2libGUnIH0sXG4gICAgfSlcblxuICAgIHJlbmRlcig8Q2FyZCBwYXlsb2FkPXtwbHVnaW59IC8+KVxuXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FjY2Vzc2libGUgUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGhpcyBwbHVnaW4gaXMgYWNjZXNzaWJsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBoYXZlIHRpdGxlIGF0dHJpYnV0ZSBvbiB0YWdzJywgKCkgPT4ge1xuICAgIHJlbmRlcig8Q2FyZE1vcmVJbmZvIGRvd25sb2FkQ291bnQ9ezEwMH0gdGFncz17WydzZWFyY2gnXX0gLz4pXG5cbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGl0bGUoJyMgc2VhcmNoJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGhhdmUgc2VtYW50aWMgc3RydWN0dXJlJywgKCkgPT4ge1xuICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oKVxuICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPENhcmQgcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgIC8vIENhcmQgc2hvdWxkIGhhdmUgcHJvcGVyIGNvbnRhaW5lciBzdHJ1Y3R1cmVcbiAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvSGF2ZUNsYXNzKCdyb3VuZGVkLXhsJylcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQZXJmb3JtYW5jZSBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdQZXJmb3JtYW5jZScsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZW5kZXIgbXVsdGlwbGUgY2FyZHMgZWZmaWNpZW50bHknLCAoKSA9PiB7XG4gICAgY29uc3QgcGx1Z2lucyA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDUwIH0sIChfLCBpKSA9PlxuICAgICAgY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIG5hbWU6IGBwbHVnaW4tJHtpfWAsXG4gICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6IGBQbHVnaW4gJHtpfWAgfSxcbiAgICAgIH0pKVxuXG4gICAgY29uc3Qgc3RhcnRUaW1lID0gcGVyZm9ybWFuY2Uubm93KClcbiAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKFxuICAgICAgPGRpdj5cbiAgICAgICAge3BsdWdpbnMubWFwKHBsdWdpbiA9PiAoXG4gICAgICAgICAgPENhcmQga2V5PXtwbHVnaW4ubmFtZX0gcGF5bG9hZD17cGx1Z2lufSAvPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PixcbiAgICApXG4gICAgY29uc3QgZW5kVGltZSA9IHBlcmZvcm1hbmNlLm5vdygpXG5cbiAgICAvLyBTaG91bGQgcmVuZGVyIGFsbCBjYXJkc1xuICAgIGNvbnN0IGNhcmRzID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5yb3VuZGVkLXhsJylcbiAgICBleHBlY3QoY2FyZHMubGVuZ3RoKS50b0JlKDUwKVxuXG4gICAgLy8gU2hvdWxkIHJlbmRlciB3aXRoaW4gcmVhc29uYWJsZSB0aW1lIChsZXNzIHRoYW4gMSBzZWNvbmQpXG4gICAgZXhwZWN0KGVuZFRpbWUgLSBzdGFydFRpbWUpLnRvQmVMZXNzVGhhbigxMDAwKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIENhcmRNb3JlSW5mbyB3aXRoIG1hbnkgdGFncycsICgpID0+IHtcbiAgICBjb25zdCB0YWdzID0gQXJyYXkuZnJvbSh7IGxlbmd0aDogMjAgfSwgKF8sIGkpID0+IGB0YWctJHtpfWApXG5cbiAgICBjb25zdCBzdGFydFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKVxuICAgIHJlbmRlcig8Q2FyZE1vcmVJbmZvIGRvd25sb2FkQ291bnQ9ezEwMDB9IHRhZ3M9e3RhZ3N9IC8+KVxuICAgIGNvbnN0IGVuZFRpbWUgPSBwZXJmb3JtYW5jZS5ub3coKVxuXG4gICAgZXhwZWN0KGVuZFRpbWUgLSBzdGFydFRpbWUpLnRvQmVMZXNzVGhhbigxMDApXG4gIH0pXG59KVxuIl19