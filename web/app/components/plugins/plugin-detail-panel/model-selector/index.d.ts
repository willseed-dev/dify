import type { FC, ReactNode } from 'react';
import type { TriggerProps } from '@/app/components/header/account-setting/model-provider-page/model-parameter-modal/trigger';
export type ModelParameterModalProps = {
    popupClassName?: string;
    portalToFollowElemContentClassName?: string;
    isAdvancedMode: boolean;
    value: any;
    setModel: (model: any) => void;
    renderTrigger?: (v: TriggerProps) => ReactNode;
    readonly?: boolean;
    isInWorkflow?: boolean;
    isAgentStrategy?: boolean;
    scope?: string;
};
declare const ModelParameterModal: FC<ModelParameterModalProps>;
export default ModelParameterModal;
