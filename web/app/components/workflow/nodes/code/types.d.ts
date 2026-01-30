import type { CommonNodeType, Variable, VarType } from '@/app/components/workflow/types';
export declare enum CodeLanguage {
    python3 = "python3",
    javascript = "javascript",
    json = "json"
}
export type OutputVar = Record<string, {
    type: VarType;
    children: null;
}>;
export type CodeDependency = {
    name: string;
    version?: string;
};
export type CodeNodeType = CommonNodeType & {
    variables: Variable[];
    code_language: CodeLanguage;
    code: string;
    outputs: OutputVar;
};
