import type { FC } from 'react';
import type { DefaultModel, Model, ModelItem } from '../declarations';
import { ModelFeatureEnum } from '../declarations';
type PopupProps = {
    defaultModel?: DefaultModel;
    modelList: Model[];
    onSelect: (provider: string, model: ModelItem) => void;
    scopeFeatures?: ModelFeatureEnum[];
    onHide: () => void;
};
declare const Popup: FC<PopupProps>;
export default Popup;
