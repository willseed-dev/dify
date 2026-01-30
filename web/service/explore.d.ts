export declare const fetchAppList: () => Promise<any>;
export declare const fetchAppDetail: (id: string) => Promise<any>;
export declare const fetchInstalledAppList: (app_id?: string | null) => Promise<any>;
export declare const uninstallApp: (id: string) => Promise<any>;
export declare const updatePinStatus: (id: string, isPinned: boolean) => Promise<any>;
export declare const getAppAccessModeByAppId: (appId: string) => Promise<any>;
