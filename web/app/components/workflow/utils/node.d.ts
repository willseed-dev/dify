import type { Node } from '../types';
import { BlockEnum } from '../types';
export declare function generateNewNode({ data, position, id, zIndex, type, ...rest }: Omit<Node, 'id'> & {
    id?: string;
}): {
    newNode: Node;
    newIterationStartNode?: Node;
    newLoopStartNode?: Node;
};
export declare function getIterationStartNode(iterationId: string): Node;
export declare function getLoopStartNode(loopId: string): Node;
export declare const genNewNodeTitleFromOld: (oldTitle: string) => string;
export declare const getTopLeftNodePosition: (nodes: Node[]) => {
    x: number;
    y: number;
};
export declare const getNestedNodePosition: (node: Node, parentNode: Node) => {
    x: number;
    y: number;
};
export declare const hasRetryNode: (nodeType?: BlockEnum) => nodeType is BlockEnum.LLM | BlockEnum.Code | BlockEnum.HttpRequest | BlockEnum.Tool;
export declare const getNodeCustomTypeByNodeDataType: (nodeType: BlockEnum) => any;
