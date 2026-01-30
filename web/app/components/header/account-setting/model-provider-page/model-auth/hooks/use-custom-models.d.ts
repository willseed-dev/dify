import type { ModelProvider } from '../../declarations';
export declare const useCustomModels: (provider: ModelProvider) => import("../../declarations").CustomModelCredential[];
export declare const useCanAddedModels: (provider: ModelProvider) => {
    model: string;
    model_type: import("../../declarations").ModelTypeEnum;
}[];
