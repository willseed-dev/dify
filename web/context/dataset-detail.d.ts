import type { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import type { IndexingType } from '@/app/components/datasets/create/step-two';
import type { DataSet } from '@/models/datasets';
type DatasetDetailContextValue = {
    indexingTechnique?: IndexingType;
    dataset?: DataSet;
    mutateDatasetRes?: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<DataSet, Error>>;
};
declare const DatasetDetailContext: any;
export declare const useDatasetDetailContext: () => any;
export declare const useDatasetDetailContextWithSelector: <T>(selector: (value: DatasetDetailContextValue) => T) => T;
export default DatasetDetailContext;
