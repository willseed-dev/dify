import type { SiteInfo } from '@/models/share';
type Props = {
    data?: SiteInfo;
    isShow: boolean;
    onClose: () => void;
};
declare const InfoModal: ({ isShow, onClose, data, }: Props) => any;
export default InfoModal;
