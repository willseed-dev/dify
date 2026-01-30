import type { Plugin, PluginDeclaration, UpdateFromGitHubPayload } from '../../../types';
import * as React from 'react';
type LoadedProps = {
    updatePayload?: UpdateFromGitHubPayload;
    uniqueIdentifier: string;
    payload: PluginDeclaration | Plugin;
    repoUrl: string;
    selectedVersion: string;
    selectedPackage: string;
    onBack: () => void;
    onStartToInstall?: () => void;
    onInstalled: (notRefresh?: boolean) => void;
    onFailed: (message?: string) => void;
};
declare const Loaded: React.FC<LoadedProps>;
export default Loaded;
