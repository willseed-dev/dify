import type { FC } from 'react';
import type { ChildChunkDetail } from '@/models/datasets';
type IChildSegmentCardProps = {
    childChunks: ChildChunkDetail[];
    parentChunkId: string;
    handleInputChange?: (value: string) => void;
    handleAddNewChildChunk?: (parentChunkId: string) => void;
    enabled: boolean;
    onDelete?: (segId: string, childChunkId: string) => Promise<void>;
    onClickSlice?: (childChunk: ChildChunkDetail) => void;
    total?: number;
    inputValue?: string;
    onClearFilter?: () => void;
    isLoading?: boolean;
    focused?: boolean;
};
declare const ChildSegmentList: FC<IChildSegmentCardProps>;
export default ChildSegmentList;
