import type { MetadataShape } from '@/app/components/workflow/nodes/knowledge-retrieval/types';
type ConditionListProps = {
    disabled?: boolean;
} & Omit<MetadataShape, 'handleAddCondition'>;
declare const ConditionList: ({ disabled, metadataList, metadataFilteringConditions, handleRemoveCondition, handleToggleConditionLogicalOperator, handleUpdateCondition, availableStringVars, availableStringNodesWithParent, availableNumberVars, availableNumberNodesWithParent, isCommonVariable, availableCommonNumberVars, availableCommonStringVars, }: ConditionListProps) => any;
export default ConditionList;
