import type { Viewport } from 'reactflow';
import type { StateCreator } from 'zustand';
import type { Edge, EnvironmentVariable, Node } from '@/app/components/workflow/types';
type DebouncedFunc = {
    (fn: () => void): void;
    cancel?: () => void;
    flush?: () => void;
};
export type WorkflowDraftSliceShape = {
    backupDraft?: {
        nodes: Node[];
        edges: Edge[];
        viewport: Viewport;
        features?: Record<string, any>;
        environmentVariables: EnvironmentVariable[];
    };
    setBackupDraft: (backupDraft?: WorkflowDraftSliceShape['backupDraft']) => void;
    debouncedSyncWorkflowDraft: DebouncedFunc;
    syncWorkflowDraftHash: string;
    setSyncWorkflowDraftHash: (hash: string) => void;
    isSyncingWorkflowDraft: boolean;
    setIsSyncingWorkflowDraft: (isSyncingWorkflowDraft: boolean) => void;
    isWorkflowDataLoaded: boolean;
    setIsWorkflowDataLoaded: (loaded: boolean) => void;
    nodes: Node[];
    setNodes: (nodes: Node[]) => void;
    flushPendingSync: () => void;
};
export declare const createWorkflowDraftSlice: StateCreator<WorkflowDraftSliceShape>;
export {};
