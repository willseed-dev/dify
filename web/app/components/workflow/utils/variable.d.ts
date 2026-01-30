import type { BlockEnum, ValueSelector } from '../types';
export declare const variableTransformer: (v: ValueSelector | string) => string | string[];
export declare const isExceptionVariable: (variable: string, nodeType?: BlockEnum) => boolean;
