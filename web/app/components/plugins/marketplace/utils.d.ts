import type { ActivePluginType } from './constants';
import type { CollectionsAndPluginsSearchParams, PluginsSearchParams } from '@/app/components/plugins/marketplace/types';
import type { Plugin } from '@/app/components/plugins/types';
type MarketplaceFetchOptions = {
    signal?: AbortSignal;
};
export declare const getPluginIconInMarketplace: (plugin: Plugin) => string;
export declare const getFormattedPlugin: (bundle: Plugin) => Plugin;
export declare const getPluginLinkInMarketplace: (plugin: Plugin, params?: Record<string, string | undefined>) => any;
export declare const getPluginDetailLinkInMarketplace: (plugin: Plugin) => string;
export declare const getMarketplacePluginsByCollectionId: (collectionId: string, query?: CollectionsAndPluginsSearchParams, options?: MarketplaceFetchOptions) => Promise<Plugin[]>;
export declare const getMarketplaceCollectionsAndPlugins: (query?: CollectionsAndPluginsSearchParams, options?: MarketplaceFetchOptions) => Promise<{
    marketplaceCollections: MarketplaceCollection[];
    marketplaceCollectionPluginsMap: Record<string, Plugin[]>;
}>;
export declare const getMarketplacePlugins: (queryParams: PluginsSearchParams | undefined, pageParam: number, signal?: AbortSignal) => Promise<{
    plugins: any;
    total: any;
    page: number;
    pageSize: any;
}>;
export declare const getMarketplaceListCondition: (pluginType: string) => string;
export declare const getMarketplaceListFilterType: (category: ActivePluginType) => "plugin" | "bundle" | undefined;
export declare function getCollectionsParams(category: ActivePluginType): CollectionsAndPluginsSearchParams;
export {};
