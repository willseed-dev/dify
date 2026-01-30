import type { IndexingStatusResponse } from '@/models/datasets';
type IndexingStatusPollingParams = {
    datasetId: string;
    batchId: string;
};
type IndexingStatusPollingResult = {
    statusList: IndexingStatusResponse[];
    isEmbedding: boolean;
    isEmbeddingCompleted: boolean;
};
/**
 * Custom hook for polling indexing status with automatic stop on completion.
 * Handles the polling lifecycle and provides derived states for UI rendering.
 */
export declare const useIndexingStatusPolling: ({ datasetId, batchId, }: IndexingStatusPollingParams) => IndexingStatusPollingResult;
export {};
