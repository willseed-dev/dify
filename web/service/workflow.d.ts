import type { BlockEnum } from '@/app/components/workflow/types';
import type { FlowType } from '@/types/common';
import type { FetchWorkflowDraftResponse, VarInInspect } from '@/types/workflow';
export declare const fetchWorkflowDraft: (url: string) => Promise<FetchWorkflowDraftResponse>;
export declare const syncWorkflowDraft: ({ url, params }: {
    url: string;
    params: Pick<FetchWorkflowDraftResponse, "graph" | "features" | "environment_variables" | "conversation_variables">;
}) => Promise<any>;
export declare const fetchNodesDefaultConfigs: (url: string) => Promise<any>;
export declare const singleNodeRun: (flowType: FlowType, flowId: string, nodeId: string, params: object) => Promise<any>;
export declare const getIterationSingleNodeRunUrl: (flowType: FlowType, isChatFlow: boolean, flowId: string, nodeId: string) => string;
export declare const getLoopSingleNodeRunUrl: (flowType: FlowType, isChatFlow: boolean, flowId: string, nodeId: string) => string;
export declare const fetchPublishedWorkflow: (url: string) => Promise<any>;
export declare const stopWorkflowRun: (url: string) => Promise<any>;
export declare const fetchNodeDefault: (appId: string, blockType: BlockEnum, query?: {}) => Promise<any>;
export declare const fetchPipelineNodeDefault: (pipelineId: string, blockType: BlockEnum, query?: {}) => Promise<any>;
export declare const fetchCurrentValueOfConversationVariable: ({ url, params, }: {
    url: string;
    params: {
        conversation_id: string;
    };
}) => Promise<any>;
export declare const fetchAllInspectVars: (flowType: FlowType, flowId: string) => Promise<VarInInspect[]>;
export declare const fetchNodeInspectVars: (flowType: FlowType, flowId: string, nodeId: string) => Promise<VarInInspect[]>;
