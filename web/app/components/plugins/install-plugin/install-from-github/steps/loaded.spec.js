"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("../../../types");
const loaded_1 = require("./loaded");
// Mock dependencies
const mockUseCheckInstalled = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/plugins/install-plugin/hooks/use-check-installed', () => ({
    default: (params) => mockUseCheckInstalled(params),
}));
const mockUpdateFromGitHub = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/plugins', () => ({
    updateFromGitHub: (...args) => mockUpdateFromGitHub(...args),
}));
const mockInstallPackageFromGitHub = vitest_1.vi.fn();
const mockHandleRefetch = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/use-plugins', () => ({
    useInstallPackageFromGitHub: () => ({ mutateAsync: mockInstallPackageFromGitHub }),
    usePluginTaskList: () => ({ handleRefetch: mockHandleRefetch }),
}));
const mockCheck = vitest_1.vi.fn();
vitest_1.vi.mock('../../base/check-task-status', () => ({
    default: () => ({ check: mockCheck }),
}));
// Mock Card component
vitest_1.vi.mock('../../../card', () => ({
    default: ({ payload, titleLeft }) => (<div data-testid="plugin-card">
      <span data-testid="card-name">{payload.name}</span>
      {titleLeft && <span data-testid="title-left">{titleLeft}</span>}
    </div>),
}));
// Mock Version component
vitest_1.vi.mock('../../base/version', () => ({
    default: ({ hasInstalled, installedVersion, toInstallVersion }) => (<span data-testid="version-info">
      {hasInstalled ? `Update from ${installedVersion} to ${toInstallVersion}` : `Install ${toInstallVersion}`}
    </span>),
}));
// Factory functions
const createMockPayload = (overrides = {}) => ({
    plugin_unique_identifier: 'test-uid',
    version: '1.0.0',
    author: 'test-author',
    icon: 'icon.png',
    name: 'Test Plugin',
    category: types_1.PluginCategoryEnum.tool,
    label: { 'en-US': 'Test' },
    description: { 'en-US': 'Test Description' },
    created_at: '2024-01-01',
    resource: {},
    plugins: [],
    verified: true,
    endpoint: { settings: [], endpoints: [] },
    model: null,
    tags: [],
    agent_strategy: null,
    meta: { version: '1.0.0' },
    trigger: {},
    ...overrides,
});
const createMockPluginPayload = (overrides = {}) => ({
    type: 'plugin',
    org: 'test-org',
    name: 'Test Plugin',
    plugin_id: 'test-plugin-id',
    version: '1.0.0',
    latest_version: '1.0.0',
    latest_package_identifier: 'test-pkg',
    icon: 'icon.png',
    verified: true,
    label: { 'en-US': 'Test' },
    brief: { 'en-US': 'Brief' },
    description: { 'en-US': 'Description' },
    introduction: 'Intro',
    repository: '',
    category: types_1.PluginCategoryEnum.tool,
    install_count: 100,
    endpoint: { settings: [] },
    tags: [],
    badges: [],
    verification: { authorized_category: 'langgenius' },
    from: 'github',
    ...overrides,
});
const createUpdatePayload = () => ({
    originalPackageInfo: {
        id: 'original-id',
        repo: 'owner/repo',
        version: 'v0.9.0',
        package: 'plugin.zip',
        releases: [],
    },
});
(0, vitest_1.describe)('Loaded', () => {
    const defaultProps = {
        updatePayload: undefined,
        uniqueIdentifier: 'test-unique-id',
        payload: createMockPayload(),
        repoUrl: 'https://github.com/owner/repo',
        selectedVersion: 'v1.0.0',
        selectedPackage: 'plugin.zip',
        onBack: vitest_1.vi.fn(),
        onStartToInstall: vitest_1.vi.fn(),
        onInstalled: vitest_1.vi.fn(),
        onFailed: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockUseCheckInstalled.mockReturnValue({
            installedInfo: {},
            isLoading: false,
        });
        mockUpdateFromGitHub.mockResolvedValue({ all_installed: true, task_id: 'task-1' });
        mockInstallPackageFromGitHub.mockResolvedValue({ all_installed: true, task_id: 'task-1' });
        mockCheck.mockResolvedValue({ status: types_1.TaskStatus.success, error: null });
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render ready to install message', () => {
            (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.readyToInstall')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render plugin card', () => {
            (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-card')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render back button when not installing', () => {
            (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render install button', () => {
            (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show version info in card title', () => {
            (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-info')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Tests
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should display plugin name from payload', () => {
            (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-name')).toHaveTextContent('Test Plugin');
        });
        (0, vitest_1.it)('should pass correct version to Version component', () => {
            (0, react_1.render)(<loaded_1.default {...defaultProps} payload={createMockPayload({ version: '2.0.0' })}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('version-info')).toHaveTextContent('Install 2.0.0');
        });
    });
    // ================================
    // Button State Tests
    // ================================
    (0, vitest_1.describe)('Button State', () => {
        (0, vitest_1.it)('should disable install button while loading', () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: {},
                isLoading: true,
            });
            (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i })).toBeDisabled();
        });
        (0, vitest_1.it)('should enable install button when not loading', () => {
            (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i })).not.toBeDisabled();
        });
    });
    // ================================
    // User Interactions Tests
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onBack when back button is clicked', () => {
            const onBack = vitest_1.vi.fn();
            (0, react_1.render)(<loaded_1.default {...defaultProps} onBack={onBack}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' }));
            (0, vitest_1.expect)(onBack).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call onStartToInstall when install starts', async () => {
            const onStartToInstall = vitest_1.vi.fn();
            (0, react_1.render)(<loaded_1.default {...defaultProps} onStartToInstall={onStartToInstall}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onStartToInstall).toHaveBeenCalledTimes(1);
            });
        });
    });
    // ================================
    // Installation Flow Tests
    // ================================
    (0, vitest_1.describe)('Installation Flows', () => {
        (0, vitest_1.it)('should call installPackageFromGitHub for fresh install', async () => {
            const onInstalled = vitest_1.vi.fn();
            (0, react_1.render)(<loaded_1.default {...defaultProps} onInstalled={onInstalled}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockInstallPackageFromGitHub).toHaveBeenCalledWith({
                    repoUrl: 'owner/repo',
                    selectedVersion: 'v1.0.0',
                    selectedPackage: 'plugin.zip',
                    uniqueIdentifier: 'test-unique-id',
                });
            });
        });
        (0, vitest_1.it)('should call updateFromGitHub when updatePayload is provided', async () => {
            const updatePayload = createUpdatePayload();
            (0, react_1.render)(<loaded_1.default {...defaultProps} updatePayload={updatePayload}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUpdateFromGitHub).toHaveBeenCalledWith('owner/repo', 'v1.0.0', 'plugin.zip', 'original-id', 'test-unique-id');
            });
        });
        (0, vitest_1.it)('should call updateFromGitHub when plugin is already installed', async () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: {
                    'test-plugin-id': {
                        installedVersion: '0.9.0',
                        uniqueIdentifier: 'installed-uid',
                    },
                },
                isLoading: false,
            });
            (0, react_1.render)(<loaded_1.default {...defaultProps} payload={createMockPluginPayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUpdateFromGitHub).toHaveBeenCalledWith('owner/repo', 'v1.0.0', 'plugin.zip', 'installed-uid', 'test-unique-id');
            });
        });
        (0, vitest_1.it)('should call onInstalled when installation completes immediately', async () => {
            mockInstallPackageFromGitHub.mockResolvedValue({ all_installed: true, task_id: 'task-1' });
            const onInstalled = vitest_1.vi.fn();
            (0, react_1.render)(<loaded_1.default {...defaultProps} onInstalled={onInstalled}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onInstalled).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should check task status when not immediately installed', async () => {
            mockInstallPackageFromGitHub.mockResolvedValue({ all_installed: false, task_id: 'task-1' });
            (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHandleRefetch).toHaveBeenCalled();
                (0, vitest_1.expect)(mockCheck).toHaveBeenCalledWith({
                    taskId: 'task-1',
                    pluginUniqueIdentifier: 'test-unique-id',
                });
            });
        });
        (0, vitest_1.it)('should call onInstalled with true when task succeeds', async () => {
            mockInstallPackageFromGitHub.mockResolvedValue({ all_installed: false, task_id: 'task-1' });
            mockCheck.mockResolvedValue({ status: types_1.TaskStatus.success, error: null });
            const onInstalled = vitest_1.vi.fn();
            (0, react_1.render)(<loaded_1.default {...defaultProps} onInstalled={onInstalled}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onInstalled).toHaveBeenCalledWith(true);
            });
        });
    });
    // ================================
    // Error Handling Tests
    // ================================
    (0, vitest_1.describe)('Error Handling', () => {
        (0, vitest_1.it)('should call onFailed when task fails', async () => {
            mockInstallPackageFromGitHub.mockResolvedValue({ all_installed: false, task_id: 'task-1' });
            mockCheck.mockResolvedValue({ status: types_1.TaskStatus.failed, error: 'Installation failed' });
            const onFailed = vitest_1.vi.fn();
            (0, react_1.render)(<loaded_1.default {...defaultProps} onFailed={onFailed}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith('Installation failed');
            });
        });
        (0, vitest_1.it)('should call onFailed with string error', async () => {
            mockInstallPackageFromGitHub.mockRejectedValue('String error message');
            const onFailed = vitest_1.vi.fn();
            (0, react_1.render)(<loaded_1.default {...defaultProps} onFailed={onFailed}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith('String error message');
            });
        });
        (0, vitest_1.it)('should call onFailed without message for non-string errors', async () => {
            mockInstallPackageFromGitHub.mockRejectedValue(new Error('Error object'));
            const onFailed = vitest_1.vi.fn();
            (0, react_1.render)(<loaded_1.default {...defaultProps} onFailed={onFailed}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith();
            });
        });
    });
    // ================================
    // Auto-install Effect Tests
    // ================================
    (0, vitest_1.describe)('Auto-install Effect', () => {
        (0, vitest_1.it)('should call onInstalled when already installed with same identifier', () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: {
                    'test-plugin-id': {
                        installedVersion: '1.0.0',
                        uniqueIdentifier: 'test-unique-id',
                    },
                },
                isLoading: false,
            });
            const onInstalled = vitest_1.vi.fn();
            (0, react_1.render)(<loaded_1.default {...defaultProps} payload={createMockPluginPayload()} onInstalled={onInstalled}/>);
            (0, vitest_1.expect)(onInstalled).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should not call onInstalled when identifiers differ', () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: {
                    'test-plugin-id': {
                        installedVersion: '1.0.0',
                        uniqueIdentifier: 'different-uid',
                    },
                },
                isLoading: false,
            });
            const onInstalled = vitest_1.vi.fn();
            (0, react_1.render)(<loaded_1.default {...defaultProps} payload={createMockPluginPayload()} onInstalled={onInstalled}/>);
            (0, vitest_1.expect)(onInstalled).not.toHaveBeenCalled();
        });
    });
    // ================================
    // Installing State Tests
    // ================================
    (0, vitest_1.describe)('Installing State', () => {
        (0, vitest_1.it)('should hide back button while installing', async () => {
            let resolveInstall;
            mockInstallPackageFromGitHub.mockImplementation(() => new Promise((resolve) => {
                resolveInstall = resolve;
            }));
            (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByRole('button', { name: 'plugin.installModal.back' })).not.toBeInTheDocument();
            });
            resolveInstall({ all_installed: true, task_id: 'task-1' });
        });
        (0, vitest_1.it)('should show installing text while installing', async () => {
            let resolveInstall;
            mockInstallPackageFromGitHub.mockImplementation(() => new Promise((resolve) => {
                resolveInstall = resolve;
            }));
            (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installing')).toBeInTheDocument();
            });
            resolveInstall({ all_installed: true, task_id: 'task-1' });
        });
        (0, vitest_1.it)('should not trigger install twice when already installing', async () => {
            let resolveInstall;
            mockInstallPackageFromGitHub.mockImplementation(() => new Promise((resolve) => {
                resolveInstall = resolve;
            }));
            (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            const installButton = react_1.screen.getByRole('button', { name: /plugin.installModal.install/i });
            // Click twice
            react_1.fireEvent.click(installButton);
            react_1.fireEvent.click(installButton);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockInstallPackageFromGitHub).toHaveBeenCalledTimes(1);
            });
            resolveInstall({ all_installed: true, task_id: 'task-1' });
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle missing onStartToInstall callback', async () => {
            (0, react_1.render)(<loaded_1.default {...defaultProps} onStartToInstall={undefined}/>);
            // Should not throw when callback is undefined
            (0, vitest_1.expect)(() => {
                react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /plugin.installModal.install/i }));
            }).not.toThrow();
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockInstallPackageFromGitHub).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should handle plugin without plugin_id', () => {
            mockUseCheckInstalled.mockReturnValue({
                installedInfo: {},
                isLoading: false,
            });
            (0, react_1.render)(<loaded_1.default {...defaultProps} payload={createMockPayload()}/>);
            (0, vitest_1.expect)(mockUseCheckInstalled).toHaveBeenCalledWith({
                pluginIds: [undefined],
                enabled: false,
            });
        });
        (0, vitest_1.it)('should preserve state after component update', () => {
            const { rerender } = (0, react_1.render)(<loaded_1.default {...defaultProps}/>);
            rerender(<loaded_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-card')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9hZGVkLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsb2FkZWQuc3BlYy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrREFBMkU7QUFDM0UsbUNBQTZEO0FBQzdELDBDQUErRDtBQUMvRCxxQ0FBNkI7QUFFN0Isb0JBQW9CO0FBQ3BCLE1BQU0scUJBQXFCLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ3JDLFdBQUUsQ0FBQyxJQUFJLENBQUMsbUVBQW1FLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNsRixPQUFPLEVBQUUsQ0FBQyxNQUFpRCxFQUFFLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUM7Q0FDOUYsQ0FBQyxDQUFDLENBQUE7QUFFSCxNQUFNLG9CQUFvQixHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNwQyxXQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDbEMsZ0JBQWdCLEVBQUUsQ0FBQyxHQUFHLElBQWUsRUFBRSxFQUFFLENBQUMsb0JBQW9CLENBQUMsR0FBRyxJQUFJLENBQUM7Q0FDeEUsQ0FBQyxDQUFDLENBQUE7QUFFSCxNQUFNLDRCQUE0QixHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUM1QyxNQUFNLGlCQUFpQixHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUNqQyxXQUFFLENBQUMsSUFBSSxDQUFDLHVCQUF1QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdEMsMkJBQTJCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLFdBQVcsRUFBRSw0QkFBNEIsRUFBRSxDQUFDO0lBQ2xGLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsQ0FBQztDQUNoRSxDQUFDLENBQUMsQ0FBQTtBQUVILE1BQU0sU0FBUyxHQUFHLFdB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RUFBRSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRWxFLElBQUEsZUFBTSxFQUFDLHFCQUFxQixDQUFDLENBQUMsb0JBQW9CLENBQUM7Z0JBQ2pELFNBQVMsRUFBRSxDQUFDLFNBQVMsQ0FBQztnQkFDdEIsT0FBTyxFQUFFLEtBQUs7YUFDZixDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLDhDQUE4QyxFQUFFLEdBQUcsRUFBRTtZQUN0RCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyxnQkFBTSxDQUFDLElBQUksWUFBWSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXpELFFBQVEsQ0FBQyxDQUFDLGdCQUFNLENBQUMsSUFBSSxZQUFZLENBQUMsRUFBRyxDQUFDLENBQUE7WUFFdEMsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDL0QsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBQbHVnaW4sIFBsdWdpbkRlY2xhcmF0aW9uLCBVcGRhdGVGcm9tR2l0SHViUGF5bG9hZCB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBQbHVnaW5DYXRlZ29yeUVudW0sIFRhc2tTdGF0dXMgfSBmcm9tICcuLi8uLi8uLi90eXBlcydcbmltcG9ydCBMb2FkZWQgZnJvbSAnLi9sb2FkZWQnXG5cbi8vIE1vY2sgZGVwZW5kZW5jaWVzXG5jb25zdCBtb2NrVXNlQ2hlY2tJbnN0YWxsZWQgPSB2aS5mbigpXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL3BsdWdpbnMvaW5zdGFsbC1wbHVnaW4vaG9va3MvdXNlLWNoZWNrLWluc3RhbGxlZCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6IChwYXJhbXM6IHsgcGx1Z2luSWRzOiBzdHJpbmdbXSwgZW5hYmxlZDogYm9vbGVhbiB9KSA9PiBtb2NrVXNlQ2hlY2tJbnN0YWxsZWQocGFyYW1zKSxcbn0pKVxuXG5jb25zdCBtb2NrVXBkYXRlRnJvbUdpdEh1YiA9IHZpLmZuKClcbnZpLm1vY2soJ0Avc2VydmljZS9wbHVnaW5zJywgKCkgPT4gKHtcbiAgdXBkYXRlRnJvbUdpdEh1YjogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gbW9ja1VwZGF0ZUZyb21HaXRIdWIoLi4uYXJncyksXG59KSlcblxuY29uc3QgbW9ja0luc3RhbGxQYWNrYWdlRnJvbUdpdEh1YiA9IHZpLmZuKClcbmNvbnN0IG1vY2tIYW5kbGVSZWZldGNoID0gdmkuZm4oKVxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1wbHVnaW5zJywgKCkgPT4gKHtcbiAgdXNlSW5zdGFsbFBhY2thZ2VGcm9tR2l0SHViOiAoKSA9PiAoeyBtdXRhdGVBc3luYzogbW9ja0luc3RhbGxQYWNrYWdlRnJvbUdpdEh1YiB9KSxcbiAgdXNlUGx1Z2luVGFza0xpc3Q6ICgpID0+ICh7IGhhbmRsZVJlZmV0Y2g6IG1vY2tIYW5kbGVSZWZldGNoIH0pLFxufSkpXG5cbmNvbnN0IG1vY2tDaGVjayA9IHZpLmZuKClcbnZpLm1vY2soJy4uLy4uL2Jhc2UvY2hlY2stdGFzay1zdGF0dXMnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiAoeyBjaGVjazogbW9ja0NoZWNrIH0pLFxufSkpXG5cbi8vIE1vY2sgQ2FyZCBjb21wb25lbnRcbnZpLm1vY2soJy4uLy4uLy4uL2NhcmQnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBwYXlsb2FkLCB0aXRsZUxlZnQgfTogeyBwYXlsb2FkOiBQbHVnaW4sIHRpdGxlTGVmdD86IFJlYWN0LlJlYWN0Tm9kZSB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInBsdWdpbi1jYXJkXCI+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImNhcmQtbmFtZVwiPntwYXlsb2FkLm5hbWV9PC9zcGFuPlxuICAgICAge3RpdGxlTGVmdCAmJiA8c3BhbiBkYXRhLXRlc3RpZD1cInRpdGxlLWxlZnRcIj57dGl0bGVMZWZ0fTwvc3Bhbj59XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuLy8gTW9jayBWZXJzaW9uIGNvbXBvbmVudFxudmkubW9jaygnLi4vLi4vYmFzZS92ZXJzaW9uJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgaGFzSW5zdGFsbGVkLCBpbnN0YWxsZWRWZXJzaW9uLCB0b0luc3RhbGxWZXJzaW9uIH06IHtcbiAgICBoYXNJbnN0YWxsZWQ6IGJvb2xlYW5cbiAgICBpbnN0YWxsZWRWZXJzaW9uPzogc3RyaW5nXG4gICAgdG9JbnN0YWxsVmVyc2lvbjogc3RyaW5nXG4gIH0pID0+IChcbiAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInZlcnNpb24taW5mb1wiPlxuICAgICAge2hhc0luc3RhbGxlZCA/IGBVcGRhdGUgZnJvbSAke2luc3RhbGxlZFZlcnNpb259IHRvICR7dG9JbnN0YWxsVmVyc2lvbn1gIDogYEluc3RhbGwgJHt0b0luc3RhbGxWZXJzaW9ufWB9XG4gICAgPC9zcGFuPlxuICApLFxufSkpXG5cbi8vIEZhY3RvcnkgZnVuY3Rpb25zXG5jb25zdCBjcmVhdGVNb2NrUGF5bG9hZCA9IChvdmVycmlkZXM6IFBhcnRpYWw8UGx1Z2luRGVjbGFyYXRpb24+ID0ge30pOiBQbHVnaW5EZWNsYXJhdGlvbiA9PiAoe1xuICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICd0ZXN0LXVpZCcsXG4gIHZlcnNpb246ICcxLjAuMCcsXG4gIGF1dGhvcjogJ3Rlc3QtYXV0aG9yJyxcbiAgaWNvbjogJ2ljb24ucG5nJyxcbiAgbmFtZTogJ1Rlc3QgUGx1Z2luJyxcbiAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICBsYWJlbDogeyAnZW4tVVMnOiAnVGVzdCcgfSBhcyBQbHVnaW5EZWNsYXJhdGlvblsnbGFiZWwnXSxcbiAgZGVzY3JpcHRpb246IHsgJ2VuLVVTJzogJ1Rlc3QgRGVzY3JpcHRpb24nIH0gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ2Rlc2NyaXB0aW9uJ10sXG4gIGNyZWF0ZWRfYXQ6ICcyMDI0LTAxLTAxJyxcbiAgcmVzb3VyY2U6IHt9LFxuICBwbHVnaW5zOiBbXSxcbiAgdmVyaWZpZWQ6IHRydWUsXG4gIGVuZHBvaW50OiB7IHNldHRpbmdzOiBbXSwgZW5kcG9pbnRzOiBbXSB9LFxuICBtb2RlbDogbnVsbCxcbiAgdGFnczogW10sXG4gIGFnZW50X3N0cmF0ZWd5OiBudWxsLFxuICBtZXRhOiB7IHZlcnNpb246ICcxLjAuMCcgfSxcbiAgdHJpZ2dlcjoge30gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ3RyaWdnZXInXSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja1BsdWdpblBheWxvYWQgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFBsdWdpbj4gPSB7fSk6IFBsdWdpbiA9PiAoe1xuICB0eXBlOiAncGx1Z2luJyxcbiAgb3JnOiAndGVzdC1vcmcnLFxuICBuYW1lOiAnVGVzdCBQbHVnaW4nLFxuICBwbHVnaW5faWQ6ICd0ZXN0LXBsdWdpbi1pZCcsXG4gIHZlcnNpb246ICcxLjAuMCcsXG4gIGxhdGVzdF92ZXJzaW9uOiAnMS4wLjAnLFxuICBsYXRlc3RfcGFja2FnZV9pZGVudGlmaWVyOiAndGVzdC1wa2cnLFxuICBpY29uOiAnaWNvbi5wbmcnLFxuICB2ZXJpZmllZDogdHJ1ZSxcbiAgbGFiZWw6IHsgJ2VuLVVTJzogJ1Rlc3QnIH0sXG4gIGJyaWVmOiB7ICdlbi1VUyc6ICdCcmllZicgfSxcbiAgZGVzY3JpcHRpb246IHsgJ2VuLVVTJzogJ0Rlc2NyaXB0aW9uJyB9LFxuICBpbnRyb2R1Y3Rpb246ICdJbnRybycsXG4gIHJlcG9zaXRvcnk6ICcnLFxuICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gIGluc3RhbGxfY291bnQ6IDEwMCxcbiAgZW5kcG9pbnQ6IHsgc2V0dGluZ3M6IFtdIH0sXG4gIHRhZ3M6IFtdLFxuICBiYWRnZXM6IFtdLFxuICB2ZXJpZmljYXRpb246IHsgYXV0aG9yaXplZF9jYXRlZ29yeTogJ2xhbmdnZW5pdXMnIH0sXG4gIGZyb206ICdnaXRodWInLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVVcGRhdGVQYXlsb2FkID0gKCk6IFVwZGF0ZUZyb21HaXRIdWJQYXlsb2FkID0+ICh7XG4gIG9yaWdpbmFsUGFja2FnZUluZm86IHtcbiAgICBpZDogJ29yaWdpbmFsLWlkJyxcbiAgICByZXBvOiAnb3duZXIvcmVwbycsXG4gICAgdmVyc2lvbjogJ3YwLjkuMCcsXG4gICAgcGFja2FnZTogJ3BsdWdpbi56aXAnLFxuICAgIHJlbGVhc2VzOiBbXSxcbiAgfSxcbn0pXG5cbmRlc2NyaWJlKCdMb2FkZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICB1cGRhdGVQYXlsb2FkOiB1bmRlZmluZWQsXG4gICAgdW5pcXVlSWRlbnRpZmllcjogJ3Rlc3QtdW5pcXVlLWlkJyxcbiAgICBwYXlsb2FkOiBjcmVhdGVNb2NrUGF5bG9hZCgpIGFzIFBsdWdpbkRlY2xhcmF0aW9uIHwgUGx1Z2luLFxuICAgIHJlcG9Vcmw6ICdodHRwczovL2dpdGh1Yi5jb20vb3duZXIvcmVwbycsXG4gICAgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJyxcbiAgICBzZWxlY3RlZFBhY2thZ2U6ICdwbHVnaW4uemlwJyxcbiAgICBvbkJhY2s6IHZpLmZuKCksXG4gICAgb25TdGFydFRvSW5zdGFsbDogdmkuZm4oKSxcbiAgICBvbkluc3RhbGxlZDogdmkuZm4oKSxcbiAgICBvbkZhaWxlZDogdmkuZm4oKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tVc2VDaGVja0luc3RhbGxlZC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgaW5zdGFsbGVkSW5mbzoge30sXG4gICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgIH0pXG4gICAgbW9ja1VwZGF0ZUZyb21HaXRIdWIubW9ja1Jlc29sdmVkVmFsdWUoeyBhbGxfaW5zdGFsbGVkOiB0cnVlLCB0YXNrX2lkOiAndGFzay0xJyB9KVxuICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21HaXRIdWIubW9ja1Jlc29sdmVkVmFsdWUoeyBhbGxfaW5zdGFsbGVkOiB0cnVlLCB0YXNrX2lkOiAndGFzay0xJyB9KVxuICAgIG1vY2tDaGVjay5tb2NrUmVzb2x2ZWRWYWx1ZSh7IHN0YXR1czogVGFza1N0YXR1cy5zdWNjZXNzLCBlcnJvcjogbnVsbCB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHJlYWR5IHRvIGluc3RhbGwgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5yZWFkeVRvSW5zdGFsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBsdWdpbiBjYXJkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMb2FkZWQgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbi1jYXJkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYmFjayBidXR0b24gd2hlbiBub3QgaW5zdGFsbGluZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5iYWNrJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpbnN0YWxsIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsL2kgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHZlcnNpb24gaW5mbyBpbiBjYXJkIHRpdGxlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMb2FkZWQgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ZlcnNpb24taW5mbycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHBsdWdpbiBuYW1lIGZyb20gcGF5bG9hZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLW5hbWUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1Rlc3QgUGx1Z2luJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNvcnJlY3QgdmVyc2lvbiB0byBWZXJzaW9uIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e2NyZWF0ZU1vY2tQYXlsb2FkKHsgdmVyc2lvbjogJzIuMC4wJyB9KX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ZlcnNpb24taW5mbycpKS50b0hhdmVUZXh0Q29udGVudCgnSW5zdGFsbCAyLjAuMCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBCdXR0b24gU3RhdGUgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0J1dHRvbiBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc2FibGUgaW5zdGFsbCBidXR0b24gd2hpbGUgbG9hZGluZycsICgpID0+IHtcbiAgICAgIG1vY2tVc2VDaGVja0luc3RhbGxlZC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpbnN0YWxsZWRJbmZvOiB7fSxcbiAgICAgICAgaXNMb2FkaW5nOiB0cnVlLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxMb2FkZWQgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9wbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwvaSB9KSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBlbmFibGUgaW5zdGFsbCBidXR0b24gd2hlbiBub3QgbG9hZGluZycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsL2kgfSkpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkJhY2sgd2hlbiBiYWNrIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25CYWNrID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxMb2FkZWQgey4uLmRlZmF1bHRQcm9wc30gb25CYWNrPXtvbkJhY2t9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5iYWNrJyB9KSlcblxuICAgICAgZXhwZWN0KG9uQmFjaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblN0YXJ0VG9JbnN0YWxsIHdoZW4gaW5zdGFsbCBzdGFydHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvblN0YXJ0VG9JbnN0YWxsID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxMb2FkZWQgey4uLmRlZmF1bHRQcm9wc30gb25TdGFydFRvSW5zdGFsbD17b25TdGFydFRvSW5zdGFsbH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9wbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwvaSB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvblN0YXJ0VG9JbnN0YWxsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnN0YWxsYXRpb24gRmxvdyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSW5zdGFsbGF0aW9uIEZsb3dzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBpbnN0YWxsUGFja2FnZUZyb21HaXRIdWIgZm9yIGZyZXNoIGluc3RhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvbkluc3RhbGxlZCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IG9uSW5zdGFsbGVkPXtvbkluc3RhbGxlZH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9wbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwvaSB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSW5zdGFsbFBhY2thZ2VGcm9tR2l0SHViKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgcmVwb1VybDogJ293bmVyL3JlcG8nLFxuICAgICAgICAgIHNlbGVjdGVkVmVyc2lvbjogJ3YxLjAuMCcsXG4gICAgICAgICAgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICAgICAgdW5pcXVlSWRlbnRpZmllcjogJ3Rlc3QtdW5pcXVlLWlkJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCB1cGRhdGVGcm9tR2l0SHViIHdoZW4gdXBkYXRlUGF5bG9hZCBpcyBwcm92aWRlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZVBheWxvYWQgPSBjcmVhdGVVcGRhdGVQYXlsb2FkKClcbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IHVwZGF0ZVBheWxvYWQ9e3VwZGF0ZVBheWxvYWR9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsL2kgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1VwZGF0ZUZyb21HaXRIdWIpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICdvd25lci9yZXBvJyxcbiAgICAgICAgICAndjEuMC4wJyxcbiAgICAgICAgICAncGx1Z2luLnppcCcsXG4gICAgICAgICAgJ29yaWdpbmFsLWlkJyxcbiAgICAgICAgICAndGVzdC11bmlxdWUtaWQnLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgdXBkYXRlRnJvbUdpdEh1YiB3aGVuIHBsdWdpbiBpcyBhbHJlYWR5IGluc3RhbGxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tVc2VDaGVja0luc3RhbGxlZC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpbnN0YWxsZWRJbmZvOiB7XG4gICAgICAgICAgJ3Rlc3QtcGx1Z2luLWlkJzoge1xuICAgICAgICAgICAgaW5zdGFsbGVkVmVyc2lvbjogJzAuOS4wJyxcbiAgICAgICAgICAgIHVuaXF1ZUlkZW50aWZpZXI6ICdpbnN0YWxsZWQtdWlkJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxMb2FkZWQgey4uLmRlZmF1bHRQcm9wc30gcGF5bG9hZD17Y3JlYXRlTW9ja1BsdWdpblBheWxvYWQoKX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9wbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwvaSB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVXBkYXRlRnJvbUdpdEh1YikudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgJ293bmVyL3JlcG8nLFxuICAgICAgICAgICd2MS4wLjAnLFxuICAgICAgICAgICdwbHVnaW4uemlwJyxcbiAgICAgICAgICAnaW5zdGFsbGVkLXVpZCcsXG4gICAgICAgICAgJ3Rlc3QtdW5pcXVlLWlkJyxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uSW5zdGFsbGVkIHdoZW4gaW5zdGFsbGF0aW9uIGNvbXBsZXRlcyBpbW1lZGlhdGVseScsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21HaXRIdWIubW9ja1Jlc29sdmVkVmFsdWUoeyBhbGxfaW5zdGFsbGVkOiB0cnVlLCB0YXNrX2lkOiAndGFzay0xJyB9KVxuXG4gICAgICBjb25zdCBvbkluc3RhbGxlZCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IG9uSW5zdGFsbGVkPXtvbkluc3RhbGxlZH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9wbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwvaSB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkluc3RhbGxlZCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNoZWNrIHRhc2sgc3RhdHVzIHdoZW4gbm90IGltbWVkaWF0ZWx5IGluc3RhbGxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21HaXRIdWIubW9ja1Jlc29sdmVkVmFsdWUoeyBhbGxfaW5zdGFsbGVkOiBmYWxzZSwgdGFza19pZDogJ3Rhc2stMScgfSlcblxuICAgICAgcmVuZGVyKDxMb2FkZWQgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9wbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwvaSB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlUmVmZXRjaCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICAgIGV4cGVjdChtb2NrQ2hlY2spLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0YXNrSWQ6ICd0YXNrLTEnLFxuICAgICAgICAgIHBsdWdpblVuaXF1ZUlkZW50aWZpZXI6ICd0ZXN0LXVuaXF1ZS1pZCcsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25JbnN0YWxsZWQgd2l0aCB0cnVlIHdoZW4gdGFzayBzdWNjZWVkcycsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21HaXRIdWIubW9ja1Jlc29sdmVkVmFsdWUoeyBhbGxfaW5zdGFsbGVkOiBmYWxzZSwgdGFza19pZDogJ3Rhc2stMScgfSlcbiAgICAgIG1vY2tDaGVjay5tb2NrUmVzb2x2ZWRWYWx1ZSh7IHN0YXR1czogVGFza1N0YXR1cy5zdWNjZXNzLCBlcnJvcjogbnVsbCB9KVxuXG4gICAgICBjb25zdCBvbkluc3RhbGxlZCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IG9uSW5zdGFsbGVkPXtvbkluc3RhbGxlZH0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9wbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwvaSB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkluc3RhbGxlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFcnJvciBIYW5kbGluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRXJyb3IgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uRmFpbGVkIHdoZW4gdGFzayBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21HaXRIdWIubW9ja1Jlc29sdmVkVmFsdWUoeyBhbGxfaW5zdGFsbGVkOiBmYWxzZSwgdGFza19pZDogJ3Rhc2stMScgfSlcbiAgICAgIG1vY2tDaGVjay5tb2NrUmVzb2x2ZWRWYWx1ZSh7IHN0YXR1czogVGFza1N0YXR1cy5mYWlsZWQsIGVycm9yOiAnSW5zdGFsbGF0aW9uIGZhaWxlZCcgfSlcblxuICAgICAgY29uc3Qgb25GYWlsZWQgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPExvYWRlZCB7Li4uZGVmYXVsdFByb3BzfSBvbkZhaWxlZD17b25GYWlsZWR9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsL2kgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25GYWlsZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdJbnN0YWxsYXRpb24gZmFpbGVkJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkZhaWxlZCB3aXRoIHN0cmluZyBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21HaXRIdWIubW9ja1JlamVjdGVkVmFsdWUoJ1N0cmluZyBlcnJvciBtZXNzYWdlJylcblxuICAgICAgY29uc3Qgb25GYWlsZWQgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPExvYWRlZCB7Li4uZGVmYXVsdFByb3BzfSBvbkZhaWxlZD17b25GYWlsZWR9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsL2kgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25GYWlsZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdTdHJpbmcgZXJyb3IgbWVzc2FnZScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25GYWlsZWQgd2l0aG91dCBtZXNzYWdlIGZvciBub24tc3RyaW5nIGVycm9ycycsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tJbnN0YWxsUGFja2FnZUZyb21HaXRIdWIubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdFcnJvciBvYmplY3QnKSlcblxuICAgICAgY29uc3Qgb25GYWlsZWQgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPExvYWRlZCB7Li4uZGVmYXVsdFByb3BzfSBvbkZhaWxlZD17b25GYWlsZWR9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsL2kgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25GYWlsZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBBdXRvLWluc3RhbGwgRWZmZWN0IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdBdXRvLWluc3RhbGwgRWZmZWN0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkluc3RhbGxlZCB3aGVuIGFscmVhZHkgaW5zdGFsbGVkIHdpdGggc2FtZSBpZGVudGlmaWVyJywgKCkgPT4ge1xuICAgICAgbW9ja1VzZUNoZWNrSW5zdGFsbGVkLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGluc3RhbGxlZEluZm86IHtcbiAgICAgICAgICAndGVzdC1wbHVnaW4taWQnOiB7XG4gICAgICAgICAgICBpbnN0YWxsZWRWZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICAgICAgdW5pcXVlSWRlbnRpZmllcjogJ3Rlc3QtdW5pcXVlLWlkJyxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBpc0xvYWRpbmc6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgY29uc3Qgb25JbnN0YWxsZWQgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPExvYWRlZCB7Li4uZGVmYXVsdFByb3BzfSBwYXlsb2FkPXtjcmVhdGVNb2NrUGx1Z2luUGF5bG9hZCgpfSBvbkluc3RhbGxlZD17b25JbnN0YWxsZWR9IC8+KVxuXG4gICAgICBleHBlY3Qob25JbnN0YWxsZWQpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCBjYWxsIG9uSW5zdGFsbGVkIHdoZW4gaWRlbnRpZmllcnMgZGlmZmVyJywgKCkgPT4ge1xuICAgICAgbW9ja1VzZUNoZWNrSW5zdGFsbGVkLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAgIGluc3RhbGxlZEluZm86IHtcbiAgICAgICAgICAndGVzdC1wbHVnaW4taWQnOiB7XG4gICAgICAgICAgICBpbnN0YWxsZWRWZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICAgICAgdW5pcXVlSWRlbnRpZmllcjogJ2RpZmZlcmVudC11aWQnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGlzTG9hZGluZzogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBvbkluc3RhbGxlZCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e2NyZWF0ZU1vY2tQbHVnaW5QYXlsb2FkKCl9IG9uSW5zdGFsbGVkPXtvbkluc3RhbGxlZH0gLz4pXG5cbiAgICAgIGV4cGVjdChvbkluc3RhbGxlZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gSW5zdGFsbGluZyBTdGF0ZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSW5zdGFsbGluZyBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhpZGUgYmFjayBidXR0b24gd2hpbGUgaW5zdGFsbGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCByZXNvbHZlSW5zdGFsbDogKHZhbHVlOiB7IGFsbF9pbnN0YWxsZWQ6IGJvb2xlYW4sIHRhc2tfaWQ6IHN0cmluZyB9KSA9PiB2b2lkXG4gICAgICBtb2NrSW5zdGFsbFBhY2thZ2VGcm9tR2l0SHViLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICByZXNvbHZlSW5zdGFsbCA9IHJlc29sdmVcbiAgICAgIH0pKVxuXG4gICAgICByZW5kZXIoPExvYWRlZCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbC9pIH0pKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5iYWNrJyB9KSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIHJlc29sdmVJbnN0YWxsISh7IGFsbF9pbnN0YWxsZWQ6IHRydWUsIHRhc2tfaWQ6ICd0YXNrLTEnIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBpbnN0YWxsaW5nIHRleHQgd2hpbGUgaW5zdGFsbGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCByZXNvbHZlSW5zdGFsbDogKHZhbHVlOiB7IGFsbF9pbnN0YWxsZWQ6IGJvb2xlYW4sIHRhc2tfaWQ6IHN0cmluZyB9KSA9PiB2b2lkXG4gICAgICBtb2NrSW5zdGFsbFBhY2thZ2VGcm9tR2l0SHViLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICByZXNvbHZlSW5zdGFsbCA9IHJlc29sdmVcbiAgICAgIH0pKVxuXG4gICAgICByZW5kZXIoPExvYWRlZCB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbC9pIH0pKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbGluZycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICByZXNvbHZlSW5zdGFsbCEoeyBhbGxfaW5zdGFsbGVkOiB0cnVlLCB0YXNrX2lkOiAndGFzay0xJyB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCB0cmlnZ2VyIGluc3RhbGwgdHdpY2Ugd2hlbiBhbHJlYWR5IGluc3RhbGxpbmcnLCBhc3luYyAoKSA9PiB7XG4gICAgICBsZXQgcmVzb2x2ZUluc3RhbGw6ICh2YWx1ZTogeyBhbGxfaW5zdGFsbGVkOiBib29sZWFuLCB0YXNrX2lkOiBzdHJpbmcgfSkgPT4gdm9pZFxuICAgICAgbW9ja0luc3RhbGxQYWNrYWdlRnJvbUdpdEh1Yi5tb2NrSW1wbGVtZW50YXRpb24oKCkgPT4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgcmVzb2x2ZUluc3RhbGwgPSByZXNvbHZlXG4gICAgICB9KSlcblxuICAgICAgcmVuZGVyKDxMb2FkZWQgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGluc3RhbGxCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9wbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwvaSB9KVxuXG4gICAgICAvLyBDbGljayB0d2ljZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGluc3RhbGxCdXR0b24pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soaW5zdGFsbEJ1dHRvbilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSW5zdGFsbFBhY2thZ2VGcm9tR2l0SHViKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgIH0pXG5cbiAgICAgIHJlc29sdmVJbnN0YWxsISh7IGFsbF9pbnN0YWxsZWQ6IHRydWUsIHRhc2tfaWQ6ICd0YXNrLTEnIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1pc3Npbmcgb25TdGFydFRvSW5zdGFsbCBjYWxsYmFjaycsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IG9uU3RhcnRUb0luc3RhbGw9e3VuZGVmaW5lZH0gLz4pXG5cbiAgICAgIC8vIFNob3VsZCBub3QgdGhyb3cgd2hlbiBjYWxsYmFjayBpcyB1bmRlZmluZWRcbiAgICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6IC9wbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwvaSB9KSlcbiAgICAgIH0pLm5vdC50b1Rocm93KClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSW5zdGFsbFBhY2thZ2VGcm9tR2l0SHViKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHBsdWdpbiB3aXRob3V0IHBsdWdpbl9pZCcsICgpID0+IHtcbiAgICAgIG1vY2tVc2VDaGVja0luc3RhbGxlZC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBpbnN0YWxsZWRJbmZvOiB7fSxcbiAgICAgICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8TG9hZGVkIHsuLi5kZWZhdWx0UHJvcHN9IHBheWxvYWQ9e2NyZWF0ZU1vY2tQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBleHBlY3QobW9ja1VzZUNoZWNrSW5zdGFsbGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHBsdWdpbklkczogW3VuZGVmaW5lZF0sXG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBzdGF0ZSBhZnRlciBjb21wb25lbnQgdXBkYXRlJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxMb2FkZWQgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIHJlcmVuZGVyKDxMb2FkZWQgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbi1jYXJkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==