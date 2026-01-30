export type IDocumentDetailProps = {
    params: Promise<{
        datasetId: string;
        documentId: string;
    }>;
};
declare const DocumentDetail: (props: IDocumentDetailProps) => Promise<any>;
export default DocumentDetail;
