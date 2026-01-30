import type { IndexingType } from '@/app/components/datasets/create/step-two';
import type { InitialDocumentDetail } from '@/models/pipeline';
import type { RETRIEVE_METHOD } from '@/types/app';
type EmbeddingProcessProps = {
    datasetId: string;
    batchId: string;
    documents?: InitialDocumentDetail[];
    indexingType?: IndexingType;
    retrievalMethod?: RETRIEVE_METHOD;
};
declare const EmbeddingProcess: ({ datasetId, batchId, documents, indexingType, retrievalMethod, }: EmbeddingProcessProps) => any;
export default EmbeddingProcess;
