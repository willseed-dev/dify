import type { FC } from 'react';
import type { FullDocumentDetail } from '@/models/datasets';
import type { RETRIEVE_METHOD } from '@/types/app';
type EmbeddingProcessProps = {
    datasetId: string;
    batchId: string;
    documents?: FullDocumentDetail[];
    indexingType?: string;
    retrievalMethod?: RETRIEVE_METHOD;
};
declare const EmbeddingProcess: FC<EmbeddingProcessProps>;
export default EmbeddingProcess;
