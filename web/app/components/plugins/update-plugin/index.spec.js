"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("@testing-library/react");
const React = require("react");
const vitest_1 = require("vitest");
const types_1 = require("../types");
const downgrade_warning_1 = require("./downgrade-warning");
const from_github_1 = require("./from-github");
const from_market_place_1 = require("./from-market-place");
const index_1 = require("./index");
const plugin_version_picker_1 = require("./plugin-version-picker");
// ================================
// Mock External Dependencies Only
// ================================
// Mock react-i18next
vitest_1.vi.mock('react-i18next', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useTranslation: () => ({
            t: (key, options) => {
                const translations = {
                    'upgrade.title': 'Update Plugin',
                    'upgrade.successfulTitle': 'Plugin Updated',
                    'upgrade.description': 'This plugin will be updated to the new version.',
                    'upgrade.upgrade': 'Update',
                    'upgrade.upgrading': 'Updating...',
                    'upgrade.close': 'Close',
                    'operation.cancel': 'Cancel',
                    'newApp.Cancel': 'Cancel',
                    'autoUpdate.pluginDowngradeWarning.title': 'Downgrade Warning',
                    'autoUpdate.pluginDowngradeWarning.description': 'You are about to downgrade this plugin.',
                    'autoUpdate.pluginDowngradeWarning.downgrade': 'Just Downgrade',
                    'autoUpdate.pluginDowngradeWarning.exclude': 'Exclude and Downgrade',
                    'detailPanel.switchVersion': 'Switch Version',
                };
                const fullKey = options?.ns ? `${options.ns}.${key}` : key;
                return translations[fullKey] || translations[key] || key;
            },
        }),
    };
});
// Mock useGetLanguage context
vitest_1.vi.mock('@/context/i18n', () => ({
    useGetLanguage: () => 'en-US',
}));
// Mock app context for useGetIcon
vitest_1.vi.mock('@/context/app-context', () => ({
    useSelector: () => ({ id: 'test-workspace-id' }),
}));
// Mock hooks/use-timestamp
vitest_1.vi.mock('@/hooks/use-timestamp', () => ({
    default: () => ({
        formatDate: (timestamp, _format) => {
            const date = new Date(timestamp * 1000);
            return date.toISOString().split('T')[0];
        },
    }),
}));
// Mock plugins service
const mockUpdateFromMarketPlace = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/plugins', () => ({
    updateFromMarketPlace: (params) => mockUpdateFromMarketPlace(params),
    checkTaskStatus: vitest_1.vi.fn().mockResolvedValue({
        task: {
            plugins: [{ plugin_unique_identifier: 'test-target-id', status: 'success' }],
        },
    }),
}));
// Mock use-plugins hooks
const mockHandleRefetch = vitest_1.vi.fn();
const mockMutateAsync = vitest_1.vi.fn();
const mockInvalidateReferenceSettings = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/use-plugins', () => ({
    usePluginTaskList: () => ({
        handleRefetch: mockHandleRefetch,
    }),
    useRemoveAutoUpgrade: () => ({
        mutateAsync: mockMutateAsync,
    }),
    useInvalidateReferenceSettings: () => mockInvalidateReferenceSettings,
    useVersionListOfPlugin: () => ({
        data: {
            data: {
                versions: [
                    { version: '1.0.0', unique_identifier: 'plugin-v1.0.0', created_at: 1700000000 },
                    { version: '1.1.0', unique_identifier: 'plugin-v1.1.0', created_at: 1700100000 },
                    { version: '2.0.0', unique_identifier: 'plugin-v2.0.0', created_at: 1700200000 },
                ],
            },
        },
    }),
}));
// Mock checkTaskStatus
const mockCheck = vitest_1.vi.fn();
const mockStop = vitest_1.vi.fn();
vitest_1.vi.mock('../install-plugin/base/check-task-status', () => ({
    default: () => ({
        check: mockCheck,
        stop: mockStop,
    }),
}));
// Mock Toast
vitest_1.vi.mock('../../base/toast', () => ({
    default: {
        notify: vitest_1.vi.fn(),
    },
}));
// Mock InstallFromGitHub component
vitest_1.vi.mock('../install-plugin/install-from-github', () => ({
    default: ({ updatePayload, onClose, onSuccess }) => (<div data-testid="install-from-github">
      <span data-testid="github-payload">{JSON.stringify(updatePayload)}</span>
      <button data-testid="github-close" onClick={onClose}>Close</button>
      <button data-testid="github-success" onClick={onSuccess}>Success</button>
    </div>),
}));
// Mock Portal components for PluginVersionPicker
let mockPortalOpen = false;
vitest_1.vi.mock('@/app/components/base/portal-to-follow-elem', () => ({
    PortalToFollowElem: ({ children, open, onOpenChange: _onOpenChange }) => {
        mockPortalOpen = open;
        return <div data-testid="portal-elem" data-open={open}>{children}</div>;
    },
    PortalToFollowElemTrigger: ({ children, onClick, className }) => (<div data-testid="portal-trigger" onClick={onClick} className={className}>
      {children}
    </div>),
    PortalToFollowElemContent: ({ children, className }) => {
        if (!mockPortalOpen)
            return null;
        return <div data-testid="portal-content" className={className}>{children}</div>;
    },
}));
// Mock semver
vitest_1.vi.mock('semver', () => ({
    lt: (v1, v2) => {
        const parseVersion = (v) => v.split('.').map(Number);
        const [major1, minor1, patch1] = parseVersion(v1);
        const [major2, minor2, patch2] = parseVersion(v2);
        if (major1 !== major2)
            return major1 < major2;
        if (minor1 !== minor2)
            return minor1 < minor2;
        return patch1 < patch2;
    },
}));
// ================================
// Test Data Factories
// ================================
const createMockPluginDeclaration = (overrides = {}) => ({
    plugin_unique_identifier: 'test-plugin-id',
    version: '1.0.0',
    author: 'test-author',
    icon: 'test-icon.png',
    name: 'Test Plugin',
    category: types_1.PluginCategoryEnum.tool,
    label: { 'en-US': 'Test Plugin' },
    description: { 'en-US': 'A test plugin' },
    created_at: '2024-01-01',
    resource: {},
    plugins: {},
    verified: true,
    endpoint: { settings: [], endpoints: [] },
    model: {},
    tags: [],
    agent_strategy: {},
    meta: { version: '1.0.0' },
    trigger: {
        events: [],
        identity: {
            author: 'test',
            name: 'test',
            label: { 'en-US': 'Test' },
            description: { 'en-US': 'Test' },
            icon: 'test.png',
            tags: [],
        },
        subscription_constructor: {
            credentials_schema: [],
            oauth_schema: { client_schema: [], credentials_schema: [] },
            parameters: [],
        },
        subscription_schema: [],
    },
    ...overrides,
});
const createMockMarketPlacePayload = (overrides = {}) => ({
    category: types_1.PluginCategoryEnum.tool,
    originalPackageInfo: {
        id: 'original-id',
        payload: createMockPluginDeclaration(),
    },
    targetPackageInfo: {
        id: 'test-target-id',
        version: '2.0.0',
    },
    ...overrides,
});
const createMockGitHubPayload = (overrides = {}) => ({
    originalPackageInfo: {
        id: 'github-original-id',
        repo: 'owner/repo',
        version: '1.0.0',
        package: 'test-package.difypkg',
        releases: [
            { tag_name: 'v1.0.0', assets: [{ id: 1, name: 'plugin.difypkg', browser_download_url: 'https://github.com/test' }] },
            { tag_name: 'v2.0.0', assets: [{ id: 2, name: 'plugin.difypkg', browser_download_url: 'https://github.com/test' }] },
        ],
    },
    ...overrides,
});
// Version list is provided by the mocked useVersionListOfPlugin hook
// ================================
// Helper Functions
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
// Test Suites
// ================================
(0, vitest_1.describe)('update-plugin', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockPortalOpen = false;
        mockCheck.mockResolvedValue({ status: types_1.TaskStatus.success });
    });
    // ============================================================
    // UpdatePlugin (index.tsx) - Main Entry Component Tests
    // ============================================================
    (0, vitest_1.describe)('UpdatePlugin (index.tsx)', () => {
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render UpdateFromGitHub when type is github', () => {
                // Arrange
                const props = {
                    type: types_1.PluginSource.github,
                    category: types_1.PluginCategoryEnum.tool,
                    github: createMockGitHubPayload(),
                    onCancel: vitest_1.vi.fn(),
                    onSave: vitest_1.vi.fn(),
                };
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-github')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render UpdateFromMarketplace when type is marketplace', () => {
                // Arrange
                const props = {
                    type: types_1.PluginSource.marketplace,
                    category: types_1.PluginCategoryEnum.tool,
                    marketPlace: createMockMarketPlacePayload(),
                    onCancel: vitest_1.vi.fn(),
                    onSave: vitest_1.vi.fn(),
                };
                // Act
                renderWithQueryClient(<index_1.default {...props}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Update Plugin')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render UpdateFromMarketplace for other plugin sources', () => {
                // Arrange
                const props = {
                    type: types_1.PluginSource.local,
                    category: types_1.PluginCategoryEnum.tool,
                    marketPlace: createMockMarketPlacePayload(),
                    onCancel: vitest_1.vi.fn(),
                    onSave: vitest_1.vi.fn(),
                };
                // Act
                renderWithQueryClient(<index_1.default {...props}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Update Plugin')).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                // Verify the component is wrapped with React.memo
                (0, vitest_1.expect)(index_1.default).toBeDefined();
                // The component should have $$typeof indicating it's a memo component
                (0, vitest_1.expect)(index_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
        (0, vitest_1.describe)('Props Passing', () => {
            (0, vitest_1.it)('should pass correct props to UpdateFromGitHub', () => {
                // Arrange
                const githubPayload = createMockGitHubPayload();
                const onCancel = vitest_1.vi.fn();
                const onSave = vitest_1.vi.fn();
                const props = {
                    type: types_1.PluginSource.github,
                    category: types_1.PluginCategoryEnum.tool,
                    github: githubPayload,
                    onCancel,
                    onSave,
                };
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                // Assert
                const payloadElement = react_1.screen.getByTestId('github-payload');
                (0, vitest_1.expect)(payloadElement.textContent).toBe(JSON.stringify(githubPayload));
            });
            (0, vitest_1.it)('should call onCancel when github close is triggered', () => {
                // Arrange
                const onCancel = vitest_1.vi.fn();
                const props = {
                    type: types_1.PluginSource.github,
                    category: types_1.PluginCategoryEnum.tool,
                    github: createMockGitHubPayload(),
                    onCancel,
                    onSave: vitest_1.vi.fn(),
                };
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('github-close'));
                // Assert
                (0, vitest_1.expect)(onCancel).toHaveBeenCalledTimes(1);
            });
            (0, vitest_1.it)('should call onSave when github success is triggered', () => {
                // Arrange
                const onSave = vitest_1.vi.fn();
                const props = {
                    type: types_1.PluginSource.github,
                    category: types_1.PluginCategoryEnum.tool,
                    github: createMockGitHubPayload(),
                    onCancel: vitest_1.vi.fn(),
                    onSave,
                };
                // Act
                (0, react_1.render)(<index_1.default {...props}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('github-success'));
                // Assert
                (0, vitest_1.expect)(onSave).toHaveBeenCalledTimes(1);
            });
        });
    });
    // ============================================================
    // FromGitHub (from-github.tsx) Tests
    // ============================================================
    (0, vitest_1.describe)('FromGitHub (from-github.tsx)', () => {
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render InstallFromGitHub with correct props', () => {
                // Arrange
                const payload = createMockGitHubPayload();
                const onSave = vitest_1.vi.fn();
                const onCancel = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<from_github_1.default payload={payload} onSave={onSave} onCancel={onCancel}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-github')).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                (0, vitest_1.expect)(from_github_1.default).toBeDefined();
                (0, vitest_1.expect)(from_github_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
        (0, vitest_1.describe)('Event Handlers', () => {
            (0, vitest_1.it)('should call onCancel when onClose is triggered', () => {
                // Arrange
                const onCancel = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<from_github_1.default payload={createMockGitHubPayload()} onSave={vitest_1.vi.fn()} onCancel={onCancel}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('github-close'));
                // Assert
                (0, vitest_1.expect)(onCancel).toHaveBeenCalledTimes(1);
            });
            (0, vitest_1.it)('should call onSave when onSuccess is triggered', () => {
                // Arrange
                const onSave = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<from_github_1.default payload={createMockGitHubPayload()} onSave={onSave} onCancel={vitest_1.vi.fn()}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('github-success'));
                // Assert
                (0, vitest_1.expect)(onSave).toHaveBeenCalledTimes(1);
            });
        });
    });
    // ============================================================
    // UpdateFromMarketplace (from-market-place.tsx) Tests
    // ============================================================
    (0, vitest_1.describe)('UpdateFromMarketplace (from-market-place.tsx)', () => {
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render modal with title and description', () => {
                // Arrange
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={vitest_1.vi.fn()} onCancel={vitest_1.vi.fn()}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Update Plugin')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('This plugin will be updated to the new version.')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render version badge with version transition', () => {
                // Arrange
                const payload = createMockMarketPlacePayload({
                    originalPackageInfo: {
                        id: 'original-id',
                        payload: createMockPluginDeclaration({ version: '1.0.0' }),
                    },
                    targetPackageInfo: {
                        id: 'target-id',
                        version: '2.0.0',
                    },
                });
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={vitest_1.vi.fn()} onCancel={vitest_1.vi.fn()}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('1.0.0 -> 2.0.0')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render Update button in initial state', () => {
                // Arrange
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={vitest_1.vi.fn()} onCancel={vitest_1.vi.fn()}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Downgrade Warning Modal', () => {
            (0, vitest_1.it)('should show downgrade warning modal when isShowDowngradeWarningModal is true', () => {
                // Arrange
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={vitest_1.vi.fn()} onCancel={vitest_1.vi.fn()} isShowDowngradeWarningModal={true}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Downgrade Warning')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('You are about to downgrade this plugin.')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should not show downgrade warning modal when isShowDowngradeWarningModal is false', () => {
                // Arrange
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={vitest_1.vi.fn()} onCancel={vitest_1.vi.fn()} isShowDowngradeWarningModal={false}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.queryByText('Downgrade Warning')).not.toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Update Plugin')).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('User Interactions', () => {
            (0, vitest_1.it)('should call onCancel when Cancel button is clicked', () => {
                // Arrange
                const onCancel = vitest_1.vi.fn();
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={vitest_1.vi.fn()} onCancel={onCancel}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Cancel' }));
                // Assert
                (0, vitest_1.expect)(onCancel).toHaveBeenCalledTimes(1);
            });
            (0, vitest_1.it)('should call updateFromMarketPlace API when Update button is clicked', async () => {
                // Arrange
                mockUpdateFromMarketPlace.mockResolvedValue({
                    all_installed: true,
                    task_id: 'task-123',
                });
                const onSave = vitest_1.vi.fn();
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={onSave} onCancel={vitest_1.vi.fn()}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Update' }));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockUpdateFromMarketPlace).toHaveBeenCalledWith({
                        original_plugin_unique_identifier: 'original-id',
                        new_plugin_unique_identifier: 'test-target-id',
                    });
                });
            });
            (0, vitest_1.it)('should show loading state during upgrade', async () => {
                // Arrange
                mockUpdateFromMarketPlace.mockImplementation(() => new Promise(() => { })); // Never resolves
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={vitest_1.vi.fn()} onCancel={vitest_1.vi.fn()}/>);
                // Assert - button should show Update before clicking
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
                // Act - click update button
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Update' }));
                // Assert - Cancel button should be hidden during upgrade
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument();
                });
            });
            (0, vitest_1.it)('should call onSave when update completes with all_installed true', async () => {
                // Arrange
                mockUpdateFromMarketPlace.mockResolvedValue({
                    all_installed: true,
                    task_id: 'task-123',
                });
                const onSave = vitest_1.vi.fn();
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={onSave} onCancel={vitest_1.vi.fn()}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Update' }));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(onSave).toHaveBeenCalled();
                });
            });
            (0, vitest_1.it)('should check task status when all_installed is false', async () => {
                // Arrange
                mockUpdateFromMarketPlace.mockResolvedValue({
                    all_installed: false,
                    task_id: 'task-123',
                });
                mockCheck.mockResolvedValue({ status: types_1.TaskStatus.success });
                const onSave = vitest_1.vi.fn();
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={onSave} onCancel={vitest_1.vi.fn()}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Update' }));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockHandleRefetch).toHaveBeenCalled();
                });
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockCheck).toHaveBeenCalledWith({
                        taskId: 'task-123',
                        pluginUniqueIdentifier: 'test-target-id',
                    });
                });
            });
            (0, vitest_1.it)('should stop task check and call onCancel when modal is cancelled during upgrade', () => {
                // Arrange
                const onCancel = vitest_1.vi.fn();
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={vitest_1.vi.fn()} onCancel={onCancel}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Cancel' }));
                // Assert
                (0, vitest_1.expect)(mockStop).toHaveBeenCalled();
                (0, vitest_1.expect)(onCancel).toHaveBeenCalled();
            });
        });
        (0, vitest_1.describe)('Error Handling', () => {
            (0, vitest_1.it)('should reset to notStarted state when API call fails', async () => {
                // Arrange
                mockUpdateFromMarketPlace.mockRejectedValue(new Error('API Error'));
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={vitest_1.vi.fn()} onCancel={vitest_1.vi.fn()}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Update' }));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
                });
            });
            (0, vitest_1.it)('should show error toast when task status is failed', async () => {
                // Arrange - covers lines 99-100
                const mockToastNotify = vitest_1.vi.fn();
                vitest_1.vi.mocked(await Promise.resolve().then(() => require('../../base/toast'))).default.notify = mockToastNotify;
                mockUpdateFromMarketPlace.mockResolvedValue({
                    all_installed: false,
                    task_id: 'task-123',
                });
                mockCheck.mockResolvedValue({
                    status: types_1.TaskStatus.failed,
                    error: 'Installation failed due to dependency conflict',
                });
                const onSave = vitest_1.vi.fn();
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} onSave={onSave} onCancel={vitest_1.vi.fn()}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Update' }));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockCheck).toHaveBeenCalled();
                });
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockToastNotify).toHaveBeenCalledWith({
                        type: 'error',
                        message: 'Installation failed due to dependency conflict',
                    });
                });
                // onSave should NOT be called when task fails
                (0, vitest_1.expect)(onSave).not.toHaveBeenCalled();
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                (0, vitest_1.expect)(from_market_place_1.default).toBeDefined();
                (0, vitest_1.expect)(from_market_place_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
        (0, vitest_1.describe)('Exclude and Downgrade', () => {
            (0, vitest_1.it)('should call mutateAsync and handleConfirm when exclude and downgrade is clicked', async () => {
                // Arrange
                mockMutateAsync.mockResolvedValue({});
                mockUpdateFromMarketPlace.mockResolvedValue({
                    all_installed: true,
                    task_id: 'task-123',
                });
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} pluginId="test-plugin-id" onSave={vitest_1.vi.fn()} onCancel={vitest_1.vi.fn()} isShowDowngradeWarningModal={true}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Exclude and Downgrade' }));
                // Assert
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockMutateAsync).toHaveBeenCalledWith({
                        plugin_id: 'test-plugin-id',
                    });
                });
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockInvalidateReferenceSettings).toHaveBeenCalled();
                });
            });
            (0, vitest_1.it)('should skip mutateAsync when pluginId is not provided', async () => {
                // Arrange - covers line 114 else branch
                mockMutateAsync.mockResolvedValue({});
                mockUpdateFromMarketPlace.mockResolvedValue({
                    all_installed: true,
                    task_id: 'task-123',
                });
                const payload = createMockMarketPlacePayload();
                // Act
                renderWithQueryClient(<from_market_place_1.default payload={payload} 
                // pluginId is intentionally not provided
                onSave={vitest_1.vi.fn()} onCancel={vitest_1.vi.fn()} isShowDowngradeWarningModal={true}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Exclude and Downgrade' }));
                // Assert - mutateAsync should NOT be called when pluginId is undefined
                await (0, react_1.waitFor)(() => {
                    (0, vitest_1.expect)(mockInvalidateReferenceSettings).toHaveBeenCalled();
                });
                (0, vitest_1.expect)(mockMutateAsync).not.toHaveBeenCalled();
            });
        });
    });
    // ============================================================
    // DowngradeWarningModal (downgrade-warning.tsx) Tests
    // ============================================================
    (0, vitest_1.describe)('DowngradeWarningModal (downgrade-warning.tsx)', () => {
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render title and description', () => {
                // Act
                (0, react_1.render)(<downgrade_warning_1.default onCancel={vitest_1.vi.fn()} onJustDowngrade={vitest_1.vi.fn()} onExcludeAndDowngrade={vitest_1.vi.fn()}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Downgrade Warning')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('You are about to downgrade this plugin.')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render all three action buttons', () => {
                // Act
                (0, react_1.render)(<downgrade_warning_1.default onCancel={vitest_1.vi.fn()} onJustDowngrade={vitest_1.vi.fn()} onExcludeAndDowngrade={vitest_1.vi.fn()}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'Just Downgrade' })).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'Exclude and Downgrade' })).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('User Interactions', () => {
            (0, vitest_1.it)('should call onCancel when Cancel button is clicked', () => {
                // Arrange
                const onCancel = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<downgrade_warning_1.default onCancel={onCancel} onJustDowngrade={vitest_1.vi.fn()} onExcludeAndDowngrade={vitest_1.vi.fn()}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Cancel' }));
                // Assert
                (0, vitest_1.expect)(onCancel).toHaveBeenCalledTimes(1);
            });
            (0, vitest_1.it)('should call onJustDowngrade when Just Downgrade button is clicked', () => {
                // Arrange
                const onJustDowngrade = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<downgrade_warning_1.default onCancel={vitest_1.vi.fn()} onJustDowngrade={onJustDowngrade} onExcludeAndDowngrade={vitest_1.vi.fn()}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Just Downgrade' }));
                // Assert
                (0, vitest_1.expect)(onJustDowngrade).toHaveBeenCalledTimes(1);
            });
            (0, vitest_1.it)('should call onExcludeAndDowngrade when Exclude and Downgrade button is clicked', () => {
                // Arrange
                const onExcludeAndDowngrade = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<downgrade_warning_1.default onCancel={vitest_1.vi.fn()} onJustDowngrade={vitest_1.vi.fn()} onExcludeAndDowngrade={onExcludeAndDowngrade}/>);
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Exclude and Downgrade' }));
                // Assert
                (0, vitest_1.expect)(onExcludeAndDowngrade).toHaveBeenCalledTimes(1);
            });
        });
    });
    // ============================================================
    // PluginVersionPicker (plugin-version-picker.tsx) Tests
    // ============================================================
    (0, vitest_1.describe)('PluginVersionPicker (plugin-version-picker.tsx)', () => {
        const defaultProps = {
            isShow: false,
            onShowChange: vitest_1.vi.fn(),
            pluginID: 'test-plugin-id',
            currentVersion: '1.0.0',
            trigger: <button>Select Version</button>,
            onSelect: vitest_1.vi.fn(),
        };
        (0, vitest_1.describe)('Rendering', () => {
            (0, vitest_1.it)('should render trigger element', () => {
                // Act
                (0, react_1.render)(<plugin_version_picker_1.default {...defaultProps}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('Select Version')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should not render content when isShow is false', () => {
                // Act
                (0, react_1.render)(<plugin_version_picker_1.default {...defaultProps} isShow={false}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.queryByTestId('portal-content')).not.toBeInTheDocument();
            });
            (0, vitest_1.it)('should render version list when isShow is true', () => {
                // Act
                (0, react_1.render)(<plugin_version_picker_1.default {...defaultProps} isShow={true}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-content')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('Switch Version')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should render all versions from API', () => {
                // Act
                (0, react_1.render)(<plugin_version_picker_1.default {...defaultProps} isShow={true}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('1.0.0')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('1.1.0')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByText('2.0.0')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should show CURRENT badge for current version', () => {
                // Act
                (0, react_1.render)(<plugin_version_picker_1.default {...defaultProps} isShow={true} currentVersion="1.0.0"/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByText('CURRENT')).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('User Interactions', () => {
            (0, vitest_1.it)('should call onShowChange when trigger is clicked', () => {
                // Arrange
                const onShowChange = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<plugin_version_picker_1.default {...defaultProps} onShowChange={onShowChange}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                // Assert
                (0, vitest_1.expect)(onShowChange).toHaveBeenCalledWith(true);
            });
            (0, vitest_1.it)('should not call onShowChange when trigger is clicked and disabled is true', () => {
                // Arrange
                const onShowChange = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<plugin_version_picker_1.default {...defaultProps} disabled={true} onShowChange={onShowChange}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('portal-trigger'));
                // Assert
                (0, vitest_1.expect)(onShowChange).not.toHaveBeenCalled();
            });
            (0, vitest_1.it)('should call onSelect with correct params when a version is selected', () => {
                // Arrange
                const onSelect = vitest_1.vi.fn();
                const onShowChange = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<plugin_version_picker_1.default {...defaultProps} isShow={true} currentVersion="1.0.0" onSelect={onSelect} onShowChange={onShowChange}/>);
                // Click on version 2.0.0
                const versionElements = react_1.screen.getAllByText(/^\d+\.\d+\.\d+$/);
                const version2Element = versionElements.find(el => el.textContent === '2.0.0');
                if (version2Element) {
                    react_1.fireEvent.click(version2Element.closest('div[class*="cursor-pointer"]'));
                }
                // Assert
                (0, vitest_1.expect)(onSelect).toHaveBeenCalledWith({
                    version: '2.0.0',
                    unique_identifier: 'plugin-v2.0.0',
                    isDowngrade: false,
                });
                (0, vitest_1.expect)(onShowChange).toHaveBeenCalledWith(false);
            });
            (0, vitest_1.it)('should not call onSelect when clicking on current version', () => {
                // Arrange
                const onSelect = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<plugin_version_picker_1.default {...defaultProps} isShow={true} currentVersion="1.0.0" onSelect={onSelect}/>);
                // Click on current version 1.0.0
                const versionElements = react_1.screen.getAllByText(/^\d+\.\d+\.\d+$/);
                const version1Element = versionElements.find(el => el.textContent === '1.0.0');
                if (version1Element) {
                    react_1.fireEvent.click(version1Element.closest('div[class*="cursor"]'));
                }
                // Assert
                (0, vitest_1.expect)(onSelect).not.toHaveBeenCalled();
            });
            (0, vitest_1.it)('should indicate downgrade when selecting a lower version', () => {
                // Arrange
                const onSelect = vitest_1.vi.fn();
                // Act
                (0, react_1.render)(<plugin_version_picker_1.default {...defaultProps} isShow={true} currentVersion="2.0.0" onSelect={onSelect}/>);
                // Click on version 1.0.0 (downgrade)
                const versionElements = react_1.screen.getAllByText(/^\d+\.\d+\.\d+$/);
                const version1Element = versionElements.find(el => el.textContent === '1.0.0');
                if (version1Element) {
                    react_1.fireEvent.click(version1Element.closest('div[class*="cursor-pointer"]'));
                }
                // Assert
                (0, vitest_1.expect)(onSelect).toHaveBeenCalledWith({
                    version: '1.0.0',
                    unique_identifier: 'plugin-v1.0.0',
                    isDowngrade: true,
                });
            });
        });
        (0, vitest_1.describe)('Props', () => {
            (0, vitest_1.it)('should support custom placement', () => {
                // Act
                (0, react_1.render)(<plugin_version_picker_1.default {...defaultProps} isShow={true} placement="top-end"/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
            });
            (0, vitest_1.it)('should support custom offset', () => {
                // Act
                (0, react_1.render)(<plugin_version_picker_1.default {...defaultProps} isShow={true} offset={{ mainAxis: 10, crossAxis: 20 }}/>);
                // Assert
                (0, vitest_1.expect)(react_1.screen.getByTestId('portal-elem')).toBeInTheDocument();
            });
        });
        (0, vitest_1.describe)('Component Memoization', () => {
            (0, vitest_1.it)('should be memoized with React.memo', () => {
                (0, vitest_1.expect)(plugin_version_picker_1.default).toBeDefined();
                (0, vitest_1.expect)(plugin_version_picker_1.default.$$typeof?.toString()).toContain('Symbol');
            });
        });
    });
    // ============================================================
    // Edge Cases
    // ============================================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should render github update with undefined payload (mock handles it)', () => {
            // Arrange - the mocked InstallFromGitHub handles undefined payload
            const props = {
                type: types_1.PluginSource.github,
                category: types_1.PluginCategoryEnum.tool,
                github: undefined,
                onCancel: vitest_1.vi.fn(),
                onSave: vitest_1.vi.fn(),
            };
            // Act
            (0, react_1.render)(<index_1.default {...props}/>);
            // Assert - mock component renders with undefined payload
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-from-github')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should throw error when marketplace payload is undefined', () => {
            // Arrange
            const props = {
                type: types_1.PluginSource.marketplace,
                category: types_1.PluginCategoryEnum.tool,
                marketPlace: undefined,
                onCancel: vitest_1.vi.fn(),
                onSave: vitest_1.vi.fn(),
            };
            // Act & Assert - should throw because payload is required
            (0, vitest_1.expect)(() => renderWithQueryClient(<index_1.default {...props}/>)).toThrow();
        });
        (0, vitest_1.it)('should handle empty version list in PluginVersionPicker', () => {
            // Override the mock temporarily
            vitest_1.vi.mocked(vitest_1.vi.importActual('@/service/use-plugins')).useVersionListOfPlugin = () => ({
                data: { data: { versions: [] } },
            });
            // Act
            (0, react_1.render)(<plugin_version_picker_1.default {...{
                isShow: true,
                onShowChange: vitest_1.vi.fn(),
                pluginID: 'test',
                currentVersion: '1.0.0',
                trigger: <button>Select</button>,
                onSelect: vitest_1.vi.fn(),
            }}/>);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('Switch Version')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEsdURBQXdFO0FBQ3hFLGtEQUEyRTtBQUMzRSwrQkFBOEI7QUFDOUIsbUNBQTZEO0FBQzdELG9DQUF1RTtBQUN2RSwyREFBdUQ7QUFDdkQsK0NBQXNDO0FBQ3RDLDJEQUF1RDtBQUN2RCxtQ0FBa0M7QUFDbEMsbUVBQXlEO0FBRXpELG1DQUFtQztBQUNuQyxrQ0FBa0M7QUFDbEMsbUNBQW1DO0FBRW5DLHFCQUFxQjtBQUNyQixXQUFFLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLEVBQUU7SUFDaEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxjQUFjLEVBQWtDLENBQUE7SUFDckUsT0FBTztRQUNMLEdBQUcsTUFBTTtRQUNULGNBQWMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLENBQUMsRUFBRSxDQUFDLEdBQVcsRUFBRSxPQUF5QixFQUFFLEVBQUU7Z0JBQzVDLE1BQU0sWUFBWSxHQUEyQjtvQkFDM0MsZUFBZSxFQUFFLGVBQWU7b0JBQ2hDLHlCQUF5QixFQUFFLGdCQUFnQjtvQkFDM0MscUJBQXFCLEVBQUUsaURBQWlEO29CQUN4RSxpQkFBaUIsRUFBRSxRQUFRO29CQUMzQixtQkFBbUIsRUFBRSxhQUFhO29CQUNsQyxlQUFlLEVBQUUsT0FBTztvQkFDeEIsa0JBQWtCLEVBQUUsUUFBUTtvQkFDNUIsZUFBZSxFQUFFLFFBQVE7b0JBQ3pCLHlDQUF5QyxFQUFFLG1CQUFtQjtvQkFDOUQsK0NBQStDLEVBQUUseUNBQXlDO29CQUMxRiw2Q0FBNkMsRUFBRSxnQkFBZ0I7b0JBQy9ELDJDQUEyQyxFQUFFLHVCQUF1QjtvQkFDcEUsMkJBQTJCLEVBQUUsZ0JBQWdCO2lCQUM5QyxDQUFBO2dCQUNELE1BQU0sT0FBTyxHQUFHLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxD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QUFFLEVBQUUsRUFBRSxFQUFFO2FBQ2pDLENBQUMsQ0FBQTtZQUVGLE1BQU07WUFDTixJQUFBLGNBQU0sRUFDSixDQUFDLCtCQUFtQixDQUFDLElBQUk7Z0JBQ3ZCLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFlBQVksRUFBRSxXQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNyQixRQUFRLEVBQUUsTUFBTTtnQkFDaEIsY0FBYyxFQUFFLE9BQU87Z0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDO2dCQUNoQyxRQUFRLEVBQUUsV0FBRSxDQUFDLEVBQUUsRUFBRTthQUNsQixDQUFDLEVBQ0EsQ0FDSCxDQUFBO1lBRUQsU0FBUztZQUNULElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDaEUsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUge1xuICBQbHVnaW5EZWNsYXJhdGlvbixcbiAgVXBkYXRlRnJvbUdpdEh1YlBheWxvYWQsXG4gIFVwZGF0ZUZyb21NYXJrZXRQbGFjZVBheWxvYWQsXG4gIFVwZGF0ZVBsdWdpbk1vZGFsVHlwZSxcbn0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSdcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBQbHVnaW5DYXRlZ29yeUVudW0sIFBsdWdpblNvdXJjZSwgVGFza1N0YXR1cyB9IGZyb20gJy4uL3R5cGVzJ1xuaW1wb3J0IERvd25ncmFkZVdhcm5pbmdNb2RhbCBmcm9tICcuL2Rvd25ncmFkZS13YXJuaW5nJ1xuaW1wb3J0IEZyb21HaXRIdWIgZnJvbSAnLi9mcm9tLWdpdGh1YidcbmltcG9ydCBVcGRhdGVGcm9tTWFya2V0cGxhY2UgZnJvbSAnLi9mcm9tLW1hcmtldC1wbGFjZSdcbmltcG9ydCBVcGRhdGVQbHVnaW4gZnJvbSAnLi9pbmRleCdcbmltcG9ydCBQbHVnaW5WZXJzaW9uUGlja2VyIGZyb20gJy4vcGx1Z2luLXZlcnNpb24tcGlja2VyJ1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gTW9jayBFeHRlcm5hbCBEZXBlbmRlbmNpZXMgT25seVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuLy8gTW9jayByZWFjdC1pMThuZXh0XG52aS5tb2NrKCdyZWFjdC1pMThuZXh0JywgYXN5bmMgKGltcG9ydE9yaWdpbmFsKSA9PiB7XG4gIGNvbnN0IGFjdHVhbCA9IGF3YWl0IGltcG9ydE9yaWdpbmFsPHR5cGVvZiBpbXBvcnQoJ3JlYWN0LWkxOG5leHQnKT4oKVxuICByZXR1cm4ge1xuICAgIC4uLmFjdHVhbCxcbiAgICB1c2VUcmFuc2xhdGlvbjogKCkgPT4gKHtcbiAgICAgIHQ6IChrZXk6IHN0cmluZywgb3B0aW9ucz86IHsgbnM/OiBzdHJpbmcgfSkgPT4ge1xuICAgICAgICBjb25zdCB0cmFuc2xhdGlvbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gICAgICAgICAgJ3VwZ3JhZGUudGl0bGUnOiAnVXBkYXRlIFBsdWdpbicsXG4gICAgICAgICAgJ3VwZ3JhZGUuc3VjY2Vzc2Z1bFRpdGxlJzogJ1BsdWdpbiBVcGRhdGVkJyxcbiAgICAgICAgICAndXBncmFkZS5kZXNjcmlwdGlvbic6ICdUaGlzIHBsdWdpbiB3aWxsIGJlIHVwZGF0ZWQgdG8gdGhlIG5ldyB2ZXJzaW9uLicsXG4gICAgICAgICAgJ3VwZ3JhZGUudXBncmFkZSc6ICdVcGRhdGUnLFxuICAgICAgICAgICd1cGdyYWRlLnVwZ3JhZGluZyc6ICdVcGRhdGluZy4uLicsXG4gICAgICAgICAgJ3VwZ3JhZGUuY2xvc2UnOiAnQ2xvc2UnLFxuICAgICAgICAgICdvcGVyYXRpb24uY2FuY2VsJzogJ0NhbmNlbCcsXG4gICAgICAgICAgJ25ld0FwcC5DYW5jZWwnOiAnQ2FuY2VsJyxcbiAgICAgICAgICAnYXV0b1VwZGF0ZS5wbHVnaW5Eb3duZ3JhZGVXYXJuaW5nLnRpdGxlJzogJ0Rvd25ncmFkZSBXYXJuaW5nJyxcbiAgICAgICAgICAnYXV0b1VwZGF0ZS5wbHVnaW5Eb3duZ3JhZGVXYXJuaW5nLmRlc2NyaXB0aW9uJzogJ1lvdSBhcmUgYWJvdXQgdG8gZG93bmdyYWRlIHRoaXMgcGx1Z2luLicsXG4gICAgICAgICAgJ2F1dG9VcGRhdGUucGx1Z2luRG93bmdyYWRlV2FybmluZy5kb3duZ3JhZGUnOiAnSnVzdCBEb3duZ3JhZGUnLFxuICAgICAgICAgICdhdXRvVXBkYXRlLnBsdWdpbkRvd25ncmFkZVdhcm5pbmcuZXhjbHVkZSc6ICdFeGNsdWRlIGFuZCBEb3duZ3JhZGUnLFxuICAgICAgICAgICdkZXRhaWxQYW5lbC5zd2l0Y2hWZXJzaW9uJzogJ1N3aXRjaCBWZXJzaW9uJyxcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmdWxsS2V5ID0gb3B0aW9ucz8ubnMgPyBgJHtvcHRpb25zLm5zfS4ke2tleX1gIDoga2V5XG4gICAgICAgIHJldHVybiB0cmFuc2xhdGlvbnNbZnVsbEtleV0gfHwgdHJhbnNsYXRpb25zW2tleV0gfHwga2V5XG4gICAgICB9LFxuICAgIH0pLFxuICB9XG59KVxuXG4vLyBNb2NrIHVzZUdldExhbmd1YWdlIGNvbnRleHRcbnZpLm1vY2soJ0AvY29udGV4dC9pMThuJywgKCkgPT4gKHtcbiAgdXNlR2V0TGFuZ3VhZ2U6ICgpID0+ICdlbi1VUycsXG59KSlcblxuLy8gTW9jayBhcHAgY29udGV4dCBmb3IgdXNlR2V0SWNvblxudmkubW9jaygnQC9jb250ZXh0L2FwcC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlU2VsZWN0b3I6ICgpID0+ICh7IGlkOiAndGVzdC13b3Jrc3BhY2UtaWQnIH0pLFxufSkpXG5cbi8vIE1vY2sgaG9va3MvdXNlLXRpbWVzdGFtcFxudmkubW9jaygnQC9ob29rcy91c2UtdGltZXN0YW1wJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gKHtcbiAgICBmb3JtYXREYXRlOiAodGltZXN0YW1wOiBudW1iZXIsIF9mb3JtYXQ6IHN0cmluZykgPT4ge1xuICAgICAgY29uc3QgZGF0ZSA9IG5ldyBEYXRlKHRpbWVzdGFtcCAqIDEwMDApXG4gICAgICByZXR1cm4gZGF0ZS50b0lTT1N0cmluZygpLnNwbGl0KCdUJylbMF1cbiAgICB9LFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHBsdWdpbnMgc2VydmljZVxuY29uc3QgbW9ja1VwZGF0ZUZyb21NYXJrZXRQbGFjZSA9IHZpLmZuKClcbnZpLm1vY2soJ0Avc2VydmljZS9wbHVnaW5zJywgKCkgPT4gKHtcbiAgdXBkYXRlRnJvbU1hcmtldFBsYWNlOiAocGFyYW1zOiB1bmtub3duKSA9PiBtb2NrVXBkYXRlRnJvbU1hcmtldFBsYWNlKHBhcmFtcyksXG4gIGNoZWNrVGFza1N0YXR1czogdmkuZm4oKS5tb2NrUmVzb2x2ZWRWYWx1ZSh7XG4gICAgdGFzazoge1xuICAgICAgcGx1Z2luczogW3sgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC10YXJnZXQtaWQnLCBzdGF0dXM6ICdzdWNjZXNzJyB9XSxcbiAgICB9LFxuICB9KSxcbn0pKVxuXG4vLyBNb2NrIHVzZS1wbHVnaW5zIGhvb2tzXG5jb25zdCBtb2NrSGFuZGxlUmVmZXRjaCA9IHZpLmZuKClcbmNvbnN0IG1vY2tNdXRhdGVBc3luYyA9IHZpLmZuKClcbmNvbnN0IG1vY2tJbnZhbGlkYXRlUmVmZXJlbmNlU2V0dGluZ3MgPSB2aS5mbigpXG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtcGx1Z2lucycsICgpID0+ICh7XG4gIHVzZVBsdWdpblRhc2tMaXN0OiAoKSA9PiAoe1xuICAgIGhhbmRsZVJlZmV0Y2g6IG1vY2tIYW5kbGVSZWZldGNoLFxuICB9KSxcbiAgdXNlUmVtb3ZlQXV0b1VwZ3JhZGU6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IG1vY2tNdXRhdGVBc3luYyxcbiAgfSksXG4gIHVzZUludmFsaWRhdGVSZWZlcmVuY2VTZXR0aW5nczogKCkgPT4gbW9ja0ludmFsaWRhdGVSZWZlcmVuY2VTZXR0aW5ncyxcbiAgdXNlVmVyc2lvbkxpc3RPZlBsdWdpbjogKCkgPT4gKHtcbiAgICBkYXRhOiB7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIHZlcnNpb25zOiBbXG4gICAgICAgICAgeyB2ZXJzaW9uOiAnMS4wLjAnLCB1bmlxdWVfaWRlbnRpZmllcjogJ3BsdWdpbi12MS4wLjAnLCBjcmVhdGVkX2F0OiAxNzAwMDAwMDAwIH0sXG4gICAgICAgICAgeyB2ZXJzaW9uOiAnMS4xLjAnLCB1bmlxdWVfaWRlbnRpZmllcjogJ3BsdWdpbi12MS4xLjAnLCBjcmVhdGVkX2F0OiAxNzAwMTAwMDAwIH0sXG4gICAgICAgICAgeyB2ZXJzaW9uOiAnMi4wLjAnLCB1bmlxdWVfaWRlbnRpZmllcjogJ3BsdWdpbi12Mi4wLjAnLCBjcmVhdGVkX2F0OiAxNzAwMjAwMDAwIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgY2hlY2tUYXNrU3RhdHVzXG5jb25zdCBtb2NrQ2hlY2sgPSB2aS5mbigpXG5jb25zdCBtb2NrU3RvcCA9IHZpLmZuKClcbnZpLm1vY2soJy4uL2luc3RhbGwtcGx1Z2luL2Jhc2UvY2hlY2stdGFzay1zdGF0dXMnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiAoe1xuICAgIGNoZWNrOiBtb2NrQ2hlY2ssXG4gICAgc3RvcDogbW9ja1N0b3AsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgVG9hc3RcbnZpLm1vY2soJy4uLy4uL2Jhc2UvdG9hc3QnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiB7XG4gICAgbm90aWZ5OiB2aS5mbigpLFxuICB9LFxufSkpXG5cbi8vIE1vY2sgSW5zdGFsbEZyb21HaXRIdWIgY29tcG9uZW50XG52aS5tb2NrKCcuLi9pbnN0YWxsLXBsdWdpbi9pbnN0YWxsLWZyb20tZ2l0aHViJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgdXBkYXRlUGF5bG9hZCwgb25DbG9zZSwgb25TdWNjZXNzIH06IHtcbiAgICB1cGRhdGVQYXlsb2FkOiBVcGRhdGVGcm9tR2l0SHViUGF5bG9hZFxuICAgIG9uQ2xvc2U6ICgpID0+IHZvaWRcbiAgICBvblN1Y2Nlc3M6ICgpID0+IHZvaWRcbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJpbnN0YWxsLWZyb20tZ2l0aHViXCI+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImdpdGh1Yi1wYXlsb2FkXCI+e0pTT04uc3RyaW5naWZ5KHVwZGF0ZVBheWxvYWQpfTwvc3Bhbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJnaXRodWItY2xvc2VcIiBvbkNsaWNrPXtvbkNsb3NlfT5DbG9zZTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImdpdGh1Yi1zdWNjZXNzXCIgb25DbGljaz17b25TdWNjZXNzfT5TdWNjZXNzPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBQb3J0YWwgY29tcG9uZW50cyBmb3IgUGx1Z2luVmVyc2lvblBpY2tlclxubGV0IG1vY2tQb3J0YWxPcGVuID0gZmFsc2VcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9wb3J0YWwtdG8tZm9sbG93LWVsZW0nLCAoKSA9PiAoe1xuICBQb3J0YWxUb0ZvbGxvd0VsZW06ICh7IGNoaWxkcmVuLCBvcGVuLCBvbk9wZW5DaGFuZ2U6IF9vbk9wZW5DaGFuZ2UgfToge1xuICAgIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbiAgICBvcGVuOiBib29sZWFuXG4gICAgb25PcGVuQ2hhbmdlOiAob3BlbjogYm9vbGVhbikgPT4gdm9pZFxuICB9KSA9PiB7XG4gICAgbW9ja1BvcnRhbE9wZW4gPSBvcGVuXG4gICAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9XCJwb3J0YWwtZWxlbVwiIGRhdGEtb3Blbj17b3Blbn0+e2NoaWxkcmVufTwvZGl2PlxuICB9LFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1UcmlnZ2VyOiAoeyBjaGlsZHJlbiwgb25DbGljaywgY2xhc3NOYW1lIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgb25DbGljazogKCkgPT4gdm9pZFxuICAgIGNsYXNzTmFtZT86IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC10cmlnZ2VyXCIgb25DbGljaz17b25DbGlja30gY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxuICBQb3J0YWxUb0ZvbGxvd0VsZW1Db250ZW50OiAoeyBjaGlsZHJlbiwgY2xhc3NOYW1lIH06IHtcbiAgICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gICAgY2xhc3NOYW1lPzogc3RyaW5nXG4gIH0pID0+IHtcbiAgICBpZiAoIW1vY2tQb3J0YWxPcGVuKVxuICAgICAgcmV0dXJuIG51bGxcbiAgICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD1cInBvcnRhbC1jb250ZW50XCIgY2xhc3NOYW1lPXtjbGFzc05hbWV9PntjaGlsZHJlbn08L2Rpdj5cbiAgfSxcbn0pKVxuXG4vLyBNb2NrIHNlbXZlclxudmkubW9jaygnc2VtdmVyJywgKCkgPT4gKHtcbiAgbHQ6ICh2MTogc3RyaW5nLCB2Mjogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgcGFyc2VWZXJzaW9uID0gKHY6IHN0cmluZykgPT4gdi5zcGxpdCgnLicpLm1hcChOdW1iZXIpXG4gICAgY29uc3QgW21ham9yMSwgbWlub3IxLCBwYXRjaDFdID0gcGFyc2VWZXJzaW9uKHYxKVxuICAgIGNvbnN0IFttYWpvcjIsIG1pbm9yMiwgcGF0Y2gyXSA9IHBhcnNlVmVyc2lvbih2MilcbiAgICBpZiAobWFqb3IxICE9PSBtYWpvcjIpXG4gICAgICByZXR1cm4gbWFqb3IxIDwgbWFqb3IyXG4gICAgaWYgKG1pbm9yMSAhPT0gbWlub3IyKVxuICAgICAgcmV0dXJuIG1pbm9yMSA8IG1pbm9yMlxuICAgIHJldHVybiBwYXRjaDEgPCBwYXRjaDJcbiAgfSxcbn0pKVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVGVzdCBEYXRhIEZhY3Rvcmllc1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuY29uc3QgY3JlYXRlTW9ja1BsdWdpbkRlY2xhcmF0aW9uID0gKG92ZXJyaWRlczogUGFydGlhbDxQbHVnaW5EZWNsYXJhdGlvbj4gPSB7fSk6IFBsdWdpbkRlY2xhcmF0aW9uID0+ICh7XG4gIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ3Rlc3QtcGx1Z2luLWlkJyxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgYXV0aG9yOiAndGVzdC1hdXRob3InLFxuICBpY29uOiAndGVzdC1pY29uLnBuZycsXG4gIG5hbWU6ICdUZXN0IFBsdWdpbicsXG4gIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgbGFiZWw6IHsgJ2VuLVVTJzogJ1Rlc3QgUGx1Z2luJyB9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWydsYWJlbCddLFxuICBkZXNjcmlwdGlvbjogeyAnZW4tVVMnOiAnQSB0ZXN0IHBsdWdpbicgfSBhcyBQbHVnaW5EZWNsYXJhdGlvblsnZGVzY3JpcHRpb24nXSxcbiAgY3JlYXRlZF9hdDogJzIwMjQtMDEtMDEnLFxuICByZXNvdXJjZToge30sXG4gIHBsdWdpbnM6IHt9LFxuICB2ZXJpZmllZDogdHJ1ZSxcbiAgZW5kcG9pbnQ6IHsgc2V0dGluZ3M6IFtdLCBlbmRwb2ludHM6IFtdIH0sXG4gIG1vZGVsOiB7fSxcbiAgdGFnczogW10sXG4gIGFnZW50X3N0cmF0ZWd5OiB7fSxcbiAgbWV0YTogeyB2ZXJzaW9uOiAnMS4wLjAnIH0sXG4gIHRyaWdnZXI6IHtcbiAgICBldmVudHM6IFtdLFxuICAgIGlkZW50aXR5OiB7XG4gICAgICBhdXRob3I6ICd0ZXN0JyxcbiAgICAgIG5hbWU6ICd0ZXN0JyxcbiAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdUZXN0JyB9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWydsYWJlbCddLFxuICAgICAgZGVzY3JpcHRpb246IHsgJ2VuLVVTJzogJ1Rlc3QnIH0gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ2Rlc2NyaXB0aW9uJ10sXG4gICAgICBpY29uOiAndGVzdC5wbmcnLFxuICAgICAgdGFnczogW10sXG4gICAgfSxcbiAgICBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHtcbiAgICAgIGNyZWRlbnRpYWxzX3NjaGVtYTogW10sXG4gICAgICBvYXV0aF9zY2hlbWE6IHsgY2xpZW50X3NjaGVtYTogW10sIGNyZWRlbnRpYWxzX3NjaGVtYTogW10gfSxcbiAgICAgIHBhcmFtZXRlcnM6IFtdLFxuICAgIH0sXG4gICAgc3Vic2NyaXB0aW9uX3NjaGVtYTogW10sXG4gIH0sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tNYXJrZXRQbGFjZVBheWxvYWQgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFVwZGF0ZUZyb21NYXJrZXRQbGFjZVBheWxvYWQ+ID0ge30pOiBVcGRhdGVGcm9tTWFya2V0UGxhY2VQYXlsb2FkID0+ICh7XG4gIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgb3JpZ2luYWxQYWNrYWdlSW5mbzoge1xuICAgIGlkOiAnb3JpZ2luYWwtaWQnLFxuICAgIHBheWxvYWQ6IGNyZWF0ZU1vY2tQbHVnaW5EZWNsYXJhdGlvbigpLFxuICB9LFxuICB0YXJnZXRQYWNrYWdlSW5mbzoge1xuICAgIGlkOiAndGVzdC10YXJnZXQtaWQnLFxuICAgIHZlcnNpb246ICcyLjAuMCcsXG4gIH0sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tHaXRIdWJQYXlsb2FkID0gKG92ZXJyaWRlczogUGFydGlhbDxVcGRhdGVGcm9tR2l0SHViUGF5bG9hZD4gPSB7fSk6IFVwZGF0ZUZyb21HaXRIdWJQYXlsb2FkID0+ICh7XG4gIG9yaWdpbmFsUGFja2FnZUluZm86IHtcbiAgICBpZDogJ2dpdGh1Yi1vcmlnaW5hbC1pZCcsXG4gICAgcmVwbzogJ293bmVyL3JlcG8nLFxuICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgcGFja2FnZTogJ3Rlc3QtcGFja2FnZS5kaWZ5cGtnJyxcbiAgICByZWxlYXNlczogW1xuICAgICAgeyB0YWdfbmFtZTogJ3YxLjAuMCcsIGFzc2V0czogW3sgaWQ6IDEsIG5hbWU6ICdwbHVnaW4uZGlmeXBrZycsIGJyb3dzZXJfZG93bmxvYWRfdXJsOiAnaHR0cHM6Ly9naXRodWIuY29tL3Rlc3QnIH1dIH0sXG4gICAgICB7IHRhZ19uYW1lOiAndjIuMC4wJywgYXNzZXRzOiBbeyBpZDogMiwgbmFtZTogJ3BsdWdpbi5kaWZ5cGtnJywgYnJvd3Nlcl9kb3dubG9hZF91cmw6ICdodHRwczovL2dpdGh1Yi5jb20vdGVzdCcgfV0gfSxcbiAgICBdLFxuICB9LFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyBWZXJzaW9uIGxpc3QgaXMgcHJvdmlkZWQgYnkgdGhlIG1vY2tlZCB1c2VWZXJzaW9uTGlzdE9mUGx1Z2luIGhvb2tcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEhlbHBlciBGdW5jdGlvbnNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbmNvbnN0IGNyZWF0ZVF1ZXJ5Q2xpZW50ID0gKCkgPT4gbmV3IFF1ZXJ5Q2xpZW50KHtcbiAgZGVmYXVsdE9wdGlvbnM6IHtcbiAgICBxdWVyaWVzOiB7XG4gICAgICByZXRyeTogZmFsc2UsXG4gICAgfSxcbiAgfSxcbn0pXG5cbmNvbnN0IHJlbmRlcldpdGhRdWVyeUNsaWVudCA9ICh1aTogUmVhY3QuUmVhY3RFbGVtZW50KSA9PiB7XG4gIGNvbnN0IHF1ZXJ5Q2xpZW50ID0gY3JlYXRlUXVlcnlDbGllbnQoKVxuICByZXR1cm4gcmVuZGVyKFxuICAgIDxRdWVyeUNsaWVudFByb3ZpZGVyIGNsaWVudD17cXVlcnlDbGllbnR9PlxuICAgICAge3VpfVxuICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj4sXG4gIClcbn1cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFRlc3QgU3VpdGVzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5kZXNjcmliZSgndXBkYXRlLXBsdWdpbicsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1BvcnRhbE9wZW4gPSBmYWxzZVxuICAgIG1vY2tDaGVjay5tb2NrUmVzb2x2ZWRWYWx1ZSh7IHN0YXR1czogVGFza1N0YXR1cy5zdWNjZXNzIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVwZGF0ZVBsdWdpbiAoaW5kZXgudHN4KSAtIE1haW4gRW50cnkgQ29tcG9uZW50IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXBkYXRlUGx1Z2luIChpbmRleC50c3gpJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBVcGRhdGVGcm9tR2l0SHViIHdoZW4gdHlwZSBpcyBnaXRodWInLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcHJvcHM6IFVwZGF0ZVBsdWdpbk1vZGFsVHlwZSA9IHtcbiAgICAgICAgICB0eXBlOiBQbHVnaW5Tb3VyY2UuZ2l0aHViLFxuICAgICAgICAgIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgICAgICAgICBnaXRodWI6IGNyZWF0ZU1vY2tHaXRIdWJQYXlsb2FkKCksXG4gICAgICAgICAgb25DYW5jZWw6IHZpLmZuKCksXG4gICAgICAgICAgb25TYXZlOiB2aS5mbigpLFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8VXBkYXRlUGx1Z2luIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1naXRodWInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgVXBkYXRlRnJvbU1hcmtldHBsYWNlIHdoZW4gdHlwZSBpcyBtYXJrZXRwbGFjZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wczogVXBkYXRlUGx1Z2luTW9kYWxUeXBlID0ge1xuICAgICAgICAgIHR5cGU6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSxcbiAgICAgICAgICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gICAgICAgICAgbWFya2V0UGxhY2U6IGNyZWF0ZU1vY2tNYXJrZXRQbGFjZVBheWxvYWQoKSxcbiAgICAgICAgICBvbkNhbmNlbDogdmkuZm4oKSxcbiAgICAgICAgICBvblNhdmU6IHZpLmZuKCksXG4gICAgICAgIH1cblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxVcGRhdGVQbHVnaW4gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1VwZGF0ZSBQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgVXBkYXRlRnJvbU1hcmtldHBsYWNlIGZvciBvdGhlciBwbHVnaW4gc291cmNlcycsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwcm9wczogVXBkYXRlUGx1Z2luTW9kYWxUeXBlID0ge1xuICAgICAgICAgIHR5cGU6IFBsdWdpblNvdXJjZS5sb2NhbCxcbiAgICAgICAgICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gICAgICAgICAgbWFya2V0UGxhY2U6IGNyZWF0ZU1vY2tNYXJrZXRQbGFjZVBheWxvYWQoKSxcbiAgICAgICAgICBvbkNhbmNlbDogdmkuZm4oKSxcbiAgICAgICAgICBvblNhdmU6IHZpLmZuKCksXG4gICAgICAgIH1cblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KDxVcGRhdGVQbHVnaW4gey4uLnByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1VwZGF0ZSBQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYmUgbWVtb2l6ZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgICAvLyBWZXJpZnkgdGhlIGNvbXBvbmVudCBpcyB3cmFwcGVkIHdpdGggUmVhY3QubWVtb1xuICAgICAgICBleHBlY3QoVXBkYXRlUGx1Z2luKS50b0JlRGVmaW5lZCgpXG4gICAgICAgIC8vIFRoZSBjb21wb25lbnQgc2hvdWxkIGhhdmUgJCR0eXBlb2YgaW5kaWNhdGluZyBpdCdzIGEgbWVtbyBjb21wb25lbnRcbiAgICAgICAgZXhwZWN0KChVcGRhdGVQbHVnaW4gYXMgYW55KS4kJHR5cGVvZj8udG9TdHJpbmcoKSkudG9Db250YWluKCdTeW1ib2wnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ1Byb3BzIFBhc3NpbmcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHBhc3MgY29ycmVjdCBwcm9wcyB0byBVcGRhdGVGcm9tR2l0SHViJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IGdpdGh1YlBheWxvYWQgPSBjcmVhdGVNb2NrR2l0SHViUGF5bG9hZCgpXG4gICAgICAgIGNvbnN0IG9uQ2FuY2VsID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBvblNhdmUgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHByb3BzOiBVcGRhdGVQbHVnaW5Nb2RhbFR5cGUgPSB7XG4gICAgICAgICAgdHlwZTogUGx1Z2luU291cmNlLmdpdGh1YixcbiAgICAgICAgICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gICAgICAgICAgZ2l0aHViOiBnaXRodWJQYXlsb2FkLFxuICAgICAgICAgIG9uQ2FuY2VsLFxuICAgICAgICAgIG9uU2F2ZSxcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFVwZGF0ZVBsdWdpbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBjb25zdCBwYXlsb2FkRWxlbWVudCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnZ2l0aHViLXBheWxvYWQnKVxuICAgICAgICBleHBlY3QocGF5bG9hZEVsZW1lbnQudGV4dENvbnRlbnQpLnRvQmUoSlNPTi5zdHJpbmdpZnkoZ2l0aHViUGF5bG9hZCkpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25DYW5jZWwgd2hlbiBnaXRodWIgY2xvc2UgaXMgdHJpZ2dlcmVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ2FuY2VsID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwcm9wczogVXBkYXRlUGx1Z2luTW9kYWxUeXBlID0ge1xuICAgICAgICAgIHR5cGU6IFBsdWdpblNvdXJjZS5naXRodWIsXG4gICAgICAgICAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICAgICAgICAgIGdpdGh1YjogY3JlYXRlTW9ja0dpdEh1YlBheWxvYWQoKSxcbiAgICAgICAgICBvbkNhbmNlbCxcbiAgICAgICAgICBvblNhdmU6IHZpLmZuKCksXG4gICAgICAgIH1cblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxVcGRhdGVQbHVnaW4gey4uLnByb3BzfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnZ2l0aHViLWNsb3NlJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNhbmNlbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25TYXZlIHdoZW4gZ2l0aHViIHN1Y2Nlc3MgaXMgdHJpZ2dlcmVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uU2F2ZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcHJvcHM6IFVwZGF0ZVBsdWdpbk1vZGFsVHlwZSA9IHtcbiAgICAgICAgICB0eXBlOiBQbHVnaW5Tb3VyY2UuZ2l0aHViLFxuICAgICAgICAgIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgICAgICAgICBnaXRodWI6IGNyZWF0ZU1vY2tHaXRIdWJQYXlsb2FkKCksXG4gICAgICAgICAgb25DYW5jZWw6IHZpLmZuKCksXG4gICAgICAgICAgb25TYXZlLFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8VXBkYXRlUGx1Z2luIHsuLi5wcm9wc30gLz4pXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2dpdGh1Yi1zdWNjZXNzJykpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvblNhdmUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBGcm9tR2l0SHViIChmcm9tLWdpdGh1Yi50c3gpIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRnJvbUdpdEh1YiAoZnJvbS1naXRodWIudHN4KScsICgpID0+IHtcbiAgICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgSW5zdGFsbEZyb21HaXRIdWIgd2l0aCBjb3JyZWN0IHByb3BzJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrR2l0SHViUGF5bG9hZCgpXG4gICAgICAgIGNvbnN0IG9uU2F2ZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3Qgb25DYW5jZWwgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8RnJvbUdpdEh1YlxuICAgICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICAgIG9uU2F2ZT17b25TYXZlfVxuICAgICAgICAgICAgb25DYW5jZWw9e29uQ2FuY2VsfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZnJvbS1naXRodWInKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgYmUgbWVtb2l6ZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgICBleHBlY3QoRnJvbUdpdEh1YikudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QoKEZyb21HaXRIdWIgYXMgYW55KS4kJHR5cGVvZj8udG9TdHJpbmcoKSkudG9Db250YWluKCdTeW1ib2wnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0V2ZW50IEhhbmRsZXJzJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2FuY2VsIHdoZW4gb25DbG9zZSBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25DYW5jZWwgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8RnJvbUdpdEh1YlxuICAgICAgICAgICAgcGF5bG9hZD17Y3JlYXRlTW9ja0dpdEh1YlBheWxvYWQoKX1cbiAgICAgICAgICAgIG9uU2F2ZT17dmkuZm4oKX1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXtvbkNhbmNlbH1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdnaXRodWItY2xvc2UnKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uQ2FuY2VsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvblNhdmUgd2hlbiBvblN1Y2Nlc3MgaXMgdHJpZ2dlcmVkJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uU2F2ZSA9IHZpLmZuKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgIDxGcm9tR2l0SHViXG4gICAgICAgICAgICBwYXlsb2FkPXtjcmVhdGVNb2NrR2l0SHViUGF5bG9hZCgpfVxuICAgICAgICAgICAgb25TYXZlPXtvblNhdmV9XG4gICAgICAgICAgICBvbkNhbmNlbD17dmkuZm4oKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdnaXRodWItc3VjY2VzcycpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25TYXZlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXBkYXRlRnJvbU1hcmtldHBsYWNlIChmcm9tLW1hcmtldC1wbGFjZS50c3gpIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXBkYXRlRnJvbU1hcmtldHBsYWNlIChmcm9tLW1hcmtldC1wbGFjZS50c3gpJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB3aXRoIHRpdGxlIGFuZCBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja01hcmtldFBsYWNlUGF5bG9hZCgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgICA8VXBkYXRlRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgICAgb25TYXZlPXt2aS5mbigpfVxuICAgICAgICAgICAgb25DYW5jZWw9e3ZpLmZuKCl9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1VwZGF0ZSBQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnVGhpcyBwbHVnaW4gd2lsbCBiZSB1cGRhdGVkIHRvIHRoZSBuZXcgdmVyc2lvbi4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgdmVyc2lvbiBiYWRnZSB3aXRoIHZlcnNpb24gdHJhbnNpdGlvbicsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja01hcmtldFBsYWNlUGF5bG9hZCh7XG4gICAgICAgICAgb3JpZ2luYWxQYWNrYWdlSW5mbzoge1xuICAgICAgICAgICAgaWQ6ICdvcmlnaW5hbC1pZCcsXG4gICAgICAgICAgICBwYXlsb2FkOiBjcmVhdGVNb2NrUGx1Z2luRGVjbGFyYXRpb24oeyB2ZXJzaW9uOiAnMS4wLjAnIH0pLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGFyZ2V0UGFja2FnZUluZm86IHtcbiAgICAgICAgICAgIGlkOiAndGFyZ2V0LWlkJyxcbiAgICAgICAgICAgIHZlcnNpb246ICcyLjAuMCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICAgIDxVcGRhdGVGcm9tTWFya2V0cGxhY2VcbiAgICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgICBvblNhdmU9e3ZpLmZuKCl9XG4gICAgICAgICAgICBvbkNhbmNlbD17dmkuZm4oKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnMS4wLjAgLT4gMi4wLjAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCByZW5kZXIgVXBkYXRlIGJ1dHRvbiBpbiBpbml0aWFsIHN0YXRlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrTWFya2V0UGxhY2VQYXlsb2FkKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICAgIDxVcGRhdGVGcm9tTWFya2V0cGxhY2VcbiAgICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgICBvblNhdmU9e3ZpLmZuKCl9XG4gICAgICAgICAgICBvbkNhbmNlbD17dmkuZm4oKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnVXBkYXRlJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnQ2FuY2VsJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0Rvd25ncmFkZSBXYXJuaW5nIE1vZGFsJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBzaG93IGRvd25ncmFkZSB3YXJuaW5nIG1vZGFsIHdoZW4gaXNTaG93RG93bmdyYWRlV2FybmluZ01vZGFsIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tNYXJrZXRQbGFjZVBheWxvYWQoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoXG4gICAgICAgICAgPFVwZGF0ZUZyb21NYXJrZXRwbGFjZVxuICAgICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICAgIG9uU2F2ZT17dmkuZm4oKX1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXt2aS5mbigpfVxuICAgICAgICAgICAgaXNTaG93RG93bmdyYWRlV2FybmluZ01vZGFsPXt0cnVlfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdEb3duZ3JhZGUgV2FybmluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdZb3UgYXJlIGFib3V0IHRvIGRvd25ncmFkZSB0aGlzIHBsdWdpbi4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyBkb3duZ3JhZGUgd2FybmluZyBtb2RhbCB3aGVuIGlzU2hvd0Rvd25ncmFkZVdhcm5pbmdNb2RhbCBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja01hcmtldFBsYWNlUGF5bG9hZCgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgICA8VXBkYXRlRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgICAgb25TYXZlPXt2aS5mbigpfVxuICAgICAgICAgICAgb25DYW5jZWw9e3ZpLmZuKCl9XG4gICAgICAgICAgICBpc1Nob3dEb3duZ3JhZGVXYXJuaW5nTW9kYWw9e2ZhbHNlfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRleHQoJ0Rvd25ncmFkZSBXYXJuaW5nJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdVcGRhdGUgUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkNhbmNlbCB3aGVuIENhbmNlbCBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgICAgLy8gQXJyYW5nZVxuICAgICAgICBjb25zdCBvbkNhbmNlbCA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tNYXJrZXRQbGFjZVBheWxvYWQoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoXG4gICAgICAgICAgPFVwZGF0ZUZyb21NYXJrZXRwbGFjZVxuICAgICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICAgIG9uU2F2ZT17dmkuZm4oKX1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXtvbkNhbmNlbH1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnQ2FuY2VsJyB9KSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uQ2FuY2VsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCB1cGRhdGVGcm9tTWFya2V0UGxhY2UgQVBJIHdoZW4gVXBkYXRlIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tVcGRhdGVGcm9tTWFya2V0UGxhY2UubW9ja1Jlc29sdmVkVmFsdWUoe1xuICAgICAgICAgIGFsbF9pbnN0YWxsZWQ6IHRydWUsXG4gICAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgICAgfSlcbiAgICAgICAgY29uc3Qgb25TYXZlID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja01hcmtldFBsYWNlUGF5bG9hZCgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgICA8VXBkYXRlRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgICAgb25TYXZlPXtvblNhdmV9XG4gICAgICAgICAgICBvbkNhbmNlbD17dmkuZm4oKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnVXBkYXRlJyB9KSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1vY2tVcGRhdGVGcm9tTWFya2V0UGxhY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICAgIG9yaWdpbmFsX3BsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ29yaWdpbmFsLWlkJyxcbiAgICAgICAgICAgIG5ld19wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICd0ZXN0LXRhcmdldC1pZCcsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyBsb2FkaW5nIHN0YXRlIGR1cmluZyB1cGdyYWRlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tVcGRhdGVGcm9tTWFya2V0UGxhY2UubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IG5ldyBQcm9taXNlKCgpID0+IHt9KSkgLy8gTmV2ZXIgcmVzb2x2ZXNcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tNYXJrZXRQbGFjZVBheWxvYWQoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoXG4gICAgICAgICAgPFVwZGF0ZUZyb21NYXJrZXRwbGFjZVxuICAgICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICAgIG9uU2F2ZT17dmkuZm4oKX1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXt2aS5mbigpfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0IC0gYnV0dG9uIHNob3VsZCBzaG93IFVwZGF0ZSBiZWZvcmUgY2xpY2tpbmdcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ1VwZGF0ZScgfSkpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgICAvLyBBY3QgLSBjbGljayB1cGRhdGUgYnV0dG9uXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdVcGRhdGUnIH0pKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIENhbmNlbCBidXR0b24gc2hvdWxkIGJlIGhpZGRlbiBkdXJpbmcgdXBncmFkZVxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdDYW5jZWwnIH0pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uU2F2ZSB3aGVuIHVwZGF0ZSBjb21wbGV0ZXMgd2l0aCBhbGxfaW5zdGFsbGVkIHRydWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1VwZGF0ZUZyb21NYXJrZXRQbGFjZS5tb2NrUmVzb2x2ZWRWYWx1ZSh7XG4gICAgICAgICAgYWxsX2luc3RhbGxlZDogdHJ1ZSxcbiAgICAgICAgICB0YXNrX2lkOiAndGFzay0xMjMnLFxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBvblNhdmUgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrTWFya2V0UGxhY2VQYXlsb2FkKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICAgIDxVcGRhdGVGcm9tTWFya2V0cGxhY2VcbiAgICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgICBvblNhdmU9e29uU2F2ZX1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXt2aS5mbigpfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdVcGRhdGUnIH0pKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3Qob25TYXZlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2hlY2sgdGFzayBzdGF0dXMgd2hlbiBhbGxfaW5zdGFsbGVkIGlzIGZhbHNlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIG1vY2tVcGRhdGVGcm9tTWFya2V0UGxhY2UubW9ja1Jlc29sdmVkVmFsdWUoe1xuICAgICAgICAgIGFsbF9pbnN0YWxsZWQ6IGZhbHNlLFxuICAgICAgICAgIHRhc2tfaWQ6ICd0YXNrLTEyMycsXG4gICAgICAgIH0pXG4gICAgICAgIG1vY2tDaGVjay5tb2NrUmVzb2x2ZWRWYWx1ZSh7IHN0YXR1czogVGFza1N0YXR1cy5zdWNjZXNzIH0pXG4gICAgICAgIGNvbnN0IG9uU2F2ZSA9IHZpLmZuKClcbiAgICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tNYXJrZXRQbGFjZVBheWxvYWQoKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXJXaXRoUXVlcnlDbGllbnQoXG4gICAgICAgICAgPFVwZGF0ZUZyb21NYXJrZXRwbGFjZVxuICAgICAgICAgICAgcGF5bG9hZD17cGF5bG9hZH1cbiAgICAgICAgICAgIG9uU2F2ZT17b25TYXZlfVxuICAgICAgICAgICAgb25DYW5jZWw9e3ZpLmZuKCl9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ1VwZGF0ZScgfSkpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtb2NrSGFuZGxlUmVmZXRjaCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIH0pXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtb2NrQ2hlY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICAgIHRhc2tJZDogJ3Rhc2stMTIzJyxcbiAgICAgICAgICAgIHBsdWdpblVuaXF1ZUlkZW50aWZpZXI6ICd0ZXN0LXRhcmdldC1pZCcsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc3RvcCB0YXNrIGNoZWNrIGFuZCBjYWxsIG9uQ2FuY2VsIHdoZW4gbW9kYWwgaXMgY2FuY2VsbGVkIGR1cmluZyB1cGdyYWRlJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uQ2FuY2VsID0gdmkuZm4oKVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja01hcmtldFBsYWNlUGF5bG9hZCgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgICA8VXBkYXRlRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgICAgb25TYXZlPXt2aS5mbigpfVxuICAgICAgICAgICAgb25DYW5jZWw9e29uQ2FuY2VsfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdDYW5jZWwnIH0pKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3QobW9ja1N0b3ApLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICBleHBlY3Qob25DYW5jZWwpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ0Vycm9yIEhhbmRsaW5nJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCByZXNldCB0byBub3RTdGFydGVkIHN0YXRlIHdoZW4gQVBJIGNhbGwgZmFpbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja1VwZGF0ZUZyb21NYXJrZXRQbGFjZS5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ0FQSSBFcnJvcicpKVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja01hcmtldFBsYWNlUGF5bG9hZCgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgICA8VXBkYXRlRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgICAgb25TYXZlPXt2aS5mbigpfVxuICAgICAgICAgICAgb25DYW5jZWw9e3ZpLmZuKCl9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ1VwZGF0ZScgfSkpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdVcGRhdGUnIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIH0pXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3IgdG9hc3Qgd2hlbiB0YXNrIHN0YXR1cyBpcyBmYWlsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2UgLSBjb3ZlcnMgbGluZXMgOTktMTAwXG4gICAgICAgIGNvbnN0IG1vY2tUb2FzdE5vdGlmeSA9IHZpLmZuKClcbiAgICAgICAgdmkubW9ja2VkKGF3YWl0IGltcG9ydCgnLi4vLi4vYmFzZS90b2FzdCcpKS5kZWZhdWx0Lm5vdGlmeSA9IG1vY2tUb2FzdE5vdGlmeVxuXG4gICAgICAgIG1vY2tVcGRhdGVGcm9tTWFya2V0UGxhY2UubW9ja1Jlc29sdmVkVmFsdWUoe1xuICAgICAgICAgIGFsbF9pbnN0YWxsZWQ6IGZhbHNlLFxuICAgICAgICAgIHRhc2tfaWQ6ICd0YXNrLTEyMycsXG4gICAgICAgIH0pXG4gICAgICAgIG1vY2tDaGVjay5tb2NrUmVzb2x2ZWRWYWx1ZSh7XG4gICAgICAgICAgc3RhdHVzOiBUYXNrU3RhdHVzLmZhaWxlZCxcbiAgICAgICAgICBlcnJvcjogJ0luc3RhbGxhdGlvbiBmYWlsZWQgZHVlIHRvIGRlcGVuZGVuY3kgY29uZmxpY3QnLFxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBvblNhdmUgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrTWFya2V0UGxhY2VQYXlsb2FkKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICAgIDxVcGRhdGVGcm9tTWFya2V0cGxhY2VcbiAgICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgICBvblNhdmU9e29uU2F2ZX1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXt2aS5mbigpfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdVcGRhdGUnIH0pKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobW9ja0NoZWNrKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgfSlcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1vY2tUb2FzdE5vdGlmeSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICAgIG1lc3NhZ2U6ICdJbnN0YWxsYXRpb24gZmFpbGVkIGR1ZSB0byBkZXBlbmRlbmN5IGNvbmZsaWN0JyxcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgICAvLyBvblNhdmUgc2hvdWxkIE5PVCBiZSBjYWxsZWQgd2hlbiB0YXNrIGZhaWxzXG4gICAgICAgIGV4cGVjdChvblNhdmUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGJlIG1lbW9pemVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KFVwZGF0ZUZyb21NYXJrZXRwbGFjZSkudG9CZURlZmluZWQoKVxuICAgICAgICBleHBlY3QoKFVwZGF0ZUZyb21NYXJrZXRwbGFjZSBhcyBhbnkpLiQkdHlwZW9mPy50b1N0cmluZygpKS50b0NvbnRhaW4oJ1N5bWJvbCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnRXhjbHVkZSBhbmQgRG93bmdyYWRlJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG11dGF0ZUFzeW5jIGFuZCBoYW5kbGVDb25maXJtIHdoZW4gZXhjbHVkZSBhbmQgZG93bmdyYWRlIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgbW9ja011dGF0ZUFzeW5jLm1vY2tSZXNvbHZlZFZhbHVlKHt9KVxuICAgICAgICBtb2NrVXBkYXRlRnJvbU1hcmtldFBsYWNlLm1vY2tSZXNvbHZlZFZhbHVlKHtcbiAgICAgICAgICBhbGxfaW5zdGFsbGVkOiB0cnVlLFxuICAgICAgICAgIHRhc2tfaWQ6ICd0YXNrLTEyMycsXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrTWFya2V0UGxhY2VQYXlsb2FkKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyV2l0aFF1ZXJ5Q2xpZW50KFxuICAgICAgICAgIDxVcGRhdGVGcm9tTWFya2V0cGxhY2VcbiAgICAgICAgICAgIHBheWxvYWQ9e3BheWxvYWR9XG4gICAgICAgICAgICBwbHVnaW5JZD1cInRlc3QtcGx1Z2luLWlkXCJcbiAgICAgICAgICAgIG9uU2F2ZT17dmkuZm4oKX1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXt2aS5mbigpfVxuICAgICAgICAgICAgaXNTaG93RG93bmdyYWRlV2FybmluZ01vZGFsPXt0cnVlfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdFeGNsdWRlIGFuZCBEb3duZ3JhZGUnIH0pKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgICBleHBlY3QobW9ja011dGF0ZUFzeW5jKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgICBwbHVnaW5faWQ6ICd0ZXN0LXBsdWdpbi1pZCcsXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1vY2tJbnZhbGlkYXRlUmVmZXJlbmNlU2V0dGluZ3MpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgICB9KVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBza2lwIG11dGF0ZUFzeW5jIHdoZW4gcGx1Z2luSWQgaXMgbm90IHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlIC0gY292ZXJzIGxpbmUgMTE0IGVsc2UgYnJhbmNoXG4gICAgICAgIG1vY2tNdXRhdGVBc3luYy5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcbiAgICAgICAgbW9ja1VwZGF0ZUZyb21NYXJrZXRQbGFjZS5tb2NrUmVzb2x2ZWRWYWx1ZSh7XG4gICAgICAgICAgYWxsX2luc3RhbGxlZDogdHJ1ZSxcbiAgICAgICAgICB0YXNrX2lkOiAndGFzay0xMjMnLFxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja01hcmtldFBsYWNlUGF5bG9hZCgpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcldpdGhRdWVyeUNsaWVudChcbiAgICAgICAgICA8VXBkYXRlRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgICBwYXlsb2FkPXtwYXlsb2FkfVxuICAgICAgICAgICAgLy8gcGx1Z2luSWQgaXMgaW50ZW50aW9uYWxseSBub3QgcHJvdmlkZWRcbiAgICAgICAgICAgIG9uU2F2ZT17dmkuZm4oKX1cbiAgICAgICAgICAgIG9uQ2FuY2VsPXt2aS5mbigpfVxuICAgICAgICAgICAgaXNTaG93RG93bmdyYWRlV2FybmluZ01vZGFsPXt0cnVlfVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdFeGNsdWRlIGFuZCBEb3duZ3JhZGUnIH0pKVxuXG4gICAgICAgIC8vIEFzc2VydCAtIG11dGF0ZUFzeW5jIHNob3VsZCBOT1QgYmUgY2FsbGVkIHdoZW4gcGx1Z2luSWQgaXMgdW5kZWZpbmVkXG4gICAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICAgIGV4cGVjdChtb2NrSW52YWxpZGF0ZVJlZmVyZW5jZVNldHRpbmdzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgfSlcbiAgICAgICAgZXhwZWN0KG1vY2tNdXRhdGVBc3luYykubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBEb3duZ3JhZGVXYXJuaW5nTW9kYWwgKGRvd25ncmFkZS13YXJuaW5nLnRzeCkgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdEb3duZ3JhZGVXYXJuaW5nTW9kYWwgKGRvd25ncmFkZS13YXJuaW5nLnRzeCknLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHRpdGxlIGFuZCBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8RG93bmdyYWRlV2FybmluZ01vZGFsXG4gICAgICAgICAgICBvbkNhbmNlbD17dmkuZm4oKX1cbiAgICAgICAgICAgIG9uSnVzdERvd25ncmFkZT17dmkuZm4oKX1cbiAgICAgICAgICAgIG9uRXhjbHVkZUFuZERvd25ncmFkZT17dmkuZm4oKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnRG93bmdyYWRlIFdhcm5pbmcnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnWW91IGFyZSBhYm91dCB0byBkb3duZ3JhZGUgdGhpcyBwbHVnaW4uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIGFsbCB0aHJlZSBhY3Rpb24gYnV0dG9ucycsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8RG93bmdyYWRlV2FybmluZ01vZGFsXG4gICAgICAgICAgICBvbkNhbmNlbD17dmkuZm4oKX1cbiAgICAgICAgICAgIG9uSnVzdERvd25ncmFkZT17dmkuZm4oKX1cbiAgICAgICAgICAgIG9uRXhjbHVkZUFuZERvd25ncmFkZT17dmkuZm4oKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnQ2FuY2VsJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnSnVzdCBEb3duZ3JhZGUnIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdFeGNsdWRlIGFuZCBEb3duZ3JhZGUnIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25DYW5jZWwgd2hlbiBDYW5jZWwgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25DYW5jZWwgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8RG93bmdyYWRlV2FybmluZ01vZGFsXG4gICAgICAgICAgICBvbkNhbmNlbD17b25DYW5jZWx9XG4gICAgICAgICAgICBvbkp1c3REb3duZ3JhZGU9e3ZpLmZuKCl9XG4gICAgICAgICAgICBvbkV4Y2x1ZGVBbmREb3duZ3JhZGU9e3ZpLmZuKCl9XG4gICAgICAgICAgLz4sXG4gICAgICAgIClcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ0NhbmNlbCcgfSkpXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvbkNhbmNlbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIGNhbGwgb25KdXN0RG93bmdyYWRlIHdoZW4gSnVzdCBEb3duZ3JhZGUgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25KdXN0RG93bmdyYWRlID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPERvd25ncmFkZVdhcm5pbmdNb2RhbFxuICAgICAgICAgICAgb25DYW5jZWw9e3ZpLmZuKCl9XG4gICAgICAgICAgICBvbkp1c3REb3duZ3JhZGU9e29uSnVzdERvd25ncmFkZX1cbiAgICAgICAgICAgIG9uRXhjbHVkZUFuZERvd25ncmFkZT17dmkuZm4oKX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnSnVzdCBEb3duZ3JhZGUnIH0pKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25KdXN0RG93bmdyYWRlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvbkV4Y2x1ZGVBbmREb3duZ3JhZGUgd2hlbiBFeGNsdWRlIGFuZCBEb3duZ3JhZGUgYnV0dG9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25FeGNsdWRlQW5kRG93bmdyYWRlID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPERvd25ncmFkZVdhcm5pbmdNb2RhbFxuICAgICAgICAgICAgb25DYW5jZWw9e3ZpLmZuKCl9XG4gICAgICAgICAgICBvbkp1c3REb3duZ3JhZGU9e3ZpLmZuKCl9XG4gICAgICAgICAgICBvbkV4Y2x1ZGVBbmREb3duZ3JhZGU9e29uRXhjbHVkZUFuZERvd25ncmFkZX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnRXhjbHVkZSBhbmQgRG93bmdyYWRlJyB9KSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uRXhjbHVkZUFuZERvd25ncmFkZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFBsdWdpblZlcnNpb25QaWNrZXIgKHBsdWdpbi12ZXJzaW9uLXBpY2tlci50c3gpIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUGx1Z2luVmVyc2lvblBpY2tlciAocGx1Z2luLXZlcnNpb24tcGlja2VyLnRzeCknLCAoKSA9PiB7XG4gICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgaXNTaG93OiBmYWxzZSxcbiAgICAgIG9uU2hvd0NoYW5nZTogdmkuZm4oKSxcbiAgICAgIHBsdWdpbklEOiAndGVzdC1wbHVnaW4taWQnLFxuICAgICAgY3VycmVudFZlcnNpb246ICcxLjAuMCcsXG4gICAgICB0cmlnZ2VyOiA8YnV0dG9uPlNlbGVjdCBWZXJzaW9uPC9idXR0b24+LFxuICAgICAgb25TZWxlY3Q6IHZpLmZuKCksXG4gICAgfVxuXG4gICAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgcmVuZGVyIHRyaWdnZXIgZWxlbWVudCcsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UGx1Z2luVmVyc2lvblBpY2tlciB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ1NlbGVjdCBWZXJzaW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBjb250ZW50IHdoZW4gaXNTaG93IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKDxQbHVnaW5WZXJzaW9uUGlja2VyIHsuLi5kZWZhdWx0UHJvcHN9IGlzU2hvdz17ZmFsc2V9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3BvcnRhbC1jb250ZW50JykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciB2ZXJzaW9uIGxpc3Qgd2hlbiBpc1Nob3cgaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcig8UGx1Z2luVmVyc2lvblBpY2tlciB7Li4uZGVmYXVsdFByb3BzfSBpc1Nob3c9e3RydWV9IC8+KVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtY29udGVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTd2l0Y2ggVmVyc2lvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHJlbmRlciBhbGwgdmVyc2lvbnMgZnJvbSBBUEknLCAoKSA9PiB7XG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBsdWdpblZlcnNpb25QaWNrZXIgey4uLmRlZmF1bHRQcm9wc30gaXNTaG93PXt0cnVlfSAvPilcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzEuMC4wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzEuMS4wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJzIuMC4wJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc2hvdyBDVVJSRU5UIGJhZGdlIGZvciBjdXJyZW50IHZlcnNpb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBsdWdpblZlcnNpb25QaWNrZXIgey4uLmRlZmF1bHRQcm9wc30gaXNTaG93PXt0cnVlfSBjdXJyZW50VmVyc2lvbj1cIjEuMC4wXCIgLz4pXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdDVVJSRU5UJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgY2FsbCBvblNob3dDaGFuZ2Ugd2hlbiB0cmlnZ2VyIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25TaG93Q2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBsdWdpblZlcnNpb25QaWNrZXIgey4uLmRlZmF1bHRQcm9wc30gb25TaG93Q2hhbmdlPXtvblNob3dDaGFuZ2V9IC8+KVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwb3J0YWwtdHJpZ2dlcicpKVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25TaG93Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvblNob3dDaGFuZ2Ugd2hlbiB0cmlnZ2VyIGlzIGNsaWNrZWQgYW5kIGRpc2FibGVkIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25TaG93Q2hhbmdlID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoPFBsdWdpblZlcnNpb25QaWNrZXIgey4uLmRlZmF1bHRQcm9wc30gZGlzYWJsZWQ9e3RydWV9IG9uU2hvd0NoYW5nZT17b25TaG93Q2hhbmdlfSAvPilcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncG9ydGFsLXRyaWdnZXInKSlcblxuICAgICAgICAvLyBBc3NlcnRcbiAgICAgICAgZXhwZWN0KG9uU2hvd0NoYW5nZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBjYWxsIG9uU2VsZWN0IHdpdGggY29ycmVjdCBwYXJhbXMgd2hlbiBhIHZlcnNpb24gaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25TZWxlY3QgPSB2aS5mbigpXG4gICAgICAgIGNvbnN0IG9uU2hvd0NoYW5nZSA9IHZpLmZuKClcblxuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgIDxQbHVnaW5WZXJzaW9uUGlja2VyXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgaXNTaG93PXt0cnVlfVxuICAgICAgICAgICAgY3VycmVudFZlcnNpb249XCIxLjAuMFwiXG4gICAgICAgICAgICBvblNlbGVjdD17b25TZWxlY3R9XG4gICAgICAgICAgICBvblNob3dDaGFuZ2U9e29uU2hvd0NoYW5nZX1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuICAgICAgICAvLyBDbGljayBvbiB2ZXJzaW9uIDIuMC4wXG4gICAgICAgIGNvbnN0IHZlcnNpb25FbGVtZW50cyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoL15cXGQrXFwuXFxkK1xcLlxcZCskLylcbiAgICAgICAgY29uc3QgdmVyc2lvbjJFbGVtZW50ID0gdmVyc2lvbkVsZW1lbnRzLmZpbmQoZWwgPT4gZWwudGV4dENvbnRlbnQgPT09ICcyLjAuMCcpXG4gICAgICAgIGlmICh2ZXJzaW9uMkVsZW1lbnQpIHtcbiAgICAgICAgICBmaXJlRXZlbnQuY2xpY2sodmVyc2lvbjJFbGVtZW50LmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpISlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB2ZXJzaW9uOiAnMi4wLjAnLFxuICAgICAgICAgIHVuaXF1ZV9pZGVudGlmaWVyOiAncGx1Z2luLXYyLjAuMCcsXG4gICAgICAgICAgaXNEb3duZ3JhZGU6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgICBleHBlY3Qob25TaG93Q2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSlcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgbm90IGNhbGwgb25TZWxlY3Qgd2hlbiBjbGlja2luZyBvbiBjdXJyZW50IHZlcnNpb24nLCAoKSA9PiB7XG4gICAgICAgIC8vIEFycmFuZ2VcbiAgICAgICAgY29uc3Qgb25TZWxlY3QgPSB2aS5mbigpXG5cbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8UGx1Z2luVmVyc2lvblBpY2tlclxuICAgICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICAgIGlzU2hvdz17dHJ1ZX1cbiAgICAgICAgICAgIGN1cnJlbnRWZXJzaW9uPVwiMS4wLjBcIlxuICAgICAgICAgICAgb25TZWxlY3Q9e29uU2VsZWN0fVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG4gICAgICAgIC8vIENsaWNrIG9uIGN1cnJlbnQgdmVyc2lvbiAxLjAuMFxuICAgICAgICBjb25zdCB2ZXJzaW9uRWxlbWVudHMgPSBzY3JlZW4uZ2V0QWxsQnlUZXh0KC9eXFxkK1xcLlxcZCtcXC5cXGQrJC8pXG4gICAgICAgIGNvbnN0IHZlcnNpb24xRWxlbWVudCA9IHZlcnNpb25FbGVtZW50cy5maW5kKGVsID0+IGVsLnRleHRDb250ZW50ID09PSAnMS4wLjAnKVxuICAgICAgICBpZiAodmVyc2lvbjFFbGVtZW50KSB7XG4gICAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHZlcnNpb24xRWxlbWVudC5jbG9zZXN0KCdkaXZbY2xhc3MqPVwiY3Vyc29yXCJdJykhKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChvblNlbGVjdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBpbmRpY2F0ZSBkb3duZ3JhZGUgd2hlbiBzZWxlY3RpbmcgYSBsb3dlciB2ZXJzaW9uJywgKCkgPT4ge1xuICAgICAgICAvLyBBcnJhbmdlXG4gICAgICAgIGNvbnN0IG9uU2VsZWN0ID0gdmkuZm4oKVxuXG4gICAgICAgIC8vIEFjdFxuICAgICAgICByZW5kZXIoXG4gICAgICAgICAgPFBsdWdpblZlcnNpb25QaWNrZXJcbiAgICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgICBpc1Nob3c9e3RydWV9XG4gICAgICAgICAgICBjdXJyZW50VmVyc2lvbj1cIjIuMC4wXCJcbiAgICAgICAgICAgIG9uU2VsZWN0PXtvblNlbGVjdH1cbiAgICAgICAgICAvPixcbiAgICAgICAgKVxuICAgICAgICAvLyBDbGljayBvbiB2ZXJzaW9uIDEuMC4wIChkb3duZ3JhZGUpXG4gICAgICAgIGNvbnN0IHZlcnNpb25FbGVtZW50cyA9IHNjcmVlbi5nZXRBbGxCeVRleHQoL15cXGQrXFwuXFxkK1xcLlxcZCskLylcbiAgICAgICAgY29uc3QgdmVyc2lvbjFFbGVtZW50ID0gdmVyc2lvbkVsZW1lbnRzLmZpbmQoZWwgPT4gZWwudGV4dENvbnRlbnQgPT09ICcxLjAuMCcpXG4gICAgICAgIGlmICh2ZXJzaW9uMUVsZW1lbnQpIHtcbiAgICAgICAgICBmaXJlRXZlbnQuY2xpY2sodmVyc2lvbjFFbGVtZW50LmNsb3Nlc3QoJ2RpdltjbGFzcyo9XCJjdXJzb3ItcG9pbnRlclwiXScpISlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFzc2VydFxuICAgICAgICBleHBlY3Qob25TZWxlY3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICAgIHVuaXF1ZV9pZGVudGlmaWVyOiAncGx1Z2luLXYxLjAuMCcsXG4gICAgICAgICAgaXNEb3duZ3JhZGU6IHRydWUsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIHN1cHBvcnQgY3VzdG9tIHBsYWNlbWVudCcsICgpID0+IHtcbiAgICAgICAgLy8gQWN0XG4gICAgICAgIHJlbmRlcihcbiAgICAgICAgICA8UGx1Z2luVmVyc2lvblBpY2tlclxuICAgICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICAgIGlzU2hvdz17dHJ1ZX1cbiAgICAgICAgICAgIHBsYWNlbWVudD1cInRvcC1lbmRcIlxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgc3VwcG9ydCBjdXN0b20gb2Zmc2V0JywgKCkgPT4ge1xuICAgICAgICAvLyBBY3RcbiAgICAgICAgcmVuZGVyKFxuICAgICAgICAgIDxQbHVnaW5WZXJzaW9uUGlja2VyXG4gICAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgICAgaXNTaG93PXt0cnVlfVxuICAgICAgICAgICAgb2Zmc2V0PXt7IG1haW5BeGlzOiAxMCwgY3Jvc3NBeGlzOiAyMCB9fVxuICAgICAgICAgIC8+LFxuICAgICAgICApXG5cbiAgICAgICAgLy8gQXNzZXJ0XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BvcnRhbC1lbGVtJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgICBpdCgnc2hvdWxkIGJlIG1lbW9pemVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgICAgZXhwZWN0KFBsdWdpblZlcnNpb25QaWNrZXIpLnRvQmVEZWZpbmVkKClcbiAgICAgICAgZXhwZWN0KChQbHVnaW5WZXJzaW9uUGlja2VyIGFzIGFueSkuJCR0eXBlb2Y/LnRvU3RyaW5nKCkpLnRvQ29udGFpbignU3ltYm9sJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlc1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZ2l0aHViIHVwZGF0ZSB3aXRoIHVuZGVmaW5lZCBwYXlsb2FkIChtb2NrIGhhbmRsZXMgaXQpJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAtIHRoZSBtb2NrZWQgSW5zdGFsbEZyb21HaXRIdWIgaGFuZGxlcyB1bmRlZmluZWQgcGF5bG9hZFxuICAgICAgY29uc3QgcHJvcHM6IFVwZGF0ZVBsdWdpbk1vZGFsVHlwZSA9IHtcbiAgICAgICAgdHlwZTogUGx1Z2luU291cmNlLmdpdGh1YixcbiAgICAgICAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICAgICAgICBnaXRodWI6IHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIFVwZGF0ZUZyb21HaXRIdWJQYXlsb2FkLFxuICAgICAgICBvbkNhbmNlbDogdmkuZm4oKSxcbiAgICAgICAgb25TYXZlOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8VXBkYXRlUGx1Z2luIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydCAtIG1vY2sgY29tcG9uZW50IHJlbmRlcnMgd2l0aCB1bmRlZmluZWQgcGF5bG9hZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mcm9tLWdpdGh1YicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdGhyb3cgZXJyb3Igd2hlbiBtYXJrZXRwbGFjZSBwYXlsb2FkIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzOiBVcGRhdGVQbHVnaW5Nb2RhbFR5cGUgPSB7XG4gICAgICAgIHR5cGU6IFBsdWdpblNvdXJjZS5tYXJrZXRwbGFjZSxcbiAgICAgICAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICAgICAgICBtYXJrZXRQbGFjZTogdW5kZWZpbmVkIGFzIHVua25vd24gYXMgVXBkYXRlRnJvbU1hcmtldFBsYWNlUGF5bG9hZCxcbiAgICAgICAgb25DYW5jZWw6IHZpLmZuKCksXG4gICAgICAgIG9uU2F2ZTogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgLy8gQWN0ICYgQXNzZXJ0IC0gc2hvdWxkIHRocm93IGJlY2F1c2UgcGF5bG9hZCBpcyByZXF1aXJlZFxuICAgICAgZXhwZWN0KCgpID0+IHJlbmRlcldpdGhRdWVyeUNsaWVudCg8VXBkYXRlUGx1Z2luIHsuLi5wcm9wc30gLz4pKS50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdmVyc2lvbiBsaXN0IGluIFBsdWdpblZlcnNpb25QaWNrZXInLCAoKSA9PiB7XG4gICAgICAvLyBPdmVycmlkZSB0aGUgbW9jayB0ZW1wb3JhcmlseVxuICAgICAgdmkubW9ja2VkKHZpLmltcG9ydEFjdHVhbCgnQC9zZXJ2aWNlL3VzZS1wbHVnaW5zJykgYXMgYW55KS51c2VWZXJzaW9uTGlzdE9mUGx1Z2luID0gKCkgPT4gKHtcbiAgICAgICAgZGF0YTogeyBkYXRhOiB7IHZlcnNpb25zOiBbXSB9IH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFBsdWdpblZlcnNpb25QaWNrZXIgey4uLntcbiAgICAgICAgICBpc1Nob3c6IHRydWUsXG4gICAgICAgICAgb25TaG93Q2hhbmdlOiB2aS5mbigpLFxuICAgICAgICAgIHBsdWdpbklEOiAndGVzdCcsXG4gICAgICAgICAgY3VycmVudFZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgICAgdHJpZ2dlcjogPGJ1dHRvbj5TZWxlY3Q8L2J1dHRvbj4sXG4gICAgICAgICAgb25TZWxlY3Q6IHZpLmZuKCksXG4gICAgICAgIH19XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTd2l0Y2ggVmVyc2lvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=