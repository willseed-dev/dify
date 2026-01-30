import type { IOnCompleted, IOnData, IOnError, IOnFile, IOnIterationFinished, IOnIterationNext, IOnIterationStarted, IOnLoopFinished, IOnLoopNext, IOnLoopStarted, IOnMessageEnd, IOnMessageReplace, IOnNodeFinished, IOnNodeStarted, IOnTextChunk, IOnTextReplace, IOnThought, IOnTTSChunk, IOnTTSEnd, IOnWorkflowFinished, IOnWorkflowStarted } from './base';
import type { FeedbackType } from '@/app/components/base/chat/chat/type';
export declare function getUrl(url: string, isInstalledApp: boolean, installedAppId: string): string;
export declare const sendChatMessage: (body: Record<string, any>, { onData, onCompleted, onThought, onFile, onError, getAbortController, onMessageEnd, onMessageReplace, onTTSChunk, onTTSEnd }: {
    onData: IOnData;
    onCompleted: IOnCompleted;
    onFile: IOnFile;
    onThought: IOnThought;
    onError: IOnError;
    onMessageEnd?: IOnMessageEnd;
    onMessageReplace?: IOnMessageReplace;
    getAbortController?: (abortController: AbortController) => void;
    onTTSChunk?: IOnTTSChunk;
    onTTSEnd?: IOnTTSEnd;
}, isInstalledApp: boolean, installedAppId?: string) => Promise<void>;
export declare const stopChatMessageResponding: (appId: string, taskId: string, isInstalledApp: boolean, installedAppId?: string) => Promise<any>;
export declare const sendCompletionMessage: (body: Record<string, any>, { onData, onCompleted, onError, onMessageReplace, getAbortController }: {
    onData: IOnData;
    onCompleted: IOnCompleted;
    onError: IOnError;
    onMessageReplace: IOnMessageReplace;
    getAbortController?: (abortController: AbortController) => void;
}, isInstalledApp: boolean, installedAppId?: string) => Promise<void>;
export declare const sendWorkflowMessage: (body: Record<string, any>, { onWorkflowStarted, onNodeStarted, onNodeFinished, onWorkflowFinished, onIterationStart, onIterationNext, onIterationFinish, onLoopStart, onLoopNext, onLoopFinish, onTextChunk, onTextReplace, }: {
    onWorkflowStarted: IOnWorkflowStarted;
    onNodeStarted: IOnNodeStarted;
    onNodeFinished: IOnNodeFinished;
    onWorkflowFinished: IOnWorkflowFinished;
    onIterationStart: IOnIterationStarted;
    onIterationNext: IOnIterationNext;
    onIterationFinish: IOnIterationFinished;
    onLoopStart: IOnLoopStarted;
    onLoopNext: IOnLoopNext;
    onLoopFinish: IOnLoopFinished;
    onTextChunk: IOnTextChunk;
    onTextReplace: IOnTextReplace;
}, isInstalledApp: boolean, installedAppId?: string) => Promise<void>;
export declare const stopWorkflowMessage: (_appId: string, taskId: string, isInstalledApp: boolean, installedAppId?: string) => Promise<any>;
export declare const fetchAppInfo: () => Promise<AppData>;
export declare const fetchConversations: (isInstalledApp: boolean, installedAppId?: string, last_id?: string, pinned?: boolean, limit?: number) => Promise<AppConversationData>;
export declare const pinConversation: (isInstalledApp: boolean, installedAppId: string | undefined, id: string) => Promise<any>;
export declare const unpinConversation: (isInstalledApp: boolean, installedAppId: string | undefined, id: string) => Promise<any>;
export declare const delConversation: (isInstalledApp: boolean, installedAppId: string | undefined, id: string) => Promise<any>;
export declare const renameConversation: (isInstalledApp: boolean, installedAppId: string | undefined, id: string, name: string) => Promise<any>;
export declare const generationConversationName: (isInstalledApp: boolean, installedAppId: string | undefined, id: string) => Promise<ConversationItem>;
export declare const fetchChatList: (conversationId: string, isInstalledApp: boolean, installedAppId?: string) => Promise<any>;
export declare const fetchAppParams: (isInstalledApp: boolean, installedAppId?: string) => Promise<ChatConfig>;
export declare const fetchWebSAMLSSOUrl: (appCode: string, redirectUrl: string) => Promise<{
    url: string;
}>;
export declare const fetchWebOIDCSSOUrl: (appCode: string, redirectUrl: string) => Promise<{
    url: string;
}>;
export declare const fetchWebOAuth2SSOUrl: (appCode: string, redirectUrl: string) => Promise<{
    url: string;
}>;
export declare const fetchMembersSAMLSSOUrl: (appCode: string, redirectUrl: string) => Promise<{
    url: string;
}>;
export declare const fetchMembersOIDCSSOUrl: (appCode: string, redirectUrl: string) => Promise<{
    url: string;
}>;
export declare const fetchMembersOAuth2SSOUrl: (appCode: string, redirectUrl: string) => Promise<{
    url: string;
}>;
export declare const fetchAppMeta: (isInstalledApp: boolean, installedAppId?: string) => Promise<AppMeta>;
export declare const updateFeedback: ({ url, body }: {
    url: string;
    body: FeedbackType;
}, isInstalledApp: boolean, installedAppId?: string) => Promise<any>;
export declare const fetchMoreLikeThis: (messageId: string, isInstalledApp: boolean, installedAppId?: string) => Promise<any>;
export declare const saveMessage: (messageId: string, isInstalledApp: boolean, installedAppId?: string) => Promise<any>;
export declare const fetchSavedMessage: (isInstalledApp: boolean, installedAppId?: string) => Promise<any>;
export declare const removeMessage: (messageId: string, isInstalledApp: boolean, installedAppId?: string) => Promise<any>;
export declare const fetchSuggestedQuestions: (messageId: string, isInstalledApp: boolean, installedAppId?: string) => Promise<any>;
export declare const audioToText: (url: string, isPublicAPI: boolean, body: FormData) => Promise<{
    text: string;
}>;
export declare const textToAudio: (url: string, isPublicAPI: boolean, body: FormData) => Promise<{
    data: string;
}>;
export declare const textToAudioStream: (url: string, isPublicAPI: boolean, header: {
    content_type: string;
}, body: {
    streaming: boolean;
    voice?: string;
    message_id?: string;
    text?: string | null | undefined;
}) => Promise<any>;
export declare const fetchAccessToken: ({ userId, appCode }: {
    userId?: string;
    appCode: string;
}) => Promise<{
    access_token: string;
}>;
export declare const getUserCanAccess: (appId: string, isInstalledApp: boolean) => Promise<any>;
export declare const getAppAccessModeByAppCode: (appCode: string) => Promise<any>;
