import type { HandleRemoveCondition, HandleUpdateCondition, MetadataFilteringCondition, MetadataShape } from '@/app/components/workflow/nodes/knowledge-retrieval/types';
type ConditionItemProps = {
    className?: string;
    disabled?: boolean;
    condition: MetadataFilteringCondition;
    onRemoveCondition?: HandleRemoveCondition;
    onUpdateCondition?: HandleUpdateCondition;
} & Pick<MetadataShape, 'metadataList' | 'availableStringVars' | 'availableStringNodesWithParent' | 'availableNumberVars' | 'availableNumberNodesWithParent' | 'isCommonVariable' | 'availableCommonStringVars' | 'availableCommonNumberVars'>;
declare const ConditionItem: ({ className, disabled, condition, onRemoveCondition, onUpdateCondition, metadataList, availableStringVars, availableStringNodesWithParent, availableNumberVars, availableNumberNodesWithParent, isCommonVariable, availableCommonStringVars, availableCommonNumberVars, }: ConditionItemProps) => any;
export default ConditionItem;
