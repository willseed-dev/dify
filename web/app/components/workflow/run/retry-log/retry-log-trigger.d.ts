import type { NodeTracing } from '@/types/workflow';
type RetryLogTriggerProps = {
    nodeInfo: NodeTracing;
    onShowRetryResultList: (detail: NodeTracing[]) => void;
};
declare const RetryLogTrigger: ({ nodeInfo, onShowRetryResultList, }: RetryLogTriggerProps) => any;
export default RetryLogTrigger;
