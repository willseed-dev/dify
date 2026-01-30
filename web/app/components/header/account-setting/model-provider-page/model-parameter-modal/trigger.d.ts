import type { FC } from 'react';
import type { Model, ModelItem, ModelProvider } from '../declarations';
export type TriggerProps = {
    open?: boolean;
    disabled?: boolean;
    currentProvider?: ModelProvider | Model;
    currentModel?: ModelItem;
    providerName?: string;
    modelId?: string;
    hasDeprecated?: boolean;
    modelDisabled?: boolean;
    isInWorkflow?: boolean;
};
declare const Trigger: FC<TriggerProps>;
export default Trigger;
