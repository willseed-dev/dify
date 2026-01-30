import type { CommonNodeType } from '../types';
type InstallationState = {
    isChecking: boolean;
    isMissing: boolean;
    uniqueIdentifier?: string;
    canInstall: boolean;
    onInstallSuccess: () => void;
    shouldDim: boolean;
};
export declare const useNodePluginInstallation: (data: CommonNodeType) => InstallationState;
export {};
