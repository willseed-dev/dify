import type { MarketplaceCollectionPluginsResponse, MarketplaceCollectionsResponse } from '@/app/components/plugins/marketplace/types';
import type { Permissions } from '@/app/components/plugins/types';
export declare const uploadFile: (file: File, isBundle: boolean) => Promise<{
    [key: string]: unknown;
    id: string;
}>;
export declare const updateFromMarketPlace: (body: Record<string, string>) => Promise<any>;
export declare const updateFromGitHub: (repoUrl: string, selectedVersion: string, selectedPackage: string, originalPlugin: string, newPlugin: string) => Promise<any>;
export declare const uploadGitHub: (repoUrl: string, selectedVersion: string, selectedPackage: string) => Promise<any>;
export declare const fetchIcon: (tenantId: string, fileName: string) => Promise<any>;
export declare const fetchManifest: (uniqueIdentifier: string) => Promise<any>;
export declare const fetchManifestFromMarketPlace: (uniqueIdentifier: string) => Promise<any>;
export declare const fetchBundleInfoFromMarketPlace: ({ org, name, version, }: Record<string, string>) => Promise<any>;
export declare const fetchPluginInfoFromMarketPlace: ({ org, name, }: Record<string, string>) => Promise<any>;
export declare const fetchMarketplaceCollections: ({ url }: {
    url: string;
}) => Promise<MarketplaceCollectionsResponse>;
export declare const fetchMarketplaceCollectionPlugins: ({ url }: {
    url: string;
}) => Promise<MarketplaceCollectionPluginsResponse>;
export declare const fetchPluginTasks: () => Promise<any>;
export declare const checkTaskStatus: (taskId: string) => Promise<any>;
export declare const updatePermission: (permissions: Permissions) => Promise<any>;
export declare const uninstallPlugin: (pluginId: string) => Promise<any>;
