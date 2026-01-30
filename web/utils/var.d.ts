import type { InputVar } from '@/app/components/workflow/types';
import type { I18nKeysByPrefix } from '@/types/i18n';
export declare const getNewVar: (key: string, type: string) => any;
export declare const getNewVarInWorkflow: (key: string, type?: any) => InputVar;
export type VarKeyErrorMessageKey = I18nKeysByPrefix<'appDebug', 'varKeyError.'>;
export declare const checkKey: (key: string, canBeEmpty?: boolean, _keys?: string[]) => true | VarKeyErrorMessageKey;
type CheckKeysResult = {
    isValid: true;
    errorKey: '';
    errorMessageKey: '';
} | {
    isValid: false;
    errorKey: string;
    errorMessageKey: VarKeyErrorMessageKey;
};
export declare const checkKeys: (keys: string[], canBeEmpty?: boolean) => CheckKeysResult;
export declare const hasDuplicateStr: (strArr: string[]) => boolean;
export declare const getVars: (value: string) => string[];
export declare const basePath: string;
export declare function getMarketplaceUrl(path: string, params?: Record<string, string | undefined>): string;
export declare const replaceSpaceWithUnderscoreInVarNameInput: (input: HTMLInputElement) => void;
export {};
