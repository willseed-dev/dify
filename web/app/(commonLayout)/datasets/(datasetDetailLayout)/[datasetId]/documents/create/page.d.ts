export type IProps = {
    params: Promise<{
        datasetId: string;
    }>;
};
declare const Create: (props: IProps) => Promise<any>;
export default Create;
