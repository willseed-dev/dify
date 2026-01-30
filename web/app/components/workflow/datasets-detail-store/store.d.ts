import type { DataSet } from '@/models/datasets';
type DatasetsDetailStore = {
    datasetsDetail: Record<string, DataSet>;
    updateDatasetsDetail: (datasetsDetail: DataSet[]) => void;
};
export declare const createDatasetsDetailStore: () => any;
export declare const useDatasetsDetailStore: <T>(selector: (state: DatasetsDetailStore) => T) => T;
export {};
