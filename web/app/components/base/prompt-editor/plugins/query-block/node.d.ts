import type { LexicalNode, SerializedLexicalNode } from 'lexical';
import { DecoratorNode } from 'lexical';
export type SerializedNode = SerializedLexicalNode;
export declare class QueryBlockNode extends DecoratorNode<React.JSX.Element> {
    static getType(): string;
    static clone(): QueryBlockNode;
    isInline(): boolean;
    createDOM(): HTMLElement;
    updateDOM(): false;
    decorate(): React.JSX.Element;
    static importJSON(): QueryBlockNode;
    exportJSON(): SerializedNode;
    getTextContent(): string;
}
export declare function $createQueryBlockNode(): QueryBlockNode;
export declare function $isQueryBlockNode(node: QueryBlockNode | LexicalNode | null | undefined): node is QueryBlockNode;
