import type { DataSet } from '@/models/datasets';
type RenameDatasetModalProps = {
    show: boolean;
    dataset: DataSet;
    onSuccess?: () => void;
    onClose: () => void;
};
declare const RenameDatasetModal: ({ show, dataset, onSuccess, onClose }: RenameDatasetModalProps) => any;
export default RenameDatasetModal;
