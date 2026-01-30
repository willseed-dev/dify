import type { TagKey } from './constants';
export type Tag = {
    name: TagKey;
    label: string;
};
export declare const useTags: () => {
    tags: any;
    tagsMap: any;
    getTagLabel: any;
};
export declare const useCategories: (isSingle?: boolean) => {
    categories: any;
    categoriesMap: any;
};
export declare const PLUGIN_PAGE_TABS_MAP: {
    plugins: string;
    marketplace: string;
};
export declare const usePluginPageTabs: () => {
    value: string;
    text: any;
}[];
