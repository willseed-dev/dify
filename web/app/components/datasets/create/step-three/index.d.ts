import type { createDocumentResponse } from '@/models/datasets';
import type { RETRIEVE_METHOD } from '@/types/app';
type StepThreeProps = {
    datasetId?: string;
    datasetName?: string;
    indexingType?: string;
    retrievalMethod?: RETRIEVE_METHOD;
    creationCache?: createDocumentResponse;
};
declare const StepThree: ({ datasetId, datasetName, indexingType, creationCache, retrievalMethod }: StepThreeProps) => any;
export default StepThree;
