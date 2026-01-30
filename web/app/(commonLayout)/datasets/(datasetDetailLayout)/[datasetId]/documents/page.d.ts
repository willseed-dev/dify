export type IProps = {
    params: Promise<{
        datasetId: string;
    }>;
};
declare const Documents: (props: IProps) => Promise<any>;
export default Documents;
