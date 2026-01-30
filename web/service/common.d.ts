import type { DefaultModelResponse, Model, ModelItem, ModelLoadBalancingConfig, ModelParameterRule, ModelProvider, ModelTypeEnum } from '@/app/components/header/account-setting/model-provider-page/declarations';
import type { UpdateOpenAIKeyResponse, ValidateOpenAIKeyResponse } from '@/models/app';
import type { AccountIntegrate, ApiBasedExtension, CodeBasedExtension, CommonResponse, DataSourceNotion, FileUploadConfigResponse, ICurrentWorkspace, InitValidateStatusResponse, InvitationResponse, IWorkspace, LangGeniusVersionResponse, Member, ModerateResponse, OauthResponse, PluginProvider, Provider, ProviderAnthropicToken, ProviderAzureToken, SetupStatusResponse, UserProfileOriginResponse } from '@/models/common';
import type { RETRIEVE_METHOD } from '@/types/app';
import type { SystemFeatures } from '@/types/feature';
type LoginSuccess = {
    result: 'success';
    data?: {
        access_token?: string;
    };
};
type LoginFail = {
    result: 'fail';
    data: string;
    code: string;
    message: string;
};
type LoginResponse = LoginSuccess | LoginFail;
export declare const login: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<LoginResponse>;
export declare const webAppLogin: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<LoginResponse>;
export declare const setup: ({ body }: {
    body: Record<string, any>;
}) => Promise<CommonResponse>;
export declare const initValidate: ({ body }: {
    body: Record<string, any>;
}) => Promise<CommonResponse>;
export declare const fetchInitValidateStatus: () => Promise<InitValidateStatusResponse>;
export declare const fetchSetupStatus: () => Promise<SetupStatusResponse>;
export declare const fetchUserProfile: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<UserProfileOriginResponse>;
export declare const updateUserProfile: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<CommonResponse>;
export declare const fetchLangGeniusVersion: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<LangGeniusVersionResponse>;
export declare const oauth: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<OauthResponse>;
export declare const oneMoreStep: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<CommonResponse>;
export declare const fetchMembers: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<{
    accounts: Member[] | null;
}>;
export declare const fetchProviders: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<Provider[] | null>;
export declare const validateProviderKey: ({ url, body }: {
    url: string;
    body: {
        token: string;
    };
}) => Promise<ValidateOpenAIKeyResponse>;
export declare const updateProviderAIKey: ({ url, body }: {
    url: string;
    body: {
        token: string | ProviderAzureToken | ProviderAnthropicToken;
    };
}) => Promise<UpdateOpenAIKeyResponse>;
export declare const fetchAccountIntegrates: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<{
    data: AccountIntegrate[] | null;
}>;
export declare const inviteMember: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<InvitationResponse>;
export declare const updateMemberRole: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<CommonResponse>;
export declare const deleteMemberOrCancelInvitation: ({ url }: {
    url: string;
}) => Promise<CommonResponse>;
export declare const sendOwnerEmail: (body: {
    language?: string;
}) => Promise<CommonResponse & {
    data: string;
}>;
export declare const verifyOwnerEmail: (body: {
    code: string;
    token: string;
}) => Promise<CommonResponse & {
    is_valid: boolean;
    email: string;
    token: string;
}>;
export declare const ownershipTransfer: (memberID: string, body: {
    token: string;
}) => Promise<CommonResponse & {
    is_valid: boolean;
    email: string;
    token: string;
}>;
export declare const fetchFilePreview: ({ fileID }: {
    fileID: string;
}) => Promise<{
    content: string;
}>;
export declare const fetchCurrentWorkspace: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<ICurrentWorkspace>;
export declare const updateCurrentWorkspace: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<ICurrentWorkspace>;
export declare const fetchWorkspaces: ({ url, params }: {
    url: string;
    params: Record<string, any>;
}) => Promise<{
    workspaces: IWorkspace[];
}>;
export declare const switchWorkspace: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<CommonResponse & {
    new_tenant: IWorkspace;
}>;
export declare const updateWorkspaceInfo: ({ url, body }: {
    url: string;
    body: Record<string, any>;
}) => Promise<ICurrentWorkspace>;
export declare const fetchDataSource: ({ url }: {
    url: string;
}) => Promise<{
    data: DataSourceNotion[];
}>;
export declare const syncDataSourceNotion: ({ url }: {
    url: string;
}) => Promise<CommonResponse>;
export declare const updateDataSourceNotionAction: ({ url }: {
    url: string;
}) => Promise<CommonResponse>;
export declare const fetchPluginProviders: (url: string) => Promise<PluginProvider[] | null>;
export declare const validatePluginProviderKey: ({ url, body }: {
    url: string;
    body: {
        credentials: any;
    };
}) => Promise<ValidateOpenAIKeyResponse>;
export declare const updatePluginProviderAIKey: ({ url, body }: {
    url: string;
    body: {
        credentials: any;
    };
}) => Promise<UpdateOpenAIKeyResponse>;
export declare const invitationCheck: ({ url, params }: {
    url: string;
    params: {
        workspace_id?: string;
        email?: string;
        token: string;
    };
}) => Promise<CommonResponse & {
    is_valid: boolean;
    data: {
        workspace_name: string;
        email: string;
        workspace_id: string;
    };
}>;
export declare const activateMember: ({ url, body }: {
    url: string;
    body: any;
}) => Promise<LoginResponse>;
export declare const fetchModelProviders: (url: string) => Promise<{
    data: ModelProvider[];
}>;
export type ModelProviderCredentials = {
    credentials?: Record<string, string | undefined | boolean>;
    load_balancing: ModelLoadBalancingConfig;
};
export declare const fetchModelProviderCredentials: (url: string) => Promise<ModelProviderCredentials>;
export declare const fetchModelLoadBalancingConfig: (url: string) => Promise<{
    credentials?: Record<string, string | undefined | boolean>;
    load_balancing: ModelLoadBalancingConfig;
}>;
export declare const fetchModelProviderModelList: (url: string) => Promise<{
    data: ModelItem[];
}>;
export declare const fetchModelList: (url: string) => Promise<{
    data: Model[];
}>;
export declare const validateModelProvider: ({ url, body }: {
    url: string;
    body: any;
}) => Promise<ValidateOpenAIKeyResponse>;
export declare const validateModelLoadBalancingCredentials: ({ url, body }: {
    url: string;
    body: any;
}) => Promise<ValidateOpenAIKeyResponse>;
export declare const setModelProvider: ({ url, body }: {
    url: string;
    body: any;
}) => Promise<CommonResponse>;
export declare const deleteModelProvider: ({ url, body }: {
    url: string;
    body?: any;
}) => Promise<CommonResponse>;
export declare const changeModelProviderPriority: ({ url, body }: {
    url: string;
    body: any;
}) => Promise<CommonResponse>;
export declare const setModelProviderModel: ({ url, body }: {
    url: string;
    body: any;
}) => Promise<CommonResponse>;
export declare const deleteModelProviderModel: ({ url }: {
    url: string;
}) => Promise<CommonResponse>;
export declare const getPayUrl: (url: string) => Promise<{
    url: string;
}>;
export declare const fetchDefaultModal: (url: string) => Promise<{
    data: DefaultModelResponse;
}>;
export declare const updateDefaultModel: ({ url, body }: {
    url: string;
    body: any;
}) => Promise<CommonResponse>;
export declare const fetchModelParameterRules: (url: string) => Promise<{
    data: ModelParameterRule[];
}>;
export declare const fetchFileUploadConfig: ({ url }: {
    url: string;
}) => Promise<FileUploadConfigResponse>;
export declare const fetchNotionConnection: (url: string) => Promise<{
    data: string;
}>;
export declare const fetchDataSourceNotionBinding: (url: string) => Promise<{
    result: string;
}>;
export declare const fetchApiBasedExtensionList: (url: string) => Promise<ApiBasedExtension[]>;
export declare const fetchApiBasedExtensionDetail: (url: string) => Promise<ApiBasedExtension>;
export declare const addApiBasedExtension: ({ url, body }: {
    url: string;
    body: ApiBasedExtension;
}) => Promise<ApiBasedExtension>;
export declare const updateApiBasedExtension: ({ url, body }: {
    url: string;
    body: ApiBasedExtension;
}) => Promise<ApiBasedExtension>;
export declare const deleteApiBasedExtension: (url: string) => Promise<{
    result: string;
}>;
export declare const fetchCodeBasedExtensionList: (url: string) => Promise<CodeBasedExtension>;
export declare const moderate: (url: string, body: {
    app_id: string;
    text: string;
}) => Promise<ModerateResponse>;
type RetrievalMethodsRes = {
    retrieval_method: RETRIEVE_METHOD[];
};
export declare const fetchSupportRetrievalMethods: (url: string) => Promise<RetrievalMethodsRes>;
export declare const getSystemFeatures: () => Promise<SystemFeatures>;
export declare const enableModel: (url: string, body: {
    model: string;
    model_type: ModelTypeEnum;
}) => Promise<CommonResponse>;
export declare const disableModel: (url: string, body: {
    model: string;
    model_type: ModelTypeEnum;
}) => Promise<CommonResponse>;
export declare const sendForgotPasswordEmail: ({ url, body }: {
    url: string;
    body: {
        email: string;
    };
}) => Promise<CommonResponse & {
    data: string;
}>;
export declare const verifyForgotPasswordToken: ({ url, body }: {
    url: string;
    body: {
        token: string;
    };
}) => Promise<CommonResponse & {
    is_valid: boolean;
    email: string;
}>;
export declare const changePasswordWithToken: ({ url, body }: {
    url: string;
    body: {
        token: string;
        new_password: string;
        password_confirm: string;
    };
}) => Promise<CommonResponse>;
export declare const sendWebAppForgotPasswordEmail: ({ url, body }: {
    url: string;
    body: {
        email: string;
    };
}) => Promise<CommonResponse & {
    data: string;
}>;
export declare const verifyWebAppForgotPasswordToken: ({ url, body }: {
    url: string;
    body: {
        token: string;
    };
}) => Promise<CommonResponse & {
    is_valid: boolean;
    email: string;
}>;
export declare const changeWebAppPasswordWithToken: ({ url, body }: {
    url: string;
    body: {
        token: string;
        new_password: string;
        password_confirm: string;
    };
}) => Promise<CommonResponse>;
export declare const uploadRemoteFileInfo: (url: string, isPublic?: boolean, silent?: boolean) => Promise<{
    id: string;
    name: string;
    size: number;
    mime_type: string;
    url: string;
}>;
export declare const sendEMailLoginCode: (email: string, language?: string) => Promise<CommonResponse & {
    data: string;
}>;
export declare const emailLoginWithCode: (data: {
    email: string;
    code: string;
    token: string;
    language: string;
}) => Promise<LoginResponse>;
export declare const sendResetPasswordCode: (email: string, language?: string) => Promise<CommonResponse & {
    data: string;
    message?: string;
    code?: string;
}>;
export declare const verifyResetPasswordCode: (body: {
    email: string;
    code: string;
    token: string;
}) => Promise<CommonResponse & {
    is_valid: boolean;
    token: string;
}>;
export declare const sendWebAppEMailLoginCode: (email: string, language?: string) => Promise<CommonResponse & {
    data: string;
}>;
export declare const webAppEmailLoginWithCode: (data: {
    email: string;
    code: string;
    token: string;
}) => Promise<LoginResponse>;
export declare const sendWebAppResetPasswordCode: (email: string, language?: string) => Promise<CommonResponse & {
    data: string;
    message?: string;
    code?: string;
}>;
export declare const verifyWebAppResetPasswordCode: (body: {
    email: string;
    code: string;
    token: string;
}) => Promise<CommonResponse & {
    is_valid: boolean;
    token: string;
}>;
export declare const sendDeleteAccountCode: () => Promise<CommonResponse & {
    data: string;
}>;
export declare const verifyDeleteAccountCode: (body: {
    code: string;
    token: string;
}) => Promise<CommonResponse & {
    is_valid: boolean;
}>;
export declare const submitDeleteAccountFeedback: (body: {
    feedback: string;
    email: string;
}) => Promise<CommonResponse>;
export declare const getDocDownloadUrl: (doc_name: string) => Promise<{
    url: string;
}>;
export declare const sendVerifyCode: (body: {
    email: string;
    phase: string;
    token?: string;
}) => Promise<CommonResponse & {
    data: string;
}>;
export declare const verifyEmail: (body: {
    email: string;
    code: string;
    token: string;
}) => Promise<CommonResponse & {
    is_valid: boolean;
    email: string;
    token: string;
}>;
export declare const resetEmail: (body: {
    new_email: string;
    token: string;
}) => Promise<CommonResponse>;
export declare const checkEmailExisted: (body: {
    email: string;
}) => Promise<CommonResponse>;
export {};
