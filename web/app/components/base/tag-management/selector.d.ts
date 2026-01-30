import type { FC } from 'react';
import type { Tag } from '@/app/components/base/tag-management/constant';
export type TagSelectorProps = {
    targetID: string;
    isPopover?: boolean;
    position?: 'bl' | 'br';
    type: 'knowledge' | 'app';
    value: string[];
    selectedTags: Tag[];
    onCacheUpdate: (tags: Tag[]) => void;
    onChange?: () => void;
    minWidth?: string;
};
declare const TagSelector: FC<TagSelectorProps>;
export default TagSelector;
