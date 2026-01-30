import type { ConfigurationMethodEnum, CustomConfigurationModelFixedFields, ModelModalModeEnum, ModelProvider } from '../../declarations';
export declare const useAuth: (provider: ModelProvider, configurationMethod: ConfigurationMethodEnum, currentCustomConfigurationModelFixedFields?: CustomConfigurationModelFixedFields, extra?: {
    isModelCredential?: boolean;
    onUpdate?: (newPayload?: any, formValues?: Record<string, any>) => void;
    onRemove?: (credentialId: string) => void;
    mode?: ModelModalModeEnum;
}) => {
    pendingOperationCredentialId: any;
    pendingOperationModel: any;
    openConfirmDelete: any;
    closeConfirmDelete: any;
    doingAction: any;
    handleActiveCredential: any;
    handleConfirmDelete: any;
    deleteCredentialId: any;
    deleteModel: any;
    handleSaveCredential: any;
    handleOpenModal: any;
};
