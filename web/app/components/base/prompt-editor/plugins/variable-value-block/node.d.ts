import type { EditorConfig, LexicalNode, SerializedTextNode } from 'lexical';
import { TextNode } from 'lexical';
export declare class VariableValueBlockNode extends TextNode {
    static getType(): string;
    static clone(node: VariableValueBlockNode): VariableValueBlockNode;
    createDOM(config: EditorConfig): HTMLElement;
    static importJSON(serializedNode: SerializedTextNode): TextNode;
    exportJSON(): SerializedTextNode;
    canInsertTextBefore(): boolean;
}
export declare function $createVariableValueBlockNode(text?: string): VariableValueBlockNode;
export declare function $isVariableValueNodeBlock(node: LexicalNode | null | undefined): node is VariableValueBlockNode;
