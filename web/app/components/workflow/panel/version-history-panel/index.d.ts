export type VersionHistoryPanelProps = {
    getVersionListUrl?: string;
    deleteVersionUrl?: (versionId: string) => string;
    updateVersionUrl?: (versionId: string) => string;
    latestVersionId?: string;
};
export declare const VersionHistoryPanel: ({ getVersionListUrl, deleteVersionUrl, updateVersionUrl, latestVersionId, }: VersionHistoryPanelProps) => any;
declare const _default: any;
export default _default;
