import type { ChildChunkDetail, SegmentDetailModel } from '@/models/datasets';
import * as React from 'react';
type ISegmentListProps = {
    isLoading: boolean;
    items: SegmentDetailModel[];
    selectedSegmentIds: string[];
    onSelected: (segId: string) => void;
    onClick: (detail: SegmentDetailModel, isEditMode?: boolean) => void;
    onChangeSwitch: (enabled: boolean, segId?: string) => Promise<void>;
    onDelete: (segId: string) => Promise<void>;
    onDeleteChildChunk: (sgId: string, childChunkId: string) => Promise<void>;
    handleAddNewChildChunk: (parentChunkId: string) => void;
    onClickSlice: (childChunk: ChildChunkDetail) => void;
    archived?: boolean;
    embeddingAvailable: boolean;
    onClearFilter: () => void;
};
declare const SegmentList: {
    ({ ref, isLoading, items, selectedSegmentIds, onSelected, onClick: onClickCard, onChangeSwitch, onDelete, onDeleteChildChunk, handleAddNewChildChunk, onClickSlice, archived, embeddingAvailable, onClearFilter, }: ISegmentListProps & {
        ref: React.LegacyRef<HTMLDivElement>;
    }): any;
    displayName: string;
};
export default SegmentList;
