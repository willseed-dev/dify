import type { CustomRunFormProps } from '../types';
declare const useBeforeRunForm: ({ nodeId, flowId, flowType, payload, setRunResult, isPaused, isRunAfterSingleRun, setIsRunAfterSingleRun, onSuccess, appendNodeInspectVars, }: CustomRunFormProps) => {
    isPending: any;
    handleRunWithSyncDraft: () => void;
    datasourceType: DatasourceType;
    datasourceNodeData: any;
    startRunBtnDisabled: any;
};
export default useBeforeRunForm;
