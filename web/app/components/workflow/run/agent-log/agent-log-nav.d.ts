import type { AgentLogItemWithChildren } from '@/types/workflow';
type AgentLogNavProps = {
    agentOrToolLogItemStack: AgentLogItemWithChildren[];
    onShowAgentOrToolLog: (detail?: AgentLogItemWithChildren) => void;
};
declare const AgentLogNav: ({ agentOrToolLogItemStack, onShowAgentOrToolLog, }: AgentLogNavProps) => any;
export default AgentLogNav;
