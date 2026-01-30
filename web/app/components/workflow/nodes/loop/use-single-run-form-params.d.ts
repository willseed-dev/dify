import type { InputVar, ValueSelector, Variable } from '../../types';
import type { LoopNodeType } from './types';
import type { NodeTracing } from '@/types/workflow';
type Params = {
    id: string;
    payload: LoopNodeType;
    runInputData: Record<string, any>;
    runResult: NodeTracing;
    loopRunResult: NodeTracing[];
    setRunInputData: (data: Record<string, any>) => void;
    toVarInputs: (variables: Variable[]) => InputVar[];
    varSelectorsToVarInputs: (variables: ValueSelector[]) => InputVar[];
};
declare const useSingleRunFormParams: ({ id, payload, runInputData, runResult, loopRunResult, setRunInputData, toVarInputs, varSelectorsToVarInputs, }: Params) => {
    forms: {
        inputs: InputVar[];
        values: Record<string, any>;
        onChange: any;
    }[];
    nodeInfo: any;
    allVarObject: Record<string, {
        inSingleRunPassedKey: string;
    }>;
    getDependentVars: () => ValueSelector[];
};
export default useSingleRunFormParams;
