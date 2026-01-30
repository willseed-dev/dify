"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const toast_1 = require("@/app/components/base/toast");
// ==================== Imports (after mocks) ====================
const types_1 = require("../types");
const action_1 = require("./action");
// ==================== Mock Setup ====================
// Use vi.hoisted to define mock functions that can be referenced in vi.mock
const { mockUninstallPlugin, mockFetchReleases, mockCheckForUpdates, mockSetShowUpdatePluginModal, mockInvalidateInstalledPluginList, } = vitest_1.vi.hoisted(() => ({
    mockUninstallPlugin: vitest_1.vi.fn(),
    mockFetchReleases: vitest_1.vi.fn(),
    mockCheckForUpdates: vitest_1.vi.fn(),
    mockSetShowUpdatePluginModal: vitest_1.vi.fn(),
    mockInvalidateInstalledPluginList: vitest_1.vi.fn(),
}));
// Mock uninstall plugin service
vitest_1.vi.mock('@/service/plugins', () => ({
    uninstallPlugin: (id) => mockUninstallPlugin(id),
}));
// Mock GitHub releases hook
vitest_1.vi.mock('../install-plugin/hooks', () => ({
    useGitHubReleases: () => ({
        fetchReleases: mockFetchReleases,
        checkForUpdates: mockCheckForUpdates,
    }),
}));
// Mock modal context
vitest_1.vi.mock('@/context/modal-context', () => ({
    useModalContext: () => ({
        setShowUpdatePluginModal: mockSetShowUpdatePluginModal,
    }),
}));
// Mock invalidate installed plugin list
vitest_1.vi.mock('@/service/use-plugins', () => ({
    useInvalidateInstalledPluginList: () => mockInvalidateInstalledPluginList,
}));
// Mock PluginInfo component - has complex dependencies (Modal, KeyValueItem)
vitest_1.vi.mock('../plugin-page/plugin-info', () => ({
    default: ({ repository, release, packageName, onHide }) => (<div data-testid="plugin-info-modal" data-repo={repository} data-release={release} data-package={packageName}>
      <button data-testid="close-plugin-info" onClick={onHide}>Close</button>
    </div>),
}));
// Mock Tooltip - uses PortalToFollowElem which requires complex floating UI setup
// Simplified mock that just renders children with tooltip content accessible
vitest_1.vi.mock('../../base/tooltip', () => ({
    default: ({ children, popupContent }) => (<div data-testid="tooltip" data-popup-content={popupContent}>
      {children}
    </div>),
}));
// Mock Confirm - uses createPortal which has issues in test environment
vitest_1.vi.mock('../../base/confirm', () => ({
    default: ({ isShow, title, content, onCancel, onConfirm, isLoading, isDisabled }) => {
        if (!isShow)
            return null;
        return (<div data-testid="confirm-modal" data-loading={isLoading} data-disabled={isDisabled}>
        <div data-testid="confirm-title">{title}</div>
        <div data-testid="confirm-content">{content}</div>
        <button data-testid="confirm-cancel" onClick={onCancel}>Cancel</button>
        <button data-testid="confirm-ok" onClick={onConfirm} disabled={isDisabled}>Confirm</button>
      </div>);
    },
}));
const createActionProps = (overrides = {}) => ({
    author: 'test-author',
    installationId: 'install-123',
    pluginUniqueIdentifier: 'test-author/test-plugin@1.0.0',
    pluginName: 'test-plugin',
    category: 'tool',
    usedInApps: 5,
    isShowFetchNewVersion: false,
    isShowInfo: false,
    isShowDelete: true,
    onDelete: vitest_1.vi.fn(),
    meta: {
        repo: 'test-author/test-plugin',
        version: '1.0.0',
        package: 'test-plugin.difypkg',
    },
    ...overrides,
});
// ==================== Tests ====================
// Helper to find action buttons (real ActionButton component uses type="button")
const getActionButtons = () => react_1.screen.getAllByRole('button');
const queryActionButtons = () => react_1.screen.queryAllByRole('button');
(0, vitest_1.describe)('Action Component', () => {
    // Spy on Toast.notify - real component but we track calls
    let toastNotifySpy;
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        // Spy on Toast.notify and mock implementation to avoid DOM side effects
        toastNotifySpy = vitest_1.vi.spyOn(toast_1.default, 'notify').mockImplementation(() => ({ clear: vitest_1.vi.fn() }));
        mockUninstallPlugin.mockResolvedValue({ success: true });
        mockFetchReleases.mockResolvedValue([]);
        mockCheckForUpdates.mockReturnValue({
            needUpdate: false,
            toastProps: { type: 'info', message: 'Up to date' },
        });
    });
    afterEach(() => {
        toastNotifySpy.mockRestore();
    });
    // ==================== Rendering Tests ====================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render delete button when isShowDelete is true', () => {
            // Arrange
            const props = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(getActionButtons()).toHaveLength(1);
        });
        (0, vitest_1.it)('should render fetch new version button when isShowFetchNewVersion is true', () => {
            // Arrange
            const props = createActionProps({
                isShowFetchNewVersion: true,
                isShowInfo: false,
                isShowDelete: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(getActionButtons()).toHaveLength(1);
        });
        (0, vitest_1.it)('should render info button when isShowInfo is true', () => {
            // Arrange
            const props = createActionProps({
                isShowFetchNewVersion: false,
                isShowInfo: true,
                isShowDelete: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(getActionButtons()).toHaveLength(1);
        });
        (0, vitest_1.it)('should render all buttons when all flags are true', () => {
            // Arrange
            const props = createActionProps({
                isShowFetchNewVersion: true,
                isShowInfo: true,
                isShowDelete: true,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(getActionButtons()).toHaveLength(3);
        });
        (0, vitest_1.it)('should render no buttons when all flags are false', () => {
            // Arrange
            const props = createActionProps({
                isShowFetchNewVersion: false,
                isShowInfo: false,
                isShowDelete: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            // Assert
            (0, vitest_1.expect)(queryActionButtons()).toHaveLength(0);
        });
        (0, vitest_1.it)('should render tooltips for each button', () => {
            // Arrange
            const props = createActionProps({
                isShowFetchNewVersion: true,
                isShowInfo: true,
                isShowDelete: true,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            // Assert
            const tooltips = react_1.screen.getAllByTestId('tooltip');
            (0, vitest_1.expect)(tooltips).toHaveLength(3);
        });
    });
    // ==================== Delete Functionality Tests ====================
    (0, vitest_1.describe)('Delete Functionality', () => {
        (0, vitest_1.it)('should show delete confirm modal when delete button is clicked', () => {
            // Arrange
            const props = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('confirm-modal')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('confirm-title')).toHaveTextContent('plugin.action.delete');
        });
        (0, vitest_1.it)('should display plugin name in delete confirm content', () => {
            // Arrange
            const props = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
                pluginName: 'my-awesome-plugin',
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('my-awesome-plugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should hide confirm modal when cancel is clicked', () => {
            // Arrange
            const props = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            (0, vitest_1.expect)(react_1.screen.getByTestId('confirm-modal')).toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-cancel'));
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should call uninstallPlugin when confirm is clicked', async () => {
            // Arrange
            const props = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
                installationId: 'install-456',
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUninstallPlugin).toHaveBeenCalledWith('install-456');
            });
        });
        (0, vitest_1.it)('should call onDelete callback after successful uninstall', async () => {
            // Arrange
            mockUninstallPlugin.mockResolvedValue({ success: true });
            const onDelete = vitest_1.vi.fn();
            const props = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
                onDelete,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onDelete).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should not call onDelete if uninstall fails', async () => {
            // Arrange
            mockUninstallPlugin.mockResolvedValue({ success: false });
            const onDelete = vitest_1.vi.fn();
            const props = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
                onDelete,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUninstallPlugin).toHaveBeenCalled();
            });
            (0, vitest_1.expect)(onDelete).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('should handle uninstall error gracefully', async () => {
            // Arrange
            const consoleError = vitest_1.vi.spyOn(console, 'error').mockImplementation(() => { });
            mockUninstallPlugin.mockRejectedValue(new Error('Network error'));
            const props = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(consoleError).toHaveBeenCalledWith('uninstallPlugin error', vitest_1.expect.any(Error));
            });
            consoleError.mockRestore();
        });
        (0, vitest_1.it)('should show loading state during deletion', async () => {
            // Arrange
            let resolveUninstall;
            mockUninstallPlugin.mockReturnValue(new Promise((resolve) => {
                resolveUninstall = resolve;
            }));
            const props = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            // Assert - Loading state
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('confirm-modal')).toHaveAttribute('data-loading', 'true');
            });
            // Resolve and check modal closes
            resolveUninstall({ success: true });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
            });
        });
    });
    // ==================== Plugin Info Tests ====================
    (0, vitest_1.describe)('Plugin Info', () => {
        (0, vitest_1.it)('should show plugin info modal when info button is clicked', () => {
            // Arrange
            const props = createActionProps({
                isShowInfo: true,
                isShowDelete: false,
                isShowFetchNewVersion: false,
                meta: {
                    repo: 'owner/repo-name',
                    version: '2.0.0',
                    package: 'my-package.difypkg',
                },
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-info-modal')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-info-modal')).toHaveAttribute('data-repo', 'owner/repo-name');
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-info-modal')).toHaveAttribute('data-release', '2.0.0');
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-info-modal')).toHaveAttribute('data-package', 'my-package.difypkg');
        });
        (0, vitest_1.it)('should hide plugin info modal when close is clicked', () => {
            // Arrange
            const props = createActionProps({
                isShowInfo: true,
                isShowDelete: false,
                isShowFetchNewVersion: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugin-info-modal')).toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByTestId('close-plugin-info'));
            // Assert
            (0, vitest_1.expect)(react_1.screen.queryByTestId('plugin-info-modal')).not.toBeInTheDocument();
        });
    });
    // ==================== Check for Updates Tests ====================
    (0, vitest_1.describe)('Check for Updates', () => {
        (0, vitest_1.it)('should fetch releases when check for updates button is clicked', async () => {
            // Arrange
            mockFetchReleases.mockResolvedValue([{ version: '1.0.0' }]);
            const props = createActionProps({
                isShowFetchNewVersion: true,
                isShowDelete: false,
                isShowInfo: false,
                meta: {
                    repo: 'owner/repo',
                    version: '1.0.0',
                    package: 'pkg.difypkg',
                },
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockFetchReleases).toHaveBeenCalledWith('owner', 'repo');
            });
        });
        (0, vitest_1.it)('should use author and pluginName as fallback for empty repo parts', async () => {
            // Arrange
            mockFetchReleases.mockResolvedValue([{ version: '1.0.0' }]);
            const props = createActionProps({
                isShowFetchNewVersion: true,
                isShowDelete: false,
                isShowInfo: false,
                author: 'fallback-author',
                pluginName: 'fallback-plugin',
                meta: {
                    repo: '/', // Results in empty parts after split
                    version: '1.0.0',
                    package: 'pkg.difypkg',
                },
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockFetchReleases).toHaveBeenCalledWith('fallback-author', 'fallback-plugin');
            });
        });
        (0, vitest_1.it)('should not proceed if no releases are fetched', async () => {
            // Arrange
            mockFetchReleases.mockResolvedValue([]);
            const props = createActionProps({
                isShowFetchNewVersion: true,
                isShowDelete: false,
                isShowInfo: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockFetchReleases).toHaveBeenCalled();
            });
            (0, vitest_1.expect)(mockCheckForUpdates).not.toHaveBeenCalled();
        });
        (0, vitest_1.it)('should show toast notification after checking for updates', async () => {
            // Arrange
            mockFetchReleases.mockResolvedValue([{ version: '2.0.0' }]);
            mockCheckForUpdates.mockReturnValue({
                needUpdate: false,
                toastProps: { type: 'success', message: 'Already up to date' },
            });
            const props = createActionProps({
                isShowFetchNewVersion: true,
                isShowDelete: false,
                isShowInfo: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            // Assert - Toast.notify is called with the toast props
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(toastNotifySpy).toHaveBeenCalledWith({ type: 'success', message: 'Already up to date' });
            });
        });
        (0, vitest_1.it)('should show update modal when update is available', async () => {
            // Arrange
            const releases = [{ version: '2.0.0' }];
            mockFetchReleases.mockResolvedValue(releases);
            mockCheckForUpdates.mockReturnValue({
                needUpdate: true,
                toastProps: { type: 'info', message: 'Update available' },
            });
            const props = createActionProps({
                isShowFetchNewVersion: true,
                isShowDelete: false,
                isShowInfo: false,
                pluginUniqueIdentifier: 'test-id',
                category: 'model',
                meta: {
                    repo: 'owner/repo',
                    version: '1.0.0',
                    package: 'pkg.difypkg',
                },
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockSetShowUpdatePluginModal).toHaveBeenCalledWith(vitest_1.expect.objectContaining({
                    payload: vitest_1.expect.objectContaining({
                        type: types_1.PluginSource.github,
                        category: 'model',
                        github: vitest_1.expect.objectContaining({
                            originalPackageInfo: vitest_1.expect.objectContaining({
                                id: 'test-id',
                                repo: 'owner/repo',
                                version: '1.0.0',
                                package: 'pkg.difypkg',
                                releases,
                            }),
                        }),
                    }),
                }));
            });
        });
        (0, vitest_1.it)('should call invalidateInstalledPluginList on save callback', async () => {
            // Arrange
            const releases = [{ version: '2.0.0' }];
            mockFetchReleases.mockResolvedValue(releases);
            mockCheckForUpdates.mockReturnValue({
                needUpdate: true,
                toastProps: { type: 'info', message: 'Update available' },
            });
            const props = createActionProps({
                isShowFetchNewVersion: true,
                isShowDelete: false,
                isShowInfo: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            // Wait for modal to be called
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockSetShowUpdatePluginModal).toHaveBeenCalled();
            });
            // Invoke the callback
            const call = mockSetShowUpdatePluginModal.mock.calls[0][0];
            call.onSaveCallback();
            // Assert
            (0, vitest_1.expect)(mockInvalidateInstalledPluginList).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should check updates with current version', async () => {
            // Arrange
            const releases = [{ version: '2.0.0' }, { version: '1.5.0' }];
            mockFetchReleases.mockResolvedValue(releases);
            const props = createActionProps({
                isShowFetchNewVersion: true,
                isShowDelete: false,
                isShowInfo: false,
                meta: {
                    repo: 'owner/repo',
                    version: '1.0.0',
                    package: 'pkg.difypkg',
                },
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            // Assert
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockCheckForUpdates).toHaveBeenCalledWith(releases, '1.0.0');
            });
        });
    });
    // ==================== Callback Stability Tests ====================
    (0, vitest_1.describe)('Callback Stability (useCallback)', () => {
        (0, vitest_1.it)('should have stable handleDelete callback with same dependencies', async () => {
            // Arrange
            mockUninstallPlugin.mockResolvedValue({ success: true });
            const onDelete = vitest_1.vi.fn();
            const props = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
                onDelete,
                installationId: 'stable-install-id',
            });
            // Act - First render and delete
            const { rerender } = (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUninstallPlugin).toHaveBeenCalledWith('stable-install-id');
            });
            // Re-render with same props
            mockUninstallPlugin.mockClear();
            rerender(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUninstallPlugin).toHaveBeenCalledWith('stable-install-id');
            });
        });
        (0, vitest_1.it)('should update handleDelete when installationId changes', async () => {
            // Arrange
            mockUninstallPlugin.mockResolvedValue({ success: true });
            const props1 = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
                installationId: 'install-1',
            });
            const props2 = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
                installationId: 'install-2',
            });
            // Act
            const { rerender } = (0, react_1.render)(<action_1.default {...props1}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUninstallPlugin).toHaveBeenCalledWith('install-1');
            });
            mockUninstallPlugin.mockClear();
            rerender(<action_1.default {...props2}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUninstallPlugin).toHaveBeenCalledWith('install-2');
            });
        });
        (0, vitest_1.it)('should update handleDelete when onDelete changes', async () => {
            // Arrange
            mockUninstallPlugin.mockResolvedValue({ success: true });
            const onDelete1 = vitest_1.vi.fn();
            const onDelete2 = vitest_1.vi.fn();
            const props1 = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
                onDelete: onDelete1,
            });
            const props2 = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
                onDelete: onDelete2,
            });
            // Act
            const { rerender } = (0, react_1.render)(<action_1.default {...props1}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onDelete1).toHaveBeenCalled();
            });
            (0, vitest_1.expect)(onDelete2).not.toHaveBeenCalled();
            rerender(<action_1.default {...props2}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onDelete2).toHaveBeenCalled();
            });
        });
    });
    // ==================== Edge Cases ====================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle undefined meta for info display', () => {
            // Arrange - meta is required for info, but test defensive behavior
            const props = createActionProps({
                isShowInfo: false,
                isShowDelete: true,
                isShowFetchNewVersion: false,
                meta: undefined,
            });
            // Act & Assert - Should not crash
            (0, vitest_1.expect)(() => (0, react_1.render)(<action_1.default {...props}/>)).not.toThrow();
        });
        (0, vitest_1.it)('should handle empty repo string', async () => {
            // Arrange
            mockFetchReleases.mockResolvedValue([{ version: '1.0.0' }]);
            const props = createActionProps({
                isShowFetchNewVersion: true,
                isShowDelete: false,
                isShowInfo: false,
                author: 'fallback-owner',
                pluginName: 'fallback-repo',
                meta: {
                    repo: '',
                    version: '1.0.0',
                    package: 'pkg.difypkg',
                },
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            // Assert - Should use author and pluginName as fallback
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockFetchReleases).toHaveBeenCalledWith('fallback-owner', 'fallback-repo');
            });
        });
        (0, vitest_1.it)('should handle concurrent delete requests gracefully', async () => {
            // Arrange
            let resolveFirst;
            const firstPromise = new Promise((resolve) => {
                resolveFirst = resolve;
            });
            mockUninstallPlugin.mockReturnValueOnce(firstPromise);
            const props = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            react_1.fireEvent.click(react_1.screen.getByTestId('confirm-ok'));
            // The confirm button should be disabled during deletion
            (0, vitest_1.expect)(react_1.screen.getByTestId('confirm-modal')).toHaveAttribute('data-loading', 'true');
            (0, vitest_1.expect)(react_1.screen.getByTestId('confirm-modal')).toHaveAttribute('data-disabled', 'true');
            // Resolve the deletion
            resolveFirst({ success: true });
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByTestId('confirm-modal')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should handle special characters in plugin name', () => {
            // Arrange
            const props = createActionProps({
                isShowDelete: true,
                isShowInfo: false,
                isShowFetchNewVersion: false,
                pluginName: 'plugin-with-special@chars#123',
            });
            // Act
            (0, react_1.render)(<action_1.default {...props}/>);
            react_1.fireEvent.click(getActionButtons()[0]);
            // Assert
            (0, vitest_1.expect)(react_1.screen.getByText('plugin-with-special@chars#123')).toBeInTheDocument();
        });
    });
    // ==================== React.memo Tests ====================
    (0, vitest_1.describe)('React.memo Behavior', () => {
        (0, vitest_1.it)('should be wrapped with React.memo', () => {
            // Assert
            (0, vitest_1.expect)(action_1.default).toBeDefined();
            (0, vitest_1.expect)(action_1.default.$$typeof?.toString()).toContain('Symbol');
        });
    });
    // ==================== Prop Variations ====================
    (0, vitest_1.describe)('Prop Variations', () => {
        (0, vitest_1.it)('should handle all category types', () => {
            // Arrange
            const categories = ['tool', 'model', 'extension', 'agent-strategy', 'datasource'];
            categories.forEach((category) => {
                const props = createActionProps({
                    category,
                    isShowDelete: true,
                    isShowInfo: false,
                    isShowFetchNewVersion: false,
                });
                (0, vitest_1.expect)(() => (0, react_1.render)(<action_1.default {...props}/>)).not.toThrow();
            });
        });
        (0, vitest_1.it)('should handle different usedInApps values', () => {
            // Arrange
            const values = [0, 1, 5, 100];
            values.forEach((usedInApps) => {
                const props = createActionProps({
                    usedInApps,
                    isShowDelete: true,
                    isShowInfo: false,
                    isShowFetchNewVersion: false,
                });
                (0, vitest_1.expect)(() => (0, react_1.render)(<action_1.default {...props}/>)).not.toThrow();
            });
        });
        (0, vitest_1.it)('should handle combination of multiple action buttons', () => {
            // Arrange - Test various combinations
            const combinations = [
                { isShowFetchNewVersion: true, isShowInfo: false, isShowDelete: false },
                { isShowFetchNewVersion: false, isShowInfo: true, isShowDelete: false },
                { isShowFetchNewVersion: false, isShowInfo: false, isShowDelete: true },
                { isShowFetchNewVersion: true, isShowInfo: true, isShowDelete: false },
                { isShowFetchNewVersion: true, isShowInfo: false, isShowDelete: true },
                { isShowFetchNewVersion: false, isShowInfo: true, isShowDelete: true },
                { isShowFetchNewVersion: true, isShowInfo: true, isShowDelete: true },
            ];
            combinations.forEach((flags) => {
                const props = createActionProps(flags);
                const expectedCount = [flags.isShowFetchNewVersion, flags.isShowInfo, flags.isShowDelete].filter(Boolean).length;
                const { unmount } = (0, react_1.render)(<action_1.default {...props}/>);
                const buttons = queryActionButtons();
                (0, vitest_1.expect)(buttons).toHaveLength(expectedCount);
                unmount();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhY3Rpb24uc3BlYy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrREFBMkU7QUFDM0UsbUNBQTZEO0FBQzdELHVEQUErQztBQUUvQyxrRUFBa0U7QUFFbEUsb0NBQXVDO0FBQ3ZDLHFDQUE2QjtBQUU3Qix1REFBdUQ7QUFFdkQsNEVBQTRFO0FBQzVFLE1BQU0sRUFDSixtQkFBbUIsRUFDbkIsaUJBQWlCLEVBQ2pCLG1CQUFtQixFQUNuQiw0QkFBNEIsRUFDNUIsaUNBQWlDLEdBQ2xDLEdBQUcsV0FBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3BCLG1CQUFtQixFQUFFLFdBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDNUIsaUJBQWlCLEVBQUUsV0FBRSxDQUFDLEVBQUUsRUFBRTtJQUMxQixtQkFBbUIsRUFBRSxXQUFFLENBQUMsRUFBRSxFQUFFO0lBQzVCLDRCQUE0QixFQUFFLFdBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDckMsaUNBQWlDLEVBQUUsV0FBRSxDQUFDLEVBQUUsRUFBRTtDQUMzQyxDQUFDLENBQUMsQ0FBQTtBQUVILGdDQUFnQztBQUNoQyxXQUFFLENBQUMsSUFBSSxDQUFDLG1CQUFtQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDbEMsZUFBZSxFQUFFLENBQUMsRUFBVSxFQUFFLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLENBQUM7Q0FDekQsQ0FBQyxDQUFDLENBQUE7QUFFSCw0QkFBNEI7QUFDNUIsV0FBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLGlCQUFpQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDeEIsYUFBYSxFQUFFLGlCQUFpQjtRQUNoQyxlQUFlLEVBQUUsbUJBQW1CO0tBQ3JDLENBQUM7Q0FDSCxDQUFDLENBQUMsQ0FBQTtBQUVILHFCQUFxQjtB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WUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUM3QixNQUFNLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtnQkFDdEMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQTtnQkFFaEgsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUEsY0FBTSxFQUFDLENBQUMsZ0JBQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFHLENBQUMsQ0FBQTtnQkFDakQsTUFBTSxPQUFPLEdBQUcsa0JBQWtCLEVBQUUsQ0FBQTtnQkFDcEMsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFBO2dCQUMzQyxPQUFPLEVBQUUsQ0FBQTtZQUNYLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBNZXRhRGF0YSwgUGx1Z2luQ2F0ZWdvcnlFbnVtIH0gZnJvbSAnLi4vdHlwZXMnXG5pbXBvcnQgeyBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCBUb2FzdCBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvdG9hc3QnXG5cbi8vID09PT09PT09PT09PT09PT09PT09IEltcG9ydHMgKGFmdGVyIG1vY2tzKSA9PT09PT09PT09PT09PT09PT09PVxuXG5pbXBvcnQgeyBQbHVnaW5Tb3VyY2UgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCBBY3Rpb24gZnJvbSAnLi9hY3Rpb24nXG5cbi8vID09PT09PT09PT09PT09PT09PT09IE1vY2sgU2V0dXAgPT09PT09PT09PT09PT09PT09PT1cblxuLy8gVXNlIHZpLmhvaXN0ZWQgdG8gZGVmaW5lIG1vY2sgZnVuY3Rpb25zIHRoYXQgY2FuIGJlIHJlZmVyZW5jZWQgaW4gdmkubW9ja1xuY29uc3Qge1xuICBtb2NrVW5pbnN0YWxsUGx1Z2luLFxuICBtb2NrRmV0Y2hSZWxlYXNlcyxcbiAgbW9ja0NoZWNrRm9yVXBkYXRlcyxcbiAgbW9ja1NldFNob3dVcGRhdGVQbHVnaW5Nb2RhbCxcbiAgbW9ja0ludmFsaWRhdGVJbnN0YWxsZWRQbHVnaW5MaXN0LFxufSA9IHZpLmhvaXN0ZWQoKCkgPT4gKHtcbiAgbW9ja1VuaW5zdGFsbFBsdWdpbjogdmkuZm4oKSxcbiAgbW9ja0ZldGNoUmVsZWFzZXM6IHZpLmZuKCksXG4gIG1vY2tDaGVja0ZvclVwZGF0ZXM6IHZpLmZuKCksXG4gIG1vY2tTZXRTaG93VXBkYXRlUGx1Z2luTW9kYWw6IHZpLmZuKCksXG4gIG1vY2tJbnZhbGlkYXRlSW5zdGFsbGVkUGx1Z2luTGlzdDogdmkuZm4oKSxcbn0pKVxuXG4vLyBNb2NrIHVuaW5zdGFsbCBwbHVnaW4gc2VydmljZVxudmkubW9jaygnQC9zZXJ2aWNlL3BsdWdpbnMnLCAoKSA9PiAoe1xuICB1bmluc3RhbGxQbHVnaW46IChpZDogc3RyaW5nKSA9PiBtb2NrVW5pbnN0YWxsUGx1Z2luKGlkKSxcbn0pKVxuXG4vLyBNb2NrIEdpdEh1YiByZWxlYXNlcyBob29rXG52aS5tb2NrKCcuLi9pbnN0YWxsLXBsdWdpbi9ob29rcycsICgpID0+ICh7XG4gIHVzZUdpdEh1YlJlbGVhc2VzOiAoKSA9PiAoe1xuICAgIGZldGNoUmVsZWFzZXM6IG1vY2tGZXRjaFJlbGVhc2VzLFxuICAgIGNoZWNrRm9yVXBkYXRlczogbW9ja0NoZWNrRm9yVXBkYXRlcyxcbiAgfSksXG59KSlcblxuLy8gTW9jayBtb2RhbCBjb250ZXh0XG52aS5tb2NrKCdAL2NvbnRleHQvbW9kYWwtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZU1vZGFsQ29udGV4dDogKCkgPT4gKHtcbiAgICBzZXRTaG93VXBkYXRlUGx1Z2luTW9kYWw6IG1vY2tTZXRTaG93VXBkYXRlUGx1Z2luTW9kYWwsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgaW52YWxpZGF0ZSBpbnN0YWxsZWQgcGx1Z2luIGxpc3RcbnZpLm1vY2soJ0Avc2VydmljZS91c2UtcGx1Z2lucycsICgpID0+ICh7XG4gIHVzZUludmFsaWRhdGVJbnN0YWxsZWRQbHVnaW5MaXN0OiAoKSA9PiBtb2NrSW52YWxpZGF0ZUluc3RhbGxlZFBsdWdpbkxpc3QsXG59KSlcblxuLy8gTW9jayBQbHVnaW5JbmZvIGNvbXBvbmVudCAtIGhhcyBjb21wbGV4IGRlcGVuZGVuY2llcyAoTW9kYWwsIEtleVZhbHVlSXRlbSlcbnZpLm1vY2soJy4uL3BsdWdpbi1wYWdlL3BsdWdpbi1pbmZvJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgcmVwb3NpdG9yeSwgcmVsZWFzZSwgcGFja2FnZU5hbWUsIG9uSGlkZSB9OiB7XG4gICAgcmVwb3NpdG9yeTogc3RyaW5nXG4gICAgcmVsZWFzZTogc3RyaW5nXG4gICAgcGFja2FnZU5hbWU6IHN0cmluZ1xuICAgIG9uSGlkZTogKCkgPT4gdm9pZFxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInBsdWdpbi1pbmZvLW1vZGFsXCIgZGF0YS1yZXBvPXtyZXBvc2l0b3J5fSBkYXRhLXJlbGVhc2U9e3JlbGVhc2V9IGRhdGEtcGFja2FnZT17cGFja2FnZU5hbWV9PlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImNsb3NlLXBsdWdpbi1pbmZvXCIgb25DbGljaz17b25IaWRlfT5DbG9zZTwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgVG9vbHRpcCAtIHVzZXMgUG9ydGFsVG9Gb2xsb3dFbGVtIHdoaWNoIHJlcXVpcmVzIGNvbXBsZXggZmxvYXRpbmcgVUkgc2V0dXBcbi8vIFNpbXBsaWZpZWQgbW9jayB0aGF0IGp1c3QgcmVuZGVycyBjaGlsZHJlbiB3aXRoIHRvb2x0aXAgY29udGVudCBhY2Nlc3NpYmxlXG52aS5tb2NrKCcuLi8uLi9iYXNlL3Rvb2x0aXAnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBjaGlsZHJlbiwgcG9wdXBDb250ZW50IH06IHsgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZSwgcG9wdXBDb250ZW50OiBzdHJpbmcgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJ0b29sdGlwXCIgZGF0YS1wb3B1cC1jb250ZW50PXtwb3B1cENvbnRlbnR9PlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbi8vIE1vY2sgQ29uZmlybSAtIHVzZXMgY3JlYXRlUG9ydGFsIHdoaWNoIGhhcyBpc3N1ZXMgaW4gdGVzdCBlbnZpcm9ubWVudFxudmkubW9jaygnLi4vLi4vYmFzZS9jb25maXJtJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgaXNTaG93LCB0aXRsZSwgY29udGVudCwgb25DYW5jZWwsIG9uQ29uZmlybSwgaXNMb2FkaW5nLCBpc0Rpc2FibGVkIH06IHtcbiAgICBpc1Nob3c6IGJvb2xlYW5cbiAgICB0aXRsZTogc3RyaW5nXG4gICAgY29udGVudDogUmVhY3QuUmVhY3ROb2RlXG4gICAgb25DYW5jZWw6ICgpID0+IHZvaWRcbiAgICBvbkNvbmZpcm06ICgpID0+IHZvaWRcbiAgICBpc0xvYWRpbmc6IGJvb2xlYW5cbiAgICBpc0Rpc2FibGVkOiBib29sZWFuXG4gIH0pID0+IHtcbiAgICBpZiAoIWlzU2hvdylcbiAgICAgIHJldHVybiBudWxsXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJjb25maXJtLW1vZGFsXCIgZGF0YS1sb2FkaW5nPXtpc0xvYWRpbmd9IGRhdGEtZGlzYWJsZWQ9e2lzRGlzYWJsZWR9PlxuICAgICAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY29uZmlybS10aXRsZVwiPnt0aXRsZX08L2Rpdj5cbiAgICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cImNvbmZpcm0tY29udGVudFwiPntjb250ZW50fTwvZGl2PlxuICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiY29uZmlybS1jYW5jZWxcIiBvbkNsaWNrPXtvbkNhbmNlbH0+Q2FuY2VsPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJjb25maXJtLW9rXCIgb25DbGljaz17b25Db25maXJtfSBkaXNhYmxlZD17aXNEaXNhYmxlZH0+Q29uZmlybTwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxufSkpXG5cbi8vID09PT09PT09PT09PT09PT09PT09IFRlc3QgVXRpbGl0aWVzID09PT09PT09PT09PT09PT09PT09XG5cbnR5cGUgQWN0aW9uUHJvcHMgPSB7XG4gIGF1dGhvcjogc3RyaW5nXG4gIGluc3RhbGxhdGlvbklkOiBzdHJpbmdcbiAgcGx1Z2luVW5pcXVlSWRlbnRpZmllcjogc3RyaW5nXG4gIHBsdWdpbk5hbWU6IHN0cmluZ1xuICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtXG4gIHVzZWRJbkFwcHM6IG51bWJlclxuICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IGJvb2xlYW5cbiAgaXNTaG93SW5mbzogYm9vbGVhblxuICBpc1Nob3dEZWxldGU6IGJvb2xlYW5cbiAgb25EZWxldGU6ICgpID0+IHZvaWRcbiAgbWV0YT86IE1ldGFEYXRhXG59XG5cbmNvbnN0IGNyZWF0ZUFjdGlvblByb3BzID0gKG92ZXJyaWRlczogUGFydGlhbDxBY3Rpb25Qcm9wcz4gPSB7fSk6IEFjdGlvblByb3BzID0+ICh7XG4gIGF1dGhvcjogJ3Rlc3QtYXV0aG9yJyxcbiAgaW5zdGFsbGF0aW9uSWQ6ICdpbnN0YWxsLTEyMycsXG4gIHBsdWdpblVuaXF1ZUlkZW50aWZpZXI6ICd0ZXN0LWF1dGhvci90ZXN0LXBsdWdpbkAxLjAuMCcsXG4gIHBsdWdpbk5hbWU6ICd0ZXN0LXBsdWdpbicsXG4gIGNhdGVnb3J5OiAndG9vbCcgYXMgUGx1Z2luQ2F0ZWdvcnlFbnVtLFxuICB1c2VkSW5BcHBzOiA1LFxuICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IGZhbHNlLFxuICBpc1Nob3dJbmZvOiBmYWxzZSxcbiAgaXNTaG93RGVsZXRlOiB0cnVlLFxuICBvbkRlbGV0ZTogdmkuZm4oKSxcbiAgbWV0YToge1xuICAgIHJlcG86ICd0ZXN0LWF1dGhvci90ZXN0LXBsdWdpbicsXG4gICAgdmVyc2lvbjogJzEuMC4wJyxcbiAgICBwYWNrYWdlOiAndGVzdC1wbHVnaW4uZGlmeXBrZycsXG4gIH0sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09IFRlc3RzID09PT09PT09PT09PT09PT09PT09XG5cbi8vIEhlbHBlciB0byBmaW5kIGFjdGlvbiBidXR0b25zIChyZWFsIEFjdGlvbkJ1dHRvbiBjb21wb25lbnQgdXNlcyB0eXBlPVwiYnV0dG9uXCIpXG5jb25zdCBnZXRBY3Rpb25CdXR0b25zID0gKCkgPT4gc2NyZWVuLmdldEFsbEJ5Um9sZSgnYnV0dG9uJylcbmNvbnN0IHF1ZXJ5QWN0aW9uQnV0dG9ucyA9ICgpID0+IHNjcmVlbi5xdWVyeUFsbEJ5Um9sZSgnYnV0dG9uJylcblxuZGVzY3JpYmUoJ0FjdGlvbiBDb21wb25lbnQnLCAoKSA9PiB7XG4gIC8vIFNweSBvbiBUb2FzdC5ub3RpZnkgLSByZWFsIGNvbXBvbmVudCBidXQgd2UgdHJhY2sgY2FsbHNcbiAgbGV0IHRvYXN0Tm90aWZ5U3B5OiBSZXR1cm5UeXBlPHR5cGVvZiB2aS5zcHlPbj5cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICAvLyBTcHkgb24gVG9hc3Qubm90aWZ5IGFuZCBtb2NrIGltcGxlbWVudGF0aW9uIHRvIGF2b2lkIERPTSBzaWRlIGVmZmVjdHNcbiAgICB0b2FzdE5vdGlmeVNweSA9IHZpLnNweU9uKFRvYXN0LCAnbm90aWZ5JykubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+ICh7IGNsZWFyOiB2aS5mbigpIH0pKVxuICAgIG1vY2tVbmluc3RhbGxQbHVnaW4ubW9ja1Jlc29sdmVkVmFsdWUoeyBzdWNjZXNzOiB0cnVlIH0pXG4gICAgbW9ja0ZldGNoUmVsZWFzZXMubW9ja1Jlc29sdmVkVmFsdWUoW10pXG4gICAgbW9ja0NoZWNrRm9yVXBkYXRlcy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgbmVlZFVwZGF0ZTogZmFsc2UsXG4gICAgICB0b2FzdFByb3BzOiB7IHR5cGU6ICdpbmZvJywgbWVzc2FnZTogJ1VwIHRvIGRhdGUnIH0sXG4gICAgfSlcbiAgfSlcblxuICBhZnRlckVhY2goKCkgPT4ge1xuICAgIHRvYXN0Tm90aWZ5U3B5Lm1vY2tSZXN0b3JlKClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBSZW5kZXJpbmcgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBkZWxldGUgYnV0dG9uIHdoZW4gaXNTaG93RGVsZXRlIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUFjdGlvblByb3BzKHtcbiAgICAgICAgaXNTaG93RGVsZXRlOiB0cnVlLFxuICAgICAgICBpc1Nob3dJbmZvOiBmYWxzZSxcbiAgICAgICAgaXNTaG93RmV0Y2hOZXdWZXJzaW9uOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoZ2V0QWN0aW9uQnV0dG9ucygpKS50b0hhdmVMZW5ndGgoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgZmV0Y2ggbmV3IHZlcnNpb24gYnV0dG9uIHdoZW4gaXNTaG93RmV0Y2hOZXdWZXJzaW9uIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUFjdGlvblByb3BzKHtcbiAgICAgICAgaXNTaG93RmV0Y2hOZXdWZXJzaW9uOiB0cnVlLFxuICAgICAgICBpc1Nob3dJbmZvOiBmYWxzZSxcbiAgICAgICAgaXNTaG93RGVsZXRlOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoZ2V0QWN0aW9uQnV0dG9ucygpKS50b0hhdmVMZW5ndGgoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgaW5mbyBidXR0b24gd2hlbiBpc1Nob3dJbmZvIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUFjdGlvblByb3BzKHtcbiAgICAgICAgaXNTaG93RmV0Y2hOZXdWZXJzaW9uOiBmYWxzZSxcbiAgICAgICAgaXNTaG93SW5mbzogdHJ1ZSxcbiAgICAgICAgaXNTaG93RGVsZXRlOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QoZ2V0QWN0aW9uQnV0dG9ucygpKS50b0hhdmVMZW5ndGgoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYWxsIGJ1dHRvbnMgd2hlbiBhbGwgZmxhZ3MgYXJlIHRydWUnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUFjdGlvblByb3BzKHtcbiAgICAgICAgaXNTaG93RmV0Y2hOZXdWZXJzaW9uOiB0cnVlLFxuICAgICAgICBpc1Nob3dJbmZvOiB0cnVlLFxuICAgICAgICBpc1Nob3dEZWxldGU6IHRydWUsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9uIHsuLi5wcm9wc30gLz4pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KGdldEFjdGlvbkJ1dHRvbnMoKSkudG9IYXZlTGVuZ3RoKDMpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG5vIGJ1dHRvbnMgd2hlbiBhbGwgZmxhZ3MgYXJlIGZhbHNlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVBY3Rpb25Qcm9wcyh7XG4gICAgICAgIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogZmFsc2UsXG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICBpc1Nob3dEZWxldGU6IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChxdWVyeUFjdGlvbkJ1dHRvbnMoKSkudG9IYXZlTGVuZ3RoKDApXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHRvb2x0aXBzIGZvciBlYWNoIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IHRydWUsXG4gICAgICAgIGlzU2hvd0luZm86IHRydWUsXG4gICAgICAgIGlzU2hvd0RlbGV0ZTogdHJ1ZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzfSAvPilcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBjb25zdCB0b29sdGlwcyA9IHNjcmVlbi5nZXRBbGxCeVRlc3RJZCgndG9vbHRpcCcpXG4gICAgICBleHBlY3QodG9vbHRpcHMpLnRvSGF2ZUxlbmd0aCgzKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gRGVsZXRlIEZ1bmN0aW9uYWxpdHkgVGVzdHMgPT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0RlbGV0ZSBGdW5jdGlvbmFsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBkZWxldGUgY29uZmlybSBtb2RhbCB3aGVuIGRlbGV0ZSBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dEZWxldGU6IHRydWUsXG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldEFjdGlvbkJ1dHRvbnMoKVswXSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjb25maXJtLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tdGl0bGUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BsdWdpbi5hY3Rpb24uZGVsZXRlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHBsdWdpbiBuYW1lIGluIGRlbGV0ZSBjb25maXJtIGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUFjdGlvblByb3BzKHtcbiAgICAgICAgaXNTaG93RGVsZXRlOiB0cnVlLFxuICAgICAgICBpc1Nob3dJbmZvOiBmYWxzZSxcbiAgICAgICAgaXNTaG93RmV0Y2hOZXdWZXJzaW9uOiBmYWxzZSxcbiAgICAgICAgcGx1Z2luTmFtZTogJ215LWF3ZXNvbWUtcGx1Z2luJyxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhnZXRBY3Rpb25CdXR0b25zKClbMF0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ215LWF3ZXNvbWUtcGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoaWRlIGNvbmZpcm0gbW9kYWwgd2hlbiBjYW5jZWwgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dEZWxldGU6IHRydWUsXG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldEFjdGlvbkJ1dHRvbnMoKVswXSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tbW9kYWwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjb25maXJtLWNhbmNlbCcpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnY29uZmlybS1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgdW5pbnN0YWxsUGx1Z2luIHdoZW4gY29uZmlybSBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVBY3Rpb25Qcm9wcyh7XG4gICAgICAgIGlzU2hvd0RlbGV0ZTogdHJ1ZSxcbiAgICAgICAgaXNTaG93SW5mbzogZmFsc2UsXG4gICAgICAgIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogZmFsc2UsXG4gICAgICAgIGluc3RhbGxhdGlvbklkOiAnaW5zdGFsbC00NTYnLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldEFjdGlvbkJ1dHRvbnMoKVswXSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tb2snKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tVbmluc3RhbGxQbHVnaW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdpbnN0YWxsLTQ1NicpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25EZWxldGUgY2FsbGJhY2sgYWZ0ZXIgc3VjY2Vzc2Z1bCB1bmluc3RhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVW5pbnN0YWxsUGx1Z2luLm1vY2tSZXNvbHZlZFZhbHVlKHsgc3VjY2VzczogdHJ1ZSB9KVxuICAgICAgY29uc3Qgb25EZWxldGUgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUFjdGlvblByb3BzKHtcbiAgICAgICAgaXNTaG93RGVsZXRlOiB0cnVlLFxuICAgICAgICBpc1Nob3dJbmZvOiBmYWxzZSxcbiAgICAgICAgaXNTaG93RmV0Y2hOZXdWZXJzaW9uOiBmYWxzZSxcbiAgICAgICAgb25EZWxldGUsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9uIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0QWN0aW9uQnV0dG9ucygpWzBdKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1vaycpKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25EZWxldGUpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCBvbkRlbGV0ZSBpZiB1bmluc3RhbGwgZmFpbHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVW5pbnN0YWxsUGx1Z2luLm1vY2tSZXNvbHZlZFZhbHVlKHsgc3VjY2VzczogZmFsc2UgfSlcbiAgICAgIGNvbnN0IG9uRGVsZXRlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVBY3Rpb25Qcm9wcyh7XG4gICAgICAgIGlzU2hvd0RlbGV0ZTogdHJ1ZSxcbiAgICAgICAgaXNTaG93SW5mbzogZmFsc2UsXG4gICAgICAgIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogZmFsc2UsXG4gICAgICAgIG9uRGVsZXRlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldEFjdGlvbkJ1dHRvbnMoKVswXSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tb2snKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tVbmluc3RhbGxQbHVnaW4pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChvbkRlbGV0ZSkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmluc3RhbGwgZXJyb3IgZ3JhY2VmdWxseScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNvbnNvbGVFcnJvciA9IHZpLnNweU9uKGNvbnNvbGUsICdlcnJvcicpLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiB7fSlcbiAgICAgIG1vY2tVbmluc3RhbGxQbHVnaW4ubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdOZXR3b3JrIGVycm9yJykpXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUFjdGlvblByb3BzKHtcbiAgICAgICAgaXNTaG93RGVsZXRlOiB0cnVlLFxuICAgICAgICBpc1Nob3dJbmZvOiBmYWxzZSxcbiAgICAgICAgaXNTaG93RmV0Y2hOZXdWZXJzaW9uOiBmYWxzZSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhnZXRBY3Rpb25CdXR0b25zKClbMF0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjb25maXJtLW9rJykpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChjb25zb2xlRXJyb3IpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd1bmluc3RhbGxQbHVnaW4gZXJyb3InLCBleHBlY3QuYW55KEVycm9yKSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnNvbGVFcnJvci5tb2NrUmVzdG9yZSgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBsb2FkaW5nIHN0YXRlIGR1cmluZyBkZWxldGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGxldCByZXNvbHZlVW5pbnN0YWxsOiAodmFsdWU6IHsgc3VjY2VzczogYm9vbGVhbiB9KSA9PiB2b2lkXG4gICAgICBtb2NrVW5pbnN0YWxsUGx1Z2luLm1vY2tSZXR1cm5WYWx1ZShcbiAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICByZXNvbHZlVW5pbnN0YWxsID0gcmVzb2x2ZVxuICAgICAgICB9KSxcbiAgICAgIClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dEZWxldGU6IHRydWUsXG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldEFjdGlvbkJ1dHRvbnMoKVswXSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tb2snKSlcblxuICAgICAgLy8gQXNzZXJ0IC0gTG9hZGluZyBzdGF0ZVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tbW9kYWwnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWxvYWRpbmcnLCAndHJ1ZScpXG4gICAgICB9KVxuXG4gICAgICAvLyBSZXNvbHZlIGFuZCBjaGVjayBtb2RhbCBjbG9zZXNcbiAgICAgIHJlc29sdmVVbmluc3RhbGwhKHsgc3VjY2VzczogdHJ1ZSB9KVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnY29uZmlybS1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFBsdWdpbiBJbmZvIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQbHVnaW4gSW5mbycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgcGx1Z2luIGluZm8gbW9kYWwgd2hlbiBpbmZvIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVBY3Rpb25Qcm9wcyh7XG4gICAgICAgIGlzU2hvd0luZm86IHRydWUsXG4gICAgICAgIGlzU2hvd0RlbGV0ZTogZmFsc2UsXG4gICAgICAgIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogZmFsc2UsXG4gICAgICAgIG1ldGE6IHtcbiAgICAgICAgICByZXBvOiAnb3duZXIvcmVwby1uYW1lJyxcbiAgICAgICAgICB2ZXJzaW9uOiAnMi4wLjAnLFxuICAgICAgICAgIHBhY2thZ2U6ICdteS1wYWNrYWdlLmRpZnlwa2cnLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldEFjdGlvbkJ1dHRvbnMoKVswXSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbHVnaW4taW5mby1tb2RhbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbHVnaW4taW5mby1tb2RhbCcpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtcmVwbycsICdvd25lci9yZXBvLW5hbWUnKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGx1Z2luLWluZm8tbW9kYWwnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXJlbGVhc2UnLCAnMi4wLjAnKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGx1Z2luLWluZm8tbW9kYWwnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLXBhY2thZ2UnLCAnbXktcGFja2FnZS5kaWZ5cGtnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoaWRlIHBsdWdpbiBpbmZvIG1vZGFsIHdoZW4gY2xvc2UgaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dJbmZvOiB0cnVlLFxuICAgICAgICBpc1Nob3dEZWxldGU6IGZhbHNlLFxuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldEFjdGlvbkJ1dHRvbnMoKVswXSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbi1pbmZvLW1vZGFsJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2xvc2UtcGx1Z2luLWluZm8nKSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ3BsdWdpbi1pbmZvLW1vZGFsJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBDaGVjayBmb3IgVXBkYXRlcyBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2hlY2sgZm9yIFVwZGF0ZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBmZXRjaCByZWxlYXNlcyB3aGVuIGNoZWNrIGZvciB1cGRhdGVzIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0ZldGNoUmVsZWFzZXMubW9ja1Jlc29sdmVkVmFsdWUoW3sgdmVyc2lvbjogJzEuMC4wJyB9XSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IHRydWUsXG4gICAgICAgIGlzU2hvd0RlbGV0ZTogZmFsc2UsXG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICBtZXRhOiB7XG4gICAgICAgICAgcmVwbzogJ293bmVyL3JlcG8nLFxuICAgICAgICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgICAgcGFja2FnZTogJ3BrZy5kaWZ5cGtnJyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhnZXRBY3Rpb25CdXR0b25zKClbMF0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hSZWxlYXNlcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ293bmVyJywgJ3JlcG8nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgYXV0aG9yIGFuZCBwbHVnaW5OYW1lIGFzIGZhbGxiYWNrIGZvciBlbXB0eSByZXBvIHBhcnRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgbW9ja0ZldGNoUmVsZWFzZXMubW9ja1Jlc29sdmVkVmFsdWUoW3sgdmVyc2lvbjogJzEuMC4wJyB9XSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IHRydWUsXG4gICAgICAgIGlzU2hvd0RlbGV0ZTogZmFsc2UsXG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICBhdXRob3I6ICdmYWxsYmFjay1hdXRob3InLFxuICAgICAgICBwbHVnaW5OYW1lOiAnZmFsbGJhY2stcGx1Z2luJyxcbiAgICAgICAgbWV0YToge1xuICAgICAgICAgIHJlcG86ICcvJywgLy8gUmVzdWx0cyBpbiBlbXB0eSBwYXJ0cyBhZnRlciBzcGxpdFxuICAgICAgICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgICAgcGFja2FnZTogJ3BrZy5kaWZ5cGtnJyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdFxuICAgICAgcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhnZXRBY3Rpb25CdXR0b25zKClbMF0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hSZWxlYXNlcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2ZhbGxiYWNrLWF1dGhvcicsICdmYWxsYmFjay1wbHVnaW4nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcHJvY2VlZCBpZiBubyByZWxlYXNlcyBhcmUgZmV0Y2hlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaFJlbGVhc2VzLm1vY2tSZXNvbHZlZFZhbHVlKFtdKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVBY3Rpb25Qcm9wcyh7XG4gICAgICAgIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogdHJ1ZSxcbiAgICAgICAgaXNTaG93RGVsZXRlOiBmYWxzZSxcbiAgICAgICAgaXNTaG93SW5mbzogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9uIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0QWN0aW9uQnV0dG9ucygpWzBdKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoUmVsZWFzZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICAgIGV4cGVjdChtb2NrQ2hlY2tGb3JVcGRhdGVzKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyB0b2FzdCBub3RpZmljYXRpb24gYWZ0ZXIgY2hlY2tpbmcgZm9yIHVwZGF0ZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrRmV0Y2hSZWxlYXNlcy5tb2NrUmVzb2x2ZWRWYWx1ZShbeyB2ZXJzaW9uOiAnMi4wLjAnIH1dKVxuICAgICAgbW9ja0NoZWNrRm9yVXBkYXRlcy5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgICBuZWVkVXBkYXRlOiBmYWxzZSxcbiAgICAgICAgdG9hc3RQcm9wczogeyB0eXBlOiAnc3VjY2VzcycsIG1lc3NhZ2U6ICdBbHJlYWR5IHVwIHRvIGRhdGUnIH0sXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVBY3Rpb25Qcm9wcyh7XG4gICAgICAgIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogdHJ1ZSxcbiAgICAgICAgaXNTaG93RGVsZXRlOiBmYWxzZSxcbiAgICAgICAgaXNTaG93SW5mbzogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9uIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0QWN0aW9uQnV0dG9ucygpWzBdKVxuXG4gICAgICAvLyBBc3NlcnQgLSBUb2FzdC5ub3RpZnkgaXMgY2FsbGVkIHdpdGggdGhlIHRvYXN0IHByb3BzXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHRvYXN0Tm90aWZ5U3B5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IHR5cGU6ICdzdWNjZXNzJywgbWVzc2FnZTogJ0FscmVhZHkgdXAgdG8gZGF0ZScgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyB1cGRhdGUgbW9kYWwgd2hlbiB1cGRhdGUgaXMgYXZhaWxhYmxlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcmVsZWFzZXMgPSBbeyB2ZXJzaW9uOiAnMi4wLjAnIH1dXG4gICAgICBtb2NrRmV0Y2hSZWxlYXNlcy5tb2NrUmVzb2x2ZWRWYWx1ZShyZWxlYXNlcylcbiAgICAgIG1vY2tDaGVja0ZvclVwZGF0ZXMubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgbmVlZFVwZGF0ZTogdHJ1ZSxcbiAgICAgICAgdG9hc3RQcm9wczogeyB0eXBlOiAnaW5mbycsIG1lc3NhZ2U6ICdVcGRhdGUgYXZhaWxhYmxlJyB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IHRydWUsXG4gICAgICAgIGlzU2hvd0RlbGV0ZTogZmFsc2UsXG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICBwbHVnaW5VbmlxdWVJZGVudGlmaWVyOiAndGVzdC1pZCcsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWwnIGFzIFBsdWdpbkNhdGVnb3J5RW51bSxcbiAgICAgICAgbWV0YToge1xuICAgICAgICAgIHJlcG86ICdvd25lci9yZXBvJyxcbiAgICAgICAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICAgIHBhY2thZ2U6ICdwa2cuZGlmeXBrZycsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9uIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0QWN0aW9uQnV0dG9ucygpWzBdKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1NldFNob3dVcGRhdGVQbHVnaW5Nb2RhbCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoXG4gICAgICAgICAgZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgcGF5bG9hZDogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICB0eXBlOiBQbHVnaW5Tb3VyY2UuZ2l0aHViLFxuICAgICAgICAgICAgICBjYXRlZ29yeTogJ21vZGVsJyxcbiAgICAgICAgICAgICAgZ2l0aHViOiBleHBlY3Qub2JqZWN0Q29udGFpbmluZyh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxQYWNrYWdlSW5mbzogZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoe1xuICAgICAgICAgICAgICAgICAgaWQ6ICd0ZXN0LWlkJyxcbiAgICAgICAgICAgICAgICAgIHJlcG86ICdvd25lci9yZXBvJyxcbiAgICAgICAgICAgICAgICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgICAgICAgICAgICBwYWNrYWdlOiAncGtnLmRpZnlwa2cnLFxuICAgICAgICAgICAgICAgICAgcmVsZWFzZXMsXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBpbnZhbGlkYXRlSW5zdGFsbGVkUGx1Z2luTGlzdCBvbiBzYXZlIGNhbGxiYWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcmVsZWFzZXMgPSBbeyB2ZXJzaW9uOiAnMi4wLjAnIH1dXG4gICAgICBtb2NrRmV0Y2hSZWxlYXNlcy5tb2NrUmVzb2x2ZWRWYWx1ZShyZWxlYXNlcylcbiAgICAgIG1vY2tDaGVja0ZvclVwZGF0ZXMubW9ja1JldHVyblZhbHVlKHtcbiAgICAgICAgbmVlZFVwZGF0ZTogdHJ1ZSxcbiAgICAgICAgdG9hc3RQcm9wczogeyB0eXBlOiAnaW5mbycsIG1lc3NhZ2U6ICdVcGRhdGUgYXZhaWxhYmxlJyB9LFxuICAgICAgfSlcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IHRydWUsXG4gICAgICAgIGlzU2hvd0RlbGV0ZTogZmFsc2UsXG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldEFjdGlvbkJ1dHRvbnMoKVswXSlcblxuICAgICAgLy8gV2FpdCBmb3IgbW9kYWwgdG8gYmUgY2FsbGVkXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tTZXRTaG93VXBkYXRlUGx1Z2luTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gSW52b2tlIHRoZSBjYWxsYmFja1xuICAgICAgY29uc3QgY2FsbCA9IG1vY2tTZXRTaG93VXBkYXRlUGx1Z2luTW9kYWwubW9jay5jYWxsc1swXVswXVxuICAgICAgY2FsbC5vblNhdmVDYWxsYmFjaygpXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KG1vY2tJbnZhbGlkYXRlSW5zdGFsbGVkUGx1Z2luTGlzdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2hlY2sgdXBkYXRlcyB3aXRoIGN1cnJlbnQgdmVyc2lvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHJlbGVhc2VzID0gW3sgdmVyc2lvbjogJzIuMC4wJyB9LCB7IHZlcnNpb246ICcxLjUuMCcgfV1cbiAgICAgIG1vY2tGZXRjaFJlbGVhc2VzLm1vY2tSZXNvbHZlZFZhbHVlKHJlbGVhc2VzKVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVBY3Rpb25Qcm9wcyh7XG4gICAgICAgIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogdHJ1ZSxcbiAgICAgICAgaXNTaG93RGVsZXRlOiBmYWxzZSxcbiAgICAgICAgaXNTaG93SW5mbzogZmFsc2UsXG4gICAgICAgIG1ldGE6IHtcbiAgICAgICAgICByZXBvOiAnb3duZXIvcmVwbycsXG4gICAgICAgICAgdmVyc2lvbjogJzEuMC4wJyxcbiAgICAgICAgICBwYWNrYWdlOiAncGtnLmRpZnlwa2cnLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldEFjdGlvbkJ1dHRvbnMoKVswXSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tDaGVja0ZvclVwZGF0ZXMpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHJlbGVhc2VzLCAnMS4wLjAnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IENhbGxiYWNrIFN0YWJpbGl0eSBUZXN0cyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5ICh1c2VDYWxsYmFjayknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIHN0YWJsZSBoYW5kbGVEZWxldGUgY2FsbGJhY2sgd2l0aCBzYW1lIGRlcGVuZGVuY2llcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVbmluc3RhbGxQbHVnaW4ubW9ja1Jlc29sdmVkVmFsdWUoeyBzdWNjZXNzOiB0cnVlIH0pXG4gICAgICBjb25zdCBvbkRlbGV0ZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dEZWxldGU6IHRydWUsXG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IGZhbHNlLFxuICAgICAgICBvbkRlbGV0ZSxcbiAgICAgICAgaW5zdGFsbGF0aW9uSWQ6ICdzdGFibGUtaW5zdGFsbC1pZCcsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3QgLSBGaXJzdCByZW5kZXIgYW5kIGRlbGV0ZVxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhnZXRBY3Rpb25CdXR0b25zKClbMF0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjb25maXJtLW9rJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1VuaW5zdGFsbFBsdWdpbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3N0YWJsZS1pbnN0YWxsLWlkJylcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlLXJlbmRlciB3aXRoIHNhbWUgcHJvcHNcbiAgICAgIG1vY2tVbmluc3RhbGxQbHVnaW4ubW9ja0NsZWFyKClcbiAgICAgIHJlcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhnZXRBY3Rpb25CdXR0b25zKClbMF0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjb25maXJtLW9rJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1VuaW5zdGFsbFBsdWdpbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3N0YWJsZS1pbnN0YWxsLWlkJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIGhhbmRsZURlbGV0ZSB3aGVuIGluc3RhbGxhdGlvbklkIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlXG4gICAgICBtb2NrVW5pbnN0YWxsUGx1Z2luLm1vY2tSZXNvbHZlZFZhbHVlKHsgc3VjY2VzczogdHJ1ZSB9KVxuICAgICAgY29uc3QgcHJvcHMxID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dEZWxldGU6IHRydWUsXG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IGZhbHNlLFxuICAgICAgICBpbnN0YWxsYXRpb25JZDogJ2luc3RhbGwtMScsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMyID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dEZWxldGU6IHRydWUsXG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IGZhbHNlLFxuICAgICAgICBpbnN0YWxsYXRpb25JZDogJ2luc3RhbGwtMicsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8QWN0aW9uIHsuLi5wcm9wczF9IC8+KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldEFjdGlvbkJ1dHRvbnMoKVswXSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tb2snKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVW5pbnN0YWxsUGx1Z2luKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnaW5zdGFsbC0xJylcbiAgICAgIH0pXG5cbiAgICAgIG1vY2tVbmluc3RhbGxQbHVnaW4ubW9ja0NsZWFyKClcbiAgICAgIHJlcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzMn0gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0QWN0aW9uQnV0dG9ucygpWzBdKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1vaycpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tVbmluc3RhbGxQbHVnaW4pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdpbnN0YWxsLTInKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgaGFuZGxlRGVsZXRlIHdoZW4gb25EZWxldGUgY2hhbmdlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tVbmluc3RhbGxQbHVnaW4ubW9ja1Jlc29sdmVkVmFsdWUoeyBzdWNjZXNzOiB0cnVlIH0pXG4gICAgICBjb25zdCBvbkRlbGV0ZTEgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkRlbGV0ZTIgPSB2aS5mbigpXG4gICAgICBjb25zdCBwcm9wczEgPSBjcmVhdGVBY3Rpb25Qcm9wcyh7XG4gICAgICAgIGlzU2hvd0RlbGV0ZTogdHJ1ZSxcbiAgICAgICAgaXNTaG93SW5mbzogZmFsc2UsXG4gICAgICAgIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogZmFsc2UsXG4gICAgICAgIG9uRGVsZXRlOiBvbkRlbGV0ZTEsXG4gICAgICB9KVxuICAgICAgY29uc3QgcHJvcHMyID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICBpc1Nob3dEZWxldGU6IHRydWUsXG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IGZhbHNlLFxuICAgICAgICBvbkRlbGV0ZTogb25EZWxldGUyLFxuICAgICAgfSlcblxuICAgICAgLy8gQWN0XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHMxfSAvPilcbiAgICAgIGZpcmVFdmVudC5jbGljayhnZXRBY3Rpb25CdXR0b25zKClbMF0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjb25maXJtLW9rJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25EZWxldGUxKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgICBleHBlY3Qob25EZWxldGUyKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIHJlcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzMn0gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0QWN0aW9uQnV0dG9ucygpWzBdKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1vaycpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uRGVsZXRlMikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT0gRWRnZSBDYXNlcyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1bmRlZmluZWQgbWV0YSBmb3IgaW5mbyBkaXNwbGF5JywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZSAtIG1ldGEgaXMgcmVxdWlyZWQgZm9yIGluZm8sIGJ1dCB0ZXN0IGRlZmVuc2l2ZSBiZWhhdmlvclxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVBY3Rpb25Qcm9wcyh7XG4gICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICBpc1Nob3dEZWxldGU6IHRydWUsXG4gICAgICAgIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogZmFsc2UsXG4gICAgICAgIG1ldGE6IHVuZGVmaW5lZCxcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFjdCAmIEFzc2VydCAtIFNob3VsZCBub3QgY3Jhc2hcbiAgICAgIGV4cGVjdCgoKSA9PiByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KSkubm90LnRvVGhyb3coKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSByZXBvIHN0cmluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIG1vY2tGZXRjaFJlbGVhc2VzLm1vY2tSZXNvbHZlZFZhbHVlKFt7IHZlcnNpb246ICcxLjAuMCcgfV0pXG4gICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUFjdGlvblByb3BzKHtcbiAgICAgICAgaXNTaG93RmV0Y2hOZXdWZXJzaW9uOiB0cnVlLFxuICAgICAgICBpc1Nob3dEZWxldGU6IGZhbHNlLFxuICAgICAgICBpc1Nob3dJbmZvOiBmYWxzZSxcbiAgICAgICAgYXV0aG9yOiAnZmFsbGJhY2stb3duZXInLFxuICAgICAgICBwbHVnaW5OYW1lOiAnZmFsbGJhY2stcmVwbycsXG4gICAgICAgIG1ldGE6IHtcbiAgICAgICAgICByZXBvOiAnJyxcbiAgICAgICAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICAgIHBhY2thZ2U6ICdwa2cuZGlmeXBrZycsXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9uIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0QWN0aW9uQnV0dG9ucygpWzBdKVxuXG4gICAgICAvLyBBc3NlcnQgLSBTaG91bGQgdXNlIGF1dGhvciBhbmQgcGx1Z2luTmFtZSBhcyBmYWxsYmFja1xuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hSZWxlYXNlcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2ZhbGxiYWNrLW93bmVyJywgJ2ZhbGxiYWNrLXJlcG8nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29uY3VycmVudCBkZWxldGUgcmVxdWVzdHMgZ3JhY2VmdWxseScsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGxldCByZXNvbHZlRmlyc3Q6ICh2YWx1ZTogeyBzdWNjZXNzOiBib29sZWFuIH0pID0+IHZvaWRcbiAgICAgIGNvbnN0IGZpcnN0UHJvbWlzZSA9IG5ldyBQcm9taXNlPHsgc3VjY2VzczogYm9vbGVhbiB9PigocmVzb2x2ZSkgPT4ge1xuICAgICAgICByZXNvbHZlRmlyc3QgPSByZXNvbHZlXG4gICAgICB9KVxuICAgICAgbW9ja1VuaW5zdGFsbFBsdWdpbi5tb2NrUmV0dXJuVmFsdWVPbmNlKGZpcnN0UHJvbWlzZSlcblxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVBY3Rpb25Qcm9wcyh7XG4gICAgICAgIGlzU2hvd0RlbGV0ZTogdHJ1ZSxcbiAgICAgICAgaXNTaG93SW5mbzogZmFsc2UsXG4gICAgICAgIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogZmFsc2UsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9uIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0QWN0aW9uQnV0dG9ucygpWzBdKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1vaycpKVxuXG4gICAgICAvLyBUaGUgY29uZmlybSBidXR0b24gc2hvdWxkIGJlIGRpc2FibGVkIGR1cmluZyBkZWxldGlvblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY29uZmlybS1tb2RhbCcpKS50b0hhdmVBdHRyaWJ1dGUoJ2RhdGEtbG9hZGluZycsICd0cnVlJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NvbmZpcm0tbW9kYWwnKSkudG9IYXZlQXR0cmlidXRlKCdkYXRhLWRpc2FibGVkJywgJ3RydWUnKVxuXG4gICAgICAvLyBSZXNvbHZlIHRoZSBkZWxldGlvblxuICAgICAgcmVzb2x2ZUZpcnN0ISh7IHN1Y2Nlc3M6IHRydWUgfSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnY29uZmlybS1tb2RhbCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3BlY2lhbCBjaGFyYWN0ZXJzIGluIHBsdWdpbiBuYW1lJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgcHJvcHMgPSBjcmVhdGVBY3Rpb25Qcm9wcyh7XG4gICAgICAgIGlzU2hvd0RlbGV0ZTogdHJ1ZSxcbiAgICAgICAgaXNTaG93SW5mbzogZmFsc2UsXG4gICAgICAgIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogZmFsc2UsXG4gICAgICAgIHBsdWdpbk5hbWU6ICdwbHVnaW4td2l0aC1zcGVjaWFsQGNoYXJzIzEyMycsXG4gICAgICB9KVxuXG4gICAgICAvLyBBY3RcbiAgICAgIHJlbmRlcig8QWN0aW9uIHsuLi5wcm9wc30gLz4pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZ2V0QWN0aW9uQnV0dG9ucygpWzBdKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4td2l0aC1zcGVjaWFsQGNoYXJzIzEyMycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PSBSZWFjdC5tZW1vIFRlc3RzID09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZWFjdC5tZW1vIEJlaGF2aW9yJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChBY3Rpb24pLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdCgoQWN0aW9uIGFzIGFueSkuJCR0eXBlb2Y/LnRvU3RyaW5nKCkpLnRvQ29udGFpbignU3ltYm9sJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09IFByb3AgVmFyaWF0aW9ucyA9PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGFsbCBjYXRlZ29yeSB0eXBlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBbJ3Rvb2wnLCAnbW9kZWwnLCAnZXh0ZW5zaW9uJywgJ2FnZW50LXN0cmF0ZWd5JywgJ2RhdGFzb3VyY2UnXSBhcyBQbHVnaW5DYXRlZ29yeUVudW1bXVxuXG4gICAgICBjYXRlZ29yaWVzLmZvckVhY2goKGNhdGVnb3J5KSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICAgIGNhdGVnb3J5LFxuICAgICAgICAgIGlzU2hvd0RlbGV0ZTogdHJ1ZSxcbiAgICAgICAgICBpc1Nob3dJbmZvOiBmYWxzZSxcbiAgICAgICAgICBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgICBleHBlY3QoKCkgPT4gcmVuZGVyKDxBY3Rpb24gey4uLnByb3BzfSAvPikpLm5vdC50b1Rocm93KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGRpZmZlcmVudCB1c2VkSW5BcHBzIHZhbHVlcycsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHZhbHVlcyA9IFswLCAxLCA1LCAxMDBdXG5cbiAgICAgIHZhbHVlcy5mb3JFYWNoKCh1c2VkSW5BcHBzKSA9PiB7XG4gICAgICAgIGNvbnN0IHByb3BzID0gY3JlYXRlQWN0aW9uUHJvcHMoe1xuICAgICAgICAgIHVzZWRJbkFwcHMsXG4gICAgICAgICAgaXNTaG93RGVsZXRlOiB0cnVlLFxuICAgICAgICAgIGlzU2hvd0luZm86IGZhbHNlLFxuICAgICAgICAgIGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICAgIGV4cGVjdCgoKSA9PiByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KSkubm90LnRvVGhyb3coKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgY29tYmluYXRpb24gb2YgbXVsdGlwbGUgYWN0aW9uIGJ1dHRvbnMnLCAoKSA9PiB7XG4gICAgICAvLyBBcnJhbmdlIC0gVGVzdCB2YXJpb3VzIGNvbWJpbmF0aW9uc1xuICAgICAgY29uc3QgY29tYmluYXRpb25zID0gW1xuICAgICAgICB7IGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogdHJ1ZSwgaXNTaG93SW5mbzogZmFsc2UsIGlzU2hvd0RlbGV0ZTogZmFsc2UgfSxcbiAgICAgICAgeyBpc1Nob3dGZXRjaE5ld1ZlcnNpb246IGZhbHNlLCBpc1Nob3dJbmZvOiB0cnVlLCBpc1Nob3dEZWxldGU6IGZhbHNlIH0sXG4gICAgICAgIHsgaXNTaG93RmV0Y2hOZXdWZXJzaW9uOiBmYWxzZSwgaXNTaG93SW5mbzogZmFsc2UsIGlzU2hvd0RlbGV0ZTogdHJ1ZSB9LFxuICAgICAgICB7IGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogdHJ1ZSwgaXNTaG93SW5mbzogdHJ1ZSwgaXNTaG93RGVsZXRlOiBmYWxzZSB9LFxuICAgICAgICB7IGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogdHJ1ZSwgaXNTaG93SW5mbzogZmFsc2UsIGlzU2hvd0RlbGV0ZTogdHJ1ZSB9LFxuICAgICAgICB7IGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogZmFsc2UsIGlzU2hvd0luZm86IHRydWUsIGlzU2hvd0RlbGV0ZTogdHJ1ZSB9LFxuICAgICAgICB7IGlzU2hvd0ZldGNoTmV3VmVyc2lvbjogdHJ1ZSwgaXNTaG93SW5mbzogdHJ1ZSwgaXNTaG93RGVsZXRlOiB0cnVlIH0sXG4gICAgICBdXG5cbiAgICAgIGNvbWJpbmF0aW9ucy5mb3JFYWNoKChmbGFncykgPT4ge1xuICAgICAgICBjb25zdCBwcm9wcyA9IGNyZWF0ZUFjdGlvblByb3BzKGZsYWdzKVxuICAgICAgICBjb25zdCBleHBlY3RlZENvdW50ID0gW2ZsYWdzLmlzU2hvd0ZldGNoTmV3VmVyc2lvbiwgZmxhZ3MuaXNTaG93SW5mbywgZmxhZ3MuaXNTaG93RGVsZXRlXS5maWx0ZXIoQm9vbGVhbikubGVuZ3RoXG5cbiAgICAgICAgY29uc3QgeyB1bm1vdW50IH0gPSByZW5kZXIoPEFjdGlvbiB7Li4ucHJvcHN9IC8+KVxuICAgICAgICBjb25zdCBidXR0b25zID0gcXVlcnlBY3Rpb25CdXR0b25zKClcbiAgICAgICAgZXhwZWN0KGJ1dHRvbnMpLnRvSGF2ZUxlbmd0aChleHBlY3RlZENvdW50KVxuICAgICAgICB1bm1vdW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=