import type { Dispatch, SetStateAction } from 'react';
import type { TriggerEventsLimitModalPayload } from './hooks/use-trigger-events-limit-modal';
import type { OpeningStatement } from '@/app/components/base/features/types';
import type { CreateExternalAPIReq } from '@/app/components/datasets/external-api/declarations';
import type { AccountSettingTab } from '@/app/components/header/account-setting/constants';
import type { ConfigurationMethodEnum, Credential, CustomConfigurationModelFixedFields, CustomModel, ModelModalModeEnum, ModelProvider } from '@/app/components/header/account-setting/model-provider-page/declarations';
import type { ModelLoadBalancingModalProps } from '@/app/components/header/account-setting/model-provider-page/provider-added-card/model-load-balancing-modal';
import type { UpdatePluginPayload } from '@/app/components/plugins/types';
import type { InputVar } from '@/app/components/workflow/types';
import type { ExpireNoticeModalPayloadProps } from '@/app/education-apply/expire-notice-modal';
import type { ApiBasedExtension, ExternalDataTool } from '@/models/common';
import type { ModerationConfig, PromptVariable } from '@/models/debug';
export type ModalState<T> = {
    payload: T;
    onCancelCallback?: () => void;
    onSaveCallback?: (newPayload?: T, formValues?: Record<string, any>) => void;
    onRemoveCallback?: (newPayload?: T, formValues?: Record<string, any>) => void;
    onEditCallback?: (newPayload: T) => void;
    onValidateBeforeSaveCallback?: (newPayload: T) => boolean;
    isEditMode?: boolean;
    datasetBindings?: {
        id: string;
        name: string;
    }[];
};
export type ModelModalType = {
    currentProvider: ModelProvider;
    currentConfigurationMethod: ConfigurationMethodEnum;
    currentCustomConfigurationModelFixedFields?: CustomConfigurationModelFixedFields;
    isModelCredential?: boolean;
    credential?: Credential;
    model?: CustomModel;
    mode?: ModelModalModeEnum;
};
export type ModalContextState = {
    setShowAccountSettingModal: Dispatch<SetStateAction<ModalState<AccountSettingTab> | null>>;
    setShowApiBasedExtensionModal: Dispatch<SetStateAction<ModalState<ApiBasedExtension> | null>>;
    setShowModerationSettingModal: Dispatch<SetStateAction<ModalState<ModerationConfig> | null>>;
    setShowExternalDataToolModal: Dispatch<SetStateAction<ModalState<ExternalDataTool> | null>>;
    setShowPricingModal: () => void;
    setShowAnnotationFullModal: () => void;
    setShowModelModal: Dispatch<SetStateAction<ModalState<ModelModalType> | null>>;
    setShowExternalKnowledgeAPIModal: Dispatch<SetStateAction<ModalState<CreateExternalAPIReq> | null>>;
    setShowModelLoadBalancingModal: Dispatch<SetStateAction<ModelLoadBalancingModalProps | null>>;
    setShowOpeningModal: Dispatch<SetStateAction<ModalState<OpeningStatement & {
        promptVariables?: PromptVariable[];
        workflowVariables?: InputVar[];
        onAutoAddPromptVariable?: (variable: PromptVariable[]) => void;
    }> | null>>;
    setShowUpdatePluginModal: Dispatch<SetStateAction<ModalState<UpdatePluginPayload> | null>>;
    setShowEducationExpireNoticeModal: Dispatch<SetStateAction<ModalState<ExpireNoticeModalPayloadProps> | null>>;
    setShowTriggerEventsLimitModal: Dispatch<SetStateAction<ModalState<TriggerEventsLimitModalPayload> | null>>;
};
declare const ModalContext: any;
export declare const useModalContext: () => any;
export declare const useModalContextSelector: <T>(selector: (state: ModalContextState) => T) => T;
type ModalContextProviderProps = {
    children: React.ReactNode;
};
export declare const ModalContextProvider: ({ children, }: ModalContextProviderProps) => any;
export default ModalContext;
