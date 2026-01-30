import type { AgentLogItemWithChildren } from '@/types/workflow';
type AgentResultPanelProps = {
    agentOrToolLogItemStack: AgentLogItemWithChildren[];
    agentOrToolLogListMap: Record<string, AgentLogItemWithChildren[]>;
    onShowAgentOrToolLog: (detail?: AgentLogItemWithChildren) => void;
};
declare const AgentResultPanel: ({ agentOrToolLogItemStack, agentOrToolLogListMap, onShowAgentOrToolLog, }: AgentResultPanelProps) => any;
export default AgentResultPanel;
