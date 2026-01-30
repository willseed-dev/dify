import type { Node, ValueSelector, VarType } from '@/app/components/workflow/types';
type VariableTagProps = {
    valueSelector: ValueSelector;
    varType: VarType;
    isShort?: boolean;
    availableNodes?: Node[];
};
declare const VariableTag: ({ valueSelector, varType, isShort, availableNodes, }: VariableTagProps) => any;
export default VariableTag;
