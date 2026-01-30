import type { InputForm } from '@/app/components/base/chat/chat/type';
import type { ChatItemInTree, Inputs } from '@/app/components/base/chat/types';
export declare const useChat: (config: any, formSettings?: {
    inputs: Inputs;
    inputsForm: InputForm[];
}, prevChatTree?: ChatItemInTree[], stopChat?: (taskId: string) => void) => {
    conversationId: any;
    chatList: any;
    setTargetMessageId: any;
    handleSend: any;
    handleStop: any;
    handleRestart: any;
    isResponding: any;
    suggestedQuestions: any;
};
