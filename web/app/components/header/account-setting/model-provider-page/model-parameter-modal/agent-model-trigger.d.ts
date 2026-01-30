import type { FC } from 'react';
import type { ModelItem, ModelProvider } from '../declarations';
export type AgentModelTriggerProps = {
    open?: boolean;
    disabled?: boolean;
    currentProvider?: ModelProvider;
    currentModel?: ModelItem;
    providerName?: string;
    modelId?: string;
    hasDeprecated?: boolean;
    scope?: string;
};
declare const AgentModelTrigger: FC<AgentModelTriggerProps>;
export default AgentModelTrigger;
