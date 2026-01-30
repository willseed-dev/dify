import type { KnowledgeBaseNodeType } from './types';
import type { InputVar, Variable } from '@/app/components/workflow/types';
type Params = {
    id: string;
    payload: KnowledgeBaseNodeType;
    runInputData: Record<string, any>;
    getInputVars: (textList: string[]) => InputVar[];
    setRunInputData: (data: Record<string, any>) => void;
    toVarInputs: (variables: Variable[]) => InputVar[];
};
declare const useSingleRunFormParams: ({ payload, runInputData, setRunInputData, }: Params) => {
    forms: any;
    getDependentVars: () => any[];
    getDependentVar: (variable: string) => any;
};
export default useSingleRunFormParams;
