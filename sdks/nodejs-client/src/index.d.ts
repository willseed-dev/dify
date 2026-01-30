export declare const BASE_URL = "https://api.dify.ai/v1";
export declare const routes: {
    feedback: {
        method: string;
        url: (messageId: string) => string;
    };
    application: {
        method: string;
        url: () => string;
    };
    fileUpload: {
        method: string;
        url: () => string;
    };
    filePreview: {
        method: string;
        url: (fileId: string) => string;
    };
    textToAudio: {
        method: string;
        url: () => string;
    };
    audioToText: {
        method: string;
        url: () => string;
    };
    getMeta: {
        method: string;
        url: () => string;
    };
    getInfo: {
        method: string;
        url: () => string;
    };
    getSite: {
        method: string;
        url: () => string;
    };
    createCompletionMessage: {
        method: string;
        url: () => string;
    };
    stopCompletionMessage: {
        method: string;
        url: (taskId: string) => string;
    };
    createChatMessage: {
        method: string;
        url: () => string;
    };
    getSuggested: {
        method: string;
        url: (messageId: string) => string;
    };
    stopChatMessage: {
        method: string;
        url: (taskId: string) => string;
    };
    getConversations: {
        method: string;
        url: () => string;
    };
    getConversationMessages: {
        method: string;
        url: () => string;
    };
    renameConversation: {
        method: string;
        url: (conversationId: string) => string;
    };
    deleteConversation: {
        method: string;
        url: (conversationId: string) => string;
    };
    runWorkflow: {
        method: string;
        url: () => string;
    };
    stopWorkflow: {
        method: string;
        url: (taskId: string) => string;
    };
};
export { DifyClient } from "./client/base";
export { ChatClient } from "./client/chat";
export { CompletionClient } from "./client/completion";
export { WorkflowClient } from "./client/workflow";
export { KnowledgeBaseClient } from "./client/knowledge-base";
export { WorkspaceClient } from "./client/workspace";
export * from "./errors/dify-error";
export * from "./types/common";
export * from "./types/annotation";
export * from "./types/chat";
export * from "./types/completion";
export * from "./types/knowledge-base";
export * from "./types/workflow";
export * from "./types/workspace";
export { HttpClient } from "./http/client";
