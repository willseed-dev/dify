import type { FC } from 'react';
import type { Model, ModelProvider } from '../declarations';
type ModelIconProps = {
    provider?: Model | ModelProvider;
    modelName?: string;
    className?: string;
    iconClassName?: string;
    isDeprecated?: boolean;
};
declare const ModelIcon: FC<ModelIconProps>;
export default ModelIcon;
