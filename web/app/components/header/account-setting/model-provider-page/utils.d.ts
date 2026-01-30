import type { CredentialFormSchemaTextInput, FormValue, ModelLoadBalancingConfig } from './declarations';
import { ValidatedStatus } from '../key-validator/declarations';
import { ModelTypeEnum } from './declarations';
export declare enum ModelProviderQuotaGetPaid {
    ANTHROPIC = "langgenius/anthropic/anthropic",
    OPENAI = "langgenius/openai/openai",
    GEMINI = "langgenius/gemini/google",
    X = "langgenius/x/x",
    DEEPSEEK = "langgenius/deepseek/deepseek",
    TONGYI = "langgenius/tongyi/tongyi"
}
export declare const MODEL_PROVIDER_QUOTA_GET_PAID: ModelProviderQuotaGetPaid[];
export declare const modelNameMap: {
    "langgenius/openai/openai": string;
    "langgenius/anthropic/anthropic": string;
    "langgenius/gemini/google": string;
    "langgenius/x/x": string;
    "langgenius/deepseek/deepseek": string;
    "langgenius/tongyi/tongyi": string;
};
export declare const isNullOrUndefined: (value: any) => boolean;
export declare const validateCredentials: (predefined: boolean, provider: string, v: FormValue) => Promise<{
    status: ValidatedStatus;
}>;
export declare const validateLoadBalancingCredentials: (predefined: boolean, provider: string, v: FormValue, id?: string) => Promise<{
    status: ValidatedStatus;
    message?: string;
}>;
export declare const saveCredentials: (predefined: boolean, provider: string, v: FormValue, loadBalancing?: ModelLoadBalancingConfig) => Promise<any>;
export declare const savePredefinedLoadBalancingConfig: (provider: string, v: FormValue, loadBalancing?: ModelLoadBalancingConfig) => Promise<any>;
export declare const removeCredentials: (predefined: boolean, provider: string, v: FormValue, credentialId?: string) => Promise<any>;
export declare const sizeFormat: (size: number) => string;
export declare const modelTypeFormat: (modelType: ModelTypeEnum) => string;
export declare const genModelTypeFormSchema: (modelTypes: ModelTypeEnum[]) => any;
export declare const genModelNameFormSchema: (model?: Pick<CredentialFormSchemaTextInput, "label" | "placeholder">) => any;
