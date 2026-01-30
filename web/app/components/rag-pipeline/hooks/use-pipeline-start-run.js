"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePipelineStartRun = void 0;
const react_1 = require("react");
const hooks_1 = require("@/app/components/workflow/hooks");
const store_1 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
const _1 = require(".");
const usePipelineStartRun = () => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { handleCancelDebugAndPreviewPanel } = (0, hooks_1.useWorkflowInteractions)();
    const { doSyncWorkflowDraft } = (0, _1.useNodesSyncDraft)();
    const { closeAllInputFieldPanels } = (0, _1.useInputFieldPanel)();
    const handleWorkflowStartRunInWorkflow = (0, react_1.useCallback)(async () => {
        const { workflowRunningData, } = workflowStore.getState();
        if (workflowRunningData?.result.status === types_1.WorkflowRunningStatus.Running)
            return;
        const { isPreparingDataSource, setIsPreparingDataSource, showDebugAndPreviewPanel, setShowEnvPanel, setShowDebugAndPreviewPanel, } = workflowStore.getState();
        if (!isPreparingDataSource && workflowRunningData) {
            workflowStore.setState({
                isPreparingDataSource: true,
                workflowRunningData: undefined,
            });
            return;
        }
        setShowEnvPanel(false);
        closeAllInputFieldPanels();
        if (showDebugAndPreviewPanel) {
            setIsPreparingDataSource?.(false);
            handleCancelDebugAndPreviewPanel();
            return;
        }
        await doSyncWorkflowDraft();
        setIsPreparingDataSource?.(true);
        setShowDebugAndPreviewPanel(true);
    }, [workflowStore, handleCancelDebugAndPreviewPanel, doSyncWorkflowDraft]);
    const handleStartWorkflowRun = (0, react_1.useCallback)(() => {
        handleWorkflowStartRunInWorkflow();
    }, [handleWorkflowStartRunInWorkflow]);
    return {
        handleStartWorkflowRun,
        handleWorkflowStartRunInWorkflow,
    };
};
exports.usePipelineStartRun = usePipelineStartRun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXBpcGVsaW5lLXN0YXJ0LXJ1bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1waXBlbGluZS1zdGFydC1ydW4udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGlDQUFtQztBQUNuQywyREFBeUU7QUFDekUsMkRBQWtFO0FBQ2xFLDJEQUV3QztBQUN4Qyx3QkFHVTtBQUVILE1BQU0sbUJBQW1CLEdBQUcsR0FBRyxFQUFFO0lBQ3RDLE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUN4QyxNQUFNLEVBQUUsZ0NBQWdDLEVBQUUsR0FBRyxJQUFBLCtCQUF1QixHQUFFLENBQUE7SUFDdEUsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsSUFBQSxvQkFBaUIsR0FBRSxDQUFBO0lBQ25ELE1BQU0sRUFBRSx3QkFBd0IsRUFBRSxHQUFHLElBQUEscUJBQWtCLEdBQUUsQ0FBQTtJQUV6RCxNQUFNLGdDQUFnQyxHQUFHLElBQUEsbUJBQVcsRUFBQyxLQUFLLElBQUksRUFBRTtRQUM5RCxNQUFNLEVBQ0osbUJBQW1CLEdBQ3BCLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBRTVCLElBQUksbUJBQW1CLEVBQUUsTUFBTSxDQUFDLE1BQU0sS0FBSyw2QkFBcUIsQ0FBQyxPQUFPO1lBQ3RFLE9BQU07UUFFUixNQUFNLEVBQ0oscUJBQXFCLEVBQ3JCLHdCQUF3QixFQUN4Qix3QkFBd0IsRUFDeEIsZUFBZSxFQUNmLDJCQUEyQixHQUM1QixHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUU1QixJQUFJLENBQUMscUJBQXFCLElBQUksbUJBQW1CLEVBQUUsQ0FBQztZQUNsRCxhQUFhLENBQUMsUUFBUSxDQUFDO2dCQUNyQixxQkFBcUIsRUFBRSxJQUFJO2dCQUMzQixtQkFBbUIsRUFBRSxTQUFTO2FBQy9CLENBQUMsQ0FBQTtZQUNGLE9BQU07UUFDUixDQUFDO1FBRUQsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3RCLHdCQUF3QixFQUFFLENBQUE7UUFFMUIsSUFBSSx3QkFBd0IsRUFBRSxDQUFDO1lBQzdCLHdCQUF3QixFQUFFLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDakMsZ0NBQWdDLEVBQUUsQ0FBQTtZQUNsQyxPQUFNO1FBQ1IsQ0FBQztRQUVELE1BQU0sbUJBQW1CLEVBQUUsQ0FBQTtRQUMzQix3QkFBd0IsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQ2hDLDJCQUEyQixDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ25DLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxnQ0FBZ0MsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUE7SUFFMUUsTUFBTSxzQkFBc0IsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQzlDLGdDQUFnQyxFQUFFLENBQUE7SUFDcEMsQ0FBQyxFQUFFLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxDQUFBO0lBRXRDLE9BQU87UUFDTCxzQkFBc0I7UUFDdEIsZ0NBQWdDO0tBQ2pDLENBQUE7QUFDSCxDQUFDLENBQUE7QUFwRFksUUFBQSxtQkFBbUIsdUJBb0QvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd0ludGVyYWN0aW9ucyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3MnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1N0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcbmltcG9ydCB7XG4gIFdvcmtmbG93UnVubmluZ1N0YXR1cyxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7XG4gIHVzZUlucHV0RmllbGRQYW5lbCxcbiAgdXNlTm9kZXNTeW5jRHJhZnQsXG59IGZyb20gJy4nXG5cbmV4cG9ydCBjb25zdCB1c2VQaXBlbGluZVN0YXJ0UnVuID0gKCkgPT4ge1xuICBjb25zdCB3b3JrZmxvd1N0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpXG4gIGNvbnN0IHsgaGFuZGxlQ2FuY2VsRGVidWdBbmRQcmV2aWV3UGFuZWwgfSA9IHVzZVdvcmtmbG93SW50ZXJhY3Rpb25zKClcbiAgY29uc3QgeyBkb1N5bmNXb3JrZmxvd0RyYWZ0IH0gPSB1c2VOb2Rlc1N5bmNEcmFmdCgpXG4gIGNvbnN0IHsgY2xvc2VBbGxJbnB1dEZpZWxkUGFuZWxzIH0gPSB1c2VJbnB1dEZpZWxkUGFuZWwoKVxuXG4gIGNvbnN0IGhhbmRsZVdvcmtmbG93U3RhcnRSdW5JbldvcmtmbG93ID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIHdvcmtmbG93UnVubmluZ0RhdGEsXG4gICAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgaWYgKHdvcmtmbG93UnVubmluZ0RhdGE/LnJlc3VsdC5zdGF0dXMgPT09IFdvcmtmbG93UnVubmluZ1N0YXR1cy5SdW5uaW5nKVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCB7XG4gICAgICBpc1ByZXBhcmluZ0RhdGFTb3VyY2UsXG4gICAgICBzZXRJc1ByZXBhcmluZ0RhdGFTb3VyY2UsXG4gICAgICBzaG93RGVidWdBbmRQcmV2aWV3UGFuZWwsXG4gICAgICBzZXRTaG93RW52UGFuZWwsXG4gICAgICBzZXRTaG93RGVidWdBbmRQcmV2aWV3UGFuZWwsXG4gICAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgaWYgKCFpc1ByZXBhcmluZ0RhdGFTb3VyY2UgJiYgd29ya2Zsb3dSdW5uaW5nRGF0YSkge1xuICAgICAgd29ya2Zsb3dTdG9yZS5zZXRTdGF0ZSh7XG4gICAgICAgIGlzUHJlcGFyaW5nRGF0YVNvdXJjZTogdHJ1ZSxcbiAgICAgICAgd29ya2Zsb3dSdW5uaW5nRGF0YTogdW5kZWZpbmVkLFxuICAgICAgfSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNldFNob3dFbnZQYW5lbChmYWxzZSlcbiAgICBjbG9zZUFsbElucHV0RmllbGRQYW5lbHMoKVxuXG4gICAgaWYgKHNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbCkge1xuICAgICAgc2V0SXNQcmVwYXJpbmdEYXRhU291cmNlPy4oZmFsc2UpXG4gICAgICBoYW5kbGVDYW5jZWxEZWJ1Z0FuZFByZXZpZXdQYW5lbCgpXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBhd2FpdCBkb1N5bmNXb3JrZmxvd0RyYWZ0KClcbiAgICBzZXRJc1ByZXBhcmluZ0RhdGFTb3VyY2U/Lih0cnVlKVxuICAgIHNldFNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbCh0cnVlKVxuICB9LCBbd29ya2Zsb3dTdG9yZSwgaGFuZGxlQ2FuY2VsRGVidWdBbmRQcmV2aWV3UGFuZWwsIGRvU3luY1dvcmtmbG93RHJhZnRdKVxuXG4gIGNvbnN0IGhhbmRsZVN0YXJ0V29ya2Zsb3dSdW4gPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgaGFuZGxlV29ya2Zsb3dTdGFydFJ1bkluV29ya2Zsb3coKVxuICB9LCBbaGFuZGxlV29ya2Zsb3dTdGFydFJ1bkluV29ya2Zsb3ddKVxuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlU3RhcnRXb3JrZmxvd1J1bixcbiAgICBoYW5kbGVXb3JrZmxvd1N0YXJ0UnVuSW5Xb3JrZmxvdyxcbiAgfVxufVxuIl19