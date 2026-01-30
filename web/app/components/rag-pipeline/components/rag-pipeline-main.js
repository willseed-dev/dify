"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const workflow_1 = require("@/app/components/workflow");
const use_fetch_workflow_inspect_vars_1 = require("@/app/components/workflow/hooks/use-fetch-workflow-inspect-vars");
const store_1 = require("@/app/components/workflow/store");
const hooks_1 = require("../hooks");
const use_configs_map_1 = require("../hooks/use-configs-map");
const use_inspect_vars_crud_1 = require("../hooks/use-inspect-vars-crud");
const rag_pipeline_children_1 = require("./rag-pipeline-children");
const RagPipelineMain = ({ nodes, edges, viewport, }) => {
    const workflowStore = (0, store_1.useWorkflowStore)();
    const handleWorkflowDataUpdate = (0, react_1.useCallback)((payload) => {
        const { rag_pipeline_variables, environment_variables, } = payload;
        if (rag_pipeline_variables) {
            const { setRagPipelineVariables } = workflowStore.getState();
            setRagPipelineVariables?.(rag_pipeline_variables);
        }
        if (environment_variables) {
            const { setEnvironmentVariables } = workflowStore.getState();
            setEnvironmentVariables(environment_variables);
        }
    }, [workflowStore]);
    const { doSyncWorkflowDraft, syncWorkflowDraftWhenPageClose, } = (0, hooks_1.useNodesSyncDraft)();
    const { handleRefreshWorkflowDraft } = (0, hooks_1.usePipelineRefreshDraft)();
    const { handleBackupDraft, handleLoadBackupDraft, handleRestoreFromPublishedWorkflow, handleRun, handleStopRun, } = (0, hooks_1.usePipelineRun)();
    const { handleStartWorkflowRun, handleWorkflowStartRunInWorkflow, } = (0, hooks_1.usePipelineStartRun)();
    const availableNodesMetaData = (0, hooks_1.useAvailableNodesMetaData)();
    const { getWorkflowRunAndTraceUrl } = (0, hooks_1.useGetRunAndTraceUrl)();
    const { exportCheck, handleExportDSL, } = (0, hooks_1.useDSL)();
    const configsMap = (0, use_configs_map_1.useConfigsMap)();
    const { fetchInspectVars } = (0, use_fetch_workflow_inspect_vars_1.useSetWorkflowVarsWithValue)({
        ...configsMap,
    });
    const { hasNodeInspectVars, hasSetInspectVar, fetchInspectVarValue, editInspectVarValue, renameInspectVarName, appendNodeInspectVars, deleteInspectVar, deleteNodeInspectorVars, deleteAllInspectorVars, isInspectVarEdited, resetToLastRunVar, invalidateSysVarValues, resetConversationVar, invalidateConversationVarValues, } = (0, use_inspect_vars_crud_1.useInspectVarsCrud)();
    const hooksStore = (0, react_1.useMemo)(() => {
        return {
            availableNodesMetaData,
            syncWorkflowDraftWhenPageClose,
            doSyncWorkflowDraft,
            handleRefreshWorkflowDraft,
            handleBackupDraft,
            handleLoadBackupDraft,
            handleRestoreFromPublishedWorkflow,
            handleRun,
            handleStopRun,
            handleStartWorkflowRun,
            handleWorkflowStartRunInWorkflow,
            getWorkflowRunAndTraceUrl,
            exportCheck,
            handleExportDSL,
            fetchInspectVars,
            hasNodeInspectVars,
            hasSetInspectVar,
            fetchInspectVarValue,
            editInspectVarValue,
            renameInspectVarName,
            appendNodeInspectVars,
            deleteInspectVar,
            deleteNodeInspectorVars,
            deleteAllInspectorVars,
            isInspectVarEdited,
            resetToLastRunVar,
            invalidateSysVarValues,
            resetConversationVar,
            invalidateConversationVarValues,
            configsMap,
        };
    }, [
        availableNodesMetaData,
        syncWorkflowDraftWhenPageClose,
        doSyncWorkflowDraft,
        handleRefreshWorkflowDraft,
        handleBackupDraft,
        handleLoadBackupDraft,
        handleRestoreFromPublishedWorkflow,
        handleRun,
        handleStopRun,
        handleStartWorkflowRun,
        handleWorkflowStartRunInWorkflow,
        getWorkflowRunAndTraceUrl,
        exportCheck,
        handleExportDSL,
        fetchInspectVars,
        hasNodeInspectVars,
        hasSetInspectVar,
        fetchInspectVarValue,
        editInspectVarValue,
        renameInspectVarName,
        appendNodeInspectVars,
        deleteInspectVar,
        deleteNodeInspectorVars,
        deleteAllInspectorVars,
        isInspectVarEdited,
        resetToLastRunVar,
        invalidateSysVarValues,
        resetConversationVar,
        invalidateConversationVarValues,
        configsMap,
    ]);
    return (<workflow_1.WorkflowWithInnerContext nodes={nodes} edges={edges} viewport={viewport} hooksStore={hooksStore} onWorkflowDataUpdate={handleWorkflowDataUpdate}>
      <rag_pipeline_children_1.default />
    </workflow_1.WorkflowWithInnerContext>);
};
exports.default = RagPipelineMain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFnLXBpcGVsaW5lLW1haW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyYWctcGlwZWxpbmUtbWFpbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FHYztBQUNkLHdEQUFvRTtBQUNwRSxxSEFBNkc7QUFDN0csMkRBQWtFO0FBQ2xFLG9DQVFpQjtBQUNqQiw4REFBd0Q7QUFDeEQsMEVBQW1FO0FBQ25FLG1FQUF5RDtBQUd6RCxNQUFNLGVBQWUsR0FBRyxDQUFDLEVBQ3ZCLEtBQUssRUFDTCxLQUFLLEVBQ0wsUUFBUSxHQUNhLEVBQUUsRUFBRTtJQUN6QixNQUFNLGFBQWEsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFFeEMsTUFBTSx3QkFBd0IsR0FBRyxJQUFBLG1CQUFXLEVBQUMsQ0FBQyxPQUFZLEVBQUUsRUFBRTtRQUM1RCxNQUFNLEVBQ0osc0JBQXNCLEVBQ3RCLHFCQUFxQixHQUN0QixHQUFHLE9BQU8sQ0FBQTtRQUNYLElBQUksc0JBQXNCLEVBQUUsQ0FBQztZQUMzQixNQUFNLEVBQUUsdUJBQXVCLEVBQUUsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUE7WUFDNUQsdUJBQXVCLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1FBQ25ELENBQUM7UUFDRCxJQUFJLHFCQUFxQixFQUFFLENBQUM7WUFDMUIsTUFBTSxFQUFFLHVCQUF1QixFQUFFLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFBO1lBQzVELHVCQUF1QixDQUFDLHFCQUFxQixDQUFDLENBQUE7UUFDaEQsQ0FBQztJQUNILENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUE7SUFFbkIsTUFBTSxFQUNKLG1CQUFtQixFQUNuQiw4QkFBOEIsR0FDL0IsR0FBRyxJQUFBLHlCQUFpQixHQUFFLENBQUE7SUFDdkIsTUFBTSxFQUFFLDBCQUEwQixFQUFFLEdBQUcsSUFBQSwrQkFBdUIsR0FBRSxDQUFBO0lBQ2hFLE1BQU0sRUFDSixp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Iiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBXb3JrZmxvd1Byb3BzIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdydcbmltcG9ydCB7XG4gIHVzZUNhbGxiYWNrLFxuICB1c2VNZW1vLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IFdvcmtmbG93V2l0aElubmVyQ29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cnXG5pbXBvcnQgeyB1c2VTZXRXb3JrZmxvd1ZhcnNXaXRoVmFsdWUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L2hvb2tzL3VzZS1mZXRjaC13b3JrZmxvdy1pbnNwZWN0LXZhcnMnXG5pbXBvcnQgeyB1c2VXb3JrZmxvd1N0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcbmltcG9ydCB7XG4gIHVzZUF2YWlsYWJsZU5vZGVzTWV0YURhdGEsXG4gIHVzZURTTCxcbiAgdXNlR2V0UnVuQW5kVHJhY2VVcmwsXG4gIHVzZU5vZGVzU3luY0RyYWZ0LFxuICB1c2VQaXBlbGluZVJlZnJlc2hEcmFmdCxcbiAgdXNlUGlwZWxpbmVSdW4sXG4gIHVzZVBpcGVsaW5lU3RhcnRSdW4sXG59IGZyb20gJy4uL2hvb2tzJ1xuaW1wb3J0IHsgdXNlQ29uZmlnc01hcCB9IGZyb20gJy4uL2hvb2tzL3VzZS1jb25maWdzLW1hcCdcbmltcG9ydCB7IHVzZUluc3BlY3RWYXJzQ3J1ZCB9IGZyb20gJy4uL2hvb2tzL3VzZS1pbnNwZWN0LXZhcnMtY3J1ZCdcbmltcG9ydCBSYWdQaXBlbGluZUNoaWxkcmVuIGZyb20gJy4vcmFnLXBpcGVsaW5lLWNoaWxkcmVuJ1xuXG50eXBlIFJhZ1BpcGVsaW5lTWFpblByb3BzID0gUGljazxXb3JrZmxvd1Byb3BzLCAnbm9kZXMnIHwgJ2VkZ2VzJyB8ICd2aWV3cG9ydCc+XG5jb25zdCBSYWdQaXBlbGluZU1haW4gPSAoe1xuICBub2RlcyxcbiAgZWRnZXMsXG4gIHZpZXdwb3J0LFxufTogUmFnUGlwZWxpbmVNYWluUHJvcHMpID0+IHtcbiAgY29uc3Qgd29ya2Zsb3dTdG9yZSA9IHVzZVdvcmtmbG93U3RvcmUoKVxuXG4gIGNvbnN0IGhhbmRsZVdvcmtmbG93RGF0YVVwZGF0ZSA9IHVzZUNhbGxiYWNrKChwYXlsb2FkOiBhbnkpID0+IHtcbiAgICBjb25zdCB7XG4gICAgICByYWdfcGlwZWxpbmVfdmFyaWFibGVzLFxuICAgICAgZW52aXJvbm1lbnRfdmFyaWFibGVzLFxuICAgIH0gPSBwYXlsb2FkXG4gICAgaWYgKHJhZ19waXBlbGluZV92YXJpYWJsZXMpIHtcbiAgICAgIGNvbnN0IHsgc2V0UmFnUGlwZWxpbmVWYXJpYWJsZXMgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgc2V0UmFnUGlwZWxpbmVWYXJpYWJsZXM/LihyYWdfcGlwZWxpbmVfdmFyaWFibGVzKVxuICAgIH1cbiAgICBpZiAoZW52aXJvbm1lbnRfdmFyaWFibGVzKSB7XG4gICAgICBjb25zdCB7IHNldEVudmlyb25tZW50VmFyaWFibGVzIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgICAgIHNldEVudmlyb25tZW50VmFyaWFibGVzKGVudmlyb25tZW50X3ZhcmlhYmxlcylcbiAgICB9XG4gIH0sIFt3b3JrZmxvd1N0b3JlXSlcblxuICBjb25zdCB7XG4gICAgZG9TeW5jV29ya2Zsb3dEcmFmdCxcbiAgICBzeW5jV29ya2Zsb3dEcmFmdFdoZW5QYWdlQ2xvc2UsXG4gIH0gPSB1c2VOb2Rlc1N5bmNEcmFmdCgpXG4gIGNvbnN0IHsgaGFuZGxlUmVmcmVzaFdvcmtmbG93RHJhZnQgfSA9IHVzZVBpcGVsaW5lUmVmcmVzaERyYWZ0KClcbiAgY29uc3Qge1xuICAgIGhhbmRsZUJhY2t1cERyYWZ0LFxuICAgIGhhbmRsZUxvYWRCYWNrdXBEcmFmdCxcbiAgICBoYW5kbGVSZXN0b3JlRnJvbVB1Ymxpc2hlZFdvcmtmbG93LFxuICAgIGhhbmRsZVJ1bixcbiAgICBoYW5kbGVTdG9wUnVuLFxuICB9ID0gdXNlUGlwZWxpbmVSdW4oKVxuICBjb25zdCB7XG4gICAgaGFuZGxlU3RhcnRXb3JrZmxvd1J1bixcbiAgICBoYW5kbGVXb3JrZmxvd1N0YXJ0UnVuSW5Xb3JrZmxvdyxcbiAgfSA9IHVzZVBpcGVsaW5lU3RhcnRSdW4oKVxuICBjb25zdCBhdmFpbGFibGVOb2Rlc01ldGFEYXRhID0gdXNlQXZhaWxhYmxlTm9kZXNNZXRhRGF0YSgpXG4gIGNvbnN0IHsgZ2V0V29ya2Zsb3dSdW5BbmRUcmFjZVVybCB9ID0gdXNlR2V0UnVuQW5kVHJhY2VVcmwoKVxuICBjb25zdCB7XG4gICAgZXhwb3J0Q2hlY2ssXG4gICAgaGFuZGxlRXhwb3J0RFNMLFxuICB9ID0gdXNlRFNMKClcblxuICBjb25zdCBjb25maWdzTWFwID0gdXNlQ29uZmlnc01hcCgpXG4gIGNvbnN0IHsgZmV0Y2hJbnNwZWN0VmFycyB9ID0gdXNlU2V0V29ya2Zsb3dWYXJzV2l0aFZhbHVlKHtcbiAgICAuLi5jb25maWdzTWFwLFxuICB9KVxuICBjb25zdCB7XG4gICAgaGFzTm9kZUluc3BlY3RWYXJzLFxuICAgIGhhc1NldEluc3BlY3RWYXIsXG4gICAgZmV0Y2hJbnNwZWN0VmFyVmFsdWUsXG4gICAgZWRpdEluc3BlY3RWYXJWYWx1ZSxcbiAgICByZW5hbWVJbnNwZWN0VmFyTmFtZSxcbiAgICBhcHBlbmROb2RlSW5zcGVjdFZhcnMsXG4gICAgZGVsZXRlSW5zcGVjdFZhcixcbiAgICBkZWxldGVOb2RlSW5zcGVjdG9yVmFycyxcbiAgICBkZWxldGVBbGxJbnNwZWN0b3JWYXJzLFxuICAgIGlzSW5zcGVjdFZhckVkaXRlZCxcbiAgICByZXNldFRvTGFzdFJ1blZhcixcbiAgICBpbnZhbGlkYXRlU3lzVmFyVmFsdWVzLFxuICAgIHJlc2V0Q29udmVyc2F0aW9uVmFyLFxuICAgIGludmFsaWRhdGVDb252ZXJzYXRpb25WYXJWYWx1ZXMsXG4gIH0gPSB1c2VJbnNwZWN0VmFyc0NydWQoKVxuXG4gIGNvbnN0IGhvb2tzU3RvcmUgPSB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgYXZhaWxhYmxlTm9kZXNNZXRhRGF0YSxcbiAgICAgIHN5bmNXb3JrZmxvd0RyYWZ0V2hlblBhZ2VDbG9zZSxcbiAgICAgIGRvU3luY1dvcmtmbG93RHJhZnQsXG4gICAgICBoYW5kbGVSZWZyZXNoV29ya2Zsb3dEcmFmdCxcbiAgICAgIGhhbmRsZUJhY2t1cERyYWZ0LFxuICAgICAgaGFuZGxlTG9hZEJhY2t1cERyYWZ0LFxuICAgICAgaGFuZGxlUmVzdG9yZUZyb21QdWJsaXNoZWRXb3JrZmxvdyxcbiAgICAgIGhhbmRsZVJ1bixcbiAgICAgIGhhbmRsZVN0b3BSdW4sXG4gICAgICBoYW5kbGVTdGFydFdvcmtmbG93UnVuLFxuICAgICAgaGFuZGxlV29ya2Zsb3dTdGFydFJ1bkluV29ya2Zsb3csXG4gICAgICBnZXRXb3JrZmxvd1J1bkFuZFRyYWNlVXJsLFxuICAgICAgZXhwb3J0Q2hlY2ssXG4gICAgICBoYW5kbGVFeHBvcnREU0wsXG4gICAgICBmZXRjaEluc3BlY3RWYXJzLFxuICAgICAgaGFzTm9kZUluc3BlY3RWYXJzLFxuICAgICAgaGFzU2V0SW5zcGVjdFZhcixcbiAgICAgIGZldGNoSW5zcGVjdFZhclZhbHVlLFxuICAgICAgZWRpdEluc3BlY3RWYXJWYWx1ZSxcbiAgICAgIHJlbmFtZUluc3BlY3RWYXJOYW1lLFxuICAgICAgYXBwZW5kTm9kZUluc3BlY3RWYXJzLFxuICAgICAgZGVsZXRlSW5zcGVjdFZhcixcbiAgICAgIGRlbGV0ZU5vZGVJbnNwZWN0b3JWYXJzLFxuICAgICAgZGVsZXRlQWxsSW5zcGVjdG9yVmFycyxcbiAgICAgIGlzSW5zcGVjdFZhckVkaXRlZCxcbiAgICAgIHJlc2V0VG9MYXN0UnVuVmFyLFxuICAgICAgaW52YWxpZGF0ZVN5c1ZhclZhbHVlcyxcbiAgICAgIHJlc2V0Q29udmVyc2F0aW9uVmFyLFxuICAgICAgaW52YWxpZGF0ZUNvbnZlcnNhdGlvblZhclZhbHVlcyxcbiAgICAgIGNvbmZpZ3NNYXAsXG4gICAgfVxuICB9LCBbXG4gICAgYXZhaWxhYmxlTm9kZXNNZXRhRGF0YSxcbiAgICBzeW5jV29ya2Zsb3dEcmFmdFdoZW5QYWdlQ2xvc2UsXG4gICAgZG9TeW5jV29ya2Zsb3dEcmFmdCxcbiAgICBoYW5kbGVSZWZyZXNoV29ya2Zsb3dEcmFmdCxcbiAgICBoYW5kbGVCYWNrdXBEcmFmdCxcbiAgICBoYW5kbGVMb2FkQmFja3VwRHJhZnQsXG4gICAgaGFuZGxlUmVzdG9yZUZyb21QdWJsaXNoZWRXb3JrZmxvdyxcbiAgICBoYW5kbGVSdW4sXG4gICAgaGFuZGxlU3RvcFJ1bixcbiAgICBoYW5kbGVTdGFydFdvcmtmbG93UnVuLFxuICAgIGhhbmRsZVdvcmtmbG93U3RhcnRSdW5JbldvcmtmbG93LFxuICAgIGdldFdvcmtmbG93UnVuQW5kVHJhY2VVcmwsXG4gICAgZXhwb3J0Q2hlY2ssXG4gICAgaGFuZGxlRXhwb3J0RFNMLFxuICAgIGZldGNoSW5zcGVjdFZhcnMsXG4gICAgaGFzTm9kZUluc3BlY3RWYXJzLFxuICAgIGhhc1NldEluc3BlY3RWYXIsXG4gICAgZmV0Y2hJbnNwZWN0VmFyVmFsdWUsXG4gICAgZWRpdEluc3BlY3RWYXJWYWx1ZSxcbiAgICByZW5hbWVJbnNwZWN0VmFyTmFtZSxcbiAgICBhcHBlbmROb2RlSW5zcGVjdFZhcnMsXG4gICAgZGVsZXRlSW5zcGVjdFZhcixcbiAgICBkZWxldGVOb2RlSW5zcGVjdG9yVmFycyxcbiAgICBkZWxldGVBbGxJbnNwZWN0b3JWYXJzLFxuICAgIGlzSW5zcGVjdFZhckVkaXRlZCxcbiAgICByZXNldFRvTGFzdFJ1blZhcixcbiAgICBpbnZhbGlkYXRlU3lzVmFyVmFsdWVzLFxuICAgIHJlc2V0Q29udmVyc2F0aW9uVmFyLFxuICAgIGludmFsaWRhdGVDb252ZXJzYXRpb25WYXJWYWx1ZXMsXG4gICAgY29uZmlnc01hcCxcbiAgXSlcblxuICByZXR1cm4gKFxuICAgIDxXb3JrZmxvd1dpdGhJbm5lckNvbnRleHRcbiAgICAgIG5vZGVzPXtub2Rlc31cbiAgICAgIGVkZ2VzPXtlZGdlc31cbiAgICAgIHZpZXdwb3J0PXt2aWV3cG9ydH1cbiAgICAgIGhvb2tzU3RvcmU9e2hvb2tzU3RvcmUgYXMgYW55fVxuICAgICAgb25Xb3JrZmxvd0RhdGFVcGRhdGU9e2hhbmRsZVdvcmtmbG93RGF0YVVwZGF0ZX1cbiAgICA+XG4gICAgICA8UmFnUGlwZWxpbmVDaGlsZHJlbiAvPlxuICAgIDwvV29ya2Zsb3dXaXRoSW5uZXJDb250ZXh0PlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJhZ1BpcGVsaW5lTWFpblxuIl19