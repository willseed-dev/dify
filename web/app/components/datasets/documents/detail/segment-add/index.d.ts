export type ISegmentAddProps = {
    importStatus: ProcessStatus | string | undefined;
    clearProcessStatus: () => void;
    showNewSegmentModal: () => void;
    showBatchModal: () => void;
    embedding: boolean;
};
export declare enum ProcessStatus {
    WAITING = "waiting",
    PROCESSING = "processing",
    COMPLETED = "completed",
    ERROR = "error"
}
declare const _default: any;
export default _default;
