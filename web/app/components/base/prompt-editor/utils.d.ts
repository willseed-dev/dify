import type { EntityMatch } from '@lexical/text';
import type { ElementNode, Klass, LexicalEditor, LexicalNode, RangeSelection, TextNode } from 'lexical';
import type { MenuTextMatch } from './types';
import { CustomTextNode } from './plugins/custom-text/node';
export declare function getSelectedNode(selection: RangeSelection): TextNode | ElementNode;
export declare function registerLexicalTextEntity<T extends TextNode>(editor: LexicalEditor, getMatch: (text: string) => null | EntityMatch, targetNode: Klass<T>, createNode: (textNode: TextNode) => T): any[];
export declare const decoratorTransform: (node: CustomTextNode, getMatch: (text: string) => null | EntityMatch, createNode: (textNode: TextNode) => LexicalNode) => void;
export declare function $splitNodeContainingQuery(match: MenuTextMatch): TextNode | null;
export declare function textToEditorState(text: string): string;
