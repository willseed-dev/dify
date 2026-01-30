import type { IterationNodeType } from './types';
declare const useConfig: (id: string, payload: IterationNodeType) => {
    readOnly: boolean;
    inputs: CommonNodeType<T>;
    filterInputVar: any;
    handleInputChange: any;
    childrenNodeVars: NodeOutPutVar[];
    iterationChildrenNodes: any;
    handleOutputVarChange: any;
    changeParallel: any;
    changeErrorResponseMode: any;
    changeParallelNums: any;
    changeFlattenOutput: any;
};
export default useConfig;
