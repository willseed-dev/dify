import type { AssignerNodeType } from '../../types';
type Params = {
    id: string;
    inputs: AssignerNodeType;
    setInputs: (newInputs: AssignerNodeType) => void;
};
declare function useVarList({ inputs, setInputs, }: Params): {
    handleVarListChange: any;
    handleAddVariable: any;
};
export default useVarList;
