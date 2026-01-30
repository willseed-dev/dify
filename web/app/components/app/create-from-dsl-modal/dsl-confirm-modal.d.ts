type DSLConfirmModalProps = {
    versions?: {
        importedVersion: string;
        systemVersion: string;
    };
    onCancel: () => void;
    onConfirm: () => void;
    confirmDisabled?: boolean;
};
declare const DSLConfirmModal: ({ versions, onCancel, onConfirm, confirmDisabled, }: DSLConfirmModalProps) => any;
export default DSLConfirmModal;
