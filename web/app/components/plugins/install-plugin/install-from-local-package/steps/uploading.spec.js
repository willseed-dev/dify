"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const vitest_1 = require("vitest");
const types_1 = require("../../../types");
const uploading_1 = require("./uploading");
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
];
const createMockFile = (name = 'test-plugin.difypkg') => {
    return new File(['test content'], name, { type: 'application/octet-stream' });
};
// Mock external dependencies
const mockUploadFile = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/plugins', () => ({
    uploadFile: (...args) => mockUploadFile(...args),
}));
vitest_1.vi.mock('../../../card', () => ({
    default: ({ payload, isLoading, loadingFileName }) => (<div data-testid="card">
      <span data-testid="card-name">{payload?.name}</span>
      <span data-testid="card-is-loading">{isLoading ? 'true' : 'false'}</span>
      <span data-testid="card-loading-filename">{loadingFileName || 'null'}</span>
    </div>),
}));
(0, vitest_1.describe)('Uploading', () => {
    const defaultProps = {
        isBundle: false,
        file: createMockFile(),
        onCancel: vitest_1.vi.fn(),
        onPackageUploaded: vitest_1.vi.fn(),
        onBundleUploaded: vitest_1.vi.fn(),
        onFailed: vitest_1.vi.fn(),
    };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockUploadFile.mockReset();
    });
    // ================================
    // Rendering Tests
    // ================================
    (0, vitest_1.describe)('Rendering', () => {
        (0, vitest_1.it)('should render uploading message with file name', () => {
            (0, react_1.render)(<uploading_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByText(/plugin.installModal.uploadingPackage/)).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render loading spinner', () => {
            (0, react_1.render)(<uploading_1.default {...defaultProps}/>);
            // The spinner has animate-spin-slow class
            const spinner = document.querySelector('.animate-spin-slow');
            (0, vitest_1.expect)(spinner).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render card with loading state', () => {
            (0, react_1.render)(<uploading_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-is-loading')).toHaveTextContent('true');
        });
        (0, vitest_1.it)('should render card with file name', () => {
            const file = createMockFile('my-plugin.difypkg');
            (0, react_1.render)(<uploading_1.default {...defaultProps} file={file}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-name')).toHaveTextContent('my-plugin.difypkg');
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-loading-filename')).toHaveTextContent('my-plugin.difypkg');
        });
        (0, vitest_1.it)('should render cancel button', () => {
            (0, react_1.render)(<uploading_1.default {...defaultProps}/>);
            (0, vitest_1.expect)(react_1.screen.getByRole('button', { name: 'common.operation.cancel' })).toBeInTheDocument();
        });
        (0, vitest_1.it)('should render disabled install button', () => {
            (0, react_1.render)(<uploading_1.default {...defaultProps}/>);
            const installButton = react_1.screen.getByRole('button', { name: 'plugin.installModal.install' });
            (0, vitest_1.expect)(installButton).toBeDisabled();
        });
    });
    // ================================
    // Upload Behavior Tests
    // ================================
    (0, vitest_1.describe)('Upload Behavior', () => {
        (0, vitest_1.it)('should call uploadFile on mount', async () => {
            mockUploadFile.mockResolvedValue({});
            (0, react_1.render)(<uploading_1.default {...defaultProps}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUploadFile).toHaveBeenCalledWith(defaultProps.file, false);
            });
        });
        (0, vitest_1.it)('should call uploadFile with isBundle=true for bundle files', async () => {
            mockUploadFile.mockResolvedValue({});
            (0, react_1.render)(<uploading_1.default {...defaultProps} isBundle/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUploadFile).toHaveBeenCalledWith(defaultProps.file, true);
            });
        });
        (0, vitest_1.it)('should call onFailed when upload fails with error message', async () => {
            const errorMessage = 'Upload failed: file too large';
            mockUploadFile.mockRejectedValue({
                response: { message: errorMessage },
            });
            const onFailed = vitest_1.vi.fn();
            (0, react_1.render)(<uploading_1.default {...defaultProps} onFailed={onFailed}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onFailed).toHaveBeenCalledWith(errorMessage);
            });
        });
        // NOTE: The uploadFile API has an unconventional contract where it always rejects.
        // Success vs failure is determined by whether response.message exists:
        // - If response.message exists → treated as failure (calls onFailed)
        // - If response.message is absent → treated as success (calls onPackageUploaded/onBundleUploaded)
        // This explains why we use mockRejectedValue for "success" scenarios below.
        (0, vitest_1.it)('should call onPackageUploaded when upload rejects without error message (success case)', async () => {
            const mockResult = {
                unique_identifier: 'test-uid',
                manifest: createMockManifest(),
            };
            mockUploadFile.mockRejectedValue({
                response: mockResult,
            });
            const onPackageUploaded = vitest_1.vi.fn();
            (0, react_1.render)(<uploading_1.default {...defaultProps} isBundle={false} onPackageUploaded={onPackageUploaded}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onPackageUploaded).toHaveBeenCalledWith({
                    uniqueIdentifier: mockResult.unique_identifier,
                    manifest: mockResult.manifest,
                });
            });
        });
        (0, vitest_1.it)('should call onBundleUploaded when upload rejects without error message (success case)', async () => {
            const mockDependencies = createMockDependencies();
            mockUploadFile.mockRejectedValue({
                response: mockDependencies,
            });
            const onBundleUploaded = vitest_1.vi.fn();
            (0, react_1.render)(<uploading_1.default {...defaultProps} isBundle onBundleUploaded={onBundleUploaded}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onBundleUploaded).toHaveBeenCalledWith(mockDependencies);
            });
        });
    });
    // ================================
    // Cancel Button Tests
    // ================================
    (0, vitest_1.describe)('Cancel Button', () => {
        (0, vitest_1.it)('should call onCancel when cancel button is clicked', async () => {
            const user = user_event_1.default.setup();
            const onCancel = vitest_1.vi.fn();
            (0, react_1.render)(<uploading_1.default {...defaultProps} onCancel={onCancel}/>);
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.cancel' }));
            (0, vitest_1.expect)(onCancel).toHaveBeenCalledTimes(1);
        });
    });
    // ================================
    // File Name Display Tests
    // ================================
    (0, vitest_1.describe)('File Name Display', () => {
        (0, vitest_1.it)('should display correct file name for package file', () => {
            const file = createMockFile('custom-plugin.difypkg');
            (0, react_1.render)(<uploading_1.default {...defaultProps} file={file}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-name')).toHaveTextContent('custom-plugin.difypkg');
        });
        (0, vitest_1.it)('should display correct file name for bundle file', () => {
            const file = createMockFile('custom-bundle.difybndl');
            (0, react_1.render)(<uploading_1.default {...defaultProps} file={file} isBundle/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-name')).toHaveTextContent('custom-bundle.difybndl');
        });
        (0, vitest_1.it)('should display file name in uploading message', () => {
            const file = createMockFile('special-plugin.difypkg');
            (0, react_1.render)(<uploading_1.default {...defaultProps} file={file}/>);
            // The message includes the file name as a parameter
            (0, vitest_1.expect)(react_1.screen.getByText(/plugin\.installModal\.uploadingPackage/)).toHaveTextContent('special-plugin.difypkg');
        });
    });
    // ================================
    // Edge Cases Tests
    // ================================
    (0, vitest_1.describe)('Edge Cases', () => {
        (0, vitest_1.it)('should handle empty response gracefully', async () => {
            mockUploadFile.mockRejectedValue({
                response: {},
            });
            const onPackageUploaded = vitest_1.vi.fn();
            (0, react_1.render)(<uploading_1.default {...defaultProps} onPackageUploaded={onPackageUploaded}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onPackageUploaded).toHaveBeenCalledWith({
                    uniqueIdentifier: undefined,
                    manifest: undefined,
                });
            });
        });
        (0, vitest_1.it)('should handle response with only unique_identifier', async () => {
            mockUploadFile.mockRejectedValue({
                response: { unique_identifier: 'only-uid' },
            });
            const onPackageUploaded = vitest_1.vi.fn();
            (0, react_1.render)(<uploading_1.default {...defaultProps} onPackageUploaded={onPackageUploaded}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(onPackageUploaded).toHaveBeenCalledWith({
                    uniqueIdentifier: 'only-uid',
                    manifest: undefined,
                });
            });
        });
        (0, vitest_1.it)('should handle file with special characters in name', () => {
            const file = createMockFile('my plugin (v1.0).difypkg');
            (0, react_1.render)(<uploading_1.default {...defaultProps} file={file}/>);
            (0, vitest_1.expect)(react_1.screen.getByTestId('card-name')).toHaveTextContent('my plugin (v1.0).difypkg');
        });
    });
    // ================================
    // Props Variations Tests
    // ================================
    (0, vitest_1.describe)('Props Variations', () => {
        (0, vitest_1.it)('should work with different file types', () => {
            const files = [
                createMockFile('plugin-a.difypkg'),
                createMockFile('plugin-b.zip'),
                createMockFile('bundle.difybndl'),
            ];
            files.forEach((file) => {
                const { unmount } = (0, react_1.render)(<uploading_1.default {...defaultProps} file={file}/>);
                (0, vitest_1.expect)(react_1.screen.getByTestId('card-name')).toHaveTextContent(file.name);
                unmount();
            });
        });
        (0, vitest_1.it)('should pass isBundle=false to uploadFile for package files', async () => {
            mockUploadFile.mockResolvedValue({});
            (0, react_1.render)(<uploading_1.default {...defaultProps} isBundle={false}/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUploadFile).toHaveBeenCalledWith(vitest_1.expect.anything(), false);
            });
        });
        (0, vitest_1.it)('should pass isBundle=true to uploadFile for bundle files', async () => {
            mockUploadFile.mockResolvedValue({});
            (0, react_1.render)(<uploading_1.default {...defaultProps} isBundle/>);
            await (0, react_1.waitFor)(() => {
                (0, vitest_1.expect)(mockUploadFile).toHaveBeenCalledWith(vitest_1.expect.anything(), true);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkaW5nLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1cGxvYWRpbmcuc3BlYy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrREFBZ0U7QUFDaEUsNERBQW1EO0FBQ25ELG1DQUE2RDtBQUM3RCwwQ0FBbUQ7QUFDbkQsMkNBQW1DO0FBRW5DLGlDQUFpQztBQUNqQyxNQUFNLGtCQUFrQixHQUFHLENBQUMsWUFBd0MsRUFBRSxFQUFxQixFQUFFLENBQUMsQ0FBQztJQUM3Rix3QkFBd0IsRUFBRSxpQkFBaUI7SUFDM0MsT0FBTyxFQUFFLE9BQU87SUFDaEIsTUFBTSxFQUFFLGFBQWE7SUFDckIsSUFBSSxFQUFFLGVBQWU7SUFDckIsSUFBSSxFQUFFLGFBQWE7SUFDbkIsUUFBUSxFQUFFLDBCQUFrQixDQUFDLElBQUk7SUFDakMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLGFBQWEsRUFBZ0M7SUFDL0QsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLGVBQWUsRUFBc0M7SUFDN0UsVUFBVSxFQUFFLHNCQUFzQjtJQUNsQyxRQUFRLEVBQUUsRUFBRTtJQUNaLE9BQU8sRUFBRSxFQUFFO0lBQ1gsUUFBUSxFQUFFLElBQUk7SUFDZCxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLEVBQUU7SUFDekMsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUUsRUFBRTtJQUNSLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUU7SUFDMUIsT0FBTyxFQUFFLEVBQWtDO0lBQzNDLEdBQUcsU0FBUztDQUNiLENBQUMsQ0FBQTtBQUVGLE1BQU0sc0JBQXNCLEdBQUcsR0FBaUIsRUFBRSxDQUFDO0lBQ2pEO1FBQ0UsSUFBSSxFQUFFLFNBQVM7UUFDZixLQUFLLEVBQUU7WUFDTCxpQkFBaUIsRUFBRSxPQUFPO1lBQzFCLFFBQVEsRUFBRSxrQkFBa0Is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LENBQUMsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUE7WUFDdkUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLElBQUEsV0FBRSxFQUFDLDBEQUEwRCxFQUFFLEtBQUssSUFBSSxFQUFFO1lBQ3hFLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUVwQyxJQUFBLGNBQU0sRUFBQyxDQUFDLG1CQUFTLENBQUMsSUFBSSxZQUFZLENBQUMsQ0FBQyxRQUFRLEVBQUcsQ0FBQyxDQUFBO1lBRWhELE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixJQUFBLGVBQU0sRUFBQyxjQUFjLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxlQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUE7WUFDdEUsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IERlcGVuZGVuY3ksIFBsdWdpbkRlY2xhcmF0aW9uIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnXG5pbXBvcnQgeyByZW5kZXIsIHNjcmVlbiwgd2FpdEZvciB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgdXNlckV2ZW50IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvdXNlci1ldmVudCdcbmltcG9ydCB7IGJlZm9yZUVhY2gsIGRlc2NyaWJlLCBleHBlY3QsIGl0LCB2aSB9IGZyb20gJ3ZpdGVzdCdcbmltcG9ydCB7IFBsdWdpbkNhdGVnb3J5RW51bSB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJ1xuaW1wb3J0IFVwbG9hZGluZyBmcm9tICcuL3VwbG9hZGluZydcblxuLy8gRmFjdG9yeSBmdW5jdGlvbiBmb3IgdGVzdCBkYXRhXG5jb25zdCBjcmVhdGVNb2NrTWFuaWZlc3QgPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFBsdWdpbkRlY2xhcmF0aW9uPiA9IHt9KTogUGx1Z2luRGVjbGFyYXRpb24gPT4gKHtcbiAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAndGVzdC1wbHVnaW4tdWlkJyxcbiAgdmVyc2lvbjogJzEuMC4wJyxcbiAgYXV0aG9yOiAndGVzdC1hdXRob3InLFxuICBpY29uOiAndGVzdC1pY29uLnBuZycsXG4gIG5hbWU6ICdUZXN0IFBsdWdpbicsXG4gIGNhdGVnb3J5OiBQbHVnaW5DYXRlZ29yeUVudW0udG9vbCxcbiAgbGFiZWw6IHsgJ2VuLVVTJzogJ1Rlc3QgUGx1Z2luJyB9IGFzIFBsdWdpbkRlY2xhcmF0aW9uWydsYWJlbCddLFxuICBkZXNjcmlwdGlvbjogeyAnZW4tVVMnOiAnQSB0ZXN0IHBsdWdpbicgfSBhcyBQbHVnaW5EZWNsYXJhdGlvblsnZGVzY3JpcHRpb24nXSxcbiAgY3JlYXRlZF9hdDogJzIwMjQtMDEtMDFUMDA6MDA6MDBaJyxcbiAgcmVzb3VyY2U6IHt9LFxuICBwbHVnaW5zOiBbXSxcbiAgdmVyaWZpZWQ6IHRydWUsXG4gIGVuZHBvaW50OiB7IHNldHRpbmdzOiBbXSwgZW5kcG9pbnRzOiBbXSB9LFxuICBtb2RlbDogbnVsbCxcbiAgdGFnczogW10sXG4gIGFnZW50X3N0cmF0ZWd5OiBudWxsLFxuICBtZXRhOiB7IHZlcnNpb246ICcxLjAuMCcgfSxcbiAgdHJpZ2dlcjoge30gYXMgUGx1Z2luRGVjbGFyYXRpb25bJ3RyaWdnZXInXSxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuY29uc3QgY3JlYXRlTW9ja0RlcGVuZGVuY2llcyA9ICgpOiBEZXBlbmRlbmN5W10gPT4gW1xuICB7XG4gICAgdHlwZTogJ3BhY2thZ2UnLFxuICAgIHZhbHVlOiB7XG4gICAgICB1bmlxdWVfaWRlbnRpZmllcjogJ2RlcC0xJyxcbiAgICAgIG1hbmlmZXN0OiBjcmVhdGVNb2NrTWFuaWZlc3QoeyBuYW1lOiAnRGVwIFBsdWdpbiAxJyB9KSxcbiAgICB9LFxuICB9LFxuXVxuXG5jb25zdCBjcmVhdGVNb2NrRmlsZSA9IChuYW1lOiBzdHJpbmcgPSAndGVzdC1wbHVnaW4uZGlmeXBrZycpOiBGaWxlID0+IHtcbiAgcmV0dXJuIG5ldyBGaWxlKFsndGVzdCBjb250ZW50J10sIG5hbWUsIHsgdHlwZTogJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbScgfSlcbn1cblxuLy8gTW9jayBleHRlcm5hbCBkZXBlbmRlbmNpZXNcbmNvbnN0IG1vY2tVcGxvYWRGaWxlID0gdmkuZm4oKVxudmkubW9jaygnQC9zZXJ2aWNlL3BsdWdpbnMnLCAoKSA9PiAoe1xuICB1cGxvYWRGaWxlOiAoLi4uYXJnczogdW5rbm93bltdKSA9PiBtb2NrVXBsb2FkRmlsZSguLi5hcmdzKSxcbn0pKVxuXG52aS5tb2NrKCcuLi8uLi8uLi9jYXJkJywgKCkgPT4gKHtcbiAgZGVmYXVsdDogKHsgcGF5bG9hZCwgaXNMb2FkaW5nLCBsb2FkaW5nRmlsZU5hbWUgfToge1xuICAgIHBheWxvYWQ6IHsgbmFtZTogc3RyaW5nIH1cbiAgICBpc0xvYWRpbmc/OiBib29sZWFuXG4gICAgbG9hZGluZ0ZpbGVOYW1lPzogc3RyaW5nXG4gIH0pID0+IChcbiAgICA8ZGl2IGRhdGEtdGVzdGlkPVwiY2FyZFwiPlxuICAgICAgPHNwYW4gZGF0YS10ZXN0aWQ9XCJjYXJkLW5hbWVcIj57cGF5bG9hZD8ubmFtZX08L3NwYW4+XG4gICAgICA8c3BhbiBkYXRhLXRlc3RpZD1cImNhcmQtaXMtbG9hZGluZ1wiPntpc0xvYWRpbmcgPyAndHJ1ZScgOiAnZmFsc2UnfTwvc3Bhbj5cbiAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPVwiY2FyZC1sb2FkaW5nLWZpbGVuYW1lXCI+e2xvYWRpbmdGaWxlTmFtZSB8fCAnbnVsbCd9PC9zcGFuPlxuICAgIDwvZGl2PlxuICApLFxufSkpXG5cbmRlc2NyaWJlKCdVcGxvYWRpbmcnLCAoKSA9PiB7XG4gIGNvbnN0IGRlZmF1bHRQcm9wcyA9IHtcbiAgICBpc0J1bmRsZTogZmFsc2UsXG4gICAgZmlsZTogY3JlYXRlTW9ja0ZpbGUoKSxcbiAgICBvbkNhbmNlbDogdmkuZm4oKSxcbiAgICBvblBhY2thZ2VVcGxvYWRlZDogdmkuZm4oKSxcbiAgICBvbkJ1bmRsZVVwbG9hZGVkOiB2aS5mbigpLFxuICAgIG9uRmFpbGVkOiB2aS5mbigpLFxuICB9XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1VwbG9hZEZpbGUubW9ja1Jlc2V0KClcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBSZW5kZXJpbmcgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciB1cGxvYWRpbmcgbWVzc2FnZSB3aXRoIGZpbGUgbmFtZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8VXBsb2FkaW5nIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcGx1Z2luLmluc3RhbGxNb2RhbC51cGxvYWRpbmdQYWNrYWdlLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgbG9hZGluZyBzcGlubmVyJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxVcGxvYWRpbmcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIC8vIFRoZSBzcGlubmVyIGhhcyBhbmltYXRlLXNwaW4tc2xvdyBjbGFzc1xuICAgICAgY29uc3Qgc3Bpbm5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbmltYXRlLXNwaW4tc2xvdycpXG4gICAgICBleHBlY3Qoc3Bpbm5lcikudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjYXJkIHdpdGggbG9hZGluZyBzdGF0ZScsICgpID0+IHtcbiAgICAgIHJlbmRlcig8VXBsb2FkaW5nIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLWlzLWxvYWRpbmcnKSkudG9IYXZlVGV4dENvbnRlbnQoJ3RydWUnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHJlbmRlciBjYXJkIHdpdGggZmlsZSBuYW1lJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGNyZWF0ZU1vY2tGaWxlKCdteS1wbHVnaW4uZGlmeXBrZycpXG4gICAgICByZW5kZXIoPFVwbG9hZGluZyB7Li4uZGVmYXVsdFByb3BzfSBmaWxlPXtmaWxlfSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2FyZC1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdteS1wbHVnaW4uZGlmeXBrZycpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLWxvYWRpbmctZmlsZW5hbWUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ215LXBsdWdpbi5kaWZ5cGtnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgY2FuY2VsIGJ1dHRvbicsICgpID0+IHtcbiAgICAgIHJlbmRlcig8VXBsb2FkaW5nIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnIH0pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGRpc2FibGVkIGluc3RhbGwgYnV0dG9uJywgKCkgPT4ge1xuICAgICAgcmVuZGVyKDxVcGxvYWRpbmcgey4uLmRlZmF1bHRQcm9wc30gLz4pXG5cbiAgICAgIGNvbnN0IGluc3RhbGxCdXR0b24gPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdwbHVnaW4uaW5zdGFsbE1vZGFsLmluc3RhbGwnIH0pXG4gICAgICBleHBlY3QoaW5zdGFsbEJ1dHRvbikudG9CZURpc2FibGVkKClcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIFVwbG9hZCBCZWhhdmlvciBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnVXBsb2FkIEJlaGF2aW9yJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgY2FsbCB1cGxvYWRGaWxlIG9uIG1vdW50JywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja1VwbG9hZEZpbGUubW9ja1Jlc29sdmVkVmFsdWUoe30pXG5cbiAgICAgIHJlbmRlcig8VXBsb2FkaW5nIHsuLi5kZWZhdWx0UHJvcHN9IC8+KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tVcGxvYWRGaWxlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChkZWZhdWx0UHJvcHMuZmlsZSwgZmFsc2UpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgdXBsb2FkRmlsZSB3aXRoIGlzQnVuZGxlPXRydWUgZm9yIGJ1bmRsZSBmaWxlcycsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tVcGxvYWRGaWxlLm1vY2tSZXNvbHZlZFZhbHVlKHt9KVxuXG4gICAgICByZW5kZXIoPFVwbG9hZGluZyB7Li4uZGVmYXVsdFByb3BzfSBpc0J1bmRsZSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVXBsb2FkRmlsZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZGVmYXVsdFByb3BzLmZpbGUsIHRydWUpXG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGNhbGwgb25GYWlsZWQgd2hlbiB1cGxvYWQgZmFpbHMgd2l0aCBlcnJvciBtZXNzYWdlJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgZXJyb3JNZXNzYWdlID0gJ1VwbG9hZCBmYWlsZWQ6IGZpbGUgdG9vIGxhcmdlJ1xuICAgICAgbW9ja1VwbG9hZEZpbGUubW9ja1JlamVjdGVkVmFsdWUoe1xuICAgICAgICByZXNwb25zZTogeyBtZXNzYWdlOiBlcnJvck1lc3NhZ2UgfSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IG9uRmFpbGVkID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxVcGxvYWRpbmcgey4uLmRlZmF1bHRQcm9wc30gb25GYWlsZWQ9e29uRmFpbGVkfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkZhaWxlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZXJyb3JNZXNzYWdlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgLy8gTk9URTogVGhlIHVwbG9hZEZpbGUgQVBJIGhhcyBhbiB1bmNvbnZlbnRpb25hbCBjb250cmFjdCB3aGVyZSBpdCBhbHdheXMgcmVqZWN0cy5cbiAgICAvLyBTdWNjZXNzIHZzIGZhaWx1cmUgaXMgZGV0ZXJtaW5lZCBieSB3aGV0aGVyIHJlc3BvbnNlLm1lc3NhZ2UgZXhpc3RzOlxuICAgIC8vIC0gSWYgcmVzcG9uc2UubWVzc2FnZSBleGlzdHMg4oaSIHRyZWF0ZWQgYXMgZmFpbHVyZSAoY2FsbHMgb25GYWlsZWQpXG4gICAgLy8gLSBJZiByZXNwb25zZS5tZXNzYWdlIGlzIGFic2VudCDihpIgdHJlYXRlZCBhcyBzdWNjZXNzIChjYWxscyBvblBhY2thZ2VVcGxvYWRlZC9vbkJ1bmRsZVVwbG9hZGVkKVxuICAgIC8vIFRoaXMgZXhwbGFpbnMgd2h5IHdlIHVzZSBtb2NrUmVqZWN0ZWRWYWx1ZSBmb3IgXCJzdWNjZXNzXCIgc2NlbmFyaW9zIGJlbG93LlxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uUGFja2FnZVVwbG9hZGVkIHdoZW4gdXBsb2FkIHJlamVjdHMgd2l0aG91dCBlcnJvciBtZXNzYWdlIChzdWNjZXNzIGNhc2UpJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgbW9ja1Jlc3VsdCA9IHtcbiAgICAgICAgdW5pcXVlX2lkZW50aWZpZXI6ICd0ZXN0LXVpZCcsXG4gICAgICAgIG1hbmlmZXN0OiBjcmVhdGVNb2NrTWFuaWZlc3QoKSxcbiAgICAgIH1cbiAgICAgIG1vY2tVcGxvYWRGaWxlLm1vY2tSZWplY3RlZFZhbHVlKHtcbiAgICAgICAgcmVzcG9uc2U6IG1vY2tSZXN1bHQsXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBvblBhY2thZ2VVcGxvYWRlZCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFVwbG9hZGluZ1xuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgaXNCdW5kbGU9e2ZhbHNlfVxuICAgICAgICAgIG9uUGFja2FnZVVwbG9hZGVkPXtvblBhY2thZ2VVcGxvYWRlZH1cbiAgICAgICAgLz4sXG4gICAgICApXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25QYWNrYWdlVXBsb2FkZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyOiBtb2NrUmVzdWx0LnVuaXF1ZV9pZGVudGlmaWVyLFxuICAgICAgICAgIG1hbmlmZXN0OiBtb2NrUmVzdWx0Lm1hbmlmZXN0LFxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQnVuZGxlVXBsb2FkZWQgd2hlbiB1cGxvYWQgcmVqZWN0cyB3aXRob3V0IGVycm9yIG1lc3NhZ2UgKHN1Y2Nlc3MgY2FzZSknLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBtb2NrRGVwZW5kZW5jaWVzID0gY3JlYXRlTW9ja0RlcGVuZGVuY2llcygpXG4gICAgICBtb2NrVXBsb2FkRmlsZS5tb2NrUmVqZWN0ZWRWYWx1ZSh7XG4gICAgICAgIHJlc3BvbnNlOiBtb2NrRGVwZW5kZW5jaWVzLFxuICAgICAgfSlcblxuICAgICAgY29uc3Qgb25CdW5kbGVVcGxvYWRlZCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcihcbiAgICAgICAgPFVwbG9hZGluZ1xuICAgICAgICAgIHsuLi5kZWZhdWx0UHJvcHN9XG4gICAgICAgICAgaXNCdW5kbGVcbiAgICAgICAgICBvbkJ1bmRsZVVwbG9hZGVkPXtvbkJ1bmRsZVVwbG9hZGVkfVxuICAgICAgICAvPixcbiAgICAgIClcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvbkJ1bmRsZVVwbG9hZGVkKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChtb2NrRGVwZW5kZW5jaWVzKVxuICAgICAgfSlcbiAgICB9KVxuICB9KVxuXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIC8vIENhbmNlbCBCdXR0b24gVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0NhbmNlbCBCdXR0b24nLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIG9uQ2FuY2VsIHdoZW4gY2FuY2VsIGJ1dHRvbiBpcyBjbGlja2VkJywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCBvbkNhbmNlbCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8VXBsb2FkaW5nIHsuLi5kZWZhdWx0UHJvcHN9IG9uQ2FuY2VsPXtvbkNhbmNlbH0gLz4pXG5cbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnIH0pKVxuXG4gICAgICBleHBlY3Qob25DYW5jZWwpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRmlsZSBOYW1lIERpc3BsYXkgVGVzdHNcbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgZGVzY3JpYmUoJ0ZpbGUgTmFtZSBEaXNwbGF5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjb3JyZWN0IGZpbGUgbmFtZSBmb3IgcGFja2FnZSBmaWxlJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZSA9IGNyZWF0ZU1vY2tGaWxlKCdjdXN0b20tcGx1Z2luLmRpZnlwa2cnKVxuICAgICAgcmVuZGVyKDxVcGxvYWRpbmcgey4uLmRlZmF1bHRQcm9wc30gZmlsZT17ZmlsZX0gLz4pXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhcmQtbmFtZScpKS50b0hhdmVUZXh0Q29udGVudCgnY3VzdG9tLXBsdWdpbi5kaWZ5cGtnJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGNvcnJlY3QgZmlsZSBuYW1lIGZvciBidW5kbGUgZmlsZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrRmlsZSgnY3VzdG9tLWJ1bmRsZS5kaWZ5Ym5kbCcpXG4gICAgICByZW5kZXIoPFVwbG9hZGluZyB7Li4uZGVmYXVsdFByb3BzfSBmaWxlPXtmaWxlfSBpc0J1bmRsZSAvPilcblxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRlc3RJZCgnY2FyZC1uYW1lJykpLnRvSGF2ZVRleHRDb250ZW50KCdjdXN0b20tYnVuZGxlLmRpZnlibmRsJylcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGZpbGUgbmFtZSBpbiB1cGxvYWRpbmcgbWVzc2FnZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrRmlsZSgnc3BlY2lhbC1wbHVnaW4uZGlmeXBrZycpXG4gICAgICByZW5kZXIoPFVwbG9hZGluZyB7Li4uZGVmYXVsdFByb3BzfSBmaWxlPXtmaWxlfSAvPilcblxuICAgICAgLy8gVGhlIG1lc3NhZ2UgaW5jbHVkZXMgdGhlIGZpbGUgbmFtZSBhcyBhIHBhcmFtZXRlclxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoL3BsdWdpblxcLmluc3RhbGxNb2RhbFxcLnVwbG9hZGluZ1BhY2thZ2UvKSkudG9IYXZlVGV4dENvbnRlbnQoJ3NwZWNpYWwtcGx1Z2luLmRpZnlwa2cnKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gRWRnZSBDYXNlcyBUZXN0c1xuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICBkZXNjcmliZSgnRWRnZSBDYXNlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhbmRsZSBlbXB0eSByZXNwb25zZSBncmFjZWZ1bGx5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja1VwbG9hZEZpbGUubW9ja1JlamVjdGVkVmFsdWUoe1xuICAgICAgICByZXNwb25zZToge30sXG4gICAgICB9KVxuXG4gICAgICBjb25zdCBvblBhY2thZ2VVcGxvYWRlZCA9IHZpLmZuKClcbiAgICAgIHJlbmRlcig8VXBsb2FkaW5nIHsuLi5kZWZhdWx0UHJvcHN9IG9uUGFja2FnZVVwbG9hZGVkPXtvblBhY2thZ2VVcGxvYWRlZH0gLz4pXG5cbiAgICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4ge1xuICAgICAgICBleHBlY3Qob25QYWNrYWdlVXBsb2FkZWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgICB1bmlxdWVJZGVudGlmaWVyOiB1bmRlZmluZWQsXG4gICAgICAgICAgbWFuaWZlc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIHJlc3BvbnNlIHdpdGggb25seSB1bmlxdWVfaWRlbnRpZmllcicsIGFzeW5jICgpID0+IHtcbiAgICAgIG1vY2tVcGxvYWRGaWxlLm1vY2tSZWplY3RlZFZhbHVlKHtcbiAgICAgICAgcmVzcG9uc2U6IHsgdW5pcXVlX2lkZW50aWZpZXI6ICdvbmx5LXVpZCcgfSxcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IG9uUGFja2FnZVVwbG9hZGVkID0gdmkuZm4oKVxuICAgICAgcmVuZGVyKDxVcGxvYWRpbmcgey4uLmRlZmF1bHRQcm9wc30gb25QYWNrYWdlVXBsb2FkZWQ9e29uUGFja2FnZVVwbG9hZGVkfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChvblBhY2thZ2VVcGxvYWRlZCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoe1xuICAgICAgICAgIHVuaXF1ZUlkZW50aWZpZXI6ICdvbmx5LXVpZCcsXG4gICAgICAgICAgbWFuaWZlc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGFuZGxlIGZpbGUgd2l0aCBzcGVjaWFsIGNoYXJhY3RlcnMgaW4gbmFtZScsICgpID0+IHtcbiAgICAgIGNvbnN0IGZpbGUgPSBjcmVhdGVNb2NrRmlsZSgnbXkgcGx1Z2luICh2MS4wKS5kaWZ5cGtnJylcbiAgICAgIHJlbmRlcig8VXBsb2FkaW5nIHsuLi5kZWZhdWx0UHJvcHN9IGZpbGU9e2ZpbGV9IC8+KVxuXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdjYXJkLW5hbWUnKSkudG9IYXZlVGV4dENvbnRlbnQoJ215IHBsdWdpbiAodjEuMCkuZGlmeXBrZycpXG4gICAgfSlcbiAgfSlcblxuICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAvLyBQcm9wcyBWYXJpYXRpb25zIFRlc3RzXG4gIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gIGRlc2NyaWJlKCdQcm9wcyBWYXJpYXRpb25zJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgd29yayB3aXRoIGRpZmZlcmVudCBmaWxlIHR5cGVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgZmlsZXMgPSBbXG4gICAgICAgIGNyZWF0ZU1vY2tGaWxlKCdwbHVnaW4tYS5kaWZ5cGtnJyksXG4gICAgICAgIGNyZWF0ZU1vY2tGaWxlKCdwbHVnaW4tYi56aXAnKSxcbiAgICAgICAgY3JlYXRlTW9ja0ZpbGUoJ2J1bmRsZS5kaWZ5Ym5kbCcpLFxuICAgICAgXVxuXG4gICAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XG4gICAgICAgIGNvbnN0IHsgdW5tb3VudCB9ID0gcmVuZGVyKDxVcGxvYWRpbmcgey4uLmRlZmF1bHRQcm9wc30gZmlsZT17ZmlsZX0gLz4pXG4gICAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXN0SWQoJ2NhcmQtbmFtZScpKS50b0hhdmVUZXh0Q29udGVudChmaWxlLm5hbWUpXG4gICAgICAgIHVubW91bnQoKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGlzQnVuZGxlPWZhbHNlIHRvIHVwbG9hZEZpbGUgZm9yIHBhY2thZ2UgZmlsZXMnLCBhc3luYyAoKSA9PiB7XG4gICAgICBtb2NrVXBsb2FkRmlsZS5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSlcblxuICAgICAgcmVuZGVyKDxVcGxvYWRpbmcgey4uLmRlZmF1bHRQcm9wc30gaXNCdW5kbGU9e2ZhbHNlfSAvPilcblxuICAgICAgYXdhaXQgd2FpdEZvcigoKSA9PiB7XG4gICAgICAgIGV4cGVjdChtb2NrVXBsb2FkRmlsZSkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZXhwZWN0LmFueXRoaW5nKCksIGZhbHNlKVxuICAgICAgfSlcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBwYXNzIGlzQnVuZGxlPXRydWUgdG8gdXBsb2FkRmlsZSBmb3IgYnVuZGxlIGZpbGVzJywgYXN5bmMgKCkgPT4ge1xuICAgICAgbW9ja1VwbG9hZEZpbGUubW9ja1Jlc29sdmVkVmFsdWUoe30pXG5cbiAgICAgIHJlbmRlcig8VXBsb2FkaW5nIHsuLi5kZWZhdWx0UHJvcHN9IGlzQnVuZGxlIC8+KVxuXG4gICAgICBhd2FpdCB3YWl0Rm9yKCgpID0+IHtcbiAgICAgICAgZXhwZWN0KG1vY2tVcGxvYWRGaWxlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChleHBlY3QuYW55dGhpbmcoKSwgdHJ1ZSlcbiAgICAgIH0pXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=