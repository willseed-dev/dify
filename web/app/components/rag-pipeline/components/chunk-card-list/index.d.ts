import type { ChunkInfo } from './types';
import type { ParentMode } from '@/models/datasets';
import { ChunkingMode } from '@/models/datasets';
type ChunkCardListProps = {
    chunkType: ChunkingMode;
    parentMode?: ParentMode;
    chunkInfo: ChunkInfo;
    className?: string;
};
export declare const ChunkCardList: (props: ChunkCardListProps) => any;
export {};
