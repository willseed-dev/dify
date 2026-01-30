import type { FetchWorkflowDraftResponse } from '@/types/workflow';
export type TriggerPluginNodePayload = {
    title: string;
    desc: string;
    plugin_id: string;
    provider_id: string;
    event_name: string;
    subscription_id: string;
    plugin_unique_identifier: string;
    event_parameters: Record<string, unknown>;
};
export type WorkflowDraftSyncParams = Pick<FetchWorkflowDraftResponse, 'graph' | 'features' | 'environment_variables' | 'conversation_variables'>;
export declare const sanitizeWorkflowDraftPayload: (params: WorkflowDraftSyncParams) => WorkflowDraftSyncParams;
export declare const hydrateWorkflowDraftResponse: (draft: FetchWorkflowDraftResponse) => FetchWorkflowDraftResponse;
