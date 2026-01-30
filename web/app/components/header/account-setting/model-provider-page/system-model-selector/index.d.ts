import type { FC } from 'react';
import type { DefaultModelResponse } from '../declarations';
type SystemModelSelectorProps = {
    textGenerationDefaultModel: DefaultModelResponse | undefined;
    embeddingsDefaultModel: DefaultModelResponse | undefined;
    rerankDefaultModel: DefaultModelResponse | undefined;
    speech2textDefaultModel: DefaultModelResponse | undefined;
    ttsDefaultModel: DefaultModelResponse | undefined;
    notConfigured: boolean;
    isLoading?: boolean;
};
declare const SystemModel: FC<SystemModelSelectorProps>;
export default SystemModel;
