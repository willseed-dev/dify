"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamic_1 = require("next/dynamic");
const react_1 = require("react");
const reactflow_1 = require("reactflow");
const constants_1 = require("@/app/components/workflow/constants");
const hooks_1 = require("@/app/components/workflow/hooks");
const use_nodes_sync_draft_1 = require("@/app/components/workflow/hooks/use-nodes-sync-draft");
const store_1 = require("@/app/components/workflow/store");
const types_1 = require("@/app/components/workflow/types");
const utils_1 = require("@/app/components/workflow/utils");
const event_emitter_1 = require("@/context/event-emitter");
const plugin_dependency_1 = require("../../workflow/plugin-dependency");
const hooks_2 = require("../hooks");
const use_auto_onboarding_1 = require("../hooks/use-auto-onboarding");
const workflow_header_1 = require("./workflow-header");
const workflow_panel_1 = require("./workflow-panel");
const Features = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/workflow/features')), {
    ssr: false,
});
const UpdateDSLModal = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/workflow/update-dsl-modal')), {
    ssr: false,
});
const DSLExportConfirmModal = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('@/app/components/workflow/dsl-export-confirm-modal')), {
    ssr: false,
});
const WorkflowOnboardingModal = (0, dynamic_1.default)(() => Promise.resolve().then(() => require('./workflow-onboarding-modal')), {
    ssr: false,
});
const getTriggerPluginNodeData = (triggerConfig, fallbackTitle, fallbackDesc) => {
    return {
        plugin_id: triggerConfig.plugin_id,
        provider_id: triggerConfig.provider_name,
        provider_type: triggerConfig.provider_type,
        provider_name: triggerConfig.provider_name,
        event_name: triggerConfig.event_name,
        event_label: triggerConfig.event_label,
        event_description: triggerConfig.event_description,
        title: triggerConfig.event_label || triggerConfig.title || fallbackTitle,
        desc: triggerConfig.event_description || fallbackDesc,
        output_schema: { ...triggerConfig.output_schema },
        parameters_schema: triggerConfig.paramSchemas ? [...triggerConfig.paramSchemas] : [],
        config: { ...triggerConfig.params },
        subscription_id: triggerConfig.subscription_id,
        plugin_unique_identifier: triggerConfig.plugin_unique_identifier,
        is_team_authorization: triggerConfig.is_team_authorization,
        meta: triggerConfig.meta ? { ...triggerConfig.meta } : undefined,
    };
};
const WorkflowChildren = () => {
    const { eventEmitter } = (0, event_emitter_1.useEventEmitterContextContext)();
    const [secretEnvList, setSecretEnvList] = (0, react_1.useState)([]);
    const showFeaturesPanel = (0, store_1.useStore)(s => s.showFeaturesPanel);
    const showImportDSLModal = (0, store_1.useStore)(s => s.showImportDSLModal);
    const setShowImportDSLModal = (0, store_1.useStore)(s => s.setShowImportDSLModal);
    const showOnboarding = (0, store_1.useStore)(s => s.showOnboarding);
    const setShowOnboarding = (0, store_1.useStore)(s => s.setShowOnboarding);
    const setHasSelectedStartNode = (0, store_1.useStore)(s => s.setHasSelectedStartNode);
    const setShouldAutoOpenStartNodeSelector = (0, store_1.useStore)(s => s.setShouldAutoOpenStartNodeSelector);
    const reactFlowStore = (0, reactflow_1.useStoreApi)();
    const availableNodesMetaData = (0, hooks_2.useAvailableNodesMetaData)();
    const { handleSyncWorkflowDraft } = (0, use_nodes_sync_draft_1.useNodesSyncDraft)();
    const { handleOnboardingClose } = (0, use_auto_onboarding_1.useAutoOnboarding)();
    const { handlePaneContextmenuCancel, } = (0, hooks_1.usePanelInteractions)();
    const { exportCheck, handleExportDSL, } = (0, hooks_1.useDSL)();
    eventEmitter?.useSubscription((v) => {
        if (v.type === constants_1.DSL_EXPORT_CHECK)
            setSecretEnvList(v.payload.data);
    });
    const autoGenerateWebhookUrl = (0, hooks_1.useAutoGenerateWebhookUrl)();
    const handleCloseOnboarding = (0, react_1.useCallback)(() => {
        handleOnboardingClose();
    }, [handleOnboardingClose]);
    const handleSelectStartNode = (0, react_1.useCallback)((nodeType, toolConfig) => {
        const nodeDefault = availableNodesMetaData.nodesMap?.[nodeType];
        if (!nodeDefault?.defaultValue)
            return;
        const baseNodeData = { ...nodeDefault.defaultValue };
        const mergedNodeData = (() => {
            if (nodeType !== types_1.BlockEnum.TriggerPlugin || !toolConfig) {
                return {
                    ...baseNodeData,
                    ...toolConfig,
                };
            }
            const triggerNodeData = getTriggerPluginNodeData(toolConfig, baseNodeData.title, baseNodeData.desc);
            return {
                ...baseNodeData,
                ...triggerNodeData,
                config: {
                    ...baseNodeData.config,
                    ...triggerNodeData.config,
                },
            };
        })();
        const { newNode } = (0, utils_1.generateNewNode)({
            data: {
                ...mergedNodeData,
            },
            position: constants_1.START_INITIAL_POSITION,
        });
        const { setNodes, setEdges } = reactFlowStore.getState();
        setNodes([newNode]);
        setEdges([]);
        setShowOnboarding?.(false);
        setHasSelectedStartNode?.(true);
        setShouldAutoOpenStartNodeSelector?.(true);
        handleSyncWorkflowDraft(true, false, {
            onSuccess: () => {
                autoGenerateWebhookUrl(newNode.id);
                console.log('Node successfully saved to draft');
            },
            onError: () => {
                console.error('Failed to save node to draft');
            },
        });
    }, [availableNodesMetaData, setShowOnboarding, setHasSelectedStartNode, reactFlowStore, handleSyncWorkflowDraft]);
    return (<>
      <plugin_dependency_1.default />
      {showFeaturesPanel && <Features />}
      {showOnboarding && (<WorkflowOnboardingModal isShow={showOnboarding} onClose={handleCloseOnboarding} onSelectStartNode={handleSelectStartNode}/>)}
      {showImportDSLModal && (<UpdateDSLModal onCancel={() => setShowImportDSLModal(false)} onBackup={exportCheck} onImport={handlePaneContextmenuCancel}/>)}
      {secretEnvList.length > 0 && (<DSLExportConfirmModal envList={secretEnvList} onConfirm={handleExportDSL} onClose={() => setSecretEnvList([])}/>)}
      <workflow_header_1.default />
      <workflow_panel_1.default />
    </>);
};
exports.default = (0, react_1.memo)(WorkflowChildren);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2Zsb3ctY2hpbGRyZW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3b3JrZmxvdy1jaGlsZHJlbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSwwQ0FBa0M7QUFDbEMsaUNBSWM7QUFDZCx5Q0FBdUM7QUFDdkMsbUVBQThGO0FBQzlGLDJEQUl3QztBQUN4QywrRkFBd0Y7QUFDeEYsMkRBQTBEO0FBQzFELDJEQUEyRDtBQUMzRCwyREFBaUU7QUFDakUsMkRBQXVFO0FBQ3ZFLHdFQUErRDtBQUMvRCxvQ0FBb0Q7QUFDcEQsc0VBQWdFO0FBQ2hFLHVEQUE4QztBQUM5QyxxREFBNEM7QUFFNUMsTUFBTSxRQUFRLEdBQUcsSUFBQSxpQkFBTyxFQUFDLEdBQUcsRUFBRSxzQ0FBUSxvQ0FBb0MsRUFBQyxFQUFFO0lBQzNFLEdBQUcsRUFBRSxLQUFLO0NBQ1gsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxjQUFjLEdBQUcsSUFBQSxpQkFBTyxFQUFDLEdBQUcsRUFBRSxzQ0FBUSw0Q0FBNEMsRUFBQyxFQUFFO0lBQ3pGLEdBQUcsRUFBRSxLQUFLO0NBQ1gsQ0FBQyxDQUFBO0FBQ0YsTUFBTSxxQkFBcUIsR0FBRyxJQUFBLGlCQUFPLEVBQUMsR0FBRyxFQUFFLHNDQUFRLG9EQUFvRCxFQUFDLEVBQUU7SUFDeEcsR0FBRyxFQUFFLEtBQUs7Q0FDWCxDQUFDLENBQUE7QUFDRixNQUFNLHVCQUF1QixHQUFHLElBQUEsaUJBQU8sRUFBQyxHQUFHLEVBQUUsc0NBQVEsNkJBQTZCLEVBQUMsRUFBRTtJQUNuRixHQUFHLEVBQUUsS0FBSztDQUNYLENBQUMsQ0FBQTtBQUVGLE1BQU0sd0JBQXdCLEdBQUcsQ0FDL0IsYUFBa0MsRUFDbEMsYUFBc0IsRUFDdEIsWUFBcUIsRUFDckIsRUFBRTtJQUNGLE9BQU87UUFDTCxTQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVM7UUFDbEMsV0FBVyxFQUFFLGFBQWEsQ0FBQyxhQUFhO1FBQ3hDLGFBQWEsRUFBRSxhQUFhLENB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cUIsQ0FBQyxDQUMvQixpQkFBaUIsQ0FBQyxDQUFDLHFCQUFxQixDQUFDLEVBQ3pDLENBRU4sQ0FDQTtNQUFBLENBQ0Usa0JBQWtCLElBQUksQ0FDcEIsQ0FBQyxjQUFjLENBQ2IsUUFBUSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FDN0MsUUFBUSxDQUFDLENBQUMsV0FBWSxDQUFDLENBQ3ZCLFFBQVEsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLEVBQ3RDLENBRU4sQ0FDQTtNQUFBLENBQ0UsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FDMUIsQ0FBQyxxQkFBcUIsQ0FDcEIsT0FBTyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQ3ZCLFNBQVMsQ0FBQyxDQUFDLGVBQWdCLENBQUMsQ0FDNUIsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUMsRUFDcEMsQ0FFTixDQUNBO01BQUEsQ0FBQyx5QkFBYyxDQUFDLEFBQUQsRUFDZjtNQUFBLENBQUMsd0JBQWEsQ0FBQyxBQUFELEVBQ2hCO0lBQUEsR0FBRyxDQUNKLENBQUE7QUFDSCxDQUFDLENBQUE7QUFFRCxrQkFBZSxJQUFBLFlBQUksRUFBQyxnQkFBZ0IsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUge1xuICBQbHVnaW5EZWZhdWx0VmFsdWUsXG4gIFRyaWdnZXJEZWZhdWx0VmFsdWUsXG59IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvYmxvY2stc2VsZWN0b3IvdHlwZXMnXG5pbXBvcnQgdHlwZSB7IEVudmlyb25tZW50VmFyaWFibGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3R5cGVzJ1xuaW1wb3J0IGR5bmFtaWMgZnJvbSAnbmV4dC9keW5hbWljJ1xuaW1wb3J0IHtcbiAgbWVtbyxcbiAgdXNlQ2FsbGJhY2ssXG4gIHVzZVN0YXRlLFxufSBmcm9tICdyZWFjdCdcbmltcG9ydCB7IHVzZVN0b3JlQXBpIH0gZnJvbSAncmVhY3RmbG93J1xuaW1wb3J0IHsgRFNMX0VYUE9SVF9DSEVDSywgU1RBUlRfSU5JVElBTF9QT1NJVElPTiB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvY29uc3RhbnRzJ1xuaW1wb3J0IHtcbiAgdXNlQXV0b0dlbmVyYXRlV2ViaG9va1VybCxcbiAgdXNlRFNMLFxuICB1c2VQYW5lbEludGVyYWN0aW9ucyxcbn0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcydcbmltcG9ydCB7IHVzZU5vZGVzU3luY0RyYWZ0IH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9ob29rcy91c2Utbm9kZXMtc3luYy1kcmFmdCdcbmltcG9ydCB7IHVzZVN0b3JlIH0gZnJvbSAnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9zdG9yZSdcbmltcG9ydCB7IEJsb2NrRW51bSB9IGZyb20gJ0AvYXBwL2NvbXBvbmVudHMvd29ya2Zsb3cvdHlwZXMnXG5pbXBvcnQgeyBnZW5lcmF0ZU5ld05vZGUgfSBmcm9tICdAL2FwcC9jb21wb25lbnRzL3dvcmtmbG93L3V0aWxzJ1xuaW1wb3J0IHsgdXNlRXZlbnRFbWl0dGVyQ29udGV4dENvbnRleHQgfSBmcm9tICdAL2NvbnRleHQvZXZlbnQtZW1pdHRlcidcbmltcG9ydCBQbHVnaW5EZXBlbmRlbmN5IGZyb20gJy4uLy4uL3dvcmtmbG93L3BsdWdpbi1kZXBlbmRlbmN5J1xuaW1wb3J0IHsgdXNlQXZhaWxhYmxlTm9kZXNNZXRhRGF0YSB9IGZyb20gJy4uL2hvb2tzJ1xuaW1wb3J0IHsgdXNlQXV0b09uYm9hcmRpbmcgfSBmcm9tICcuLi9ob29rcy91c2UtYXV0by1vbmJvYXJkaW5nJ1xuaW1wb3J0IFdvcmtmbG93SGVhZGVyIGZyb20gJy4vd29ya2Zsb3ctaGVhZGVyJ1xuaW1wb3J0IFdvcmtmbG93UGFuZWwgZnJvbSAnLi93b3JrZmxvdy1wYW5lbCdcblxuY29uc3QgRmVhdHVyZXMgPSBkeW5hbWljKCgpID0+IGltcG9ydCgnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9mZWF0dXJlcycpLCB7XG4gIHNzcjogZmFsc2UsXG59KVxuY29uc3QgVXBkYXRlRFNMTW9kYWwgPSBkeW5hbWljKCgpID0+IGltcG9ydCgnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy91cGRhdGUtZHNsLW1vZGFsJyksIHtcbiAgc3NyOiBmYWxzZSxcbn0pXG5jb25zdCBEU0xFeHBvcnRDb25maXJtTW9kYWwgPSBkeW5hbWljKCgpID0+IGltcG9ydCgnQC9hcHAvY29tcG9uZW50cy93b3JrZmxvdy9kc2wtZXhwb3J0LWNvbmZpcm0tbW9kYWwnKSwge1xuICBzc3I6IGZhbHNlLFxufSlcbmNvbnN0IFdvcmtmbG93T25ib2FyZGluZ01vZGFsID0gZHluYW1pYygoKSA9PiBpbXBvcnQoJy4vd29ya2Zsb3ctb25ib2FyZGluZy1tb2RhbCcpLCB7XG4gIHNzcjogZmFsc2UsXG59KVxuXG5jb25zdCBnZXRUcmlnZ2VyUGx1Z2luTm9kZURhdGEgPSAoXG4gIHRyaWdnZXJDb25maWc6IFRyaWdnZXJEZWZhdWx0VmFsdWUsXG4gIGZhbGxiYWNrVGl0bGU/OiBzdHJpbmcsXG4gIGZhbGxiYWNrRGVzYz86IHN0cmluZyxcbikgPT4ge1xuICByZXR1cm4ge1xuICAgIHBsdWdpbl9pZDogdHJpZ2dlckNvbmZpZy5wbHVnaW5faWQsXG4gICAgcHJvdmlkZXJfaWQ6IHRyaWdnZXJDb25maWcucHJvdmlkZXJfbmFtZSxcbiAgICBwcm92aWRlcl90eXBlOiB0cmlnZ2VyQ29uZmlnLnByb3ZpZGVyX3R5cGUsXG4gICAgcHJvdmlkZXJfbmFtZTogdHJpZ2dlckNvbmZpZy5wcm92aWRlcl9uYW1lLFxuICAgIGV2ZW50X25hbWU6IHRyaWdnZXJDb25maWcuZXZlbnRfbmFtZSxcbiAgICBldmVudF9sYWJlbDogdHJpZ2dlckNvbmZpZy5ldmVudF9sYWJlbCxcbiAgICBldmVudF9kZXNjcmlwdGlvbjogdHJpZ2dlckNvbmZpZy5ldmVudF9kZXNjcmlwdGlvbixcbiAgICB0aXRsZTogdHJpZ2dlckNvbmZpZy5ldmVudF9sYWJlbCB8fCB0cmlnZ2VyQ29uZmlnLnRpdGxlIHx8IGZhbGxiYWNrVGl0bGUsXG4gICAgZGVzYzogdHJpZ2dlckNvbmZpZy5ldmVudF9kZXNjcmlwdGlvbiB8fCBmYWxsYmFja0Rlc2MsXG4gICAgb3V0cHV0X3NjaGVtYTogeyAuLi50cmlnZ2VyQ29uZmlnLm91dHB1dF9zY2hlbWEgfSxcbiAgICBwYXJhbWV0ZXJzX3NjaGVtYTogdHJpZ2dlckNvbmZpZy5wYXJhbVNjaGVtYXMgPyBbLi4udHJpZ2dlckNvbmZpZy5wYXJhbVNjaGVtYXNdIDogW10sXG4gICAgY29uZmlnOiB7IC4uLnRyaWdnZXJDb25maWcucGFyYW1zIH0sXG4gICAgc3Vic2NyaXB0aW9uX2lkOiB0cmlnZ2VyQ29uZmlnLnN1YnNjcmlwdGlvbl9pZCxcbiAgICBwbHVnaW5fdW5pcXVlX2lkZW50aWZpZXI6IHRyaWdnZXJDb25maWcucGx1Z2luX3VuaXF1ZV9pZGVudGlmaWVyLFxuICAgIGlzX3RlYW1fYXV0aG9yaXphdGlvbjogdHJpZ2dlckNvbmZpZy5pc190ZWFtX2F1dGhvcml6YXRpb24sXG4gICAgbWV0YTogdHJpZ2dlckNvbmZpZy5tZXRhID8geyAuLi50cmlnZ2VyQ29uZmlnLm1ldGEgfSA6IHVuZGVmaW5lZCxcbiAgfVxufVxuXG5jb25zdCBXb3JrZmxvd0NoaWxkcmVuID0gKCkgPT4ge1xuICBjb25zdCB7IGV2ZW50RW1pdHRlciB9ID0gdXNlRXZlbnRFbWl0dGVyQ29udGV4dENvbnRleHQoKVxuICBjb25zdCBbc2VjcmV0RW52TGlzdCwgc2V0U2VjcmV0RW52TGlzdF0gPSB1c2VTdGF0ZTxFbnZpcm9ubWVudFZhcmlhYmxlW10+KFtdKVxuICBjb25zdCBzaG93RmVhdHVyZXNQYW5lbCA9IHVzZVN0b3JlKHMgPT4gcy5zaG93RmVhdHVyZXNQYW5lbClcbiAgY29uc3Qgc2hvd0ltcG9ydERTTE1vZGFsID0gdXNlU3RvcmUocyA9PiBzLnNob3dJbXBvcnREU0xNb2RhbClcbiAgY29uc3Qgc2V0U2hvd0ltcG9ydERTTE1vZGFsID0gdXNlU3RvcmUocyA9PiBzLnNldFNob3dJbXBvcnREU0xNb2RhbClcbiAgY29uc3Qgc2hvd09uYm9hcmRpbmcgPSB1c2VTdG9yZShzID0+IHMuc2hvd09uYm9hcmRpbmcpXG4gIGNvbnN0IHNldFNob3dPbmJvYXJkaW5nID0gdXNlU3RvcmUocyA9PiBzLnNldFNob3dPbmJvYXJkaW5nKVxuICBjb25zdCBzZXRIYXNTZWxlY3RlZFN0YXJ0Tm9kZSA9IHVzZVN0b3JlKHMgPT4gcy5zZXRIYXNTZWxlY3RlZFN0YXJ0Tm9kZSlcbiAgY29uc3Qgc2V0U2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3RvciA9IHVzZVN0b3JlKHMgPT4gcy5zZXRTaG91bGRBdXRvT3BlblN0YXJ0Tm9kZVNlbGVjdG9yKVxuICBjb25zdCByZWFjdEZsb3dTdG9yZSA9IHVzZVN0b3JlQXBpKClcbiAgY29uc3QgYXZhaWxhYmxlTm9kZXNNZXRhRGF0YSA9IHVzZUF2YWlsYWJsZU5vZGVzTWV0YURhdGEoKVxuICBjb25zdCB7IGhhbmRsZVN5bmNXb3JrZmxvd0RyYWZ0IH0gPSB1c2VOb2Rlc1N5bmNEcmFmdCgpXG4gIGNvbnN0IHsgaGFuZGxlT25ib2FyZGluZ0Nsb3NlIH0gPSB1c2VBdXRvT25ib2FyZGluZygpXG4gIGNvbnN0IHtcbiAgICBoYW5kbGVQYW5lQ29udGV4dG1lbnVDYW5jZWwsXG4gIH0gPSB1c2VQYW5lbEludGVyYWN0aW9ucygpXG4gIGNvbnN0IHtcbiAgICBleHBvcnRDaGVjayxcbiAgICBoYW5kbGVFeHBvcnREU0wsXG4gIH0gPSB1c2VEU0woKVxuXG4gIGV2ZW50RW1pdHRlcj8udXNlU3Vic2NyaXB0aW9uKCh2OiBhbnkpID0+IHtcbiAgICBpZiAodi50eXBlID09PSBEU0xfRVhQT1JUX0NIRUNLKVxuICAgICAgc2V0U2VjcmV0RW52TGlzdCh2LnBheWxvYWQuZGF0YSBhcyBFbnZpcm9ubWVudFZhcmlhYmxlW10pXG4gIH0pXG5cbiAgY29uc3QgYXV0b0dlbmVyYXRlV2ViaG9va1VybCA9IHVzZUF1dG9HZW5lcmF0ZVdlYmhvb2tVcmwoKVxuXG4gIGNvbnN0IGhhbmRsZUNsb3NlT25ib2FyZGluZyA9IHVzZUNhbGxiYWNrKCgpID0+IHtcbiAgICBoYW5kbGVPbmJvYXJkaW5nQ2xvc2UoKVxuICB9LCBbaGFuZGxlT25ib2FyZGluZ0Nsb3NlXSlcblxuICBjb25zdCBoYW5kbGVTZWxlY3RTdGFydE5vZGUgPSB1c2VDYWxsYmFjaygobm9kZVR5cGU6IEJsb2NrRW51bSwgdG9vbENvbmZpZz86IFBsdWdpbkRlZmF1bHRWYWx1ZSkgPT4ge1xuICAgIGNvbnN0IG5vZGVEZWZhdWx0ID0gYXZhaWxhYmxlTm9kZXNNZXRhRGF0YS5ub2Rlc01hcD8uW25vZGVUeXBlXVxuICAgIGlmICghbm9kZURlZmF1bHQ/LmRlZmF1bHRWYWx1ZSlcbiAgICAgIHJldHVyblxuXG4gICAgY29uc3QgYmFzZU5vZGVEYXRhID0geyAuLi5ub2RlRGVmYXVsdC5kZWZhdWx0VmFsdWUgfVxuXG4gICAgY29uc3QgbWVyZ2VkTm9kZURhdGEgPSAoKCkgPT4ge1xuICAgICAgaWYgKG5vZGVUeXBlICE9PSBCbG9ja0VudW0uVHJpZ2dlclBsdWdpbiB8fCAhdG9vbENvbmZpZykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLmJhc2VOb2RlRGF0YSxcbiAgICAgICAgICAuLi50b29sQ29uZmlnLFxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRyaWdnZXJOb2RlRGF0YSA9IGdldFRyaWdnZXJQbHVnaW5Ob2RlRGF0YShcbiAgICAgICAgdG9vbENvbmZpZyBhcyBUcmlnZ2VyRGVmYXVsdFZhbHVlLFxuICAgICAgICBiYXNlTm9kZURhdGEudGl0bGUsXG4gICAgICAgIGJhc2VOb2RlRGF0YS5kZXNjLFxuICAgICAgKVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5iYXNlTm9kZURhdGEsXG4gICAgICAgIC4uLnRyaWdnZXJOb2RlRGF0YSxcbiAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgLi4uKGJhc2VOb2RlRGF0YSBhcyB7IGNvbmZpZz86IFJlY29yZDxzdHJpbmcsIGFueT4gfSkuY29uZmlnLFxuICAgICAgICAgIC4uLnRyaWdnZXJOb2RlRGF0YS5jb25maWcsXG4gICAgICAgIH0sXG4gICAgICB9XG4gICAgfSkoKVxuXG4gICAgY29uc3QgeyBuZXdOb2RlIH0gPSBnZW5lcmF0ZU5ld05vZGUoe1xuICAgICAgZGF0YToge1xuICAgICAgICAuLi5tZXJnZWROb2RlRGF0YSxcbiAgICAgIH0gYXMgYW55LFxuICAgICAgcG9zaXRpb246IFNUQVJUX0lOSVRJQUxfUE9TSVRJT04sXG4gICAgfSlcblxuICAgIGNvbnN0IHsgc2V0Tm9kZXMsIHNldEVkZ2VzIH0gPSByZWFjdEZsb3dTdG9yZS5nZXRTdGF0ZSgpXG4gICAgc2V0Tm9kZXMoW25ld05vZGVdKVxuICAgIHNldEVkZ2VzKFtdKVxuXG4gICAgc2V0U2hvd09uYm9hcmRpbmc/LihmYWxzZSlcbiAgICBzZXRIYXNTZWxlY3RlZFN0YXJ0Tm9kZT8uKHRydWUpXG4gICAgc2V0U2hvdWxkQXV0b09wZW5TdGFydE5vZGVTZWxlY3Rvcj8uKHRydWUpXG5cbiAgICBoYW5kbGVTeW5jV29ya2Zsb3dEcmFmdCh0cnVlLCBmYWxzZSwge1xuICAgICAgb25TdWNjZXNzOiAoKSA9PiB7XG4gICAgICAgIGF1dG9HZW5lcmF0ZVdlYmhvb2tVcmwobmV3Tm9kZS5pZClcbiAgICAgICAgY29uc29sZS5sb2coJ05vZGUgc3VjY2Vzc2Z1bGx5IHNhdmVkIHRvIGRyYWZ0JylcbiAgICAgIH0sXG4gICAgICBvbkVycm9yOiAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBzYXZlIG5vZGUgdG8gZHJhZnQnKVxuICAgICAgfSxcbiAgICB9KVxuICB9LCBbYXZhaWxhYmxlTm9kZXNNZXRhRGF0YSwgc2V0U2hvd09uYm9hcmRpbmcsIHNldEhhc1NlbGVjdGVkU3RhcnROb2RlLCByZWFjdEZsb3dTdG9yZSwgaGFuZGxlU3luY1dvcmtmbG93RHJhZnRdKVxuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxQbHVnaW5EZXBlbmRlbmN5IC8+XG4gICAgICB7XG4gICAgICAgIHNob3dGZWF0dXJlc1BhbmVsICYmIDxGZWF0dXJlcyAvPlxuICAgICAgfVxuICAgICAge1xuICAgICAgICBzaG93T25ib2FyZGluZyAmJiAoXG4gICAgICAgICAgPFdvcmtmbG93T25ib2FyZGluZ01vZGFsXG4gICAgICAgICAgICBpc1Nob3c9e3Nob3dPbmJvYXJkaW5nfVxuICAgICAgICAgICAgb25DbG9zZT17aGFuZGxlQ2xvc2VPbmJvYXJkaW5nfVxuICAgICAgICAgICAgb25TZWxlY3RTdGFydE5vZGU9e2hhbmRsZVNlbGVjdFN0YXJ0Tm9kZX1cbiAgICAgICAgICAvPlxuICAgICAgICApXG4gICAgICB9XG4gICAgICB7XG4gICAgICAgIHNob3dJbXBvcnREU0xNb2RhbCAmJiAoXG4gICAgICAgICAgPFVwZGF0ZURTTE1vZGFsXG4gICAgICAgICAgICBvbkNhbmNlbD17KCkgPT4gc2V0U2hvd0ltcG9ydERTTE1vZGFsKGZhbHNlKX1cbiAgICAgICAgICAgIG9uQmFja3VwPXtleHBvcnRDaGVjayF9XG4gICAgICAgICAgICBvbkltcG9ydD17aGFuZGxlUGFuZUNvbnRleHRtZW51Q2FuY2VsfVxuICAgICAgICAgIC8+XG4gICAgICAgIClcbiAgICAgIH1cbiAgICAgIHtcbiAgICAgICAgc2VjcmV0RW52TGlzdC5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICA8RFNMRXhwb3J0Q29uZmlybU1vZGFsXG4gICAgICAgICAgICBlbnZMaXN0PXtzZWNyZXRFbnZMaXN0fVxuICAgICAgICAgICAgb25Db25maXJtPXtoYW5kbGVFeHBvcnREU0whfVxuICAgICAgICAgICAgb25DbG9zZT17KCkgPT4gc2V0U2VjcmV0RW52TGlzdChbXSl9XG4gICAgICAgICAgLz5cbiAgICAgICAgKVxuICAgICAgfVxuICAgICAgPFdvcmtmbG93SGVhZGVyIC8+XG4gICAgICA8V29ya2Zsb3dQYW5lbCAvPlxuICAgIDwvPlxuICApXG59XG5cbmV4cG9ydCBkZWZhdWx0IG1lbW8oV29ya2Zsb3dDaGlsZHJlbilcbiJdfQ==