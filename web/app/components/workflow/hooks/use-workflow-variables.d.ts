import type { Type } from '../nodes/llm/types';
import type { ValueSelector } from '@/app/components/workflow/types';
export declare const useWorkflowVariables: () => {
    getNodeAvailableVars: any;
    getCurrentVariableType: any;
};
export declare const useWorkflowVariableType: () => ({ nodeId, valueSelector, }: {
    nodeId: string;
    valueSelector: ValueSelector;
}) => Type;
