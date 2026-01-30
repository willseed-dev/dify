import type { MutationOptions } from '@tanstack/react-query';
import type { DatasetListRequest, FetchDatasetsParams, IndexingStatusBatchRequest, IndexingStatusBatchResponse } from '@/models/datasets';
type UseInfiniteDatasetsOptions = {
    enabled?: boolean;
    refetchOnMount?: boolean | 'always';
    staleTime?: number;
    refetchOnReconnect?: boolean;
    refetchOnWindowFocus?: boolean;
};
export declare const useInfiniteDatasets: (params: Partial<FetchDatasetsParams["params"]>, options?: UseInfiniteDatasetsOptions) => any;
export declare const useDatasetList: (params: DatasetListRequest) => any;
export declare const useInvalidDatasetList: () => () => void;
export declare const datasetDetailQueryKeyPrefix: string[];
export declare const useDatasetDetail: (datasetId: string) => any;
export declare const useDatasetRelatedApps: (datasetId: string) => any;
export declare const useIndexingStatusBatch: (params: IndexingStatusBatchRequest, mutationOptions?: MutationOptions<IndexingStatusBatchResponse, Error>) => any;
export declare const useProcessRule: (documentId?: string) => any;
export declare const useDatasetApiBaseUrl: () => any;
export declare const useEnableDatasetServiceApi: () => any;
export declare const useDisableDatasetServiceApi: () => any;
export declare const useDatasetApiKeys: (options?: {
    enabled?: boolean;
}) => any;
export declare const useInvalidateDatasetApiKeys: () => () => void;
export declare const useExternalKnowledgeApiList: (options?: {
    enabled?: boolean;
}) => any;
export declare const useInvalidateExternalKnowledgeApiList: () => () => void;
export declare const useDatasetTestingRecords: (datasetId?: string, params?: {
    page: number;
    limit: number;
}) => any;
export declare const useDatasetErrorDocs: (datasetId?: string) => any;
export {};
