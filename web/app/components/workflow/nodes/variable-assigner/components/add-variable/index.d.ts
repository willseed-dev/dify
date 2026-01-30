import type { VariableAssignerNodeType } from '../../types';
import type { NodeOutPutVar } from '@/app/components/workflow/types';
export type AddVariableProps = {
    variableAssignerNodeId: string;
    variableAssignerNodeData: VariableAssignerNodeType;
    availableVars: NodeOutPutVar[];
    handleId?: string;
};
declare const _default: any;
export default _default;
