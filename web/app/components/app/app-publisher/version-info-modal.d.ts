import type { FC } from 'react';
import type { VersionHistory } from '@/types/workflow';
type VersionInfoModalProps = {
    isOpen: boolean;
    versionInfo?: VersionHistory;
    onClose: () => void;
    onPublish: (params: {
        title: string;
        releaseNotes: string;
        id?: string;
    }) => void;
};
declare const VersionInfoModal: FC<VersionInfoModalProps>;
export default VersionInfoModal;
