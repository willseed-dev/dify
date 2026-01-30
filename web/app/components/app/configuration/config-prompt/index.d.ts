import type { PromptVariable } from '@/models/debug';
import type { AppModeEnum } from '@/types/app';
export type IPromptProps = {
    mode: AppModeEnum;
    promptTemplate: string;
    promptVariables: PromptVariable[];
    readonly?: boolean;
    noTitle?: boolean;
    gradientBorder?: boolean;
    editorHeight?: number;
    noResize?: boolean;
    onChange?: (prompt: string, promptVariables: PromptVariable[]) => void;
};
declare const _default: any;
export default _default;
