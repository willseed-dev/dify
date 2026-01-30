import type { DataSourceNodeType } from '@/app/components/workflow/nodes/data-source/types';
export type WebsiteCrawlProps = {
    nodeId: string;
    nodeData: DataSourceNodeType;
    onCredentialChange: (credentialId: string) => void;
    isInPipeline?: boolean;
    supportBatchUpload?: boolean;
};
declare const _default: any;
export default _default;
