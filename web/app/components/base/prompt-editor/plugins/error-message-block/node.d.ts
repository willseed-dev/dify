import type { LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical';
import { DecoratorNode } from 'lexical';
export type SerializedNode = SerializedLexicalNode;
export declare class ErrorMessageBlockNode extends DecoratorNode<React.JSX.Element> {
    static getType(): string;
    static clone(node: ErrorMessageBlockNode): ErrorMessageBlockNode;
    isInline(): boolean;
    constructor(key?: NodeKey);
    createDOM(): HTMLElement;
    updateDOM(): false;
    decorate(): React.JSX.Element;
    static importJSON(): ErrorMessageBlockNode;
    exportJSON(): SerializedNode;
    getTextContent(): string;
}
export declare function $createErrorMessageBlockNode(): ErrorMessageBlockNode;
export declare function $isErrorMessageBlockNode(node: ErrorMessageBlockNode | LexicalNode | null | undefined): boolean;
