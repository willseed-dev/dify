import type { currentVarType } from './panel';
import type { NodeWithVar, VarInInspect } from '@/types/workflow';
import { VarInInspectType } from '@/types/workflow';
type Props = {
    nodeData?: NodeWithVar;
    currentVar?: currentVarType;
    varType: VarInInspectType;
    varList: VarInInspect[];
    handleSelect: (state: any) => void;
    handleView?: () => void;
    handleClear?: () => void;
};
declare const Group: ({ nodeData, currentVar, varType, varList, handleSelect, handleView, handleClear, }: Props) => any;
export default Group;
