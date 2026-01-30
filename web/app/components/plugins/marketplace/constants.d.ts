import { PluginCategoryEnum } from '../types';
export declare const DEFAULT_SORT: {
    sortBy: string;
    sortOrder: string;
};
export declare const SCROLL_BOTTOM_THRESHOLD = 100;
export declare const PLUGIN_TYPE_SEARCH_MAP: {
    readonly all: "all";
    readonly model: PluginCategoryEnum.model;
    readonly tool: PluginCategoryEnum.tool;
    readonly agent: PluginCategoryEnum.agent;
    readonly extension: PluginCategoryEnum.extension;
    readonly datasource: PluginCategoryEnum.datasource;
    readonly trigger: PluginCategoryEnum.trigger;
    readonly bundle: "bundle";
};
type ValueOf<T> = T[keyof T];
export type ActivePluginType = ValueOf<typeof PLUGIN_TYPE_SEARCH_MAP>;
export declare const PLUGIN_CATEGORY_WITH_COLLECTIONS: Set<ActivePluginType>;
export {};
