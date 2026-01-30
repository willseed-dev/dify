/**
 * Node navigation utilities for workflow
 * This module provides functions for node selection, focusing and scrolling in workflow
 */
/**
 * Interface for node selection event detail
 */
export type NodeSelectionDetail = {
    nodeId: string;
    focus?: boolean;
};
/**
 * Select a node in the workflow
 * @param nodeId - The ID of the node to select
 * @param focus - Whether to focus/scroll to the node
 */
export declare function selectWorkflowNode(nodeId: string, focus?: boolean): void;
/**
 * Scroll to a specific node in the workflow
 * @param nodeId - The ID of the node to scroll to
 */
export declare function scrollToWorkflowNode(nodeId: string): void;
/**
 * Setup node selection event listener
 * @param handleNodeSelect - Function to handle node selection
 * @returns Cleanup function
 */
export declare function setupNodeSelectionListener(handleNodeSelect: (nodeId: string) => void): () => void;
/**
 * Setup scroll to node event listener with ReactFlow
 * @param nodes - The workflow nodes
 * @param reactflow - The ReactFlow instance
 * @returns Cleanup function
 */
export declare function setupScrollToNodeListener(nodes: any[], reactflow: any): () => void;
