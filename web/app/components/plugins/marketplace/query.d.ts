import type { CollectionsAndPluginsSearchParams, PluginsSearchParams } from './types';
export declare const marketplaceKeys: {
    all: readonly ["marketplace"];
    collections: (params?: CollectionsAndPluginsSearchParams) => readonly ["marketplace", "collections", CollectionsAndPluginsSearchParams | undefined];
    collectionPlugins: (collectionId: string, params?: CollectionsAndPluginsSearchParams) => readonly ["marketplace", "collectionPlugins", string, CollectionsAndPluginsSearchParams | undefined];
    plugins: (params?: PluginsSearchParams) => readonly ["marketplace", "plugins", PluginsSearchParams | undefined];
};
export declare function useMarketplaceCollectionsAndPlugins(collectionsParams: CollectionsAndPluginsSearchParams): any;
export declare function useMarketplacePlugins(queryParams: PluginsSearchParams | undefined): any;
