import { CollectionType } from '@/app/components/tools/types';
export declare const useAllToolProviders: (enabled?: boolean) => any;
export declare const useInvalidateAllToolProviders: () => () => void;
export declare const useAllBuiltInTools: () => any;
export declare const useInvalidateAllBuiltInTools: () => () => void;
export declare const useAllCustomTools: () => any;
export declare const useInvalidateAllCustomTools: () => () => void;
export declare const useAllWorkflowTools: () => any;
export declare const useInvalidateAllWorkflowTools: () => () => void;
export declare const useAllMCPTools: () => any;
export declare const useInvalidateAllMCPTools: () => () => void;
export declare const useInvalidToolsByType: (type?: CollectionType | string) => () => void;
export declare const useCreateMCP: () => any;
export declare const useUpdateMCP: ({ onSuccess, }: {
    onSuccess?: () => void;
}) => any;
export declare const useDeleteMCP: ({ onSuccess, }: {
    onSuccess?: () => void;
}) => any;
export declare const useAuthorizeMCP: () => any;
export declare const useUpdateMCPAuthorizationToken: () => any;
export declare const useMCPTools: (providerID: string) => any;
export declare const useInvalidateMCPTools: () => (providerID: string) => void;
export declare const useUpdateMCPTools: () => any;
export declare const useMCPServerDetail: (appID: string) => any;
export declare const useInvalidateMCPServerDetail: () => (appID: string) => void;
export declare const useCreateMCPServer: () => any;
export declare const useUpdateMCPServer: () => any;
export declare const useRefreshMCPServerCode: () => any;
export declare const useBuiltinProviderInfo: (providerName: string) => any;
export declare const useInvalidateBuiltinProviderInfo: () => (providerName: string) => void;
export declare const useBuiltinTools: (providerName: string) => any;
export declare const useUpdateProviderCredentials: ({ onSuccess, }: {
    onSuccess?: () => void;
}) => any;
export declare const useRemoveProviderCredentials: ({ onSuccess, }: {
    onSuccess?: () => void;
}) => any;
export declare const useRAGRecommendedPlugins: (type?: "tool" | "datasource" | "all") => any;
export declare const useInvalidateRAGRecommendedPlugins: () => (type?: "tool" | "datasource" | "all") => void;
export type AppTrigger = {
    id: string;
    trigger_type: 'trigger-webhook' | 'trigger-schedule' | 'trigger-plugin';
    title: string;
    node_id: string;
    provider_name: string;
    icon: string;
    status: 'enabled' | 'disabled' | 'unauthorized';
    created_at: string;
    updated_at: string;
};
export declare const useAppTriggers: (appId: string | undefined, options?: any) => any;
export declare const useInvalidateAppTriggers: () => (appId: string) => void;
export declare const useUpdateTriggerStatus: () => any;
