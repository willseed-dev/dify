import type { LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical';
import type { GeneratorType } from '@/app/components/app/configuration/config/automatic/types';
import { DecoratorNode } from 'lexical';
export type SerializedNode = SerializedLexicalNode & {
    generatorType: GeneratorType;
};
export declare class CurrentBlockNode extends DecoratorNode<React.JSX.Element> {
    __generatorType: GeneratorType;
    static getType(): string;
    static clone(node: CurrentBlockNode): CurrentBlockNode;
    isInline(): boolean;
    constructor(generatorType: GeneratorType, key?: NodeKey);
    createDOM(): HTMLElement;
    updateDOM(): false;
    decorate(): React.JSX.Element;
    getGeneratorType(): GeneratorType;
    static importJSON(serializedNode: SerializedNode): CurrentBlockNode;
    exportJSON(): SerializedNode;
    getTextContent(): string;
}
export declare function $createCurrentBlockNode(type: GeneratorType): CurrentBlockNode;
export declare function $isCurrentBlockNode(node: CurrentBlockNode | LexicalNode | null | undefined): boolean;
