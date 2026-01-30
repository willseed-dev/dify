"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const user_event_1 = require("@testing-library/user-event");
const React = require("react");
const toast_1 = require("@/app/components/base/toast");
const type_1 = require("@/app/components/billing/type");
const provider_context_1 = require("@/context/provider-context");
const index_1 = require("./index");
const appsFullRenderSpy = vi.fn();
vi.mock('@/app/components/billing/apps-full-in-dialog', () => ({
    default: ({ loc }) => {
        appsFullRenderSpy(loc);
        return <div data-testid="apps-full">AppsFull</div>;
    },
}));
const useProviderContextMock = vi.fn();
vi.mock('@/context/provider-context', async () => {
    const actual = await vi.importActual('@/context/provider-context');
    return {
        ...actual,
        useProviderContext: () => useProviderContextMock(),
    };
});
const renderComponent = (overrides = {}) => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const onHide = vi.fn();
    const props = {
        appName: 'My App',
        icon_type: 'emoji',
        icon: '🚀',
        icon_background: '#FFEAD5',
        icon_url: null,
        show: true,
        onConfirm,
        onHide,
        ...overrides,
    };
    const utils = (0, react_1.render)(<index_1.default {...props}/>);
    return {
        ...utils,
        onConfirm,
        onHide,
    };
};
const setupProviderContext = (overrides = {}) => {
    useProviderContextMock.mockReturnValue({
        ...provider_context_1.baseProviderContextValue,
        plan: {
            ...provider_context_1.baseProviderContextValue.plan,
            type: type_1.Plan.sandbox,
            usage: {
                ...provider_context_1.baseProviderContextValue.plan.usage,
                buildApps: 0,
            },
            total: {
                ...provider_context_1.baseProviderContextValue.plan.total,
                buildApps: 10,
            },
        },
        enableBilling: false,
        ...overrides,
    });
};
describe('DuplicateAppModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        setupProviderContext();
    });
    // Rendering output based on modal visibility.
    describe('Rendering', () => {
        it('should render modal content when show is true', () => {
            // Arrange
            renderComponent();
            // Assert
            expect(react_1.screen.getByText('app.duplicateTitle')).toBeInTheDocument();
            expect(react_1.screen.getByDisplayValue('My App')).toBeInTheDocument();
        });
        it('should not render modal content when show is false', () => {
            // Arrange
            renderComponent({ show: false });
            // Assert
            expect(react_1.screen.queryByText('app.duplicateTitle')).not.toBeInTheDocument();
        });
    });
    // Prop-driven states such as full plan handling.
    describe('Props', () => {
        it('should disable duplicate button and show apps full content when plan is full', () => {
            // Arrange
            setupProviderContext({
                enableBilling: true,
                plan: {
                    ...provider_context_1.baseProviderContextValue.plan,
                    type: type_1.Plan.sandbox,
                    usage: { ...provider_context_1.baseProviderContextValue.plan.usage, buildApps: 10 },
                    total: { ...provider_context_1.baseProviderContextValue.plan.total, buildApps: 10 },
                },
            });
            renderComponent();
            // Assert
            expect(react_1.screen.getByTestId('apps-full')).toBeInTheDocument();
            expect(react_1.screen.getByRole('button', { name: 'app.duplicate' })).toBeDisabled();
        });
    });
    // User interactions for cancel and confirm flows.
    describe('Interactions', () => {
        it('should call onHide when cancel is clicked', async () => {
            const user = user_event_1.default.setup();
            // Arrange
            const { onHide } = renderComponent();
            // Act
            await user.click(react_1.screen.getByRole('button', { name: 'common.operation.cancel' }));
            // Assert
            expect(onHide).toHaveBeenCalledTimes(1);
        });
        it('should show error toast when name is empty', async () => {
            const user = user_event_1.default.setup();
            const toastSpy = vi.spyOn(toast_1.default, 'notify');
            // Arrange
            const { onConfirm, onHide } = renderComponent();
            // Act
            await user.clear(react_1.screen.getByDisplayValue('My App'));
            await user.click(react_1.screen.getByRole('button', { name: 'app.duplicate' }));
            // Assert
            expect(toastSpy).toHaveBeenCalledWith({ type: 'error', message: 'explore.appCustomize.nameRequired' });
            expect(onConfirm).not.toHaveBeenCalled();
            expect(onHide).not.toHaveBeenCalled();
        });
        it('should submit app info and hide modal when duplicate is clicked', async () => {
            const user = user_event_1.default.setup();
            // Arrange
            const { onConfirm, onHide } = renderComponent();
            // Act
            await user.clear(react_1.screen.getByDisplayValue('My App'));
            await user.type(react_1.screen.getByRole('textbox'), 'New App');
            await user.click(react_1.screen.getByRole('button', { name: 'app.duplicate' }));
            // Assert
            expect(onConfirm).toHaveBeenCalledWith({
                name: 'New App',
                icon_type: 'emoji',
                icon: '🚀',
                icon_background: '#FFEAD5',
            });
            expect(onHide).toHaveBeenCalledTimes(1);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluZGV4LnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQXVEO0FBQ3ZELDREQUFtRDtBQUNuRCwrQkFBOEI7QUFDOUIsdURBQStDO0FBQy9DLHdEQUFvRDtBQUNwRCxpRUFBcUU7QUFDckUsbUNBQXVDO0FBRXZDLE1BQU0saUJBQWlCLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQ2pDLEVBQUUsQ0FBQyxJQUFJLENBQUMsOENBQThDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM3RCxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBbUIsRUFBRSxFQUFFO1FBQ3BDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDcEQsQ0FBQztDQUNGLENBQUMsQ0FBQyxDQUFBO0FBRUgsTUFBTSxzQkFBc0IsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUE4QixDQUFBO0FBQ2xFLEVBQUUsQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDL0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLDRCQUE0QixDQUFDLENBQUE7SUFDbEUsT0FBTztRQUNMLEdBQUcsTUFBTTtRQUNULGtCQUFrQixFQUFFLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixFQUFFO0tBQ25ELENBQUE7QUFDSCxDQUFDLENBQUMsQ0FBQTtBQUVGLE1BQU0sZUFBZSxHQUFHLENBQUMsWUFBcUUsRUFBRSxFQUFFLEVBQUU7SUFDbEcsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBQ3RELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxF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QUUsU0FBUztnQkFDZixTQUFTLEVBQUUsT0FBTztnQkFDbEIsSUFBSSxFQUFFLElBQUk7Z0JBQ1YsZUFBZSxFQUFFLFNBQVM7YUFDM0IsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3pDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUHJvdmlkZXJDb250ZXh0U3RhdGUgfSBmcm9tICdAL2NvbnRleHQvcHJvdmlkZXItY29udGV4dCdcbmltcG9ydCB7IHJlbmRlciwgc2NyZWVuIH0gZnJvbSAnQHRlc3RpbmctbGlicmFyeS9yZWFjdCdcbmltcG9ydCB1c2VyRXZlbnQgZnJvbSAnQHRlc3RpbmctbGlicmFyeS91c2VyLWV2ZW50J1xuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgVG9hc3QgZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0J1xuaW1wb3J0IHsgUGxhbiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmlsbGluZy90eXBlJ1xuaW1wb3J0IHsgYmFzZVByb3ZpZGVyQ29udGV4dFZhbHVlIH0gZnJvbSAnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnXG5pbXBvcnQgRHVwbGljYXRlQXBwTW9kYWwgZnJvbSAnLi9pbmRleCdcblxuY29uc3QgYXBwc0Z1bGxSZW5kZXJTcHkgPSB2aS5mbigpXG52aS5tb2NrKCdAL2FwcC9jb21wb25lbnRzL2JpbGxpbmcvYXBwcy1mdWxsLWluLWRpYWxvZycsICgpID0+ICh7XG4gIGRlZmF1bHQ6ICh7IGxvYyB9OiB7IGxvYzogc3RyaW5nIH0pID0+IHtcbiAgICBhcHBzRnVsbFJlbmRlclNweShsb2MpXG4gICAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9XCJhcHBzLWZ1bGxcIj5BcHBzRnVsbDwvZGl2PlxuICB9LFxufSkpXG5cbmNvbnN0IHVzZVByb3ZpZGVyQ29udGV4dE1vY2sgPSB2aS5mbjwoKSA9PiBQcm92aWRlckNvbnRleHRTdGF0ZT4oKVxudmkubW9jaygnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnLCBhc3luYyAoKSA9PiB7XG4gIGNvbnN0IGFjdHVhbCA9IGF3YWl0IHZpLmltcG9ydEFjdHVhbCgnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnKVxuICByZXR1cm4ge1xuICAgIC4uLmFjdHVhbCxcbiAgICB1c2VQcm92aWRlckNvbnRleHQ6ICgpID0+IHVzZVByb3ZpZGVyQ29udGV4dE1vY2soKSxcbiAgfVxufSlcblxuY29uc3QgcmVuZGVyQ29tcG9uZW50ID0gKG92ZXJyaWRlczogUGFydGlhbDxSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgRHVwbGljYXRlQXBwTW9kYWw+PiA9IHt9KSA9PiB7XG4gIGNvbnN0IG9uQ29uZmlybSA9IHZpLmZuKCkubW9ja1Jlc29sdmVkVmFsdWUodW5kZWZpbmVkKVxuICBjb25zdCBvbkhpZGUgPSB2aS5mbigpXG4gIGNvbnN0IHByb3BzOiBSZWFjdC5Db21wb25lbnRQcm9wczx0eXBlb2YgRHVwbGljYXRlQXBwTW9kYWw+ID0ge1xuICAgIGFwcE5hbWU6ICdNeSBBcHAnLFxuICAgIGljb25fdHlwZTogJ2Vtb2ppJyxcbiAgICBpY29uOiAn8J+agCcsXG4gICAgaWNvbl9iYWNrZ3JvdW5kOiAnI0ZGRUFENScsXG4gICAgaWNvbl91cmw6IG51bGwsXG4gICAgc2hvdzogdHJ1ZSxcbiAgICBvbkNvbmZpcm0sXG4gICAgb25IaWRlLFxuICAgIC4uLm92ZXJyaWRlcyxcbiAgfVxuICBjb25zdCB1dGlscyA9IHJlbmRlcig8RHVwbGljYXRlQXBwTW9kYWwgey4uLnByb3BzfSAvPilcbiAgcmV0dXJuIHtcbiAgICAuLi51dGlscyxcbiAgICBvbkNvbmZpcm0sXG4gICAgb25IaWRlLFxuICB9XG59XG5cbmNvbnN0IHNldHVwUHJvdmlkZXJDb250ZXh0ID0gKG92ZXJyaWRlczogUGFydGlhbDxQcm92aWRlckNvbnRleHRTdGF0ZT4gPSB7fSkgPT4ge1xuICB1c2VQcm92aWRlckNvbnRleHRNb2NrLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgLi4uYmFzZVByb3ZpZGVyQ29udGV4dFZhbHVlLFxuICAgIHBsYW46IHtcbiAgICAgIC4uLmJhc2VQcm92aWRlckNvbnRleHRWYWx1ZS5wbGFuLFxuICAgICAgdHlwZTogUGxhbi5zYW5kYm94LFxuICAgICAgdXNhZ2U6IHtcbiAgICAgICAgLi4uYmFzZVByb3ZpZGVyQ29udGV4dFZhbHVlLnBsYW4udXNhZ2UsXG4gICAgICAgIGJ1aWxkQXBwczogMCxcbiAgICAgIH0sXG4gICAgICB0b3RhbDoge1xuICAgICAgICAuLi5iYXNlUHJvdmlkZXJDb250ZXh0VmFsdWUucGxhbi50b3RhbCxcbiAgICAgICAgYnVpbGRBcHBzOiAxMCxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBlbmFibGVCaWxsaW5nOiBmYWxzZSxcbiAgICAuLi5vdmVycmlkZXMsXG4gIH0gYXMgUHJvdmlkZXJDb250ZXh0U3RhdGUpXG59XG5cbmRlc2NyaWJlKCdEdXBsaWNhdGVBcHBNb2RhbCcsICgpID0+IHtcbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgdmkuY2xlYXJBbGxNb2NrcygpXG4gICAgc2V0dXBQcm92aWRlckNvbnRleHQoKVxuICB9KVxuXG4gIC8vIFJlbmRlcmluZyBvdXRwdXQgYmFzZWQgb24gbW9kYWwgdmlzaWJpbGl0eS5cbiAgZGVzY3JpYmUoJ1JlbmRlcmluZycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJlbmRlciBtb2RhbCBjb250ZW50IHdoZW4gc2hvdyBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgLy8gQXJyYW5nZVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnYXBwLmR1cGxpY2F0ZVRpdGxlJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlEaXNwbGF5VmFsdWUoJ015IEFwcCcpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcblxuICAgIGl0KCdzaG91bGQgbm90IHJlbmRlciBtb2RhbCBjb250ZW50IHdoZW4gc2hvdyBpcyBmYWxzZScsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHJlbmRlckNvbXBvbmVudCh7IHNob3c6IGZhbHNlIH0pXG5cbiAgICAgIC8vIEFzc2VydFxuICAgICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgnYXBwLmR1cGxpY2F0ZVRpdGxlJykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgfSlcbiAgfSlcblxuICAvLyBQcm9wLWRyaXZlbiBzdGF0ZXMgc3VjaCBhcyBmdWxsIHBsYW4gaGFuZGxpbmcuXG4gIGRlc2NyaWJlKCdQcm9wcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGRpc2FibGUgZHVwbGljYXRlIGJ1dHRvbiBhbmQgc2hvdyBhcHBzIGZ1bGwgY29udGVudCB3aGVuIHBsYW4gaXMgZnVsbCcsICgpID0+IHtcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIHNldHVwUHJvdmlkZXJDb250ZXh0KHtcbiAgICAgICAgZW5hYmxlQmlsbGluZzogdHJ1ZSxcbiAgICAgICAgcGxhbjoge1xuICAgICAgICAgIC4uLmJhc2VQcm92aWRlckNvbnRleHRWYWx1ZS5wbGFuLFxuICAgICAgICAgIHR5cGU6IFBsYW4uc2FuZGJveCxcbiAgICAgICAgICB1c2FnZTogeyAuLi5iYXNlUHJvdmlkZXJDb250ZXh0VmFsdWUucGxhbi51c2FnZSwgYnVpbGRBcHBzOiAxMCB9LFxuICAgICAgICAgIHRvdGFsOiB7IC4uLmJhc2VQcm92aWRlckNvbnRleHRWYWx1ZS5wbGFuLnRvdGFsLCBidWlsZEFwcHM6IDEwIH0sXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgICAgcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGVzdElkKCdhcHBzLWZ1bGwnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgICAgZXhwZWN0KHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2FwcC5kdXBsaWNhdGUnIH0pKS50b0JlRGlzYWJsZWQoKVxuICAgIH0pXG4gIH0pXG5cbiAgLy8gVXNlciBpbnRlcmFjdGlvbnMgZm9yIGNhbmNlbCBhbmQgY29uZmlybSBmbG93cy5cbiAgZGVzY3JpYmUoJ0ludGVyYWN0aW9ucycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGwgb25IaWRlIHdoZW4gY2FuY2VsIGlzIGNsaWNrZWQnLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyID0gdXNlckV2ZW50LnNldHVwKClcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgb25IaWRlIH0gPSByZW5kZXJDb21wb25lbnQoKVxuXG4gICAgICAvLyBBY3RcbiAgICAgIGF3YWl0IHVzZXIuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnY29tbW9uLm9wZXJhdGlvbi5jYW5jZWwnIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkhpZGUpLnRvSGF2ZUJlZW5DYWxsZWRUaW1lcygxKVxuICAgIH0pXG5cbiAgICBpdCgnc2hvdWxkIHNob3cgZXJyb3IgdG9hc3Qgd2hlbiBuYW1lIGlzIGVtcHR5JywgYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IHVzZXJFdmVudC5zZXR1cCgpXG4gICAgICBjb25zdCB0b2FzdFNweSA9IHZpLnNweU9uKFRvYXN0LCAnbm90aWZ5JylcbiAgICAgIC8vIEFycmFuZ2VcbiAgICAgIGNvbnN0IHsgb25Db25maXJtLCBvbkhpZGUgfSA9IHJlbmRlckNvbXBvbmVudCgpXG5cbiAgICAgIC8vIEFjdFxuICAgICAgYXdhaXQgdXNlci5jbGVhcihzY3JlZW4uZ2V0QnlEaXNwbGF5VmFsdWUoJ015IEFwcCcpKVxuICAgICAgYXdhaXQgdXNlci5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdhcHAuZHVwbGljYXRlJyB9KSlcblxuICAgICAgLy8gQXNzZXJ0XG4gICAgICBleHBlY3QodG9hc3RTcHkpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogJ2V4cGxvcmUuYXBwQ3VzdG9taXplLm5hbWVSZXF1aXJlZCcgfSlcbiAgICAgIGV4cGVjdChvbkNvbmZpcm0pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChvbkhpZGUpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICB9KVxuXG4gICAgaXQoJ3Nob3VsZCBzdWJtaXQgYXBwIGluZm8gYW5kIGhpZGUgbW9kYWwgd2hlbiBkdXBsaWNhdGUgaXMgY2xpY2tlZCcsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IHVzZXIgPSB1c2VyRXZlbnQuc2V0dXAoKVxuICAgICAgLy8gQXJyYW5nZVxuICAgICAgY29uc3QgeyBvbkNvbmZpcm0sIG9uSGlkZSB9ID0gcmVuZGVyQ29tcG9uZW50KClcblxuICAgICAgLy8gQWN0XG4gICAgICBhd2FpdCB1c2VyLmNsZWFyKHNjcmVlbi5nZXRCeURpc3BsYXlWYWx1ZSgnTXkgQXBwJykpXG4gICAgICBhd2FpdCB1c2VyLnR5cGUoc2NyZWVuLmdldEJ5Um9sZSgndGV4dGJveCcpLCAnTmV3IEFwcCcpXG4gICAgICBhd2FpdCB1c2VyLmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ2FwcC5kdXBsaWNhdGUnIH0pKVxuXG4gICAgICAvLyBBc3NlcnRcbiAgICAgIGV4cGVjdChvbkNvbmZpcm0pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHtcbiAgICAgICAgbmFtZTogJ05ldyBBcHAnLFxuICAgICAgICBpY29uX3R5cGU6ICdlbW9qaScsXG4gICAgICAgIGljb246ICfwn5qAJyxcbiAgICAgICAgaWNvbl9iYWNrZ3JvdW5kOiAnI0ZGRUFENScsXG4gICAgICB9KVxuICAgICAgZXhwZWN0KG9uSGlkZSkudG9IYXZlQmVlbkNhbGxlZFRpbWVzKDEpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=