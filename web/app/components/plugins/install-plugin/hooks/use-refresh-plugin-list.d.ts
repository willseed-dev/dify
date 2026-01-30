import type { Plugin, PluginDeclaration, PluginManifestInMarket } from '../../types';
declare const useRefreshPluginList: () => {
    refreshPluginList: (manifest?: PluginManifestInMarket | Plugin | PluginDeclaration | null, refreshAllType?: boolean) => void;
};
export default useRefreshPluginList;
