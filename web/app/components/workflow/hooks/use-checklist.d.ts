import type { Edge, Node } from '../types';
import type { Emoji } from '@/app/components/tools/types';
import { BlockEnum } from '../types';
export type ChecklistItem = {
    id: string;
    type: BlockEnum | string;
    title: string;
    toolIcon?: string | Emoji;
    unConnected?: boolean;
    errorMessage?: string;
    canNavigate: boolean;
    disableGoTo?: boolean;
};
export declare const useChecklist: (nodes: Node[], edges: Edge[]) => any;
export declare const useChecklistBeforePublish: () => {
    handleCheckBeforePublish: any;
};
export declare const useWorkflowRunValidation: () => {
    validateBeforeRun: any;
    hasValidationErrors: boolean;
    warningNodes: any;
};
