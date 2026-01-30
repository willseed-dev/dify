import type { ChatItem } from '@/app/components/base/chat/types';
export declare const useDebugWithSingleOrMultipleModel: (appId: string) => {
    debugWithMultipleModel: any;
    multipleModelConfigs: any;
    handleMultipleModelConfigsChange: any;
};
export declare const useConfigFromDebugContext: () => ChatConfig;
export declare const useFormattingChangedDispatcher: () => any;
export declare const useFormattingChangedSubscription: (chatList: ChatItem[]) => void;
