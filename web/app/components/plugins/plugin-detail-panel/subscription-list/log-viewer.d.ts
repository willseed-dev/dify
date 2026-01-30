import type { TriggerLogEntity } from '@/app/components/workflow/block-selector/types';
type Props = {
    logs: TriggerLogEntity[];
    className?: string;
};
declare const LogViewer: ({ logs, className }: Props) => any;
export default LogViewer;
