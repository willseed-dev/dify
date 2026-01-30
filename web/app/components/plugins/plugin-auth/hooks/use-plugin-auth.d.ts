import type { PluginPayload } from '../types';
export declare const usePluginAuth: (pluginPayload: PluginPayload, enable?: boolean) => {
    isAuthorized: boolean;
    canOAuth: any;
    canApiKey: any;
    credentials: any;
    disabled: boolean;
    notAllowCustomCredential: boolean;
    invalidPluginCredentialInfo: () => void;
};
