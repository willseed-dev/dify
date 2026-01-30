"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowFailed = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const store_1 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
const useWorkflowFailed = () => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const handleWorkflowFailed = (0, react_1.useCallback)(() => {
        const { workflowRunningData, setWorkflowRunningData, } = workflowStore.getState();
        setWorkflowRunningData((0, immer_1.produce)(workflowRunningData, (draft) => {
            draft.result = {
                ...draft.result,
                status: types_1.WorkflowRunningStatus.Failed,
            };
        }));
    }, [workflowStore]);
    return {
        handleWorkflowFailed,
    };
};
exports.useWorkflowFailed = useWorkflowFailed;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LWZhaWxlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS13b3JrZmxvdy1mYWlsZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQStCO0FBQy9CLGlDQUFtQztBQUNuQywyREFBa0U7QUFDbEUsMkRBQXVFO0FBRWhFLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxFQUFFO0lBQ3BDLE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUV4QyxNQUFNLG9CQUFvQixHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDNUMsTUFBTSxFQUNKLG1CQUFtQixFQUNuQixzQkFBc0IsR0FDdkIsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUE7UUFFNUIsc0JBQXNCLENBQUMsSUFBQSxlQUFPLEVBQUMsbUJBQW9CLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUM3RCxLQUFLLENBQUMsTUFBTSxHQUFHO2dCQUNiLEdBQUcsS0FBSyxDQUFDLE1BQU07Z0JBQ2YsTUFBTSxFQUFFLDZCQUFxQixDQUFDLE1BQU07YUFDckMsQ0FBQTtRQUNILENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDTCxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO0lBRW5CLE9BQU87UUFDTCxvQkFBb0I7S0FDckIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQXBCWSxRQUFBLGlCQUFpQixxQkFvQjdCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVdvcmtmbG93U3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJ1xuaW1wb3J0IHsgV29ya2Zsb3dSdW5uaW5nU3RhdHVzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcblxuZXhwb3J0IGNvbnN0IHVzZVdvcmtmbG93RmFpbGVkID0gKCkgPT4ge1xuICBjb25zdCB3b3JrZmxvd1N0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpXG5cbiAgY29uc3QgaGFuZGxlV29ya2Zsb3dGYWlsZWQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YSxcbiAgICAgIHNldFdvcmtmbG93UnVubmluZ0RhdGEsXG4gICAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgc2V0V29ya2Zsb3dSdW5uaW5nRGF0YShwcm9kdWNlKHdvcmtmbG93UnVubmluZ0RhdGEhLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LnJlc3VsdCA9IHtcbiAgICAgICAgLi4uZHJhZnQucmVzdWx0LFxuICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5GYWlsZWQsXG4gICAgICB9XG4gICAgfSkpXG4gIH0sIFt3b3JrZmxvd1N0b3JlXSlcblxuICByZXR1cm4ge1xuICAgIGhhbmRsZVdvcmtmbG93RmFpbGVkLFxuICB9XG59XG4iXX0=