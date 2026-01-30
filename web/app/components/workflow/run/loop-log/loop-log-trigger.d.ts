import type { LoopDurationMap, LoopVariableMap, NodeTracing } from '@/types/workflow';
type LoopLogTriggerProps = {
    nodeInfo: NodeTracing;
    allExecutions?: NodeTracing[];
    onShowLoopResultList: (loopResultList: NodeTracing[][], loopResultDurationMap: LoopDurationMap, loopVariableMap: LoopVariableMap) => void;
};
declare const LoopLogTrigger: ({ nodeInfo, allExecutions, onShowLoopResultList, }: LoopLogTriggerProps) => any;
export default LoopLogTrigger;
