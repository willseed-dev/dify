import type { ModelTypeEnum } from '@/app/components/header/account-setting/model-provider-page/declarations';
import type { DataSourceNotion } from '@/models/common';
export declare const commonQueryKeys: {
    fileUploadConfig: readonly ["common", "file-upload-config"];
    userProfile: readonly ["common", "user-profile"];
    currentWorkspace: readonly ["common", "current-workspace"];
    workspaces: readonly ["common", "workspaces"];
    members: readonly ["common", "members"];
    filePreview: (fileID: string) => readonly ["common", "file-preview", string];
    schemaDefinitions: readonly ["common", "schema-type-definitions"];
    isLogin: readonly ["common", "is-login"];
    modelProviders: readonly ["common", "model-providers"];
    modelList: (type: ModelTypeEnum) => readonly ["common", "model-list", ModelTypeEnum];
    defaultModel: (type: ModelTypeEnum) => readonly ["common", "default-model", ModelTypeEnum];
    retrievalMethods: readonly ["common", "support-retrieval-methods"];
    accountIntegrates: readonly ["common", "account-integrates"];
    pluginProviders: readonly ["common", "plugin-providers"];
    notionConnection: readonly ["common", "notion-connection"];
    apiBasedExtensions: readonly ["common", "api-based-extensions"];
    codeBasedExtensions: (module?: string) => readonly ["common", "code-based-extensions", string | undefined];
    invitationCheck: (params?: {
        workspace_id?: string;
        email?: string;
        token?: string;
    }) => readonly ["common", "invitation-check", string, string, string];
    notionBinding: (code?: string | null) => readonly ["common", "notion-binding", string | null | undefined];
    modelParameterRules: (provider?: string, model?: string) => readonly ["common", "model-parameter-rules", string | undefined, string | undefined];
    langGeniusVersion: (currentVersion?: string | null) => readonly ["common", "langgenius-version", string | null | undefined];
    forgotPasswordValidity: (token?: string | null) => readonly ["common", "forgot-password-validity", string | null | undefined];
    dataSourceIntegrates: readonly ["common", "data-source-integrates"];
};
export declare const useFileUploadConfig: () => any;
export declare const useUserProfile: () => any;
export declare const useLangGeniusVersion: (currentVersion?: string | null, enabled?: boolean) => any;
export declare const useCurrentWorkspace: () => any;
export declare const useWorkspaces: () => any;
export declare const useGenerateStructuredOutputRules: () => any;
export type MailSendResponse = {
    data: string;
    result: string;
};
export declare const useSendMail: () => any;
export type MailValidityResponse = {
    is_valid: boolean;
    token: string;
};
export declare const useMailValidity: () => any;
export type MailRegisterResponse = {
    result: string;
    data: {};
};
export declare const useMailRegister: () => any;
export declare const useFileSupportTypes: () => any;
export declare const useMembers: () => any;
export declare const useFilePreview: (fileID: string) => any;
export type SchemaTypeDefinition = {
    name: string;
    schema: {
        properties: Record<string, any>;
    };
};
export declare const useSchemaTypeDefinitions: () => any;
export declare const useIsLogin: () => any;
export declare const useLogout: () => any;
export declare const useVerifyForgotPasswordToken: (token?: string | null) => any;
export declare const useOneMoreStep: () => any;
export declare const useModelProviders: () => any;
export declare const useModelListByType: (type: ModelTypeEnum, enabled?: boolean) => any;
export declare const useDefaultModelByType: (type: ModelTypeEnum, enabled?: boolean) => any;
export declare const useSupportRetrievalMethods: () => any;
export declare const useAccountIntegrates: () => any;
type DataSourceIntegratesOptions = {
    enabled?: boolean;
    initialData?: {
        data: DataSourceNotion[];
    };
};
export declare const useDataSourceIntegrates: (options?: DataSourceIntegratesOptions) => any;
export declare const useInvalidDataSourceIntegrates: () => () => void;
export declare const usePluginProviders: () => any;
export declare const useCodeBasedExtensions: (module: string) => any;
export declare const useNotionConnection: (enabled: boolean) => any;
export declare const useApiBasedExtensions: () => any;
export declare const useInvitationCheck: (params?: {
    workspace_id?: string;
    email?: string;
    token?: string;
}, enabled?: boolean) => any;
export declare const useNotionBinding: (code?: string | null, enabled?: boolean) => any;
export declare const useModelParameterRules: (provider?: string, model?: string, enabled?: boolean) => any;
export {};
