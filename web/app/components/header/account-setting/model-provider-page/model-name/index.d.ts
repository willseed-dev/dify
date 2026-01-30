import type { FC, PropsWithChildren } from 'react';
import type { ModelItem } from '../declarations';
type ModelNameProps = PropsWithChildren<{
    modelItem: ModelItem;
    className?: string;
    showModelType?: boolean;
    modelTypeClassName?: string;
    showMode?: boolean;
    modeClassName?: string;
    showFeatures?: boolean;
    showFeaturesLabel?: boolean;
    featuresClassName?: string;
    showContextSize?: boolean;
}>;
declare const ModelName: FC<ModelNameProps>;
export default ModelName;
