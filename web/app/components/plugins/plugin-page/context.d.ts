import type { ReactNode, RefObject } from 'react';
import type { FilterState } from './filter-management';
export type PluginPageContextValue = {
    containerRef: RefObject<HTMLDivElement | null>;
    currentPluginID: string | undefined;
    setCurrentPluginID: (pluginID?: string) => void;
    filters: FilterState;
    setFilters: (filter: FilterState) => void;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    options: Array<{
        value: string;
        text: string;
    }>;
};
export declare const PluginPageContext: any;
type PluginPageContextProviderProps = {
    children: ReactNode;
};
export declare function usePluginPageContext(selector: (value: PluginPageContextValue) => any): any;
export declare const PluginPageContextProvider: ({ children, }: PluginPageContextProviderProps) => any;
export {};
