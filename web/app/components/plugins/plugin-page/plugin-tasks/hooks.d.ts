export declare const usePluginTaskStatus: () => {
    errorPlugins: PluginStatus[];
    successPlugins: PluginStatus[];
    runningPlugins: PluginStatus[];
    runningPluginsLength: number;
    errorPluginsLength: number;
    successPluginsLength: number;
    totalPluginsLength: any;
    isInstalling: boolean;
    isInstallingWithSuccess: boolean;
    isInstallingWithError: boolean;
    isSuccess: boolean;
    isFailed: boolean;
    handleClearErrorPlugin: any;
};
