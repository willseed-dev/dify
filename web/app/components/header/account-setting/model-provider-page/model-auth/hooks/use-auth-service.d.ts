import type { CustomModel } from '@/app/components/header/account-setting/model-provider-page/declarations';
export declare const useGetCredential: (provider: string, isModelCredential?: boolean, credentialId?: string, model?: CustomModel, configFrom?: string) => any;
export declare const useAuthService: (provider: string) => {
    getAddCredentialService: any;
    getEditCredentialService: any;
    getDeleteCredentialService: any;
    getActiveCredentialService: any;
};
