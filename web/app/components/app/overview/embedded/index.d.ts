import type { SiteInfo } from '@/models/share';
type Props = {
    siteInfo?: SiteInfo;
    isShow: boolean;
    onClose: () => void;
    accessToken: string;
    appBaseUrl: string;
    className?: string;
};
declare const Embedded: ({ siteInfo, isShow, onClose, appBaseUrl, accessToken, className }: Props) => any;
export default Embedded;
