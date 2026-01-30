import type { StateCreator } from 'zustand';
import type { ToolWithProvider } from '../../types';
export type ToolSliceShape = {
    toolPublished: boolean;
    setToolPublished: (toolPublished: boolean) => void;
    lastPublishedHasUserInput: boolean;
    setLastPublishedHasUserInput: (hasUserInput: boolean) => void;
    buildInTools?: ToolWithProvider[];
    customTools?: ToolWithProvider[];
    workflowTools?: ToolWithProvider[];
    mcpTools?: ToolWithProvider[];
};
export declare const createToolSlice: StateCreator<ToolSliceShape>;
