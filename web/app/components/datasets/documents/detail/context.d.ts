import type { ChunkingMode, ParentMode } from '@/models/datasets';
export type DocumentContextValue = {
    datasetId?: string;
    documentId?: string;
    docForm?: ChunkingMode;
    parentMode?: ParentMode;
};
export declare const DocumentContext: any;
export declare const useDocumentContext: (selector: (value: DocumentContextValue) => any) => any;
