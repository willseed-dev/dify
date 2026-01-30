import type { Edge, Node } from '../types';
export declare const preprocessNodesAndEdges: (nodes: Node[], edges: Edge[]) => {
    nodes: ReactFlowNode<any>[];
    edges: ReactFlowEdge<import("../types").CommonEdgeType>[];
};
export declare const initialNodes: (originNodes: Node[], originEdges: Edge[]) => ReactFlowNode<any>[];
export declare const initialEdges: (originEdges: Edge[], originNodes: Node[]) => ReactFlowEdge<import("../types").CommonEdgeType>[];
