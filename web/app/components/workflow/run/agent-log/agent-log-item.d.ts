import type { AgentLogItemWithChildren } from '@/types/workflow';
type AgentLogItemProps = {
    item: AgentLogItemWithChildren;
    onShowAgentOrToolLog: (detail: AgentLogItemWithChildren) => void;
};
declare const AgentLogItem: ({ item, onShowAgentOrToolLog, }: AgentLogItemProps) => any;
export default AgentLogItem;
