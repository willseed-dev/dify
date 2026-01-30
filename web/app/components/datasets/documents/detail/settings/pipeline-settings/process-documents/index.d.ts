type ProcessDocumentsProps = {
    datasourceNodeId: string;
    lastRunInputData: Record<string, any>;
    isRunning: boolean;
    ref: React.RefObject<any>;
    onProcess: () => void;
    onPreview: () => void;
    onSubmit: (data: Record<string, any>) => void;
};
declare const ProcessDocuments: ({ datasourceNodeId, lastRunInputData, isRunning, onProcess, onPreview, onSubmit, ref, }: ProcessDocumentsProps) => any;
export default ProcessDocuments;
