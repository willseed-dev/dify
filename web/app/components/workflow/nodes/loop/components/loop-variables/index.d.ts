import type { LoopVariable, LoopVariablesComponentShape } from '@/app/components/workflow/nodes/loop/types';
type LoopVariableProps = {
    variables?: LoopVariable[];
} & LoopVariablesComponentShape;
declare const LoopVariableComponent: ({ variables, ...restProps }: LoopVariableProps) => any;
export default LoopVariableComponent;
