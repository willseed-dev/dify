import type { PromptVariable } from '@/models/debug';
export declare function replaceStringWithValues(str: string, promptVariables: PromptVariable[], inputs: Record<string, any>): string;
