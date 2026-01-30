import type { MetadataType, SortType } from '../datasets';
import { DocumentActionType } from '@/models/datasets';
export declare const useDocumentListKey: string[];
export declare const useDocumentList: (payload: {
    datasetId: string;
    query: {
        keyword: string;
        page: number;
        limit: number;
        sort?: SortType;
        status?: string;
    };
    refetchInterval?: number | false;
}) => any;
export declare const useInvalidDocumentList: (datasetId?: string) => () => void;
export declare const useAutoDisabledDocuments: (datasetId: string) => any;
export declare const useInvalidDisabledDocument: () => () => void;
export declare const useDocumentBatchAction: (action: DocumentActionType) => any;
export declare const useDocumentEnable: () => any;
export declare const useDocumentDisable: () => any;
export declare const useDocumentArchive: () => any;
export declare const useDocumentUnArchive: () => any;
export declare const useDocumentDelete: () => any;
export declare const useSyncDocument: () => any;
export declare const useSyncWebsite: () => any;
export declare const useDocumentDetail: (payload: {
    datasetId: string;
    documentId: string;
    params: {
        metadata: MetadataType;
    };
}) => any;
export declare const useDocumentMetadata: (payload: {
    datasetId: string;
    documentId: string;
    params: {
        metadata: MetadataType;
    };
}) => any;
export declare const useInvalidDocumentDetail: () => () => void;
export declare const useDocumentPause: () => any;
export declare const useDocumentResume: () => any;
export declare const useDocumentBatchRetryIndex: () => any;
