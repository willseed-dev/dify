import type { TracingProvider } from '@/app/(commonLayout)/app/(appDetailLayout)/[appId]/overview/tracing/type';
import type { ApiKeysListResponse, AppDailyConversationsResponse, AppDailyEndUsersResponse, AppDailyMessagesResponse, AppDetailResponse, AppListResponse, AppStatisticsResponse, AppTemplatesResponse, AppTokenCostsResponse, AppVoicesListResponse, CreateApiKeyResponse, DSLImportMode, DSLImportResponse, GenerationIntroductionResponse, TracingConfig, TracingStatus, UpdateAppModelConfigResponse, UpdateAppSiteCodeResponse, UpdateOpenAIKeyResponse, ValidateOpenAIKeyResponse, WebhookTriggerResponse, WorkflowDailyConversationsResponse } from '@/models/app';
import type { CommonResponse } from '@/models/common';
import type { AppIconType, AppModeEnum, ModelConfig } from '@/types/app';
export declare const fetchAppList: ({ url, params }: {
    url: string;
    params?: Record<string, any>;
}) => Promise<AppListResponse>;
export declare const fetchAppDetail: ({ url, id }: {
    url: string;
    id: string;
}) => Promise<AppDetailResponse>;
export declare const fetchAppDetailDirect: ({ url, id }: {
    url: string;
    id: string;
}) => Promise<AppDetailResponse>;
export declare const fetchAppTemplates: ({ url }: {
    url: string;
}) => Promise<AppTemplatesResponse>;
export declare const createApp: ({ name, icon_type, icon, icon_background, mode, description, config, }: {
    name: string;
    icon_type?: AppIconType;
    icon?: string;
    icon_background?: string;
    mode: AppModeEnum;
    description?: string;
    config?: ModelConfig;
}) => Promise<AppDetailResponse>;
export declare const updateAppInfo: ({ appID, name, icon_type, icon, icon_background, description, use_icon_as_answer_icon, max_active_requests, }: {
    appID: string;
    name: string;
    icon_type: AppIconType;
    icon: string;
    icon_background?: string;
    description: string;
    use_icon_as_answer_icon?: boolean;
    max_active_requests?: number | null;
}) => Promise<AppDetailResponse>;
export declare const copyApp: ({ appID, name, icon_type, icon, icon_background, mode, description, }: {
    appID: string;
    name: string;
    icon_type: AppIconType;
    icon: string;
    icon_background?: string | null;
    mode: AppModeEnum;
    description?: string;
}) => Promise<AppDetailResponse>;
export declare const exportAppConfig: ({ appID, include, workflowID }: {
    appID: string;
    include?: boolean;
    workflowID?: string;
}) => Promise<{
    data: string;
}>;
export declare const importDSL: ({ mode, yaml_content, yaml_url, app_id, name, description, icon_type, icon, icon_background }: {
    mode: DSLImportMode;
    yaml_content?: string;
    yaml_url?: string;
    app_id?: string;
    name?: string;
    description?: string;
    icon_type?: AppIconType;
    icon?: string;
    icon_background?: string;
}) => Promise<DSLImportResponse>;
export declare const importDSLConfirm: ({ import_id }: {
    import_id: string;
}) => Promise<DSLImportResponse>;
export declare const switchApp: ({ appID, name, icon_type, icon, icon_background }: {
    appID: string;
    name: string;
    icon_type: AppIconType;
    icon: string;
    icon_background?: string | null;
}) => Promise<{
    new_app_id: string;
}>;
export declare const deleteApp: (appID: string) => Promise<CommonResponse>;
export declare const updateAppSiteStatus: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<AppDetailResponse>;
export declare const updateAppApiStatus: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<AppDetailResponse>;
export declare const updateAppRateLimit: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<AppDetailResponse>;
export declare const updateAppSiteAccessToken: ({ url }: {
    url: string;
}) => Promise<UpdateAppSiteCodeResponse>;
export declare const updateAppSiteConfig: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<AppDetailResponse>;
export declare const getAppDailyMessages: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<AppDailyMessagesResponse>;
export declare const getAppDailyConversations: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<AppDailyConversationsResponse>;
export declare const getWorkflowDailyConversations: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<WorkflowDailyConversationsResponse>;
export declare const getAppStatistics: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<AppStatisticsResponse>;
export declare const getAppDailyEndUsers: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<AppDailyEndUsersResponse>;
export declare const getAppTokenCosts: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<AppTokenCostsResponse>;
export declare const updateAppModelConfig: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<UpdateAppModelConfigResponse>;
export declare const fetchAppListNoMock: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<AppListResponse>;
export declare const fetchApiKeysList: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<ApiKeysListResponse>;
export declare const delApikey: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<CommonResponse>;
export declare const createApikey: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<CreateApiKeyResponse>;
export declare const validateOpenAIKey: ({ url, body }: {
    url: string;
    body: {
        token: string;
    };
}) => Promise<ValidateOpenAIKeyResponse>;
export declare const updateOpenAIKey: ({ url, body }: {
    url: string;
    body: {
        token: string;
    };
}) => Promise<UpdateOpenAIKeyResponse>;
export declare const generationIntroduction: ({ url, body }: {
    url: string;
    body: {
        prompt_template: string;
    };
}) => Promise<GenerationIntroductionResponse>;
export declare const fetchAppVoices: ({ appId, language }: {
    appId: string;
    language?: string;
}) => Promise<AppVoicesListResponse>;
export declare const fetchTracingStatus: ({ appId }: {
    appId: string;
}) => Promise<TracingStatus>;
export declare const updateTracingStatus: ({ appId, body }: {
    appId: string;
    body: Record<string, any>;
}) => Promise<CommonResponse>;
export declare const fetchWebhookUrl: ({ appId, nodeId }: {
    appId: string;
    nodeId: string;
}) => Promise<WebhookTriggerResponse>;
export declare const fetchTracingConfig: ({ appId, provider }: {
    appId: string;
    provider: TracingProvider;
}) => Promise<TracingConfig & {
    has_not_configured: true;
}>;
export declare const addTracingConfig: ({ appId, body }: {
    appId: string;
    body: TracingConfig;
}) => Promise<CommonResponse>;
export declare const updateTracingConfig: ({ appId, body }: {
    appId: string;
    body: TracingConfig;
}) => Promise<CommonResponse>;
export declare const removeTracingConfig: ({ appId, provider }: {
    appId: string;
    provider: TracingProvider;
}) => Promise<CommonResponse>;
