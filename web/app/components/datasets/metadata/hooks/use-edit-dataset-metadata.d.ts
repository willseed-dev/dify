import type { DataSet } from '@/models/datasets';
declare const useEditDatasetMetadata: ({ datasetId, onUpdateDocList, }: {
    datasetId: string;
    dataset?: DataSet;
    onUpdateDocList: () => void;
}) => {
    isShowEditModal: any;
    showEditModal: any;
    hideEditModal: any;
    datasetMetaData: any;
    handleAddMetaData: any;
    handleRename: any;
    handleDeleteMetaData: any;
    builtInMetaData: any;
    builtInEnabled: any;
    setBuiltInEnabled: (enable: boolean) => Promise<void>;
};
export default useEditDatasetMetadata;
