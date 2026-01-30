import type { Node } from '@/app/components/workflow/types';
type ConditionInputProps = {
    disabled?: boolean;
    value: string;
    onChange: (value: string) => void;
    availableNodes: Node[];
};
declare const ConditionInput: ({ value, onChange, disabled, availableNodes, }: ConditionInputProps) => any;
export default ConditionInput;
