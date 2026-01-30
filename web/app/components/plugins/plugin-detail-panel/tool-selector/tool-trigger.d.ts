import type { ToolWithProvider } from '@/app/components/workflow/types';
type Props = {
    open: boolean;
    provider?: ToolWithProvider;
    value?: {
        provider_name: string;
        tool_name: string;
    };
    isConfigure?: boolean;
};
declare const ToolTrigger: ({ open, provider, value, isConfigure, }: Props) => any;
export default ToolTrigger;
