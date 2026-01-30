import type { EditorConfig, SerializedTextNode } from 'lexical';
import { TextNode } from 'lexical';
export declare class CustomTextNode extends TextNode {
    static getType(): string;
    static clone(node: CustomTextNode): CustomTextNode;
    createDOM(config: EditorConfig): any;
    static importJSON(serializedNode: SerializedTextNode): TextNode;
    exportJSON(): SerializedTextNode;
    isSimpleText(): boolean;
}
export declare function $createCustomTextNode(text: string): CustomTextNode;
