import type { ChatConversationsRequest, CompletionConversationsRequest } from '@/models/log';
export declare const useAnnotationsCount: (appId: string) => any;
type ChatConversationsParams = {
    appId: string;
    params?: Partial<ChatConversationsRequest>;
};
export declare const useChatConversations: ({ appId, params }: ChatConversationsParams) => any;
type CompletionConversationsParams = {
    appId: string;
    params?: Partial<CompletionConversationsRequest>;
};
export declare const useCompletionConversations: ({ appId, params }: CompletionConversationsParams) => any;
export declare const useChatConversationDetail: (appId?: string, conversationId?: string) => any;
export declare const useCompletionConversationDetail: (appId?: string, conversationId?: string) => any;
type WorkflowLogsParams = {
    appId: string;
    params?: Record<string, string | number | boolean | undefined>;
};
export declare const useWorkflowLogs: ({ appId, params }: WorkflowLogsParams) => any;
export {};
