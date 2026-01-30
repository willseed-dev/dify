import type { PromptVariable } from '@/models/debug';
export declare const ADD_EXTERNAL_DATA_TOOL = "ADD_EXTERNAL_DATA_TOOL";
export type IConfigVarProps = {
    promptVariables: PromptVariable[];
    readonly?: boolean;
    onPromptVariablesChange?: (promptVariables: PromptVariable[]) => void;
};
declare const _default: any;
export default _default;
