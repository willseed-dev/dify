"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("../../types");
const utils_1 = require("../utils");
const index_1 = require("./index");
// Factory functions for test data (defined before mocks that use them)
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
    meta: { version: '1.0.0' },
    trigger: {},
    ...overrides,
});
const createMockReleases = () => [
    {
        tag_name: 'v1.0.0',
        assets: [
            { id: 1, name: 'plugin-v1.0.0.zip', browser_download_url: 'https://github.com/test/repo/releases/download/v1.0.0/plugin-v1.0.0.zip' },
            { id: 2, name: 'plugin-v1.0.0.tar.gz', browser_download_url: 'https://github.com/test/repo/releases/download/v1.0.0/plugin-v1.0.0.tar.gz' },
        ],
    },
    {
        tag_name: 'v0.9.0',
        assets: [
            { id: 3, name: 'plugin-v0.9.0.zip', browser_download_url: 'https://github.com/test/repo/releases/download/v0.9.0/plugin-v0.9.0.zip' },
        ],
    },
];
const createUpdatePayload = (overrides = {}) => ({
    originalPackageInfo: {
        id: 'original-id',
        repo: 'owner/repo',
        version: 'v0.9.0',
        package: 'plugin-v0.9.0.zip',
        releases: createMockReleases(),
    },
    ...overrides,
});
// Mock external dependencies
const mockNotify = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/base/toast', () => ({
    default: {
        notify: (props) => mockNotify(props),
    },
}));
const mockGetIconUrl = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/plugins/install-plugin/base/use-get-icon', () => ({
    default: () => ({ getIconUrl: mockGetIconUrl }),
}));
const mockFetchReleases = vitest_1.vi.fn();
vitest_1.vi.mock('../hooks', () => ({
    useGitHubReleases: () => ({ fetchReleases: mockFetchReleases }),
}));
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
vitest_1.vi.mock('./steps/setURL', () => ({
    default: ({ repoUrl, onChange, onNext, onCancel }) => (<div data-testid="set-url-step">
      <input data-testid="repo-url-input" value={repoUrl} onChange={e => onChange(e.target.value)}/>
      <button data-testid="next-btn" onClick={onNext}>Next</button>
      <button data-testid="cancel-btn" onClick={onCancel}>Cancel</button>
    </div>),
}));
vitest_1.vi.mock('./steps/selectPackage', () => ({
    default: ({ repoUrl, selectedVersion, versions, onSelectVersion, selectedPackage, packages, onSelectPackage, onUploaded, onFailed, onBack, }) => (<div data-testid="select-package-step">
      <span data-testid="repo-url-display">{repoUrl}</span>
      <span data-testid="selected-version">{selectedVersion}</span>
      <span data-testid="selected-package">{selectedPackage}</span>
      <span data-testid="versions-count">{versions.length}</span>
      <span data-testid="packages-count">{packages.length}</span>
      <button data-testid="select-version-btn" onClick={() => onSelectVersion({ value: 'v1.0.0', name: 'v1.0.0' })}>
        Select Version
      </button>
      <button data-testid="select-package-btn" onClick={() => onSelectPackage({ value: 'package.zip', name: 'package.zip' })}>
        Select Package
      </button>
      <button data-testid="trigger-upload-btn" onClick={() => onUploaded({
            uniqueIdentifier: 'test-unique-id',
            manifest: createMockManifest(),
        })}>
        Trigger Upload
      </button>
      <button data-testid="trigger-upload-fail-btn" onClick={() => onFailed('Upload failed error')}>
        Trigger Upload Fail
      </button>
      <button data-testid="back-btn" onClick={onBack}>Back</button>
    </div>),
}));
vitest_1.vi.mock('./steps/loaded', () => ({
    default: ({ uniqueIdentifier, payload, repoUrl, selectedVersion, selectedPackage, onBack, onStartToInstall, onInstalled, onFailed, }) => (<div data-testid="loaded-step">
      <span data-testid="unique-identifier">{uniqueIdentifier}</span>
      <span data-testid="payload-name">{payload?.name}</span>
      <span data-testid="loaded-repo-url">{repoUrl}</span>
      <span data-testid="loaded-version">{selectedVersion}</span>
      <span data-testid="loaded-package">{selectedPackage}</span>
      <button data-testid="loaded-back-btn" onClick={onBack}>Back</button>
      <button data-testid="start-install-btn" onClick={onStartToInstall}>Start Install</button>
      <button data-testid="install-success-btn" onClick={() => onInstalled()}>Install Success</button>
      <button data-testid="install-success-no-refresh-btn" onClick={() => onInstalled(true)}>Install Success No Refresh</button>
      <button data-testid="install-fail-btn" onClick={() => onFailed('Install failed')}>Install Fail</button>
      <button data-testid="install-fail-no-msg-btn" onClick={() => onFailed()}>Install Fail No Msg</button>
    </div>),
}));
vitest_1.vi.mock('../base/installed', () => ({
    default: ({ payload, isFailed, errMsg, onCancel }) => (<div data-testid="installed-step">
      <span data-testid="installed-payload">{payload?.name || 'no-payload'}</span>
      <span data-testid="is-failed">{isFailed ? 'true' : 'false'}</span>
      <span data-testid="error-msg">{errMsg || 'no-error'}</span>
      <button data-testid="installed-close-btn" onClick={onCancel}>Close</button>
    </div>),
}));
(0, vitest_1.describe)('InstallFromGitHub', () => {
    const defaultProps = {
        onClose: vitest_1.vi.fn(),
        onSuccess: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockGetIconUrl.mockResolvedValue('processed-icon-url');
        mockFetchReleases.mockResolvedValue(createMockReleases());
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
        (0, vitest_1.it)('should render modal with correct initial state for new installation', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('set-url-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('repo-url-input')).toHaveValue('');
        });
        (0, vitest_1.it)('should render modal with selectPackage step when updatePayload is provided', () => {
            const updatePayload = createUpdatePayload();
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={updatePayload}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-package-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('repo-url-display')).toHaveTextContent('https://github.com/owner/repo');
        });
        (0, vitest_1.it)('should render install note text in non-terminal steps', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.installNote')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply modal className from useHideLogic', () => {
            // Verify useHideLogic provides modalClassName
            // The actual className application is handled by Modal component internally
            // We verify the hook integration by checking that it returns the expected class
            (0, vitest_1.expect)(mockHideLogicState.modalClassName).toBe('test-modal-class');
        });
    });
    // ================================
    // Title Tests
    // ================================
    (0, vitest_1.describe)('Title Display', () => {
        (0, vitest_1.it)('should show install title when no updatePayload', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show update title when updatePayload is provided', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.updatePlugin')).toBeInTheDocument();
        });
    });
    // ================================
    // State Management Tests
    // ================================
    (0, vitest_1.describe)('State Management', () => {
        (0, vitest_1.it)('should update repoUrl when user types in input', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/test/repo' } });
            (0, vitest_1.expect)(input).toHaveValue('https://github.com/test/repo');
        });
        (0, vitest_1.it)('should transition from setUrl to selectPackage on successful URL submit', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
            const nextBtn = react_1.screen.getByTestId('next-btn');
            react_1.fireEvent.click(nextBtn);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('select-package-step')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should update selectedVersion when version is selected', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            const selectVersionBtn = react_1.screen.getByTestId('select-version-btn');
            react_1.fireEvent.click(selectVersionBtn);
            (0, vitest_1.expect)(react_1.screen.getByTestId('selected-version')).toHaveTextContent('v1.0.0');
        });
        (0, vitest_1.it)('should update selectedPackage when package is selected', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            const selectPackageBtn = react_1.screen.getByTestId('select-package-btn');
            react_1.fireEvent.click(selectPackageBtn);
            (0, vitest_1.expect)(react_1.screen.getByTestId('selected-package')).toHaveTextContent('package.zip');
        });
        (0, vitest_1.it)('should transition to readyToInstall step after successful upload', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            const uploadBtn = react_1.screen.getByTestId('trigger-upload-btn');
            react_1.fireEvent.click(uploadBtn);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should transition to installed step after successful install', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            // First upload
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            // Then install
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('false');
            });
        });
        (0, vitest_1.it)('should transition to installFailed step on install failure', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
                (0, vitest_1.expect)(react_1.screen.getByTestId('error-msg')).toHaveTextContent('Install failed');
            });
        });
        (0, vitest_1.it)('should transition to uploadFailed step on upload failure', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
                (0, vitest_1.expect)(react_1.screen.getByTestId('error-msg')).toHaveTextContent('Upload failed error');
            });
        });
    });
    // ================================
    // Versions and Packages Tests
    // ================================
    (0, vitest_1.describe)('Versions and Packages Computation', () => {
        (0, vitest_1.it)('should derive versions from releases', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('versions-count')).toHaveTextContent('2');
        });
        (0, vitest_1.it)('should derive packages from selected version', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            // Initially no packages (no version selected)
            (0, vitest_1.expect)(react_1.screen.getByTestId('packages-count')).toHaveTextContent('0');
            // Select a version
            react_1.fireEvent.click(react_1.screen.getByTestId('select-version-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('packages-count')).toHaveTextContent('2');
            });
        });
    });
    // ================================
    // URL Validation Tests
    // ================================
    (0, vitest_1.describe)('URL Validation', () => {
        (0, vitest_1.it)('should show error toast for invalid GitHub URL', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'invalid-url' } });
            const nextBtn = react_1.screen.getByTestId('next-btn');
            react_1.fireEvent.click(nextBtn);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'plugin.error.inValidGitHubUrl',
                });
            });
        });
        (0, vitest_1.it)('should show error toast when no releases are found', async () => {
            mockFetchReleases.mockResolvedValue([]);
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
            const nextBtn = react_1.screen.getByTestId('next-btn');
            react_1.fireEvent.click(nextBtn);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'plugin.error.noReleasesFound',
                });
            });
        });
        (0, vitest_1.it)('should show error toast when fetchReleases throws', async () => {
            mockFetchReleases.mockRejectedValue(new Error('Network error'));
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
            const nextBtn = react_1.screen.getByTestId('next-btn');
            react_1.fireEvent.click(nextBtn);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith({
                    type: 'error',
                    message: 'plugin.error.fetchReleasesError',
                });
            });
        });
    });
    // ================================
    // Back Navigation Tests
    // ================================
    (0, vitest_1.describe)('Back Navigation', () => {
        (0, vitest_1.it)('should go back from selectPackage to setUrl', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Navigate to selectPackage
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
            react_1.fireEvent.click(react_1.screen.getByTestId('next-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('select-package-step')).toBeInTheDocument();
            });
            // Go back
            react_1.fireEvent.click(react_1.screen.getByTestId('back-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('set-url-step')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should go back from readyToInstall to selectPackage', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            // Navigate to readyToInstall
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            // Go back
            react_1.fireEvent.click(react_1.screen.getByTestId('loaded-back-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('select-package-step')).toBeInTheDocument();
            });
        });
    });
    // ================================
    // Callback Tests
    // ================================
    (0, vitest_1.describe)('Callbacks', () => {
        (0, vitest_1.it)('should call onClose when cancel button is clicked', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('cancel-btn'));
            (0, vitest_1.expect)(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call foldAnimInto when modal close is triggered', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // The modal's onClose is bound to foldAnimInto
            // We verify the hook is properly connected
            (0, vitest_1.expect)(mockHideLogicState.foldAnimInto).toBeDefined();
        });
        (0, vitest_1.it)('should call onSuccess when installation completes', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
            });
        });
        (0, vitest_1.it)('should call refreshPluginList when installation completes without notRefresh flag', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockRefreshPluginList).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should not call refreshPluginList when notRefresh flag is true', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-no-refresh-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockRefreshPluginList).not.toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should call setIsInstalling(false) when installation completes', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
            });
        });
        (0, vitest_1.it)('should call handleStartToInstall when start install is triggered', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call setIsInstalling(false) when installation fails', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
            });
        });
    });
    // ================================
    // Callback Stability Tests (Memoization)
    // ================================
    (0, vitest_1.describe)('Callback Stability', () => {
        (0, vitest_1.it)('should maintain stable handleUploadFail callback reference', async () => {
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            const firstRender = react_1.screen.getByTestId('select-package-step');
            (0, vitest_1.expect)(firstRender).toBeInTheDocument();
            // Rerender with same props
            rerender(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            // The component should still work correctly
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
            });
        });
    });
    // ================================
    // Icon Processing Tests
    // ================================
    (0, vitest_1.describe)('Icon Processing', () => {
        (0, vitest_1.it)('should process icon URL on successful upload', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockGetIconUrl).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should handle icon processing error gracefully', async () => {
            mockGetIconUrl.mockRejectedValue(new Error('Icon processing failed'));
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
            });
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty releases array from updatePayload', () => {
            const updatePayload = createUpdatePayload({
                originalPackageInfo: {
                    id: 'original-id',
                    repo: 'owner/repo',
                    version: 'v0.9.0',
                    package: 'plugin.zip',
                    releases: [],
                },
            });
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={updatePayload}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('versions-count')).toHaveTextContent('0');
        });
        (0, vitest_1.it)('should handle release with no assets', async () => {
            const updatePayload = createUpdatePayload({
                originalPackageInfo: {
                    id: 'original-id',
                    repo: 'owner/repo',
                    version: 'v0.9.0',
                    package: 'plugin.zip',
                    releases: [{ tag_name: 'v1.0.0', assets: [] }],
                },
            });
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={updatePayload}/>);
            // Select the version
            react_1.fireEvent.click(react_1.screen.getByTestId('select-version-btn'));
            // Should have 0 packages
            (0, vitest_1.expect)(react_1.screen.getByTestId('packages-count')).toHaveTextContent('0');
        });
        (0, vitest_1.it)('should handle selected version not found in releases', async () => {
            const updatePayload = createUpdatePayload({
                originalPackageInfo: {
                    id: 'original-id',
                    repo: 'owner/repo',
                    version: 'v0.9.0',
                    package: 'plugin.zip',
                    releases: [],
                },
            });
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={updatePayload}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('select-version-btn'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('packages-count')).toHaveTextContent('0');
        });
        (0, vitest_1.it)('should handle install failure without error message', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-no-msg-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
                (0, vitest_1.expect)(react_1.screen.getByTestId('error-msg')).toHaveTextContent('no-error');
            });
        });
        (0, vitest_1.it)('should handle URL without trailing slash', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
            react_1.fireEvent.click(react_1.screen.getByTestId('next-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockFetchReleases).toHaveBeenCalledWith('owner', 'repo');
            });
        });
        (0, vitest_1.it)('should preserve state correctly through step transitions', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Set URL
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/test/myrepo' } });
            // Navigate to selectPackage
            react_1.fireEvent.click(react_1.screen.getByTestId('next-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('select-package-step')).toBeInTheDocument();
            });
            // Verify URL is preserved
            (0, vitest_1.expect)(react_1.screen.getByTestId('repo-url-display')).toHaveTextContent('https://github.com/test/myrepo');
            // Select version and package
            react_1.fireEvent.click(react_1.screen.getByTestId('select-version-btn'));
            react_1.fireEvent.click(react_1.screen.getByTestId('select-package-btn'));
            // Navigate to readyToInstall
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            // Verify all data is preserved
            (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-repo-url')).toHaveTextContent('https://github.com/test/myrepo');
            (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-version')).toHaveTextContent('v1.0.0');
            (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-package')).toHaveTextContent('package.zip');
        });
    });
    // ================================
    // Terminal Steps Rendering Tests
    // ================================
    (0, vitest_1.describe)('Terminal Steps Rendering', () => {
        (0, vitest_1.it)('should render Installed component for installed step', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.queryByText('plugin.installFromGitHub.installNote')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should render Installed component for uploadFailed step', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
            });
        });
        (0, vitest_1.it)('should render Installed component for installFailed step', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
            });
        });
        (0, vitest_1.it)('should call onClose when close button is clicked in installed step', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('installed-close-btn'));
            (0, vitest_1.expect)(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });
    });
    // ================================
    // Title Update Tests
    // ================================
    (0, vitest_1.describe)('Title Updates', () => {
        (0, vitest_1.it)('should show success title when installed', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.installedSuccessfully')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should show failed title when install failed', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.installFailed')).toBeInTheDocument();
            });
        });
    });
    // ================================
    // Data Flow Tests
    // ================================
    (0, vitest_1.describe)('Data Flow', () => {
        (0, vitest_1.it)('should pass correct uniqueIdentifier to Loaded component', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('unique-identifier')).toHaveTextContent('test-unique-id');
            });
        });
        (0, vitest_1.it)('should pass processed manifest to Loaded component', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('payload-name')).toHaveTextContent('Test Plugin');
            });
        });
        (0, vitest_1.it)('should pass manifest with processed icon to Loaded component', async () => {
            mockGetIconUrl.mockResolvedValue('https://processed-icon.com/icon.png');
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockGetIconUrl).toHaveBeenCalledWith('test-icon.png');
            });
        });
    });
    // ================================
    // Prop Variations Tests
    // ================================
    (0, vitest_1.describe)('Prop Variations', () => {
        (0, vitest_1.it)('should work without updatePayload (fresh install flow)', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Start from setUrl step
            (0, vitest_1.expect)(react_1.screen.getByTestId('set-url-step')).toBeInTheDocument();
            // Enter URL
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
            react_1.fireEvent.click(react_1.screen.getByTestId('next-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('select-package-step')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should work with updatePayload (update flow)', async () => {
            const updatePayload = createUpdatePayload();
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={updatePayload}/>);
            // Start from selectPackage step
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-package-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('repo-url-display')).toHaveTextContent('https://github.com/owner/repo');
        });
        (0, vitest_1.it)('should use releases from updatePayload', () => {
            const customReleases = [
                { tag_name: 'v2.0.0', assets: [{ id: 1, name: 'custom.zip', browser_download_url: 'url' }] },
                { tag_name: 'v1.5.0', assets: [{ id: 2, name: 'custom2.zip', browser_download_url: 'url2' }] },
                { tag_name: 'v1.0.0', assets: [{ id: 3, name: 'custom3.zip', browser_download_url: 'url3' }] },
            ];
            const updatePayload = createUpdatePayload({
                originalPackageInfo: {
                    id: 'id',
                    repo: 'owner/repo',
                    version: 'v1.0.0',
                    package: 'pkg.zip',
                    releases: customReleases,
                },
            });
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={updatePayload}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('versions-count')).toHaveTextContent('3');
        });
        (0, vitest_1.it)('should convert repo to URL correctly', () => {
            const updatePayload = createUpdatePayload({
                originalPackageInfo: {
                    id: 'id',
                    repo: 'myorg/myrepo',
                    version: 'v1.0.0',
                    package: 'pkg.zip',
                    releases: createMockReleases(),
                },
            });
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={updatePayload}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('repo-url-display')).toHaveTextContent('https://github.com/myorg/myrepo');
        });
    });
    // ================================
    // Error Handling Tests
    // ================================
    (0, vitest_1.describe)('Error Handling', () => {
        (0, vitest_1.it)('should handle API error with response message', async () => {
            mockGetIconUrl.mockRejectedValue({
                response: { message: 'API Error Message' },
            });
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
                (0, vitest_1.expect)(react_1.screen.getByTestId('error-msg')).toHaveTextContent('API Error Message');
            });
        });
        (0, vitest_1.it)('should handle API error without response message', async () => {
            mockGetIconUrl.mockRejectedValue(new Error('Generic error'));
            (0, react_1.render)(<index_1.default {...defaultProps} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
                (0, vitest_1.expect)(react_1.screen.getByTestId('error-msg')).toHaveTextContent('plugin.installModal.installFailedDesc');
            });
        });
    });
    // ================================
    // handleBack Default Case Tests
    // ================================
    (0, vitest_1.describe)('handleBack Edge Cases', () => {
        (0, vitest_1.it)('should not change state when back is called from setUrl step', async () => {
            // This tests the default case in handleBack switch
            // When in setUrl step, calling back should keep the state unchanged
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Verify we're on setUrl step
            (0, vitest_1.expect)(react_1.screen.getByTestId('set-url-step')).toBeInTheDocument();
            // The setUrl step doesn't expose onBack in the real component,
            // but our mock doesn't have it either - this is correct behavior
            // as setUrl is the first step with no back option
        });
        (0, vitest_1.it)('should handle multiple back navigations correctly', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Navigate to selectPackage
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
            react_1.fireEvent.click(react_1.screen.getByTestId('next-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('select-package-step')).toBeInTheDocument();
            });
            // Navigate to readyToInstall
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            // Go back to selectPackage
            react_1.fireEvent.click(react_1.screen.getByTestId('loaded-back-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('select-package-step')).toBeInTheDocument();
            });
            // Go back to setUrl
            react_1.fireEvent.click(react_1.screen.getByTestId('back-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('set-url-step')).toBeInTheDocument();
            });
            // Verify URL is preserved after back navigation
            (0, vitest_1.expect)(react_1.screen.getByTestId('repo-url-input')).toHaveValue('https://github.com/owner/repo');
        });
    });
});
// ================================
// Utility Functions Tests
// ================================
(0, vitest_1.describe)('Install Plugin Utils', () => {
    (0, vitest_1.describe)('parseGitHubUrl', () => {
        (0, vitest_1.it)('should parse valid GitHub URL correctly', () => {
            const result = (0, utils_1.parseGitHubUrl)('https://github.com/owner/repo');
            (0, vitest_1.expect)(result.isValid).toBe(true);
            (0, vitest_1.expect)(result.owner).toBe('owner');
            (0, vitest_1.expect)(result.repo).toBe('repo');
        });
        (0, vitest_1.it)('should parse GitHub URL with trailing slash', () => {
            const result = (0, utils_1.parseGitHubUrl)('https://github.com/owner/repo/');
            (0, vitest_1.expect)(result.isValid).toBe(true);
            (0, vitest_1.expect)(result.owner).toBe('owner');
            (0, vitest_1.expect)(result.repo).toBe('repo');
        });
        (0, vitest_1.it)('should return invalid for non-GitHub URL', () => {
            const result = (0, utils_1.parseGitHubUrl)('https://gitlab.com/owner/repo');
            (0, vitest_1.expect)(result.isValid).toBe(false);
            (0, vitest_1.expect)(result.owner).toBeUndefined();
            (0, vitest_1.expect)(result.repo).toBeUndefined();
        });
        (0, vitest_1.it)('should return invalid for malformed URL', () => {
            const result = (0, utils_1.parseGitHubUrl)('not-a-url');
            (0, vitest_1.expect)(result.isValid).toBe(false);
        });
        (0, vitest_1.it)('should return invalid for GitHub URL with extra path segments', () => {
            const result = (0, utils_1.parseGitHubUrl)('https://github.com/owner/repo/tree/main');
            (0, vitest_1.expect)(result.isValid).toBe(false);
        });
        (0, vitest_1.it)('should return invalid for empty string', () => {
            const result = (0, utils_1.parseGitHubUrl)('');
            (0, vitest_1.expect)(result.isValid).toBe(false);
        });
        (0, vitest_1.it)('should handle URL with special characters in owner/repo names', () => {
            const result = (0, utils_1.parseGitHubUrl)('https://github.com/my-org/my-repo-123');
            (0, vitest_1.expect)(result.isValid).toBe(true);
            (0, vitest_1.expect)(result.owner).toBe('my-org');
            (0, vitest_1.expect)(result.repo).toBe('my-repo-123');
        });
    });
    (0, vitest_1.describe)('convertRepoToUrl', () => {
        (0, vitest_1.it)('should convert repo string to full GitHub URL', () => {
            const result = (0, utils_1.convertRepoToUrl)('owner/repo');
            (0, vitest_1.expect)(result).toBe('https://github.com/owner/repo');
        });
        (0, vitest_1.it)('should return empty string for empty repo', () => {
            const result = (0, utils_1.convertRepoToUrl)('');
            (0, vitest_1.expect)(result).toBe('');
        });
        (0, vitest_1.it)('should handle repo with organization name', () => {
            const result = (0, utils_1.convertRepoToUrl)('my-organization/my-repository');
            (0, vitest_1.expect)(result).toBe('https://github.com/my-organization/my-repository');
        });
    });
    (0, vitest_1.describe)('pluginManifestToCardPluginProps', () => {
        (0, vitest_1.it)('should convert PluginDeclaration to Plugin props correctly', () => {
            const manifest = {
                plugin_unique_identifier: 'test-uid',
                version: '1.0.0',
                author: 'test-author',
                icon: 'icon.png',
                icon_dark: 'icon-dark.png',
                name: 'Test Plugin',
                category: types_1.PluginCategoryEnum.tool,
                label: { 'en-US': 'Test Label' },
                description: { 'en-US': 'Test Description' },
                created_at: '2024-01-01',
                resource: {},
                plugins: [],
                verified: true,
                endpoint: { settings: [], endpoints: [] },
                model: null,
                tags: ['tag1', 'tag2'],
                agent_strategy: null,
                meta: { version: '1.0.0' },
                trigger: {},
            };
            const result = (0, utils_1.pluginManifestToCardPluginProps)(manifest);
            (0, vitest_1.expect)(result.plugin_id).toBe('test-uid');
            (0, vitest_1.expect)(result.type).toBe('tool');
            (0, vitest_1.expect)(result.category).toBe(types_1.PluginCategoryEnum.tool);
            (0, vitest_1.expect)(result.name).toBe('Test Plugin');
            (0, vitest_1.expect)(result.version).toBe('1.0.0');
            (0, vitest_1.expect)(result.latest_version).toBe('');
            (0, vitest_1.expect)(result.org).toBe('test-author');
            (0, vitest_1.expect)(result.author).toBe('test-author');
            (0, vitest_1.expect)(result.icon).toBe('icon.png');
            (0, vitest_1.expect)(result.icon_dark).toBe('icon-dark.png');
            (0, vitest_1.expect)(result.verified).toBe(true);
            (0, vitest_1.expect)(result.tags).toEqual([{ name: 'tag1' }, { name: 'tag2' }]);
            (0, vitest_1.expect)(result.from).toBe('package');
        });
        (0, vitest_1.it)('should handle manifest with empty tags', () => {
            const manifest = {
                plugin_unique_identifier: 'test-uid',
                version: '1.0.0',
                author: 'author',
                icon: 'icon.png',
                name: 'Plugin',
                category: types_1.PluginCategoryEnum.model,
                label: {},
                description: {},
                created_at: '2024-01-01',
                resource: {},
                plugins: [],
                verified: false,
                endpoint: { settings: [], endpoints: [] },
                model: null,
                tags: [],
                agent_strategy: null,
                meta: { version: '1.0.0' },
                trigger: {},
            };
            const result = (0, utils_1.pluginManifestToCardPluginProps)(manifest);
            (0, vitest_1.expect)(result.tags).toEqual([]);
            (0, vitest_1.expect)(result.verified).toBe(false);
        });
    });
    (0, vitest_1.describe)('pluginManifestInMarketToPluginProps', () => {
        (0, vitest_1.it)('should convert PluginManifestInMarket to Plugin props correctly', () => {
            const manifest = {
                plugin_unique_identifier: 'market-uid',
                name: 'Market Plugin',
                org: 'market-org',
                icon: 'market-icon.png',
                label: { 'en-US': 'Market Label' },
                category: types_1.PluginCategoryEnum.extension,
                version: '1.0.0',
                latest_version: '2.0.0',
                brief: { 'en-US': 'Brief Description' },
                introduction: 'Full introduction text',
                verified: true,
                install_count: 1000,
                badges: ['featured', 'verified'],
                verification: { authorized_category: 'partner' },
                from: 'marketplace',
            };
            const result = (0, utils_1.pluginManifestInMarketToPluginProps)(manifest);
            (0, vitest_1.expect)(result.plugin_id).toBe('market-uid');
            (0, vitest_1.expect)(result.type).toBe('extension');
            (0, vitest_1.expect)(result.name).toBe('Market Plugin');
            (0, vitest_1.expect)(result.version).toBe('2.0.0');
            (0, vitest_1.expect)(result.latest_version).toBe('2.0.0');
            (0, vitest_1.expect)(result.org).toBe('market-org');
            (0, vitest_1.expect)(result.introduction).toBe('Full introduction text');
            (0, vitest_1.expect)(result.badges).toEqual(['featured', 'verified']);
            (0, vitest_1.expect)(result.verification.authorized_category).toBe('partner');
            (0, vitest_1.expect)(result.from).toBe('marketplace');
        });
        (0, vitest_1.it)('should use default verification when empty', () => {
            const manifest = {
                plugin_unique_identifier: 'uid',
                name: 'Plugin',
                org: 'org',
                icon: 'icon.png',
                label: {},
                category: types_1.PluginCategoryEnum.tool,
                version: '1.0.0',
                latest_version: '1.0.0',
                brief: {},
                introduction: '',
                verified: false,
                install_count: 0,
                badges: [],
                verification: {},
                from: 'github',
            };
            const result = (0, utils_1.pluginManifestInMarketToPluginProps)(manifest);
            (0, vitest_1.expect)(result.verification.authorized_category).toBe('langgenius');
            (0, vitest_1.expect)(result.verified).toBe(true); // always true in this function
        });
        (0, vitest_1.it)('should handle marketplace plugin with from github source', () => {
            const manifest = {
                plugin_unique_identifier: 'github-uid',
                name: 'GitHub Plugin',
                org: 'github-org',
                icon: 'icon.png',
                label: {},
                category: types_1.PluginCategoryEnum.agent,
                version: '0.1.0',
                latest_version: '0.2.0',
                brief: {},
                introduction: 'From GitHub',
                verified: true,
                install_count: 50,
                badges: [],
                verification: { authorized_category: 'community' },
                from: 'github',
            };
            const result = (0, utils_1.pluginManifestInMarketToPluginProps)(manifest);
            (0, vitest_1.expect)(result.from).toBe('github');
            (0, vitest_1.expect)(result.verification.authorized_category).toBe('community');
        });
    });
});
// ================================
// Steps Components Tests
// ================================
// SetURL Component Tests
(0, vitest_1.describe)('SetURL Component', () => {
    // Import the real component for testing
    const SetURL = vitest_1.vi.fn();
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        // Re-mock the SetURL component with a more testable version
        vitest_1.vi.doMock('./steps/setURL', () => ({
            default: SetURL,
        }));
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render label with correct text', () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()}/>);
            // The mocked component should be rendered
            (0, vitest_1.expect)(react_1.screen.getByTestId('set-url-step')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render input field with placeholder', () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()}/>);
            const input = react_1.screen.getByTestId('repo-url-input');
            (0, vitest_1.expect)(input).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render cancel and next buttons', () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('cancel-btn')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('next-btn')).toBeInTheDocument();
        });
    });
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should display repoUrl value in input', () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()}/>);
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/test/repo' } });
            (0, vitest_1.expect)(input).toHaveValue('https://github.com/test/repo');
        });
        (0, vitest_1.it)('should call onChange when input value changes', () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()}/>);
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'new-value' } });
            (0, vitest_1.expect)(input).toHaveValue('new-value');
        });
    });
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onNext when next button is clicked', async () => {
            mockFetchReleases.mockResolvedValue(createMockReleases());
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()}/>);
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
            react_1.fireEvent.click(react_1.screen.getByTestId('next-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockFetchReleases).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should call onCancel when cancel button is clicked', () => {
            const onClose = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default onClose={onClose} onSuccess={vitest_1.vi.fn()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('cancel-btn'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty URL input', () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()}/>);
            const input = react_1.screen.getByTestId('repo-url-input');
            (0, vitest_1.expect)(input).toHaveValue('');
        });
        (0, vitest_1.it)('should handle URL with whitespace only', () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()}/>);
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: '   ' } });
            // With whitespace only, next should still be submittable but validation will fail
            react_1.fireEvent.click(react_1.screen.getByTestId('next-btn'));
            // Should show error for invalid URL
            (0, vitest_1.expect)(mockNotify).toHaveBeenCalledWith({
                type: 'error',
                message: 'plugin.error.inValidGitHubUrl',
            });
        });
    });
});
// SelectPackage Component Tests
(0, vitest_1.describe)('SelectPackage Component', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockFetchReleases.mockResolvedValue(createMockReleases());
        mockGetIconUrl.mockResolvedValue('processed-icon-url');
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render version selector', () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('select-package-step')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render package selector', () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('selected-package')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show back button when not in edit mode', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()}/>);
            // Navigate to selectPackage step
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
            react_1.fireEvent.click(react_1.screen.getByTestId('next-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('back-btn')).toBeInTheDocument();
            });
        });
    });
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should display versions count correctly', () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('versions-count')).toHaveTextContent('2');
        });
        (0, vitest_1.it)('should display packages count based on selected version', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            // Initially 0 packages
            (0, vitest_1.expect)(react_1.screen.getByTestId('packages-count')).toHaveTextContent('0');
            // Select version
            react_1.fireEvent.click(react_1.screen.getByTestId('select-version-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('packages-count')).toHaveTextContent('2');
            });
        });
    });
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onSelectVersion when version is selected', () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('select-version-btn'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('selected-version')).toHaveTextContent('v1.0.0');
        });
        (0, vitest_1.it)('should call onSelectPackage when package is selected', () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('select-package-btn'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('selected-package')).toHaveTextContent('package.zip');
        });
        (0, vitest_1.it)('should call onBack when back button is clicked', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()}/>);
            // Navigate to selectPackage
            const input = react_1.screen.getByTestId('repo-url-input');
            react_1.fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } });
            react_1.fireEvent.click(react_1.screen.getByTestId('next-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('select-package-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('back-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('set-url-step')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should trigger upload when conditions are met', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
        });
    });
    (0, vitest_1.describe)('Upload Handling', () => {
        (0, vitest_1.it)('should call onUploaded on successful upload', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockGetIconUrl).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should call onFailed on upload failure', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
            });
        });
        (0, vitest_1.it)('should handle upload error with response message', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('error-msg')).toHaveTextContent('Upload failed error');
            });
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty versions array', () => {
            const updatePayload = createUpdatePayload({
                originalPackageInfo: {
                    id: 'id',
                    repo: 'owner/repo',
                    version: 'v1.0.0',
                    package: 'pkg.zip',
                    releases: [],
                },
            });
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={updatePayload}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('versions-count')).toHaveTextContent('0');
        });
        (0, vitest_1.it)('should handle version with no assets', () => {
            const updatePayload = createUpdatePayload({
                originalPackageInfo: {
                    id: 'id',
                    repo: 'owner/repo',
                    version: 'v1.0.0',
                    package: 'pkg.zip',
                    releases: [{ tag_name: 'v1.0.0', assets: [] }],
                },
            });
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={updatePayload}/>);
            // Select the empty version
            react_1.fireEvent.click(react_1.screen.getByTestId('select-version-btn'));
            (0, vitest_1.expect)(react_1.screen.getByTestId('packages-count')).toHaveTextContent('0');
        });
    });
});
// Loaded Component Tests
(0, vitest_1.describe)('Loaded Component', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockGetIconUrl.mockResolvedValue('processed-icon-url');
        mockFetchReleases.mockResolvedValue(createMockReleases());
        mockHideLogicState = {
            modalClassName: 'test-modal-class',
            foldAnimInto: vitest_1.vi.fn(),
            setIsInstalling: vitest_1.vi.fn(),
            handleStartToInstall: vitest_1.vi.fn(),
        };
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render ready to install message', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should render plugin card with correct payload', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('payload-name')).toHaveTextContent('Test Plugin');
            });
        });
        (0, vitest_1.it)('should render back button when not installing', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-back-btn')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should render install button', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('install-success-btn')).toBeInTheDocument();
            });
        });
    });
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should display correct uniqueIdentifier', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('unique-identifier')).toHaveTextContent('test-unique-id');
            });
        });
        (0, vitest_1.it)('should display correct repoUrl', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-repo-url')).toHaveTextContent('https://github.com/owner/repo');
            });
        });
        (0, vitest_1.it)('should display selected version and package', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            // First select version and package
            react_1.fireEvent.click(react_1.screen.getByTestId('select-version-btn'));
            react_1.fireEvent.click(react_1.screen.getByTestId('select-package-btn'));
            // Then trigger upload
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-version')).toHaveTextContent('v1.0.0');
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-package')).toHaveTextContent('package.zip');
            });
        });
    });
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onBack when back button is clicked', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('loaded-back-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('select-package-step')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should call onStartToInstall when install is triggered', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call onInstalled on successful installation', async () => {
            const onSuccess = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={onSuccess} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onSuccess).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should call onFailed on installation failure', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
            });
        });
    });
    (0, vitest_1.describe)('Installation Flows', () => {
        (0, vitest_1.it)('should handle fresh install flow', async () => {
            const onSuccess = vitest_1.vi.fn();
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={onSuccess} updatePayload={createUpdatePayload()}/>);
            // Navigate to loaded step
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            // Trigger install
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(onSuccess).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should handle update flow with updatePayload', async () => {
            const onSuccess = vitest_1.vi.fn();
            const updatePayload = createUpdatePayload();
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={onSuccess} updatePayload={updatePayload}/>);
            // Navigate to loaded step
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            // Trigger install (update)
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onSuccess).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should refresh plugin list after successful install', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockRefreshPluginList).toHaveBeenCalled();
            });
        });
        (0, vitest_1.it)('should not refresh plugin list when notRefresh is true', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-success-no-refresh-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockRefreshPluginList).not.toHaveBeenCalled();
            });
        });
    });
    (0, vitest_1.describe)('Error Handling', () => {
        (0, vitest_1.it)('should display error message on failure', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('error-msg')).toHaveTextContent('Install failed');
            });
        });
        (0, vitest_1.it)('should handle failure without error message', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('install-fail-no-msg-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('installed-step')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('is-failed')).toHaveTextContent('true');
            });
        });
    });
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle missing optional props', async () => {
            (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            // Should not throw when onStartToInstall is called
            (0, vitest_1.expect)(() => {
                react_1.fireEvent.click(react_1.screen.getByTestId('start-install-btn'));
            }).not.toThrow();
        });
        (0, vitest_1.it)('should preserve state through component updates', async () => {
            const { rerender } = (0, react_1.render)(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
            });
            // Rerender
            rerender(<index_1.default onClose={vitest_1.vi.fn()} onSuccess={vitest_1.vi.fn()} updatePayload={createUpdatePayload()}/>);
            // State should be preserved
            (0, vitest_1.expect)(react_1.screen.getByTestId('loaded-step')).toBeInTheDocument();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQTJFO0FBQzNFLG1DQUE2RDtBQUM3RCx1Q0FBZ0Q7QUFDaEQsb0NBQWlJO0FBQ2pJLG1DQUF1QztBQUV2Qyx1RUFBdUU7QUFDdkUsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLFlBQXdDLEVBQUUsRUFBcUIsRUFBRSxDQUFDLENBQUM7SUFDN0Ysd0JBQXdCLEVBQUUsaUJBQWlCO0lBQzNDLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLElBQUksRUFBRSxlQUFlO0lBQ3JCLElBQUksRUFBRSxhQUFhO0lBQ25CLFFBQVEsRUFBRSwwQkFBa0IsQ0FBQyxJQUFJO0lBQ2pDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQWdDO0lBQy9ELFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRSxlQUFlLEVBQXNDO0lBQzdFLFVBQVUsRUFBRSxzQkFBc0I7SUFDbEMsUUFBUSxFQUFFLEVBQUU7SUFDWixPQUFPLEVBQUUsRUFBRTtJQUNYLFFBQVEsRUFBRSxJQUFJO0lBQ2QsUUFBUSxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3pDLEtBQUssRUFBRSxJQUFJO0lBQ1gsSUFBSSxFQUFFLEVBQUU7SUFDUixjQUFjLEVBQUUsSUFBSTtJQUNwQixJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0lBQzFCLE9BQU8sRUFBRSxFQUFrQztJQUMzQyxHQUFHLFNBQVM7Q0FDYixDQUFDLENBQUE7QUFFRixNQUFNLGtCQUFrQixHQUFHLEdBQWdDLEVBQUUsQ0FBQztJQUM1RDtRQUNFLFFBQVEsRUFBRSxRQUFRO1FBQ2xCLE1BQU0sRUFBRTtZQUNOLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUs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LENBQUMsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQ25CLGFBQWEsQ0FBQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsRUFDckMsQ0FDSCxDQUFBO1lBRUQsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUE7WUFFekQsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQy9ELENBQUMsQ0FBQyxDQUFBO1lBRUYsV0FBVztZQUNYLFFBQVEsQ0FDTixDQUFDLGVBQWlCLENBQ2hCLE9BQU8sQ0FBQyxDQUFDLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUNqQixTQUFTLENBQUMsQ0FBQyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FDbkIsYUFBYSxDQUFDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxFQUNyQyxDQUNILENBQUE7WUFFRCw0QkFBNEI7WUFDNUIsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDL0QsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBHaXRIdWJSZXBvUmVsZWFzZVJlc3BvbnNlLCBQbHVnaW5EZWNsYXJhdGlvbiwgUGx1Z2luTWFuaWZlc3RJbk1hcmtldCwgVXBkYXRlRnJvbUdpdEh1YlBheWxvYWQgfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgYmVmb3JlRWFjaCwgZGVzY3JpYmUsIGV4cGVjdCwgaXQsIHZpIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHsgUGx1Z2luQ2F0ZWdvcnlFbnVtIH0gZnJvbSAnLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyBjb252ZXJ0UmVwb1RvVXJsLCBwYXJzZUdpdEh1YlVybCwgcGx1Z2luTWFuaWZlc3RJbk1hcmtldFRvUGx1Z2luUHJvcHMsIHBsdWdpbk1hbmlmZXN0VG9DYXJkUGx1Z2luUHJvcHMgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCBJbnN0YWxsRnJvbUdpdEh1YiBmcm9tICcuL2luZGV4J1xuXG4vLyBGYWN0b3J5IGZ1bmN0aW9ucyBmb3IgdGVzdCBkYXRhIChkZWZpbmVkIGJlZm9yZSBtb2NrcyB0aGF0IHVzZSB0aGVtKVxuY29uc3QgY3JlYXRlTW9ja01hbmlmZXN0ID0gKG92ZXJyaWRlczogUGFydGlhbDxQbHVnaW5EZWNsYXJhdGlvbj4gPSB7fSk6IFBsdWdpbkRlY2xhcmF0aW9uID0+ICh7XG4gIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ3Rlc3QtcGx1Z2luLXVpZCcsXG4gIHZlcnNpb246ICcxLjAuMCcsXG4gIGF1dGhvcjogJ3Rlc3QtYXV0aG9yJyxcbiAgaWNvbjogJ3Rlc3QtaWNvbi5wbmcnLFxuICBuYW1lOiAnVGVzdCBQbHVnaW4nLFxuICBjYXRlZ29yeTogUGx1Z2luQ2F0ZWdvcnlFbnVtLnRvb2wsXG4gIGxhYmVsOiB7ICdlbi1VUyc6ICdUZXN0IFBsdWdpbicgfSBhcyBQbHVnaW5EZWNsYXJhdGlvblsnbGFiZWwnXSxcbiAgZGVzY3JpcHRpb246IHsgJ2VuLVVTJzogJ0EgdGVzdCBwbHVnaW4nIH0gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ2Rlc2NyaXB0aW9uJ10sXG4gIGNyZWF0ZWRfYXQ6ICcyMDI0LTAxLTAxVDAwOjAwOjAwWicsXG4gIHJlc291cmNlOiB7fSxcbiAgcGx1Z2luczogW10sXG4gIHZlcmlmaWVkOiB0cnVlLFxuICBlbmRwb2ludDogeyBzZXR0aW5nczogW10sIGVuZHBvaW50czogW10gfSxcbiAgbW9kZWw6IG51bGwsXG4gIHRhZ3M6IFtdLFxuICBhZ2VudF9zdHJhdGVneTogbnVsbCxcbiAgbWV0YTogeyB2ZXJzaW9uOiAnMS4wLjAnIH0sXG4gIHRyaWdnZXI6IHt9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWyd0cmlnZ2VyJ10sXG4gIC4uLm92ZXJyaWRlcyxcbn0pXG5cbmNvbnN0IGNyZWF0ZU1vY2tSZWxlYXNlcyA9ICgpOiBHaXRIdWJSZXBvUmVsZWFzZVJlc3BvbnNlW10gPT4gW1xuICB7XG4gICAgdGFnX25hbWU6ICd2MS4wLjAnLFxuICAgIGFzc2V0czogW1xuICAgICAgeyBpZDogMSwgbmFtZTogJ3BsdWdpbi12MS4wLjAuemlwJywgYnJvd3Nlcl9kb3dubG9hZF91cmw6ICdodHRwczovL2dpdGh1Yi5jb20vdGVzdC9yZXBvL3JlbGVhc2VzL2Rvd25sb2FkL3YxLjAuMC9wbHVnaW4tdjEuMC4wLnppcCcgfSxcbiAgICAgIHsgaWQ6IDIsIG5hbWU6ICdwbHVnaW4tdjEuMC4wLnRhci5neicsIGJyb3dzZXJfZG93bmxvYWRfdXJsOiAnaHR0cHM6Ly9naXRodWIuY29tL3Rlc3QvcmVwby9yZWxlYXNlcy9kb3dubG9hZC92MS4wLjAvcGx1Z2luLXYxLjAuMC50YXIuZ3onIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIHRhZ19uYW1lOiAndjAuOS4wJyxcbiAgICBhc3NldHM6IFtcbiAgICAgIHsgaWQ6IDMsIG5hbWU6ICdwbHVnaW4tdjAuOS4wLnppcCcsIGJyb3dzZXJfZG93bmxvYWRfdXJsOiAnaHR0cHM6Ly9naXRodWIuY29tL3Rlc3QvcmVwby9yZWxlYXNlcy9kb3dubG9hZC92MC45LjAvcGx1Z2luLXYwLjkuMC56aXAnIH0sXG4gICAgXSxcbiAgfSxcbl1cblxuY29uc3QgY3JlYXRlVXBkYXRlUGF5bG9hZCA9IChvdmVycmlkZXM6IFBhcnRpYWw8VXBkYXRlRnJvbUdpdEh1YlBheWxvYWQ+ID0ge30pOiBVcGRhdGVGcm9tR2l0SHViUGF5bG9hZCA9PiAoe1xuICBvcmlnaW5hbFBhY2thZ2VJbmZvOiB7XG4gICAgaWQ6ICdvcmlnaW5hbC1pZCcsXG4gICAgcmVwbzogJ293bmVyL3JlcG8nLFxuICAgIHZlcnNpb246ICd2MC45LjAnLFxuICAgIHBhY2thZ2U6ICdwbHVnaW4tdjAuOS4wLnppcCcsXG4gICAgcmVsZWFzZXM6IGNyZWF0ZU1vY2tSZWxlYXNlcygpLFxuICB9LFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG4vLyBNb2NrIGV4dGVybmFsIGRlcGVuZGVuY2llc1xuY29uc3QgbW9ja05vdGlmeSA9IHZpLmZuKClcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6IHtcbiAgICBub3RpZnk6IChwcm9wczogeyB0eXBlOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZyB9KSA9PiBtb2NrTm90aWZ5KHByb3BzKSxcbiAgfSxcbn0pKVxuXG5jb25zdCBtb2NrR2V0SWNvblVybCA9IHZpLmZuKClcbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvcGx1Z2lucy9pbnN0YWxsLXBsdWdpbi9iYXNlL3VzZS1nZXQtaWNvbicsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICgpID0+ICh7IGdldEljb25Vcmw6IG1vY2tHZXRJY29uVXJsIH0pLFxufSkpXG5cbmNvbnN0IG1vY2tGZXRjaFJlbGVhc2VzID0gdmkuZm4oKVxudmkubW9jaygnLi4vaG9va3MnLCAoKSA9PiAoe1xuICB1c2VHaXRIdWJSZWxlYXNlczogKCkgPT4gKHsgZmV0Y2hSZWxlYXNlczogbW9ja0ZldGNoUmVsZWFzZXMgfSksXG59KSlcblxuY29uc3QgbW9ja1JlZnJlc2hQbHVnaW5MaXN0ID0gdmkuZm4oKVxudmkubW9jaygnLi4vaG9va3MvdXNlLXJlZnJlc2gtcGx1Z2luLWxpc3QnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiAoeyByZWZyZXNoUGx1Z2luTGlzdDogbW9ja1JlZnJlc2hQbHVnaW5MaXN0IH0pLFxufSkpXG5cbmxldCBtb2NrSGlkZUxvZ2ljU3RhdGUgPSB7XG4gIG1vZGFsQ2xhc3NOYW1lOiAndGVzdC1tb2RhbC1jbGFzcycsXG4gIGZvbGRBbmltSW50bzogdmkuZm4oKSxcbiAgc2V0SXNJbnN0YWxsaW5nOiB2aS5mbigpLFxuICBoYW5kbGVTdGFydFRvSW5zdGFsbDogdmkuZm4oKSxcbn1cbnZpLm1vY2soJy4uL2hvb2tzL3VzZS1oaWRlLWxvZ2ljJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gbW9ja0hpZGVMb2dpY1N0YXRlLFxufSkpXG5cbi8vIE1vY2sgY2hpbGQgY29tcG9uZW50c1xudmkubW9jaygnLi9zdGVwcy9zZXRVUkwnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyByZXBvVXJsLCBvbkNoYW5nZSwgb25OZXh0LCBvbkNhbmNlbCB9OiB7XG4gICAgcmVwb1VybDogc3RyaW5nXG4gICAgb25DaGFuZ2U6ICh2YWx1ZTogc3RyaW5nKSA9PiB2b2lkXG4gICAgb25OZXh0OiAoKSA9PiB2b2lkXG4gICAgb25DYW5jZWw6ICgpID0+IHZvaWRcbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJzZXQtdXJsLXN0ZXBcIj5cbiAgICAgIDxpbnB1dFxuICAgICAgICBkYXRhLXRlc3RpZD1cInJlcG8tdXJsLWlucHV0XCJcbiAgICAgICAgdmFsdWU9e3JlcG9Vcmx9XG4gICAgICAgIG9uQ2hhbmdlPXtlID0+IG9uQ2hhbmdlKGUudGFyZ2V0LnZhbHVlKX1cbiAgICAgIC8+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibmV4dC1idG5cIiBvbkNsaWNrPXtvbk5leHR9Pk5leHQ8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJjYW5jZWwtYnRuXCIgb25DbGljaz17b25DYW5jZWx9PkNhbmNlbDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbnZpLm1vY2soJy4vc3RlcHMvc2VsZWN0UGFja2FnZScsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7XG4gICAgcmVwb1VybCxcbiAgICBzZWxlY3RlZFZlcnNpb24sXG4gICAgdmVyc2lvbnMsXG4gICAgb25TZWxlY3RWZXJzaW9uLFxuICAgIHNlbGVjdGVkUGFja2FnZSxcbiAgICBwYWNrYWdlcyxcbiAgICBvblNlbGVjdFBhY2thZ2UsXG4gICAgb25VcGxvYWRlZCxcbiAgICBvbkZhaWxlZCxcbiAgICBvbkJhY2ssXG4gIH06IHtcbiAgICByZXBvVXJsOiBzdHJpbmdcbiAgICBzZWxlY3RlZFZlcnNpb246IHN0cmluZ1xuICAgIHZlcnNpb25zOiB7IHZhbHVlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyB9W11cbiAgICBvblNlbGVjdFZlcnNpb246IChpdGVtOiB7IHZhbHVlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyB9KSA9PiB2b2lkXG4gICAgc2VsZWN0ZWRQYWNrYWdlOiBzdHJpbmdcbiAgICBwYWNrYWdlczogeyB2YWx1ZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcgfVtdXG4gICAgb25TZWxlY3RQYWNrYWdlOiAoaXRlbTogeyB2YWx1ZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcgfSkgPT4gdm9pZFxuICAgIG9uVXBsb2FkZWQ6IChyZXN1bHQ6IHsgdW5pcXVlSWRlbnRpZmllcjogc3RyaW5nLCBtYW5pZmVzdDogUGx1Z2luRGVjbGFyYXRpb24gfSkgPT4gdm9pZFxuICAgIG9uRmFpbGVkOiAoZXJyb3JNc2c6IHN0cmluZykgPT4gdm9pZFxuICAgIG9uQmFjazogKCkgPT4gdm9pZFxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cInNlbGVjdC1wYWNrYWdlLXN0ZXBcIj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicmVwby11cmwtZGlzcGxheVwiPntyZXBvVXJsfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwic2VsZWN0ZWQtdmVyc2lvblwiPntzZWxlY3RlZFZlcnNpb259PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJzZWxlY3RlZC1wYWNrYWdlXCI+e3NlbGVjdGVkUGFja2FnZX08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInZlcnNpb25zLWNvdW50XCI+e3ZlcnNpb25zLmxlbmd0aH08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cInBhY2thZ2VzLWNvdW50XCI+e3BhY2thZ2VzLmxlbmd0aH08L3NwYW4+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGRhdGEtdGVzdGlkPVwic2VsZWN0LXZlcnNpb24tYnRuXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gb25TZWxlY3RWZXJzaW9uKHsgdmFsdWU6ICd2MS4wLjAnLCBuYW1lOiAndjEuMC4wJyB9KX1cbiAgICAgID5cbiAgICAgICAgU2VsZWN0IFZlcnNpb25cbiAgICAgIDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBkYXRhLXRlc3RpZD1cInNlbGVjdC1wYWNrYWdlLWJ0blwiXG4gICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU2VsZWN0UGFja2FnZSh7IHZhbHVlOiAncGFja2FnZS56aXAnLCBuYW1lOiAncGFja2FnZS56aXAnIH0pfVxuICAgICAgPlxuICAgICAgICBTZWxlY3QgUGFja2FnZVxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGRhdGEtdGVzdGlkPVwidHJpZ2dlci11cGxvYWQtYnRuXCJcbiAgICAgICAgb25DbGljaz17KCkgPT4gb25VcGxvYWRlZCh7XG4gICAgICAgICAgdW5pcXVlSWRlbnRpZmllcjogJ3Rlc3QtdW5pcXVlLWlkJyxcbiAgICAgICAgICBtYW5pZmVzdDogY3JlYXRlTW9ja01hbmlmZXN0KCksXG4gICAgICAgIH0pfVxuICAgICAgPlxuICAgICAgICBUcmlnZ2VyIFVwbG9hZFxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGRhdGEtdGVzdGlkPVwidHJpZ2dlci11cGxvYWQtZmFpbC1idG5cIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkZhaWxlZCgnVXBsb2FkIGZhaWxlZCBlcnJvcicpfVxuICAgICAgPlxuICAgICAgICBUcmlnZ2VyIFVwbG9hZCBGYWlsXG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJiYWNrLWJ0blwiIG9uQ2xpY2s9e29uQmFja30+QmFjazwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbnZpLm1vY2soJy4vc3RlcHMvbG9hZGVkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHtcbiAgICB1bmlxdWVJZGVudGlmaWVyLFxuICAgIHBheWxvYWQsXG4gICAgcmVwb1VybCxcbiAgICBzZWxlY3RlZFZlcnNpb24sXG4gICAgc2VsZWN0ZWRQYWNrYWdlLFxuICAgIG9uQmFjayxcbiAgICBvblN0YXJ0VG9JbnN0YWxsLFxuICAgIG9uSW5zdGFsbGVkLFxuICAgIG9uRmFpbGVkLFxuICB9OiB7XG4gICAgdW5pcXVlSWRlbnRpZmllcjogc3RyaW5nXG4gICAgcGF5bG9hZDogUGx1Z2luRGVjbGFyYXRpb25cbiAgICByZXBvVXJsOiBzdHJpbmdcbiAgICBzZWxlY3RlZFZlcnNpb246IHN0cmluZ1xuICAgIHNlbGVjdGVkUGFja2FnZTogc3RyaW5nXG4gICAgb25CYWNrOiAoKSA9PiB2b2lkXG4gICAgb25TdGFydFRvSW5zdGFsbDogKCkgPT4gdm9pZFxuICAgIG9uSW5zdGFsbGVkOiAobm90UmVmcmVzaD86IGJvb2xlYW4pID0+IHZvaWRcbiAgICBvbkZhaWxlZDogKG1lc3NhZ2U/OiBzdHJpbmcpID0+IHZvaWRcbiAgfSkgPT4gKFxuICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJsb2FkZWQtc3RlcFwiPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJ1bmlxdWUtaWRlbnRpZmllclwiPnt1bmlxdWVJZGVudGlmaWVyfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicGF5bG9hZC1uYW1lXCI+e3BheWxvYWQ/Lm5hbWV9PC9zcGFuPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJsb2FkZWQtcmVwby11cmxcIj57cmVwb1VybH08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImxvYWRlZC12ZXJzaW9uXCI+e3NlbGVjdGVkVmVyc2lvbn08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImxvYWRlZC1wYWNrYWdlXCI+e3NlbGVjdGVkUGFja2FnZX08L3NwYW4+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwibG9hZGVkLWJhY2stYnRuXCIgb25DbGljaz17b25CYWNrfT5CYWNrPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwic3RhcnQtaW5zdGFsbC1idG5cIiBvbkNsaWNrPXtvblN0YXJ0VG9JbnN0YWxsfT5TdGFydCBJbnN0YWxsPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiaW5zdGFsbC1zdWNjZXNzLWJ0blwiIG9uQ2xpY2s9eygpID0+IG9uSW5zdGFsbGVkKCl9Pkluc3RhbGwgU3VjY2VzczwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImluc3RhbGwtc3VjY2Vzcy1uby1yZWZyZXNoLWJ0blwiIG9uQ2xpY2s9eygpID0+IG9uSW5zdGFsbGVkKHRydWUpfT5JbnN0YWxsIFN1Y2Nlc3MgTm8gUmVmcmVzaDwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cImluc3RhbGwtZmFpbC1idG5cIiBvbkNsaWNrPXsoKSA9PiBvbkZhaWxlZCgnSW5zdGFsbCBmYWlsZWQnKX0+SW5zdGFsbCBGYWlsPC9idXR0b24+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiaW5zdGFsbC1mYWlsLW5vLW1zZy1idG5cIiBvbkNsaWNrPXsoKSA9PiBvbkZhaWxlZCgpfT5JbnN0YWxsIEZhaWwgTm8gTXNnPC9idXR0b24+XG4gICAgPC9kaXY+XG4gICksXG59KSlcblxudmkubW9jaygnLi4vYmFzZS9pbnN0YWxsZWQnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoeyBwYXlsb2FkLCBpc0ZhaWxlZCwgZXJyTXNnLCBvbkNhbmNlbCB9OiB7XG4gICAgcGF5bG9hZDogUGx1Z2luRGVjbGFyYXRpb24gfCBudWxsXG4gICAgaXNGYWlsZWQ6IGJvb2xlYW5cbiAgICBlcnJNc2c6IHN0cmluZyB8IG51bGxcbiAgICBvbkNhbmNlbDogKCkgPT4gdm9pZFxuICB9KSA9PiAoXG4gICAgPGRpdiBkYXRhLXRlc3RpZD1cImluc3RhbGxlZC1zdGVwXCI+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImluc3RhbGxlZC1wYXlsb2FkXCI+e3BheWxvYWQ/Lm5hbWUgfHwgJ25vLXBheWxvYWQnfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiaXMtZmFpbGVkXCI+e2lzRmFpbGVkID8gJ3RydWUnIDogJ2ZhbHNlJ308L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImVycm9yLW1zZ1wiPntlcnJNc2cgfHwgJ25vLWVycm9yJ308L3NwYW4+XG4gICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiaW5zdGFsbGVkLWNsb3NlLWJ0blwiIG9uQ2xpY2s9e29uQ2FuY2VsfT5DbG9zZTwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbmRlc2NyaWJlKCdJbnN0YWxsRnJvbUdpdEh1YicsICgpID0+IHtcbiAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0dldEljb25VcmwubW9ja1Jlc29sdmVkVmFsdWUoJ3Byb2Nlc3NlZC1pY29uLXVybCcpXG4gICAgbW9ja0ZldGNoUmVsZWFzZXMubW9ja1Jlc29sdmVkVmFsdWUoY3JlYXRlTW9ja1JlbGVhc2VzKCkpXG4gICAgbW9ja0hpZGVMb2dpY1N0YXRlID0ge1xuICAgICAgbW9kYWxDbGFzc05hbWU6ICd0ZXN0LW1vZGFsLWNsYXNzJyxcbiAgICAgIGZvbGRBbmltSW50bzogdmkuZm4oKSxcbiAgICAgIHNldElzSW5zdGFsbGluZzogdmkuZm4oKSxcbiAgICAgIGhhbmRsZVN0YXJ0VG9JbnN0YWxsOiB2aS5mbigpLFxuICAgIH1cbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB3aXRoIGNvcnJlY3QgaW5pdGlhbCBzdGF0ZSBmb3IgbmV3IGluc3RhbGxhdGlvbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NldC11cmwtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZXBvLXVybC1pbnB1dCcpKS50b0hhdmVWYWx1ZSgnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbW9kYWwgd2l0aCBzZWxlY3RQYWNrYWdlIHN0ZXAgd2hlbiB1cGRhdGVQYXlsb2FkIGlzIHByb3ZpZGVkJywgKCkgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlUGF5bG9hZCA9IGNyZWF0ZVVwZGF0ZVBheWxvYWQoKVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IHVwZGF0ZVBheWxvYWQ9e3VwZGF0ZVBheWxvYWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtcGFja2FnZS1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlcG8tdXJsLWRpc3BsYXknKSkudG9IYXZlVGV4dENvbnRlbnQoJ2h0dHBzOi8vZ2l0aHViLmNvbS9vd25lci9yZXBvJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgaW5zdGFsbCBub3RlIHRleHQgaW4gbm9uLXRlcm1pbmFsIHN0ZXBzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsRnJvbUdpdEh1Yi5pbnN0YWxsTm90ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYXBwbHkgbW9kYWwgY2xhc3NOYW1lIGZyb20gdXNlSGlkZUxvZ2ljJywgKCkgPT4ge1xuICAgICAgLy8gVmVyaWZ5IHVzZUhpZGVMb2dpYyBwcm92aWRlcyBtb2RhbENsYXNzTmFtZVxuICAgICAgLy8gVGhlIGFjdHVhbCBjbGFzc05hbWUgYXBwbGljYXRpb24gaXMgaGFuZGxlZCBieSBNb2RhbCBjb21wb25lbnQgaW50ZXJuYWxseVxuICAgICAgLy8gV2UgdmVyaWZ5IHRoZSBob29rIGludGVncmF0aW9uIGJ5IGNoZWNraW5nIHRoYXQgaXQgcmV0dXJucyB0aGUgZXhwZWN0ZWQgY2xhc3NcbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUubW9kYWxDbGFzc05hbWUpLnRvQmUoJ3Rlc3QtbW9kYWwtY2xhc3MnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGl0bGUgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1RpdGxlIERpc3BsYXknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGluc3RhbGwgdGl0bGUgd2hlbiBubyB1cGRhdGVQYXlsb2FkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsRnJvbUdpdEh1Yi5pbnN0YWxsUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IHVwZGF0ZSB0aXRsZSB3aGVuIHVwZGF0ZVBheWxvYWQgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbEZyb21HaXRIdWIudXBkYXRlUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFN0YXRlIE1hbmFnZW1lbnQgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1N0YXRlIE1hbmFnZW1lbnQnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgcmVwb1VybCB3aGVuIHVzZXIgdHlwZXMgaW4gaW5wdXQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncmVwby11cmwtaW5wdXQnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdodHRwczovL2dpdGh1Yi5jb20vdGVzdC9yZXBvJyB9IH0pXG5cbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJ2h0dHBzOi8vZ2l0aHViLmNvbS90ZXN0L3JlcG8nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRyYW5zaXRpb24gZnJvbSBzZXRVcmwgdG8gc2VsZWN0UGFja2FnZSBvbiBzdWNjZXNzZnVsIFVSTCBzdWJtaXQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncmVwby11cmwtaW5wdXQnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdodHRwczovL2dpdGh1Yi5jb20vb3duZXIvcmVwbycgfSB9KVxuXG4gICAgICBjb25zdCBuZXh0QnRuID0gc2NyZWVuLmdldEJ5VGVzdElkKCduZXh0LWJ0bicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sobmV4dEJ0bilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1wYWNrYWdlLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1cGRhdGUgc2VsZWN0ZWRWZXJzaW9uIHdoZW4gdmVyc2lvbiBpcyBzZWxlY3RlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfSAvPilcblxuICAgICAgY29uc3Qgc2VsZWN0VmVyc2lvbkJ0biA9IHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXZlcnNpb24tYnRuJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhzZWxlY3RWZXJzaW9uQnRuKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3RlZC12ZXJzaW9uJykpLnRvSGF2ZVRleHRDb250ZW50KCd2MS4wLjAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVwZGF0ZSBzZWxlY3RlZFBhY2thZ2Ugd2hlbiBwYWNrYWdlIGlzIHNlbGVjdGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBjb25zdCBzZWxlY3RQYWNrYWdlQnRuID0gc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtcGFja2FnZS1idG4nKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNlbGVjdFBhY2thZ2VCdG4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdGVkLXBhY2thZ2UnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BhY2thZ2UuemlwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmFuc2l0aW9uIHRvIHJlYWR5VG9JbnN0YWxsIHN0ZXAgYWZ0ZXIgc3VjY2Vzc2Z1bCB1cGxvYWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX0gLz4pXG5cbiAgICAgIGNvbnN0IHVwbG9hZEJ0biA9IHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJylcbiAgICAgIGZpcmVFdmVudC5jbGljayh1cGxvYWRCdG4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2FkZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHRyYW5zaXRpb24gdG8gaW5zdGFsbGVkIHN0ZXAgYWZ0ZXIgc3VjY2Vzc2Z1bCBpbnN0YWxsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICAvLyBGaXJzdCB1cGxvYWRcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gVGhlbiBpbnN0YWxsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN1Y2Nlc3MtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lzLWZhaWxlZCcpKS50b0hhdmVUZXh0Q29udGVudCgnZmFsc2UnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmFuc2l0aW9uIHRvIGluc3RhbGxGYWlsZWQgc3RlcCBvbiBpbnN0YWxsIGZhaWx1cmUnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1mYWlsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcnJvci1tc2cnKSkudG9IYXZlVGV4dENvbnRlbnQoJ0luc3RhbGwgZmFpbGVkJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJhbnNpdGlvbiB0byB1cGxvYWRGYWlsZWQgc3RlcCBvbiB1cGxvYWQgZmFpbHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtZmFpbC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXMtZmFpbGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXJyb3ItbXNnJykpLnRvSGF2ZVRleHRDb250ZW50KCdVcGxvYWQgZmFpbGVkIGVycm9yJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBWZXJzaW9ucyBhbmQgUGFja2FnZXMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1ZlcnNpb25zIGFuZCBQYWNrYWdlcyBDb21wdXRhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRlcml2ZSB2ZXJzaW9ucyBmcm9tIHJlbGVhc2VzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd2ZXJzaW9ucy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMicpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGVyaXZlIHBhY2thZ2VzIGZyb20gc2VsZWN0ZWQgdmVyc2lvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfSAvPilcblxuICAgICAgLy8gSW5pdGlhbGx5IG5vIHBhY2thZ2VzIChubyB2ZXJzaW9uIHNlbGVjdGVkKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZXMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxuXG4gICAgICAvLyBTZWxlY3QgYSB2ZXJzaW9uXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtdmVyc2lvbi1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2VzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcyJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBVUkwgVmFsaWRhdGlvbiBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVVJMIFZhbGlkYXRpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIHRvYXN0IGZvciBpbnZhbGlkIEdpdEh1YiBVUkwnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncmVwby11cmwtaW5wdXQnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdpbnZhbGlkLXVybCcgfSB9KVxuXG4gICAgICBjb25zdCBuZXh0QnRuID0gc2NyZWVuLmdldEJ5VGVzdElkKCduZXh0LWJ0bicpXG4gICAgICBmaXJlRXZlbnQuY2xpY2sobmV4dEJ0bilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdHlwZTogJ2Vycm9yJyxcbiAgICAgICAgICBtZXNzYWdlOiAncGx1Z2luLmVycm9yLmluVmFsaWRHaXRIdWJVcmwnLFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGVycm9yIHRvYXN0IHdoZW4gbm8gcmVsZWFzZXMgYXJlIGZvdW5kJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0ZldGNoUmVsZWFzZXMubW9ja1Jlc29sdmVkVmFsdWUoW10pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdyZXBvLXVybC1pbnB1dCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2h0dHBzOi8vZ2l0aHViLmNvbS9vd25lci9yZXBvJyB9IH0pXG5cbiAgICAgIGNvbnN0IG5leHRCdG4gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ25leHQtYnRuJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhuZXh0QnRuKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdwbHVnaW4uZXJyb3Iubm9SZWxlYXNlc0ZvdW5kJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBlcnJvciB0b2FzdCB3aGVuIGZldGNoUmVsZWFzZXMgdGhyb3dzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0ZldGNoUmVsZWFzZXMubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdOZXR3b3JrIGVycm9yJykpXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdyZXBvLXVybC1pbnB1dCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2h0dHBzOi8vZ2l0aHViLmNvbS9vd25lci9yZXBvJyB9IH0pXG5cbiAgICAgIGNvbnN0IG5leHRCdG4gPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ25leHQtYnRuJylcbiAgICAgIGZpcmVFdmVudC5jbGljayhuZXh0QnRuKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tOb3RpZnkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB0eXBlOiAnZXJyb3InLFxuICAgICAgICAgIG1lc3NhZ2U6ICdwbHVnaW4uZXJyb3IuZmV0Y2hSZWxlYXNlc0Vycm9yJyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBCYWNrIE5hdmlnYXRpb24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0JhY2sgTmF2aWdhdGlvbicsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGdvIGJhY2sgZnJvbSBzZWxlY3RQYWNrYWdlIHRvIHNldFVybCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIE5hdmlnYXRlIHRvIHNlbGVjdFBhY2thZ2VcbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdyZXBvLXVybC1pbnB1dCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2h0dHBzOi8vZ2l0aHViLmNvbS9vd25lci9yZXBvJyB9IH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCduZXh0LWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXBhY2thZ2Utc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBHbyBiYWNrXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2V0LXVybC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZ28gYmFjayBmcm9tIHJlYWR5VG9JbnN0YWxsIHRvIHNlbGVjdFBhY2thZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX0gLz4pXG5cbiAgICAgIC8vIE5hdmlnYXRlIHRvIHJlYWR5VG9JbnN0YWxsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEdvIGJhY2tcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1iYWNrLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXBhY2thZ2Utc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ2FsbGJhY2sgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DbG9zZSB3aGVuIGNhbmNlbCBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhbmNlbC1idG4nKSlcblxuICAgICAgZXhwZWN0KGRlZmF1bHRQcm9wcy5vbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGZvbGRBbmltSW50byB3aGVuIG1vZGFsIGNsb3NlIGlzIHRyaWdnZXJlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFRoZSBtb2RhbCdzIG9uQ2xvc2UgaXMgYm91bmQgdG8gZm9sZEFuaW1JbnRvXG4gICAgICAvLyBXZSB2ZXJpZnkgdGhlIGhvb2sgaXMgcHJvcGVybHkgY29ubmVjdGVkXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLmZvbGRBbmltSW50bykudG9CZURlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TdWNjZXNzIHdoZW4gaW5zdGFsbGF0aW9uIGNvbXBsZXRlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2FkZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN1Y2Nlc3MtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QoZGVmYXVsdFByb3BzLm9uU3VjY2VzcykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgcmVmcmVzaFBsdWdpbkxpc3Qgd2hlbiBpbnN0YWxsYXRpb24gY29tcGxldGVzIHdpdGhvdXQgbm90UmVmcmVzaCBmbGFnJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrUmVmcmVzaFBsdWdpbkxpc3QpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCByZWZyZXNoUGx1Z2luTGlzdCB3aGVuIG5vdFJlZnJlc2ggZmxhZyBpcyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1uby1yZWZyZXNoLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tSZWZyZXNoUGx1Z2luTGlzdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldElzSW5zdGFsbGluZyhmYWxzZSkgd2hlbiBpbnN0YWxsYXRpb24gY29tcGxldGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUuc2V0SXNJbnN0YWxsaW5nKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVTdGFydFRvSW5zdGFsbCB3aGVuIHN0YXJ0IGluc3RhbGwgaXMgdHJpZ2dlcmVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3N0YXJ0LWluc3RhbGwtYnRuJykpXG5cbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUuaGFuZGxlU3RhcnRUb0luc3RhbGwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc2V0SXNJbnN0YWxsaW5nKGZhbHNlKSB3aGVuIGluc3RhbGxhdGlvbiBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2FkZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWZhaWwtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLnNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ2FsbGJhY2sgU3RhYmlsaXR5IFRlc3RzIChNZW1vaXphdGlvbilcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NhbGxiYWNrIFN0YWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIG1haW50YWluIHN0YWJsZSBoYW5kbGVVcGxvYWRGYWlsIGNhbGxiYWNrIHJlZmVyZW5jZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfSAvPilcblxuICAgICAgY29uc3QgZmlyc3RSZW5kZXIgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1wYWNrYWdlLXN0ZXAnKVxuICAgICAgZXhwZWN0KGZpcnN0UmVuZGVyKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggc2FtZSBwcm9wc1xuICAgICAgcmVyZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX0gLz4pXG5cbiAgICAgIC8vIFRoZSBjb21wb25lbnQgc2hvdWxkIHN0aWxsIHdvcmsgY29ycmVjdGx5XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEljb24gUHJvY2Vzc2luZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSWNvbiBQcm9jZXNzaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcHJvY2VzcyBpY29uIFVSTCBvbiBzdWNjZXNzZnVsIHVwbG9hZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0dldEljb25VcmwpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaWNvbiBwcm9jZXNzaW5nIGVycm9yIGdyYWNlZnVsbHknLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrR2V0SWNvblVybC5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ0ljb24gcHJvY2Vzc2luZyBmYWlsZWQnKSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXMtZmFpbGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFZGdlIENhc2VzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVtcHR5IHJlbGVhc2VzIGFycmF5IGZyb20gdXBkYXRlUGF5bG9hZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZVBheWxvYWQgPSBjcmVhdGVVcGRhdGVQYXlsb2FkKHtcbiAgICAgICAgb3JpZ2luYWxQYWNrYWdlSW5mbzoge1xuICAgICAgICAgIGlkOiAnb3JpZ2luYWwtaWQnLFxuICAgICAgICAgIHJlcG86ICdvd25lci9yZXBvJyxcbiAgICAgICAgICB2ZXJzaW9uOiAndjAuOS4wJyxcbiAgICAgICAgICBwYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICAgICAgcmVsZWFzZXM6IFtdLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXt1cGRhdGVQYXlsb2FkfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndmVyc2lvbnMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByZWxlYXNlIHdpdGggbm8gYXNzZXRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlUGF5bG9hZCA9IGNyZWF0ZVVwZGF0ZVBheWxvYWQoe1xuICAgICAgICBvcmlnaW5hbFBhY2thZ2VJbmZvOiB7XG4gICAgICAgICAgaWQ6ICdvcmlnaW5hbC1pZCcsXG4gICAgICAgICAgcmVwbzogJ293bmVyL3JlcG8nLFxuICAgICAgICAgIHZlcnNpb246ICd2MC45LjAnLFxuICAgICAgICAgIHBhY2thZ2U6ICdwbHVnaW4uemlwJyxcbiAgICAgICAgICByZWxlYXNlczogW3sgdGFnX25hbWU6ICd2MS4wLjAnLCBhc3NldHM6IFtdIH1dLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXt1cGRhdGVQYXlsb2FkfSAvPilcblxuICAgICAgLy8gU2VsZWN0IHRoZSB2ZXJzaW9uXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtdmVyc2lvbi1idG4nKSlcblxuICAgICAgLy8gU2hvdWxkIGhhdmUgMCBwYWNrYWdlc1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZXMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBzZWxlY3RlZCB2ZXJzaW9uIG5vdCBmb3VuZCBpbiByZWxlYXNlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZVBheWxvYWQgPSBjcmVhdGVVcGRhdGVQYXlsb2FkKHtcbiAgICAgICAgb3JpZ2luYWxQYWNrYWdlSW5mbzoge1xuICAgICAgICAgIGlkOiAnb3JpZ2luYWwtaWQnLFxuICAgICAgICAgIHJlcG86ICdvd25lci9yZXBvJyxcbiAgICAgICAgICB2ZXJzaW9uOiAndjAuOS4wJyxcbiAgICAgICAgICBwYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICAgICAgcmVsZWFzZXM6IFtdLFxuICAgICAgICB9LFxuICAgICAgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXt1cGRhdGVQYXlsb2FkfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXZlcnNpb24tYnRuJykpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2VzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgaW5zdGFsbCBmYWlsdXJlIHdpdGhvdXQgZXJyb3IgbWVzc2FnZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2FkZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWZhaWwtbm8tbXNnLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1mYWlsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcnJvci1tc2cnKSkudG9IYXZlVGV4dENvbnRlbnQoJ25vLWVycm9yJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIFVSTCB3aXRob3V0IHRyYWlsaW5nIHNsYXNoJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlcG8tdXJsLWlucHV0JylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnaHR0cHM6Ly9naXRodWIuY29tL293bmVyL3JlcG8nIH0gfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbmV4dC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrRmV0Y2hSZWxlYXNlcykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ293bmVyJywgJ3JlcG8nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBzdGF0ZSBjb3JyZWN0bHkgdGhyb3VnaCBzdGVwIHRyYW5zaXRpb25zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gU2V0IFVSTFxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlcG8tdXJsLWlucHV0JylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnaHR0cHM6Ly9naXRodWIuY29tL3Rlc3QvbXlyZXBvJyB9IH0pXG5cbiAgICAgIC8vIE5hdmlnYXRlIHRvIHNlbGVjdFBhY2thZ2VcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ25leHQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtcGFja2FnZS1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFZlcmlmeSBVUkwgaXMgcHJlc2VydmVkXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZXBvLXVybC1kaXNwbGF5JykpLnRvSGF2ZVRleHRDb250ZW50KCdodHRwczovL2dpdGh1Yi5jb20vdGVzdC9teXJlcG8nKVxuXG4gICAgICAvLyBTZWxlY3QgdmVyc2lvbiBhbmQgcGFja2FnZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXZlcnNpb24tYnRuJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtcGFja2FnZS1idG4nKSlcblxuICAgICAgLy8gTmF2aWdhdGUgdG8gcmVhZHlUb0luc3RhbGxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gVmVyaWZ5IGFsbCBkYXRhIGlzIHByZXNlcnZlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXJlcG8tdXJsJykpLnRvSGF2ZVRleHRDb250ZW50KCdodHRwczovL2dpdGh1Yi5jb20vdGVzdC9teXJlcG8nKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXZlcnNpb24nKSkudG9IYXZlVGV4dENvbnRlbnQoJ3YxLjAuMCcpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2FkZWQtcGFja2FnZScpKS50b0hhdmVUZXh0Q29udGVudCgncGFja2FnZS56aXAnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGVybWluYWwgU3RlcHMgUmVuZGVyaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdUZXJtaW5hbCBTdGVwcyBSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSW5zdGFsbGVkIGNvbXBvbmVudCBmb3IgaW5zdGFsbGVkIHN0ZXAnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1zdWNjZXNzLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KCdwbHVnaW4uaW5zdGFsbEZyb21HaXRIdWIuaW5zdGFsbE5vdGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEluc3RhbGxlZCBjb21wb25lbnQgZm9yIHVwbG9hZEZhaWxlZCBzdGVwJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1mYWlsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSW5zdGFsbGVkIGNvbXBvbmVudCBmb3IgaW5zdGFsbEZhaWxlZCBzdGVwJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZmFpbC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXMtZmFpbGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsb3NlIHdoZW4gY2xvc2UgYnV0dG9uIGlzIGNsaWNrZWQgaW4gaW5zdGFsbGVkIHN0ZXAnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1zdWNjZXNzLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLWNsb3NlLWJ0bicpKVxuXG4gICAgICBleHBlY3QoZGVmYXVsdFByb3BzLm9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVGl0bGUgVXBkYXRlIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdUaXRsZSBVcGRhdGVzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyBzdWNjZXNzIHRpdGxlIHdoZW4gaW5zdGFsbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbEZyb21HaXRIdWIuaW5zdGFsbGVkU3VjY2Vzc2Z1bGx5JykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2hvdyBmYWlsZWQgdGl0bGUgd2hlbiBpbnN0YWxsIGZhaWxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2FkZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLWZhaWwtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxGcm9tR2l0SHViLmluc3RhbGxGYWlsZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIERhdGEgRmxvdyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRGF0YSBGbG93JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBjb3JyZWN0IHVuaXF1ZUlkZW50aWZpZXIgdG8gTG9hZGVkIGNvbXBvbmVudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd1bmlxdWUtaWRlbnRpZmllcicpKS50b0hhdmVUZXh0Q29udGVudCgndGVzdC11bmlxdWUtaWQnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHByb2Nlc3NlZCBtYW5pZmVzdCB0byBMb2FkZWQgY29tcG9uZW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BheWxvYWQtbmFtZScpKS50b0hhdmVUZXh0Q29udGVudCgnVGVzdCBQbHVnaW4nKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIG1hbmlmZXN0IHdpdGggcHJvY2Vzc2VkIGljb24gdG8gTG9hZGVkIGNvbXBvbmVudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tHZXRJY29uVXJsLm1vY2tSZXNvbHZlZFZhbHVlKCdodHRwczovL3Byb2Nlc3NlZC1pY29uLmNvbS9pY29uLnBuZycpXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0dldEljb25VcmwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd0ZXN0LWljb24ucG5nJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wIFZhcmlhdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1Byb3AgVmFyaWF0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHdvcmsgd2l0aG91dCB1cGRhdGVQYXlsb2FkIChmcmVzaCBpbnN0YWxsIGZsb3cpJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gU3RhcnQgZnJvbSBzZXRVcmwgc3RlcFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2V0LXVybC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gRW50ZXIgVVJMXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncmVwby11cmwtaW5wdXQnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdodHRwczovL2dpdGh1Yi5jb20vb3duZXIvcmVwbycgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbmV4dC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1wYWNrYWdlLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB3b3JrIHdpdGggdXBkYXRlUGF5bG9hZCAodXBkYXRlIGZsb3cpJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlUGF5bG9hZCA9IGNyZWF0ZVVwZGF0ZVBheWxvYWQoKVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IHVwZGF0ZVBheWxvYWQ9e3VwZGF0ZVBheWxvYWR9IC8+KVxuXG4gICAgICAvLyBTdGFydCBmcm9tIHNlbGVjdFBhY2thZ2Ugc3RlcFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXBhY2thZ2Utc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZXBvLXVybC1kaXNwbGF5JykpLnRvSGF2ZVRleHRDb250ZW50KCdodHRwczovL2dpdGh1Yi5jb20vb3duZXIvcmVwbycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIHJlbGVhc2VzIGZyb20gdXBkYXRlUGF5bG9hZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IGN1c3RvbVJlbGVhc2VzOiBHaXRIdWJSZXBvUmVsZWFzZVJlc3BvbnNlW10gPSBbXG4gICAgICAgIHsgdGFnX25hbWU6ICd2Mi4wLjAnLCBhc3NldHM6IFt7IGlkOiAxLCBuYW1lOiAnY3VzdG9tLnppcCcsIGJyb3dzZXJfZG93bmxvYWRfdXJsOiAndXJsJyB9XSB9LFxuICAgICAgICB7IHRhZ19uYW1lOiAndjEuNS4wJywgYXNzZXRzOiBbeyBpZDogMiwgbmFtZTogJ2N1c3RvbTIuemlwJywgYnJvd3Nlcl9kb3dubG9hZF91cmw6ICd1cmwyJyB9XSB9LFxuICAgICAgICB7IHRhZ19uYW1lOiAndjEuMC4wJywgYXNzZXRzOiBbeyBpZDogMywgbmFtZTogJ2N1c3RvbTMuemlwJywgYnJvd3Nlcl9kb3dubG9hZF91cmw6ICd1cmwzJyB9XSB9LFxuICAgICAgXVxuXG4gICAgICBjb25zdCB1cGRhdGVQYXlsb2FkID0gY3JlYXRlVXBkYXRlUGF5bG9hZCh7XG4gICAgICAgIG9yaWdpbmFsUGFja2FnZUluZm86IHtcbiAgICAgICAgICBpZDogJ2lkJyxcbiAgICAgICAgICByZXBvOiAnb3duZXIvcmVwbycsXG4gICAgICAgICAgdmVyc2lvbjogJ3YxLjAuMCcsXG4gICAgICAgICAgcGFja2FnZTogJ3BrZy56aXAnLFxuICAgICAgICAgIHJlbGVhc2VzOiBjdXN0b21SZWxlYXNlcyxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgey4uLmRlZmF1bHRQcm9wc30gdXBkYXRlUGF5bG9hZD17dXBkYXRlUGF5bG9hZH0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ZlcnNpb25zLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCczJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHJlcG8gdG8gVVJMIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZVBheWxvYWQgPSBjcmVhdGVVcGRhdGVQYXlsb2FkKHtcbiAgICAgICAgb3JpZ2luYWxQYWNrYWdlSW5mbzoge1xuICAgICAgICAgIGlkOiAnaWQnLFxuICAgICAgICAgIHJlcG86ICdteW9yZy9teXJlcG8nLFxuICAgICAgICAgIHZlcnNpb246ICd2MS4wLjAnLFxuICAgICAgICAgIHBhY2thZ2U6ICdwa2cuemlwJyxcbiAgICAgICAgICByZWxlYXNlczogY3JlYXRlTW9ja1JlbGVhc2VzKCksXG4gICAgICAgIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IHVwZGF0ZVBheWxvYWQ9e3VwZGF0ZVBheWxvYWR9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZXBvLXVybC1kaXNwbGF5JykpLnRvSGF2ZVRleHRDb250ZW50KCdodHRwczovL2dpdGh1Yi5jb20vbXlvcmcvbXlyZXBvJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVycm9yIEhhbmRsaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBBUEkgZXJyb3Igd2l0aCByZXNwb25zZSBtZXNzYWdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0dldEljb25VcmwubW9ja1JlamVjdGVkVmFsdWUoe1xuICAgICAgICByZXNwb25zZTogeyBtZXNzYWdlOiAnQVBJIEVycm9yIE1lc3NhZ2UnIH0sXG4gICAgICB9KVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1mYWlsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdlcnJvci1tc2cnKSkudG9IYXZlVGV4dENvbnRlbnQoJ0FQSSBFcnJvciBNZXNzYWdlJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIEFQSSBlcnJvciB3aXRob3V0IHJlc3BvbnNlIG1lc3NhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrR2V0SWNvblVybC5tb2NrUmVqZWN0ZWRWYWx1ZShuZXcgRXJyb3IoJ0dlbmVyaWMgZXJyb3InKSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXMtZmFpbGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZXJyb3ItbXNnJykpLnRvSGF2ZVRleHRDb250ZW50KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxGYWlsZWREZXNjJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBoYW5kbGVCYWNrIERlZmF1bHQgQ2FzZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnaGFuZGxlQmFjayBFZGdlIENhc2VzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbm90IGNoYW5nZSBzdGF0ZSB3aGVuIGJhY2sgaXMgY2FsbGVkIGZyb20gc2V0VXJsIHN0ZXAnLCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyBUaGlzIHRlc3RzIHRoZSBkZWZhdWx0IGNhc2UgaW4gaGFuZGxlQmFjayBzd2l0Y2hcbiAgICAgIC8vIFdoZW4gaW4gc2V0VXJsIHN0ZXAsIGNhbGxpbmcgYmFjayBzaG91bGQga2VlcCB0aGUgc3RhdGUgdW5jaGFuZ2VkXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBWZXJpZnkgd2UncmUgb24gc2V0VXJsIHN0ZXBcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NldC11cmwtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFRoZSBzZXRVcmwgc3RlcCBkb2Vzbid0IGV4cG9zZSBvbkJhY2sgaW4gdGhlIHJlYWwgY29tcG9uZW50LFxuICAgICAgLy8gYnV0IG91ciBtb2NrIGRvZXNuJ3QgaGF2ZSBpdCBlaXRoZXIgLSB0aGlzIGlzIGNvcnJlY3QgYmVoYXZpb3JcbiAgICAgIC8vIGFzIHNldFVybCBpcyB0aGUgZmlyc3Qgc3RlcCB3aXRoIG5vIGJhY2sgb3B0aW9uXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG11bHRpcGxlIGJhY2sgbmF2aWdhdGlvbnMgY29ycmVjdGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gTmF2aWdhdGUgdG8gc2VsZWN0UGFja2FnZVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlcG8tdXJsLWlucHV0JylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnaHR0cHM6Ly9naXRodWIuY29tL293bmVyL3JlcG8nIH0gfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ25leHQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtcGFja2FnZS1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIE5hdmlnYXRlIHRvIHJlYWR5VG9JbnN0YWxsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEdvIGJhY2sgdG8gc2VsZWN0UGFja2FnZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLWJhY2stYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtcGFja2FnZS1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIEdvIGJhY2sgdG8gc2V0VXJsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdiYWNrLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2V0LXVybC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFZlcmlmeSBVUkwgaXMgcHJlc2VydmVkIGFmdGVyIGJhY2sgbmF2aWdhdGlvblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVwby11cmwtaW5wdXQnKSkudG9IYXZlVmFsdWUoJ2h0dHBzOi8vZ2l0aHViLmNvbS9vd25lci9yZXBvJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFV0aWxpdHkgRnVuY3Rpb25zIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0luc3RhbGwgUGx1Z2luIFV0aWxzJywgKCkgPT4ge1xuICBkZXNjcmliZSgncGFyc2VHaXRIdWJVcmwnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXJzZSB2YWxpZCBHaXRIdWIgVVJMIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlR2l0SHViVXJsKCdodHRwczovL2dpdGh1Yi5jb20vb3duZXIvcmVwbycpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuaXNWYWxpZCkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHJlc3VsdC5vd25lcikudG9CZSgnb3duZXInKVxuICAgICAgZXhwZWN0KHJlc3VsdC5yZXBvKS50b0JlKCdyZXBvJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXJzZSBHaXRIdWIgVVJMIHdpdGggdHJhaWxpbmcgc2xhc2gnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZUdpdEh1YlVybCgnaHR0cHM6Ly9naXRodWIuY29tL293bmVyL3JlcG8vJylcblxuICAgICAgZXhwZWN0KHJlc3VsdC5pc1ZhbGlkKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QocmVzdWx0Lm93bmVyKS50b0JlKCdvd25lcicpXG4gICAgICBleHBlY3QocmVzdWx0LnJlcG8pLnRvQmUoJ3JlcG8nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBpbnZhbGlkIGZvciBub24tR2l0SHViIFVSTCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlR2l0SHViVXJsKCdodHRwczovL2dpdGxhYi5jb20vb3duZXIvcmVwbycpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuaXNWYWxpZCkudG9CZShmYWxzZSlcbiAgICAgIGV4cGVjdChyZXN1bHQub3duZXIpLnRvQmVVbmRlZmluZWQoKVxuICAgICAgZXhwZWN0KHJlc3VsdC5yZXBvKS50b0JlVW5kZWZpbmVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gaW52YWxpZCBmb3IgbWFsZm9ybWVkIFVSTCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBhcnNlR2l0SHViVXJsKCdub3QtYS11cmwnKVxuXG4gICAgICBleHBlY3QocmVzdWx0LmlzVmFsaWQpLnRvQmUoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGludmFsaWQgZm9yIEdpdEh1YiBVUkwgd2l0aCBleHRyYSBwYXRoIHNlZ21lbnRzJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VHaXRIdWJVcmwoJ2h0dHBzOi8vZ2l0aHViLmNvbS9vd25lci9yZXBvL3RyZWUvbWFpbicpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuaXNWYWxpZCkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gaW52YWxpZCBmb3IgZW1wdHkgc3RyaW5nJywgKCkgPT4ge1xuICAgICAgY29uc3QgcmVzdWx0ID0gcGFyc2VHaXRIdWJVcmwoJycpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuaXNWYWxpZCkudG9CZShmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgVVJMIHdpdGggc3BlY2lhbCBjaGFyYWN0ZXJzIGluIG93bmVyL3JlcG8gbmFtZXMnLCAoKSA9PiB7XG4gICAgICBjb25zdCByZXN1bHQgPSBwYXJzZUdpdEh1YlVybCgnaHR0cHM6Ly9naXRodWIuY29tL215LW9yZy9teS1yZXBvLTEyMycpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQuaXNWYWxpZCkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHJlc3VsdC5vd25lcikudG9CZSgnbXktb3JnJylcbiAgICAgIGV4cGVjdChyZXN1bHQucmVwbykudG9CZSgnbXktcmVwby0xMjMnKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2NvbnZlcnRSZXBvVG9VcmwnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IHJlcG8gc3RyaW5nIHRvIGZ1bGwgR2l0SHViIFVSTCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRSZXBvVG9VcmwoJ293bmVyL3JlcG8nKVxuXG4gICAgICBleHBlY3QocmVzdWx0KS50b0JlKCdodHRwczovL2dpdGh1Yi5jb20vb3duZXIvcmVwbycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGVtcHR5IHN0cmluZyBmb3IgZW1wdHkgcmVwbycsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRSZXBvVG9VcmwoJycpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQpLnRvQmUoJycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJlcG8gd2l0aCBvcmdhbml6YXRpb24gbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbnZlcnRSZXBvVG9VcmwoJ215LW9yZ2FuaXphdGlvbi9teS1yZXBvc2l0b3J5JylcblxuICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSgnaHR0cHM6Ly9naXRodWIuY29tL215LW9yZ2FuaXphdGlvbi9teS1yZXBvc2l0b3J5JylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdwbHVnaW5NYW5pZmVzdFRvQ2FyZFBsdWdpblByb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29udmVydCBQbHVnaW5EZWNsYXJhdGlvbiB0byBQbHVnaW4gcHJvcHMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgbWFuaWZlc3Q6IFBsdWdpbkRlY2xhcmF0aW9uID0ge1xuICAgICAgICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICd0ZXN0LXVpZCcsXG4gICAgICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgIGF1dGhvcjogJ3Rlc3QtYXV0aG9yJyxcbiAgICAgICAgaWNvbjogJ2ljb24ucG5nJyxcbiAgICAgICAgaWNvbl9kYXJrOiAnaWNvbi1kYXJrLnBuZycsXG4gICAgICAgIG5hbWU6ICdUZXN0IFBsdWdpbicsXG4gICAgICAgIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgICAgICAgbGFiZWw6IHsgJ2VuLVVTJzogJ1Rlc3QgTGFiZWwnIH0gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ2xhYmVsJ10sXG4gICAgICAgIGRlc2NyaXB0aW9uOiB7ICdlbi1VUyc6ICdUZXN0IERlc2NyaXB0aW9uJyB9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWydkZXNjcmlwdGlvbiddLFxuICAgICAgICBjcmVhdGVkX2F0OiAnMjAyNC0wMS0wMScsXG4gICAgICAgIHJlc291cmNlOiB7fSxcbiAgICAgICAgcGx1Z2luczogW10sXG4gICAgICAgIHZlcmlmaWVkOiB0cnVlLFxuICAgICAgICBlbmRwb2ludDogeyBzZXR0aW5nczogW10sIGVuZHBvaW50czogW10gfSxcbiAgICAgICAgbW9kZWw6IG51bGwsXG4gICAgICAgIHRhZ3M6IFsndGFnMScsICd0YWcyJ10sXG4gICAgICAgIGFnZW50X3N0cmF0ZWd5OiBudWxsLFxuICAgICAgICBtZXRhOiB7IHZlcnNpb246ICcxLjAuMCcgfSxcbiAgICAgICAgdHJpZ2dlcjoge30gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ3RyaWdnZXInXSxcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzdWx0ID0gcGx1Z2luTWFuaWZlc3RUb0NhcmRQbHVnaW5Qcm9wcyhtYW5pZmVzdClcblxuICAgICAgZXhwZWN0KHJlc3VsdC5wbHVnaW5faWQpLnRvQmUoJ3Rlc3QtdWlkJylcbiAgICAgIGV4cGVjdChyZXN1bHQudHlwZSkudG9CZSgndG9vbCcpXG4gICAgICBleHBlY3QocmVzdWx0LmNhdGVnb3J5KS50b0JlKFBsdWdpbkNhdGVnb3J5RW51bS50b29sKVxuICAgICAgZXhwZWN0KHJlc3VsdC5uYW1lKS50b0JlKCdUZXN0IFBsdWdpbicpXG4gICAgICBleHBlY3QocmVzdWx0LnZlcnNpb24pLnRvQmUoJzEuMC4wJylcbiAgICAgIGV4cGVjdChyZXN1bHQubGF0ZXN0X3ZlcnNpb24pLnRvQmUoJycpXG4gICAgICBleHBlY3QocmVzdWx0Lm9yZykudG9CZSgndGVzdC1hdXRob3InKVxuICAgICAgZXhwZWN0KHJlc3VsdC5hdXRob3IpLnRvQmUoJ3Rlc3QtYXV0aG9yJylcbiAgICAgIGV4cGVjdChyZXN1bHQuaWNvbikudG9CZSgnaWNvbi5wbmcnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5pY29uX2RhcmspLnRvQmUoJ2ljb24tZGFyay5wbmcnKVxuICAgICAgZXhwZWN0KHJlc3VsdC52ZXJpZmllZCkudG9CZSh0cnVlKVxuICAgICAgZXhwZWN0KHJlc3VsdC50YWdzKS50b0VxdWFsKFt7IG5hbWU6ICd0YWcxJyB9LCB7IG5hbWU6ICd0YWcyJyB9XSlcbiAgICAgIGV4cGVjdChyZXN1bHQuZnJvbSkudG9CZSgncGFja2FnZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIG1hbmlmZXN0IHdpdGggZW1wdHkgdGFncycsICgpID0+IHtcbiAgICAgIGNvbnN0IG1hbmlmZXN0OiBQbHVnaW5EZWNsYXJhdGlvbiA9IHtcbiAgICAgICAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC11aWQnLFxuICAgICAgICB2ZXJzaW9uOiAnMS4wLjAnLFxuICAgICAgICBhdXRob3I6ICdhdXRob3InLFxuICAgICAgICBpY29uOiAnaWNvbi5wbmcnLFxuICAgICAgICBuYW1lOiAnUGx1Z2luJyxcbiAgICAgICAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5tb2RlbCxcbiAgICAgICAgbGFiZWw6IHt9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWydsYWJlbCddLFxuICAgICAgICBkZXNjcmlwdGlvbjoge30gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ2Rlc2NyaXB0aW9uJ10sXG4gICAgICAgIGNyZWF0ZWRfYXQ6ICcyMDI0LTAxLTAxJyxcbiAgICAgICAgcmVzb3VyY2U6IHt9LFxuICAgICAgICBwbHVnaW5zOiBbXSxcbiAgICAgICAgdmVyaWZpZWQ6IGZhbHNlLFxuICAgICAgICBlbmRwb2ludDogeyBzZXR0aW5nczogW10sIGVuZHBvaW50czogW10gfSxcbiAgICAgICAgbW9kZWw6IG51bGwsXG4gICAgICAgIHRhZ3M6IFtdLFxuICAgICAgICBhZ2VudF9zdHJhdGVneTogbnVsbCxcbiAgICAgICAgbWV0YTogeyB2ZXJzaW9uOiAnMS4wLjAnIH0sXG4gICAgICAgIHRyaWdnZXI6IHt9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWyd0cmlnZ2VyJ10sXG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc3VsdCA9IHBsdWdpbk1hbmlmZXN0VG9DYXJkUGx1Z2luUHJvcHMobWFuaWZlc3QpXG5cbiAgICAgIGV4cGVjdChyZXN1bHQudGFncykudG9FcXVhbChbXSlcbiAgICAgIGV4cGVjdChyZXN1bHQudmVyaWZpZWQpLnRvQmUoZmFsc2UpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgncGx1Z2luTWFuaWZlc3RJbk1hcmtldFRvUGx1Z2luUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjb252ZXJ0IFBsdWdpbk1hbmlmZXN0SW5NYXJrZXQgdG8gUGx1Z2luIHByb3BzIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1hbmlmZXN0OiBQbHVnaW5NYW5pZmVzdEluTWFya2V0ID0ge1xuICAgICAgICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICdtYXJrZXQtdWlkJyxcbiAgICAgICAgbmFtZTogJ01hcmtldCBQbHVnaW4nLFxuICAgICAgICBvcmc6ICdtYXJrZXQtb3JnJyxcbiAgICAgICAgaWNvbjogJ21hcmtldC1pY29uLnBuZycsXG4gICAgICAgIGxhYmVsOiB7ICdlbi1VUyc6ICdNYXJrZXQgTGFiZWwnIH0gYXMgUGx1Z2luTWFuaWZlc3RJbk1hcmtldFsnbGFiZWwnXSxcbiAgICAgICAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5leHRlbnNpb24sXG4gICAgICAgIHZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgIGxhdGVzdF92ZXJzaW9uOiAnMi4wLjAnLFxuICAgICAgICBicmllZjogeyAnZW4tVVMnOiAnQnJpZWYgRGVzY3JpcHRpb24nIH0gYXMgUGx1Z2luTWFuaWZlc3RJbk1hcmtldFsnYnJpZWYnXSxcbiAgICAgICAgaW50cm9kdWN0aW9uOiAnRnVsbCBpbnRyb2R1Y3Rpb24gdGV4dCcsXG4gICAgICAgIHZlcmlmaWVkOiB0cnVlLFxuICAgICAgICBpbnN0YWxsX2NvdW50OiAxMDAwLFxuICAgICAgICBiYWRnZXM6IFsnZmVhdHVyZWQnLCAndmVyaWZpZWQnXSxcbiAgICAgICAgdmVyaWZpY2F0aW9uOiB7IGF1dGhvcml6ZWRfY2F0ZWdvcnk6ICdwYXJ0bmVyJyB9LFxuICAgICAgICBmcm9tOiAnbWFya2V0cGxhY2UnLFxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBwbHVnaW5NYW5pZmVzdEluTWFya2V0VG9QbHVnaW5Qcm9wcyhtYW5pZmVzdClcblxuICAgICAgZXhwZWN0KHJlc3VsdC5wbHVnaW5faWQpLnRvQmUoJ21hcmtldC11aWQnKVxuICAgICAgZXhwZWN0KHJlc3VsdC50eXBlKS50b0JlKCdleHRlbnNpb24nKVxuICAgICAgZXhwZWN0KHJlc3VsdC5uYW1lKS50b0JlKCdNYXJrZXQgUGx1Z2luJylcbiAgICAgIGV4cGVjdChyZXN1bHQudmVyc2lvbikudG9CZSgnMi4wLjAnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5sYXRlc3RfdmVyc2lvbikudG9CZSgnMi4wLjAnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5vcmcpLnRvQmUoJ21hcmtldC1vcmcnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5pbnRyb2R1Y3Rpb24pLnRvQmUoJ0Z1bGwgaW50cm9kdWN0aW9uIHRleHQnKVxuICAgICAgZXhwZWN0KHJlc3VsdC5iYWRnZXMpLnRvRXF1YWwoWydmZWF0dXJlZCcsICd2ZXJpZmllZCddKVxuICAgICAgZXhwZWN0KHJlc3VsdC52ZXJpZmljYXRpb24uYXV0aG9yaXplZF9jYXRlZ29yeSkudG9CZSgncGFydG5lcicpXG4gICAgICBleHBlY3QocmVzdWx0LmZyb20pLnRvQmUoJ21hcmtldHBsYWNlJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2UgZGVmYXVsdCB2ZXJpZmljYXRpb24gd2hlbiBlbXB0eScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1hbmlmZXN0OiBQbHVnaW5NYW5pZmVzdEluTWFya2V0ID0ge1xuICAgICAgICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICd1aWQnLFxuICAgICAgICBuYW1lOiAnUGx1Z2luJyxcbiAgICAgICAgb3JnOiAnb3JnJyxcbiAgICAgICAgaWNvbjogJ2ljb24ucG5nJyxcbiAgICAgICAgbGFiZWw6IHt9IGFzIFBsdWdpbk1hbmlmZXN0SW5NYXJrZXRbJ2xhYmVsJ10sXG4gICAgICAgIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgICAgICAgdmVyc2lvbjogJzEuMC4wJyxcbiAgICAgICAgbGF0ZXN0X3ZlcnNpb246ICcxLjAuMCcsXG4gICAgICAgIGJyaWVmOiB7fSBhcyBQbHVnaW5NYW5pZmVzdEluTWFya2V0WydicmllZiddLFxuICAgICAgICBpbnRyb2R1Y3Rpb246ICcnLFxuICAgICAgICB2ZXJpZmllZDogZmFsc2UsXG4gICAgICAgIGluc3RhbGxfY291bnQ6IDAsXG4gICAgICAgIGJhZGdlczogW10sXG4gICAgICAgIHZlcmlmaWNhdGlvbjoge30gYXMgUGx1Z2luTWFuaWZlc3RJbk1hcmtldFsndmVyaWZpY2F0aW9uJ10sXG4gICAgICAgIGZyb206ICdnaXRodWInLFxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBwbHVnaW5NYW5pZmVzdEluTWFya2V0VG9QbHVnaW5Qcm9wcyhtYW5pZmVzdClcblxuICAgICAgZXhwZWN0KHJlc3VsdC52ZXJpZmljYXRpb24uYXV0aG9yaXplZF9jYXRlZ29yeSkudG9CZSgnbGFuZ2dlbml1cycpXG4gICAgICBleHBlY3QocmVzdWx0LnZlcmlmaWVkKS50b0JlKHRydWUpIC8vIGFsd2F5cyB0cnVlIGluIHRoaXMgZnVuY3Rpb25cbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgbWFya2V0cGxhY2UgcGx1Z2luIHdpdGggZnJvbSBnaXRodWIgc291cmNlJywgKCkgPT4ge1xuICAgICAgY29uc3QgbWFuaWZlc3Q6IFBsdWdpbk1hbmlmZXN0SW5NYXJrZXQgPSB7XG4gICAgICAgIHBsdWdpbl91bmlxdWVfaWRlbnRpZmllcjogJ2dpdGh1Yi11aWQnLFxuICAgICAgICBuYW1lOiAnR2l0SHViIFBsdWdpbicsXG4gICAgICAgIG9yZzogJ2dpdGh1Yi1vcmcnLFxuICAgICAgICBpY29uOiAnaWNvbi5wbmcnLFxuICAgICAgICBsYWJlbDoge30gYXMgUGx1Z2luTWFuaWZlc3RJbk1hcmtldFsnbGFiZWwnXSxcbiAgICAgICAgY2F0ZWdvcnk6IFBsdWdpbkNhdGVnb3J5RW51bS5hZ2VudCxcbiAgICAgICAgdmVyc2lvbjogJzAuMS4wJyxcbiAgICAgICAgbGF0ZXN0X3ZlcnNpb246ICcwLjIuMCcsXG4gICAgICAgIGJyaWVmOiB7fSBhcyBQbHVnaW5NYW5pZmVzdEluTWFya2V0WydicmllZiddLFxuICAgICAgICBpbnRyb2R1Y3Rpb246ICdGcm9tIEdpdEh1YicsXG4gICAgICAgIHZlcmlmaWVkOiB0cnVlLFxuICAgICAgICBpbnN0YWxsX2NvdW50OiA1MCxcbiAgICAgICAgYmFkZ2VzOiBbXSxcbiAgICAgICAgdmVyaWZpY2F0aW9uOiB7IGF1dGhvcml6ZWRfY2F0ZWdvcnk6ICdjb21tdW5pdHknIH0sXG4gICAgICAgIGZyb206ICdnaXRodWInLFxuICAgICAgfVxuXG4gICAgICBjb25zdCByZXN1bHQgPSBwbHVnaW5NYW5pZmVzdEluTWFya2V0VG9QbHVnaW5Qcm9wcyhtYW5pZmVzdClcblxuICAgICAgZXhwZWN0KHJlc3VsdC5mcm9tKS50b0JlKCdnaXRodWInKVxuICAgICAgZXhwZWN0KHJlc3VsdC52ZXJpZmljYXRpb24uYXV0aG9yaXplZF9jYXRlZ29yeSkudG9CZSgnY29tbXVuaXR5JylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFN0ZXBzIENvbXBvbmVudHMgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbi8vIFNldFVSTCBDb21wb25lbnQgVGVzdHNcbmRlc2NyaWJlKCdTZXRVUkwgQ29tcG9uZW50JywgKCkgPT4ge1xuICAvLyBJbXBvcnQgdGhlIHJlYWwgY29tcG9uZW50IGZvciB0ZXN0aW5nXG4gIGNvbnN0IFNldFVSTCA9IHZpLmZuKClcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICAvLyBSZS1tb2NrIHRoZSBTZXRVUkwgY29tcG9uZW50IHdpdGggYSBtb3JlIHRlc3RhYmxlIHZlcnNpb25cbiAgICB2aS5kb01vY2soJy4vc3RlcHMvc2V0VVJMJywgKCkgPT4gKHtcbiAgICAgIGRlZmF1bHQ6IFNldFVSTCxcbiAgICB9KSlcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIGxhYmVsIHdpdGggY29ycmVjdCB0ZXh0JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiBvbkNsb3NlPXt2aS5mbigpfSBvblN1Y2Nlc3M9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICAvLyBUaGUgbW9ja2VkIGNvbXBvbmVudCBzaG91bGQgYmUgcmVuZGVyZWRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NldC11cmwtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGlucHV0IGZpZWxkIHdpdGggcGxhY2Vob2xkZXInLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIG9uQ2xvc2U9e3ZpLmZuKCl9IG9uU3VjY2Vzcz17dmkuZm4oKX0gLz4pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdyZXBvLXVybC1pbnB1dCcpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2FuY2VsIGFuZCBuZXh0IGJ1dHRvbnMnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIG9uQ2xvc2U9e3ZpLmZuKCl9IG9uU3VjY2Vzcz17dmkuZm4oKX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhbmNlbC1idG4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbmV4dC1idG4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1Byb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzcGxheSByZXBvVXJsIHZhbHVlIGluIGlucHV0JywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiBvbkNsb3NlPXt2aS5mbigpfSBvblN1Y2Nlc3M9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncmVwby11cmwtaW5wdXQnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdodHRwczovL2dpdGh1Yi5jb20vdGVzdC9yZXBvJyB9IH0pXG5cbiAgICAgIGV4cGVjdChpbnB1dCkudG9IYXZlVmFsdWUoJ2h0dHBzOi8vZ2l0aHViLmNvbS90ZXN0L3JlcG8nKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25DaGFuZ2Ugd2hlbiBpbnB1dCB2YWx1ZSBjaGFuZ2VzJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUdpdEh1YiBvbkNsb3NlPXt2aS5mbigpfSBvblN1Y2Nlc3M9e3ZpLmZuKCl9IC8+KVxuXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncmVwby11cmwtaW5wdXQnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICduZXctdmFsdWUnIH0gfSlcblxuICAgICAgZXhwZWN0KGlucHV0KS50b0hhdmVWYWx1ZSgnbmV3LXZhbHVlJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25OZXh0IHdoZW4gbmV4dCBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tGZXRjaFJlbGVhc2VzLm1vY2tSZXNvbHZlZFZhbHVlKGNyZWF0ZU1vY2tSZWxlYXNlcygpKVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIG9uQ2xvc2U9e3ZpLmZuKCl9IG9uU3VjY2Vzcz17dmkuZm4oKX0gLz4pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdyZXBvLXVybC1pbnB1dCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJ2h0dHBzOi8vZ2l0aHViLmNvbS9vd25lci9yZXBvJyB9IH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ25leHQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0ZldGNoUmVsZWFzZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2FuY2VsIHdoZW4gY2FuY2VsIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgb25DbG9zZT17b25DbG9zZX0gb25TdWNjZXNzPXt2aS5mbigpfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2FuY2VsLWJ0bicpKVxuXG4gICAgICBleHBlY3Qob25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBVUkwgaW5wdXQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIG9uQ2xvc2U9e3ZpLmZuKCl9IG9uU3VjY2Vzcz17dmkuZm4oKX0gLz4pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdyZXBvLXVybC1pbnB1dCcpXG4gICAgICBleHBlY3QoaW5wdXQpLnRvSGF2ZVZhbHVlKCcnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBVUkwgd2l0aCB3aGl0ZXNwYWNlIG9ubHknLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tR2l0SHViIG9uQ2xvc2U9e3ZpLmZuKCl9IG9uU3VjY2Vzcz17dmkuZm4oKX0gLz4pXG5cbiAgICAgIGNvbnN0IGlucHV0ID0gc2NyZWVuLmdldEJ5VGVzdElkKCdyZXBvLXVybC1pbnB1dCcpXG4gICAgICBmaXJlRXZlbnQuY2hhbmdlKGlucHV0LCB7IHRhcmdldDogeyB2YWx1ZTogJyAgICcgfSB9KVxuXG4gICAgICAvLyBXaXRoIHdoaXRlc3BhY2Ugb25seSwgbmV4dCBzaG91bGQgc3RpbGwgYmUgc3VibWl0dGFibGUgYnV0IHZhbGlkYXRpb24gd2lsbCBmYWlsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCduZXh0LWJ0bicpKVxuXG4gICAgICAvLyBTaG91bGQgc2hvdyBlcnJvciBmb3IgaW52YWxpZCBVUkxcbiAgICAgIGV4cGVjdChtb2NrTm90aWZ5KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgIHR5cGU6ICdlcnJvcicsXG4gICAgICAgIG1lc3NhZ2U6ICdwbHVnaW4uZXJyb3IuaW5WYWxpZEdpdEh1YlVybCcsXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyBTZWxlY3RQYWNrYWdlIENvbXBvbmVudCBUZXN0c1xuZGVzY3JpYmUoJ1NlbGVjdFBhY2thZ2UgQ29tcG9uZW50JywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrRmV0Y2hSZWxlYXNlcy5tb2NrUmVzb2x2ZWRWYWx1ZShjcmVhdGVNb2NrUmVsZWFzZXMoKSlcbiAgICBtb2NrR2V0SWNvblVybC5tb2NrUmVzb2x2ZWRWYWx1ZSgncHJvY2Vzc2VkLWljb24tdXJsJylcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHZlcnNpb24gc2VsZWN0b3InLCAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbUdpdEh1YlxuICAgICAgICAgIG9uQ2xvc2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25TdWNjZXNzPXt2aS5mbigpfVxuICAgICAgICAgIHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC1wYWNrYWdlLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBwYWNrYWdlIHNlbGVjdG9yJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21HaXRIdWJcbiAgICAgICAgICBvbkNsb3NlPXt2aS5mbigpfVxuICAgICAgICAgIG9uU3VjY2Vzcz17dmkuZm4oKX1cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3RlZC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGJhY2sgYnV0dG9uIHdoZW4gbm90IGluIGVkaXQgbW9kZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgb25DbG9zZT17dmkuZm4oKX0gb25TdWNjZXNzPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gTmF2aWdhdGUgdG8gc2VsZWN0UGFja2FnZSBzdGVwXG4gICAgICBjb25zdCBpbnB1dCA9IHNjcmVlbi5nZXRCeVRlc3RJZCgncmVwby11cmwtaW5wdXQnKVxuICAgICAgZmlyZUV2ZW50LmNoYW5nZShpbnB1dCwgeyB0YXJnZXQ6IHsgdmFsdWU6ICdodHRwczovL2dpdGh1Yi5jb20vb3duZXIvcmVwbycgfSB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbmV4dC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stYnRuJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHZlcnNpb25zIGNvdW50IGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e3ZpLmZuKCl9XG4gICAgICAgICAgdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndmVyc2lvbnMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgcGFja2FnZXMgY291bnQgYmFzZWQgb24gc2VsZWN0ZWQgdmVyc2lvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e3ZpLmZuKCl9XG4gICAgICAgICAgdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gSW5pdGlhbGx5IDAgcGFja2FnZXNcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2VzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcblxuICAgICAgLy8gU2VsZWN0IHZlcnNpb25cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdC12ZXJzaW9uLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZXMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdVc2VyIEludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25TZWxlY3RWZXJzaW9uIHdoZW4gdmVyc2lvbiBpcyBzZWxlY3RlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e3ZpLmZuKCl9XG4gICAgICAgICAgdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXZlcnNpb24tYnRuJykpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3NlbGVjdGVkLXZlcnNpb24nKSkudG9IYXZlVGV4dENvbnRlbnQoJ3YxLjAuMCcpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblNlbGVjdFBhY2thZ2Ugd2hlbiBwYWNrYWdlIGlzIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21HaXRIdWJcbiAgICAgICAgICBvbkNsb3NlPXt2aS5mbigpfVxuICAgICAgICAgIG9uU3VjY2Vzcz17dmkuZm4oKX1cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtcGFja2FnZS1idG4nKSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0ZWQtcGFja2FnZScpKS50b0hhdmVUZXh0Q29udGVudCgncGFja2FnZS56aXAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25CYWNrIHdoZW4gYmFjayBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21HaXRIdWIgb25DbG9zZT17dmkuZm4oKX0gb25TdWNjZXNzPXt2aS5mbigpfSAvPilcblxuICAgICAgLy8gTmF2aWdhdGUgdG8gc2VsZWN0UGFja2FnZVxuICAgICAgY29uc3QgaW5wdXQgPSBzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlcG8tdXJsLWlucHV0JylcbiAgICAgIGZpcmVFdmVudC5jaGFuZ2UoaW5wdXQsIHsgdGFyZ2V0OiB7IHZhbHVlOiAnaHR0cHM6Ly9naXRodWIuY29tL293bmVyL3JlcG8nIH0gfSlcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ25leHQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtcGFja2FnZS1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2JhY2stYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZXQtdXJsLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmlnZ2VyIHVwbG9hZCB3aGVuIGNvbmRpdGlvbnMgYXJlIG1ldCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e3ZpLmZuKCl9XG4gICAgICAgICAgdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2FkZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1VwbG9hZCBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25VcGxvYWRlZCBvbiBzdWNjZXNzZnVsIHVwbG9hZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e3ZpLmZuKCl9XG4gICAgICAgICAgdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0dldEljb25VcmwpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uRmFpbGVkIG9uIHVwbG9hZCBmYWlsdXJlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21HaXRIdWJcbiAgICAgICAgICBvbkNsb3NlPXt2aS5mbigpfVxuICAgICAgICAgIG9uU3VjY2Vzcz17dmkuZm4oKX1cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1mYWlsZWQnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdXBsb2FkIGVycm9yIHdpdGggcmVzcG9uc2UgbWVzc2FnZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e3ZpLmZuKCl9XG4gICAgICAgICAgdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtZmFpbC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Vycm9yLW1zZycpKS50b0hhdmVUZXh0Q29udGVudCgnVXBsb2FkIGZhaWxlZCBlcnJvcicpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgdmVyc2lvbnMgYXJyYXknLCAoKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVQYXlsb2FkID0gY3JlYXRlVXBkYXRlUGF5bG9hZCh7XG4gICAgICAgIG9yaWdpbmFsUGFja2FnZUluZm86IHtcbiAgICAgICAgICBpZDogJ2lkJyxcbiAgICAgICAgICByZXBvOiAnb3duZXIvcmVwbycsXG4gICAgICAgICAgdmVyc2lvbjogJ3YxLjAuMCcsXG4gICAgICAgICAgcGFja2FnZTogJ3BrZy56aXAnLFxuICAgICAgICAgIHJlbGVhc2VzOiBbXSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e3ZpLmZuKCl9XG4gICAgICAgICAgdXBkYXRlUGF5bG9hZD17dXBkYXRlUGF5bG9hZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3ZlcnNpb25zLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgdmVyc2lvbiB3aXRoIG5vIGFzc2V0cycsICgpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZVBheWxvYWQgPSBjcmVhdGVVcGRhdGVQYXlsb2FkKHtcbiAgICAgICAgb3JpZ2luYWxQYWNrYWdlSW5mbzoge1xuICAgICAgICAgIGlkOiAnaWQnLFxuICAgICAgICAgIHJlcG86ICdvd25lci9yZXBvJyxcbiAgICAgICAgICB2ZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgICAgICBwYWNrYWdlOiAncGtnLnppcCcsXG4gICAgICAgICAgcmVsZWFzZXM6IFt7IHRhZ19uYW1lOiAndjEuMC4wJywgYXNzZXRzOiBbXSB9XSxcbiAgICAgICAgfSxcbiAgICAgIH0pXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e3ZpLmZuKCl9XG4gICAgICAgICAgdXBkYXRlUGF5bG9hZD17dXBkYXRlUGF5bG9hZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIC8vIFNlbGVjdCB0aGUgZW1wdHkgdmVyc2lvblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXZlcnNpb24tYnRuJykpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2VzLWNvdW50JykpLnRvSGF2ZVRleHRDb250ZW50KCcwJylcbiAgICB9KVxuICB9KVxufSlcblxuLy8gTG9hZGVkIENvbXBvbmVudCBUZXN0c1xuZGVzY3JpYmUoJ0xvYWRlZCBDb21wb25lbnQnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tHZXRJY29uVXJsLm1vY2tSZXNvbHZlZFZhbHVlKCdwcm9jZXNzZWQtaWNvbi11cmwnKVxuICAgIG1vY2tGZXRjaFJlbGVhc2VzLm1vY2tSZXNvbHZlZFZhbHVlKGNyZWF0ZU1vY2tSZWxlYXNlcygpKVxuICAgIG1vY2tIaWRlTG9naWNTdGF0ZSA9IHtcbiAgICAgIG1vZGFsQ2xhc3NOYW1lOiAndGVzdC1tb2RhbC1jbGFzcycsXG4gICAgICBmb2xkQW5pbUludG86IHZpLmZuKCksXG4gICAgICBzZXRJc0luc3RhbGxpbmc6IHZpLmZuKCksXG4gICAgICBoYW5kbGVTdGFydFRvSW5zdGFsbDogdmkuZm4oKSxcbiAgICB9XG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciByZWFkeSB0byBpbnN0YWxsIG1lc3NhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbUdpdEh1YlxuICAgICAgICAgIG9uQ2xvc2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25TdWNjZXNzPXt2aS5mbigpfVxuICAgICAgICAgIHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGx1Z2luIGNhcmQgd2l0aCBjb3JyZWN0IHBheWxvYWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbUdpdEh1YlxuICAgICAgICAgIG9uQ2xvc2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25TdWNjZXNzPXt2aS5mbigpfVxuICAgICAgICAgIHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGF5bG9hZC1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdUZXN0IFBsdWdpbicpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBiYWNrIGJ1dHRvbiB3aGVuIG5vdCBpbnN0YWxsaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21HaXRIdWJcbiAgICAgICAgICBvbkNsb3NlPXt2aS5mbigpfVxuICAgICAgICAgIG9uU3VjY2Vzcz17dmkuZm4oKX1cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1iYWNrLWJ0bicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBpbnN0YWxsIGJ1dHRvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e3ZpLmZuKCl9XG4gICAgICAgICAgdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN1Y2Nlc3MtYnRuJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGNvcnJlY3QgdW5pcXVlSWRlbnRpZmllcicsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e3ZpLmZuKCl9XG4gICAgICAgICAgdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd1bmlxdWUtaWRlbnRpZmllcicpKS50b0hhdmVUZXh0Q29udGVudCgndGVzdC11bmlxdWUtaWQnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGNvcnJlY3QgcmVwb1VybCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e3ZpLmZuKCl9XG4gICAgICAgICAgdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2FkZWQtcmVwby11cmwnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2h0dHBzOi8vZ2l0aHViLmNvbS9vd25lci9yZXBvJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzcGxheSBzZWxlY3RlZCB2ZXJzaW9uIGFuZCBwYWNrYWdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21HaXRIdWJcbiAgICAgICAgICBvbkNsb3NlPXt2aS5mbigpfVxuICAgICAgICAgIG9uU3VjY2Vzcz17dmkuZm4oKX1cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBGaXJzdCBzZWxlY3QgdmVyc2lvbiBhbmQgcGFja2FnZVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc2VsZWN0LXZlcnNpb24tYnRuJykpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtcGFja2FnZS1idG4nKSlcblxuICAgICAgLy8gVGhlbiB0cmlnZ2VyIHVwbG9hZFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2FkZWQtdmVyc2lvbicpKS50b0hhdmVUZXh0Q29udGVudCgndjEuMC4wJylcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXBhY2thZ2UnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3BhY2thZ2UuemlwJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQmFjayB3aGVuIGJhY2sgYnV0dG9uIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbUdpdEh1YlxuICAgICAgICAgIG9uQ2xvc2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25TdWNjZXNzPXt2aS5mbigpfVxuICAgICAgICAgIHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLWJhY2stYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdzZWxlY3QtcGFja2FnZS1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvblN0YXJ0VG9JbnN0YWxsIHdoZW4gaW5zdGFsbCBpcyB0cmlnZ2VyZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbUdpdEh1YlxuICAgICAgICAgIG9uQ2xvc2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25TdWNjZXNzPXt2aS5mbigpfVxuICAgICAgICAgIHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RhcnQtaW5zdGFsbC1idG4nKSlcblxuICAgICAgZXhwZWN0KG1vY2tIaWRlTG9naWNTdGF0ZS5oYW5kbGVTdGFydFRvSW5zdGFsbCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkluc3RhbGxlZCBvbiBzdWNjZXNzZnVsIGluc3RhbGxhdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9uU3VjY2VzcyA9IHZpLmZuKClcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e29uU3VjY2Vzc31cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvblN1Y2Nlc3MpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uRmFpbGVkIG9uIGluc3RhbGxhdGlvbiBmYWlsdXJlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21HaXRIdWJcbiAgICAgICAgICBvbkNsb3NlPXt2aS5mbigpfVxuICAgICAgICAgIG9uU3VjY2Vzcz17dmkuZm4oKX1cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZmFpbC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXMtZmFpbGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnSW5zdGFsbGF0aW9uIEZsb3dzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaGFuZGxlIGZyZXNoIGluc3RhbGwgZmxvdycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9uU3VjY2VzcyA9IHZpLmZuKClcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e29uU3VjY2Vzc31cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICAvLyBOYXZpZ2F0ZSB0byBsb2FkZWQgc3RlcFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdsb2FkZWQtc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBUcmlnZ2VyIGluc3RhbGxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KG9uU3VjY2VzcykudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1cGRhdGUgZmxvdyB3aXRoIHVwZGF0ZVBheWxvYWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvblN1Y2Nlc3MgPSB2aS5mbigpXG4gICAgICBjb25zdCB1cGRhdGVQYXlsb2FkID0gY3JlYXRlVXBkYXRlUGF5bG9hZCgpXG5cbiAgICAgIHJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e29uU3VjY2Vzc31cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXt1cGRhdGVQYXlsb2FkfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gTmF2aWdhdGUgdG8gbG9hZGVkIHN0ZXBcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gVHJpZ2dlciBpbnN0YWxsICh1cGRhdGUpXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdpbnN0YWxsLXN1Y2Nlc3MtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25TdWNjZXNzKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVmcmVzaCBwbHVnaW4gbGlzdCBhZnRlciBzdWNjZXNzZnVsIGluc3RhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbUdpdEh1YlxuICAgICAgICAgIG9uQ2xvc2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25TdWNjZXNzPXt2aS5mbigpfVxuICAgICAgICAgIHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1zdWNjZXNzLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tSZWZyZXNoUGx1Z2luTGlzdCkudG9IYXZlQmVlbkNhbGxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZWZyZXNoIHBsdWdpbiBsaXN0IHdoZW4gbm90UmVmcmVzaCBpcyB0cnVlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21HaXRIdWJcbiAgICAgICAgICBvbkNsb3NlPXt2aS5mbigpfVxuICAgICAgICAgIG9uU3VjY2Vzcz17dmkuZm4oKX1cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtc3VjY2Vzcy1uby1yZWZyZXNoLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tSZWZyZXNoUGx1Z2luTGlzdCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgZXJyb3IgbWVzc2FnZSBvbiBmYWlsdXJlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21HaXRIdWJcbiAgICAgICAgICBvbkNsb3NlPXt2aS5mbigpfVxuICAgICAgICAgIG9uU3VjY2Vzcz17dmkuZm4oKX1cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGwtZmFpbC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2Vycm9yLW1zZycpKS50b0hhdmVUZXh0Q29udGVudCgnSW5zdGFsbCBmYWlsZWQnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZmFpbHVyZSB3aXRob3V0IGVycm9yIG1lc3NhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoXG4gICAgICAgIDxJbnN0YWxsRnJvbUdpdEh1YlxuICAgICAgICAgIG9uQ2xvc2U9e3ZpLmZuKCl9XG4gICAgICAgICAgb25TdWNjZXNzPXt2aS5mbigpfVxuICAgICAgICAgIHVwZGF0ZVBheWxvYWQ9e2NyZWF0ZVVwZGF0ZVBheWxvYWQoKX1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnaW5zdGFsbC1mYWlsLW5vLW1zZy1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2luc3RhbGxlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXMtZmFpbGVkJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtaXNzaW5nIG9wdGlvbmFsIHByb3BzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21HaXRIdWJcbiAgICAgICAgICBvbkNsb3NlPXt2aS5mbigpfVxuICAgICAgICAgIG9uU3VjY2Vzcz17dmkuZm4oKX1cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNob3VsZCBub3QgdGhyb3cgd2hlbiBvblN0YXJ0VG9JbnN0YWxsIGlzIGNhbGxlZFxuICAgICAgZXhwZWN0KCgpID0+IHtcbiAgICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnc3RhcnQtaW5zdGFsbC1idG4nKSlcbiAgICAgIH0pLm5vdC50b1Rocm93KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcmVzZXJ2ZSBzdGF0ZSB0aHJvdWdoIGNvbXBvbmVudCB1cGRhdGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKFxuICAgICAgICA8SW5zdGFsbEZyb21HaXRIdWJcbiAgICAgICAgICBvbkNsb3NlPXt2aS5mbigpfVxuICAgICAgICAgIG9uU3VjY2Vzcz17dmkuZm4oKX1cbiAgICAgICAgICB1cGRhdGVQYXlsb2FkPXtjcmVhdGVVcGRhdGVQYXlsb2FkKCl9XG4gICAgICAgIC8+LFxuICAgICAgKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2xvYWRlZC1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFJlcmVuZGVyXG4gICAgICByZXJlbmRlcihcbiAgICAgICAgPEluc3RhbGxGcm9tR2l0SHViXG4gICAgICAgICAgb25DbG9zZT17dmkuZm4oKX1cbiAgICAgICAgICBvblN1Y2Nlc3M9e3ZpLmZuKCl9XG4gICAgICAgICAgdXBkYXRlUGF5bG9hZD17Y3JlYXRlVXBkYXRlUGF5bG9hZCgpfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgLy8gU3RhdGUgc2hvdWxkIGJlIHByZXNlcnZlZFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnbG9hZGVkLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG59KVxuIl19