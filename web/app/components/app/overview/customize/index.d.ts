import type { FC } from 'react';
import { AppModeEnum } from '@/types/app';
type IShareLinkProps = {
    isShow: boolean;
    onClose: () => void;
    api_base_url: string;
    appId: string;
    mode: AppModeEnum;
};
declare const CustomizeModal: FC<IShareLinkProps>;
export default CustomizeModal;
