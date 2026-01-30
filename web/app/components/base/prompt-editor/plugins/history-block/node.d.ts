import type { LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical';
import type { RoleName } from './index';
import { DecoratorNode } from 'lexical';
export type SerializedNode = SerializedLexicalNode & {
    roleName: RoleName;
    onEditRole: () => void;
};
export declare class HistoryBlockNode extends DecoratorNode<React.JSX.Element> {
    __roleName: RoleName;
    __onEditRole: () => void;
    static getType(): string;
    static clone(node: HistoryBlockNode): HistoryBlockNode;
    constructor(roleName: RoleName, onEditRole: () => void, key?: NodeKey);
    isInline(): boolean;
    createDOM(): HTMLElement;
    updateDOM(): false;
    decorate(): React.JSX.Element;
    getRoleName(): RoleName;
    getOnEditRole(): () => void;
    static importJSON(serializedNode: SerializedNode): HistoryBlockNode;
    exportJSON(): SerializedNode;
    getTextContent(): string;
}
export declare function $createHistoryBlockNode(roleName: RoleName, onEditRole: () => void): HistoryBlockNode;
export declare function $isHistoryBlockNode(node: HistoryBlockNode | LexicalNode | null | undefined): node is HistoryBlockNode;
