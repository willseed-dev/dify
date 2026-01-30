import type { DataSourceInfo, DataSourceType, FullDocumentDetail, IndexingStatusResponse, LegacyDataSourceInfo } from '@/models/datasets';
/**
 * Type guard for legacy data source info with upload_file property
 */
export declare const isLegacyDataSourceInfo: (info: DataSourceInfo) => info is LegacyDataSourceInfo;
/**
 * Check if a status indicates the source is being embedded
 */
export declare const isSourceEmbedding: (detail: IndexingStatusResponse) => boolean;
/**
 * Calculate the progress percentage for a document
 */
export declare const getSourcePercent: (detail: IndexingStatusResponse) => number;
/**
 * Get file extension from filename, defaults to 'txt'
 */
export declare const getFileType: (name?: string) => string;
/**
 * Document lookup utilities - provides document info by ID from a list
 */
export declare const createDocumentLookup: (documents: FullDocumentDetail[]) => {
    getDocument: (id: string) => any;
    getName: (id: string) => any;
    getSourceType: (id: string) => DataSourceType | undefined;
    getNotionIcon: (id: string) => any;
};
