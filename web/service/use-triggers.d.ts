import type { TriggerOAuthClientParams } from '@/app/components/workflow/block-selector/types';
export declare const useAllTriggerPlugins: (enabled?: boolean) => any;
export declare const useTriggerPluginsByType: (triggerType: string, enabled?: boolean) => any;
export declare const useInvalidateAllTriggerPlugins: () => () => void;
export declare const useTriggerProviderInfo: (provider: string, enabled?: boolean) => any;
export declare const useTriggerSubscriptions: (provider: string, enabled?: boolean) => any;
export declare const useInvalidateTriggerSubscriptions: () => (provider: string) => void;
export declare const useCreateTriggerSubscriptionBuilder: () => any;
export declare const useUpdateTriggerSubscriptionBuilder: () => any;
export declare const useVerifyAndUpdateTriggerSubscriptionBuilder: () => any;
export declare const useVerifyTriggerSubscription: () => any;
export type BuildTriggerSubscriptionPayload = {
    provider: string;
    subscriptionBuilderId: string;
    name?: string;
    parameters?: Record<string, unknown>;
};
export declare const useBuildTriggerSubscription: () => any;
export declare const useDeleteTriggerSubscription: () => any;
export type UpdateTriggerSubscriptionPayload = {
    subscriptionId: string;
    name?: string;
    properties?: Record<string, unknown>;
    parameters?: Record<string, unknown>;
    credentials?: Record<string, unknown>;
};
export declare const useUpdateTriggerSubscription: () => any;
export declare const useTriggerSubscriptionBuilderLogs: (provider: string, subscriptionBuilderId: string, options?: {
    enabled?: boolean;
    refetchInterval?: number | false;
}) => any;
export declare const useTriggerOAuthConfig: (provider: string, enabled?: boolean) => any;
export type ConfigureTriggerOAuthPayload = {
    provider: string;
    client_params?: TriggerOAuthClientParams;
    enabled: boolean;
};
export declare const useConfigureTriggerOAuth: () => any;
export declare const useDeleteTriggerOAuth: () => any;
export declare const useInitiateTriggerOAuth: () => any;
export declare const useTriggerPluginDynamicOptions: (payload: {
    plugin_id: string;
    provider: string;
    action: string;
    parameter: string;
    credential_id: string;
    credentials?: Record<string, unknown>;
    extra?: Record<string, unknown>;
}, enabled?: boolean) => any;
export declare const useInvalidateTriggerOAuthConfig: () => (provider: string) => void;
