"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const store_1 = require("@/app/components/app/store");
const features_1 = require("@/app/components/base/features");
const loading_1 = require("@/app/components/base/loading");
const constants_1 = require("@/app/components/base/prompt-editor/constants");
const workflow_1 = require("@/app/components/workflow");
const context_1 = require("@/app/components/workflow/context");
const store_2 = require("@/app/components/workflow/store");
const trigger_status_1 = require("@/app/components/workflow/store/trigger-status");
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const app_context_1 = require("@/context/app-context");
const log_1 = require("@/service/log");
const use_tools_1 = require("@/service/use-tools");
const app_1 = require("@/types/app");
const workflow_main_1 = require("./components/workflow-main");
const use_get_run_and_trace_url_1 = require("./hooks/use-get-run-and-trace-url");
const use_workflow_init_1 = require("./hooks/use-workflow-init");
const workflow_slice_1 = require("./store/workflow/workflow-slice");
const WorkflowAppWithAdditionalContext = () => {
    const { data, isLoading, fileUploadConfigResponse, } = (0, use_workflow_init_1.useWorkflowInit)();
    const workflowStore = (0, store_2.useWorkflowStore)();
    const { isLoadingCurrentWorkspace, currentWorkspace } = (0, app_context_1.useAppContext)();
    // Initialize trigger status at application level
    const { setTriggerStatuses } = (0, trigger_status_1.useTriggerStatusStore)();
    const appDetail = (0, store_1.useStore)(s => s.appDetail);
    const appId = appDetail?.id;
    const isWorkflowMode = appDetail?.mode === app_1.AppModeEnum.WORKFLOW;
    const { data: triggersResponse } = (0, use_tools_1.useAppTriggers)(isWorkflowMode ? appId : undefined, {
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        refetchOnWindowFocus: false,
    });
    // Sync trigger statuses to store when data loads
    (0, react_1.useEffect)(() => {
        if (triggersResponse?.data) {
            // Map API status to EntryNodeStatus: 'enabled' stays 'enabled', all others become 'disabled'
            const statusMap = triggersResponse.data.reduce((acc, trigger) => {
                acc[trigger.node_id] = trigger.status === 'enabled' ? 'enabled' : 'disabled';
                return acc;
            }, {});
            setTriggerStatuses(statusMap);
        }
    }, [triggersResponse?.data, setTriggerStatuses]);
    // Cleanup on unmount
    (0, react_1.useEffect)(() => {
        return () => {
            // Reset the loaded flag when component unmounts
            workflowStore.setState({ isWorkflowDataLoaded: false });
            // Cancel any pending debounced sync operations
            const { debouncedSyncWorkflowDraft } = workflowStore.getState();
            // The debounced function from lodash has a cancel method
            if (debouncedSyncWorkflowDraft && 'cancel' in debouncedSyncWorkflowDraft)
                debouncedSyncWorkflowDraft.cancel();
        };
    }, [workflowStore]);
    const nodesData = (0, react_1.useMemo)(() => {
        if (data)
            return (0, utils_1.initialNodes)(data.graph.nodes, data.graph.edges);
        return [];
    }, [data]);
    const edgesData = (0, react_1.useMemo)(() => {
        if (data)
            return (0, utils_1.initialEdges)(data.graph.edges, data.graph.nodes);
        return [];
    }, [data]);
    const searchParams = (0, navigation_1.useSearchParams)();
    const { getWorkflowRunAndTraceUrl } = (0, use_get_run_and_trace_url_1.useGetRunAndTraceUrl)();
    const replayRunId = searchParams.get('replayRunId');
    (0, react_1.useEffect)(() => {
        if (!replayRunId)
            return;
        const { runUrl } = getWorkflowRunAndTraceUrl(replayRunId);
        if (!runUrl)
            return;
        (0, log_1.fetchRunDetail)(runUrl).then((res) => {
            const { setInputs, setShowInputsPanel, setShowDebugAndPreviewPanel } = workflowStore.getState();
            const rawInputs = res.inputs;
            let parsedInputs = null;
            if (typeof rawInputs === 'string') {
                try {
                    const maybeParsed = JSON.parse(rawInputs);
                    if (maybeParsed && typeof maybeParsed === 'object' && !Array.isArray(maybeParsed))
                        parsedInputs = maybeParsed;
                }
                catch (error) {
                    console.error('Failed to parse workflow run inputs', error);
                }
            }
            else if (rawInputs && typeof rawInputs === 'object' && !Array.isArray(rawInputs)) {
                parsedInputs = rawInputs;
            }
            if (!parsedInputs)
                return;
            const userInputs = {};
            Object.entries(parsedInputs).forEach(([key, value]) => {
                if (key.startsWith('sys.'))
                    return;
                if (value == null) {
                    userInputs[key] = '';
                    return;
                }
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    userInputs[key] = value;
                    return;
                }
                try {
                    userInputs[key] = JSON.stringify(value);
                }
                catch {
                    userInputs[key] = String(value);
                }
            });
            if (!Object.keys(userInputs).length)
                return;
            setInputs(userInputs);
            setShowInputsPanel(true);
            setShowDebugAndPreviewPanel(true);
        });
    }, [replayRunId, workflowStore, getWorkflowRunAndTraceUrl]);
    if (!data || isLoading || isLoadingCurrentWorkspace || !currentWorkspace.id) {
        return (<div className="relative flex h-full w-full items-center justify-center">
        <loading_1.default />
      </div>);
    }
    const features = data.features || {};
    const initialFeatures = {
        file: {
            image: {
                enabled: !!features.file_upload?.image?.enabled,
                number_limits: features.file_upload?.image?.number_limits || 3,
                transfer_methods: features.file_upload?.image?.transfer_methods || ['local_file', 'remote_url'],
            },
            enabled: !!(features.file_upload?.enabled || features.file_upload?.image?.enabled),
            allowed_file_types: features.file_upload?.allowed_file_types || [types_1.SupportUploadFileTypes.image],
            allowed_file_extensions: features.file_upload?.allowed_file_extensions || constants_1.FILE_EXTS[types_1.SupportUploadFileTypes.image].map(ext => `.${ext}`),
            allowed_file_upload_methods: features.file_upload?.allowed_file_upload_methods || features.file_upload?.image?.transfer_methods || ['local_file', 'remote_url'],
            number_limits: features.file_upload?.number_limits || features.file_upload?.image?.number_limits || 3,
            fileUploadConfig: fileUploadConfigResponse,
        },
        opening: {
            enabled: !!features.opening_statement,
            opening_statement: features.opening_statement,
            suggested_questions: features.suggested_questions,
        },
        suggested: features.suggested_questions_after_answer || { enabled: false },
        speech2text: features.speech_to_text || { enabled: false },
        text2speech: features.text_to_speech || { enabled: false },
        citation: features.retriever_resource || { enabled: false },
        moderation: features.sensitive_word_avoidance || { enabled: false },
    };
    return (<workflow_1.default edges={edgesData} nodes={nodesData}>
      <features_1.FeaturesProvider features={initialFeatures}>
        <workflow_main_1.default nodes={nodesData} edges={edgesData} viewport={data.graph.viewport}/>
      </features_1.FeaturesProvider>
    </workflow_1.default>);
};
const WorkflowAppWrapper = () => {
    return (<context_1.WorkflowContextProvider injectWorkflowStoreSliceFn={workflow_slice_1.createWorkflowSlice}>
      <WorkflowAppWithAdditionalContext />
    </context_1.WorkflowContextProvider>);
};
exports.default = WorkflowAppWrapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFlBQVksQ0FBQTs7QUFJWixnREFBaUQ7QUFDakQsaUNBR2M7QUFDZCxzREFBb0U7QUFDcEUsNkRBQWlFO0FBQ2pFLDJEQUFtRDtBQUNuRCw2RUFBeUU7QUFDekUsd0RBQWtFO0FBQ2xFLCtEQUUwQztBQUMxQywyREFBa0U7QUFDbEUsbUZBQXNGO0FBQ3RGLDJEQUV3QztBQUN4QywyREFHd0M7QUFDeEMsdURBQXFEO0FBQ3JELHVDQUE4QztBQUM5QyxtREFBb0Q7QUFDcEQscUNBQXlDO0FBQ3pDLDhEQUF3RDtBQUV4RCxpRkFBd0U7QUFDeEUsaUVBRWtDO0FBQ2xDLG9FQUFxRTtBQUVyRSxNQUFNLGdDQUFnQyxHQUFHLEdBQUcsRUFBRTtJQUM1QyxNQUFNLEVBQ0osSUFBSSxFQUNKLFNBQVMsRUFDVCx3QkFBd0IsR0FDekIsR0FBRyxJQUFBLG1DQUFlLEdBQUUsQ0FBQTtJQUNyQixNQUFNLGFBQWEsR0FBRyxJQUFBLHdCQUFnQixHQUFFLENBQUE7SUFDeEMsTUFBTSxFQUFFLHlCQUF5QixFQUFFLGdCQUFnQixFQUFFLEdBQUcsSUFBQSwyQkFBYSxHQUFFLENBQUE7SUFFdkUsaURBQWlEO0lBQ2pELE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxHQUFHLElBQUEsc0NBQXFCLEdBQUUsQ0FBQTtJQUN0RCxNQUFNLFNBQVMsR0FBRyxJQUFBLGdCQUFXLEVBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUE7SUFDL0MsTUFBTSxLQUFLLEdBQUcsU0FBUyxFQUFFLEVBQUUsQ0FBQTtJQUMzQixNQUFNLGNBQWMsR0FBRyxTQUFTLEVBQUUsSUFBSSxLQUFLLGlCQUFXLENBQUMsUUFBUSxDQUFBO0lBQy9ELE1BQU0sRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxJQUFBLDBCQUFjLEVBQUMsY0FB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cGUgeyBGZWF0dXJlcyBhcyBGZWF0dXJlc0RhdGEgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2Jhc2UvZmVhdHVyZXMvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEluamVjdFdvcmtmbG93U3RvcmVTbGljZUZuIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcbmltcG9ydCB7IHVzZVNlYXJjaFBhcmFtcyB9IGZyb20gJ25leHQvbmF2aWdhdGlvbidcbmltcG9ydCB7XG4gIHVzZUVmZmVjdCxcbiAgdXNlTWVtbyxcbn0gZnJvbSAncmVhY3QnXG5pbXBvcnQgeyB1c2VTdG9yZSBhcyB1c2VBcHBTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYXBwL3N0b3JlJ1xuaW1wb3J0IHsgRmVhdHVyZXNQcm92aWRlciB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9mZWF0dXJlcydcbmltcG9ydCBMb2FkaW5nIGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvYmFzZS9sb2FkaW5nJ1xuaW1wb3J0IHsgRklMRV9FWFRTIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy9iYXNlL3Byb21wdC1lZGl0b3IvY29uc3RhbnRzJ1xuaW1wb3J0IFdvcmtmbG93V2l0aERlZmF1bHRDb250ZXh0IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cnXG5pbXBvcnQge1xuICBXb3JrZmxvd0NvbnRleHRQcm92aWRlcixcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9jb250ZXh0J1xuaW1wb3J0IHsgdXNlV29ya2Zsb3dTdG9yZSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvc3RvcmUnXG5pbXBvcnQgeyB1c2VUcmlnZ2VyU3RhdHVzU3RvcmUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3N0b3JlL3RyaWdnZXItc3RhdHVzJ1xuaW1wb3J0IHtcbiAgU3VwcG9ydFVwbG9hZEZpbGVUeXBlcyxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy90eXBlcydcbmltcG9ydCB7XG4gIGluaXRpYWxFZGdlcyxcbiAgaW5pdGlhbE5vZGVzLFxufSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuaW1wb3J0IHsgdXNlQXBwQ29udGV4dCB9IGZyb20gJ0AvY29udGV4dC9hcHAtY29udGV4dCdcbmltcG9ydCB7IGZldGNoUnVuRGV0YWlsIH0gZnJvbSAnQC9zZXJ2aWNlL2xvZydcbmltcG9ydCB7IHVzZUFwcFRyaWdnZXJzIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS10b29scydcbmltcG9ydCB7IEFwcE1vZGVFbnVtIH0gZnJvbSAnQC90eXBlcy9hcHAnXG5pbXBvcnQgV29ya2Zsb3dBcHBNYWluIGZyb20gJy4vY29tcG9uZW50cy93b3JrZmxvdy1tYWluJ1xuXG5pbXBvcnQgeyB1c2VHZXRSdW5BbmRUcmFjZVVybCB9IGZyb20gJy4vaG9va3MvdXNlLWdldC1ydW4tYW5kLXRyYWNlLXVybCdcbmltcG9ydCB7XG4gIHVzZVdvcmtmbG93SW5pdCxcbn0gZnJvbSAnLi9ob29rcy91c2Utd29ya2Zsb3ctaW5pdCdcbmltcG9ydCB7IGNyZWF0ZVdvcmtmbG93U2xpY2UgfSBmcm9tICcuL3N0b3JlL3dvcmtmbG93L3dvcmtmbG93LXNsaWNlJ1xuXG5jb25zdCBXb3JrZmxvd0FwcFdpdGhBZGRpdGlvbmFsQ29udGV4dCA9ICgpID0+IHtcbiAgY29uc3Qge1xuICAgIGRhdGEsXG4gICAgaXNMb2FkaW5nLFxuICAgIGZpbGVVcGxvYWRDb25maWdSZXNwb25zZSxcbiAgfSA9IHVzZVdvcmtmbG93SW5pdCgpXG4gIGNvbnN0IHdvcmtmbG93U3RvcmUgPSB1c2VXb3JrZmxvd1N0b3JlKClcbiAgY29uc3QgeyBpc0xvYWRpbmdDdXJyZW50V29ya3NwYWNlLCBjdXJyZW50V29ya3NwYWNlIH0gPSB1c2VBcHBDb250ZXh0KClcblxuICAvLyBJbml0aWFsaXplIHRyaWdnZXIgc3RhdHVzIGF0IGFwcGxpY2F0aW9uIGxldmVsXG4gIGNvbnN0IHsgc2V0VHJpZ2dlclN0YXR1c2VzIH0gPSB1c2VUcmlnZ2VyU3RhdHVzU3RvcmUoKVxuICBjb25zdCBhcHBEZXRhaWwgPSB1c2VBcHBTdG9yZShzID0+IHMuYXBwRGV0YWlsKVxuICBjb25zdCBhcHBJZCA9IGFwcERldGFpbD8uaWRcbiAgY29uc3QgaXNXb3JrZmxvd01vZGUgPSBhcHBEZXRhaWw/Lm1vZGUgPT09IEFwcE1vZGVFbnVtLldPUktGTE9XXG4gIGNvbnN0IHsgZGF0YTogdHJpZ2dlcnNSZXNwb25zZSB9ID0gdXNlQXBwVHJpZ2dlcnMoaXNXb3JrZmxvd01vZGUgPyBhcHBJZCA6IHVuZGVmaW5lZCwge1xuICAgIHN0YWxlVGltZTogNSAqIDYwICogMTAwMCwgLy8gNSBtaW51dGVzIGNhY2hlXG4gICAgcmVmZXRjaE9uV2luZG93Rm9jdXM6IGZhbHNlLFxuICB9KVxuXG4gIC8vIFN5bmMgdHJpZ2dlciBzdGF0dXNlcyB0byBzdG9yZSB3aGVuIGRhdGEgbG9hZHNcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodHJpZ2dlcnNSZXNwb25zZT8uZGF0YSkge1xuICAgICAgLy8gTWFwIEFQSSBzdGF0dXMgdG8gRW50cnlOb2RlU3RhdHVzOiAnZW5hYmxlZCcgc3RheXMgJ2VuYWJsZWQnLCBhbGwgb3RoZXJzIGJlY29tZSAnZGlzYWJsZWQnXG4gICAgICBjb25zdCBzdGF0dXNNYXAgPSB0cmlnZ2Vyc1Jlc3BvbnNlLmRhdGEucmVkdWNlKChhY2MsIHRyaWdnZXIpID0+IHtcbiAgICAgICAgYWNjW3RyaWdnZXIubm9kZV9pZF0gPSB0cmlnZ2VyLnN0YXR1cyA9PT0gJ2VuYWJsZWQnID8gJ2VuYWJsZWQnIDogJ2Rpc2FibGVkJ1xuICAgICAgICByZXR1cm4gYWNjXG4gICAgICB9LCB7fSBhcyBSZWNvcmQ8c3RyaW5nLCAnZW5hYmxlZCcgfCAnZGlzYWJsZWQnPilcblxuICAgICAgc2V0VHJpZ2dlclN0YXR1c2VzKHN0YXR1c01hcClcbiAgICB9XG4gIH0sIFt0cmlnZ2Vyc1Jlc3BvbnNlPy5kYXRhLCBzZXRUcmlnZ2VyU3RhdHVzZXNdKVxuXG4gIC8vIENsZWFudXAgb24gdW5tb3VudFxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAvLyBSZXNldCB0aGUgbG9hZGVkIGZsYWcgd2hlbiBjb21wb25lbnQgdW5tb3VudHNcbiAgICAgIHdvcmtmbG93U3RvcmUuc2V0U3RhdGUoeyBpc1dvcmtmbG93RGF0YUxvYWRlZDogZmFsc2UgfSlcblxuICAgICAgLy8gQ2FuY2VsIGFueSBwZW5kaW5nIGRlYm91bmNlZCBzeW5jIG9wZXJhdGlvbnNcbiAgICAgIGNvbnN0IHsgZGVib3VuY2VkU3luY1dvcmtmbG93RHJhZnQgfSA9IHdvcmtmbG93U3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgLy8gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBmcm9tIGxvZGFzaCBoYXMgYSBjYW5jZWwgbWV0aG9kXG4gICAgICBpZiAoZGVib3VuY2VkU3luY1dvcmtmbG93RHJhZnQgJiYgJ2NhbmNlbCcgaW4gZGVib3VuY2VkU3luY1dvcmtmbG93RHJhZnQpXG4gICAgICAgIChkZWJvdW5jZWRTeW5jV29ya2Zsb3dEcmFmdCBhcyBhbnkpLmNhbmNlbCgpXG4gICAgfVxuICB9LCBbd29ya2Zsb3dTdG9yZV0pXG5cbiAgY29uc3Qgbm9kZXNEYXRhID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKGRhdGEpXG4gICAgICByZXR1cm4gaW5pdGlhbE5vZGVzKGRhdGEuZ3JhcGgubm9kZXMsIGRhdGEuZ3JhcGguZWRnZXMpXG5cbiAgICByZXR1cm4gW11cbiAgfSwgW2RhdGFdKVxuICBjb25zdCBlZGdlc0RhdGEgPSB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoZGF0YSlcbiAgICAgIHJldHVybiBpbml0aWFsRWRnZXMoZGF0YS5ncmFwaC5lZGdlcywgZGF0YS5ncmFwaC5ub2RlcylcblxuICAgIHJldHVybiBbXVxuICB9LCBbZGF0YV0pXG5cbiAgY29uc3Qgc2VhcmNoUGFyYW1zID0gdXNlU2VhcmNoUGFyYW1zKClcbiAgY29uc3QgeyBnZXRXb3JrZmxvd1J1bkFuZFRyYWNlVXJsIH0gPSB1c2VHZXRSdW5BbmRUcmFjZVVybCgpXG4gIGNvbnN0IHJlcGxheVJ1bklkID0gc2VhcmNoUGFyYW1zLmdldCgncmVwbGF5UnVuSWQnKVxuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFyZXBsYXlSdW5JZClcbiAgICAgIHJldHVyblxuICAgIGNvbnN0IHsgcnVuVXJsIH0gPSBnZXRXb3JrZmxvd1J1bkFuZFRyYWNlVXJsKHJlcGxheVJ1bklkKVxuICAgIGlmICghcnVuVXJsKVxuICAgICAgcmV0dXJuXG4gICAgZmV0Y2hSdW5EZXRhaWwocnVuVXJsKS50aGVuKChyZXMpID0+IHtcbiAgICAgIGNvbnN0IHsgc2V0SW5wdXRzLCBzZXRTaG93SW5wdXRzUGFuZWwsIHNldFNob3dEZWJ1Z0FuZFByZXZpZXdQYW5lbCB9ID0gd29ya2Zsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgICBjb25zdCByYXdJbnB1dHMgPSByZXMuaW5wdXRzXG4gICAgICBsZXQgcGFyc2VkSW5wdXRzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwgPSBudWxsXG5cbiAgICAgIGlmICh0eXBlb2YgcmF3SW5wdXRzID09PSAnc3RyaW5nJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IG1heWJlUGFyc2VkID0gSlNPTi5wYXJzZShyYXdJbnB1dHMpIGFzIHVua25vd25cbiAgICAgICAgICBpZiAobWF5YmVQYXJzZWQgJiYgdHlwZW9mIG1heWJlUGFyc2VkID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShtYXliZVBhcnNlZCkpXG4gICAgICAgICAgICBwYXJzZWRJbnB1dHMgPSBtYXliZVBhcnNlZCBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBwYXJzZSB3b3JrZmxvdyBydW4gaW5wdXRzJywgZXJyb3IpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHJhd0lucHV0cyAmJiB0eXBlb2YgcmF3SW5wdXRzID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShyYXdJbnB1dHMpKSB7XG4gICAgICAgIHBhcnNlZElucHV0cyA9IHJhd0lucHV0cyBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICAgICAgfVxuXG4gICAgICBpZiAoIXBhcnNlZElucHV0cylcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGNvbnN0IHVzZXJJbnB1dHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4+ID0ge31cbiAgICAgIE9iamVjdC5lbnRyaWVzKHBhcnNlZElucHV0cykuZm9yRWFjaCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGlmIChrZXkuc3RhcnRzV2l0aCgnc3lzLicpKVxuICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgdXNlcklucHV0c1trZXldID0gJydcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgfHwgdHlwZW9mIHZhbHVlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICB1c2VySW5wdXRzW2tleV0gPSB2YWx1ZVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB1c2VySW5wdXRzW2tleV0gPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSlcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCB7XG4gICAgICAgICAgdXNlcklucHV0c1trZXldID0gU3RyaW5nKHZhbHVlKVxuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBpZiAoIU9iamVjdC5rZXlzKHVzZXJJbnB1dHMpLmxlbmd0aClcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHNldElucHV0cyh1c2VySW5wdXRzKVxuICAgICAgc2V0U2hvd0lucHV0c1BhbmVsKHRydWUpXG4gICAgICBzZXRTaG93RGVidWdBbmRQcmV2aWV3UGFuZWwodHJ1ZSlcbiAgICB9KVxuICB9LCBbcmVwbGF5UnVuSWQsIHdvcmtmbG93U3RvcmUsIGdldFdvcmtmbG93UnVuQW5kVHJhY2VVcmxdKVxuXG4gIGlmICghZGF0YSB8fCBpc0xvYWRpbmcgfHwgaXNMb2FkaW5nQ3VycmVudFdvcmtzcGFjZSB8fCAhY3VycmVudFdvcmtzcGFjZS5pZCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlIGZsZXggaC1mdWxsIHctZnVsbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAgPExvYWRpbmcgLz5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIGNvbnN0IGZlYXR1cmVzID0gZGF0YS5mZWF0dXJlcyB8fCB7fVxuICBjb25zdCBpbml0aWFsRmVhdHVyZXM6IEZlYXR1cmVzRGF0YSA9IHtcbiAgICBmaWxlOiB7XG4gICAgICBpbWFnZToge1xuICAgICAgICBlbmFibGVkOiAhIWZlYXR1cmVzLmZpbGVfdXBsb2FkPy5pbWFnZT8uZW5hYmxlZCxcbiAgICAgICAgbnVtYmVyX2xpbWl0czogZmVhdHVyZXMuZmlsZV91cGxvYWQ/LmltYWdlPy5udW1iZXJfbGltaXRzIHx8IDMsXG4gICAgICAgIHRyYW5zZmVyX21ldGhvZHM6IGZlYXR1cmVzLmZpbGVfdXBsb2FkPy5pbWFnZT8udHJhbnNmZXJfbWV0aG9kcyB8fCBbJ2xvY2FsX2ZpbGUnLCAncmVtb3RlX3VybCddLFxuICAgICAgfSxcbiAgICAgIGVuYWJsZWQ6ICEhKGZlYXR1cmVzLmZpbGVfdXBsb2FkPy5lbmFibGVkIHx8IGZlYXR1cmVzLmZpbGVfdXBsb2FkPy5pbWFnZT8uZW5hYmxlZCksXG4gICAgICBhbGxvd2VkX2ZpbGVfdHlwZXM6IGZlYXR1cmVzLmZpbGVfdXBsb2FkPy5hbGxvd2VkX2ZpbGVfdHlwZXMgfHwgW1N1cHBvcnRVcGxvYWRGaWxlVHlwZXMuaW1hZ2VdLFxuICAgICAgYWxsb3dlZF9maWxlX2V4dGVuc2lvbnM6IGZlYXR1cmVzLmZpbGVfdXBsb2FkPy5hbGxvd2VkX2ZpbGVfZXh0ZW5zaW9ucyB8fCBGSUxFX0VYVFNbU3VwcG9ydFVwbG9hZEZpbGVUeXBlcy5pbWFnZV0ubWFwKGV4dCA9PiBgLiR7ZXh0fWApLFxuICAgICAgYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzOiBmZWF0dXJlcy5maWxlX3VwbG9hZD8uYWxsb3dlZF9maWxlX3VwbG9hZF9tZXRob2RzIHx8IGZlYXR1cmVzLmZpbGVfdXBsb2FkPy5pbWFnZT8udHJhbnNmZXJfbWV0aG9kcyB8fCBbJ2xvY2FsX2ZpbGUnLCAncmVtb3RlX3VybCddLFxuICAgICAgbnVtYmVyX2xpbWl0czogZmVhdHVyZXMuZmlsZV91cGxvYWQ/Lm51bWJlcl9saW1pdHMgfHwgZmVhdHVyZXMuZmlsZV91cGxvYWQ/LmltYWdlPy5udW1iZXJfbGltaXRzIHx8IDMsXG4gICAgICBmaWxlVXBsb2FkQ29uZmlnOiBmaWxlVXBsb2FkQ29uZmlnUmVzcG9uc2UsXG4gICAgfSxcbiAgICBvcGVuaW5nOiB7XG4gICAgICBlbmFibGVkOiAhIWZlYXR1cmVzLm9wZW5pbmdfc3RhdGVtZW50LFxuICAgICAgb3BlbmluZ19zdGF0ZW1lbnQ6IGZlYXR1cmVzLm9wZW5pbmdfc3RhdGVtZW50LFxuICAgICAgc3VnZ2VzdGVkX3F1ZXN0aW9uczogZmVhdHVyZXMuc3VnZ2VzdGVkX3F1ZXN0aW9ucyxcbiAgICB9LFxuICAgIHN1Z2dlc3RlZDogZmVhdHVyZXMuc3VnZ2VzdGVkX3F1ZXN0aW9uc19hZnRlcl9hbnN3ZXIgfHwgeyBlbmFibGVkOiBmYWxzZSB9LFxuICAgIHNwZWVjaDJ0ZXh0OiBmZWF0dXJlcy5zcGVlY2hfdG9fdGV4dCB8fCB7IGVuYWJsZWQ6IGZhbHNlIH0sXG4gICAgdGV4dDJzcGVlY2g6IGZlYXR1cmVzLnRleHRfdG9fc3BlZWNoIHx8IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgICBjaXRhdGlvbjogZmVhdHVyZXMucmV0cmlldmVyX3Jlc291cmNlIHx8IHsgZW5hYmxlZDogZmFsc2UgfSxcbiAgICBtb2RlcmF0aW9uOiBmZWF0dXJlcy5zZW5zaXRpdmVfd29yZF9hdm9pZGFuY2UgfHwgeyBlbmFibGVkOiBmYWxzZSB9LFxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8V29ya2Zsb3dXaXRoRGVmYXVsdENvbnRleHRcbiAgICAgIGVkZ2VzPXtlZGdlc0RhdGF9XG4gICAgICBub2Rlcz17bm9kZXNEYXRhfVxuICAgID5cbiAgICAgIDxGZWF0dXJlc1Byb3ZpZGVyIGZlYXR1cmVzPXtpbml0aWFsRmVhdHVyZXN9PlxuICAgICAgICA8V29ya2Zsb3dBcHBNYWluXG4gICAgICAgICAgbm9kZXM9e25vZGVzRGF0YX1cbiAgICAgICAgICBlZGdlcz17ZWRnZXNEYXRhfVxuICAgICAgICAgIHZpZXdwb3J0PXtkYXRhLmdyYXBoLnZpZXdwb3J0fVxuICAgICAgICAvPlxuICAgICAgPC9GZWF0dXJlc1Byb3ZpZGVyPlxuICAgIDwvV29ya2Zsb3dXaXRoRGVmYXVsdENvbnRleHQ+XG4gIClcbn1cblxuY29uc3QgV29ya2Zsb3dBcHBXcmFwcGVyID0gKCkgPT4ge1xuICByZXR1cm4gKFxuICAgIDxXb3JrZmxvd0NvbnRleHRQcm92aWRlclxuICAgICAgaW5qZWN0V29ya2Zsb3dTdG9yZVNsaWNlRm49e2NyZWF0ZVdvcmtmbG93U2xpY2UgYXMgSW5qZWN0V29ya2Zsb3dTdG9yZVNsaWNlRm59XG4gICAgPlxuICAgICAgPFdvcmtmbG93QXBwV2l0aEFkZGl0aW9uYWxDb250ZXh0IC8+XG4gICAgPC9Xb3JrZmxvd0NvbnRleHRQcm92aWRlcj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBXb3JrZmxvd0FwcFdyYXBwZXJcbiJdfQ==