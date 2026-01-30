import type { Var } from '../../types';
import type { AssignerNodeType } from './types';
import { VarType } from '../../types';
import { WriteMode } from './types';
declare const useConfig: (id: string, rawPayload: AssignerNodeType) => {
    readOnly: any;
    inputs: any;
    handleOperationListChanges: any;
    getAssignedVarType: any;
    getToAssignedVarType: any;
    writeModeTypes: WriteMode[];
    writeModeTypesArr: WriteMode[];
    writeModeTypesNum: WriteMode[];
    filterAssignedVar: any;
    filterToAssignedVar: any;
    getAvailableVars: any;
    filterVar: (varType: VarType) => (v: Var) => boolean;
};
export default useConfig;
