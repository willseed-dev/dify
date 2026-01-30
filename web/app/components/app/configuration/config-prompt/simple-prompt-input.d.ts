import type { PromptVariable } from '@/models/debug';
import { AppModeEnum } from '@/types/app';
export type ISimplePromptInput = {
    mode: AppModeEnum;
    promptTemplate: string;
    promptVariables: PromptVariable[];
    readonly?: boolean;
    onChange?: (prompt: string, promptVariables: PromptVariable[]) => void;
    noTitle?: boolean;
    gradientBorder?: boolean;
    editorHeight?: number;
    noResize?: boolean;
};
declare const _default: any;
export default _default;
