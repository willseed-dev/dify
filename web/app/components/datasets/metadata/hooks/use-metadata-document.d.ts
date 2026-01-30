import type { FullDocumentDetail } from '@/models/datasets';
import { DataType } from '../types';
type Props = {
    datasetId: string;
    documentId: string;
    docDetail: FullDocumentDetail;
};
declare const useMetadataDocument: ({ datasetId, documentId, docDetail, }: Props) => {
    embeddingAvailable: boolean;
    isEdit: any;
    setIsEdit: any;
    list: any;
    tempList: any;
    setTempList: any;
    handleSelectMetaData: any;
    handleAddMetaData: any;
    hasData: boolean;
    builtList: any;
    builtInEnabled: any;
    startToEdit: () => void;
    handleSave: () => Promise<void>;
    handleCancel: () => void;
    originInfo: {
        id: any;
        type: DataType;
        name: any;
        value: any;
    }[];
    technicalParameters: {
        id: any;
        type: DataType;
        name: any;
        value: any;
    }[];
};
export default useMetadataDocument;
