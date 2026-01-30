import type { TriggerOAuthConfig, TriggerSubscriptionBuilder } from '@/app/components/workflow/block-selector/types';
type Props = {
    oauthConfig?: TriggerOAuthConfig;
    onClose: () => void;
    showOAuthCreateModal: (builder: TriggerSubscriptionBuilder) => void;
};
export declare const OAuthClientSettingsModal: ({ oauthConfig, onClose, showOAuthCreateModal }: Props) => any;
export {};
