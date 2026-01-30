export type IProps = {
    params: Promise<{
        datasetId: string;
        documentId: string;
    }>;
};
declare const DocumentSettings: (props: IProps) => Promise<any>;
export default DocumentSettings;
