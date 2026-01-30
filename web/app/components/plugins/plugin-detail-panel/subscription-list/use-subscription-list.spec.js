"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const vitest_1 = require("vitest");
const use_subscription_list_1 = require("./use-subscription-list");
let mockDetail;
const mockRefetch = vitest_1.vi.fn();
const mockTriggerSubscriptions = vitest_1.vi.fn();
vitest_1.vi.mock('@/service/use-triggers', () => ({
    useTriggerSubscriptions: (...args) => mockTriggerSubscriptions(...args),
}));
vitest_1.vi.mock('../store', () => ({
    usePluginStore: (selector) => selector({ detail: mockDetail }),
}));
(0, vitest_1.beforeEach)(() => {
    vitest_1.vi.clearAllMocks();
    mockDetail = undefined;
    mockTriggerSubscriptions.mockReturnValue({
        data: [],
        isLoading: false,
        refetch: mockRefetch,
    });
});
(0, vitest_1.describe)('useSubscriptionList', () => {
    (0, vitest_1.it)('should request subscriptions with provider from store', () => {
        mockDetail = {
            id: 'detail-1',
            plugin_id: 'plugin-1',
            name: 'Plugin',
            plugin_unique_identifier: 'plugin-uid',
            provider: 'test-provider',
            declaration: {},
        };
        const { result } = (0, react_1.renderHook)(() => (0, use_subscription_list_1.useSubscriptionList)());
        (0, vitest_1.expect)(mockTriggerSubscriptions).toHaveBeenCalledWith('test-provider');
        (0, vitest_1.expect)(result.current.detail).toEqual(mockDetail);
    });
    (0, vitest_1.it)('should request subscriptions with empty provider when detail is missing', () => {
        const { result } = (0, react_1.renderHook)(() => (0, use_subscription_list_1.useSubscriptionList)());
        (0, vitest_1.expect)(mockTriggerSubscriptions).toHaveBeenCalledWith('');
        (0, vitest_1.expect)(result.current.detail).toBeUndefined();
    });
    (0, vitest_1.it)('should return data from trigger subscription hook', () => {
        mockTriggerSubscriptions.mockReturnValue({
            data: [{ id: 'sub-1' }],
            isLoading: true,
            refetch: mockRefetch,
        });
        const { result } = (0, react_1.renderHook)(() => (0, use_subscription_list_1.useSubscriptionList)());
        (0, vitest_1.expect)(result.current.subscriptions).toEqual([{ id: 'sub-1' }]);
        (0, vitest_1.expect)(result.current.isLoading).toBe(true);
        (0, vitest_1.expect)(result.current.refetch).toBe(mockRefetch);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXN1YnNjcmlwdGlvbi1saXN0LnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utc3Vic2NyaXB0aW9uLWxpc3Quc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtEQUFtRDtBQUNuRCxtQ0FBNkQ7QUFDN0QsbUVBQTZEO0FBRTdELElBQUksVUFBb0MsQ0FBQTtBQUN4QyxNQUFNLFdBQVcsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFFM0IsTUFBTSx3QkFBd0IsR0FBRyxXQUFFLENBQUMsRUFBRSxFQUFFLENBQUE7QUFFeEMsV0FBRSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLHVCQUF1QixFQUFFLENBQUMsR0FBRyxJQUFlLEVBQUUsRUFBRSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsSUFBSSxDQUFDO0NBQ25GLENBQUMsQ0FBQyxDQUFBO0FBRUgsV0FBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUN6QixjQUFjLEVBQUUsQ0FBQyxRQUFtRixFQUFFLEVBQUUsQ0FDdEcsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxDQUFDO0NBQ25DLENBQUMsQ0FBQyxDQUFBO0FBRUgsSUFBQSxtQkFBVSxFQUFDLEdBQUcsRUFBRTtJQUNkLFdBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUNsQixVQUFVLEdBQUcsU0FBUyxDQUFBO0lBQ3RCLHdCQUF3QixDQUFDLGVBQWUsQ0FBQztRQUN2QyxJQUFJLEVBQUUsRUFBRTtRQUNSLFNBQVMsRUFBRSxLQUFLO1FBQ2hCLE9BQU8sRUFBRSxXQUFXO0tBQ3JCLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBQSxpQkFBUSxFQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtJQUNuQyxJQUFBLFdBQUUsRUFBQyx1REFBdUQsRUFBRSxHQUFHLEVBQUU7UUFDL0QsVUFBVSxHQUFHO1lBQ1gsRUFBRSxFQUFFLFVBQVU7WUFDZCxTQUFTLEVBQUUsVUFBVTtZQUNyQixJQUFJLEVBQUUsUUFBUTtZQUNkLHdCQUF3QixFQUFFLFlBQVk7WUFDdEMsUUFBUSxFQUFFLGVBQWU7WUFDekIsV0FBVyxFQUFFLEVBQUU7U0FDaEIsQ0FBQTtRQUVELE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFBLGtCQUFVLEVBQUMsR0FBRyxFQUFFLENBQUMsSUFBQSwyQ0FBbUIsR0FBRSxDQUFDLENBQUE7UUFFMUQsSUFBQSxlQUFNLEVBQUMsd0JBQXdCLENBQUMsQ0FBQyxvQkFBb0IsQ0FBQyxlQUFlLENBQUMsQ0FBQTtRQUN0RSxJQUFBLGVBQU0sRUFBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNuRCxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLHlFQUF5RSxFQUFFLEdBQUcsRUFBRTtRQUNqRixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsMkNBQW1CLEdBQUUsQ0FBQyxDQUFBO1FBRTFELElBQUEsZUFBTSxFQUFDLHdCQUF3QixDQUFDLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDekQsSUFBQSxlQUFNLEVBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLEVBQUUsQ0FBQTtJQUMvQyxDQUFDLENBQUMsQ0FBQTtJQUVGLElBQUEsV0FBRSxFQUFDLG1EQUFtRCxFQUFFLEdBQUcsRUFBRTtRQUMzRCx3QkFBd0IsQ0FBQyxlQUFlLENBQUM7WUFDdkMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUM7WUFDdkIsU0FBUyxFQUFFLElBQUk7WUFDZixPQUFPLEVBQUUsV0FBVztTQUNyQixDQUFDLENBQUE7UUFFRixNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBQSxrQkFBVSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsMkNBQW1CLEdBQUUsQ0FBQyxDQUFBO1FBRTFELElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQy9ELElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzNDLElBQUEsZUFBTSxFQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ2xELENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFNpbXBsZURldGFpbCB9IGZyb20gJy4uL3N0b3JlJ1xuaW1wb3J0IHsgcmVuZGVySG9vayB9IGZyb20gJ0B0ZXN0aW5nLWxpYnJhcnkvcmVhY3QnXG5pbXBvcnQgeyBiZWZvcmVFYWNoLCBkZXNjcmliZSwgZXhwZWN0LCBpdCwgdmkgfSBmcm9tICd2aXRlc3QnXG5pbXBvcnQgeyB1c2VTdWJzY3JpcHRpb25MaXN0IH0gZnJvbSAnLi91c2Utc3Vic2NyaXB0aW9uLWxpc3QnXG5cbmxldCBtb2NrRGV0YWlsOiBTaW1wbGVEZXRhaWwgfCB1bmRlZmluZWRcbmNvbnN0IG1vY2tSZWZldGNoID0gdmkuZm4oKVxuXG5jb25zdCBtb2NrVHJpZ2dlclN1YnNjcmlwdGlvbnMgPSB2aS5mbigpXG5cbnZpLm1vY2soJ0Avc2VydmljZS91c2UtdHJpZ2dlcnMnLCAoKSA9PiAoe1xuICB1c2VUcmlnZ2VyU3Vic2NyaXB0aW9uczogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gbW9ja1RyaWdnZXJTdWJzY3JpcHRpb25zKC4uLmFyZ3MpLFxufSkpXG5cbnZpLm1vY2soJy4uL3N0b3JlJywgKCkgPT4gKHtcbiAgdXNlUGx1Z2luU3RvcmU6IChzZWxlY3RvcjogKHN0YXRlOiB7IGRldGFpbDogU2ltcGxlRGV0YWlsIHwgdW5kZWZpbmVkIH0pID0+IFNpbXBsZURldGFpbCB8IHVuZGVmaW5lZCkgPT5cbiAgICBzZWxlY3Rvcih7IGRldGFpbDogbW9ja0RldGFpbCB9KSxcbn0pKVxuXG5iZWZvcmVFYWNoKCgpID0+IHtcbiAgdmkuY2xlYXJBbGxNb2NrcygpXG4gIG1vY2tEZXRhaWwgPSB1bmRlZmluZWRcbiAgbW9ja1RyaWdnZXJTdWJzY3JpcHRpb25zLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgZGF0YTogW10sXG4gICAgaXNMb2FkaW5nOiBmYWxzZSxcbiAgICByZWZldGNoOiBtb2NrUmVmZXRjaCxcbiAgfSlcbn0pXG5cbmRlc2NyaWJlKCd1c2VTdWJzY3JpcHRpb25MaXN0JywgKCkgPT4ge1xuICBpdCgnc2hvdWxkIHJlcXVlc3Qgc3Vic2NyaXB0aW9ucyB3aXRoIHByb3ZpZGVyIGZyb20gc3RvcmUnLCAoKSA9PiB7XG4gICAgbW9ja0RldGFpbCA9IHtcbiAgICAgIGlkOiAnZGV0YWlsLTEnLFxuICAgICAgcGx1Z2luX2lkOiAncGx1Z2luLTEnLFxuICAgICAgbmFtZTogJ1BsdWdpbicsXG4gICAgICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6ICdwbHVnaW4tdWlkJyxcbiAgICAgIHByb3ZpZGVyOiAndGVzdC1wcm92aWRlcicsXG4gICAgICBkZWNsYXJhdGlvbjoge30sXG4gICAgfVxuXG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU3Vic2NyaXB0aW9uTGlzdCgpKVxuXG4gICAgZXhwZWN0KG1vY2tUcmlnZ2VyU3Vic2NyaXB0aW9ucykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJ3Rlc3QtcHJvdmlkZXInKVxuICAgIGV4cGVjdChyZXN1bHQuY3VycmVudC5kZXRhaWwpLnRvRXF1YWwobW9ja0RldGFpbClcbiAgfSlcblxuICBpdCgnc2hvdWxkIHJlcXVlc3Qgc3Vic2NyaXB0aW9ucyB3aXRoIGVtcHR5IHByb3ZpZGVyIHdoZW4gZGV0YWlsIGlzIG1pc3NpbmcnLCAoKSA9PiB7XG4gICAgY29uc3QgeyByZXN1bHQgfSA9IHJlbmRlckhvb2soKCkgPT4gdXNlU3Vic2NyaXB0aW9uTGlzdCgpKVxuXG4gICAgZXhwZWN0KG1vY2tUcmlnZ2VyU3Vic2NyaXB0aW9ucykudG9IYXZlQmVlbkNhbGxlZFdpdGgoJycpXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LmRldGFpbCkudG9CZVVuZGVmaW5lZCgpXG4gIH0pXG5cbiAgaXQoJ3Nob3VsZCByZXR1cm4gZGF0YSBmcm9tIHRyaWdnZXIgc3Vic2NyaXB0aW9uIGhvb2snLCAoKSA9PiB7XG4gICAgbW9ja1RyaWdnZXJTdWJzY3JpcHRpb25zLm1vY2tSZXR1cm5WYWx1ZSh7XG4gICAgICBkYXRhOiBbeyBpZDogJ3N1Yi0xJyB9XSxcbiAgICAgIGlzTG9hZGluZzogdHJ1ZSxcbiAgICAgIHJlZmV0Y2g6IG1vY2tSZWZldGNoLFxuICAgIH0pXG5cbiAgICBjb25zdCB7IHJlc3VsdCB9ID0gcmVuZGVySG9vaygoKSA9PiB1c2VTdWJzY3JpcHRpb25MaXN0KCkpXG5cbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuc3Vic2NyaXB0aW9ucykudG9FcXVhbChbeyBpZDogJ3N1Yi0xJyB9XSlcbiAgICBleHBlY3QocmVzdWx0LmN1cnJlbnQuaXNMb2FkaW5nKS50b0JlKHRydWUpXG4gICAgZXhwZWN0KHJlc3VsdC5jdXJyZW50LnJlZmV0Y2gpLnRvQmUobW9ja1JlZmV0Y2gpXG4gIH0pXG59KVxuIl19