"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowNodeIterationNext = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const store_1 = require("@/app/components/workflow/store");
const useWorkflowNodeIterationNext = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const handleWorkflowNodeIterationNext = (0, react_1.useCallback)((params) => {
        const { iterTimes, setIterTimes, } = workflowStore.getState();
        const { data } = params;
        const { getNodes, setNodes, } = store.getState();
        const nodes = getNodes();
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            const currentNode = draft.find(node => node.id === data.node_id);
            currentNode.data._iterationIndex = iterTimes;
            setIterTimes(iterTimes + 1);
        });
        setNodes(newNodes);
    }, [workflowStore, store]);
    return {
        handleWorkflowNodeIterationNext,
    };
};
exports.useWorkflowNodeIterationNext = useWorkflowNodeIterationNext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LW5vZGUtaXRlcmF0aW9uLW5leHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utd29ya2Zsb3ctbm9kZS1pdGVyYXRpb24tbmV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBK0I7QUFDL0IsaUNBQW1DO0FBQ25DLHlDQUF1QztBQUN2QywyREFBa0U7QUFFM0QsTUFBTSw0QkFBNEIsR0FBRyxHQUFHLEVBQUU7SUFDL0MsTUFBTSxLQUFLLEdBQUcsSUFBQSx1QkFBVyxHQUFFLENBQUE7SUFDM0IsTUFBTSxhQUFhLEdBQUcsSUFBQSx3QkFBZ0IsR0FBRSxDQUFBO0lBRXhDLE1BQU0sK0JBQStCLEdBQUcsSUFBQSxtQkFBVyxFQUFDLENBQUMsTUFBNkIsRUFBRSxFQUFFO1FBQ3BGLE1BQU0sRUFDSixTQUFTLEVBQ1QsWUFBWSxHQUNiLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBRTVCLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUE7UUFDdkIsTUFBTSxFQUNKLFFBQVEsRUFDUixRQUFRLEdBQ1QsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUE7UUFFcEIsTUFBTSxLQUFLLEdBQUcsUUFBUSxFQUFFLENBQUE7UUFDeEIsTUFBTSxRQUFRLEdBQUcsSUFBQSxlQUFPLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDeEMsTUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBRSxDQUFBO1lBQ2pFLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQTtZQUM1QyxZQUFZLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzdCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3BCLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBRTFCLE9BQU87UUFDTCwrQkFBK0I7S0FDaEMsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQTVCWSxRQUFBLDRCQUE0QixnQ0E0QnhDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBJdGVyYXRpb25OZXh0UmVzcG9uc2UgfSBmcm9tICdAL3R5cGVzL3dvcmtmbG93J1xuaW1wb3J0IHsgcHJvZHVjZSB9IGZyb20gJ2ltbWVyJ1xuaW1wb3J0IHsgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVN0b3JlQXBpIH0gZnJvbSAncmVhY3RmbG93J1xuaW1wb3J0IHsgdXNlV29ya2Zsb3dTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5cbmV4cG9ydCBjb25zdCB1c2VXb3JrZmxvd05vZGVJdGVyYXRpb25OZXh0ID0gKCkgPT4ge1xuICBjb25zdCBzdG9yZSA9IHVzZVN0b3JlQXBpKClcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuXG4gIGNvbnN0IGhhbmRsZVdvcmtmbG93Tm9kZUl0ZXJhdGlvbk5leHQgPSB1c2VDYWxsYmFjaygocGFyYW1zOiBJdGVyYXRpb25OZXh0UmVzcG9uc2UpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBpdGVyVGltZXMsXG4gICAgICBzZXRJdGVyVGltZXMsXG4gICAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgY29uc3QgeyBkYXRhIH0gPSBwYXJhbXNcbiAgICBjb25zdCB7XG4gICAgICBnZXROb2RlcyxcbiAgICAgIHNldE5vZGVzLFxuICAgIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICBjb25zdCBub2RlcyA9IGdldE5vZGVzKClcbiAgICBjb25zdCBuZXdOb2RlcyA9IHByb2R1Y2Uobm9kZXMsIChkcmFmdCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBkcmFmdC5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gZGF0YS5ub2RlX2lkKSFcbiAgICAgIGN1cnJlbnROb2RlLmRhdGEuX2l0ZXJhdGlvbkluZGV4ID0gaXRlclRpbWVzXG4gICAgICBzZXRJdGVyVGltZXMoaXRlclRpbWVzICsgMSlcbiAgICB9KVxuICAgIHNldE5vZGVzKG5ld05vZGVzKVxuICB9LCBbd29ya2Zsb3dTdG9yZSwgc3RvcmVdKVxuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlV29ya2Zsb3dOb2RlSXRlcmF0aW9uTmV4dCxcbiAgfVxufVxuIl19