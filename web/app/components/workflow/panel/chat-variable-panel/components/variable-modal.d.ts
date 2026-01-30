import type { ConversationVariable } from '@/app/components/workflow/types';
export type ModalPropsType = {
    chatVar?: ConversationVariable;
    onClose: () => void;
    onSave: (chatVar: ConversationVariable) => void;
};
declare const ChatVariableModal: ({ chatVar, onClose, onSave, }: ModalPropsType) => any;
export default ChatVariableModal;
