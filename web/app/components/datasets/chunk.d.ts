import type { FC, PropsWithChildren } from 'react';
import type { QA } from '@/models/datasets';
export type ChunkLabelProps = {
    label: string;
    characterCount: number;
};
export declare const ChunkLabel: FC<ChunkLabelProps>;
export type ChunkContainerProps = ChunkLabelProps & PropsWithChildren;
export declare const ChunkContainer: FC<ChunkContainerProps>;
export type QAPreviewProps = {
    qa: QA;
};
export declare const QAPreview: FC<QAPreviewProps>;
