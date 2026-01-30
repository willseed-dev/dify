"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const shallow_1 = require("zustand/react/shallow");
const store_1 = require("@/app/components/datasets/documents/create-from-pipeline/data-source/store");
const pipeline_1 = require("@/models/pipeline");
const use_pipeline_1 = require("@/service/use-pipeline");
const use_workflow_1 = require("@/service/use-workflow");
const workflow_1 = require("@/service/workflow");
const app_1 = require("@/types/app");
const common_1 = require("@/types/common");
const hooks_1 = require("../../../hooks");
const types_1 = require("../../../types");
const useBeforeRunForm = ({ nodeId, flowId, flowType, payload, setRunResult, isPaused, isRunAfterSingleRun, setIsRunAfterSingleRun, onSuccess, appendNodeInspectVars, }) => {
    const store = (0, reactflow_1.useStoreApi)();
    const dataSourceStore = (0, store_1.useDataSourceStore)();
    const isPausedRef = (0, react_1.useRef)(isPaused);
    const { handleNodeDataUpdate } = (0, hooks_1.useNodeDataUpdate)();
    const datasourceType = payload.provider_type;
    const datasourceNodeData = payload;
    const { localFileList, onlineDocuments, websitePages, selectedFileIds, } = (0, store_1.useDataSourceStoreWithSelector)((0, shallow_1.useShallow)(state => ({
        localFileList: state.localFileList,
        onlineDocuments: state.onlineDocuments,
        websitePages: state.websitePages,
        selectedFileIds: state.selectedFileIds,
    })));
    const startRunBtnDisabled = (0, react_1.useMemo)(() => {
        if (!datasourceNodeData)
            return false;
        if (datasourceType === pipeline_1.DatasourceType.localFile)
            return !localFileList.length || localFileList.some(file => !file.file.id);
        if (datasourceType === pipeline_1.DatasourceType.onlineDocument)
            return !onlineDocuments.length;
        if (datasourceType === pipeline_1.DatasourceType.websiteCrawl)
            return !websitePages.length;
        if (datasourceType === pipeline_1.DatasourceType.onlineDrive)
            return !selectedFileIds.length;
        return false;
    }, [datasourceNodeData, datasourceType, localFileList, onlineDocuments.length, selectedFileIds.length, websitePages.length]);
    (0, react_1.useEffect)(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);
    const runningStatus = payload._singleRunningStatus || types_1.NodeRunningStatus.NotStart;
    const setNodeRunning = () => {
        handleNodeDataUpdate({
            id: nodeId,
            data: {
                ...payload,
                _singleRunningStatus: types_1.NodeRunningStatus.Running,
            },
        });
    };
    const invalidLastRun = (0, use_workflow_1.useInvalidLastRun)(flowType, flowId, nodeId);
    const updateRunResult = async (data) => {
        const isPaused = isPausedRef.current;
        // The backend don't support pause the single run, so the frontend handle the pause state.
        if (isPaused)
            return;
        const canRunLastRun = !isRunAfterSingleRun || runningStatus === types_1.NodeRunningStatus.Succeeded;
        if (!canRunLastRun) {
            setRunResult(data);
            return;
        }
        // run fail may also update the inspect vars when the node set the error default output.
        const vars = await (0, workflow_1.fetchNodeInspectVars)(common_1.FlowType.ragPipeline, flowId, nodeId);
        const { getNodes } = store.getState();
        const nodes = getNodes();
        appendNodeInspectVars(nodeId, vars, nodes);
        if (data?.status === types_1.NodeRunningStatus.Succeeded)
            onSuccess();
    };
    const { mutateAsync: handleDatasourceSingleRun, isPending } = (0, use_pipeline_1.useDatasourceSingleRun)();
    const handleRun = () => {
        let datasourceInfo = {};
        const { currentCredentialId: credentialId } = dataSourceStore.getState();
        if (datasourceType === pipeline_1.DatasourceType.localFile) {
            const { localFileList } = dataSourceStore.getState();
            const { id, name, type, size, extension, mime_type } = localFileList[0].file;
            const documentInfo = {
                related_id: id,
                name,
                type,
                size,
                extension,
                mime_type,
                url: '',
                transfer_method: app_1.TransferMethod.local_file,
            };
            datasourceInfo = documentInfo;
        }
        if (datasourceType === pipeline_1.DatasourceType.onlineDocument) {
            const { onlineDocuments } = dataSourceStore.getState();
            const { workspace_id, ...rest } = onlineDocuments[0];
            const documentInfo = {
                workspace_id,
                page: rest,
                credential_id: credentialId,
            };
            datasourceInfo = documentInfo;
        }
        if (datasourceType === pipeline_1.DatasourceType.websiteCrawl) {
            const { websitePages } = dataSourceStore.getState();
            datasourceInfo = {
                ...websitePages[0],
                credential_id: credentialId,
            };
        }
        if (datasourceType === pipeline_1.DatasourceType.onlineDrive) {
            const { bucket, onlineDriveFileList, selectedFileIds } = dataSourceStore.getState();
            const file = onlineDriveFileList.find(file => file.id === selectedFileIds[0]);
            datasourceInfo = {
                bucket,
                id: file?.id,
                type: file?.type,
                credential_id: credentialId,
            };
        }
        let hasError = false;
        handleDatasourceSingleRun({
            pipeline_id: flowId,
            start_node_id: nodeId,
            start_node_title: datasourceNodeData.title,
            datasource_type: datasourceType,
            datasource_info: datasourceInfo,
        }, {
            onError: () => {
                hasError = true;
                invalidLastRun();
                if (isPausedRef.current)
                    return;
                handleNodeDataUpdate({
                    id: nodeId,
                    data: {
                        ...payload,
                        _isSingleRun: false,
                        _singleRunningStatus: types_1.NodeRunningStatus.Failed,
                    },
                });
            },
            onSettled: (data) => {
                updateRunResult(data);
                if (!hasError && !isPausedRef.current) {
                    handleNodeDataUpdate({
                        id: nodeId,
                        data: {
                            ...payload,
                            _isSingleRun: false,
                            _singleRunningStatus: types_1.NodeRunningStatus.Succeeded,
                        },
                    });
                }
            },
        });
    };
    const { handleSyncWorkflowDraft } = (0, hooks_1.useNodesSyncDraft)();
    const handleRunWithSyncDraft = () => {
        setNodeRunning();
        setIsRunAfterSingleRun(true);
        handleSyncWorkflowDraft(true, true, {
            onSuccess() {
                handleRun();
            },
        });
    };
    return {
        isPending,
        handleRunWithSyncDraft,
        datasourceType,
        datasourceNodeData,
        startRunBtnDisabled,
    };
};
exports.default = useBeforeRunForm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlLWJlZm9yZS1ydW4tZm9ybS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInVzZS1iZWZvcmUtcnVuLWZvcm0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBa0Q7QUFDbEQseUNBQXVDO0FBQ3ZDLG1EQUFrRDtBQUNsRCxzR0FBK0k7QUFDL0ksZ0RBQWtEO0FBQ2xELHlEQUErRDtBQUMvRCx5REFBMEQ7QUFDMUQsaURBQXlEO0FBQ3pELHFDQUE0QztBQUM1QywyQ0FBeUM7QUFDekMsMENBQXFFO0FBQ3JFLDBDQUFrRDtBQUVsRCxNQUFNLGdCQUFnQixHQUFHLENBQUMsRUFDeEIsTUFBTSxFQUNOLE1BQU0sRUFDTixRQUFRLEVBQ1IsT0FBTyxFQUNQLFlBQVksRUFDWixRQUFRLEVBQ1IsbUJBQW1CLEVBQ25CLHNCQUFzQixFQUN0QixTQUFTLEVBQ1QscUJBQXFCLEdBQ0YsRUFBRSxFQUFFO0lBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUEsdUJBQVcsR0FBRSxDQUFBO0lBQzNCLE1BQU0sZUFBZSxHQUFHLElBQUEsMEJBQWtCLEdBQUUsQ0FBQTtJQUM1QyxNQUFNLFdBQVcsR0FBRyxJQUFBLGNBQU0sRUFBQyxRQUFRLENBQUMsQ0FBQTtJQUNwQyxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsR0FBRyxJQUFBLHlCQUFpQixHQUFFLENBQUE7SUFFcEQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLGFBQStCLENBQUE7SUFDOUQsTUFBTSxrQkFBa0IsR0FBRyxPQUE2QixDQUFBO0lBRXhELE1BQU0sRUFDSixhQUFhLEVBQ2IsZUFBZSxFQUNmLFlBQVksRUFDWixlQUFlLEdBQ2hCLEdBQUcsSUFBQSxzQ0FBOEIsRUFBQyxJQUFBLG9CQUFVLEVBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RELGFBQWEsRUFBRSxLQUFLLENBQUMsYUFBYTtRQUNsQyxlQUFlLEVBQUUsS0FBSyxDQUFDLGVBQWU7UUFDdEMsWUFBWSxFQUFFLEtBQUss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aUJBQ0YsQ0FBQyxDQUFBO1lBQ0osQ0FBQztZQUNELFNBQVMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNsQixlQUFlLENBQUMsSUFBSyxDQUFDLENBQUE7Z0JBQ3RCLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ3RDLG9CQUFvQixDQUFDO3dCQUNuQixFQUFFLEVBQUUsTUFBTTt3QkFDVixJQUFJLEVBQUU7NEJBQ0osR0FBRyxPQUFPOzRCQUNWLFlBQVksRUFBRSxLQUFLOzRCQUNuQixvQkFBb0IsRUFBRSx5QkFBaUIsQ0FBQyxTQUFTO3lCQUNsRDtxQkFDRixDQUFDLENBQUE7Z0JBQ0osQ0FBQztZQUNILENBQUM7U0FDRixDQUFDLENBQUE7SUFDSixDQUFDLENBQUE7SUFFRCxNQUFNLEVBQUUsdUJBQXVCLEVBQUUsR0FBRyxJQUFBLHlCQUFpQixHQUFFLENBQUE7SUFFdkQsTUFBTSxzQkFBc0IsR0FBRyxHQUFHLEVBQUU7UUFDbEMsY0FBYyxFQUFFLENBQUE7UUFDaEIsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDNUIsdUJBQXVCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtZQUNsQyxTQUFTO2dCQUNQLFNBQVMsRUFBRSxDQUFBO1lBQ2IsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQTtJQUVELE9BQU87UUFDTCxTQUFTO1FBQ1Qsc0JBQXNCO1FBQ3RCLGNBQWM7UUFDZCxrQkFBa0I7UUFDbEIsbUJBQW1CO0tBQ3BCLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxnQkFBZ0IsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgQ3VzdG9tUnVuRm9ybVByb3BzLCBEYXRhU291cmNlTm9kZVR5cGUgfSBmcm9tICcuLi90eXBlcydcbmltcG9ydCB0eXBlIHsgTm9kZVJ1blJlc3VsdCB9IGZyb20gJ0AvdHlwZXMvd29ya2Zsb3cnXG5pbXBvcnQgeyB1c2VFZmZlY3QsIHVzZU1lbW8sIHVzZVJlZiB9IGZyb20gJ3JlYWN0J1xuaW1wb3J0IHsgdXNlU3RvcmVBcGkgfSBmcm9tICdyZWFjdGZsb3cnXG5pbXBvcnQgeyB1c2VTaGFsbG93IH0gZnJvbSAnenVzdGFuZC9yZWFjdC9zaGFsbG93J1xuaW1wb3J0IHsgdXNlRGF0YVNvdXJjZVN0b3JlLCB1c2VEYXRhU291cmNlU3RvcmVXaXRoU2VsZWN0b3IgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL2RhdGFzZXRzL2RvY3VtZW50cy9jcmVhdGUtZnJvbS1waXBlbGluZS9kYXRhLXNvdXJjZS9zdG9yZSdcbmltcG9ydCB7IERhdGFzb3VyY2VUeXBlIH0gZnJvbSAnQC9tb2RlbHMvcGlwZWxpbmUnXG5pbXBvcnQgeyB1c2VEYXRhc291cmNlU2luZ2xlUnVuIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS1waXBlbGluZSdcbmltcG9ydCB7IHVzZUludmFsaWRMYXN0UnVuIH0gZnJvbSAnQC9zZXJ2aWNlL3VzZS13b3JrZmxvdydcbmltcG9ydCB7IGZldGNoTm9kZUluc3BlY3RWYXJzIH0gZnJvbSAnQC9zZXJ2aWNlL3dvcmtmbG93J1xuaW1wb3J0IHsgVHJhbnNmZXJNZXRob2QgfSBmcm9tICdAL3R5cGVzL2FwcCdcbmltcG9ydCB7IEZsb3dUeXBlIH0gZnJvbSAnQC90eXBlcy9jb21tb24nXG5pbXBvcnQgeyB1c2VOb2RlRGF0YVVwZGF0ZSwgdXNlTm9kZXNTeW5jRHJhZnQgfSBmcm9tICcuLi8uLi8uLi9ob29rcydcbmltcG9ydCB7IE5vZGVSdW5uaW5nU3RhdHVzIH0gZnJvbSAnLi4vLi4vLi4vdHlwZXMnXG5cbmNvbnN0IHVzZUJlZm9yZVJ1bkZvcm0gPSAoe1xuICBub2RlSWQsXG4gIGZsb3dJZCxcbiAgZmxvd1R5cGUsXG4gIHBheWxvYWQsXG4gIHNldFJ1blJlc3VsdCxcbiAgaXNQYXVzZWQsXG4gIGlzUnVuQWZ0ZXJTaW5nbGVSdW4sXG4gIHNldElzUnVuQWZ0ZXJTaW5nbGVSdW4sXG4gIG9uU3VjY2VzcyxcbiAgYXBwZW5kTm9kZUluc3BlY3RWYXJzLFxufTogQ3VzdG9tUnVuRm9ybVByb3BzKSA9PiB7XG4gIGNvbnN0IHN0b3JlID0gdXNlU3RvcmVBcGkoKVxuICBjb25zdCBkYXRhU291cmNlU3RvcmUgPSB1c2VEYXRhU291cmNlU3RvcmUoKVxuICBjb25zdCBpc1BhdXNlZFJlZiA9IHVzZVJlZihpc1BhdXNlZClcbiAgY29uc3QgeyBoYW5kbGVOb2RlRGF0YVVwZGF0ZSB9ID0gdXNlTm9kZURhdGFVcGRhdGUoKVxuXG4gIGNvbnN0IGRhdGFzb3VyY2VUeXBlID0gcGF5bG9hZC5wcm92aWRlcl90eXBlIGFzIERhdGFzb3VyY2VUeXBlXG4gIGNvbnN0IGRhdGFzb3VyY2VOb2RlRGF0YSA9IHBheWxvYWQgYXMgRGF0YVNvdXJjZU5vZGVUeXBlXG5cbiAgY29uc3Qge1xuICAgIGxvY2FsRmlsZUxpc3QsXG4gICAgb25saW5lRG9jdW1lbnRzLFxuICAgIHdlYnNpdGVQYWdlcyxcbiAgICBzZWxlY3RlZEZpbGVJZHMsXG4gIH0gPSB1c2VEYXRhU291cmNlU3RvcmVXaXRoU2VsZWN0b3IodXNlU2hhbGxvdyhzdGF0ZSA9PiAoe1xuICAgIGxvY2FsRmlsZUxpc3Q6IHN0YXRlLmxvY2FsRmlsZUxpc3QsXG4gICAgb25saW5lRG9jdW1lbnRzOiBzdGF0ZS5vbmxpbmVEb2N1bWVudHMsXG4gICAgd2Vic2l0ZVBhZ2VzOiBzdGF0ZS53ZWJzaXRlUGFnZXMsXG4gICAgc2VsZWN0ZWRGaWxlSWRzOiBzdGF0ZS5zZWxlY3RlZEZpbGVJZHMsXG4gIH0pKSlcblxuICBjb25zdCBzdGFydFJ1bkJ0bkRpc2FibGVkID0gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFkYXRhc291cmNlTm9kZURhdGEpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLmxvY2FsRmlsZSlcbiAgICAgIHJldHVybiAhbG9jYWxGaWxlTGlzdC5sZW5ndGggfHwgbG9jYWxGaWxlTGlzdC5zb21lKGZpbGUgPT4gIWZpbGUuZmlsZS5pZClcbiAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLm9ubGluZURvY3VtZW50KVxuICAgICAgcmV0dXJuICFvbmxpbmVEb2N1bWVudHMubGVuZ3RoXG4gICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS53ZWJzaXRlQ3Jhd2wpXG4gICAgICByZXR1cm4gIXdlYnNpdGVQYWdlcy5sZW5ndGhcbiAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLm9ubGluZURyaXZlKVxuICAgICAgcmV0dXJuICFzZWxlY3RlZEZpbGVJZHMubGVuZ3RoXG4gICAgcmV0dXJuIGZhbHNlXG4gIH0sIFtkYXRhc291cmNlTm9kZURhdGEsIGRhdGFzb3VyY2VUeXBlLCBsb2NhbEZpbGVMaXN0LCBvbmxpbmVEb2N1bWVudHMubGVuZ3RoLCBzZWxlY3RlZEZpbGVJZHMubGVuZ3RoLCB3ZWJzaXRlUGFnZXMubGVuZ3RoXSlcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlzUGF1c2VkUmVmLmN1cnJlbnQgPSBpc1BhdXNlZFxuICB9LCBbaXNQYXVzZWRdKVxuXG4gIGNvbnN0IHJ1bm5pbmdTdGF0dXMgPSBwYXlsb2FkLl9zaW5nbGVSdW5uaW5nU3RhdHVzIHx8IE5vZGVSdW5uaW5nU3RhdHVzLk5vdFN0YXJ0XG5cbiAgY29uc3Qgc2V0Tm9kZVJ1bm5pbmcgPSAoKSA9PiB7XG4gICAgaGFuZGxlTm9kZURhdGFVcGRhdGUoe1xuICAgICAgaWQ6IG5vZGVJZCxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLi4ucGF5bG9hZCxcbiAgICAgICAgX3NpbmdsZVJ1bm5pbmdTdGF0dXM6IE5vZGVSdW5uaW5nU3RhdHVzLlJ1bm5pbmcsXG4gICAgICB9LFxuICAgIH0pXG4gIH1cblxuICBjb25zdCBpbnZhbGlkTGFzdFJ1biA9IHVzZUludmFsaWRMYXN0UnVuKGZsb3dUeXBlLCBmbG93SWQsIG5vZGVJZClcblxuICBjb25zdCB1cGRhdGVSdW5SZXN1bHQgPSBhc3luYyAoZGF0YTogTm9kZVJ1blJlc3VsdCkgPT4ge1xuICAgIGNvbnN0IGlzUGF1c2VkID0gaXNQYXVzZWRSZWYuY3VycmVudFxuXG4gICAgLy8gVGhlIGJhY2tlbmQgZG9uJ3Qgc3VwcG9ydCBwYXVzZSB0aGUgc2luZ2xlIHJ1biwgc28gdGhlIGZyb250ZW5kIGhhbmRsZSB0aGUgcGF1c2Ugc3RhdGUuXG4gICAgaWYgKGlzUGF1c2VkKVxuICAgICAgcmV0dXJuXG5cbiAgICBjb25zdCBjYW5SdW5MYXN0UnVuID0gIWlzUnVuQWZ0ZXJTaW5nbGVSdW4gfHwgcnVubmluZ1N0YXR1cyA9PT0gTm9kZVJ1bm5pbmdTdGF0dXMuU3VjY2VlZGVkXG4gICAgaWYgKCFjYW5SdW5MYXN0UnVuKSB7XG4gICAgICBzZXRSdW5SZXN1bHQoZGF0YSlcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIC8vIHJ1biBmYWlsIG1heSBhbHNvIHVwZGF0ZSB0aGUgaW5zcGVjdCB2YXJzIHdoZW4gdGhlIG5vZGUgc2V0IHRoZSBlcnJvciBkZWZhdWx0IG91dHB1dC5cbiAgICBjb25zdCB2YXJzID0gYXdhaXQgZmV0Y2hOb2RlSW5zcGVjdFZhcnMoRmxvd1R5cGUucmFnUGlwZWxpbmUsIGZsb3dJZCwgbm9kZUlkKVxuICAgIGNvbnN0IHsgZ2V0Tm9kZXMgfSA9IHN0b3JlLmdldFN0YXRlKClcbiAgICBjb25zdCBub2RlcyA9IGdldE5vZGVzKClcbiAgICBhcHBlbmROb2RlSW5zcGVjdFZhcnMobm9kZUlkLCB2YXJzLCBub2RlcylcbiAgICBpZiAoZGF0YT8uc3RhdHVzID09PSBOb2RlUnVubmluZ1N0YXR1cy5TdWNjZWVkZWQpXG4gICAgICBvblN1Y2Nlc3MoKVxuICB9XG5cbiAgY29uc3QgeyBtdXRhdGVBc3luYzogaGFuZGxlRGF0YXNvdXJjZVNpbmdsZVJ1biwgaXNQZW5kaW5nIH0gPSB1c2VEYXRhc291cmNlU2luZ2xlUnVuKClcblxuICBjb25zdCBoYW5kbGVSdW4gPSAoKSA9PiB7XG4gICAgbGV0IGRhdGFzb3VyY2VJbmZvOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cbiAgICBjb25zdCB7IGN1cnJlbnRDcmVkZW50aWFsSWQ6IGNyZWRlbnRpYWxJZCB9ID0gZGF0YVNvdXJjZVN0b3JlLmdldFN0YXRlKClcbiAgICBpZiAoZGF0YXNvdXJjZVR5cGUgPT09IERhdGFzb3VyY2VUeXBlLmxvY2FsRmlsZSkge1xuICAgICAgY29uc3QgeyBsb2NhbEZpbGVMaXN0IH0gPSBkYXRhU291cmNlU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgY29uc3QgeyBpZCwgbmFtZSwgdHlwZSwgc2l6ZSwgZXh0ZW5zaW9uLCBtaW1lX3R5cGUgfSA9IGxvY2FsRmlsZUxpc3RbMF0uZmlsZVxuICAgICAgY29uc3QgZG9jdW1lbnRJbmZvID0ge1xuICAgICAgICByZWxhdGVkX2lkOiBpZCxcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgc2l6ZSxcbiAgICAgICAgZXh0ZW5zaW9uLFxuICAgICAgICBtaW1lX3R5cGUsXG4gICAgICAgIHVybDogJycsXG4gICAgICAgIHRyYW5zZmVyX21ldGhvZDogVHJhbnNmZXJNZXRob2QubG9jYWxfZmlsZSxcbiAgICAgIH1cbiAgICAgIGRhdGFzb3VyY2VJbmZvID0gZG9jdW1lbnRJbmZvXG4gICAgfVxuICAgIGlmIChkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUub25saW5lRG9jdW1lbnQpIHtcbiAgICAgIGNvbnN0IHsgb25saW5lRG9jdW1lbnRzIH0gPSBkYXRhU291cmNlU3RvcmUuZ2V0U3RhdGUoKVxuICAgICAgY29uc3QgeyB3b3Jrc3BhY2VfaWQsIC4uLnJlc3QgfSA9IG9ubGluZURvY3VtZW50c1swXVxuICAgICAgY29uc3QgZG9jdW1lbnRJbmZvID0ge1xuICAgICAgICB3b3Jrc3BhY2VfaWQsXG4gICAgICAgIHBhZ2U6IHJlc3QsXG4gICAgICAgIGNyZWRlbnRpYWxfaWQ6IGNyZWRlbnRpYWxJZCxcbiAgICAgIH1cbiAgICAgIGRhdGFzb3VyY2VJbmZvID0gZG9jdW1lbnRJbmZvXG4gICAgfVxuICAgIGlmIChkYXRhc291cmNlVHlwZSA9PT0gRGF0YXNvdXJjZVR5cGUud2Vic2l0ZUNyYXdsKSB7XG4gICAgICBjb25zdCB7IHdlYnNpdGVQYWdlcyB9ID0gZGF0YVNvdXJjZVN0b3JlLmdldFN0YXRlKClcbiAgICAgIGRhdGFzb3VyY2VJbmZvID0ge1xuICAgICAgICAuLi53ZWJzaXRlUGFnZXNbMF0sXG4gICAgICAgIGNyZWRlbnRpYWxfaWQ6IGNyZWRlbnRpYWxJZCxcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRhdGFzb3VyY2VUeXBlID09PSBEYXRhc291cmNlVHlwZS5vbmxpbmVEcml2ZSkge1xuICAgICAgY29uc3QgeyBidWNrZXQsIG9ubGluZURyaXZlRmlsZUxpc3QsIHNlbGVjdGVkRmlsZUlkcyB9ID0gZGF0YVNvdXJjZVN0b3JlLmdldFN0YXRlKClcbiAgICAgIGNvbnN0IGZpbGUgPSBvbmxpbmVEcml2ZUZpbGVMaXN0LmZpbmQoZmlsZSA9PiBmaWxlLmlkID09PSBzZWxlY3RlZEZpbGVJZHNbMF0pXG4gICAgICBkYXRhc291cmNlSW5mbyA9IHtcbiAgICAgICAgYnVja2V0LFxuICAgICAgICBpZDogZmlsZT8uaWQsXG4gICAgICAgIHR5cGU6IGZpbGU/LnR5cGUsXG4gICAgICAgIGNyZWRlbnRpYWxfaWQ6IGNyZWRlbnRpYWxJZCxcbiAgICAgIH1cbiAgICB9XG4gICAgbGV0IGhhc0Vycm9yID0gZmFsc2VcbiAgICBoYW5kbGVEYXRhc291cmNlU2luZ2xlUnVuKHtcbiAgICAgIHBpcGVsaW5lX2lkOiBmbG93SWQsXG4gICAgICBzdGFydF9ub2RlX2lkOiBub2RlSWQsXG4gICAgICBzdGFydF9ub2RlX3RpdGxlOiBkYXRhc291cmNlTm9kZURhdGEudGl0bGUsXG4gICAgICBkYXRhc291cmNlX3R5cGU6IGRhdGFzb3VyY2VUeXBlLFxuICAgICAgZGF0YXNvdXJjZV9pbmZvOiBkYXRhc291cmNlSW5mbyxcbiAgICB9LCB7XG4gICAgICBvbkVycm9yOiAoKSA9PiB7XG4gICAgICAgIGhhc0Vycm9yID0gdHJ1ZVxuICAgICAgICBpbnZhbGlkTGFzdFJ1bigpXG4gICAgICAgIGlmIChpc1BhdXNlZFJlZi5jdXJyZW50KVxuICAgICAgICAgIHJldHVyblxuICAgICAgICBoYW5kbGVOb2RlRGF0YVVwZGF0ZSh7XG4gICAgICAgICAgaWQ6IG5vZGVJZCxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAuLi5wYXlsb2FkLFxuICAgICAgICAgICAgX2lzU2luZ2xlUnVuOiBmYWxzZSxcbiAgICAgICAgICAgIF9zaW5nbGVSdW5uaW5nU3RhdHVzOiBOb2RlUnVubmluZ1N0YXR1cy5GYWlsZWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBvblNldHRsZWQ6IChkYXRhKSA9PiB7XG4gICAgICAgIHVwZGF0ZVJ1blJlc3VsdChkYXRhISlcbiAgICAgICAgaWYgKCFoYXNFcnJvciAmJiAhaXNQYXVzZWRSZWYuY3VycmVudCkge1xuICAgICAgICAgIGhhbmRsZU5vZGVEYXRhVXBkYXRlKHtcbiAgICAgICAgICAgIGlkOiBub2RlSWQsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIC4uLnBheWxvYWQsXG4gICAgICAgICAgICAgIF9pc1NpbmdsZVJ1bjogZmFsc2UsXG4gICAgICAgICAgICAgIF9zaW5nbGVSdW5uaW5nU3RhdHVzOiBOb2RlUnVubmluZ1N0YXR1cy5TdWNjZWVkZWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0IHsgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQgfSA9IHVzZU5vZGVzU3luY0RyYWZ0KClcblxuICBjb25zdCBoYW5kbGVSdW5XaXRoU3luY0RyYWZ0ID0gKCkgPT4ge1xuICAgIHNldE5vZGVSdW5uaW5nKClcbiAgICBzZXRJc1J1bkFmdGVyU2luZ2xlUnVuKHRydWUpXG4gICAgaGFuZGxlU3luY1dvcmtmbG93RHJhZnQodHJ1ZSwgdHJ1ZSwge1xuICAgICAgb25TdWNjZXNzKCkge1xuICAgICAgICBoYW5kbGVSdW4oKVxuICAgICAgfSxcbiAgICB9KVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpc1BlbmRpbmcsXG4gICAgaGFuZGxlUnVuV2l0aFN5bmNEcmFmdCxcbiAgICBkYXRhc291cmNlVHlwZSxcbiAgICBkYXRhc291cmNlTm9kZURhdGEsXG4gICAgc3RhcnRSdW5CdG5EaXNhYmxlZCxcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VCZWZvcmVSdW5Gb3JtXG4iXX0=