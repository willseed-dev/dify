import type { App } from '@/types/app';
type SwitchAppModalProps = {
    show: boolean;
    appDetail: App;
    onSuccess?: () => void;
    onClose: () => void;
    inAppDetail?: boolean;
};
declare const SwitchAppModal: ({ show, appDetail, inAppDetail, onSuccess, onClose }: SwitchAppModalProps) => any;
export default SwitchAppModal;
