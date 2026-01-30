import type { VarType } from '@/app/components/workflow/types';
type ConditionCommonVariableSelectorProps = {
    variables?: {
        name: string;
        type: string;
        value: string;
    }[];
    value?: string | number;
    varType?: VarType;
    onChange: (v: string) => void;
};
declare const ConditionCommonVariableSelector: ({ variables, value, onChange, varType, }: ConditionCommonVariableSelectorProps) => any;
export default ConditionCommonVariableSelector;
