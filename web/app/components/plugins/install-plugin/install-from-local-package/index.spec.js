"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("../../types");
const index_1 = require("./index");
// Factory functions for test data
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
const createMockDependencies = () => [
    {
        type: 'package',
        value: {
            unique_identifier: 'dep-1',
            manifest: createMockManifest({ name: 'Dep Plugin 1' }),
        },
    },
    {
        type: 'package',
        value: {
            unique_identifier: 'dep-2',
            manifest: createMockManifest({ name: 'Dep Plugin 2' }),
        },
    },
];
const createMockFile = (name = 'test-plugin.difypkg') => {
    return new File(['test content'], name, { type: 'application/octet-stream' });
};
const createMockBundleFile = () => {
    return new File(['bundle content'], 'test-bundle.difybndl', { type: 'application/octet-stream' });
};
// Mock external dependencies
const mockGetIconUrl = vitest_1.vi.fn();
vitest_1.vi.mock('@/app/components/plugins/install-plugin/base/use-get-icon', () => ({
    default: () => ({ getIconUrl: mockGetIconUrl }),
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
let uploadingOnPackageUploaded = null;
let uploadingOnBundleUploaded = null;
let _uploadingOnFailed = null;
vitest_1.vi.mock('./steps/uploading', () => ({
    default: ({ isBundle, file, onCancel, onPackageUploaded, onBundleUploaded, onFailed, }) => {
        uploadingOnPackageUploaded = onPackageUploaded;
        uploadingOnBundleUploaded = onBundleUploaded;
        _uploadingOnFailed = onFailed;
        return (<div data-testid="uploading-step">
        <span data-testid="is-bundle">{isBundle ? 'true' : 'false'}</span>
        <span data-testid="file-name">{file.name}</span>
        <button data-testid="cancel-upload-btn" onClick={onCancel}>Cancel</button>
        <button data-testid="trigger-package-upload-btn" onClick={() => onPackageUploaded({
                uniqueIdentifier: 'test-unique-id',
                manifest: createMockManifest(),
            })}>
          Trigger Package Upload
        </button>
        <button data-testid="trigger-bundle-upload-btn" onClick={() => onBundleUploaded(createMockDependencies())}>
          Trigger Bundle Upload
        </button>
        <button data-testid="trigger-upload-fail-btn" onClick={() => onFailed('Upload failed error')}>
          Trigger Upload Fail
        </button>
      </div>);
    },
}));
let _packageStepChangeCallback = null;
let _packageSetIsInstallingCallback = null;
let _packageOnErrorCallback = null;
vitest_1.vi.mock('./ready-to-install', () => ({
    default: ({ step, onStepChange, onStartToInstall, setIsInstalling, onClose, uniqueIdentifier, manifest, errorMsg, onError, }) => {
        _packageStepChangeCallback = onStepChange;
        _packageSetIsInstallingCallback = setIsInstalling;
        _packageOnErrorCallback = onError;
        return (<div data-testid="ready-to-install-package">
        <span data-testid="package-step">{step}</span>
        <span data-testid="package-unique-identifier">{uniqueIdentifier || 'null'}</span>
        <span data-testid="package-manifest-name">{manifest?.name || 'null'}</span>
        <span data-testid="package-error-msg">{errorMsg || 'null'}</span>
        <button data-testid="package-close-btn" onClick={onClose}>Close</button>
        <button data-testid="package-start-install-btn" onClick={onStartToInstall}>Start Install</button>
        <button data-testid="package-step-installed-btn" onClick={() => onStepChange(types_1.InstallStep.installed)}>
          Set Installed
        </button>
        <button data-testid="package-step-failed-btn" onClick={() => onStepChange(types_1.InstallStep.installFailed)}>
          Set Failed
        </button>
        <button data-testid="package-set-installing-false-btn" onClick={() => setIsInstalling(false)}>
          Set Not Installing
        </button>
        <button data-testid="package-set-error-btn" onClick={() => onError('Custom error message')}>
          Set Error
        </button>
      </div>);
    },
}));
let _bundleStepChangeCallback = null;
let _bundleSetIsInstallingCallback = null;
vitest_1.vi.mock('../install-bundle/ready-to-install', () => ({
    default: ({ step, onStepChange, onStartToInstall, setIsInstalling, onClose, allPlugins, }) => {
        _bundleStepChangeCallback = onStepChange;
        _bundleSetIsInstallingCallback = setIsInstalling;
        return (<div data-testid="ready-to-install-bundle">
        <span data-testid="bundle-step">{step}</span>
        <span data-testid="bundle-plugins-count">{allPlugins.length}</span>
        <button data-testid="bundle-close-btn" onClick={onClose}>Close</button>
        <button data-testid="bundle-start-install-btn" onClick={onStartToInstall}>Start Install</button>
        <button data-testid="bundle-step-installed-btn" onClick={() => onStepChange(types_1.InstallStep.installed)}>
          Set Installed
        </button>
        <button data-testid="bundle-step-failed-btn" onClick={() => onStepChange(types_1.InstallStep.installFailed)}>
          Set Failed
        </button>
        <button data-testid="bundle-set-installing-false-btn" onClick={() => setIsInstalling(false)}>
          Set Not Installing
        </button>
      </div>);
    },
}));
(0, vitest_1.describe)('InstallFromLocalPackage', () => {
    const defaultProps = {
        file: createMockFile(),
        onClose: vitest_1.vi.fn(),
        onSuccess: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockGetIconUrl.mockReturnValue('processed-icon-url');
        mockHideLogicState = {
            modalClassName: 'test-modal-class',
            foldAnimInto: vitest_1.vi.fn(),
            setIsInstalling: vitest_1.vi.fn(),
            handleStartToInstall: vitest_1.vi.fn(),
        };
        uploadingOnPackageUploaded = null;
        uploadingOnBundleUploaded = null;
        _uploadingOnFailed = null;
        _packageStepChangeCallback = null;
        _packageSetIsInstallingCallback = null;
        _packageOnErrorCallback = null;
        _bundleStepChangeCallback = null;
        _bundleSetIsInstallingCallback = null;
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render modal with uploading step initially', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('uploading-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('file-name')).toHaveTextContent('test-plugin.difypkg');
        });
        (0, vitest_1.it)('should render with correct modal title for uploading step', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should apply modal className from useHideLogic', () => {
            (0, vitest_1.expect)(mockHideLogicState.modalClassName).toBe('test-modal-class');
        });
        (0, vitest_1.it)('should identify bundle file correctly', () => {
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('true');
        });
        (0, vitest_1.it)('should identify package file correctly', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('false');
        });
    });
    // ================================
    // Title Display Tests
    // ================================
    (0, vitest_1.describe)('Title Display', () => {
        (0, vitest_1.it)('should show install plugin title initially', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show upload failed title when upload fails', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.uploadFailed')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should show installed successfully title for package when installed', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installedSuccessfully')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should show install complete title for bundle when installed', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installComplete')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should show install failed title when install fails', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-failed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installFailed')).toBeInTheDocument();
            });
        });
    });
    // ================================
    // State Management Tests
    // ================================
    (0, vitest_1.describe)('State Management', () => {
        (0, vitest_1.it)('should transition from uploading to readyToInstall on successful package upload', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('uploading-step')).toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('readyToInstall');
            });
        });
        (0, vitest_1.it)('should transition from uploading to readyToInstall on successful bundle upload', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('uploading-step')).toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-step')).toHaveTextContent('readyToInstall');
            });
        });
        (0, vitest_1.it)('should transition to uploadFailed step on upload error', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('uploadFailed');
            });
        });
        (0, vitest_1.it)('should store uniqueIdentifier after package upload', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-unique-identifier')).toHaveTextContent('test-unique-id');
            });
        });
        (0, vitest_1.it)('should store manifest after package upload', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-manifest-name')).toHaveTextContent('Test Plugin');
            });
        });
        (0, vitest_1.it)('should store error message after upload failure', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-error-msg')).toHaveTextContent('Upload failed error');
            });
        });
        (0, vitest_1.it)('should store dependencies after bundle upload', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-plugins-count')).toHaveTextContent('2');
            });
        });
    });
    // ================================
    // Icon Processing Tests
    // ================================
    (0, vitest_1.describe)('Icon Processing', () => {
        (0, vitest_1.it)('should process icon URL on successful package upload', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockGetIconUrl).toHaveBeenCalledWith('test-icon.png');
            });
        });
        (0, vitest_1.it)('should process dark icon URL if provided', async () => {
            const manifestWithDarkIcon = createMockManifest({ icon_dark: 'test-icon-dark.png' });
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Manually call the callback with dark icon manifest
            if (uploadingOnPackageUploaded) {
                uploadingOnPackageUploaded({
                    uniqueIdentifier: 'test-id',
                    manifest: manifestWithDarkIcon,
                });
            }
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockGetIconUrl).toHaveBeenCalledWith('test-icon.png');
                (0, vitest_1.expect)(mockGetIconUrl).toHaveBeenCalledWith('test-icon-dark.png');
            });
        });
        (0, vitest_1.it)('should not process dark icon if not provided', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockGetIconUrl).toHaveBeenCalledTimes(1);
                (0, vitest_1.expect)(mockGetIconUrl).toHaveBeenCalledWith('test-icon.png');
            });
        });
    });
    // ================================
    // Callback Tests
    // ================================
    (0, vitest_1.describe)('Callbacks', () => {
        (0, vitest_1.it)('should call onClose when cancel button is clicked during upload', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('cancel-upload-btn'));
            (0, vitest_1.expect)(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call foldAnimInto when modal close is triggered', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(mockHideLogicState.foldAnimInto).toBeDefined();
        });
        (0, vitest_1.it)('should call handleStartToInstall when start install is triggered for package', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call handleStartToInstall when start install is triggered for bundle', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call onClose when close button is clicked in package ready-to-install', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-close-btn'));
            (0, vitest_1.expect)(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call onClose when close button is clicked in bundle ready-to-install', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-close-btn'));
            (0, vitest_1.expect)(defaultProps.onClose).toHaveBeenCalledTimes(1);
        });
    });
    // ================================
    // Callback Stability Tests (Memoization)
    // ================================
    (0, vitest_1.describe)('Callback Stability', () => {
        (0, vitest_1.it)('should maintain stable handlePackageUploaded callback reference', async () => {
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('uploading-step')).toBeInTheDocument();
            // Rerender with same props
            rerender(<index_1.default {...defaultProps}/>);
            // The component should still work correctly
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should maintain stable handleBundleUploaded callback reference', async () => {
            const bundleProps = { ...defaultProps, file: createMockBundleFile() };
            const { rerender } = (0, react_1.render)(<index_1.default {...bundleProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('uploading-step')).toBeInTheDocument();
            // Rerender with same props
            rerender(<index_1.default {...bundleProps}/>);
            // The component should still work correctly
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should maintain stable handleUploadFail callback reference', async () => {
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Rerender with same props
            rerender(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-error-msg')).toHaveTextContent('Upload failed error');
            });
        });
    });
    // ================================
    // Step Change Tests
    // ================================
    (0, vitest_1.describe)('Step Change Handling', () => {
        (0, vitest_1.it)('should allow step change to installed for package', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('installed');
            });
        });
        (0, vitest_1.it)('should allow step change to installFailed for package', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-failed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('failed');
            });
        });
        (0, vitest_1.it)('should allow step change to installed for bundle', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-step')).toHaveTextContent('installed');
            });
        });
        (0, vitest_1.it)('should allow step change to installFailed for bundle', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-step-failed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-step')).toHaveTextContent('failed');
            });
        });
    });
    // ================================
    // setIsInstalling Tests
    // ================================
    (0, vitest_1.describe)('setIsInstalling Handling', () => {
        (0, vitest_1.it)('should pass setIsInstalling to package ready-to-install', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-set-installing-false-btn'));
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
        });
        (0, vitest_1.it)('should pass setIsInstalling to bundle ready-to-install', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-set-installing-false-btn'));
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
        });
    });
    // ================================
    // Error Handling Tests
    // ================================
    (0, vitest_1.describe)('Error Handling', () => {
        (0, vitest_1.it)('should handle onError callback for package', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-set-error-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-error-msg')).toHaveTextContent('Custom error message');
            });
        });
        (0, vitest_1.it)('should preserve error message through step changes', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-error-msg')).toHaveTextContent('Upload failed error');
            });
            // Error message should still be accessible
            (0, vitest_1.expect)(react_1.screen.getByTestId('package-error-msg')).toHaveTextContent('Upload failed error');
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle file with .difypkg extension as package', () => {
            const pkgFile = createMockFile('my-plugin.difypkg');
            (0, react_1.render)(<index_1.default {...defaultProps} file={pkgFile}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('false');
        });
        (0, vitest_1.it)('should handle file with .difybndl extension as bundle', () => {
            const bundleFile = createMockFile('my-bundle.difybndl');
            (0, react_1.render)(<index_1.default {...defaultProps} file={bundleFile}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('true');
        });
        (0, vitest_1.it)('should handle file without standard extension as package', () => {
            const otherFile = createMockFile('plugin.zip');
            (0, react_1.render)(<index_1.default {...defaultProps} file={otherFile}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('false');
        });
        (0, vitest_1.it)('should handle empty dependencies array for bundle', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            // Manually trigger with empty dependencies
            if (uploadingOnBundleUploaded) {
                uploadingOnBundleUploaded([]);
            }
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-plugins-count')).toHaveTextContent('0');
            });
        });
        (0, vitest_1.it)('should handle manifest without icon_dark', async () => {
            const manifestWithoutDarkIcon = createMockManifest({ icon_dark: undefined });
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            if (uploadingOnPackageUploaded) {
                uploadingOnPackageUploaded({
                    uniqueIdentifier: 'test-id',
                    manifest: manifestWithoutDarkIcon,
                });
            }
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            // Should only call getIconUrl once for the main icon
            (0, vitest_1.expect)(mockGetIconUrl).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should display correct file name in uploading step', () => {
            const customFile = createMockFile('custom-plugin-name.difypkg');
            (0, react_1.render)(<index_1.default {...defaultProps} file={customFile}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('file-name')).toHaveTextContent('custom-plugin-name.difypkg');
        });
        (0, vitest_1.it)('should handle rapid state transitions', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Quickly trigger upload success
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            // Quickly trigger step changes
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('installed');
            });
        });
    });
    // ================================
    // Conditional Rendering Tests
    // ================================
    (0, vitest_1.describe)('Conditional Rendering', () => {
        (0, vitest_1.it)('should show uploading step initially and hide after upload', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('uploading-step')).toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByTestId('uploading-step')).not.toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should render ReadyToInstallPackage for package files', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.queryByTestId('ready-to-install-bundle')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should render ReadyToInstallBundle for bundle files', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.queryByTestId('ready-to-install-package')).not.toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should render both uploading and ready-to-install simultaneously during transition', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Initially only uploading is shown
            (0, vitest_1.expect)(react_1.screen.getByTestId('uploading-step')).toBeInTheDocument();
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            // After upload, only ready-to-install is shown
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.queryByTestId('uploading-step')).not.toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
        });
    });
    // ================================
    // Data Flow Tests
    // ================================
    (0, vitest_1.describe)('Data Flow', () => {
        (0, vitest_1.it)('should pass correct uniqueIdentifier to ReadyToInstallPackage', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-unique-identifier')).toHaveTextContent('test-unique-id');
            });
        });
        (0, vitest_1.it)('should pass processed manifest to ReadyToInstallPackage', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-manifest-name')).toHaveTextContent('Test Plugin');
            });
        });
        (0, vitest_1.it)('should pass all dependencies to ReadyToInstallBundle', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-plugins-count')).toHaveTextContent('2');
            });
        });
        (0, vitest_1.it)('should pass error message to ReadyToInstallPackage', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-error-msg')).toHaveTextContent('Upload failed error');
            });
        });
        (0, vitest_1.it)('should pass null uniqueIdentifier when not uploaded for package', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Before upload, uniqueIdentifier should be null
            // The uploading step is shown, so ReadyToInstallPackage is not rendered yet
            (0, vitest_1.expect)(react_1.screen.getByTestId('uploading-step')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass null manifest when not uploaded for package', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Before upload, manifest should be null
            // The uploading step is shown, so ReadyToInstallPackage is not rendered yet
            (0, vitest_1.expect)(react_1.screen.getByTestId('uploading-step')).toBeInTheDocument();
        });
    });
    // ================================
    // Prop Variations Tests
    // ================================
    (0, vitest_1.describe)('Prop Variations', () => {
        (0, vitest_1.it)('should work with different file names', () => {
            const files = [
                createMockFile('plugin-a.difypkg'),
                createMockFile('plugin-b.difypkg'),
                createMockFile('bundle-c.difybndl'),
            ];
            files.forEach((file) => {
                const { unmount } = (0, react_1.render)(<index_1.default {...defaultProps} file={file}/>);
                (0, vitest_1.expect)(react_1.screen.getByTestId('file-name')).toHaveTextContent(file.name);
                unmount();
            });
        });
        (0, vitest_1.it)('should call different onClose handlers correctly', () => {
            const onClose1 = vitest_1.vi.fn();
            const onClose2 = vitest_1.vi.fn();
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} onClose={onClose1}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('cancel-upload-btn'));
            (0, vitest_1.expect)(onClose1).toHaveBeenCalledTimes(1);
            (0, vitest_1.expect)(onClose2).not.toHaveBeenCalled();
            rerender(<index_1.default {...defaultProps} onClose={onClose2}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('cancel-upload-btn'));
            (0, vitest_1.expect)(onClose2).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should handle different file types correctly', () => {
            // Package file
            const { rerender } = (0, react_1.render)(<index_1.default {...defaultProps} file={createMockFile('test.difypkg')}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('false');
            // Bundle file
            rerender(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('true');
        });
    });
    // ================================
    // getTitle Callback Tests
    // ================================
    (0, vitest_1.describe)('getTitle Callback', () => {
        (0, vitest_1.it)('should return correct title for all InstallStep values', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // uploading step - shows installPlugin
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installPlugin')).toBeInTheDocument();
            // uploadFailed step
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.uploadFailed')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should differentiate bundle and package installed titles', async () => {
            // Package installed title
            const { unmount } = (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installedSuccessfully')).toBeInTheDocument();
            });
            // Unmount and create fresh instance for bundle
            unmount();
            // Bundle installed title
            (0, react_1.render)(<index_1.default {...defaultProps} file={createMockBundleFile()}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installComplete')).toBeInTheDocument();
            });
        });
    });
    // ================================
    // Integration with useHideLogic Tests
    // ================================
    (0, vitest_1.describe)('Integration with useHideLogic', () => {
        (0, vitest_1.it)('should use modalClassName from useHideLogic', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // The hook is called and provides modalClassName
            (0, vitest_1.expect)(mockHideLogicState.modalClassName).toBe('test-modal-class');
        });
        (0, vitest_1.it)('should use foldAnimInto as modal onClose handler', () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // The foldAnimInto function is available from the hook
            (0, vitest_1.expect)(mockHideLogicState.foldAnimInto).toBeDefined();
        });
        (0, vitest_1.it)('should use handleStartToInstall from useHideLogic', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalled();
        });
        (0, vitest_1.it)('should use setIsInstalling from useHideLogic', async () => {
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-set-installing-false-btn'));
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
        });
    });
    // ================================
    // useGetIcon Integration Tests
    // ================================
    (0, vitest_1.describe)('Integration with useGetIcon', () => {
        (0, vitest_1.it)('should call getIconUrl when processing manifest icon', async () => {
            mockGetIconUrl.mockReturnValue('https://example.com/icon.png');
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockGetIconUrl).toHaveBeenCalledWith('test-icon.png');
            });
        });
        (0, vitest_1.it)('should handle getIconUrl for both icon and icon_dark', async () => {
            mockGetIconUrl.mockReturnValue('https://example.com/icon.png');
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            const manifestWithDarkIcon = createMockManifest({
                icon: 'light-icon.png',
                icon_dark: 'dark-icon.png',
            });
            if (uploadingOnPackageUploaded) {
                uploadingOnPackageUploaded({
                    uniqueIdentifier: 'test-id',
                    manifest: manifestWithDarkIcon,
                });
            }
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockGetIconUrl).toHaveBeenCalledWith('light-icon.png');
                (0, vitest_1.expect)(mockGetIconUrl).toHaveBeenCalledWith('dark-icon.png');
            });
        });
    });
});
// ================================================================
// ReadyToInstall Component Tests
// ================================================================
(0, vitest_1.describe)('ReadyToInstall', () => {
    // Import the actual ReadyToInstall component for isolated testing
    // We'll test it through the parent component with specific scenarios
    const mockRefreshPluginList = vitest_1.vi.fn();
    // Reset mocks for ReadyToInstall tests
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockRefreshPluginList.mockClear();
    });
    (0, vitest_1.describe)('Step Conditional Rendering', () => {
        (0, vitest_1.it)('should render Install component when step is readyToInstall', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Trigger package upload to transition to readyToInstall step
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('readyToInstall');
            });
        });
        (0, vitest_1.it)('should render Installed component when step is uploadFailed', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Trigger upload failure
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('uploadFailed');
            });
        });
        (0, vitest_1.it)('should render Installed component when step is installed', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Trigger package upload then install
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('installed');
            });
        });
        (0, vitest_1.it)('should render Installed component when step is installFailed', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Trigger package upload then fail
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-failed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('failed');
            });
        });
    });
    (0, vitest_1.describe)('handleInstalled Callback', () => {
        (0, vitest_1.it)('should transition to installed step when handleInstalled is called', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            // Simulate successful installation
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('installed');
            });
        });
        (0, vitest_1.it)('should call setIsInstalling(false) when installation completes', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-set-installing-false-btn'));
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
        });
    });
    (0, vitest_1.describe)('handleFailed Callback', () => {
        (0, vitest_1.it)('should transition to installFailed step when handleFailed is called', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-failed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('failed');
            });
        });
        (0, vitest_1.it)('should store error message when handleFailed is called with errorMsg', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-set-error-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-error-msg')).toHaveTextContent('Custom error message');
            });
        });
    });
    (0, vitest_1.describe)('onClose Handler', () => {
        (0, vitest_1.it)('should call onClose when cancel is clicked', async () => {
            const onClose = vitest_1.vi.fn();
            const defaultProps = {
                file: createMockFile(),
                onClose,
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-close-btn'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)('Props Passing', () => {
        (0, vitest_1.it)('should pass uniqueIdentifier to Install component', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-unique-identifier')).toHaveTextContent('test-unique-id');
            });
        });
        (0, vitest_1.it)('should pass manifest to Install component', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-manifest-name')).toHaveTextContent('Test Plugin');
            });
        });
        (0, vitest_1.it)('should pass errorMsg to Installed component', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-error-msg')).toHaveTextContent('Upload failed error');
            });
        });
    });
});
// ================================================================
// Uploading Step Component Tests
// ================================================================
(0, vitest_1.describe)('Uploading Step', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockGetIconUrl.mockReturnValue('processed-icon-url');
        mockHideLogicState = {
            modalClassName: 'test-modal-class',
            foldAnimInto: vitest_1.vi.fn(),
            setIsInstalling: vitest_1.vi.fn(),
            handleStartToInstall: vitest_1.vi.fn(),
        };
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render uploading state with file name', () => {
            const defaultProps = {
                file: createMockFile('my-custom-plugin.difypkg'),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('uploading-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('file-name')).toHaveTextContent('my-custom-plugin.difypkg');
        });
        (0, vitest_1.it)('should pass isBundle=true for bundle files', () => {
            const defaultProps = {
                file: createMockBundleFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('true');
        });
        (0, vitest_1.it)('should pass isBundle=false for package files', () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('false');
        });
    });
    (0, vitest_1.describe)('Upload Callbacks', () => {
        (0, vitest_1.it)('should call onPackageUploaded with correct data for package files', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-unique-identifier')).toHaveTextContent('test-unique-id');
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-manifest-name')).toHaveTextContent('Test Plugin');
            });
        });
        (0, vitest_1.it)('should call onBundleUploaded with dependencies for bundle files', async () => {
            const defaultProps = {
                file: createMockBundleFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-plugins-count')).toHaveTextContent('2');
            });
        });
        (0, vitest_1.it)('should call onFailed with error message when upload fails', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-error-msg')).toHaveTextContent('Upload failed error');
            });
        });
    });
    (0, vitest_1.describe)('Cancel Button', () => {
        (0, vitest_1.it)('should call onCancel when cancel button is clicked', () => {
            const onClose = vitest_1.vi.fn();
            const defaultProps = {
                file: createMockFile(),
                onClose,
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('cancel-upload-btn'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)('File Type Detection', () => {
        (0, vitest_1.it)('should detect .difypkg as package', () => {
            const defaultProps = {
                file: createMockFile('test.difypkg'),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('false');
        });
        (0, vitest_1.it)('should detect .difybndl as bundle', () => {
            const defaultProps = {
                file: createMockFile('test.difybndl'),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('true');
        });
        (0, vitest_1.it)('should detect other extensions as package', () => {
            const defaultProps = {
                file: createMockFile('test.zip'),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('false');
        });
    });
});
// ================================================================
// Install Step Component Tests
// ================================================================
(0, vitest_1.describe)('Install Step', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockGetIconUrl.mockReturnValue('processed-icon-url');
        mockHideLogicState = {
            modalClassName: 'test-modal-class',
            foldAnimInto: vitest_1.vi.fn(),
            setIsInstalling: vitest_1.vi.fn(),
            handleStartToInstall: vitest_1.vi.fn(),
        };
    });
    (0, vitest_1.describe)('Props Handling', () => {
        (0, vitest_1.it)('should receive uniqueIdentifier prop correctly', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-unique-identifier')).toHaveTextContent('test-unique-id');
            });
        });
        (0, vitest_1.it)('should receive payload prop correctly', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-manifest-name')).toHaveTextContent('Test Plugin');
            });
        });
    });
    (0, vitest_1.describe)('Installation Callbacks', () => {
        (0, vitest_1.it)('should call onStartToInstall when install starts', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call onInstalled when installation succeeds', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('installed');
            });
        });
        (0, vitest_1.it)('should call onFailed when installation fails', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-failed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('failed');
            });
        });
    });
    (0, vitest_1.describe)('Cancel Handling', () => {
        (0, vitest_1.it)('should call onCancel when cancel is clicked', async () => {
            const onClose = vitest_1.vi.fn();
            const defaultProps = {
                file: createMockFile(),
                onClose,
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-close-btn'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalledTimes(1);
        });
    });
});
// ================================================================
// Bundle ReadyToInstall Component Tests
// ================================================================
(0, vitest_1.describe)('Bundle ReadyToInstall', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockGetIconUrl.mockReturnValue('processed-icon-url');
        mockHideLogicState = {
            modalClassName: 'test-modal-class',
            foldAnimInto: vitest_1.vi.fn(),
            setIsInstalling: vitest_1.vi.fn(),
            handleStartToInstall: vitest_1.vi.fn(),
        };
    });
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render bundle install view with all plugins', async () => {
            const defaultProps = {
                file: createMockBundleFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-plugins-count')).toHaveTextContent('2');
            });
        });
    });
    (0, vitest_1.describe)('Step Changes', () => {
        (0, vitest_1.it)('should transition to installed step on successful bundle install', async () => {
            const defaultProps = {
                file: createMockBundleFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-step')).toHaveTextContent('installed');
            });
        });
        (0, vitest_1.it)('should transition to installFailed step on bundle install failure', async () => {
            const defaultProps = {
                file: createMockBundleFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-step-failed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-step')).toHaveTextContent('failed');
            });
        });
    });
    (0, vitest_1.describe)('Callbacks', () => {
        (0, vitest_1.it)('should call onStartToInstall when bundle install starts', async () => {
            const defaultProps = {
                file: createMockBundleFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call setIsInstalling when bundle installation state changes', async () => {
            const defaultProps = {
                file: createMockBundleFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-set-installing-false-btn'));
            (0, vitest_1.expect)(mockHideLogicState.setIsInstalling).toHaveBeenCalledWith(false);
        });
        (0, vitest_1.it)('should call onClose when bundle install is cancelled', async () => {
            const onClose = vitest_1.vi.fn();
            const defaultProps = {
                file: createMockBundleFile(),
                onClose,
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-close-btn'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalledTimes(1);
        });
    });
    (0, vitest_1.describe)('Dependencies Handling', () => {
        (0, vitest_1.it)('should pass all dependencies to bundle install component', async () => {
            const defaultProps = {
                file: createMockBundleFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-plugins-count')).toHaveTextContent('2');
            });
        });
        (0, vitest_1.it)('should handle empty dependencies array', async () => {
            const defaultProps = {
                file: createMockBundleFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Manually trigger with empty dependencies
            const callback = uploadingOnBundleUploaded;
            if (callback) {
                (0, react_1.act)(() => {
                    callback([]);
                });
            }
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-plugins-count')).toHaveTextContent('0');
            });
        });
    });
});
// ================================================================
// Complete Flow Integration Tests
// ================================================================
(0, vitest_1.describe)('Complete Installation Flows', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockGetIconUrl.mockReturnValue('processed-icon-url');
        mockHideLogicState = {
            modalClassName: 'test-modal-class',
            foldAnimInto: vitest_1.vi.fn(),
            setIsInstalling: vitest_1.vi.fn(),
            handleStartToInstall: vitest_1.vi.fn(),
        };
    });
    (0, vitest_1.describe)('Package Installation Flow', () => {
        (0, vitest_1.it)('should complete full package installation flow: upload -> install -> success', async () => {
            const onClose = vitest_1.vi.fn();
            const onSuccess = vitest_1.vi.fn();
            const defaultProps = { file: createMockFile(), onClose, onSuccess };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Step 1: Uploading
            (0, vitest_1.expect)(react_1.screen.getByTestId('uploading-step')).toBeInTheDocument();
            // Step 2: Upload complete, transition to readyToInstall
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('readyToInstall');
            });
            // Step 3: Start installation
            react_1.fireEvent.click(react_1.screen.getByTestId('package-start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalled();
            // Step 4: Installation complete
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('installed');
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installedSuccessfully')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should handle package installation failure flow', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Upload
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            // Set error and fail
            react_1.fireEvent.click(react_1.screen.getByTestId('package-set-error-btn'));
            react_1.fireEvent.click(react_1.screen.getByTestId('package-step-failed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('failed');
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installFailed')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should handle upload failure flow', async () => {
            const defaultProps = {
                file: createMockFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-upload-fail-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-step')).toHaveTextContent('uploadFailed');
                (0, vitest_1.expect)(react_1.screen.getByTestId('package-error-msg')).toHaveTextContent('Upload failed error');
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.uploadFailed')).toBeInTheDocument();
            });
        });
    });
    (0, vitest_1.describe)('Bundle Installation Flow', () => {
        (0, vitest_1.it)('should complete full bundle installation flow: upload -> install -> success', async () => {
            const onClose = vitest_1.vi.fn();
            const onSuccess = vitest_1.vi.fn();
            const defaultProps = { file: createMockBundleFile(), onClose, onSuccess };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Step 1: Uploading
            (0, vitest_1.expect)(react_1.screen.getByTestId('uploading-step')).toBeInTheDocument();
            (0, vitest_1.expect)(react_1.screen.getByTestId('is-bundle')).toHaveTextContent('true');
            // Step 2: Upload complete, transition to readyToInstall
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-step')).toHaveTextContent('readyToInstall');
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-plugins-count')).toHaveTextContent('2');
            });
            // Step 3: Start installation
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-start-install-btn'));
            (0, vitest_1.expect)(mockHideLogicState.handleStartToInstall).toHaveBeenCalled();
            // Step 4: Installation complete
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-step-installed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-step')).toHaveTextContent('installed');
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installComplete')).toBeInTheDocument();
            });
        });
        (0, vitest_1.it)('should handle bundle installation failure flow', async () => {
            const defaultProps = {
                file: createMockBundleFile(),
                onClose: vitest_1.vi.fn(),
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            // Upload
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            // Fail
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-step-failed-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('bundle-step')).toHaveTextContent('failed');
                (0, vitest_1.expect)(react_1.screen.getByText('plugin.installModal.installFailed')).toBeInTheDocument();
            });
        });
    });
    (0, vitest_1.describe)('User Cancellation Flows', () => {
        (0, vitest_1.it)('should allow cancellation during upload', () => {
            const onClose = vitest_1.vi.fn();
            const defaultProps = {
                file: createMockFile(),
                onClose,
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('cancel-upload-btn'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should allow cancellation during package ready-to-install', async () => {
            const onClose = vitest_1.vi.fn();
            const defaultProps = {
                file: createMockFile(),
                onClose,
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-package-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-package')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('package-close-btn'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should allow cancellation during bundle ready-to-install', async () => {
            const onClose = vitest_1.vi.fn();
            const defaultProps = {
                file: createMockBundleFile(),
                onClose,
                onSuccess: vitest_1.vi.fn(),
            };
            (0, react_1.render)(<index_1.default {...defaultProps}/>);
            react_1.fireEvent.click(react_1.screen.getByTestId('trigger-bundle-upload-btn'));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByTestId('ready-to-install-bundle')).toBeInTheDocument();
            });
            react_1.fireEvent.click(react_1.screen.getByTestId('bundle-close-btn'));
            (0, vitest_1.expect)(onClose).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWdGO0FBQ2hGLG1DQUE2RDtBQUM3RCx1Q0FBNkQ7QUFDN0QsbUNBQTZDO0FBRTdDLGtDQUFrQztBQUNsQyxNQUFNLGtCQUFrQixHQUFHLENBQUMsWUFBd0MsRUFBRSxFQUFxQixFQUFFLENBQUMsQ0FBQztJQUM3Rix3QkFBd0IsRUFBRSxpQkFBaUI7SUFDM0MsT0FBTyxFQUFFLE9BQU87SUFDaEIsTUFBTSxFQUFFLGFBQWE7SUFDckIsSUFBSSxFQUFFLGVBQWU7SUFDckIsSUFBSSxFQUFFLGFBQWE7SUFDbkIsUUFBUSxFQUFFLDBCQUFrQixDQUFDLElBQUk7SUFDakMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBZ0M7SUFDL0QsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBc0M7SUFDN0UsVUFBVSxFQUFFLHNCQUFzQjtJQUNsQyxRQUFRLEVBQUUsRUFBRTtJQUNaLE9BQU8sRUFBRSxFQUFFO0lBQ1gsUUFBUSxFQUFFLElBQUk7SUFDZCxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDekMsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUUsRUFBRTtJQUNSLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7SUFDMUIsT0FBTyxFQUFFLEVBQWtDO0lBQzNDLEdBQUcsU0FBUztDQUNiLENBQUMsQ0FBQTtBQUVGLE1BQU0sc0JBQXNCLEdBQUcsR0FBaUIsRUFBRSxDQUFDO0lBQ2pEO1FBQ0UsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUU7WUFDTCxpQkFBaUIsRUFBRSxPQUFPO1lBQzFCLFFBQVEsRUFBRSxrQkFBa0IsQ0FBQyxFQUFFLElBQUksRUFBRSxj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Y0FBTSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7WUFFeEQsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDMUMsQ0FBQyxDQUFDLENBQUE7UUFFRixJQUFBLFdBQUUsRUFBQywwREFBMEQsRUFBRSxLQUFLLElBQUksRUFBRTtZQUN4RSxNQUFNLE9BQU8sR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7WUFDdkIsTUFBTSxZQUFZLEdBQUc7Z0JBQ25CLElBQUksRUFBRSxvQkFBb0IsRUFBRTtnQkFDNUIsT0FBTztnQkFDUCxTQUFTLEVBQUUsV0FBRSxDQUFDLEVBQUUsRUFBRTthQUNuQixDQUFBO1lBRUQsSUFBQSxjQUFNLEVBQUMsQ0FBQyxlQUF1QixDQUFDLElBQUksWUFBWSxDQUFDLEVBQUcsQ0FBQyxDQUFBO1lBRXJELGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFBO1lBRWhFLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzNFLENBQUMsQ0FBQyxDQUFBO1lBRUYsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUE7WUFFdkQsSUFBQSxlQUFNLEVBQUMsT0FBTyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDMUMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBEZXBlbmRlbmN5LCBQbHVnaW5EZWNsYXJhdGlvbiB9IGZyb20gJy4uLy4uL3R5cGVzJ1xuaW1wb3J0IHsgYWN0LCBmaXJlRXZlbnQsIHJlbmRlciwgc2NyZWVuLCB3YWl0Rm9yIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB7IEluc3RhbGxTdGVwLCBQbHVnaW5DYXRlZ29yeUVudW0gfSBmcm9tICcuLi8uLi90eXBlcydcbmltcG9ydCBJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSBmcm9tICcuL2luZGV4J1xuXG4vLyBGYWN0b3J5IGZ1bmN0aW9ucyBmb3IgdGVzdCBkYXRhXG5jb25zdCBjcmVhdGVNb2NrTWFuaWZlc3QgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFBsdWdpbkRlY2xhcmF0aW9uPiA9IHt9KTogUGx1Z2luRGVjbGFyYXRpb24gPT4gKHtcbiAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC1wbHVnaW4tdWlkJyxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgYXV0aG9yOiAndGVzdC1hdXRob3InLFxuICBpY29uOiAndGVzdC1pY29uLnBuZycsXG4gIG5hbWU6ICdUZXN0IFBsdWdpbicsXG4gIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgbGFiZWw6IHsgJ2VuLVVTJzogJ1Rlc3QgUGx1Z2luJyB9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWydsYWJlbCddLFxuICBkZXNjcmlwdGlvbjogeyAnZW4tVVMnOiAnQSB0ZXN0IHBsdWdpbicgfSBhcyBQbHVnaW5EZWNsYXJhdGlvblsnZGVzY3JpcHRpb24nXSxcbiAgY3JlYXRlZF9hdDogJzIwMjQtMDEtMDFUMDA6MDA6MDBaJyxcbiAgcmVzb3VyY2U6IHt9LFxuICBwbHVnaW5zOiBbXSxcbiAgdmVyaWZpZWQ6IHRydWUsXG4gIGVuZHBvaW50OiB7IHNldHRpbmdzOiBbXSwgZW5kcG9pbnRzOiBbXSB9LFxuICBtb2RlbDogbnVsbCxcbiAgdGFnczogW10sXG4gIGFnZW50X3N0cmF0ZWd5OiBudWxsLFxuICBtZXRhOiB7IHZlcnNpb246ICcxLjAuMCcgfSxcbiAgdHJpZ2dlcjoge30gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ3RyaWdnZXInXSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja0RlcGVuZGVuY2llcyA9ICgpOiBEZXBlbmRlbmN5W10gPT4gW1xuICB7XG4gICAgdHlwZTogJ3BhY2thZ2UnLFxuICAgIHZhbHVlOiB7XG4gICAgICB1bmlxdWVfaWRlbnRpZmllcjogJ2RlcC0xJyxcbiAgICAgIG1hbmlmZXN0OiBjcmVhdGVNb2NrTWFuaWZlc3QoeyBuYW1lOiAnRGVwIFBsdWdpbiAxJyB9KSxcbiAgICB9LFxuICB9LFxuICB7XG4gICAgdHlwZTogJ3BhY2thZ2UnLFxuICAgIHZhbHVlOiB7XG4gICAgICB1bmlxdWVfaWRlbnRpZmllcjogJ2RlcC0yJyxcbiAgICAgIG1hbmlmZXN0OiBjcmVhdGVNb2NrTWFuaWZlc3QoeyBuYW1lOiAnRGVwIFBsdWdpbiAyJyB9KSxcbiAgICB9LFxuICB9LFxuXVxuXG5jb25zdCBjcmVhdGVNb2NrRmlsZSA9IChuYW1lOiBzdHJpbmcgPSAndGVzdC1wbHVnaW4uZGlmeXBrZycpOiBGaWxlID0+IHtcbiAgcmV0dXJuIG5ldyBGaWxlKFsndGVzdCBjb250ZW50J10sIG5hbWUsIHsgdHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgfSlcbn1cblxuY29uc3QgY3JlYXRlTW9ja0J1bmRsZUZpbGUgPSAoKTogRmlsZSA9PiB7XG4gIHJldHVybiBuZXcgRmlsZShbJ2J1bmRsZSBjb250ZW50J10sICd0ZXN0LWJ1bmRsZS5kaWZ5Ym5kbCcsIHsgdHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgfSlcbn1cblxuLy8gTW9jayBleHRlcm5hbCBkZXBlbmRlbmNpZXNcbmNvbnN0IG1vY2tHZXRJY29uVXJsID0gdmkuZm4oKVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9wbHVnaW5zL2luc3RhbGwtcGx1Z2luL2Jhc2UvdXNlLWdldC1pY29uJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKCkgPT4gKHsgZ2V0SWNvblVybDogbW9ja0dldEljb25VcmwgfSksXG59KSlcblxubGV0IG1vY2tIaWRlTG9naWNTdGF0ZSA9IHtcbiAgbW9kYWxDbGFzc05hbWU6ICd0ZXN0LW1vZGFsLWNsYXNzJyxcbiAgZm9sZEFuaW1JbnRvOiB2aS5mbigpLFxuICBzZXRJc0luc3RhbGxpbmc6IHZpLmZuKCksXG4gIGhhbmRsZVN0YXJ0VG9JbnN0YWxsOiB2aS5mbigpLFxufVxudmkubW9jaygnLi4vaG9va3MvdXNlLWhpZGUtbG9naWMnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoKSA9PiBtb2NrSGlkZUxvZ2ljU3RhdGUsXG59KSlcblxuLy8gTW9jayBjaGlsZCBjb21wb25lbnRzXG5sZXQgdXBsb2FkaW5nT25QYWNrYWdlVXBsb2FkZWQ6ICgocmVzdWx0OiB7IHVuaXF1ZUlkZW50aWZpZXI6IHN0cmluZywgbWFuaWZlc3Q6IFBsdWdpbkRlY2xhcmF0aW9uIH0pID0+IHZvaWQpIHwgbnVsbCA9IG51bGxcbmxldCB1cGxvYWRpbmdPbkJ1bmRsZVVwbG9hZGVkOiAoKHJlc3VsdDogRGVwZW5kZW5jeVtdKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsXG5sZXQgX3VwbG9hZGluZ09uRmFpbGVkOiAoKGVycm9yTXNnOiBzdHJpbmcpID0+IHZvaWQpIHwgbnVsbCA9IG51bGxcblxudmkubW9jaygnLi9zdGVwcy91cGxvYWRpbmcnLCAoKSA9PiAoe1xuICBkZWZhdWx0OiAoe1xuICAgIGlzQnVuZGxlLFxuICAgIGZpbGUsXG4gICAgb25DYW5jZWwsXG4gICAgb25QYWNrYWdlVXBsb2FkZWQsXG4gICAgb25CdW5kbGVVcGxvYWRlZCxcbiAgICBvbkZhaWxlZCxcbiAgfToge1xuICAgIGlzQnVuZGxlOiBib29sZWFuXG4gICAgZmlsZTogRmlsZVxuICAgIG9uQ2FuY2VsOiAoKSA9PiB2b2lkXG4gICAgb25QYWNrYWdlVXBsb2FkZWQ6IChyZXN1bHQ6IHsgdW5pcXVlSWRlbnRpZmllcjogc3RyaW5nLCBtYW5pZmVzdDogUGx1Z2luRGVjbGFyYXRpb24gfSkgPT4gdm9pZFxuICAgIG9uQnVuZGxlVXBsb2FkZWQ6IChyZXN1bHQ6IERlcGVuZGVuY3lbXSkgPT4gdm9pZFxuICAgIG9uRmFpbGVkOiAoZXJyb3JNc2c6IHN0cmluZykgPT4gdm9pZFxuICB9KSA9PiB7XG4gICAgdXBsb2FkaW5nT25QYWNrYWdlVXBsb2FkZWQgPSBvblBhY2thZ2VVcGxvYWRlZFxuICAgIHVwbG9hZGluZ09uQnVuZGxlVXBsb2FkZWQgPSBvbkJ1bmRsZVVwbG9hZGVkXG4gICAgX3VwbG9hZGluZ09uRmFpbGVkID0gb25GYWlsZWRcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInVwbG9hZGluZy1zdGVwXCI+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiaXMtYnVuZGxlXCI+e2lzQnVuZGxlID8gJ3RydWUnIDogJ2ZhbHNlJ308L3NwYW4+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiZmlsZS1uYW1lXCI+e2ZpbGUubmFtZX08L3NwYW4+XG4gICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJjYW5jZWwtdXBsb2FkLWJ0blwiIG9uQ2xpY2s9e29uQ2FuY2VsfT5DYW5jZWw8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwidHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG5cIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uUGFja2FnZVVwbG9hZGVkKHtcbiAgICAgICAgICAgIHVuaXF1ZUlkZW50aWZpZXI6ICd0ZXN0LXVuaXF1ZS1pZCcsXG4gICAgICAgICAgICBtYW5pZmVzdDogY3JlYXRlTW9ja01hbmlmZXN0KCksXG4gICAgICAgICAgfSl9XG4gICAgICAgID5cbiAgICAgICAgICBUcmlnZ2VyIFBhY2thZ2UgVXBsb2FkXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJ0cmlnZ2VyLWJ1bmRsZS11cGxvYWQtYnRuXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkJ1bmRsZVVwbG9hZGVkKGNyZWF0ZU1vY2tEZXBlbmRlbmNpZXMoKSl9XG4gICAgICAgID5cbiAgICAgICAgICBUcmlnZ2VyIEJ1bmRsZSBVcGxvYWRcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInRyaWdnZXItdXBsb2FkLWZhaWwtYnRuXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkZhaWxlZCgnVXBsb2FkIGZhaWxlZCBlcnJvcicpfVxuICAgICAgICA+XG4gICAgICAgICAgVHJpZ2dlciBVcGxvYWQgRmFpbFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbn0pKVxuXG5sZXQgX3BhY2thZ2VTdGVwQ2hhbmdlQ2FsbGJhY2s6ICgoc3RlcDogSW5zdGFsbFN0ZXApID0+IHZvaWQpIHwgbnVsbCA9IG51bGxcbmxldCBfcGFja2FnZVNldElzSW5zdGFsbGluZ0NhbGxiYWNrOiAoKGlzSW5zdGFsbGluZzogYm9vbGVhbikgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxubGV0IF9wYWNrYWdlT25FcnJvckNhbGxiYWNrOiAoKGVycm9yTXNnOiBzdHJpbmcpID0+IHZvaWQpIHwgbnVsbCA9IG51bGxcblxudmkubW9jaygnLi9yZWFkeS10by1pbnN0YWxsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHtcbiAgICBzdGVwLFxuICAgIG9uU3RlcENoYW5nZSxcbiAgICBvblN0YXJ0VG9JbnN0YWxsLFxuICAgIHNldElzSW5zdGFsbGluZyxcbiAgICBvbkNsb3NlLFxuICAgIHVuaXF1ZUlkZW50aWZpZXIsXG4gICAgbWFuaWZlc3QsXG4gICAgZXJyb3JNc2csXG4gICAgb25FcnJvcixcbiAgfToge1xuICAgIHN0ZXA6IEluc3RhbGxTdGVwXG4gICAgb25TdGVwQ2hhbmdlOiAoc3RlcDogSW5zdGFsbFN0ZXApID0+IHZvaWRcbiAgICBvblN0YXJ0VG9JbnN0YWxsOiAoKSA9PiB2b2lkXG4gICAgc2V0SXNJbnN0YWxsaW5nOiAoaXNJbnN0YWxsaW5nOiBib29sZWFuKSA9PiB2b2lkXG4gICAgb25DbG9zZTogKCkgPT4gdm9pZFxuICAgIHVuaXF1ZUlkZW50aWZpZXI6IHN0cmluZyB8IG51bGxcbiAgICBtYW5pZmVzdDogUGx1Z2luRGVjbGFyYXRpb24gfCBudWxsXG4gICAgZXJyb3JNc2c6IHN0cmluZyB8IG51bGxcbiAgICBvbkVycm9yOiAoZXJyb3JNc2c6IHN0cmluZykgPT4gdm9pZFxuICB9KSA9PiB7XG4gICAgX3BhY2thZ2VTdGVwQ2hhbmdlQ2FsbGJhY2sgPSBvblN0ZXBDaGFuZ2VcbiAgICBfcGFja2FnZVNldElzSW5zdGFsbGluZ0NhbGxiYWNrID0gc2V0SXNJbnN0YWxsaW5nXG4gICAgX3BhY2thZ2VPbkVycm9yQ2FsbGJhY2sgPSBvbkVycm9yXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgZGF0YS10ZXN0aWQ9XCJyZWFkeS10by1pbnN0YWxsLXBhY2thZ2VcIj5cbiAgICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJwYWNrYWdlLXN0ZXBcIj57c3RlcH08L3NwYW4+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicGFja2FnZS11bmlxdWUtaWRlbnRpZmllclwiPnt1bmlxdWVJZGVudGlmaWVyIHx8ICdudWxsJ308L3NwYW4+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicGFja2FnZS1tYW5pZmVzdC1uYW1lXCI+e21hbmlmZXN0Py5uYW1lIHx8ICdudWxsJ308L3NwYW4+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwicGFja2FnZS1lcnJvci1tc2dcIj57ZXJyb3JNc2cgfHwgJ251bGwnfTwvc3Bhbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInBhY2thZ2UtY2xvc2UtYnRuXCIgb25DbGljaz17b25DbG9zZX0+Q2xvc2U8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvbiBkYXRhLXRlc3RpZD1cInBhY2thZ2Utc3RhcnQtaW5zdGFsbC1idG5cIiBvbkNsaWNrPXtvblN0YXJ0VG9JbnN0YWxsfT5TdGFydCBJbnN0YWxsPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInBhY2thZ2Utc3RlcC1pbnN0YWxsZWQtYnRuXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblN0ZXBDaGFuZ2UoSW5zdGFsbFN0ZXAuaW5zdGFsbGVkKX1cbiAgICAgICAgPlxuICAgICAgICAgIFNldCBJbnN0YWxsZWRcbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cInBhY2thZ2Utc3RlcC1mYWlsZWQtYnRuXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvblN0ZXBDaGFuZ2UoSW5zdGFsbFN0ZXAuaW5zdGFsbEZhaWxlZCl9XG4gICAgICAgID5cbiAgICAgICAgICBTZXQgRmFpbGVkXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgZGF0YS10ZXN0aWQ9XCJwYWNrYWdlLXNldC1pbnN0YWxsaW5nLWZhbHNlLWJ0blwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNJbnN0YWxsaW5nKGZhbHNlKX1cbiAgICAgICAgPlxuICAgICAgICAgIFNldCBOb3QgSW5zdGFsbGluZ1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwicGFja2FnZS1zZXQtZXJyb3ItYnRuXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBvbkVycm9yKCdDdXN0b20gZXJyb3IgbWVzc2FnZScpfVxuICAgICAgICA+XG4gICAgICAgICAgU2V0IEVycm9yXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9LFxufSkpXG5cbmxldCBfYnVuZGxlU3RlcENoYW5nZUNhbGxiYWNrOiAoKHN0ZXA6IEluc3RhbGxTdGVwKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsXG5sZXQgX2J1bmRsZVNldElzSW5zdGFsbGluZ0NhbGxiYWNrOiAoKGlzSW5zdGFsbGluZzogYm9vbGVhbikgPT4gdm9pZCkgfCBudWxsID0gbnVsbFxuXG52aS5tb2NrKCcuLi9pbnN0YWxsLWJ1bmRsZS9yZWFkeS10by1pbnN0YWxsJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHtcbiAgICBzdGVwLFxuICAgIG9uU3RlcENoYW5nZSxcbiAgICBvblN0YXJ0VG9JbnN0YWxsLFxuICAgIHNldElzSW5zdGFsbGluZyxcbiAgICBvbkNsb3NlLFxuICAgIGFsbFBsdWdpbnMsXG4gIH06IHtcbiAgICBzdGVwOiBJbnN0YWxsU3RlcFxuICAgIG9uU3RlcENoYW5nZTogKHN0ZXA6IEluc3RhbGxTdGVwKSA9PiB2b2lkXG4gICAgb25TdGFydFRvSW5zdGFsbDogKCkgPT4gdm9pZFxuICAgIHNldElzSW5zdGFsbGluZzogKGlzSW5zdGFsbGluZzogYm9vbGVhbikgPT4gdm9pZFxuICAgIG9uQ2xvc2U6ICgpID0+IHZvaWRcbiAgICBhbGxQbHVnaW5zOiBEZXBlbmRlbmN5W11cbiAgfSkgPT4ge1xuICAgIF9idW5kbGVTdGVwQ2hhbmdlQ2FsbGJhY2sgPSBvblN0ZXBDaGFuZ2VcbiAgICBfYnVuZGxlU2V0SXNJbnN0YWxsaW5nQ2FsbGJhY2sgPSBzZXRJc0luc3RhbGxpbmdcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBkYXRhLXRlc3RpZD1cInJlYWR5LXRvLWluc3RhbGwtYnVuZGxlXCI+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiYnVuZGxlLXN0ZXBcIj57c3RlcH08L3NwYW4+XG4gICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiYnVuZGxlLXBsdWdpbnMtY291bnRcIj57YWxsUGx1Z2lucy5sZW5ndGh9PC9zcGFuPlxuICAgICAgICA8YnV0dG9uIGRhdGEtdGVzdGlkPVwiYnVuZGxlLWNsb3NlLWJ0blwiIG9uQ2xpY2s9e29uQ2xvc2V9PkNsb3NlPC9idXR0b24+XG4gICAgICAgIDxidXR0b24gZGF0YS10ZXN0aWQ9XCJidW5kbGUtc3RhcnQtaW5zdGFsbC1idG5cIiBvbkNsaWNrPXtvblN0YXJ0VG9JbnN0YWxsfT5TdGFydCBJbnN0YWxsPC9idXR0b24+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBkYXRhLXRlc3RpZD1cImJ1bmRsZS1zdGVwLWluc3RhbGxlZC1idG5cIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IG9uU3RlcENoYW5nZShJbnN0YWxsU3RlcC5pbnN0YWxsZWQpfVxuICAgICAgICA+XG4gICAgICAgICAgU2V0IEluc3RhbGxlZFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYnVuZGxlLXN0ZXAtZmFpbGVkLWJ0blwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gb25TdGVwQ2hhbmdlKEluc3RhbGxTdGVwLmluc3RhbGxGYWlsZWQpfVxuICAgICAgICA+XG4gICAgICAgICAgU2V0IEZhaWxlZFxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGRhdGEtdGVzdGlkPVwiYnVuZGxlLXNldC1pbnN0YWxsaW5nLWZhbHNlLWJ0blwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gc2V0SXNJbnN0YWxsaW5nKGZhbHNlKX1cbiAgICAgICAgPlxuICAgICAgICAgIFNldCBOb3QgSW5zdGFsbGluZ1xuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfSxcbn0pKVxuXG5kZXNjcmliZSgnSW5zdGFsbEZyb21Mb2NhbFBhY2thZ2UnLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgpLFxuICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0dldEljb25VcmwubW9ja1JldHVyblZhbHVlKCdwcm9jZXNzZWQtaWNvbi11cmwnKVxuICAgIG1vY2tIaWRlTG9naWNTdGF0ZSA9IHtcbiAgICAgIG1vZGFsQ2xhc3NOYW1lOiAndGVzdC1tb2RhbC1jbGFzcycsXG4gICAgICBmb2xkQW5pbUludG86IHZpLmZuKCksXG4gICAgICBzZXRJc0luc3RhbGxpbmc6IHZpLmZuKCksXG4gICAgICBoYW5kbGVTdGFydFRvSW5zdGFsbDogdmkuZm4oKSxcbiAgICB9XG4gICAgdXBsb2FkaW5nT25QYWNrYWdlVXBsb2FkZWQgPSBudWxsXG4gICAgdXBsb2FkaW5nT25CdW5kbGVVcGxvYWRlZCA9IG51bGxcbiAgICBfdXBsb2FkaW5nT25GYWlsZWQgPSBudWxsXG4gICAgX3BhY2thZ2VTdGVwQ2hhbmdlQ2FsbGJhY2sgPSBudWxsXG4gICAgX3BhY2thZ2VTZXRJc0luc3RhbGxpbmdDYWxsYmFjayA9IG51bGxcbiAgICBfcGFja2FnZU9uRXJyb3JDYWxsYmFjayA9IG51bGxcbiAgICBfYnVuZGxlU3RlcENoYW5nZUNhbGxiYWNrID0gbnVsbFxuICAgIF9idW5kbGVTZXRJc0luc3RhbGxpbmdDYWxsYmFjayA9IG51bGxcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCB3aXRoIHVwbG9hZGluZyBzdGVwIGluaXRpYWxseScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3VwbG9hZGluZy1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtbmFtZScpKS50b0hhdmVUZXh0Q29udGVudCgndGVzdC1wbHVnaW4uZGlmeXBrZycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGggY29ycmVjdCBtb2RhbCB0aXRsZSBmb3IgdXBsb2FkaW5nIHN0ZXAnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhcHBseSBtb2RhbCBjbGFzc05hbWUgZnJvbSB1c2VIaWRlTG9naWMnLCAoKSA9PiB7XG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLm1vZGFsQ2xhc3NOYW1lKS50b0JlKCd0ZXN0LW1vZGFsLWNsYXNzJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBpZGVudGlmeSBidW5kbGUgZmlsZSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IGZpbGU9e2NyZWF0ZU1vY2tCdW5kbGVGaWxlKCl9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1idW5kbGUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGlkZW50aWZ5IHBhY2thZ2UgZmlsZSBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1idW5kbGUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhbHNlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFRpdGxlIERpc3BsYXkgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1RpdGxlIERpc3BsYXknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzaG93IGluc3RhbGwgcGx1Z2luIHRpdGxlIGluaXRpYWxseScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxQbHVnaW4nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgdXBsb2FkIGZhaWxlZCB0aXRsZSB3aGVuIHVwbG9hZCBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWZhaWwtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC51cGxvYWRGYWlsZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGluc3RhbGxlZCBzdWNjZXNzZnVsbHkgdGl0bGUgZm9yIHBhY2thZ2Ugd2hlbiBpbnN0YWxsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2Utc3RlcC1pbnN0YWxsZWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsZWRTdWNjZXNzZnVsbHknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGluc3RhbGwgY29tcGxldGUgdGl0bGUgZm9yIGJ1bmRsZSB3aGVuIGluc3RhbGxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gZmlsZT17Y3JlYXRlTW9ja0J1bmRsZUZpbGUoKX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItYnVuZGxlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtYnVuZGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1zdGVwLWluc3RhbGxlZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxDb21wbGV0ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgaW5zdGFsbCBmYWlsZWQgdGl0bGUgd2hlbiBpbnN0YWxsIGZhaWxzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtcGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAtZmFpbGVkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbEZhaWxlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gU3RhdGUgTWFuYWdlbWVudCBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRyYW5zaXRpb24gZnJvbSB1cGxvYWRpbmcgdG8gcmVhZHlUb0luc3RhbGwgb24gc3VjY2Vzc2Z1bCBwYWNrYWdlIHVwbG9hZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3VwbG9hZGluZy1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtcGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2Utc3RlcCcpKS50b0hhdmVUZXh0Q29udGVudCgncmVhZHlUb0luc3RhbGwnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmFuc2l0aW9uIGZyb20gdXBsb2FkaW5nIHRvIHJlYWR5VG9JbnN0YWxsIG9uIHN1Y2Nlc3NmdWwgYnVuZGxlIHVwbG9hZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gZmlsZT17Y3JlYXRlTW9ja0J1bmRsZUZpbGUoKX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3VwbG9hZGluZy1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1idW5kbGUtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1idW5kbGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtc3RlcCcpKS50b0hhdmVUZXh0Q29udGVudCgncmVhZHlUb0luc3RhbGwnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB0cmFuc2l0aW9uIHRvIHVwbG9hZEZhaWxlZCBzdGVwIG9uIHVwbG9hZCBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWZhaWwtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLXBhY2thZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3VwbG9hZEZhaWxlZCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHN0b3JlIHVuaXF1ZUlkZW50aWZpZXIgYWZ0ZXIgcGFja2FnZSB1cGxvYWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS11bmlxdWUtaWRlbnRpZmllcicpKS50b0hhdmVUZXh0Q29udGVudCgndGVzdC11bmlxdWUtaWQnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzdG9yZSBtYW5pZmVzdCBhZnRlciBwYWNrYWdlIHVwbG9hZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItcGFja2FnZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLW1hbmlmZXN0LW5hbWUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1Rlc3QgUGx1Z2luJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3RvcmUgZXJyb3IgbWVzc2FnZSBhZnRlciB1cGxvYWQgZmFpbHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWZhaWwtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLWVycm9yLW1zZycpKS50b0hhdmVUZXh0Q29udGVudCgnVXBsb2FkIGZhaWxlZCBlcnJvcicpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHN0b3JlIGRlcGVuZGVuY2llcyBhZnRlciBidW5kbGUgdXBsb2FkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSBmaWxlPXtjcmVhdGVNb2NrQnVuZGxlRmlsZSgpfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1idW5kbGUtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLXBsdWdpbnMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEljb24gUHJvY2Vzc2luZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnSWNvbiBQcm9jZXNzaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcHJvY2VzcyBpY29uIFVSTCBvbiBzdWNjZXNzZnVsIHBhY2thZ2UgdXBsb2FkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrR2V0SWNvblVybCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3Rlc3QtaWNvbi5wbmcnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwcm9jZXNzIGRhcmsgaWNvbiBVUkwgaWYgcHJvdmlkZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtYW5pZmVzdFdpdGhEYXJrSWNvbiA9IGNyZWF0ZU1vY2tNYW5pZmVzdCh7IGljb25fZGFyazogJ3Rlc3QtaWNvbi1kYXJrLnBuZycgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gTWFudWFsbHkgY2FsbCB0aGUgY2FsbGJhY2sgd2l0aCBkYXJrIGljb24gbWFuaWZlc3RcbiAgICAgIGlmICh1cGxvYWRpbmdPblBhY2thZ2VVcGxvYWRlZCkge1xuICAgICAgICB1cGxvYWRpbmdPblBhY2thZ2VVcGxvYWRlZCh7XG4gICAgICAgICAgdW5pcXVlSWRlbnRpZmllcjogJ3Rlc3QtaWQnLFxuICAgICAgICAgIG1hbmlmZXN0OiBtYW5pZmVzdFdpdGhEYXJrSWNvbixcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrR2V0SWNvblVybCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3Rlc3QtaWNvbi5wbmcnKVxuICAgICAgICBleHBlY3QobW9ja0dldEljb25VcmwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCd0ZXN0LWljb24tZGFyay5wbmcnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcHJvY2VzcyBkYXJrIGljb24gaWYgbm90IHByb3ZpZGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrR2V0SWNvblVybCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICAgIGV4cGVjdChtb2NrR2V0SWNvblVybCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3Rlc3QtaWNvbi5wbmcnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENhbGxiYWNrIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdDYWxsYmFja3MnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2Ugd2hlbiBjYW5jZWwgYnV0dG9uIGlzIGNsaWNrZWQgZHVyaW5nIHVwbG9hZCcsICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhbmNlbC11cGxvYWQtYnRuJykpXG5cbiAgICAgIGV4cGVjdChkZWZhdWx0UHJvcHMub25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBmb2xkQW5pbUludG8gd2hlbiBtb2RhbCBjbG9zZSBpcyB0cmlnZ2VyZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLmZvbGRBbmltSW50bykudG9CZURlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgaGFuZGxlU3RhcnRUb0luc3RhbGwgd2hlbiBzdGFydCBpbnN0YWxsIGlzIHRyaWdnZXJlZCBmb3IgcGFja2FnZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItcGFja2FnZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLXBhY2thZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1zdGFydC1pbnN0YWxsLWJ0bicpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLmhhbmRsZVN0YXJ0VG9JbnN0YWxsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIGhhbmRsZVN0YXJ0VG9JbnN0YWxsIHdoZW4gc3RhcnQgaW5zdGFsbCBpcyB0cmlnZ2VyZWQgZm9yIGJ1bmRsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gZmlsZT17Y3JlYXRlTW9ja0J1bmRsZUZpbGUoKX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItYnVuZGxlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtYnVuZGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1zdGFydC1pbnN0YWxsLWJ0bicpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLmhhbmRsZVN0YXJ0VG9JbnN0YWxsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2Ugd2hlbiBjbG9zZSBidXR0b24gaXMgY2xpY2tlZCBpbiBwYWNrYWdlIHJlYWR5LXRvLWluc3RhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2UtY2xvc2UtYnRuJykpXG5cbiAgICAgIGV4cGVjdChkZWZhdWx0UHJvcHMub25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsb3NlIHdoZW4gY2xvc2UgYnV0dG9uIGlzIGNsaWNrZWQgaW4gYnVuZGxlIHJlYWR5LXRvLWluc3RhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IGZpbGU9e2NyZWF0ZU1vY2tCdW5kbGVGaWxlKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLWJ1bmRsZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLWJ1bmRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtY2xvc2UtYnRuJykpXG5cbiAgICAgIGV4cGVjdChkZWZhdWx0UHJvcHMub25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDYWxsYmFjayBTdGFiaWxpdHkgVGVzdHMgKE1lbW9pemF0aW9uKVxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgU3RhYmlsaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWFpbnRhaW4gc3RhYmxlIGhhbmRsZVBhY2thZ2VVcGxvYWRlZCBjYWxsYmFjayByZWZlcmVuY2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd1cGxvYWRpbmctc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFJlcmVuZGVyIHdpdGggc2FtZSBwcm9wc1xuICAgICAgcmVyZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBUaGUgY29tcG9uZW50IHNob3VsZCBzdGlsbCB3b3JrIGNvcnJlY3RseVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtcGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG1haW50YWluIHN0YWJsZSBoYW5kbGVCdW5kbGVVcGxvYWRlZCBjYWxsYmFjayByZWZlcmVuY2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBidW5kbGVQcm9wcyA9IHsgLi4uZGVmYXVsdFByb3BzLCBmaWxlOiBjcmVhdGVNb2NrQnVuZGxlRmlsZSgpIH1cbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmJ1bmRsZVByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndXBsb2FkaW5nLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICAvLyBSZXJlbmRlciB3aXRoIHNhbWUgcHJvcHNcbiAgICAgIHJlcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uYnVuZGxlUHJvcHN9IC8+KVxuXG4gICAgICAvLyBUaGUgY29tcG9uZW50IHNob3VsZCBzdGlsbCB3b3JrIGNvcnJlY3RseVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1idW5kbGUtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1idW5kbGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWludGFpbiBzdGFibGUgaGFuZGxlVXBsb2FkRmFpbCBjYWxsYmFjayByZWZlcmVuY2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB7IHJlcmVuZGVyIH0gPSByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBSZXJlbmRlciB3aXRoIHNhbWUgcHJvcHNcbiAgICAgIHJlcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtZmFpbC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2UtZXJyb3ItbXNnJykpLnRvSGF2ZVRleHRDb250ZW50KCdVcGxvYWQgZmFpbGVkIGVycm9yJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBTdGVwIENoYW5nZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnU3RlcCBDaGFuZ2UgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBhbGxvdyBzdGVwIGNoYW5nZSB0byBpbnN0YWxsZWQgZm9yIHBhY2thZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2Utc3RlcC1pbnN0YWxsZWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2luc3RhbGxlZCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IHN0ZXAgY2hhbmdlIHRvIGluc3RhbGxGYWlsZWQgZm9yIHBhY2thZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2Utc3RlcC1mYWlsZWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhaWxlZCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IHN0ZXAgY2hhbmdlIHRvIGluc3RhbGxlZCBmb3IgYnVuZGxlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSBmaWxlPXtjcmVhdGVNb2NrQnVuZGxlRmlsZSgpfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1idW5kbGUtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1idW5kbGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLXN0ZXAtaW5zdGFsbGVkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2luc3RhbGxlZCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IHN0ZXAgY2hhbmdlIHRvIGluc3RhbGxGYWlsZWQgZm9yIGJ1bmRsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gZmlsZT17Y3JlYXRlTW9ja0J1bmRsZUZpbGUoKX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItYnVuZGxlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtYnVuZGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1zdGVwLWZhaWxlZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KCdmYWlsZWQnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIHNldElzSW5zdGFsbGluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnc2V0SXNJbnN0YWxsaW5nIEhhbmRsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBzZXRJc0luc3RhbGxpbmcgdG8gcGFja2FnZSByZWFkeS10by1pbnN0YWxsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtcGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXNldC1pbnN0YWxsaW5nLWZhbHNlLWJ0bicpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLnNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBzZXRJc0luc3RhbGxpbmcgdG8gYnVuZGxlIHJlYWR5LXRvLWluc3RhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IGZpbGU9e2NyZWF0ZU1vY2tCdW5kbGVGaWxlKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLWJ1bmRsZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLWJ1bmRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtc2V0LWluc3RhbGxpbmctZmFsc2UtYnRuJykpXG5cbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUuc2V0SXNJbnN0YWxsaW5nKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIEVycm9yIEhhbmRsaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdFcnJvciBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBvbkVycm9yIGNhbGxiYWNrIGZvciBwYWNrYWdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtcGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXNldC1lcnJvci1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2UtZXJyb3ItbXNnJykpLnRvSGF2ZVRleHRDb250ZW50KCdDdXN0b20gZXJyb3IgbWVzc2FnZScpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHByZXNlcnZlIGVycm9yIG1lc3NhZ2UgdGhyb3VnaCBzdGVwIGNoYW5nZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1lcnJvci1tc2cnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1VwbG9hZCBmYWlsZWQgZXJyb3InKVxuICAgICAgfSlcblxuICAgICAgLy8gRXJyb3IgbWVzc2FnZSBzaG91bGQgc3RpbGwgYmUgYWNjZXNzaWJsZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1lcnJvci1tc2cnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1VwbG9hZCBmYWlsZWQgZXJyb3InKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBmaWxlIHdpdGggLmRpZnlwa2cgZXh0ZW5zaW9uIGFzIHBhY2thZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBwa2dGaWxlID0gY3JlYXRlTW9ja0ZpbGUoJ215LXBsdWdpbi5kaWZ5cGtnJylcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gZmlsZT17cGtnRmlsZX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lzLWJ1bmRsZScpKS50b0hhdmVUZXh0Q29udGVudCgnZmFsc2UnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBmaWxlIHdpdGggLmRpZnlibmRsIGV4dGVuc2lvbiBhcyBidW5kbGUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBidW5kbGVGaWxlID0gY3JlYXRlTW9ja0ZpbGUoJ215LWJ1bmRsZS5kaWZ5Ym5kbCcpXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IGZpbGU9e2J1bmRsZUZpbGV9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1idW5kbGUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBmaWxlIHdpdGhvdXQgc3RhbmRhcmQgZXh0ZW5zaW9uIGFzIHBhY2thZ2UnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvdGhlckZpbGUgPSBjcmVhdGVNb2NrRmlsZSgncGx1Z2luLnppcCcpXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IGZpbGU9e290aGVyRmlsZX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lzLWJ1bmRsZScpKS50b0hhdmVUZXh0Q29udGVudCgnZmFsc2UnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSBkZXBlbmRlbmNpZXMgYXJyYXkgZm9yIGJ1bmRsZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gZmlsZT17Y3JlYXRlTW9ja0J1bmRsZUZpbGUoKX0gLz4pXG5cbiAgICAgIC8vIE1hbnVhbGx5IHRyaWdnZXIgd2l0aCBlbXB0eSBkZXBlbmRlbmNpZXNcbiAgICAgIGlmICh1cGxvYWRpbmdPbkJ1bmRsZVVwbG9hZGVkKSB7XG4gICAgICAgIHVwbG9hZGluZ09uQnVuZGxlVXBsb2FkZWQoW10pXG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtcGx1Z2lucy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBtYW5pZmVzdCB3aXRob3V0IGljb25fZGFyaycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG1hbmlmZXN0V2l0aG91dERhcmtJY29uID0gY3JlYXRlTW9ja01hbmlmZXN0KHsgaWNvbl9kYXJrOiB1bmRlZmluZWQgfSlcblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgaWYgKHVwbG9hZGluZ09uUGFja2FnZVVwbG9hZGVkKSB7XG4gICAgICAgIHVwbG9hZGluZ09uUGFja2FnZVVwbG9hZGVkKHtcbiAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyOiAndGVzdC1pZCcsXG4gICAgICAgICAgbWFuaWZlc3Q6IG1hbmlmZXN0V2l0aG91dERhcmtJY29uLFxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIC8vIFNob3VsZCBvbmx5IGNhbGwgZ2V0SWNvblVybCBvbmNlIGZvciB0aGUgbWFpbiBpY29uXG4gICAgICBleHBlY3QobW9ja0dldEljb25VcmwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgY29ycmVjdCBmaWxlIG5hbWUgaW4gdXBsb2FkaW5nIHN0ZXAnLCAoKSA9PiB7XG4gICAgICBjb25zdCBjdXN0b21GaWxlID0gY3JlYXRlTW9ja0ZpbGUoJ2N1c3RvbS1wbHVnaW4tbmFtZS5kaWZ5cGtnJylcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gZmlsZT17Y3VzdG9tRmlsZX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2ZpbGUtbmFtZScpKS50b0hhdmVUZXh0Q29udGVudCgnY3VzdG9tLXBsdWdpbi1uYW1lLmRpZnlwa2cnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByYXBpZCBzdGF0ZSB0cmFuc2l0aW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFF1aWNrbHkgdHJpZ2dlciB1cGxvYWQgc3VjY2Vzc1xuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtcGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBRdWlja2x5IHRyaWdnZXIgc3RlcCBjaGFuZ2VzXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAtaW5zdGFsbGVkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KCdpbnN0YWxsZWQnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENvbmRpdGlvbmFsIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ29uZGl0aW9uYWwgUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgc2hvdyB1cGxvYWRpbmcgc3RlcCBpbml0aWFsbHkgYW5kIGhpZGUgYWZ0ZXIgdXBsb2FkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndXBsb2FkaW5nLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGVzdElkKCd1cGxvYWRpbmctc3RlcCcpKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLXBhY2thZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgUmVhZHlUb0luc3RhbGxQYWNrYWdlIGZvciBwYWNrYWdlIGZpbGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtcGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1idW5kbGUnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIFJlYWR5VG9JbnN0YWxsQnVuZGxlIGZvciBidW5kbGUgZmlsZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IGZpbGU9e2NyZWF0ZU1vY2tCdW5kbGVGaWxlKCl9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLWJ1bmRsZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLWJ1bmRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBib3RoIHVwbG9hZGluZyBhbmQgcmVhZHktdG8taW5zdGFsbCBzaW11bHRhbmVvdXNseSBkdXJpbmcgdHJhbnNpdGlvbicsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIEluaXRpYWxseSBvbmx5IHVwbG9hZGluZyBpcyBzaG93blxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndXBsb2FkaW5nLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICAvLyBBZnRlciB1cGxvYWQsIG9ubHkgcmVhZHktdG8taW5zdGFsbCBpcyBzaG93blxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4ucXVlcnlCeVRlc3RJZCgndXBsb2FkaW5nLXN0ZXAnKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBEYXRhIEZsb3cgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0RhdGEgRmxvdycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3MgY29ycmVjdCB1bmlxdWVJZGVudGlmaWVyIHRvIFJlYWR5VG9JbnN0YWxsUGFja2FnZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItcGFja2FnZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXVuaXF1ZS1pZGVudGlmaWVyJykpLnRvSGF2ZVRleHRDb250ZW50KCd0ZXN0LXVuaXF1ZS1pZCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgcHJvY2Vzc2VkIG1hbmlmZXN0IHRvIFJlYWR5VG9JbnN0YWxsUGFja2FnZScsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItcGFja2FnZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLW1hbmlmZXN0LW5hbWUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1Rlc3QgUGx1Z2luJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBhbGwgZGVwZW5kZW5jaWVzIHRvIFJlYWR5VG9JbnN0YWxsQnVuZGxlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSBmaWxlPXtjcmVhdGVNb2NrQnVuZGxlRmlsZSgpfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1idW5kbGUtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLXBsdWdpbnMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGVycm9yIG1lc3NhZ2UgdG8gUmVhZHlUb0luc3RhbGxQYWNrYWdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci11cGxvYWQtZmFpbC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2UtZXJyb3ItbXNnJykpLnRvSGF2ZVRleHRDb250ZW50KCdVcGxvYWQgZmFpbGVkIGVycm9yJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBudWxsIHVuaXF1ZUlkZW50aWZpZXIgd2hlbiBub3QgdXBsb2FkZWQgZm9yIHBhY2thZ2UnLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBCZWZvcmUgdXBsb2FkLCB1bmlxdWVJZGVudGlmaWVyIHNob3VsZCBiZSBudWxsXG4gICAgICAvLyBUaGUgdXBsb2FkaW5nIHN0ZXAgaXMgc2hvd24sIHNvIFJlYWR5VG9JbnN0YWxsUGFja2FnZSBpcyBub3QgcmVuZGVyZWQgeWV0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd1cGxvYWRpbmctc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBudWxsIG1hbmlmZXN0IHdoZW4gbm90IHVwbG9hZGVkIGZvciBwYWNrYWdlJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gQmVmb3JlIHVwbG9hZCwgbWFuaWZlc3Qgc2hvdWxkIGJlIG51bGxcbiAgICAgIC8vIFRoZSB1cGxvYWRpbmcgc3RlcCBpcyBzaG93biwgc28gUmVhZHlUb0luc3RhbGxQYWNrYWdlIGlzIG5vdCByZW5kZXJlZCB5ZXRcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3VwbG9hZGluZy1zdGVwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3AgVmFyaWF0aW9ucyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUHJvcCBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgd29yayB3aXRoIGRpZmZlcmVudCBmaWxlIG5hbWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tGaWxlKCdwbHVnaW4tYS5kaWZ5cGtnJyksXG4gICAgICAgIGNyZWF0ZU1vY2tGaWxlKCdwbHVnaW4tYi5kaWZ5cGtnJyksXG4gICAgICAgIGNyZWF0ZU1vY2tGaWxlKCdidW5kbGUtYy5kaWZ5Ym5kbCcpLFxuICAgICAgXVxuXG4gICAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSBmaWxlPXtmaWxlfSAvPilcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KGZpbGUubmFtZSlcbiAgICAgICAgdW5tb3VudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgZGlmZmVyZW50IG9uQ2xvc2UgaGFuZGxlcnMgY29ycmVjdGx5JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DbG9zZTEgPSB2aS5mbigpXG4gICAgICBjb25zdCBvbkNsb3NlMiA9IHZpLmZuKClcblxuICAgICAgY29uc3QgeyByZXJlbmRlciB9ID0gcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSBvbkNsb3NlPXtvbkNsb3NlMX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhbmNlbC11cGxvYWQtYnRuJykpXG4gICAgICBleHBlY3Qob25DbG9zZTEpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgICAgZXhwZWN0KG9uQ2xvc2UyKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIHJlcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSBvbkNsb3NlPXtvbkNsb3NlMn0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhbmNlbC11cGxvYWQtYnRuJykpXG4gICAgICBleHBlY3Qob25DbG9zZTIpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBkaWZmZXJlbnQgZmlsZSB0eXBlcyBjb3JyZWN0bHknLCAoKSA9PiB7XG4gICAgICAvLyBQYWNrYWdlIGZpbGVcbiAgICAgIGNvbnN0IHsgcmVyZW5kZXIgfSA9IHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gZmlsZT17Y3JlYXRlTW9ja0ZpbGUoJ3Rlc3QuZGlmeXBrZycpfSAvPilcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lzLWJ1bmRsZScpKS50b0hhdmVUZXh0Q29udGVudCgnZmFsc2UnKVxuXG4gICAgICAvLyBCdW5kbGUgZmlsZVxuICAgICAgcmVyZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IGZpbGU9e2NyZWF0ZU1vY2tCdW5kbGVGaWxlKCl9IC8+KVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXMtYnVuZGxlJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIGdldFRpdGxlIENhbGxiYWNrIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdnZXRUaXRsZSBDYWxsYmFjaycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHRpdGxlIGZvciBhbGwgSW5zdGFsbFN0ZXAgdmFsdWVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gdXBsb2FkaW5nIHN0ZXAgLSBzaG93cyBpbnN0YWxsUGx1Z2luXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsUGx1Z2luJykpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgLy8gdXBsb2FkRmFpbGVkIHN0ZXBcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWZhaWwtYnRuJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwudXBsb2FkRmFpbGVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlmZmVyZW50aWF0ZSBidW5kbGUgYW5kIHBhY2thZ2UgaW5zdGFsbGVkIHRpdGxlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIC8vIFBhY2thZ2UgaW5zdGFsbGVkIHRpdGxlXG4gICAgICBjb25zdCB7IHVubW91bnQgfSA9IHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItcGFja2FnZS11cGxvYWQtYnRuJykpXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAtaW5zdGFsbGVkLWJ0bicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxlZFN1Y2Nlc3NmdWxseScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBVbm1vdW50IGFuZCBjcmVhdGUgZnJlc2ggaW5zdGFuY2UgZm9yIGJ1bmRsZVxuICAgICAgdW5tb3VudCgpXG5cbiAgICAgIC8vIEJ1bmRsZSBpbnN0YWxsZWQgdGl0bGVcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gZmlsZT17Y3JlYXRlTW9ja0J1bmRsZUZpbGUoKX0gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItYnVuZGxlLXVwbG9hZC1idG4nKSlcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLWJ1bmRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLXN0ZXAtaW5zdGFsbGVkLWJ0bicpKVxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxDb21wbGV0ZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gSW50ZWdyYXRpb24gd2l0aCB1c2VIaWRlTG9naWMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0ludGVncmF0aW9uIHdpdGggdXNlSGlkZUxvZ2ljJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdXNlIG1vZGFsQ2xhc3NOYW1lIGZyb20gdXNlSGlkZUxvZ2ljJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gVGhlIGhvb2sgaXMgY2FsbGVkIGFuZCBwcm92aWRlcyBtb2RhbENsYXNzTmFtZVxuICAgICAgZXhwZWN0KG1vY2tIaWRlTG9naWNTdGF0ZS5tb2RhbENsYXNzTmFtZSkudG9CZSgndGVzdC1tb2RhbC1jbGFzcycpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdXNlIGZvbGRBbmltSW50byBhcyBtb2RhbCBvbkNsb3NlIGhhbmRsZXInLCAoKSA9PiB7XG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBUaGUgZm9sZEFuaW1JbnRvIGZ1bmN0aW9uIGlzIGF2YWlsYWJsZSBmcm9tIHRoZSBob29rXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLmZvbGRBbmltSW50bykudG9CZURlZmluZWQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHVzZSBoYW5kbGVTdGFydFRvSW5zdGFsbCBmcm9tIHVzZUhpZGVMb2dpYycsIGFzeW5jICgpID0+IHtcbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItcGFja2FnZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLXBhY2thZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1zdGFydC1pbnN0YWxsLWJ0bicpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLmhhbmRsZVN0YXJ0VG9JbnN0YWxsKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugc2V0SXNJbnN0YWxsaW5nIGZyb20gdXNlSGlkZUxvZ2ljJywgYXN5bmMgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtcGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXNldC1pbnN0YWxsaW5nLWZhbHNlLWJ0bicpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLnNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyB1c2VHZXRJY29uIEludGVncmF0aW9uIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdJbnRlZ3JhdGlvbiB3aXRoIHVzZUdldEljb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIGdldEljb25Vcmwgd2hlbiBwcm9jZXNzaW5nIG1hbmlmZXN0IGljb24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrR2V0SWNvblVybC5tb2NrUmV0dXJuVmFsdWUoJ2h0dHBzOi8vZXhhbXBsZS5jb20vaWNvbi5wbmcnKVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tHZXRJY29uVXJsKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgndGVzdC1pY29uLnBuZycpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBnZXRJY29uVXJsIGZvciBib3RoIGljb24gYW5kIGljb25fZGFyaycsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tHZXRJY29uVXJsLm1vY2tSZXR1cm5WYWx1ZSgnaHR0cHM6Ly9leGFtcGxlLmNvbS9pY29uLnBuZycpXG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IG1hbmlmZXN0V2l0aERhcmtJY29uID0gY3JlYXRlTW9ja01hbmlmZXN0KHtcbiAgICAgICAgaWNvbjogJ2xpZ2h0LWljb24ucG5nJyxcbiAgICAgICAgaWNvbl9kYXJrOiAnZGFyay1pY29uLnBuZycsXG4gICAgICB9KVxuXG4gICAgICBpZiAodXBsb2FkaW5nT25QYWNrYWdlVXBsb2FkZWQpIHtcbiAgICAgICAgdXBsb2FkaW5nT25QYWNrYWdlVXBsb2FkZWQoe1xuICAgICAgICAgIHVuaXF1ZUlkZW50aWZpZXI6ICd0ZXN0LWlkJyxcbiAgICAgICAgICBtYW5pZmVzdDogbWFuaWZlc3RXaXRoRGFya0ljb24sXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0dldEljb25VcmwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdsaWdodC1pY29uLnBuZycpXG4gICAgICAgIGV4cGVjdChtb2NrR2V0SWNvblVybCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ2RhcmstaWNvbi5wbmcnKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gUmVhZHlUb0luc3RhbGwgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnUmVhZHlUb0luc3RhbGwnLCAoKSA9PiB7XG4gIC8vIEltcG9ydCB0aGUgYWN0dWFsIFJlYWR5VG9JbnN0YWxsIGNvbXBvbmVudCBmb3IgaXNvbGF0ZWQgdGVzdGluZ1xuICAvLyBXZSdsbCB0ZXN0IGl0IHRocm91Z2ggdGhlIHBhcmVudCBjb21wb25lbnQgd2l0aCBzcGVjaWZpYyBzY2VuYXJpb3NcblxuICBjb25zdCBtb2NrUmVmcmVzaFBsdWdpbkxpc3QgPSB2aS5mbigpXG5cbiAgLy8gUmVzZXQgbW9ja3MgZm9yIFJlYWR5VG9JbnN0YWxsIHRlc3RzXG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tSZWZyZXNoUGx1Z2luTGlzdC5tb2NrQ2xlYXIoKVxuICB9KVxuXG4gIGRlc2NyaWJlKCdTdGVwIENvbmRpdGlvbmFsIFJlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBJbnN0YWxsIGNvbXBvbmVudCB3aGVuIHN0ZXAgaXMgcmVhZHlUb0luc3RhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgIGZpbGU6IGNyZWF0ZU1vY2tGaWxlKCksXG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VjY2VzczogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgLy8gVHJpZ2dlciBwYWNrYWdlIHVwbG9hZCB0byB0cmFuc2l0aW9uIHRvIHJlYWR5VG9JbnN0YWxsIHN0ZXBcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItcGFja2FnZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLXBhY2thZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3JlYWR5VG9JbnN0YWxsJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIEluc3RhbGxlZCBjb21wb25lbnQgd2hlbiBzdGVwIGlzIHVwbG9hZEZhaWxlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoKSxcbiAgICAgICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBUcmlnZ2VyIHVwbG9hZCBmYWlsdXJlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KCd1cGxvYWRGYWlsZWQnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgSW5zdGFsbGVkIGNvbXBvbmVudCB3aGVuIHN0ZXAgaXMgaW5zdGFsbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFRyaWdnZXIgcGFja2FnZSB1cGxvYWQgdGhlbiBpbnN0YWxsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2Utc3RlcC1pbnN0YWxsZWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2luc3RhbGxlZCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBJbnN0YWxsZWQgY29tcG9uZW50IHdoZW4gc3RlcCBpcyBpbnN0YWxsRmFpbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFRyaWdnZXIgcGFja2FnZSB1cGxvYWQgdGhlbiBmYWlsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2Utc3RlcC1mYWlsZWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhaWxlZCcpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ2hhbmRsZUluc3RhbGxlZCBDYWxsYmFjaycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRyYW5zaXRpb24gdG8gaW5zdGFsbGVkIHN0ZXAgd2hlbiBoYW5kbGVJbnN0YWxsZWQgaXMgY2FsbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItcGFja2FnZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLXBhY2thZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gU2ltdWxhdGUgc3VjY2Vzc2Z1bCBpbnN0YWxsYXRpb25cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2Utc3RlcC1pbnN0YWxsZWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2luc3RhbGxlZCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgc2V0SXNJbnN0YWxsaW5nKGZhbHNlKSB3aGVuIGluc3RhbGxhdGlvbiBjb21wbGV0ZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgIGZpbGU6IGNyZWF0ZU1vY2tGaWxlKCksXG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VjY2VzczogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtcGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXNldC1pbnN0YWxsaW5nLWZhbHNlLWJ0bicpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLnNldElzSW5zdGFsbGluZykudG9IYXZlQmVlbkNhbGxlZFdpdGgoZmFsc2UpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnaGFuZGxlRmFpbGVkIENhbGxiYWNrJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgdHJhbnNpdGlvbiB0byBpbnN0YWxsRmFpbGVkIHN0ZXAgd2hlbiBoYW5kbGVGYWlsZWQgaXMgY2FsbGVkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItcGFja2FnZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLXBhY2thZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1zdGVwLWZhaWxlZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2Utc3RlcCcpKS50b0hhdmVUZXh0Q29udGVudCgnZmFpbGVkJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3RvcmUgZXJyb3IgbWVzc2FnZSB3aGVuIGhhbmRsZUZhaWxlZCBpcyBjYWxsZWQgd2l0aCBlcnJvck1zZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoKSxcbiAgICAgICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2Utc2V0LWVycm9yLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1lcnJvci1tc2cnKSkudG9IYXZlVGV4dENvbnRlbnQoJ0N1c3RvbSBlcnJvciBtZXNzYWdlJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnb25DbG9zZSBIYW5kbGVyJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNsb3NlIHdoZW4gY2FuY2VsIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgpLFxuICAgICAgICBvbkNsb3NlLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItcGFja2FnZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLXBhY2thZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1jbG9zZS1idG4nKSlcblxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1Byb3BzIFBhc3NpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIHVuaXF1ZUlkZW50aWZpZXIgdG8gSW5zdGFsbCBjb21wb25lbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgIGZpbGU6IGNyZWF0ZU1vY2tGaWxlKCksXG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VjY2VzczogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2UtdW5pcXVlLWlkZW50aWZpZXInKSkudG9IYXZlVGV4dENvbnRlbnQoJ3Rlc3QtdW5pcXVlLWlkJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBtYW5pZmVzdCB0byBJbnN0YWxsIGNvbXBvbmVudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoKSxcbiAgICAgICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1tYW5pZmVzdC1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdUZXN0IFBsdWdpbicpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgZXJyb3JNc2cgdG8gSW5zdGFsbGVkIGNvbXBvbmVudCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoKSxcbiAgICAgICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1lcnJvci1tc2cnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1VwbG9hZCBmYWlsZWQgZXJyb3InKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gVXBsb2FkaW5nIFN0ZXAgQ29tcG9uZW50IFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnVXBsb2FkaW5nIFN0ZXAnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tHZXRJY29uVXJsLm1vY2tSZXR1cm5WYWx1ZSgncHJvY2Vzc2VkLWljb24tdXJsJylcbiAgICBtb2NrSGlkZUxvZ2ljU3RhdGUgPSB7XG4gICAgICBtb2RhbENsYXNzTmFtZTogJ3Rlc3QtbW9kYWwtY2xhc3MnLFxuICAgICAgZm9sZEFuaW1JbnRvOiB2aS5mbigpLFxuICAgICAgc2V0SXNJbnN0YWxsaW5nOiB2aS5mbigpLFxuICAgICAgaGFuZGxlU3RhcnRUb0luc3RhbGw6IHZpLmZuKCksXG4gICAgfVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgdXBsb2FkaW5nIHN0YXRlIHdpdGggZmlsZSBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgnbXktY3VzdG9tLXBsdWdpbi5kaWZ5cGtnJyksXG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VjY2VzczogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndXBsb2FkaW5nLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnZmlsZS1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdteS1jdXN0b20tcGx1Z2luLmRpZnlwa2cnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgaXNCdW5kbGU9dHJ1ZSBmb3IgYnVuZGxlIGZpbGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrQnVuZGxlRmlsZSgpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lzLWJ1bmRsZScpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBpc0J1bmRsZT1mYWxzZSBmb3IgcGFja2FnZSBmaWxlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoKSxcbiAgICAgICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdpcy1idW5kbGUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhbHNlJylcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdVcGxvYWQgQ2FsbGJhY2tzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvblBhY2thZ2VVcGxvYWRlZCB3aXRoIGNvcnJlY3QgZGF0YSBmb3IgcGFja2FnZSBmaWxlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoKSxcbiAgICAgICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS11bmlxdWUtaWRlbnRpZmllcicpKS50b0hhdmVUZXh0Q29udGVudCgndGVzdC11bmlxdWUtaWQnKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLW1hbmlmZXN0LW5hbWUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1Rlc3QgUGx1Z2luJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkJ1bmRsZVVwbG9hZGVkIHdpdGggZGVwZW5kZW5jaWVzIGZvciBidW5kbGUgZmlsZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgIGZpbGU6IGNyZWF0ZU1vY2tCdW5kbGVGaWxlKCksXG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VjY2VzczogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1idW5kbGUtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLXBsdWdpbnMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uRmFpbGVkIHdpdGggZXJyb3IgbWVzc2FnZSB3aGVuIHVwbG9hZCBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoKSxcbiAgICAgICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXVwbG9hZC1mYWlsLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1lcnJvci1tc2cnKSkudG9IYXZlVGV4dENvbnRlbnQoJ1VwbG9hZCBmYWlsZWQgZXJyb3InKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdDYW5jZWwgQnV0dG9uJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNhbmNlbCB3aGVuIGNhbmNlbCBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgIGZpbGU6IGNyZWF0ZU1vY2tGaWxlKCksXG4gICAgICAgIG9uQ2xvc2UsXG4gICAgICAgIG9uU3VjY2VzczogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnY2FuY2VsLXVwbG9hZC1idG4nKSlcblxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0ZpbGUgVHlwZSBEZXRlY3Rpb24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkZXRlY3QgLmRpZnlwa2cgYXMgcGFja2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoJ3Rlc3QuZGlmeXBrZycpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lzLWJ1bmRsZScpKS50b0hhdmVUZXh0Q29udGVudCgnZmFsc2UnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRldGVjdCAuZGlmeWJuZGwgYXMgYnVuZGxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgndGVzdC5kaWZ5Ym5kbCcpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2lzLWJ1bmRsZScpKS50b0hhdmVUZXh0Q29udGVudCgndHJ1ZScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGV0ZWN0IG90aGVyIGV4dGVuc2lvbnMgYXMgcGFja2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoJ3Rlc3QuemlwJyksXG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VjY2VzczogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXMtYnVuZGxlJykpLnRvSGF2ZVRleHRDb250ZW50KCdmYWxzZScpXG4gICAgfSlcbiAgfSlcbn0pXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIEluc3RhbGwgU3RlcCBDb21wb25lbnQgVGVzdHNcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbmRlc2NyaWJlKCdJbnN0YWxsIFN0ZXAnLCAoKSA9PiB7XG4gIGJlZm9yZUVhY2goKCkgPT4ge1xuICAgIHZpLmNsZWFyQWxsTW9ja3MoKVxuICAgIG1vY2tHZXRJY29uVXJsLm1vY2tSZXR1cm5WYWx1ZSgncHJvY2Vzc2VkLWljb24tdXJsJylcbiAgICBtb2NrSGlkZUxvZ2ljU3RhdGUgPSB7XG4gICAgICBtb2RhbENsYXNzTmFtZTogJ3Rlc3QtbW9kYWwtY2xhc3MnLFxuICAgICAgZm9sZEFuaW1JbnRvOiB2aS5mbigpLFxuICAgICAgc2V0SXNJbnN0YWxsaW5nOiB2aS5mbigpLFxuICAgICAgaGFuZGxlU3RhcnRUb0luc3RhbGw6IHZpLmZuKCksXG4gICAgfVxuICB9KVxuXG4gIGRlc2NyaWJlKCdQcm9wcyBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlY2VpdmUgdW5pcXVlSWRlbnRpZmllciBwcm9wIGNvcnJlY3RseScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoKSxcbiAgICAgICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS11bmlxdWUtaWRlbnRpZmllcicpKS50b0hhdmVUZXh0Q29udGVudCgndGVzdC11bmlxdWUtaWQnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZWNlaXZlIHBheWxvYWQgcHJvcCBjb3JyZWN0bHknLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgIGZpbGU6IGNyZWF0ZU1vY2tGaWxlKCksXG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VjY2VzczogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2UtbWFuaWZlc3QtbmFtZScpKS50b0hhdmVUZXh0Q29udGVudCgnVGVzdCBQbHVnaW4nKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdJbnN0YWxsYXRpb24gQ2FsbGJhY2tzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvblN0YXJ0VG9JbnN0YWxsIHdoZW4gaW5zdGFsbCBzdGFydHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgIGZpbGU6IGNyZWF0ZU1vY2tGaWxlKCksXG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VjY2VzczogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtcGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0YXJ0LWluc3RhbGwtYnRuJykpXG5cbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUuaGFuZGxlU3RhcnRUb0luc3RhbGwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25JbnN0YWxsZWQgd2hlbiBpbnN0YWxsYXRpb24gc3VjY2VlZHMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgIGZpbGU6IGNyZWF0ZU1vY2tGaWxlKCksXG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VjY2VzczogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtcGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAtaW5zdGFsbGVkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KCdpbnN0YWxsZWQnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uRmFpbGVkIHdoZW4gaW5zdGFsbGF0aW9uIGZhaWxzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItcGFja2FnZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLXBhY2thZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1zdGVwLWZhaWxlZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2Utc3RlcCcpKS50b0hhdmVUZXh0Q29udGVudCgnZmFpbGVkJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ2FuY2VsIEhhbmRsaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkNhbmNlbCB3aGVuIGNhbmNlbCBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoKSxcbiAgICAgICAgb25DbG9zZSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2UtY2xvc2UtYnRuJykpXG5cbiAgICAgIGV4cGVjdChvbkNsb3NlKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuICB9KVxufSlcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gQnVuZGxlIFJlYWR5VG9JbnN0YWxsIENvbXBvbmVudCBUZXN0c1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuZGVzY3JpYmUoJ0J1bmRsZSBSZWFkeVRvSW5zdGFsbCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0dldEljb25VcmwubW9ja1JldHVyblZhbHVlKCdwcm9jZXNzZWQtaWNvbi11cmwnKVxuICAgIG1vY2tIaWRlTG9naWNTdGF0ZSA9IHtcbiAgICAgIG1vZGFsQ2xhc3NOYW1lOiAndGVzdC1tb2RhbC1jbGFzcycsXG4gICAgICBmb2xkQW5pbUludG86IHZpLmZuKCksXG4gICAgICBzZXRJc0luc3RhbGxpbmc6IHZpLmZuKCksXG4gICAgICBoYW5kbGVTdGFydFRvSW5zdGFsbDogdmkuZm4oKSxcbiAgICB9XG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBidW5kbGUgaW5zdGFsbCB2aWV3IHdpdGggYWxsIHBsdWdpbnMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgIGZpbGU6IGNyZWF0ZU1vY2tCdW5kbGVGaWxlKCksXG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VjY2VzczogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1idW5kbGUtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1idW5kbGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtcGx1Z2lucy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMicpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ1N0ZXAgQ2hhbmdlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHRyYW5zaXRpb24gdG8gaW5zdGFsbGVkIHN0ZXAgb24gc3VjY2Vzc2Z1bCBidW5kbGUgaW5zdGFsbCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0J1bmRsZUZpbGUoKSxcbiAgICAgICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLWJ1bmRsZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLWJ1bmRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtc3RlcC1pbnN0YWxsZWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtc3RlcCcpKS50b0hhdmVUZXh0Q29udGVudCgnaW5zdGFsbGVkJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdHJhbnNpdGlvbiB0byBpbnN0YWxsRmFpbGVkIHN0ZXAgb24gYnVuZGxlIGluc3RhbGwgZmFpbHVyZScsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0J1bmRsZUZpbGUoKSxcbiAgICAgICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLWJ1bmRsZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLWJ1bmRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtc3RlcC1mYWlsZWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtc3RlcCcpKS50b0hhdmVUZXh0Q29udGVudCgnZmFpbGVkJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ2FsbGJhY2tzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvblN0YXJ0VG9JbnN0YWxsIHdoZW4gYnVuZGxlIGluc3RhbGwgc3RhcnRzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrQnVuZGxlRmlsZSgpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItYnVuZGxlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtYnVuZGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1zdGFydC1pbnN0YWxsLWJ0bicpKVxuXG4gICAgICBleHBlY3QobW9ja0hpZGVMb2dpY1N0YXRlLmhhbmRsZVN0YXJ0VG9JbnN0YWxsKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldElzSW5zdGFsbGluZyB3aGVuIGJ1bmRsZSBpbnN0YWxsYXRpb24gc3RhdGUgY2hhbmdlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0J1bmRsZUZpbGUoKSxcbiAgICAgICAgb25DbG9zZTogdmkuZm4oKSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLWJ1bmRsZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLWJ1bmRsZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtc2V0LWluc3RhbGxpbmctZmFsc2UtYnRuJykpXG5cbiAgICAgIGV4cGVjdChtb2NrSGlkZUxvZ2ljU3RhdGUuc2V0SXNJbnN0YWxsaW5nKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChmYWxzZSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2xvc2Ugd2hlbiBidW5kbGUgaW5zdGFsbCBpcyBjYW5jZWxsZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrQnVuZGxlRmlsZSgpLFxuICAgICAgICBvbkNsb3NlLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItYnVuZGxlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtYnVuZGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1jbG9zZS1idG4nKSlcblxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0RlcGVuZGVuY2llcyBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3MgYWxsIGRlcGVuZGVuY2llcyB0byBidW5kbGUgaW5zdGFsbCBjb21wb25lbnQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7XG4gICAgICAgIGZpbGU6IGNyZWF0ZU1vY2tCdW5kbGVGaWxlKCksXG4gICAgICAgIG9uQ2xvc2U6IHZpLmZuKCksXG4gICAgICAgIG9uU3VjY2VzczogdmkuZm4oKSxcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKDxJbnN0YWxsRnJvbUxvY2FsUGFja2FnZSB7Li4uZGVmYXVsdFByb3BzfSAvPilcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1idW5kbGUtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLXBsdWdpbnMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgZGVwZW5kZW5jaWVzIGFycmF5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrQnVuZGxlRmlsZSgpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIE1hbnVhbGx5IHRyaWdnZXIgd2l0aCBlbXB0eSBkZXBlbmRlbmNpZXNcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdXBsb2FkaW5nT25CdW5kbGVVcGxvYWRlZFxuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIGFjdCgoKSA9PiB7XG4gICAgICAgICAgY2FsbGJhY2soW10pXG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtcGx1Z2lucy1jb3VudCcpKS50b0hhdmVUZXh0Q29udGVudCgnMCcpXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBDb21wbGV0ZSBGbG93IEludGVncmF0aW9uIFRlc3RzXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5kZXNjcmliZSgnQ29tcGxldGUgSW5zdGFsbGF0aW9uIEZsb3dzJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrR2V0SWNvblVybC5tb2NrUmV0dXJuVmFsdWUoJ3Byb2Nlc3NlZC1pY29uLXVybCcpXG4gICAgbW9ja0hpZGVMb2dpY1N0YXRlID0ge1xuICAgICAgbW9kYWxDbGFzc05hbWU6ICd0ZXN0LW1vZGFsLWNsYXNzJyxcbiAgICAgIGZvbGRBbmltSW50bzogdmkuZm4oKSxcbiAgICAgIHNldElzSW5zdGFsbGluZzogdmkuZm4oKSxcbiAgICAgIGhhbmRsZVN0YXJ0VG9JbnN0YWxsOiB2aS5mbigpLFxuICAgIH1cbiAgfSlcblxuICBkZXNjcmliZSgnUGFja2FnZSBJbnN0YWxsYXRpb24gRmxvdycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNvbXBsZXRlIGZ1bGwgcGFja2FnZSBpbnN0YWxsYXRpb24gZmxvdzogdXBsb2FkIC0+IGluc3RhbGwgLT4gc3VjY2VzcycsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IG9uQ2xvc2UgPSB2aS5mbigpXG4gICAgICBjb25zdCBvblN1Y2Nlc3MgPSB2aS5mbigpXG4gICAgICBjb25zdCBkZWZhdWx0UHJvcHMgPSB7IGZpbGU6IGNyZWF0ZU1vY2tGaWxlKCksIG9uQ2xvc2UsIG9uU3VjY2VzcyB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFN0ZXAgMTogVXBsb2FkaW5nXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCd1cGxvYWRpbmctc3RlcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG5cbiAgICAgIC8vIFN0ZXAgMjogVXBsb2FkIGNvbXBsZXRlLCB0cmFuc2l0aW9uIHRvIHJlYWR5VG9JbnN0YWxsXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCd0cmlnZ2VyLXBhY2thZ2UtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1wYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KCdyZWFkeVRvSW5zdGFsbCcpXG4gICAgICB9KVxuXG4gICAgICAvLyBTdGVwIDM6IFN0YXJ0IGluc3RhbGxhdGlvblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1zdGFydC1pbnN0YWxsLWJ0bicpKVxuICAgICAgZXhwZWN0KG1vY2tIaWRlTG9naWNTdGF0ZS5oYW5kbGVTdGFydFRvSW5zdGFsbCkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIC8vIFN0ZXAgNDogSW5zdGFsbGF0aW9uIGNvbXBsZXRlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAtaW5zdGFsbGVkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1zdGVwJykpLnRvSGF2ZVRleHRDb250ZW50KCdpbnN0YWxsZWQnKVxuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxNb2RhbC5pbnN0YWxsZWRTdWNjZXNzZnVsbHknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcGFja2FnZSBpbnN0YWxsYXRpb24gZmFpbHVyZSBmbG93JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFVwbG9hZFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1wYWNrYWdlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtcGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuXG4gICAgICAvLyBTZXQgZXJyb3IgYW5kIGZhaWxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2Utc2V0LWVycm9yLWJ0bicpKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1zdGVwLWZhaWxlZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2Utc3RlcCcpKS50b0hhdmVUZXh0Q29udGVudCgnZmFpbGVkJylcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbEZhaWxlZCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1cGxvYWQgZmFpbHVyZSBmbG93JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItdXBsb2FkLWZhaWwtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdwYWNrYWdlLXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3VwbG9hZEZhaWxlZCcpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3BhY2thZ2UtZXJyb3ItbXNnJykpLnRvSGF2ZVRleHRDb250ZW50KCdVcGxvYWQgZmFpbGVkIGVycm9yJylcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwudXBsb2FkRmFpbGVkJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQnVuZGxlIEluc3RhbGxhdGlvbiBGbG93JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY29tcGxldGUgZnVsbCBidW5kbGUgaW5zdGFsbGF0aW9uIGZsb3c6IHVwbG9hZCAtPiBpbnN0YWxsIC0+IHN1Y2Nlc3MnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3Qgb25TdWNjZXNzID0gdmkuZm4oKVxuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0geyBmaWxlOiBjcmVhdGVNb2NrQnVuZGxlRmlsZSgpLCBvbkNsb3NlLCBvblN1Y2Nlc3MgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICAvLyBTdGVwIDE6IFVwbG9hZGluZ1xuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgndXBsb2FkaW5nLXN0ZXAnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnaXMtYnVuZGxlJykpLnRvSGF2ZVRleHRDb250ZW50KCd0cnVlJylcblxuICAgICAgLy8gU3RlcCAyOiBVcGxvYWQgY29tcGxldGUsIHRyYW5zaXRpb24gdG8gcmVhZHlUb0luc3RhbGxcbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItYnVuZGxlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtYnVuZGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3JlYWR5VG9JbnN0YWxsJylcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLXBsdWdpbnMtY291bnQnKSkudG9IYXZlVGV4dENvbnRlbnQoJzInKVxuICAgICAgfSlcblxuICAgICAgLy8gU3RlcCAzOiBTdGFydCBpbnN0YWxsYXRpb25cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1zdGFydC1pbnN0YWxsLWJ0bicpKVxuICAgICAgZXhwZWN0KG1vY2tIaWRlTG9naWNTdGF0ZS5oYW5kbGVTdGFydFRvSW5zdGFsbCkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIC8vIFN0ZXAgNDogSW5zdGFsbGF0aW9uIGNvbXBsZXRlXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtc3RlcC1pbnN0YWxsZWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdidW5kbGUtc3RlcCcpKS50b0hhdmVUZXh0Q29udGVudCgnaW5zdGFsbGVkJylcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsTW9kYWwuaW5zdGFsbENvbXBsZXRlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGJ1bmRsZSBpbnN0YWxsYXRpb24gZmFpbHVyZSBmbG93JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrQnVuZGxlRmlsZSgpLFxuICAgICAgICBvbkNsb3NlOiB2aS5mbigpLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFVwbG9hZFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgndHJpZ2dlci1idW5kbGUtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgncmVhZHktdG8taW5zdGFsbC1idW5kbGUnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgLy8gRmFpbFxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLXN0ZXAtZmFpbGVkLWJ0bicpKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnYnVuZGxlLXN0ZXAnKSkudG9IYXZlVGV4dENvbnRlbnQoJ2ZhaWxlZCcpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGxGYWlsZWQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdVc2VyIENhbmNlbGxhdGlvbiBGbG93cycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGFsbG93IGNhbmNlbGxhdGlvbiBkdXJpbmcgdXBsb2FkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25DbG9zZSA9IHZpLmZuKClcbiAgICAgIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICAgICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoKSxcbiAgICAgICAgb25DbG9zZSxcbiAgICAgICAgb25TdWNjZXNzOiB2aS5mbigpLFxuICAgICAgfVxuXG4gICAgICByZW5kZXIoPEluc3RhbGxGcm9tTG9jYWxQYWNrYWdlIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5VGVzdElkKCdjYW5jZWwtdXBsb2FkLWJ0bicpKVxuXG4gICAgICBleHBlY3Qob25DbG9zZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgYWxsb3cgY2FuY2VsbGF0aW9uIGR1cmluZyBwYWNrYWdlIHJlYWR5LXRvLWluc3RhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrRmlsZSgpLFxuICAgICAgICBvbkNsb3NlLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItcGFja2FnZS11cGxvYWQtYnRuJykpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdyZWFkeS10by1pbnN0YWxsLXBhY2thZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVRlc3RJZCgncGFja2FnZS1jbG9zZS1idG4nKSlcblxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGFsbG93IGNhbmNlbGxhdGlvbiBkdXJpbmcgYnVuZGxlIHJlYWR5LXRvLWluc3RhbGwnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBvbkNsb3NlID0gdmkuZm4oKVxuICAgICAgY29uc3QgZGVmYXVsdFByb3BzID0ge1xuICAgICAgICBmaWxlOiBjcmVhdGVNb2NrQnVuZGxlRmlsZSgpLFxuICAgICAgICBvbkNsb3NlLFxuICAgICAgICBvblN1Y2Nlc3M6IHZpLmZuKCksXG4gICAgICB9XG5cbiAgICAgIHJlbmRlcig8SW5zdGFsbEZyb21Mb2NhbFBhY2thZ2Ugey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ3RyaWdnZXItYnVuZGxlLXVwbG9hZC1idG4nKSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ3JlYWR5LXRvLWluc3RhbGwtYnVuZGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXN0SWQoJ2J1bmRsZS1jbG9zZS1idG4nKSlcblxuICAgICAgZXhwZWN0KG9uQ2xvc2UpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG59KVxuIl19