import type { GetVarType } from '../../types';
import type { Node } from '@/app/components/workflow/types';
export declare const INSERT_WORKFLOW_VARIABLE_BLOCK_COMMAND: any;
export declare const DELETE_WORKFLOW_VARIABLE_BLOCK_COMMAND: any;
export declare const CLEAR_HIDE_MENU_TIMEOUT: any;
export declare const UPDATE_WORKFLOW_NODES_MAP: any;
export type WorkflowVariableBlockProps = {
    getWorkflowNode: (nodeId: string) => Node;
    onInsert?: () => void;
    onDelete?: () => void;
    getVarType: GetVarType;
};
declare const WorkflowVariableBlock: any;
export { WorkflowVariableBlock };
export { WorkflowVariableBlockNode } from './node';
export { default as WorkflowVariableBlockReplacementBlock } from './workflow-variable-block-replacement-block';
