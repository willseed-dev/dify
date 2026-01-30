import type { Node } from 'reactflow';
import type { NodeOutPutVar } from '@/app/components/workflow/types';
type Props = {
    value: Record<string, any>;
    onChange: (val: Record<string, any>) => void;
    schemas: any[];
    nodeOutputVars: NodeOutPutVar[];
    availableNodes: Node[];
    nodeId: string;
};
declare const ReasoningConfigForm: React.FC<Props>;
export default ReasoningConfigForm;
