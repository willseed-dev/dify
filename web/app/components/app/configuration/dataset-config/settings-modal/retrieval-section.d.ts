import type { FC } from 'react';
import type { DataSet } from '@/models/datasets';
import type { RetrievalConfig } from '@/types/app';
import { IndexingType } from '@/app/components/datasets/create/step-two';
type CommonSectionProps = {
    rowClass: string;
    labelClass: string;
    t: (key: string, options?: any) => string;
};
type ExternalRetrievalSectionProps = CommonSectionProps & {
    topK: number;
    scoreThreshold: number;
    scoreThresholdEnabled: boolean;
    onExternalSettingChange: (data: {
        top_k?: number;
        score_threshold?: number;
        score_threshold_enabled?: boolean;
    }) => void;
    currentDataset: DataSet;
};
type InternalRetrievalSectionProps = CommonSectionProps & {
    indexMethod: IndexingType;
    retrievalConfig: RetrievalConfig;
    showMultiModalTip: boolean;
    onRetrievalConfigChange: (value: RetrievalConfig) => void;
    docLink: (path: string) => string;
};
type RetrievalSectionProps = (ExternalRetrievalSectionProps & {
    isExternal: true;
}) | (InternalRetrievalSectionProps & {
    isExternal: false;
});
export declare const RetrievalSection: FC<RetrievalSectionProps>;
type RetrievalChangeTipProps = {
    visible: boolean;
    message: string;
    onDismiss: () => void;
};
export declare const RetrievalChangeTip: FC<RetrievalChangeTipProps>;
export {};
