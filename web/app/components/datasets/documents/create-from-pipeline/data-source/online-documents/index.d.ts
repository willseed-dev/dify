import type { DataSourceNodeType } from '@/app/components/workflow/nodes/data-source/types';
type OnlineDocumentsProps = {
    nodeId: string;
    nodeData: DataSourceNodeType;
    onCredentialChange: (credentialId: string) => void;
    isInPipeline?: boolean;
    supportBatchUpload?: boolean;
};
declare const OnlineDocuments: ({ nodeId, nodeData, isInPipeline, supportBatchUpload, onCredentialChange, }: OnlineDocumentsProps) => any;
export default OnlineDocuments;
