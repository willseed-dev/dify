import type { FC } from 'react';
import type { Model, ModelItem } from '../declarations';
type ModelTriggerProps = {
    open: boolean;
    provider: Model;
    model: ModelItem;
    className?: string;
    readonly?: boolean;
};
declare const ModelTrigger: FC<ModelTriggerProps>;
export default ModelTrigger;
