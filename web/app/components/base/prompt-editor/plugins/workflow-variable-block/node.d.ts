import type { LexicalNode, NodeKey, SerializedLexicalNode } from 'lexical';
import type { GetVarType, WorkflowVariableBlockType } from '../../types';
import type { Var } from '@/app/components/workflow/types';
import { DecoratorNode } from 'lexical';
export type WorkflowNodesMap = WorkflowVariableBlockType['workflowNodesMap'];
export type SerializedNode = SerializedLexicalNode & {
    variables: string[];
    workflowNodesMap: WorkflowNodesMap;
    getVarType?: GetVarType;
    environmentVariables?: Var[];
    conversationVariables?: Var[];
    ragVariables?: Var[];
};
export declare class WorkflowVariableBlockNode extends DecoratorNode<React.JSX.Element> {
    __variables: string[];
    __workflowNodesMap: WorkflowNodesMap;
    __getVarType?: GetVarType;
    __environmentVariables?: Var[];
    __conversationVariables?: Var[];
    __ragVariables?: Var[];
    static getType(): string;
    static clone(node: WorkflowVariableBlockNode): WorkflowVariableBlockNode;
    isInline(): boolean;
    constructor(variables: string[], workflowNodesMap: WorkflowNodesMap, getVarType: any, key?: NodeKey, environmentVariables?: Var[], conversationVariables?: Var[], ragVariables?: Var[]);
    createDOM(): HTMLElement;
    updateDOM(): false;
    decorate(): React.JSX.Element;
    static importJSON(serializedNode: SerializedNode): WorkflowVariableBlockNode;
    exportJSON(): SerializedNode;
    getVariables(): string[];
    getWorkflowNodesMap(): WorkflowNodesMap;
    getVarType(): any;
    getEnvironmentVariables(): any;
    getConversationVariables(): any;
    getRagVariables(): any;
    getTextContent(): string;
}
export declare function $createWorkflowVariableBlockNode(variables: string[], workflowNodesMap: WorkflowNodesMap, getVarType?: GetVarType, environmentVariables?: Var[], conversationVariables?: Var[], ragVariables?: Var[]): WorkflowVariableBlockNode;
export declare function $isWorkflowVariableBlockNode(node: WorkflowVariableBlockNode | LexicalNode | null | undefined): node is WorkflowVariableBlockNode;
