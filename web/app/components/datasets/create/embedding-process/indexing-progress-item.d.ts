import type { FC } from 'react';
import type { IndexingStatusResponse } from '@/models/datasets';
import { DataSourceType } from '@/models/datasets';
type IndexingProgressItemProps = {
    detail: IndexingStatusResponse;
    name?: string;
    sourceType?: DataSourceType;
    notionIcon?: string;
    enableBilling?: boolean;
};
declare const IndexingProgressItem: FC<IndexingProgressItemProps>;
export default IndexingProgressItem;
