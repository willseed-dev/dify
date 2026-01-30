import type { Var } from '../../types';
import { VarType } from '../../types';
export declare const checkNodeValid: () => boolean;
export declare const filterVar: (varType: VarType) => (v: Var) => boolean;
