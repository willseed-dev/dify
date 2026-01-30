import type { Plan, UsagePlanInfo, UsageResetInfo } from '@/app/components/billing/type';
import type { Model, ModelProvider } from '@/app/components/header/account-setting/model-provider-page/declarations';
import type { RETRIEVE_METHOD } from '@/types/app';
export type ProviderContextState = {
    modelProviders: ModelProvider[];
    refreshModelProviders: () => void;
    textGenerationModelList: Model[];
    supportRetrievalMethods: RETRIEVE_METHOD[];
    isAPIKeySet: boolean;
    plan: {
        type: Plan;
        usage: UsagePlanInfo;
        total: UsagePlanInfo;
        reset: UsageResetInfo;
    };
    isFetchedPlan: boolean;
    enableBilling: boolean;
    onPlanInfoChanged: () => void;
    enableReplaceWebAppLogo: boolean;
    modelLoadBalancingEnabled: boolean;
    datasetOperatorEnabled: boolean;
    enableEducationPlan: boolean;
    isEducationWorkspace: boolean;
    isEducationAccount: boolean;
    allowRefreshEducationVerify: boolean;
    educationAccountExpireAt: number | null;
    isLoadingEducationAccountInfo: boolean;
    isFetchingEducationAccountInfo: boolean;
    webappCopyrightEnabled: boolean;
    licenseLimit: {
        workspace_members: {
            size: number;
            limit: number;
        };
    };
    refreshLicenseLimit: () => void;
    isAllowTransferWorkspace: boolean;
    isAllowPublishAsCustomKnowledgePipelineTemplate: boolean;
};
export declare const baseProviderContextValue: ProviderContextState;
declare const ProviderContext: any;
export declare const useProviderContext: () => any;
export declare const useProviderContextSelector: <T>(selector: (state: ProviderContextState) => T) => T;
type ProviderContextProviderProps = {
    children: React.ReactNode;
};
export declare const ProviderContextProvider: ({ children, }: ProviderContextProviderProps) => any;
export default ProviderContext;
