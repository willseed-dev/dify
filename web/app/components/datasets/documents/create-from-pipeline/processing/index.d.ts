import type { InitialDocumentDetail } from '@/models/pipeline';
type ProcessingProps = {
    batchId: string;
    documents: InitialDocumentDetail[];
};
declare const Processing: ({ batchId, documents, }: ProcessingProps) => any;
export default Processing;
