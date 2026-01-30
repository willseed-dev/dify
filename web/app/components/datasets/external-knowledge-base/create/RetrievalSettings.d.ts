import type { FC } from 'react';
type RetrievalSettingsProps = {
    topK: number;
    scoreThreshold: number;
    scoreThresholdEnabled: boolean;
    isInHitTesting?: boolean;
    isInRetrievalSetting?: boolean;
    onChange: (data: {
        top_k?: number;
        score_threshold?: number;
        score_threshold_enabled?: boolean;
    }) => void;
};
declare const RetrievalSettings: FC<RetrievalSettingsProps>;
export default RetrievalSettings;
