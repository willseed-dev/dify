import type { PluginDetail } from '../types';
type Props = {
    detail: PluginDetail;
    isReadmeView?: boolean;
    onHide?: () => void;
    onUpdate?: (isDelete?: boolean) => void;
};
declare const DetailHeader: ({ detail, isReadmeView, onHide, onUpdate, }: Props) => any;
export default DetailHeader;
