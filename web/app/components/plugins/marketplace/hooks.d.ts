import type { CollectionsAndPluginsSearchParams } from './types';
/**
 * @deprecated Use useMarketplaceCollectionsAndPlugins from query.ts instead
 */
export declare const useMarketplaceCollectionsAndPlugins: () => {
    marketplaceCollections: any;
    setMarketplaceCollections: any;
    marketplaceCollectionPluginsMap: any;
    setMarketplaceCollectionPluginsMap: any;
    queryMarketplaceCollectionsAndPlugins: any;
    isLoading: any;
    isSuccess: any;
};
export declare const useMarketplacePluginsByCollectionId: (collectionId?: string, query?: CollectionsAndPluginsSearchParams) => {
    plugins: any;
    isLoading: any;
    isSuccess: any;
};
/**
 * @deprecated Use useMarketplacePlugins from query.ts instead
 */
export declare const useMarketplacePlugins: () => {
    plugins: any;
    total: any;
    resetPlugins: any;
    queryPlugins: any;
    queryPluginsWithDebounced: any;
    cancelQueryPluginsWithDebounced: any;
    isLoading: any;
    isFetchingNextPage: any;
    hasNextPage: any;
    fetchNextPage: any;
    page: any;
};
export declare const useMarketplaceContainerScroll: (callback: () => void, scrollContainerId?: string) => void;
