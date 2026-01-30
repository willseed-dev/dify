import type { StateCreator } from 'zustand';
import type { ValueSelector } from '../../../types';
import type { NodeWithVar, VarInInspect } from '@/types/workflow';
type InspectVarsState = {
    currentFocusNodeId: string | null;
    nodesWithInspectVars: NodeWithVar[];
    conversationVars: VarInInspect[];
};
type InspectVarsActions = {
    setCurrentFocusNodeId: (nodeId: string | null) => void;
    setNodesWithInspectVars: (payload: NodeWithVar[]) => void;
    deleteAllInspectVars: () => void;
    setNodeInspectVars: (nodeId: string, payload: VarInInspect[]) => void;
    deleteNodeInspectVars: (nodeId: string) => void;
    setInspectVarValue: (nodeId: string, name: string, value: any) => void;
    resetToLastRunVar: (nodeId: string, varId: string, value: any) => void;
    renameInspectVarName: (nodeId: string, varId: string, selector: ValueSelector) => void;
    deleteInspectVar: (nodeId: string, varId: string) => void;
};
export type InspectVarsSliceShape = InspectVarsState & InspectVarsActions;
export declare const createInspectVarsSlice: StateCreator<InspectVarsSliceShape>;
export {};
