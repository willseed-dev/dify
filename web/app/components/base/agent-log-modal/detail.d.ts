import type { FC } from 'react';
import type { IChatItem } from '@/app/components/base/chat/chat/type';
export type AgentLogDetailProps = {
    activeTab?: 'DETAIL' | 'TRACING';
    conversationID: string;
    log: IChatItem;
    messageID: string;
};
declare const AgentLogDetail: FC<AgentLogDetailProps>;
export default AgentLogDetail;
