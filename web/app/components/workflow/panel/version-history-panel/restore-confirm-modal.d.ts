import type { FC } from 'react';
import type { VersionHistory } from '@/types/workflow';
type RestoreConfirmModalProps = {
    isOpen: boolean;
    versionInfo: VersionHistory;
    onClose: () => void;
    onRestore: (item: VersionHistory) => void;
};
declare const RestoreConfirmModal: FC<RestoreConfirmModalProps>;
export default RestoreConfirmModal;
