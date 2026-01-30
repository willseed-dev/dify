import type { NodeOutPutVar, ValueSelector, Var } from '@/app/components/workflow/types';
export type AddVariablePopupProps = {
    availableVars: NodeOutPutVar[];
    onSelect: (value: ValueSelector, item: Var) => void;
};
export declare const AddVariablePopup: ({ availableVars, onSelect, }: AddVariablePopupProps) => any;
declare const _default: any;
export default _default;
