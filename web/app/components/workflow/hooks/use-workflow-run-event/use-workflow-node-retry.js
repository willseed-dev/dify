"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowNodeRetry = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const store_1 = require("@/app/components/workflow/store");
const useWorkflowNodeRetry = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const handleWorkflowNodeRetry = (0, react_1.useCallback)((params) => {
        const { data } = params;
        const { workflowRunningData, setWorkflowRunningData, } = workflowStore.getState();
        const { getNodes, setNodes, } = store.getState();
        const nodes = getNodes();
        setWorkflowRunningData((0, immer_1.produce)(workflowRunningData, (draft) => {
            draft.tracing.push(data);
        }));
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            const currentNode = draft.find(node => node.id === data.node_id);
            currentNode.data._retryIndex = data.retry_index;
        });
        setNodes(newNodes);
    }, [workflowStore, store]);
    return {
        handleWorkflowNodeRetry,
    };
};
exports.useWorkflowNodeRetry = useWorkflowNodeRetry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LW5vZGUtcmV0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utd29ya2Zsb3ctbm9kZS1yZXRyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFHQSxpQ0FBK0I7QUFDL0IsaUNBQW1DO0FBQ25DLHlDQUF1QztBQUN2QywyREFBa0U7QUFFM0QsTUFBTSxvQkFBb0IsR0FBRyxHQUFHLEVBQUU7SUFDdkMsTUFBTSxLQUFLLEdBQUcsSUFBQSx1QkFBVyxHQUFFLENBQUE7SUFDM0IsTUFBTSxhQUFhLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBRXhDLE1BQU0sdUJBQXVCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsTUFBNEIsRUFBRSxFQUFFO1FBQzNFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUE7UUFDdkIsTUFBTSxFQUNKLG1CQUFtQixFQUNuQixzQkFBc0IsR0FDdkIsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDNUIsTUFBTSxFQUNKLFFBQVEsRUFDUixRQUFRLEdBQ1QsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUE7UUFFcEIsTUFBTSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUE7UUFDeEIsc0JBQXNCLENBQUMsSUFBQSxlQUFPLEVBQUMsbUJBQW9CLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUM3RCxLQUFLLENBQUMsT0FBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMzQixDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ0gsTUFBTSxRQUFRLEdBQUcsSUFBQSxlQUFPLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDeEMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBRSxDQUFBO1lBRWpFLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUE7UUFDakQsQ0FBQyxDQUFDLENBQUE7UUFDRixRQUFRLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDcEIsQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFFMUIsT0FBTztRQUNMLHVCQUF1QjtLQUN4QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBOUJZLFFBQUEsb0JBQW9CLHdCQThCaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIE5vZGVGaW5pc2hlZFJlc3BvbnNlLFxufSBmcm9tICdAL3R5cGVzL3dvcmtmbG93J1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVN0b3JlQXBpIH0gZnJvbSAncmVhY3RmbG93J1xuaW1wb3J0IHsgdXNlV29ya2Zsb3dTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5cbmV4cG9ydCBjb25zdCB1c2VXb3JrZmxvd05vZGVSZXRyeSA9ICgpID0+IHtcbiAgY29uc3Qgc3RvcmUgPSB1c2VTdG9yZUFwaSgpXG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcblxuICBjb25zdCBoYW5kbGVXb3JrZmxvd05vZGVSZXRyeSA9IHVzZUNhbGxiYWNrKChwYXJhbXM6IE5vZGVGaW5pc2hlZFJlc3BvbnNlKSA9PiB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBwYXJhbXNcbiAgICBjb25zdCB7XG4gICAgICB3b3JrZmxvd1J1bm5pbmdEYXRhLFxuICAgICAgc2V0V29ya2Zsb3dSdW5uaW5nRGF0YSxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3Qge1xuICAgICAgZ2V0Tm9kZXMsXG4gICAgICBzZXROb2RlcyxcbiAgICB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3Qgbm9kZXMgPSBnZXROb2RlcygpXG4gICAgc2V0V29ya2Zsb3dSdW5uaW5nRGF0YShwcm9kdWNlKHdvcmtmbG93UnVubmluZ0RhdGEhLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LnRyYWNpbmchLnB1c2goZGF0YSlcbiAgICB9KSlcbiAgICBjb25zdCBuZXdOb2RlcyA9IHByb2R1Y2Uobm9kZXMsIChkcmFmdCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBkcmFmdC5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gZGF0YS5ub2RlX2lkKSFcblxuICAgICAgY3VycmVudE5vZGUuZGF0YS5fcmV0cnlJbmRleCA9IGRhdGEucmV0cnlfaW5kZXhcbiAgICB9KVxuICAgIHNldE5vZGVzKG5ld05vZGVzKVxuICB9LCBbd29ya2Zsb3dTdG9yZSwgc3RvcmVdKVxuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlV29ya2Zsb3dOb2RlUmV0cnksXG4gIH1cbn1cbiJdfQ==