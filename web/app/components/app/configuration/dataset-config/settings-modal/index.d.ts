import type { FC } from 'react';
import type { DataSet } from '@/models/datasets';
type SettingsModalProps = {
    currentDataset: DataSet;
    onCancel: () => void;
    onSave: (newDataset: DataSet) => void;
};
declare const SettingsModal: FC<SettingsModalProps>;
export default SettingsModal;
