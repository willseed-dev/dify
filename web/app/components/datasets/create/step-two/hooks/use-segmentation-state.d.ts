import type { ParentMode } from '@/models/datasets';
import { ProcessMode } from '@/models/datasets';
export declare const DEFAULT_SEGMENT_IDENTIFIER = "\\n\\n";
export declare const DEFAULT_MAXIMUM_CHUNK_LENGTH = 1024;
export declare const DEFAULT_OVERLAP = 50;
export declare const MAXIMUM_CHUNK_TOKEN_LENGTH: number;
export type ParentChildConfig = {
    chunkForContext: ParentMode;
    parent: {
        delimiter: string;
        maxLength: number;
    };
    child: {
        delimiter: string;
        maxLength: number;
    };
};
export declare const defaultParentChildConfig: ParentChildConfig;
export type UseSegmentationStateOptions = {
    initialSegmentationType?: ProcessMode;
};
export declare const useSegmentationState: (options?: UseSegmentationStateOptions) => {
    segmentationType: any;
    setSegmentationType: any;
    segmentIdentifier: any;
    setSegmentIdentifier: any;
    maxChunkLength: any;
    setMaxChunkLength: any;
    limitMaxChunkLength: any;
    setLimitMaxChunkLength: any;
    overlap: any;
    setOverlap: any;
    rules: any;
    setRules: any;
    defaultConfig: any;
    setDefaultConfig: any;
    toggleRule: any;
    parentChildConfig: any;
    setParentChildConfig: any;
    updateParentConfig: any;
    updateChildConfig: any;
    setChunkForContext: any;
    resetToDefaults: any;
    applyConfigFromRules: any;
    getProcessRule: any;
};
export type SegmentationState = ReturnType<typeof useSegmentationState>;
