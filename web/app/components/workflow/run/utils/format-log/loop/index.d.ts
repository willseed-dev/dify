import type { NodeTracing } from '@/types/workflow';
export declare function addChildrenToLoopNode(loopNode: NodeTracing, childrenNodes: NodeTracing[]): NodeTracing;
declare const format: (list: NodeTracing[], t: any) => NodeTracing[];
export default format;
