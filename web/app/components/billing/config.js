"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultPlan = exports.ALL_PLANS = exports.getWithPremiumUrl = exports.getStartedWithCommunityUrl = exports.contactSalesUrl = exports.unAvailable = exports.contractSales = exports.NUM_INFINITE = void 0;
const type_1 = require("@/app/components/billing/type");
const supportModelProviders = 'OpenAI/Anthropic/Llama2/Azure OpenAI/Hugging Face/Replicate';
exports.NUM_INFINITE = -1;
exports.contractSales = 'contractSales';
exports.unAvailable = 'unAvailable';
exports.contactSalesUrl = 'https://vikgc6bnu1s.typeform.com/dify-business';
exports.getStartedWithCommunityUrl = 'https://github.com/langgenius/dify';
exports.getWithPremiumUrl = 'https://aws.amazon.com/marketplace/pp/prodview-t22mebxzwjhu6';
exports.ALL_PLANS = {
    sandbox: {
        level: 1,
        price: 0,
        modelProviders: supportModelProviders,
        teamWorkspace: 1,
        teamMembers: 1,
        buildApps: 5,
        documents: 50,
        vectorSpace: '50MB',
        documentsUploadQuota: 0,
        documentsRequestQuota: 10,
        apiRateLimit: 5000,
        documentProcessingPriority: type_1.Priority.standard,
        messageRequest: 200,
        triggerEvents: 3000,
        annotatedResponse: 10,
        logHistory: 30,
    },
    professional: {
        level: 2,
        price: 59,
        modelProviders: supportModelProviders,
        teamWorkspace: 1,
        teamMembers: 3,
        buildApps: 50,
        documents: 500,
        vectorSpace: '5GB',
        documentsUploadQuota: 0,
        documentsRequestQuota: 100,
        apiRateLimit: exports.NUM_INFINITE,
        documentProcessingPriority: type_1.Priority.priority,
        messageRequest: 5000,
        triggerEvents: 20000,
        annotatedResponse: 2000,
        logHistory: exports.NUM_INFINITE,
    },
    team: {
        level: 3,
        price: 159,
        modelProviders: supportModelProviders,
        teamWorkspace: 1,
        teamMembers: 50,
        buildApps: 200,
        documents: 1000,
        vectorSpace: '20GB',
        documentsUploadQuota: 0,
        documentsRequestQuota: 1000,
        apiRateLimit: exports.NUM_INFINITE,
        documentProcessingPriority: type_1.Priority.topPriority,
        messageRequest: 10000,
        triggerEvents: exports.NUM_INFINITE,
        annotatedResponse: 5000,
        logHistory: exports.NUM_INFINITE,
    },
};
exports.defaultPlan = {
    type: type_1.Plan.sandbox,
    usage: {
        documents: 50,
        vectorSpace: 1,
        buildApps: 1,
        teamMembers: 1,
        annotatedResponse: 1,
        documentsUploadQuota: 0,
        apiRateLimit: 0,
        triggerEvents: 0,
    },
    total: {
        documents: 50,
        vectorSpace: 10,
        buildApps: 10,
        teamMembers: 1,
        annotatedResponse: 10,
        documentsUploadQuota: 0,
        apiRateLimit: exports.ALL_PLANS.sandbox.apiRateLimit,
        triggerEvents: exports.ALL_PLANS.sandbox.triggerEvents,
    },
    reset: {
        apiRateLimit: null,
        triggerEvents: null,
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdEQUE4RDtBQUU5RCxNQUFNLHFCQUFxQixHQUFHLDZEQUE2RCxDQUFBO0FBRTlFLFFBQUEsWUFBWSxHQUFHLENBQUMsQ0FBQyxDQUFBO0FBQ2pCLFFBQUEsYUFBYSxHQUFHLGVBQWUsQ0FBQTtBQUMvQixRQUFBLFdBQVcsR0FBRyxhQUFhLENBQUE7QUFFM0IsUUFBQSxlQUFlLEdBQUcsZ0RBQWdELENBQUE7QUFDbEUsUUFBQSwwQkFBMEIsR0FBRyxvQ0FBb0MsQ0FBQTtBQUNqRSxRQUFBLGlCQUFpQixHQUFHLDhEQUE4RCxDQUFBO0FBRWxGLFFBQUEsU0FBUyxHQUFnQztJQUNwRCxPQUFPLEVBQUU7UUFDUCxLQUFLLEVBQUUsQ0FBQztRQUNSLEtBQUssRUFBRSxDQUFDO1FBQ1IsY0FBYyxFQUFFLHFCQUFxQjtRQUNyQyxhQUFhLEVBQUUsQ0FBQztRQUNoQixXQUFXLEVBQUUsQ0FBQztRQUNkLFNBQVMsRUFBRSxDQUFDO1FBQ1osU0FBUyxFQUFFLEVBQUU7UUFDYixXQUFXLEVBQUUsTUFBTTtRQUNuQixvQkFBb0IsRUFBRSxDQUFDO1FBQ3ZCLHFCQUFxQixFQUFFLEVBQUU7UUFDekIsWUFBWSxFQUFFLElBQUk7UUFDbEIsMEJBQTBCLEVBQUUsZUFBUSxDQUFDLFFBQVE7UUFDN0MsY0FBYyxFQUFFLEdBQUc7UUFDbkIsYUFBYSxFQUFFLElBQUk7UUFDbkIsaUJBQWlCLEVBQUUsRUFBRTtRQUNyQixVQUFVLEVBQUUsRUFBRTtLQUNmO0lBQ0QsWUFBWSxFQUFFO1FBQ1osS0FBSyxFQUFFLENBQUM7UUFDUixLQUFLLEVBQUUsRUFBRTtRQUNULGNBQWMsRUFBRSxxQkFBcUI7UUFDckMsYUFBYSxFQUFFLENBQUM7UUFDaEIsV0FBVyxFQUFFLENBQUM7UUFDZCxTQUFTLEVBQUUsRUFBRTtRQUNiLFNBQVMsRUFBRSxHQUFHO1FBQ2QsV0FBVyxFQUFFLEtBQUs7UUFDbEIsb0JBQW9CLEVBQUUsQ0FBQztRQUN2QixxQkFBcUIsRUFBRSxHQUFHO1FBQzFCLFlBQVksRUFBRSxvQkFBWTtRQUMxQiwwQkFBMEIsRUFBRSxlQUFRLENBQUMsUUFBUTtRQUM3QyxjQUFjLEVBQUUsSUFBSTtRQUNwQixhQUFhLEVBQUUsS0FBSztRQUNwQixpQkFBaUIsRUFBRSxJQUFJO1FBQ3ZCLFVBQVUsRUFBRSxvQkFBWTtLQUN6QjtJQUNELElBQUksRUFBRTtRQUNKLEtBQUssRUFBRSxDQUFDO1FBQ1IsS0FBSyxFQUFFLEdBQUc7UUFDVixjQUFjLEVBQUUscUJBQXFCO1FBQ3JDLGFBQWEsRUFBRSxDQUFDO1FBQ2hCLFdBQVcsRUFBRSxFQUFFO1FBQ2YsU0FBUyxFQUFFLEdBQUc7UUFDZCxTQUFTLEVBQUUsSUFBSTtRQUNmLFdBQVcsRUFBRSxNQUFNO1FBQ25CLG9CQUFvQixFQUFFLENBQUM7UUFDdkIscUJBQXFCLEVBQUUsSUFBSTtRQUMzQixZQUFZLEVBQUUsb0JBQVk7UUFDMUIsMEJBQTBCLEVBQUUsZUFBUSxDQUFDLFdBQVc7UUFDaEQsY0FBYyxFQUFFLEtBQUs7UUFDckIsYUFBYSxFQUFFLG9CQUFZO1FBQzNCLGlCQUFpQixFQUFFLElBQUk7UUFDdkIsVUFBVSxFQUFFLG9CQUFZO0tBQ3pCO0NBQ0YsQ0FBQTtBQUVZLFFBQUEsV0FBVyxHQUFHO0lBQ3pCLElBQUksRUFBRSxXQUFJLENBQUMsT0FBb0I7SUFDL0IsS0FBSyxFQUFFO1FBQ0wsU0FBUyxFQUFFLEVBQUU7UUFDYixXQUFXLEVBQUUsQ0FBQztRQUNkLFNBQVMsRUFBRSxDQUFDO1FBQ1osV0FBVyxFQUFFLENBQUM7UUFDZCxpQkFBaUIsRUFBRSxDQUFDO1FBQ3BCLG9CQUFvQixFQUFFLENBQUM7UUFDdkIsWUFBWSxFQUFFLENBQUM7UUFDZixhQUFhLEVBQUUsQ0FBQztLQUNqQjtJQUNELEtBQUssRUFBRTtRQUNMLFNBQVMsRUFBRSxFQUFFO1FBQ2IsV0FBVyxFQUFFLEVBQUU7UUFDZixTQUFTLEVBQUUsRUFBRTtRQUNiLFdBQVcsRUFBRSxDQUFDO1FBQ2QsaUJBQWlCLEVBQUUsRUFBRTtRQUNyQixvQkFBb0IsRUFBRSxDQUFDO1FBQ3ZCLFlBQVksRUFBRSxpQkFBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZO1FBQzVDLGFBQWEsRUFBRSxpQkFBUyxDQUFDLE9BQU8sQ0FBQyxhQUFhO0tBQy9DO0lBQ0QsS0FBSyxFQUFFO1FBQ0wsWUFBWSxFQUFFLElBQUk7UUFDbEIsYUFBYSxFQUFFLElBQUk7S0FDcEI7Q0FDRixDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBCYXNpY1BsYW4sIFBsYW5JbmZvIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iaWxsaW5nL3R5cGUnXG5pbXBvcnQgeyBQbGFuLCBQcmlvcml0eSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmlsbGluZy90eXBlJ1xuXG5jb25zdCBzdXBwb3J0TW9kZWxQcm92aWRlcnMgPSAnT3BlbkFJL0FudGhyb3BpYy9MbGFtYTIvQXp1cmUgT3BlbkFJL0h1Z2dpbmcgRmFjZS9SZXBsaWNhdGUnXG5cbmV4cG9ydCBjb25zdCBOVU1fSU5GSU5JVEUgPSAtMVxuZXhwb3J0IGNvbnN0IGNvbnRyYWN0U2FsZXMgPSAnY29udHJhY3RTYWxlcydcbmV4cG9ydCBjb25zdCB1bkF2YWlsYWJsZSA9ICd1bkF2YWlsYWJsZSdcblxuZXhwb3J0IGNvbnN0IGNvbnRhY3RTYWxlc1VybCA9ICdodHRwczovL3Zpa2djNmJudTFzLnR5cGVmb3JtLmNvbS9kaWZ5LWJ1c2luZXNzJ1xuZXhwb3J0IGNvbnN0IGdldFN0YXJ0ZWRXaXRoQ29tbXVuaXR5VXJsID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9sYW5nZ2VuaXVzL2RpZnknXG5leHBvcnQgY29uc3QgZ2V0V2l0aFByZW1pdW1VcmwgPSAnaHR0cHM6Ly9hd3MuYW1hem9uLmNvbS9tYXJrZXRwbGFjZS9wcC9wcm9kdmlldy10MjJtZWJ4endqaHU2J1xuXG5leHBvcnQgY29uc3QgQUxMX1BMQU5TOiBSZWNvcmQ8QmFzaWNQbGFuLCBQbGFuSW5mbz4gPSB7XG4gIHNhbmRib3g6IHtcbiAgICBsZXZlbDogMSxcbiAgICBwcmljZTogMCxcbiAgICBtb2RlbFByb3ZpZGVyczogc3VwcG9ydE1vZGVsUHJvdmlkZXJzLFxuICAgIHRlYW1Xb3Jrc3BhY2U6IDEsXG4gICAgdGVhbU1lbWJlcnM6IDEsXG4gICAgYnVpbGRBcHBzOiA1LFxuICAgIGRvY3VtZW50czogNTAsXG4gICAgdmVjdG9yU3BhY2U6ICc1ME1CJyxcbiAgICBkb2N1bWVudHNVcGxvYWRRdW90YTogMCxcbiAgICBkb2N1bWVudHNSZXF1ZXN0UXVvdGE6IDEwLFxuICAgIGFwaVJhdGVMaW1pdDogNTAwMCxcbiAgICBkb2N1bWVudFByb2Nlc3NpbmdQcmlvcml0eTogUHJpb3JpdHkuc3RhbmRhcmQsXG4gICAgbWVzc2FnZVJlcXVlc3Q6IDIwMCxcbiAgICB0cmlnZ2VyRXZlbnRzOiAzMDAwLFxuICAgIGFubm90YXRlZFJlc3BvbnNlOiAxMCxcbiAgICBsb2dIaXN0b3J5OiAzMCxcbiAgfSxcbiAgcHJvZmVzc2lvbmFsOiB7XG4gICAgbGV2ZWw6IDIsXG4gICAgcHJpY2U6IDU5LFxuICAgIG1vZGVsUHJvdmlkZXJzOiBzdXBwb3J0TW9kZWxQcm92aWRlcnMsXG4gICAgdGVhbVdvcmtzcGFjZTogMSxcbiAgICB0ZWFtTWVtYmVyczogMyxcbiAgICBidWlsZEFwcHM6IDUwLFxuICAgIGRvY3VtZW50czogNTAwLFxuICAgIHZlY3RvclNwYWNlOiAnNUdCJyxcbiAgICBkb2N1bWVudHNVcGxvYWRRdW90YTogMCxcbiAgICBkb2N1bWVudHNSZXF1ZXN0UXVvdGE6IDEwMCxcbiAgICBhcGlSYXRlTGltaXQ6IE5VTV9JTkZJTklURSxcbiAgICBkb2N1bWVudFByb2Nlc3NpbmdQcmlvcml0eTogUHJpb3JpdHkucHJpb3JpdHksXG4gICAgbWVzc2FnZVJlcXVlc3Q6IDUwMDAsXG4gICAgdHJpZ2dlckV2ZW50czogMjAwMDAsXG4gICAgYW5ub3RhdGVkUmVzcG9uc2U6IDIwMDAsXG4gICAgbG9nSGlzdG9yeTogTlVNX0lORklOSVRFLFxuICB9LFxuICB0ZWFtOiB7XG4gICAgbGV2ZWw6IDMsXG4gICAgcHJpY2U6IDE1OSxcbiAgICBtb2RlbFByb3ZpZGVyczogc3VwcG9ydE1vZGVsUHJvdmlkZXJzLFxuICAgIHRlYW1Xb3Jrc3BhY2U6IDEsXG4gICAgdGVhbU1lbWJlcnM6IDUwLFxuICAgIGJ1aWxkQXBwczogMjAwLFxuICAgIGRvY3VtZW50czogMTAwMCxcbiAgICB2ZWN0b3JTcGFjZTogJzIwR0InLFxuICAgIGRvY3VtZW50c1VwbG9hZFF1b3RhOiAwLFxuICAgIGRvY3VtZW50c1JlcXVlc3RRdW90YTogMTAwMCxcbiAgICBhcGlSYXRlTGltaXQ6IE5VTV9JTkZJTklURSxcbiAgICBkb2N1bWVudFByb2Nlc3NpbmdQcmlvcml0eTogUHJpb3JpdHkudG9wUHJpb3JpdHksXG4gICAgbWVzc2FnZVJlcXVlc3Q6IDEwMDAwLFxuICAgIHRyaWdnZXJFdmVudHM6IE5VTV9JTkZJTklURSxcbiAgICBhbm5vdGF0ZWRSZXNwb25zZTogNTAwMCxcbiAgICBsb2dIaXN0b3J5OiBOVU1fSU5GSU5JVEUsXG4gIH0sXG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0UGxhbiA9IHtcbiAgdHlwZTogUGxhbi5zYW5kYm94IGFzIEJhc2ljUGxhbixcbiAgdXNhZ2U6IHtcbiAgICBkb2N1bWVudHM6IDUwLFxuICAgIHZlY3RvclNwYWNlOiAxLFxuICAgIGJ1aWxkQXBwczogMSxcbiAgICB0ZWFtTWVtYmVyczogMSxcbiAgICBhbm5vdGF0ZWRSZXNwb25zZTogMSxcbiAgICBkb2N1bWVudHNVcGxvYWRRdW90YTogMCxcbiAgICBhcGlSYXRlTGltaXQ6IDAsXG4gICAgdHJpZ2dlckV2ZW50czogMCxcbiAgfSxcbiAgdG90YWw6IHtcbiAgICBkb2N1bWVudHM6IDUwLFxuICAgIHZlY3RvclNwYWNlOiAxMCxcbiAgICBidWlsZEFwcHM6IDEwLFxuICAgIHRlYW1NZW1iZXJzOiAxLFxuICAgIGFubm90YXRlZFJlc3BvbnNlOiAxMCxcbiAgICBkb2N1bWVudHNVcGxvYWRRdW90YTogMCxcbiAgICBhcGlSYXRlTGltaXQ6IEFMTF9QTEFOUy5zYW5kYm94LmFwaVJhdGVMaW1pdCxcbiAgICB0cmlnZ2VyRXZlbnRzOiBBTExfUExBTlMuc2FuZGJveC50cmlnZ2VyRXZlbnRzLFxuICB9LFxuICByZXNldDoge1xuICAgIGFwaVJhdGVMaW1pdDogbnVsbCxcbiAgICB0cmlnZ2VyRXZlbnRzOiBudWxsLFxuICB9LFxufVxuIl19