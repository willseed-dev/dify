import type { ValueSelector } from '../../types';
type Params = {
    nodeId: string;
    isInIteration: boolean;
    isInLoop: boolean;
};
declare const useIsVarFileAttribute: ({ nodeId, isInIteration, isInLoop, }: Params) => {
    getIsVarFileAttribute: (variable: ValueSelector) => boolean;
};
export default useIsVarFileAttribute;
