import type { Node, NodeOutPutVar, ValueSelector, Var } from '@/app/components/workflow/types';
import { VarType } from '@/app/components/workflow/types';
type ConditionVariableSelectorProps = {
    valueSelector?: ValueSelector;
    varType?: VarType;
    availableNodes?: Node[];
    nodesOutputVars?: NodeOutPutVar[];
    onChange: (valueSelector: ValueSelector, varItem: Var) => void;
};
declare const ConditionVariableSelector: ({ valueSelector, varType, availableNodes, nodesOutputVars, onChange, }: ConditionVariableSelectorProps) => any;
export default ConditionVariableSelector;
