import type { TriggerSubscriptionBuilder } from '@/app/components/workflow/block-selector/types';
import { SupportedCreationMethods } from '@/app/components/plugins/types';
type Props = {
    onClose: () => void;
    createType: SupportedCreationMethods;
    builder?: TriggerSubscriptionBuilder;
};
export declare const CommonCreateModal: ({ onClose, createType, builder }: Props) => any;
export {};
