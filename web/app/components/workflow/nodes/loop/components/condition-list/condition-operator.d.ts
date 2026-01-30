import type { ComparisonOperator } from '../../types';
import type { VarType } from '@/app/components/workflow/types';
type ConditionOperatorProps = {
    className?: string;
    disabled?: boolean;
    varType: VarType;
    file?: {
        key: string;
    };
    value?: string;
    onSelect: (value: ComparisonOperator) => void;
};
declare const ConditionOperator: ({ className, disabled, varType, file, value, onSelect, }: ConditionOperatorProps) => any;
export default ConditionOperator;
