import type { FC } from 'react';
import type { ChatConversationsResponse, CompletionConversationsResponse } from '@/models/log';
import type { App } from '@/types/app';
type IConversationList = {
    logs?: ChatConversationsResponse | CompletionConversationsResponse;
    appDetail: App;
    onRefresh: () => void;
};
/**
 * Conversation list component including basic information
 */
declare const ConversationList: FC<IConversationList>;
export default ConversationList;
