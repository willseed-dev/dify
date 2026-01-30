import type { StateCreator } from 'zustand';
import type { HistoryWorkflowData } from '@/app/components/workflow/types';
import type { VersionHistory } from '@/types/workflow';
export type HistorySliceShape = {
    historyWorkflowData?: HistoryWorkflowData;
    setHistoryWorkflowData: (historyWorkflowData?: HistoryWorkflowData) => void;
    showRunHistory: boolean;
    setShowRunHistory: (showRunHistory: boolean) => void;
    versionHistory: VersionHistory[];
    setVersionHistory: (versionHistory: VersionHistory[]) => void;
};
export declare const createHistorySlice: StateCreator<HistorySliceShape>;
