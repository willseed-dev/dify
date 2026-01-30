import type { FC, ReactNode } from 'react';
import type { FormValue } from '../declarations';
import type { TriggerProps } from './trigger';
export type ModelParameterModalProps = {
    popupClassName?: string;
    portalToFollowElemContentClassName?: string;
    isAdvancedMode: boolean;
    modelId: string;
    provider: string;
    setModel: (model: {
        modelId: string;
        provider: string;
        mode?: string;
        features?: string[];
    }) => void;
    completionParams: FormValue;
    onCompletionParamsChange: (newParams: FormValue) => void;
    hideDebugWithMultipleModel?: boolean;
    debugWithMultipleModel?: boolean;
    onDebugWithMultipleModelChange?: () => void;
    renderTrigger?: (v: TriggerProps) => ReactNode;
    readonly?: boolean;
    isInWorkflow?: boolean;
    scope?: string;
};
declare const ModelParameterModal: FC<ModelParameterModalProps>;
export default ModelParameterModal;
