import type { PromptVariable } from '@/models/debug';
import type { UserInputFormItem } from '@/types/app';
export declare const userInputsFormToPromptVariables: (useInputs: UserInputFormItem[] | null, dataset_query_variable?: string) => PromptVariable[];
export declare const promptVariablesToUserInputsForm: (promptVariables: PromptVariable[]) => UserInputFormItem[];
export declare const formatBooleanInputs: (useInputs?: PromptVariable[] | null, inputs?: Record<string, string | number | object | boolean> | null) => Record<string, string | number | boolean | object> | null | undefined;
