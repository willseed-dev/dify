"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePipelineRun = void 0;
const immer_1 = require("immer");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const use_fetch_workflow_inspect_vars_1 = require("@/app/components/workflow/hooks/use-fetch-workflow-inspect-vars");
const use_workflow_interactions_1 = require("@/app/components/workflow/hooks/use-workflow-interactions");
const use_workflow_run_event_1 = require("@/app/components/workflow/hooks/use-workflow-run-event/use-workflow-run-event");
const store_1 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
const base_1 = require("@/service/base");
const use_workflow_1 = require("@/service/use-workflow");
const workflow_1 = require("@/service/workflow");
const common_1 = require("@/types/common");
const use_nodes_sync_draft_1 = require("./use-nodes-sync-draft");
const usePipelineRun = () => {
    const store = (0, reactflow_1.useStoreApi)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const reactflow = (0, reactflow_1.useReactFlow)();
    const { doSyncWorkflowDraft } = (0, use_nodes_sync_draft_1.useNodesSyncDraft)();
    const { handleUpdateWorkflowCanvas } = (0, use_workflow_interactions_1.useWorkflowUpdate)();
    const { handleWorkflowStarted, handleWorkflowFinished, handleWorkflowFailed, handleWorkflowNodeStarted, handleWorkflowNodeFinished, handleWorkflowNodeIterationStarted, handleWorkflowNodeIterationNext, handleWorkflowNodeIterationFinished, handleWorkflowNodeLoopStarted, handleWorkflowNodeLoopNext, handleWorkflowNodeLoopFinished, handleWorkflowNodeRetry, handleWorkflowAgentLog, handleWorkflowTextChunk, handleWorkflowTextReplace, } = (0, use_workflow_run_event_1.useWorkflowRunEvent)();
    const handleBackupDraft = (0, react_1.useCallback)(() => {
        const { getNodes, edges, } = store.getState();
        const { getViewport } = reactflow;
        const { backupDraft, setBackupDraft, environmentVariables, } = workflowStore.getState();
        if (!backupDraft) {
            setBackupDraft({
                nodes: getNodes(),
                edges,
                viewport: getViewport(),
                environmentVariables,
            });
            doSyncWorkflowDraft();
        }
    }, [reactflow, workflowStore, store, doSyncWorkflowDraft]);
    const handleLoadBackupDraft = (0, react_1.useCallback)(() => {
        const { backupDraft, setBackupDraft, setEnvironmentVariables, } = workflowStore.getState();
        if (backupDraft) {
            const { nodes, edges, viewport, environmentVariables, } = backupDraft;
            handleUpdateWorkflowCanvas({
                nodes,
                edges,
                viewport,
            });
            setEnvironmentVariables(environmentVariables);
            setBackupDraft(undefined);
        }
    }, [handleUpdateWorkflowCanvas, workflowStore]);
    const pipelineId = (0, store_1.useStore)(s => s.pipelineId);
    const invalidAllLastRun = (0, use_workflow_1.useInvalidAllLastRun)(common_1.FlowType.ragPipeline, pipelineId);
    const { fetchInspectVars } = (0, use_fetch_workflow_inspect_vars_1.useSetWorkflowVarsWithValue)({
        flowType: common_1.FlowType.ragPipeline,
        flowId: pipelineId,
    });
    const handleRun = (0, react_1.useCallback)(async (params, callback) => {
        const { getNodes, setNodes, } = store.getState();
        const newNodes = (0, immer_1.produce)(getNodes(), (draft) => {
            draft.forEach((node) => {
                node.data.selected = false;
                node.data._runningStatus = undefined;
            });
        });
        setNodes(newNodes);
        await doSyncWorkflowDraft();
        const { onWorkflowStarted, onWorkflowFinished, onNodeStarted, onNodeFinished, onIterationStart, onIterationNext, onIterationFinish, onLoopStart, onLoopNext, onLoopFinish, onNodeRetry, onAgentLog, onError, ...restCallback } = callback || {};
        const { pipelineId } = workflowStore.getState();
        workflowStore.setState({ historyWorkflowData: undefined });
        const workflowContainer = document.getElementById('workflow-container');
        const { clientWidth, clientHeight, } = workflowContainer;
        const url = `/rag/pipelines/${pipelineId}/workflows/draft/run`;
        const { setWorkflowRunningData, } = workflowStore.getState();
        setWorkflowRunningData({
            result: {
                inputs_truncated: false,
                process_data_truncated: false,
                outputs_truncated: false,
                status: types_1.WorkflowRunningStatus.Running,
            },
            tracing: [],
            resultText: '',
        });
        (0, base_1.ssePost)(url, {
            body: params,
        }, {
            onWorkflowStarted: (params) => {
                handleWorkflowStarted(params);
                if (onWorkflowStarted)
                    onWorkflowStarted(params);
            },
            onWorkflowFinished: (params) => {
                handleWorkflowFinished(params);
                fetchInspectVars({});
                invalidAllLastRun();
                if (onWorkflowFinished)
                    onWorkflowFinished(params);
            },
            onError: (params) => {
                handleWorkflowFailed();
                if (onError)
                    onError(params);
            },
            onNodeStarted: (params) => {
                handleWorkflowNodeStarted(params, {
                    clientWidth,
                    clientHeight,
                });
                if (onNodeStarted)
                    onNodeStarted(params);
            },
            onNodeFinished: (params) => {
                handleWorkflowNodeFinished(params);
                if (onNodeFinished)
                    onNodeFinished(params);
            },
            onIterationStart: (params) => {
                handleWorkflowNodeIterationStarted(params, {
                    clientWidth,
                    clientHeight,
                });
                if (onIterationStart)
                    onIterationStart(params);
            },
            onIterationNext: (params) => {
                handleWorkflowNodeIterationNext(params);
                if (onIterationNext)
                    onIterationNext(params);
            },
            onIterationFinish: (params) => {
                handleWorkflowNodeIterationFinished(params);
                if (onIterationFinish)
                    onIterationFinish(params);
            },
            onLoopStart: (params) => {
                handleWorkflowNodeLoopStarted(params, {
                    clientWidth,
                    clientHeight,
                });
                if (onLoopStart)
                    onLoopStart(params);
            },
            onLoopNext: (params) => {
                handleWorkflowNodeLoopNext(params);
                if (onLoopNext)
                    onLoopNext(params);
            },
            onLoopFinish: (params) => {
                handleWorkflowNodeLoopFinished(params);
                if (onLoopFinish)
                    onLoopFinish(params);
            },
            onNodeRetry: (params) => {
                handleWorkflowNodeRetry(params);
                if (onNodeRetry)
                    onNodeRetry(params);
            },
            onAgentLog: (params) => {
                handleWorkflowAgentLog(params);
                if (onAgentLog)
                    onAgentLog(params);
            },
            onTextChunk: (params) => {
                handleWorkflowTextChunk(params);
            },
            onTextReplace: (params) => {
                handleWorkflowTextReplace(params);
            },
            ...restCallback,
        });
    }, [
        store,
        workflowStore,
        doSyncWorkflowDraft,
        handleWorkflowStarted,
        handleWorkflowFinished,
        handleWorkflowFailed,
        handleWorkflowNodeStarted,
        handleWorkflowNodeFinished,
        handleWorkflowNodeIterationStarted,
        handleWorkflowNodeIterationNext,
        handleWorkflowNodeIterationFinished,
        handleWorkflowNodeLoopStarted,
        handleWorkflowNodeLoopNext,
        handleWorkflowNodeLoopFinished,
        handleWorkflowNodeRetry,
        handleWorkflowTextChunk,
        handleWorkflowTextReplace,
        handleWorkflowAgentLog,
    ]);
    const handleStopRun = (0, react_1.useCallback)((taskId) => {
        const { pipelineId } = workflowStore.getState();
        (0, workflow_1.stopWorkflowRun)(`/rag/pipelines/${pipelineId}/workflow-runs/tasks/${taskId}/stop`);
    }, [workflowStore]);
    const handleRestoreFromPublishedWorkflow = (0, react_1.useCallback)((publishedWorkflow) => {
        const nodes = publishedWorkflow.graph.nodes.map(node => ({ ...node, selected: false, data: { ...node.data, selected: false } }));
        const edges = publishedWorkflow.graph.edges;
        const viewport = publishedWorkflow.graph.viewport;
        handleUpdateWorkflowCanvas({
            nodes,
            edges,
            viewport,
        });
        workflowStore.getState().setEnvironmentVariables(publishedWorkflow.environment_variables || []);
        workflowStore.getState().setRagPipelineVariables?.(publishedWorkflow.rag_pipeline_variables || []);
    }, [handleUpdateWorkflowCanvas, workflowStore]);
    return {
        handleBackupDraft,
        handleLoadBackupDraft,
        handleRun,
        handleStopRun,
        handleRestoreFromPublishedWorkflow,
    };
};
exports.usePipelineRun = usePipelineRun;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLXBpcGVsaW5lLXJ1bi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1waXBlbGluZS1ydW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsaUNBQStCO0FBQy9CLGlDQUFtQztBQUNuQyx5Q0FHa0I7QUFDbEIscUhBQTZHO0FBQzdHLHlHQUE2RjtBQUM3RiwwSEFBbUg7QUFDbkgsMkRBQTRFO0FBQzVFLDJEQUF1RTtBQUN2RSx5Q0FBd0M7QUFDeEMseURBQTZEO0FBQzdELGlEQUFvRDtBQUNwRCwyQ0FBeUM7QUFDekMsaUVBQTBEO0FBRW5ELE1BQU0sY0FBYyxHQUFHLEdBQUcsRUFBRTtJQUNqQyxNQUFNLEtBQUssR0FBRyxJQUFBLHVCQUFXLEdBQUUsQ0FBQTtJQUMzQixNQUFNLGFBQWEsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFDeEMsTUFBTSxTQUFTLEdBQUcsSUFBQSx3QkFBWSxHQUFFLENBQUE7SUFDaEMsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsSUFBQSx3Q0FBaUIsR0FBRSxDQUFBO0lBQ25ELE1BQU0sRUFBRSwwQkFBMEIsRUFBRSxHQUFHLElBQUEsNkNBQWlCLEdBQUUsQ0FBQTtJQUUxRCxNQUFNLEVBQ0oscUJBQXFCLEVBQ3JCLHNCQUFzQixFQUN0QixvQkFBb0IsRUFDcEIseUJBQXlCLEVBQ3pCLDBCQUEwQixFQUMxQixrQ0FBa0MsRUFDbEMsK0JBQStCLEVBQy9CLG1DQUFtQyxFQUNuQyw2QkFBNkIsRUFDN0IsMEJBQTBCLEVBQzFCLDhCQUE4QixFQUM5Qix1QkFBdUIsRUFDdkIsc0JBQXNCLEVBQ3RCLHVCQUF1QixFQUN2Qix5QkFBeUIsR0FDMUIsR0FBRyxJQUFBLDRDQUFtQixHQUFFLENBQUE7SUFFekIsTUFBTSxpQkFBaUIsR0FBRyxJQUFBLG1CQUFXLEVBQUMsR0FBRyxFQUFFO1FBQ3pDLE1BQU0sRUFDSixRQUFRLEVBQ1IsS0FBSyxHQUNOLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFB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c0JBQXNCLElBQUksRUFBRSxDQUFDLENBQUE7SUFDcEcsQ0FBQyxFQUFFLENBQUMsMEJBQTBCLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQTtJQUUvQyxPQUFPO1FBQ0wsaUJBQWlCO1FBQ2pCLHFCQUFxQjtRQUNyQixTQUFTO1FBQ1QsYUFBYTtRQUNiLGtDQUFrQztLQUNuQyxDQUFBO0FBQ0gsQ0FBQyxDQUFBO0FBMVNZLFFBQUEsY0FBYyxrQkEwUzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBJT3RoZXJPcHRpb25zIH0gZnJvbSAnQC9zZXJ2aWNlL2Jhc2UnXG5pbXBvcnQgdHlwZSB7IFZlcnNpb25IaXN0b3J5IH0gZnJvbSAnQC90eXBlcy93b3JrZmxvdydcbmltcG9ydCB7IHByb2R1Y2UgfSBmcm9tICdpbW1lcidcbmltcG9ydCB7IHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnXG5pbXBvcnQge1xuICB1c2VSZWFjdEZsb3csXG4gIHVzZVN0b3JlQXBpLFxufSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQgeyB1c2VTZXRXb3JrZmxvd1ZhcnNXaXRoVmFsdWUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzL3VzZS1mZXRjaC13b3JrZmxvdy1pbnNwZWN0LXZhcnMnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1VwZGF0ZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvaG9va3MvdXNlLXdvcmtmbG93LWludGVyYWN0aW9ucydcbmltcG9ydCB7IHVzZVdvcmtmbG93UnVuRXZlbnQgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzL3VzZS13b3JrZmxvdy1ydW4tZXZlbnQvdXNlLXdvcmtmbG93LXJ1bi1ldmVudCdcbmltcG9ydCB7IHVzZVN0b3JlLCB1c2VXb3JrZmxvd1N0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcbmltcG9ydCB7IFdvcmtmbG93UnVubmluZ1N0YXR1cyB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBzc2VQb3N0IH0gZnJvbSAnQC9zZXJ2aWNlL2Jhc2UnXG5pbXBvcnQgeyB1c2VJbnZhbGlkQWxsTGFzdFJ1biB9IGZyb20gJ0Avc2VydmljZS91c2Utd29ya2Zsb3cnXG5pbXBvcnQgeyBzdG9wV29ya2Zsb3dSdW4gfSBmcm9tICdAL3NlcnZpY2Uvd29ya2Zsb3cnXG5pbXBvcnQgeyBGbG93VHlwZSB9IGZyb20gJ0AvdHlwZXMvY29tbW9uJ1xuaW1wb3J0IHsgdXNlTm9kZXNTeW5jRHJhZnQgfSBmcm9tICcuL3VzZS1ub2Rlcy1zeW5jLWRyYWZ0J1xuXG5leHBvcnQgY29uc3QgdXNlUGlwZWxpbmVSdW4gPSAoKSA9PiB7XG4gIGNvbnN0IHN0b3JlID0gdXNlU3RvcmVBcGkoKVxuICBjb25zdCB3b3JrZmxvd1N0b3JlID0gdXNlV29ya2Zsb3dTdG9yZSgpXG4gIGNvbnN0IHJlYWN0ZmxvdyA9IHVzZVJlYWN0RmxvdygpXG4gIGNvbnN0IHsgZG9TeW5jV29ya2Zsb3dEcmFmdCB9ID0gdXNlTm9kZXNTeW5jRHJhZnQoKVxuICBjb25zdCB7IGhhbmRsZVVwZGF0ZVdvcmtmbG93Q2FudmFzIH0gPSB1c2VXb3JrZmxvd1VwZGF0ZSgpXG5cbiAgY29uc3Qge1xuICAgIGhhbmRsZVdvcmtmbG93U3RhcnRlZCxcbiAgICBoYW5kbGVXb3JrZmxvd0ZpbmlzaGVkLFxuICAgIGhhbmRsZVdvcmtmbG93RmFpbGVkLFxuICAgIGhhbmRsZVdvcmtmbG93Tm9kZVN0YXJ0ZWQsXG4gICAgaGFuZGxlV29ya2Zsb3dOb2RlRmluaXNoZWQsXG4gICAgaGFuZGxlV29ya2Zsb3dOb2RlSXRlcmF0aW9uU3RhcnRlZCxcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVJdGVyYXRpb25OZXh0LFxuICAgIGhhbmRsZVdvcmtmbG93Tm9kZUl0ZXJhdGlvbkZpbmlzaGVkLFxuICAgIGhhbmRsZVdvcmtmbG93Tm9kZUxvb3BTdGFydGVkLFxuICAgIGhhbmRsZVdvcmtmbG93Tm9kZUxvb3BOZXh0LFxuICAgIGhhbmRsZVdvcmtmbG93Tm9kZUxvb3BGaW5pc2hlZCxcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVSZXRyeSxcbiAgICBoYW5kbGVXb3JrZmxvd0FnZW50TG9nLFxuICAgIGhhbmRsZVdvcmtmbG93VGV4dENodW5rLFxuICAgIGhhbmRsZVdvcmtmbG93VGV4dFJlcGxhY2UsXG4gIH0gPSB1c2VXb3JrZmxvd1J1bkV2ZW50KClcblxuICBjb25zdCBoYW5kbGVCYWNrdXBEcmFmdCA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICBnZXROb2RlcyxcbiAgICAgIGVkZ2VzLFxuICAgIH0gPSBzdG9yZS5nZXRTdGF0ZSgpXG4gICAgY29uc3QgeyBnZXRWaWV3cG9ydCB9ID0gcmVhY3RmbG93XG4gICAgY29uc3Qge1xuICAgICAgYmFja3VwRHJhZnQsXG4gICAgICBzZXRCYWNrdXBEcmFmdCxcbiAgICAgIGVudmlyb25tZW50VmFyaWFibGVzLFxuICAgIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcblxuICAgIGlmICghYmFja3VwRHJhZnQpIHtcbiAgICAgIHNldEJhY2t1cERyYWZ0KHtcbiAgICAgICAgbm9kZXM6IGdldE5vZGVzKCksXG4gICAgICAgIGVkZ2VzLFxuICAgICAgICB2aWV3cG9ydDogZ2V0Vmlld3BvcnQoKSxcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXMsXG4gICAgICB9KVxuICAgICAgZG9TeW5jV29ya2Zsb3dEcmFmdCgpXG4gICAgfVxuICB9LCBbcmVhY3RmbG93LCB3b3JrZmxvd1N0b3JlLCBzdG9yZSwgZG9TeW5jV29ya2Zsb3dEcmFmdF0pXG5cbiAgY29uc3QgaGFuZGxlTG9hZEJhY2t1cERyYWZ0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgIGJhY2t1cERyYWZ0LFxuICAgICAgc2V0QmFja3VwRHJhZnQsXG4gICAgICBzZXRFbnZpcm9ubWVudFZhcmlhYmxlcyxcbiAgICB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG5cbiAgICBpZiAoYmFja3VwRHJhZnQpIHtcbiAgICAgIGNvbnN0IHtcbiAgICAgICAgbm9kZXMsXG4gICAgICAgIGVkZ2VzLFxuICAgICAgICB2aWV3cG9ydCxcbiAgICAgICAgZW52aXJvbm1lbnRWYXJpYWJsZXMsXG4gICAgICB9ID0gYmFja3VwRHJhZnRcbiAgICAgIGhhbmRsZVVwZGF0ZVdvcmtmbG93Q2FudmFzKHtcbiAgICAgICAgbm9kZXMsXG4gICAgICAgIGVkZ2VzLFxuICAgICAgICB2aWV3cG9ydCxcbiAgICAgIH0pXG4gICAgICBzZXRFbnZpcm9ubWVudFZhcmlhYmxlcyhlbnZpcm9ubWVudFZhcmlhYmxlcylcbiAgICAgIHNldEJhY2t1cERyYWZ0KHVuZGVmaW5lZClcbiAgICB9XG4gIH0sIFtoYW5kbGVVcGRhdGVXb3JrZmxvd0NhbnZhcywgd29ya2Zsb3dTdG9yZV0pXG5cbiAgY29uc3QgcGlwZWxpbmVJZCA9IHVzZVN0b3JlKHMgPT4gcy5waXBlbGluZUlkKVxuICBjb25zdCBpbnZhbGlkQWxsTGFzdFJ1biA9IHVzZUludmFsaWRBbGxMYXN0UnVuKEZsb3dUeXBlLnJhZ1BpcGVsaW5lLCBwaXBlbGluZUlkKVxuICBjb25zdCB7IGZldGNoSW5zcGVjdFZhcnMgfSA9IHVzZVNldFdvcmtmbG93VmFyc1dpdGhWYWx1ZSh7XG4gICAgZmxvd1R5cGU6IEZsb3dUeXBlLnJhZ1BpcGVsaW5lLFxuICAgIGZsb3dJZDogcGlwZWxpbmVJZCEsXG4gIH0pXG5cbiAgY29uc3QgaGFuZGxlUnVuID0gdXNlQ2FsbGJhY2soYXN5bmMgKFxuICAgIHBhcmFtczogYW55LFxuICAgIGNhbGxiYWNrPzogSU90aGVyT3B0aW9ucyxcbiAgKSA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgZ2V0Tm9kZXMsXG4gICAgICBzZXROb2RlcyxcbiAgICB9ID0gc3RvcmUuZ2V0U3RhdGUoKVxuICAgIGNvbnN0IG5ld05vZGVzID0gcHJvZHVjZShnZXROb2RlcygpLCAoZHJhZnQpID0+IHtcbiAgICAgIGRyYWZ0LmZvckVhY2goKG5vZGUpID0+IHtcbiAgICAgICAgbm9kZS5kYXRhLnNlbGVjdGVkID0gZmFsc2VcbiAgICAgICAgbm9kZS5kYXRhLl9ydW5uaW5nU3RhdHVzID0gdW5kZWZpbmVkXG4gICAgICB9KVxuICAgIH0pXG4gICAgc2V0Tm9kZXMobmV3Tm9kZXMpXG4gICAgYXdhaXQgZG9TeW5jV29ya2Zsb3dEcmFmdCgpXG5cbiAgICBjb25zdCB7XG4gICAgICBvbldvcmtmbG93U3RhcnRlZCxcbiAgICAgIG9uV29ya2Zsb3dGaW5pc2hlZCxcbiAgICAgIG9uTm9kZVN0YXJ0ZWQsXG4gICAgICBvbk5vZGVGaW5pc2hlZCxcbiAgICAgIG9uSXRlcmF0aW9uU3RhcnQsXG4gICAgICBvbkl0ZXJhdGlvbk5leHQsXG4gICAgICBvbkl0ZXJhdGlvbkZpbmlzaCxcbiAgICAgIG9uTG9vcFN0YXJ0LFxuICAgICAgb25Mb29wTmV4dCxcbiAgICAgIG9uTG9vcEZpbmlzaCxcbiAgICAgIG9uTm9kZVJldHJ5LFxuICAgICAgb25BZ2VudExvZyxcbiAgICAgIG9uRXJyb3IsXG4gICAgICAuLi5yZXN0Q2FsbGJhY2tcbiAgICB9ID0gY2FsbGJhY2sgfHwge31cbiAgICBjb25zdCB7IHBpcGVsaW5lSWQgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoeyBoaXN0b3J5V29ya2Zsb3dEYXRhOiB1bmRlZmluZWQgfSlcbiAgICBjb25zdCB3b3JrZmxvd0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3b3JrZmxvdy1jb250YWluZXInKVxuXG4gICAgY29uc3Qge1xuICAgICAgY2xpZW50V2lkdGgsXG4gICAgICBjbGllbnRIZWlnaHQsXG4gICAgfSA9IHdvcmtmbG93Q29udGFpbmVyIVxuXG4gICAgY29uc3QgdXJsID0gYC9yYWcvcGlwZWxpbmVzLyR7cGlwZWxpbmVJZH0vd29ya2Zsb3dzL2RyYWZ0L3J1bmBcblxuICAgIGNvbnN0IHtcbiAgICAgIHNldFdvcmtmbG93UnVubmluZ0RhdGEsXG4gICAgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICAgIHNldFdvcmtmbG93UnVubmluZ0RhdGEoe1xuICAgICAgcmVzdWx0OiB7XG4gICAgICAgIGlucHV0c190cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICBwcm9jZXNzX2RhdGFfdHJ1bmNhdGVkOiBmYWxzZSxcbiAgICAgICAgb3V0cHV0c190cnVuY2F0ZWQ6IGZhbHNlLFxuICAgICAgICBzdGF0dXM6IFdvcmtmbG93UnVubmluZ1N0YXR1cy5SdW5uaW5nLFxuICAgICAgfSxcbiAgICAgIHRyYWNpbmc6IFtdLFxuICAgICAgcmVzdWx0VGV4dDogJycsXG4gICAgfSlcblxuICAgIHNzZVBvc3QoXG4gICAgICB1cmwsXG4gICAgICB7XG4gICAgICAgIGJvZHk6IHBhcmFtcyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG9uV29ya2Zsb3dTdGFydGVkOiAocGFyYW1zKSA9PiB7XG4gICAgICAgICAgaGFuZGxlV29ya2Zsb3dTdGFydGVkKHBhcmFtcylcblxuICAgICAgICAgIGlmIChvbldvcmtmbG93U3RhcnRlZClcbiAgICAgICAgICAgIG9uV29ya2Zsb3dTdGFydGVkKHBhcmFtcylcbiAgICAgICAgfSxcbiAgICAgICAgb25Xb3JrZmxvd0ZpbmlzaGVkOiAocGFyYW1zKSA9PiB7XG4gICAgICAgICAgaGFuZGxlV29ya2Zsb3dGaW5pc2hlZChwYXJhbXMpXG4gICAgICAgICAgZmV0Y2hJbnNwZWN0VmFycyh7fSlcbiAgICAgICAgICBpbnZhbGlkQWxsTGFzdFJ1bigpXG5cbiAgICAgICAgICBpZiAob25Xb3JrZmxvd0ZpbmlzaGVkKVxuICAgICAgICAgICAgb25Xb3JrZmxvd0ZpbmlzaGVkKHBhcmFtcylcbiAgICAgICAgfSxcbiAgICAgICAgb25FcnJvcjogKHBhcmFtcykgPT4ge1xuICAgICAgICAgIGhhbmRsZVdvcmtmbG93RmFpbGVkKClcblxuICAgICAgICAgIGlmIChvbkVycm9yKVxuICAgICAgICAgICAgb25FcnJvcihwYXJhbXMpXG4gICAgICAgIH0sXG4gICAgICAgIG9uTm9kZVN0YXJ0ZWQ6IChwYXJhbXMpID0+IHtcbiAgICAgICAgICBoYW5kbGVXb3JrZmxvd05vZGVTdGFydGVkKFxuICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjbGllbnRXaWR0aCxcbiAgICAgICAgICAgICAgY2xpZW50SGVpZ2h0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApXG5cbiAgICAgICAgICBpZiAob25Ob2RlU3RhcnRlZClcbiAgICAgICAgICAgIG9uTm9kZVN0YXJ0ZWQocGFyYW1zKVxuICAgICAgICB9LFxuICAgICAgICBvbk5vZGVGaW5pc2hlZDogKHBhcmFtcykgPT4ge1xuICAgICAgICAgIGhhbmRsZVdvcmtmbG93Tm9kZUZpbmlzaGVkKHBhcmFtcylcblxuICAgICAgICAgIGlmIChvbk5vZGVGaW5pc2hlZClcbiAgICAgICAgICAgIG9uTm9kZUZpbmlzaGVkKHBhcmFtcylcbiAgICAgICAgfSxcbiAgICAgICAgb25JdGVyYXRpb25TdGFydDogKHBhcmFtcykgPT4ge1xuICAgICAgICAgIGhhbmRsZVdvcmtmbG93Tm9kZUl0ZXJhdGlvblN0YXJ0ZWQoXG4gICAgICAgICAgICBwYXJhbXMsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGNsaWVudFdpZHRoLFxuICAgICAgICAgICAgICBjbGllbnRIZWlnaHQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIClcblxuICAgICAgICAgIGlmIChvbkl0ZXJhdGlvblN0YXJ0KVxuICAgICAgICAgICAgb25JdGVyYXRpb25TdGFydChwYXJhbXMpXG4gICAgICAgIH0sXG4gICAgICAgIG9uSXRlcmF0aW9uTmV4dDogKHBhcmFtcykgPT4ge1xuICAgICAgICAgIGhhbmRsZVdvcmtmbG93Tm9kZUl0ZXJhdGlvbk5leHQocGFyYW1zKVxuXG4gICAgICAgICAgaWYgKG9uSXRlcmF0aW9uTmV4dClcbiAgICAgICAgICAgIG9uSXRlcmF0aW9uTmV4dChwYXJhbXMpXG4gICAgICAgIH0sXG4gICAgICAgIG9uSXRlcmF0aW9uRmluaXNoOiAocGFyYW1zKSA9PiB7XG4gICAgICAgICAgaGFuZGxlV29ya2Zsb3dOb2RlSXRlcmF0aW9uRmluaXNoZWQocGFyYW1zKVxuXG4gICAgICAgICAgaWYgKG9uSXRlcmF0aW9uRmluaXNoKVxuICAgICAgICAgICAgb25JdGVyYXRpb25GaW5pc2gocGFyYW1zKVxuICAgICAgICB9LFxuICAgICAgICBvbkxvb3BTdGFydDogKHBhcmFtcykgPT4ge1xuICAgICAgICAgIGhhbmRsZVdvcmtmbG93Tm9kZUxvb3BTdGFydGVkKFxuICAgICAgICAgICAgcGFyYW1zLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBjbGllbnRXaWR0aCxcbiAgICAgICAgICAgICAgY2xpZW50SGVpZ2h0LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApXG5cbiAgICAgICAgICBpZiAob25Mb29wU3RhcnQpXG4gICAgICAgICAgICBvbkxvb3BTdGFydChwYXJhbXMpXG4gICAgICAgIH0sXG4gICAgICAgIG9uTG9vcE5leHQ6IChwYXJhbXMpID0+IHtcbiAgICAgICAgICBoYW5kbGVXb3JrZmxvd05vZGVMb29wTmV4dChwYXJhbXMpXG5cbiAgICAgICAgICBpZiAob25Mb29wTmV4dClcbiAgICAgICAgICAgIG9uTG9vcE5leHQocGFyYW1zKVxuICAgICAgICB9LFxuICAgICAgICBvbkxvb3BGaW5pc2g6IChwYXJhbXMpID0+IHtcbiAgICAgICAgICBoYW5kbGVXb3JrZmxvd05vZGVMb29wRmluaXNoZWQocGFyYW1zKVxuXG4gICAgICAgICAgaWYgKG9uTG9vcEZpbmlzaClcbiAgICAgICAgICAgIG9uTG9vcEZpbmlzaChwYXJhbXMpXG4gICAgICAgIH0sXG4gICAgICAgIG9uTm9kZVJldHJ5OiAocGFyYW1zKSA9PiB7XG4gICAgICAgICAgaGFuZGxlV29ya2Zsb3dOb2RlUmV0cnkocGFyYW1zKVxuXG4gICAgICAgICAgaWYgKG9uTm9kZVJldHJ5KVxuICAgICAgICAgICAgb25Ob2RlUmV0cnkocGFyYW1zKVxuICAgICAgICB9LFxuICAgICAgICBvbkFnZW50TG9nOiAocGFyYW1zKSA9PiB7XG4gICAgICAgICAgaGFuZGxlV29ya2Zsb3dBZ2VudExvZyhwYXJhbXMpXG5cbiAgICAgICAgICBpZiAob25BZ2VudExvZylcbiAgICAgICAgICAgIG9uQWdlbnRMb2cocGFyYW1zKVxuICAgICAgICB9LFxuICAgICAgICBvblRleHRDaHVuazogKHBhcmFtcykgPT4ge1xuICAgICAgICAgIGhhbmRsZVdvcmtmbG93VGV4dENodW5rKHBhcmFtcylcbiAgICAgICAgfSxcbiAgICAgICAgb25UZXh0UmVwbGFjZTogKHBhcmFtcykgPT4ge1xuICAgICAgICAgIGhhbmRsZVdvcmtmbG93VGV4dFJlcGxhY2UocGFyYW1zKVxuICAgICAgICB9LFxuICAgICAgICAuLi5yZXN0Q2FsbGJhY2ssXG4gICAgICB9LFxuICAgIClcbiAgfSwgW1xuICAgIHN0b3JlLFxuICAgIHdvcmtmbG93U3RvcmUsXG4gICAgZG9TeW5jV29ya2Zsb3dEcmFmdCxcbiAgICBoYW5kbGVXb3JrZmxvd1N0YXJ0ZWQsXG4gICAgaGFuZGxlV29ya2Zsb3dGaW5pc2hlZCxcbiAgICBoYW5kbGVXb3JrZmxvd0ZhaWxlZCxcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVTdGFydGVkLFxuICAgIGhhbmRsZVdvcmtmbG93Tm9kZUZpbmlzaGVkLFxuICAgIGhhbmRsZVdvcmtmbG93Tm9kZUl0ZXJhdGlvblN0YXJ0ZWQsXG4gICAgaGFuZGxlV29ya2Zsb3dOb2RlSXRlcmF0aW9uTmV4dCxcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVJdGVyYXRpb25GaW5pc2hlZCxcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVMb29wU3RhcnRlZCxcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVMb29wTmV4dCxcbiAgICBoYW5kbGVXb3JrZmxvd05vZGVMb29wRmluaXNoZWQsXG4gICAgaGFuZGxlV29ya2Zsb3dOb2RlUmV0cnksXG4gICAgaGFuZGxlV29ya2Zsb3dUZXh0Q2h1bmssXG4gICAgaGFuZGxlV29ya2Zsb3dUZXh0UmVwbGFjZSxcbiAgICBoYW5kbGVXb3JrZmxvd0FnZW50TG9nLFxuICBdKVxuXG4gIGNvbnN0IGhhbmRsZVN0b3BSdW4gPSB1c2VDYWxsYmFjaygodGFza0lkOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCB7IHBpcGVsaW5lSWQgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuXG4gICAgc3RvcFdvcmtmbG93UnVuKGAvcmFnL3BpcGVsaW5lcy8ke3BpcGVsaW5lSWR9L3dvcmtmbG93LXJ1bnMvdGFza3MvJHt0YXNrSWR9L3N0b3BgKVxuICB9LCBbd29ya2Zsb3dTdG9yZV0pXG5cbiAgY29uc3QgaGFuZGxlUmVzdG9yZUZyb21QdWJsaXNoZWRXb3JrZmxvdyA9IHVzZUNhbGxiYWNrKChwdWJsaXNoZWRXb3JrZmxvdzogVmVyc2lvbkhpc3RvcnkpID0+IHtcbiAgICBjb25zdCBub2RlcyA9IHB1Ymxpc2hlZFdvcmtmbG93LmdyYXBoLm5vZGVzLm1hcChub2RlID0+ICh7IC4uLm5vZGUsIHNlbGVjdGVkOiBmYWxzZSwgZGF0YTogeyAuLi5ub2RlLmRhdGEsIHNlbGVjdGVkOiBmYWxzZSB9IH0pKVxuICAgIGNvbnN0IGVkZ2VzID0gcHVibGlzaGVkV29ya2Zsb3cuZ3JhcGguZWRnZXNcbiAgICBjb25zdCB2aWV3cG9ydCA9IHB1Ymxpc2hlZFdvcmtmbG93LmdyYXBoLnZpZXdwb3J0IVxuICAgIGhhbmRsZVVwZGF0ZVdvcmtmbG93Q2FudmFzKHtcbiAgICAgIG5vZGVzLFxuICAgICAgZWRnZXMsXG4gICAgICB2aWV3cG9ydCxcbiAgICB9KVxuXG4gICAgd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpLnNldEVudmlyb25tZW50VmFyaWFibGVzKHB1Ymxpc2hlZFdvcmtmbG93LmVudmlyb25tZW50X3ZhcmlhYmxlcyB8fCBbXSlcbiAgICB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKCkuc2V0UmFnUGlwZWxpbmVWYXJpYWJsZXM/LihwdWJsaXNoZWRXb3JrZmxvdy5yYWdfcGlwZWxpbmVfdmFyaWFibGVzIHx8IFtdKVxuICB9LCBbaGFuZGxlVXBkYXRlV29ya2Zsb3dDYW52YXMsIHdvcmtmbG93U3RvcmVdKVxuXG4gIHJldHVybiB7XG4gICAgaGFuZGxlQmFja3VwRHJhZnQsXG4gICAgaGFuZGxlTG9hZEJhY2t1cERyYWZ0LFxuICAgIGhhbmRsZVJ1bixcbiAgICBoYW5kbGVTdG9wUnVuLFxuICAgIGhhbmRsZVJlc3RvcmVGcm9tUHVibGlzaGVkV29ya2Zsb3csXG4gIH1cbn1cbiJdfQ==