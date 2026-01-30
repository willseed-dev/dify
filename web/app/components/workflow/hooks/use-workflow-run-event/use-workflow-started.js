"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowStarted = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const store_1 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
const useWorkflowStarted = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const handleWorkflowStarted = (0, react_1.useCallback)((params) => {
        const { task_id, data } = params;
        const { workflowRunningData, setWorkflowRunningData, setIterParallelLogMap, } = workflowStore.getState();
        const { getNodes, setNodes, edges, setEdges, } = store.getState();
        setIterParallelLogMap(new Map());
        setWorkflowRunningData((0, immer_1.produce)(workflowRunningData, (draft) => {
            draft.task_id = task_id;
            draft.result = {
                ...draft?.result,
                ...data,
                status: types_1.WorkflowRunningStatus.Running,
            };
        }));
        const nodes = getNodes();
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            draft.forEach((node) => {
                node.data._waitingRun = true;
                node.data._runningBranchId = undefined;
            });
        });
        setNodes(newNodes);
        const newEdges = (0, immer_1.produce)(edges, (draft) => {
            draft.forEach((edge) => {
                edge.data = {
                    ...edge.data,
                    _sourceRunningStatus: undefined,
                    _targetRunningStatus: undefined,
                    _waitingRun: true,
                };
            });
        });
        setEdges(newEdges);
    }, [workflowStore, store]);
    return {
        handleWorkflowStarted,
    };
};
exports.useWorkflowStarted = useWorkflowStarted;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LXN0YXJ0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utd29ya2Zsb3ctc3RhcnRlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBK0I7QUFDL0IsaUNBQW1DO0FBQ25DLHlDQUF1QztBQUN2QywyREFBa0U7QUFDbEUsMkRBQXVFO0FBRWhFLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxFQUFFO0lBQ3JDLE1BQU0sS0FBSyxHQUFHLElBQUEsdUJBQVcsR0FBRSxDQUFBO0lBQzNCLE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUV4QyxNQUFNLHFCQUFxQixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLE1BQStCLEVBQUUsRUFBRTtRQUM1RSxNQUFNLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQTtRQUNoQyxNQUFNLEVBQ0osbUJBQW1CLEVBQ25CLHNCQUFzQixFQUN0QixxQkFBcUIsR0FDdEIsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDNUIsTUFBTSxFQUNKLFFBQVEsRUFDUixRQUFRLEVBQ1IsS0FBSyxFQUNMLFFBQVEsR0FDVCxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNwQixxQkFBcUIsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUE7UUFDaEMsc0JBQXNCLENBQUMsSUFBQSxlQUFPLEVBQUMsbUJBQW9CLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUM3RCxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQTtZQUN2QixLQUFLLENBQUMsTUFBTSxHQUFHO2dCQUNiLEdBQUcsS0FBSyxFQUFFLE1BQU07Z0JBQ2hCLEdBQUcsSUFBSTtnQkFDUCxNQUFNLEVBQUUsNkJBQXFCLENBQUMsT0FBTzthQUN0QyxDQUFBO1FBQ0gsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNILE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFBO1FBQ3hCLE1BQU0sUUFBUSxHQUFHLElBQUEsZUFBTyxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3hDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO2dCQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFNBQVMsQ0FBQTtZQUN4QyxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0YsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1FBQ2xCLE1BQU0sUUFBUSxHQUFHLElBQUEsZUFBTyxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3hDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDckIsSUFBSSxDQUFDLElBQUksR0FBRztvQkFDVixHQUFHLElBQUksQ0FBQyxJQUFJO29CQUNaLG9CQUFvQixFQUFFLFNBQVM7b0JBQy9CLG9CQUFvQixFQUFFLFNBQVM7b0JBQy9CLFdBQVcsRUFBRSxJQUFJO2lCQUNsQixDQUFBO1lBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUNGLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUNwQixDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUUxQixPQUFPO1FBQ0wscUJBQXFCO0tBQ3RCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFsRFksUUFBQSxrQkFBa0Isc0JBa0Q5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgV29ya2Zsb3dTdGFydGVkUmVzcG9uc2UgfSBmcm9tICdAL3R5cGVzL3dvcmtmbG93J1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVN0b3JlQXBpIH0gZnJvbSAncmVhY3RmbG93J1xuaW1wb3J0IHsgdXNlV29ya2Zsb3dTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgeyBXb3JrZmxvd1J1bm5pbmdTdGF0dXMgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuXG5leHBvcnQgY29uc3QgdXNlV29ya2Zsb3dTdGFydGVkID0gKCkgPT4ge1xuICBjb25zdCBzdG9yZSA9IHVzZVN0b3JlQXBpKClcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuXG4gIGNvbnN0IGhhbmRsZVdvcmtmbG93U3RhcnRlZCA9IHVzZUNhbGxiYWNrKChwYXJhbXM6IFdvcmtmbG93U3RhcnRlZFJlc3BvbnNlKSA9PiB7XG4gICAgY29uc3QgeyB0YXNrX2lkLCBkYXRhIH0gPSBwYXJhbXNcbiAgICBjb25zdCB7XG4gICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhLFxuICAgICAgc2V0V29ya2Zsb3dSdW5uaW5nRGF0YSxcbiAgICAgIHNldEl0ZXJQYXJhbGxlbExvZ01hcCxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3Qge1xuICAgICAgZ2V0Tm9kZXMsXG4gICAgICBzZXROb2RlcyxcbiAgICAgIGVkZ2VzLFxuICAgICAgc2V0RWRnZXMsXG4gICAgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICBzZXRJdGVyUGFyYWxsZWxMb2dNYXAobmV3IE1hcCgpKVxuICAgIHNldFdvcmtmbG93UnVubmluZ0RhdGEocHJvZHVjZSh3b3JrZmxvd1J1bm5pbmdEYXRhISwgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC50YXNrX2lkID0gdGFza19pZFxuICAgICAgZHJhZnQucmVzdWx0ID0ge1xuICAgICAgICAuLi5kcmFmdD8ucmVzdWx0LFxuICAgICAgICAuLi5kYXRhLFxuICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5SdW5uaW5nLFxuICAgICAgfVxuICAgIH0pKVxuICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgIGNvbnN0IG5ld05vZGVzID0gcHJvZHVjZShub2RlcywgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgIG5vZGUuZGF0YS5fd2FpdGluZ1J1biA9IHRydWVcbiAgICAgICAgbm9kZS5kYXRhLl9ydW5uaW5nQnJhbmNoSWQgPSB1bmRlZmluZWRcbiAgICAgIH0pXG4gICAgfSlcbiAgICBzZXROb2RlcyhuZXdOb2RlcylcbiAgICBjb25zdCBuZXdFZGdlcyA9IHByb2R1Y2UoZWRnZXMsIChkcmFmdCkgPT4ge1xuICAgICAgZHJhZnQuZm9yRWFjaCgoZWRnZSkgPT4ge1xuICAgICAgICBlZGdlLmRhdGEgPSB7XG4gICAgICAgICAgLi4uZWRnZS5kYXRhLFxuICAgICAgICAgIF9zb3VyY2VSdW5uaW5nU3RhdHVzOiB1bmRlZmluZWQsXG4gICAgICAgICAgX3RhcmdldFJ1bm5pbmdTdGF0dXM6IHVuZGVmaW5lZCxcbiAgICAgICAgICBfd2FpdGluZ1J1bjogdHJ1ZSxcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICAgIHNldEVkZ2VzKG5ld0VkZ2VzKVxuICB9LCBbd29ya2Zsb3dTdG9yZSwgc3RvcmVdKVxuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlV29ya2Zsb3dTdGFydGVkLFxuICB9XG59XG4iXX0=