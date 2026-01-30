export declare const useIsChatMode: () => boolean;
export declare const useWorkflow: () => {
    getNodeById: any;
    getTreeLeafNodes: any;
    getBeforeNodesInSameBranch: any;
    getBeforeNodesInSameBranchIncludeParent: any;
    getAfterNodesInSameBranch: any;
    handleOutVarRenameChange: any;
    isVarUsedInNodes: any;
    removeUsedVarInNodes: any;
    isNodeVarsUsedInNodes: any;
    isValidConnection: any;
    getBeforeNodeById: any;
    getIterationNodeChildren: any;
    getLoopNodeChildren: any;
    getRootNodesById: any;
    getStartNodes: any;
    isFromStartNode: any;
    getNode: any;
};
export declare const useWorkflowReadOnly: () => {
    workflowReadOnly: boolean;
    getWorkflowReadOnly: any;
};
export declare const useNodesReadOnly: () => {
    nodesReadOnly: boolean;
    getNodesReadOnly: any;
};
export declare const useIsNodeInIteration: (iterationId: string) => {
    isNodeInIteration: any;
};
export declare const useIsNodeInLoop: (loopId: string) => {
    isNodeInLoop: any;
};
