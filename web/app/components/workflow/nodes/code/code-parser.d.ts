import type { OutputVar } from './types';
import { CodeLanguage } from './types';
export declare const extractFunctionParams: (code: string, language: CodeLanguage) => string[];
export declare const extractReturnType: (code: string, language: CodeLanguage) => OutputVar;
