import type { Node, ValueSelector, Var } from '@/app/components/workflow/types';
type Params = {
    onlyLeafNodeVar?: boolean;
    hideEnv?: boolean;
    hideChatVar?: boolean;
    filterVar: (payload: Var, selector: ValueSelector) => boolean;
    passedInAvailableNodes?: Node[];
};
declare const useAvailableVarList: (nodeId: string, { onlyLeafNodeVar, filterVar, hideEnv, hideChatVar, passedInAvailableNodes, }?: Params) => {
    availableVars: any[];
    availableNodes: any;
    availableNodesWithParent: any[];
};
export default useAvailableVarList;
