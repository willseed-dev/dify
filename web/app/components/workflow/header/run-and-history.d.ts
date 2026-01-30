import type { ViewHistoryProps } from './view-history';
export type RunAndHistoryProps = {
    showRunButton?: boolean;
    runButtonText?: string;
    isRunning?: boolean;
    showPreviewButton?: boolean;
    viewHistoryProps?: ViewHistoryProps;
    components?: {
        RunMode?: React.ComponentType<{
            text?: string;
        }>;
    };
};
declare const _default: any;
export default _default;
