export declare function setWebAppAccessToken(token: string): void;
export declare function setWebAppPassport(shareCode: string, token: string): void;
export declare function getWebAppAccessToken(): any;
export declare function getWebAppPassport(shareCode: string): any;
export declare function clearWebAppAccessToken(): void;
export declare function clearWebAppPassport(shareCode: string): void;
export declare function webAppLoginStatus(shareCode: string, userId?: string): Promise<{
    userLoggedIn: any;
    appLoggedIn: any;
}>;
export declare function webAppLogout(shareCode: string): Promise<void>;
