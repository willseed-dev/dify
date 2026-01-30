import type { FC } from 'react';
type ResultProps = {
    status: string;
    time?: number;
    tokens?: number;
    error?: string;
    exceptionCounts?: number;
    isListening?: boolean;
};
declare const StatusPanel: FC<ResultProps>;
export default StatusPanel;
