import type { HitTestingRecordsRequest } from '@/models/datasets';
export declare const useHitTestingRecords: (params: HitTestingRecordsRequest) => any;
export declare const useInvalidateHitTestingRecords: (datasetId: string) => () => void;
export declare const useHitTesting: (datasetId: string) => any;
export declare const useExternalKnowledgeBaseHitTesting: (datasetId: string) => any;
