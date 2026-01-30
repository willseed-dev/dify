import type { MCPServerDetail } from '@/app/components/tools/types';
export type ModalProps = {
    appID: string;
    latestParams?: any[];
    data?: MCPServerDetail;
    show: boolean;
    onHide: () => void;
    appInfo?: any;
};
declare const MCPServerModal: ({ appID, latestParams, data, show, onHide, appInfo, }: ModalProps) => any;
export default MCPServerModal;
