import type { FC } from 'react';
type IRegenerationModalProps = {
    isShow: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    onClose: () => void;
};
declare const RegenerationModal: FC<IRegenerationModalProps>;
export default RegenerationModal;
