import type { FC } from 'react';
import type { AgentIteration } from '@/models/log';
type TracingPanelProps = {
    list: AgentIteration[];
};
declare const TracingPanel: FC<TracingPanelProps>;
export default TracingPanel;
