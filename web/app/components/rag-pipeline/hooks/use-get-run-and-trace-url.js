"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useGetRunAndTraceUrl = void 0;
const react_1 = require("react");
const store_1 = require("@/app/components/workflow/store");
const useGetRunAndTraceUrl = () => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const getWorkflowRunAndTraceUrl = (0, react_1.useCallback)((runId) => {
        const { pipelineId } = workflowStore.getState();
        return {
            runUrl: `/rag/pipelines/${pipelineId}/workflow-runs/${runId}`,
            traceUrl: `/rag/pipelines/${pipelineId}/workflow-runs/${runId}/node-executions`,
        };
    }, [workflowStore]);
    return {
        getWorkflowRunAndTraceUrl,
    };
};
exports.useGetRunAndTraceUrl = useGetRunAndTraceUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWdldC1ydW4tYW5kLXRyYWNlLXVybC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1nZXQtcnVuLWFuZC10cmFjZS11cmwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQW1DO0FBQ25DLDJEQUFrRTtBQUUzRCxNQUFNLG9CQUFvQixHQUFHLEdBQUcsRUFBRTtJQUN2QyxNQUFNLGFBQWEsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFDeEMsTUFBTSx5QkFBeUIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxLQUFhLEVBQUUsRUFBRTtRQUM5RCxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBRS9DLE9BQU87WUFDTCxNQUFNLEVBQUUsa0JBQWtCLFVBQVUsa0JBQWtCLEtBQUssRUFBRTtZQUM3RCxRQUFRLEVBQUUsa0JBQWtCLFVBQVUsa0JBQWtCLEtBQUssa0JBQWtCO1NBQ2hGLENBQUE7SUFDSCxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFBO0lBRW5CLE9BQU87UUFDTCx5QkFBeUI7S0FDMUIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQWRZLFFBQUEsb0JBQW9CLHdCQWNoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1N0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcblxuZXhwb3J0IGNvbnN0IHVzZUdldFJ1bkFuZFRyYWNlVXJsID0gKCkgPT4ge1xuICBjb25zdCB3b3JrZmxvd1N0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpXG4gIGNvbnN0IGdldFdvcmtmbG93UnVuQW5kVHJhY2VVcmwgPSB1c2VDYWxsYmFjaygocnVuSWQ6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHsgcGlwZWxpbmVJZCB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICByZXR1cm4ge1xuICAgICAgcnVuVXJsOiBgL3JhZy9waXBlbGluZXMvJHtwaXBlbGluZUlkfS93b3JrZmxvdy1ydW5zLyR7cnVuSWR9YCxcbiAgICAgIHRyYWNlVXJsOiBgL3JhZy9waXBlbGluZXMvJHtwaXBlbGluZUlkfS93b3JrZmxvdy1ydW5zLyR7cnVuSWR9L25vZGUtZXhlY3V0aW9uc2AsXG4gICAgfVxuICB9LCBbd29ya2Zsb3dTdG9yZV0pXG5cbiAgcmV0dXJuIHtcbiAgICBnZXRXb3JrZmxvd1J1bkFuZFRyYWNlVXJsLFxuICB9XG59XG4iXX0=