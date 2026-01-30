import type { RefObject } from 'react';
import type { VariableAssignerNodeType } from './types';
import type { InputVar, ValueSelector, Variable } from '@/app/components/workflow/types';
type Params = {
    id: string;
    payload: VariableAssignerNodeType;
    runInputData: Record<string, any>;
    runInputDataRef: RefObject<Record<string, any>>;
    getInputVars: (textList: string[]) => InputVar[];
    setRunInputData: (data: Record<string, any>) => void;
    toVarInputs: (variables: Variable[]) => InputVar[];
    varSelectorsToVarInputs: (variables: ValueSelector[]) => InputVar[];
};
declare const useSingleRunFormParams: ({ payload, runInputData, setRunInputData, varSelectorsToVarInputs, }: Params) => {
    forms: {
        inputs: InputVar[];
        values: Record<string, any>;
        onChange: any;
    }[];
    getDependentVars: () => any[];
};
export default useSingleRunFormParams;
