declare const DatasetDetailLayout: (props: {
    children: React.ReactNode;
    params: Promise<{
        datasetId: string;
    }>;
}) => Promise<any>;
export default DatasetDetailLayout;
