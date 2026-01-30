"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const constants_1 = require("@/app/components/header/account-setting/constants");
const apikey_info_panel_test_utils_1 = require("./apikey-info-panel.test-utils");
// Mock config for Cloud edition
vi.mock('@/config', () => ({
    IS_CE_EDITION: false, // Test Cloud edition
}));
afterEach(react_1.cleanup);
describe('APIKeyInfoPanel - Cloud Edition', () => {
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
    describe('Cloud Edition Content', () => {
        it('should display cloud version title', () => {
            apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            expect(react_1.screen.getByText(apikey_info_panel_test_utils_1.textKeys.cloud.trialTitle)).toBeInTheDocument();
        });
        it('should display emoji for cloud version', () => {
            const { container } = apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            expect(container.querySelector('em-emoji')).toBeInTheDocument();
            expect(container.querySelector('em-emoji')).toHaveAttribute('id', '😀');
        });
        it('should display cloud version description', () => {
            apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            expect(react_1.screen.getByText(apikey_info_panel_test_utils_1.textKeys.cloud.trialDescription)).toBeInTheDocument();
        });
        it('should not render external link for cloud version', () => {
            const { container } = apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            expect(container.querySelector('a[href="https://cloud.dify.ai/apps"]')).not.toBeInTheDocument();
        });
        it('should display set API button text', () => {
            apikey_info_panel_test_utils_1.scenarios.withAPIKeyNotSet();
            expect(react_1.screen.getByText(apikey_info_panel_test_utils_1.textKeys.cloud.setAPIBtn)).toBeInTheDocument();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWQuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsb3VkLnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0RBQXdEO0FBQ3hELGlGQUF1RjtBQUN2RixpRkFRdUM7QUFFdkMsZ0NBQWdDO0FBQ2hDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDekIsYUFBYSxFQUFFLEtBQUssRUFBRSxxQkFBcUI7Q0FDNUMsQ0FBQyxDQUFDLENBQUE7QUFFSCxTQUFTLENBQUMsZUFBTyxDQUFDLENBQUE7QUFFbEIsUUFBUSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtJQUMvQyxNQUFNLDhCQUE4QixHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUU5QyxVQUFVLENBQUMsR0FBRyxFQUFFO1FBQ2QsSUFBQSw0Q0FBYSxHQUFFLENBQUE7UUFDZixrREFBbUIsQ0FBQyxlQUFlLENBQUM7WUFDbEMsR0FBRyxrREFBbUI7WUFDdEIsMEJBQTBCLEVBQUUsOEJBQThCO1NBQzNELENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0lBRUYsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUU7UUFDekIsRUFBRSxDQUFDLHdEQUF3RCxFQUFFLEdBQUcsRUFBRTtZQUNoRSx3Q0FBUyxDQUFDLGdCQUFnQixFQUFFLENBQUE7WUFDNUIseUNBQVUsQ0FBQyxzQkFBc0IsRUFBRSxDQUFBO1FBQ3JDLENBQUMsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLCtDQUErQyxFQUFFLEdBQUcsRUFBRTtZQUN2RCxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsd0NBQVMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUMvQyx5Q0FBVSxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUN2QyxDQUFDLENBQUMsQ0FBQTtRQUVGLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRSxHQUFHLEVBQUU7WUFD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c291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY2xlYW51cCwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB7IEFDQ09VTlRfU0VUVElOR19UQUIgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2hlYWRlci9hY2NvdW50LXNldHRpbmcvY29uc3RhbnRzJ1xuaW1wb3J0IHtcbiAgYXNzZXJ0aW9ucyxcbiAgY2xlYXJBbGxNb2NrcyxcbiAgZGVmYXVsdE1vZGFsQ29udGV4dCxcbiAgaW50ZXJhY3Rpb25zLFxuICBtb2NrVXNlTW9kYWxDb250ZXh0LFxuICBzY2VuYXJpb3MsXG4gIHRleHRLZXlzLFxufSBmcm9tICcuL2FwaWtleS1pbmZvLXBhbmVsLnRlc3QtdXRpbHMnXG5cbi8vIE1vY2sgY29uZmlnIGZvciBDbG91ZCBlZGl0aW9uXG52aS5tb2NrKCdAL2NvbmZpZycsICgpID0+ICh7XG4gIElTX0NFX0VESVRJT046IGZhbHNlLCAvLyBUZXN0IENsb3VkIGVkaXRpb25cbn0pKVxuXG5hZnRlckVhY2goY2xlYW51cClcblxuZGVzY3JpYmUoJ0FQSUtleUluZm9QYW5lbCAtIENsb3VkIEVkaXRpb24nLCAoKSA9PiB7XG4gIGNvbnN0IG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCA9IHZpLmZuKClcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBjbGVhckFsbE1vY2tzKClcbiAgICBtb2NrVXNlTW9kYWxDb250ZXh0Lm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICAuLi5kZWZhdWx0TW9kYWxDb250ZXh0LFxuICAgICAgc2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWw6IG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbCxcbiAgICB9KVxuICB9KVxuXG4gIGRlc2NyaWJlKCdSZW5kZXJpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgd2l0aG91dCBjcmFzaGluZyB3aGVuIEFQSSBrZXkgaXMgbm90IHNldCcsICgpID0+IHtcbiAgICAgIHNjZW5hcmlvcy53aXRoQVBJS2V5Tm90U2V0KClcbiAgICAgIGFzc2VydGlvbnMuc2hvdWxkUmVuZGVyTWFpbkJ1dHRvbigpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciB3aGVuIEFQSSBrZXkgaXMgYWxyZWFkeSBzZXQnLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gc2NlbmFyaW9zLndpdGhBUElLZXlTZXQoKVxuICAgICAgYXNzZXJ0aW9ucy5zaG91bGROb3RSZW5kZXIoY29udGFpbmVyKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIG5vdCByZW5kZXIgd2hlbiBwYW5lbCBpcyBoaWRkZW4gYnkgdXNlcicsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSBzY2VuYXJpb3Mud2l0aEFQSUtleU5vdFNldCgpXG4gICAgICBpbnRlcmFjdGlvbnMuY2xpY2tDbG9zZUJ1dHRvbihjb250YWluZXIpXG4gICAgICBhc3NlcnRpb25zLnNob3VsZE5vdFJlbmRlcihjb250YWluZXIpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQ2xvdWQgRWRpdGlvbiBDb250ZW50JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgZGlzcGxheSBjbG91ZCB2ZXJzaW9uIHRpdGxlJywgKCkgPT4ge1xuICAgICAgc2NlbmFyaW9zLndpdGhBUElLZXlOb3RTZXQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQodGV4dEtleXMuY2xvdWQudHJpYWxUaXRsZSkpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IGVtb2ppIGZvciBjbG91ZCB2ZXJzaW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHNjZW5hcmlvcy53aXRoQVBJS2V5Tm90U2V0KClcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignZW0tZW1vamknKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdlbS1lbW9qaScpKS50b0hhdmVBdHRyaWJ1dGUoJ2lkJywgJ/CfmIAnKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIGRpc3BsYXkgY2xvdWQgdmVyc2lvbiBkZXNjcmlwdGlvbicsICgpID0+IHtcbiAgICAgIHNjZW5hcmlvcy53aXRoQVBJS2V5Tm90U2V0KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KHRleHRLZXlzLmNsb3VkLnRyaWFsRGVzY3JpcHRpb24pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBleHRlcm5hbCBsaW5rIGZvciBjbG91ZCB2ZXJzaW9uJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHNjZW5hcmlvcy53aXRoQVBJS2V5Tm90U2V0KClcbiAgICAgIGV4cGVjdChjb250YWluZXIucXVlcnlTZWxlY3RvcignYVtocmVmPVwiaHR0cHM6Ly9jbG91ZC5kaWZ5LmFpL2FwcHNcIl0nKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBkaXNwbGF5IHNldCBBUEkgYnV0dG9uIHRleHQnLCAoKSA9PiB7XG4gICAgICBzY2VuYXJpb3Mud2l0aEFQSUtleU5vdFNldCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCh0ZXh0S2V5cy5jbG91ZC5zZXRBUElCdG4pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnVXNlciBJbnRlcmFjdGlvbnMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxsIHNldFNob3dBY2NvdW50U2V0dGluZ01vZGFsIHdoZW4gc2V0IEFQSSBidXR0b24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICAgIHNjZW5hcmlvcy53aXRoTW9ja01vZGFsKG1vY2tTZXRTaG93QWNjb3VudFNldHRpbmdNb2RhbClcblxuICAgICAgaW50ZXJhY3Rpb25zLmNsaWNrTWFpbkJ1dHRvbigpXG5cbiAgICAgIGV4cGVjdChtb2NrU2V0U2hvd0FjY291bnRTZXR0aW5nTW9kYWwpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgcGF5bG9hZDogQUNDT1VOVF9TRVRUSU5HX1RBQi5QUk9WSURFUixcbiAgICAgIH0pXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgaGlkZSBwYW5lbCB3aGVuIGNsb3NlIGJ1dHRvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgICAgY29uc3QgeyBjb250YWluZXIgfSA9IHNjZW5hcmlvcy53aXRoQVBJS2V5Tm90U2V0KClcbiAgICAgIGV4cGVjdChjb250YWluZXIuZmlyc3RDaGlsZCkudG9CZUluVGhlRG9jdW1lbnQoKVxuXG4gICAgICBpbnRlcmFjdGlvbnMuY2xpY2tDbG9zZUJ1dHRvbihjb250YWluZXIpXG4gICAgICBhc3NlcnRpb25zLnNob3VsZE5vdFJlbmRlcihjb250YWluZXIpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnUHJvcHMgYW5kIFN0eWxpbmcnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZW5kZXIgYnV0dG9uIHdpdGggcHJpbWFyeSB2YXJpYW50JywgKCkgPT4ge1xuICAgICAgc2NlbmFyaW9zLndpdGhBUElLZXlOb3RTZXQoKVxuICAgICAgY29uc3QgYnV0dG9uID0gc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJylcbiAgICAgIGV4cGVjdChidXR0b24pLnRvSGF2ZUNsYXNzKCdidG4tcHJpbWFyeScpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgcmVuZGVyIHBhbmVsIGNvbnRhaW5lciB3aXRoIGNvcnJlY3QgY2xhc3NlcycsICgpID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSBzY2VuYXJpb3Mud2l0aEFQSUtleU5vdFNldCgpXG4gICAgICBjb25zdCBwYW5lbCA9IGNvbnRhaW5lci5maXJzdENoaWxkIGFzIEhUTUxFbGVtZW50XG4gICAgICBhc3NlcnRpb25zLnNob3VsZEhhdmVQYW5lbFN0eWxpbmcocGFuZWwpXG4gICAgfSlcbiAgfSlcblxuICBkZXNjcmliZSgnQWNjZXNzaWJpbGl0eScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgYnV0dG9uIHdpdGggcHJvcGVyIHJvbGUnLCAoKSA9PiB7XG4gICAgICBzY2VuYXJpb3Mud2l0aEFQSUtleU5vdFNldCgpXG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNsaWNrYWJsZSBjbG9zZSBidXR0b24nLCAoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gc2NlbmFyaW9zLndpdGhBUElLZXlOb3RTZXQoKVxuICAgICAgYXNzZXJ0aW9ucy5zaG91bGRIYXZlQ2xvc2VCdXR0b24oY29udGFpbmVyKVxuICAgIH0pXG4gIH0pXG59KVxuIl19