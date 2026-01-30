"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowNodeLoopNext = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const types_1 = require("@/app/components/workflow/types");
const useWorkflowNodeLoopNext = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const handleWorkflowNodeLoopNext = (0, react_1.useCallback)((params) => {
        const { data } = params;
        const { getNodes, setNodes, } = store.getState();
        const nodes = getNodes();
        const newNodes = (0, immer_1.produce)(nodes, (draft) => {
            const currentNode = draft.find(node => node.id === data.node_id);
            currentNode.data._loopIndex = data.index;
            draft.forEach((node) => {
                if (node.parentId === data.node_id) {
                    node.data._waitingRun = true;
                    node.data._runningStatus = types_1.NodeRunningStatus.Waiting;
                }
            });
        });
        setNodes(newNodes);
    }, [store]);
    return {
        handleWorkflowNodeLoopNext,
    };
};
exports.useWorkflowNodeLoopNext = useWorkflowNodeLoopNext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LW5vZGUtbG9vcC1uZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlLXdvcmtmbG93LW5vZGUtbG9vcC1uZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLGlDQUErQjtBQUMvQixpQ0FBbUM7QUFDbkMseUNBQXVDO0FBQ3ZDLDJEQUFtRTtBQUU1RCxNQUFNLHVCQUF1QixHQUFHLEdBQUcsRUFBRTtJQUMxQyxNQUFNLEtBQUssR0FBRyxJQUFBLHVCQUFXLEdBQUUsQ0FBQTtJQUUzQixNQUFNLDBCQUEwQixHQUFHLElBQUEsbUJBQVcsRUFBQyxDQUFDLE1BQXdCLEVBQUUsRUFBRTtRQUMxRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsTUFBTSxDQUFBO1FBQ3ZCLE1BQU0sRUFDSixRQUFRLEVBQ1IsUUFBUSxHQUNULEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBRXBCLE1BQU0sS0FBSyxHQUFHLFFBQVEsRUFBRSxDQUFBO1FBQ3hCLE1BQU0sUUFBUSxHQUFHLElBQUEsZUFBTyxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ3hDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUUsQ0FBQTtZQUNqRSxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFBO1lBRXhDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDckIsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztvQkFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFBO29CQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyx5QkFBaUIsQ0FBQyxPQUFPLENBQUE7Z0JBQ3RELENBQUM7WUFDSCxDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0YsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3BCLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFFWCxPQUFPO1FBQ0wsMEJBQTBCO0tBQzNCLENBQUE7QUFDSCxDQUFDLENBQUE7QUE1QlksUUFBQSx1QkFBdUIsMkJBNEJuQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgTG9vcE5leHRSZXNwb25zZSB9IGZyb20gJ0AvdHlwZXMvd29ya2Zsb3cnXG5pbXBvcnQgeyBwcm9kdWNlIH0gZnJvbSAnaW1tZXInXG5pbXBvcnQgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlU3RvcmVBcGkgfSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQgeyBOb2RlUnVubmluZ1N0YXR1cyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5cbmV4cG9ydCBjb25zdCB1c2VXb3JrZmxvd05vZGVMb29wTmV4dCA9ICgpID0+IHtcbiAgY29uc3Qgc3RvcmUgPSB1c2VTdG9yZUFwaSgpXG5cbiAgY29uc3QgaGFuZGxlV29ya2Zsb3dOb2RlTG9vcE5leHQgPSB1c2VDYWxsYmFjaygocGFyYW1zOiBMb29wTmV4dFJlc3BvbnNlKSA9PiB7XG4gICAgY29uc3QgeyBkYXRhIH0gPSBwYXJhbXNcbiAgICBjb25zdCB7XG4gICAgICBnZXROb2RlcyxcbiAgICAgIHNldE5vZGVzLFxuICAgIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICBjb25zdCBub2RlcyA9IGdldE5vZGVzKClcbiAgICBjb25zdCBuZXdOb2RlcyA9IHByb2R1Y2Uobm9kZXMsIChkcmFmdCkgPT4ge1xuICAgICAgY29uc3QgY3VycmVudE5vZGUgPSBkcmFmdC5maW5kKG5vZGUgPT4gbm9kZS5pZCA9PT0gZGF0YS5ub2RlX2lkKSFcbiAgICAgIGN1cnJlbnROb2RlLmRhdGEuX2xvb3BJbmRleCA9IGRhdGEuaW5kZXhcblxuICAgICAgZHJhZnQuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICBpZiAobm9kZS5wYXJlbnRJZCA9PT0gZGF0YS5ub2RlX2lkKSB7XG4gICAgICAgICAgbm9kZS5kYXRhLl93YWl0aW5nUnVuID0gdHJ1ZVxuICAgICAgICAgIG5vZGUuZGF0YS5fcnVubmluZ1N0YXR1cyA9IE5vZGVSdW5uaW5nU3RhdHVzLldhaXRpbmdcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KVxuICAgIHNldE5vZGVzKG5ld05vZGVzKVxuICB9LCBbc3RvcmVdKVxuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlV29ya2Zsb3dOb2RlTG9vcE5leHQsXG4gIH1cbn1cbiJdfQ==