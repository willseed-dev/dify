import type { ReactNode } from 'react';
import type { TemporalState } from 'zundo';
import type { StoreApi } from 'zustand';
import type { WorkflowHistoryEventT } from './hooks';
import type { Edge, Node } from './types';
export declare const WorkflowHistoryStoreContext: any;
export declare const Provider: any;
export declare function WorkflowHistoryProvider({ nodes, edges, children, }: WorkflowWithHistoryProviderProps): any;
export declare function useWorkflowHistoryStore(): {
    store: any;
    shortcutsEnabled: any;
    setShortcutsEnabled: any;
};
export type WorkflowHistoryStore = {
    nodes: Node[];
    edges: Edge[];
    workflowHistoryEvent: WorkflowHistoryEventT | undefined;
    workflowHistoryEventMeta?: WorkflowHistoryEventMeta;
};
export type WorkflowHistoryActions = {
    setNodes?: (nodes: Node[]) => void;
    setEdges?: (edges: Edge[]) => void;
};
export type WorkflowHistoryState = WorkflowHistoryStore & WorkflowHistoryActions;
export type WorkflowHistoryStoreApi = StoreApi<WorkflowHistoryState> & {
    temporal: StoreApi<TemporalState<WorkflowHistoryState>>;
};
export type WorkflowWithHistoryProviderProps = {
    nodes: Node[];
    edges: Edge[];
    children: ReactNode;
};
export type WorkflowHistoryEventMeta = {
    nodeId?: string;
    nodeTitle?: string;
};
