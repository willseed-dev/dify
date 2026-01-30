import type { ModelItem, ModelProvider } from '../declarations';
export type ModelListItemProps = {
    model: ModelItem;
    provider: ModelProvider;
    isConfigurable: boolean;
    onChange?: (provider: string) => void;
    onModifyLoadBalancing?: (model: ModelItem) => void;
};
declare const _default: any;
export default _default;
