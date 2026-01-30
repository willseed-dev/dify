import type { FC } from 'react';
import type { SimpleSubscription } from '@/app/components/plugins/plugin-detail-panel/subscription-list';
type TriggerSubscriptionProps = {
    subscriptionIdSelected?: string;
    onSubscriptionChange: (v: SimpleSubscription, callback?: () => void) => void;
    children: React.ReactNode;
};
export declare const TriggerSubscription: FC<TriggerSubscriptionProps>;
export {};
