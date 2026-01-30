import type { StateCreator } from 'zustand';
export type PanelSliceShape = {
    panelWidth: number;
    showFeaturesPanel: boolean;
    setShowFeaturesPanel: (showFeaturesPanel: boolean) => void;
    showWorkflowVersionHistoryPanel: boolean;
    setShowWorkflowVersionHistoryPanel: (showWorkflowVersionHistoryPanel: boolean) => void;
    showInputsPanel: boolean;
    setShowInputsPanel: (showInputsPanel: boolean) => void;
    showDebugAndPreviewPanel: boolean;
    setShowDebugAndPreviewPanel: (showDebugAndPreviewPanel: boolean) => void;
    panelMenu?: {
        top: number;
        left: number;
    };
    setPanelMenu: (panelMenu: PanelSliceShape['panelMenu']) => void;
    selectionMenu?: {
        top: number;
        left: number;
    };
    setSelectionMenu: (selectionMenu: PanelSliceShape['selectionMenu']) => void;
    showVariableInspectPanel: boolean;
    setShowVariableInspectPanel: (showVariableInspectPanel: boolean) => void;
    initShowLastRunTab: boolean;
    setInitShowLastRunTab: (initShowLastRunTab: boolean) => void;
};
export declare const createPanelSlice: StateCreator<PanelSliceShape>;
