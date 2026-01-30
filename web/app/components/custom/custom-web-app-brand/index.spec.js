"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const utils_1 = require("@/app/components/base/image-uploader/utils");
const toast_1 = require("@/app/components/base/toast");
const type_1 = require("@/app/components/billing/type");
const app_context_1 = require("@/context/app-context");
const global_public_context_1 = require("@/context/global-public-context");
const provider_context_1 = require("@/context/provider-context");
const common_1 = require("@/service/common");
const index_1 = require("./index");
vitest_1.vi.mock('@/app/components/base/toast', () => ({
    useToastContext: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('@/service/common', () => ({
    updateCurrentWorkspace: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('@/context/app-context', () => ({
    useAppContext: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('@/context/provider-context', () => ({
    useProviderContext: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('@/context/global-public-context', () => ({
    useGlobalPublicStore: vitest_1.vi.fn(),
}));
vitest_1.vi.mock('@/app/components/base/image-uploader/utils', () => ({
    imageUpload: vitest_1.vi.fn(),
    getImageUploadErrorMessage: vitest_1.vi.fn(),
}));
const mockNotify = vitest_1.vi.fn();
const mockUseToastContext = vitest_1.vi.mocked(toast_1.useToastContext);
const mockUpdateCurrentWorkspace = vitest_1.vi.mocked(common_1.updateCurrentWorkspace);
const mockUseAppContext = vitest_1.vi.mocked(app_context_1.useAppContext);
const mockUseProviderContext = vitest_1.vi.mocked(provider_context_1.useProviderContext);
const mockUseGlobalPublicStore = vitest_1.vi.mocked(global_public_context_1.useGlobalPublicStore);
const mockImageUpload = vitest_1.vi.mocked(utils_1.imageUpload);
const mockGetImageUploadErrorMessage = vitest_1.vi.mocked(utils_1.getImageUploadErrorMessage);
const defaultPlanUsage = {
    buildApps: 0,
    teamMembers: 0,
    annotatedResponse: 0,
    documentsUploadQuota: 0,
    apiRateLimit: 0,
    triggerEvents: 0,
    vectorSpace: 0,
};
const renderComponent = () => (0, react_1.render)(<index_1.default />);
(0, vitest_1.describe)('CustomWebAppBrand', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
        mockUseToastContext.mockReturnValue({ notify: mockNotify });
        mockUpdateCurrentWorkspace.mockResolvedValue({});
        mockUseAppContext.mockReturnValue({
            currentWorkspace: {
                custom_config: {
                    replace_webapp_logo: 'https://example.com/replace.png',
                    remove_webapp_brand: false,
                },
            },
            mutateCurrentWorkspace: vitest_1.vi.fn(),
            isCurrentWorkspaceManager: true,
        });
        mockUseProviderContext.mockReturnValue({
            plan: {
                type: type_1.Plan.professional,
                usage: defaultPlanUsage,
                total: defaultPlanUsage,
                reset: {},
            },
            enableBilling: false,
        });
        const systemFeaturesState = {
            branding: {
                enabled: true,
                workspace_logo: 'https://example.com/workspace-logo.png',
            },
        };
        mockUseGlobalPublicStore.mockImplementation(selector => selector ? selector({ systemFeatures: systemFeaturesState }) : { systemFeatures: systemFeaturesState });
        mockGetImageUploadErrorMessage.mockReturnValue('upload error');
    });
    (0, vitest_1.it)('disables upload controls when the user cannot manage the workspace', () => {
        mockUseAppContext.mockReturnValue({
            currentWorkspace: {
                custom_config: {
                    replace_webapp_logo: '',
                    remove_webapp_brand: false,
                },
            },
            mutateCurrentWorkspace: vitest_1.vi.fn(),
            isCurrentWorkspaceManager: false,
        });
        const { container } = renderComponent();
        const fileInput = container.querySelector('input[type="file"]');
        (0, vitest_1.expect)(fileInput).toBeDisabled();
    });
    (0, vitest_1.it)('toggles remove brand switch and calls the backend + mutate', async () => {
        const mutateMock = vitest_1.vi.fn();
        mockUseAppContext.mockReturnValue({
            currentWorkspace: {
                custom_config: {
                    replace_webapp_logo: '',
                    remove_webapp_brand: false,
                },
            },
            mutateCurrentWorkspace: mutateMock,
            isCurrentWorkspaceManager: true,
        });
        renderComponent();
        const switchInput = react_1.screen.getByRole('switch');
        react_1.fireEvent.click(switchInput);
        await (0, react_1.waitFor)(() => (0, vitest_1.expect)(mockUpdateCurrentWorkspace).toHaveBeenCalledWith({
            url: '/workspaces/custom-config',
            body: { remove_webapp_brand: true },
        }));
        await (0, react_1.waitFor)(() => (0, vitest_1.expect)(mutateMock).toHaveBeenCalled());
    });
    (0, vitest_1.it)('shows cancel/apply buttons after successful upload and cancels properly', async () => {
        mockImageUpload.mockImplementation(({ onProgressCallback, onSuccessCallback }) => {
            onProgressCallback(50);
            onSuccessCallback({ id: 'new-logo' });
        });
        const { container } = renderComponent();
        const fileInput = container.querySelector('input[type="file"]');
        const testFile = new File(['content'], 'logo.png', { type: 'image/png' });
        react_1.fireEvent.change(fileInput, { target: { files: [testFile] } });
        await (0, react_1.waitFor)(() => (0, vitest_1.expect)(mockImageUpload).toHaveBeenCalled());
        await (0, react_1.waitFor)(() => react_1.screen.getByRole('button', { name: 'custom.apply' }));
        const cancelButton = react_1.screen.getByRole('button', { name: 'common.operation.cancel' });
        react_1.fireEvent.click(cancelButton);
        await (0, react_1.waitFor)(() => (0, vitest_1.expect)(react_1.screen.queryByRole('button', { name: 'custom.apply' })).toBeNull());
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQTJFO0FBQzNFLG1DQUE2RDtBQUM3RCxzRUFBb0c7QUFDcEcsdURBQTZEO0FBQzdELHdEQUFvRDtBQUNwRCx1REFBcUQ7QUFDckQsMkVBQXNFO0FBQ3RFLGlFQUErRDtBQUMvRCw2Q0FBeUQ7QUFDekQsbUNBQXVDO0FBRXZDLFdBQUUsQ0FBQyxJQUFJLENBQUMsNkJBQTZCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM1QyxlQUFlLEVBQUUsV0FBRSxDQUFDLEVBQUUsRUFBRTtDQUN6QixDQUFDLENBQUMsQ0FBQTtBQUNILFdBQUUsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqQyxzQkFBc0IsRUFBRSxXQUFFLENBQUMsRUFBRSxFQUFFO0NBQ2hDLENBQUMsQ0FBQyxDQUFBO0FBQ0gsV0FBRSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLGFBQWEsRUFBRSxXQUFFLENBQUMsRUFBRSxFQUFFO0NBQ3ZCLENBQUMsQ0FBQyxDQUFBO0FBQ0gsV0FBRSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLGtCQUFrQixFQUFFLFdBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDNUIsQ0FBQyxDQUFDLENBQUE7QUFDSCxXQUFFLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDaEQsb0JBQW9CLEVBQUUsV0FBRSxDQUFDLEVBQUUsRUFBRTtDQUM5QixDQUFDLENBQUMsQ0FBQTtBQUNILFdBQUUsQ0FBQyxJQUFJLENBQUMsNENBQTRDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUMzRCxXQUFXLEVBQUUsV0FBRSxDQUFDLEVBQUUs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RSxJQUFJLEVBQUUseUJBQXlCLEVBQUUsQ0FBQyxDQUFBO1FBQ3BGLGlCQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBRTdCLE1BQU0sSUFBQSxlQUFPLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSxlQUFNLEVBQUMsY0FBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUE7SUFDaEcsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZpcmVFdmVudCwgcmVuZGVyLCBzY3JlZW4sIHdhaXRGb3IgfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgYmVmb3JlRWFjaCwgZGVzY3JpYmUsIGV4cGVjdCwgaXQsIHZpIH0gZnJvbSAndml0ZXN0J1xuaW1wb3J0IHsgZ2V0SW1hZ2VVcGxvYWRFcnJvck1lc3NhZ2UsIGltYWdlVXBsb2FkIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ltYWdlLXVwbG9hZGVyL3V0aWxzJ1xuaW1wb3J0IHsgdXNlVG9hc3RDb250ZXh0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgUGxhbiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmlsbGluZy90eXBlJ1xuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCB7IHVzZUdsb2JhbFB1YmxpY1N0b3JlIH0gZnJvbSAnQC9jb250ZXh0L2dsb2JhbC1wdWJsaWMtY29udGV4dCdcbmltcG9ydCB7IHVzZVByb3ZpZGVyQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9wcm92aWRlci1jb250ZXh0J1xuaW1wb3J0IHsgdXBkYXRlQ3VycmVudFdvcmtzcGFjZSB9IGZyb20gJ0Avc2VydmljZS9jb21tb24nXG5pbXBvcnQgQ3VzdG9tV2ViQXBwQnJhbmQgZnJvbSAnLi9pbmRleCdcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0JywgKCkgPT4gKHtcbiAgdXNlVG9hc3RDb250ZXh0OiB2aS5mbigpLFxufSkpXG52aS5tb2NrKCdAL3NlcnZpY2UvY29tbW9uJywgKCkgPT4gKHtcbiAgdXBkYXRlQ3VycmVudFdvcmtzcGFjZTogdmkuZm4oKSxcbn0pKVxudmkubW9jaygnQC9jb250ZXh0L2FwcC1jb250ZXh0JywgKCkgPT4gKHtcbiAgdXNlQXBwQ29udGV4dDogdmkuZm4oKSxcbn0pKVxudmkubW9jaygnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VQcm92aWRlckNvbnRleHQ6IHZpLmZuKCksXG59KSlcbnZpLm1vY2soJ0AvY29udGV4dC9nbG9iYWwtcHVibGljLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VHbG9iYWxQdWJsaWNTdG9yZTogdmkuZm4oKSxcbn0pKVxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL2ltYWdlLXVwbG9hZGVyL3V0aWxzJywgKCkgPT4gKHtcbiAgaW1hZ2VVcGxvYWQ6IHZpLmZuKCksXG4gIGdldEltYWdlVXBsb2FkRXJyb3JNZXNzYWdlOiB2aS5mbigpLFxufSkpXG5cbmNvbnN0IG1vY2tOb3RpZnkgPSB2aS5mbigpXG5jb25zdCBtb2NrVXNlVG9hc3RDb250ZXh0ID0gdmkubW9ja2VkKHVzZVRvYXN0Q29udGV4dClcbmNvbnN0IG1vY2tVcGRhdGVDdXJyZW50V29ya3NwYWNlID0gdmkubW9ja2VkKHVwZGF0ZUN1cnJlbnRXb3Jrc3BhY2UpXG5jb25zdCBtb2NrVXNlQXBwQ29udGV4dCA9IHZpLm1vY2tlZCh1c2VBcHBDb250ZXh0KVxuY29uc3QgbW9ja1VzZVByb3ZpZGVyQ29udGV4dCA9IHZpLm1vY2tlZCh1c2VQcm92aWRlckNvbnRleHQpXG5jb25zdCBtb2NrVXNlR2xvYmFsUHVibGljU3RvcmUgPSB2aS5tb2NrZWQodXNlR2xvYmFsUHVibGljU3RvcmUpXG5jb25zdCBtb2NrSW1hZ2VVcGxvYWQgPSB2aS5tb2NrZWQoaW1hZ2VVcGxvYWQpXG5jb25zdCBtb2NrR2V0SW1hZ2VVcGxvYWRFcnJvck1lc3NhZ2UgPSB2aS5tb2NrZWQoZ2V0SW1hZ2VVcGxvYWRFcnJvck1lc3NhZ2UpXG5cbmNvbnN0IGRlZmF1bHRQbGFuVXNhZ2UgPSB7XG4gIGJ1aWxkQXBwczogMCxcbiAgdGVhbU1lbWJlcnM6IDAsXG4gIGFubm90YXRlZFJlc3BvbnNlOiAwLFxuICBkb2N1bWVudHNVcGxvYWRRdW90YTogMCxcbiAgYXBpUmF0ZUxpbWl0OiAwLFxuICB0cmlnZ2VyRXZlbnRzOiAwLFxuICB2ZWN0b3JTcGFjZTogMCxcbn1cblxuY29uc3QgcmVuZGVyQ29tcG9uZW50ID0gKCkgPT4gcmVuZGVyKDxDdXN0b21XZWJBcHBCcmFuZCAvPilcblxuZGVzY3JpYmUoJ0N1c3RvbVdlYkFwcEJyYW5kJywgKCkgPT4ge1xuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICB2aS5jbGVhckFsbE1vY2tzKClcbiAgICBtb2NrVXNlVG9hc3RDb250ZXh0Lm1vY2tSZXR1cm5WYWx1ZSh7IG5vdGlmeTogbW9ja05vdGlmeSB9IGFzIGFueSlcbiAgICBtb2NrVXBkYXRlQ3VycmVudFdvcmtzcGFjZS5tb2NrUmVzb2x2ZWRWYWx1ZSh7fSBhcyBhbnkpXG4gICAgbW9ja1VzZUFwcENvbnRleHQubW9ja1JldHVyblZhbHVlKHtcbiAgICAgIGN1cnJlbnRXb3Jrc3BhY2U6IHtcbiAgICAgICAgY3VzdG9tX2NvbmZpZzoge1xuICAgICAgICAgIHJlcGxhY2Vfd2ViYXBwX2xvZ286ICdodHRwczovL2V4YW1wbGUuY29tL3JlcGxhY2UucG5nJyxcbiAgICAgICAgICByZW1vdmVfd2ViYXBwX2JyYW5kOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBtdXRhdGVDdXJyZW50V29ya3NwYWNlOiB2aS5mbigpLFxuICAgICAgaXNDdXJyZW50V29ya3NwYWNlTWFuYWdlcjogdHJ1ZSxcbiAgICB9IGFzIGFueSlcbiAgICBtb2NrVXNlUHJvdmlkZXJDb250ZXh0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBwbGFuOiB7XG4gICAgICAgIHR5cGU6IFBsYW4ucHJvZmVzc2lvbmFsLFxuICAgICAgICB1c2FnZTogZGVmYXVsdFBsYW5Vc2FnZSxcbiAgICAgICAgdG90YWw6IGRlZmF1bHRQbGFuVXNhZ2UsXG4gICAgICAgIHJlc2V0OiB7fSxcbiAgICAgIH0sXG4gICAgICBlbmFibGVCaWxsaW5nOiBmYWxzZSxcbiAgICB9IGFzIGFueSlcbiAgICBjb25zdCBzeXN0ZW1GZWF0dXJlc1N0YXRlID0ge1xuICAgICAgYnJhbmRpbmc6IHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgd29ya3NwYWNlX2xvZ286ICdodHRwczovL2V4YW1wbGUuY29tL3dvcmtzcGFjZS1sb2dvLnBuZycsXG4gICAgICB9LFxuICAgIH1cbiAgICBtb2NrVXNlR2xvYmFsUHVibGljU3RvcmUubW9ja0ltcGxlbWVudGF0aW9uKHNlbGVjdG9yID0+IHNlbGVjdG9yID8gc2VsZWN0b3IoeyBzeXN0ZW1GZWF0dXJlczogc3lzdGVtRmVhdHVyZXNTdGF0ZSB9IGFzIGFueSkgOiB7IHN5c3RlbUZlYXR1cmVzOiBzeXN0ZW1GZWF0dXJlc1N0YXRlIH0pXG4gICAgbW9ja0dldEltYWdlVXBsb2FkRXJyb3JNZXNzYWdlLm1vY2tSZXR1cm5WYWx1ZSgndXBsb2FkIGVycm9yJylcbiAgfSlcblxuICBpdCgnZGlzYWJsZXMgdXBsb2FkIGNvbnRyb2xzIHdoZW4gdGhlIHVzZXIgY2Fubm90IG1hbmFnZSB0aGUgd29ya3NwYWNlJywgKCkgPT4ge1xuICAgIG1vY2tVc2VBcHBDb250ZXh0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBjdXJyZW50V29ya3NwYWNlOiB7XG4gICAgICAgIGN1c3RvbV9jb25maWc6IHtcbiAgICAgICAgICByZXBsYWNlX3dlYmFwcF9sb2dvOiAnJyxcbiAgICAgICAgICByZW1vdmVfd2ViYXBwX2JyYW5kOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBtdXRhdGVDdXJyZW50V29ya3NwYWNlOiB2aS5mbigpLFxuICAgICAgaXNDdXJyZW50V29ya3NwYWNlTWFuYWdlcjogZmFsc2UsXG4gICAgfSBhcyBhbnkpXG5cbiAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyQ29tcG9uZW50KClcbiAgICBjb25zdCBmaWxlSW5wdXQgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cImZpbGVcIl0nKSBhcyBIVE1MSW5wdXRFbGVtZW50XG4gICAgZXhwZWN0KGZpbGVJbnB1dCkudG9CZURpc2FibGVkKClcbiAgfSlcblxuICBpdCgndG9nZ2xlcyByZW1vdmUgYnJhbmQgc3dpdGNoIGFuZCBjYWxscyB0aGUgYmFja2VuZCArIG11dGF0ZScsIGFzeW5jICgpID0+IHtcbiAgICBjb25zdCBtdXRhdGVNb2NrID0gdmkuZm4oKVxuICAgIG1vY2tVc2VBcHBDb250ZXh0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBjdXJyZW50V29ya3NwYWNlOiB7XG4gICAgICAgIGN1c3RvbV9jb25maWc6IHtcbiAgICAgICAgICByZXBsYWNlX3dlYmFwcF9sb2dvOiAnJyxcbiAgICAgICAgICByZW1vdmVfd2ViYXBwX2JyYW5kOiBmYWxzZSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICBtdXRhdGVDdXJyZW50V29ya3NwYWNlOiBtdXRhdGVNb2NrLFxuICAgICAgaXNDdXJyZW50V29ya3NwYWNlTWFuYWdlcjogdHJ1ZSxcbiAgICB9IGFzIGFueSlcblxuICAgIHJlbmRlckNvbXBvbmVudCgpXG4gICAgY29uc3Qgc3dpdGNoSW5wdXQgPSBzY3JlZW4uZ2V0QnlSb2xlKCdzd2l0Y2gnKVxuICAgIGZpcmVFdmVudC5jbGljayhzd2l0Y2hJbnB1dClcblxuICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4gZXhwZWN0KG1vY2tVcGRhdGVDdXJyZW50V29ya3NwYWNlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7XG4gICAgICB1cmw6ICcvd29ya3NwYWNlcy9jdXN0b20tY29uZmlnJyxcbiAgICAgIGJvZHk6IHsgcmVtb3ZlX3dlYmFwcF9icmFuZDogdHJ1ZSB9LFxuICAgIH0pKVxuICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4gZXhwZWN0KG11dGF0ZU1vY2spLnRvSGF2ZUJlZW5DYWxsZWQoKSlcbiAgfSlcblxuICBpdCgnc2hvd3MgY2FuY2VsL2FwcGx5IGJ1dHRvbnMgYWZ0ZXIgc3VjY2Vzc2Z1bCB1cGxvYWQgYW5kIGNhbmNlbHMgcHJvcGVybHknLCBhc3luYyAoKSA9PiB7XG4gICAgbW9ja0ltYWdlVXBsb2FkLm1vY2tJbXBsZW1lbnRhdGlvbigoeyBvblByb2dyZXNzQ2FsbGJhY2ssIG9uU3VjY2Vzc0NhbGxiYWNrIH0pID0+IHtcbiAgICAgIG9uUHJvZ3Jlc3NDYWxsYmFjayg1MClcbiAgICAgIG9uU3VjY2Vzc0NhbGxiYWNrKHsgaWQ6ICduZXctbG9nbycgfSlcbiAgICB9KVxuXG4gICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlckNvbXBvbmVudCgpXG4gICAgY29uc3QgZmlsZUlucHV0ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2lucHV0W3R5cGU9XCJmaWxlXCJdJykgYXMgSFRNTElucHV0RWxlbWVudFxuICAgIGNvbnN0IHRlc3RGaWxlID0gbmV3IEZpbGUoWydjb250ZW50J10sICdsb2dvLnBuZycsIHsgdHlwZTogJ2ltYWdlL3BuZycgfSlcbiAgICBmaXJlRXZlbnQuY2hhbmdlKGZpbGVJbnB1dCwgeyB0YXJnZXQ6IHsgZmlsZXM6IFt0ZXN0RmlsZV0gfSB9KVxuXG4gICAgYXdhaXQgd2FpdEZvcigoKSA9PiBleHBlY3QobW9ja0ltYWdlVXBsb2FkKS50b0hhdmVCZWVuQ2FsbGVkKCkpXG4gICAgYXdhaXQgd2FpdEZvcigoKSA9PiBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdjdXN0b20uYXBwbHknIH0pKVxuXG4gICAgY29uc3QgY2FuY2VsQnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnIH0pXG4gICAgZmlyZUV2ZW50LmNsaWNrKGNhbmNlbEJ1dHRvbilcblxuICAgIGF3YWl0IHdhaXRGb3IoKCkgPT4gZXhwZWN0KHNjcmVlbi5xdWVyeUJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY3VzdG9tLmFwcGx5JyB9KSkudG9CZU51bGwoKSlcbiAgfSlcbn0pXG4iXX0=