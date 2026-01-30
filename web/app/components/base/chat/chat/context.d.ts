import type { ReactNode } from 'react';
import type { ChatProps } from './index';
export type ChatContextValue = Pick<ChatProps, 'config' | 'isResponding' | 'chatList' | 'showPromptLog' | 'questionIcon' | 'answerIcon' | 'onSend' | 'onRegenerate' | 'onAnnotationEdited' | 'onAnnotationAdded' | 'onAnnotationRemoved' | 'onFeedback'>;
declare const ChatContext: any;
type ChatContextProviderProps = {
    children: ReactNode;
} & ChatContextValue;
export declare const ChatContextProvider: ({ children, config, isResponding, chatList, showPromptLog, questionIcon, answerIcon, onSend, onRegenerate, onAnnotationEdited, onAnnotationAdded, onAnnotationRemoved, onFeedback, }: ChatContextProviderProps) => any;
export declare const useChatContext: () => any;
export default ChatContext;
