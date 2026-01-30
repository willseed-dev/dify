import type { ConditionValueMethodProps } from './condition-value-method';
import type { Node, NodeOutPutVar } from '@/app/components/workflow/types';
type ConditionNumberProps = {
    value?: string | number;
    onChange: (value?: string | number) => void;
    nodesOutputVars: NodeOutPutVar[];
    availableNodes: Node[];
    isCommonVariable?: boolean;
    commonVariables: {
        name: string;
        type: string;
        value: string;
    }[];
} & ConditionValueMethodProps;
declare const ConditionNumber: ({ value, onChange, valueMethod, onValueMethodChange, nodesOutputVars, availableNodes, isCommonVariable, commonVariables, }: ConditionNumberProps) => any;
export default ConditionNumber;
