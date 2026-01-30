import type { RefObject } from 'react';
import type { StartNodeType } from './types';
import type { InputVar, Variable } from '@/app/components/workflow/types';
type Params = {
    id: string;
    payload: StartNodeType;
    runInputData: Record<string, any>;
    runInputDataRef: RefObject<Record<string, any>>;
    getInputVars: (textList: string[]) => InputVar[];
    setRunInputData: (data: Record<string, any>) => void;
    toVarInputs: (variables: Variable[]) => InputVar[];
};
declare const useSingleRunFormParams: ({ id, payload, runInputData, setRunInputData, }: Params) => {
    forms: FormProps[];
    getDependentVars: () => ValueSelector[];
    getDependentVar: (variable: string) => string[];
};
export default useSingleRunFormParams;
