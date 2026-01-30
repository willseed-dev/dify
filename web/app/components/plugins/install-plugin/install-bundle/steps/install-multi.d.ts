import type { Dependency, Plugin, VersionInfo } from '../../../types';
import * as React from 'react';
type Props = {
    allPlugins: Dependency[];
    selectedPlugins: Plugin[];
    onSelect: (plugin: Plugin, selectedIndex: number, allCanInstallPluginsLength: number) => void;
    onSelectAll: (plugins: Plugin[], selectedIndexes: number[]) => void;
    onDeSelectAll: () => void;
    onLoadedAllPlugin: (installedInfo: Record<string, VersionInfo>) => void;
    isFromMarketPlace?: boolean;
    ref?: React.Ref<ExposeRefs>;
};
export type ExposeRefs = {
    selectAllPlugins: () => void;
    deSelectAllPlugins: () => void;
};
declare const InstallByDSLList: ({ allPlugins, selectedPlugins, onSelect, onSelectAll, onDeSelectAll, onLoadedAllPlugin, isFromMarketPlace, ref, }: Props) => any;
export default InstallByDSLList;
