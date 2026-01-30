import type { RefObject } from 'react';
import type { IterationNodeType } from './types';
import type { InputVar, Variable } from '@/app/components/workflow/types';
import type { NodeTracing } from '@/types/workflow';
type Params = {
    id: string;
    payload: IterationNodeType;
    runInputData: Record<string, any>;
    runInputDataRef: RefObject<Record<string, any>>;
    getInputVars: (textList: string[]) => InputVar[];
    setRunInputData: (data: Record<string, any>) => void;
    toVarInputs: (variables: Variable[]) => InputVar[];
    iterationRunResult: NodeTracing[];
};
declare const useSingleRunFormParams: ({ id, payload, runInputData, toVarInputs, setRunInputData, iterationRunResult, }: Params) => {
    forms: any;
    nodeInfo: any;
    allVarObject: Record<string, {
        inSingleRunPassedKey: string;
    }>;
    getDependentVars: () => any[];
    getDependentVar: (variable: string) => any;
};
export default useSingleRunFormParams;
