import type { CommonNodeType, Node } from '@/app/components/workflow/types';
type ContainerProps = {
    nodeId: string;
    nodeData: CommonNodeType;
    sourceHandle: string;
    nextNodes: Node[];
    branchName?: string;
    isFailBranch?: boolean;
};
declare const Container: ({ nodeId, nodeData, sourceHandle, nextNodes, branchName, isFailBranch, }: ContainerProps) => any;
export default Container;
