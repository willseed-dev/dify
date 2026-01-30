import type { Node } from 'reactflow';
import type { ToolValue } from '@/app/components/workflow/block-selector/types';
import type { NodeOutPutVar } from '@/app/components/workflow/types';
type Props = {
    disabled?: boolean;
    value: ToolValue[];
    label: string;
    required?: boolean;
    tooltip?: any;
    supportCollapse?: boolean;
    scope?: string;
    onChange: (value: ToolValue[]) => void;
    nodeOutputVars: NodeOutPutVar[];
    availableNodes: Node[];
    nodeId?: string;
    canChooseMCPTool?: boolean;
};
declare const MultipleToolSelector: ({ disabled, value, label, required, tooltip, supportCollapse, scope, onChange, nodeOutputVars, availableNodes, nodeId, canChooseMCPTool, }: Props) => any;
export default MultipleToolSelector;
