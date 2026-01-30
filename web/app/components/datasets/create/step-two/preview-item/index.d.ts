export type IPreviewItemProps = {
    type: string;
    index: number;
    content?: string;
    qa?: {
        answer: string;
        question: string;
    };
};
export declare enum PreviewType {
    TEXT = "text",
    QA = "QA"
}
declare const _default: any;
export default _default;
