import type { FC } from 'react';
import type { ConversationItem } from '@/models/share';
type ListProps = {
    isPin?: boolean;
    title?: string;
    list: ConversationItem[];
    onOperate: (type: string, item: ConversationItem) => void;
    onChangeConversation: (conversationId: string) => void;
    currentConversationId: string;
};
declare const List: FC<ListProps>;
export default List;
