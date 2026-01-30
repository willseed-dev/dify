import type { FC } from 'react';
import type { IChatItem } from '@/app/components/base/chat/chat/type';
type PromptLogModalProps = {
    currentLogItem?: IChatItem;
    width: number;
    onCancel: () => void;
};
declare const PromptLogModal: FC<PromptLogModalProps>;
export default PromptLogModal;
