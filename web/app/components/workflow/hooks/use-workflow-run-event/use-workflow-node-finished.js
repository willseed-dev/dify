"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowNodeFinished = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const types_1 = require("@/app/components/workflow/nodes/_base/components/error-handle/types");
const store_1 = require("@/app/components/workflow/store");
const types_2 = require("@/app/components/workflow/types");
const useWorkflowNodeFinished = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const handleWorkflowNodeFinished = (0, react_1.useCallback)((params) => {
        const { data } = params;
        const { workflowRunningData, setWorkflowRunningData, } = workflowStore.getState();
        const { getNodes, setNodes, edges, setEdges, } = store.getState();
        const nodes = getNodes();
        setWorkflowRunningData((0, immer_1.produce)(workflowRunningData, (draft) => {
            const currentIndex = draft.tracing.findIndex(item => item.id === data.id);
            if (currentIndex > -1) {
                draft.tracing[currentIndex] = {
                    ...draft.tracing[currentIndex],
                    ...data,
                };
            }
        }));
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            const currentNode = draft.find(node => node.id === data.node_id);
            currentNode.data._runningStatus = data.status;
            if (data.status === types_2.NodeRunningStatus.Exception) {
                if (data.execution_metadata?.error_strategy === types_1.ErrorHandleTypeEnum.failBranch)
                    currentNode.data._runningBranchId = types_1.ErrorHandleTypeEnum.failBranch;
            }
            else {
                if (data.node_type === types_2.BlockEnum.IfElse)
                    currentNode.data._runningBranchId = data?.outputs?.selected_case_id;
                if (data.node_type === types_2.BlockEnum.QuestionClassifier)
                    currentNode.data._runningBranchId = data?.outputs?.class_id;
            }
        });
        setNodes(newNodes);
        const newEdges = (0, immer_1.produce)(edges, (draft) => {
            const incomeEdges = draft.filter((edge) => {
                return edge.target === data.node_id;
            });
            incomeEdges.forEach((edge) => {
                edge.data = {
                    ...edge.data,
                    _targetRunningStatus: data.status,
                };
            });
        });
        setEdges(newEdges);
    }, [store, workflowStore]);
    return {
        handleWorkflowNodeFinished,
    };
};
exports.useWorkflowNodeFinished = useWorkflowNodeFinished;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LW5vZGUtZmluaXNoZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utd29ya2Zsb3ctbm9kZS1maW5pc2hlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBK0I7QUFDL0IsaUNBQW1DO0FBQ25DLHlDQUF1QztBQUN2QywrRkFBeUc7QUFDekcsMkRBQWtFO0FBQ2xFLDJEQUd3QztBQUVqQyxNQUFNLHVCQUF1QixHQUFHLEdBQUcsRUFBRTtJQUMxQyxNQUFNLEtBQUssR0FBRyxJQUFBLHVCQUFXLEdBQUUsQ0FBQTtJQUMzQixNQUFNLGFBQWEsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFFeEMsTUFBTSwwQkFBMEIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxNQUE0QixFQUFFLEVBQUU7UUFDOUUsTUFBTSxFQUFFLElBQUksRUFBRSxHQUFHLE1BQU0sQ0FBQTtRQUN2QixNQUFNLEVBQ0osbUJBQW1CLEVBQ25CLHNCQUFzQixHQUN2QixHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUM1QixNQUFNLEVBQ0osUUFBUSxFQUNSLFFBQVEsRUFDUixLQUFLLEVBQ0wsUUFBUSxHQUNULEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQ3BCLE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFBO1FBQ3hCLHNCQUFzQixDQUFDLElBQUEsZUFBTyxFQUFDLG1CQUFvQixFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDN0QsTUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLE9BQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUMxRSxJQUFJLFlBQVksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUN0QixLQUFLLENBQUMsT0FBUSxDQUFDLFlBQVksQ0FBQyxHQUFHO29CQUM3QixHQUFHLEtBQUssQ0FBQyxPQUFRLENBQUMsWUFBWSxDQUFDO29CQUMvQixHQUFHLElBQUk7aUJBQ1IsQ0FBQTtZQUNILENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRUgsTUFBTSxRQUFRLEdBQUcsSUFBQSxlQUFPLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDeEMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBRSxDQUFBO1lBQ2pFLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7WUFDN0MsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLHlCQUFpQixDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNoRCxJQUFJLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxjQUFjLEtBQUssMkJBQW1CLENBQUMsVUFBVTtvQkFDNUUsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsR0FBRywyQkFBbUIsQ0FBQyxVQUFVLENBQUE7WUFDdEUsQ0FBQztpQkFDSSxDQUFDO2dCQUNKLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxpQkFBUyxDQUFDLE1BQU07b0JBQ3JDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxFQUFFLE9BQU8sRUFBRSxnQkFBZ0IsQ0FBQTtnQkFFckUsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLGlCQUFTLENBQUMsa0JBQWtCO29CQUNqRCxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFBO1lBQy9ELENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNGLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUNsQixNQUFNLFFBQVEsR0FBRyxJQUFBLGVBQU8sRUFBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUN4QyxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ3hDLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFBO1lBQ3JDLENBQUMsQ0FBQyxDQUFBO1lBQ0YsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUMzQixJQUFJLENBQUMsSUFBSSxHQUFHO29CQUNWLEdBQUcsSUFBSSxDQUFDLElBQUk7b0JBQ1osb0JBQW9CLEVBQUUsSUFBSSxDQUFDLE1BQU07aUJBQ2xDLENBQUE7WUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0YsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3BCLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFBO0lBRTFCLE9BQU87UUFDTCwwQkFBMEI7S0FDM0IsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQTVEWSxRQUFBLHVCQUF1QiwyQkE0RG5DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBOb2RlRmluaXNoZWRSZXNwb25zZSB9IGZyb20gJ0AvdHlwZXMvd29ya2Zsb3cnXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlU3RvcmVBcGkgfSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQgeyBFcnJvckhhbmRsZVR5cGVFbnVtIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ub2Rlcy9fYmFzZS9jb21wb25lbnRzL2Vycm9yLWhhbmRsZS90eXBlcydcbmltcG9ydCB7IHVzZVdvcmtmbG93U3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlJ1xuaW1wb3J0IHtcbiAgQmxvY2tFbnVtLFxuICBOb2RlUnVubmluZ1N0YXR1cyxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcblxuZXhwb3J0IGNvbnN0IHVzZVdvcmtmbG93Tm9kZUZpbmlzaGVkID0gKCkgPT4ge1xuICBjb25zdCBzdG9yZSA9IHVzZVN0b3JlQXBpKClcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuXG4gIGNvbnN0IGhhbmRsZVdvcmtmbG93Tm9kZUZpbmlzaGVkID0gdXNlQ2FsbGJhY2soKHBhcmFtczogTm9kZUZpbmlzaGVkUmVzcG9uc2UpID0+IHtcbiAgICBjb25zdCB7IGRhdGEgfSA9IHBhcmFtc1xuICAgIGNvbnN0IHtcbiAgICAgIHdvcmtmbG93UnVubmluZ0RhdGEsXG4gICAgICBzZXRXb3JrZmxvd1J1bm5pbmdEYXRhLFxuICAgIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgICBjb25zdCB7XG4gICAgICBnZXROb2RlcyxcbiAgICAgIHNldE5vZGVzLFxuICAgICAgZWRnZXMsXG4gICAgICBzZXRFZGdlcyxcbiAgICB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IG5vZGVzID0gZ2V0Tm9kZXMoKVxuICAgIHNldFdvcmtmbG93UnVubmluZ0RhdGEocHJvZHVjZSh3b3JrZmxvd1J1bm5pbmdEYXRhISwgKGRyYWZ0KSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBkcmFmdC50cmFjaW5nIS5maW5kSW5kZXgoaXRlbSA9PiBpdGVtLmlkID09PSBkYXRhLmlkKVxuICAgICAgaWYgKGN1cnJlbnRJbmRleCA+IC0xKSB7XG4gICAgICAgIGRyYWZ0LnRyYWNpbmchW2N1cnJlbnRJbmRleF0gPSB7XG4gICAgICAgICAgLi4uZHJhZnQudHJhY2luZyFbY3VycmVudEluZGV4XSxcbiAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSkpXG5cbiAgICBjb25zdCBuZXdOb2RlcyA9IHByb2R1Y2Uobm9kZXMsIChkcmFmdCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBkcmFmdC5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gZGF0YS5ub2RlX2lkKSFcbiAgICAgIGN1cnJlbnROb2RlLmRhdGEuX3J1bm5pbmdTdGF0dXMgPSBkYXRhLnN0YXR1c1xuICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSBOb2RlUnVubmluZ1N0YXR1cy5FeGNlcHRpb24pIHtcbiAgICAgICAgaWYgKGRhdGEuZXhlY3V0aW9uX21ldGFkYXRhPy5lcnJvcl9zdHJhdGVneSA9PT0gRXJyb3JIYW5kbGVUeXBlRW51bS5mYWlsQnJhbmNoKVxuICAgICAgICAgIGN1cnJlbnROb2RlLmRhdGEuX3J1bm5pbmdCcmFuY2hJZCA9IEVycm9ySGFuZGxlVHlwZUVudW0uZmFpbEJyYW5jaFxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChkYXRhLm5vZGVfdHlwZSA9PT0gQmxvY2tFbnVtLklmRWxzZSlcbiAgICAgICAgICBjdXJyZW50Tm9kZS5kYXRhLl9ydW5uaW5nQnJhbmNoSWQgPSBkYXRhPy5vdXRwdXRzPy5zZWxlY3RlZF9jYXNlX2lkXG5cbiAgICAgICAgaWYgKGRhdGEubm9kZV90eXBlID09PSBCbG9ja0VudW0uUXVlc3Rpb25DbGFzc2lmaWVyKVxuICAgICAgICAgIGN1cnJlbnROb2RlLmRhdGEuX3J1bm5pbmdCcmFuY2hJZCA9IGRhdGE/Lm91dHB1dHM/LmNsYXNzX2lkXG4gICAgICB9XG4gICAgfSlcbiAgICBzZXROb2RlcyhuZXdOb2RlcylcbiAgICBjb25zdCBuZXdFZGdlcyA9IHByb2R1Y2UoZWRnZXMsIChkcmFmdCkgPT4ge1xuICAgICAgY29uc3QgaW5jb21lRWRnZXMgPSBkcmFmdC5maWx0ZXIoKGVkZ2UpID0+IHtcbiAgICAgICAgcmV0dXJuIGVkZ2UudGFyZ2V0ID09PSBkYXRhLm5vZGVfaWRcbiAgICAgIH0pXG4gICAgICBpbmNvbWVFZGdlcy5mb3JFYWNoKChlZGdlKSA9PiB7XG4gICAgICAgIGVkZ2UuZGF0YSA9IHtcbiAgICAgICAgICAuLi5lZGdlLmRhdGEsXG4gICAgICAgICAgX3RhcmdldFJ1bm5pbmdTdGF0dXM6IGRhdGEuc3RhdHVzLFxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG4gICAgc2V0RWRnZXMobmV3RWRnZXMpXG4gIH0sIFtzdG9yZSwgd29ya2Zsb3dTdG9yZV0pXG5cbiAgcmV0dXJuIHtcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVGaW5pc2hlZCxcbiAgfVxufVxuIl19