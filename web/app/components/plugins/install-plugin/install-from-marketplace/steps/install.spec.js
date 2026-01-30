"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const react_2 = require("react");
const vitest_1 = require("vitest");
const types_1 = require("../../../types");
const install_1 = require("./install");
// Factory functions for test data
const createMockManifest = (overrides = {}) => ({
    plugin_unique_identifier: 'test-unique-identifier',
    name: 'Test Plugin',
    org: 'test-org',
    icon: 'test-icon.png',
    label: { en_US: 'Test Plugin' },
    category: types_1.PluginCategoryEnum.tool,
    version: '1.0.0',
    latest_version: '1.0.0',
    brief: { en_US: 'A test plugin' },
    introduction: 'Introduction text',
    verified: true,
    install_count: 100,
    badges: [],
    verification: { authorized_category: 'community' },
    from: 'marketplace',
    ...overrides,
});
const createMockPlugin = (overrides = {}) => ({
    type: 'plugin',
    org: 'test-org',
    name: 'Test Plugin',
    plugin_id: 'test-plugin-id',
    version: '1.0.0',
    latest_version: '1.0.0',
    latest_package_identifier: 'test-package-id',
    icon: 'test-icon.png',
    verified: true,
    label: { en_US: 'Test Plugin' },
    brief: { en_US: 'A test plugin' },
    description: { en_US: 'A test plugin description' },
    introduction: 'Introduction text',
    repository: 'https://github.com/test/plugin',
    category: types_1.PluginCategoryEnum.tool,
    install_count: 100,
    endpoint: { settings: [] },
    tags: [],
    badges: [],
    verification: { authorized_category: 'community' },
    from: 'marketplace',
    ...overrides,
});
// Mock variables for controlling test behavior
let mockInstalledInfo;
let mockIsLoading = false;
const mockInstallPackageFromMarketPlace = vitest_1.vi.fn();
const mockUpdatePackageFromMarketPlace = vitest_1.vi.fn();
const mockCheckTaskStatus = vitest_1.vi.fn();
const mockStopTaskStatus = vitest_1.vi.fn();
const mockHandleRefetch = vitest_1.vi.fn();
let mockPluginDeclaration;
let mockCanInstall = true;
let mockLangGeniusVersionInfo = { current_version: '1.0.0' };
// Mock useCheckInstalled
vitest_1.vi.mock('@/app/components/plugins/install-plugin/hooks/use-check-installed', () => ({
    default: ({ pluginIds }) => ({
        installedInfo: mockInstalledInfo,
        isLoading: mockIsLoading,
        error: null,
    }),
}));
// Mock service hooks
vitest_1.vi.mock('@/service/use-plugins', () => ({
    useInstallPackageFromMarketPlace: () => ({
        mutateAsync: mockInstallPackageFromMarketPlace,
    }),
    useUpdatePackageFromMarketPlace: () => ({
        mutateAsync: mockUpdatePackageFromMarketPlace,
    }),
    usePluginDeclarationFromMarketPlace: () => ({
        data: mockPluginDeclaration,
    }),
    usePluginTaskList: () => ({
        handleRefetch: mockHandleRefetch,
    }),
}));
// Mock checkTaskStatus
vitest_1.vi.mock('../../base/check-task-status', () => ({
    default: () => ({
        check: mockCheckTaskStatus,
        stop: mockStopTaskStatus,
    }),
}));
// Mock useAppContext
vitest_1.vi.mock('@/context/app-context', () => ({
    useAppContext: () => ({
        langGeniusVersionInfo: mockLangGeniusVersionInfo,
    }),
}));
// Mock useInstallPluginLimit
vitest_1.vi.mock('../../hooks/use-install-plugin-limit', () => ({
    default: () => ({ canInstall: mockCanInstall }),
}));
// Mock Card component
vitest_1.vi.mock('../../../card', () => ({
    default: ({ payload, titleLeft, className, limitedInstall }) => (<div data-testid="plugin-card">
      <span data-testid="card-payload-name">{payload?.name}</span>
      <span data-testid="card-limited-install">{limitedInstall ? 'true' : 'false'}</span>
      {titleLeft && <div data-testid="card-title-left">{titleLeft}</div>}
    </div>),
}));
// Mock Version component
vitest_1.vi.mock('../../base/version', () => ({
    default: ({ hasInstalled, installedVersion, toInstallVersion }) => (<div data-testid="version-component">
      <span data-testid="has-installed">{hasInstalled ? 'true' : 'false'}</span>
      <span data-testid="installed-version">{installedVersion || 'none'}</span>
      <span data-testid="to-install-version">{toInstallVersion}</span>
    </div>),
}));
// Mock utils
vitest_1.vi.mock('../../utils', () => ({
    pluginManifestInMarketToPluginProps: (payload) => ({
        name: payload.name,
        icon: payload.icon,
        category: payload.category,
    }),
}));
(0, vitest_1.describe)('Install Component (steps/install.tsx)', () => {
    const defaultProps = {
        uniqueIdentifier: 'test-unique-identifier',
        payload: createMockManifest(),
        onCancel: vitest_1.vi.fn(),
        onStartToInstall: vitest_1.vi.fn(),
        onInstalled: vitest_1.vi.fn(),
        onFailed: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockInstalledInfo = undefined;
        mockIsLoading = false;
        mockPluginDeclaration = undefined;
        mockCanInstall = true;
        mockLangGeniusVersionInfo = { current_version: '1.0.0' };
        mockInstallPackageFromMarketPlace.mockResolvedValue({
            all_installed: false,
            task_id: 'task-123',
        });
        mockUpdatePackageFromMarketPlace.mockResolvedValue({
            all_installed: false,
            task_id: 'task-456',
        });
        mockCheckTaskStatus.mockResolvedValue({
            status: types_1.TaskStatus.success,
        });
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render ready to install text', () => {
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.readyToInstall')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render plugin card with correct payload', () => {
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-card')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-payload-name')).toHaveTextContent('Test Plugin');
        });
        (0, vitest_1.it)('should render cancel button when not installing', () => {
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('common.operation.cancel')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render install button', () => {
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.install')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render version component while loading', () => {
            mockIsLoading = true;
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('version-component')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render version component when not loading', () => {
            mockIsLoading = false;
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-component')).toBeInTheDocument();
        });
    });
    // ================================
    // Version Display Tests
    // ================================
    (0, vitest_1.describe)('Version Display', () => {
        (0, vitest_1.it)('should show hasInstalled as false when not installed', () => {
            mockInstalledInfo = undefined;
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('has-installed')).toHaveTextContent('false');
        });
        (0, vitest_1.it)('should show hasInstalled as true when already installed', () => {
            mockInstalledInfo = {
                'test-plugin-id': {
                    installedId: 'install-id',
                    installedVersion: '0.9.0',
                    uniqueIdentifier: 'old-unique-id',
                },
            };
            const plugin = createMockPlugin();
            (0, react_1.render)(<install_1.default {...defaultProps} payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('has-installed')).toHaveTextContent('true');
            (0, vitest_1.expect)(react_1.screen.getByTestId('installed-version')).toHaveTextContent('0.9.0');
        });
        (0, vitest_1.it)('should show correct toInstallVersion from payload.version', () => {
            const manifest = createMockManifest({ version: '2.0.0' });
            (0, react_1.render)(<install_1.default {...defaultProps} payload={manifest}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('to-install-version')).toHaveTextContent('2.0.0');
        });
        (0, vitest_1.it)('should fallback to latest_version when version is undefined', () => {
            const manifest = createMockManifest({ version: undefined, latest_version: '3.0.0' });
            (0, react_1.render)(<install_1.default {...defaultProps} payload={manifest}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('to-install-version')).toHaveTextContent('3.0.0');
        });
    });
    // ================================
    // Version Compatibility Tests
    // ================================
    (0, vitest_1.describe)('Version Compatibility', () => {
        (0, vitest_1.it)('should not show warning when no plugin declaration', () => {
            mockPluginDeclaration = undefined;
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText(/difyVersionNotCompatible/)).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show warning when dify version is compatible', () => {
            mockLangGeniusVersionInfo = { current_version: '2.0.0' };
            mockPluginDeclaration = {
                manifest: { meta: { minimum_dify_version: '1.0.0' } },
            };
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText(/difyVersionNotCompatible/)).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should show warning when dify version is incompatible', () => {
            mockLangGeniusVersionInfo = { current_version: '1.0.0' };
            mockPluginDeclaration = {
                manifest: { meta: { minimum_dify_version: '2.0.0' } },
            };
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText(/plugin.difyVersionNotCompatible/)).toBeInTheDocument();
        });
    });
    // ================================
    // Install Limit Tests
    // ================================
    (0, vitest_1.describe)('Install Limit', () => {
        (0, vitest_1.it)('should pass limitedInstall=false to Card when canInstall is true', () => {
            mockCanInstall = true;
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-limited-install')).toHaveTextContent('false');
        });
        (0, vitest_1.it)('should pass limitedInstall=true to Card when canInstall is false', () => {
            mockCanInstall = false;
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-limited-install')).toHaveTextContent('true');
        });
        (0, vitest_1.it)('should disable install button when canInstall is false', () => {
            mockCanInstall = false;
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            const installBtn = react_1.screen.getByText('plugin.installModal.install').closest('button');
            (0, vitest_1.expect)(installBtn).toBeDisabled();
        });
    });
    // ================================
    // Button States Tests
    // ================================
    (0, vitest_1.describe)('Button States', () => {
        (0, vitest_1.it)('should disable install button when loading', () => {
            mockIsLoading = true;
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            const installBtn = react_1.screen.getByText('plugin.installModal.install').closest('button');
            (0, vitest_1.expect)(installBtn).toBeDisabled();
        });
        (0, vitest_1.it)('should enable install button when not loading and canInstall', () => {
            mockIsLoading = false;
            mockCanInstall = true;
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            const installBtn = react_1.screen.getByText('plugin.installModal.install').closest('button');
            (0, vitest_1.expect)(installBtn).not.toBeDisabled();
        });
    });
    // ================================
    // Cancel Button Tests
    // ================================
    (0, vitest_1.describe)('Cancel Button', () => {
        (0, vitest_1.it)('should call onCancel and stop when cancel is clicked', () => {
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByText('common.operation.cancel'));
            (0, vitest_1.expect)(mockStopTaskStatus).toHaveBeenCalled();
            (0, vitest_1.expect)(defaultProps.onCancel).toHaveBeenCalled();
        });
    });
    // ================================
    // New Installation Flow Tests
    // ================================
    (0, vitest_1.describe)('New Installation Flow', () => {
        (0, vitest_1.it)('should call onStartToInstall when install button is clicked', async () => {
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            (0, vitest_1.expect)(defaultProps.onStartToInstall).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should call installPackageFromMarketPlace for new installation', async () => {
            mockInstalledInfo = undefined;
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockInstallPackageFromMarketPlace).toHaveBeenCalledWith('test-unique-identifier');
            });
        });
        (0, vitest_1.it)('should call onInstalled immediately when all_installed is true', async () => {
            mockInstallPackageFromMarketPlace.mockResolvedValue({
                all_installed: true,
                task_id: 'task-123',
            });
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(defaultProps.onInstalled).toHaveBeenCalled();
                (0, vitest_1.expect)(mockCheckTaskStatus).not.toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should check task status when all_installed is false', async () => {
            mockInstallPackageFromMarketPlace.mockResolvedValue({
                all_installed: false,
                task_id: 'task-123',
            });
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHandleRefetch).toHaveBeenCalled();
                (0, vitest_1.expect)(mockCheckTaskStatus).toHaveBeenCalledWith({
                    taskId: 'task-123',
                    pluginUniqueIdentifier: 'test-unique-identifier',
                });
            });
        });
        (0, vitest_1.it)('should call onInstalled with true when task succeeds', async () => {
            mockCheckTaskStatus.mockResolvedValue({ status: types_1.TaskStatus.success });
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(defaultProps.onInstalled).toHaveBeenCalledWith(true);
            });
        });
        (0, vitest_1.it)('should call onFailed when task fails', async () => {
            mockCheckTaskStatus.mockResolvedValue({
                status: types_1.TaskStatus.failed,
                error: 'Task failed error',
            });
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(defaultProps.onFailed).toHaveBeenCalledWith('Task failed error');
            });
        });
    });
    // ================================
    // Update Installation Flow Tests
    // ================================
    (0, vitest_1.describe)('Update Installation Flow', () => {
        (0, vitest_1.beforeEach)(() => {
            mockInstalledInfo = {
                'test-plugin-id': {
                    installedId: 'install-id',
                    installedVersion: '0.9.0',
                    uniqueIdentifier: 'old-unique-id',
                },
            };
        });
        (0, vitest_1.it)('should call updatePackageFromMarketPlace for update installation', async () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<install_1.default {...defaultProps} payload={plugin}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUpdatePackageFromMarketPlace).toHaveBeenCalledWith({
                    original_plugin_unique_identifier: 'old-unique-id',
                    new_plugin_unique_identifier: 'test-unique-identifier',
                });
            });
        });
        (0, vitest_1.it)('should not call installPackageFromMarketPlace when updating', async () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<install_1.default {...defaultProps} payload={plugin}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockInstallPackageFromMarketPlace).not.toHaveBeenCalled();
            });
        });
    });
    // ================================
    // Auto-Install on Already Installed Tests
    // ================================
    (0, vitest_1.describe)('Auto-Install on Already Installed', () => {
        (0, vitest_1.it)('should call onInstalled when already installed with same uniqueIdentifier', async () => {
            mockInstalledInfo = {
                'test-plugin-id': {
                    installedId: 'install-id',
                    installedVersion: '1.0.0',
                    uniqueIdentifier: 'test-unique-identifier',
                },
            };
            const plugin = createMockPlugin();
            (0, react_1.render)(<install_1.default {...defaultProps} payload={plugin}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(defaultProps.onInstalled).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should not auto-install when uniqueIdentifier differs', async () => {
            mockInstalledInfo = {
                'test-plugin-id': {
                    installedId: 'install-id',
                    installedVersion: '1.0.0',
                    uniqueIdentifier: 'different-unique-id',
                },
            };
            const plugin = createMockPlugin();
            (0, react_1.render)(<install_1.default {...defaultProps} payload={plugin}/>);
            // Wait a bit to ensure onInstalled is not called
            await new Promise(resolve => setTimeout(resolve, 100));
            (0, vitest_1.expect)(defaultProps.onInstalled).not.toHaveBeenCalled();
        });
    });
    // ================================
    // Error Handling Tests
    // ================================
    (0, vitest_1.describe)('Error Handling', () => {
        (0, vitest_1.it)('should call onFailed with string error', async () => {
            mockInstallPackageFromMarketPlace.mockRejectedValue('String error message');
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(defaultProps.onFailed).toHaveBeenCalledWith('String error message');
            });
        });
        (0, vitest_1.it)('should call onFailed without message for non-string error', async () => {
            mockInstallPackageFromMarketPlace.mockRejectedValue(new Error('Error object'));
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(defaultProps.onFailed).toHaveBeenCalledWith();
            });
        });
    });
    // ================================
    // Installing State Tests
    // ================================
    (0, vitest_1.describe)('Installing State', () => {
        (0, vitest_1.it)('should hide cancel button while installing', async () => {
            // Make the install take some time
            mockInstallPackageFromMarketPlace.mockImplementation(() => new Promise(() => { }));
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByText('common.operation.cancel')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should show installing text while installing', async () => {
            mockInstallPackageFromMarketPlace.mockImplementation(() => new Promise(() => { }));
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installing')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should disable install button while installing', async () => {
            mockInstallPackageFromMarketPlace.mockImplementation(() => new Promise(() => { }));
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                const installBtn = react_1.screen.getByText('plugin.installModal.installing').closest('button');
                (0, vitest_1.expect)(installBtn).toBeDisabled();
            });
        });
        (0, vitest_1.it)('should not trigger multiple installs when clicking rapidly', async () => {
            mockInstallPackageFromMarketPlace.mockImplementation(() => new Promise(() => { }));
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            const installBtn = react_1.screen.getByText('plugin.installModal.install').closest('button');
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(installBtn);
            });
            // Wait for the button to be disabled
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(installBtn).toBeDisabled();
            });
            // Try clicking again - should not trigger another install
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(installBtn);
                react_1.fireEvent.click(installBtn);
            });
            (0, vitest_1.expect)(mockInstallPackageFromMarketPlace).toHaveBeenCalledTimes(1);
        });
    });
    // ================================
    // Prop Variations Tests
    // ================================
    (0, vitest_1.describe)('Prop Variations', () => {
        (0, vitest_1.it)('should work with PluginManifestInMarket payload', () => {
            const manifest = createMockManifest({ name: 'Manifest Plugin' });
            (0, react_1.render)(<install_1.default {...defaultProps} payload={manifest}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-payload-name')).toHaveTextContent('Manifest Plugin');
        });
        (0, vitest_1.it)('should work with Plugin payload', () => {
            const plugin = createMockPlugin({ name: 'Plugin Type' });
            (0, react_1.render)(<install_1.default {...defaultProps} payload={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-payload-name')).toHaveTextContent('Plugin Type');
        });
        (0, vitest_1.it)('should work without onStartToInstall callback', async () => {
            const propsWithoutCallback = {
                ...defaultProps,
                onStartToInstall: undefined,
            };
            (0, react_1.render)(<install_1.default {...propsWithoutCallback}/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            // Should not throw and should proceed with installation
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockInstallPackageFromMarketPlace).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should handle different uniqueIdentifier values', async () => {
            (0, react_1.render)(<install_1.default {...defaultProps} uniqueIdentifier="custom-id-123"/>);
            await (0, react_2.act)(async () => {
                react_1.fireEvent.click(react_1.screen.getByText('plugin.installModal.install'));
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockInstallPackageFromMarketPlace).toHaveBeenCalledWith('custom-id-123');
            });
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty plugin_id gracefully', () => {
            const manifest = createMockManifest();
            // Manifest doesn't have plugin_id, so installedInfo won't match
            (0, react_1.render)(<install_1.default {...defaultProps} payload={manifest}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('has-installed')).toHaveTextContent('false');
        });
        (0, vitest_1.it)('should handle undefined installedInfo', () => {
            mockInstalledInfo = undefined;
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('has-installed')).toHaveTextContent('false');
        });
        (0, vitest_1.it)('should handle null current_version in langGeniusVersionInfo', () => {
            mockLangGeniusVersionInfo = { current_version: null };
            mockPluginDeclaration = {
                manifest: { meta: { minimum_dify_version: '1.0.0' } },
            };
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            // Should not show warning when current_version is null (defaults to compatible)
            (0, vitest_1.expect)(react_1.screen.queryByText(/difyVersionNotCompatible/)).not.toBeInTheDocument();
        });
    });
    // ================================
    // Component Memoization Tests
    // ================================
    (0, vitest_1.describe)('Component Memoization', () => {
        (0, vitest_1.it)('should maintain stable component across rerenders with same props', () => {
            const { rerender } = (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-card')).toBeInTheDocument();
            rerender(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-card')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5zdGFsbC5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtEQUEyRTtBQUMzRSxpQ0FBMkI7QUFDM0IsbUNBQTZEO0FBQzdELDBDQUErRDtBQUMvRCx1Q0FBK0I7QUFFL0Isa0NBQWtDO0FBQ2xDLE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxZQUE2QyxFQUFFLEVBQTBCLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZHLHdCQUF3QixFQUFFLHdCQUF3QjtJQUNsRCxJQUFJLEVBQUUsYUFBYTtJQUNuQixHQUFHLEVBQUUsVUFBVTtJQUNmLElBQUksRUFBRSxlQUFlO0lBQ3JCLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQXFDO0lBQ2xFLFFBQVEsRUFBRSwwQkFBa0IsQ0FBQyxJQUFJO0lBQ2pDLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLGNBQWMsRUFBRSxPQUFPO0lBQ3ZCLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQXFDO0lBQ3BFLFlBQVksRUFBRSxtQkFBbUI7SUFDakMsUUFBUSxFQUFFLElBQUk7SUFDZCxhQUFhLEVBQUUsR0FBRztJQUNsQixNQUFNLEVBQUUsRUFBRTtJQUNWLFlBQVksRUFBRSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRTtJQUNsRCxJQUFJLEVBQUUsYUFBYTtJQUNuQixHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRixNQUFNLGdCQUFnQixHQUFHLENBQUMsWUFBNkIsRUFBRSxFQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3JFLElBQUksRUFBRSxRQUFRO0lBQ2QsR0FBRyxFQUFFLFVBQVU7SUFDZixJQUFJLEVBQUUsYUFBYTtJQUNuQixTQUFTLEVBQUUsZ0JBQWdCO0lBQzNCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLGNBQWMsRUFBRSxPQUFPO0lBQ3ZCLHlCQUF5QixFQUFFLGlCQUFpQjtJQUM1QyxJQUFJLEVBQUUsZUFB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QSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7WUFFN0QsUUFBUSxDQUFDLENBQUMsaUJBQU8sQ0FBQyxJQUFJLFlBQVksQ0FBQyxFQUFHLENBQUMsQ0FBQTtZQUV2QyxJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUMvRCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFBsdWdpbiwgUGx1Z2luTWFuaWZlc3RJbk1hcmtldCB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBhY3QgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB7IFBsdWdpbkNhdGVnb3J5RW51bSwgVGFza1N0YXR1cyB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJ1xuaW1wb3J0IEluc3RhbGwgZnJvbSAnLi9pbnN0YWxsJ1xuXG4vLyBGYWN0b3J5IGZ1bmN0aW9ucyBmb3IgdGVzdCBkYXRhXG5jb25zdCBjcmVhdGVNb2NrTWFuaWZlc3QgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFBsdWdpbk1hbmlmZXN0SW5NYXJrZXQ+ID0ge30pOiBQbHVnaW5NYW5pZmVzdEluTWFya2V0ID0+ICh7XG4gIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ3Rlc3QtdW5pcXVlLWlkZW50aWZpZXInLFxuICBuYW1lOiAnVGVzdCBQbHVnaW4nLFxuICBvcmc6ICd0ZXN0LW9yZycsXG4gIGljb246ICd0ZXN0LWljb24ucG5nJyxcbiAgbGFiZWw6IHsgZW5fVVM6ICdUZXN0IFBsdWdpbicgfSBhcyBQbHVnaW5NYW5pZmVzdEluTWFya2V0WydsYWJlbCddLFxuICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gIHZlcnNpb246ICcxLjAuMCcsXG4gIGxhdGVzdF92ZXJzaW9uOiAnMS4wLjAnLFxuICBicmllZjogeyBlbl9VUzogJ0EgdGVzdCBwbHVnaW4nIH0gYXMgUGx1Z2luTWFuaWZlc3RJbk1hcmtldFsnYnJpZWYnXSxcbiAgaW50cm9kdWN0aW9uOiAnSW50cm9kdWN0aW9uIHRleHQnLFxuICB2ZXJpZmllZDogdHJ1ZSxcbiAgaW5zdGFsbF9jb3VudDogMTAwLFxuICBiYWRnZXM6IFtdLFxuICB2ZXJpZmljYXRpb246IHsgYXV0aG9yaXplZF9jYXRlZ29yeTogJ2NvbW11bml0eScgfSxcbiAgZnJvbTogJ21hcmtldHBsYWNlJyxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja1BsdWdpbiA9IChvdmVycmlkZXM6IFBhcnRpYWw8UGx1Z2luPiA9IHt9KTogUGx1Z2luID0+ICh7XG4gIHR5cGU6ICdwbHVnaW4nLFxuICBvcmc6ICd0ZXN0LW9yZycsXG4gIG5hbWU6ICdUZXN0IFBsdWdpbicsXG4gIHBsdWdpbl9pZDogJ3Rlc3QtcGx1Z2luLWlkJyxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgbGF0ZXN0X3ZlcnNpb246ICcxLjAuMCcsXG4gIGxhdGVzdF9wYWNrYWdlX2lkZW50aWZpZXI6ICd0ZXN0LXBhY2thZ2UtaWQnLFxuICBpY29uOiAndGVzdC1pY29uLnBuZycsXG4gIHZlcmlmaWVkOiB0cnVlLFxuICBsYWJlbDogeyBlbl9VUzogJ1Rlc3QgUGx1Z2luJyB9LFxuICBicmllZjogeyBlbl9VUzogJ0EgdGVzdCBwbHVnaW4nIH0sXG4gIGRlc2NyaXB0aW9uOiB7IGVuX1VTOiAnQSB0ZXN0IHBsdWdpbiBkZXNjcmlwdGlvbicgfSxcbiAgaW50cm9kdWN0aW9uOiAnSW50cm9kdWN0aW9uIHRleHQnLFxuICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9naXRodWIuY29tL3Rlc3QvcGx1Z2luJyxcbiAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICBpbnN0YWxsX2NvdW50OiAxMDAsXG4gIGVuZHBvaW50OiB7IHNldHRpbmdzOiBbXSB9LFxuICB0YWdzOiBbXSxcbiAgYmFkZ2VzOiBbXSxcbiAgdmVyaWZpY2F0aW9uOiB7IGF1dGhvcml6ZWRfY2F0ZWdvcnk6ICdjb21tdW5pdHknIH0sXG4gIGZyb206ICdtYXJrZXRwbGFjZScsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vIE1vY2sgdmFyaWFibGVzIGZvciBjb250cm9sbGluZyB0ZXN0IGJlaGF2aW9yXG5sZXQgbW9ja0luc3RhbGxlZEluZm86IFJlY29yZDxzdHJpbmcsIHsgaW5zdGFsbGVkSWQ6IHN0cmluZywgaW5zdGFsbGVkVmVyc2lvbjogc3RyaW5nLCB1bmlxdWVJZGVudGlmaWVyOiBzdHJpbmcgfT4gfCB1bmRlZmluZWRcbmxldCBtb2NrSXNMb2FkaW5nID0gZmFsc2VcbmNvbnN0IG1vY2tJbnN0YWxsUGFja2FnZUZyb21NYXJrZXRQbGFjZSA9IHZpLmZuKClcbmNvbnN0IG1vY2tVcGRhdGVQYWNrYWdlRnJvbU1hcmtldFBsYWNlID0gdmkuZm4oKVxuY29uc3QgbW9ja0NoZWNrVGFza1N0YXR1cyA9IHZpLmZuKClcbmNvbnN0IG1vY2tTdG9wVGFza1N0YXR1cyA9IHZpLmZuKClcbmNvbnN0IG1vY2tIYW5kbGVSZWZldGNoID0gdmkuZm4oKVxubGV0IG1vY2tQbHVnaW5EZWNsYXJhdGlvbjogeyBtYW5pZmVzdDogeyBtZXRhOiB7IG1pbmltdW1fZGlmeV92ZXJzaW9uOiBzdHJpbmcgfSB9IH0gfCB1bmRlZmluZWRcbmxldCBtb2NrQ2FuSW5zdGFsbCA9IHRydWVcbmxldCBtb2NrTGFuZ0dlbml1c1ZlcnNpb25JbmZvID0geyBjdXJyZW50X3ZlcnNpb246ICcxLjAuMCcgfVxuXG4vLyBNb2NrIHVzZUNoZWNrSW5zdGFsbGVkXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvaW5zdGFsbC1wbHVnaW4vaG9va3MvdXNlLWNoZWNrLWluc3RhbGxlZCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IHBsdWdpbklkcyB9OiB7IHBsdWdpbklkczogc3RyaW5nW10sIGVuYWJsZWQ6IGJvb2xlYW4gfSkgPT4gKHtcbiAgICBpbnN0YWxsZWRJbmZvOiBtb2NrSW5zdGFsbGVkSW5mbyxcbiAgICBpc0xvYWRpbmc6IG1vY2tJc0xvYWRpbmcsXG4gICAgZXJyb3I6IG51bGwsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgc2VydmljZSBob29rc1xudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1wbHVnaW5zJywgKCkgPT4gKHtcbiAgdXNlSW5zdGFsbFBhY2thZ2VGcm9tTWFya2V0UGxhY2U6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IG1vY2tJbnN0YWxsUGFja2FnZUZyb21NYXJrZXRQbGFjZSxcbiAgfSksXG4gIHVzZVVwZGF0ZVBhY2thZ2VGcm9tTWFya2V0UGxhY2U6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IG1vY2tVcGRhdGVQYWNrYWdlRnJvbU1hcmtldFBsYWNlLFxuICB9KSxcbiAgdXNlUGx1Z2luRGVjbGFyYXRpb25Gcm9tTWFya2V0UGxhY2U6ICgpID0+ICh7XG4gICAgZGF0YTogbW9ja1BsdWdpbkRlY2xhcmF0aW9uLFxuICB9KSxcbiAgdXNlUGx1Z2luVGFza0xpc3Q6ICgpID0+ICh7XG4gICAgaGFuZGxlUmVmZXRjaDogbW9ja0hhbmRsZVJlZmV0Y2gsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgY2hlY2tUYXNrU3RhdHVzXG52aS5tb2NrKCcuLi8uLi9iYXNlL2NoZWNrLXRhc2stc3RhdHVzJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gKHtcbiAgICBjaGVjazogbW9ja0NoZWNrVGFza1N0YXR1cyxcbiAgICBzdG9wOiBtb2NrU3RvcFRhc2tTdGF0dXMsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgdXNlQXBwQ29udGV4dFxudmkubW9jaygnQC9jb250ZXh0L2FwcC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlQXBwQ29udGV4dDogKCkgPT4gKHtcbiAgICBsYW5nR2VuaXVzVmVyc2lvbkluZm86IG1vY2tMYW5nR2VuaXVzVmVyc2lvbkluZm8sXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgdXNlSW5zdGFsbFBsdWdpbkxpbWl0XG52aS5tb2NrKCcuLi8uLi9ob29rcy91c2UtaW5zdGFsbC1wbHVnaW4tbGltaXQnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiAoeyBjYW5JbnN0YWxsOiBtb2NrQ2FuSW5zdGFsbCB9KSxcbn0pKVxuXG4vLyBNb2NrIENhcmQgY29tcG9uZW50XG52aS5tb2NrKCcuLi8uLi8uLi9jYXJkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgcGF5bG9hZCwgdGl0bGVMZWZ0LCBjbGFzc05hbWUsIGxpbWl0ZWRJbnN0YWxsIH06IHtcbiAgICBwYXlsb2FkOiBhbnlcbiAgICB0aXRsZUxlZnQ/OiBSZWFjdC5SZWFjdE5vZGVcbiAgICBjbGFzc05hbWU/OiBzdHJpbmdcbiAgICBsaW1pdGVkSW5zdGFsbD86IGJvb2xlYW5cbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJwbHVnaW4tY2FyZFwiPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJjYXJkLXBheWxvYWQtbmFtZVwiPntwYXlsb2FkPy5uYW1lfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiY2FyZC1saW1pdGVkLWluc3RhbGxcIj57bGltaXRlZEluc3RhbGwgPyAndHJ1ZScgOiAnZmFsc2UnfTwvc3Bhbj5cbiAgICAgIHt0aXRsZUxlZnQgJiYgPGRpdiBkYXRhLXRlc3RpZD1cImNhcmQtdGl0bGUtbGVmdFwiPnt0aXRsZUxlZnR9PC9kaXY+fVxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgVmVyc2lvbiBjb21wb25lbnRcbnZpLm1vY2soJy4uLy4uL2Jhc2UvdmVyc2lvbicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGhhc0luc3RhbGxlZCwgaW5zdGFsbGVkVmVyc2lvbiwgdG9JbnN0YWxsVmVyc2lvbiB9OiB7XG4gICAgaGFzSW5zdGFsbGVkOiBib29sZWFuXG4gICAgaW5zdGFsbGVkVmVyc2lvbj86IHN0cmluZ1xuICAgIHRvSW5zdGFsbFZlcnNpb246IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInZlcnNpb24tY29tcG9uZW50XCI+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImhhcy1pbnN0YWxsZWRcIj57aGFzSW5zdGFsbGVkID8gJ3RydWUnIDogJ2ZhbHNlJ308L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImluc3RhbGxlZC12ZXJzaW9uXCI+e2luc3RhbGxlZFZlcnNpb24gfHwgJ25vbmUnfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwidG8taW5zdGFsbC12ZXJzaW9uXCI+e3RvSW5zdGFsbFZlcnNpb259PC9zcGFuPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgdXRpbHNcbnZpLm1vY2soJy4uLy4uL3V0aWxzJywgKCkgPT4gKHtcbiAgcGx1Z2luTWFuaWZlc3RJbk1hcmtldFRvUGx1Z2luUHJvcHM6IChwYXlsb2FkOiBQbHVnaW5NYW5pZmVzdEluTWFya2V0KSA9PiAoe1xuICAgIG5hbWU6IHBheWxvYWQubmFtZSxcbiAgICBpY29uOiBwYXlsb2FkLmljb24sXG4gICAgY2F0ZWdvcnk6IHBheWxvYWQuY2F0ZWdvcnksXG4gIH0pLFxufSkpXG5cbmRlc2NyaWJlKCdJbnN0YWxsIENvbXBvbmVudCAoc3RlcHMvaW5zdGFsbC50c3gpJywgKCkgPT4ge1xuICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgdW5pcXVlSWRlbnRpZmllcjogJ3Rlc3QtdW5pcXVlLWlkZW50aWZpZXInLFxuICAgIHBheWxvYWQ6IGNyZWF0ZU1vY2tNYW5pZmVzdCgpLFxuICAgIG9uQ2FuY2VsOiB2aS5mbigpLFxuICAgIG9uU3RhcnRUb0luc3RhbGw6IHZpLmZuKCksXG4gICAgb25JbnN0YWxsZWQ6IHZpLmZuKCksXG4gICAgb25GYWlsZWQ6IHZpLmZuKCksXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrSW5zdGFsbGVkSW5mbyA9IHVuZGVmaW5lZFxuICAgIG1vY2tJc0xvYWRpbmcgPSBmYWxzZVxuICAgIG1vY2tQbHVnaW5EZWNsYXJhdGlvbiA9IHVuZGVmaW5lZFxuICAgIG1vY2tDYW5JbnN0YWxsID0gdHJ1ZVxuICAgIG1vY2tMYW5nR2VuaXVzVmVyc2lvbkluZm8gPSB7IGN1cnJlbnRfdmVyc2lvbjogJzEuMC4wJyB9XG4gICAgbW9ja0luc3RhbGxQYWNrYWdlRnJvbU1hcmtldFBsYWNlLm1vY2tSZXNvbHZlZFZhbHVlKHtcbiAgICAgIGFsbF9pbnN0YWxsZWQ6IGZhbHNlLFxuICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICB9KVxuICAgIG1vY2tVcGRhdGVQYWNrYWdlRnJvbU1hcmtldFBsYWNlLm1vY2tSZXNvbHZlZFZhbHVlKHtcbiAgICAgIGFsbF9pbnN0YWxsZWQ6IGZhbHNlLFxuICAgICAgdGFza19pZDogJ3Rhc2stNDU2JyxcbiAgICB9KVxuICAgIG1vY2tDaGVja1Rhc2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWUoe1xuICAgICAgc3RhdHVzOiBUYXNrU3RhdHVzLnN1Y2Nlc3MsXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciByZWFkeSB0byBpbnN0YWxsIHRleHQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLnJlYWR5VG9JbnN0YWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGx1Z2luIGNhcmQgd2l0aCBjb3JyZWN0IHBheWxvYWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbi1jYXJkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhcmQtcGF5bG9hZC1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdUZXN0IFBsdWdpbicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNhbmNlbCBidXR0b24gd2hlbiBub3QgaW5zdGFsbGluZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgaW5zdGFsbCBidXR0b24nLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgdmVyc2lvbiBjb21wb25lbnQgd2hpbGUgbG9hZGluZycsICgpID0+IHtcbiAgICAgIG1vY2tJc0xvYWRpbmcgPSB0cnVlXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgndmVyc2lvbi1jb21wb25lbnQnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdmVyc2lvbiBjb21wb25lbnQgd2hlbiBub3QgbG9hZGluZycsICgpID0+IHtcbiAgICAgIG1vY2tJc0xvYWRpbmcgPSBmYWxzZVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd2ZXJzaW9uLWNvbXBvbmVudCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBWZXJzaW9uIERpc3BsYXkgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1ZlcnNpb24gRGlzcGxheScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgaGFzSW5zdGFsbGVkIGFzIGZhbHNlIHdoZW4gbm90IGluc3RhbGxlZCcsICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsZWRJbmZvID0gdW5kZWZpbmVkXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hhcy1pbnN0YWxsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhbHNlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGhhc0luc3RhbGxlZCBhcyB0cnVlIHdoZW4gYWxyZWFkeSBpbnN0YWxsZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrSW5zdGFsbGVkSW5mbyA9IHtcbiAgICAgICAgJ3Rlc3QtcGx1Z2luLWlkJzoge1xuICAgICAgICAgIGluc3RhbGxlZElkOiAnaW5zdGFsbC1pZCcsXG4gICAgICAgICAgaW5zdGFsbGVkVmVyc2lvbjogJzAuOS4wJyxcbiAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyOiAnb2xkLXVuaXF1ZS1pZCcsXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKClcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwbHVnaW59IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdoYXMtaW5zdGFsbGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC12ZXJzaW9uJykpLnRvSGF2ZVRleHRDb250ZW50KCcwLjkuMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBjb3JyZWN0IHRvSW5zdGFsbFZlcnNpb24gZnJvbSBwYXlsb2FkLnZlcnNpb24nLCAoKSA9PiB7XG4gICAgICBjb25zdCBtYW5pZmVzdCA9IGNyZWF0ZU1vY2tNYW5pZmVzdCh7IHZlcnNpb246ICcyLjAuMCcgfSlcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXttYW5pZmVzdH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RvLWluc3RhbGwtdmVyc2lvbicpKS50b0hhdmVUZXh0Q29udGVudCgnMi4wLjAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGZhbGxiYWNrIHRvIGxhdGVzdF92ZXJzaW9uIHdoZW4gdmVyc2lvbiBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtYW5pZmVzdCA9IGNyZWF0ZU1vY2tNYW5pZmVzdCh7IHZlcnNpb246IHVuZGVmaW5lZCBhcyBhbnksIGxhdGVzdF92ZXJzaW9uOiAnMy4wLjAnIH0pXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17bWFuaWZlc3R9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd0by1pbnN0YWxsLXZlcnNpb24nKSkudG9IYXZlVGV4dENvbnRlbnQoJzMuMC4wJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFZlcnNpb24gQ29tcGF0aWJpbGl0eSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVmVyc2lvbiBDb21wYXRpYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IHNob3cgd2FybmluZyB3aGVuIG5vIHBsdWdpbiBkZWNsYXJhdGlvbicsICgpID0+IHtcbiAgICAgIG1vY2tQbHVnaW5EZWNsYXJhdGlvbiA9IHVuZGVmaW5lZFxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9kaWZ5VmVyc2lvbk5vdENvbXBhdGlibGUvKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyB3YXJuaW5nIHdoZW4gZGlmeSB2ZXJzaW9uIGlzIGNvbXBhdGlibGUnLCAoKSA9PiB7XG4gICAgICBtb2NrTGFuZ0dlbml1c1ZlcnNpb25JbmZvID0geyBjdXJyZW50X3ZlcnNpb246ICcyLjAuMCcgfVxuICAgICAgbW9ja1BsdWdpbkRlY2xhcmF0aW9uID0ge1xuICAgICAgICBtYW5pZmVzdDogeyBtZXRhOiB7IG1pbmltdW1fZGlmeV92ZXJzaW9uOiAnMS4wLjAnIH0gfSxcbiAgICAgIH1cbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvZGlmeVZlcnNpb25Ob3RDb21wYXRpYmxlLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyB3YXJuaW5nIHdoZW4gZGlmeSB2ZXJzaW9uIGlzIGluY29tcGF0aWJsZScsICgpID0+IHtcbiAgICAgIG1vY2tMYW5nR2VuaXVzVmVyc2lvbkluZm8gPSB7IGN1cnJlbnRfdmVyc2lvbjogJzEuMC4wJyB9XG4gICAgICBtb2NrUGx1Z2luRGVjbGFyYXRpb24gPSB7XG4gICAgICAgIG1hbmlmZXN0OiB7IG1ldGE6IHsgbWluaW11bV9kaWZ5X3ZlcnNpb246ICcyLjAuMCcgfSB9LFxuICAgICAgfVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcGx1Z2luLmRpZnlWZXJzaW9uTm90Q29tcGF0aWJsZS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnN0YWxsIExpbWl0IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbnN0YWxsIExpbWl0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBsaW1pdGVkSW5zdGFsbD1mYWxzZSB0byBDYXJkIHdoZW4gY2FuSW5zdGFsbCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgbW9ja0Nhbkluc3RhbGwgPSB0cnVlXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhcmQtbGltaXRlZC1pbnN0YWxsJykpLnRvSGF2ZVRleHRDb250ZW50KCdmYWxzZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBsaW1pdGVkSW5zdGFsbD10cnVlIHRvIENhcmQgd2hlbiBjYW5JbnN0YWxsIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgbW9ja0Nhbkluc3RhbGwgPSBmYWxzZVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLWxpbWl0ZWQtaW5zdGFsbCcpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBpbnN0YWxsIGJ1dHRvbiB3aGVuIGNhbkluc3RhbGwgaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICBtb2NrQ2FuSW5zdGFsbCA9IGZhbHNlXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGluc3RhbGxCdG4gPSBzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnKS5jbG9zZXN0KCdidXR0b24nKVxuICAgICAgZXhwZWN0KGluc3RhbGxCdG4pLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBCdXR0b24gU3RhdGVzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdCdXR0b24gU3RhdGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBpbnN0YWxsIGJ1dHRvbiB3aGVuIGxvYWRpbmcnLCAoKSA9PiB7XG4gICAgICBtb2NrSXNMb2FkaW5nID0gdHJ1ZVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCBpbnN0YWxsQnRuID0gc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsJykuY2xvc2VzdCgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChpbnN0YWxsQnRuKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGVuYWJsZSBpbnN0YWxsIGJ1dHRvbiB3aGVuIG5vdCBsb2FkaW5nIGFuZCBjYW5JbnN0YWxsJywgKCkgPT4ge1xuICAgICAgbW9ja0lzTG9hZGluZyA9IGZhbHNlXG4gICAgICBtb2NrQ2FuSW5zdGFsbCA9IHRydWVcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgY29uc3QgaW5zdGFsbEJ0biA9IHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICBleHBlY3QoaW5zdGFsbEJ0bikubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDYW5jZWwgQnV0dG9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDYW5jZWwgQnV0dG9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNhbmNlbCBhbmQgc3RvcCB3aGVuIGNhbmNlbCBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnKSlcblxuICAgICAgZXhwZWN0KG1vY2tTdG9wVGFza1N0YXR1cykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICBleHBlY3QoZGVmYXVsdFByb3BzLm9uQ2FuY2VsKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIE5ldyBJbnN0YWxsYXRpb24gRmxvdyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTmV3IEluc3RhbGxhdGlvbiBGbG93JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvblN0YXJ0VG9JbnN0YWxsIHdoZW4gaW5zdGFsbCBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcpKVxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KGRlZmF1bHRQcm9wcy5vblN0YXJ0VG9JbnN0YWxsKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGluc3RhbGxQYWNrYWdlRnJvbU1hcmtldFBsYWNlIGZvciBuZXcgaW5zdGFsbGF0aW9uJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0luc3RhbGxlZEluZm8gPSB1bmRlZmluZWRcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTWFya2V0UGxhY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd0ZXN0LXVuaXF1ZS1pZGVudGlmaWVyJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkluc3RhbGxlZCBpbW1lZGlhdGVseSB3aGVuIGFsbF9pbnN0YWxsZWQgaXMgdHJ1ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21NYXJrZXRQbGFjZS5tb2NrUmVzb2x2ZWRWYWx1ZSh7XG4gICAgICAgIGFsbF9pbnN0YWxsZWQ6IHRydWUsXG4gICAgICAgIHRhc2tfaWQ6ICd0YXNrLTEyMycsXG4gICAgICB9KVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsJykpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGRlZmF1bHRQcm9wcy5vbkluc3RhbGxlZCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChtb2NrQ2hlY2tUYXNrU3RhdHVzKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNoZWNrIHRhc2sgc3RhdHVzIHdoZW4gYWxsX2luc3RhbGxlZCBpcyBmYWxzZScsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21NYXJrZXRQbGFjZS5tb2NrUmVzb2x2ZWRWYWx1ZSh7XG4gICAgICAgIGFsbF9pbnN0YWxsZWQ6IGZhbHNlLFxuICAgICAgICB0YXNrX2lkOiAndGFzay0xMjMnLFxuICAgICAgfSlcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlUmVmZXRjaCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChtb2NrQ2hlY2tUYXNrU3RhdHVzKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdGFza0lkOiAndGFzay0xMjMnLFxuICAgICAgICAgIHBsdWdpblVuaXF1ZUlkZW50aWZpZXI6ICd0ZXN0LXVuaXF1ZS1pZGVudGlmaWVyJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkluc3RhbGxlZCB3aXRoIHRydWUgd2hlbiB0YXNrIHN1Y2NlZWRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0NoZWNrVGFza1N0YXR1cy5tb2NrUmVzb2x2ZWRWYWx1ZSh7IHN0YXR1czogVGFza1N0YXR1cy5zdWNjZXNzIH0pXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZGVmYXVsdFByb3BzLm9uSW5zdGFsbGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh0cnVlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uRmFpbGVkIHdoZW4gdGFzayBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tDaGVja1Rhc2tTdGF0dXMubW9ja1Jlc29sdmVkVmFsdWUoe1xuICAgICAgICBzdGF0dXM6IFRhc2tTdGF0dXMuZmFpbGVkLFxuICAgICAgICBlcnJvcjogJ1Rhc2sgZmFpbGVkIGVycm9yJyxcbiAgICAgIH0pXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZGVmYXVsdFByb3BzLm9uRmFpbGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnVGFzayBmYWlsZWQgZXJyb3InKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVwZGF0ZSBJbnN0YWxsYXRpb24gRmxvdyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXBkYXRlIEluc3RhbGxhdGlvbiBGbG93JywgKCkgPT4ge1xuICAgIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgICAgbW9ja0luc3RhbGxlZEluZm8gPSB7XG4gICAgICAgICd0ZXN0LXBsdWdpbi1pZCc6IHtcbiAgICAgICAgICBpbnN0YWxsZWRJZDogJ2luc3RhbGwtaWQnLFxuICAgICAgICAgIGluc3RhbGxlZFZlcnNpb246ICcwLjkuMCcsXG4gICAgICAgICAgdW5pcXVlSWRlbnRpZmllcjogJ29sZC11bmlxdWUtaWQnLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgdXBkYXRlUGFja2FnZUZyb21NYXJrZXRQbGFjZSBmb3IgdXBkYXRlIGluc3RhbGxhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oKVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BsdWdpbn0gLz4pXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1VwZGF0ZVBhY2thZ2VGcm9tTWFya2V0UGxhY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICBvcmlnaW5hbF9wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICdvbGQtdW5pcXVlLWlkJyxcbiAgICAgICAgICBuZXdfcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC11bmlxdWUtaWRlbnRpZmllcicsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIGluc3RhbGxQYWNrYWdlRnJvbU1hcmtldFBsYWNlIHdoZW4gdXBkYXRpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW4gPSBjcmVhdGVNb2NrUGx1Z2luKClcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwbHVnaW59IC8+KVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsJykpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tJbnN0YWxsUGFja2FnZUZyb21NYXJrZXRQbGFjZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEF1dG8tSW5zdGFsbCBvbiBBbHJlYWR5IEluc3RhbGxlZCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQXV0by1JbnN0YWxsIG9uIEFscmVhZHkgSW5zdGFsbGVkJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkluc3RhbGxlZCB3aGVuIGFscmVhZHkgaW5zdGFsbGVkIHdpdGggc2FtZSB1bmlxdWVJZGVudGlmaWVyJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0luc3RhbGxlZEluZm8gPSB7XG4gICAgICAgICd0ZXN0LXBsdWdpbi1pZCc6IHtcbiAgICAgICAgICBpbnN0YWxsZWRJZDogJ2luc3RhbGwtaWQnLFxuICAgICAgICAgIGluc3RhbGxlZFZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgICAgdW5pcXVlSWRlbnRpZmllcjogJ3Rlc3QtdW5pcXVlLWlkZW50aWZpZXInLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbigpXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChkZWZhdWx0UHJvcHMub25JbnN0YWxsZWQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgYXV0by1pbnN0YWxsIHdoZW4gdW5pcXVlSWRlbnRpZmllciBkaWZmZXJzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0luc3RhbGxlZEluZm8gPSB7XG4gICAgICAgICd0ZXN0LXBsdWdpbi1pZCc6IHtcbiAgICAgICAgICBpbnN0YWxsZWRJZDogJ2luc3RhbGwtaWQnLFxuICAgICAgICAgIGluc3RhbGxlZFZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgICAgdW5pcXVlSWRlbnRpZmllcjogJ2RpZmZlcmVudC11bmlxdWUtaWQnLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbigpXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGx1Z2lufSAvPilcblxuICAgICAgLy8gV2FpdCBhIGJpdCB0byBlbnN1cmUgb25JbnN0YWxsZWQgaXMgbm90IGNhbGxlZFxuICAgICAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMCkpXG4gICAgICBleHBlY3QoZGVmYXVsdFByb3BzLm9uSW5zdGFsbGVkKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFcnJvciBIYW5kbGluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uRmFpbGVkIHdpdGggc3RyaW5nIGVycm9yJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0luc3RhbGxQYWNrYWdlRnJvbU1hcmtldFBsYWNlLm1vY2tSZWplY3RlZFZhbHVlKCdTdHJpbmcgZXJyb3IgbWVzc2FnZScpXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnKSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZGVmYXVsdFByb3BzLm9uRmFpbGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnU3RyaW5nIGVycm9yIG1lc3NhZ2UnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uRmFpbGVkIHdpdGhvdXQgbWVzc2FnZSBmb3Igbm9uLXN0cmluZyBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21NYXJrZXRQbGFjZS5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ0Vycm9yIG9iamVjdCcpKVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsJykpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KGRlZmF1bHRQcm9wcy5vbkZhaWxlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEluc3RhbGxpbmcgU3RhdGUgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0luc3RhbGxpbmcgU3RhdGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoaWRlIGNhbmNlbCBidXR0b24gd2hpbGUgaW5zdGFsbGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIE1ha2UgdGhlIGluc3RhbGwgdGFrZSBzb21lIHRpbWVcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21NYXJrZXRQbGFjZS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gbmV3IFByb21pc2UoKCkgPT4ge30pKVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsJykpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBpbnN0YWxsaW5nIHRleHQgd2hpbGUgaW5zdGFsbGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21NYXJrZXRQbGFjZS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gbmV3IFByb21pc2UoKCkgPT4ge30pKVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsJykpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc2FibGUgaW5zdGFsbCBidXR0b24gd2hpbGUgaW5zdGFsbGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21NYXJrZXRQbGFjZS5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gbmV3IFByb21pc2UoKCkgPT4ge30pKVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsJykpXG4gICAgICB9KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgY29uc3QgaW5zdGFsbEJ0biA9IHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbGluZycpLmNsb3Nlc3QoJ2J1dHRvbicpXG4gICAgICAgIGV4cGVjdChpbnN0YWxsQnRuKS50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgdHJpZ2dlciBtdWx0aXBsZSBpbnN0YWxscyB3aGVuIGNsaWNraW5nIHJhcGlkbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTWFya2V0UGxhY2UubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IG5ldyBQcm9taXNlKCgpID0+IHt9KSlcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgY29uc3QgaW5zdGFsbEJ0biA9IHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcpLmNsb3Nlc3QoJ2J1dHRvbicpIVxuXG4gICAgICBhd2FpdCBhY3QoYXN5bmMgKCkgPT4ge1xuICAgICAgICBmaXJlRXZlbnQuY2xpY2soaW5zdGFsbEJ0bilcbiAgICAgIH0pXG5cbiAgICAgIC8vIFdhaXQgZm9yIHRoZSBidXR0b24gdG8gYmUgZGlzYWJsZWRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoaW5zdGFsbEJ0bikudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFRyeSBjbGlja2luZyBhZ2FpbiAtIHNob3VsZCBub3QgdHJpZ2dlciBhbm90aGVyIGluc3RhbGxcbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhpbnN0YWxsQnRuKVxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soaW5zdGFsbEJ0bilcbiAgICAgIH0pXG5cbiAgICAgIGV4cGVjdChtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTWFya2V0UGxhY2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcCBWYXJpYXRpb25zIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wIFZhcmlhdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggUGx1Z2luTWFuaWZlc3RJbk1hcmtldCBwYXlsb2FkJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWFuaWZlc3QgPSBjcmVhdGVNb2NrTWFuaWZlc3QoeyBuYW1lOiAnTWFuaWZlc3QgUGx1Z2luJyB9KVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e21hbmlmZXN0fSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2FyZC1wYXlsb2FkLW5hbWUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ01hbmlmZXN0IFBsdWdpbicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgd29yayB3aXRoIFBsdWdpbiBwYXlsb2FkJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2luID0gY3JlYXRlTW9ja1BsdWdpbih7IG5hbWU6ICdQbHVnaW4gVHlwZScgfSlcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtwbHVnaW59IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLXBheWxvYWQtbmFtZScpKS50b0hhdmVUZXh0Q29udGVudCgnUGx1Z2luIFR5cGUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHdvcmsgd2l0aG91dCBvblN0YXJ0VG9JbnN0YWxsIGNhbGxiYWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvcHNXaXRob3V0Q2FsbGJhY2sgPSB7XG4gICAgICAgIC4uLmRlZmF1bHRQcm9wcyxcbiAgICAgICAgb25TdGFydFRvSW5zdGFsbDogdW5kZWZpbmVkLFxuICAgICAgfVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5wcm9wc1dpdGhvdXRDYWxsYmFja30gLz4pXG5cbiAgICAgIGF3YWl0IGFjdChhc3luYyAoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnKSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNob3VsZCBub3QgdGhyb3cgYW5kIHNob3VsZCBwcm9jZWVkIHdpdGggaW5zdGFsbGF0aW9uXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tJbnN0YWxsUGFja2FnZUZyb21NYXJrZXRQbGFjZSkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkaWZmZXJlbnQgdW5pcXVlSWRlbnRpZmllciB2YWx1ZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gdW5pcXVlSWRlbnRpZmllcj1cImN1c3RvbS1pZC0xMjNcIiAvPilcblxuICAgICAgYXdhaXQgYWN0KGFzeW5jICgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcpKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTWFya2V0UGxhY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdjdXN0b20taWQtMTIzJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHBsdWdpbl9pZCBncmFjZWZ1bGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgbWFuaWZlc3QgPSBjcmVhdGVNb2NrTWFuaWZlc3QoKVxuICAgICAgLy8gTWFuaWZlc3QgZG9lc24ndCBoYXZlIHBsdWdpbl9pZCwgc28gaW5zdGFsbGVkSW5mbyB3b24ndCBtYXRjaFxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e21hbmlmZXN0fSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaGFzLWluc3RhbGxlZCcpKS50b0hhdmVUZXh0Q29udGVudCgnZmFsc2UnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgaW5zdGFsbGVkSW5mbycsICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsZWRJbmZvID0gdW5kZWZpbmVkXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2hhcy1pbnN0YWxsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhbHNlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbnVsbCBjdXJyZW50X3ZlcnNpb24gaW4gbGFuZ0dlbml1c1ZlcnNpb25JbmZvJywgKCkgPT4ge1xuICAgICAgbW9ja0xhbmdHZW5pdXNWZXJzaW9uSW5mbyA9IHsgY3VycmVudF92ZXJzaW9uOiBudWxsIGFzIGFueSB9XG4gICAgICBtb2NrUGx1Z2luRGVjbGFyYXRpb24gPSB7XG4gICAgICAgIG1hbmlmZXN0OiB7IG1ldGE6IHsgbWluaW11bV9kaWZ5X3ZlcnNpb246ICcxLjAuMCcgfSB9LFxuICAgICAgfVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBTaG91bGQgbm90IHNob3cgd2FybmluZyB3aGVuIGN1cnJlbnRfdmVyc2lvbiBpcyBudWxsIChkZWZhdWx0cyB0byBjb21wYXRpYmxlKVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvZGlmeVZlcnNpb25Ob3RDb21wYXRpYmxlLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDb21wb25lbnQgTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIHN0YWJsZSBjb21wb25lbnQgYWNyb3NzIHJlcmVuZGVycyB3aXRoIHNhbWUgcHJvcHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbi1jYXJkJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgcmVyZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbi1jYXJkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==