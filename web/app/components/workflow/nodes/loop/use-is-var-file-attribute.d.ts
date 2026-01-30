import type { ValueSelector } from '../../types';
type Params = {
    nodeId: string;
};
declare const useIsVarFileAttribute: ({ nodeId, }: Params) => {
    getIsVarFileAttribute: (variable: ValueSelector) => boolean;
};
export default useIsVarFileAttribute;
