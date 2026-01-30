import type { FC } from 'react';
import type { App } from '@/types/app';
export type ILogsProps = {
    appDetail: App;
};
export type QueryParam = {
    period: string;
    annotation_status?: string;
    keyword?: string;
    sort_by?: string;
};
declare const Logs: FC<ILogsProps>;
export default Logs;
