import type { FC } from 'react';
import type { NodeTracing } from '@/types/workflow';
type TracingPanelProps = {
    list: NodeTracing[];
    className?: string;
    hideNodeInfo?: boolean;
    hideNodeProcessDetail?: boolean;
};
declare const TracingPanel: FC<TracingPanelProps>;
export default TracingPanel;
