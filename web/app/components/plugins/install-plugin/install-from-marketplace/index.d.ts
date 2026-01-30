import type { Dependency, Plugin, PluginManifestInMarket } from '../../types';
import * as React from 'react';
type InstallFromMarketplaceProps = {
    uniqueIdentifier: string;
    manifest: PluginManifestInMarket | Plugin;
    isBundle?: boolean;
    dependencies?: Dependency[];
    onSuccess: () => void;
    onClose: () => void;
};
declare const InstallFromMarketplace: React.FC<InstallFromMarketplaceProps>;
export default InstallFromMarketplace;
