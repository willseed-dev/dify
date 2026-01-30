import type { FC } from 'react';
import type { ExternalDataTool } from '@/models/common';
type ExternalDataToolModalProps = {
    data: ExternalDataTool;
    onCancel: () => void;
    onSave: (externalDataTool: ExternalDataTool) => void;
    onValidateBeforeSave?: (externalDataTool: ExternalDataTool) => boolean;
};
declare const ExternalDataToolModal: FC<ExternalDataToolModalProps>;
export default ExternalDataToolModal;
