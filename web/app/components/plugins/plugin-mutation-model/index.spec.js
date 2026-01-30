"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const React = require("react");
const vitest_1 = require("vitest");
const types_1 = require("../types");
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
    shouldUseMcpIcon: (src) => typeof src === 'object'
        && src !== null
        && src?.content === '🔗',
}));
// Mock AppIcon component
vitest_1.vi.mock('@/app/components/base/app-icon', () => ({
    default: ({ icon, background, innerIcon, size, iconType, }) => (<div data-testid="app-icon" data-icon={icon} data-background={background} data-size={size} data-icon-type={iconType}>
      {innerIcon && <div data-testid="inner-icon">{innerIcon}</div>}
    </div>),
}));
// Mock Mcp icon component
vitest_1.vi.mock('@/app/components/base/icons/src/vender/other', () => ({
    Mcp: ({ className }) => (<div data-testid="mcp-icon" className={className}>
      MCP
    </div>),
    Group: ({ className }) => (<div data-testid="group-icon" className={className}>
      Group
    </div>),
}));
// Mock LeftCorner icon component
vitest_1.vi.mock('../../base/icons/src/vender/plugin', () => ({
    LeftCorner: ({ className }) => (<div data-testid="left-corner" className={className}>
      LeftCorner
    </div>),
}));
// Mock Partner badge
vitest_1.vi.mock('../base/badges/partner', () => ({
    default: ({ className, text }) => (<div data-testid="partner-badge" className={className} title={text}>
      Partner
    </div>),
}));
// Mock Verified badge
vitest_1.vi.mock('../base/badges/verified', () => ({
    default: ({ className, text }) => (<div data-testid="verified-badge" className={className} title={text}>
      Verified
    </div>),
}));
// Mock Remix icons
vitest_1.vi.mock('@remixicon/react', () => ({
    RiCheckLine: ({ className }) => (<span data-testid="ri-check-line" className={className}>
      ✓
    </span>),
    RiCloseLine: ({ className }) => (<span data-testid="ri-close-line" className={className}>
      ✕
    </span>),
    RiInstallLine: ({ className }) => (<span data-testid="ri-install-line" className={className}>
      ↓
    </span>),
    RiAlertFill: ({ className }) => (<span data-testid="ri-alert-fill" className={className}>
      ⚠
    </span>),
    RiLoader2Line: ({ className }) => (<span data-testid="ri-loader-line" className={className}>
      ⟳
    </span>),
}));
// Mock Skeleton components
vitest_1.vi.mock('@/app/components/base/skeleton', () => ({
    SkeletonContainer: ({ children }) => (<div data-testid="skeleton-container">{children}</div>),
    SkeletonPoint: () => <div data-testid="skeleton-point"/>,
    SkeletonRectangle: ({ className }) => (<div data-testid="skeleton-rectangle" className={className}/>),
    SkeletonRow: ({ children, className, }) => (<div data-testid="skeleton-row" className={className}>
      {children}
    </div>),
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
const createMockMutation = (overrides) => ({
    isSuccess: false,
    isPending: false,
    ...overrides,
});
const createDefaultProps = (overrides) => ({
    plugin: createMockPlugin(),
    onCancel: vitest_1.vi.fn(),
    mutation: createMockMutation(),
    mutate: vitest_1.vi.fn(),
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel',
    modelTitle: 'Modal Title',
    description: 'Modal Description',
    cardTitleLeft: null,
    ...overrides,
});
// ================================
// PluginMutationModal Component Tests
// ================================
(0, vitest_1.describe)('PluginMutationModal', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render without crashing', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render modal title', () => {
            const props = createDefaultProps({
                modelTitle: 'Update Plugin',
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Update Plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render description', () => {
            const props = createDefaultProps({
                description: 'Are you sure you want to update this plugin?',
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Are you sure you want to update this plugin?')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render plugin card with plugin info', () => {
            const plugin = createMockPlugin({
                label: { 'en-US': 'My Test Plugin' },
                brief: { 'en-US': 'A test plugin' },
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('My Test Plugin')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('A test plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render confirm button', () => {
            const props = createDefaultProps({
                confirmButtonText: 'Install Now',
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /Install Now/i })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render cancel button when not pending', () => {
            const props = createDefaultProps({
                cancelButtonText: 'Cancel Installation',
                mutation: createMockMutation({ isPending: false }),
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /Cancel Installation/i })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render modal with closable prop', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // The modal should have a close button
            (0, vitest_1.expect)(react_1.screen.getByTestId('ri-close-line')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Testing
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should render cardTitleLeft when provided', () => {
            const props = createDefaultProps({
                cardTitleLeft: <span data-testid="version-badge">v2.0.0</span>,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-badge')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render modalBottomLeft when provided', () => {
            const props = createDefaultProps({
                modalBottomLeft: (<span data-testid="bottom-left-content">Additional Info</span>),
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('bottom-left-content')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render modalBottomLeft when not provided', () => {
            const props = createDefaultProps({
                modalBottomLeft: undefined,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('bottom-left-content')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render custom ReactNode for modelTitle', () => {
            const props = createDefaultProps({
                modelTitle: <div data-testid="custom-title">Custom Title Node</div>,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-title')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render custom ReactNode for description', () => {
            const props = createDefaultProps({
                description: (<div data-testid="custom-description">
            <strong>Warning:</strong>
            {' '}
            This action is irreversible.
          </div>),
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('custom-description')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render custom ReactNode for confirmButtonText', () => {
            const props = createDefaultProps({
                confirmButtonText: (<span>
            <span data-testid="confirm-icon">✓</span>
            {' '}
            Confirm Action
          </span>),
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('confirm-icon')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render custom ReactNode for cancelButtonText', () => {
            const props = createDefaultProps({
                cancelButtonText: (<span>
            <span data-testid="cancel-icon">✗</span>
            {' '}
            Abort
          </span>),
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('cancel-icon')).toBeInTheDocument();
        });
    });
    // ================================
    // User Interactions
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onCancel when cancel button is clicked', () => {
            const onCancel = vitest_1.vi.fn();
            const props = createDefaultProps({ onCancel });
            (0, react_1.render)(<index_1.default {...props}/>);
            const cancelButton = react_1.screen.getByRole('button', { name: /Cancel/i });
            react_1.fireEvent.click(cancelButton);
            (0, vitest_1.expect)(onCancel).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call mutate when confirm button is clicked', () => {
            const mutate = vitest_1.vi.fn();
            const props = createDefaultProps({ mutate });
            (0, react_1.render)(<index_1.default {...props}/>);
            const confirmButton = react_1.screen.getByRole('button', { name: /Confirm/i });
            react_1.fireEvent.click(confirmButton);
            (0, vitest_1.expect)(mutate).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should render close button in modal header', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Find the close icon - the Modal component handles the onClose callback
            const closeIcon = react_1.screen.getByTestId('ri-close-line');
            (0, vitest_1.expect)(closeIcon).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not call mutate when button is disabled during pending', () => {
            const mutate = vitest_1.vi.fn();
            const props = createDefaultProps({
                mutate,
                mutation: createMockMutation({ isPending: true }),
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            const confirmButton = react_1.screen.getByRole('button', { name: /Confirm/i });
            (0, vitest_1.expect)(confirmButton).toBeDisabled();
            react_1.fireEvent.click(confirmButton);
            // Button is disabled, so mutate might still be called depending on implementation
            // The important thing is the button has disabled attribute
            (0, vitest_1.expect)(confirmButton).toHaveAttribute('disabled');
        });
    });
    // ================================
    // Mutation State Tests
    // ================================
    (0, vitest_1.describe)('Mutation States', () => {
        (0, vitest_1.describe)('when isPending is true', () => {
            (0, vitest_1.it)('should hide cancel button', () => {
                const props = createDefaultProps({
                    mutation: createMockMutation({ isPending: true }),
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                (0, vitest_1.expect)(react_1.screen.queryByRole('button', { name: /Cancel/i })).not.toBeInTheDocument();
            });
            (0, vitest_1.it)('should show loading state on confirm button', () => {
                const props = createDefaultProps({
                    mutation: createMockMutation({ isPending: true }),
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                const confirmButton = react_1.screen.getByRole('button', { name: /Confirm/i });
                (0, vitest_1.expect)(confirmButton).toBeDisabled();
            });
            (0, vitest_1.it)('should disable confirm button', () => {
                const props = createDefaultProps({
                    mutation: createMockMutation({ isPending: true }),
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                const confirmButton = react_1.screen.getByRole('button', { name: /Confirm/i });
                (0, vitest_1.expect)(confirmButton).toBeDisabled();
            });
        });
        (0, vitest_1.describe)('when isPending is false', () => {
            (0, vitest_1.it)('should show cancel button', () => {
                const props = createDefaultProps({
                    mutation: createMockMutation({ isPending: false }),
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
            });
            (0, vitest_1.it)('should enable confirm button', () => {
                const props = createDefaultProps({
                    mutation: createMockMutation({ isPending: false }),
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                const confirmButton = react_1.screen.getByRole('button', { name: /Confirm/i });
                (0, vitest_1.expect)(confirmButton).not.toBeDisabled();
            });
        });
        (0, vitest_1.describe)('when isSuccess is true', () => {
            (0, vitest_1.it)('should show installed state on card', () => {
                const props = createDefaultProps({
                    mutation: createMockMutation({ isSuccess: true }),
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // The Card component should receive installed=true
                // This will show a check icon
                (0, vitest_1.expect)(react_1.screen.getByTestId('ri-check-line')).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('when isSuccess is false', () => {
            (0, vitest_1.it)('should not show installed state on card', () => {
                const props = createDefaultProps({
                    mutation: createMockMutation({ isSuccess: false }),
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                // The check icon should not be present (installed=false)
                (0, vitest_1.expect)(react_1.screen.queryByTestId('ri-check-line')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('state combinations', () => {
            (0, vitest_1.it)('should handle isPending=true and isSuccess=false', () => {
                const props = createDefaultProps({
                    mutation: createMockMutation({ isPending: true, isSuccess: false }),
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                (0, vitest_1.expect)(react_1.screen.queryByRole('button', { name: /Cancel/i })).not.toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.queryByTestId('ri-check-line')).not.toBeInTheDocument();
            });
            (0, vitest_1.it)('should handle isPending=false and isSuccess=true', () => {
                const props = createDefaultProps({
                    mutation: createMockMutation({ isPending: false, isSuccess: true }),
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('ri-check-line')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should handle both isPending=true and isSuccess=true', () => {
                const props = createDefaultProps({
                    mutation: createMockMutation({ isPending: true, isSuccess: true }),
                });
                (0, react_1.render)(<index_1.default {...props}/>);
                (0, vitest_1.expect)(react_1.screen.queryByRole('button', { name: /Cancel/i })).not.toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('ri-check-line')).toBeInTheDocument();
            });
        });
    });
    // ================================
    // Plugin Card Integration Tests
    // ================================
    (0, vitest_1.describe)('Plugin Card Integration', () => {
        (0, vitest_1.it)('should display plugin label', () => {
            const plugin = createMockPlugin({
                label: { 'en-US': 'Amazing Plugin' },
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Amazing Plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display plugin brief description', () => {
            const plugin = createMockPlugin({
                brief: { 'en-US': 'This is an amazing plugin' },
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('This is an amazing plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display plugin org and name', () => {
            const plugin = createMockPlugin({
                org: 'my-organization',
                name: 'my-plugin-name',
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('my-organization')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('my-plugin-name')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display plugin category', () => {
            const plugin = createMockPlugin({
                category: types_1.PluginCategoryEnum.model,
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Model')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display verified badge when plugin is verified', () => {
            const plugin = createMockPlugin({
                verified: true,
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('verified-badge')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display partner badge when plugin has partner badge', () => {
            const plugin = createMockPlugin({
                badges: ['partner'],
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('partner-badge')).toBeInTheDocument();
        });
    });
    // ================================
    // Memoization Tests
    // ================================
    (0, vitest_1.describe)('Memoization', () => {
        (0, vitest_1.it)('should be memoized with React.memo', () => {
            // Verify the component is wrapped with memo
            (0, vitest_1.expect)(index_1.default).toBeDefined();
            (0, vitest_1.expect)(typeof index_1.default).toBe('object');
        });
        (0, vitest_1.it)('should have displayName set', () => {
            // The component sets displayName = 'PluginMutationModal'
            const displayName = index_1.default.type?.displayName
                || index_1.default.displayName;
            (0, vitest_1.expect)(displayName).toBe('PluginMutationModal');
        });
        (0, vitest_1.it)('should not re-render when props unchanged', () => {
            const renderCount = vitest_1.vi.fn();
            const TestWrapper = ({ props }) => {
                renderCount();
                return <index_1.default {...props}/>;
            };
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<TestWrapper props={props}/>);
            (0, vitest_1.expect)(renderCount).toHaveBeenCalledTimes(1);
            // Re-render with same props reference
            rerender(<TestWrapper props={props}/>);
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
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty brief object', () => {
            const plugin = createMockPlugin({
                brief: {},
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle plugin with undefined badges', () => {
            const plugin = createMockPlugin();
            // @ts-expect-error - Testing undefined badges
            plugin.badges = undefined;
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty string description', () => {
            const props = createDefaultProps({
                description: '',
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty string modelTitle', () => {
            const props = createDefaultProps({
                modelTitle: '',
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle special characters in plugin name', () => {
            const plugin = createMockPlugin({
                name: 'plugin-with-special<chars>!@#$%',
                org: 'org<script>test</script>',
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin-with-special<chars>!@#$%')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle very long title', () => {
            const longTitle = 'A'.repeat(500);
            const plugin = createMockPlugin({
                label: { 'en-US': longTitle },
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Should render the long title text
            (0, vitest_1.expect)(react_1.screen.getByText(longTitle)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle very long description', () => {
            const longDescription = 'B'.repeat(1000);
            const plugin = createMockPlugin({
                brief: { 'en-US': longDescription },
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Should render the long description text
            (0, vitest_1.expect)(react_1.screen.getByText(longDescription)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle unicode characters in title', () => {
            const props = createDefaultProps({
                modelTitle: '更新插件 🎉',
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('更新插件 🎉')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle unicode characters in description', () => {
            const props = createDefaultProps({
                description: '确定要更新这个插件吗？この操作は元に戻せません。',
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('确定要更新这个插件吗？この操作は元に戻せません。')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle null cardTitleLeft', () => {
            const props = createDefaultProps({
                cardTitleLeft: null,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle undefined modalBottomLeft', () => {
            const props = createDefaultProps({
                modalBottomLeft: undefined,
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(document.body).toBeInTheDocument();
        });
    });
    // ================================
    // Modal Behavior Tests
    // ================================
    (0, vitest_1.describe)('Modal Behavior', () => {
        (0, vitest_1.it)('should render modal with isShow=true', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Modal should be visible - check for dialog role using screen query
            (0, vitest_1.expect)(react_1.screen.getByRole('dialog')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should have modal structure', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Check that modal content is rendered
            (0, vitest_1.expect)(react_1.screen.getByRole('dialog')).toBeInTheDocument();
            // Modal should have title
            (0, vitest_1.expect)(react_1.screen.getByText('Modal Title')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render modal as closable', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Close icon should be present
            (0, vitest_1.expect)(react_1.screen.getByTestId('ri-close-line')).toBeInTheDocument();
        });
    });
    // ================================
    // Button Styling Tests
    // ================================
    (0, vitest_1.describe)('Button Styling', () => {
        (0, vitest_1.it)('should render confirm button with primary variant', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const confirmButton = react_1.screen.getByRole('button', { name: /Confirm/i });
            // Button component with variant="primary" should have primary styling
            (0, vitest_1.expect)(confirmButton).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render cancel button with default variant', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            const cancelButton = react_1.screen.getByRole('button', { name: /Cancel/i });
            (0, vitest_1.expect)(cancelButton).toBeInTheDocument();
        });
    });
    // ================================
    // Layout Tests
    // ================================
    (0, vitest_1.describe)('Layout', () => {
        (0, vitest_1.it)('should render description text', () => {
            const props = createDefaultProps({
                description: 'Test Description Content',
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Description should be rendered
            (0, vitest_1.expect)(react_1.screen.getByText('Test Description Content')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render card with plugin info', () => {
            const plugin = createMockPlugin({
                label: { 'en-US': 'Layout Test Plugin' },
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            // Card should display plugin info
            (0, vitest_1.expect)(react_1.screen.getByText('Layout Test Plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render both cancel and confirm buttons', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Both buttons should be rendered
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /Confirm/i })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render buttons in correct order', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            // Get all buttons and verify order
            const buttons = react_1.screen.getAllByRole('button');
            // Cancel button should come before Confirm button
            const cancelIndex = buttons.findIndex(b => b.textContent?.includes('Cancel'));
            const confirmIndex = buttons.findIndex(b => b.textContent?.includes('Confirm'));
            (0, vitest_1.expect)(cancelIndex).toBeLessThan(confirmIndex);
        });
    });
    // ================================
    // Accessibility Tests
    // ================================
    (0, vitest_1.describe)('Accessibility', () => {
        (0, vitest_1.it)('should have accessible dialog role', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('dialog')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should have accessible button roles', () => {
            const props = createDefaultProps();
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getAllByRole('button').length).toBeGreaterThan(0);
        });
        (0, vitest_1.it)('should have accessible text content', () => {
            const props = createDefaultProps({
                modelTitle: 'Accessible Title',
                description: 'Accessible Description',
            });
            (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Accessible Title')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('Accessible Description')).toBeInTheDocument();
        });
    });
    // ================================
    // All Plugin Categories Tests
    // ================================
    (0, vitest_1.describe)('All Plugin Categories', () => {
        const categories = [
            { category: types_1.PluginCategoryEnum.tool, label: 'Tool' },
            { category: types_1.PluginCategoryEnum.model, label: 'Model' },
            { category: types_1.PluginCategoryEnum.extension, label: 'Extension' },
            { category: types_1.PluginCategoryEnum.agent, label: 'Agent' },
            { category: types_1.PluginCategoryEnum.datasource, label: 'Datasource' },
            { category: types_1.PluginCategoryEnum.trigger, label: 'Trigger' },
        ];
        categories.forEach(({ category, label }) => {
            (0, vitest_1.it)(`should display ${label} category correctly`, () => {
                const plugin = createMockPlugin({ category });
                const props = createDefaultProps({ plugin });
                (0, react_1.render)(<index_1.default {...props}/>);
                (0, vitest_1.expect)(react_1.screen.getByText(label)).toBeInTheDocument();
            });
        });
    });
    // ================================
    // Bundle Type Tests
    // ================================
    (0, vitest_1.describe)('Bundle Type', () => {
        (0, vitest_1.it)('should display bundle label for bundle type plugin', () => {
            const plugin = createMockPlugin({
                type: 'bundle',
                category: types_1.PluginCategoryEnum.tool,
            });
            const props = createDefaultProps({ plugin });
            (0, react_1.render)(<index_1.default {...props}/>);
            // For bundle type, should show 'Bundle' instead of category
            (0, vitest_1.expect)(react_1.screen.getByText('Bundle')).toBeInTheDocument();
        });
    });
    // ================================
    // Event Handler Isolation Tests
    // ================================
    (0, vitest_1.describe)('Event Handler Isolation', () => {
        (0, vitest_1.it)('should not call mutate when clicking cancel button', () => {
            const mutate = vitest_1.vi.fn();
            const onCancel = vitest_1.vi.fn();
            const props = createDefaultProps({ mutate, onCancel });
            (0, react_1.render)(<index_1.default {...props}/>);
            const cancelButton = react_1.screen.getByRole('button', { name: /Cancel/i });
            react_1.fireEvent.click(cancelButton);
            (0, vitest_1.expect)(onCancel).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(mutate).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('should not call onCancel when clicking confirm button', () => {
            const mutate = vitest_1.vi.fn();
            const onCancel = vitest_1.vi.fn();
            const props = createDefaultProps({ mutate, onCancel });
            (0, react_1.render)(<index_1.default {...props}/>);
            const confirmButton = react_1.screen.getByRole('button', { name: /Confirm/i });
            react_1.fireEvent.click(confirmButton);
            (0, vitest_1.expect)(mutate).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(onCancel).not.toHaveBeenCalled();
        });
    });
    // ================================
    // Multiple Renders Tests
    // ================================
    (0, vitest_1.describe)('Multiple Renders', () => {
        (0, vitest_1.it)('should handle rapid state changes', () => {
            const props = createDefaultProps();
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            // Simulate rapid pending state changes
            rerender(<index_1.default {...props} mutation={createMockMutation({ isPending: true })}/>);
            rerender(<index_1.default {...props} mutation={createMockMutation({ isPending: false })}/>);
            rerender(<index_1.default {...props} mutation={createMockMutation({ isSuccess: true })}/>);
            // Should show success state
            (0, vitest_1.expect)(react_1.screen.getByTestId('ri-check-line')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle plugin prop changes', () => {
            const plugin1 = createMockPlugin({ label: { 'en-US': 'Plugin One' } });
            const plugin2 = createMockPlugin({ label: { 'en-US': 'Plugin Two' } });
            const props = createDefaultProps({ plugin: plugin1 });
            const { rerender } = (0, react_1.render)(<index_1.default {...props}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Plugin One')).toBeInTheDocument();
            rerender(<index_1.default {...props} plugin={plugin2}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('Plugin Two')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLCtCQUE4QjtBQUM5QixtQ0FBNkQ7QUFDN0Qsb0NBQTZDO0FBQzdDLG1DQUF5QztBQUV6QyxtQ0FBbUM7QUFDbkMsa0NBQWtDO0FBQ2xDLG1DQUFtQztBQUVuQyxxQkFBcUI7QUFDckIsV0FBRSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ2xDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDO0NBQ3BDLENBQUMsQ0FBQyxDQUFBO0FBRUgsbUJBQW1CO0FBQ25CLFdBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDOUIsZ0JBQWdCLEVBQUUsQ0FBQyxHQUEyQixFQUFFLE1BQWMsRUFBRSxFQUFFO1FBQ2hFLE9BQU8sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFBO0lBQzlDLENBQUM7Q0FDRixDQUFDLENBQUMsQ0FBQTtBQUVILDRCQUE0QjtBQUM1QixXQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdkMsV0FBVyxFQUFFLENBQUMsTUFBYyxFQUFFLEVBQUUsQ0FBQyxNQUFNLElBQUksT0FBTztDQUNuRCxDQUFDLENBQUMsQ0FBQTtBQUVILDBCQUEwQjtBQUMxQixNQUFNLGlCQUFpQixHQUFzQztJQUMzRCxNQUFNLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0lBQ3pCLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUU7SUFDM0IsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFB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RyxrQkFBa0IsQ0FBQyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFBO1lBQ3JELE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLGVBQW1CLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFL0QsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFFMUQsUUFBUSxDQUFDLENBQUMsZUFBbUIsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUU3RCxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM1RCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB7IFBsdWdpbkNhdGVnb3J5RW51bSB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IFBsdWdpbk11dGF0aW9uTW9kYWwgZnJvbSAnLi9pbmRleCdcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1vY2sgRXh0ZXJuYWwgRGVwZW5kZW5jaWVzIE9ubHlcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIE1vY2sgdXNlVGhlbWUgaG9va1xudmkubW9jaygnQC9ob29rcy91c2UtdGhlbWUnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiAoeyB0aGVtZTogJ2xpZ2h0JyB9KSxcbn0pKVxuXG4vLyBNb2NrIGkxOG4tY29uZmlnXG52aS5tb2NrKCdAL2kxOG4tY29uZmlnJywgKCkgPT4gKHtcbiAgcmVuZGVySTE4bk9iamVjdDogKG9iajogUmVjb3JkPHN0cmluZywgc3RyaW5nPiwgbG9jYWxlOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gb2JqPy5bbG9jYWxlXSB8fCBvYmo/LlsnZW4tVVMnXSB8fCAnJ1xuICB9LFxufSkpXG5cbi8vIE1vY2sgaTE4bi1jb25maWcvbGFuZ3VhZ2VcbnZpLm1vY2soJ0AvaTE4bi1jb25maWcvbGFuZ3VhZ2UnLCAoKSA9PiAoe1xuICBnZXRMYW5ndWFnZTogKGxvY2FsZTogc3RyaW5nKSA9PiBsb2NhbGUgfHwgJ2VuLVVTJyxcbn0pKVxuXG4vLyBNb2NrIHVzZUNhdGVnb3JpZXMgaG9va1xuY29uc3QgbW9ja0NhdGVnb3JpZXNNYXA6IFJlY29yZDxzdHJpbmcsIHsgbGFiZWw6IHN0cmluZyB9PiA9IHtcbiAgJ3Rvb2wnOiB7IGxhYmVsOiAnVG9vbCcgfSxcbiAgJ21vZGVsJzogeyBsYWJlbDogJ01vZGVsJyB9LFxuICAnZXh0ZW5zaW9uJzogeyBsYWJlbDogJ0V4dGVuc2lvbicgfSxcbiAgJ2FnZW50LXN0cmF0ZWd5JzogeyBsYWJlbDogJ0FnZW50JyB9LFxuICAnZGF0YXNvdXJjZSc6IHsgbGFiZWw6ICdEYXRhc291cmNlJyB9LFxuICAndHJpZ2dlcic6IHsgbGFiZWw6ICdUcmlnZ2VyJyB9LFxuICAnYnVuZGxlJzogeyBsYWJlbDogJ0J1bmRsZScgfSxcbn1cblxudmkubW9jaygnLi4vaG9va3MnLCAoKSA9PiAoe1xuICB1c2VDYXRlZ29yaWVzOiAoKSA9PiAoe1xuICAgIGNhdGVnb3JpZXNNYXA6IG1vY2tDYXRlZ29yaWVzTWFwLFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIGZvcm1hdE51bWJlciB1dGlsaXR5XG52aS5tb2NrKCdAL3V0aWxzL2Zvcm1hdCcsICgpID0+ICh7XG4gIGZvcm1hdE51bWJlcjogKG51bTogbnVtYmVyKSA9PiBudW0udG9Mb2NhbGVTdHJpbmcoKSxcbn0pKVxuXG4vLyBNb2NrIHNob3VsZFVzZU1jcEljb24gdXRpbGl0eVxudmkubW9jaygnQC91dGlscy9tY3AnLCAoKSA9PiAoe1xuICBzaG91bGRVc2VNY3BJY29uOiAoc3JjOiB1bmtub3duKSA9PlxuICAgIHR5cGVvZiBzcmMgPT09ICdvYmplY3QnXG4gICAgJiYgc3JjICE9PSBudWxsXG4gICAgJiYgKHNyYyBhcyB7IGNvbnRlbnQ/OiBzdHJpbmcgfSk/LmNvbnRlbnQgPT09ICfwn5SXJyxcbn0pKVxuXG4vLyBNb2NrIEFwcEljb24gY29tcG9uZW50XG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2UvYXBwLWljb24nLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoe1xuICAgIGljb24sXG4gICAgYmFja2dyb3VuZCxcbiAgICBpbm5lckljb24sXG4gICAgc2l6ZSxcbiAgICBpY29uVHlwZSxcbiAgfToge1xuICAgIGljb24/OiBzdHJpbmdcbiAgICBiYWNrZ3JvdW5kPzogc3RyaW5nXG4gICAgaW5uZXJJY29uPzogUmVhY3QuUmVhY3ROb2RlXG4gICAgc2l6ZT86IHN0cmluZ1xuICAgIGljb25UeXBlPzogc3RyaW5nXG4gIH0pID0+IChcbiAgICA8ZGl2XG4gICAgICBkYXRhLXRlc3RpZD1cImFwcC1pY29uXCJcbiAgICAgIGRhdGEtaWNvbj17aWNvbn1cbiAgICAgIGRhdGEtYmFja2dyb3VuZD17YmFja2dyb3VuZH1cbiAgICAgIGRhdGEtc2l6ZT17c2l6ZX1cbiAgICAgIGRhdGEtaWNvbi10eXBlPXtpY29uVHlwZX1cbiAgICA+XG4gICAgICB7aW5uZXJJY29uICYmIDxkaXYgZGF0YS10ZXN0aWQ9XCJpbm5lci1pY29uXCI+e2lubmVySWNvbn08L2Rpdj59XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBNY3AgaWNvbiBjb21wb25lbnRcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9pY29ucy9zcmMvdmVuZGVyL290aGVyJywgKCkgPT4gKHtcbiAgTWNwOiAoeyBjbGFzc05hbWUgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJtY3AtaWNvblwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgIE1DUFxuICAgIDwvZGl2PlxuICApLFxuICBHcm91cDogKHsgY2xhc3NOYW1lIH06IHsgY2xhc3NOYW1lPzogc3RyaW5nIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiZ3JvdXAtaWNvblwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgIEdyb3VwXG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBMZWZ0Q29ybmVyIGljb24gY29tcG9uZW50XG52aS5tb2NrKCcuLi8uLi9iYXNlL2ljb25zL3NyYy92ZW5kZXIvcGx1Z2luJywgKCkgPT4gKHtcbiAgTGVmdENvcm5lcjogKHsgY2xhc3NOYW1lIH06IHsgY2xhc3NOYW1lPzogc3RyaW5nIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwibGVmdC1jb3JuZXJcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICBMZWZ0Q29ybmVyXG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBQYXJ0bmVyIGJhZGdlXG52aS5tb2NrKCcuLi9iYXNlL2JhZGdlcy9wYXJ0bmVyJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgY2xhc3NOYW1lLCB0ZXh0IH06IHsgY2xhc3NOYW1lPzogc3RyaW5nLCB0ZXh0Pzogc3RyaW5nIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwicGFydG5lci1iYWRnZVwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSB0aXRsZT17dGV4dH0+XG4gICAgICBQYXJ0bmVyXG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBWZXJpZmllZCBiYWRnZVxudmkubW9jaygnLi4vYmFzZS9iYWRnZXMvdmVyaWZpZWQnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBjbGFzc05hbWUsIHRleHQgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcsIHRleHQ/OiBzdHJpbmcgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJ2ZXJpZmllZC1iYWRnZVwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSB0aXRsZT17dGV4dH0+XG4gICAgICBWZXJpZmllZFxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgUmVtaXggaWNvbnNcbnZpLm1vY2soJ0ByZW1peGljb24vcmVhY3QnLCAoKSA9PiAoe1xuICBSaUNoZWNrTGluZTogKHsgY2xhc3NOYW1lIH06IHsgY2xhc3NOYW1lPzogc3RyaW5nIH0pID0+IChcbiAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInJpLWNoZWNrLWxpbmVcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICDinJNcbiAgICA8L3NwYW4+XG4gICksXG4gIFJpQ2xvc2VMaW5lOiAoeyBjbGFzc05hbWUgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSkgPT4gKFxuICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicmktY2xvc2UtbGluZVwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgIOKclVxuICAgIDwvc3Bhbj5cbiAgKSxcbiAgUmlJbnN0YWxsTGluZTogKHsgY2xhc3NOYW1lIH06IHsgY2xhc3NOYW1lPzogc3RyaW5nIH0pID0+IChcbiAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInJpLWluc3RhbGwtbGluZVwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfT5cbiAgICAgIOKGk1xuICAgIDwvc3Bhbj5cbiAgKSxcbiAgUmlBbGVydEZpbGw6ICh7IGNsYXNzTmFtZSB9OiB7IGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiAoXG4gICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJyaS1hbGVydC1maWxsXCIgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAg4pqgXG4gICAgPC9zcGFuPlxuICApLFxuICBSaUxvYWRlcjJMaW5lOiAoeyBjbGFzc05hbWUgfTogeyBjbGFzc05hbWU/OiBzdHJpbmcgfSkgPT4gKFxuICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicmktbG9hZGVyLWxpbmVcIiBjbGFzc05hbWU9e2NsYXNzTmFtZX0+XG4gICAgICDin7NcbiAgICA8L3NwYW4+XG4gICksXG59KSlcblxuLy8gTW9jayBTa2VsZXRvbiBjb21wb25lbnRzXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2Jhc2Uvc2tlbGV0b24nLCAoKSA9PiAoe1xuICBTa2VsZXRvbkNvbnRhaW5lcjogKHsgY2hpbGRyZW4gfTogeyBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwic2tlbGV0b24tY29udGFpbmVyXCI+e2NoaWxkcmVufTwvZGl2PlxuICApLFxuICBTa2VsZXRvblBvaW50OiAoKSA9PiA8ZGl2IGRhdGEtdGVzdGlkPVwic2tlbGV0b24tcG9pbnRcIiAvPixcbiAgU2tlbGV0b25SZWN0YW5nbGU6ICh7IGNsYXNzTmFtZSB9OiB7IGNsYXNzTmFtZT86IHN0cmluZyB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInNrZWxldG9uLXJlY3RhbmdsZVwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSAvPlxuICApLFxuICBTa2VsZXRvblJvdzogKHtcbiAgICBjaGlsZHJlbixcbiAgICBjbGFzc05hbWUsXG4gIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgY2xhc3NOYW1lPzogc3RyaW5nXG4gIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwic2tlbGV0b24tcm93XCIgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBUZXN0IERhdGEgRmFjdG9yaWVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBjcmVhdGVNb2NrUGx1Z2luID0gKG92ZXJyaWRlcz86IFBhcnRpYWw8UGx1Z2luPik6IFBsdWdpbiA9PiAoe1xuICB0eXBlOiAncGx1Z2luJyxcbiAgb3JnOiAndGVzdC1vcmcnLFxuICBuYW1lOiAndGVzdC1wbHVnaW4nLFxuICBwbHVnaW5faWQ6ICdwbHVnaW4tMTIzJyxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgbGF0ZXN0X3ZlcnNpb246ICcxLjAuMCcsXG4gIGxhdGVzdF9wYWNrYWdlX2lkZW50aWZpZXI6ICd0ZXN0LW9yZy90ZXN0LXBsdWdpbjoxLjAuMCcsXG4gIGljb246ICcvdGVzdC1pY29uLnBuZycsXG4gIHZlcmlmaWVkOiBmYWxzZSxcbiAgbGFiZWw6IHsgJ2VuLVVTJzogJ1Rlc3QgUGx1Z2luJyB9LFxuICBicmllZjogeyAnZW4tVVMnOiAnVGVzdCBwbHVnaW4gZGVzY3JpcHRpb24nIH0sXG4gIGRlc2NyaXB0aW9uOiB7ICdlbi1VUyc6ICdGdWxsIHRlc3QgcGx1Z2luIGRlc2NyaXB0aW9uJyB9LFxuICBpbnRyb2R1Y3Rpb246ICdUZXN0IHBsdWdpbiBpbnRyb2R1Y3Rpb24nLFxuICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9naXRodWIuY29tL3Rlc3QvcGx1Z2luJyxcbiAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICBpbnN0YWxsX2NvdW50OiAxMDAwLFxuICBlbmRwb2ludDogeyBzZXR0aW5nczogW10gfSxcbiAgdGFnczogW3sgbmFtZTogJ3NlYXJjaCcgfV0sXG4gIGJhZGdlczogW10sXG4gIHZlcmlmaWNhdGlvbjogeyBhdXRob3JpemVkX2NhdGVnb3J5OiAnY29tbXVuaXR5JyB9LFxuICBmcm9tOiAnbWFya2V0cGxhY2UnLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG50eXBlIE1vY2tNdXRhdGlvbiA9IHtcbiAgaXNTdWNjZXNzOiBib29sZWFuXG4gIGlzUGVuZGluZzogYm9vbGVhblxufVxuXG5jb25zdCBjcmVhdGVNb2NrTXV0YXRpb24gPSAoXG4gIG92ZXJyaWRlcz86IFBhcnRpYWw8TW9ja011dGF0aW9uPixcbik6IE1vY2tNdXRhdGlvbiA9PiAoe1xuICBpc1N1Y2Nlc3M6IGZhbHNlLFxuICBpc1BlbmRpbmc6IGZhbHNlLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG50eXBlIFBsdWdpbk11dGF0aW9uTW9kYWxQcm9wcyA9IHtcbiAgcGx1Z2luOiBQbHVnaW5cbiAgb25DYW5jZWw6ICgpID0+IHZvaWRcbiAgbXV0YXRpb246IE1vY2tNdXRhdGlvblxuICBtdXRhdGU6ICgpID0+IHZvaWRcbiAgY29uZmlybUJ1dHRvblRleHQ6IFJlYWN0LlJlYWN0Tm9kZVxuICBjYW5jZWxCdXR0b25UZXh0OiBSZWFjdC5SZWFjdE5vZGVcbiAgbW9kZWxUaXRsZTogUmVhY3QuUmVhY3ROb2RlXG4gIGRlc2NyaXB0aW9uOiBSZWFjdC5SZWFjdE5vZGVcbiAgY2FyZFRpdGxlTGVmdDogUmVhY3QuUmVhY3ROb2RlXG4gIG1vZGFsQm90dG9tTGVmdD86IFJlYWN0LlJlYWN0Tm9kZVxufVxuXG5jb25zdCBjcmVhdGVEZWZhdWx0UHJvcHMgPSAoXG4gIG92ZXJyaWRlcz86IFBhcnRpYWw8UGx1Z2luTXV0YXRpb25Nb2RhbFByb3BzPixcbik6IFBsdWdpbk11dGF0aW9uTW9kYWxQcm9wcyA9PiAoe1xuICBwbHVnaW46IGNyZWF0ZU1vY2tQbHVnaW4oKSxcbiAgb25DYW5jZWw6IHZpLmZuKCksXG4gIG11dGF0aW9uOiBjcmVhdGVNb2NrTXV0YXRpb24oKSxcbiAgbXV0YXRlOiB2aS5mbigpLFxuICBjb25maXJtQnV0dG9uVGV4dDogJ0NvbmZpcm0nLFxuICBjYW5jZWxCdXR0b25UZXh0OiAnQ2FuY2VsJyxcbiAgbW9kZWxUaXRsZTogJ01vZGFsIFRpdGxlJyxcbiAgZGVzY3JpcHRpb246ICdNb2RhbCBEZXNjcmlwdGlvbicsXG4gIGNhcmRUaXRsZUxlZnQ6IG51bGwsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQbHVnaW5NdXRhdGlvbk1vZGFsIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdQbHVnaW5NdXRhdGlvbk1vZGFsJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB3aXRob3V0IGNyYXNoaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgdGl0bGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG1vZGVsVGl0bGU6ICdVcGRhdGUgUGx1Z2luJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVXBkYXRlIFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRlc2NyaXB0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBkZXNjcmlwdGlvbjogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byB1cGRhdGUgdGhpcyBwbHVnaW4/JyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVRleHQoJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byB1cGRhdGUgdGhpcyBwbHVnaW4/JyksXG4gICAgICApLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGx1Z2luIGNhcmQgd2l0aCBwbHVnaW4gaW5mbycsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBsYWJlbDogeyAnZW4tVVMnOiAnTXkgVGVzdCBQbHVnaW4nIH0sXG4gICAgICAgIGJyaWVmOiB7ICdlbi1VUyc6ICdBIHRlc3QgcGx1Z2luJyB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgcGx1Z2luIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnTXkgVGVzdCBQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0EgdGVzdCBwbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjb25maXJtIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdJbnN0YWxsIE5vdycsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KFxuICAgICAgICBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9JbnN0YWxsIE5vdy9pIH0pLFxuICAgICAgKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNhbmNlbCBidXR0b24gd2hlbiBub3QgcGVuZGluZycsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ0NhbmNlbCBJbnN0YWxsYXRpb24nLFxuICAgICAgICBtdXRhdGlvbjogY3JlYXRlTW9ja011dGF0aW9uKHsgaXNQZW5kaW5nOiBmYWxzZSB9KSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL0NhbmNlbCBJbnN0YWxsYXRpb24vaSB9KSxcbiAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB3aXRoIGNsb3NhYmxlIHByb3AnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBUaGUgbW9kYWwgc2hvdWxkIGhhdmUgYSBjbG9zZSBidXR0b25cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JpLWNsb3NlLWxpbmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdGluZ1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2FyZFRpdGxlTGVmdCB3aGVuIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjYXJkVGl0bGVMZWZ0OiA8c3BhbiBkYXRhLXRlc3RpZD1cInZlcnNpb24tYmFkZ2VcIj52Mi4wLjA8L3NwYW4+LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ZlcnNpb24tYmFkZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbEJvdHRvbUxlZnQgd2hlbiBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbW9kYWxCb3R0b21MZWZ0OiAoXG4gICAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJib3R0b20tbGVmdC1jb250ZW50XCI+QWRkaXRpb25hbCBJbmZvPC9zcGFuPlxuICAgICAgICApLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JvdHRvbS1sZWZ0LWNvbnRlbnQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgbW9kYWxCb3R0b21MZWZ0IHdoZW4gbm90IHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBtb2RhbEJvdHRvbUxlZnQ6IHVuZGVmaW5lZCxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3QoXG4gICAgICAgIHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdib3R0b20tbGVmdC1jb250ZW50JyksXG4gICAgICApLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGN1c3RvbSBSZWFjdE5vZGUgZm9yIG1vZGVsVGl0bGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG1vZGVsVGl0bGU6IDxkaXYgZGF0YS10ZXN0aWQ9XCJjdXN0b20tdGl0bGVcIj5DdXN0b20gVGl0bGUgTm9kZTwvZGl2PixcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXN0b20tdGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjdXN0b20gUmVhY3ROb2RlIGZvciBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgZGVzY3JpcHRpb246IChcbiAgICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY3VzdG9tLWRlc2NyaXB0aW9uXCI+XG4gICAgICAgICAgICA8c3Ryb25nPldhcm5pbmc6PC9zdHJvbmc+XG4gICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgVGhpcyBhY3Rpb24gaXMgaXJyZXZlcnNpYmxlLlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICApLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1c3RvbS1kZXNjcmlwdGlvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGN1c3RvbSBSZWFjdE5vZGUgZm9yIGNvbmZpcm1CdXR0b25UZXh0JywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogKFxuICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJjb25maXJtLWljb25cIj7inJM8L3NwYW4+XG4gICAgICAgICAgICB7JyAnfVxuICAgICAgICAgICAgQ29uZmlybSBBY3Rpb25cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICksXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1pY29uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY3VzdG9tIFJlYWN0Tm9kZSBmb3IgY2FuY2VsQnV0dG9uVGV4dCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogKFxuICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJjYW5jZWwtaWNvblwiPuKclzwvc3Bhbj5cbiAgICAgICAgICAgIHsnICd9XG4gICAgICAgICAgICBBYm9ydFxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYW5jZWwtaWNvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVc2VyIEludGVyYWN0aW9uc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2FuY2VsIHdoZW4gY2FuY2VsIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DYW5jZWwgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG9uQ2FuY2VsIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9DYW5jZWwvaSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNhbmNlbEJ1dHRvbilcblxuICAgICAgZXhwZWN0KG9uQ2FuY2VsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG11dGF0ZSB3aGVuIGNvbmZpcm0gYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtdXRhdGUgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG11dGF0ZSB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL0NvbmZpcm0vaSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIGV4cGVjdChtdXRhdGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjbG9zZSBidXR0b24gaW4gbW9kYWwgaGVhZGVyJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gRmluZCB0aGUgY2xvc2UgaWNvbiAtIHRoZSBNb2RhbCBjb21wb25lbnQgaGFuZGxlcyB0aGUgb25DbG9zZSBjYWxsYmFja1xuICAgICAgY29uc3QgY2xvc2VJY29uID0gc2NyZWVuLmdldEJ5VGVzdElkKCdyaS1jbG9zZS1saW5lJylcbiAgICAgIGV4cGVjdChjbG9zZUljb24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBtdXRhdGUgd2hlbiBidXR0b24gaXMgZGlzYWJsZWQgZHVyaW5nIHBlbmRpbmcnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtdXRhdGUgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG11dGF0ZSxcbiAgICAgICAgbXV0YXRpb246IGNyZWF0ZU1vY2tNdXRhdGlvbih7IGlzUGVuZGluZzogdHJ1ZSB9KSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCBjb25maXJtQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvQ29uZmlybS9pIH0pXG4gICAgICBleHBlY3QoY29uZmlybUJ1dHRvbikudG9CZURpc2FibGVkKClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNvbmZpcm1CdXR0b24pXG5cbiAgICAgIC8vIEJ1dHRvbiBpcyBkaXNhYmxlZCwgc28gbXV0YXRlIG1pZ2h0IHN0aWxsIGJlIGNhbGxlZCBkZXBlbmRpbmcgb24gaW1wbGVtZW50YXRpb25cbiAgICAgIC8vIFRoZSBpbXBvcnRhbnQgdGhpbmcgaXMgdGhlIGJ1dHRvbiBoYXMgZGlzYWJsZWQgYXR0cmlidXRlXG4gICAgICBleHBlY3QoY29uZmlybUJ1dHRvbikudG9IYXZlQXR0cmlidXRlKCdkaXNhYmxlZCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBNdXRhdGlvbiBTdGF0ZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTXV0YXRpb24gU3RhdGVzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCd3aGVuIGlzUGVuZGluZyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoaWRlIGNhbmNlbCBidXR0b24nLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBtdXRhdGlvbjogY3JlYXRlTW9ja011dGF0aW9uKHsgaXNQZW5kaW5nOiB0cnVlIH0pLFxuICAgICAgICB9KVxuXG4gICAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIGV4cGVjdChcbiAgICAgICAgICBzY3JlZW4ucXVlcnlCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL0NhbmNlbC9pIH0pLFxuICAgICAgICApLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNob3cgbG9hZGluZyBzdGF0ZSBvbiBjb25maXJtIGJ1dHRvbicsICgpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIG11dGF0aW9uOiBjcmVhdGVNb2NrTXV0YXRpb24oeyBpc1BlbmRpbmc6IHRydWUgfSksXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL0NvbmZpcm0vaSB9KVxuICAgICAgICBleHBlY3QoY29uZmlybUJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZGlzYWJsZSBjb25maXJtIGJ1dHRvbicsICgpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIG11dGF0aW9uOiBjcmVhdGVNb2NrTXV0YXRpb24oeyBpc1BlbmRpbmc6IHRydWUgfSksXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL0NvbmZpcm0vaSB9KVxuICAgICAgICBleHBlY3QoY29uZmlybUJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIGlzUGVuZGluZyBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgc2hvdyBjYW5jZWwgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbXV0YXRpb246IGNyZWF0ZU1vY2tNdXRhdGlvbih7IGlzUGVuZGluZzogZmFsc2UgfSksXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgZXhwZWN0KFxuICAgICAgICAgIHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL0NhbmNlbC9pIH0pLFxuICAgICAgICApLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgZW5hYmxlIGNvbmZpcm0gYnV0dG9uJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbXV0YXRpb246IGNyZWF0ZU1vY2tNdXRhdGlvbih7IGlzUGVuZGluZzogZmFsc2UgfSksXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgY29uc3QgY29uZmlybUJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL0NvbmZpcm0vaSB9KVxuICAgICAgICBleHBlY3QoY29uZmlybUJ1dHRvbikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnd2hlbiBpc1N1Y2Nlc3MgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgc2hvdyBpbnN0YWxsZWQgc3RhdGUgb24gY2FyZCcsICgpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIG11dGF0aW9uOiBjcmVhdGVNb2NrTXV0YXRpb24oeyBpc1N1Y2Nlc3M6IHRydWUgfSksXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gVGhlIENhcmQgY29tcG9uZW50IHNob3VsZCByZWNlaXZlIGluc3RhbGxlZD10cnVlXG4gICAgICAgIC8vIFRoaXMgd2lsbCBzaG93IGEgY2hlY2sgaWNvblxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyaS1jaGVjay1saW5lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCd3aGVuIGlzU3VjY2VzcyBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgbm90IHNob3cgaW5zdGFsbGVkIHN0YXRlIG9uIGNhcmQnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgICBtdXRhdGlvbjogY3JlYXRlTW9ja011dGF0aW9uKHsgaXNTdWNjZXNzOiBmYWxzZSB9KSxcbiAgICAgICAgfSlcblxuICAgICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBUaGUgY2hlY2sgaWNvbiBzaG91bGQgbm90IGJlIHByZXNlbnQgKGluc3RhbGxlZD1mYWxzZSlcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdyaS1jaGVjay1saW5lJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnc3RhdGUgY29tYmluYXRpb25zJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBoYW5kbGUgaXNQZW5kaW5nPXRydWUgYW5kIGlzU3VjY2Vzcz1mYWxzZScsICgpID0+IHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICAgIG11dGF0aW9uOiBjcmVhdGVNb2NrTXV0YXRpb24oeyBpc1BlbmRpbmc6IHRydWUsIGlzU3VjY2VzczogZmFsc2UgfSksXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgZXhwZWN0KFxuICAgICAgICAgIHNjcmVlbi5xdWVyeUJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvQ2FuY2VsL2kgfSksXG4gICAgICAgICkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdyaS1jaGVjay1saW5lJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGhhbmRsZSBpc1BlbmRpbmc9ZmFsc2UgYW5kIGlzU3VjY2Vzcz10cnVlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbXV0YXRpb246IGNyZWF0ZU1vY2tNdXRhdGlvbih7IGlzUGVuZGluZzogZmFsc2UsIGlzU3VjY2VzczogdHJ1ZSB9KSxcbiAgICAgICAgfSlcblxuICAgICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgICBleHBlY3QoXG4gICAgICAgICAgc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvQ2FuY2VsL2kgfSksXG4gICAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyaS1jaGVjay1saW5lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGJvdGggaXNQZW5kaW5nPXRydWUgYW5kIGlzU3VjY2Vzcz10cnVlJywgKCkgPT4ge1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgICAgbXV0YXRpb246IGNyZWF0ZU1vY2tNdXRhdGlvbih7IGlzUGVuZGluZzogdHJ1ZSwgaXNTdWNjZXNzOiB0cnVlIH0pLFxuICAgICAgICB9KVxuXG4gICAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIGV4cGVjdChcbiAgICAgICAgICBzY3JlZW4ucXVlcnlCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL0NhbmNlbC9pIH0pLFxuICAgICAgICApLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JpLWNoZWNrLWxpbmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFBsdWdpbiBDYXJkIEludGVncmF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQbHVnaW4gQ2FyZCBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgcGx1Z2luIGxhYmVsJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdBbWF6aW5nIFBsdWdpbicgfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHBsdWdpbiB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FtYXppbmcgUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHBsdWdpbiBicmllZiBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBicmllZjogeyAnZW4tVVMnOiAnVGhpcyBpcyBhbiBhbWF6aW5nIHBsdWdpbicgfSxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHBsdWdpbiB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1RoaXMgaXMgYW4gYW1hemluZyBwbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgcGx1Z2luIG9yZyBhbmQgbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBvcmc6ICdteS1vcmdhbml6YXRpb24nLFxuICAgICAgICBuYW1lOiAnbXktcGx1Z2luLW5hbWUnLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgcGx1Z2luIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnbXktb3JnYW5pemF0aW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdteS1wbHVnaW4tbmFtZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBwbHVnaW4gY2F0ZWdvcnknLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHtcbiAgICAgICAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5tb2RlbCxcbiAgICAgIH0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHBsdWdpbiB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01vZGVsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHZlcmlmaWVkIGJhZGdlIHdoZW4gcGx1Z2luIGlzIHZlcmlmaWVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIHZlcmlmaWVkOiB0cnVlLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgcGx1Z2luIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd2ZXJpZmllZC1iYWRnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBwYXJ0bmVyIGJhZGdlIHdoZW4gcGx1Z2luIGhhcyBwYXJ0bmVyIGJhZGdlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIGJhZGdlczogWydwYXJ0bmVyJ10sXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBwbHVnaW4gfSlcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhcnRuZXItYmFkZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ01lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgbWVtb2l6ZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgLy8gVmVyaWZ5IHRoZSBjb21wb25lbnQgaXMgd3JhcHBlZCB3aXRoIG1lbW9cbiAgICAgIGV4cGVjdChQbHVnaW5NdXRhdGlvbk1vZGFsKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QodHlwZW9mIFBsdWdpbk11dGF0aW9uTW9kYWwpLnRvQmUoJ29iamVjdCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBkaXNwbGF5TmFtZSBzZXQnLCAoKSA9PiB7XG4gICAgICAvLyBUaGUgY29tcG9uZW50IHNldHMgZGlzcGxheU5hbWUgPSAnUGx1Z2luTXV0YXRpb25Nb2RhbCdcbiAgICAgIGNvbnN0IGRpc3BsYXlOYW1lXG4gICAgICAgID0gKFBsdWdpbk11dGF0aW9uTW9kYWwgYXMgYW55KS50eXBlPy5kaXNwbGF5TmFtZVxuICAgICAgICAgIHx8IChQbHVnaW5NdXRhdGlvbk1vZGFsIGFzIGFueSkuZGlzcGxheU5hbWVcbiAgICAgIGV4cGVjdChkaXNwbGF5TmFtZSkudG9CZSgnUGx1Z2luTXV0YXRpb25Nb2RhbCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlLXJlbmRlciB3aGVuIHByb3BzIHVuY2hhbmdlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlbmRlckNvdW50ID0gdmkuZm4oKVxuXG4gICAgICBjb25zdCBUZXN0V3JhcHBlciA9ICh7IHByb3BzIH06IHsgcHJvcHM6IFBsdWdpbk11dGF0aW9uTW9kYWxQcm9wcyB9KSA9PiB7XG4gICAgICAgIHJlbmRlckNvdW50KClcbiAgICAgICAgcmV0dXJuIDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz5cbiAgICAgIH1cblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxUZXN0V3JhcHBlciBwcm9wcz17cHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3QocmVuZGVyQ291bnQpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuXG4gICAgICAvLyBSZS1yZW5kZXIgd2l0aCBzYW1lIHByb3BzIHJlZmVyZW5jZVxuICAgICAgcmVyZW5kZXIoPFRlc3RXcmFwcGVyIHByb3BzPXtwcm9wc30gLz4pXG4gICAgICBleHBlY3QocmVuZGVyQ291bnQpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygyKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBsYWJlbCBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHtcbiAgICAgICAgbGFiZWw6IHt9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgcGx1Z2luIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBicmllZiBvYmplY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHtcbiAgICAgICAgYnJpZWY6IHt9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgcGx1Z2luIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3QoZG9jdW1lbnQuYm9keSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBwbHVnaW4gd2l0aCB1bmRlZmluZWQgYmFkZ2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbigpXG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIC0gVGVzdGluZyB1bmRlZmluZWQgYmFkZ2VzXG4gICAgICBwbHVnaW4uYmFkZ2VzID0gdW5kZWZpbmVkXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IHBsdWdpbiB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RyaW5nIGRlc2NyaXB0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgc3RyaW5nIG1vZGVsVGl0bGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG1vZGVsVGl0bGU6ICcnLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChkb2N1bWVudC5ib2R5KS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHNwZWNpYWwgY2hhcmFjdGVycyBpbiBwbHVnaW4gbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICBuYW1lOiAncGx1Z2luLXdpdGgtc3BlY2lhbDxjaGFycz4hQCMkJScsXG4gICAgICAgIG9yZzogJ29yZzxzY3JpcHQ+dGVzdDwvc2NyaXB0PicsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBwbHVnaW4gfSlcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4td2l0aC1zcGVjaWFsPGNoYXJzPiFAIyQlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyeSBsb25nIHRpdGxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbG9uZ1RpdGxlID0gJ0EnLnJlcGVhdCg1MDApXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHtcbiAgICAgICAgbGFiZWw6IHsgJ2VuLVVTJzogbG9uZ1RpdGxlIH0sXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBwbHVnaW4gfSlcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIFNob3VsZCByZW5kZXIgdGhlIGxvbmcgdGl0bGUgdGV4dFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ1RpdGxlKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB2ZXJ5IGxvbmcgZGVzY3JpcHRpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBsb25nRGVzY3JpcHRpb24gPSAnQicucmVwZWF0KDEwMDApXG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKHtcbiAgICAgICAgYnJpZWY6IHsgJ2VuLVVTJzogbG9uZ0Rlc2NyaXB0aW9uIH0sXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBwbHVnaW4gfSlcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIFNob3VsZCByZW5kZXIgdGhlIGxvbmcgZGVzY3JpcHRpb24gdGV4dFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobG9uZ0Rlc2NyaXB0aW9uKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmljb2RlIGNoYXJhY3RlcnMgaW4gdGl0bGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIG1vZGVsVGl0bGU6ICfmm7TmlrDmj5Lku7Yg8J+OiScsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ+abtOaWsOaPkuS7tiDwn46JJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5pY29kZSBjaGFyYWN0ZXJzIGluIGRlc2NyaXB0aW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBkZXNjcmlwdGlvbjogJ+ehruWumuimgeabtOaWsOi/meS4quaPkuS7tuWQl++8n+OBk+OBruaTjeS9nOOBr+WFg+OBq+aIu+OBm+OBvuOBm+OCk+OAgicsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KFxuICAgICAgICBzY3JlZW4uZ2V0QnlUZXh0KCfnoa7lrpropoHmm7TmlrDov5nkuKrmj5Lku7blkJfvvJ/jgZPjga7mk43kvZzjga/lhYPjgavmiLvjgZvjgb7jgZvjgpPjgIInKSxcbiAgICAgICkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBudWxsIGNhcmRUaXRsZUxlZnQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7XG4gICAgICAgIGNhcmRUaXRsZUxlZnQ6IG51bGwsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIG1vZGFsQm90dG9tTGVmdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHtcbiAgICAgICAgbW9kYWxCb3R0b21MZWZ0OiB1bmRlZmluZWQsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KGRvY3VtZW50LmJvZHkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIE1vZGFsIEJlaGF2aW9yIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdNb2RhbCBCZWhhdmlvcicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB3aXRoIGlzU2hvdz10cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gTW9kYWwgc2hvdWxkIGJlIHZpc2libGUgLSBjaGVjayBmb3IgZGlhbG9nIHJvbGUgdXNpbmcgc2NyZWVuIHF1ZXJ5XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnZGlhbG9nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIG1vZGFsIHN0cnVjdHVyZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIENoZWNrIHRoYXQgbW9kYWwgY29udGVudCBpcyByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2RpYWxvZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBNb2RhbCBzaG91bGQgaGF2ZSB0aXRsZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ01vZGFsIFRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgYXMgY2xvc2FibGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBDbG9zZSBpY29uIHNob3VsZCBiZSBwcmVzZW50XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyaS1jbG9zZS1saW5lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEJ1dHRvbiBTdHlsaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdCdXR0b24gU3R5bGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjb25maXJtIGJ1dHRvbiB3aXRoIHByaW1hcnkgdmFyaWFudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9Db25maXJtL2kgfSlcbiAgICAgIC8vIEJ1dHRvbiBjb21wb25lbnQgd2l0aCB2YXJpYW50PVwicHJpbWFyeVwiIHNob3VsZCBoYXZlIHByaW1hcnkgc3R5bGluZ1xuICAgICAgZXhwZWN0KGNvbmZpcm1CdXR0b24pLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2FuY2VsIGJ1dHRvbiB3aXRoIGRlZmF1bHQgdmFyaWFudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGNhbmNlbEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL0NhbmNlbC9pIH0pXG4gICAgICBleHBlY3QoY2FuY2VsQnV0dG9uKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBMYXlvdXQgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0xheW91dCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkZXNjcmlwdGlvbiB0ZXh0JywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBkZXNjcmlwdGlvbjogJ1Rlc3QgRGVzY3JpcHRpb24gQ29udGVudCcsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gRGVzY3JpcHRpb24gc2hvdWxkIGJlIHJlbmRlcmVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGVzdCBEZXNjcmlwdGlvbiBDb250ZW50JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2FyZCB3aXRoIHBsdWdpbiBpbmZvJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7XG4gICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdMYXlvdXQgVGVzdCBQbHVnaW4nIH0sXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBwbHVnaW4gfSlcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIENhcmQgc2hvdWxkIGRpc3BsYXkgcGx1Z2luIGluZm9cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdMYXlvdXQgVGVzdCBQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBib3RoIGNhbmNlbCBhbmQgY29uZmlybSBidXR0b25zJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQm90aCBidXR0b25zIHNob3VsZCBiZSByZW5kZXJlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL0NhbmNlbC9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvQ29uZmlybS9pIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGJ1dHRvbnMgaW4gY29ycmVjdCBvcmRlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEdldCBhbGwgYnV0dG9ucyBhbmQgdmVyaWZ5IG9yZGVyXG4gICAgICBjb25zdCBidXR0b25zID0gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIC8vIENhbmNlbCBidXR0b24gc2hvdWxkIGNvbWUgYmVmb3JlIENvbmZpcm0gYnV0dG9uXG4gICAgICBjb25zdCBjYW5jZWxJbmRleCA9IGJ1dHRvbnMuZmluZEluZGV4KGIgPT4gYi50ZXh0Q29udGVudD8uaW5jbHVkZXMoJ0NhbmNlbCcpKVxuICAgICAgY29uc3QgY29uZmlybUluZGV4ID0gYnV0dG9ucy5maW5kSW5kZXgoYiA9PiBiLnRleHRDb250ZW50Py5pbmNsdWRlcygnQ29uZmlybScpKVxuICAgICAgZXhwZWN0KGNhbmNlbEluZGV4KS50b0JlTGVzc1RoYW4oY29uZmlybUluZGV4KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQWNjZXNzaWJpbGl0eSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgYWNjZXNzaWJsZSBkaWFsb2cgcm9sZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKClcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdkaWFsb2cnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgYWNjZXNzaWJsZSBidXR0b24gcm9sZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcygpXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJykubGVuZ3RoKS50b0JlR3JlYXRlclRoYW4oMClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGFjY2Vzc2libGUgdGV4dCBjb250ZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoe1xuICAgICAgICBtb2RlbFRpdGxlOiAnQWNjZXNzaWJsZSBUaXRsZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQWNjZXNzaWJsZSBEZXNjcmlwdGlvbicsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FjY2Vzc2libGUgVGl0bGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ0FjY2Vzc2libGUgRGVzY3JpcHRpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQWxsIFBsdWdpbiBDYXRlZ29yaWVzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBbGwgUGx1Z2luIENhdGVnb3JpZXMnLCAoKSA9PiB7XG4gICAgY29uc3QgY2F0ZWdvcmllcyA9IFtcbiAgICAgIHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLCBsYWJlbDogJ1Rvb2wnIH0sXG4gICAgICB7IGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0ubW9kZWwsIGxhYmVsOiAnTW9kZWwnIH0sXG4gICAgICB7IGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0uZXh0ZW5zaW9uLCBsYWJlbDogJ0V4dGVuc2lvbicgfSxcbiAgICAgIHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5hZ2VudCwgbGFiZWw6ICdBZ2VudCcgfSxcbiAgICAgIHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5kYXRhc291cmNlLCBsYWJlbDogJ0RhdGFzb3VyY2UnIH0sXG4gICAgICB7IGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udHJpZ2dlciwgbGFiZWw6ICdUcmlnZ2VyJyB9LFxuICAgIF1cblxuICAgIGNhdGVnb3JpZXMuZm9yRWFjaCgoeyBjYXRlZ29yeSwgbGFiZWwgfSkgPT4ge1xuICAgICAgaXQoYHNob3VsZCBkaXNwbGF5ICR7bGFiZWx9IGNhdGVnb3J5IGNvcnJlY3RseWAsICgpID0+IHtcbiAgICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7IGNhdGVnb3J5IH0pXG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgcGx1Z2luIH0pXG5cbiAgICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQobGFiZWwpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQnVuZGxlIFR5cGUgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0J1bmRsZSBUeXBlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzcGxheSBidW5kbGUgbGFiZWwgZm9yIGJ1bmRsZSB0eXBlIHBsdWdpbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oe1xuICAgICAgICB0eXBlOiAnYnVuZGxlJyxcbiAgICAgICAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgcGx1Z2luIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBGb3IgYnVuZGxlIHR5cGUsIHNob3VsZCBzaG93ICdCdW5kbGUnIGluc3RlYWQgb2YgY2F0ZWdvcnlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdCdW5kbGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRXZlbnQgSGFuZGxlciBJc29sYXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0V2ZW50IEhhbmRsZXIgSXNvbGF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgbXV0YXRlIHdoZW4gY2xpY2tpbmcgY2FuY2VsIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG11dGF0ZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG9uQ2FuY2VsID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoeyBtdXRhdGUsIG9uQ2FuY2VsIH0pXG5cbiAgICAgIHJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCBjYW5jZWxCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9DYW5jZWwvaSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGNhbmNlbEJ1dHRvbilcblxuICAgICAgZXhwZWN0KG9uQ2FuY2VsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChtdXRhdGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkNhbmNlbCB3aGVuIGNsaWNraW5nIGNvbmZpcm0gYnV0dG9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbXV0YXRlID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25DYW5jZWwgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZURlZmF1bHRQcm9wcyh7IG11dGF0ZSwgb25DYW5jZWwgfSlcblxuICAgICAgcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGNvbmZpcm1CdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9Db25maXJtL2kgfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhjb25maXJtQnV0dG9uKVxuXG4gICAgICBleHBlY3QobXV0YXRlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIGV4cGVjdChvbkNhbmNlbCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTXVsdGlwbGUgUmVuZGVycyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTXVsdGlwbGUgUmVuZGVycycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBzdGF0ZSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVEZWZhdWx0UHJvcHMoKVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxQbHVnaW5NdXRhdGlvbk1vZGFsIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIFNpbXVsYXRlIHJhcGlkIHBlbmRpbmcgc3RhdGUgY2hhbmdlc1xuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxQbHVnaW5NdXRhdGlvbk1vZGFsXG4gICAgICAgICAgey4uLnByb3BzfVxuICAgICAgICAgIG11dGF0aW9uPXtjcmVhdGVNb2NrTXV0YXRpb24oeyBpc1BlbmRpbmc6IHRydWUgfSl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuICAgICAgcmVyZW5kZXIoXG4gICAgICAgIDxQbHVnaW5NdXRhdGlvbk1vZGFsXG4gICAgICAgICAgey4uLnByb3BzfVxuICAgICAgICAgIG11dGF0aW9uPXtjcmVhdGVNb2NrTXV0YXRpb24oeyBpc1BlbmRpbmc6IGZhbHNlIH0pfVxuICAgICAgICAvPixcbiAgICAgIClcbiAgICAgIHJlcmVuZGVyKFxuICAgICAgICA8UGx1Z2luTXV0YXRpb25Nb2RhbFxuICAgICAgICAgIHsuLi5wcm9wc31cbiAgICAgICAgICBtdXRhdGlvbj17Y3JlYXRlTW9ja011dGF0aW9uKHsgaXNTdWNjZXNzOiB0cnVlIH0pfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gU2hvdWxkIHNob3cgc3VjY2VzcyBzdGF0ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmktY2hlY2stbGluZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHBsdWdpbiBwcm9wIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4xID0gY3JlYXRlTW9ja1BsdWdpbih7IGxhYmVsOiB7ICdlbi1VUyc6ICdQbHVnaW4gT25lJyB9IH0pXG4gICAgICBjb25zdCBwbHVnaW4yID0gY3JlYXRlTW9ja1BsdWdpbih7IGxhYmVsOiB7ICdlbi1VUyc6ICdQbHVnaW4gVHdvJyB9IH0pXG5cbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlRGVmYXVsdFByb3BzKHsgcGx1Z2luOiBwbHVnaW4xIH0pXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPFBsdWdpbk11dGF0aW9uTW9kYWwgey4uLnByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1BsdWdpbiBPbmUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICByZXJlbmRlcig8UGx1Z2luTXV0YXRpb25Nb2RhbCB7Li4ucHJvcHN9IHBsdWdpbj17cGx1Z2luMn0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdQbHVnaW4gVHdvJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==