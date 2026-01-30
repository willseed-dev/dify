import type { CreateApiKeyResponse } from '@/models/app';
type ISecretKeyGenerateModalProps = {
    isShow: boolean;
    onClose: () => void;
    newKey?: CreateApiKeyResponse;
    className?: string;
};
declare const SecretKeyGenerateModal: ({ isShow, onClose, newKey, className, }: ISecretKeyGenerateModalProps) => any;
export default SecretKeyGenerateModal;
