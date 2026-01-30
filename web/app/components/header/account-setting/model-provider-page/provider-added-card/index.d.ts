import type { FC } from 'react';
import type { ModelProvider } from '../declarations';
export declare const UPDATE_MODEL_PROVIDER_CUSTOM_MODEL_LIST = "UPDATE_MODEL_PROVIDER_CUSTOM_MODEL_LIST";
type ProviderAddedCardProps = {
    notConfigured?: boolean;
    provider: ModelProvider;
};
declare const ProviderAddedCard: FC<ProviderAddedCardProps>;
export default ProviderAddedCard;
