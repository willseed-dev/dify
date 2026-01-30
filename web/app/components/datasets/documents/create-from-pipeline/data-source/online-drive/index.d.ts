import type { DataSourceNodeType } from '@/app/components/workflow/nodes/data-source/types';
type OnlineDriveProps = {
    nodeId: string;
    nodeData: DataSourceNodeType;
    onCredentialChange: (credentialId: string) => void;
    isInPipeline?: boolean;
    supportBatchUpload?: boolean;
};
declare const OnlineDrive: ({ nodeId, nodeData, isInPipeline, supportBatchUpload, onCredentialChange, }: OnlineDriveProps) => any;
export default OnlineDrive;
