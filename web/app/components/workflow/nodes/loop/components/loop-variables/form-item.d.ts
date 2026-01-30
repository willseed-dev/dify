import type { LoopVariable } from '@/app/components/workflow/nodes/loop/types';
type FormItemProps = {
    nodeId: string;
    item: LoopVariable;
    onChange: (value: any) => void;
};
declare const FormItem: ({ nodeId, item, onChange, }: FormItemProps) => any;
export default FormItem;
