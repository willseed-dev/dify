import type { Condition, HandleAddSubVariableCondition, HandleRemoveCondition, handleRemoveSubVariableCondition, HandleToggleSubVariableConditionLogicalOperator, HandleUpdateCondition, HandleUpdateSubVariableCondition } from '../../types';
import type { Node, NodeOutPutVar, Var } from '@/app/components/workflow/types';
type ConditionItemProps = {
    className?: string;
    disabled?: boolean;
    caseId: string;
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
    nodesOutputVars: NodeOutPutVar[];
    availableNodes: Node[];
    numberVariables: NodeOutPutVar[];
    filterVar: (varPayload: Var) => boolean;
};
declare const ConditionItem: ({ className, disabled, caseId, conditionId, condition, file, isSubVariableKey, isValueFieldShort, onRemoveCondition, onUpdateCondition, onAddSubVariableCondition, onRemoveSubVariableCondition, onUpdateSubVariableCondition, onToggleSubVariableConditionLogicalOperator, nodeId, nodesOutputVars, availableNodes, numberVariables, filterVar, }: ConditionItemProps) => any;
export default ConditionItem;
