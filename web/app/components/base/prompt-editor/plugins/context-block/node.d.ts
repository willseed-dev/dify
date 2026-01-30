import type { LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical';
import type { Dataset } from './index';
import { DecoratorNode } from 'lexical';
export type SerializedNode = SerializedLexicalNode & {
    datasets: Dataset[];
    onAddContext: () => void;
    canNotAddContext: boolean;
};
export declare class ContextBlockNode extends DecoratorNode<React.JSX.Element> {
    __datasets: Dataset[];
    __onAddContext: () => void;
    __canNotAddContext: boolean;
    static getType(): string;
    static clone(node: ContextBlockNode): ContextBlockNode;
    isInline(): boolean;
    constructor(datasets: Dataset[], onAddContext: () => void, key?: NodeKey, canNotAddContext?: boolean);
    createDOM(): HTMLElement;
    updateDOM(): false;
    decorate(): React.JSX.Element;
    getDatasets(): Dataset[];
    getOnAddContext(): () => void;
    getCanNotAddContext(): boolean;
    static importJSON(serializedNode: SerializedNode): ContextBlockNode;
    exportJSON(): SerializedNode;
    getTextContent(): string;
}
export declare function $createContextBlockNode(datasets: Dataset[], onAddContext: () => void, canNotAddContext?: boolean): ContextBlockNode;
export declare function $isContextBlockNode(node: ContextBlockNode | LexicalNode | null | undefined): boolean;
