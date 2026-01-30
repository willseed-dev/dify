import type { FileUpload } from '../../base/features/types';
import type { BlockEnum, Node, NodeDefault, ToolWithProvider, ValueSelector } from '@/app/components/workflow/types';
import type { IOtherOptions } from '@/service/base';
import type { SchemaTypeDefinition } from '@/service/use-common';
import type { FlowType } from '@/types/common';
import type { VarInInspect } from '@/types/workflow';
export type AvailableNodesMetaData = {
    nodes: NodeDefault[];
    nodesMap?: Record<BlockEnum, NodeDefault<any>>;
};
export type CommonHooksFnMap = {
    doSyncWorkflowDraft: (notRefreshWhenSyncError?: boolean, callback?: {
        onSuccess?: () => void;
        onError?: () => void;
        onSettled?: () => void;
    }) => Promise<void>;
    syncWorkflowDraftWhenPageClose: () => void;
    handleRefreshWorkflowDraft: () => void;
    handleBackupDraft: () => void;
    handleLoadBackupDraft: () => void;
    handleRestoreFromPublishedWorkflow: (...args: any[]) => void;
    handleRun: (params: any, callback?: IOtherOptions, options?: any) => void;
    handleStopRun: (...args: any[]) => void;
    handleStartWorkflowRun: () => void;
    handleWorkflowStartRunInWorkflow: () => void;
    handleWorkflowStartRunInChatflow: () => void;
    handleWorkflowTriggerScheduleRunInWorkflow: (nodeId?: string) => void;
    handleWorkflowTriggerWebhookRunInWorkflow: (params: {
        nodeId: string;
    }) => void;
    handleWorkflowTriggerPluginRunInWorkflow: (nodeId?: string) => void;
    handleWorkflowRunAllTriggersInWorkflow: (nodeIds: string[]) => void;
    availableNodesMetaData?: AvailableNodesMetaData;
    getWorkflowRunAndTraceUrl: (runId?: string) => {
        runUrl: string;
        traceUrl: string;
    };
    exportCheck?: () => Promise<void>;
    handleExportDSL?: (include?: boolean, flowId?: string) => Promise<void>;
    fetchInspectVars: (params: {
        passInVars?: boolean;
        vars?: VarInInspect[];
        passedInAllPluginInfoList?: Record<string, ToolWithProvider[]>;
        passedInSchemaTypeDefinitions?: SchemaTypeDefinition[];
    }) => Promise<void>;
    hasNodeInspectVars: (nodeId: string) => boolean;
    hasSetInspectVar: (nodeId: string, name: string, sysVars: VarInInspect[], conversationVars: VarInInspect[]) => boolean;
    fetchInspectVarValue: (selector: ValueSelector, schemaTypeDefinitions: SchemaTypeDefinition[]) => Promise<void>;
    editInspectVarValue: (nodeId: string, varId: string, value: any) => Promise<void>;
    renameInspectVarName: (nodeId: string, oldName: string, newName: string) => Promise<void>;
    appendNodeInspectVars: (nodeId: string, payload: VarInInspect[], allNodes: Node[]) => void;
    deleteInspectVar: (nodeId: string, varId: string) => Promise<void>;
    deleteNodeInspectorVars: (nodeId: string) => Promise<void>;
    deleteAllInspectorVars: () => Promise<void>;
    isInspectVarEdited: (nodeId: string, name: string) => boolean;
    resetToLastRunVar: (nodeId: string, varId: string) => Promise<void>;
    invalidateSysVarValues: () => void;
    resetConversationVar: (varId: string) => Promise<void>;
    invalidateConversationVarValues: () => void;
    configsMap?: {
        flowId: string;
        flowType: FlowType;
        fileSettings: FileUpload;
    };
};
export type Shape = {
    refreshAll: (props: Partial<CommonHooksFnMap>) => void;
} & CommonHooksFnMap;
export declare const createHooksStore: ({ doSyncWorkflowDraft, syncWorkflowDraftWhenPageClose, handleRefreshWorkflowDraft, handleBackupDraft, handleLoadBackupDraft, handleRestoreFromPublishedWorkflow, handleRun, handleStopRun, handleStartWorkflowRun, handleWorkflowStartRunInWorkflow, handleWorkflowStartRunInChatflow, handleWorkflowTriggerScheduleRunInWorkflow, handleWorkflowTriggerWebhookRunInWorkflow, handleWorkflowTriggerPluginRunInWorkflow, handleWorkflowRunAllTriggersInWorkflow, availableNodesMetaData, getWorkflowRunAndTraceUrl, exportCheck, handleExportDSL, fetchInspectVars, hasNodeInspectVars, hasSetInspectVar, fetchInspectVarValue, editInspectVarValue, renameInspectVarName, appendNodeInspectVars, deleteInspectVar, deleteNodeInspectorVars, deleteAllInspectorVars, isInspectVarEdited, resetToLastRunVar, invalidateSysVarValues, resetConversationVar, invalidateConversationVarValues, }: Partial<Shape>) => any;
export declare function useHooksStore<T>(selector: (state: Shape) => T): T;
export declare const useHooksStoreApi: () => any;
