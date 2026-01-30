import type { FC } from 'react';
import type { Props as PaginationProps } from '@/app/components/base/pagination';
import type { SimpleDocumentDetail } from '@/models/datasets';
export declare const renderTdValue: (value: string | number | null, isEmptyStyle?: boolean) => any;
type LocalDoc = SimpleDocumentDetail & {
    percent?: number;
};
type IDocumentListProps = {
    embeddingAvailable: boolean;
    documents: LocalDoc[];
    selectedIds: string[];
    onSelectedIdChange: (selectedIds: string[]) => void;
    datasetId: string;
    pagination: PaginationProps;
    onUpdate: () => void;
    onManageMetadata: () => void;
    statusFilterValue: string;
    remoteSortValue: string;
};
/**
 * Document list component including basic information
 */
declare const DocumentList: FC<IDocumentListProps>;
export default DocumentList;
