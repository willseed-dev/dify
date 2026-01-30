export declare const useSegmentListKey: string[];
export declare const useChunkListEnabledKey: (string | {
    enabled: boolean;
})[];
export declare const useChunkListDisabledKey: (string | {
    enabled: boolean;
})[];
export declare const useChunkListAllKey: (string | {
    enabled: string;
})[];
export declare const useSegmentList: (payload: {
    datasetId: string;
    documentId: string;
    params: {
        page: number;
        limit: number;
        keyword: string;
        enabled: boolean | "all" | "";
    };
}, disable?: boolean) => any;
export declare const useUpdateSegment: () => any;
export declare const useAddSegment: () => any;
export declare const useEnableSegment: () => any;
export declare const useDisableSegment: () => any;
export declare const useDeleteSegment: () => any;
export declare const useChildSegmentListKey: string[];
export declare const useChildSegmentList: (payload: {
    datasetId: string;
    documentId: string;
    segmentId: string;
    params: {
        page: number;
        limit: number;
        keyword: string;
    };
}, disable?: boolean) => any;
export declare const useDeleteChildSegment: () => any;
export declare const useAddChildSegment: () => any;
export declare const useUpdateChildSegment: () => any;
export declare const useSegmentBatchImport: () => any;
export declare const useCheckSegmentBatchImportProgress: () => any;
