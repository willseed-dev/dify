import type { RefObject } from 'react';
import type { ToolNodeType } from './types';
import type { InputVar, Variable } from '@/app/components/workflow/types';
import type { NodeTracing } from '@/types/workflow';
type Params = {
    id: string;
    payload: ToolNodeType;
    runInputData: Record<string, any>;
    runInputDataRef: RefObject<Record<string, any>>;
    getInputVars: (textList: string[]) => InputVar[];
    setRunInputData: (data: Record<string, any>) => void;
    toVarInputs: (variables: Variable[]) => InputVar[];
    runResult: NodeTracing;
};
declare const useSingleRunFormParams: ({ id, payload, getInputVars, setRunInputData, runResult, }: Params) => {
    forms: any;
    nodeInfo: any;
    toolIcon: any;
    getDependentVars: () => any[];
};
export default useSingleRunFormParams;
