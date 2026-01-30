import type { EndpointListItem, PluginDetail } from '../types';
type Props = {
    pluginDetail: PluginDetail;
    data: EndpointListItem;
    handleChange: () => void;
};
declare const EndpointCard: ({ pluginDetail, data, handleChange, }: Props) => any;
export default EndpointCard;
