import type { Credential, CustomModelCredential, ModelProvider } from '../../declarations';
export declare const useModelFormSchemas: (provider: ModelProvider, providerFormSchemaPredefined: boolean, credentials?: Record<string, any>, credential?: Credential, model?: CustomModelCredential) => {
    formSchemas: any;
    formValues: any;
    modelNameAndTypeFormSchemas: any;
    modelNameAndTypeFormValues: any;
};
