import type { DataSet } from '@/models/datasets';
type UseDatasetCardStateOptions = {
    dataset: DataSet;
    onSuccess?: () => void;
};
export declare const useDatasetCardState: ({ dataset, onSuccess }: UseDatasetCardStateOptions) => {
    tags: any;
    setTags: any;
    modalState: any;
    openRenameModal: any;
    closeRenameModal: any;
    closeConfirmDelete: any;
    exporting: any;
    handleExportPipeline: any;
    detectIsUsedByApp: any;
    onConfirmDelete: any;
};
export {};
