import type { DataSet } from '@/models/datasets';
export type DatasetsContextValue = {
    datasets: DataSet[];
    mutateDatasets: () => void;
    currentDataset?: DataSet;
};
declare const DatasetsContext: any;
export declare const useDatasetsContext: () => any;
export default DatasetsContext;
