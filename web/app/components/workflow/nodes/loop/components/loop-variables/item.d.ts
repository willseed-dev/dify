import type { LoopVariable, LoopVariablesComponentShape } from '@/app/components/workflow/nodes/loop/types';
type ItemProps = {
    item: LoopVariable;
} & LoopVariablesComponentShape;
declare const Item: ({ nodeId, item, handleRemoveLoopVariable, handleUpdateLoopVariable, }: ItemProps) => any;
export default Item;
