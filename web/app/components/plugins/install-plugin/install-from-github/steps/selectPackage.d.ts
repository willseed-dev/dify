import type { PluginDeclaration, UpdateFromGitHubPayload } from '../../../types';
import type { Item } from '@/app/components/base/select';
import * as React from 'react';
type SelectPackageProps = {
    updatePayload: UpdateFromGitHubPayload;
    repoUrl: string;
    selectedVersion: string;
    versions: Item[];
    onSelectVersion: (item: Item) => void;
    selectedPackage: string;
    packages: Item[];
    onSelectPackage: (item: Item) => void;
    onUploaded: (result: {
        uniqueIdentifier: string;
        manifest: PluginDeclaration;
    }) => void;
    onFailed: (errorMsg: string) => void;
    onBack: () => void;
};
declare const SelectPackage: React.FC<SelectPackageProps>;
export default SelectPackage;
