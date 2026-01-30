"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("../../../types");
const install_1 = require("./install");
// Factory function for test data
const createMockManifest = (overrides = {}) => ({
    plugin_unique_identifier: 'test-plugin-uid',
    version: '1.0.0',
    author: 'test-author',
    icon: 'test-icon.png',
    name: 'Test Plugin',
    category: types_1.PluginCategoryEnum.tool,
    label: { 'en-US': 'Test Plugin' },
    description: { 'en-US': 'A test plugin' },
    created_at: '2024-01-01T00:00:00Z',
    resource: {},
    plugins: [],
    verified: true,
    endpoint: { settings: [], endpoints: [] },
    model: null,
    tags: [],
    agent_strategy: null,
    meta: { version: '1.0.0', minimum_dify_version: '0.8.0' },
    trigger: {},
    ...overrides,
});
// Mock external dependencies
const mockUseCheckInstalled = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/plugins/install-plugin/hooks/use-check-installed', () => ({
    default: () => mockUseCheckInstalled(),
}));
const mockInstallPackageFromLocal = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/use-plugins', () => ({
    useInstallPackageFromLocal: () => ({
        mutateAsync: mockInstallPackageFromLocal,
    }),
    usePluginTaskList: () => ({
        handleRefetch: vitest_1.vi.fn(),
    }),
}));
const mockUninstallPlugin = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/plugins', () => ({
    uninstallPlugin: (...args) => mockUninstallPlugin(...args),
}));
const mockCheck = vitest_1.vi.fn();
const mockStop = vitest_1.vi.fn();
vitest_1.vi.mock('../../base/check-task-status', () => ({
    default: () => ({
        check: mockCheck,
        stop: mockStop,
    }),
}));
const mockLangGeniusVersionInfo = { current_version: '1.0.0' };
vitest_1.vi.mock('@/context/app-context', () => ({
    useAppContext: () => ({
        langGeniusVersionInfo: mockLangGeniusVersionInfo,
    }),
}));
vitest_1.vi.mock('react-i18next', async (importOriginal) => {
    const actual = await importOriginal();
    const { createReactI18nextMock } = await Promise.resolve().then(() => require('@/test/i18n-mock'));
    return {
        ...actual,
        ...createReactI18nextMock(),
        Trans: ({ i18nKey, components }) => (<span data-testid="trans">
        {i18nKey}
        {components?.trustSource}
      </span>),
    };
});
vitest_1.vi.mock('../../../card', () => ({
    default: ({ payload, titleLeft }) => (<div data-testid="card">
      <span data-testid="card-name">{payload?.name}</span>
      <div data-testid="card-title-left">{titleLeft}</div>
    </div>),
}));
vitest_1.vi.mock('../../base/version', () => ({
    default: ({ hasInstalled, installedVersion, toInstallVersion }) => (<div data-testid="version">
      <span data-testid="version-has-installed">{hasInstalled ? 'true' : 'false'}</span>
      <span data-testid="version-installed">{installedVersion || 'null'}</span>
      <span data-testid="version-to-install">{toInstallVersion}</span>
    </div>),
}));
vitest_1.vi.mock('../../utils', () => ({
    pluginManifestToCardPluginProps: (manifest) => ({
        name: manifest.name,
        author: manifest.author,
        version: manifest.version,
    }),
}));
(0, vitest_1.describe)('Install', () => {
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
        mockUseCheckInstalled.mockReturnValue({
            installedInfo: null,
            isLoading: false,
        });
        mockInstallPackageFromLocal.mockReset();
        mockUninstallPlugin.mockReset();
        mockCheck.mockReset();
        mockStop.mockReset();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render ready to install message', () => {
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.readyToInstall')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render trust source message', () => {
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('trans')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render plugin card', () => {
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-name')).toHaveTextContent('Test Plugin');
        });
        (0, vitest_1.it)('should render cancel button', () => {
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'common.operation.cancel' })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render install button', () => {
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show version component when not loading', () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: null,
                isLoading: false,
            });
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('version')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not show version component when loading', () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: null,
                isLoading: true,
            });
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.queryByTestId('version')).not.toBeInTheDocument();
        });
    });
    // ================================
    // Version Display Tests
    // ================================
    (0, vitest_1.describe)('Version Display', () => {
        (0, vitest_1.it)('should display toInstallVersion from payload', () => {
            const payload = createMockManifest({ version: '2.0.0' });
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: null,
                isLoading: false,
            });
            (0, react_1.render)(<install_1.default {...defaultProps} payload={payload}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-to-install')).toHaveTextContent('2.0.0');
        });
        (0, vitest_1.it)('should display hasInstalled=false when not installed', () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: null,
                isLoading: false,
            });
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-has-installed')).toHaveTextContent('false');
        });
        (0, vitest_1.it)('should display hasInstalled=true when already installed', () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: {
                    'test-author/Test Plugin': {
                        installedVersion: '0.9.0',
                        installedId: 'installed-id',
                        uniqueIdentifier: 'old-uid',
                    },
                },
                isLoading: false,
            });
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-has-installed')).toHaveTextContent('true');
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-installed')).toHaveTextContent('0.9.0');
        });
    });
    // ================================
    // Install Button State Tests
    // ================================
    (0, vitest_1.describe)('Install Button State', () => {
        (0, vitest_1.it)('should disable install button when loading', () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: null,
                isLoading: true,
            });
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' })).toBeDisabled();
        });
        (0, vitest_1.it)('should enable install button when not loading', () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: null,
                isLoading: false,
            });
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' })).not.toBeDisabled();
        });
    });
    // ================================
    // Cancel Button Tests
    // ================================
    (0, vitest_1.describe)('Cancel Button', () => {
        (0, vitest_1.it)('should call onCancel and stop when cancel button is clicked', () => {
            const onCancel = vitest_1.vi.fn();
            (0, react_1.render)(<install_1.default {...defaultProps} onCancel={onCancel}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.cancel' }));
            (0, vitest_1.expect)(mockStop).toHaveBeenCalled();
            (0, vitest_1.expect)(onCancel).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should hide cancel button when installing', async () => {
            mockInstallPackageFromLocal.mockImplementation(() => new Promise(() => { }));
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByRole('button', { name: 'common.operation.cancel' })).not.toBeInTheDocument();
            });
        });
    });
    // ================================
    // Installation Flow Tests
    // ================================
    (0, vitest_1.describe)('Installation Flow', () => {
        (0, vitest_1.it)('should call onStartToInstall when install button is clicked', async () => {
            mockInstallPackageFromLocal.mockResolvedValue({
                all_installed: true,
                task_id: 'task-123',
            });
            const onStartToInstall = vitest_1.vi.fn();
            (0, react_1.render)(<install_1.default {...defaultProps} onStartToInstall={onStartToInstall}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onStartToInstall).toHaveBeenCalledTimes(1);
            });
        });
        (0, vitest_1.it)('should call onInstalled when all_installed is true', async () => {
            mockInstallPackageFromLocal.mockResolvedValue({
                all_installed: true,
                task_id: 'task-123',
            });
            const onInstalled = vitest_1.vi.fn();
            (0, react_1.render)(<install_1.default {...defaultProps} onInstalled={onInstalled}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onInstalled).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should check task status when all_installed is false', async () => {
            mockInstallPackageFromLocal.mockResolvedValue({
                all_installed: false,
                task_id: 'task-123',
            });
            mockCheck.mockResolvedValue({ status: types_1.TaskStatus.success, error: null });
            const onInstalled = vitest_1.vi.fn();
            (0, react_1.render)(<install_1.default {...defaultProps} onInstalled={onInstalled}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCheck).toHaveBeenCalledWith({
                    taskId: 'task-123',
                    pluginUniqueIdentifier: 'test-unique-identifier',
                });
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onInstalled).toHaveBeenCalledWith(true);
            });
        });
        (0, vitest_1.it)('should call onFailed when task status is failed', async () => {
            mockInstallPackageFromLocal.mockResolvedValue({
                all_installed: false,
                task_id: 'task-123',
            });
            mockCheck.mockResolvedValue({ status: types_1.TaskStatus.failed, error: 'Task failed error' });
            const onFailed = vitest_1.vi.fn();
            (0, react_1.render)(<install_1.default {...defaultProps} onFailed={onFailed}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith('Task failed error');
            });
        });
        (0, vitest_1.it)('should uninstall existing plugin before installing new version', async () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: {
                    'test-author/Test Plugin': {
                        installedVersion: '0.9.0',
                        installedId: 'installed-id-to-uninstall',
                        uniqueIdentifier: 'old-uid',
                    },
                },
                isLoading: false,
            });
            mockUninstallPlugin.mockResolvedValue({});
            mockInstallPackageFromLocal.mockResolvedValue({
                all_installed: true,
                task_id: 'task-123',
            });
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUninstallPlugin).toHaveBeenCalledWith('installed-id-to-uninstall');
            });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockInstallPackageFromLocal).toHaveBeenCalled();
            });
        });
    });
    // ================================
    // Error Handling Tests
    // ================================
    (0, vitest_1.describe)('Error Handling', () => {
        (0, vitest_1.it)('should call onFailed with error string', async () => {
            mockInstallPackageFromLocal.mockRejectedValue('Installation error string');
            const onFailed = vitest_1.vi.fn();
            (0, react_1.render)(<install_1.default {...defaultProps} onFailed={onFailed}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith('Installation error string');
            });
        });
        (0, vitest_1.it)('should call onFailed without message when error is not string', async () => {
            mockInstallPackageFromLocal.mockRejectedValue({ code: 'ERROR' });
            const onFailed = vitest_1.vi.fn();
            (0, react_1.render)(<install_1.default {...defaultProps} onFailed={onFailed}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith();
            });
        });
    });
    // ================================
    // Auto Install Behavior Tests
    // ================================
    (0, vitest_1.describe)('Auto Install Behavior', () => {
        (0, vitest_1.it)('should call onInstalled when already installed with same uniqueIdentifier', async () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: {
                    'test-author/Test Plugin': {
                        installedVersion: '1.0.0',
                        installedId: 'installed-id',
                        uniqueIdentifier: 'test-unique-identifier',
                    },
                },
                isLoading: false,
            });
            const onInstalled = vitest_1.vi.fn();
            (0, react_1.render)(<install_1.default {...defaultProps} onInstalled={onInstalled}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onInstalled).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should not auto-call onInstalled when uniqueIdentifier differs', () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: {
                    'test-author/Test Plugin': {
                        installedVersion: '1.0.0',
                        installedId: 'installed-id',
                        uniqueIdentifier: 'different-uid',
                    },
                },
                isLoading: false,
            });
            const onInstalled = vitest_1.vi.fn();
            (0, react_1.render)(<install_1.default {...defaultProps} onInstalled={onInstalled}/>);
            // Should not be called immediately
            (0, vitest_1.expect)(onInstalled).not.toHaveBeenCalled();
        });
    });
    // ================================
    // Dify Version Compatibility Tests
    // ================================
    (0, vitest_1.describe)('Dify Version Compatibility', () => {
        (0, vitest_1.it)('should not show warning when dify version is compatible', () => {
            mockLangGeniusVersionInfo.current_version = '1.0.0';
            const payload = createMockManifest({ meta: { version: '1.0.0', minimum_dify_version: '0.8.0' } });
            (0, react_1.render)(<install_1.default {...defaultProps} payload={payload}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText(/plugin.difyVersionNotCompatible/)).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should show warning when dify version is incompatible', () => {
            mockLangGeniusVersionInfo.current_version = '1.0.0';
            const payload = createMockManifest({ meta: { version: '1.0.0', minimum_dify_version: '2.0.0' } });
            (0, react_1.render)(<install_1.default {...defaultProps} payload={payload}/>);
            (0, vitest_1.expect)(react_1.screen.getByText(/plugin.difyVersionNotCompatible/)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should be compatible when minimum_dify_version is undefined', () => {
            mockLangGeniusVersionInfo.current_version = '1.0.0';
            const payload = createMockManifest({ meta: { version: '1.0.0' } });
            (0, react_1.render)(<install_1.default {...defaultProps} payload={payload}/>);
            (0, vitest_1.expect)(react_1.screen.queryByText(/plugin.difyVersionNotCompatible/)).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should be compatible when current_version is empty', () => {
            mockLangGeniusVersionInfo.current_version = '';
            const payload = createMockManifest({ meta: { version: '1.0.0', minimum_dify_version: '2.0.0' } });
            (0, react_1.render)(<install_1.default {...defaultProps} payload={payload}/>);
            // When current_version is empty, should be compatible (no warning)
            (0, vitest_1.expect)(react_1.screen.queryByText(/plugin.difyVersionNotCompatible/)).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should be compatible when current_version is undefined', () => {
            mockLangGeniusVersionInfo.current_version = undefined;
            const payload = createMockManifest({ meta: { version: '1.0.0', minimum_dify_version: '2.0.0' } });
            (0, react_1.render)(<install_1.default {...defaultProps} payload={payload}/>);
            // When current_version is undefined, should be compatible (no warning)
            (0, vitest_1.expect)(react_1.screen.queryByText(/plugin.difyVersionNotCompatible/)).not.toBeInTheDocument();
        });
    });
    // ================================
    // Installing State Tests
    // ================================
    (0, vitest_1.describe)('Installing State', () => {
        (0, vitest_1.it)('should show installing text when installing', async () => {
            mockInstallPackageFromLocal.mockImplementation(() => new Promise(() => { }));
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installing')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should disable install button when installing', async () => {
            mockInstallPackageFromLocal.mockImplementation(() => new Promise(() => { }));
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /plugin.installModal.installing/ })).toBeDisabled();
            });
        });
        (0, vitest_1.it)('should show loading spinner when installing', async () => {
            mockInstallPackageFromLocal.mockImplementation(() => new Promise(() => { }));
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' }));
            await (0, react_1.waitFor)(() => {
                const spinner = document.querySelector('.animate-spin-slow');
                (0, vitest_1.expect)(spinner).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should not trigger install twice when already installing', async () => {
            mockInstallPackageFromLocal.mockImplementation(() => new Promise(() => { }));
            (0, react_1.render)(<install_1.default {...defaultProps}/>);
            const installButton = react_1.screen.getByRole('button', { name: 'plugin.installModal.install' });
            // Click install
            react_1.fireEvent.click(installButton);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockInstallPackageFromLocal).toHaveBeenCalledTimes(1);
            });
            // Try to click again (button should be disabled but let's verify the guard works)
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.installing/ }));
            // Should still only be called once due to isInstalling guard
            (0, vitest_1.expect)(mockInstallPackageFromLocal).toHaveBeenCalledTimes(1);
        });
    });
    // ================================
    // Callback Props Tests
    // ================================
    (0, vitest_1.describe)('Callback Props', () => {
        (0, vitest_1.it)('should work without onStartToInstall callback', async () => {
            mockInstallPackageFromLocal.mockResolvedValue({
                all_installed: true,
                task_id: 'task-123',
            });
            const onInstalled = vitest_1.vi.fn();
            (0, react_1.render)(<install_1.default {...defaultProps} onStartToInstall={undefined} onInstalled={onInstalled}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.install' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onInstalled).toHaveBeenCalled();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW5zdGFsbC5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtEQUEyRTtBQUMzRSxtQ0FBNkQ7QUFDN0QsMENBQStEO0FBQy9ELHVDQUErQjtBQUUvQixpQ0FBaUM7QUFDakMsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFlBQXdDLEVBQUUsRUFBcUIsRUFBRSxDQUFDLENBQUM7SUFDN0Ysd0JBQXdCLEVBQUUsaUJBQWlCO0lBQzNDLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLElBQUksRUFBRSxlQUFlO0lBQ3JCLElBQUksRUFBRSxhQUFhO0lBQ25CLFFBQVEsRUFBRSwwQkFBa0IsQ0FBQyxJQUFJO0lBQ2pDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQWdDO0lBQy9ELFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQXNDO0lBQzdFLFVBQVUsRUFBRSxzQkFBc0I7SUFDbEMsUUFBUSxFQUFFLEVBQUU7SUFDWixPQUFPLEVBQUUsRUFBRTtJQUNYLFFBQVEsRUFBRSxJQUFJO0lBQ2QsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3pDLEtBQUssRUFBRSxJQUFJO0lBQ1gsSUFBSSxFQUFFLEVBQUU7SUFDUixjQUFjLEVBQUUsSUFBSTtJQUNwQixJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE9BQU8sRUFBRTtJQUN6RCxPQUFPLEVBQUUsRUFBa0M7SUFDM0MsR0FBRyxTQUFTO0NBQ2IsQ0FBQyxDQUFBO0FBRUYsNkJBQTZCO0FBQzdCLE1BQU0scUJBQXFCLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ3JDLFdBQUUsQ0FBQyxJQUFJLENBQUMsbUVBQW1FLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJ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LGlCQUFpQixDQUFDO2dCQUM1QyxhQUFhLEVBQUUsSUFBSTtnQkFDbkIsT0FBTyxFQUFFLFVBQVU7YUFDcEIsQ0FBQyxDQUFBO1lBRUYsTUFBTSxXQUFXLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO1lBQzNCLElBQUEsY0FBTSxFQUNKLENBQUMsaUJBQU8sQ0FDTixJQUFJLFlBQVksQ0FBQyxDQUNqQixnQkFBZ0IsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUM1QixXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsRUFDekIsQ0FDSCxDQUFBO1lBRUQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsNkJBQTZCLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFFcEYsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUEsZUFBTSxFQUFDLFdBQVcsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLENBQUE7WUFDeEMsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFBsdWdpbkRlY2xhcmF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB7IFBsdWdpbkNhdGVnb3J5RW51bSwgVGFza1N0YXR1cyB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJ1xuaW1wb3J0IEluc3RhbGwgZnJvbSAnLi9pbnN0YWxsJ1xuXG4vLyBGYWN0b3J5IGZ1bmN0aW9uIGZvciB0ZXN0IGRhdGFcbmNvbnN0IGNyZWF0ZU1vY2tNYW5pZmVzdCA9IChvdmVycmlkZXM6IFBhcnRpYWw8UGx1Z2luRGVjbGFyYXRpb24+ID0ge30pOiBQbHVnaW5EZWNsYXJhdGlvbiA9PiAoe1xuICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICd0ZXN0LXBsdWdpbi11aWQnLFxuICB2ZXJzaW9uOiAnMS4wLjAnLFxuICBhdXRob3I6ICd0ZXN0LWF1dGhvcicsXG4gIGljb246ICd0ZXN0LWljb24ucG5nJyxcbiAgbmFtZTogJ1Rlc3QgUGx1Z2luJyxcbiAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICBsYWJlbDogeyAnZW4tVVMnOiAnVGVzdCBQbHVnaW4nIH0gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ2xhYmVsJ10sXG4gIGRlc2NyaXB0aW9uOiB7ICdlbi1VUyc6ICdBIHRlc3QgcGx1Z2luJyB9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWydkZXNjcmlwdGlvbiddLFxuICBjcmVhdGVkX2F0OiAnMjAyNC0wMS0wMVQwMDowMDowMFonLFxuICByZXNvdXJjZToge30sXG4gIHBsdWdpbnM6IFtdLFxuICB2ZXJpZmllZDogdHJ1ZSxcbiAgZW5kcG9pbnQ6IHsgc2V0dGluZ3M6IFtdLCBlbmRwb2ludHM6IFtdIH0sXG4gIG1vZGVsOiBudWxsLFxuICB0YWdzOiBbXSxcbiAgYWdlbnRfc3RyYXRlZ3k6IG51bGwsXG4gIG1ldGE6IHsgdmVyc2lvbjogJzEuMC4wJywgbWluaW11bV9kaWZ5X3ZlcnNpb246ICcwLjguMCcgfSxcbiAgdHJpZ2dlcjoge30gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ3RyaWdnZXInXSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuLy8gTW9jayBleHRlcm5hbCBkZXBlbmRlbmNpZXNcbmNvbnN0IG1vY2tVc2VDaGVja0luc3RhbGxlZCA9IHZpLmZuKClcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9pbnN0YWxsLXBsdWdpbi9ob29rcy91c2UtY2hlY2staW5zdGFsbGVkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gbW9ja1VzZUNoZWNrSW5zdGFsbGVkKCksXG59KSlcblxuY29uc3QgbW9ja0luc3RhbGxQYWNrYWdlRnJvbUxvY2FsID0gdmkuZm4oKVxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1wbHVnaW5zJywgKCkgPT4gKHtcbiAgdXNlSW5zdGFsbFBhY2thZ2VGcm9tTG9jYWw6ICgpID0+ICh7XG4gICAgbXV0YXRlQXN5bmM6IG1vY2tJbnN0YWxsUGFja2FnZUZyb21Mb2NhbCxcbiAgfSksXG4gIHVzZVBsdWdpblRhc2tMaXN0OiAoKSA9PiAoe1xuICAgIGhhbmRsZVJlZmV0Y2g6IHZpLmZuKCksXG4gIH0pLFxufSkpXG5cbmNvbnN0IG1vY2tVbmluc3RhbGxQbHVnaW4gPSB2aS5mbigpXG52aS5tb2NrKCdAL3NlcnZpY2UvcGx1Z2lucycsICgpID0+ICh7XG4gIHVuaW5zdGFsbFBsdWdpbjogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gbW9ja1VuaW5zdGFsbFBsdWdpbiguLi5hcmdzKSxcbn0pKVxuXG5jb25zdCBtb2NrQ2hlY2sgPSB2aS5mbigpXG5jb25zdCBtb2NrU3RvcCA9IHZpLmZuKClcbnZpLm1vY2soJy4uLy4uL2Jhc2UvY2hlY2stdGFzay1zdGF0dXMnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiAoe1xuICAgIGNoZWNrOiBtb2NrQ2hlY2ssXG4gICAgc3RvcDogbW9ja1N0b3AsXG4gIH0pLFxufSkpXG5cbmNvbnN0IG1vY2tMYW5nR2VuaXVzVmVyc2lvbkluZm8gPSB7IGN1cnJlbnRfdmVyc2lvbjogJzEuMC4wJyB9XG52aS5tb2NrKCdAL2NvbnRleHQvYXBwLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VBcHBDb250ZXh0OiAoKSA9PiAoe1xuICAgIGxhbmdHZW5pdXNWZXJzaW9uSW5mbzogbW9ja0xhbmdHZW5pdXNWZXJzaW9uSW5mbyxcbiAgfSksXG59KSlcblxudmkubW9jaygncmVhY3QtaTE4bmV4dCcsIGFzeW5jIChpbXBvcnRPcmlnaW5hbCkgPT4ge1xuICBjb25zdCBhY3R1YWwgPSBhd2FpdCBpbXBvcnRPcmlnaW5hbDx0eXBlb2YgaW1wb3J0KCdyZWFjdC1pMThuZXh0Jyk+KClcbiAgY29uc3QgeyBjcmVhdGVSZWFjdEkxOG5leHRNb2NrIH0gPSBhd2FpdCBpbXBvcnQoJ0AvdGVzdC9pMThuLW1vY2snKVxuICByZXR1cm4ge1xuICAgIC4uLmFjdHVhbCxcbiAgICAuLi5jcmVhdGVSZWFjdEkxOG5leHRNb2NrKCksXG4gICAgVHJhbnM6ICh7IGkxOG5LZXksIGNvbXBvbmVudHMgfTogeyBpMThuS2V5OiBzdHJpbmcsIGNvbXBvbmVudHM/OiBSZWNvcmQ8c3RyaW5nLCBSZWFjdC5SZWFjdE5vZGU+IH0pID0+IChcbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwidHJhbnNcIj5cbiAgICAgICAge2kxOG5LZXl9XG4gICAgICAgIHtjb21wb25lbnRzPy50cnVzdFNvdXJjZX1cbiAgICAgIDwvc3Bhbj5cbiAgICApLFxuICB9XG59KVxuXG52aS5tb2NrKCcuLi8uLi8uLi9jYXJkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgcGF5bG9hZCwgdGl0bGVMZWZ0IH06IHtcbiAgICBwYXlsb2FkOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICAgIHRpdGxlTGVmdD86IFJlYWN0LlJlYWN0Tm9kZVxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImNhcmRcIj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiY2FyZC1uYW1lXCI+e3BheWxvYWQ/Lm5hbWUgYXMgc3RyaW5nfTwvc3Bhbj5cbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJjYXJkLXRpdGxlLWxlZnRcIj57dGl0bGVMZWZ0fTwvZGl2PlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbnZpLm1vY2soJy4uLy4uL2Jhc2UvdmVyc2lvbicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGhhc0luc3RhbGxlZCwgaW5zdGFsbGVkVmVyc2lvbiwgdG9JbnN0YWxsVmVyc2lvbiB9OiB7XG4gICAgaGFzSW5zdGFsbGVkOiBib29sZWFuXG4gICAgaW5zdGFsbGVkVmVyc2lvbj86IHN0cmluZ1xuICAgIHRvSW5zdGFsbFZlcnNpb246IHN0cmluZ1xuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInZlcnNpb25cIj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwidmVyc2lvbi1oYXMtaW5zdGFsbGVkXCI+e2hhc0luc3RhbGxlZCA/ICd0cnVlJyA6ICdmYWxzZSd9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJ2ZXJzaW9uLWluc3RhbGxlZFwiPntpbnN0YWxsZWRWZXJzaW9uIHx8ICdudWxsJ308L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInZlcnNpb24tdG8taW5zdGFsbFwiPnt0b0luc3RhbGxWZXJzaW9ufTwvc3Bhbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG52aS5tb2NrKCcuLi8uLi91dGlscycsICgpID0+ICh7XG4gIHBsdWdpbk1hbmlmZXN0VG9DYXJkUGx1Z2luUHJvcHM6IChtYW5pZmVzdDogUGx1Z2luRGVjbGFyYXRpb24pID0+ICh7XG4gICAgbmFtZTogbWFuaWZlc3QubmFtZSxcbiAgICBhdXRob3I6IG1hbmlmZXN0LmF1dGhvcixcbiAgICB2ZXJzaW9uOiBtYW5pZmVzdC52ZXJzaW9uLFxuICB9KSxcbn0pKVxuXG5kZXNjcmliZSgnSW5zdGFsbCcsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgIHVuaXF1ZUlkZW50aWZpZXI6ICd0ZXN0LXVuaXF1ZS1pZGVudGlmaWVyJyxcbiAgICBwYXlsb2FkOiBjcmVhdGVNb2NrTWFuaWZlc3QoKSxcbiAgICBvbkNhbmNlbDogdmkuZm4oKSxcbiAgICBvblN0YXJ0VG9JbnN0YWxsOiB2aS5mbigpLFxuICAgIG9uSW5zdGFsbGVkOiB2aS5mbigpLFxuICAgIG9uRmFpbGVkOiB2aS5mbigpLFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1VzZUNoZWNrSW5zdGFsbGVkLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBpbnN0YWxsZWRJbmZvOiBudWxsLFxuICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICB9KVxuICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21Mb2NhbC5tb2NrUmVzZXQoKVxuICAgIG1vY2tVbmluc3RhbGxQbHVnaW4ubW9ja1Jlc2V0KClcbiAgICBtb2NrQ2hlY2subW9ja1Jlc2V0KClcbiAgICBtb2NrU3RvcC5tb2NrUmVzZXQoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHJlYWR5IHRvIGluc3RhbGwgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwucmVhZHlUb0luc3RhbGwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciB0cnVzdCBzb3VyY2UgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndHJhbnMnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwbHVnaW4gY2FyZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2FyZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLW5hbWUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1Rlc3QgUGx1Z2luJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2FuY2VsIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpbnN0YWxsIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHZlcnNpb24gY29tcG9uZW50IHdoZW4gbm90IGxvYWRpbmcnLCAoKSA9PiB7XG4gICAgICBtb2NrVXNlQ2hlY2tJbnN0YWxsZWQubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgaW5zdGFsbGVkSW5mbzogbnVsbCxcbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndmVyc2lvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHNob3cgdmVyc2lvbiBjb21wb25lbnQgd2hlbiBsb2FkaW5nJywgKCkgPT4ge1xuICAgICAgbW9ja1VzZUNoZWNrSW5zdGFsbGVkLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGluc3RhbGxlZEluZm86IG51bGwsXG4gICAgICAgIGlzTG9hZGluZzogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCd2ZXJzaW9uJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBWZXJzaW9uIERpc3BsYXkgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1ZlcnNpb24gRGlzcGxheScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgdG9JbnN0YWxsVmVyc2lvbiBmcm9tIHBheWxvYWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja01hbmlmZXN0KHsgdmVyc2lvbjogJzIuMC4wJyB9KVxuICAgICAgbW9ja1VzZUNoZWNrSW5zdGFsbGVkLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGluc3RhbGxlZEluZm86IG51bGwsXG4gICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ZlcnNpb24tdG8taW5zdGFsbCcpKS50b0hhdmVUZXh0Q29udGVudCgnMi4wLjAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgaGFzSW5zdGFsbGVkPWZhbHNlIHdoZW4gbm90IGluc3RhbGxlZCcsICgpID0+IHtcbiAgICAgIG1vY2tVc2VDaGVja0luc3RhbGxlZC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpbnN0YWxsZWRJbmZvOiBudWxsLFxuICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd2ZXJzaW9uLWhhcy1pbnN0YWxsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhbHNlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGhhc0luc3RhbGxlZD10cnVlIHdoZW4gYWxyZWFkeSBpbnN0YWxsZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrVXNlQ2hlY2tJbnN0YWxsZWQubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgaW5zdGFsbGVkSW5mbzoge1xuICAgICAgICAgICd0ZXN0LWF1dGhvci9UZXN0IFBsdWdpbic6IHtcbiAgICAgICAgICAgIGluc3RhbGxlZFZlcnNpb246ICcwLjkuMCcsXG4gICAgICAgICAgICBpbnN0YWxsZWRJZDogJ2luc3RhbGxlZC1pZCcsXG4gICAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyOiAnb2xkLXVpZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndmVyc2lvbi1oYXMtaW5zdGFsbGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ZlcnNpb24taW5zdGFsbGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCcwLjkuMCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnN0YWxsIEJ1dHRvbiBTdGF0ZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSW5zdGFsbCBCdXR0b24gU3RhdGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGluc3RhbGwgYnV0dG9uIHdoZW4gbG9hZGluZycsICgpID0+IHtcbiAgICAgIG1vY2tVc2VDaGVja0luc3RhbGxlZC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpbnN0YWxsZWRJbmZvOiBudWxsLFxuICAgICAgICBpc0xvYWRpbmc6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnIH0pKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGVuYWJsZSBpbnN0YWxsIGJ1dHRvbiB3aGVuIG5vdCBsb2FkaW5nJywgKCkgPT4ge1xuICAgICAgbW9ja1VzZUNoZWNrSW5zdGFsbGVkLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGluc3RhbGxlZEluZm86IG51bGwsXG4gICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnIH0pKS5ub3QudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENhbmNlbCBCdXR0b24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NhbmNlbCBCdXR0b24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2FuY2VsIGFuZCBzdG9wIHdoZW4gY2FuY2VsIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DYW5jZWwgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gb25DYW5jZWw9e29uQ2FuY2VsfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uY2FuY2VsJyB9KSlcblxuICAgICAgZXhwZWN0KG1vY2tTdG9wKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChvbkNhbmNlbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSBjYW5jZWwgYnV0dG9uIHdoZW4gaW5zdGFsbGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21Mb2NhbC5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gbmV3IFByb21pc2UoKCkgPT4ge30pKVxuXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnIH0pKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnIH0pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEluc3RhbGxhdGlvbiBGbG93IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbnN0YWxsYXRpb24gRmxvdycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TdGFydFRvSW5zdGFsbCB3aGVuIGluc3RhbGwgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTG9jYWwubW9ja1Jlc29sdmVkVmFsdWUoe1xuICAgICAgICBhbGxfaW5zdGFsbGVkOiB0cnVlLFxuICAgICAgICB0YXNrX2lkOiAndGFzay0xMjMnLFxuICAgICAgfSlcblxuICAgICAgY29uc3Qgb25TdGFydFRvSW5zdGFsbCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBvblN0YXJ0VG9JbnN0YWxsPXtvblN0YXJ0VG9JbnN0YWxsfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25TdGFydFRvSW5zdGFsbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25JbnN0YWxsZWQgd2hlbiBhbGxfaW5zdGFsbGVkIGlzIHRydWUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTG9jYWwubW9ja1Jlc29sdmVkVmFsdWUoe1xuICAgICAgICBhbGxfaW5zdGFsbGVkOiB0cnVlLFxuICAgICAgICB0YXNrX2lkOiAndGFzay0xMjMnLFxuICAgICAgfSlcblxuICAgICAgY29uc3Qgb25JbnN0YWxsZWQgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gb25JbnN0YWxsZWQ9e29uSW5zdGFsbGVkfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25JbnN0YWxsZWQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjaGVjayB0YXNrIHN0YXR1cyB3aGVuIGFsbF9pbnN0YWxsZWQgaXMgZmFsc2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTG9jYWwubW9ja1Jlc29sdmVkVmFsdWUoe1xuICAgICAgICBhbGxfaW5zdGFsbGVkOiBmYWxzZSxcbiAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgIH0pXG4gICAgICBtb2NrQ2hlY2subW9ja1Jlc29sdmVkVmFsdWUoeyBzdGF0dXM6IFRhc2tTdGF0dXMuc3VjY2VzcywgZXJyb3I6IG51bGwgfSlcblxuICAgICAgY29uc3Qgb25JbnN0YWxsZWQgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gb25JbnN0YWxsZWQ9e29uSW5zdGFsbGVkfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0NoZWNrKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdGFza0lkOiAndGFzay0xMjMnLFxuICAgICAgICAgIHBsdWdpblVuaXF1ZUlkZW50aWZpZXI6ICd0ZXN0LXVuaXF1ZS1pZGVudGlmaWVyJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25JbnN0YWxsZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHRydWUpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25GYWlsZWQgd2hlbiB0YXNrIHN0YXR1cyBpcyBmYWlsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTG9jYWwubW9ja1Jlc29sdmVkVmFsdWUoe1xuICAgICAgICBhbGxfaW5zdGFsbGVkOiBmYWxzZSxcbiAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgIH0pXG4gICAgICBtb2NrQ2hlY2subW9ja1Jlc29sdmVkVmFsdWUoeyBzdGF0dXM6IFRhc2tTdGF0dXMuZmFpbGVkLCBlcnJvcjogJ1Rhc2sgZmFpbGVkIGVycm9yJyB9KVxuXG4gICAgICBjb25zdCBvbkZhaWxlZCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBvbkZhaWxlZD17b25GYWlsZWR9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsJyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkZhaWxlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ1Rhc2sgZmFpbGVkIGVycm9yJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdW5pbnN0YWxsIGV4aXN0aW5nIHBsdWdpbiBiZWZvcmUgaW5zdGFsbGluZyBuZXcgdmVyc2lvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tVc2VDaGVja0luc3RhbGxlZC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpbnN0YWxsZWRJbmZvOiB7XG4gICAgICAgICAgJ3Rlc3QtYXV0aG9yL1Rlc3QgUGx1Z2luJzoge1xuICAgICAgICAgICAgaW5zdGFsbGVkVmVyc2lvbjogJzAuOS4wJyxcbiAgICAgICAgICAgIGluc3RhbGxlZElkOiAnaW5zdGFsbGVkLWlkLXRvLXVuaW5zdGFsbCcsXG4gICAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyOiAnb2xkLXVpZCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgIH0pXG4gICAgICBtb2NrVW5pbnN0YWxsUGx1Z2luLm1vY2tSZXNvbHZlZFZhbHVlKHt9KVxuICAgICAgbW9ja0luc3RhbGxQYWNrYWdlRnJvbUxvY2FsLm1vY2tSZXNvbHZlZFZhbHVlKHtcbiAgICAgICAgYWxsX2luc3RhbGxlZDogdHJ1ZSxcbiAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1VuaW5zdGFsbFBsdWdpbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2luc3RhbGxlZC1pZC10by11bmluc3RhbGwnKVxuICAgICAgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTG9jYWwpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVycm9yIEhhbmRsaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25GYWlsZWQgd2l0aCBlcnJvciBzdHJpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTG9jYWwubW9ja1JlamVjdGVkVmFsdWUoJ0luc3RhbGxhdGlvbiBlcnJvciBzdHJpbmcnKVxuXG4gICAgICBjb25zdCBvbkZhaWxlZCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBvbkZhaWxlZD17b25GYWlsZWR9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsJyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkZhaWxlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ0luc3RhbGxhdGlvbiBlcnJvciBzdHJpbmcnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uRmFpbGVkIHdpdGhvdXQgbWVzc2FnZSB3aGVuIGVycm9yIGlzIG5vdCBzdHJpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTG9jYWwubW9ja1JlamVjdGVkVmFsdWUoeyBjb2RlOiAnRVJST1InIH0pXG5cbiAgICAgIGNvbnN0IG9uRmFpbGVkID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IG9uRmFpbGVkPXtvbkZhaWxlZH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnIH0pKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uRmFpbGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQXV0byBJbnN0YWxsIEJlaGF2aW9yIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBdXRvIEluc3RhbGwgQmVoYXZpb3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uSW5zdGFsbGVkIHdoZW4gYWxyZWFkeSBpbnN0YWxsZWQgd2l0aCBzYW1lIHVuaXF1ZUlkZW50aWZpZXInLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrVXNlQ2hlY2tJbnN0YWxsZWQubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgaW5zdGFsbGVkSW5mbzoge1xuICAgICAgICAgICd0ZXN0LWF1dGhvci9UZXN0IFBsdWdpbic6IHtcbiAgICAgICAgICAgIGluc3RhbGxlZFZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgICAgICBpbnN0YWxsZWRJZDogJ2luc3RhbGxlZC1pZCcsXG4gICAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyOiAndGVzdC11bmlxdWUtaWRlbnRpZmllcicsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IG9uSW5zdGFsbGVkID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IG9uSW5zdGFsbGVkPXtvbkluc3RhbGxlZH0gLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25JbnN0YWxsZWQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgYXV0by1jYWxsIG9uSW5zdGFsbGVkIHdoZW4gdW5pcXVlSWRlbnRpZmllciBkaWZmZXJzJywgKCkgPT4ge1xuICAgICAgbW9ja1VzZUNoZWNrSW5zdGFsbGVkLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGluc3RhbGxlZEluZm86IHtcbiAgICAgICAgICAndGVzdC1hdXRob3IvVGVzdCBQbHVnaW4nOiB7XG4gICAgICAgICAgICBpbnN0YWxsZWRWZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICAgICAgaW5zdGFsbGVkSWQ6ICdpbnN0YWxsZWQtaWQnLFxuICAgICAgICAgICAgdW5pcXVlSWRlbnRpZmllcjogJ2RpZmZlcmVudC11aWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBvbkluc3RhbGxlZCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSBvbkluc3RhbGxlZD17b25JbnN0YWxsZWR9IC8+KVxuXG4gICAgICAvLyBTaG91bGQgbm90IGJlIGNhbGxlZCBpbW1lZGlhdGVseVxuICAgICAgZXhwZWN0KG9uSW5zdGFsbGVkKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBEaWZ5IFZlcnNpb24gQ29tcGF0aWJpbGl0eSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRGlmeSBWZXJzaW9uIENvbXBhdGliaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBub3Qgc2hvdyB3YXJuaW5nIHdoZW4gZGlmeSB2ZXJzaW9uIGlzIGNvbXBhdGlibGUnLCAoKSA9PiB7XG4gICAgICBtb2NrTGFuZ0dlbml1c1ZlcnNpb25JbmZvLmN1cnJlbnRfdmVyc2lvbiA9ICcxLjAuMCdcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrTWFuaWZlc3QoeyBtZXRhOiB7IHZlcnNpb246ICcxLjAuMCcsIG1pbmltdW1fZGlmeV92ZXJzaW9uOiAnMC44LjAnIH0gfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9wbHVnaW4uZGlmeVZlcnNpb25Ob3RDb21wYXRpYmxlLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyB3YXJuaW5nIHdoZW4gZGlmeSB2ZXJzaW9uIGlzIGluY29tcGF0aWJsZScsICgpID0+IHtcbiAgICAgIG1vY2tMYW5nR2VuaXVzVmVyc2lvbkluZm8uY3VycmVudF92ZXJzaW9uID0gJzEuMC4wJ1xuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tNYW5pZmVzdCh7IG1ldGE6IHsgdmVyc2lvbjogJzEuMC4wJywgbWluaW11bV9kaWZ5X3ZlcnNpb246ICcyLjAuMCcgfSB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9wbHVnaW4uZGlmeVZlcnNpb25Ob3RDb21wYXRpYmxlLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBiZSBjb21wYXRpYmxlIHdoZW4gbWluaW11bV9kaWZ5X3ZlcnNpb24gaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgbW9ja0xhbmdHZW5pdXNWZXJzaW9uSW5mby5jdXJyZW50X3ZlcnNpb24gPSAnMS4wLjAnXG4gICAgICBjb25zdCBwYXlsb2FkID0gY3JlYXRlTW9ja01hbmlmZXN0KHsgbWV0YTogeyB2ZXJzaW9uOiAnMS4wLjAnIH0gfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9wbHVnaW4uZGlmeVZlcnNpb25Ob3RDb21wYXRpYmxlLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYmUgY29tcGF0aWJsZSB3aGVuIGN1cnJlbnRfdmVyc2lvbiBpcyBlbXB0eScsICgpID0+IHtcbiAgICAgIG1vY2tMYW5nR2VuaXVzVmVyc2lvbkluZm8uY3VycmVudF92ZXJzaW9uID0gJydcbiAgICAgIGNvbnN0IHBheWxvYWQgPSBjcmVhdGVNb2NrTWFuaWZlc3QoeyBtZXRhOiB7IHZlcnNpb246ICcxLjAuMCcsIG1pbmltdW1fZGlmeV92ZXJzaW9uOiAnMi4wLjAnIH0gfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e3BheWxvYWR9IC8+KVxuXG4gICAgICAvLyBXaGVuIGN1cnJlbnRfdmVyc2lvbiBpcyBlbXB0eSwgc2hvdWxkIGJlIGNvbXBhdGlibGUgKG5vIHdhcm5pbmcpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9wbHVnaW4uZGlmeVZlcnNpb25Ob3RDb21wYXRpYmxlLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYmUgY29tcGF0aWJsZSB3aGVuIGN1cnJlbnRfdmVyc2lvbiBpcyB1bmRlZmluZWQnLCAoKSA9PiB7XG4gICAgICBtb2NrTGFuZ0dlbml1c1ZlcnNpb25JbmZvLmN1cnJlbnRfdmVyc2lvbiA9IHVuZGVmaW5lZCBhcyB1bmtub3duIGFzIHN0cmluZ1xuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tNYW5pZmVzdCh7IG1ldGE6IHsgdmVyc2lvbjogJzEuMC4wJywgbWluaW11bV9kaWZ5X3ZlcnNpb246ICcyLjAuMCcgfSB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGwgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17cGF5bG9hZH0gLz4pXG5cbiAgICAgIC8vIFdoZW4gY3VycmVudF92ZXJzaW9uIGlzIHVuZGVmaW5lZCwgc2hvdWxkIGJlIGNvbXBhdGlibGUgKG5vIHdhcm5pbmcpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9wbHVnaW4uZGlmeVZlcnNpb25Ob3RDb21wYXRpYmxlLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnN0YWxsaW5nIFN0YXRlIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbnN0YWxsaW5nIFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBpbnN0YWxsaW5nIHRleHQgd2hlbiBpbnN0YWxsaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0luc3RhbGxQYWNrYWdlRnJvbUxvY2FsLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiB7fSkpXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsaW5nJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBpbnN0YWxsIGJ1dHRvbiB3aGVuIGluc3RhbGxpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTG9jYWwubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IG5ldyBQcm9taXNlKCgpID0+IHt9KSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsJyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9wbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxpbmcvIH0pKS50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGxvYWRpbmcgc3Bpbm5lciB3aGVuIGluc3RhbGxpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSW5zdGFsbFBhY2thZ2VGcm9tTG9jYWwubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IG5ldyBQcm9taXNlKCgpID0+IHt9KSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsJyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGNvbnN0IHNwaW5uZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYW5pbWF0ZS1zcGluLXNsb3cnKVxuICAgICAgICBleHBlY3Qoc3Bpbm5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgdHJpZ2dlciBpbnN0YWxsIHR3aWNlIHdoZW4gYWxyZWFkeSBpbnN0YWxsaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0luc3RhbGxQYWNrYWdlRnJvbUxvY2FsLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgoKSA9PiB7fSkpXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgY29uc3QgaW5zdGFsbEJ1dHRvbiA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbCcgfSlcblxuICAgICAgLy8gQ2xpY2sgaW5zdGFsbFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGluc3RhbGxCdXR0b24pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0luc3RhbGxQYWNrYWdlRnJvbUxvY2FsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIC8vIFRyeSB0byBjbGljayBhZ2FpbiAoYnV0dG9uIHNob3VsZCBiZSBkaXNhYmxlZCBidXQgbGV0J3MgdmVyaWZ5IHRoZSBndWFyZCB3b3JrcylcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9wbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxpbmcvIH0pKVxuXG4gICAgICAvLyBTaG91bGQgc3RpbGwgb25seSBiZSBjYWxsZWQgb25jZSBkdWUgdG8gaXNJbnN0YWxsaW5nIGd1YXJkXG4gICAgICBleHBlY3QobW9ja0luc3RhbGxQYWNrYWdlRnJvbUxvY2FsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENhbGxiYWNrIFByb3BzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDYWxsYmFjayBQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHdvcmsgd2l0aG91dCBvblN0YXJ0VG9JbnN0YWxsIGNhbGxiYWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0luc3RhbGxQYWNrYWdlRnJvbUxvY2FsLm1vY2tSZXNvbHZlZFZhbHVlKHtcbiAgICAgICAgYWxsX2luc3RhbGxlZDogdHJ1ZSxcbiAgICAgICAgdGFza19pZDogJ3Rhc2stMTIzJyxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IG9uSW5zdGFsbGVkID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbFxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgb25TdGFydFRvSW5zdGFsbD17dW5kZWZpbmVkfVxuICAgICAgICAgIG9uSW5zdGFsbGVkPXtvbkluc3RhbGxlZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnIH0pKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uSW5zdGFsbGVkKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=