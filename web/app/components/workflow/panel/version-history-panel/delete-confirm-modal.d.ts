import type { FC } from 'react';
import type { VersionHistory } from '@/types/workflow';
type DeleteConfirmModalProps = {
    isOpen: boolean;
    versionInfo: VersionHistory;
    onClose: () => void;
    onDelete: (id: string) => void;
};
declare const DeleteConfirmModal: FC<DeleteConfirmModalProps>;
export default DeleteConfirmModal;
