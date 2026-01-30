type ShareConversationsParams = {
    isInstalledApp: boolean;
    appId?: string;
    lastId?: string;
    pinned?: boolean;
    limit?: number;
};
type ShareChatListParams = {
    conversationId: string;
    isInstalledApp: boolean;
    appId?: string;
};
type ShareConversationNameParams = {
    conversationId: string;
    isInstalledApp: boolean;
    appId?: string;
};
type ShareQueryOptions = {
    enabled?: boolean;
    refetchOnWindowFocus?: boolean;
    refetchOnReconnect?: boolean;
};
export declare const shareQueryKeys: {
    appAccessMode: (code: string | null) => readonly ["webapp", "appAccessMode", string | null];
    appInfo: readonly ["webapp", "appInfo"];
    appParams: readonly ["webapp", "appParams"];
    appMeta: readonly ["webapp", "appMeta"];
    conversations: readonly ["webapp", "conversations"];
    conversationList: (params: ShareConversationsParams) => readonly ["webapp", "conversations", ShareConversationsParams];
    chatList: (params: ShareChatListParams) => readonly ["webapp", "chatList", ShareChatListParams];
    conversationName: (params: ShareConversationNameParams) => readonly ["webapp", "conversationName", ShareConversationNameParams];
};
export declare const useGetWebAppAccessModeByCode: (code: string | null) => any;
export declare const useGetWebAppInfo: () => any;
export declare const useGetWebAppParams: () => any;
export declare const useGetWebAppMeta: () => any;
export declare const useShareConversations: (params: ShareConversationsParams, options?: ShareQueryOptions) => any;
export declare const useShareChatList: (params: ShareChatListParams, options?: ShareQueryOptions) => any;
export declare const useShareConversationName: (params: ShareConversationNameParams, options?: ShareQueryOptions) => any;
export declare const useInvalidateShareConversations: () => () => void;
export {};
