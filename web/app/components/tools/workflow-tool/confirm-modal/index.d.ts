type ConfirmModalProps = {
    show: boolean;
    onConfirm?: () => void;
    onClose: () => void;
};
declare const ConfirmModal: ({ show, onConfirm, onClose }: ConfirmModalProps) => any;
export default ConfirmModal;
