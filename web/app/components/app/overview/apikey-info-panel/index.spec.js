"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const constants_1 = require("@/app/components/header/account-setting/constants");
const apikey_info_panel_test_utils_1 = require("./apikey-info-panel.test-utils");
// Mock config for CE edition
vi.mock('@/config', () => ({
    IS_CE_EDITION: true, // Test CE edition by default
}));
afterEach(react_1.cleanup);
describe('APIKeyInfoPanel - Community Edition', () => {
    const mockSetShowAccountSettingModal = vi.fn();
    beforeEach(() => {
        (0, apikey_info_panel_test_utils_1.clearAllMocks)();
        apikey_info_panel_test_utils_1.mockUseModalContext.mockReturnValue({
            ...apikey_info_panel_test_utils_1.defaultModalContext,
            setShowAccountSettingModal: mockSetShowAccountSettingModal,
        });
    });
    describe('Rendering', () => {
        it('should render without crashing when API key is not set', () => {
            apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            apikey_info_panel_test_utils_1.assertions.shouldRenderMainButton();
        });
        it('should not render when API key is already set', () => {
            const { container } = apikey_info_panel_test_utils_1.scenarios.withAPIKeySet();
            apikey_info_panel_test_utils_1.assertions.shouldNotRender(container);
        });
        it('should not render when panel is hidden by user', () => {
            const { container } = apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            apikey_info_panel_test_utils_1.interactions.clickCloseButton(container);
            apikey_info_panel_test_utils_1.assertions.shouldNotRender(container);
        });
    });
    describe('Content Display', () => {
        it('should display self-host title content', () => {
            apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            expect(react_1.screen.getByText(apikey_info_panel_test_utils_1.textKeys.selfHost.titleRow1)).toBeInTheDocument();
            expect(react_1.screen.getByText(apikey_info_panel_test_utils_1.textKeys.selfHost.titleRow2)).toBeInTheDocument();
        });
        it('should display set API button text', () => {
            apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            expect(react_1.screen.getByText(apikey_info_panel_test_utils_1.textKeys.selfHost.setAPIBtn)).toBeInTheDocument();
        });
        it('should render external link with correct href for self-host version', () => {
            const { container } = apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            const link = container.querySelector('a[href="https://cloud.dify.ai/apps"]');
            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute('target', '_blank');
            expect(link).toHaveAttribute('rel', 'noopener noreferrer');
            expect(link).toHaveTextContent(apikey_info_panel_test_utils_1.textKeys.selfHost.tryCloud);
        });
        it('should have external link with proper styling for self-host version', () => {
            const { container } = apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            const link = container.querySelector('a[href="https://cloud.dify.ai/apps"]');
            expect(link).toHaveClass('mt-2', 'flex', 'h-[26px]', 'items-center', 'space-x-1', 'p-1', 'text-xs', 'font-medium', 'text-[#155EEF]');
        });
    });
    describe('User Interactions', () => {
        it('should call setShowAccountSettingModal when set API button is clicked', () => {
            apikey_info_panel_test_utils_1.scenarios.withMockModal(mockSetShowAccountSettingModal);
            apikey_info_panel_test_utils_1.interactions.clickMainButton();
            expect(mockSetShowAccountSettingModal).toHaveBeenCalledWith({
                payload: constants_1.ACCOUNT_SETTING_TAB.PROVIDER,
            });
        });
        it('should hide panel when close button is clicked', () => {
            const { container } = apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            expect(container.firstChild).toBeInTheDocument();
            apikey_info_panel_test_utils_1.interactions.clickCloseButton(container);
            apikey_info_panel_test_utils_1.assertions.shouldNotRender(container);
        });
    });
    describe('Props and Styling', () => {
        it('should render button with primary variant', () => {
            apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            const button = react_1.screen.getByRole('button');
            expect(button).toHaveClass('btn-primary');
        });
        it('should render panel container with correct classes', () => {
            const { container } = apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            const panel = container.firstChild;
            apikey_info_panel_test_utils_1.assertions.shouldHavePanelStyling(panel);
        });
    });
    describe('State Management', () => {
        it('should start with visible panel (isShow: true)', () => {
            apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            apikey_info_panel_test_utils_1.assertions.shouldRenderMainButton();
        });
        it('should toggle visibility when close button is clicked', () => {
            const { container } = apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            expect(container.firstChild).toBeInTheDocument();
            apikey_info_panel_test_utils_1.interactions.clickCloseButton(container);
            apikey_info_panel_test_utils_1.assertions.shouldNotRender(container);
        });
    });
    describe('Edge Cases', () => {
        it('should handle provider context loading state', () => {
            apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet({
                providerContext: {
                    modelProviders: [],
                    textGenerationModelList: [],
                },
            });
            apikey_info_panel_test_utils_1.assertions.shouldRenderMainButton();
        });
    });
    describe('Accessibility', () => {
        it('should have button with proper role', () => {
            apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            expect(react_1.screen.getByRole('button')).toBeInTheDocument();
        });
        it('should have clickable close button', () => {
            const { container } = apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            apikey_info_panel_test_utils_1.assertions.shouldHaveCloseButton(container);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQXdEO0FBQ3hELGlGQUF1RjtBQUN2RixpRkFRdUM7QUFFdkMsNkJBQTZCO0FBQzdCLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekIsYUFBYSxFQUFFLElBQUksRUFBRSw2QkFBNkI7Q0FDbkQsQ0FBQyxDQUFDLENBQUE7QUFFSCxTQUFTLENBQUMsZUFBTyxDQUFDLENBQUE7QUFFbEIsUUFBUSxDQUFDLHFDQUFxQyxFQUFFLEdBQUcsRUFBRTtJQUNuRCxNQUFNLDhCQUE4QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUU5QyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsSUFBQSw0Q0FBYSxHQUFFLENBQUE7UUFDZixrREFBbUIsQ0FBQyxlQUFlLENBQUM7WUFDbEMsR0FBRyxrREFBbUI7WUFDdEIsMEJBQTBCLEVBQUUsOEJBQThCO1NBQzNELENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtZQUNoRSx3Q0FBUyxDQUFDLGdCQUFnQixFQUFFLENBQUE7WUFDNUIseUNBQVUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFBO1FBQ3JDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtZQUN2RCxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsd0NBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUMvQyx5Q0FBVSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUN2QyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7WUFD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cnQgeyBjbGVhbnVwLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgQUNDT1VOVF9TRVRUSU5HX1RBQiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvaGVhZGVyL2FjY291bnQtc2V0dGluZy9jb25zdGFudHMnXG5pbXBvcnQge1xuICBhc3NlcnRpb25zLFxuICBjbGVhckFsbE1vY2tzLFxuICBkZWZhdWx0TW9kYWxDb250ZXh0LFxuICBpbnRlcmFjdGlvbnMsXG4gIG1vY2tVc2VNb2RhbENvbnRleHQsXG4gIHNjZW5hcmlvcyxcbiAgdGV4dEtleXMsXG59IGZyb20gJy4vYXBpa2V5LWluZm8tcGFuZWwudGVzdC11dGlscydcblxuLy8gTW9jayBjb25maWcgZm9yIENFIGVkaXRpb25cbnZpLm1vY2soJ0AvY29uZmlnJywgKCkgPT4gKHtcbiAgSVNfQ0VfRURJVElPTjogdHJ1ZSwgLy8gVGVzdCBDRSBlZGl0aW9uIGJ5IGRlZmF1bHRcbn0pKVxuXG5hZnRlckVhY2goY2xlYW51cClcblxuZGVzY3JpYmUoJ0FQSUtleUluZm9QYW5lbCAtIENvbW11bml0eSBFZGl0aW9uJywgKCkgPT4ge1xuICBjb25zdCBtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwgPSB2aS5mbigpXG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgY2xlYXJBbGxNb2NrcygpXG4gICAgbW9ja1VzZU1vZGFsQ29udGV4dC5tb2NrUmV0dXJuVmFsdWUoe1xuICAgICAgLi4uZGVmYXVsdE1vZGFsQ29udGV4dCxcbiAgICAgIHNldFNob3dBY2NvdW50U2V0dGluZ01vZGFsOiBtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwsXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUmVuZGVyaW5nJywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmVuZGVyIHdpdGhvdXQgY3Jhc2hpbmcgd2hlbiBBUEkga2V5IGlzIG5vdCBzZXQnLCAoKSA9PiB7XG4gICAgICBzY2VuYXJpb3Mud2l0aEFQSUtleU5vdFNldCgpXG4gICAgICBhc3NlcnRpb25zLnNob3VsZFJlbmRlck1haW5CdXR0b24oKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgd2hlbiBBUEkga2V5IGlzIGFscmVhZHkgc2V0JywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHNjZW5hcmlvcy53aXRoQVBJS2V5U2V0KClcbiAgICAgIGFzc2VydGlvbnMuc2hvdWxkTm90UmVuZGVyKGNvbnRhaW5lcilcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBub3QgcmVuZGVyIHdoZW4gcGFuZWwgaXMgaGlkZGVuIGJ5IHVzZXInLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gc2NlbmFyaW9zLndpdGhBUElLZXlOb3RTZXQoKVxuICAgICAgaW50ZXJhY3Rpb25zLmNsaWNrQ2xvc2VCdXR0b24oY29udGFpbmVyKVxuICAgICAgYXNzZXJ0aW9ucy5zaG91bGROb3RSZW5kZXIoY29udGFpbmVyKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0NvbnRlbnQgRGlzcGxheScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgc2VsZi1ob3N0IHRpdGxlIGNvbnRlbnQnLCAoKSA9PiB7XG4gICAgICBzY2VuYXJpb3Mud2l0aEFQSUtleU5vdFNldCgpXG5cbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHRleHRLZXlzLnNlbGZIb3N0LnRpdGxlUm93MSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHRleHRLZXlzLnNlbGZIb3N0LnRpdGxlUm93MikpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHNldCBBUEkgYnV0dG9uIHRleHQnLCAoKSA9PiB7XG4gICAgICBzY2VuYXJpb3Mud2l0aEFQSUtleU5vdFNldCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCh0ZXh0S2V5cy5zZWxmSG9zdC5zZXRBUElCdG4pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIGV4dGVybmFsIGxpbmsgd2l0aCBjb3JyZWN0IGhyZWYgZm9yIHNlbGYtaG9zdCB2ZXJzaW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHNjZW5hcmlvcy53aXRoQVBJS2V5Tm90U2V0KClcbiAgICAgIGNvbnN0IGxpbmsgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignYVtocmVmPVwiaHR0cHM6Ly9jbG91ZC5kaWZ5LmFpL2FwcHNcIl0nKVxuXG4gICAgICBleHBlY3QobGluaykudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGxpbmspLnRvSGF2ZUF0dHJpYnV0ZSgndGFyZ2V0JywgJ19ibGFuaycpXG4gICAgICBleHBlY3QobGluaykudG9IYXZlQXR0cmlidXRlKCdyZWwnLCAnbm9vcGVuZXIgbm9yZWZlcnJlcicpXG4gICAgICBleHBlY3QobGluaykudG9IYXZlVGV4dENvbnRlbnQodGV4dEtleXMuc2VsZkhvc3QudHJ5Q2xvdWQpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBleHRlcm5hbCBsaW5rIHdpdGggcHJvcGVyIHN0eWxpbmcgZm9yIHNlbGYtaG9zdCB2ZXJzaW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHNjZW5hcmlvcy53aXRoQVBJS2V5Tm90U2V0KClcbiAgICAgIGNvbnN0IGxpbmsgPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignYVtocmVmPVwiaHR0cHM6Ly9jbG91ZC5kaWZ5LmFpL2FwcHNcIl0nKVxuXG4gICAgICBleHBlY3QobGluaykudG9IYXZlQ2xhc3MoXG4gICAgICAgICdtdC0yJyxcbiAgICAgICAgJ2ZsZXgnLFxuICAgICAgICAnaC1bMjZweF0nLFxuICAgICAgICAnaXRlbXMtY2VudGVyJyxcbiAgICAgICAgJ3NwYWNlLXgtMScsXG4gICAgICAgICdwLTEnLFxuICAgICAgICAndGV4dC14cycsXG4gICAgICAgICdmb250LW1lZGl1bScsXG4gICAgICAgICd0ZXh0LVsjMTU1RUVGXScsXG4gICAgICApXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldFNob3dBY2NvdW50U2V0dGluZ01vZGFsIHdoZW4gc2V0IEFQSSBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIHNjZW5hcmlvcy53aXRoTW9ja01vZGFsKG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbClcblxuICAgICAgaW50ZXJhY3Rpb25zLmNsaWNrTWFpbkJ1dHRvbigpXG5cbiAgICAgIGV4cGVjdChtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgcGF5bG9hZDogQUNDT1VOVF9TRVRUSU5HX1RBQi5QUk9WSURFUixcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSBwYW5lbCB3aGVuIGNsb3NlIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHNjZW5hcmlvcy53aXRoQVBJS2V5Tm90U2V0KClcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBpbnRlcmFjdGlvbnMuY2xpY2tDbG9zZUJ1dHRvbihjb250YWluZXIpXG4gICAgICBhc3NlcnRpb25zLnNob3VsZE5vdFJlbmRlcihjb250YWluZXIpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUHJvcHMgYW5kIFN0eWxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYnV0dG9uIHdpdGggcHJpbWFyeSB2YXJpYW50JywgKCkgPT4ge1xuICAgICAgc2NlbmFyaW9zLndpdGhBUElLZXlOb3RTZXQoKVxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCdidG4tcHJpbWFyeScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBhbmVsIGNvbnRhaW5lciB3aXRoIGNvcnJlY3QgY2xhc3NlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSBzY2VuYXJpb3Mud2l0aEFQSUtleU5vdFNldCgpXG4gICAgICBjb25zdCBwYW5lbCA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBhc3NlcnRpb25zLnNob3VsZEhhdmVQYW5lbFN0eWxpbmcocGFuZWwpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnU3RhdGUgTWFuYWdlbWVudCcsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHN0YXJ0IHdpdGggdmlzaWJsZSBwYW5lbCAoaXNTaG93OiB0cnVlKScsICgpID0+IHtcbiAgICAgIHNjZW5hcmlvcy53aXRoQVBJS2V5Tm90U2V0KClcbiAgICAgIGFzc2VydGlvbnMuc2hvdWxkUmVuZGVyTWFpbkJ1dHRvbigpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgdG9nZ2xlIHZpc2liaWxpdHkgd2hlbiBjbG9zZSBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSBzY2VuYXJpb3Mud2l0aEFQSUtleU5vdFNldCgpXG4gICAgICBleHBlY3QoY29udGFpbmVyLmZpcnN0Q2hpbGQpLnRvQmVJblRoZURvY3VtZW50KClcblxuICAgICAgaW50ZXJhY3Rpb25zLmNsaWNrQ2xvc2VCdXR0b24oY29udGFpbmVyKVxuICAgICAgYXNzZXJ0aW9ucy5zaG91bGROb3RSZW5kZXIoY29udGFpbmVyKVxuICAgIH0pXG4gIH0pXG5cbiAgZGVzY3JpYmUoJ0VkZ2UgQ2FzZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBoYW5kbGUgcHJvdmlkZXIgY29udGV4dCBsb2FkaW5nIHN0YXRlJywgKCkgPT4ge1xuICAgICAgc2NlbmFyaW9zLndpdGhBUElLZXlOb3RTZXQoe1xuICAgICAgICBwcm92aWRlckNvbnRleHQ6IHtcbiAgICAgICAgICBtb2RlbFByb3ZpZGVyczogW10sXG4gICAgICAgICAgdGV4dEdlbmVyYXRpb25Nb2RlbExpc3Q6IFtdLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICAgIGFzc2VydGlvbnMuc2hvdWxkUmVuZGVyTWFpbkJ1dHRvbigpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgYnV0dG9uIHdpdGggcHJvcGVyIHJvbGUnLCAoKSA9PiB7XG4gICAgICBzY2VuYXJpb3Mud2l0aEFQSUtleU5vdFNldCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNsaWNrYWJsZSBjbG9zZSBidXR0b24nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gc2NlbmFyaW9zLndpdGhBUElLZXlOb3RTZXQoKVxuICAgICAgYXNzZXJ0aW9ucy5zaG91bGRIYXZlQ2xvc2VCdXR0b24oY29udGFpbmVyKVxuICAgIH0pXG4gIH0pXG59KVxuIl19