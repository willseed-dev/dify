type ISecretKeyModalProps = {
    isShow: boolean;
    appId?: string;
    onClose: () => void;
};
declare const SecretKeyModal: ({ isShow, appId, onClose, }: ISecretKeyModalProps) => any;
export default SecretKeyModal;
