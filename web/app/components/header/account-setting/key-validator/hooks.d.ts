import type { DebouncedFunc } from 'es-toolkit/compat';
import type { ValidateCallback, ValidatedStatusState, ValidateValue } from './declarations';
export declare const useValidate: (value: ValidateValue) => [DebouncedFunc<(validateCallback: ValidateCallback) => Promise<void>>, boolean, ValidatedStatusState];
