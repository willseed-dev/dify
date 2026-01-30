import type { Credential, CustomModelCredential, ModelProvider } from '@/app/components/header/account-setting/model-provider-page/declarations';
export declare const useCredentialData: (provider: ModelProvider, providerFormSchemaPredefined: boolean, isModelCredential?: boolean, credential?: Credential, model?: CustomModelCredential) => {
    isLoading: any;
    credentialData: any;
};
