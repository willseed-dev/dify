declare const useReferenceSetting: () => {
    referenceSetting: any;
    setReferenceSettings: any;
    canManagement: boolean;
    canDebugger: boolean;
    canSetPermissions: any;
    isUpdatePending: any;
};
export declare const useCanInstallPluginFromMarketplace: () => {
    canInstallPluginFromMarketplace: any;
};
export default useReferenceSetting;
