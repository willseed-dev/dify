import type { MetadataItemInBatchEdit } from '../types';
import type { SimpleDocumentDetail } from '@/models/datasets';
type Props = {
    datasetId: string;
    docList: SimpleDocumentDetail[];
    selectedDocumentIds?: string[];
    onUpdate: () => void;
};
declare const useBatchEditDocumentMetadata: ({ datasetId, docList, selectedDocumentIds, onUpdate, }: Props) => {
    isShowEditModal: any;
    showEditModal: any;
    hideEditModal: any;
    originalList: MetadataItemInBatchEdit[];
    handleSave: (editedList: MetadataItemInBatchEdit[], addedList: MetadataItemInBatchEdit[], isApplyToAllSelectDocument: boolean) => Promise<void>;
};
export default useBatchEditDocumentMetadata;
