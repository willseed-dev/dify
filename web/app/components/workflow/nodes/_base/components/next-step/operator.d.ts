import type { CommonNodeType } from '@/app/components/workflow/types';
type OperatorProps = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    data: CommonNodeType;
    nodeId: string;
    sourceHandle: string;
};
declare const Operator: ({ open, onOpenChange, data, nodeId, sourceHandle, }: OperatorProps) => any;
export default Operator;
