"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDSL = void 0;
const react_1 = require("react");
const react_i18next_1 = require("react-i18next");
const toast_1 = require("@/app/components/base/toast");
const constants_1 = require("@/app/components/workflow/constants");
const store_1 = require("@/app/components/workflow/store");
const event_emitter_1 = require("@/context/event-emitter");
const use_pipeline_1 = require("@/service/use-pipeline");
const workflow_1 = require("@/service/workflow");
const use_nodes_sync_draft_1 = require("./use-nodes-sync-draft");
const useDSL = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { notify } = (0, toast_1.useToastContext)();
    const { eventEmitter } = (0, event_emitter_1.useEventEmitterContextContext)();
    const [exporting, setExporting] = (0, react_1.useState)(false);
    const { doSyncWorkflowDraft } = (0, use_nodes_sync_draft_1.useNodesSyncDraft)();
    const workflowStore = (0, store_1.useWorkflowStore)();
    const { mutateAsync: exportPipelineConfig } = (0, use_pipeline_1.useExportPipelineDSL)();
    const handleExportDSL = (0, react_1.useCallback)(async (include = false) => {
        const { pipelineId, knowledgeName } = workflowStore.getState();
        if (!pipelineId)
            return;
        if (exporting)
            return;
        try {
            setExporting(true);
            await doSyncWorkflowDraft();
            const { data } = await exportPipelineConfig({
                pipelineId,
                include,
            });
            const a = document.createElement('a');
            const file = new Blob([data], { type: 'application/yaml' });
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = `${knowledgeName}.pipeline`;
            a.click();
            URL.revokeObjectURL(url);
        }
        catch {
            notify({ type: 'error', message: t('exportFailed', { ns: 'app' }) });
        }
        finally {
            setExporting(false);
        }
    }, [notify, t, doSyncWorkflowDraft, exporting, exportPipelineConfig, workflowStore]);
    const exportCheck = (0, react_1.useCallback)(async () => {
        const { pipelineId } = workflowStore.getState();
        if (!pipelineId)
            return;
        try {
            const workflowDraft = await (0, workflow_1.fetchWorkflowDraft)(`/rag/pipelines/${pipelineId}/workflows/draft`);
            const list = (workflowDraft.environment_variables || []).filter(env => env.value_type === 'secret');
            if (list.length === 0) {
                handleExportDSL();
                return;
            }
            eventEmitter?.emit({
                type: constants_1.DSL_EXPORT_CHECK,
                payload: {
                    data: list,
                },
            });
        }
        catch {
            notify({ type: 'error', message: t('exportFailed', { ns: 'app' }) });
        }
    }, [eventEmitter, handleExportDSL, notify, t, workflowStore]);
    return {
        exportCheck,
        handleExportDSL,
    };
};
exports.useDSL = useDSL;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLURTTC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1EU0wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBR2M7QUFDZCxpREFBOEM7QUFDOUMsdURBQTZEO0FBQzdELG1FQUU0QztBQUM1QywyREFBa0U7QUFDbEUsMkRBQXVFO0FBQ3ZFLHlEQUE2RDtBQUM3RCxpREFBdUQ7QUFDdkQsaUVBQTBEO0FBRW5ELE1BQU0sTUFBTSxHQUFHLEdBQUcsRUFBRTtJQUN6QixNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBQSw4QkFBYyxHQUFFLENBQUE7SUFDOUIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUEsdUJBQWUsR0FBRSxDQUFBO0lBQ3BDLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxJQUFBLDZDQUE2QixHQUFFLENBQUE7SUFDeEQsTUFBTSxDQUFDLFNBQVMsRUFBRSxZQUFZLENBQUMsR0FBRyxJQUFBLGdCQUFRLEVBQUMsS0FBSyxDQUFDLENBQUE7SUFDakQsTUFBTSxFQUFFLG1CQUFtQixFQUFFLEdBQUcsSUFBQSx3Q0FBaUIsR0FBRSxDQUFBO0lBQ25ELE1BQU0sYUFBYSxHQUFHLElBQUEsd0JBQWdCLEdBQUUsQ0FBQTtJQUN4QyxNQUFNLEVBQUUsV0FBVyxFQUFFLG9CQUFvQixFQUFFLEdBQUcsSUFBQSxtQ0FBb0IsR0FBRSxDQUFBO0lBRXBFLE1BQU0sZUFBZSxHQUFHLElBQUEsbUJBQVcsRUFBQyxLQUFLLEVBQUUsT0FBTyxHQUFHLEtBQUssRUFBRSxFQUFFO1FBQzVELE1BQU0sRUFBRSxVQUFVLEVBQUUsYUFBYSxFQUFFLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFBO1FBQzlELElBQUksQ0FBQyxVQUFVO1lBQ2IsT0FBTTtRQUVSLElBQUksU0FBUztZQUNYLE9BQU07UUFFUixJQUFJLENBQUM7WUFDSCxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDbEIsTUFBTSxtQkFBbUIsRUFBRSxDQUFBO1lBQzNCLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLG9CQUFvQixDQUFDO2dCQUMxQyxVQUFVO2dCQUNWLE9BQU87YUFDUixDQUFDLENBQUE7WUFDRixNQUFNLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3JDLE1BQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxDQUFBO1lBQzNELE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7WUFDckMsQ0FBQyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUE7WUFDWixDQUFDLENBQUMsUUFBUSxHQUFHLEdBQUcsYUFBYSxXQUFXLENBQUE7WUFDeEMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFBO1lBQ1QsR0FBRyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUMxQixDQUFDO1FBQ0QsTUFBTSxDQUFDO1lBQ0wsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUN0RSxDQUFDO2dCQUNPLENBQUM7WUFDUCxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDckIsQ0FBQztJQUNILENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsbUJBQW1CLEVBQUUsU0FBUyxFQUFFLG9CQUFvQixFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUE7SUFFcEYsTUFBTSxXQUFXLEdBQUcsSUFBQSxtQkFBVyxFQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3pDLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUE7UUFDL0MsSUFBSSxDQUFDLFVBQVU7WUFDYixPQUFNO1FBQ1IsSUFBSSxDQUFDO1lBQ0gsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLDZCQUFrQixFQUFDLGtCQUFrQixVQUFVLGtCQUFrQixDQUFDLENBQUE7WUFDOUYsTUFBTSxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMscUJBQXFCLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxRQUFRLENBQUMsQ0FBQTtZQUNuRyxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7Z0JBQ3RCLGVBQWUsRUFBRSxDQUFBO2dCQUNqQixPQUFNO1lBQ1IsQ0FBQztZQUNELFlBQVksRUFBRSxJQUFJLENBQUM7Z0JBQ2pCLElBQUksRUFBRSw0QkFBZ0I7Z0JBQ3RCLE9BQU8sRUFBRTtvQkFDUCxJQUFJLEVBQUUsSUFBSTtpQkFDWDthQUNLLENBQUMsQ0FBQTtRQUNYLENBQUM7UUFDRCxNQUFNLENBQUM7WUFDTCxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsY0FBYyxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ3RFLENBQUM7SUFDSCxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQTtJQUU3RCxPQUFPO1FBQ0wsV0FBVztRQUNYLGVBQWU7S0FDaEIsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQW5FWSxRQUFBLE1BQU0sVUFtRWxCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZVN0YXRlLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVRyYW5zbGF0aW9uIH0gZnJvbSAncmVhY3QtaTE4bmV4dCdcbmltcG9ydCB7IHVzZVRvYXN0Q29udGV4dCB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS90b2FzdCdcbmltcG9ydCB7XG4gIERTTF9FWFBPUlRfQ0hFQ0ssXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvY29uc3RhbnRzJ1xuaW1wb3J0IHsgdXNlV29ya2Zsb3dTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgeyB1c2VFdmVudEVtaXR0ZXJDb250ZXh0Q29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9ldmVudC1lbWl0dGVyJ1xuaW1wb3J0IHsgdXNlRXhwb3J0UGlwZWxpbmVEU0wgfSBmcm9tICdAL3NlcnZpY2UvdXNlLXBpcGVsaW5lJ1xuaW1wb3J0IHsgZmV0Y2hXb3JrZmxvd0RyYWZ0IH0gZnJvbSAnQC9zZXJ2aWNlL3dvcmtmbG93J1xuaW1wb3J0IHsgdXNlTm9kZXNTeW5jRHJhZnQgfSBmcm9tICcuL3VzZS1ub2Rlcy1zeW5jLWRyYWZ0J1xuXG5leHBvcnQgY29uc3QgdXNlRFNMID0gKCkgPT4ge1xuICBjb25zdCB7IHQgfSA9IHVzZVRyYW5zbGF0aW9uKClcbiAgY29uc3QgeyBub3RpZnkgfSA9IHVzZVRvYXN0Q29udGV4dCgpXG4gIGNvbnN0IHsgZXZlbnRFbWl0dGVyIH0gPSB1c2VFdmVudEVtaXR0ZXJDb250ZXh0Q29udGV4dCgpXG4gIGNvbnN0IFtleHBvcnRpbmcsIHNldEV4cG9ydGluZ10gPSB1c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgeyBkb1N5bmNXb3JrZmxvd0RyYWZ0IH0gPSB1c2VOb2Rlc1N5bmNEcmFmdCgpXG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcbiAgY29uc3QgeyBtdXRhdGVBc3luYzogZXhwb3J0UGlwZWxpbmVDb25maWcgfSA9IHVzZUV4cG9ydFBpcGVsaW5lRFNMKClcblxuICBjb25zdCBoYW5kbGVFeHBvcnREU0wgPSB1c2VDYWxsYmFjayhhc3luYyAoaW5jbHVkZSA9IGZhbHNlKSA9PiB7XG4gICAgY29uc3QgeyBwaXBlbGluZUlkLCBrbm93bGVkZ2VOYW1lIH0gPSB3b3JrZmxvd1N0b3JlLmdldFN0YXRlKClcbiAgICBpZiAoIXBpcGVsaW5lSWQpXG4gICAgICByZXR1cm5cblxuICAgIGlmIChleHBvcnRpbmcpXG4gICAgICByZXR1cm5cblxuICAgIHRyeSB7XG4gICAgICBzZXRFeHBvcnRpbmcodHJ1ZSlcbiAgICAgIGF3YWl0IGRvU3luY1dvcmtmbG93RHJhZnQoKVxuICAgICAgY29uc3QgeyBkYXRhIH0gPSBhd2FpdCBleHBvcnRQaXBlbGluZUNvbmZpZyh7XG4gICAgICAgIHBpcGVsaW5lSWQsXG4gICAgICAgIGluY2x1ZGUsXG4gICAgICB9KVxuICAgICAgY29uc3QgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKVxuICAgICAgY29uc3QgZmlsZSA9IG5ldyBCbG9iKFtkYXRhXSwgeyB0eXBlOiAnYXBwbGljYXRpb24veWFtbCcgfSlcbiAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSlcbiAgICAgIGEuaHJlZiA9IHVybFxuICAgICAgYS5kb3dubG9hZCA9IGAke2tub3dsZWRnZU5hbWV9LnBpcGVsaW5lYFxuICAgICAgYS5jbGljaygpXG4gICAgICBVUkwucmV2b2tlT2JqZWN0VVJMKHVybClcbiAgICB9XG4gICAgY2F0Y2gge1xuICAgICAgbm90aWZ5KHsgdHlwZTogJ2Vycm9yJywgbWVzc2FnZTogdCgnZXhwb3J0RmFpbGVkJywgeyBuczogJ2FwcCcgfSkgfSlcbiAgICB9XG4gICAgZmluYWxseSB7XG4gICAgICBzZXRFeHBvcnRpbmcoZmFsc2UpXG4gICAgfVxuICB9LCBbbm90aWZ5LCB0LCBkb1N5bmNXb3JrZmxvd0RyYWZ0LCBleHBvcnRpbmcsIGV4cG9ydFBpcGVsaW5lQ29uZmlnLCB3b3JrZmxvd1N0b3JlXSlcblxuICBjb25zdCBleHBvcnRDaGVjayA9IHVzZUNhbGxiYWNrKGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB7IHBpcGVsaW5lSWQgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICAgIGlmICghcGlwZWxpbmVJZClcbiAgICAgIHJldHVyblxuICAgIHRyeSB7XG4gICAgICBjb25zdCB3b3JrZmxvd0RyYWZ0ID0gYXdhaXQgZmV0Y2hXb3JrZmxvd0RyYWZ0KGAvcmFnL3BpcGVsaW5lcy8ke3BpcGVsaW5lSWR9L3dvcmtmbG93cy9kcmFmdGApXG4gICAgICBjb25zdCBsaXN0ID0gKHdvcmtmbG93RHJhZnQuZW52aXJvbm1lbnRfdmFyaWFibGVzIHx8IFtdKS5maWx0ZXIoZW52ID0+IGVudi52YWx1ZV90eXBlID09PSAnc2VjcmV0JylcbiAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBoYW5kbGVFeHBvcnREU0woKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGV2ZW50RW1pdHRlcj8uZW1pdCh7XG4gICAgICAgIHR5cGU6IERTTF9FWFBPUlRfQ0hFQ0ssXG4gICAgICAgIHBheWxvYWQ6IHtcbiAgICAgICAgICBkYXRhOiBsaXN0LFxuICAgICAgICB9LFxuICAgICAgfSBhcyBhbnkpXG4gICAgfVxuICAgIGNhdGNoIHtcbiAgICAgIG5vdGlmeSh7IHR5cGU6ICdlcnJvcicsIG1lc3NhZ2U6IHQoJ2V4cG9ydEZhaWxlZCcsIHsgbnM6ICdhcHAnIH0pIH0pXG4gICAgfVxuICB9LCBbZXZlbnRFbWl0dGVyLCBoYW5kbGVFeHBvcnREU0wsIG5vdGlmeSwgdCwgd29ya2Zsb3dTdG9yZV0pXG5cbiAgcmV0dXJuIHtcbiAgICBleHBvcnRDaGVjayxcbiAgICBoYW5kbGVFeHBvcnREU0wsXG4gIH1cbn1cbiJdfQ==