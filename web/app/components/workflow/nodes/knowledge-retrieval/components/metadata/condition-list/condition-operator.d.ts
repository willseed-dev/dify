import type { ComparisonOperator, MetadataFilteringVariableType } from '@/app/components/workflow/nodes/knowledge-retrieval/types';
type ConditionOperatorProps = {
    className?: string;
    disabled?: boolean;
    variableType: MetadataFilteringVariableType;
    value?: string;
    onSelect: (value: ComparisonOperator) => void;
};
declare const ConditionOperator: ({ className, disabled, variableType, value, onSelect, }: ConditionOperatorProps) => any;
export default ConditionOperator;
