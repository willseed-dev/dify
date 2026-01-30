import type { IOnCompleted, IOnData, IOnError, IOnFile, IOnMessageEnd, IOnMessageReplace, IOnThought } from './base';
import type { ModelParameterRule } from '@/app/components/header/account-setting/model-provider-page/declarations';
import type { AppModeEnum, ModelModeType } from '@/types/app';
export type BasicAppFirstRes = {
    prompt: string;
    variables: string[];
    opening_statement: string;
    error?: string;
};
export type GenRes = {
    modified: string;
    message?: string;
    variables?: string[];
    opening_statement?: string;
    error?: string;
};
export type CodeGenRes = {
    code: string;
    language: string[];
    error?: string;
};
export declare const sendChatMessage: (appId: string, body: Record<string, any>, { onData, onCompleted, onThought, onFile, onError, getAbortController, onMessageEnd, onMessageReplace }: {
    onData: IOnData;
    onCompleted: IOnCompleted;
    onFile: IOnFile;
    onThought: IOnThought;
    onMessageEnd: IOnMessageEnd;
    onMessageReplace: IOnMessageReplace;
    onError: IOnError;
    getAbortController?: (abortController: AbortController) => void;
}) => Promise<void>;
export declare const stopChatMessageResponding: (appId: string, taskId: string) => Promise<any>;
export declare const sendCompletionMessage: (appId: string, body: Record<string, any>, { onData, onCompleted, onError, onMessageReplace }: {
    onData: IOnData;
    onCompleted: IOnCompleted;
    onError: IOnError;
    onMessageReplace: IOnMessageReplace;
}) => Promise<void>;
export declare const fetchSuggestedQuestions: (appId: string, messageId: string, getAbortController?: any) => Promise<any>;
export declare const fetchConversationMessages: (appId: string, conversation_id: string, getAbortController?: any) => Promise<any>;
export declare const generateBasicAppFirstTimeRule: (body: Record<string, any>) => Promise<any>;
export declare const generateRule: (body: Record<string, any>) => Promise<any>;
export declare const fetchModelParams: (providerName: string, modelId: string) => Promise<{
    data: ModelParameterRule[];
}>;
export declare const fetchPromptTemplate: ({ appMode, mode, modelName, hasSetDataSet, }: {
    appMode: AppModeEnum;
    mode: ModelModeType;
    modelName: string;
    hasSetDataSet: boolean;
}) => Promise<any>;
export declare const fetchTextGenerationMessage: ({ appId, messageId, }: {
    appId: string;
    messageId: string;
}) => Promise<any>;
