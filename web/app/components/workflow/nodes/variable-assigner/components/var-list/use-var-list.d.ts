import type { VariableAssignerNodeType } from '../../types';
type Params = {
    id: string;
    inputs: VariableAssignerNodeType;
    setInputs: (newInputs: VariableAssignerNodeType) => void;
};
declare function useVarList({ inputs, setInputs, }: Params): {
    handleVarListChange: any;
    handleAddVariable: any;
};
export default useVarList;
