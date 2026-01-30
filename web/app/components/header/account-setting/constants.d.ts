export declare const ACCOUNT_SETTING_MODAL_ACTION = "showSettings";
export declare const ACCOUNT_SETTING_TAB: {
    readonly PROVIDER: "provider";
    readonly MEMBERS: "members";
    readonly BILLING: "billing";
    readonly DATA_SOURCE: "data-source";
    readonly API_BASED_EXTENSION: "api-based-extension";
    readonly CUSTOM: "custom";
    readonly LANGUAGE: "language";
};
export type AccountSettingTab = typeof ACCOUNT_SETTING_TAB[keyof typeof ACCOUNT_SETTING_TAB];
export declare const DEFAULT_ACCOUNT_SETTING_TAB: "members";
export declare const isValidAccountSettingTab: (tab: string | null) => tab is AccountSettingTab;
