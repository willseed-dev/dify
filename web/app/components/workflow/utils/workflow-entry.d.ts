import type { Node } from '../types';
import { BlockEnum } from '../types';
/**
 * Get the workflow entry node
 * Priority: trigger nodes > start node
 */
export declare function getWorkflowEntryNode(nodes: Node[]): Node | undefined;
/**
 * Check if a node type is a workflow entry node
 */
export declare function isWorkflowEntryNode(nodeType: BlockEnum): boolean;
/**
 * Check if workflow is in trigger mode
 */
export declare function isTriggerWorkflow(nodes: Node[]): boolean;
