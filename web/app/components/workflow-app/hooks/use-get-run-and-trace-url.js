"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetRunAndTraceUrl = void 0;
const react_1 = require("react");
const store_1 = require("@/app/components/workflow/store");
const useGetRunAndTraceUrl = () => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const getWorkflowRunAndTraceUrl = (0, react_1.useCallback)((runId) => {
        const { appId } = workflowStore.getState();
        return {
            runUrl: `/apps/${appId}/workflow-runs/${runId}`,
            traceUrl: `/apps/${appId}/workflow-runs/${runId}/node-executions`,
        };
    }, [workflowStore]);
    return {
        getWorkflowRunAndTraceUrl,
    };
};
exports.useGetRunAndTraceUrl = useGetRunAndTraceUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWdldC1ydW4tYW5kLXRyYWNlLXVybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1nZXQtcnVuLWFuZC10cmFjZS11cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQW1DO0FBQ25DLDJEQUFrRTtBQUUzRCxNQUFNLG9CQUFvQixHQUFHLEdBQUcsRUFBRTtJQUN2QyxNQUFNLGFBQWEsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFDeEMsTUFBTSx5QkFBeUIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxLQUFhLEVBQUUsRUFBRTtRQUM5RCxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBRTFDLE9BQU87WUFDTCxNQUFNLEVBQUUsU0FBUyxLQUFLLGtCQUFrQixLQUFLLEVBQUU7WUFDL0MsUUFBUSxFQUFFLFNBQVMsS0FBSyxrQkFBa0IsS0FBSyxrQkFBa0I7U0FDbEUsQ0FBQTtJQUNILENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUE7SUFFbkIsT0FBTztRQUNMLHlCQUF5QjtLQUMxQixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBZFksUUFBQSxvQkFBb0Isd0JBY2hDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVdvcmtmbG93U3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJ1xuXG5leHBvcnQgY29uc3QgdXNlR2V0UnVuQW5kVHJhY2VVcmwgPSAoKSA9PiB7XG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcbiAgY29uc3QgZ2V0V29ya2Zsb3dSdW5BbmRUcmFjZVVybCA9IHVzZUNhbGxiYWNrKChydW5JZDogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgeyBhcHBJZCB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICByZXR1cm4ge1xuICAgICAgcnVuVXJsOiBgL2FwcHMvJHthcHBJZH0vd29ya2Zsb3ctcnVucy8ke3J1bklkfWAsXG4gICAgICB0cmFjZVVybDogYC9hcHBzLyR7YXBwSWR9L3dvcmtmbG93LXJ1bnMvJHtydW5JZH0vbm9kZS1leGVjdXRpb25zYCxcbiAgICB9XG4gIH0sIFt3b3JrZmxvd1N0b3JlXSlcblxuICByZXR1cm4ge1xuICAgIGdldFdvcmtmbG93UnVuQW5kVHJhY2VVcmwsXG4gIH1cbn1cbiJdfQ==