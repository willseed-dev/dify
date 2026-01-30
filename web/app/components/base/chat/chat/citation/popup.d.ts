import type { FC } from 'react';
import type { Resources } from './index';
type PopupProps = {
    data: Resources;
    showHitInfo?: boolean;
};
declare const Popup: FC<PopupProps>;
export default Popup;
