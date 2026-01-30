"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("@/app/components/workflow/block-selector/types");
const selector_view_1 = require("./selector-view");
let mockSubscriptions = [];
const mockRefetch = vitest_1.vi.fn();
const mockDelete = vitest_1.vi.fn((_, options) => {
    options?.onSuccess?.();
});
vitest_1.vi.mock('./use-subscription-list', () => ({
    useSubscriptionList: () => ({ subscriptions: mockSubscriptions, refetch: mockRefetch }),
}));
vitest_1.vi.mock('../../store', () => ({
    usePluginStore: () => ({ detail: undefined }),
}));
vitest_1.vi.mock('@/service/use-triggers', () => ({
    useTriggerProviderInfo: () => ({ data: { supported_creation_methods: [] } }),
    useTriggerOAuthConfig: () => ({ data: undefined, refetch: vitest_1.vi.fn() }),
    useInitiateTriggerOAuth: () => ({ mutate: vitest_1.vi.fn() }),
    useDeleteTriggerSubscription: () => ({ mutate: mockDelete, isPending: false }),
}));
vitest_1.vi.mock('@/app/components/base/toast', () => ({
    default: {
        notify: vitest_1.vi.fn(),
    },
}));
const createSubscription = (overrides = {}) => ({
    id: 'sub-1',
    name: 'Subscription One',
    provider: 'provider-1',
    credential_type: types_1.TriggerCredentialTypeEnum.ApiKey,
    credentials: {},
    endpoint: 'https://example.com',
    parameters: {},
    properties: {},
    workflows_in_use: 0,
    ...overrides,
});
(0, vitest_1.beforeEach)(() => {
    vitest_1.vi.clearAllMocks();
    mockSubscriptions = [createSubscription()];
});
(0, vitest_1.describe)('SubscriptionSelectorView', () => {
    (0, vitest_1.it)('should render subscription list when data exists', () => {
        (0, react_1.render)(<selector_view_1.SubscriptionSelectorView />);
        (0, vitest_1.expect)(react_1.screen.getByText(/pluginTrigger\.subscription\.listNum/)).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('Subscription One')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should call onSelect when a subscription is clicked', () => {
        const onSelect = vitest_1.vi.fn();
        (0, react_1.render)(<selector_view_1.SubscriptionSelectorView onSelect={onSelect}/>);
        react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Subscription One' }));
        (0, vitest_1.expect)(onSelect).toHaveBeenCalledWith(vitest_1.expect.objectContaining({ id: 'sub-1', name: 'Subscription One' }));
    });
    (0, vitest_1.it)('should handle missing onSelect without crashing', () => {
        (0, react_1.render)(<selector_view_1.SubscriptionSelectorView />);
        (0, vitest_1.expect)(() => {
            react_1.fireEvent.click(react_1.screen.getByRole('button', { name: 'Subscription One' }));
        }).not.toThrow();
    });
    (0, vitest_1.it)('should highlight selected subscription row when selectedId matches', () => {
        (0, react_1.render)(<selector_view_1.SubscriptionSelectorView selectedId="sub-1"/>);
        const selectedRow = react_1.screen.getByRole('button', { name: 'Subscription One' }).closest('div');
        (0, vitest_1.expect)(selectedRow).toHaveClass('bg-state-base-hover');
    });
    (0, vitest_1.it)('should not highlight row when selectedId does not match', () => {
        (0, react_1.render)(<selector_view_1.SubscriptionSelectorView selectedId="other-id"/>);
        const row = react_1.screen.getByRole('button', { name: 'Subscription One' }).closest('div');
        (0, vitest_1.expect)(row).not.toHaveClass('bg-state-base-hover');
    });
    (0, vitest_1.it)('should omit header when there are no subscriptions', () => {
        mockSubscriptions = [];
        (0, react_1.render)(<selector_view_1.SubscriptionSelectorView />);
        (0, vitest_1.expect)(react_1.screen.queryByText(/pluginTrigger\.subscription\.listNum/)).not.toBeInTheDocument();
    });
    (0, vitest_1.it)('should show delete confirm when delete action is clicked', () => {
        const { container } = (0, react_1.render)(<selector_view_1.SubscriptionSelectorView />);
        const deleteButton = container.querySelector('.subscription-delete-btn');
        (0, vitest_1.expect)(deleteButton).toBeTruthy();
        if (deleteButton)
            react_1.fireEvent.click(deleteButton);
        (0, vitest_1.expect)(react_1.screen.getByText(/pluginTrigger\.subscription\.list\.item\.actions\.deleteConfirm\.title/)).toBeInTheDocument();
    });
    (0, vitest_1.it)('should request selection reset after confirming delete', () => {
        const onSelect = vitest_1.vi.fn();
        const { container } = (0, react_1.render)(<selector_view_1.SubscriptionSelectorView onSelect={onSelect}/>);
        const deleteButton = container.querySelector('.subscription-delete-btn');
        if (deleteButton)
            react_1.fireEvent.click(deleteButton);
        react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /pluginTrigger\.subscription\.list\.item\.actions\.deleteConfirm\.confirm/ }));
        (0, vitest_1.expect)(mockDelete).toHaveBeenCalledWith('sub-1', vitest_1.expect.any(Object));
        (0, vitest_1.expect)(onSelect).toHaveBeenCalledWith({ id: '', name: '' });
    });
    (0, vitest_1.it)('should close delete confirm without selection reset on cancel', () => {
        const onSelect = vitest_1.vi.fn();
        const { container } = (0, react_1.render)(<selector_view_1.SubscriptionSelectorView onSelect={onSelect}/>);
        const deleteButton = container.querySelector('.subscription-delete-btn');
        if (deleteButton)
            react_1.fireEvent.click(deleteButton);
        react_1.fireEvent.click(react_1.screen.getByRole('button', { name: /common\.operation\.cancel/ }));
        (0, vitest_1.expect)(onSelect).not.toHaveBeenCalled();
        (0, vitest_1.expect)(react_1.screen.queryByText(/pluginTrigger\.subscription\.list\.item\.actions\.deleteConfirm\.title/)).not.toBeInTheDocument();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0b3Itdmlldy5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VsZWN0b3Itdmlldy5zcGVjLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtEQUFrRTtBQUNsRSxtQ0FBNkQ7QUFDN0QsMEVBQTBGO0FBQzFGLG1EQUEwRDtBQUUxRCxJQUFJLGlCQUFpQixHQUEwQixFQUFFLENBQUE7QUFDakQsTUFBTSxXQUFXLEdBQUcsV0FBRSxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzNCLE1BQU0sVUFBVSxHQUFHLFdBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFTLEVBQUUsT0FBb0MsRUFBRSxFQUFFO0lBQzNFLE9BQU8sRUFBRSxTQUFTLEVBQUUsRUFBRSxDQUFBO0FBQ3hCLENBQUMsQ0FBQyxDQUFBO0FBRUYsV0FBRSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLG1CQUFtQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxDQUFDO0NBQ3hGLENBQUMsQ0FBQyxDQUFBO0FBRUgsV0FBRSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUM1QixjQUFjLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQztDQUM5QyxDQUFDLENBQUMsQ0FBQTtBQUVILFdBQUUsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN2QyxzQkFBc0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsMEJBQTBCLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUM1RSxxQkFBcUIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFB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LEVBQUMsUUFBUSxDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFBO0lBQzdELENBQUMsQ0FBQyxDQUFBO0lBRUYsSUFBQSxXQUFFLEVBQUMsK0RBQStELEVBQUUsR0FBRyxFQUFFO1FBQ3ZFLE1BQU0sUUFBUSxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtRQUN4QixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBQSxjQUFNLEVBQUMsQ0FBQyx3Q0FBd0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRyxDQUFDLENBQUE7UUFFOUUsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO1FBQ3hFLElBQUksWUFBWTtZQUNkLGlCQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFBO1FBRS9CLGlCQUFTLENBQUMsS0FBSyxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLEVBQUUsSUFBSSxFQUFFLDJCQUEyQixFQUFFLENBQUMsQ0FBQyxDQUFBO1FBRWxGLElBQUEsZUFBTSxFQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFBO1FBQ3ZDLElBQUEsZUFBTSxFQUFDLGNBQU0sQ0FBQyxXQUFXLENBQUMsd0VBQXdFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQzlILENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFRyaWdnZXJTdWJzY3JpcHRpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2Jsb2NrLXNlbGVjdG9yL3R5cGVzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBUcmlnZ2VyQ3JlZGVudGlhbFR5cGVFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1zZWxlY3Rvci90eXBlcydcbmltcG9ydCB7IFN1YnNjcmlwdGlvblNlbGVjdG9yVmlldyB9IGZyb20gJy4vc2VsZWN0b3ItdmlldydcblxubGV0IG1vY2tTdWJzY3JpcHRpb25zOiBUcmlnZ2VyU3Vic2NyaXB0aW9uW10gPSBbXVxuY29uc3QgbW9ja1JlZmV0Y2ggPSB2aS5mbigpXG5jb25zdCBtb2NrRGVsZXRlID0gdmkuZm4oKF86IHN0cmluZywgb3B0aW9ucz86IHsgb25TdWNjZXNzPzogKCkgPT4gdm9pZCB9KSA9PiB7XG4gIG9wdGlvbnM/Lm9uU3VjY2Vzcz8uKClcbn0pXG5cbnZpLm1vY2soJy4vdXNlLXN1YnNjcmlwdGlvbi1saXN0JywgKCkgPT4gKHtcbiAgdXNlU3Vic2NyaXB0aW9uTGlzdDogKCkgPT4gKHsgc3Vic2NyaXB0aW9uczogbW9ja1N1YnNjcmlwdGlvbnMsIHJlZmV0Y2g6IG1vY2tSZWZldGNoIH0pLFxufSkpXG5cbnZpLm1vY2soJy4uLy4uL3N0b3JlJywgKCkgPT4gKHtcbiAgdXNlUGx1Z2luU3RvcmU6ICgpID0+ICh7IGRldGFpbDogdW5kZWZpbmVkIH0pLFxufSkpXG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtdHJpZ2dlcnMnLCAoKSA9PiAoe1xuICB1c2VUcmlnZ2VyUHJvdmlkZXJJbmZvOiAoKSA9PiAoeyBkYXRhOiB7IHN1cHBvcnRlZF9jcmVhdGlvbl9tZXRob2RzOiBbXSB9IH0pLFxuICB1c2VUcmlnZ2VyT0F1dGhDb25maWc6ICgpID0+ICh7IGRhdGE6IHVuZGVmaW5lZCwgcmVmZXRjaDogdmkuZm4oKSB9KSxcbiAgdXNlSW5pdGlhdGVUcmlnZ2VyT0F1dGg6ICgpID0+ICh7IG11dGF0ZTogdmkuZm4oKSB9KSxcbiAgdXNlRGVsZXRlVHJpZ2dlclN1YnNjcmlwdGlvbjogKCkgPT4gKHsgbXV0YXRlOiBtb2NrRGVsZXRlLCBpc1BlbmRpbmc6IGZhbHNlIH0pLFxufSkpXG5cbnZpLm1vY2soJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCcsICgpID0+ICh7XG4gIGRlZmF1bHQ6IHtcbiAgICBub3RpZnk6IHZpLmZuKCksXG4gIH0sXG59KSlcblxuY29uc3QgY3JlYXRlU3Vic2NyaXB0aW9uID0gKG92ZXJyaWRlczogUGFydGlhbDxUcmlnZ2VyU3Vic2NyaXB0aW9uPiA9IHt9KTogVHJpZ2dlclN1YnNjcmlwdGlvbiA9PiAoe1xuICBpZDogJ3N1Yi0xJyxcbiAgbmFtZTogJ1N1YnNjcmlwdGlvbiBPbmUnLFxuICBwcm92aWRlcjogJ3Byb3ZpZGVyLTEnLFxuICBjcmVkZW50aWFsX3R5cGU6IFRyaWdnZXJDcmVkZW50aWFsVHlwZUVudW0uQXBpS2V5LFxuICBjcmVkZW50aWFsczoge30sXG4gIGVuZHBvaW50OiAnaHR0cHM6Ly9leGFtcGxlLmNvbScsXG4gIHBhcmFtZXRlcnM6IHt9LFxuICBwcm9wZXJ0aWVzOiB7fSxcbiAgd29ya2Zsb3dzX2luX3VzZTogMCxcbiAgLi4ub3ZlcnJpZGVzLFxufSlcblxuYmVmb3JlRWFjaCgoKSA9PiB7XG4gIHZpLmNsZWFyQWxsTW9ja3MoKVxuICBtb2NrU3Vic2NyaXB0aW9ucyA9IFtjcmVhdGVTdWJzY3JpcHRpb24oKV1cbn0pXG5cbmRlc2NyaWJlKCdTdWJzY3JpcHRpb25TZWxlY3RvclZpZXcnLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgcmVuZGVyIHN1YnNjcmlwdGlvbiBsaXN0IHdoZW4gZGF0YSBleGlzdHMnLCAoKSA9PiB7XG4gICAgcmVuZGVyKDxTdWJzY3JpcHRpb25TZWxlY3RvclZpZXcgLz4pXG5cbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcGx1Z2luVHJpZ2dlclxcLnN1YnNjcmlwdGlvblxcLmxpc3ROdW0vKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KCdTdWJzY3JpcHRpb24gT25lJykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIGNhbGwgb25TZWxlY3Qgd2hlbiBhIHN1YnNjcmlwdGlvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgIGNvbnN0IG9uU2VsZWN0ID0gdmkuZm4oKVxuXG4gICAgcmVuZGVyKDxTdWJzY3JpcHRpb25TZWxlY3RvclZpZXcgb25TZWxlY3Q9e29uU2VsZWN0fSAvPilcblxuICAgIGZpcmVFdmVudC5jbGljayhzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdTdWJzY3JpcHRpb24gT25lJyB9KSlcblxuICAgIGV4cGVjdChvblNlbGVjdCkudG9IYXZlQmVlbkNhbGxlZFdpdGgoZXhwZWN0Lm9iamVjdENvbnRhaW5pbmcoeyBpZDogJ3N1Yi0xJywgbmFtZTogJ1N1YnNjcmlwdGlvbiBPbmUnIH0pKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGFuZGxlIG1pc3Npbmcgb25TZWxlY3Qgd2l0aG91dCBjcmFzaGluZycsICgpID0+IHtcbiAgICByZW5kZXIoPFN1YnNjcmlwdGlvblNlbGVjdG9yVmlldyAvPilcblxuICAgIGV4cGVjdCgoKSA9PiB7XG4gICAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAnU3Vic2NyaXB0aW9uIE9uZScgfSkpXG4gICAgfSkubm90LnRvVGhyb3coKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgaGlnaGxpZ2h0IHNlbGVjdGVkIHN1YnNjcmlwdGlvbiByb3cgd2hlbiBzZWxlY3RlZElkIG1hdGNoZXMnLCAoKSA9PiB7XG4gICAgcmVuZGVyKDxTdWJzY3JpcHRpb25TZWxlY3RvclZpZXcgc2VsZWN0ZWRJZD1cInN1Yi0xXCIgLz4pXG5cbiAgICBjb25zdCBzZWxlY3RlZFJvdyA9IHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogJ1N1YnNjcmlwdGlvbiBPbmUnIH0pLmNsb3Nlc3QoJ2RpdicpXG4gICAgZXhwZWN0KHNlbGVjdGVkUm93KS50b0hhdmVDbGFzcygnYmctc3RhdGUtYmFzZS1ob3ZlcicpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBub3QgaGlnaGxpZ2h0IHJvdyB3aGVuIHNlbGVjdGVkSWQgZG9lcyBub3QgbWF0Y2gnLCAoKSA9PiB7XG4gICAgcmVuZGVyKDxTdWJzY3JpcHRpb25TZWxlY3RvclZpZXcgc2VsZWN0ZWRJZD1cIm90aGVyLWlkXCIgLz4pXG5cbiAgICBjb25zdCByb3cgPSBzY3JlZW4uZ2V0QnlSb2xlKCdidXR0b24nLCB7IG5hbWU6ICdTdWJzY3JpcHRpb24gT25lJyB9KS5jbG9zZXN0KCdkaXYnKVxuICAgIGV4cGVjdChyb3cpLm5vdC50b0hhdmVDbGFzcygnYmctc3RhdGUtYmFzZS1ob3ZlcicpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBvbWl0IGhlYWRlciB3aGVuIHRoZXJlIGFyZSBubyBzdWJzY3JpcHRpb25zJywgKCkgPT4ge1xuICAgIG1vY2tTdWJzY3JpcHRpb25zID0gW11cblxuICAgIHJlbmRlcig8U3Vic2NyaXB0aW9uU2VsZWN0b3JWaWV3IC8+KVxuXG4gICAgZXhwZWN0KHNjcmVlbi5xdWVyeUJ5VGV4dCgvcGx1Z2luVHJpZ2dlclxcLnN1YnNjcmlwdGlvblxcLmxpc3ROdW0vKSkubm90LnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHNob3cgZGVsZXRlIGNvbmZpcm0gd2hlbiBkZWxldGUgYWN0aW9uIGlzIGNsaWNrZWQnLCAoKSA9PiB7XG4gICAgY29uc3QgeyBjb250YWluZXIgfSA9IHJlbmRlcig8U3Vic2NyaXB0aW9uU2VsZWN0b3JWaWV3IC8+KVxuXG4gICAgY29uc3QgZGVsZXRlQnV0dG9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zdWJzY3JpcHRpb24tZGVsZXRlLWJ0bicpXG4gICAgZXhwZWN0KGRlbGV0ZUJ1dHRvbikudG9CZVRydXRoeSgpXG5cbiAgICBpZiAoZGVsZXRlQnV0dG9uKVxuICAgICAgZmlyZUV2ZW50LmNsaWNrKGRlbGV0ZUJ1dHRvbilcblxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9wbHVnaW5UcmlnZ2VyXFwuc3Vic2NyaXB0aW9uXFwubGlzdFxcLml0ZW1cXC5hY3Rpb25zXFwuZGVsZXRlQ29uZmlybVxcLnRpdGxlLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlcXVlc3Qgc2VsZWN0aW9uIHJlc2V0IGFmdGVyIGNvbmZpcm1pbmcgZGVsZXRlJywgKCkgPT4ge1xuICAgIGNvbnN0IG9uU2VsZWN0ID0gdmkuZm4oKVxuICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFN1YnNjcmlwdGlvblNlbGVjdG9yVmlldyBvblNlbGVjdD17b25TZWxlY3R9IC8+KVxuXG4gICAgY29uc3QgZGVsZXRlQnV0dG9uID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5zdWJzY3JpcHRpb24tZGVsZXRlLWJ0bicpXG4gICAgaWYgKGRlbGV0ZUJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhkZWxldGVCdXR0b24pXG5cbiAgICBmaXJlRXZlbnQuY2xpY2soc2NyZWVuLmdldEJ5Um9sZSgnYnV0dG9uJywgeyBuYW1lOiAvcGx1Z2luVHJpZ2dlclxcLnN1YnNjcmlwdGlvblxcLmxpc3RcXC5pdGVtXFwuYWN0aW9uc1xcLmRlbGV0ZUNvbmZpcm1cXC5jb25maXJtLyB9KSlcblxuICAgIGV4cGVjdChtb2NrRGVsZXRlKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCgnc3ViLTEnLCBleHBlY3QuYW55KE9iamVjdCkpXG4gICAgZXhwZWN0KG9uU2VsZWN0KS50b0hhdmVCZWVuQ2FsbGVkV2l0aCh7IGlkOiAnJywgbmFtZTogJycgfSlcbiAgfSlcblxuICBpdCgnc2hvdWxkIGNsb3NlIGRlbGV0ZSBjb25maXJtIHdpdGhvdXQgc2VsZWN0aW9uIHJlc2V0IG9uIGNhbmNlbCcsICgpID0+IHtcbiAgICBjb25zdCBvblNlbGVjdCA9IHZpLmZuKClcbiAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxTdWJzY3JpcHRpb25TZWxlY3RvclZpZXcgb25TZWxlY3Q9e29uU2VsZWN0fSAvPilcblxuICAgIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc3Vic2NyaXB0aW9uLWRlbGV0ZS1idG4nKVxuICAgIGlmIChkZWxldGVCdXR0b24pXG4gICAgICBmaXJlRXZlbnQuY2xpY2soZGVsZXRlQnV0dG9uKVxuXG4gICAgZmlyZUV2ZW50LmNsaWNrKHNjcmVlbi5nZXRCeVJvbGUoJ2J1dHRvbicsIHsgbmFtZTogL2NvbW1vblxcLm9wZXJhdGlvblxcLmNhbmNlbC8gfSkpXG5cbiAgICBleHBlY3Qob25TZWxlY3QpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICBleHBlY3Qoc2NyZWVuLnF1ZXJ5QnlUZXh0KC9wbHVnaW5UcmlnZ2VyXFwuc3Vic2NyaXB0aW9uXFwubGlzdFxcLml0ZW1cXC5hY3Rpb25zXFwuZGVsZXRlQ29uZmlybVxcLnRpdGxlLykpLm5vdC50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG59KVxuIl19