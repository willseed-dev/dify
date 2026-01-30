import type { Dispatch, SetStateAction } from 'react';
import type { CustomConfigurationModelFixedFields, CustomModelCredential, ModelCredential, ModelLoadBalancingConfig, ModelProvider } from '../declarations';
import { ConfigurationMethodEnum } from '../declarations';
export type ModelLoadBalancingConfigsProps = {
    draftConfig?: ModelLoadBalancingConfig;
    setDraftConfig: Dispatch<SetStateAction<ModelLoadBalancingConfig | undefined>>;
    provider: ModelProvider;
    configurationMethod: ConfigurationMethodEnum;
    currentCustomConfigurationModelFixedFields?: CustomConfigurationModelFixedFields;
    withSwitch?: boolean;
    className?: string;
    modelCredential: ModelCredential;
    onUpdate?: (payload?: any, formValues?: Record<string, any>) => void;
    onRemove?: (credentialId: string) => void;
    model: CustomModelCredential;
};
declare const ModelLoadBalancingConfigs: ({ draftConfig, setDraftConfig, provider, model, configurationMethod, currentCustomConfigurationModelFixedFields: _currentCustomConfigurationModelFixedFields, withSwitch, className, modelCredential, onUpdate, onRemove, }: ModelLoadBalancingConfigsProps) => any;
export default ModelLoadBalancingConfigs;
