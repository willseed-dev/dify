"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEdgesInteractionsWithoutSync = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const useEdgesInteractionsWithoutSync = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const handleEdgeCancelRunningStatus = (0, react_1.useCallback)(() => {
        const { edges, setEdges, } = store.getState();
        const newEdges = (0, immer_1.produce)(edges, (draft) => {
            draft.forEach((edge) => {
                edge.data._sourceRunningStatus = undefined;
                edge.data._targetRunningStatus = undefined;
                edge.data._waitingRun = false;
            });
        });
        setEdges(newEdges);
    }, [store]);
    return {
        handleEdgeCancelRunningStatus,
    };
};
exports.useEdgesInteractionsWithoutSync = useEdgesInteractionsWithoutSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWVkZ2VzLWludGVyYWN0aW9ucy13aXRob3V0LXN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2UtZWRnZXMtaW50ZXJhY3Rpb25zLXdpdGhvdXQtc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBK0I7QUFDL0IsaUNBQW1DO0FBQ25DLHlDQUF1QztBQUVoQyxNQUFNLCtCQUErQixHQUFHLEdBQUcsRUFBRTtJQUNsRCxNQUFNLEtBQUssR0FBRyxJQUFBLHVCQUFXLEdBQUUsQ0FBQTtJQUUzQixNQUFNLDZCQUE2QixHQUFHLElBQUEsbUJBQVcsRUFBQyxHQUFHLEVBQUU7UUFDckQsTUFBTSxFQUNKLEtBQUssRUFDTCxRQUFRLEdBQ1QsR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUE7UUFFcEIsTUFBTSxRQUFRLEdBQUcsSUFBQSxlQUFPLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDeEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixHQUFHLFNBQVMsQ0FBQTtnQkFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxTQUFTLENBQUE7Z0JBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQTtZQUMvQixDQUFDLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQyxDQUFBO1FBQ0YsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3BCLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFFWCxPQUFPO1FBQ0wsNkJBQTZCO0tBQzlCLENBQUE7QUFDSCxDQUFDLENBQUE7QUF0QlksUUFBQSwrQkFBK0IsbUNBc0IzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VTdG9yZUFwaSB9IGZyb20gJ3JlYWN0ZmxvdydcblxuZXhwb3J0IGNvbnN0IHVzZUVkZ2VzSW50ZXJhY3Rpb25zV2l0aG91dFN5bmMgPSAoKSA9PiB7XG4gIGNvbnN0IHN0b3JlID0gdXNlU3RvcmVBcGkoKVxuXG4gIGNvbnN0IGhhbmRsZUVkZ2VDYW5jZWxSdW5uaW5nU3RhdHVzID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGVkZ2VzLFxuICAgICAgc2V0RWRnZXMsXG4gICAgfSA9IHN0b3JlLmdldFN0YXRlKClcblxuICAgIGNvbnN0IG5ld0VkZ2VzID0gcHJvZHVjZShlZGdlcywgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5mb3JFYWNoKChlZGdlKSA9PiB7XG4gICAgICAgIGVkZ2UuZGF0YS5fc291cmNlUnVubmluZ1N0YXR1cyA9IHVuZGVmaW5lZFxuICAgICAgICBlZGdlLmRhdGEuX3RhcmdldFJ1bm5pbmdTdGF0dXMgPSB1bmRlZmluZWRcbiAgICAgICAgZWRnZS5kYXRhLl93YWl0aW5nUnVuID0gZmFsc2VcbiAgICAgIH0pXG4gICAgfSlcbiAgICBzZXRFZGdlcyhuZXdFZGdlcylcbiAgfSwgW3N0b3JlXSlcblxuICByZXR1cm4ge1xuICAgIGhhbmRsZUVkZ2VDYW5jZWxSdW5uaW5nU3RhdHVzLFxuICB9XG59XG4iXX0=