import type { AgentLogItemWithChildren, NodeTracing } from '@/types/workflow';
type AgentLogTriggerProps = {
    nodeInfo: NodeTracing;
    onShowAgentOrToolLog: (detail?: AgentLogItemWithChildren) => void;
};
declare const AgentLogTrigger: ({ nodeInfo, onShowAgentOrToolLog, }: AgentLogTriggerProps) => any;
export default AgentLogTrigger;
