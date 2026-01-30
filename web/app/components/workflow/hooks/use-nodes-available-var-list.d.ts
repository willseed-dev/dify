import type { Node, NodeOutPutVar, ValueSelector, Var } from '@/app/components/workflow/types';
type Params = {
    onlyLeafNodeVar?: boolean;
    hideEnv?: boolean;
    hideChatVar?: boolean;
    filterVar: (payload: Var, selector: ValueSelector) => boolean;
    passedInAvailableNodes?: Node[];
};
declare const useNodesAvailableVarList: (nodes: Node[], { onlyLeafNodeVar, filterVar, hideEnv, hideChatVar, passedInAvailableNodes, }?: Params) => {
    [key: string]: {
        availableVars: NodeOutPutVar[];
        availableNodes: Node[];
    };
};
export declare const useGetNodesAvailableVarList: () => {
    getNodesAvailableVarList: any;
};
export default useNodesAvailableVarList;
