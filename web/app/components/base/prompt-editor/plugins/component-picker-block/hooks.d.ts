import type { ContextBlockType, CurrentBlockType, ErrorMessageBlockType, ExternalToolBlockType, HistoryBlockType, LastRunBlockType, QueryBlockType, VariableBlockType, WorkflowVariableBlockType } from '../../types';
import { PickerBlockMenuOption } from './menu';
export declare const usePromptOptions: (contextBlock?: ContextBlockType, queryBlock?: QueryBlockType, historyBlock?: HistoryBlockType) => PickerBlockMenuOption[];
export declare const useVariableOptions: (variableBlock?: VariableBlockType, queryString?: string) => PickerBlockMenuOption[];
export declare const useExternalToolOptions: (externalToolBlockType?: ExternalToolBlockType, queryString?: string) => any;
export declare const useOptions: (contextBlock?: ContextBlockType, queryBlock?: QueryBlockType, historyBlock?: HistoryBlockType, variableBlock?: VariableBlockType, externalToolBlockType?: ExternalToolBlockType, workflowVariableBlockType?: WorkflowVariableBlockType, currentBlockType?: CurrentBlockType, errorMessageBlockType?: ErrorMessageBlockType, lastRunBlockType?: LastRunBlockType, queryString?: string) => any;
