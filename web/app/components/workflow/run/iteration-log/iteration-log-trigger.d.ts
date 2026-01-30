import type { IterationDurationMap, NodeTracing } from '@/types/workflow';
type IterationLogTriggerProps = {
    nodeInfo: NodeTracing;
    allExecutions?: NodeTracing[];
    onShowIterationResultList: (iterationResultList: NodeTracing[][], iterationResultDurationMap: IterationDurationMap) => void;
};
declare const IterationLogTrigger: ({ nodeInfo, allExecutions, onShowIterationResultList, }: IterationLogTriggerProps) => any;
export default IterationLogTrigger;
