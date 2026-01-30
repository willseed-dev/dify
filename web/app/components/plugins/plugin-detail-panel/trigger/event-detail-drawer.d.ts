import type { FC } from 'react';
import type { TriggerEvent } from '@/app/components/plugins/types';
import type { TriggerProviderApiEntity } from '@/app/components/workflow/block-selector/types';
type EventDetailDrawerProps = {
    eventInfo: TriggerEvent;
    providerInfo: TriggerProviderApiEntity;
    onClose: () => void;
};
export declare const EventDetailDrawer: FC<EventDetailDrawerProps>;
export {};
