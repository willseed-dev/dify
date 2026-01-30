import type { FC } from 'react';
type ResultPanelProps = {
    status: string;
    elapsed_time?: number;
    total_tokens?: number;
    error?: string;
    inputs?: any;
    outputs?: any;
    created_by?: string;
    created_at: string;
    agentMode?: string;
    tools?: string[];
    iterations?: number;
};
declare const ResultPanel: FC<ResultPanelProps>;
export default ResultPanel;
