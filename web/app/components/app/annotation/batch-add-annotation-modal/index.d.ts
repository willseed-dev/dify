export declare enum ProcessStatus {
    WAITING = "waiting",
    PROCESSING = "processing",
    COMPLETED = "completed",
    ERROR = "error"
}
export type IBatchModalProps = {
    appId: string;
    isShow: boolean;
    onCancel: () => void;
    onAdded: () => void;
};
declare const _default: any;
export default _default;
