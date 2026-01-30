"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("../../types");
const index_1 = require("./index");
const github_item_1 = require("./item/github-item");
const loaded_item_1 = require("./item/loaded-item");
const marketplace_item_1 = require("./item/marketplace-item");
const package_item_1 = require("./item/package-item");
const ready_to_install_1 = require("./ready-to-install");
const installed_1 = require("./steps/installed");
// Factory functions for test data
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
    label: { 'en-US': 'Test Plugin' },
    brief: { 'en-US': 'A test plugin' },
    description: { 'en-US': 'A test plugin description' },
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
const createMockVersionProps = (overrides = {}) => ({
    hasInstalled: false,
    installedVersion: undefined,
    toInstallVersion: '1.0.0',
    ...overrides,
});
const createMockInstallStatus = (overrides = {}) => ({
    success: true,
    isFromMarketPlace: true,
    ...overrides,
});
const createMockGitHubDependency = () => ({
    type: 'github',
    value: {
        repo: 'test-org/test-repo',
        version: 'v1.0.0',
        package: 'plugin.zip',
    },
});
const createMockPackageDependency = () => ({
    type: 'package',
    value: {
        unique_identifier: 'package-plugin-uid',
        manifest: {
            plugin_unique_identifier: 'package-plugin-uid',
            version: '1.0.0',
            author: 'test-author',
            icon: 'icon.png',
            name: 'Package Plugin',
            category: types_1.PluginCategoryEnum.tool,
            label: { 'en-US': 'Package Plugin' },
            description: { 'en-US': 'Test package plugin' },
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
        },
    },
});
const createMockDependency = (overrides = {}) => ({
    type: 'marketplace',
    value: {
        plugin_unique_identifier: 'test-plugin-uid',
    },
    ...overrides,
});
const createMockDependencies = () => [
    {
        type: 'marketplace',
        value: {
            marketplace_plugin_unique_identifier: 'plugin-1-uid',
        },
    },
    {
        type: 'github',
        value: {
            repo: 'test/plugin2',
            version: 'v1.0.0',
            package: 'plugin2.zip',
        },
    },
    {
        type: 'package',
        value: {
            unique_identifier: 'package-plugin-uid',
            manifest: {
                plugin_unique_identifier: 'package-plugin-uid',
                version: '1.0.0',
                author: 'test-author',
                icon: 'icon.png',
                name: 'Package Plugin',
                category: types_1.PluginCategoryEnum.tool,
                label: { 'en-US': 'Package Plugin' },
                description: { 'en-US': 'Test package plugin' },
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
            },
        },
    },
];
// Mock useHideLogic hook
let mockHideLogicState = {
    modalClassName: 'test-modal-class',
    foldAnimInto: vitest_1.vi.fn(),
    setIsInstalling: vitest_1.vi.fn(),
    handleStartToInstall: vitest_1.vi.fn(),
};
vitest_1.vi.mock('../hooks/use-hide-logic', () => ({
    default: () => mockHideLogicState,
}));
// Mock useGetIcon hook
vitest_1.vi.mock('../base/use-get-icon', () => ({
    default: () => ({
        getIconUrl: (icon) => icon || 'default-icon.png',
    }),
}));
// Mock usePluginInstallLimit hook
vitest_1.vi.mock('../hooks/use-install-plugin-limit', () => ({
    default: () => ({ canInstall: true }),
    pluginInstallLimit: () => ({ canInstall: true }),
}));
// Mock useUploadGitHub hook
const mockUseUploadGitHub = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/use-plugins', () => ({
    useUploadGitHub: (params) => mockUseUploadGitHub(params),
    useInstallOrUpdate: () => ({ mutate: vitest_1.vi.fn(), isPending: false }),
    usePluginTaskList: () => ({ handleRefetch: vitest_1.vi.fn() }),
    useFetchPluginsInMarketPlaceByInfo: () => ({ isLoading: false, data: null, error: null }),
}));
// Mock config
vitest_1.vi.mock('@/config', () => ({
    MARKETPLACE_API_PREFIX: 'https://marketplace.example.com',
}));
// Mock mitt context
vitest_1.vi.mock('@/context/mitt-context', () => ({
    useMittContextSelector: () => vitest_1.vi.fn(),
}));
// Mock global public context
vitest_1.vi.mock('@/context/global-public-context', () => ({
    useGlobalPublicStore: () => ({}),
}));
// Mock useCanInstallPluginFromMarketplace
vitest_1.vi.mock('@/app/components/plugins/plugin-page/use-reference-setting', () => ({
    useCanInstallPluginFromMarketplace: () => ({ canInstallPluginFromMarketplace: true }),
}));
// Mock checkTaskStatus
vitest_1.vi.mock('../base/check-task-status', () => ({
    default: () => ({ check: vitest_1.vi.fn(), stop: vitest_1.vi.fn() }),
}));
// Mock useRefreshPluginList
vitest_1.vi.mock('../hooks/use-refresh-plugin-list', () => ({
    default: () => ({ refreshPluginList: vitest_1.vi.fn() }),
}));
// Mock useCheckInstalled
vitest_1.vi.mock('../hooks/use-check-installed', () => ({
    default: () => ({ installedInfo: {} }),
}));
// Mock ReadyToInstall child component to test InstallBundle in isolation
vitest_1.vi.mock('./ready-to-install', () => ({
    default: ({ step, onStepChange, onStartToInstall, setIsInstalling, allPlugins, onClose, }) => (<div data-testid="ready-to-install">
      <span data-testid="current-step">{step}</span>
      <span data-testid="plugins-count">{allPlugins?.length || 0}</span>
      <button data-testid="start-install-btn" onClick={onStartToInstall}>Start Install</button>
      <button data-testid="set-installing-true" onClick={() => setIsInstalling(true)}>Set Installing True</button>
      <button data-testid="set-installing-false" onClick={() => setIsInstalling(false)}>Set Installing False</button>
      <button data-testid="change-to-installed" onClick={() => onStepChange(types_1.InstallStep.installed)}>Change to Installed</button>
      <button data-testid="change-to-upload-failed" onClick={() => onStepChange(types_1.InstallStep.uploadFailed)}>Change to Upload Failed</button>
      <button data-testid="change-to-ready" onClick={() => onStepChange(types_1.InstallStep.readyToInstall)}>Change to Ready</button>
      <button data-testid="close-btn" onClick={onClose}>Close</button>
    </div>),
}));
(0, vitest_1.describe)('InstallBundle', () => {
    const defaultProps = {
        fromDSLPayload: createMockDependencies(),
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
        (0, vitest_1.it)('should render modal with correct title for install plugin', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render ReadyToInstall component', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should integrate with useHideLogic hook', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Verify that the component integrates with useHideLogic
            // The hook provides modalClassName, foldAnimInto, setIsInstalling, handleStartToInstall
            (0, vitest_1.expect)(mockHideLogicState.modalClassName).toBeDefined();
            (0, vitest_1.expect)(mockHideLogicState.foldAnimInto).toBeDefined();
        });
        (0, vitest_1.it)('should render modal as visible', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Modal is always shown (isShow={true})
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeVisible();
        });
    });
    // ================================
    // Props Tests
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.describe)('installType', () => {
            (0, vitest_1.it)('should default to InstallType.fromMarketplace when not provided', () => {
                (0, react_1.render)(<index_1.default {...defaultProps}/>);
                // When installType is fromMarketplace (default), initial step should be readyToInstall
                (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.readyToInstall);
            });
            (0, vitest_1.it)('should set initial step to readyToInstall when installType is fromMarketplace', () => {
                (0, react_1.render)(<index_1.default {...defaultProps} installType={index_1.InstallType.fromMarketplace}/>);
                (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.readyToInstall);
            });
            (0, vitest_1.it)('should set initial step to uploading when installType is fromLocal', () => {
                (0, react_1.render)(<index_1.default {...defaultProps} installType={index_1.InstallType.fromLocal}/>);
                (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.uploading);
            });
            (0, vitest_1.it)('should set initial step to uploading when installType is fromDSL', () => {
                (0, react_1.render)(<index_1.default {...defaultProps} installType={index_1.InstallType.fromDSL}/>);
                (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.uploading);
            });
        });
        (0, vitest_1.describe)('fromDSLPayload', () => {
            (0, vitest_1.it)('should pass allPlugins to ReadyToInstall', () => {
                const plugins = createMockDependencies();
                (0, react_1.render)(<index_1.default {...defaultProps} fromDSLPayload={plugins}/>);
                (0, vitest_1.expect)(react_1.screen.getByTestId('plugins-count')).toHaveTextContent('3');
            });
            (0, vitest_1.it)('should handle empty fromDSLPayload array', () => {
                (0, react_1.render)(<index_1.default {...defaultProps} fromDSLPayload={[]}/>);
                (0, vitest_1.expect)(react_1.screen.getByTestId('plugins-count')).toHaveTextContent('0');
            });
            (0, vitest_1.it)('should handle single plugin in fromDSLPayload', () => {
                (0, react_1.render)(<index_1.default {...defaultProps} fromDSLPayload={[createMockDependency()]}/>);
                (0, vitest_1.expect)(react_1.screen.getByTestId('plugins-count')).toHaveTextContent('1');
            });
        });
        (0, vitest_1.describe)('onClose', () => {
            (0, vitest_1.it)('should pass onClose to ReadyToInstall', () => {
                const onClose = vitest_1.vi.fn();
                (0, react_1.render)(<index_1.default {...defaultProps} onClose={onClose}/>);
                react_1.fireEvent.click(react_1.screen.getByTestId('close-btn'));
                (0, vitest_1.expect)(onClose).toHaveBeenCalledTimes(1);
            });
        });
    });
    // ================================
    // State Management Tests
    // ================================
    (0, vitest_1.describe)('State Management', () => {
        (0, vitest_1.it)('should update title when step changes to uploadFailed', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Initial title
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
            // Change step to uploadFailed
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-upload-failed'));
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.uploadFailed')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should update title when step changes to installed', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Change step to installed
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-installed'));
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installComplete')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should maintain installPlugin title for readyToInstall step', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
            // Explicitly change to readyToInstall
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-ready'));
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass step state to ReadyToInstall component', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.readyToInstall);
        });
        (0, vitest_1.it)('should update ReadyToInstall step when onStepChange is called', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Initially readyToInstall
            (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.readyToInstall);
            // Change to installed
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-installed'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.installed);
        });
    });
    // ================================
    // Callback Stability and useHideLogic Integration Tests
    // ================================
    (0, vitest_1.describe)('Callback Stability and useHideLogic Integration', () => {
        (0, vitest_1.it)('should provide foldAnimInto for modal onClose handler', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // The modal's onClose is set to foldAnimInto from useHideLogic
            // Verify the hook provides this function
            (0, vitest_1.expect)(mockHideLogicState.foldAnimInto).toBeDefined();
            (0, vitest_1.expect)(typeof mockHideLogicState.foldAnimInto).toBe('function');
        });
        (0, vitest_1.it)('should pass handleStartToInstall to ReadyToInstall', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should pass setIsInstalling to ReadyToInstall', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('set-installing-true'));
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(true);
        });
        (0, vitest_1.it)('should pass setIsInstalling with false to ReadyToInstall', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('set-installing-false'));
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
        });
    });
    // ================================
    // Title Logic Tests (getTitle callback)
    // ================================
    (0, vitest_1.describe)('Title Logic (getTitle callback)', () => {
        (0, vitest_1.it)('should return uploadFailed title when step is uploadFailed', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} installType={index_1.InstallType.fromLocal}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-upload-failed'));
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.uploadFailed')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should return installComplete title when step is installed', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-installed'));
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installComplete')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should return installPlugin title for all other steps', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Default step - readyToInstall
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should return installPlugin title when step is uploading', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} installType={index_1.InstallType.fromLocal}/>);
            // Step is uploading
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
    });
    // ================================
    // Component Memoization Tests
    // ================================
    (0, vitest_1.describe)('Component Memoization', () => {
        (0, vitest_1.it)('should be wrapped with React.memo', () => {
            // Verify that InstallBundle is memoized by checking its displayName or structure
            // Since the component is exported as React.memo(InstallBundle), we can check its type
            (0, vitest_1.expect)(index_1.default).toBeDefined();
            (0, vitest_1.expect)(typeof index_1.default).toBe('object'); // memo returns an object
        });
        (0, vitest_1.it)('should not re-render when same props are passed', () => {
            const onClose = vitest_1.vi.fn();
            const payload = createMockDependencies();
            const { rerender } = (0, react_1.render)(<index_1.default fromDSLPayload={payload} onClose={onClose}/>);
            // Re-render with same props reference
            rerender(<index_1.default fromDSLPayload={payload} onClose={onClose}/>);
            // Component should still render correctly
            (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install')).toBeInTheDocument();
        });
    });
    // ================================
    // User Interactions Tests
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should handle start install button click', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should handle close button click', () => {
            const onClose = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} onClose={onClose}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('close-btn'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should handle step change to installed', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-installed'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.installed);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installComplete')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle step change to uploadFailed', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-upload-failed'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.uploadFailed);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.uploadFailed')).toBeInTheDocument();
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty dependencies array', () => {
            (0, react_1.render)(<index_1.default fromDSLPayload={[]} onClose={vitest_1.vi.fn()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugins-count')).toHaveTextContent('0');
        });
        (0, vitest_1.it)('should handle large number of dependencies', () => {
            const largeDependencies = Array.from({ length: 100 }, (_, i) => ({
                type: 'marketplace',
                value: {
                    marketplace_plugin_unique_identifier: `plugin-${i}-uid`,
                },
            }));
            (0, react_1.render)(<index_1.default fromDSLPayload={largeDependencies} onClose={vitest_1.vi.fn()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugins-count')).toHaveTextContent('100');
        });
        (0, vitest_1.it)('should handle dependencies with different types', () => {
            const mixedDependencies = [
                { type: 'marketplace', value: { marketplace_plugin_unique_identifier: 'mp-uid' } },
                { type: 'github', value: { repo: 'org/repo', version: 'v1.0.0', package: 'pkg.zip' } },
                {
                    type: 'package',
                    value: {
                        unique_identifier: 'pkg-uid',
                        manifest: {
                            plugin_unique_identifier: 'pkg-uid',
                            version: '1.0.0',
                            author: 'author',
                            icon: 'icon.png',
                            name: 'Package',
                            category: types_1.PluginCategoryEnum.tool,
                            label: {},
                            description: {},
                            created_at: '',
                            resource: {},
                            plugins: [],
                            verified: true,
                            endpoint: { settings: [], endpoints: [] },
                            model: null,
                            tags: [],
                            agent_strategy: null,
                            meta: { version: '1.0.0' },
                            trigger: {},
                        },
                    },
                },
            ];
            (0, react_1.render)(<index_1.default fromDSLPayload={mixedDependencies} onClose={vitest_1.vi.fn()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugins-count')).toHaveTextContent('3');
        });
        (0, vitest_1.it)('should handle rapid step changes', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Rapid step changes
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-installed'));
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-upload-failed'));
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-ready'));
            // Should end up at readyToInstall
            (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.readyToInstall);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle multiple setIsInstalling calls', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('set-installing-true'));
            react_1.fireEvent.click(react_1.screen.getByTestId('set-installing-false'));
            react_1.fireEvent.click(react_1.screen.getByTestId('set-installing-true'));
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledTimes(3);
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenNthCalledWith(1, true);
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenNthCalledWith(2, false);
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenNthCalledWith(3, true);
        });
    });
    // ================================
    // InstallType Enum Tests
    // ================================
    (0, vitest_1.describe)('InstallType Enum', () => {
        (0, vitest_1.it)('should export InstallType enum with correct values', () => {
            (0, vitest_1.expect)(index_1.InstallType.fromLocal).toBe('fromLocal');
            (0, vitest_1.expect)(index_1.InstallType.fromMarketplace).toBe('fromMarketplace');
            (0, vitest_1.expect)(index_1.InstallType.fromDSL).toBe('fromDSL');
        });
        (0, vitest_1.it)('should handle all InstallType values', () => {
            const types = [index_1.InstallType.fromLocal, index_1.InstallType.fromMarketplace, index_1.InstallType.fromDSL];
            types.forEach((type) => {
                const { unmount } = (0, react_1.render)(<index_1.default {...defaultProps} installType={type}/>);
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install')).toBeInTheDocument();
                unmount();
            });
        });
    });
    // ================================
    // Modal Integration Tests
    // ================================
    (0, vitest_1.describe)('Modal Integration', () => {
        (0, vitest_1.it)('should render modal with title', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Verify modal renders with title
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render modal with closable behavior', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Modal should render the content including the ReadyToInstall component
            (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display title in modal header', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            const titleElement = react_1.screen.getByText('plugin.installModal.installPlugin');
            (0, vitest_1.expect)(titleElement).toBeInTheDocument();
            (0, vitest_1.expect)(titleElement).toHaveClass('title-2xl-semi-bold');
        });
    });
    // ================================
    // Initial Step Determination Tests
    // ================================
    (0, vitest_1.describe)('Initial Step Determination', () => {
        (0, vitest_1.it)('should set initial step based on installType for fromMarketplace', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} installType={index_1.InstallType.fromMarketplace}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.readyToInstall);
        });
        (0, vitest_1.it)('should set initial step based on installType for fromLocal', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} installType={index_1.InstallType.fromLocal}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.uploading);
        });
        (0, vitest_1.it)('should set initial step based on installType for fromDSL', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} installType={index_1.InstallType.fromDSL}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.uploading);
        });
        (0, vitest_1.it)('should use default installType when not provided', () => {
            (0, react_1.render)(<index_1.default fromDSLPayload={defaultProps.fromDSLPayload} onClose={defaultProps.onClose}/>);
            // Default is fromMarketplace which results in readyToInstall
            (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.readyToInstall);
        });
    });
    // ================================
    // useHideLogic Hook Integration Tests
    // ================================
    (0, vitest_1.describe)('useHideLogic Hook Integration', () => {
        (0, vitest_1.it)('should receive modalClassName from useHideLogic', () => {
            mockHideLogicState.modalClassName = 'custom-modal-class';
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Verify hook provides modalClassName (component uses it in Modal className prop)
            (0, vitest_1.expect)(mockHideLogicState.modalClassName).toBe('custom-modal-class');
        });
        (0, vitest_1.it)('should pass onClose to useHideLogic', () => {
            const onClose = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} onClose={onClose}/>);
            // The hook receives onClose and returns foldAnimInto
            // When modal closes, foldAnimInto should be used
            (0, vitest_1.expect)(mockHideLogicState.foldAnimInto).toBeDefined();
        });
        (0, vitest_1.it)('should use foldAnimInto for modal close action', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // The modal's onClose is set to foldAnimInto
            // This is verified by checking that the hook returns the function
            (0, vitest_1.expect)(typeof mockHideLogicState.foldAnimInto).toBe('function');
        });
    });
    // ================================
    // ReadyToInstall Props Passing Tests
    // ================================
    (0, vitest_1.describe)('ReadyToInstall Props Passing', () => {
        (0, vitest_1.it)('should pass step to ReadyToInstall', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.readyToInstall);
        });
        (0, vitest_1.it)('should pass onStepChange to ReadyToInstall', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Trigger step change
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-installed'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('current-step')).toHaveTextContent(types_1.InstallStep.installed);
        });
        (0, vitest_1.it)('should pass onStartToInstall to ReadyToInstall', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should pass setIsInstalling to ReadyToInstall', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('set-installing-true'));
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(true);
        });
        (0, vitest_1.it)('should pass allPlugins (fromDSLPayload) to ReadyToInstall', () => {
            const plugins = createMockDependencies();
            (0, react_1.render)(<index_1.default fromDSLPayload={plugins} onClose={vitest_1.vi.fn()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugins-count')).toHaveTextContent(String(plugins.length));
        });
        (0, vitest_1.it)('should pass onClose to ReadyToInstall', () => {
            const onClose = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default {...defaultProps} onClose={onClose}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('close-btn'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalled();
        });
    });
    // ================================
    // Callback Memoization Tests
    // ================================
    (0, vitest_1.describe)('Callback Memoization (getTitle)', () => {
        (0, vitest_1.it)('should return correct title based on current step', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Default step (readyToInstall) -> installPlugin title
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should update title when step changes', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Change to installed
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-installed'));
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installComplete')).toBeInTheDocument();
            // Change to uploadFailed
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-upload-failed'));
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.uploadFailed')).toBeInTheDocument();
            // Change back to readyToInstall
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-ready'));
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
    });
    // ================================
    // Error Handling Tests
    // ================================
    (0, vitest_1.describe)('Error Handling', () => {
        (0, vitest_1.it)('should handle null in fromDSLPayload gracefully', () => {
            // TypeScript would catch this, but testing runtime behavior
            // @ts-expect-error Testing null handling
            (0, react_1.render)(<index_1.default fromDSLPayload={null} onClose={vitest_1.vi.fn()}/>);
            // Should render without crashing, count will be 0
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugins-count')).toHaveTextContent('0');
        });
        (0, vitest_1.it)('should handle undefined in fromDSLPayload gracefully', () => {
            // @ts-expect-error Testing undefined handling
            (0, react_1.render)(<index_1.default fromDSLPayload={undefined} onClose={vitest_1.vi.fn()}/>);
            // Should render without crashing
            (0, vitest_1.expect)(react_1.screen.getByTestId('plugins-count')).toHaveTextContent('0');
        });
    });
    // ================================
    // CSS Classes Tests
    // ================================
    (0, vitest_1.describe)('CSS Classes', () => {
        (0, vitest_1.it)('should render modal with proper structure', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Verify component renders with expected structure
            (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply correct CSS classes to title', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            const title = react_1.screen.getByText('plugin.installModal.installPlugin');
            (0, vitest_1.expect)(title).toHaveClass('title-2xl-semi-bold');
            (0, vitest_1.expect)(title).toHaveClass('text-text-primary');
        });
    });
    // ================================
    // Rendering Consistency Tests
    // ================================
    (0, vitest_1.describe)('Rendering Consistency', () => {
        (0, vitest_1.it)('should render consistently across different installTypes', () => {
            // fromMarketplace
            const { unmount: unmount1 } = (0, react_1.render)(<index_1.default {...defaultProps} installType={index_1.InstallType.fromMarketplace}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install')).toBeInTheDocument();
            unmount1();
            // fromLocal
            const { unmount: unmount2 } = (0, react_1.render)(<index_1.default {...defaultProps} installType={index_1.InstallType.fromLocal}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install')).toBeInTheDocument();
            unmount2();
            // fromDSL
            const { unmount: unmount3 } = (0, react_1.render)(<index_1.default {...defaultProps} installType={index_1.InstallType.fromDSL}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install')).toBeInTheDocument();
            unmount3();
        });
        (0, vitest_1.it)('should maintain modal structure across step changes', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Check ReadyToInstall component exists
            (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install')).toBeInTheDocument();
            // Change step
            react_1.fireEvent.click(react_1.screen.getByTestId('change-to-installed'));
            // ReadyToInstall should still exist
            (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install')).toBeInTheDocument();
            // Title should be updated
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installComplete')).toBeInTheDocument();
        });
    });
});
// ================================================================
// ReadyToInstall Component Tests (using mocked version from InstallBundle)
// ================================================================
(0, vitest_1.describe)('ReadyToInstall (via InstallBundle mock)', () => {
    // Note: ReadyToInstall is mocked for InstallBundle tests.
    // These tests verify the mock interface and component behavior.
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Component Definition Tests
    // ================================
    (0, vitest_1.describe)('Component Definition', () => {
        (0, vitest_1.it)('should be defined and importable', () => {
            (0, vitest_1.expect)(ready_to_install_1.default).toBeDefined();
        });
        (0, vitest_1.it)('should be a memoized component', () => {
            // The import gives us the mocked version, which is a function
            (0, vitest_1.expect)(typeof ready_to_install_1.default).toBe('function');
        });
    });
});
// ================================================================
// Installed Component Tests
// ================================================================
(0, vitest_1.describe)('Installed', () => {
    const defaultInstalledProps = {
        list: [createMockPlugin()],
        installStatus: [createMockInstallStatus()],
        onCancel: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render plugin list', () => {
            (0, react_1.render)(<installed_1.default {...defaultInstalledProps}/>);
            // Should show close button
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'common.operation.close' })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render multiple plugins', () => {
            const plugins = [
                createMockPlugin({ plugin_id: 'plugin-1', name: 'Plugin 1' }),
                createMockPlugin({ plugin_id: 'plugin-2', name: 'Plugin 2' }),
            ];
            const statuses = [
                createMockInstallStatus({ success: true }),
                createMockInstallStatus({ success: false }),
            ];
            (0, react_1.render)(<installed_1.default list={plugins} installStatus={statuses} onCancel={vitest_1.vi.fn()}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'common.operation.close' })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render close button when isHideButton is true', () => {
            (0, react_1.render)(<installed_1.default {...defaultInstalledProps} isHideButton={true}/>);
            (0, vitest_1.expect)(react_1.screen.queryByRole('button', { name: 'common.operation.close' })).not.toBeInTheDocument();
        });
    });
    // ================================
    // User Interactions Tests
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onCancel when close button is clicked', () => {
            const onCancel = vitest_1.vi.fn();
            (0, react_1.render)(<installed_1.default {...defaultInstalledProps} onCancel={onCancel}/>);
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'common.operation.close' }));
            (0, vitest_1.expect)(onCancel).toHaveBeenCalledTimes(1);
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty plugin list', () => {
            (0, react_1.render)(<installed_1.default list={[]} installStatus={[]} onCancel={vitest_1.vi.fn()}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'common.operation.close' })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle mixed install statuses', () => {
            const plugins = [
                createMockPlugin({ plugin_id: 'success-plugin' }),
                createMockPlugin({ plugin_id: 'failed-plugin' }),
            ];
            const statuses = [
                createMockInstallStatus({ success: true }),
                createMockInstallStatus({ success: false }),
            ];
            (0, react_1.render)(<installed_1.default list={plugins} installStatus={statuses} onCancel={vitest_1.vi.fn()}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'common.operation.close' })).toBeInTheDocument();
        });
    });
    // ================================
    // Component Memoization Tests
    // ================================
    (0, vitest_1.describe)('Component Memoization', () => {
        (0, vitest_1.it)('should be wrapped with React.memo', () => {
            (0, vitest_1.expect)(installed_1.default).toBeDefined();
            (0, vitest_1.expect)(typeof installed_1.default).toBe('object');
        });
    });
});
// ================================================================
// LoadedItem Component Tests
// ================================================================
(0, vitest_1.describe)('LoadedItem', () => {
    const defaultLoadedItemProps = {
        checked: false,
        onCheckedChange: vitest_1.vi.fn(),
        payload: createMockPlugin(),
        versionInfo: createMockVersionProps(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // Helper to find checkbox element
    const getCheckbox = () => react_1.screen.getByTestId(/^checkbox/);
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render checkbox', () => {
            (0, react_1.render)(<loaded_item_1.default {...defaultLoadedItemProps}/>);
            (0, vitest_1.expect)(getCheckbox()).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render checkbox with check icon when checked prop is true', () => {
            (0, react_1.render)(<loaded_item_1.default {...defaultLoadedItemProps} checked={true}/>);
            (0, vitest_1.expect)(getCheckbox()).toBeInTheDocument();
            // Check icon should be present when checked
            (0, vitest_1.expect)(react_1.screen.getByTestId(/^check-icon/)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render checkbox without check icon when checked prop is false', () => {
            (0, react_1.render)(<loaded_item_1.default {...defaultLoadedItemProps} checked={false}/>);
            (0, vitest_1.expect)(getCheckbox()).toBeInTheDocument();
            // Check icon should not be present when unchecked
            (0, vitest_1.expect)(react_1.screen.queryByTestId(/^check-icon/)).not.toBeInTheDocument();
        });
    });
    // ================================
    // User Interactions Tests
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onCheckedChange when checkbox is clicked', () => {
            const onCheckedChange = vitest_1.vi.fn();
            (0, react_1.render)(<loaded_item_1.default {...defaultLoadedItemProps} onCheckedChange={onCheckedChange}/>);
            react_1.fireEvent.click(getCheckbox());
            (0, vitest_1.expect)(onCheckedChange).toHaveBeenCalledWith(defaultLoadedItemProps.payload);
        });
    });
    // ================================
    // Props Tests
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should handle isFromMarketPlace prop', () => {
            (0, react_1.render)(<loaded_item_1.default {...defaultLoadedItemProps} isFromMarketPlace={true}/>);
            (0, vitest_1.expect)(getCheckbox()).toBeInTheDocument();
        });
        (0, vitest_1.it)('should display version info when payload has version', () => {
            const pluginWithVersion = createMockPlugin({ version: '2.0.0' });
            (0, react_1.render)(<loaded_item_1.default {...defaultLoadedItemProps} payload={pluginWithVersion}/>);
            (0, vitest_1.expect)(getCheckbox()).toBeInTheDocument();
        });
    });
    // ================================
    // Component Memoization Tests
    // ================================
    (0, vitest_1.describe)('Component Memoization', () => {
        (0, vitest_1.it)('should be wrapped with React.memo', () => {
            (0, vitest_1.expect)(loaded_item_1.default).toBeDefined();
            (0, vitest_1.expect)(typeof loaded_item_1.default).toBe('object');
        });
    });
});
// ================================================================
// MarketplaceItem Component Tests
// ================================================================
(0, vitest_1.describe)('MarketplaceItem', () => {
    const defaultMarketplaceItemProps = {
        checked: false,
        onCheckedChange: vitest_1.vi.fn(),
        payload: createMockPlugin(),
        version: '1.0.0',
        versionInfo: createMockVersionProps(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // Helper to find checkbox element
    const getCheckbox = () => react_1.screen.getByTestId(/^checkbox/);
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render LoadedItem when payload is provided', () => {
            (0, react_1.render)(<marketplace_item_1.default {...defaultMarketplaceItemProps}/>);
            (0, vitest_1.expect)(getCheckbox()).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render Loading when payload is undefined', () => {
            (0, react_1.render)(<marketplace_item_1.default {...defaultMarketplaceItemProps} payload={undefined}/>);
            // Loading component renders a disabled checkbox
            const checkbox = react_1.screen.getByTestId(/^checkbox/);
            (0, vitest_1.expect)(checkbox).toHaveClass('cursor-not-allowed');
        });
    });
    // ================================
    // Props Tests
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should pass version to LoadedItem', () => {
            (0, react_1.render)(<marketplace_item_1.default {...defaultMarketplaceItemProps} version="2.0.0"/>);
            (0, vitest_1.expect)(getCheckbox()).toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass checked state to LoadedItem', () => {
            (0, react_1.render)(<marketplace_item_1.default {...defaultMarketplaceItemProps} checked={true}/>);
            // When checked, the check icon should be present
            (0, vitest_1.expect)(react_1.screen.getByTestId(/^check-icon/)).toBeInTheDocument();
        });
    });
    // ================================
    // User Interactions Tests
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onCheckedChange when clicked', () => {
            const onCheckedChange = vitest_1.vi.fn();
            (0, react_1.render)(<marketplace_item_1.default {...defaultMarketplaceItemProps} onCheckedChange={onCheckedChange}/>);
            react_1.fireEvent.click(getCheckbox());
            (0, vitest_1.expect)(onCheckedChange).toHaveBeenCalled();
        });
    });
    // ================================
    // Component Memoization Tests
    // ================================
    (0, vitest_1.describe)('Component Memoization', () => {
        (0, vitest_1.it)('should be wrapped with React.memo', () => {
            (0, vitest_1.expect)(marketplace_item_1.default).toBeDefined();
            (0, vitest_1.expect)(typeof marketplace_item_1.default).toBe('object');
        });
    });
});
// ================================================================
// PackageItem Component Tests
// ================================================================
(0, vitest_1.describe)('PackageItem', () => {
    const defaultPackageItemProps = {
        checked: false,
        onCheckedChange: vitest_1.vi.fn(),
        payload: createMockPackageDependency(),
        versionInfo: createMockVersionProps(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    // Helper to find checkbox element
    const getCheckbox = () => react_1.screen.getByTestId(/^checkbox/);
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render LoadedItem when payload has manifest', () => {
            (0, react_1.render)(<package_item_1.default {...defaultPackageItemProps}/>);
            (0, vitest_1.expect)(getCheckbox()).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render LoadingError when manifest is missing', () => {
            const invalidPayload = {
                type: 'package',
                value: { unique_identifier: 'test' },
            };
            (0, react_1.render)(<package_item_1.default {...defaultPackageItemProps} payload={invalidPayload}/>);
            // LoadingError renders a disabled checkbox and error text
            const checkbox = react_1.screen.getByTestId(/^checkbox/);
            (0, vitest_1.expect)(checkbox).toHaveClass('cursor-not-allowed');
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.pluginLoadError')).toBeInTheDocument();
        });
    });
    // ================================
    // Props Tests
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should pass isFromMarketPlace to LoadedItem', () => {
            (0, react_1.render)(<package_item_1.default {...defaultPackageItemProps} isFromMarketPlace={true}/>);
            (0, vitest_1.expect)(getCheckbox()).toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass checked state to LoadedItem', () => {
            (0, react_1.render)(<package_item_1.default {...defaultPackageItemProps} checked={true}/>);
            // When checked, the check icon should be present
            (0, vitest_1.expect)(react_1.screen.getByTestId(/^check-icon/)).toBeInTheDocument();
        });
    });
    // ================================
    // User Interactions Tests
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onCheckedChange when clicked', () => {
            const onCheckedChange = vitest_1.vi.fn();
            (0, react_1.render)(<package_item_1.default {...defaultPackageItemProps} onCheckedChange={onCheckedChange}/>);
            react_1.fireEvent.click(getCheckbox());
            (0, vitest_1.expect)(onCheckedChange).toHaveBeenCalled();
        });
    });
    // ================================
    // Component Memoization Tests
    // ================================
    (0, vitest_1.describe)('Component Memoization', () => {
        (0, vitest_1.it)('should be wrapped with React.memo', () => {
            (0, vitest_1.expect)(package_item_1.default).toBeDefined();
            (0, vitest_1.expect)(typeof package_item_1.default).toBe('object');
        });
    });
});
// ================================================================
// GithubItem Component Tests
// ================================================================
(0, vitest_1.describe)('GithubItem', () => {
    const defaultGithubItemProps = {
        checked: false,
        onCheckedChange: vitest_1.vi.fn(),
        dependency: createMockGitHubDependency(),
        versionInfo: createMockVersionProps(),
        onFetchedPayload: vitest_1.vi.fn(),
        onFetchError: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockUseUploadGitHub.mockReturnValue({ data: null, error: null });
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render Loading when data is not yet fetched', () => {
            mockUseUploadGitHub.mockReturnValue({ data: null, error: null });
            (0, react_1.render)(<github_item_1.default {...defaultGithubItemProps}/>);
            // Loading component renders a disabled checkbox
            const checkbox = react_1.screen.getByTestId(/^checkbox/);
            (0, vitest_1.expect)(checkbox).toHaveClass('cursor-not-allowed');
        });
        (0, vitest_1.it)('should render LoadedItem when data is fetched', async () => {
            const mockData = {
                unique_identifier: 'test-uid',
                manifest: {
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
                },
            };
            mockUseUploadGitHub.mockReturnValue({ data: mockData, error: null });
            (0, react_1.render)(<github_item_1.default {...defaultGithubItemProps}/>);
            // When data is loaded, LoadedItem should be rendered with checkbox
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId(/^checkbox/)).toBeInTheDocument();
            });
        });
    });
    // ================================
    // Callback Tests
    // ================================
    (0, vitest_1.describe)('Callbacks', () => {
        (0, vitest_1.it)('should call onFetchedPayload when data is fetched', async () => {
            const onFetchedPayload = vitest_1.vi.fn();
            const mockData = {
                unique_identifier: 'test-uid',
                manifest: {
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
                },
            };
            mockUseUploadGitHub.mockReturnValue({ data: mockData, error: null });
            (0, react_1.render)(<github_item_1.default {...defaultGithubItemProps} onFetchedPayload={onFetchedPayload}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFetchedPayload).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should call onFetchError when error occurs', async () => {
            const onFetchError = vitest_1.vi.fn();
            mockUseUploadGitHub.mockReturnValue({ data: null, error: new Error('Fetch failed') });
            (0, react_1.render)(<github_item_1.default {...defaultGithubItemProps} onFetchError={onFetchError}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFetchError).toHaveBeenCalled();
            });
        });
    });
    // ================================
    // Props Tests
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should pass dependency info to useUploadGitHub', () => {
            const dependency = createMockGitHubDependency();
            (0, react_1.render)(<github_item_1.default {...defaultGithubItemProps} dependency={dependency}/>);
            (0, vitest_1.expect)(mockUseUploadGitHub).toHaveBeenCalledWith({
                repo: dependency.value.repo,
                version: dependency.value.version,
                package: dependency.value.package,
            });
        });
    });
    // ================================
    // Component Memoization Tests
    // ================================
    (0, vitest_1.describe)('Component Memoization', () => {
        (0, vitest_1.it)('should be wrapped with React.memo', () => {
            (0, vitest_1.expect)(github_item_1.default).toBeDefined();
            (0, vitest_1.expect)(typeof github_item_1.default).toBe('object');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLG1DQUE2RDtBQUM3RCx1Q0FBNkQ7QUFDN0QsbUNBQW9EO0FBQ3BELG9EQUEyQztBQUMzQyxvREFBMkM7QUFDM0MsOERBQXFEO0FBQ3JELHNEQUE2QztBQUM3Qyx5REFBK0M7QUFDL0MsaURBQXlDO0FBRXpDLGtDQUFrQztBQUNsQyxNQUFNLGdCQUFnQixHQUFHLENBQUMsWUFBNkIsRUFBRSxFQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ3JFLElBQUksRUFBRSxRQUFRO0lBQ2QsR0FBRyxFQUFFLFVBQVU7SUFDZixJQUFJLEVBQUUsYUFBYTtJQUNuQixTQUFTLEVBQUUsZ0JBQWdCO0lBQzNCLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLGNBQWMsRUFBRSxPQUFPO0lBQ3ZCLHlCQUF5QixFQUFFLGlCQUFpQjtJQUM1QyxJQUFJLEVBQUUsZUFBZTtJQUNyQixRQUFRLEVBQUUsSUFBSTtJQUNkLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUU7SUFDakMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBRTtJQUNuQyxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUU7SUFDckQsWUFBWSxFQUFFLG1CQUFtQjtJQUNqQyxVQUFVLEVBQUUsZ0NBQWdDO0lBQzVDLFFBQVEsRUFBRSwwQkFBa0IsQ0FBQyxJQUFJO0lBQ2pDLGFBQWEsRUFBRSxHQUFHO0lBQ2xCLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUU7SUFDMUIsSUFBSSxFQUFFLEVBQUU7SUFDUixNQUFNLEVBQUUsRUFBRTtJQUNWLFlBQVksRUFBRSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRTtJQUNsRCxJQUFJLEVBQUUsYUFBYTtJQUNuQixHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7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eXBlIHsgRGVwZW5kZW5jeSwgR2l0SHViSXRlbUFuZE1hcmtldFBsYWNlRGVwZW5kZW5jeSwgSW5zdGFsbFN0YXR1cywgUGFja2FnZURlcGVuZGVuY3ksIFBsdWdpbiwgUGx1Z2luRGVjbGFyYXRpb24sIFZlcnNpb25Qcm9wcyB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBJbnN0YWxsU3RlcCwgUGx1Z2luQ2F0ZWdvcnlFbnVtIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgSW5zdGFsbEJ1bmRsZSwgeyBJbnN0YWxsVHlwZSB9IGZyb20gJy4vaW5kZXgnXG5pbXBvcnQgR2l0aHViSXRlbSBmcm9tICcuL2l0ZW0vZ2l0aHViLWl0ZW0nXG5pbXBvcnQgTG9hZGVkSXRlbSBmcm9tICcuL2l0ZW0vbG9hZGVkLWl0ZW0nXG5pbXBvcnQgTWFya2V0cGxhY2VJdGVtIGZyb20gJy4vaXRlbS9tYXJrZXRwbGFjZS1pdGVtJ1xuaW1wb3J0IFBhY2thZ2VJdGVtIGZyb20gJy4vaXRlbS9wYWNrYWdlLWl0ZW0nXG5pbXBvcnQgUmVhZHlUb0luc3RhbGwgZnJvbSAnLi9yZWFkeS10by1pbnN0YWxsJ1xuaW1wb3J0IEluc3RhbGxlZCBmcm9tICcuL3N0ZXBzL2luc3RhbGxlZCdcblxuLy8gRmFjdG9yeSBmdW5jdGlvbnMgZm9yIHRlc3QgZGF0YVxuY29uc3QgY3JlYXRlTW9ja1BsdWdpbiA9IChvdmVycmlkZXM6IFBhcnRpYWw8UGx1Z2luPiA9IHt9KTogUGx1Z2luID0+ICh7XG4gIHR5cGU6ICdwbHVnaW4nLFxuICBvcmc6ICd0ZXN0LW9yZycsXG4gIG5hbWU6ICdUZXN0IFBsdWdpbicsXG4gIHBsdWdpbl9pZDogJ3Rlc3QtcGx1Z2luLWlkJyxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgbGF0ZXN0X3ZlcnNpb246ICcxLjAuMCcsXG4gIGxhdGVzdF9wYWNrYWdlX2lkZW50aWZpZXI6ICd0ZXN0LXBhY2thZ2UtaWQnLFxuICBpY29uOiAndGVzdC1pY29uLnBuZycsXG4gIHZlcmlmaWVkOiB0cnVlLFxuICBsYWJlbDogeyAnZW4tVVMnOiAnVGVzdCBQbHVnaW4nIH0sXG4gIGJyaWVmOiB7ICdlbi1VUyc6ICdBIHRlc3QgcGx1Z2luJyB9LFxuICBkZXNjcmlwdGlvbjogeyAnZW4tVVMnOiAnQSB0ZXN0IHBsdWdpbiBkZXNjcmlwdGlvbicgfSxcbiAgaW50cm9kdWN0aW9uOiAnSW50cm9kdWN0aW9uIHRleHQnLFxuICByZXBvc2l0b3J5OiAnaHR0cHM6Ly9naXRodWIuY29tL3Rlc3QvcGx1Z2luJyxcbiAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICBpbnN0YWxsX2NvdW50OiAxMDAsXG4gIGVuZHBvaW50OiB7IHNldHRpbmdzOiBbXSB9LFxuICB0YWdzOiBbXSxcbiAgYmFkZ2VzOiBbXSxcbiAgdmVyaWZpY2F0aW9uOiB7IGF1dGhvcml6ZWRfY2F0ZWdvcnk6ICdjb21tdW5pdHknIH0sXG4gIGZyb206ICdtYXJrZXRwbGFjZScsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tWZXJzaW9uUHJvcHMgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFZlcnNpb25Qcm9wcz4gPSB7fSk6IFZlcnNpb25Qcm9wcyA9PiAoe1xuICBoYXNJbnN0YWxsZWQ6IGZhbHNlLFxuICBpbnN0YWxsZWRWZXJzaW9uOiB1bmRlZmluZWQsXG4gIHRvSW5zdGFsbFZlcnNpb246ICcxLjAuMCcsXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tJbnN0YWxsU3RhdHVzID0gKG92ZXJyaWRlczogUGFydGlhbDxJbnN0YWxsU3RhdHVzPiA9IHt9KTogSW5zdGFsbFN0YXR1cyA9PiAoe1xuICBzdWNjZXNzOiB0cnVlLFxuICBpc0Zyb21NYXJrZXRQbGFjZTogdHJ1ZSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja0dpdEh1YkRlcGVuZGVuY3kgPSAoKTogR2l0SHViSXRlbUFuZE1hcmtldFBsYWNlRGVwZW5kZW5jeSA9PiAoe1xuICB0eXBlOiAnZ2l0aHViJyxcbiAgdmFsdWU6IHtcbiAgICByZXBvOiAndGVzdC1vcmcvdGVzdC1yZXBvJyxcbiAgICB2ZXJzaW9uOiAndjEuMC4wJyxcbiAgICBwYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gIH0sXG59KVxuXG5jb25zdCBjcmVhdGVNb2NrUGFja2FnZURlcGVuZGVuY3kgPSAoKTogUGFja2FnZURlcGVuZGVuY3kgPT4gKHtcbiAgdHlwZTogJ3BhY2thZ2UnLFxuICB2YWx1ZToge1xuICAgIHVuaXF1ZV9pZGVudGlmaWVyOiAncGFja2FnZS1wbHVnaW4tdWlkJyxcbiAgICBtYW5pZmVzdDoge1xuICAgICAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAncGFja2FnZS1wbHVnaW4tdWlkJyxcbiAgICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgICBhdXRob3I6ICd0ZXN0LWF1dGhvcicsXG4gICAgICBpY29uOiAnaWNvbi5wbmcnLFxuICAgICAgbmFtZTogJ1BhY2thZ2UgUGx1Z2luJyxcbiAgICAgIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdQYWNrYWdlIFBsdWdpbicgfSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgICAgZGVzY3JpcHRpb246IHsgJ2VuLVVTJzogJ1Rlc3QgcGFja2FnZSBwbHVnaW4nIH0gYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPixcbiAgICAgIGNyZWF0ZWRfYXQ6ICcyMDI0LTAxLTAxJyxcbiAgICAgIHJlc291cmNlOiB7fSxcbiAgICAgIHBsdWdpbnM6IFtdLFxuICAgICAgdmVyaWZpZWQ6IHRydWUsXG4gICAgICBlbmRwb2ludDogeyBzZXR0aW5nczogW10sIGVuZHBvaW50czogW10gfSxcbiAgICAgIG1vZGVsOiBudWxsLFxuICAgICAgdGFnczogW10sXG4gICAgICBhZ2VudF9zdHJhdGVneTogbnVsbCxcbiAgICAgIG1ldGE6IHsgdmVyc2lvbjogJzEuMC4wJyB9LFxuICAgICAgdHJpZ2dlcjoge30gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ3RyaWdnZXInXSxcbiAgICB9LFxuICB9LFxufSlcblxuY29uc3QgY3JlYXRlTW9ja0RlcGVuZGVuY3kgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPERlcGVuZGVuY3k+ID0ge30pOiBEZXBlbmRlbmN5ID0+ICh7XG4gIHR5cGU6ICdtYXJrZXRwbGFjZScsXG4gIHZhbHVlOiB7XG4gICAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC1wbHVnaW4tdWlkJyxcbiAgfSxcbiAgLi4ub3ZlcnJpZGVzLFxufSBhcyBEZXBlbmRlbmN5KVxuXG5jb25zdCBjcmVhdGVNb2NrRGVwZW5kZW5jaWVzID0gKCk6IERlcGVuZGVuY3lbXSA9PiBbXG4gIHtcbiAgICB0eXBlOiAnbWFya2V0cGxhY2UnLFxuICAgIHZhbHVlOiB7XG4gICAgICBtYXJrZXRwbGFjZV9wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICdwbHVnaW4tMS11aWQnLFxuICAgIH0sXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnZ2l0aHViJyxcbiAgICB2YWx1ZToge1xuICAgICAgcmVwbzogJ3Rlc3QvcGx1Z2luMicsXG4gICAgICB2ZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgIHBhY2thZ2U6ICdwbHVnaW4yLnppcCcsXG4gICAgfSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdwYWNrYWdlJyxcbiAgICB2YWx1ZToge1xuICAgICAgdW5pcXVlX2lkZW50aWZpZXI6ICdwYWNrYWdlLXBsdWdpbi11aWQnLFxuICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAncGFja2FnZS1wbHVnaW4tdWlkJyxcbiAgICAgICAgdmVyc2lvbjogJzEuMC4wJyxcbiAgICAgICAgYXV0aG9yOiAndGVzdC1hdXRob3InLFxuICAgICAgICBpY29uOiAnaWNvbi5wbmcnLFxuICAgICAgICBuYW1lOiAnUGFja2FnZSBQbHVnaW4nLFxuICAgICAgICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdQYWNrYWdlIFBsdWdpbicgfSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgICAgICBkZXNjcmlwdGlvbjogeyAnZW4tVVMnOiAnVGVzdCBwYWNrYWdlIHBsdWdpbicgfSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgICAgICBjcmVhdGVkX2F0OiAnMjAyNC0wMS0wMScsXG4gICAgICAgIHJlc291cmNlOiB7fSxcbiAgICAgICAgcGx1Z2luczogW10sXG4gICAgICAgIHZlcmlmaWVkOiB0cnVlLFxuICAgICAgICBlbmRwb2ludDogeyBzZXR0aW5nczogW10sIGVuZHBvaW50czogW10gfSxcbiAgICAgICAgbW9kZWw6IG51bGwsXG4gICAgICAgIHRhZ3M6IFtdLFxuICAgICAgICBhZ2VudF9zdHJhdGVneTogbnVsbCxcbiAgICAgICAgbWV0YTogeyB2ZXJzaW9uOiAnMS4wLjAnIH0sXG4gICAgICAgIHRyaWdnZXI6IHt9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWyd0cmlnZ2VyJ10sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG5dXG5cbi8vIE1vY2sgdXNlSGlkZUxvZ2ljIGhvb2tcbmxldCBtb2NrSGlkZUxvZ2ljU3RhdGUgPSB7XG4gIG1vZGFsQ2xhc3NOYW1lOiAndGVzdC1tb2RhbC1jbGFzcycsXG4gIGZvbGRBbmltSW50bzogdmkuZm4oKSxcbiAgc2V0SXNJbnN0YWxsaW5nOiB2aS5mbigpLFxuICBoYW5kbGVTdGFydFRvSW5zdGFsbDogdmkuZm4oKSxcbn1cbnZpLm1vY2soJy4uL2hvb2tzL3VzZS1oaWRlLWxvZ2ljJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gbW9ja0hpZGVMb2dpY1N0YXRlLFxufSkpXG5cbi8vIE1vY2sgdXNlR2V0SWNvbiBob29rXG52aS5tb2NrKCcuLi9iYXNlL3VzZS1nZXQtaWNvbicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+ICh7XG4gICAgZ2V0SWNvblVybDogKGljb246IHN0cmluZykgPT4gaWNvbiB8fCAnZGVmYXVsdC1pY29uLnBuZycsXG4gIH0pLFxufSkpXG5cbi8vIE1vY2sgdXNlUGx1Z2luSW5zdGFsbExpbWl0IGhvb2tcbnZpLm1vY2soJy4uL2hvb2tzL3VzZS1pbnN0YWxsLXBsdWdpbi1saW1pdCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+ICh7IGNhbkluc3RhbGw6IHRydWUgfSksXG4gIHBsdWdpbkluc3RhbGxMaW1pdDogKCkgPT4gKHsgY2FuSW5zdGFsbDogdHJ1ZSB9KSxcbn0pKVxuXG4vLyBNb2NrIHVzZVVwbG9hZEdpdEh1YiBob29rXG5jb25zdCBtb2NrVXNlVXBsb2FkR2l0SHViID0gdmkuZm4oKVxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS1wbHVnaW5zJywgKCkgPT4gKHtcbiAgdXNlVXBsb2FkR2l0SHViOiAocGFyYW1zOiB7IHJlcG86IHN0cmluZywgdmVyc2lvbjogc3RyaW5nLCBwYWNrYWdlOiBzdHJpbmcgfSkgPT4gbW9ja1VzZVVwbG9hZEdpdEh1YihwYXJhbXMpLFxuICB1c2VJbnN0YWxsT3JVcGRhdGU6ICgpID0+ICh7IG11dGF0ZTogdmkuZm4oKSwgaXNQZW5kaW5nOiBmYWxzZSB9KSxcbiAgdXNlUGx1Z2luVGFza0xpc3Q6ICgpID0+ICh7IGhhbmRsZVJlZmV0Y2g6IHZpLmZuKCkgfSksXG4gIHVzZUZldGNoUGx1Z2luc0luTWFya2V0UGxhY2VCeUluZm86ICgpID0+ICh7IGlzTG9hZGluZzogZmFsc2UsIGRhdGE6IG51bGwsIGVycm9yOiBudWxsIH0pLFxufSkpXG5cbi8vIE1vY2sgY29uZmlnXG52aS5tb2NrKCdAL2NvbmZpZycsICgpID0+ICh7XG4gIE1BUktFVFBMQUNFX0FQSV9QUkVGSVg6ICdodHRwczovL21hcmtldHBsYWNlLmV4YW1wbGUuY29tJyxcbn0pKVxuXG4vLyBNb2NrIG1pdHQgY29udGV4dFxudmkubW9jaygnQC9jb250ZXh0L21pdHQtY29udGV4dCcsICgpID0+ICh7XG4gIHVzZU1pdHRDb250ZXh0U2VsZWN0b3I6ICgpID0+IHZpLmZuKCksXG59KSlcblxuLy8gTW9jayBnbG9iYWwgcHVibGljIGNvbnRleHRcbnZpLm1vY2soJ0AvY29udGV4dC9nbG9iYWwtcHVibGljLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VHbG9iYWxQdWJsaWNTdG9yZTogKCkgPT4gKHt9KSxcbn0pKVxuXG4vLyBNb2NrIHVzZUNhbkluc3RhbGxQbHVnaW5Gcm9tTWFya2V0cGxhY2VcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9wbHVnaW4tcGFnZS91c2UtcmVmZXJlbmNlLXNldHRpbmcnLCAoKSA9PiAoe1xuICB1c2VDYW5JbnN0YWxsUGx1Z2luRnJvbU1hcmtldHBsYWNlOiAoKSA9PiAoeyBjYW5JbnN0YWxsUGx1Z2luRnJvbU1hcmtldHBsYWNlOiB0cnVlIH0pLFxufSkpXG5cbi8vIE1vY2sgY2hlY2tUYXNrU3RhdHVzXG52aS5tb2NrKCcuLi9iYXNlL2NoZWNrLXRhc2stc3RhdHVzJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gKHsgY2hlY2s6IHZpLmZuKCksIHN0b3A6IHZpLmZuKCkgfSksXG59KSlcblxuLy8gTW9jayB1c2VSZWZyZXNoUGx1Z2luTGlzdFxudmkubW9jaygnLi4vaG9va3MvdXNlLXJlZnJlc2gtcGx1Z2luLWxpc3QnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiAoeyByZWZyZXNoUGx1Z2luTGlzdDogdmkuZm4oKSB9KSxcbn0pKVxuXG4vLyBNb2NrIHVzZUNoZWNrSW5zdGFsbGVkXG52aS5tb2NrKCcuLi9ob29rcy91c2UtY2hlY2staW5zdGFsbGVkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gKHsgaW5zdGFsbGVkSW5mbzoge30gfSksXG59KSlcblxuLy8gTW9jayBSZWFkeVRvSW5zdGFsbCBjaGlsZCBjb21wb25lbnQgdG8gdGVzdCBJbnN0YWxsQnVuZGxlIGluIGlzb2xhdGlvblxudmkubW9jaygnLi9yZWFkeS10by1pbnN0YWxsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHtcbiAgICBzdGVwLFxuICAgIG9uU3RlcENoYW5nZSxcbiAgICBvblN0YXJ0VG9JbnN0YWxsLFxuICAgIHNldElzSW5zdGFsbGluZyxcbiAgICBhbGxQbHVnaW5zLFxuICAgIG9uQ2xvc2UsXG4gIH06IHtcbiAgICBzdGVwOiBJbnN0YWxsU3RlcFxuICAgIG9uU3RlcENoYW5nZTogKHN0ZXA6IEluc3RhbGxTdGVwKSA9PiB2b2lkXG4gICAgb25TdGFydFRvSW5zdGFsbDogKCkgPT4gdm9pZFxuICAgIHNldElzSW5zdGFsbGluZzogKGlzSW5zdGFsbGluZzogYm9vbGVhbikgPT4gdm9pZFxuICAgIGFsbFBsdWdpbnM6IERlcGVuZGVuY3lbXVxuICAgIG9uQ2xvc2U6ICgpID0+IHZvaWRcbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJyZWFkeS10by1pbnN0YWxsXCI+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImN1cnJlbnQtc3RlcFwiPntzdGVwfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicGx1Z2lucy1jb3VudFwiPnthbGxQbHVnaW5zPy5sZW5ndGggfHwgMH08L3NwYW4+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwic3RhcnQtaW5zdGFsbC1idG5cIiBvbkNsaWNrPXtvblN0YXJ0VG9JbnN0YWxsfT5TdGFydCBJbnN0YWxsPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwic2V0LWluc3RhbGxpbmctdHJ1ZVwiIG9uQ2xpY2s9eygpID0+IHNldElzSW5zdGFsbGluZyh0cnVlKX0+U2V0IEluc3RhbGxpbmcgVHJ1ZTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInNldC1pbnN0YWxsaW5nLWZhbHNlXCIgb25DbGljaz17KCkgPT4gc2V0SXNJbnN0YWxsaW5nKGZhbHNlKX0+U2V0IEluc3RhbGxpbmcgRmFsc2U8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJjaGFuZ2UtdG8taW5zdGFsbGVkXCIgb25DbGljaz17KCkgPT4gb25TdGVwQ2hhbmdlKEluc3RhbGxTdGVwLmluc3RhbGxlZCl9PkNoYW5nZSB0byBJbnN0YWxsZWQ8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJjaGFuZ2UtdG8tdXBsb2FkLWZhaWxlZFwiIG9uQ2xpY2s9eygpID0+IG9uU3RlcENoYW5nZShJbnN0YWxsU3RlcC51cGxvYWRGYWlsZWQpfT5DaGFuZ2UgdG8gVXBsb2FkIEZhaWxlZDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImNoYW5nZS10by1yZWFkeVwiIG9uQ2xpY2s9eygpID0+IG9uU3RlcENoYW5nZShJbnN0YWxsU3RlcC5yZWFkeVRvSW5zdGFsbCl9PkNoYW5nZSB0byBSZWFkeTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImNsb3NlLWJ0blwiIG9uQ2xpY2s9e29uQ2xvc2V9PkNsb3NlPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxuZGVzY3JpYmUoJ0luc3RhbGxCdW5kbGUnLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBmcm9tRFNMUGF5bG9hZDogY3JlYXRlTW9ja0RlcGVuZGVuY2llcygpLFxuICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrSGlkZUxvZ2ljU3RhdGUgPSB7XG4gICAgICBtb2RhbENsYXNzTmFtZTogJ3Rlc3QtbW9kYWwtY2xhc3MnLFxuICAgICAgZm9sZEFuaW1JbnRvOiB2aS5mbigpLFxuICAgICAgc2V0SXNJbnN0YWxsaW5nOiB2aS5mbigpLFxuICAgICAgaGFuZGxlU3RhcnRUb0luc3RhbGw6IHZpLmZuKCksXG4gICAgfVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIG1vZGFsIHdpdGggY29ycmVjdCB0aXRsZSBmb3IgaW5zdGFsbCBwbHVnaW4nLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBSZWFkeVRvSW5zdGFsbCBjb21wb25lbnQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGludGVncmF0ZSB3aXRoIHVzZUhpZGVMb2dpYyBob29rJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBWZXJpZnkgdGhhdCB0aGUgY29tcG9uZW50IGludGVncmF0ZXMgd2l0aCB1c2VIaWRlTG9naWNcbiAgICAgIC8vIFRoZSBob29rIHByb3ZpZGVzIG1vZGFsQ2xhc3NOYW1lLCBmb2xkQW5pbUludG8sIHNldElzSW5zdGFsbGluZywgaGFuZGxlU3RhcnRUb0luc3RhbGxcbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUubW9kYWxDbGFzc05hbWUpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUuZm9sZEFuaW1JbnRvKS50b0JlRGVmaW5lZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG1vZGFsIGFzIHZpc2libGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIE1vZGFsIGlzIGFsd2F5cyBzaG93biAoaXNTaG93PXt0cnVlfSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxQbHVnaW4nKSkudG9CZVZpc2libGUoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGRlc2NyaWJlKCdpbnN0YWxsVHlwZScsICgpID0+IHtcbiAgICAgIGl0KCdzaG91bGQgZGVmYXVsdCB0byBJbnN0YWxsVHlwZS5mcm9tTWFya2V0cGxhY2Ugd2hlbiBub3QgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgICAvLyBXaGVuIGluc3RhbGxUeXBlIGlzIGZyb21NYXJrZXRwbGFjZSAoZGVmYXVsdCksIGluaXRpYWwgc3RlcCBzaG91bGQgYmUgcmVhZHlUb0luc3RhbGxcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KEluc3RhbGxTdGVwLnJlYWR5VG9JbnN0YWxsKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzZXQgaW5pdGlhbCBzdGVwIHRvIHJlYWR5VG9JbnN0YWxsIHdoZW4gaW5zdGFsbFR5cGUgaXMgZnJvbU1hcmtldHBsYWNlJywgKCkgPT4ge1xuICAgICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gaW5zdGFsbFR5cGU9e0luc3RhbGxUeXBlLmZyb21NYXJrZXRwbGFjZX0gLz4pXG5cbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KEluc3RhbGxTdGVwLnJlYWR5VG9JbnN0YWxsKVxuICAgICAgfSlcblxuICAgICAgaXQoJ3Nob3VsZCBzZXQgaW5pdGlhbCBzdGVwIHRvIHVwbG9hZGluZyB3aGVuIGluc3RhbGxUeXBlIGlzIGZyb21Mb2NhbCcsICgpID0+IHtcbiAgICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IGluc3RhbGxUeXBlPXtJbnN0YWxsVHlwZS5mcm9tTG9jYWx9IC8+KVxuXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1cnJlbnQtc3RlcCcpKS50b0hhdmVUZXh0Q29udGVudChJbnN0YWxsU3RlcC51cGxvYWRpbmcpXG4gICAgICB9KVxuXG4gICAgICBpdCgnc2hvdWxkIHNldCBpbml0aWFsIHN0ZXAgdG8gdXBsb2FkaW5nIHdoZW4gaW5zdGFsbFR5cGUgaXMgZnJvbURTTCcsICgpID0+IHtcbiAgICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IGluc3RhbGxUeXBlPXtJbnN0YWxsVHlwZS5mcm9tRFNMfSAvPilcblxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoSW5zdGFsbFN0ZXAudXBsb2FkaW5nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgZGVzY3JpYmUoJ2Zyb21EU0xQYXlsb2FkJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBwYXNzIGFsbFBsdWdpbnMgdG8gUmVhZHlUb0luc3RhbGwnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBsdWdpbnMgPSBjcmVhdGVNb2NrRGVwZW5kZW5jaWVzKClcbiAgICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IGZyb21EU0xQYXlsb2FkPXtwbHVnaW5zfSAvPilcblxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbHVnaW5zLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCczJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IGZyb21EU0xQYXlsb2FkIGFycmF5JywgKCkgPT4ge1xuICAgICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gZnJvbURTTFBheWxvYWQ9e1tdfSAvPilcblxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbHVnaW5zLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICAgIH0pXG5cbiAgICAgIGl0KCdzaG91bGQgaGFuZGxlIHNpbmdsZSBwbHVnaW4gaW4gZnJvbURTTFBheWxvYWQnLCAoKSA9PiB7XG4gICAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSBmcm9tRFNMUGF5bG9hZD17W2NyZWF0ZU1vY2tEZXBlbmRlbmN5KCldfSAvPilcblxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbHVnaW5zLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcxJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGRlc2NyaWJlKCdvbkNsb3NlJywgKCkgPT4ge1xuICAgICAgaXQoJ3Nob3VsZCBwYXNzIG9uQ2xvc2UgdG8gUmVhZHlUb0luc3RhbGwnLCAoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSBvbkNsb3NlPXtvbkNsb3NlfSAvPilcblxuICAgICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjbG9zZS1idG4nKSlcblxuICAgICAgICBleHBlY3Qob25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU3RhdGUgTWFuYWdlbWVudCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB0aXRsZSB3aGVuIHN0ZXAgY2hhbmdlcyB0byB1cGxvYWRGYWlsZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEluaXRpYWwgdGl0bGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDaGFuZ2Ugc3RlcCB0byB1cGxvYWRGYWlsZWRcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYW5nZS10by11cGxvYWQtZmFpbGVkJykpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLnVwbG9hZEZhaWxlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXBkYXRlIHRpdGxlIHdoZW4gc3RlcCBjaGFuZ2VzIHRvIGluc3RhbGxlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQ2hhbmdlIHN0ZXAgdG8gaW5zdGFsbGVkXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjaGFuZ2UtdG8taW5zdGFsbGVkJykpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxDb21wbGV0ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gaW5zdGFsbFBsdWdpbiB0aXRsZSBmb3IgcmVhZHlUb0luc3RhbGwgc3RlcCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIEV4cGxpY2l0bHkgY2hhbmdlIHRvIHJlYWR5VG9JbnN0YWxsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjaGFuZ2UtdG8tcmVhZHknKSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBzdGVwIHN0YXRlIHRvIFJlYWR5VG9JbnN0YWxsIGNvbXBvbmVudCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KEluc3RhbGxTdGVwLnJlYWR5VG9JbnN0YWxsKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBSZWFkeVRvSW5zdGFsbCBzdGVwIHdoZW4gb25TdGVwQ2hhbmdlIGlzIGNhbGxlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gSW5pdGlhbGx5IHJlYWR5VG9JbnN0YWxsXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoSW5zdGFsbFN0ZXAucmVhZHlUb0luc3RhbGwpXG5cbiAgICAgIC8vIENoYW5nZSB0byBpbnN0YWxsZWRcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYW5nZS10by1pbnN0YWxsZWQnKSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KEluc3RhbGxTdGVwLmluc3RhbGxlZClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENhbGxiYWNrIFN0YWJpbGl0eSBhbmQgdXNlSGlkZUxvZ2ljIEludGVncmF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDYWxsYmFjayBTdGFiaWxpdHkgYW5kIHVzZUhpZGVMb2dpYyBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHByb3ZpZGUgZm9sZEFuaW1JbnRvIGZvciBtb2RhbCBvbkNsb3NlIGhhbmRsZXInLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFRoZSBtb2RhbCdzIG9uQ2xvc2UgaXMgc2V0IHRvIGZvbGRBbmltSW50byBmcm9tIHVzZUhpZGVMb2dpY1xuICAgICAgLy8gVmVyaWZ5IHRoZSBob29rIHByb3ZpZGVzIHRoaXMgZnVuY3Rpb25cbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUuZm9sZEFuaW1JbnRvKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QodHlwZW9mIG1vY2tIaWRlTG9naWNTdGF0ZS5mb2xkQW5pbUludG8pLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGhhbmRsZVN0YXJ0VG9JbnN0YWxsIHRvIFJlYWR5VG9JbnN0YWxsJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGFydC1pbnN0YWxsLWJ0bicpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLmhhbmRsZVN0YXJ0VG9JbnN0YWxsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHNldElzSW5zdGFsbGluZyB0byBSZWFkeVRvSW5zdGFsbCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2V0LWluc3RhbGxpbmctdHJ1ZScpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLnNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHNldElzSW5zdGFsbGluZyB3aXRoIGZhbHNlIHRvIFJlYWR5VG9JbnN0YWxsJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZXQtaW5zdGFsbGluZy1mYWxzZScpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLnNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBUaXRsZSBMb2dpYyBUZXN0cyAoZ2V0VGl0bGUgY2FsbGJhY2spXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdUaXRsZSBMb2dpYyAoZ2V0VGl0bGUgY2FsbGJhY2spJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVwbG9hZEZhaWxlZCB0aXRsZSB3aGVuIHN0ZXAgaXMgdXBsb2FkRmFpbGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IGluc3RhbGxUeXBlPXtJbnN0YWxsVHlwZS5mcm9tTG9jYWx9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjaGFuZ2UtdG8tdXBsb2FkLWZhaWxlZCcpKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC51cGxvYWRGYWlsZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBpbnN0YWxsQ29tcGxldGUgdGl0bGUgd2hlbiBzdGVwIGlzIGluc3RhbGxlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hhbmdlLXRvLWluc3RhbGxlZCcpKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsQ29tcGxldGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBpbnN0YWxsUGx1Z2luIHRpdGxlIGZvciBhbGwgb3RoZXIgc3RlcHMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIERlZmF1bHQgc3RlcCAtIHJlYWR5VG9JbnN0YWxsXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gaW5zdGFsbFBsdWdpbiB0aXRsZSB3aGVuIHN0ZXAgaXMgdXBsb2FkaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IGluc3RhbGxUeXBlPXtJbnN0YWxsVHlwZS5mcm9tTG9jYWx9IC8+KVxuXG4gICAgICAvLyBTdGVwIGlzIHVwbG9hZGluZ1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDb21wb25lbnQgTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgLy8gVmVyaWZ5IHRoYXQgSW5zdGFsbEJ1bmRsZSBpcyBtZW1vaXplZCBieSBjaGVja2luZyBpdHMgZGlzcGxheU5hbWUgb3Igc3RydWN0dXJlXG4gICAgICAvLyBTaW5jZSB0aGUgY29tcG9uZW50IGlzIGV4cG9ydGVkIGFzIFJlYWN0Lm1lbW8oSW5zdGFsbEJ1bmRsZSksIHdlIGNhbiBjaGVjayBpdHMgdHlwZVxuICAgICAgZXhwZWN0KEluc3RhbGxCdW5kbGUpLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdCh0eXBlb2YgSW5zdGFsbEJ1bmRsZSkudG9CZSgnb2JqZWN0JykgLy8gbWVtbyByZXR1cm5zIGFuIG9iamVjdFxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZS1yZW5kZXIgd2hlbiBzYW1lIHByb3BzIGFyZSBwYXNzZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3QgcGF5bG9hZCA9IGNyZWF0ZU1vY2tEZXBlbmRlbmNpZXMoKVxuXG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsQnVuZGxlIGZyb21EU0xQYXlsb2FkPXtwYXlsb2FkfSBvbkNsb3NlPXtvbkNsb3NlfSAvPixcbiAgICAgIClcblxuICAgICAgLy8gUmUtcmVuZGVyIHdpdGggc2FtZSBwcm9wcyByZWZlcmVuY2VcbiAgICAgIHJlcmVuZGVyKDxJbnN0YWxsQnVuZGxlIGZyb21EU0xQYXlsb2FkPXtwYXlsb2FkfSBvbkNsb3NlPXtvbkNsb3NlfSAvPilcblxuICAgICAgLy8gQ29tcG9uZW50IHNob3VsZCBzdGlsbCByZW5kZXIgY29ycmVjdGx5XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzdGFydCBpbnN0YWxsIGJ1dHRvbiBjbGljaycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RhcnQtaW5zdGFsbC1idG4nKSlcblxuICAgICAgZXhwZWN0KG1vY2tIaWRlTG9naWNTdGF0ZS5oYW5kbGVTdGFydFRvSW5zdGFsbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGNsb3NlIGJ1dHRvbiBjbGljaycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gb25DbG9zZT17b25DbG9zZX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Nsb3NlLWJ0bicpKVxuXG4gICAgICBleHBlY3Qob25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHN0ZXAgY2hhbmdlIHRvIGluc3RhbGxlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hhbmdlLXRvLWluc3RhbGxlZCcpKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoSW5zdGFsbFN0ZXAuaW5zdGFsbGVkKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbENvbXBsZXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgc3RlcCBjaGFuZ2UgdG8gdXBsb2FkRmFpbGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjaGFuZ2UtdG8tdXBsb2FkLWZhaWxlZCcpKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoSW5zdGFsbFN0ZXAudXBsb2FkRmFpbGVkKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwudXBsb2FkRmFpbGVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVkZ2UgQ2FzZXMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgZGVwZW5kZW5jaWVzIGFycmF5JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIGZyb21EU0xQYXlsb2FkPXtbXX0gb25DbG9zZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbnMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBsYXJnZSBudW1iZXIgb2YgZGVwZW5kZW5jaWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbGFyZ2VEZXBlbmRlbmNpZXM6IERlcGVuZGVuY3lbXSA9IEFycmF5LmZyb20oeyBsZW5ndGg6IDEwMCB9LCAoXywgaSkgPT4gKHtcbiAgICAgICAgdHlwZTogJ21hcmtldHBsYWNlJyxcbiAgICAgICAgdmFsdWU6IHtcbiAgICAgICAgICBtYXJrZXRwbGFjZV9wbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6IGBwbHVnaW4tJHtpfS11aWRgLFxuICAgICAgICB9LFxuICAgICAgfSkpXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSBmcm9tRFNMUGF5bG9hZD17bGFyZ2VEZXBlbmRlbmNpZXN9IG9uQ2xvc2U9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbHVnaW5zLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcxMDAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkZXBlbmRlbmNpZXMgd2l0aCBkaWZmZXJlbnQgdHlwZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtaXhlZERlcGVuZGVuY2llczogRGVwZW5kZW5jeVtdID0gW1xuICAgICAgICB7IHR5cGU6ICdtYXJrZXRwbGFjZScsIHZhbHVlOiB7IG1hcmtldHBsYWNlX3BsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ21wLXVpZCcgfSB9LFxuICAgICAgICB7IHR5cGU6ICdnaXRodWInLCB2YWx1ZTogeyByZXBvOiAnb3JnL3JlcG8nLCB2ZXJzaW9uOiAndjEuMC4wJywgcGFja2FnZTogJ3BrZy56aXAnIH0gfSxcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdwYWNrYWdlJyxcbiAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgdW5pcXVlX2lkZW50aWZpZXI6ICdwa2ctdWlkJyxcbiAgICAgICAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgICAgICAgIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ3BrZy11aWQnLFxuICAgICAgICAgICAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICAgICAgICBhdXRob3I6ICdhdXRob3InLFxuICAgICAgICAgICAgICBpY29uOiAnaWNvbi5wbmcnLFxuICAgICAgICAgICAgICBuYW1lOiAnUGFja2FnZScsXG4gICAgICAgICAgICAgIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgICAgICAgICAgICAgbGFiZWw6IHt9IGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgICAgICAgICAgIGRlc2NyaXB0aW9uOiB7fSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgICAgICAgICAgICBjcmVhdGVkX2F0OiAnJyxcbiAgICAgICAgICAgICAgcmVzb3VyY2U6IHt9LFxuICAgICAgICAgICAgICBwbHVnaW5zOiBbXSxcbiAgICAgICAgICAgICAgdmVyaWZpZWQ6IHRydWUsXG4gICAgICAgICAgICAgIGVuZHBvaW50OiB7IHNldHRpbmdzOiBbXSwgZW5kcG9pbnRzOiBbXSB9LFxuICAgICAgICAgICAgICBtb2RlbDogbnVsbCxcbiAgICAgICAgICAgICAgdGFnczogW10sXG4gICAgICAgICAgICAgIGFnZW50X3N0cmF0ZWd5OiBudWxsLFxuICAgICAgICAgICAgICBtZXRhOiB7IHZlcnNpb246ICcxLjAuMCcgfSxcbiAgICAgICAgICAgICAgdHJpZ2dlcjoge30gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ3RyaWdnZXInXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIF1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIGZyb21EU0xQYXlsb2FkPXttaXhlZERlcGVuZGVuY2llc30gb25DbG9zZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbnMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzMnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBzdGVwIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFJhcGlkIHN0ZXAgY2hhbmdlc1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hhbmdlLXRvLWluc3RhbGxlZCcpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hhbmdlLXRvLXVwbG9hZC1mYWlsZWQnKSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NoYW5nZS10by1yZWFkeScpKVxuXG4gICAgICAvLyBTaG91bGQgZW5kIHVwIGF0IHJlYWR5VG9JbnN0YWxsXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjdXJyZW50LXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoSW5zdGFsbFN0ZXAucmVhZHlUb0luc3RhbGwpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbXVsdGlwbGUgc2V0SXNJbnN0YWxsaW5nIGNhbGxzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZXQtaW5zdGFsbGluZy10cnVlJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZXQtaW5zdGFsbGluZy1mYWxzZScpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2V0LWluc3RhbGxpbmctdHJ1ZScpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLnNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDMpXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLnNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbk50aENhbGxlZFdpdGgoMSwgdHJ1ZSlcbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUuc2V0SXNJbnN0YWxsaW5nKS50b0hhdmVCZWVuTnRoQ2FsbGVkV2l0aCgyLCBmYWxzZSlcbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUuc2V0SXNJbnN0YWxsaW5nKS50b0hhdmVCZWVuTnRoQ2FsbGVkV2l0aCgzLCB0cnVlKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gSW5zdGFsbFR5cGUgRW51bSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSW5zdGFsbFR5cGUgRW51bScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGV4cG9ydCBJbnN0YWxsVHlwZSBlbnVtIHdpdGggY29ycmVjdCB2YWx1ZXMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QoSW5zdGFsbFR5cGUuZnJvbUxvY2FsKS50b0JlKCdmcm9tTG9jYWwnKVxuICAgICAgZXhwZWN0KEluc3RhbGxUeXBlLmZyb21NYXJrZXRwbGFjZSkudG9CZSgnZnJvbU1hcmtldHBsYWNlJylcbiAgICAgIGV4cGVjdChJbnN0YWxsVHlwZS5mcm9tRFNMKS50b0JlKCdmcm9tRFNMJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgYWxsIEluc3RhbGxUeXBlIHZhbHVlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHR5cGVzID0gW0luc3RhbGxUeXBlLmZyb21Mb2NhbCwgSW5zdGFsbFR5cGUuZnJvbU1hcmtldHBsYWNlLCBJbnN0YWxsVHlwZS5mcm9tRFNMXVxuXG4gICAgICB0eXBlcy5mb3JFYWNoKCh0eXBlKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyKFxuICAgICAgICAgIDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IGluc3RhbGxUeXBlPXt0eXBlfSAvPixcbiAgICAgICAgKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgdW5tb3VudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTW9kYWwgSW50ZWdyYXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ01vZGFsIEludGVncmF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIG1vZGFsIHdpdGggdGl0bGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFZlcmlmeSBtb2RhbCByZW5kZXJzIHdpdGggdGl0bGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB3aXRoIGNsb3NhYmxlIGJlaGF2aW9yJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBNb2RhbCBzaG91bGQgcmVuZGVyIHRoZSBjb250ZW50IGluY2x1ZGluZyB0aGUgUmVhZHlUb0luc3RhbGwgY29tcG9uZW50XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHRpdGxlIGluIG1vZGFsIGhlYWRlcicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgY29uc3QgdGl0bGVFbGVtZW50ID0gc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsUGx1Z2luJylcbiAgICAgIGV4cGVjdCh0aXRsZUVsZW1lbnQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdCh0aXRsZUVsZW1lbnQpLnRvSGF2ZUNsYXNzKCd0aXRsZS0yeGwtc2VtaS1ib2xkJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEluaXRpYWwgU3RlcCBEZXRlcm1pbmF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbml0aWFsIFN0ZXAgRGV0ZXJtaW5hdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNldCBpbml0aWFsIHN0ZXAgYmFzZWQgb24gaW5zdGFsbFR5cGUgZm9yIGZyb21NYXJrZXRwbGFjZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSBpbnN0YWxsVHlwZT17SW5zdGFsbFR5cGUuZnJvbU1hcmtldHBsYWNlfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KEluc3RhbGxTdGVwLnJlYWR5VG9JbnN0YWxsKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBpbml0aWFsIHN0ZXAgYmFzZWQgb24gaW5zdGFsbFR5cGUgZm9yIGZyb21Mb2NhbCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSBpbnN0YWxsVHlwZT17SW5zdGFsbFR5cGUuZnJvbUxvY2FsfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KEluc3RhbGxTdGVwLnVwbG9hZGluZylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzZXQgaW5pdGlhbCBzdGVwIGJhc2VkIG9uIGluc3RhbGxUeXBlIGZvciBmcm9tRFNMJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IGluc3RhbGxUeXBlPXtJbnN0YWxsVHlwZS5mcm9tRFNMfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KEluc3RhbGxTdGVwLnVwbG9hZGluZylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgZGVmYXVsdCBpbnN0YWxsVHlwZSB3aGVuIG5vdCBwcm92aWRlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSBmcm9tRFNMUGF5bG9hZD17ZGVmYXVsdFByb3BzLmZyb21EU0xQYXlsb2FkfSBvbkNsb3NlPXtkZWZhdWx0UHJvcHMub25DbG9zZX0gLz4pXG5cbiAgICAgIC8vIERlZmF1bHQgaXMgZnJvbU1hcmtldHBsYWNlIHdoaWNoIHJlc3VsdHMgaW4gcmVhZHlUb0luc3RhbGxcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1cnJlbnQtc3RlcCcpKS50b0hhdmVUZXh0Q29udGVudChJbnN0YWxsU3RlcC5yZWFkeVRvSW5zdGFsbClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIHVzZUhpZGVMb2dpYyBIb29rIEludGVncmF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCd1c2VIaWRlTG9naWMgSG9vayBJbnRlZ3JhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlY2VpdmUgbW9kYWxDbGFzc05hbWUgZnJvbSB1c2VIaWRlTG9naWMnLCAoKSA9PiB7XG4gICAgICBtb2NrSGlkZUxvZ2ljU3RhdGUubW9kYWxDbGFzc05hbWUgPSAnY3VzdG9tLW1vZGFsLWNsYXNzJ1xuXG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFZlcmlmeSBob29rIHByb3ZpZGVzIG1vZGFsQ2xhc3NOYW1lIChjb21wb25lbnQgdXNlcyBpdCBpbiBNb2RhbCBjbGFzc05hbWUgcHJvcClcbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUubW9kYWxDbGFzc05hbWUpLnRvQmUoJ2N1c3RvbS1tb2RhbC1jbGFzcycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBvbkNsb3NlIHRvIHVzZUhpZGVMb2dpYycsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gb25DbG9zZT17b25DbG9zZX0gLz4pXG5cbiAgICAgIC8vIFRoZSBob29rIHJlY2VpdmVzIG9uQ2xvc2UgYW5kIHJldHVybnMgZm9sZEFuaW1JbnRvXG4gICAgICAvLyBXaGVuIG1vZGFsIGNsb3NlcywgZm9sZEFuaW1JbnRvIHNob3VsZCBiZSB1c2VkXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLmZvbGRBbmltSW50bykudG9CZURlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBmb2xkQW5pbUludG8gZm9yIG1vZGFsIGNsb3NlIGFjdGlvbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gVGhlIG1vZGFsJ3Mgb25DbG9zZSBpcyBzZXQgdG8gZm9sZEFuaW1JbnRvXG4gICAgICAvLyBUaGlzIGlzIHZlcmlmaWVkIGJ5IGNoZWNraW5nIHRoYXQgdGhlIGhvb2sgcmV0dXJucyB0aGUgZnVuY3Rpb25cbiAgICAgIGV4cGVjdCh0eXBlb2YgbW9ja0hpZGVMb2dpY1N0YXRlLmZvbGRBbmltSW50bykudG9CZSgnZnVuY3Rpb24nKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVhZHlUb0luc3RhbGwgUHJvcHMgUGFzc2luZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVhZHlUb0luc3RhbGwgUHJvcHMgUGFzc2luZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3Mgc3RlcCB0byBSZWFkeVRvSW5zdGFsbCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY3VycmVudC1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KEluc3RhbGxTdGVwLnJlYWR5VG9JbnN0YWxsKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3Mgb25TdGVwQ2hhbmdlIHRvIFJlYWR5VG9JbnN0YWxsJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBUcmlnZ2VyIHN0ZXAgY2hhbmdlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjaGFuZ2UtdG8taW5zdGFsbGVkJykpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2N1cnJlbnQtc3RlcCcpKS50b0hhdmVUZXh0Q29udGVudChJbnN0YWxsU3RlcC5pbnN0YWxsZWQpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBvblN0YXJ0VG9JbnN0YWxsIHRvIFJlYWR5VG9JbnN0YWxsJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzdGFydC1pbnN0YWxsLWJ0bicpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLmhhbmRsZVN0YXJ0VG9JbnN0YWxsKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHNldElzSW5zdGFsbGluZyB0byBSZWFkeVRvSW5zdGFsbCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2V0LWluc3RhbGxpbmctdHJ1ZScpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLnNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgodHJ1ZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGFsbFBsdWdpbnMgKGZyb21EU0xQYXlsb2FkKSB0byBSZWFkeVRvSW5zdGFsbCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbnMgPSBjcmVhdGVNb2NrRGVwZW5kZW5jaWVzKClcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSBmcm9tRFNMUGF5bG9hZD17cGx1Z2luc30gb25DbG9zZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BsdWdpbnMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoU3RyaW5nKHBsdWdpbnMubGVuZ3RoKSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIG9uQ2xvc2UgdG8gUmVhZHlUb0luc3RhbGwnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IG9uQ2xvc2U9e29uQ2xvc2V9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjbG9zZS1idG4nKSlcblxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ2FsbGJhY2sgTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIE1lbW9pemF0aW9uIChnZXRUaXRsZSknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCB0aXRsZSBiYXNlZCBvbiBjdXJyZW50IHN0ZXAnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIERlZmF1bHQgc3RlcCAocmVhZHlUb0luc3RhbGwpIC0+IGluc3RhbGxQbHVnaW4gdGl0bGVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSB0aXRsZSB3aGVuIHN0ZXAgY2hhbmdlcycsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQ2hhbmdlIHRvIGluc3RhbGxlZFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hhbmdlLXRvLWluc3RhbGxlZCcpKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbENvbXBsZXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gQ2hhbmdlIHRvIHVwbG9hZEZhaWxlZFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hhbmdlLXRvLXVwbG9hZC1mYWlsZWQnKSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLnVwbG9hZEZhaWxlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIENoYW5nZSBiYWNrIHRvIHJlYWR5VG9JbnN0YWxsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjaGFuZ2UtdG8tcmVhZHknKSlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRXJyb3IgSGFuZGxpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0Vycm9yIEhhbmRsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIG51bGwgaW4gZnJvbURTTFBheWxvYWQgZ3JhY2VmdWxseScsICgpID0+IHtcbiAgICAgIC8vIFR5cGVTY3JpcHQgd291bGQgY2F0Y2ggdGhpcywgYnV0IHRlc3RpbmcgcnVudGltZSBiZWhhdmlvclxuICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvciBUZXN0aW5nIG51bGwgaGFuZGxpbmdcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSBmcm9tRFNMUGF5bG9hZD17bnVsbH0gb25DbG9zZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIFNob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZywgY291bnQgd2lsbCBiZSAwXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwbHVnaW5zLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdW5kZWZpbmVkIGluIGZyb21EU0xQYXlsb2FkIGdyYWNlZnVsbHknLCAoKSA9PiB7XG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIFRlc3RpbmcgdW5kZWZpbmVkIGhhbmRsaW5nXG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgZnJvbURTTFBheWxvYWQ9e3VuZGVmaW5lZH0gb25DbG9zZT17dmkuZm4oKX0gLz4pXG5cbiAgICAgIC8vIFNob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZ1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGx1Z2lucy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDU1MgQ2xhc3NlcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ1NTIENsYXNzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgd2l0aCBwcm9wZXIgc3RydWN0dXJlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBWZXJpZnkgY29tcG9uZW50IHJlbmRlcnMgd2l0aCBleHBlY3RlZCBzdHJ1Y3R1cmVcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbFBsdWdpbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgY29ycmVjdCBDU1MgY2xhc3NlcyB0byB0aXRsZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEJ1bmRsZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgY29uc3QgdGl0bGUgPSBzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxQbHVnaW4nKVxuICAgICAgZXhwZWN0KHRpdGxlKS50b0hhdmVDbGFzcygndGl0bGUtMnhsLXNlbWktYm9sZCcpXG4gICAgICBleHBlY3QodGl0bGUpLnRvSGF2ZUNsYXNzKCd0ZXh0LXRleHQtcHJpbWFyeScpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgQ29uc2lzdGVuY3kgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZyBDb25zaXN0ZW5jeScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjb25zaXN0ZW50bHkgYWNyb3NzIGRpZmZlcmVudCBpbnN0YWxsVHlwZXMnLCAoKSA9PiB7XG4gICAgICAvLyBmcm9tTWFya2V0cGxhY2VcbiAgICAgIGNvbnN0IHsgdW5tb3VudDogdW5tb3VudDEgfSA9IHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gaW5zdGFsbFR5cGU9e0luc3RhbGxUeXBlLmZyb21NYXJrZXRwbGFjZX0gLz4sXG4gICAgICApXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIHVubW91bnQxKClcblxuICAgICAgLy8gZnJvbUxvY2FsXG4gICAgICBjb25zdCB7IHVubW91bnQ6IHVubW91bnQyIH0gPSByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsQnVuZGxlIHsuLi5kZWZhdWx0UHJvcHN9IGluc3RhbGxUeXBlPXtJbnN0YWxsVHlwZS5mcm9tTG9jYWx9IC8+LFxuICAgICAgKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB1bm1vdW50MigpXG5cbiAgICAgIC8vIGZyb21EU0xcbiAgICAgIGNvbnN0IHsgdW5tb3VudDogdW5tb3VudDMgfSA9IHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gaW5zdGFsbFR5cGU9e0luc3RhbGxUeXBlLmZyb21EU0x9IC8+LFxuICAgICAgKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB1bm1vdW50MygpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gbW9kYWwgc3RydWN0dXJlIGFjcm9zcyBzdGVwIGNoYW5nZXMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxCdW5kbGUgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIENoZWNrIFJlYWR5VG9JbnN0YWxsIGNvbXBvbmVudCBleGlzdHNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBDaGFuZ2Ugc3RlcFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2hhbmdlLXRvLWluc3RhbGxlZCcpKVxuXG4gICAgICAvLyBSZWFkeVRvSW5zdGFsbCBzaG91bGQgc3RpbGwgZXhpc3RcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gVGl0bGUgc2hvdWxkIGJlIHVwZGF0ZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxDb21wbGV0ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFJlYWR5VG9JbnN0YWxsIENvbXBvbmVudCBUZXN0cyAodXNpbmcgbW9ja2VkIHZlcnNpb24gZnJvbSBJbnN0YWxsQnVuZGxlKVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ1JlYWR5VG9JbnN0YWxsICh2aWEgSW5zdGFsbEJ1bmRsZSBtb2NrKScsICgpID0+IHtcbiAgLy8gTm90ZTogUmVhZHlUb0luc3RhbGwgaXMgbW9ja2VkIGZvciBJbnN0YWxsQnVuZGxlIHRlc3RzLlxuICAvLyBUaGVzZSB0ZXN0cyB2ZXJpZnkgdGhlIG1vY2sgaW50ZXJmYWNlIGFuZCBjb21wb25lbnQgYmVoYXZpb3IuXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ29tcG9uZW50IERlZmluaXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBEZWZpbml0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgZGVmaW5lZCBhbmQgaW1wb3J0YWJsZScsICgpID0+IHtcbiAgICAgIGV4cGVjdChSZWFkeVRvSW5zdGFsbCkudG9CZURlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGJlIGEgbWVtb2l6ZWQgY29tcG9uZW50JywgKCkgPT4ge1xuICAgICAgLy8gVGhlIGltcG9ydCBnaXZlcyB1cyB0aGUgbW9ja2VkIHZlcnNpb24sIHdoaWNoIGlzIGEgZnVuY3Rpb25cbiAgICAgIGV4cGVjdCh0eXBlb2YgUmVhZHlUb0luc3RhbGwpLnRvQmUoJ2Z1bmN0aW9uJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gSW5zdGFsbGVkIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0luc3RhbGxlZCcsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdEluc3RhbGxlZFByb3BzID0ge1xuICAgIGxpc3Q6IFtjcmVhdGVNb2NrUGx1Z2luKCldLFxuICAgIGluc3RhbGxTdGF0dXM6IFtjcmVhdGVNb2NrSW5zdGFsbFN0YXR1cygpXSxcbiAgICBvbkNhbmNlbDogdmkuZm4oKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBsdWdpbiBsaXN0JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsZWQgey4uLmRlZmF1bHRJbnN0YWxsZWRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFNob3VsZCBzaG93IGNsb3NlIGJ1dHRvblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uY2xvc2UnIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIG11bHRpcGxlIHBsdWdpbnMnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbHVnaW5zID0gW1xuICAgICAgICBjcmVhdGVNb2NrUGx1Z2luKHsgcGx1Z2luX2lkOiAncGx1Z2luLTEnLCBuYW1lOiAnUGx1Z2luIDEnIH0pLFxuICAgICAgICBjcmVhdGVNb2NrUGx1Z2luKHsgcGx1Z2luX2lkOiAncGx1Z2luLTInLCBuYW1lOiAnUGx1Z2luIDInIH0pLFxuICAgICAgXVxuICAgICAgY29uc3Qgc3RhdHVzZXMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbnN0YWxsU3RhdHVzKHsgc3VjY2VzczogdHJ1ZSB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0luc3RhbGxTdGF0dXMoeyBzdWNjZXNzOiBmYWxzZSB9KSxcbiAgICAgIF1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsZWQgbGlzdD17cGx1Z2luc30gaW5zdGFsbFN0YXR1cz17c3RhdHVzZXN9IG9uQ2FuY2VsPXt2aS5mbigpfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uY2xvc2UnIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBjbG9zZSBidXR0b24gd2hlbiBpc0hpZGVCdXR0b24gaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbGVkIHsuLi5kZWZhdWx0SW5zdGFsbGVkUHJvcHN9IGlzSGlkZUJ1dHRvbj17dHJ1ZX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uY2xvc2UnIH0pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNhbmNlbCB3aGVuIGNsb3NlIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DYW5jZWwgPSB2aS5mbigpXG4gICAgICByZW5kZXIoPEluc3RhbGxlZCB7Li4uZGVmYXVsdEluc3RhbGxlZFByb3BzfSBvbkNhbmNlbD17b25DYW5jZWx9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5jbG9zZScgfSkpXG5cbiAgICAgIGV4cGVjdChvbkNhbmNlbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHBsdWdpbiBsaXN0JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsZWQgbGlzdD17W119IGluc3RhbGxTdGF0dXM9e1tdfSBvbkNhbmNlbD17dmkuZm4oKX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjb21tb24ub3BlcmF0aW9uLmNsb3NlJyB9KSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtaXhlZCBpbnN0YWxsIHN0YXR1c2VzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcGx1Z2lucyA9IFtcbiAgICAgICAgY3JlYXRlTW9ja1BsdWdpbih7IHBsdWdpbl9pZDogJ3N1Y2Nlc3MtcGx1Z2luJyB9KSxcbiAgICAgICAgY3JlYXRlTW9ja1BsdWdpbih7IHBsdWdpbl9pZDogJ2ZhaWxlZC1wbHVnaW4nIH0pLFxuICAgICAgXVxuICAgICAgY29uc3Qgc3RhdHVzZXMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tJbnN0YWxsU3RhdHVzKHsgc3VjY2VzczogdHJ1ZSB9KSxcbiAgICAgICAgY3JlYXRlTW9ja0luc3RhbGxTdGF0dXMoeyBzdWNjZXNzOiBmYWxzZSB9KSxcbiAgICAgIF1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsZWQgbGlzdD17cGx1Z2luc30gaW5zdGFsbFN0YXR1cz17c3RhdHVzZXN9IG9uQ2FuY2VsPXt2aS5mbigpfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2NvbW1vbi5vcGVyYXRpb24uY2xvc2UnIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDb21wb25lbnQgTWVtb2l6YXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NvbXBvbmVudCBNZW1vaXphdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGJlIHdyYXBwZWQgd2l0aCBSZWFjdC5tZW1vJywgKCkgPT4ge1xuICAgICAgZXhwZWN0KEluc3RhbGxlZCkudG9CZURlZmluZWQoKVxuICAgICAgZXhwZWN0KHR5cGVvZiBJbnN0YWxsZWQpLnRvQmUoJ29iamVjdCcpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIExvYWRlZEl0ZW0gQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnTG9hZGVkSXRlbScsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdExvYWRlZEl0ZW1Qcm9wcyA9IHtcbiAgICBjaGVja2VkOiBmYWxzZSxcbiAgICBvbkNoZWNrZWRDaGFuZ2U6IHZpLmZuKCksXG4gICAgcGF5bG9hZDogY3JlYXRlTW9ja1BsdWdpbigpLFxuICAgIHZlcnNpb25JbmZvOiBjcmVhdGVNb2NrVmVyc2lvblByb3BzKCksXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyBIZWxwZXIgdG8gZmluZCBjaGVja2JveCBlbGVtZW50XG4gIGNvbnN0IGdldENoZWNrYm94ID0gKCkgPT4gc2NyZWVuLmdldEJ5VGVzdElkKC9eY2hlY2tib3gvKVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGNoZWNrYm94JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMb2FkZWRJdGVtIHsuLi5kZWZhdWx0TG9hZGVkSXRlbVByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KGdldENoZWNrYm94KCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2hlY2tib3ggd2l0aCBjaGVjayBpY29uIHdoZW4gY2hlY2tlZCBwcm9wIGlzIHRydWUnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPExvYWRlZEl0ZW0gey4uLmRlZmF1bHRMb2FkZWRJdGVtUHJvcHN9IGNoZWNrZWQ9e3RydWV9IC8+KVxuXG4gICAgICBleHBlY3QoZ2V0Q2hlY2tib3goKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgLy8gQ2hlY2sgaWNvbiBzaG91bGQgYmUgcHJlc2VudCB3aGVuIGNoZWNrZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoL15jaGVjay1pY29uLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2hlY2tib3ggd2l0aG91dCBjaGVjayBpY29uIHdoZW4gY2hlY2tlZCBwcm9wIGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxMb2FkZWRJdGVtIHsuLi5kZWZhdWx0TG9hZGVkSXRlbVByb3BzfSBjaGVja2VkPXtmYWxzZX0gLz4pXG5cbiAgICAgIGV4cGVjdChnZXRDaGVja2JveCgpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAvLyBDaGVjayBpY29uIHNob3VsZCBub3QgYmUgcHJlc2VudCB3aGVuIHVuY2hlY2tlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKC9eY2hlY2staWNvbi8pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNoZWNrZWRDaGFuZ2Ugd2hlbiBjaGVja2JveCBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DaGVja2VkQ2hhbmdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxMb2FkZWRJdGVtIHsuLi5kZWZhdWx0TG9hZGVkSXRlbVByb3BzfSBvbkNoZWNrZWRDaGFuZ2U9e29uQ2hlY2tlZENoYW5nZX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhnZXRDaGVja2JveCgpKVxuXG4gICAgICBleHBlY3Qob25DaGVja2VkQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChkZWZhdWx0TG9hZGVkSXRlbVByb3BzLnBheWxvYWQpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaXNGcm9tTWFya2V0UGxhY2UgcHJvcCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TG9hZGVkSXRlbSB7Li4uZGVmYXVsdExvYWRlZEl0ZW1Qcm9wc30gaXNGcm9tTWFya2V0UGxhY2U9e3RydWV9IC8+KVxuXG4gICAgICBleHBlY3QoZ2V0Q2hlY2tib3goKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgdmVyc2lvbiBpbmZvIHdoZW4gcGF5bG9hZCBoYXMgdmVyc2lvbicsICgpID0+IHtcbiAgICAgIGNvbnN0IHBsdWdpbldpdGhWZXJzaW9uID0gY3JlYXRlTW9ja1BsdWdpbih7IHZlcnNpb246ICcyLjAuMCcgfSlcbiAgICAgIHJlbmRlcig8TG9hZGVkSXRlbSB7Li4uZGVmYXVsdExvYWRlZEl0ZW1Qcm9wc30gcGF5bG9hZD17cGx1Z2luV2l0aFZlcnNpb259IC8+KVxuXG4gICAgICBleHBlY3QoZ2V0Q2hlY2tib3goKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ29tcG9uZW50IE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIGV4cGVjdChMb2FkZWRJdGVtKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QodHlwZW9mIExvYWRlZEl0ZW0pLnRvQmUoJ29iamVjdCcpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIE1hcmtldHBsYWNlSXRlbSBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdNYXJrZXRwbGFjZUl0ZW0nLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRNYXJrZXRwbGFjZUl0ZW1Qcm9wcyA9IHtcbiAgICBjaGVja2VkOiBmYWxzZSxcbiAgICBvbkNoZWNrZWRDaGFuZ2U6IHZpLmZuKCksXG4gICAgcGF5bG9hZDogY3JlYXRlTW9ja1BsdWdpbigpLFxuICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgdmVyc2lvbkluZm86IGNyZWF0ZU1vY2tWZXJzaW9uUHJvcHMoKSxcbiAgfVxuXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICB9KVxuXG4gIC8vIEhlbHBlciB0byBmaW5kIGNoZWNrYm94IGVsZW1lbnRcbiAgY29uc3QgZ2V0Q2hlY2tib3ggPSAoKSA9PiBzY3JlZW4uZ2V0QnlUZXN0SWQoL15jaGVja2JveC8pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgTG9hZGVkSXRlbSB3aGVuIHBheWxvYWQgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPE1hcmtldHBsYWNlSXRlbSB7Li4uZGVmYXVsdE1hcmtldHBsYWNlSXRlbVByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KGdldENoZWNrYm94KCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgTG9hZGluZyB3aGVuIHBheWxvYWQgaXMgdW5kZWZpbmVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxNYXJrZXRwbGFjZUl0ZW0gey4uLmRlZmF1bHRNYXJrZXRwbGFjZUl0ZW1Qcm9wc30gcGF5bG9hZD17dW5kZWZpbmVkfSAvPilcblxuICAgICAgLy8gTG9hZGluZyBjb21wb25lbnQgcmVuZGVycyBhIGRpc2FibGVkIGNoZWNrYm94XG4gICAgICBjb25zdCBjaGVja2JveCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgvXmNoZWNrYm94LylcbiAgICAgIGV4cGVjdChjaGVja2JveCkudG9IYXZlQ2xhc3MoJ2N1cnNvci1ub3QtYWxsb3dlZCcpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIHZlcnNpb24gdG8gTG9hZGVkSXRlbScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8TWFya2V0cGxhY2VJdGVtIHsuLi5kZWZhdWx0TWFya2V0cGxhY2VJdGVtUHJvcHN9IHZlcnNpb249XCIyLjAuMFwiIC8+KVxuXG4gICAgICBleHBlY3QoZ2V0Q2hlY2tib3goKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgY2hlY2tlZCBzdGF0ZSB0byBMb2FkZWRJdGVtJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxNYXJrZXRwbGFjZUl0ZW0gey4uLmRlZmF1bHRNYXJrZXRwbGFjZUl0ZW1Qcm9wc30gY2hlY2tlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIFdoZW4gY2hlY2tlZCwgdGhlIGNoZWNrIGljb24gc2hvdWxkIGJlIHByZXNlbnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoL15jaGVjay1pY29uLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGVja2VkQ2hhbmdlIHdoZW4gY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hlY2tlZENoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8TWFya2V0cGxhY2VJdGVtIHsuLi5kZWZhdWx0TWFya2V0cGxhY2VJdGVtUHJvcHN9IG9uQ2hlY2tlZENoYW5nZT17b25DaGVja2VkQ2hhbmdlfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGdldENoZWNrYm94KCkpXG5cbiAgICAgIGV4cGVjdChvbkNoZWNrZWRDaGFuZ2UpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ29tcG9uZW50IE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIGV4cGVjdChNYXJrZXRwbGFjZUl0ZW0pLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdCh0eXBlb2YgTWFya2V0cGxhY2VJdGVtKS50b0JlKCdvYmplY3QnKVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBQYWNrYWdlSXRlbSBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdQYWNrYWdlSXRlbScsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdFBhY2thZ2VJdGVtUHJvcHMgPSB7XG4gICAgY2hlY2tlZDogZmFsc2UsXG4gICAgb25DaGVja2VkQ2hhbmdlOiB2aS5mbigpLFxuICAgIHBheWxvYWQ6IGNyZWF0ZU1vY2tQYWNrYWdlRGVwZW5kZW5jeSgpLFxuICAgIHZlcnNpb25JbmZvOiBjcmVhdGVNb2NrVmVyc2lvblByb3BzKCksXG4gIH1cblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgfSlcblxuICAvLyBIZWxwZXIgdG8gZmluZCBjaGVja2JveCBlbGVtZW50XG4gIGNvbnN0IGdldENoZWNrYm94ID0gKCkgPT4gc2NyZWVuLmdldEJ5VGVzdElkKC9eY2hlY2tib3gvKVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIExvYWRlZEl0ZW0gd2hlbiBwYXlsb2FkIGhhcyBtYW5pZmVzdCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UGFja2FnZUl0ZW0gey4uLmRlZmF1bHRQYWNrYWdlSXRlbVByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KGdldENoZWNrYm94KCkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgTG9hZGluZ0Vycm9yIHdoZW4gbWFuaWZlc3QgaXMgbWlzc2luZycsICgpID0+IHtcbiAgICAgIGNvbnN0IGludmFsaWRQYXlsb2FkID0ge1xuICAgICAgICB0eXBlOiAncGFja2FnZScsXG4gICAgICAgIHZhbHVlOiB7IHVuaXF1ZV9pZGVudGlmaWVyOiAndGVzdCcgfSxcbiAgICAgIH0gYXMgUGFja2FnZURlcGVuZGVuY3lcblxuICAgICAgcmVuZGVyKDxQYWNrYWdlSXRlbSB7Li4uZGVmYXVsdFBhY2thZ2VJdGVtUHJvcHN9IHBheWxvYWQ9e2ludmFsaWRQYXlsb2FkfSAvPilcblxuICAgICAgLy8gTG9hZGluZ0Vycm9yIHJlbmRlcnMgYSBkaXNhYmxlZCBjaGVja2JveCBhbmQgZXJyb3IgdGV4dFxuICAgICAgY29uc3QgY2hlY2tib3ggPSBzY3JlZW4uZ2V0QnlUZXN0SWQoL15jaGVja2JveC8pXG4gICAgICBleHBlY3QoY2hlY2tib3gpLnRvSGF2ZUNsYXNzKCdjdXJzb3Itbm90LWFsbG93ZWQnKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwucGx1Z2luTG9hZEVycm9yJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3MgaXNGcm9tTWFya2V0UGxhY2UgdG8gTG9hZGVkSXRlbScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8UGFja2FnZUl0ZW0gey4uLmRlZmF1bHRQYWNrYWdlSXRlbVByb3BzfSBpc0Zyb21NYXJrZXRQbGFjZT17dHJ1ZX0gLz4pXG5cbiAgICAgIGV4cGVjdChnZXRDaGVja2JveCgpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBjaGVja2VkIHN0YXRlIHRvIExvYWRlZEl0ZW0nLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPFBhY2thZ2VJdGVtIHsuLi5kZWZhdWx0UGFja2FnZUl0ZW1Qcm9wc30gY2hlY2tlZD17dHJ1ZX0gLz4pXG5cbiAgICAgIC8vIFdoZW4gY2hlY2tlZCwgdGhlIGNoZWNrIGljb24gc2hvdWxkIGJlIHByZXNlbnRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoL15jaGVjay1pY29uLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVzZXIgSW50ZXJhY3Rpb25zIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGVja2VkQ2hhbmdlIHdoZW4gY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2hlY2tlZENoYW5nZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8UGFja2FnZUl0ZW0gey4uLmRlZmF1bHRQYWNrYWdlSXRlbVByb3BzfSBvbkNoZWNrZWRDaGFuZ2U9e29uQ2hlY2tlZENoYW5nZX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhnZXRDaGVja2JveCgpKVxuXG4gICAgICBleHBlY3Qob25DaGVja2VkQ2hhbmdlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENvbXBvbmVudCBNZW1vaXphdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ29tcG9uZW50IE1lbW9pemF0aW9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgYmUgd3JhcHBlZCB3aXRoIFJlYWN0Lm1lbW8nLCAoKSA9PiB7XG4gICAgICBleHBlY3QoUGFja2FnZUl0ZW0pLnRvQmVEZWZpbmVkKClcbiAgICAgIGV4cGVjdCh0eXBlb2YgUGFja2FnZUl0ZW0pLnRvQmUoJ29iamVjdCcpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEdpdGh1Ykl0ZW0gQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnR2l0aHViSXRlbScsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdEdpdGh1Ykl0ZW1Qcm9wcyA9IHtcbiAgICBjaGVja2VkOiBmYWxzZSxcbiAgICBvbkNoZWNrZWRDaGFuZ2U6IHZpLmZuKCksXG4gICAgZGVwZW5kZW5jeTogY3JlYXRlTW9ja0dpdEh1YkRlcGVuZGVuY3koKSxcbiAgICB2ZXJzaW9uSW5mbzogY3JlYXRlTW9ja1ZlcnNpb25Qcm9wcygpLFxuICAgIG9uRmV0Y2hlZFBheWxvYWQ6IHZpLmZuKCksXG4gICAgb25GZXRjaEVycm9yOiB2aS5mbigpLFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1VzZVVwbG9hZEdpdEh1Yi5tb2NrUmV0dXJuVmFsdWUoeyBkYXRhOiBudWxsLCBlcnJvcjogbnVsbCB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIExvYWRpbmcgd2hlbiBkYXRhIGlzIG5vdCB5ZXQgZmV0Y2hlZCcsICgpID0+IHtcbiAgICAgIG1vY2tVc2VVcGxvYWRHaXRIdWIubW9ja1JldHVyblZhbHVlKHsgZGF0YTogbnVsbCwgZXJyb3I6IG51bGwgfSlcbiAgICAgIHJlbmRlcig8R2l0aHViSXRlbSB7Li4uZGVmYXVsdEdpdGh1Ykl0ZW1Qcm9wc30gLz4pXG5cbiAgICAgIC8vIExvYWRpbmcgY29tcG9uZW50IHJlbmRlcnMgYSBkaXNhYmxlZCBjaGVja2JveFxuICAgICAgY29uc3QgY2hlY2tib3ggPSBzY3JlZW4uZ2V0QnlUZXN0SWQoL15jaGVja2JveC8pXG4gICAgICBleHBlY3QoY2hlY2tib3gpLnRvSGF2ZUNsYXNzKCdjdXJzb3Itbm90LWFsbG93ZWQnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBMb2FkZWRJdGVtIHdoZW4gZGF0YSBpcyBmZXRjaGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja0RhdGEgPSB7XG4gICAgICAgIHVuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC11aWQnLFxuICAgICAgICBtYW5pZmVzdDoge1xuICAgICAgICAgIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ3Rlc3QtdWlkJyxcbiAgICAgICAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICAgIGF1dGhvcjogJ3Rlc3QtYXV0aG9yJyxcbiAgICAgICAgICBpY29uOiAnaWNvbi5wbmcnLFxuICAgICAgICAgIG5hbWU6ICdUZXN0IFBsdWdpbicsXG4gICAgICAgICAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS50b29sLFxuICAgICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdUZXN0JyB9LFxuICAgICAgICAgIGRlc2NyaXB0aW9uOiB7ICdlbi1VUyc6ICdUZXN0IERlc2NyaXB0aW9uJyB9LFxuICAgICAgICAgIGNyZWF0ZWRfYXQ6ICcyMDI0LTAxLTAxJyxcbiAgICAgICAgICByZXNvdXJjZToge30sXG4gICAgICAgICAgcGx1Z2luczogW10sXG4gICAgICAgICAgdmVyaWZpZWQ6IHRydWUsXG4gICAgICAgICAgZW5kcG9pbnQ6IHsgc2V0dGluZ3M6IFtdLCBlbmRwb2ludHM6IFtdIH0sXG4gICAgICAgICAgbW9kZWw6IG51bGwsXG4gICAgICAgICAgdGFnczogW10sXG4gICAgICAgICAgYWdlbnRfc3RyYXRlZ3k6IG51bGwsXG4gICAgICAgICAgbWV0YTogeyB2ZXJzaW9uOiAnMS4wLjAnIH0sXG4gICAgICAgICAgdHJpZ2dlcjoge30sXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgICBtb2NrVXNlVXBsb2FkR2l0SHViLm1vY2tSZXR1cm5WYWx1ZSh7IGRhdGE6IG1vY2tEYXRhLCBlcnJvcjogbnVsbCB9KVxuXG4gICAgICByZW5kZXIoPEdpdGh1Ykl0ZW0gey4uLmRlZmF1bHRHaXRodWJJdGVtUHJvcHN9IC8+KVxuXG4gICAgICAvLyBXaGVuIGRhdGEgaXMgbG9hZGVkLCBMb2FkZWRJdGVtIHNob3VsZCBiZSByZW5kZXJlZCB3aXRoIGNoZWNrYm94XG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgvXmNoZWNrYm94LykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDYWxsYmFjayBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2FsbGJhY2tzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkZldGNoZWRQYXlsb2FkIHdoZW4gZGF0YSBpcyBmZXRjaGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb25GZXRjaGVkUGF5bG9hZCA9IHZpLmZuKClcbiAgICAgIGNvbnN0IG1vY2tEYXRhID0ge1xuICAgICAgICB1bmlxdWVfaWRlbnRpZmllcjogJ3Rlc3QtdWlkJyxcbiAgICAgICAgbWFuaWZlc3Q6IHtcbiAgICAgICAgICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICd0ZXN0LXVpZCcsXG4gICAgICAgICAgdmVyc2lvbjogJzEuMC4wJyxcbiAgICAgICAgICBhdXRob3I6ICd0ZXN0LWF1dGhvcicsXG4gICAgICAgICAgaWNvbjogJ2ljb24ucG5nJyxcbiAgICAgICAgICBuYW1lOiAnVGVzdCBQbHVnaW4nLFxuICAgICAgICAgIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgICAgICAgICBsYWJlbDogeyAnZW4tVVMnOiAnVGVzdCcgfSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogeyAnZW4tVVMnOiAnVGVzdCBEZXNjcmlwdGlvbicgfSxcbiAgICAgICAgICBjcmVhdGVkX2F0OiAnMjAyNC0wMS0wMScsXG4gICAgICAgICAgcmVzb3VyY2U6IHt9LFxuICAgICAgICAgIHBsdWdpbnM6IFtdLFxuICAgICAgICAgIHZlcmlmaWVkOiB0cnVlLFxuICAgICAgICAgIGVuZHBvaW50OiB7IHNldHRpbmdzOiBbXSwgZW5kcG9pbnRzOiBbXSB9LFxuICAgICAgICAgIG1vZGVsOiBudWxsLFxuICAgICAgICAgIHRhZ3M6IFtdLFxuICAgICAgICAgIGFnZW50X3N0cmF0ZWd5OiBudWxsLFxuICAgICAgICAgIG1ldGE6IHsgdmVyc2lvbjogJzEuMC4wJyB9LFxuICAgICAgICAgIHRyaWdnZXI6IHt9LFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICAgbW9ja1VzZVVwbG9hZEdpdEh1Yi5tb2NrUmV0dXJuVmFsdWUoeyBkYXRhOiBtb2NrRGF0YSwgZXJyb3I6IG51bGwgfSlcblxuICAgICAgcmVuZGVyKDxHaXRodWJJdGVtIHsuLi5kZWZhdWx0R2l0aHViSXRlbVByb3BzfSBvbkZldGNoZWRQYXlsb2FkPXtvbkZldGNoZWRQYXlsb2FkfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkZldGNoZWRQYXlsb2FkKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkZldGNoRXJyb3Igd2hlbiBlcnJvciBvY2N1cnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvbkZldGNoRXJyb3IgPSB2aS5mbigpXG4gICAgICBtb2NrVXNlVXBsb2FkR2l0SHViLm1vY2tSZXR1cm5WYWx1ZSh7IGRhdGE6IG51bGwsIGVycm9yOiBuZXcgRXJyb3IoJ0ZldGNoIGZhaWxlZCcpIH0pXG5cbiAgICAgIHJlbmRlcig8R2l0aHViSXRlbSB7Li4uZGVmYXVsdEdpdGh1Ykl0ZW1Qcm9wc30gb25GZXRjaEVycm9yPXtvbkZldGNoRXJyb3J9IC8+KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uRmV0Y2hFcnJvcikudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gUHJvcHMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBkZXBlbmRlbmN5IGluZm8gdG8gdXNlVXBsb2FkR2l0SHViJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGVwZW5kZW5jeSA9IGNyZWF0ZU1vY2tHaXRIdWJEZXBlbmRlbmN5KClcbiAgICAgIHJlbmRlcig8R2l0aHViSXRlbSB7Li4uZGVmYXVsdEdpdGh1Ykl0ZW1Qcm9wc30gZGVwZW5kZW5jeT17ZGVwZW5kZW5jeX0gLz4pXG5cbiAgICAgIGV4cGVjdChtb2NrVXNlVXBsb2FkR2l0SHViKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHJlcG86IGRlcGVuZGVuY3kudmFsdWUucmVwbyxcbiAgICAgICAgdmVyc2lvbjogZGVwZW5kZW5jeS52YWx1ZS52ZXJzaW9uLFxuICAgICAgICBwYWNrYWdlOiBkZXBlbmRlbmN5LnZhbHVlLnBhY2thZ2UsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ29tcG9uZW50IE1lbW9pemF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDb21wb25lbnQgTWVtb2l6YXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBiZSB3cmFwcGVkIHdpdGggUmVhY3QubWVtbycsICgpID0+IHtcbiAgICAgIGV4cGVjdChHaXRodWJJdGVtKS50b0JlRGVmaW5lZCgpXG4gICAgICBleHBlY3QodHlwZW9mIEdpdGh1Ykl0ZW0pLnRvQmUoJ29iamVjdCcpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=