import type { FC } from 'react';
import type { IChatItem } from '@/app/components/base/chat/chat/type';
type AgentLogModalProps = {
    currentLogItem?: IChatItem;
    width: number;
    onCancel: () => void;
};
declare const AgentLogModal: FC<AgentLogModalProps>;
export default AgentLogModal;
