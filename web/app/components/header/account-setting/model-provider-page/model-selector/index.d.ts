import type { FC } from 'react';
import type { DefaultModel, Model, ModelFeatureEnum } from '../declarations';
type ModelSelectorProps = {
    defaultModel?: DefaultModel;
    modelList: Model[];
    triggerClassName?: string;
    popupClassName?: string;
    onSelect?: (model: DefaultModel) => void;
    readonly?: boolean;
    scopeFeatures?: ModelFeatureEnum[];
    deprecatedClassName?: string;
    showDeprecatedWarnIcon?: boolean;
};
declare const ModelSelector: FC<ModelSelectorProps>;
export default ModelSelector;
