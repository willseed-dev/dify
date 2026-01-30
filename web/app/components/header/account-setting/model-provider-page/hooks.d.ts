import type { Credential, CustomConfigurationModelFixedFields, CustomModel, DefaultModel, DefaultModelResponse, Model, ModelModalModeEnum, ModelProvider, ModelTypeEnum } from './declarations';
import { ConfigurationMethodEnum } from './declarations';
type UseDefaultModelAndModelList = (defaultModel: DefaultModelResponse | undefined, modelList: Model[]) => [DefaultModel | undefined, (model: DefaultModel) => void];
export declare const useSystemDefaultModelAndModelList: UseDefaultModelAndModelList;
export declare const useLanguage: () => any;
export declare const useProviderCredentialsAndLoadBalancing: (provider: string, configurationMethod: ConfigurationMethodEnum, configured?: boolean, currentCustomConfigurationModelFixedFields?: CustomConfigurationModelFixedFields, credentialId?: string) => {
    credentials: any;
    loadBalancing: any;
    mutate: any;
    isLoading: any;
};
export declare const useModelList: (type: ModelTypeEnum) => {
    data: any;
    mutate: any;
    isLoading: any;
};
export declare const useDefaultModel: (type: ModelTypeEnum) => {
    data: any;
    mutate: any;
    isLoading: any;
};
export declare const useCurrentProviderAndModel: (modelList: Model[], defaultModel?: DefaultModel) => {
    currentProvider: Model | undefined;
    currentModel: import("./declarations").ModelItem | undefined;
};
export declare const useTextGenerationCurrentProviderAndModelAndModelList: (defaultModel?: DefaultModel) => {
    currentProvider: Model | undefined;
    currentModel: import("./declarations").ModelItem | undefined;
    textGenerationModelList: any;
    activeTextGenerationModelList: any;
};
export declare const useModelListAndDefaultModel: (type: ModelTypeEnum) => {
    modelList: any;
    defaultModel: any;
};
export declare const useModelListAndDefaultModelAndCurrentProviderAndModel: (type: ModelTypeEnum) => {
    modelList: any;
    defaultModel: any;
    currentProvider: Model | undefined;
    currentModel: import("./declarations").ModelItem | undefined;
};
export declare const useUpdateModelList: () => any;
export declare const useAnthropicBuyQuota: () => () => Promise<void>;
export declare const useUpdateModelProviders: () => any;
export declare const useMarketplaceAllPlugins: (providers: ModelProvider[], searchText: string) => {
    plugins: any;
    isLoading: any;
};
export declare const useRefreshModel: () => {
    handleRefreshModel: any;
};
export declare const useModelModalHandler: () => (provider: ModelProvider, configurationMethod: ConfigurationMethodEnum, CustomConfigurationModelFixedFields?: CustomConfigurationModelFixedFields, extra?: {
    isModelCredential?: boolean;
    credential?: Credential;
    model?: CustomModel;
    onUpdate?: (newPayload: any, formValues?: Record<string, any>) => void;
    mode?: ModelModalModeEnum;
}) => void;
export {};
