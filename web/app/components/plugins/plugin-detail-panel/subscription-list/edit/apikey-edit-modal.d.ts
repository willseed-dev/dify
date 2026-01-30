import type { PluginDetail } from '@/app/components/plugins/types';
import type { TriggerSubscription } from '@/app/components/workflow/block-selector/types';
type Props = {
    onClose: () => void;
    subscription: TriggerSubscription;
    pluginDetail?: PluginDetail;
};
export declare const ApiKeyEditModal: ({ onClose, subscription, pluginDetail }: Props) => any;
export {};
