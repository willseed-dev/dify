import type { PluginDetail } from '@/app/components/plugins/types';
import type { TriggerSubscription } from '@/app/components/workflow/block-selector/types';
type Props = {
    data: TriggerSubscription;
    pluginDetail?: PluginDetail;
};
declare const SubscriptionCard: ({ data, pluginDetail }: Props) => any;
export default SubscriptionCard;
