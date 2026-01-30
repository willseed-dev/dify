import type { FeedbackType } from '@/app/components/base/chat/chat/type';
export type IResultProps = {
    content: string;
    showFeedback: boolean;
    feedback: FeedbackType;
    onFeedback: (feedback: FeedbackType) => void;
};
declare const _default: any;
export default _default;
