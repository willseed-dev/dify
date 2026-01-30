import type { FC } from 'react';
type ModelTriggerProps = {
    modelName: string;
    providerName: string;
    className?: string;
    showWarnIcon?: boolean;
    contentClassName?: string;
};
declare const ModelTrigger: FC<ModelTriggerProps>;
export default ModelTrigger;
