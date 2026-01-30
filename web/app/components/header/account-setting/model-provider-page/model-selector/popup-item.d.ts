import type { FC } from 'react';
import type { DefaultModel, Model, ModelItem } from '../declarations';
type PopupItemProps = {
    defaultModel?: DefaultModel;
    model: Model;
    onSelect: (provider: string, model: ModelItem) => void;
};
declare const PopupItem: FC<PopupItemProps>;
export default PopupItem;
