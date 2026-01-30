import type { FC } from 'react';
type OutputPanelProps = {
    isRunning?: boolean;
    outputs?: any;
    error?: string;
    height?: number;
};
declare const OutputPanel: FC<OutputPanelProps>;
export default OutputPanel;
