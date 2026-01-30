import type { StateCreator } from 'zustand';
export type WorkflowSliceShape = {
    appId: string;
    appName: string;
    notInitialWorkflow: boolean;
    setNotInitialWorkflow: (notInitialWorkflow: boolean) => void;
    shouldAutoOpenStartNodeSelector: boolean;
    setShouldAutoOpenStartNodeSelector: (shouldAutoOpen: boolean) => void;
    nodesDefaultConfigs: Record<string, any>;
    setNodesDefaultConfigs: (nodesDefaultConfigs: Record<string, any>) => void;
    showOnboarding: boolean;
    setShowOnboarding: (showOnboarding: boolean) => void;
    hasSelectedStartNode: boolean;
    setHasSelectedStartNode: (hasSelectedStartNode: boolean) => void;
    hasShownOnboarding: boolean;
    setHasShownOnboarding: (hasShownOnboarding: boolean) => void;
};
export type CreateWorkflowSlice = StateCreator<WorkflowSliceShape>;
export declare const createWorkflowSlice: StateCreator<WorkflowSliceShape>;
