import type { FC } from 'react';
import type { IChatItem } from '@/app/components/base/chat/chat/type';
type MessageLogModalProps = {
    currentLogItem?: IChatItem;
    defaultTab?: string;
    width: number;
    fixedWidth?: boolean;
    onCancel: () => void;
};
declare const MessageLogModal: FC<MessageLogModalProps>;
export default MessageLogModal;
