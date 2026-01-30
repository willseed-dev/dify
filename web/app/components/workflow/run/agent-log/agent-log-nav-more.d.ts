import type { AgentLogItemWithChildren } from '@/types/workflow';
type AgentLogNavMoreProps = {
    options: AgentLogItemWithChildren[];
    onShowAgentOrToolLog: (detail?: AgentLogItemWithChildren) => void;
};
declare const AgentLogNavMore: ({ options, onShowAgentOrToolLog, }: AgentLogNavMoreProps) => any;
export default AgentLogNavMore;
