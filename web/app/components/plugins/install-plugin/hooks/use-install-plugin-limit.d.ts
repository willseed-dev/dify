import type { Plugin, PluginManifestInMarket } from '../../types';
import type { SystemFeatures } from '@/types/feature';
type PluginProps = (Plugin | PluginManifestInMarket) & {
    from: 'github' | 'marketplace' | 'package';
};
export declare function pluginInstallLimit(plugin: PluginProps, systemFeatures: SystemFeatures): {
    canInstall: boolean;
};
export default function usePluginInstallLimit(plugin: PluginProps): {
    canInstall: boolean;
};
export {};
