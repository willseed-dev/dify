import type { EnvironmentVariable } from '@/app/components/workflow/types';
export type DSLExportConfirmModalProps = {
    envList: EnvironmentVariable[];
    onConfirm: (state: boolean) => void;
    onClose: () => void;
};
declare const DSLExportConfirmModal: ({ envList, onConfirm, onClose, }: DSLExportConfirmModalProps) => any;
export default DSLExportConfirmModal;
