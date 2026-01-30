export type OAuthAppInfo = {
    app_icon: string;
    app_label: Record<string, string>;
    scope: string;
};
export type OAuthAuthorizeResponse = {
    code: string;
};
export declare const useOAuthAppInfo: (client_id: string, redirect_uri: string) => any;
export declare const useAuthorizeOAuthApp: () => any;
