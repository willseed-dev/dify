import type { FC } from 'react';
import type { ApiBasedExtension } from '@/models/common';
export type ApiBasedExtensionData = {
    name?: string;
    apiEndpoint?: string;
    apiKey?: string;
};
type ApiBasedExtensionModalProps = {
    data: ApiBasedExtension;
    onCancel: () => void;
    onSave?: (newData: ApiBasedExtension) => void;
};
declare const ApiBasedExtensionModal: FC<ApiBasedExtensionModalProps>;
export default ApiBasedExtensionModal;
