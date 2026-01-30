export type IRunBatchProps = {
    vars: {
        name: string;
    }[];
    onSend: (data: string[][]) => void;
    isAllFinished: boolean;
};
declare const _default: any;
export default _default;
