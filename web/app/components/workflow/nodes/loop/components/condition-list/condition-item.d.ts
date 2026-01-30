import type { Condition, HandleAddSubVariableCondition, HandleRemoveCondition, handleRemoveSubVariableCondition, HandleToggleSubVariableConditionLogicalOperator, HandleUpdateCondition, HandleUpdateSubVariableCondition } from '../../types';
import type { Node, NodeOutPutVar } from '@/app/components/workflow/types';
type ConditionItemProps = {
    className?: string;
    disabled?: boolean;
    conditionId: string;
    condition: Condition;
    file?: {
        key: string;
    };
    isSubVariableKey?: boolean;
    isValueFieldShort?: boolean;
    onRemoveCondition?: HandleRemoveCondition;
    onUpdateCondition?: HandleUpdateCondition;
    onAddSubVariableCondition?: HandleAddSubVariableCondition;
    onRemoveSubVariableCondition?: handleRemoveSubVariableCondition;
    onUpdateSubVariableCondition?: HandleUpdateSubVariableCondition;
    onToggleSubVariableConditionLogicalOperator?: HandleToggleSubVariableConditionLogicalOperator;
    nodeId: string;
    availableNodes: Node[];
    numberVariables: NodeOutPutVar[];
    availableVars: NodeOutPutVar[];
};
declare const ConditionItem: ({ className, disabled, conditionId, condition, file, isSubVariableKey, isValueFieldShort, onRemoveCondition, onUpdateCondition, onAddSubVariableCondition, onRemoveSubVariableCondition, onUpdateSubVariableCondition, onToggleSubVariableConditionLogicalOperator, nodeId, availableNodes, numberVariables, availableVars, }: ConditionItemProps) => any;
export default ConditionItem;
