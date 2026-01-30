import type { MutateOptions, QueryOptions } from '@tanstack/react-query';
import type { ModelProvider } from '@/app/components/header/account-setting/model-provider-page/declarations';
import type { PluginsSearchParams } from '@/app/components/plugins/marketplace/types';
import type { InstallPackageResponse, InstallStatusResponse, PluginsFromMarketplaceResponse } from '@/app/components/plugins/types';
import { PluginCategoryEnum } from '@/app/components/plugins/types';
export declare const useCheckInstalled: ({ pluginIds, enabled, }: {
    pluginIds: string[];
    enabled: boolean;
}) => any;
export declare const useRecommendedMarketplacePlugins: ({ collection, enabled, limit, }?: {
    collection?: string;
    enabled?: boolean;
    limit?: number;
}) => any;
export declare const useFeaturedToolsRecommendations: (enabled: boolean, limit?: number) => {
    plugins: any;
    isLoading: any;
};
export declare const useFeaturedTriggersRecommendations: (enabled: boolean, limit?: number) => {
    plugins: any;
    isLoading: any;
};
export declare const useInstalledPluginList: (disable?: boolean, pageSize?: number) => {
    data: {
        plugins: any;
        total: any;
    } | undefined;
    isLastPage: boolean;
    loadNextPage: () => void;
    isLoading: any;
    isFetching: any;
    error: any;
    isSuccess: any;
};
export declare const useInstalledLatestVersion: (pluginIds: string[]) => any;
export declare const useInvalidateInstalledPluginList: () => () => void;
export declare const useInstallPackageFromMarketPlace: (options?: MutateOptions<InstallPackageResponse, Error, string>) => any;
export declare const useUpdatePackageFromMarketPlace: (options?: MutateOptions<InstallPackageResponse, Error, object>) => any;
export declare const usePluginDeclarationFromMarketPlace: (pluginUniqueIdentifier: string) => any;
export declare const useVersionListOfPlugin: (pluginID: string) => any;
export declare const useInvalidateVersionListOfPlugin: () => (pluginID: string) => void;
export declare const useInstallPackageFromLocal: () => any;
export declare const useInstallPackageFromGitHub: () => any;
export declare const useUploadGitHub: (payload: {
    repo: string;
    version: string;
    package: string;
}) => any;
export declare const useInstallOrUpdate: ({ onSuccess, }: {
    onSuccess?: (res: InstallStatusResponse[]) => void;
}) => any;
export declare const useDebugKey: () => any;
export declare const useReferenceSettings: () => any;
export declare const useInvalidateReferenceSettings: () => () => void;
export declare const useMutationReferenceSettings: ({ onSuccess, }: {
    onSuccess?: () => void;
}) => any;
export declare const useRemoveAutoUpgrade: () => any;
export declare const useMutationPluginsFromMarketplace: () => any;
export declare const useFetchPluginsInMarketPlaceByIds: (unique_identifiers: string[], options?: QueryOptions<{
    data: PluginsFromMarketplaceResponse;
}>) => any;
export declare const useFetchPluginListOrBundleList: (pluginsSearchParams: PluginsSearchParams) => any;
export declare const useFetchPluginsInMarketPlaceByInfo: (infos: Record<string, any>[]) => any;
export declare const usePluginTaskList: (category?: PluginCategoryEnum | string) => any;
export declare const useMutationClearTaskPlugin: () => any;
export declare const useMutationClearAllTaskPlugin: () => any;
export declare const usePluginManifestInfo: (pluginUID: string) => any;
export declare const useDownloadPlugin: (info: {
    organization: string;
    pluginName: string;
    version: string;
}, needDownload: boolean) => any;
export declare const useMutationCheckDependencies: () => any;
export declare const useModelInList: (currentProvider?: ModelProvider, modelId?: string) => any;
export declare const usePluginInfo: (providerName?: string) => any;
export declare const useFetchDynamicOptions: (plugin_id: string, provider: string, action: string, parameter: string, provider_type?: string, extra?: Record<string, any>) => any;
export declare const usePluginReadme: ({ plugin_unique_identifier, language }: {
    plugin_unique_identifier: string;
    language?: string;
}) => any;
export declare const usePluginReadmeAsset: ({ file_name, plugin_unique_identifier }: {
    file_name?: string;
    plugin_unique_identifier?: string;
}) => any;
