import type { FC } from 'react';
import type { AgentLogItemWithChildren, IterationDurationMap, LoopDurationMap, LoopVariableMap, NodeTracing } from '@/types/workflow';
type Props = {
    className?: string;
    nodeInfo: NodeTracing;
    allExecutions?: NodeTracing[];
    inMessage?: boolean;
    hideInfo?: boolean;
    hideProcessDetail?: boolean;
    onShowIterationDetail?: (detail: NodeTracing[][], iterDurationMap: IterationDurationMap) => void;
    onShowLoopDetail?: (detail: NodeTracing[][], loopDurationMap: LoopDurationMap, loopVariableMap: LoopVariableMap) => void;
    onShowRetryDetail?: (detail: NodeTracing[]) => void;
    onShowAgentOrToolLog?: (detail?: AgentLogItemWithChildren) => void;
    notShowIterationNav?: boolean;
    notShowLoopNav?: boolean;
};
declare const NodePanel: FC<Props>;
export default NodePanel;
