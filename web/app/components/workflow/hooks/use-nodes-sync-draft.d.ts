export type SyncCallback = {
    onSuccess?: () => void;
    onError?: () => void;
    onSettled?: () => void;
};
export declare const useNodesSyncDraft: () => {
    doSyncWorkflowDraft: any;
    handleSyncWorkflowDraft: any;
    syncWorkflowDraftWhenPageClose: any;
};
