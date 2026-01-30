import type { Edge, Node } from '@/app/components/workflow/types';
type LayoutInfo = {
    x: number;
    y: number;
    width: number;
    height: number;
    layer?: number;
};
type LayoutBounds = {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};
export type LayoutResult = {
    nodes: Map<string, LayoutInfo>;
    bounds: LayoutBounds;
};
export declare const getLayoutByDagre: (originNodes: Node[], originEdges: Edge[]) => Promise<LayoutResult>;
export declare const getLayoutForChildNodes: (parentNodeId: string, originNodes: Node[], originEdges: Edge[]) => Promise<LayoutResult | null>;
export {};
