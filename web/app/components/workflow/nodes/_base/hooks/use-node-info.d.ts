declare const useNodeInfo: (nodeId: string) => {
    node: any;
    isInIteration: boolean;
    isInLoop: boolean;
    parentNode: any;
};
export default useNodeInfo;
