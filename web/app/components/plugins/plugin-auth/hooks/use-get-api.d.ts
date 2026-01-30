import type { CredentialTypeEnum, PluginPayload } from '../types';
export declare const useGetApi: ({ category, provider }: PluginPayload) => {
    getCredentialInfo: string;
    setDefaultCredential: string;
    getCredentials: string;
    addCredential: string;
    updateCredential: string;
    deleteCredential: string;
    getCredentialSchema: (credential_type: CredentialTypeEnum) => string;
    getOauthUrl: string;
    getOauthClientSchema: string;
    setCustomOauthClient: string;
    getCustomOAuthClientValues: string;
    deleteCustomOAuthClient: string;
} | {
    getCredentialInfo: string;
    setDefaultCredential: string;
    getCredentials: string;
    addCredential: string;
    updateCredential: string;
    deleteCredential: string;
    getCredentialSchema: () => string;
    getOauthUrl: string;
    getOauthClientSchema: string;
    setCustomOauthClient: string;
    deleteCustomOAuthClient: string;
    getCustomOAuthClientValues?: undefined;
};
