import type { StateCreator } from 'zustand';
import type { Node, TriggerNodeType, WorkflowRunningData } from '@/app/components/workflow/types';
import type { FileUploadConfigResponse } from '@/models/common';
type PreviewRunningData = WorkflowRunningData & {
    resultTabActive?: boolean;
    resultText?: string;
};
export type WorkflowSliceShape = {
    workflowRunningData?: PreviewRunningData;
    setWorkflowRunningData: (workflowData: PreviewRunningData) => void;
    isListening: boolean;
    setIsListening: (listening: boolean) => void;
    listeningTriggerType: TriggerNodeType | null;
    setListeningTriggerType: (triggerType: TriggerNodeType | null) => void;
    listeningTriggerNodeId: string | null;
    setListeningTriggerNodeId: (nodeId: string | null) => void;
    listeningTriggerNodeIds: string[];
    setListeningTriggerNodeIds: (nodeIds: string[]) => void;
    listeningTriggerIsAll: boolean;
    setListeningTriggerIsAll: (isAll: boolean) => void;
    clipboardElements: Node[];
    setClipboardElements: (clipboardElements: Node[]) => void;
    selection: null | {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    };
    setSelection: (selection: WorkflowSliceShape['selection']) => void;
    bundleNodeSize: {
        width: number;
        height: number;
    } | null;
    setBundleNodeSize: (bundleNodeSize: WorkflowSliceShape['bundleNodeSize']) => void;
    controlMode: 'pointer' | 'hand';
    setControlMode: (controlMode: WorkflowSliceShape['controlMode']) => void;
    mousePosition: {
        pageX: number;
        pageY: number;
        elementX: number;
        elementY: number;
    };
    setMousePosition: (mousePosition: WorkflowSliceShape['mousePosition']) => void;
    showConfirm?: {
        title: string;
        desc?: string;
        onConfirm: () => void;
    };
    setShowConfirm: (showConfirm: WorkflowSliceShape['showConfirm']) => void;
    controlPromptEditorRerenderKey: number;
    setControlPromptEditorRerenderKey: (controlPromptEditorRerenderKey: number) => void;
    showImportDSLModal: boolean;
    setShowImportDSLModal: (showImportDSLModal: boolean) => void;
    fileUploadConfig?: FileUploadConfigResponse;
    setFileUploadConfig: (fileUploadConfig: FileUploadConfigResponse) => void;
};
export declare const createWorkflowSlice: StateCreator<WorkflowSliceShape>;
export {};
