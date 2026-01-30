export declare const useDatasetMetaData: (datasetId: string) => any;
export declare const useInvalidDatasetMetaData: (datasetId: string) => () => void;
export declare const useCreateMetaData: (datasetId: string) => any;
export declare const useInvalidAllDocumentMetaData: (datasetId: string) => () => void;
export declare const useRenameMeta: (datasetId: string) => any;
export declare const useDeleteMetaData: (datasetId: string) => any;
export declare const useBuiltInMetaDataFields: () => any;
export declare const useDocumentMetaData: ({ datasetId, documentId }: {
    datasetId: string;
    documentId: string;
}) => any;
export declare const useBatchUpdateDocMetadata: () => any;
export declare const useUpdateBuiltInStatus: (datasetId: string) => any;
