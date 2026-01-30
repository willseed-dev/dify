import type { FC } from 'react';
import type { ModelItem, ModelProvider } from '../declarations';
type ModelListProps = {
    provider: ModelProvider;
    models: ModelItem[];
    onCollapse: () => void;
    onChange?: (provider: string) => void;
};
declare const ModelList: FC<ModelListProps>;
export default ModelList;
