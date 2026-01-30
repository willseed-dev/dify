"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useWorkflowTextChunk = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const store_1 = require("@/app/components/workflow/store");
const useWorkflowTextChunk = () => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const handleWorkflowTextChunk = (0, react_1.useCallback)((params) => {
        const { data: { text } } = params;
        const { workflowRunningData, setWorkflowRunningData, } = workflowStore.getState();
        setWorkflowRunningData((0, immer_1.produce)(workflowRunningData, (draft) => {
            draft.resultTabActive = true;
            draft.resultText += text;
        }));
    }, [workflowStore]);
    return {
        handleWorkflowTextChunk,
    };
};
exports.useWorkflowTextChunk = useWorkflowTextChunk;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXdvcmtmbG93LXRleHQtY2h1bmsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1c2Utd29ya2Zsb3ctdGV4dC1jaHVuay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSxpQ0FBK0I7QUFDL0IsaUNBQW1DO0FBQ25DLDJEQUFrRTtBQUUzRCxNQUFNLG9CQUFvQixHQUFHLEdBQUcsRUFBRTtJQUN2QyxNQUFNLGFBQWEsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFFeEMsTUFBTSx1QkFBdUIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxNQUF5QixFQUFFLEVBQUU7UUFDeEUsTUFBTSxFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEdBQUcsTUFBTSxDQUFBO1FBQ2pDLE1BQU0sRUFDSixtQkFBbUIsRUFDbkIsc0JBQXNCLEdBQ3ZCLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBRTVCLHNCQUFzQixDQUFDLElBQUEsZUFBTyxFQUFDLG1CQUFvQixFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDN0QsS0FBSyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUE7WUFDNUIsS0FBSyxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUE7UUFDMUIsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNMLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUE7SUFFbkIsT0FBTztRQUNMLHVCQUF1QjtLQUN4QixDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBbkJZLFFBQUEsb0JBQW9CLHdCQW1CaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFRleHRDaHVua1Jlc3BvbnNlIH0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1N0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcblxuZXhwb3J0IGNvbnN0IHVzZVdvcmtmbG93VGV4dENodW5rID0gKCkgPT4ge1xuICBjb25zdCB3b3JrZmxvd1N0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpXG5cbiAgY29uc3QgaGFuZGxlV29ya2Zsb3dUZXh0Q2h1bmsgPSB1c2VDYWxsYmFjaygocGFyYW1zOiBUZXh0Q2h1bmtSZXNwb25zZSkgPT4ge1xuICAgIGNvbnN0IHsgZGF0YTogeyB0ZXh0IH0gfSA9IHBhcmFtc1xuICAgIGNvbnN0IHtcbiAgICAgIHdvcmtmbG93UnVubmluZ0RhdGEsXG4gICAgICBzZXRXb3JrZmxvd1J1bm5pbmdEYXRhLFxuICAgIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcblxuICAgIHNldFdvcmtmbG93UnVubmluZ0RhdGEocHJvZHVjZSh3b3JrZmxvd1J1bm5pbmdEYXRhISwgKGRyYWZ0KSA9PiB7XG4gICAgICBkcmFmdC5yZXN1bHRUYWJBY3RpdmUgPSB0cnVlXG4gICAgICBkcmFmdC5yZXN1bHRUZXh0ICs9IHRleHRcbiAgICB9KSlcbiAgfSwgW3dvcmtmbG93U3RvcmVdKVxuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlV29ya2Zsb3dUZXh0Q2h1bmssXG4gIH1cbn1cbiJdfQ==