import type { ToolWithProvider } from '@/app/components/workflow/types';
import type { AppIconType } from '@/types/app';
export type DuplicateAppModalProps = {
    data?: ToolWithProvider;
    show: boolean;
    onConfirm: (info: {
        name: string;
        server_url: string;
        icon_type: AppIconType;
        icon: string;
        icon_background?: string | null;
        server_identifier: string;
        headers?: Record<string, string>;
        is_dynamic_registration?: boolean;
        authentication?: {
            client_id?: string;
            client_secret?: string;
            grant_type?: string;
        };
        configuration: {
            timeout: number;
            sse_read_timeout: number;
        };
    }) => void;
    onHide: () => void;
};
declare const MCPModal: ({ data, show, onConfirm, onHide, }: DuplicateAppModalProps) => any;
export default MCPModal;
