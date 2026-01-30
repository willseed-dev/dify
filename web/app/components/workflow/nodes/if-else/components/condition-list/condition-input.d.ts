import type { Node, NodeOutPutVar } from '@/app/components/workflow/types';
type ConditionInputProps = {
    disabled?: boolean;
    value: string;
    onChange: (value: string) => void;
    nodesOutputVars: NodeOutPutVar[];
    availableNodes: Node[];
};
declare const ConditionInput: ({ value, onChange, disabled, nodesOutputVars, availableNodes, }: ConditionInputProps) => any;
export default ConditionInput;
