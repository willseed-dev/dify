import type { FC } from 'react';
import type { WorkflowLogsResponse } from '@/models/log';
import type { App } from '@/types/app';
type ILogs = {
    logs?: WorkflowLogsResponse;
    appDetail?: App;
    onRefresh: () => void;
};
declare const WorkflowAppLogList: FC<ILogs>;
export default WorkflowAppLogList;
