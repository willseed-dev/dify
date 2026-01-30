"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const config_1 = require("../config");
const apps_info_1 = require("./apps-info");
const appsUsage = 7;
const appsTotal = 15;
const mockPlan = {
    ...config_1.defaultPlan,
    usage: {
        ...config_1.defaultPlan.usage,
        buildApps: appsUsage,
    },
    total: {
        ...config_1.defaultPlan.total,
        buildApps: appsTotal,
    },
};
vi.mock('@/context/provider-context', () => ({
    useProviderContext: () => ({
        plan: mockPlan,
    }),
}));
describe('AppsInfo', () => {
    it('renders build apps usage information with context data', () => {
        (0, react_1.render)(<apps_info_1.default className="apps-info-class"/>);
        expect(react_1.screen.getByText('billing.usagePage.buildApps')).toBeInTheDocument();
        expect(react_1.screen.getByText(`${appsUsage}`)).toBeInTheDocument();
        expect(react_1.screen.getByText(`${appsTotal}`)).toBeInTheDocument();
        expect(react_1.screen.getByText('billing.usagePage.buildApps').closest('.apps-info-class')).toBeInTheDocument();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwcy1pbmZvLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBzLWluZm8uc3BlYy50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxrREFBdUQ7QUFDdkQsc0NBQXVDO0FBQ3ZDLDJDQUFrQztBQUVsQyxNQUFNLFNBQVMsR0FBRyxDQUFDLENBQUE7QUFDbkIsTUFBTSxTQUFTLEdBQUcsRUFBRSxDQUFBO0FBRXBCLE1BQU0sUUFBUSxHQUFHO0lBQ2YsR0FBRyxvQkFBVztJQUNkLEtBQUssRUFBRTtRQUNMLEdBQUcsb0JBQVcsQ0FBQyxLQUFLO1FBQ3BCLFNBQVMsRUFBRSxTQUFTO0tBQ3JCO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsR0FBRyxvQkFBVyxDQUFDLEtBQUs7UUFDcEIsU0FBUyxFQUFFLFNBQVM7S0FDckI7Q0FDRixDQUFBO0FBRUQsRUFBRSxDQUFDLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzNDLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDekIsSUFBSSxFQUFFLFFBQVE7S0FDZixDQUFDO0NBQ0gsQ0FBQyxDQUFDLENBQUE7QUFFSCxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRTtJQUN4QixFQUFFLENBQUMsd0RBQXdELEVBQUUsR0FBRyxFQUFFO1FBQ2hFLElBQUEsY0FBTSxFQUFDLENBQUMsbUJBQVEsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUcsQ0FBQyxDQUFBO1FBRWhELE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1FBQzNFLE1BQU0sQ0FBQyxjQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQUE7UUFDNUQsTUFBTSxDQUFDLGNBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtRQUM1RCxNQUFNLENBQUMsY0FBTSxDQUFDLFNBQVMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FBQTtJQUN6RyxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVuZGVyLCBzY3JlZW4gfSBmcm9tICdAdGVzdGluZy1saWJyYXJ5L3JlYWN0J1xuaW1wb3J0IHsgZGVmYXVsdFBsYW4gfSBmcm9tICcuLi9jb25maWcnXG5pbXBvcnQgQXBwc0luZm8gZnJvbSAnLi9hcHBzLWluZm8nXG5cbmNvbnN0IGFwcHNVc2FnZSA9IDdcbmNvbnN0IGFwcHNUb3RhbCA9IDE1XG5cbmNvbnN0IG1vY2tQbGFuID0ge1xuICAuLi5kZWZhdWx0UGxhbixcbiAgdXNhZ2U6IHtcbiAgICAuLi5kZWZhdWx0UGxhbi51c2FnZSxcbiAgICBidWlsZEFwcHM6IGFwcHNVc2FnZSxcbiAgfSxcbiAgdG90YWw6IHtcbiAgICAuLi5kZWZhdWx0UGxhbi50b3RhbCxcbiAgICBidWlsZEFwcHM6IGFwcHNUb3RhbCxcbiAgfSxcbn1cblxudmkubW9jaygnQC9jb250ZXh0L3Byb3ZpZGVyLWNvbnRleHQnLCAoKSA9PiAoe1xuICB1c2VQcm92aWRlckNvbnRleHQ6ICgpID0+ICh7XG4gICAgcGxhbjogbW9ja1BsYW4sXG4gIH0pLFxufSkpXG5cbmRlc2NyaWJlKCdBcHBzSW5mbycsICgpID0+IHtcbiAgaXQoJ3JlbmRlcnMgYnVpbGQgYXBwcyB1c2FnZSBpbmZvcm1hdGlvbiB3aXRoIGNvbnRleHQgZGF0YScsICgpID0+IHtcbiAgICByZW5kZXIoPEFwcHNJbmZvIGNsYXNzTmFtZT1cImFwcHMtaW5mby1jbGFzc1wiIC8+KVxuXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcudXNhZ2VQYWdlLmJ1aWxkQXBwcycpKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoYCR7YXBwc1VzYWdlfWApKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoYCR7YXBwc1RvdGFsfWApKS50b0JlSW5UaGVEb2N1bWVudCgpXG4gICAgZXhwZWN0KHNjcmVlbi5nZXRCeVRleHQoJ2JpbGxpbmcudXNhZ2VQYWdlLmJ1aWxkQXBwcycpLmNsb3Nlc3QoJy5hcHBzLWluZm8tY2xhc3MnKSkudG9CZUluVGhlRG9jdW1lbnQoKVxuICB9KVxufSlcbiJdfQ==