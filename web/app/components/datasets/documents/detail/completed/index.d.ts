import type { FC } from 'react';
import type { ChildChunkDetail, SegmentDetailModel } from '@/models/datasets';
import { ProcessStatus } from '../segment-add';
type CurrSegmentType = {
    segInfo?: SegmentDetailModel;
    showModal: boolean;
    isEditMode?: boolean;
};
type CurrChildChunkType = {
    childChunkInfo?: ChildChunkDetail;
    showModal: boolean;
};
export type SegmentListContextValue = {
    isCollapsed: boolean;
    fullScreen: boolean;
    toggleFullScreen: (fullscreen?: boolean) => void;
    currSegment: CurrSegmentType;
    currChildChunk: CurrChildChunkType;
};
export declare const useSegmentListContext: (selector: (value: SegmentListContextValue) => any) => any;
type ICompletedProps = {
    embeddingAvailable: boolean;
    showNewSegmentModal: boolean;
    onNewSegmentModalChange: (state: boolean) => void;
    importStatus: ProcessStatus | string | undefined;
    archived?: boolean;
};
/**
 * Embedding done, show list of all segments
 * Support search and filter
 */
declare const Completed: FC<ICompletedProps>;
export default Completed;
