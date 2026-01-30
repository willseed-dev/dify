export type TopKAndScoreThresholdProps = {
    topK: number;
    onTopKChange: (value: number) => void;
    scoreThreshold?: number;
    onScoreThresholdChange?: (value: number) => void;
    isScoreThresholdEnabled?: boolean;
    onScoreThresholdEnabledChange?: (value: boolean) => void;
    readonly?: boolean;
    hiddenScoreThreshold?: boolean;
};
declare const _default: any;
export default _default;
