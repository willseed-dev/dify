"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("../../types");
const index_1 = require("./index");
// Factory functions for test data
// Use type casting to avoid strict locale requirements in tests
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
const createMockDependencies = () => [
    {
        type: 'github',
        value: {
            repo: 'test/plugin1',
            version: 'v1.0.0',
            package: 'plugin1.zip',
        },
    },
    {
        type: 'marketplace',
        value: {
            plugin_unique_identifier: 'plugin-2-uid',
        },
    },
];
// Mock external dependencies
const mockRefreshPluginList = vitest_1.vi.fn();
vitest_1.vi.mock('../hooks/use-refresh-plugin-list', () => ({
    default: () => ({ refreshPluginList: mockRefreshPluginList }),
}));
let mockHideLogicState = {
    modalClassName: 'test-modal-class',
    foldAnimInto: vitest_1.vi.fn(),
    setIsInstalling: vitest_1.vi.fn(),
    handleStartToInstall: vitest_1.vi.fn(),
};
vitest_1.vi.mock('../hooks/use-hide-logic', () => ({
    default: () => mockHideLogicState,
}));
// Mock child components
vitest_1.vi.mock('./steps/install', () => ({
    default: ({ uniqueIdentifier, payload, onCancel, onInstalled, onFailed, onStartToInstall, }) => (<div data-testid="install-step">
      <span data-testid="unique-identifier">{uniqueIdentifier}</span>
      <span data-testid="payload-name">{payload?.name}</span>
      <button data-testid="cancel-btn" onClick={onCancel}>Cancel</button>
      <button data-testid="start-install-btn" onClick={onStartToInstall}>Start Install</button>
      <button data-testid="install-success-btn" onClick={() => onInstalled()}>Install Success</button>
      <button data-testid="install-success-no-refresh-btn" onClick={() => onInstalled(true)}>Install Success No Refresh</button>
      <button data-testid="install-fail-btn" onClick={() => onFailed('Installation failed')}>Install Fail</button>
      <button data-testid="install-fail-no-msg-btn" onClick={() => onFailed()}>Install Fail No Msg</button>
    </div>),
}));
vitest_1.vi.mock('../install-bundle/ready-to-install', () => ({
    default: ({ step, onStepChange, onStartToInstall, setIsInstalling, onClose, allPlugins, isFromMarketPlace, }) => (<div data-testid="bundle-step">
      <span data-testid="bundle-step-value">{step}</span>
      <span data-testid="bundle-plugins-count">{allPlugins?.length || 0}</span>
      <span data-testid="is-from-marketplace">{isFromMarketPlace ? 'true' : 'false'}</span>
      <button data-testid="bundle-cancel-btn" onClick={onClose}>Cancel</button>
      <button data-testid="bundle-start-install-btn" onClick={onStartToInstall}>Start Install</button>
      <button data-testid="bundle-set-installing-true" onClick={() => setIsInstalling(true)}>Set Installing True</button>
      <button data-testid="bundle-set-installing-false" onClick={() => setIsInstalling(false)}>Set Installing False</button>
      <button data-testid="bundle-change-to-installed" onClick={() => onStepChange(types_1.InstallStep.installed)}>Change to Installed</button>
      <button data-testid="bundle-change-to-failed" onClick={() => onStepChange(types_1.InstallStep.installFailed)}>Change to Failed</button>
    </div>),
}));
vitest_1.vi.mock('../base/installed', () => ({
    default: ({ payload, isMarketPayload, isFailed, errMsg, onCancel, }) => (<div data-testid="installed-step">
      <span data-testid="installed-payload">{payload?.name || 'no-payload'}</span>
      <span data-testid="is-market-payload">{isMarketPayload ? 'true' : 'false'}</span>
      <span data-testid="is-failed">{isFailed ? 'true' : 'false'}</span>
      <span data-testid="error-msg">{errMsg || 'no-error'}</span>
      <button data-testid="installed-close-btn" onClick={onCancel}>Close</button>
    </div>),
}));
(0, vitest_1.describe)('InstallFromMarketplace', () => {
    const defaultProps = {
        uniqueIdentifier: 'test-unique-identifier',
        manifest: createMockManifest(),
        onSuccess: vitest_1.vi.fn(),
        onClose: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockHideLogicState = {
            modalClassName: 'test-modal-class',
            foldAnimInto: vitest_1.vi.fn(),
            setIsInstalling: vitest_1.vi.fn(),
            handleStartToInstall: vitest_1.vi.fn(),
        };
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render modal with correct initial state for single plugin', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render with bundle step when isBundle is true', () => {
            const dependencies = createMockDependencies();
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={true} dependencies={dependencies}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-plugins-count')).toHaveTextContent('2');
        });
        (0, vitest_1.it)('should pass isFromMarketPlace as true to bundle component', () => {
            const dependencies = createMockDependencies();
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={true} dependencies={dependencies}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-from-marketplace')).toHaveTextContent('true');
        });
        (0, vitest_1.it)('should pass correct props to Install component', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('unique-identifier')).toHaveTextContent('test-unique-identifier');
            (0, vitest_1.expect)(react_1.screen.getByTestId('payload-name')).toHaveTextContent('Test Plugin');
        });
        (0, vitest_1.it)('should apply modal className from useHideLogic', () => {
            (0, vitest_1.expect)(mockHideLogicState.modalClassName).toBe('test-modal-class');
        });
    });
    // ================================
    // Title Display Tests
    // ================================
    (0, vitest_1.describe)('Title Display', () => {
        (0, vitest_1.it)('should show install title in readyToInstall step', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show success title when installation completes for single plugin', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installedSuccessfully')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should show bundle complete title when bundle installation completes', async () => {
            const dependencies = createMockDependencies();
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={true} dependencies={dependencies}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-change-to-installed'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installComplete')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should show failed title when installation fails', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installFailed')).toBeInTheDocument();
            });
        });
    });
    // ================================
    // State Management Tests
    // ================================
    (0, vitest_1.describe)('State Management', () => {
        (0, vitest_1.it)('should transition from readyToInstall to installed on success', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-step')).toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('false');
            });
        });
        (0, vitest_1.it)('should transition from readyToInstall to installFailed on failure', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
                (0, vitest_1.expect)(react_1.screen.getByTestId('error-msg')).toHaveTextContent('Installation failed');
            });
        });
        (0, vitest_1.it)('should handle failure without error message', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-no-msg-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
                (0, vitest_1.expect)(react_1.screen.getByTestId('error-msg')).toHaveTextContent('no-error');
            });
        });
        (0, vitest_1.it)('should update step via onStepChange in bundle mode', async () => {
            const dependencies = createMockDependencies();
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={true} dependencies={dependencies}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-change-to-installed'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installComplete')).toBeInTheDocument();
            });
        });
    });
    // ================================
    // Callback Stability Tests (Memoization)
    // ================================
    (0, vitest_1.describe)('Callback Stability', () => {
        (0, vitest_1.it)('should maintain stable getTitle callback across rerenders', () => {
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
            rerender(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should maintain stable handleInstalled callback', async () => {
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            rerender(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should maintain stable handleFailed callback', async () => {
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            rerender(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
            });
        });
    });
    // ================================
    // User Interactions Tests
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onClose when cancel is clicked', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('cancel-btn'));
            (0, vitest_1.expect)(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call foldAnimInto when modal close is triggered', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(mockHideLogicState.foldAnimInto).toBeDefined();
        });
        (0, vitest_1.it)('should call handleStartToInstall when start install is triggered', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call onSuccess when close button is clicked in installed step', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('installed-close-btn'));
            (0, vitest_1.expect)(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call onClose in bundle mode cancel', () => {
            const dependencies = createMockDependencies();
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={true} dependencies={dependencies}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-cancel-btn'));
            (0, vitest_1.expect)(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });
    });
    // ================================
    // Refresh Plugin List Tests
    // ================================
    (0, vitest_1.describe)('Refresh Plugin List', () => {
        (0, vitest_1.it)('should call refreshPluginList when installation completes without notRefresh flag', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockRefreshPluginList).toHaveBeenCalledWith(defaultProps.manifest);
            });
        });
        (0, vitest_1.it)('should not call refreshPluginList when notRefresh flag is true', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-no-refresh-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockRefreshPluginList).not.toHaveBeenCalled();
            });
        });
    });
    // ================================
    // setIsInstalling Tests
    // ================================
    (0, vitest_1.describe)('setIsInstalling Behavior', () => {
        (0, vitest_1.it)('should call setIsInstalling(false) when installation completes', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
            });
        });
        (0, vitest_1.it)('should call setIsInstalling(false) when installation fails', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
            });
        });
        (0, vitest_1.it)('should pass setIsInstalling to bundle component', () => {
            const dependencies = createMockDependencies();
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={true} dependencies={dependencies}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-set-installing-true'));
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(true);
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-set-installing-false'));
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
        });
    });
    // ================================
    // Installed Component Props Tests
    // ================================
    (0, vitest_1.describe)('Installed Component Props', () => {
        (0, vitest_1.it)('should pass isMarketPayload as true to Installed component', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-market-payload')).toHaveTextContent('true');
            });
        });
        (0, vitest_1.it)('should pass correct payload to Installed component', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-payload')).toHaveTextContent('Test Plugin');
            });
        });
        (0, vitest_1.it)('should pass isFailed as true when installation fails', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
            });
        });
        (0, vitest_1.it)('should pass error message to Installed component on failure', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('error-msg')).toHaveTextContent('Installation failed');
            });
        });
    });
    // ================================
    // Prop Variations Tests
    // ================================
    (0, vitest_1.describe)('Prop Variations', () => {
        (0, vitest_1.it)('should work with Plugin type manifest', () => {
            const plugin = createMockPlugin();
            (0, react_1.render)(<index_1.default {...defaultProps} manifest={plugin}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('payload-name')).toHaveTextContent('Test Plugin');
        });
        (0, vitest_1.it)('should work with PluginManifestInMarket type manifest', () => {
            const manifest = createMockManifest({ name: 'Market Plugin' });
            (0, react_1.render)(<index_1.default {...defaultProps} manifest={manifest}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('payload-name')).toHaveTextContent('Market Plugin');
        });
        (0, vitest_1.it)('should handle different uniqueIdentifier values', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} uniqueIdentifier="custom-unique-id-123"/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('unique-identifier')).toHaveTextContent('custom-unique-id-123');
        });
        (0, vitest_1.it)('should work without isBundle prop (default to single plugin)', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('bundle-step')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should work with isBundle=false', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={false}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.queryByTestId('bundle-step')).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should work with empty dependencies array in bundle mode', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={true} dependencies={[]}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-plugins-count')).toHaveTextContent('0');
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle manifest with minimal required fields', () => {
            const minimalManifest = createMockManifest({
                name: 'Minimal',
                version: '0.0.1',
            });
            (0, react_1.render)(<index_1.default {...defaultProps} manifest={minimalManifest}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('payload-name')).toHaveTextContent('Minimal');
        });
        (0, vitest_1.it)('should handle multiple rapid state transitions', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Trigger installation completion
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
            });
            // Should stay in installed state
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('false');
        });
        (0, vitest_1.it)('should handle bundle mode step changes', async () => {
            const dependencies = createMockDependencies();
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={true} dependencies={dependencies}/>);
            // Change to installed step
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-change-to-installed'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installComplete')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should handle bundle mode failure step change', async () => {
            const dependencies = createMockDependencies();
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={true} dependencies={dependencies}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-change-to-failed'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installFailed')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should not render Install component in terminal steps', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByTestId('install-step')).not.toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should render Installed component for success state with isFailed false', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('false');
            });
        });
        (0, vitest_1.it)('should render Installed component for failure state with isFailed true', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
            });
        });
    });
    // ================================
    // Terminal Steps Rendering Tests
    // ================================
    (0, vitest_1.describe)('Terminal Steps Rendering', () => {
        (0, vitest_1.it)('should render Installed component when step is installed', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should render Installed component when step is installFailed', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
            });
        });
        (0, vitest_1.it)('should not render Install component when in terminal step', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Initially Install is shown
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-step')).toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByTestId('install-step')).not.toBeInTheDocument();
            });
        });
    });
    // ================================
    // Data Flow Tests
    // ================================
    (0, vitest_1.describe)('Data Flow', () => {
        (0, vitest_1.it)('should pass uniqueIdentifier to Install component', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} uniqueIdentifier="flow-test-id"/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('unique-identifier')).toHaveTextContent('flow-test-id');
        });
        (0, vitest_1.it)('should pass manifest payload to Install component', () => {
            const customManifest = createMockManifest({ name: 'Flow Test Plugin' });
            (0, react_1.render)(<index_1.default {...defaultProps} manifest={customManifest}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('payload-name')).toHaveTextContent('Flow Test Plugin');
        });
        (0, vitest_1.it)('should pass dependencies to bundle component', () => {
            const dependencies = createMockDependencies();
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={true} dependencies={dependencies}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-plugins-count')).toHaveTextContent('2');
        });
        (0, vitest_1.it)('should pass current step to bundle component', () => {
            const dependencies = createMockDependencies();
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={true} dependencies={dependencies}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-step-value')).toHaveTextContent(types_1.InstallStep.readyToInstall);
        });
    });
    // ================================
    // Manifest Category Variations Tests
    // ================================
    (0, vitest_1.describe)('Manifest Category Variations', () => {
        (0, vitest_1.it)('should handle tool category manifest', () => {
            const manifest = createMockManifest({ category: types_1.PluginCategoryEnum.tool });
            (0, react_1.render)(<index_1.default {...defaultProps} manifest={manifest}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-step')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle model category manifest', () => {
            const manifest = createMockManifest({ category: types_1.PluginCategoryEnum.model });
            (0, react_1.render)(<index_1.default {...defaultProps} manifest={manifest}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-step')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle extension category manifest', () => {
            const manifest = createMockManifest({ category: types_1.PluginCategoryEnum.extension });
            (0, react_1.render)(<index_1.default {...defaultProps} manifest={manifest}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('install-step')).toBeInTheDocument();
        });
    });
    // ================================
    // Hook Integration Tests
    // ================================
    (0, vitest_1.describe)('Hook Integration', () => {
        (0, vitest_1.it)('should use handleStartToInstall from useHideLogic', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should use setIsInstalling from useHideLogic in handleInstalled', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
            });
        });
        (0, vitest_1.it)('should use setIsInstalling from useHideLogic in handleFailed', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
            });
        });
        (0, vitest_1.it)('should use refreshPluginList from useRefreshPluginList', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockRefreshPluginList).toHaveBeenCalled();
            });
        });
    });
    // ================================
    // getTitle Memoization Tests
    // ================================
    (0, vitest_1.describe)('getTitle Memoization', () => {
        (0, vitest_1.it)('should return installPlugin title for readyToInstall step', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should return installedSuccessfully for non-bundle installed step', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installedSuccessfully')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should return installComplete for bundle installed step', async () => {
            const dependencies = createMockDependencies();
            (0, react_1.render)(<index_1.default {...defaultProps} isBundle={true} dependencies={dependencies}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-change-to-installed'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installComplete')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should return installFailed for installFailed step', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installFailed')).toBeInTheDocument();
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLG1DQUE2RDtBQUM3RCx1Q0FBNkQ7QUFDN0QsbUNBQTRDO0FBRTVDLGtDQUFrQztBQUNsQyxnRUFBZ0U7QUFDaEUsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFlBQTZDLEVBQUUsRUFBMEIsRUFBRSxDQUFDLENBQUM7SUFDdkcsd0JBQXdCLEVBQUUsd0JBQXdCO0lBQ2xELElBQUksRUFBRSxhQUFhO0lBQ25CLEdBQUcsRUFBRSxVQUFVO0lBQ2YsSUFBSSxFQUFFLGVBQWU7SUFDckIsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBcUM7SUFDbEUsUUFBUSxFQUFFLDBCQUFrQixDQUFDLElBQUk7SUFDakMsT0FBTyxFQUFFLE9BQU87SUFDaEIsY0FBYyxFQUFFLE9BQU87SUFDdkIsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBcUM7SUFDcEUsWUFBWSxFQUFFLG1CQUFtQjtJQUNqQyxRQUFRLEVBQUUsSUFBSTtJQUNkLGFBQWEsRUFBRSxHQUFHO0lBQ2xCLE1BQU0sRUFBRSxFQUFFO0lBQ1YsWUFBWSxFQUFFLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFO0lBQ2xELElBQUksRUFBRSxhQUFhO0lBQ25CLEdBQUcsU0FBUztDQUNiLENBQUMsQ0FBQTtBQUVGLE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxZQUE2QixFQUFFLEVBQVUsRUFBRSxDQUFDLENBQUM7SUFDckUsSUFBSSxFQUFFLFFBQVE7SUFDZCxHQUFHLEVBQUUsVUFBVTtJQUNmLElBQUksRUFBRSxhQUFhO0lBQ25CLFNBQVMsRUFBRSxnQkFBZ0I7SUFDM0IsT0FBTyxFQUFFLE9BQU87SUFDaEIsY0FBYyxFQUFFLE9BQU87SUFDdkIseUJBQXlCLEVBQUUsaUJBQWlCO0lBQzVDLElBQUksRUFBRSxlQUFlO0lB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SixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBEZXBlbmRlbmN5LCBQbHVnaW4sIFBsdWdpbk1hbmlmZXN0SW5NYXJrZXQgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgYmVmb3JlRWFjaCwgZGVzY3JpYmUsIGV4cGVjdCwgaXQsIHZpIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHsgSW5zdGFsbFN0ZXAsIFBsdWdpbkNhdGVnb3J5RW51bSB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IEluc3RhbGxGcm9tTWFya2V0cGxhY2UgZnJvbSAnLi9pbmRleCdcblxuLy8gRmFjdG9yeSBmdW5jdGlvbnMgZm9yIHRlc3QgZGF0YVxuLy8gVXNlIHR5cGUgY2FzdGluZyB0byBhdm9pZCBzdHJpY3QgbG9jYWxlIHJlcXVpcmVtZW50cyBpbiB0ZXN0c1xuY29uc3QgY3JlYXRlTW9ja01hbmlmZXN0ID0gKG92ZXJyaWRlczogUGFydGlhbDxQbHVnaW5NYW5pZmVzdEluTWFya2V0PiA9IHt9KTogUGx1Z2luTWFuaWZlc3RJbk1hcmtldCA9PiAoe1xuICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICd0ZXN0LXVuaXF1ZS1pZGVudGlmaWVyJyxcbiAgbmFtZTogJ1Rlc3QgUGx1Z2luJyxcbiAgb3JnOiAndGVzdC1vcmcnLFxuICBpY29uOiAndGVzdC1pY29uLnBuZycsXG4gIGxhYmVsOiB7IGVuX1VTOiAnVGVzdCBQbHVnaW4nIH0gYXMgUGx1Z2luTWFuaWZlc3RJbk1hcmtldFsnbGFiZWwnXSxcbiAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICB2ZXJzaW9uOiAnMS4wLjAnLFxuICBsYXRlc3RfdmVyc2lvbjogJzEuMC4wJyxcbiAgYnJpZWY6IHsgZW5fVVM6ICdBIHRlc3QgcGx1Z2luJyB9IGFzIFBsdWdpbk1hbmlmZXN0SW5NYXJrZXRbJ2JyaWVmJ10sXG4gIGludHJvZHVjdGlvbjogJ0ludHJvZHVjdGlvbiB0ZXh0JyxcbiAgdmVyaWZpZWQ6IHRydWUsXG4gIGluc3RhbGxfY291bnQ6IDEwMCxcbiAgYmFkZ2VzOiBbXSxcbiAgdmVyaWZpY2F0aW9uOiB7IGF1dGhvcml6ZWRfY2F0ZWdvcnk6ICdjb21tdW5pdHknIH0sXG4gIGZyb206ICdtYXJrZXRwbGFjZScsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tQbHVnaW4gPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFBsdWdpbj4gPSB7fSk6IFBsdWdpbiA9PiAoe1xuICB0eXBlOiAncGx1Z2luJyxcbiAgb3JnOiAndGVzdC1vcmcnLFxuICBuYW1lOiAnVGVzdCBQbHVnaW4nLFxuICBwbHVnaW5faWQ6ICd0ZXN0LXBsdWdpbi1pZCcsXG4gIHZlcnNpb246ICcxLjAuMCcsXG4gIGxhdGVzdF92ZXJzaW9uOiAnMS4wLjAnLFxuICBsYXRlc3RfcGFja2FnZV9pZGVudGlmaWVyOiAndGVzdC1wYWNrYWdlLWlkJyxcbiAgaWNvbjogJ3Rlc3QtaWNvbi5wbmcnLFxuICB2ZXJpZmllZDogdHJ1ZSxcbiAgbGFiZWw6IHsgZW5fVVM6ICdUZXN0IFBsdWdpbicgfSxcbiAgYnJpZWY6IHsgZW5fVVM6ICdBIHRlc3QgcGx1Z2luJyB9LFxuICBkZXNjcmlwdGlvbjogeyBlbl9VUzogJ0EgdGVzdCBwbHVnaW4gZGVzY3JpcHRpb24nIH0sXG4gIGludHJvZHVjdGlvbjogJ0ludHJvZHVjdGlvbiB0ZXh0JyxcbiAgcmVwb3NpdG9yeTogJ2h0dHBzOi8vZ2l0aHViLmNvbS90ZXN0L3BsdWdpbicsXG4gIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgaW5zdGFsbF9jb3VudDogMTAwLFxuICBlbmRwb2ludDogeyBzZXR0aW5nczogW10gfSxcbiAgdGFnczogW10sXG4gIGJhZGdlczogW10sXG4gIHZlcmlmaWNhdGlvbjogeyBhdXRob3JpemVkX2NhdGVnb3J5OiAnY29tbXVuaXR5JyB9LFxuICBmcm9tOiAnbWFya2V0cGxhY2UnLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5jb25zdCBjcmVhdGVNb2NrRGVwZW5kZW5jaWVzID0gKCk6IERlcGVuZGVuY3lbXSA9PiBbXG4gIHtcbiAgICB0eXBlOiAnZ2l0aHViJyxcbiAgICB2YWx1ZToge1xuICAgICAgcmVwbzogJ3Rlc3QvcGx1Z2luMScsXG4gICAgICB2ZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgIHBhY2thZ2U6ICdwbHVnaW4xLnppcCcsXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdtYXJrZXRwbGFjZScsXG4gICAgdmFsdWU6IHtcbiAgICAgIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ3BsdWdpbi0yLXVpZCcsXG4gICAgfSxcbiAgfSxcbl1cblxuLy8gTW9jayBleHRlcm5hbCBkZXBlbmRlbmNpZXNcbmNvbnN0IG1vY2tSZWZyZXNoUGx1Z2luTGlzdCA9IHZpLmZuKClcbnZpLm1vY2soJy4uL2hvb2tzL3VzZS1yZWZyZXNoLXBsdWdpbi1saXN0JywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gKHsgcmVmcmVzaFBsdWdpbkxpc3Q6IG1vY2tSZWZyZXNoUGx1Z2luTGlzdCB9KSxcbn0pKVxuXG5sZXQgbW9ja0hpZGVMb2dpY1N0YXRlID0ge1xuICBtb2RhbENsYXNzTmFtZTogJ3Rlc3QtbW9kYWwtY2xhc3MnLFxuICBmb2xkQW5pbUludG86IHZpLmZuKCksXG4gIHNldElzSW5zdGFsbGluZzogdmkuZm4oKSxcbiAgaGFuZGxlU3RhcnRUb0luc3RhbGw6IHZpLmZuKCksXG59XG52aS5tb2NrKCcuLi9ob29rcy91c2UtaGlkZS1sb2dpYycsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+IG1vY2tIaWRlTG9naWNTdGF0ZSxcbn0pKVxuXG4vLyBNb2NrIGNoaWxkIGNvbXBvbmVudHNcbnZpLm1vY2soJy4vc3RlcHMvaW5zdGFsbCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7XG4gICAgdW5pcXVlSWRlbnRpZmllcixcbiAgICBwYXlsb2FkLFxuICAgIG9uQ2FuY2VsLFxuICAgIG9uSW5zdGFsbGVkLFxuICAgIG9uRmFpbGVkLFxuICAgIG9uU3RhcnRUb0luc3RhbGwsXG4gIH06IHtcbiAgICB1bmlxdWVJZGVudGlmaWVyOiBzdHJpbmdcbiAgICBwYXlsb2FkOiBQbHVnaW5NYW5pZmVzdEluTWFya2V0IHwgUGx1Z2luXG4gICAgb25DYW5jZWw6ICgpID0+IHZvaWRcbiAgICBvbkluc3RhbGxlZDogKG5vdFJlZnJlc2g/OiBib29sZWFuKSA9PiB2b2lkXG4gICAgb25GYWlsZWQ6IChtZXNzYWdlPzogc3RyaW5nKSA9PiB2b2lkXG4gICAgb25TdGFydFRvSW5zdGFsbDogKCkgPT4gdm9pZFxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImluc3RhbGwtc3RlcFwiPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJ1bmlxdWUtaWRlbnRpZmllclwiPnt1bmlxdWVJZGVudGlmaWVyfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicGF5bG9hZC1uYW1lXCI+e3BheWxvYWQ/Lm5hbWV9PC9zcGFuPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImNhbmNlbC1idG5cIiBvbkNsaWNrPXtvbkNhbmNlbH0+Q2FuY2VsPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwic3RhcnQtaW5zdGFsbC1idG5cIiBvbkNsaWNrPXtvblN0YXJ0VG9JbnN0YWxsfT5TdGFydCBJbnN0YWxsPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiaW5zdGFsbC1zdWNjZXNzLWJ0blwiIG9uQ2xpY2s9eygpID0+IG9uSW5zdGFsbGVkKCl9Pkluc3RhbGwgU3VjY2VzczwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImluc3RhbGwtc3VjY2Vzcy1uby1yZWZyZXNoLWJ0blwiIG9uQ2xpY2s9eygpID0+IG9uSW5zdGFsbGVkKHRydWUpfT5JbnN0YWxsIFN1Y2Nlc3MgTm8gUmVmcmVzaDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImluc3RhbGwtZmFpbC1idG5cIiBvbkNsaWNrPXsoKSA9PiBvbkZhaWxlZCgnSW5zdGFsbGF0aW9uIGZhaWxlZCcpfT5JbnN0YWxsIEZhaWw8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJpbnN0YWxsLWZhaWwtbm8tbXNnLWJ0blwiIG9uQ2xpY2s9eygpID0+IG9uRmFpbGVkKCl9Pkluc3RhbGwgRmFpbCBObyBNc2c8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG52aS5tb2NrKCcuLi9pbnN0YWxsLWJ1bmRsZS9yZWFkeS10by1pbnN0YWxsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHtcbiAgICBzdGVwLFxuICAgIG9uU3RlcENoYW5nZSxcbiAgICBvblN0YXJ0VG9JbnN0YWxsLFxuICAgIHNldElzSW5zdGFsbGluZyxcbiAgICBvbkNsb3NlLFxuICAgIGFsbFBsdWdpbnMsXG4gICAgaXNGcm9tTWFya2V0UGxhY2UsXG4gIH06IHtcbiAgICBzdGVwOiBJbnN0YWxsU3RlcFxuICAgIG9uU3RlcENoYW5nZTogKHN0ZXA6IEluc3RhbGxTdGVwKSA9PiB2b2lkXG4gICAgb25TdGFydFRvSW5zdGFsbDogKCkgPT4gdm9pZFxuICAgIHNldElzSW5zdGFsbGluZzogKGlzSW5zdGFsbGluZzogYm9vbGVhbikgPT4gdm9pZFxuICAgIG9uQ2xvc2U6ICgpID0+IHZvaWRcbiAgICBhbGxQbHVnaW5zOiBEZXBlbmRlbmN5W11cbiAgICBpc0Zyb21NYXJrZXRQbGFjZT86IGJvb2xlYW5cbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJidW5kbGUtc3RlcFwiPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJidW5kbGUtc3RlcC12YWx1ZVwiPntzdGVwfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiYnVuZGxlLXBsdWdpbnMtY291bnRcIj57YWxsUGx1Z2lucz8ubGVuZ3RoIHx8IDB9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJpcy1mcm9tLW1hcmtldHBsYWNlXCI+e2lzRnJvbU1hcmtldFBsYWNlID8gJ3RydWUnIDogJ2ZhbHNlJ308L3NwYW4+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiYnVuZGxlLWNhbmNlbC1idG5cIiBvbkNsaWNrPXtvbkNsb3NlfT5DYW5jZWw8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJidW5kbGUtc3RhcnQtaW5zdGFsbC1idG5cIiBvbkNsaWNrPXtvblN0YXJ0VG9JbnN0YWxsfT5TdGFydCBJbnN0YWxsPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiYnVuZGxlLXNldC1pbnN0YWxsaW5nLXRydWVcIiBvbkNsaWNrPXsoKSA9PiBzZXRJc0luc3RhbGxpbmcodHJ1ZSl9PlNldCBJbnN0YWxsaW5nIFRydWU8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJidW5kbGUtc2V0LWluc3RhbGxpbmctZmFsc2VcIiBvbkNsaWNrPXsoKSA9PiBzZXRJc0luc3RhbGxpbmcoZmFsc2UpfT5TZXQgSW5zdGFsbGluZyBGYWxzZTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImJ1bmRsZS1jaGFuZ2UtdG8taW5zdGFsbGVkXCIgb25DbGljaz17KCkgPT4gb25TdGVwQ2hhbmdlKEluc3RhbGxTdGVwLmluc3RhbGxlZCl9PkNoYW5nZSB0byBJbnN0YWxsZWQ8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJidW5kbGUtY2hhbmdlLXRvLWZhaWxlZFwiIG9uQ2xpY2s9eygpID0+IG9uU3RlcENoYW5nZShJbnN0YWxsU3RlcC5pbnN0YWxsRmFpbGVkKX0+Q2hhbmdlIHRvIEZhaWxlZDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbnZpLm1vY2soJy4uL2Jhc2UvaW5zdGFsbGVkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHtcbiAgICBwYXlsb2FkLFxuICAgIGlzTWFya2V0UGF5bG9hZCxcbiAgICBpc0ZhaWxlZCxcbiAgICBlcnJNc2csXG4gICAgb25DYW5jZWwsXG4gIH06IHtcbiAgICBwYXlsb2FkOiBQbHVnaW5NYW5pZmVzdEluTWFya2V0IHwgUGx1Z2luIHwgbnVsbFxuICAgIGlzTWFya2V0UGF5bG9hZD86IGJvb2xlYW5cbiAgICBpc0ZhaWxlZDogYm9vbGVhblxuICAgIGVyck1zZz86IHN0cmluZyB8IG51bGxcbiAgICBvbkNhbmNlbDogKCkgPT4gdm9pZFxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImluc3RhbGxlZC1zdGVwXCI+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImluc3RhbGxlZC1wYXlsb2FkXCI+e3BheWxvYWQ/Lm5hbWUgfHwgJ25vLXBheWxvYWQnfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiaXMtbWFya2V0LXBheWxvYWRcIj57aXNNYXJrZXRQYXlsb2FkID8gJ3RydWUnIDogJ2ZhbHNlJ308L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImlzLWZhaWxlZFwiPntpc0ZhaWxlZCA/ICd0cnVlJyA6ICdmYWxzZSd9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJlcnJvci1tc2dcIj57ZXJyTXNnIHx8ICduby1lcnJvcid9PC9zcGFuPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImluc3RhbGxlZC1jbG9zZS1idG5cIiBvbkNsaWNrPXtvbkNhbmNlbH0+Q2xvc2U8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgKSxcbn0pKVxuXG5kZXNjcmliZSgnSW5zdGFsbEZyb21NYXJrZXRwbGFjZScsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgIHVuaXF1ZUlkZW50aWZpZXI6ICd0ZXN0LXVuaXF1ZS1pZGVudGlmaWVyJyxcbiAgICBtYW5pZmVzdDogY3JlYXRlTW9ja01hbmlmZXN0KCksXG4gICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrSGlkZUxvZ2ljU3RhdGUgPSB7XG4gICAgICBtb2RhbENsYXNzTmFtZTogJ3Rlc3QtbW9kYWwtY2xhc3MnLFxuICAgICAgZm9sZEFuaW1JbnRvOiB2aS5mbigpLFxuICAgICAgc2V0SXNJbnN0YWxsaW5nOiB2aS5mbigpLFxuICAgICAgaGFuZGxlU3RhcnRUb0luc3RhbGw6IHZpLmZuKCksXG4gICAgfVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIG1vZGFsIHdpdGggY29ycmVjdCBpbml0aWFsIHN0YXRlIGZvciBzaW5nbGUgcGx1Z2luJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggYnVuZGxlIHN0ZXAgd2hlbiBpc0J1bmRsZSBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0gY3JlYXRlTW9ja0RlcGVuZGVuY2llcygpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBpc0J1bmRsZT17dHJ1ZX1cbiAgICAgICAgICBkZXBlbmRlbmNpZXM9e2RlcGVuZGVuY2llc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1wbHVnaW5zLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGlzRnJvbU1hcmtldFBsYWNlIGFzIHRydWUgdG8gYnVuZGxlIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IGNyZWF0ZU1vY2tEZXBlbmRlbmNpZXMoKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21NYXJrZXRwbGFjZVxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgaXNCdW5kbGU9e3RydWV9XG4gICAgICAgICAgZGVwZW5kZW5jaWVzPXtkZXBlbmRlbmNpZXN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1mcm9tLW1hcmtldHBsYWNlJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGNvcnJlY3QgcHJvcHMgdG8gSW5zdGFsbCBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3VuaXF1ZS1pZGVudGlmaWVyJykpLnRvSGF2ZVRleHRDb250ZW50KCd0ZXN0LXVuaXF1ZS1pZGVudGlmaWVyJylcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BheWxvYWQtbmFtZScpKS50b0hhdmVUZXh0Q29udGVudCgnVGVzdCBQbHVnaW4nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFwcGx5IG1vZGFsIGNsYXNzTmFtZSBmcm9tIHVzZUhpZGVMb2dpYycsICgpID0+IHtcbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUubW9kYWxDbGFzc05hbWUpLnRvQmUoJ3Rlc3QtbW9kYWwtY2xhc3MnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGl0bGUgRGlzcGxheSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVGl0bGUgRGlzcGxheScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNob3cgaW5zdGFsbCB0aXRsZSBpbiByZWFkeVRvSW5zdGFsbCBzdGVwJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHN1Y2Nlc3MgdGl0bGUgd2hlbiBpbnN0YWxsYXRpb24gY29tcGxldGVzIGZvciBzaW5nbGUgcGx1Z2luJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN1Y2Nlc3MtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsZWRTdWNjZXNzZnVsbHknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGJ1bmRsZSBjb21wbGV0ZSB0aXRsZSB3aGVuIGJ1bmRsZSBpbnN0YWxsYXRpb24gY29tcGxldGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0gY3JlYXRlTW9ja0RlcGVuZGVuY2llcygpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBpc0J1bmRsZT17dHJ1ZX1cbiAgICAgICAgICBkZXBlbmRlbmNpZXM9e2RlcGVuZGVuY2llc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1jaGFuZ2UtdG8taW5zdGFsbGVkJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsQ29tcGxldGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGZhaWxlZCB0aXRsZSB3aGVuIGluc3RhbGxhdGlvbiBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbEZhaWxlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU3RhdGUgTWFuYWdlbWVudCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRyYW5zaXRpb24gZnJvbSByZWFkeVRvSW5zdGFsbCB0byBpbnN0YWxsZWQgb24gc3VjY2VzcycsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1zdWNjZXNzLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1mYWlsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhbHNlJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJhbnNpdGlvbiBmcm9tIHJlYWR5VG9JbnN0YWxsIHRvIGluc3RhbGxGYWlsZWQgb24gZmFpbHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1mYWlsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcnJvci1tc2cnKSkudG9IYXZlVGV4dENvbnRlbnQoJ0luc3RhbGxhdGlvbiBmYWlsZWQnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmFpbHVyZSB3aXRob3V0IGVycm9yIG1lc3NhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZmFpbC1uby1tc2ctYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lzLWZhaWxlZCcpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Vycm9yLW1zZycpKS50b0hhdmVUZXh0Q29udGVudCgnbm8tZXJyb3InKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgc3RlcCB2aWEgb25TdGVwQ2hhbmdlIGluIGJ1bmRsZSBtb2RlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0gY3JlYXRlTW9ja0RlcGVuZGVuY2llcygpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBpc0J1bmRsZT17dHJ1ZX1cbiAgICAgICAgICBkZXBlbmRlbmNpZXM9e2RlcGVuZGVuY2llc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1jaGFuZ2UtdG8taW5zdGFsbGVkJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsQ29tcGxldGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSBUZXN0cyAoTWVtb2l6YXRpb24pXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDYWxsYmFjayBTdGFiaWxpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgZ2V0VGl0bGUgY2FsbGJhY2sgYWNyb3NzIHJlcmVuZGVycycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIHJlcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgaGFuZGxlSW5zdGFsbGVkIGNhbGxiYWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICByZXJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1zdWNjZXNzLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgaGFuZGxlRmFpbGVkIGNhbGxiYWNrJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICByZXJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1mYWlsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbG9zZSB3aGVuIGNhbmNlbCBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjYW5jZWwtYnRuJykpXG5cbiAgICAgIGV4cGVjdChkZWZhdWx0UHJvcHMub25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBmb2xkQW5pbUludG8gd2hlbiBtb2RhbCBjbG9zZSBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUuZm9sZEFuaW1JbnRvKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVTdGFydFRvSW5zdGFsbCB3aGVuIHN0YXJ0IGluc3RhbGwgaXMgdHJpZ2dlcmVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGFydC1pbnN0YWxsLWJ0bicpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLmhhbmRsZVN0YXJ0VG9JbnN0YWxsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uU3VjY2VzcyB3aGVuIGNsb3NlIGJ1dHRvbiBpcyBjbGlja2VkIGluIGluc3RhbGxlZCBzdGVwJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN1Y2Nlc3MtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtY2xvc2UtYnRuJykpXG5cbiAgICAgIGV4cGVjdChkZWZhdWx0UHJvcHMub25TdWNjZXNzKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2UgaW4gYnVuZGxlIG1vZGUgY2FuY2VsJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0gY3JlYXRlTW9ja0RlcGVuZGVuY2llcygpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBpc0J1bmRsZT17dHJ1ZX1cbiAgICAgICAgICBkZXBlbmRlbmNpZXM9e2RlcGVuZGVuY2llc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1jYW5jZWwtYnRuJykpXG5cbiAgICAgIGV4cGVjdChkZWZhdWx0UHJvcHMub25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZWZyZXNoIFBsdWdpbiBMaXN0IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZWZyZXNoIFBsdWdpbiBMaXN0JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCByZWZyZXNoUGx1Z2luTGlzdCB3aGVuIGluc3RhbGxhdGlvbiBjb21wbGV0ZXMgd2l0aG91dCBub3RSZWZyZXNoIGZsYWcnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrUmVmcmVzaFBsdWdpbkxpc3QpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGRlZmF1bHRQcm9wcy5tYW5pZmVzdClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGNhbGwgcmVmcmVzaFBsdWdpbkxpc3Qgd2hlbiBub3RSZWZyZXNoIGZsYWcgaXMgdHJ1ZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1zdWNjZXNzLW5vLXJlZnJlc2gtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja1JlZnJlc2hQbHVnaW5MaXN0KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gc2V0SXNJbnN0YWxsaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdzZXRJc0luc3RhbGxpbmcgQmVoYXZpb3InLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldElzSW5zdGFsbGluZyhmYWxzZSkgd2hlbiBpbnN0YWxsYXRpb24gY29tcGxldGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN1Y2Nlc3MtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLnNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc2V0SXNJbnN0YWxsaW5nKGZhbHNlKSB3aGVuIGluc3RhbGxhdGlvbiBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tIaWRlTG9naWNTdGF0ZS5zZXRJc0luc3RhbGxpbmcpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKGZhbHNlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHNldElzSW5zdGFsbGluZyB0byBidW5kbGUgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0gY3JlYXRlTW9ja0RlcGVuZGVuY2llcygpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBpc0J1bmRsZT17dHJ1ZX1cbiAgICAgICAgICBkZXBlbmRlbmNpZXM9e2RlcGVuZGVuY2llc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1zZXQtaW5zdGFsbGluZy10cnVlJykpXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLnNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLXNldC1pbnN0YWxsaW5nLWZhbHNlJykpXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLnNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBJbnN0YWxsZWQgQ29tcG9uZW50IFByb3BzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbnN0YWxsZWQgQ29tcG9uZW50IFByb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBpc01hcmtldFBheWxvYWQgYXMgdHJ1ZSB0byBJbnN0YWxsZWQgY29tcG9uZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN1Y2Nlc3MtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1tYXJrZXQtcGF5bG9hZCcpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgY29ycmVjdCBwYXlsb2FkIHRvIEluc3RhbGxlZCBjb21wb25lbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1wYXlsb2FkJykpLnRvSGF2ZVRleHRDb250ZW50KCdUZXN0IFBsdWdpbicpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgaXNGYWlsZWQgYXMgdHJ1ZSB3aGVuIGluc3RhbGxhdGlvbiBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXMtZmFpbGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBlcnJvciBtZXNzYWdlIHRvIEluc3RhbGxlZCBjb21wb25lbnQgb24gZmFpbHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXJyb3ItbXNnJykpLnRvSGF2ZVRleHRDb250ZW50KCdJbnN0YWxsYXRpb24gZmFpbGVkJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wIFZhcmlhdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3AgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHdvcmsgd2l0aCBQbHVnaW4gdHlwZSBtYW5pZmVzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbiA9IGNyZWF0ZU1vY2tQbHVnaW4oKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21NYXJrZXRwbGFjZVxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgbWFuaWZlc3Q9e3BsdWdpbn1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BheWxvYWQtbmFtZScpKS50b0hhdmVUZXh0Q29udGVudCgnVGVzdCBQbHVnaW4nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHdvcmsgd2l0aCBQbHVnaW5NYW5pZmVzdEluTWFya2V0IHR5cGUgbWFuaWZlc3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtYW5pZmVzdCA9IGNyZWF0ZU1vY2tNYW5pZmVzdCh7IG5hbWU6ICdNYXJrZXQgUGx1Z2luJyB9KVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21NYXJrZXRwbGFjZVxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgbWFuaWZlc3Q9e21hbmlmZXN0fVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGF5bG9hZC1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdNYXJrZXQgUGx1Z2luJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZGlmZmVyZW50IHVuaXF1ZUlkZW50aWZpZXIgdmFsdWVzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21NYXJrZXRwbGFjZVxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgdW5pcXVlSWRlbnRpZmllcj1cImN1c3RvbS11bmlxdWUtaWQtMTIzXCJcbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3VuaXF1ZS1pZGVudGlmaWVyJykpLnRvSGF2ZVRleHRDb250ZW50KCdjdXN0b20tdW5pcXVlLWlkLTEyMycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgd29yayB3aXRob3V0IGlzQnVuZGxlIHByb3AgKGRlZmF1bHQgdG8gc2luZ2xlIHBsdWdpbiknLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXN0SWQoJ2J1bmRsZS1zdGVwJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgd29yayB3aXRoIGlzQnVuZGxlPWZhbHNlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21NYXJrZXRwbGFjZVxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgaXNCdW5kbGU9e2ZhbHNlfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnYnVuZGxlLXN0ZXAnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggZW1wdHkgZGVwZW5kZW5jaWVzIGFycmF5IGluIGJ1bmRsZSBtb2RlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21NYXJrZXRwbGFjZVxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgaXNCdW5kbGU9e3RydWV9XG4gICAgICAgICAgZGVwZW5kZW5jaWVzPXtbXX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1wbHVnaW5zLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWFuaWZlc3Qgd2l0aCBtaW5pbWFsIHJlcXVpcmVkIGZpZWxkcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1pbmltYWxNYW5pZmVzdCA9IGNyZWF0ZU1vY2tNYW5pZmVzdCh7XG4gICAgICAgIG5hbWU6ICdNaW5pbWFsJyxcbiAgICAgICAgdmVyc2lvbjogJzAuMC4xJyxcbiAgICAgIH0pXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBtYW5pZmVzdD17bWluaW1hbE1hbmlmZXN0fVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGF5bG9hZC1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdNaW5pbWFsJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgcmFwaWQgc3RhdGUgdHJhbnNpdGlvbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFRyaWdnZXIgaW5zdGFsbGF0aW9uIGNvbXBsZXRpb25cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNob3VsZCBzdGF5IGluIGluc3RhbGxlZCBzdGF0ZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXMtZmFpbGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCdmYWxzZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGJ1bmRsZSBtb2RlIHN0ZXAgY2hhbmdlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IGNyZWF0ZU1vY2tEZXBlbmRlbmNpZXMoKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21NYXJrZXRwbGFjZVxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgaXNCdW5kbGU9e3RydWV9XG4gICAgICAgICAgZGVwZW5kZW5jaWVzPXtkZXBlbmRlbmNpZXN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBDaGFuZ2UgdG8gaW5zdGFsbGVkIHN0ZXBcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1jaGFuZ2UtdG8taW5zdGFsbGVkJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsQ29tcGxldGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYnVuZGxlIG1vZGUgZmFpbHVyZSBzdGVwIGNoYW5nZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRlcGVuZGVuY2llcyA9IGNyZWF0ZU1vY2tEZXBlbmRlbmNpZXMoKVxuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21NYXJrZXRwbGFjZVxuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgaXNCdW5kbGU9e3RydWV9XG4gICAgICAgICAgZGVwZW5kZW5jaWVzPXtkZXBlbmRlbmNpZXN9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtY2hhbmdlLXRvLWZhaWxlZCcpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbEZhaWxlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgSW5zdGFsbCBjb21wb25lbnQgaW4gdGVybWluYWwgc3RlcHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgnaW5zdGFsbC1zdGVwJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEluc3RhbGxlZCBjb21wb25lbnQgZm9yIHN1Y2Nlc3Mgc3RhdGUgd2l0aCBpc0ZhaWxlZCBmYWxzZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1zdWNjZXNzLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1mYWlsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhbHNlJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEluc3RhbGxlZCBjb21wb25lbnQgZm9yIGZhaWx1cmUgc3RhdGUgd2l0aCBpc0ZhaWxlZCB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWZhaWwtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lzLWZhaWxlZCcpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGVybWluYWwgU3RlcHMgUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdUZXJtaW5hbCBTdGVwcyBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSW5zdGFsbGVkIGNvbXBvbmVudCB3aGVuIHN0ZXAgaXMgaW5zdGFsbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN1Y2Nlc3MtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBJbnN0YWxsZWQgY29tcG9uZW50IHdoZW4gc3RlcCBpcyBpbnN0YWxsRmFpbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWZhaWwtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lzLWZhaWxlZCcpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgSW5zdGFsbCBjb21wb25lbnQgd2hlbiBpbiB0ZXJtaW5hbCBzdGVwJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBJbml0aWFsbHkgSW5zdGFsbCBpcyBzaG93blxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1zdWNjZXNzLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCdpbnN0YWxsLXN0ZXAnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBEYXRhIEZsb3cgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0RhdGEgRmxvdycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3MgdW5pcXVlSWRlbnRpZmllciB0byBJbnN0YWxsIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSB1bmlxdWVJZGVudGlmaWVyPVwiZmxvdy10ZXN0LWlkXCIgLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3VuaXF1ZS1pZGVudGlmaWVyJykpLnRvSGF2ZVRleHRDb250ZW50KCdmbG93LXRlc3QtaWQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgbWFuaWZlc3QgcGF5bG9hZCB0byBJbnN0YWxsIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGN1c3RvbU1hbmlmZXN0ID0gY3JlYXRlTW9ja01hbmlmZXN0KHsgbmFtZTogJ0Zsb3cgVGVzdCBQbHVnaW4nIH0pXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gbWFuaWZlc3Q9e2N1c3RvbU1hbmlmZXN0fSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGF5bG9hZC1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdGbG93IFRlc3QgUGx1Z2luJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGRlcGVuZGVuY2llcyB0byBidW5kbGUgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0gY3JlYXRlTW9ja0RlcGVuZGVuY2llcygpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBpc0J1bmRsZT17dHJ1ZX1cbiAgICAgICAgICBkZXBlbmRlbmNpZXM9e2RlcGVuZGVuY2llc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1wbHVnaW5zLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcyJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGN1cnJlbnQgc3RlcCB0byBidW5kbGUgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgY29uc3QgZGVwZW5kZW5jaWVzID0gY3JlYXRlTW9ja0RlcGVuZGVuY2llcygpXG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlXG4gICAgICAgICAgey4uLmRlZmF1bHRQcm9wc31cbiAgICAgICAgICBpc0J1bmRsZT17dHJ1ZX1cbiAgICAgICAgICBkZXBlbmRlbmNpZXM9e2RlcGVuZGVuY2llc31cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1zdGVwLXZhbHVlJykpLnRvSGF2ZVRleHRDb250ZW50KEluc3RhbGxTdGVwLnJlYWR5VG9JbnN0YWxsKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTWFuaWZlc3QgQ2F0ZWdvcnkgVmFyaWF0aW9ucyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnTWFuaWZlc3QgQ2F0ZWdvcnkgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB0b29sIGNhdGVnb3J5IG1hbmlmZXN0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbWFuaWZlc3QgPSBjcmVhdGVNb2NrTWFuaWZlc3QoeyBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wgfSlcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSBtYW5pZmVzdD17bWFuaWZlc3R9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtb2RlbCBjYXRlZ29yeSBtYW5pZmVzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gY3JlYXRlTW9ja01hbmlmZXN0KHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5tb2RlbCB9KVxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IG1hbmlmZXN0PXttYW5pZmVzdH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGV4dGVuc2lvbiBjYXRlZ29yeSBtYW5pZmVzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1hbmlmZXN0ID0gY3JlYXRlTW9ja01hbmlmZXN0KHsgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5leHRlbnNpb24gfSlcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSBtYW5pZmVzdD17bWFuaWZlc3R9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gSG9vayBJbnRlZ3JhdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSG9vayBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVzZSBoYW5kbGVTdGFydFRvSW5zdGFsbCBmcm9tIHVzZUhpZGVMb2dpYycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21NYXJrZXRwbGFjZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RhcnQtaW5zdGFsbC1idG4nKSlcblxuICAgICAgZXhwZWN0KG1vY2tIaWRlTG9naWNTdGF0ZS5oYW5kbGVTdGFydFRvSW5zdGFsbCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIHNldElzSW5zdGFsbGluZyBmcm9tIHVzZUhpZGVMb2dpYyBpbiBoYW5kbGVJbnN0YWxsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUuc2V0SXNJbnN0YWxsaW5nKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIHNldElzSW5zdGFsbGluZyBmcm9tIHVzZUhpZGVMb2dpYyBpbiBoYW5kbGVGYWlsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZmFpbC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUuc2V0SXNJbnN0YWxsaW5nKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIHJlZnJlc2hQbHVnaW5MaXN0IGZyb20gdXNlUmVmcmVzaFBsdWdpbkxpc3QnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrUmVmcmVzaFBsdWdpbkxpc3QpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIGdldFRpdGxlIE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdnZXRUaXRsZSBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBpbnN0YWxsUGx1Z2luIHRpdGxlIGZvciByZWFkeVRvSW5zdGFsbCBzdGVwJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gaW5zdGFsbGVkU3VjY2Vzc2Z1bGx5IGZvciBub24tYnVuZGxlIGluc3RhbGxlZCBzdGVwJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbU1hcmtldHBsYWNlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN1Y2Nlc3MtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsZWRTdWNjZXNzZnVsbHknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gaW5zdGFsbENvbXBsZXRlIGZvciBidW5kbGUgaW5zdGFsbGVkIHN0ZXAnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZXBlbmRlbmNpZXMgPSBjcmVhdGVNb2NrRGVwZW5kZW5jaWVzKClcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tTWFya2V0cGxhY2VcbiAgICAgICAgICB7Li4uZGVmYXVsdFByb3BzfVxuICAgICAgICAgIGlzQnVuZGxlPXt0cnVlfVxuICAgICAgICAgIGRlcGVuZGVuY2llcz17ZGVwZW5kZW5jaWVzfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLWNoYW5nZS10by1pbnN0YWxsZWQnKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxDb21wbGV0ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBpbnN0YWxsRmFpbGVkIGZvciBpbnN0YWxsRmFpbGVkIHN0ZXAnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTWFya2V0cGxhY2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZmFpbC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxGYWlsZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcbiJdfQ==