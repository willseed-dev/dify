import type { FlowType } from '@/types/common';
type Params = {
    flowType: FlowType;
    flowId: string;
};
export declare const useSetWorkflowVarsWithValue: ({ flowType, flowId, }: Params) => {
    fetchInspectVars: any;
};
export {};
