import type { Node, NodeOutPutVar, ValueSelector, Var, VarType } from '@/app/components/workflow/types';
type ConditionVarSelectorProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    valueSelector: ValueSelector;
    varType: VarType;
    availableNodes: Node[];
    nodesOutputVars: NodeOutPutVar[];
    onChange: (valueSelector: ValueSelector, varItem: Var) => void;
};
declare const ConditionVarSelector: ({ open, onOpenChange, valueSelector, varType, availableNodes, nodesOutputVars, onChange, }: ConditionVarSelectorProps) => any;
export default ConditionVarSelector;
