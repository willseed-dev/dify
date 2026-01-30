import { DifyClient } from "./base";
import type { ChatMessageRequest, ChatMessageResponse } from "../types/chat";
import type { AnnotationCreateRequest, AnnotationListOptions, AnnotationReplyActionRequest, AnnotationResponse } from "../types/annotation";
import type { DifyResponse, DifyStream } from "../types/common";
export declare class ChatClient extends DifyClient {
    createChatMessage(request: ChatMessageRequest): Promise<DifyResponse<ChatMessageResponse> | DifyStream<ChatMessageResponse>>;
    createChatMessage(inputs: Record<string, unknown>, query: string, user: string, stream?: boolean, conversationId?: string | null, files?: Array<Record<string, unknown>> | null): Promise<DifyResponse<ChatMessageResponse> | DifyStream<ChatMessageResponse>>;
    stopChatMessage(taskId: string, user: string): Promise<DifyResponse<ChatMessageResponse>>;
    stopMessage(taskId: string, user: string): Promise<DifyResponse<ChatMessageResponse>>;
    getSuggested(messageId: string, user: string): Promise<DifyResponse<ChatMessageResponse>>;
    getAppFeedbacks(page?: number, limit?: number): Promise<DifyResponse<Record<string, unknown>>>;
    getConversations(user: string, lastId?: string | null, limit?: number | null, sortByOrPinned?: string | boolean | null): Promise<DifyResponse<Record<string, unknown>>>;
    getConversationMessages(user: string, conversationId: string, firstId?: string | null, limit?: number | null): Promise<DifyResponse<Record<string, unknown>>>;
    renameConversation(conversationId: string, name: string, user: string, autoGenerate?: boolean): Promise<DifyResponse<Record<string, unknown>>>;
    renameConversation(conversationId: string, user: string, options?: {
        name?: string | null;
        autoGenerate?: boolean;
    }): Promise<DifyResponse<Record<string, unknown>>>;
    deleteConversation(conversationId: string, user: string): Promise<DifyResponse<Record<string, unknown>>>;
    getConversationVariables(conversationId: string, user: string, lastId?: string | null, limit?: number | null, variableName?: string | null): Promise<DifyResponse<Record<string, unknown>>>;
    updateConversationVariable(conversationId: string, variableId: string, user: string, value: unknown): Promise<DifyResponse<Record<string, unknown>>>;
    annotationReplyAction(action: "enable" | "disable", request: AnnotationReplyActionRequest): Promise<DifyResponse<AnnotationResponse>>;
    getAnnotationReplyStatus(action: "enable" | "disable", jobId: string): Promise<DifyResponse<AnnotationResponse>>;
    listAnnotations(options?: AnnotationListOptions): Promise<DifyResponse<AnnotationResponse>>;
    createAnnotation(request: AnnotationCreateRequest): Promise<DifyResponse<AnnotationResponse>>;
    updateAnnotation(annotationId: string, request: AnnotationCreateRequest): Promise<DifyResponse<AnnotationResponse>>;
    deleteAnnotation(annotationId: string): Promise<DifyResponse<AnnotationResponse>>;
}
