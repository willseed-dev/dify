import type { RefObject } from 'react';
import type { CodeNodeType } from './types';
import type { InputVar, Variable } from '@/app/components/workflow/types';
type Params = {
    id: string;
    payload: CodeNodeType;
    runInputData: Record<string, any>;
    runInputDataRef: RefObject<Record<string, any>>;
    getInputVars: (textList: string[]) => InputVar[];
    setRunInputData: (data: Record<string, any>) => void;
    toVarInputs: (variables: Variable[]) => InputVar[];
};
declare const useSingleRunFormParams: ({ id, payload, runInputData, toVarInputs, setRunInputData, }: Params) => {
    forms: any;
    getDependentVars: () => any;
    getDependentVar: (variable: string) => any;
};
export default useSingleRunFormParams;
