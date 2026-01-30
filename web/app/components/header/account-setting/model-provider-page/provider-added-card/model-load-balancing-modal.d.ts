import type { Credential, CustomConfigurationModelFixedFields, ModelItem, ModelProvider } from '../declarations';
import { ConfigurationMethodEnum } from '../declarations';
export type ModelLoadBalancingModalProps = {
    provider: ModelProvider;
    configurateMethod: ConfigurationMethodEnum;
    currentCustomConfigurationModelFixedFields?: CustomConfigurationModelFixedFields;
    model: ModelItem;
    credential?: Credential;
    open?: boolean;
    onClose?: () => void;
    onSave?: (provider: string) => void;
};
declare const _default: any;
export default _default;
