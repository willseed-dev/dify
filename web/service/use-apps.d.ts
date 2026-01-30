import type { GeneratorType } from '@/app/components/app/configuration/config/automatic/types';
import { AppModeEnum } from '@/types/app';
type AppListParams = {
    page?: number;
    limit?: number;
    name?: string;
    mode?: AppModeEnum | 'all';
    tag_ids?: string[];
    is_created_by_me?: boolean;
};
type DateRangeParams = {
    start?: string;
    end?: string;
};
export declare const useGenerateRuleTemplate: (type: GeneratorType, disabled?: boolean) => any;
export declare const useAppDetail: (appID: string) => any;
export declare const useAppList: (params: AppListParams, options?: {
    enabled?: boolean;
}) => any;
export declare const useAppFullList: () => any;
export declare const useInvalidateAppFullList: () => () => void;
export declare const useInfiniteAppList: (params: AppListParams, options?: {
    enabled?: boolean;
}) => any;
export declare const useInvalidateAppList: () => () => void;
export declare const useAppDailyMessages: (appId: string, params?: DateRangeParams) => any;
export declare const useAppDailyConversations: (appId: string, params?: DateRangeParams) => any;
export declare const useAppDailyEndUsers: (appId: string, params?: DateRangeParams) => any;
export declare const useAppAverageSessionInteractions: (appId: string, params?: DateRangeParams) => any;
export declare const useAppAverageResponseTime: (appId: string, params?: DateRangeParams) => any;
export declare const useAppTokensPerSecond: (appId: string, params?: DateRangeParams) => any;
export declare const useAppSatisfactionRate: (appId: string, params?: DateRangeParams) => any;
export declare const useAppTokenCosts: (appId: string, params?: DateRangeParams) => any;
export declare const useWorkflowDailyConversations: (appId: string, params?: DateRangeParams) => any;
export declare const useWorkflowDailyTerminals: (appId: string, params?: DateRangeParams) => any;
export declare const useWorkflowTokenCosts: (appId: string, params?: DateRangeParams) => any;
export declare const useWorkflowAverageInteractions: (appId: string, params?: DateRangeParams) => any;
export declare const useAppVoices: (appId?: string, language?: string) => any;
export declare const useAppApiKeys: (appId?: string, options?: {
    enabled?: boolean;
}) => any;
export declare const useInvalidateAppApiKeys: () => (appId?: string) => void;
export {};
