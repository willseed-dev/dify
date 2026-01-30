import type { FC } from 'react';
import type { ChunkingMode, ParentMode } from '@/models/datasets';
type DocumentTitleProps = {
    datasetId: string;
    extension?: string;
    name?: string;
    chunkingMode?: ChunkingMode;
    parent_mode?: ParentMode;
    iconCls?: string;
    textCls?: string;
    wrapperCls?: string;
};
export declare const DocumentTitle: FC<DocumentTitleProps>;
export {};
