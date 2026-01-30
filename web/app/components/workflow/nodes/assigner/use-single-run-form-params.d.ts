import type { RefObject } from 'react';
import type { AssignerNodeType } from './types';
import type { InputVar, ValueSelector, Variable } from '@/app/components/workflow/types';
type Params = {
    id: string;
    payload: AssignerNodeType;
    runInputData: Record<string, any>;
    runInputDataRef: RefObject<Record<string, any>>;
    getInputVars: (textList: string[]) => InputVar[];
    setRunInputData: (data: Record<string, any>) => void;
    toVarInputs: (variables: Variable[]) => InputVar[];
    varSelectorsToVarInputs: (variables: ValueSelector[]) => InputVar[];
};
declare const useSingleRunFormParams: ({ id, payload, runInputData, setRunInputData, varSelectorsToVarInputs, }: Params) => {
    forms: any;
    getDependentVars: () => any;
};
export default useSingleRunFormParams;
