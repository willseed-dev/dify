import { DatasetPermission } from '@/models/datasets';
type DatasetConfig = {
    createdBy: string;
    partialMemberList: string[];
    permission: DatasetPermission;
};
export declare const hasEditPermissionForDataset: (userId: string, datasetConfig: DatasetConfig) => boolean;
export {};
