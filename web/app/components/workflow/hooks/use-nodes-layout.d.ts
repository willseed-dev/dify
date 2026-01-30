import type { Edge, Node } from '../types';
export declare const getLayoutedNodes: (nodes: Node[], edges: Edge[]) => Promise<{
    layoutedNodes: any[];
}>;
export declare const useNodesLayout: () => {
    handleNodesLayout: any;
};
