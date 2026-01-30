type Params<T> = {
    inputs: T;
    setInputs: (newInputs: T) => void;
    varKey?: string;
};
declare function useVarList<T>({ inputs, setInputs, varKey, }: Params<T>): {
    handleVarListChange: any;
    handleAddVariable: any;
};
export default useVarList;
