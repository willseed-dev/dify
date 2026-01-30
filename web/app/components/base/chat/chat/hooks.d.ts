import type { ChatConfig, ChatItemInTree, Inputs } from '../types';
import type { InputForm } from './type';
export declare const useChat: (config?: ChatConfig, formSettings?: {
    inputs: Inputs;
    inputsForm: InputForm[];
}, prevChatTree?: ChatItemInTree[], stopChat?: (taskId: string) => void, clearChatList?: boolean, clearChatListCallback?: (state: boolean) => void) => {
    chatList: any;
    setTargetMessageId: any;
    conversationId: any;
    isResponding: any;
    setIsResponding: any;
    handleSend: any;
    suggestedQuestions: any;
    handleRestart: any;
    handleStop: any;
    handleAnnotationEdited: any;
    handleAnnotationAdded: any;
    handleAnnotationRemoved: any;
};
