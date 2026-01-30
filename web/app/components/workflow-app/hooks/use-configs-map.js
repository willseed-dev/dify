"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useConfigsMap = void 0;
const react_1 = require("react");
const hooks_1 = require("@/app/components/base/features/hooks");
const store_1 = require("@/app/components/workflow/store");
const common_1 = require("@/types/common");
const useConfigsMap = () => {
    const appId = (0, store_1.useStore)(s => s.appId);
    const fileSettings = (0, hooks_1.useFeatures)(s => s.features.file);
    return (0, react_1.useMemo)(() => {
        return {
            flowId: appId,
            flowType: common_1.FlowType.appFlow,
            fileSettings,
        };
    }, [appId]);
};
exports.useConfigsMap = useConfigsMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWNvbmZpZ3MtbWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLWNvbmZpZ3MtbWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUErQjtBQUMvQixnRUFBa0U7QUFDbEUsMkRBQTBEO0FBQzFELDJDQUF5QztBQUVsQyxNQUFNLGFBQWEsR0FBRyxHQUFHLEVBQUU7SUFDaEMsTUFBTSxLQUFLLEdBQUcsSUFBQSxnQkFBUSxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3BDLE1BQU0sWUFBWSxHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdEQsT0FBTyxJQUFBLGVBQU8sRUFBQyxHQUFHLEVBQUU7UUFDbEIsT0FBTztZQUNMLE1BQU0sRUFBRSxLQUFNO1lBQ2QsUUFBUSxFQUFFLGlCQUFRLENBQUMsT0FBTztZQUMxQixZQUFZO1NBQ2IsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7QUFDYixDQUFDLENBQUE7QUFWWSxRQUFBLGFBQWEsaUJBVXpCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlRmVhdHVyZXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmVhdHVyZXMvaG9va3MnXG5pbXBvcnQgeyB1c2VTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgeyBGbG93VHlwZSB9IGZyb20gJ0AvdHlwZXMvY29tbW9uJ1xuXG5leHBvcnQgY29uc3QgdXNlQ29uZmlnc01hcCA9ICgpID0+IHtcbiAgY29uc3QgYXBwSWQgPSB1c2VTdG9yZShzID0+IHMuYXBwSWQpXG4gIGNvbnN0IGZpbGVTZXR0aW5ncyA9IHVzZUZlYXR1cmVzKHMgPT4gcy5mZWF0dXJlcy5maWxlKVxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZsb3dJZDogYXBwSWQhLFxuICAgICAgZmxvd1R5cGU6IEZsb3dUeXBlLmFwcEZsb3csXG4gICAgICBmaWxlU2V0dGluZ3MsXG4gICAgfVxuICB9LCBbYXBwSWRdKVxufVxuIl19