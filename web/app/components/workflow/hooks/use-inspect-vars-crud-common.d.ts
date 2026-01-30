import type { FlowType } from '@/types/common';
type Params = {
    flowId: string;
    flowType: FlowType;
};
export declare const useInspectVarsCrudCommon: ({ flowId, flowType, }: Params) => {
    hasNodeInspectVars: any;
    hasSetInspectVar: any;
    fetchInspectVarValue: any;
    editInspectVarValue: any;
    renameInspectVarName: any;
    appendNodeInspectVars: any;
    deleteInspectVar: any;
    deleteNodeInspectorVars: any;
    deleteAllInspectorVars: any;
    isInspectVarEdited: any;
    resetToLastRunVar: any;
    invalidateSysVarValues: any;
    resetConversationVar: any;
    invalidateConversationVarValues: any;
};
export {};
