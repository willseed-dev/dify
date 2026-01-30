type Params<T> = {
    id: string;
    inputs: T;
    setInputs: (newInputs: T) => void;
    varKey?: string;
    outputKeyOrders: string[];
    onOutputKeyOrdersChange: (newOutputKeyOrders: string[]) => void;
};
declare function useOutputVarList<T>({ id, inputs, setInputs, varKey, outputKeyOrders, onOutputKeyOrdersChange, }: Params<T>): {
    handleVarsChange: any;
    handleAddVariable: any;
    handleRemoveVariable: any;
    isShowRemoveVarConfirm: any;
    hideRemoveVarConfirm: any;
    onRemoveVarConfirm: any;
};
export default useOutputVarList;
