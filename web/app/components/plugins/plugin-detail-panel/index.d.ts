import type { FC } from 'react';
import type { PluginDetail } from '@/app/components/plugins/types';
type Props = {
    detail?: PluginDetail;
    onUpdate: () => void;
    onHide: () => void;
};
declare const PluginDetailPanel: FC<Props>;
export default PluginDetailPanel;
