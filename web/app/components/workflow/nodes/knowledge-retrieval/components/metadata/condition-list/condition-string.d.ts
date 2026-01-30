import type { ConditionValueMethodProps } from './condition-value-method';
import type { Node, NodeOutPutVar } from '@/app/components/workflow/types';
type ConditionStringProps = {
    value?: string;
    onChange: (value: string) => void;
    nodesOutputVars: NodeOutPutVar[];
    availableNodes: Node[];
    isCommonVariable?: boolean;
    commonVariables: {
        name: string;
        type: string;
        value: string;
    }[];
} & ConditionValueMethodProps;
declare const ConditionString: ({ value, onChange, valueMethod, onValueMethodChange, nodesOutputVars, availableNodes, isCommonVariable, commonVariables, }: ConditionStringProps) => any;
export default ConditionString;
