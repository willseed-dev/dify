import type { StateCreator } from 'zustand';
import type { ConversationVariable } from '@/app/components/workflow/types';
export type ChatVariableSliceShape = {
    showChatVariablePanel: boolean;
    setShowChatVariablePanel: (showChatVariablePanel: boolean) => void;
    showGlobalVariablePanel: boolean;
    setShowGlobalVariablePanel: (showGlobalVariablePanel: boolean) => void;
    conversationVariables: ConversationVariable[];
    setConversationVariables: (conversationVariables: ConversationVariable[]) => void;
};
export declare const createChatVariableSlice: StateCreator<ChatVariableSliceShape>;
