import type { LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical';
import { DecoratorNode } from 'lexical';
export type SerializedNode = SerializedLexicalNode;
export declare class LastRunBlockNode extends DecoratorNode<React.JSX.Element> {
    static getType(): string;
    static clone(node: LastRunBlockNode): LastRunBlockNode;
    isInline(): boolean;
    constructor(key?: NodeKey);
    createDOM(): HTMLElement;
    updateDOM(): false;
    decorate(): React.JSX.Element;
    static importJSON(): LastRunBlockNode;
    exportJSON(): SerializedNode;
    getTextContent(): string;
}
export declare function $createLastRunBlockNode(): LastRunBlockNode;
export declare function $isLastRunBlockNode(node: LastRunBlockNode | LexicalNode | null | undefined): boolean;
