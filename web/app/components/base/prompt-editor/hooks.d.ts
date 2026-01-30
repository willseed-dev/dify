import type { EntityMatch } from '@lexical/text';
import type { Klass, LexicalCommand, LexicalEditor, TextNode } from 'lexical';
import type { Dispatch, RefObject, SetStateAction } from 'react';
import type { CustomTextNode } from './plugins/custom-text/node';
export type UseSelectOrDeleteHandler = (nodeKey: string, command?: LexicalCommand<undefined>) => [RefObject<HTMLDivElement | null>, boolean];
export declare const useSelectOrDelete: UseSelectOrDeleteHandler;
export type UseTriggerHandler = () => [RefObject<HTMLDivElement | null>, boolean, Dispatch<SetStateAction<boolean>>];
export declare const useTrigger: UseTriggerHandler;
export declare function useLexicalTextEntity<T extends TextNode>(getMatch: (text: string) => null | EntityMatch, targetNode: Klass<T>, createNode: (textNode: CustomTextNode) => T): void;
export type MenuTextMatch = {
    leadOffset: number;
    matchingString: string;
    replaceableString: string;
};
export type TriggerFn = (text: string, editor: LexicalEditor) => MenuTextMatch | null;
export declare const PUNCTUATION = "\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%'\"~=<>_:;";
export declare function useBasicTypeaheadTriggerMatch(trigger: string, { minLength, maxLength }: {
    minLength?: number;
    maxLength?: number;
}): TriggerFn;
