"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("../../../types");
const selectPackage_1 = require("./selectPackage");
// Mock the useGitHubUpload hook
const mockHandleUpload = vitest_1.vi.fn();
vitest_1.vi.mock('../../hooks', () => ({
    useGitHubUpload: () => ({ handleUpload: mockHandleUpload }),
}));
// Factory functions
const createMockManifest = () => ({
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
});
const createVersions = () => [
    { value: 'v1.0.0', name: 'v1.0.0' },
    { value: 'v0.9.0', name: 'v0.9.0' },
];
const createPackages = () => [
    { value: 'plugin.zip', name: 'plugin.zip' },
    { value: 'plugin.tar.gz', name: 'plugin.tar.gz' },
];
const createUpdatePayload = () => ({
    originalPackageInfo: {
        id: 'original-id',
        repo: 'owner/repo',
        version: 'v0.9.0',
        package: 'plugin.zip',
        releases: [],
    },
});
(0, vitest_1.describe)('SelectPackage', () => {
    const createDefaultProps = () => ({
        updatePayload: undefined,
        repoUrl: 'https://github.com/owner/repo',
        selectedVersion: '',
        versions: createVersions(),
        onSelectVersion: vitest_1.vi.fn(),
        selectedPackage: '',
        packages: createPackages(),
        onSelectPackage: vitest_1.vi.fn(),
        onUploaded: vitest_1.vi.fn(),
        onFailed: vitest_1.vi.fn(),
        onBack: vitest_1.vi.fn(),
    });
    // Helper function to render with proper type handling
    const renderSelectPackage = (overrides = {}) => {
        const props = { ...createDefaultProps(), ...overrides };
        // Cast to any to bypass strict type checking since component accepts optional updatePayload
        return (0, react_1.render)(<selectPackage_1.default {...props}/>);
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockHandleUpload.mockReset();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render version label', () => {
            renderSelectPackage();
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.selectVersion')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render package label', () => {
            renderSelectPackage();
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.selectPackage')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render back button when not in edit mode', () => {
            renderSelectPackage({ updatePayload: undefined });
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not render back button when in edit mode', () => {
            renderSelectPackage({ updatePayload: createUpdatePayload() });
            (0, vitest_1.expect)(react_1.screen.queryByRole('button', { name: 'plugin.installModal.back' })).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should render next button', () => {
            renderSelectPackage();
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' })).toBeInTheDocument();
        });
    });
    // ================================
    // Props Tests
    // ================================
    (0, vitest_1.describe)('Props', () => {
        (0, vitest_1.it)('should pass selectedVersion to PortalSelect', () => {
            renderSelectPackage({ selectedVersion: 'v1.0.0' });
            // PortalSelect should display the selected version
            (0, vitest_1.expect)(react_1.screen.getByText('v1.0.0')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass selectedPackage to PortalSelect', () => {
            renderSelectPackage({ selectedPackage: 'plugin.zip' });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.zip')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show installed version badge when updatePayload version differs', () => {
            renderSelectPackage({
                updatePayload: createUpdatePayload(),
                selectedVersion: 'v1.0.0',
            });
            (0, vitest_1.expect)(react_1.screen.getByText(/v0\.9\.0\s*->\s*v1\.0\.0/)).toBeInTheDocument();
        });
    });
    // ================================
    // Button State Tests
    // ================================
    (0, vitest_1.describe)('Button State', () => {
        (0, vitest_1.it)('should disable next button when no version selected', () => {
            renderSelectPackage({ selectedVersion: '', selectedPackage: '' });
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' })).toBeDisabled();
        });
        (0, vitest_1.it)('should disable next button when version selected but no package', () => {
            renderSelectPackage({ selectedVersion: 'v1.0.0', selectedPackage: '' });
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' })).toBeDisabled();
        });
        (0, vitest_1.it)('should enable next button when both version and package selected', () => {
            renderSelectPackage({ selectedVersion: 'v1.0.0', selectedPackage: 'plugin.zip' });
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' })).not.toBeDisabled();
        });
    });
    // ================================
    // User Interactions Tests
    // ================================
    (0, vitest_1.describe)('User Interactions', () => {
        (0, vitest_1.it)('should call onBack when back button is clicked', () => {
            const onBack = vitest_1.vi.fn();
            renderSelectPackage({ onBack });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' }));
            (0, vitest_1.expect)(onBack).toHaveBeenCalledTimes(1);
        });
        (0, vitest_1.it)('should call handleUploadPackage when next button is clicked', async () => {
            mockHandleUpload.mockImplementation(async (_repo, _version, _package, onSuccess) => {
                onSuccess({ unique_identifier: 'uid', manifest: createMockManifest() });
            });
            const onUploaded = vitest_1.vi.fn();
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
                onUploaded,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHandleUpload).toHaveBeenCalledTimes(1);
                (0, vitest_1.expect)(mockHandleUpload).toHaveBeenCalledWith('owner/repo', 'v1.0.0', 'plugin.zip', vitest_1.expect.any(Function));
            });
        });
        (0, vitest_1.it)('should not invoke upload when next button is disabled', () => {
            renderSelectPackage({ selectedVersion: '', selectedPackage: '' });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            (0, vitest_1.expect)(mockHandleUpload).not.toHaveBeenCalled();
        });
    });
    // ================================
    // Upload Handling Tests
    // ================================
    (0, vitest_1.describe)('Upload Handling', () => {
        (0, vitest_1.it)('should call onUploaded with correct data on successful upload', async () => {
            const mockManifest = createMockManifest();
            mockHandleUpload.mockImplementation(async (_repo, _version, _package, onSuccess) => {
                onSuccess({ unique_identifier: 'test-uid', manifest: mockManifest });
            });
            const onUploaded = vitest_1.vi.fn();
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
                onUploaded,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onUploaded).toHaveBeenCalledWith({
                    uniqueIdentifier: 'test-uid',
                    manifest: mockManifest,
                });
            });
        });
        (0, vitest_1.it)('should call onFailed with response message on upload error', async () => {
            mockHandleUpload.mockRejectedValue({ response: { message: 'API Error' } });
            const onFailed = vitest_1.vi.fn();
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
                onFailed,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith('API Error');
            });
        });
        (0, vitest_1.it)('should call onFailed with default message when no response message', async () => {
            mockHandleUpload.mockRejectedValue(new Error('Network error'));
            const onFailed = vitest_1.vi.fn();
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
                onFailed,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith('plugin.installFromGitHub.uploadFailed');
            });
        });
        (0, vitest_1.it)('should not call upload twice when already uploading', async () => {
            let resolveUpload;
            mockHandleUpload.mockImplementation(() => new Promise((resolve) => {
                resolveUpload = resolve;
            }));
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
            });
            const nextButton = react_1.screen.getByRole('button', { name: 'plugin.installModal.next' });
            // Click twice rapidly - this tests the isUploading guard at line 49-50
            // The first click starts the upload, the second should be ignored
            react_1.fireEvent.click(nextButton);
            react_1.fireEvent.click(nextButton);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHandleUpload).toHaveBeenCalledTimes(1);
            });
            // Resolve the upload
            resolveUpload();
        });
        (0, vitest_1.it)('should disable back button while uploading', async () => {
            let resolveUpload;
            mockHandleUpload.mockImplementation(() => new Promise((resolve) => {
                resolveUpload = resolve;
            }));
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' })).toBeDisabled();
            });
            resolveUpload();
        });
        (0, vitest_1.it)('should strip github.com prefix from repoUrl', async () => {
            mockHandleUpload.mockResolvedValue({});
            renderSelectPackage({
                repoUrl: 'https://github.com/myorg/myrepo',
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHandleUpload).toHaveBeenCalledWith('myorg/myrepo', vitest_1.expect.any(String), vitest_1.expect.any(String), vitest_1.expect.any(Function));
            });
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty versions array', () => {
            renderSelectPackage({ versions: [] });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.selectVersion')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle empty packages array', () => {
            renderSelectPackage({ packages: [] });
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.selectPackage')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle updatePayload with installed version', () => {
            renderSelectPackage({ updatePayload: createUpdatePayload() });
            // Should not show back button in edit mode
            (0, vitest_1.expect)(react_1.screen.queryByRole('button', { name: 'plugin.installModal.back' })).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should re-enable buttons after upload completes', async () => {
            mockHandleUpload.mockResolvedValue({});
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' })).not.toBeDisabled();
            });
        });
        (0, vitest_1.it)('should re-enable buttons after upload fails', async () => {
            mockHandleUpload.mockRejectedValue(new Error('Upload failed'));
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' })).not.toBeDisabled();
            });
        });
    });
    // ================================
    // PortalSelect Readonly State Tests
    // ================================
    (0, vitest_1.describe)('PortalSelect Readonly State', () => {
        (0, vitest_1.it)('should make package select readonly when no version selected', () => {
            renderSelectPackage({ selectedVersion: '' });
            // When no version is selected, package select should be readonly
            // This is tested by verifying the component renders correctly
            const trigger = react_1.screen.getByText('plugin.installFromGitHub.selectPackagePlaceholder').closest('div');
            (0, vitest_1.expect)(trigger).toHaveClass('cursor-not-allowed');
        });
        (0, vitest_1.it)('should make package select active when version is selected', () => {
            renderSelectPackage({ selectedVersion: 'v1.0.0' });
            // When version is selected, package select should be active
            const trigger = react_1.screen.getByText('plugin.installFromGitHub.selectPackagePlaceholder').closest('div');
            (0, vitest_1.expect)(trigger).toHaveClass('cursor-pointer');
        });
    });
    // ================================
    // installedValue Props Tests
    // ================================
    (0, vitest_1.describe)('installedValue Props', () => {
        (0, vitest_1.it)('should pass installedValue when updatePayload is provided', () => {
            const updatePayload = createUpdatePayload();
            renderSelectPackage({ updatePayload });
            // The installed version should be passed to PortalSelect
            // updatePayload.originalPackageInfo.version = 'v0.9.0'
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.selectVersion')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should not pass installedValue when updatePayload is undefined', () => {
            renderSelectPackage({ updatePayload: undefined });
            // No installed version indicator
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.selectVersion')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should handle updatePayload with different version value', () => {
            const updatePayload = createUpdatePayload();
            updatePayload.originalPackageInfo.version = 'v2.0.0';
            renderSelectPackage({ updatePayload });
            // Should render without errors
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.selectVersion')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should show installed badge in version list', () => {
            const updatePayload = createUpdatePayload();
            renderSelectPackage({ updatePayload, selectedVersion: '' });
            react_1.fireEvent.click(react_1.screen.getByText('plugin.installFromGitHub.selectVersionPlaceholder'));
            (0, vitest_1.expect)(react_1.screen.getByText('INSTALLED')).toBeInTheDocument();
        });
    });
    // ================================
    // Next Button Disabled State Combinations
    // ================================
    (0, vitest_1.describe)('Next Button Disabled State Combinations', () => {
        (0, vitest_1.it)('should disable next button when only version is missing', () => {
            renderSelectPackage({ selectedVersion: '', selectedPackage: 'plugin.zip' });
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' })).toBeDisabled();
        });
        (0, vitest_1.it)('should disable next button when only package is missing', () => {
            renderSelectPackage({ selectedVersion: 'v1.0.0', selectedPackage: '' });
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' })).toBeDisabled();
        });
        (0, vitest_1.it)('should disable next button when both are missing', () => {
            renderSelectPackage({ selectedVersion: '', selectedPackage: '' });
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' })).toBeDisabled();
        });
        (0, vitest_1.it)('should disable next button when uploading even with valid selections', async () => {
            let resolveUpload;
            mockHandleUpload.mockImplementation(() => new Promise((resolve) => {
                resolveUpload = resolve;
            }));
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' })).toBeDisabled();
            });
            resolveUpload();
        });
    });
    // ================================
    // RepoUrl Format Handling Tests
    // ================================
    (0, vitest_1.describe)('RepoUrl Format Handling', () => {
        (0, vitest_1.it)('should handle repoUrl without trailing slash', async () => {
            mockHandleUpload.mockResolvedValue({});
            renderSelectPackage({
                repoUrl: 'https://github.com/owner/repo',
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHandleUpload).toHaveBeenCalledWith('owner/repo', 'v1.0.0', 'plugin.zip', vitest_1.expect.any(Function));
            });
        });
        (0, vitest_1.it)('should handle repoUrl with different org/repo combinations', async () => {
            mockHandleUpload.mockResolvedValue({});
            renderSelectPackage({
                repoUrl: 'https://github.com/my-organization/my-plugin-repo',
                selectedVersion: 'v2.0.0',
                selectedPackage: 'build.tar.gz',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHandleUpload).toHaveBeenCalledWith('my-organization/my-plugin-repo', 'v2.0.0', 'build.tar.gz', vitest_1.expect.any(Function));
            });
        });
        (0, vitest_1.it)('should pass through repoUrl without github prefix', async () => {
            mockHandleUpload.mockResolvedValue({});
            renderSelectPackage({
                repoUrl: 'plain-org/plain-repo',
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHandleUpload).toHaveBeenCalledWith('plain-org/plain-repo', 'v1.0.0', 'plugin.zip', vitest_1.expect.any(Function));
            });
        });
    });
    // ================================
    // isEdit Mode Comprehensive Tests
    // ================================
    (0, vitest_1.describe)('isEdit Mode Comprehensive', () => {
        (0, vitest_1.it)('should set isEdit to true when updatePayload is truthy', () => {
            const updatePayload = createUpdatePayload();
            renderSelectPackage({ updatePayload });
            // Back button should not be rendered in edit mode
            (0, vitest_1.expect)(react_1.screen.queryByRole('button', { name: 'plugin.installModal.back' })).not.toBeInTheDocument();
        });
        (0, vitest_1.it)('should set isEdit to false when updatePayload is undefined', () => {
            renderSelectPackage({ updatePayload: undefined });
            // Back button should be rendered when not in edit mode
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should allow upload in edit mode without back button', async () => {
            mockHandleUpload.mockImplementation(async (_repo, _version, _package, onSuccess) => {
                onSuccess({ unique_identifier: 'uid', manifest: createMockManifest() });
            });
            const onUploaded = vitest_1.vi.fn();
            renderSelectPackage({
                updatePayload: createUpdatePayload(),
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
                onUploaded,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onUploaded).toHaveBeenCalled();
            });
        });
    });
    // ================================
    // Error Response Handling Tests
    // ================================
    (0, vitest_1.describe)('Error Response Handling', () => {
        (0, vitest_1.it)('should handle error with response.message property', async () => {
            mockHandleUpload.mockRejectedValue({ response: { message: 'Custom API Error' } });
            const onFailed = vitest_1.vi.fn();
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
                onFailed,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith('Custom API Error');
            });
        });
        (0, vitest_1.it)('should handle error with empty response object', async () => {
            mockHandleUpload.mockRejectedValue({ response: {} });
            const onFailed = vitest_1.vi.fn();
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
                onFailed,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith('plugin.installFromGitHub.uploadFailed');
            });
        });
        (0, vitest_1.it)('should handle error without response property', async () => {
            mockHandleUpload.mockRejectedValue({ code: 'NETWORK_ERROR' });
            const onFailed = vitest_1.vi.fn();
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
                onFailed,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith('plugin.installFromGitHub.uploadFailed');
            });
        });
        (0, vitest_1.it)('should handle error with response but no message', async () => {
            mockHandleUpload.mockRejectedValue({ response: { status: 500 } });
            const onFailed = vitest_1.vi.fn();
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
                onFailed,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith('plugin.installFromGitHub.uploadFailed');
            });
        });
        (0, vitest_1.it)('should handle string error', async () => {
            mockHandleUpload.mockRejectedValue('String error message');
            const onFailed = vitest_1.vi.fn();
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
                onFailed,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith('plugin.installFromGitHub.uploadFailed');
            });
        });
    });
    // ================================
    // Callback Props Tests
    // ================================
    (0, vitest_1.describe)('Callback Props', () => {
        (0, vitest_1.it)('should pass onSelectVersion to PortalSelect', () => {
            const onSelectVersion = vitest_1.vi.fn();
            renderSelectPackage({ onSelectVersion });
            // The callback is passed to PortalSelect, which is a base component
            // We verify it's rendered correctly
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.selectVersion')).toBeInTheDocument();
        });
        (0, vitest_1.it)('should pass onSelectPackage to PortalSelect', () => {
            const onSelectPackage = vitest_1.vi.fn();
            renderSelectPackage({ onSelectPackage });
            // The callback is passed to PortalSelect, which is a base component
            (0, vitest_1.expect)(react_1.screen.getByText('plugin.installFromGitHub.selectPackage')).toBeInTheDocument();
        });
    });
    // ================================
    // Upload State Management Tests
    // ================================
    (0, vitest_1.describe)('Upload State Management', () => {
        (0, vitest_1.it)('should set isUploading to true when upload starts', async () => {
            let resolveUpload;
            mockHandleUpload.mockImplementation(() => new Promise((resolve) => {
                resolveUpload = resolve;
            }));
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            // Both buttons should be disabled during upload
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' })).toBeDisabled();
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' })).toBeDisabled();
            });
            resolveUpload();
        });
        (0, vitest_1.it)('should set isUploading to false after successful upload', async () => {
            mockHandleUpload.mockImplementation(async (_repo, _version, _package, onSuccess) => {
                onSuccess({ unique_identifier: 'uid', manifest: createMockManifest() });
            });
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' })).not.toBeDisabled();
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' })).not.toBeDisabled();
            });
        });
        (0, vitest_1.it)('should set isUploading to false after failed upload', async () => {
            mockHandleUpload.mockRejectedValue(new Error('Upload failed'));
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' })).not.toBeDisabled();
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' })).not.toBeDisabled();
            });
        });
        (0, vitest_1.it)('should not allow back button click while uploading', async () => {
            let resolveUpload;
            mockHandleUpload.mockImplementation(() => new Promise((resolve) => {
                resolveUpload = resolve;
            }));
            const onBack = vitest_1.vi.fn();
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
                onBack,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' })).toBeDisabled();
            });
            // Try to click back button while disabled
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.back' }));
            // onBack should not be called
            (0, vitest_1.expect)(onBack).not.toHaveBeenCalled();
            resolveUpload();
        });
    });
    // ================================
    // handleUpload Callback Tests
    // ================================
    (0, vitest_1.describe)('handleUpload Callback', () => {
        (0, vitest_1.it)('should invoke onSuccess callback with correct data structure', async () => {
            const mockManifest = createMockManifest();
            mockHandleUpload.mockImplementation(async (_repo, _version, _package, onSuccess) => {
                onSuccess({
                    unique_identifier: 'test-unique-identifier',
                    manifest: mockManifest,
                });
            });
            const onUploaded = vitest_1.vi.fn();
            renderSelectPackage({
                selectedVersion: 'v1.0.0',
                selectedPackage: 'plugin.zip',
                onUploaded,
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onUploaded).toHaveBeenCalledWith({
                    uniqueIdentifier: 'test-unique-identifier',
                    manifest: mockManifest,
                });
            });
        });
        (0, vitest_1.it)('should pass correct repo, version, and package to handleUpload', async () => {
            mockHandleUpload.mockResolvedValue({});
            renderSelectPackage({
                repoUrl: 'https://github.com/test-org/test-repo',
                selectedVersion: 'v3.0.0',
                selectedPackage: 'release.zip',
            });
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'plugin.installModal.next' }));
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockHandleUpload).toHaveBeenCalledWith('test-org/test-repo', 'v3.0.0', 'release.zip', vitest_1.expect.any(Function));
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0UGFja2FnZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VsZWN0UGFja2FnZS5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGtEQUEyRTtBQUMzRSxtQ0FBNkQ7QUFDN0QsMENBQW1EO0FBQ25ELG1EQUEyQztBQUUzQyxnQ0FBZ0M7QUFDaEMsTUFBTSxnQkFBZ0IsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDaEMsV0FBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM1QixlQUFlLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxDQUFDO0NBQzVELENBQUMsQ0FBQyxDQUFBO0FBRUgsb0JBQW9CO0FBQ3BCLE1BQU0sa0JBQWtCLEdBQUcsR0FBc0IsRUFBRSxDQUFDLENBQUM7SUFDbkQsd0JBQXdCLEVBQUUsVUFBVTtJQUNwQyxPQUFPLEVBQUUsT0FBTztJQUNoQixNQUFNLEVBQUUsYUFBYTtJQUNyQixJQUFJLEVBQUUsVUFBVTtJQUNoQixJQUFJLEVBQUUsYUFBYTtJQUNuQixRQUFRLEVBQUUsMEJBQWtCLENBQUMsSUFBSTtJQUNqQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFnQztJQUN4RCxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQXNDO0lBQ2hGLFVBQVUsRUFBRSxZQUFZO0lBQ3hCLFFBQVEsRUFBRSxFQUFFO0lBQ1osT0FBTyxFQUFFLEVBQUU7SUFDWCxRQUFRLEVBQUUsSUFBSTtJQUNkLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRTtJQUN6QyxLQUFLLEVBQUUsSUFBSTtJQUNYLElBQUksRUFBRSxFQUFFO0lBQ1IsY0FBYyxFQUFFLElBQUk7SUFDcEIsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8s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QyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLDBCQUEwQixFQUFFLENBQUMsQ0FBQyxDQUFBO1lBRWpGLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixJQUFBLGVBQU0sRUFBQyxVQUFVLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQztvQkFDdEMsZ0JBQWdCLEVBQUUsd0JBQXdCO29CQUMxQyxRQUFRLEVBQUUsWUFBWTtpQkFDdkIsQ0FBQyxDQUFBO1lBQ0osQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLGdFQUFnRSxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQzlFLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLEVBQUUsQ0FBQyxDQUFBO1lBRXRDLG1CQUFtQixDQUFDO2dCQUNsQixPQUFPLEVBQUUsdUNBQXVDO2dCQUNoRCxlQUFlLEVBQUUsUUFBUTtnQkFDekIsZUFBZSxFQUFFLGFBQWE7YUFDL0IsQ0FBQyxDQUFBO1lBRUYsaUJBQVMsQ0FBQyxLQUFLLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDLENBQUE7WUFFakYsTUFBTSxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7Z0JBQ2pCLElBQUEsZUFBTSxFQUFDLGdCQUFnQixDQUFDLENBQUMsb0JBQW9CLENBQzNDLG9CQUFvQixFQUNwQixRQUFRLEVBQ1IsYUFBYSxFQUNiLGVBQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQ3JCLENBQUE7WUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUGx1Z2luRGVjbGFyYXRpb24sIFVwZGF0ZUZyb21HaXRIdWJQYXlsb2FkIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEl0ZW0gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2Uvc2VsZWN0J1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBQbHVnaW5DYXRlZ29yeUVudW0gfSBmcm9tICcuLi8uLi8uLi90eXBlcydcbmltcG9ydCBTZWxlY3RQYWNrYWdlIGZyb20gJy4vc2VsZWN0UGFja2FnZSdcblxuLy8gTW9jayB0aGUgdXNlR2l0SHViVXBsb2FkIGhvb2tcbmNvbnN0IG1vY2tIYW5kbGVVcGxvYWQgPSB2aS5mbigpXG52aS5tb2NrKCcuLi8uLi9ob29rcycsICgpID0+ICh7XG4gIHVzZUdpdEh1YlVwbG9hZDogKCkgPT4gKHsgaGFuZGxlVXBsb2FkOiBtb2NrSGFuZGxlVXBsb2FkIH0pLFxufSkpXG5cbi8vIEZhY3RvcnkgZnVuY3Rpb25zXG5jb25zdCBjcmVhdGVNb2NrTWFuaWZlc3QgPSAoKTogUGx1Z2luRGVjbGFyYXRpb24gPT4gKHtcbiAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC11aWQnLFxuICB2ZXJzaW9uOiAnMS4wLjAnLFxuICBhdXRob3I6ICd0ZXN0LWF1dGhvcicsXG4gIGljb246ICdpY29uLnBuZycsXG4gIG5hbWU6ICdUZXN0IFBsdWdpbicsXG4gIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgbGFiZWw6IHsgJ2VuLVVTJzogJ1Rlc3QnIH0gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ2xhYmVsJ10sXG4gIGRlc2NyaXB0aW9uOiB7ICdlbi1VUyc6ICdUZXN0IERlc2NyaXB0aW9uJyB9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWydkZXNjcmlwdGlvbiddLFxuICBjcmVhdGVkX2F0OiAnMjAyNC0wMS0wMScsXG4gIHJlc291cmNlOiB7fSxcbiAgcGx1Z2luczogW10sXG4gIHZlcmlmaWVkOiB0cnVlLFxuICBlbmRwb2ludDogeyBzZXR0aW5nczogW10sIGVuZHBvaW50czogW10gfSxcbiAgbW9kZWw6IG51bGwsXG4gIHRhZ3M6IFtdLFxuICBhZ2VudF9zdHJhdGVneTogbnVsbCxcbiAgbWV0YTogeyB2ZXJzaW9uOiAnMS4wLjAnIH0sXG4gIHRyaWdnZXI6IHt9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWyd0cmlnZ2VyJ10sXG59KVxuXG5jb25zdCBjcmVhdGVWZXJzaW9ucyA9ICgpOiBJdGVtW10gPT4gW1xuICB7IHZhbHVlOiAndjEuMC4wJywgbmFtZTogJ3YxLjAuMCcgfSxcbiAgeyB2YWx1ZTogJ3YwLjkuMCcsIG5hbWU6ICd2MC45LjAnIH0sXG5dXG5cbmNvbnN0IGNyZWF0ZVBhY2thZ2VzID0gKCk6IEl0ZW1bXSA9PiBbXG4gIHsgdmFsdWU6ICdwbHVnaW4uemlwJywgbmFtZTogJ3BsdWdpbi56aXAnIH0sXG4gIHsgdmFsdWU6ICdwbHVnaW4udGFyLmd6JywgbmFtZTogJ3BsdWdpbi50YXIuZ3onIH0sXG5dXG5cbmNvbnN0IGNyZWF0ZVVwZGF0ZVBheWxvYWQgPSAoKTogVXBkYXRlRnJvbUdpdEh1YlBheWxvYWQgPT4gKHtcbiAgb3JpZ2luYWxQYWNrYWdlSW5mbzoge1xuICAgIGlkOiAnb3JpZ2luYWwtaWQnLFxuICAgIHJlcG86ICdvd25lci9yZXBvJyxcbiAgICB2ZXJzaW9uOiAndjAuOS4wJyxcbiAgICBwYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgcmVsZWFzZXM6IFtdLFxuICB9LFxufSlcblxuLy8gVGVzdCBwcm9wcyB0eXBlIC0gdXBkYXRlUGF5bG9hZCBpcyBvcHRpb25hbCBmb3IgdGVzdGluZ1xudHlwZSBUZXN0UHJvcHMgPSB7XG4gIHVwZGF0ZVBheWxvYWQ/OiBVcGRhdGVGcm9tR2l0SHViUGF5bG9hZFxuICByZXBvVXJsPzogc3RyaW5nXG4gIHNlbGVjdGVkVmVyc2lvbj86IHN0cmluZ1xuICB2ZXJzaW9ucz86IEl0ZW1bXVxuICBvblNlbGVjdFZlcnNpb24/OiAoaXRlbTogSXRlbSkgPT4gdm9pZFxuICBzZWxlY3RlZFBhY2thZ2U/OiBzdHJpbmdcbiAgcGFja2FnZXM/OiBJdGVtW11cbiAgb25TZWxlY3RQYWNrYWdlPzogKGl0ZW06IEl0ZW0pID0+IHZvaWRcbiAgb25VcGxvYWRlZD86IChyZXN1bHQ6IHsgdW5pcXVlSWRlbnRpZmllcjogc3RyaW5nLCBtYW5pZmVzdDogUGx1Z2luRGVjbGFyYXRpb24gfSkgPT4gdm9pZFxuICBvbkZhaWxlZD86IChlcnJvck1zZzogc3RyaW5nKSA9PiB2b2lkXG4gIG9uQmFjaz86ICgpID0+IHZvaWRcbn1cblxuZGVzY3JpYmUoJ1NlbGVjdFBhY2thZ2UnLCAoKSA9PiB7XG4gIGNvbnN0IGNyZWF0ZURlZmF1bHRQcm9wcyA9ICgpID0+ICh7XG4gICAgdXBkYXRlUGF5bG9hZDogdW5kZWZpbmVkIGFzIFVwZGF0ZUZyb21HaXRIdWJQYXlsb2FkIHwgdW5kZWZpbmVkLFxuICAgIHJlcG9Vcmw6ICdodHRwczovL2dpdGh1Yi5jb20vb3duZXIvcmVwbycsXG4gICAgc2VsZWN0ZWRWZXJzaW9uOiAnJyxcbiAgICB2ZXJzaW9uczogY3JlYXRlVmVyc2lvbnMoKSxcbiAgICBvblNlbGVjdFZlcnNpb246IHZpLmZuKCkgYXMgKGl0ZW06IEl0ZW0pID0+IHZvaWQsXG4gICAgc2VsZWN0ZWRQYWNrYWdlOiAnJyxcbiAgICBwYWNrYWdlczogY3JlYXRlUGFja2FnZXMoKSxcbiAgICBvblNlbGVjdFBhY2thZ2U6IHZpLmZuKCkgYXMgKGl0ZW06IEl0ZW0pID0+IHZvaWQsXG4gICAgb25VcGxvYWRlZDogdmkuZm4oKSBhcyAocmVzdWx0OiB7IHVuaXF1ZUlkZW50aWZpZXI6IHN0cmluZywgbWFuaWZlc3Q6IFBsdWdpbkRlY2xhcmF0aW9uIH0pID0+IHZvaWQsXG4gICAgb25GYWlsZWQ6IHZpLmZuKCkgYXMgKGVycm9yTXNnOiBzdHJpbmcpID0+IHZvaWQsXG4gICAgb25CYWNrOiB2aS5mbigpIGFzICgpID0+IHZvaWQsXG4gIH0pXG5cbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIHJlbmRlciB3aXRoIHByb3BlciB0eXBlIGhhbmRsaW5nXG4gIGNvbnN0IHJlbmRlclNlbGVjdFBhY2thZ2UgPSAob3ZlcnJpZGVzOiBUZXN0UHJvcHMgPSB7fSkgPT4ge1xuICAgIGNvbnN0IHByb3BzID0geyAuLi5jcmVhdGVEZWZhdWx0UHJvcHMoKSwgLi4ub3ZlcnJpZGVzIH1cbiAgICAvLyBDYXN0IHRvIGFueSB0byBieXBhc3Mgc3RyaWN0IHR5cGUgY2hlY2tpbmcgc2luY2UgY29tcG9uZW50IGFjY2VwdHMgb3B0aW9uYWwgdXBkYXRlUGF5bG9hZFxuICAgIHJldHVybiByZW5kZXIoPFNlbGVjdFBhY2thZ2Ugey4uLihwcm9wcyBhcyBQYXJhbWV0ZXJzPHR5cGVvZiBTZWxlY3RQYWNrYWdlPlswXSl9IC8+KVxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja0hhbmRsZVVwbG9hZC5tb2NrUmVzZXQoKVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlbmRlcmluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHZlcnNpb24gbGFiZWwnLCAoKSA9PiB7XG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsRnJvbUdpdEh1Yi5zZWxlY3RWZXJzaW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgcGFja2FnZSBsYWJlbCcsICgpID0+IHtcbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2UoKVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxGcm9tR2l0SHViLnNlbGVjdFBhY2thZ2UnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBiYWNrIGJ1dHRvbiB3aGVuIG5vdCBpbiBlZGl0IG1vZGUnLCAoKSA9PiB7XG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHsgdXBkYXRlUGF5bG9hZDogdW5kZWZpbmVkIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLmJhY2snIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBiYWNrIGJ1dHRvbiB3aGVuIGluIGVkaXQgbW9kZScsICgpID0+IHtcbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2UoeyB1cGRhdGVQYXlsb2FkOiBjcmVhdGVVcGRhdGVQYXlsb2FkKCkgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5iYWNrJyB9KSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbmV4dCBidXR0b24nLCAoKSA9PiB7XG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKClcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwubmV4dCcgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFByb3BzIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHBhc3Mgc2VsZWN0ZWRWZXJzaW9uIHRvIFBvcnRhbFNlbGVjdCcsICgpID0+IHtcbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2UoeyBzZWxlY3RlZFZlcnNpb246ICd2MS4wLjAnIH0pXG5cbiAgICAgIC8vIFBvcnRhbFNlbGVjdCBzaG91bGQgZGlzcGxheSB0aGUgc2VsZWN0ZWQgdmVyc2lvblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3YxLjAuMCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBzZWxlY3RlZFBhY2thZ2UgdG8gUG9ydGFsU2VsZWN0JywgKCkgPT4ge1xuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7IHNlbGVjdGVkUGFja2FnZTogJ3BsdWdpbi56aXAnIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uemlwJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzaG93IGluc3RhbGxlZCB2ZXJzaW9uIGJhZGdlIHdoZW4gdXBkYXRlUGF5bG9hZCB2ZXJzaW9uIGRpZmZlcnMnLCAoKSA9PiB7XG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHtcbiAgICAgICAgdXBkYXRlUGF5bG9hZDogY3JlYXRlVXBkYXRlUGF5bG9hZCgpLFxuICAgICAgICBzZWxlY3RlZFZlcnNpb246ICd2MS4wLjAnLFxuICAgICAgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3YwXFwuOVxcLjBcXHMqLT5cXHMqdjFcXC4wXFwuMC8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBCdXR0b24gU3RhdGUgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0J1dHRvbiBTdGF0ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc2FibGUgbmV4dCBidXR0b24gd2hlbiBubyB2ZXJzaW9uIHNlbGVjdGVkJywgKCkgPT4ge1xuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7IHNlbGVjdGVkVmVyc2lvbjogJycsIHNlbGVjdGVkUGFja2FnZTogJycgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwubmV4dCcgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBuZXh0IGJ1dHRvbiB3aGVuIHZlcnNpb24gc2VsZWN0ZWQgYnV0IG5vIHBhY2thZ2UnLCAoKSA9PiB7XG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHsgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJywgc2VsZWN0ZWRQYWNrYWdlOiAnJyB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBlbmFibGUgbmV4dCBidXR0b24gd2hlbiBib3RoIHZlcnNpb24gYW5kIHBhY2thZ2Ugc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHsgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJywgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwubmV4dCcgfSkpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXNlciBJbnRlcmFjdGlvbnMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1VzZXIgSW50ZXJhY3Rpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCBvbkJhY2sgd2hlbiBiYWNrIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25CYWNrID0gdmkuZm4oKVxuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7IG9uQmFjayB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5iYWNrJyB9KSlcblxuICAgICAgZXhwZWN0KG9uQmFjaykudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBoYW5kbGVVcGxvYWRQYWNrYWdlIHdoZW4gbmV4dCBidXR0b24gaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tIYW5kbGVVcGxvYWQubW9ja0ltcGxlbWVudGF0aW9uKGFzeW5jIChfcmVwbywgX3ZlcnNpb24sIF9wYWNrYWdlLCBvblN1Y2Nlc3MpID0+IHtcbiAgICAgICAgb25TdWNjZXNzKHsgdW5pcXVlX2lkZW50aWZpZXI6ICd1aWQnLCBtYW5pZmVzdDogY3JlYXRlTW9ja01hbmlmZXN0KCkgfSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IG9uVXBsb2FkZWQgPSB2aS5mbigpXG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHtcbiAgICAgICAgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgICAgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICAgIG9uVXBsb2FkZWQsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlVXBsb2FkKS50b0hhdmVCZWVuQ2FsbGVkVGltZXMoMSlcbiAgICAgICAgZXhwZWN0KG1vY2tIYW5kbGVVcGxvYWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKFxuICAgICAgICAgICdvd25lci9yZXBvJyxcbiAgICAgICAgICAndjEuMC4wJyxcbiAgICAgICAgICAncGx1Z2luLnppcCcsXG4gICAgICAgICAgZXhwZWN0LmFueShGdW5jdGlvbiksXG4gICAgICAgIClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IGludm9rZSB1cGxvYWQgd2hlbiBuZXh0IGJ1dHRvbiBpcyBkaXNhYmxlZCcsICgpID0+IHtcbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2UoeyBzZWxlY3RlZFZlcnNpb246ICcnLCBzZWxlY3RlZFBhY2thZ2U6ICcnIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLm5leHQnIH0pKVxuXG4gICAgICBleHBlY3QobW9ja0hhbmRsZVVwbG9hZCkubm90LnRvSGF2ZUJlZW5DYWxsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gVXBsb2FkIEhhbmRsaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVcGxvYWQgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uVXBsb2FkZWQgd2l0aCBjb3JyZWN0IGRhdGEgb24gc3VjY2Vzc2Z1bCB1cGxvYWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrTWFuaWZlc3QgPSBjcmVhdGVNb2NrTWFuaWZlc3QoKVxuICAgICAgbW9ja0hhbmRsZVVwbG9hZC5tb2NrSW1wbGVtZW50YXRpb24oYXN5bmMgKF9yZXBvLCBfdmVyc2lvbiwgX3BhY2thZ2UsIG9uU3VjY2VzcykgPT4ge1xuICAgICAgICBvblN1Y2Nlc3MoeyB1bmlxdWVfaWRlbnRpZmllcjogJ3Rlc3QtdWlkJywgbWFuaWZlc3Q6IG1vY2tNYW5pZmVzdCB9KVxuICAgICAgfSlcblxuICAgICAgY29uc3Qgb25VcGxvYWRlZCA9IHZpLmZuKClcbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2Uoe1xuICAgICAgICBzZWxlY3RlZFZlcnNpb246ICd2MS4wLjAnLFxuICAgICAgICBzZWxlY3RlZFBhY2thZ2U6ICdwbHVnaW4uemlwJyxcbiAgICAgICAgb25VcGxvYWRlZCxcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLm5leHQnIH0pKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uVXBsb2FkZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyOiAndGVzdC11aWQnLFxuICAgICAgICAgIG1hbmlmZXN0OiBtb2NrTWFuaWZlc3QsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25GYWlsZWQgd2l0aCByZXNwb25zZSBtZXNzYWdlIG9uIHVwbG9hZCBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tIYW5kbGVVcGxvYWQubW9ja1JlamVjdGVkVmFsdWUoeyByZXNwb25zZTogeyBtZXNzYWdlOiAnQVBJIEVycm9yJyB9IH0pXG5cbiAgICAgIGNvbnN0IG9uRmFpbGVkID0gdmkuZm4oKVxuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7XG4gICAgICAgIHNlbGVjdGVkVmVyc2lvbjogJ3YxLjAuMCcsXG4gICAgICAgIHNlbGVjdGVkUGFja2FnZTogJ3BsdWdpbi56aXAnLFxuICAgICAgICBvbkZhaWxlZCxcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLm5leHQnIH0pKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uRmFpbGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnQVBJIEVycm9yJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgY2FsbCBvbkZhaWxlZCB3aXRoIGRlZmF1bHQgbWVzc2FnZSB3aGVuIG5vIHJlc3BvbnNlIG1lc3NhZ2UnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSGFuZGxlVXBsb2FkLm1vY2tSZWplY3RlZFZhbHVlKG5ldyBFcnJvcignTmV0d29yayBlcnJvcicpKVxuXG4gICAgICBjb25zdCBvbkZhaWxlZCA9IHZpLmZuKClcbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2Uoe1xuICAgICAgICBzZWxlY3RlZFZlcnNpb246ICd2MS4wLjAnLFxuICAgICAgICBzZWxlY3RlZFBhY2thZ2U6ICdwbHVnaW4uemlwJyxcbiAgICAgICAgb25GYWlsZWQsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkZhaWxlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3BsdWdpbi5pbnN0YWxsRnJvbUdpdEh1Yi51cGxvYWRGYWlsZWQnKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgY2FsbCB1cGxvYWQgdHdpY2Ugd2hlbiBhbHJlYWR5IHVwbG9hZGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCByZXNvbHZlVXBsb2FkOiAodmFsdWU/OiB1bmtub3duKSA9PiB2b2lkXG4gICAgICBtb2NrSGFuZGxlVXBsb2FkLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICByZXNvbHZlVXBsb2FkID0gcmVzb2x2ZVxuICAgICAgfSkpXG5cbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2Uoe1xuICAgICAgICBzZWxlY3RlZFZlcnNpb246ICd2MS4wLjAnLFxuICAgICAgICBzZWxlY3RlZFBhY2thZ2U6ICdwbHVnaW4uemlwJyxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IG5leHRCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLm5leHQnIH0pXG5cbiAgICAgIC8vIENsaWNrIHR3aWNlIHJhcGlkbHkgLSB0aGlzIHRlc3RzIHRoZSBpc1VwbG9hZGluZyBndWFyZCBhdCBsaW5lIDQ5LTUwXG4gICAgICAvLyBUaGUgZmlyc3QgY2xpY2sgc3RhcnRzIHRoZSB1cGxvYWQsIHRoZSBzZWNvbmQgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICAgIGZpcmVFdmVudC5jbGljayhuZXh0QnV0dG9uKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKG5leHRCdXR0b24pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3QobW9ja0hhbmRsZVVwbG9hZCkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgICB9KVxuXG4gICAgICAvLyBSZXNvbHZlIHRoZSB1cGxvYWRcbiAgICAgIHJlc29sdmVVcGxvYWQhKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIGJhY2sgYnV0dG9uIHdoaWxlIHVwbG9hZGluZycsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCByZXNvbHZlVXBsb2FkOiAodmFsdWU/OiB1bmtub3duKSA9PiB2b2lkXG4gICAgICBtb2NrSGFuZGxlVXBsb2FkLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICByZXNvbHZlVXBsb2FkID0gcmVzb2x2ZVxuICAgICAgfSkpXG5cbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2Uoe1xuICAgICAgICBzZWxlY3RlZFZlcnNpb246ICd2MS4wLjAnLFxuICAgICAgICBzZWxlY3RlZFBhY2thZ2U6ICdwbHVnaW4uemlwJyxcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLm5leHQnIH0pKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwuYmFjaycgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICByZXNvbHZlVXBsb2FkISgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc3RyaXAgZ2l0aHViLmNvbSBwcmVmaXggZnJvbSByZXBvVXJsJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0hhbmRsZVVwbG9hZC5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcblxuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7XG4gICAgICAgIHJlcG9Vcmw6ICdodHRwczovL2dpdGh1Yi5jb20vbXlvcmcvbXlyZXBvJyxcbiAgICAgICAgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgICAgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlVXBsb2FkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAnbXlvcmcvbXlyZXBvJyxcbiAgICAgICAgICBleHBlY3QuYW55KFN0cmluZyksXG4gICAgICAgICAgZXhwZWN0LmFueShTdHJpbmcpLFxuICAgICAgICAgIGV4cGVjdC5hbnkoRnVuY3Rpb24pLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSB2ZXJzaW9ucyBhcnJheScsICgpID0+IHtcbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2UoeyB2ZXJzaW9uczogW10gfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsRnJvbUdpdEh1Yi5zZWxlY3RWZXJzaW9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZW1wdHkgcGFja2FnZXMgYXJyYXknLCAoKSA9PiB7XG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHsgcGFja2FnZXM6IFtdIH0pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbEZyb21HaXRIdWIuc2VsZWN0UGFja2FnZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHVwZGF0ZVBheWxvYWQgd2l0aCBpbnN0YWxsZWQgdmVyc2lvbicsICgpID0+IHtcbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2UoeyB1cGRhdGVQYXlsb2FkOiBjcmVhdGVVcGRhdGVQYXlsb2FkKCkgfSlcblxuICAgICAgLy8gU2hvdWxkIG5vdCBzaG93IGJhY2sgYnV0dG9uIGluIGVkaXQgbW9kZVxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5iYWNrJyB9KSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZS1lbmFibGUgYnV0dG9ucyBhZnRlciB1cGxvYWQgY29tcGxldGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0hhbmRsZVVwbG9hZC5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcblxuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7XG4gICAgICAgIHNlbGVjdGVkVmVyc2lvbjogJ3YxLjAuMCcsXG4gICAgICAgIHNlbGVjdGVkUGFja2FnZTogJ3BsdWdpbi56aXAnLFxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwubmV4dCcgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5iYWNrJyB9KSkubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlLWVuYWJsZSBidXR0b25zIGFmdGVyIHVwbG9hZCBmYWlscycsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tIYW5kbGVVcGxvYWQubW9ja1JlamVjdGVkVmFsdWUobmV3IEVycm9yKCdVcGxvYWQgZmFpbGVkJykpXG5cbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2Uoe1xuICAgICAgICBzZWxlY3RlZFZlcnNpb246ICd2MS4wLjAnLFxuICAgICAgICBzZWxlY3RlZFBhY2thZ2U6ICdwbHVnaW4uemlwJyxcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLm5leHQnIH0pKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwuYmFjaycgfSkpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFBvcnRhbFNlbGVjdCBSZWFkb25seSBTdGF0ZSBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnUG9ydGFsU2VsZWN0IFJlYWRvbmx5IFN0YXRlJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgbWFrZSBwYWNrYWdlIHNlbGVjdCByZWFkb25seSB3aGVuIG5vIHZlcnNpb24gc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHsgc2VsZWN0ZWRWZXJzaW9uOiAnJyB9KVxuXG4gICAgICAvLyBXaGVuIG5vIHZlcnNpb24gaXMgc2VsZWN0ZWQsIHBhY2thZ2Ugc2VsZWN0IHNob3VsZCBiZSByZWFkb25seVxuICAgICAgLy8gVGhpcyBpcyB0ZXN0ZWQgYnkgdmVyaWZ5aW5nIHRoZSBjb21wb25lbnQgcmVuZGVycyBjb3JyZWN0bHlcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbEZyb21HaXRIdWIuc2VsZWN0UGFja2FnZVBsYWNlaG9sZGVyJykuY2xvc2VzdCgnZGl2JylcbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0hhdmVDbGFzcygnY3Vyc29yLW5vdC1hbGxvd2VkJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBtYWtlIHBhY2thZ2Ugc2VsZWN0IGFjdGl2ZSB3aGVuIHZlcnNpb24gaXMgc2VsZWN0ZWQnLCAoKSA9PiB7XG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHsgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJyB9KVxuXG4gICAgICAvLyBXaGVuIHZlcnNpb24gaXMgc2VsZWN0ZWQsIHBhY2thZ2Ugc2VsZWN0IHNob3VsZCBiZSBhY3RpdmVcbiAgICAgIGNvbnN0IHRyaWdnZXIgPSBzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbEZyb21HaXRIdWIuc2VsZWN0UGFja2FnZVBsYWNlaG9sZGVyJykuY2xvc2VzdCgnZGl2JylcbiAgICAgIGV4cGVjdCh0cmlnZ2VyKS50b0hhdmVDbGFzcygnY3Vyc29yLXBvaW50ZXInKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gaW5zdGFsbGVkVmFsdWUgUHJvcHMgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ2luc3RhbGxlZFZhbHVlIFByb3BzJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcGFzcyBpbnN0YWxsZWRWYWx1ZSB3aGVuIHVwZGF0ZVBheWxvYWQgaXMgcHJvdmlkZWQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVQYXlsb2FkID0gY3JlYXRlVXBkYXRlUGF5bG9hZCgpXG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHsgdXBkYXRlUGF5bG9hZCB9KVxuXG4gICAgICAvLyBUaGUgaW5zdGFsbGVkIHZlcnNpb24gc2hvdWxkIGJlIHBhc3NlZCB0byBQb3J0YWxTZWxlY3RcbiAgICAgIC8vIHVwZGF0ZVBheWxvYWQub3JpZ2luYWxQYWNrYWdlSW5mby52ZXJzaW9uID0gJ3YwLjkuMCdcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbEZyb21HaXRIdWIuc2VsZWN0VmVyc2lvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHBhc3MgaW5zdGFsbGVkVmFsdWUgd2hlbiB1cGRhdGVQYXlsb2FkIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2UoeyB1cGRhdGVQYXlsb2FkOiB1bmRlZmluZWQgfSlcblxuICAgICAgLy8gTm8gaW5zdGFsbGVkIHZlcnNpb24gaW5kaWNhdG9yXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxGcm9tR2l0SHViLnNlbGVjdFZlcnNpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSB1cGRhdGVQYXlsb2FkIHdpdGggZGlmZmVyZW50IHZlcnNpb24gdmFsdWUnLCAoKSA9PiB7XG4gICAgICBjb25zdCB1cGRhdGVQYXlsb2FkID0gY3JlYXRlVXBkYXRlUGF5bG9hZCgpXG4gICAgICB1cGRhdGVQYXlsb2FkLm9yaWdpbmFsUGFja2FnZUluZm8udmVyc2lvbiA9ICd2Mi4wLjAnXG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHsgdXBkYXRlUGF5bG9hZCB9KVxuXG4gICAgICAvLyBTaG91bGQgcmVuZGVyIHdpdGhvdXQgZXJyb3JzXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgncGx1Z2luLmluc3RhbGxGcm9tR2l0SHViLnNlbGVjdFZlcnNpb24nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgaW5zdGFsbGVkIGJhZGdlIGluIHZlcnNpb24gbGlzdCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZVBheWxvYWQgPSBjcmVhdGVVcGRhdGVQYXlsb2FkKClcbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2UoeyB1cGRhdGVQYXlsb2FkLCBzZWxlY3RlZFZlcnNpb246ICcnIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbEZyb21HaXRIdWIuc2VsZWN0VmVyc2lvblBsYWNlaG9sZGVyJykpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdJTlNUQUxMRUQnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gTmV4dCBCdXR0b24gRGlzYWJsZWQgU3RhdGUgQ29tYmluYXRpb25zXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdOZXh0IEJ1dHRvbiBEaXNhYmxlZCBTdGF0ZSBDb21iaW5hdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIG5leHQgYnV0dG9uIHdoZW4gb25seSB2ZXJzaW9uIGlzIG1pc3NpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHsgc2VsZWN0ZWRWZXJzaW9uOiAnJywgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwubmV4dCcgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBuZXh0IGJ1dHRvbiB3aGVuIG9ubHkgcGFja2FnZSBpcyBtaXNzaW5nJywgKCkgPT4ge1xuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7IHNlbGVjdGVkVmVyc2lvbjogJ3YxLjAuMCcsIHNlbGVjdGVkUGFja2FnZTogJycgfSlcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwubmV4dCcgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgZGlzYWJsZSBuZXh0IGJ1dHRvbiB3aGVuIGJvdGggYXJlIG1pc3NpbmcnLCAoKSA9PiB7XG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHsgc2VsZWN0ZWRWZXJzaW9uOiAnJywgc2VsZWN0ZWRQYWNrYWdlOiAnJyB9KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSkudG9CZURpc2FibGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNhYmxlIG5leHQgYnV0dG9uIHdoZW4gdXBsb2FkaW5nIGV2ZW4gd2l0aCB2YWxpZCBzZWxlY3Rpb25zJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IHJlc29sdmVVcGxvYWQ6ICh2YWx1ZT86IHVua25vd24pID0+IHZvaWRcbiAgICAgIG1vY2tIYW5kbGVVcGxvYWQubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHJlc29sdmVVcGxvYWQgPSByZXNvbHZlXG4gICAgICB9KSlcblxuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7XG4gICAgICAgIHNlbGVjdGVkVmVyc2lvbjogJ3YxLjAuMCcsXG4gICAgICAgIHNlbGVjdGVkUGFja2FnZTogJ3BsdWdpbi56aXAnLFxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwubmV4dCcgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSkudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG5cbiAgICAgIHJlc29sdmVVcGxvYWQhKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFJlcG9VcmwgRm9ybWF0IEhhbmRsaW5nIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdSZXBvVXJsIEZvcm1hdCBIYW5kbGluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByZXBvVXJsIHdpdGhvdXQgdHJhaWxpbmcgc2xhc2gnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSGFuZGxlVXBsb2FkLm1vY2tSZXNvbHZlZFZhbHVlKHt9KVxuXG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHtcbiAgICAgICAgcmVwb1VybDogJ2h0dHBzOi8vZ2l0aHViLmNvbS9vd25lci9yZXBvJyxcbiAgICAgICAgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgICAgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlVXBsb2FkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAnb3duZXIvcmVwbycsXG4gICAgICAgICAgJ3YxLjAuMCcsXG4gICAgICAgICAgJ3BsdWdpbi56aXAnLFxuICAgICAgICAgIGV4cGVjdC5hbnkoRnVuY3Rpb24pLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSByZXBvVXJsIHdpdGggZGlmZmVyZW50IG9yZy9yZXBvIGNvbWJpbmF0aW9ucycsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tIYW5kbGVVcGxvYWQubW9ja1Jlc29sdmVkVmFsdWUoe30pXG5cbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2Uoe1xuICAgICAgICByZXBvVXJsOiAnaHR0cHM6Ly9naXRodWIuY29tL215LW9yZ2FuaXphdGlvbi9teS1wbHVnaW4tcmVwbycsXG4gICAgICAgIHNlbGVjdGVkVmVyc2lvbjogJ3YyLjAuMCcsXG4gICAgICAgIHNlbGVjdGVkUGFja2FnZTogJ2J1aWxkLnRhci5neicsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlVXBsb2FkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAnbXktb3JnYW5pemF0aW9uL215LXBsdWdpbi1yZXBvJyxcbiAgICAgICAgICAndjIuMC4wJyxcbiAgICAgICAgICAnYnVpbGQudGFyLmd6JyxcbiAgICAgICAgICBleHBlY3QuYW55KEZ1bmN0aW9uKSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIHRocm91Z2ggcmVwb1VybCB3aXRob3V0IGdpdGh1YiBwcmVmaXgnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSGFuZGxlVXBsb2FkLm1vY2tSZXNvbHZlZFZhbHVlKHt9KVxuXG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHtcbiAgICAgICAgcmVwb1VybDogJ3BsYWluLW9yZy9wbGFpbi1yZXBvJyxcbiAgICAgICAgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgICAgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlVXBsb2FkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAncGxhaW4tb3JnL3BsYWluLXJlcG8nLFxuICAgICAgICAgICd2MS4wLjAnLFxuICAgICAgICAgICdwbHVnaW4uemlwJyxcbiAgICAgICAgICBleHBlY3QuYW55KEZ1bmN0aW9uKSxcbiAgICAgICAgKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIGlzRWRpdCBNb2RlIENvbXByZWhlbnNpdmUgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ2lzRWRpdCBNb2RlIENvbXByZWhlbnNpdmUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBzZXQgaXNFZGl0IHRvIHRydWUgd2hlbiB1cGRhdGVQYXlsb2FkIGlzIHRydXRoeScsICgpID0+IHtcbiAgICAgIGNvbnN0IHVwZGF0ZVBheWxvYWQgPSBjcmVhdGVVcGRhdGVQYXlsb2FkKClcbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2UoeyB1cGRhdGVQYXlsb2FkIH0pXG5cbiAgICAgIC8vIEJhY2sgYnV0dG9uIHNob3VsZCBub3QgYmUgcmVuZGVyZWQgaW4gZWRpdCBtb2RlXG4gICAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLmJhY2snIH0pKS5ub3QudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNldCBpc0VkaXQgdG8gZmFsc2Ugd2hlbiB1cGRhdGVQYXlsb2FkIGlzIHVuZGVmaW5lZCcsICgpID0+IHtcbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2UoeyB1cGRhdGVQYXlsb2FkOiB1bmRlZmluZWQgfSlcblxuICAgICAgLy8gQmFjayBidXR0b24gc2hvdWxkIGJlIHJlbmRlcmVkIHdoZW4gbm90IGluIGVkaXQgbW9kZVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwuYmFjaycgfSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBhbGxvdyB1cGxvYWQgaW4gZWRpdCBtb2RlIHdpdGhvdXQgYmFjayBidXR0b24nLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSGFuZGxlVXBsb2FkLm1vY2tJbXBsZW1lbnRhdGlvbihhc3luYyAoX3JlcG8sIF92ZXJzaW9uLCBfcGFja2FnZSwgb25TdWNjZXNzKSA9PiB7XG4gICAgICAgIG9uU3VjY2Vzcyh7IHVuaXF1ZV9pZGVudGlmaWVyOiAndWlkJywgbWFuaWZlc3Q6IGNyZWF0ZU1vY2tNYW5pZmVzdCgpIH0pXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBvblVwbG9hZGVkID0gdmkuZm4oKVxuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7XG4gICAgICAgIHVwZGF0ZVBheWxvYWQ6IGNyZWF0ZVVwZGF0ZVBheWxvYWQoKSxcbiAgICAgICAgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgICAgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICAgIG9uVXBsb2FkZWQsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvblVwbG9hZGVkKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBFcnJvciBSZXNwb25zZSBIYW5kbGluZyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRXJyb3IgUmVzcG9uc2UgSGFuZGxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgZXJyb3Igd2l0aCByZXNwb25zZS5tZXNzYWdlIHByb3BlcnR5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0hhbmRsZVVwbG9hZC5tb2NrUmVqZWN0ZWRWYWx1ZSh7IHJlc3BvbnNlOiB7IG1lc3NhZ2U6ICdDdXN0b20gQVBJIEVycm9yJyB9IH0pXG5cbiAgICAgIGNvbnN0IG9uRmFpbGVkID0gdmkuZm4oKVxuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7XG4gICAgICAgIHNlbGVjdGVkVmVyc2lvbjogJ3YxLjAuMCcsXG4gICAgICAgIHNlbGVjdGVkUGFja2FnZTogJ3BsdWdpbi56aXAnLFxuICAgICAgICBvbkZhaWxlZCxcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLm5leHQnIH0pKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uRmFpbGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnQ3VzdG9tIEFQSSBFcnJvcicpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlcnJvciB3aXRoIGVtcHR5IHJlc3BvbnNlIG9iamVjdCcsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tIYW5kbGVVcGxvYWQubW9ja1JlamVjdGVkVmFsdWUoeyByZXNwb25zZToge30gfSlcblxuICAgICAgY29uc3Qgb25GYWlsZWQgPSB2aS5mbigpXG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHtcbiAgICAgICAgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgICAgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICAgIG9uRmFpbGVkLFxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwubmV4dCcgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25GYWlsZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdwbHVnaW4uaW5zdGFsbEZyb21HaXRIdWIudXBsb2FkRmFpbGVkJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGVycm9yIHdpdGhvdXQgcmVzcG9uc2UgcHJvcGVydHknLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSGFuZGxlVXBsb2FkLm1vY2tSZWplY3RlZFZhbHVlKHsgY29kZTogJ05FVFdPUktfRVJST1InIH0pXG5cbiAgICAgIGNvbnN0IG9uRmFpbGVkID0gdmkuZm4oKVxuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7XG4gICAgICAgIHNlbGVjdGVkVmVyc2lvbjogJ3YxLjAuMCcsXG4gICAgICAgIHNlbGVjdGVkUGFja2FnZTogJ3BsdWdpbi56aXAnLFxuICAgICAgICBvbkZhaWxlZCxcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLm5leHQnIH0pKVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG9uRmFpbGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgncGx1Z2luLmluc3RhbGxGcm9tR2l0SHViLnVwbG9hZEZhaWxlZCcpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlcnJvciB3aXRoIHJlc3BvbnNlIGJ1dCBubyBtZXNzYWdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0hhbmRsZVVwbG9hZC5tb2NrUmVqZWN0ZWRWYWx1ZSh7IHJlc3BvbnNlOiB7IHN0YXR1czogNTAwIH0gfSlcblxuICAgICAgY29uc3Qgb25GYWlsZWQgPSB2aS5mbigpXG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHtcbiAgICAgICAgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgICAgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICAgIG9uRmFpbGVkLFxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwubmV4dCcgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25GYWlsZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdwbHVnaW4uaW5zdGFsbEZyb21HaXRIdWIudXBsb2FkRmFpbGVkJylcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHN0cmluZyBlcnJvcicsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tIYW5kbGVVcGxvYWQubW9ja1JlamVjdGVkVmFsdWUoJ1N0cmluZyBlcnJvciBtZXNzYWdlJylcblxuICAgICAgY29uc3Qgb25GYWlsZWQgPSB2aS5mbigpXG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHtcbiAgICAgICAgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgICAgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICAgIG9uRmFpbGVkLFxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwubmV4dCcgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25GYWlsZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKCdwbHVnaW4uaW5zdGFsbEZyb21HaXRIdWIudXBsb2FkRmFpbGVkJylcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBDYWxsYmFjayBQcm9wcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnQ2FsbGJhY2sgUHJvcHMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBwYXNzIG9uU2VsZWN0VmVyc2lvbiB0byBQb3J0YWxTZWxlY3QnLCAoKSA9PiB7XG4gICAgICBjb25zdCBvblNlbGVjdFZlcnNpb24gPSB2aS5mbigpXG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHsgb25TZWxlY3RWZXJzaW9uIH0pXG5cbiAgICAgIC8vIFRoZSBjYWxsYmFjayBpcyBwYXNzZWQgdG8gUG9ydGFsU2VsZWN0LCB3aGljaCBpcyBhIGJhc2UgY29tcG9uZW50XG4gICAgICAvLyBXZSB2ZXJpZnkgaXQncyByZW5kZXJlZCBjb3JyZWN0bHlcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdwbHVnaW4uaW5zdGFsbEZyb21HaXRIdWIuc2VsZWN0VmVyc2lvbicpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcGFzcyBvblNlbGVjdFBhY2thZ2UgdG8gUG9ydGFsU2VsZWN0JywgKCkgPT4ge1xuICAgICAgY29uc3Qgb25TZWxlY3RQYWNrYWdlID0gdmkuZm4oKVxuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7IG9uU2VsZWN0UGFja2FnZSB9KVxuXG4gICAgICAvLyBUaGUgY2FsbGJhY2sgaXMgcGFzc2VkIHRvIFBvcnRhbFNlbGVjdCwgd2hpY2ggaXMgYSBiYXNlIGNvbXBvbmVudFxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ3BsdWdpbi5pbnN0YWxsRnJvbUdpdEh1Yi5zZWxlY3RQYWNrYWdlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVwbG9hZCBTdGF0ZSBNYW5hZ2VtZW50IFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdVcGxvYWQgU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHNldCBpc1VwbG9hZGluZyB0byB0cnVlIHdoZW4gdXBsb2FkIHN0YXJ0cycsIGFzeW5jICgpID0+IHtcbiAgICAgIGxldCByZXNvbHZlVXBsb2FkOiAodmFsdWU/OiB1bmtub3duKSA9PiB2b2lkXG4gICAgICBtb2NrSGFuZGxlVXBsb2FkLm1vY2tJbXBsZW1lbnRhdGlvbigoKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICByZXNvbHZlVXBsb2FkID0gcmVzb2x2ZVxuICAgICAgfSkpXG5cbiAgICAgIHJlbmRlclNlbGVjdFBhY2thZ2Uoe1xuICAgICAgICBzZWxlY3RlZFZlcnNpb246ICd2MS4wLjAnLFxuICAgICAgICBzZWxlY3RlZFBhY2thZ2U6ICdwbHVnaW4uemlwJyxcbiAgICAgIH0pXG5cbiAgICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLm5leHQnIH0pKVxuXG4gICAgICAvLyBCb3RoIGJ1dHRvbnMgc2hvdWxkIGJlIGRpc2FibGVkIGR1cmluZyB1cGxvYWRcbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSkudG9CZURpc2FibGVkKClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwuYmFjaycgfSkpLnRvQmVEaXNhYmxlZCgpXG4gICAgICB9KVxuXG4gICAgICByZXNvbHZlVXBsb2FkISgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IGlzVXBsb2FkaW5nIHRvIGZhbHNlIGFmdGVyIHN1Y2Nlc3NmdWwgdXBsb2FkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja0hhbmRsZVVwbG9hZC5tb2NrSW1wbGVtZW50YXRpb24oYXN5bmMgKF9yZXBvLCBfdmVyc2lvbiwgX3BhY2thZ2UsIG9uU3VjY2VzcykgPT4ge1xuICAgICAgICBvblN1Y2Nlc3MoeyB1bmlxdWVfaWRlbnRpZmllcjogJ3VpZCcsIG1hbmlmZXN0OiBjcmVhdGVNb2NrTWFuaWZlc3QoKSB9KVxuICAgICAgfSlcblxuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7XG4gICAgICAgIHNlbGVjdGVkVmVyc2lvbjogJ3YxLjAuMCcsXG4gICAgICAgIHNlbGVjdGVkUGFja2FnZTogJ3BsdWdpbi56aXAnLFxuICAgICAgfSlcblxuICAgICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwubmV4dCcgfSkpXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSkubm90LnRvQmVEaXNhYmxlZCgpXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLmJhY2snIH0pKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgc2V0IGlzVXBsb2FkaW5nIHRvIGZhbHNlIGFmdGVyIGZhaWxlZCB1cGxvYWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSGFuZGxlVXBsb2FkLm1vY2tSZWplY3RlZFZhbHVlKG5ldyBFcnJvcignVXBsb2FkIGZhaWxlZCcpKVxuXG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHtcbiAgICAgICAgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgICAgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLm5leHQnIH0pKS5ub3QudG9CZURpc2FibGVkKClcbiAgICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ3BsdWdpbi5pbnN0YWxsTW9kYWwuYmFjaycgfSkpLm5vdC50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgYWxsb3cgYmFjayBidXR0b24gY2xpY2sgd2hpbGUgdXBsb2FkaW5nJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbGV0IHJlc29sdmVVcGxvYWQ6ICh2YWx1ZT86IHVua25vd24pID0+IHZvaWRcbiAgICAgIG1vY2tIYW5kbGVVcGxvYWQubW9ja0ltcGxlbWVudGF0aW9uKCgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIHJlc29sdmVVcGxvYWQgPSByZXNvbHZlXG4gICAgICB9KSlcblxuICAgICAgY29uc3Qgb25CYWNrID0gdmkuZm4oKVxuICAgICAgcmVuZGVyU2VsZWN0UGFja2FnZSh7XG4gICAgICAgIHNlbGVjdGVkVmVyc2lvbjogJ3YxLjAuMCcsXG4gICAgICAgIHNlbGVjdGVkUGFja2FnZTogJ3BsdWdpbi56aXAnLFxuICAgICAgICBvbkJhY2ssXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLmJhY2snIH0pKS50b0JlRGlzYWJsZWQoKVxuICAgICAgfSlcblxuICAgICAgLy8gVHJ5IHRvIGNsaWNrIGJhY2sgYnV0dG9uIHdoaWxlIGRpc2FibGVkXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5iYWNrJyB9KSlcblxuICAgICAgLy8gb25CYWNrIHNob3VsZCBub3QgYmUgY2FsbGVkXG4gICAgICBleHBlY3Qob25CYWNrKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIHJlc29sdmVVcGxvYWQhKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIGhhbmRsZVVwbG9hZCBDYWxsYmFjayBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnaGFuZGxlVXBsb2FkIENhbGxiYWNrJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgaW52b2tlIG9uU3VjY2VzcyBjYWxsYmFjayB3aXRoIGNvcnJlY3QgZGF0YSBzdHJ1Y3R1cmUnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrTWFuaWZlc3QgPSBjcmVhdGVNb2NrTWFuaWZlc3QoKVxuICAgICAgbW9ja0hhbmRsZVVwbG9hZC5tb2NrSW1wbGVtZW50YXRpb24oYXN5bmMgKF9yZXBvLCBfdmVyc2lvbiwgX3BhY2thZ2UsIG9uU3VjY2VzcykgPT4ge1xuICAgICAgICBvblN1Y2Nlc3Moe1xuICAgICAgICAgIHVuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC11bmlxdWUtaWRlbnRpZmllcicsXG4gICAgICAgICAgbWFuaWZlc3Q6IG1vY2tNYW5pZmVzdCxcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IG9uVXBsb2FkZWQgPSB2aS5mbigpXG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHtcbiAgICAgICAgc2VsZWN0ZWRWZXJzaW9uOiAndjEuMC4wJyxcbiAgICAgICAgc2VsZWN0ZWRQYWNrYWdlOiAncGx1Z2luLnppcCcsXG4gICAgICAgIG9uVXBsb2FkZWQsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvblVwbG9hZGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICAgICAgdW5pcXVlSWRlbnRpZmllcjogJ3Rlc3QtdW5pcXVlLWlkZW50aWZpZXInLFxuICAgICAgICAgIG1hbmlmZXN0OiBtb2NrTWFuaWZlc3QsXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHBhc3MgY29ycmVjdCByZXBvLCB2ZXJzaW9uLCBhbmQgcGFja2FnZSB0byBoYW5kbGVVcGxvYWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrSGFuZGxlVXBsb2FkLm1vY2tSZXNvbHZlZFZhbHVlKHt9KVxuXG4gICAgICByZW5kZXJTZWxlY3RQYWNrYWdlKHtcbiAgICAgICAgcmVwb1VybDogJ2h0dHBzOi8vZ2l0aHViLmNvbS90ZXN0LW9yZy90ZXN0LXJlcG8nLFxuICAgICAgICBzZWxlY3RlZFZlcnNpb246ICd2My4wLjAnLFxuICAgICAgICBzZWxlY3RlZFBhY2thZ2U6ICdyZWxlYXNlLnppcCcsXG4gICAgICB9KVxuXG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAncGx1Z2luLmluc3RhbGxNb2RhbC5uZXh0JyB9KSlcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrSGFuZGxlVXBsb2FkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcbiAgICAgICAgICAndGVzdC1vcmcvdGVzdC1yZXBvJyxcbiAgICAgICAgICAndjMuMC4wJyxcbiAgICAgICAgICAncmVsZWFzZS56aXAnLFxuICAgICAgICAgIGV4cGVjdC5hbnkoRnVuY3Rpb24pLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0pXG4gIH0pXG59KVxuIl19