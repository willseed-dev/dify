import type { IChatItem } from './chat/type';
import type { ChatItem, ChatItemInTree } from './types';
declare function getRawInputsFromUrlParams(): Promise<Record<string, any>>;
declare function getProcessedInputsFromUrlParams(): Promise<Record<string, any>>;
declare function getProcessedSystemVariablesFromUrlParams(): Promise<Record<string, any>>;
declare function getProcessedUserVariablesFromUrlParams(): Promise<Record<string, any>>;
declare function getRawUserVariablesFromUrlParams(): Promise<Record<string, any>>;
declare function isValidGeneratedAnswer(item?: ChatItem | ChatItemInTree): boolean;
declare function getLastAnswer<T extends ChatItem | ChatItemInTree>(chatList: T[]): T | null;
/**
 * Build a chat item tree from a chat list
 * @param allMessages - The chat list, sorted from oldest to newest
 * @returns The chat item tree
 */
declare function buildChatItemTree(allMessages: IChatItem[]): ChatItemInTree[];
declare function getThreadMessages(tree: ChatItemInTree[], targetMessageId?: string): ChatItemInTree[];
export { buildChatItemTree, getLastAnswer, getProcessedInputsFromUrlParams, getProcessedSystemVariablesFromUrlParams, getProcessedUserVariablesFromUrlParams, getRawInputsFromUrlParams, getRawUserVariablesFromUrlParams, getThreadMessages, isValidGeneratedAnswer, };
