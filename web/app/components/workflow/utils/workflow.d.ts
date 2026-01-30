import type { Edge, Node } from '../types';
import { BlockEnum } from '../types';
export declare const canRunBySingle: (nodeType: BlockEnum, isChildNode: boolean) => boolean;
export declare const isSupportCustomRunForm: (nodeType: BlockEnum) => nodeType is BlockEnum.DataSource;
type ConnectedSourceOrTargetNodesChange = {
    type: string;
    edge: Edge;
}[];
export declare const getNodesConnectedSourceOrTargetHandleIdsMap: (changes: ConnectedSourceOrTargetNodesChange, nodes: Node[]) => Record<string, any>;
export declare const getValidTreeNodes: (nodes: Node[], edges: Edge[]) => {
    validNodes: any;
    maxDepth: number;
};
export declare const changeNodesAndEdgesId: (nodes: Node[], edges: Edge[]) => [Node[], Edge[]];
export declare const hasErrorHandleNode: (nodeType?: BlockEnum) => nodeType is BlockEnum.LLM | BlockEnum.Code | BlockEnum.HttpRequest | BlockEnum.Tool;
export {};
