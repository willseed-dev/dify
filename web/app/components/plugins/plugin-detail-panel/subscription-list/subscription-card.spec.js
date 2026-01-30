"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const types_1 = require("@/app/components/workflow/block-selector/types");
const subscription_card_1 = require("./subscription-card");
const mockRefetch = vitest_1.vi.fn();
vitest_1.vi.mock('./use-subscription-list', () => ({
    useSubscriptionList: () => ({ refetch: mockRefetch }),
}));
vitest_1.vi.mock('../../store', () => ({
    usePluginStore: () => ({
        detail: {
            id: 'detail-1',
            plugin_id: 'plugin-1',
            name: 'Plugin',
            plugin_unique_identifier: 'plugin-uid',
            provider: 'provider-1',
            declaration: { trigger: { subscription_constructor: { parameters: [], credentials_schema: [] } } },
        },
    }),
}));
vitest_1.vi.mock('@/service/use-triggers', () => ({
    useUpdateTriggerSubscription: () => ({ mutate: vitest_1.vi.fn(), isPending: false }),
    useVerifyTriggerSubscription: () => ({ mutate: vitest_1.vi.fn(), isPending: false }),
    useDeleteTriggerSubscription: () => ({ mutate: vitest_1.vi.fn(), isPending: false }),
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
});
(0, vitest_1.describe)('SubscriptionCard', () => {
    (0, vitest_1.it)('should render subscription name and endpoint', () => {
        (0, react_1.render)(<subscription_card_1.default data={createSubscription()}/>);
        (0, vitest_1.expect)(react_1.screen.getByText('Subscription One')).toBeInTheDocument();
        (0, vitest_1.expect)(react_1.screen.getByText('https://example.com')).toBeInTheDocument();
    });
    (0, vitest_1.it)('should render used-by text when workflows are present', () => {
        (0, react_1.render)(<subscription_card_1.default data={createSubscription({ workflows_in_use: 2 })}/>);
        (0, vitest_1.expect)(react_1.screen.getByText(/pluginTrigger\.subscription\.list\.item\.usedByNum/)).toBeInTheDocument();
    });
    (0, vitest_1.it)('should open delete confirmation when delete action is clicked', () => {
        const { container } = (0, react_1.render)(<subscription_card_1.default data={createSubscription()}/>);
        const deleteButton = container.querySelector('.subscription-delete-btn');
        (0, vitest_1.expect)(deleteButton).toBeTruthy();
        if (deleteButton)
            react_1.fireEvent.click(deleteButton);
        (0, vitest_1.expect)(react_1.screen.getByText(/pluginTrigger\.subscription\.list\.item\.actions\.deleteConfirm\.title/)).toBeInTheDocument();
    });
    (0, vitest_1.it)('should open edit modal when edit action is clicked', () => {
        const { container } = (0, react_1.render)(<subscription_card_1.default data={createSubscription()}/>);
        const actionButtons = container.querySelectorAll('button');
        const editButton = actionButtons[0];
        react_1.fireEvent.click(editButton);
        (0, vitest_1.expect)(react_1.screen.getByText(/pluginTrigger\.subscription\.list\.item\.actions\.edit\.title/)).toBeInTheDocument();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaXB0aW9uLWNhcmQuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN1YnNjcmlwdGlvbi1jYXJkLnNwZWMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0Esa0RBQWtFO0FBQ2xFLG1DQUE2RDtBQUM3RCwwRUFBMEY7QUFDMUYsMkRBQWtEO0FBRWxELE1BQU0sV0FBVyxHQUFHLFdBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtBQUUzQixXQUFFLENBQUMsSUFBSSxDQUFDLHlCQUF5QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDeEMsbUJBQW1CLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsQ0FBQztDQUN0RCxDQUFDLENBQUMsQ0FBQTtBQUVILFdBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDNUIsY0FBYyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDckIsTUFBTSxFQUFFO1lBQ04sRUFBRSxFQUFFLFVBQVU7WUFDZCxTQUFTLEVBQUUsVUFBVTtZQUNyQixJQUFJLEVBQUUsUUFBUTtZQUNkLHdCQUF3QixFQUFFLFlBQVk7WUFDdEMsUUFBUSxFQUFFLFlBQVk7WUFDdEIsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsd0JBQXdCLEVBQUUsRUFBRSxVQUFVLEVBQUUsRUFBRSxFQUFFLGtCQUFrQixFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7U0FDbkc7S0FDRixDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCxXQUFFLENBQUMsSUFBSSxDQUFDLHdCQUF3QixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDdkMsNEJBQTRCLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxDQUFDO0lBQzNFLDRCQUE0QixF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LE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFBLGNBQU0sRUFBQyxDQUFDLDJCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLGtCQUFrQixFQUFFLENBQUMsRUFBRyxDQUFDLENBQUE7UUFFOUUsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQzFELE1BQU0sVUFBVSxHQUFHLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUVuQyxpQkFBUyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtRQUUzQixJQUFBLGVBQU0sRUFBQyxjQUFNLENBQUMsU0FBUyxDQUFDLCtEQUErRCxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO0lBQy9HLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFRyaWdnZXJTdWJzY3JpcHRpb24gfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2Jsb2NrLXNlbGVjdG9yL3R5cGVzJ1xuaW1wb3J0IHsgZmlyZUV2ZW50LCByZW5kZXIsIHNjcmVlbiB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyBUcmlnZ2VyQ3JlZGVudGlhbFR5cGVFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ibG9jay1zZWxlY3Rvci90eXBlcydcbmltcG9ydCBTdWJzY3JpcHRpb25DYXJkIGZyb20gJy4vc3Vic2NyaXB0aW9uLWNhcmQnXG5cbmNvbnN0IG1vY2tSZWZldGNoID0gdmkuZm4oKVxuXG52aS5tb2NrKCcuL3VzZS1zdWJzY3JpcHRpb24tbGlzdCcsICgpID0+ICh7XG4gIHVzZVN1YnNjcmlwdGlvbkxpc3Q6ICgpID0+ICh7IHJlZmV0Y2g6IG1vY2tSZWZldGNoIH0pLFxufSkpXG5cbnZpLm1vY2soJy4uLy4uL3N0b3JlJywgKCkgPT4gKHtcbiAgdXNlUGx1Z2luU3RvcmU6ICgpID0+ICh7XG4gICAgZGV0YWlsOiB7XG4gICAgICBpZDogJ2RldGFpbC0xJyxcbiAgICAgIHBsdWdpbl9pZDogJ3BsdWdpbi0xJyxcbiAgICAgIG5hbWU6ICdQbHVnaW4nLFxuICAgICAgcGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyOiAncGx1Z2luLXVpZCcsXG4gICAgICBwcm92aWRlcjogJ3Byb3ZpZGVyLTEnLFxuICAgICAgZGVjbGFyYXRpb246IHsgdHJpZ2dlcjogeyBzdWJzY3JpcHRpb25fY29uc3RydWN0b3I6IHsgcGFyYW1ldGVyczogW10sIGNyZWRlbnRpYWxzX3NjaGVtYTogW10gfSB9IH0sXG4gICAgfSxcbiAgfSksXG59KSlcblxudmkubW9jaygnQC9zZXJ2aWNlL3VzZS10cmlnZ2VycycsICgpID0+ICh7XG4gIHVzZVVwZGF0ZVRyaWdnZXJTdWJzY3JpcHRpb246ICgpID0+ICh7IG11dGF0ZTogdmkuZm4oKSwgaXNQZW5kaW5nOiBmYWxzZSB9KSxcbiAgdXNlVmVyaWZ5VHJpZ2dlclN1YnNjcmlwdGlvbjogKCkgPT4gKHsgbXV0YXRlOiB2aS5mbigpLCBpc1BlbmRpbmc6IGZhbHNlIH0pLFxuICB1c2VEZWxldGVUcmlnZ2VyU3Vic2NyaXB0aW9uOiAoKSA9PiAoeyBtdXRhdGU6IHZpLmZuKCksIGlzUGVuZGluZzogZmFsc2UgfSksXG59KSlcblxudmkubW9jaygnQC9hcHAvY29tcG9uZW50cy9iYXNlL3RvYXN0JywgKCkgPT4gKHtcbiAgZGVmYXVsdDoge1xuICAgIG5vdGlmeTogdmkuZm4oKSxcbiAgfSxcbn0pKVxuXG5jb25zdCBjcmVhdGVTdWJzY3JpcHRpb24gPSAob3ZlcnJpZGVzOiBQYXJ0aWFsPFRyaWdnZXJTdWJzY3JpcHRpb24+ID0ge30pOiBUcmlnZ2VyU3Vic2NyaXB0aW9uID0+ICh7XG4gIGlkOiAnc3ViLTEnLFxuICBuYW1lOiAnU3Vic2NyaXB0aW9uIE9uZScsXG4gIHByb3ZpZGVyOiAncHJvdmlkZXItMScsXG4gIGNyZWRlbnRpYWxfdHlwZTogVHJpZ2dlckNyZWRlbnRpYWxUeXBlRW51bS5BcGlLZXksXG4gIGNyZWRlbnRpYWxzOiB7fSxcbiAgZW5kcG9pbnQ6ICdodHRwczovL2V4YW1wbGUuY29tJyxcbiAgcGFyYW1ldGVyczoge30sXG4gIHByb3BlcnRpZXM6IHt9LFxuICB3b3JrZmxvd3NfaW5fdXNlOiAwLFxuICAuLi5vdmVycmlkZXMsXG59KVxuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgdmkuY2xlYXJBbGxNb2NrcygpXG59KVxuXG5kZXNjcmliZSgnU3Vic2NyaXB0aW9uQ2FyZCcsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCByZW5kZXIgc3Vic2NyaXB0aW9uIG5hbWUgYW5kIGVuZHBvaW50JywgKCkgPT4ge1xuICAgIHJlbmRlcig8U3Vic2NyaXB0aW9uQ2FyZCBkYXRhPXtjcmVhdGVTdWJzY3JpcHRpb24oKX0gLz4pXG5cbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgnU3Vic2NyaXB0aW9uIE9uZScpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2h0dHBzOi8vZXhhbXBsZS5jb20nKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxuXG4gIGl0KCdzaG91bGQgcmVuZGVyIHVzZWQtYnkgdGV4dCB3aGVuIHdvcmtmbG93cyBhcmUgcHJlc2VudCcsICgpID0+IHtcbiAgICByZW5kZXIoPFN1YnNjcmlwdGlvbkNhcmQgZGF0YT17Y3JlYXRlU3Vic2NyaXB0aW9uKHsgd29ya2Zsb3dzX2luX3VzZTogMiB9KX0gLz4pXG5cbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcGx1Z2luVHJpZ2dlclxcLnN1YnNjcmlwdGlvblxcLmxpc3RcXC5pdGVtXFwudXNlZEJ5TnVtLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcblxuICBpdCgnc2hvdWxkIG9wZW4gZGVsZXRlIGNvbmZpcm1hdGlvbiB3aGVuIGRlbGV0ZSBhY3Rpb24gaXMgY2xpY2tlZCcsICgpID0+IHtcbiAgICBjb25zdCB7IGNvbnRhaW5lciB9ID0gcmVuZGVyKDxTdWJzY3JpcHRpb25DYXJkIGRhdGE9e2NyZWF0ZVN1YnNjcmlwdGlvbigpfSAvPilcblxuICAgIGNvbnN0IGRlbGV0ZUJ1dHRvbiA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuc3Vic2NyaXB0aW9uLWRlbGV0ZS1idG4nKVxuICAgIGV4cGVjdChkZWxldGVCdXR0b24pLnRvQmVUcnV0aHkoKVxuXG4gICAgaWYgKGRlbGV0ZUJ1dHRvbilcbiAgICAgIGZpcmVFdmVudC5jbGljayhkZWxldGVCdXR0b24pXG5cbiAgICBleHBlY3Qoc2NyZWVuLmdldEJ5VGV4dCgvcGx1Z2luVHJpZ2dlclxcLnN1YnNjcmlwdGlvblxcLmxpc3RcXC5pdGVtXFwuYWN0aW9uc1xcLmRlbGV0ZUNvbmZpcm1cXC50aXRsZS8pKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCBvcGVuIGVkaXQgbW9kYWwgd2hlbiBlZGl0IGFjdGlvbiBpcyBjbGlja2VkJywgKCkgPT4ge1xuICAgIGNvbnN0IHsgY29udGFpbmVyIH0gPSByZW5kZXIoPFN1YnNjcmlwdGlvbkNhcmQgZGF0YT17Y3JlYXRlU3Vic2NyaXB0aW9uKCl9IC8+KVxuXG4gICAgY29uc3QgYWN0aW9uQnV0dG9ucyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCdidXR0b24nKVxuICAgIGNvbnN0IGVkaXRCdXR0b24gPSBhY3Rpb25CdXR0b25zWzBdXG5cbiAgICBmaXJlRXZlbnQuY2xpY2soZWRpdEJ1dHRvbilcblxuICAgIGV4cGVjdChzY3JlZW4uZ2V0QnlUZXh0KC9wbHVnaW5UcmlnZ2VyXFwuc3Vic2NyaXB0aW9uXFwubGlzdFxcLml0ZW1cXC5hY3Rpb25zXFwuZWRpdFxcLnRpdGxlLykpLnRvQmVJblRoZURvY3VtZW50KClcbiAgfSlcbn0pXG4iXX0=