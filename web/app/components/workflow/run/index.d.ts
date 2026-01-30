import type { FC } from 'react';
import type { WorkflowRunDetailResponse } from '@/models/log';
export type RunProps = {
    hideResult?: boolean;
    activeTab?: 'RESULT' | 'DETAIL' | 'TRACING';
    getResultCallback?: (result: WorkflowRunDetailResponse) => void;
    runDetailUrl: string;
    tracingListUrl: string;
};
declare const RunPanel: FC<RunProps>;
export default RunPanel;
